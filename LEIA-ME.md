# Portfólio · Guia rápido

Protótipo do site do portfólio. Os 15 projetos de exemplo usam as imagens da pasta `imagens/`, e os nomes e textos são **fictícios**: substitua pelos projetos reais.

## Como abrir

Dê dois cliques em `index.html`. O site funciona direto do computador, sem servidor e sem internet (só a fonte Geist vem da internet; sem ela, o site usa a fonte do sistema).

- **Peça 3D na página inicial:** a cada visita, uma peça é sorteada entre os projetos que têm modelo 3D
  e acompanha o mouse. Basta o projeto ter `.stl`/`.glb`; não há nada para configurar.
- **Tema claro/escuro:** segue o sistema; o botão de sol/lua no topo (ao lado do idioma) troca na hora e a escolha
  fica salva no navegador. Escolher o mesmo tema do sistema faz o site voltar a seguir o sistema.
- **Idioma:** bandeira no topo (PT ⇄ EN). A escolha fica salva no navegador.

## Estrutura

```
site/
├── index.html          página única (Início, Projetos, Projeto, Sobre, Contato)
├── config.js           ← SEUS DADOS: nome, marca (GUIBES), subtítulo, foto, textos do "Sobre", contatos, SEO, traduções
├── projetos.js         gerado automaticamente — não edite
├── gerar-indice.py     lê a pasta projetos/ e gera o projetos.js
├── assets/css/style.css  visual (cores, tamanhos)
├── assets/js/app.js      funcionamento do site
├── assets/js/i18n.js     textos fixos da interface em PT e EN
└── projetos/
    ├── _modelo/        modelo para copiar (pastas começando com _ são ignoradas)
    └── medio-cilindro-hidraulico/
        ├── info.md        dados em português (obrigatório)
        ├── info.en.md     dados em inglês (opcional; se faltar, mostra o português com um aviso)
        ├── print-01.jpg
        ├── print-02.jpg
        └── desenho-01.jpg
```

## Fluxo para adicionar um projeto

1. Copie a pasta `projetos/_modelo` e renomeie como `nivel-nome-do-projeto`, sem espaços nem acentos (ex.: `dificil-redutor-planetario`).
2. Coloque as imagens dentro dela. **O começo do nome do arquivo define o tipo** exibido na galeria:
   - `render-01.jpg` → Render
   - `print-01.jpg` → Modelo 3D (print do SolidWorks)
   - `desenho-01.jpg` → Desenho 2D
   - `foto-01.jpg` → Foto
3. Preencha o `info.md` e, se quiser, o `info.en.md`.
4. No terminal, dentro da pasta `site`, rode:
   ```
   python3 gerar-indice.py
   ```
5. Atualize o `index.html` no navegador e confira.

O endereço público do projeto não mostra o nível: `projetos/medio-cilindro-hidraulico` vira `#/projeto/cilindro-hidraulico`.

O script avisa se faltar o `info.md`, alguma imagem, o nome ou se o nível estiver escrito errado.

## Campos do info.md

| Campo | Valores | Para que serve |
|---|---|---|
| `nome` | texto | título do projeto |
| `nivel` | `facil`, `medio`, `dificil` | só seu controle (aparece no resumo do terminal, não no site) |
| `categorias` | `[A, B]` | filtro (escreva em português e traduza em `config.js → categorias_en`) |
| `origem` | `trabalho`, `desafio` | só seu controle (aparece no resumo do terminal, não no site) |
| `produzido` | `sim`, `nao` | selo "Fabricado" e filtro "Só fabricados" |
| `destaque` | `sim`, `nao` | aparece primeiro na página inicial (até 6) |
| `data` | `2026-01` | ordenação (mais recentes primeiro) |
| `software`, `fabricacao`, `montagem` | texto | ficha técnica (campos vazios ficam ocultos) |
| `materiais` | `[A, B]` | ficha técnica |
| `capa` | nome do arquivo | imagem do cartão (se vazio, usa a primeira) |

Abaixo do cabeçalho, cada `## Título` vira um bloco de texto na página do projeto. Você pode criar, remover ou renomear seções à vontade. Nos textos, funcionam parágrafos, listas com `-` e **negrito** com `**texto**`.

## Modelo 3D (opcional)

Coloque o 3D na pasta do projeto e rode `python3 gerar-indice.py`. O visitante poderá girar, aproximar e mover a peça.
O script converte tudo em `modelo.js` (só quando algo muda) e marca o projeto com o selo **3D**.

**Peça única**
- **`.stl`** (mais simples): no SolidWorks, *Arquivo → Salvar como → STL*. Em *Opções*, use **Resolução: Fina**
  (ou Personalizada, com desvio pequeno) para as curvas ficarem lisas, e **Unidade: milímetros**.
