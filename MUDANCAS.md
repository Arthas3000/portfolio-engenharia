# Histórico de versões

Da mais recente para a mais antiga. Cada versão tem uma cópia executável em `versoes/<versão>/`.

## v5.1 — Textos pessoais mais genéricos (2026-10-06)

**Objetivo:** não citar empresas onde trabalho/trabalhei nem instituições onde estudei.

- **Sobre (PT/EN):** saem UNISOCIESC, SENAI, Lion Equipamentos e os detalhes do setor florestal; o trabalho atual
  vira "projetista mecânico na indústria de máquinas e equipamentos pesados".
- **Experiência:** "Indústria de máquinas e equipamentos" (2025 – atual) e "Indústria" (marketing, 2022 – 2025).
- **Formação:** só curso e anos ("Bacharelado", "Curso técnico", "Curso no exterior").
- **SEO (`index.html`):** removidos `worksFor` e `alumniOf` do JSON-LD e as palavras-chave
  "equipamentos florestais" e "harvester".

**Arquivos:** `config.js`, `index.html`, `MUDANCAS.md`; fora do site: `CLAUDE.md`.

## v5.0 — Peça 3D na página inicial e conteúdo mais largo (2026-10-04)

**Objetivo:** dar vida ao topo da página inicial com uma peça 3D real dos projetos e aproveitar melhor telas largas.

- **Peça 3D ao lado do texto de abertura:** sorteada a cada visita entre os projetos com modelo 3D, sem fundo e
  sem botões. Com mouse, a peça vira suavemente para o lado do cursor, como se o acompanhasse pela tela.
  No celular gira devagar sozinha; com "reduzir movimento" no sistema, fica parada. Aparece com um esmaecer
  quando termina de carregar; abaixo dela, o nome do projeto (clicar na peça ou no nome abre o projeto).
- Sem nenhum projeto 3D, o texto de abertura ocupa a largura toda, como antes.
- **Coluna de conteúdo mais larga:** de 1200 px para 1320 px (`--larg`), em todas as páginas, para o topo, o
  conteúdo e o rodapé continuarem alinhados.
- No celular, a peça fica abaixo dos botões.

**Arquivos:** `assets/js/app.js` (`paginaInicio`, `ligarInicio`), `assets/css/style.css`, `LEIA-ME.md`,
`MUDANCAS.md`; fora do site: `CLAUDE.md`.

## v4.3 — Botão de tema claro/escuro (2026-10-04)

**Objetivo:** trocar o tema na hora, sem depender do sistema (o Chrome no Linux às vezes fica preso no escuro).

- **Botão de sol/lua** no topo, ao lado do idioma: mostra a lua no tema claro e o sol no escuro; rótulo em PT/EN.
- A escolha fica salva no navegador (`localStorage`, chave `tema`). Se você escolher o mesmo tema do sistema,
  a escolha é apagada e o site volta a seguir o sistema, inclusive quando ele muda com a página aberta.
- O tema é aplicado por um script curto no `<head>`, antes do CSS, para a página não piscar no tema errado.
- CSS: o tema escuro passou de `@media (prefers-color-scheme: dark)` para `:root[data-tema="escuro"]`;
  `color-scheme` acompanha o tema (barras de rolagem e campos). A cor da barra do navegador no celular
  (`theme-color`) também acompanha.
- No celular, os dois botões ficam juntos à direita do nome.

**Arquivos:** `index.html`, `assets/js/app.js`, `assets/js/i18n.js`, `assets/css/style.css`, `LEIA-ME.md`,
`MUDANCAS.md`; fora do site: `CLAUDE.md`, `COMO-ALTERAR.md`.

## v4.2 — Limpeza de código (2026-10-04)

**Objetivo:** menos código fazendo o mesmo, usando recursos nativos do navegador (auditoria ponytail). Sem mudança visual.

- **Lightbox agora é um `<dialog>` nativo** (`showModal()`): o navegador cuida do Esc, de prender o foco dentro
  e de devolvê-lo ao fechar. Saíram o controle manual de Tab/Esc/foco e a classe `body.travado`
  (a rolagem é travada por `body:has(.lightbox[open])`).
