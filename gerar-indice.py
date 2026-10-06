#!/usr/bin/env python3
"""
Gera o arquivo projetos.js a partir das pastas em projetos/.

Uso:  python3 gerar-indice.py
Rode sempre que adicionar, remover ou editar um projeto.

Cada pasta em projetos/ é um projeto:
    projetos/<nivel>-<nome>/
        info.md        ← dados em português (obrigatório)
        info.en.md     ← dados em inglês (opcional; se faltar, usa o português)
        print-01.jpg   ← imagens; o prefixo define o tipo:
        render-01.jpg     print | render | desenho | foto
        desenho-01.jpg
        foto-01.jpg
        modelo.stl     ← modelo 3D (opcional): .stl exportado do SolidWorks ou .glb;
                          numa montagem, um .stl por peça + articulacoes.json (veja a seção 3D abaixo).
                          Vira modelo.js, que o site carrega para girar/zoom (e abrir/fechar).

Nível e origem ficam só para o seu controle: aparecem no resumo do terminal,
mas não vão para o site (nem no endereço da página, que usa só o <nome>).

Não usa bibliotecas externas: só Python 3.
"""
import base64
import json
import math
import os
import re
import struct
import sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(RAIZ, "projetos")
SAIDA = os.path.join(RAIZ, "projetos.js")
EXT_IMG = (".jpg", ".jpeg", ".png", ".webp", ".gif")
TIPOS = ("render", "print", "desenho", "foto")   # ordem de exibição na galeria
NIVEIS = {"facil": 1, "medio": 2, "dificil": 3}
LISTAS = {"categorias", "materiais"}
BOOLEANOS = {"produzido", "destaque"}
ANGULO_ARESTA = 30   # graus: faces com ângulo maior que isso ficam com aresta viva no 3D


def ler_md(caminho):
    """Lê um .md com cabeçalho '--- chave: valor ---' e seções '## Título'."""
    with open(caminho, encoding="utf-8") as f:
        texto = f.read().replace("\r\n", "\n")
    meta, corpo = {}, texto
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", texto, re.S)
    if m:
        cab, corpo = m.groups()
        for linha in cab.split("\n"):
            linha = linha.split(" #")[0].rstrip()          # permite comentários
            if ":" not in linha or linha.lstrip().startswith("#"):
                continue
            chave, valor = linha.split(":", 1)
            chave, valor = chave.strip().lower(), valor.strip()
            if chave in LISTAS:
                valor = valor.strip("[]")
                valor = [v.strip().strip("\"'") for v in valor.split(",") if v.strip()]
            elif chave in BOOLEANOS:
                valor = valor.lower() in ("sim", "yes", "true", "s")
            else:
                valor = valor.strip("\"'")
            meta[chave] = valor
    secoes = []
    for bloco in re.split(r"^##\s+", corpo, flags=re.M)[1:]:
        titulo, _, conteudo = bloco.partition("\n")
        conteudo = conteudo.strip()
        if conteudo:
            secoes.append({"titulo": titulo.strip(), "texto": conteudo})
    return meta, secoes


def tipo_da_imagem(nome):
    return next((t for t in TIPOS if nome.lower().startswith(t)), "print")


# ---------------------------------------------------------------- 3D
# Um projeto pode ter:
#   • um .glb pronto (usado como está), ou
#   • um ou mais .stl — uma peça por arquivo, já na posição da montagem (mm) — e, opcionalmente,
#     um articulacoes.json dizendo o que se move. Exemplo:
#
#     {
#       "duracao": 1.5,                                   ← segundos (t=0 é a posição exportada)
#       "pecas": {
#         "base":     { "cor": "#aeb4bc" },                ← peça parada (só cor); o nome é o do .stl
#         "alavanca": { "cor": "#c3c8cf",
#                       "giro": { "ponto": [20, 10, 0], "eixo": [0, 0, 1],      ← mm; eixo de rotação
#                                 "de": 0, "ate": -95, "inicio": 0, "fim": 1 } }, ← graus; segundos
#         "gancho":   { "pai": "alavanca",                 ← move junto com a alavanca
#                       "giro": { "ponto": [4, 8, 0], "eixo": [0, 0, 1],
#                                 "chaves": [[0, 0], [0.5, 12], [1.5, 40]] } }, ← [tempo, graus] livres
#         "haste":    { "desliza": { "eixo": [1, 0, 0], "de": 0, "ate": 120 } }  ← mm ao longo do eixo
#       }
#     }
#
# No site, peças com movimento ganham o botão Abrir/Fechar e respondem a um clique.
CORES_PADRAO = ["#b9bfc7", "#a6adb6", "#c8cdd3", "#9aa1aa"]
FPS = 30