- **`.glb`**: se você tiver o modelo em glTF binário, ele é usado como está (mantém cores e animações).

**Montagem com movimento (abre/fecha ao clicar)**
1. Exporte a montagem como STL com uma peça por arquivo. Em *Opções* do STL: **desmarque** "Salvar todos os
   componentes de uma montagem em um único arquivo" e **marque** "Não transladar dados de saída STL para o espaço
   positivo". Assim cada peça sai em seu próprio `.stl`, já na posição da montagem.
2. Renomeie os arquivos com nomes simples: `base.stl`, `alavanca.stl`, `gancho.stl`…
3. Crie um `articulacoes.json` dizendo o que se move. Peças que não aparecem nele ficam paradas.
   ```json
   {
     "duracao": 1.5,
     "pecas": {
       "base":     { "cor": "#aeb4bc" },
       "alavanca": { "giro": { "ponto": [20, 10, 0], "eixo": [0, 0, 1], "de": 0, "ate": -95 } },
       "gancho":   { "pai": "alavanca", "giro": { "ponto": [4, 8, 0], "eixo": [0, 0, 1], "de": 0, "ate": 30 } },
       "haste":    { "desliza": { "eixo": [1, 0, 0], "de": 0, "ate": 120 } }
     }
   }
   ```
   - `giro`: gira em torno do eixo que passa pelo `ponto` (coordenadas em mm do SolidWorks; pegue o centro do furo
     do pino com *Ferramentas → Avaliar → Medir*). `de`/`ate` em graus; o sinal define o sentido.
   - `desliza`: anda ao longo do `eixo` (em mm), como a haste de um cilindro.
   - `pai`: a peça acompanha o movimento de outra (o gancho preso na alavanca, por exemplo).
   - Opcional: `inicio`/`fim` (segundos) para escalonar movimentos; `chaves: [[seg, valor], …]` para um
     movimento livre; `cor` (`#rrggbb`), `metal` (0–1) e `rugosidade` (0–1) por peça.
   - A posição exportada é o tempo 0 (fechado). O botão **Abrir** leva até o fim; **Fechar** volta.

Prefira modelos leves: até uns 5 MB carregam rápido. Os `.stl`/`.glb` originais não são copiados para as versões
salvas (o site usa só o `modelo.js`).

Exemplo completo: `projetos/medio-trava-articulada` (7 peças, alavanca e estribo móveis), modelado em CadQuery por
`../ferramentas/modelar-trava-cadquery.py`.

## Versões

Toda alteração no site vira uma versão salva em `../versoes/<versão>/`, que abre sozinha com dois cliques.
1. Descreva a mudança no topo de `MUDANCAS.md` (título `## v3.1 — ...`).
2. Na pasta do projeto (acima de `site`), rode `python3 salvar-versao.py v3.1`.

## Seus dados, foto e SEO (`config.js`)

- `marca` é o nome exibido no topo e no rodapé (GUIBES). `nome` (completo) só vai para os metadados de busca.
- `subtitulo` (PT/EN) aparece embaixo do nome: "Projetista mecânico" / "Mechanical designer".
- `foto`: coloque o arquivo na pasta `site/` (hoje `foto-perfil.jpeg`, quadrada) e escreva o nome do arquivo.
  Ela aparece na página Sobre, junto com o nome e o `local`; vazio = sem foto.
- `experiencia`, `formacao` e `idiomas` (PT/EN): listas `{ titulo, texto }` do lado da página Sobre; vazias somem.
- `contato`: e-mail, LinkedIn (endereço completo), WhatsApp (só números com DDI) e currículo. Campos vazios somem.
- `seo_titulo` e `seo_descricao` (PT/EN): título e descrição que aparecem no Google. Cada página monta o seu
  título e a sua descrição a partir deles (projetos usam o nome, as categorias e o primeiro texto do `info.md`).
- Ao publicar: preencha `site_url` e descomente as linhas marcadas com `SITE_URL` no `index.html`
  (endereço do site e imagem de compartilhamento, 1200×630 px).
- As palavras-chave e os dados estruturados (schema.org) ficam no `<head>` do `index.html`.

## Publicar na internet (próximo passo)

A forma mais simples e gratuita é o **GitHub Pages**: envie a pasta `site` para um repositório no GitHub e ative *Settings → Pages*. O site funciona do jeito que está, sem nenhum ajuste.

## Dicas para as imagens reais

- Exporte em **JPG**, com cerca de **1600 px** no lado maior. Fica nítido e carrega rápido.
- Prints do SolidWorks ficam melhores com fundo branco liso (*View → Display → Background: plain white*).
- Use a mesma imagem como capa em todos os projetos do mesmo tipo (ex.: sempre o render) para a galeria ficar uniforme.