- **3D:** o modelo vai direto ao `<model-viewer>` como `data:` URL; saiu a conversão base64 → bytes → blob.
- **`campo(p, "secoes")`** substitui a regra de fallback EN→PT repetida na página do projeto e no SEO.
- Removidos: `try/catch` sem efeito em `formatarData`, testes de recursos que todo navegador atual tem
  (`matchMedia`, `IntersectionObserver`, `scrollRestoration`) e o texto `nao`, que não era usado (PT/EN).
- `gerar-indice.py`: `tipo_da_imagem` em uma linha.

**Arquivos:** `index.html`, `assets/js/app.js`, `assets/js/i18n.js`, `assets/css/style.css`, `gerar-indice.py`,
`projetos.js` (regenerado), `MUDANCAS.md`.

## v4.1 — Dados reais do LinkedIn, foto e contatos (2026-10-04)

**Objetivo:** trocar os dados de exemplo pelos reais (do PDF do LinkedIn) e dar acesso direto ao perfil.

- **Contatos preenchidos:** e-mail, LinkedIn (www.linkedin.com/in/lucas-guibes) e WhatsApp, este exibido como
  "+55 41 98445-9883". O texto dos cartões de contato agora quebra linha em vez de ser cortado.
- **Link do LinkedIn no rodapé** de todas as páginas ("LinkedIn ↗", abre em nova aba).
- **Página Sobre:**
  - foto (`foto-perfil.jpeg`) com nome e cidade (Curitiba, Paraná, Brasil);
  - textos com a formação real (UNISOCIESC, SENAI) e o trabalho atual na Lion Equipamentos (setor florestal);
  - novas listas Experiência e Idiomas; "Formação" separada da experiência;
  - competências ampliadas (acompanhamento de fabricação, inspeção técnica, SketchUp).
- **SEO:** cidade (Curitiba/PR) no título e na descrição; schema.org com LinkedIn (`sameAs`), endereço, empresa
  atual, instituições de ensino e idiomas; novas palavras-chave (equipamentos florestais, harvester, Curitiba).
- **`config.js`:** campos novos `local`, `experiencia` e `idiomas` (PT/EN). Listas vazias somem do site.

**Arquivos:** `config.js`, `index.html`, `assets/js/app.js`, `assets/js/i18n.js`, `assets/css/style.css`,
`foto-perfil.jpeg` (novo), `LEIA-ME.md`, `MUDANCAS.md`.

## v4.0 — Identidade GUIBES, hover no estilo Diegator e SEO (2026-10-04)

**Objetivo:** visual mais profissional e minimalista, com referência em diegator.com, mantendo os textos, os títulos
e o menu atuais, e preparar o site para buscadores.

**Topo**
- Nome só em texto: **GUIBES** (Jost 600, caixa alta, letras espaçadas) com o subtítulo "Projetista mecânico" /
  "Mechanical designer" logo abaixo, em caixa alta pequena e cinza. Ícone removido.
- Menu com os mesmos itens (Início, Projetos, Sobre, Contato e idioma), agora só texto: cinza, escurece no hover, e
  a página atual ganha um traço fino embaixo.

**Cartões de projeto (hover inspirado no Diegator)**
- Grade de 2 colunas com imagens maiores.
- Com mouse: a imagem esmaece (0,3 s) e o nome e as categorias aparecem centralizados sobre ela, em caixa alta.
  Também funciona com o foco do teclado. Em telas de toque, o nome continua embaixo da imagem.

**Linguagem visual**
- Cantos mais retos (4–6 px) em botões, filtros, busca e imagens, no lugar das pílulas.
- Rótulos pequenos (sobretítulo, "Ficha técnica", "Formação", "Competências") em caixa alta espaçada, na mesma
  linguagem do subtítulo. Títulos e textos continuam em Geist.
- Favicon: só a letra "G" sobre fundo escuro.