def ler_stl(caminho):
    """Devolve uma lista de triângulos ((x,y,z),(x,y,z),(x,y,z)) de um STL binário ou ASCII."""
    with open(caminho, "rb") as f:
        dados = f.read()
    if len(dados) >= 84:
        n = struct.unpack_from("<I", dados, 80)[0]
        if len(dados) == 84 + 50 * n:
            tris = []
            for i in range(n):
                v = struct.unpack_from("<12f", dados, 84 + 50 * i)
                tris.append((v[3:6], v[6:9], v[9:12]))
            return tris
    nums = re.findall(rb"vertex\s+(\S+)\s+(\S+)\s+(\S+)", dados)
    pts = [tuple(float(c) for c in p) for p in nums]
    return [tuple(pts[i:i + 3]) for i in range(0, len(pts) - 2, 3)]


def malha_stl(caminho):
    """Lê um STL e devolve (posições, normais, índices, nº de faces) em mm, com normais suavizadas
    só onde a superfície é curva (arestas vivas preservadas)."""
    idx_pos, posicoes, faces, normais_face = {}, [], [], []
    for tri in ler_stl(caminho):
        ids = []
        for p in tri:
            chave = (round(p[0], 5), round(p[1], 5), round(p[2], 5))
            if chave not in idx_pos:
                idx_pos[chave] = len(posicoes)
                posicoes.append(chave)
            ids.append(idx_pos[chave])
        if len(set(ids)) < 3:
            continue
        a, b, c = (posicoes[i] for i in ids)
        u = (b[0] - a[0], b[1] - a[1], b[2] - a[2])
        w = (c[0] - a[0], c[1] - a[1], c[2] - a[2])
        nx, ny, nz = u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]
        comp = math.sqrt(nx * nx + ny * ny + nz * nz)
        if comp == 0:
            continue
        faces.append(ids)
        normais_face.append((nx / comp, ny / comp, nz / comp, comp))  # comp ~ área: pesa a média
    if not faces:
        raise ValueError("STL sem triângulos válidos")

    incidentes = [[] for _ in posicoes]
    for f, ids in enumerate(faces):
        for i in ids:
            incidentes[i].append(f)
    limite = math.cos(math.radians(ANGULO_ARESTA))
    vert_idx, vpos, vnor, indices = {}, [], [], []
    for f, ids in enumerate(faces):
        nf = normais_face[f]
        for i in ids:
            sx = sy = sz = 0.0
            for g in incidentes[i]:
                ng = normais_face[g]
                if nf[0] * ng[0] + nf[1] * ng[1] + nf[2] * ng[2] >= limite:
                    sx += ng[0] * ng[3]; sy += ng[1] * ng[3]; sz += ng[2] * ng[3]
            comp = math.sqrt(sx * sx + sy * sy + sz * sz) or 1.0
            n = (round(sx / comp, 3), round(sy / comp, 3), round(sz / comp, 3))
            chave = (i, n)
            if chave not in vert_idx:
                vert_idx[chave] = len(vpos)
                vpos.append(posicoes[i])
                vnor.append(n)
            indices.append(vert_idx[chave])
    return vpos, vnor, indices, len(faces)


def cor_linear(hexa):
    """'#rrggbb' (sRGB) → [r, g, b, 1] linear, como o glTF espera."""
    h = hexa.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [round(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4, 4) for v in c] + [1]


def valores_movimento(mov, tempos, duracao):
    """Valor (graus ou mm) de um giro/deslizamento em cada instante."""
    if "chaves" in mov:
        chaves = sorted((float(t), float(v)) for t, v in mov["chaves"])
        def em(t):
            if t <= chaves[0][0]:
                return chaves[0][1]
            for (t0, v0), (t1, v1) in zip(chaves, chaves[1:]):
                if t <= t1:
                    return v0 + (v1 - v0) * ((t - t0) / (t1 - t0) if t1 > t0 else 1)
            return chaves[-1][1]
        return [em(t) for t in tempos]
    de, ate = float(mov.get("de", 0)), float(mov["ate"])
    t0, t1 = float(mov.get("inicio", 0)), float(mov.get("fim", duracao))
    suave = lambda x: x * x * (3 - 2 * x)          # começa e termina devagar
    return [de + (ate - de) * suave(min(max((t - t0) / ((t1 - t0) or 1), 0), 1)) for t in tempos]