**Chamada final ("Tem um projeto em mente?")**
- Sem o bloco cinza: linha fina em cima, rótulo "Projetos sob demanda", título maior, texto mais profissional e
  botão "Entrar em contato" / "Get in touch".

**SEO**
- `<title>`, descrição, palavras-chave (PT e EN), autor, robots, theme-color, Open Graph e Twitter Card.
- Dados estruturados schema.org (Person + WebSite) com nome, cargos e competências.
- Título, descrição e idioma do Open Graph atualizados a cada página e idioma (projetos usam o próprio texto).
- `<noscript>` com um resumo para quem não roda JavaScript.
- Preparado para publicar: `site_url` no `config.js` e linhas `SITE_URL` comentadas no `index.html`.

**Dados pessoais**
- Novos campos no `config.js`: `marca`, `subtitulo`, `seo_titulo`, `seo_descricao`, `site_url` e `foto` (foto
  opcional na página Sobre).

**Arquivos:** `index.html`, `config.js`, `assets/css/style.css`, `assets/js/app.js`, `assets/js/i18n.js`,
`LEIA-ME.md`, `MUDANCAS.md`.

## v3.2 — Montagens com movimento a partir de STL + trava remodelada em CadQuery (2026-10-03)

**Objetivo:** permitir que montagens exportadas do SolidWorks ganhem movimento no site, e deixar a trava de
exemplo mais fiel às fotos.

**`gerar-indice.py`: montagens**
- Vários `.stl` na pasta = uma montagem (uma peça por arquivo, já na posição da montagem, em mm).
- Novo `articulacoes.json` opcional: `giro` (ponto + eixo, graus) ou `desliza` (eixo, mm); `de`/`ate` com
  `inicio`/`fim` e aceleração suave, ou `chaves` livres `[segundos, valor]`; `pai` para peças que acompanham outra
  (cadeia de articulações); `cor`, `metal` e `rugosidade` por peça. Peças fora do JSON ficam paradas.
- Gera um único GLB com um nó por peça e a animação "movimento"; o site já mostra Abrir/Fechar automaticamente.
- Mensagens claras para erros comuns (peça citada sem `.stl`, `pai` inexistente, articulação em ciclo).
- Um `.stl` sozinho continua funcionando como antes.

**Trava articulada em CadQuery (`ferramentas/modelar-trava-cadquery.py`, substitui a versão three.js)**
- Sólidos de CAD de verdade (B-rep), exportados com tolerância de 0,03 mm.
- Base: cantos arredondados, furos de fixação, losango com borda estampada, orelhas com cantos arredondados e
  raio de dobra.
- Alavanca: perfil U com dobras arredondadas (externa e interna), largura constante no pivô e afunilada na pega,
  nervuras estampadas rasas com borda suave, ponta arredondada com aba dobrada para baixo.
- Estribo: braços com olhal, quadro com janela de cantos arredondados e aba dianteira dobrada com raio.
- Batente: furos escareados e lábio dobrado com ponta em gancho. Pino com cabeças abauladas, rebites que acompanham
  a alavanca e mola em hélice de verdade (fio de 1,2 mm, 7 espiras).
- Mesma cinemática sobre-centro da v3.1, agora gravada como `chaves` no `articulacoes.json`, o que também serve
  de teste do formato novo.
- 7 peças, 27 mil triângulos, 764 KB no site.

**Arquivos:** `gerar-indice.py`, `LEIA-ME.md`, `MUDANCAS.md`, `projetos/medio-trava-articulada/` (7 `.stl` +
`articulacoes.json` no lugar de `modelo.glb`); na raiz, `ferramentas/modelar-trava-cadquery.py` (novo) e
`ferramentas/modelar-trava-articulada.mjs` (removido).

## v3.1 — Trava articulada em 3D com movimento real (2026-10-03)

**Objetivo:** exemplo de visualizador 3D funcionando, com a "Trava articulada" modelada em three.js e
o movimento real de abrir e fechar ao clicar.

**Modelo (`ferramentas/modelar-trava-articulada.mjs`, three.js 0.182)**
- Peças conforme as fotos: base estampada em ponta (furos de fixação, furo quadrado, orelhas dobradas),
  alavanca em perfil U afunilado com dois rasgos de reforço e aba dobrada na pega, estribo com braços laterais
  e quadro com janela, pinos rebitados, mola de torção no pivô principal e o batente com lábio onde o estribo engata.
- Encaixes sem interferência: orelhas, paredes da alavanca e braços do estribo em camadas (|z| 13 / 15 / 17,4 mm);
  rebites do pivô do estribo curtos para não cruzar as orelhas; janela de 16 mm para o lábio do batente.
- Chapa de 1,5 mm com chanfro leve; material inox; 19 mil triângulos, 739 KB.

**Movimento (cinemática real de trava sobre-centro)**
- Fechada, o pivô do estribo fica 10° abaixo da linha pivô→batente: a tração do estribo segura a alavanca fechada.
- Ao abrir, a alavanca gira 95° e passa pelo ponto morto (o "estalo", 0,2 mm de tração extra). O estribo,
  sempre apontado para o lábio, afrouxa até 12,3 mm, desliza para a frente e é levantado 48° para sair do batente.
  Ao fechar, o caminho é o mesmo, invertido.
- A animação vai embutida no `.glb` ("abrir-fechar": 0 s fechada → 1,4 s aberta), calculada pela geometria.

**Site**
- Modelos com animação ganham o botão **Abrir/Fechar** e respondem a um clique na peça (arrastar continua girando).
  O movimento pode ser invertido no meio; com "reduzir movimento" ligado, a troca é instantânea.
- A câmera enquadra o movimento inteiro (posições aberta e fechada), não só a pose inicial.
- A dica de uso muda para "Clique na peça para abrir e fechar · …" (PT/EN).
- `salvar-versao.py` também deixa de copiar `.glb` para as versões (o site usa só o `modelo.js`).

**Arquivos:** `assets/js/app.js`, `assets/js/i18n.js`, `assets/css/style.css`, `LEIA-ME.md`, `MUDANCAS.md`,
`projetos/medio-trava-articulada/` (`modelo.glb`, `modelo.js`); na raiz, `ferramentas/modelar-trava-articulada.mjs` (novo) e `salvar-versao.py`.

## v3.0 — Minimalista, foco na experiência e modelos 3D (2026-10-03)

**Objetivo:** site mais moderno e minimalista, intuitivo e fluido; esconder nível e origem do público;
permitir girar, orbitar e dar zoom em modelos 3D fiéis ao desenho.

**Modelos 3D (novo)**
- Basta pôr um `.stl` (exportado do SolidWorks) ou `.glb` na pasta do projeto e rodar `gerar-indice.py`.
- O script converte STL → GLB em Python puro (sem instalar nada): mantém arestas vivas e suaviza só as superfícies
  curvas (limite de 30°), converte mm → m e grava `modelo.js`, que abre direto do arquivo, sem servidor.
- Visualizador `<model-viewer>` 4.2.0 (Google) salvo em `assets/vendor/`, ou seja, funciona offline e só é carregado
  nas páginas que têm 3D.
- Na página do projeto: alternância "Modelo 3D | Imagens"; arrastar gira, roda do mouse ou pinça dá zoom,
  botão direito ou dois dedos movem; botões "voltar à vista inicial" e "tela cheia"; barra de carregamento;
  dica de uso que some ao começar a girar; mensagem clara se o 3D falhar (as imagens continuam disponíveis).
- Cartões com modelo ganham o selo "3D".
- Dois modelos de exemplo (bucha cônica e cilindro hidráulico), gerados por script só para demonstração.

**Nível e origem só para controle**
- Removidos do site: selos dos cartões, filtros, seção "Por nível", ficha técnica e cabeçalho do projeto.
- Não são mais gravados em `projetos.js`; o endereço público tira o prefixo de nível
  (`#/projeto/medio-cilindro-hidraulico` → `#/projeto/cilindro-hidraulico`).