def montar_glb(pecas, config):
    """pecas: [(nome, malha)] → GLB com um nó por peça e, se houver articulações, a animação 'movimento'."""
    cfg = config.get("pecas", {})
    duracao = float(config.get("duracao", 1.5))
    nomes = [n for n, _ in pecas]
    for n, c in cfg.items():
        if n not in nomes:
            raise ValueError(f"articulacoes.json cita '{n}', mas não há {n}.stl")
        if c.get("pai") and c["pai"] not in nomes:
            raise ValueError(f"'{n}' tem pai '{c['pai']}', que não existe")
    # pais antes dos filhos
    ordem, vistos = [], set()
    def visitar(n, cadeia=()):
        if n in vistos:
            return
        if n in cadeia:
            raise ValueError("articulações em ciclo: " + " → ".join(cadeia + (n,)))
        pai = cfg.get(n, {}).get("pai")
        if pai:
            visitar(pai, cadeia + (n,))
        vistos.add(n); ordem.append(n)
    for n in nomes:
        visitar(n)

    binario = bytearray()
    vistas, acessores = [], []
    def anexar(dados, alvo=None):
        while len(binario) % 4:
            binario.append(0)
        vistas.append({"buffer": 0, "byteOffset": len(binario), "byteLength": len(dados), **({"target": alvo} if alvo else {})})
        binario.extend(dados)
        return len(vistas) - 1
    def acessor(dados, tipo, comp, qtd, alvo=None, **extra):
        acessores.append({"bufferView": anexar(dados, alvo), "componentType": comp, "count": qtd, "type": tipo, **extra})
        return len(acessores) - 1

    malhas_gltf, materiais, nos = [], [], [{"name": "Montagem", "scale": [0.001] * 3, "children": []}]
    malha_de = dict(pecas)
    pivo_abs, no_pivo, canais, amostras = {}, {}, [], []
    tempos = [min(i / FPS, duracao) for i in range(int(math.ceil(duracao * FPS)) + 1)]
    entrada = None
    for k, nome in enumerate(ordem):
        vpos, vnor, indices, _ = malha_de[nome]
        c = cfg.get(nome, {})
        curto = len(vpos) < 65536
        prim = {"attributes": {
                    "POSITION": acessor(b"".join(struct.pack("<3f", *p) for p in vpos), "VEC3", 5126, len(vpos), 34962,
                                        min=[min(p[i] for p in vpos) for i in range(3)], max=[max(p[i] for p in vpos) for i in range(3)]),
                    "NORMAL": acessor(b"".join(struct.pack("<3f", *n) for n in vnor), "VEC3", 5126, len(vnor), 34962)},
                "indices": acessor(struct.pack("<%d%s" % (len(indices), "H" if curto else "I"), *indices),
                                   "SCALAR", 5123 if curto else 5125, len(indices), 34963),
                "material": len(materiais)}
        materiais.append({"name": nome, "doubleSided": True, "pbrMetallicRoughness": {
            "baseColorFactor": cor_linear(c.get("cor", CORES_PADRAO[k % len(CORES_PADRAO)])),
            "metallicFactor": float(c.get("metal", 0.3)), "roughnessFactor": float(c.get("rugosidade", 0.45))}})
        malhas_gltf.append({"name": nome, "primitives": [prim]})

        pai = c.get("pai")
        base_pai = pivo_abs.get(pai, [0, 0, 0])
        mov = c.get("giro") or c.get("desliza")
        lista_pai = nos[no_pivo[pai]]["children"] if pai else nos[0]["children"]
        if not mov and not pai:                         # peça parada
            nos.append({"name": nome, "mesh": len(malhas_gltf) - 1})
            lista_pai.append(len(nos) - 1)
            continue
        ponto = [float(v) for v in (mov.get("ponto", [0, 0, 0]) if mov else base_pai)]
        rel = [ponto[i] - base_pai[i] for i in range(3)]
        nos.append({"name": nome + " (articulação)", "translation": rel, "children": [len(nos) + 1]})
        idx = len(nos) - 1
        nos.append({"name": nome, "mesh": len(malhas_gltf) - 1, "translation": [-v for v in ponto]})
        lista_pai.append(idx)
        pivo_abs[nome], no_pivo[nome] = ponto, idx
        if not mov:
            continue
        eixo = [float(v) for v in mov.get("eixo", [0, 0, 1])]
        norma = math.sqrt(sum(v * v for v in eixo)) or 1
        eixo = [v / norma for v in eixo]
        valores = valores_movimento(mov, tempos, duracao)
        if entrada is None:
            entrada = acessor(struct.pack("<%df" % len(tempos), *tempos), "SCALAR", 5126, len(tempos), min=[0], max=[tempos[-1]])
        if "giro" in c:
            dados, caminho = [], "rotation"
            for v in valores:
                a = math.radians(v) / 2
                dados += [eixo[0] * math.sin(a), eixo[1] * math.sin(a), eixo[2] * math.sin(a), math.cos(a)]
            saida = acessor(struct.pack("<%df" % len(dados), *dados), "VEC4", 5126, len(valores))
        else:
            dados, caminho = [], "translation"
            for v in valores:
                dados += [rel[i] + eixo[i] * v for i in range(3)]
            saida = acessor(struct.pack("<%df" % len(dados), *dados), "VEC3", 5126, len(valores))
        amostras.append({"input": entrada, "output": saida, "interpolation": "LINEAR"})
        canais.append({"sampler": len(amostras) - 1, "target": {"node": idx, "path": caminho}})

    gltf = {"asset": {"version": "2.0", "generator": "gerar-indice.py"}, "scene": 0,
            "scenes": [{"nodes": [0]}], "nodes": nos, "meshes": malhas_gltf, "materials": materiais,
            "buffers": [{"byteLength": len(binario)}], "bufferViews": vistas, "accessors": acessores}
    if canais:
        gltf["animations"] = [{"name": "movimento", "channels": canais, "samplers": amostras}]
    js = json.dumps(gltf, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    while len(binario) % 4:
        binario.append(0)
    total = 12 + 8 + len(js) + 8 + len(binario)
    return (struct.pack("<4sII", b"glTF", 2, total) + struct.pack("<I4s", len(js), b"JSON") + js
            + struct.pack("<I4s", len(binario), b"BIN\0") + bytes(binario)), len(canais)


def preparar_modelo(pasta, slug, avisos):
    """Procura .glb ou .stl (+ articulacoes.json) na pasta e gera modelo.js (só quando algo mudou)."""
    arquivos = os.listdir(pasta)
    glbs = sorted(f for f in arquivos if f.lower().endswith(".glb"))
    stls = sorted(f for f in arquivos if f.lower().endswith(".stl"))
    if not glbs and not stls:
        return False
    fontes = [glbs[0]] if glbs else stls + (["articulacoes.json"] if "articulacoes.json" in arquivos else [])
    saida = os.path.join(pasta, "modelo.js")
    if os.path.exists(saida) and all(os.path.getmtime(saida) >= os.path.getmtime(os.path.join(pasta, f)) for f in fontes):
        return True
    try:
        if glbs:
            with open(os.path.join(pasta, glbs[0]), "rb") as f:
                glb = f.read()
            info = "GLB"
        else:
            config = {}
            if "articulacoes.json" in arquivos:
                with open(os.path.join(pasta, "articulacoes.json"), encoding="utf-8") as f:
                    config = json.load(f)
            pecas = [(os.path.splitext(f)[0], malha_stl(os.path.join(pasta, f))) for f in stls]
            glb, n_mov = montar_glb(pecas, config)
            faces = sum(m[3] for _, m in pecas)
            info = f"{len(pecas)} peça{'s' if len(pecas) > 1 else ''}, {faces} triângulos" + (f", {n_mov} com movimento" if n_mov else "")
    except (OSError, ValueError, KeyError, TypeError, struct.error, json.JSONDecodeError) as e:
        avisos.append(f"  ! {slug}: não consegui montar o 3D ({e})")
        return False
    with open(saida + ".tmp", "w", encoding="utf-8") as f:   # grava e só depois troca: nunca fica pela metade
        f.write("// Gerado por gerar-indice.py a partir de " + ", ".join(fontes) + " — não edite.\n")
        f.write("(window.MODELOS = window.MODELOS || {})[" + json.dumps(slug) + "] = \"")
        f.write(base64.b64encode(glb).decode("ascii"))
        f.write("\";\n")
    os.replace(saida + ".tmp", saida)
    print(f"  3D  {slug}: modelo.js gerado ({info}, {len(glb) / 1024:.0f} KB)")
    return True


# ---------------------------------------------------------------- índice
def main():
    projetos, avisos = [], []
    controle = {"nivel": {}, "origem": {}}
    vistos = {}
    for pasta_nome in sorted(os.listdir(PASTA)):
        pasta = os.path.join(PASTA, pasta_nome)
        info = os.path.join(pasta, "info.md")
        if not os.path.isdir(pasta) or pasta_nome.startswith(("_", ".")):
            continue
        if not os.path.exists(info):
            avisos.append(f"  ! {pasta_nome}: sem info.md (ignorado)")
            continue

        meta, secoes = ler_md(info)
        en_meta, en_secoes = {}, []
        if os.path.exists(os.path.join(pasta, "info.en.md")):
            en_meta, en_secoes = ler_md(os.path.join(pasta, "info.en.md"))

        imagens = [f for f in os.listdir(pasta) if f.lower().endswith(EXT_IMG)]
        imagens.sort(key=lambda f: (TIPOS.index(tipo_da_imagem(f)), f))
        if not imagens:
            avisos.append(f"  ! {pasta_nome}: nenhuma imagem")

        prefixo, _, resto = pasta_nome.partition("-")
        nivel = meta.get("nivel") or prefixo
        if nivel not in NIVEIS:
            avisos.append(f"  ! {pasta_nome}: nível '{nivel}' inválido (use facil, medio ou dificil)")
        # endereço público sem o nível: projetos/medio-cilindro → #/projeto/cilindro
        slug = resto if prefixo in NIVEIS and resto else pasta_nome
        if slug in vistos:
            avisos.append(f"  ! {pasta_nome}: mesmo nome de {vistos[slug]} — renomeie uma das pastas")
            continue
        vistos[slug] = pasta_nome
        controle["nivel"][nivel] = controle["nivel"].get(nivel, 0) + 1
        origem = meta.get("origem", "") or "—"
        controle["origem"][origem] = controle["origem"].get(origem, 0) + 1

        capa = meta.get("capa") if meta.get("capa") in imagens else (imagens[0] if imagens else "")

        def textos(m, s):
            return {
                "nome": m.get("nome", ""),
                "materiais": m.get("materiais", []),
                "fabricacao": m.get("fabricacao", ""),
                "montagem": m.get("montagem", ""),
                "secoes": s,
            }

        projetos.append({
            "slug": slug,
            "pasta": pasta_nome,
            "categorias": meta.get("categorias", []),
            "produzido": meta.get("produzido", False),
            "destaque": meta.get("destaque", False),
            "data": meta.get("data", ""),
            "software": meta.get("software", ""),
            "capa": capa,
            "imagens": [{"arquivo": f, "tipo": tipo_da_imagem(f)} for f in imagens],
            "modelo": preparar_modelo(pasta, slug, avisos),
            "pt": textos(meta, secoes),
            "en": textos(en_meta, en_secoes) if en_meta or en_secoes else None,
        })
        if not meta.get("nome"):
            avisos.append(f"  ! {pasta_nome}: sem 'nome'")

    # mais recentes primeiro
    projetos.sort(key=lambda p: p["data"], reverse=True)
    with open(SAIDA, "w", encoding="utf-8") as f:
        f.write("// Arquivo gerado por gerar-indice.py — não edite à mão.\n")
        f.write("window.PROJETOS = ")
        json.dump(projetos, f, ensure_ascii=False, indent=1)
        f.write(";\n")

    print(f"✓ {len(projetos)} projetos gravados em projetos.js ({sum(p['modelo'] for p in projetos)} com 3D)")
    resumo = lambda d: ", ".join(f"{k}: {v}" for k, v in sorted(d.items()))
    print("  Controle (não aparece no site) — nível: " + resumo(controle["nivel"]) + " | origem: " + resumo(controle["origem"]))
    if avisos:
        print("Avisos:\n" + "\n".join(avisos))
    return 0


if __name__ == "__main__":
    sys.exit(main())