- `gerar-indice.py` mostra no terminal um resumo de controle (quantos projetos por nível e por origem).

**Visual**
- Fonte Geist; neutros cinza-zinco; preto como cor de ação; azul só no foco do teclado.
- Saem a grade milimetrada, os rótulos em fonte mono, a linha de cota, as marcas de registro e as numerações.
- Hero só com texto e mais respiro; "Trabalhos selecionados" em grade de 6 (destaques primeiro, completa com os recentes);
  bloco final "Tem um projeto em mente?" com botão de contato.
- Cartões sem caixa: imagem grande com cantos arredondados, nome e categorias abaixo.
- Botões, chips e menu em formato pílula; ficha técnica e "Sobre" mais limpos.

**Experiência de uso**
- Busca maior, com atalho `/` (no computador); chips de categoria rolam na horizontal no celular; filtro "Só fabricados".
- O link "Projetos" na página do projeto volta para a lista com os mesmos filtros, e a lista volta na mesma posição de rolagem.
- Galeria de imagens com miniaturas em faixa rolável; no lightbox, deslizar o dedo troca a imagem e o foco do teclado fica preso dentro dele.
- Rótulos de acessibilidade do lightbox traduzidos (PT/EN); contagem de resultados anunciada para leitores de tela.
- Movimento mais curto: entrada suave das páginas e revelação discreta ao rolar; desligado com "reduzir movimento".

**Versões**
- Novo `salvar-versao.py` (na raiz) e este `MUDANCAS.md`: cada alteração gera `versoes/<versão>/` executável.

**Arquivos:** `assets/css/style.css` (reescrito), `assets/js/app.js` (reescrito), `assets/js/i18n.js`, `index.html`,
`gerar-indice.py`, `assets/vendor/` (novo), `projetos/_modelo/info.md`, `LEIA-ME.md`, `MUDANCAS.md`; na raiz, `salvar-versao.py`.

## v2.0 — Visual técnico de engenharia (2026-10-03)

**Objetivo:** site mais moderno, com motion design sutil, mais espaço em branco e cara de engenharia profissional.

**Visual**
- Paleta trocada para tons de ardósia/marinho com azul técnico (`#0369a1`) como destaque; tema escuro em azul-noite.
- Fonte Inter substituída por IBM Plex Sans (textos) + IBM Plex Mono (rótulos técnicos).
- Referências de desenho técnico: grade milimetrada no hero, marcas de registro nos cantos do mosaico,
  "linha de cota" sobre os números, rótulos "FIG. 01", seções numeradas 01/02/03.
- Ficha técnica no estilo de legenda de prancha; seções de texto sem caixas, com régua no topo e numeração automática.
- Cantos mais retos (4–6px) e espaçamentos maiores entre seções.

**Movimento**
- Hero entra em sequência ao abrir; a linha de cota se desenha.
- Conteúdo surge suavemente ao rolar (IntersectionObserver), com escalonamento curto.
- Hovers: zoom leve nas imagens, sublinhado animado no menu, seta deslizando no botão.
- Crossfade na troca de imagens da galeria; zoom suave no lightbox.
- Tudo desligado quando o sistema pede "reduzir movimento".

**Arquivos:** `assets/css/style.css` (reescrito), `assets/js/app.js`, `index.html` (fontes).

## v1.0 — Protótipo inicial

- Página única com rotas por hash (Início, Projetos, Projeto, Sobre, Contato).
- Projetos lidos de pastas `projetos/<nivel>-<nome>/` com `info.md`/`info.en.md` e imagens; índice gerado por `gerar-indice.py`.
- Filtros por nível, categoria, origem e "só fabricados"; busca por nome e material.
- Galeria com abas por tipo de imagem e lightbox.
- Bilíngue PT/EN com bandeira; tema claro/escuro automático; fonte Inter; destaque azul `#2f6fed`.
- Sem cópia salva (o controle de versões começou na v2.0).
