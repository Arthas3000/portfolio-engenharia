/* Portfólio — roteamento simples por hash (#/rota), funciona abrindo o index.html direto. */
(function () {
  "use strict";

  const C = window.CONFIG || {};
  const P = window.PROJETOS || [];
  const T = window.I18N;
  let main = document.getElementById("conteudo");

  // ---------- idioma ----------
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  let lang = ler("idioma") || ((navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en");

  const t = (k, vars) => {
    let s = (T[lang] && T[lang][k]) || T.pt[k] || k;
    if (vars) Object.keys(vars).forEach((v) => (s = s.replace("{" + v + "}", vars[v])));
    return s;
  };
  const cfg = (k) => (C[lang] && C[lang][k] !== undefined ? C[lang][k] : C.pt && C.pt[k]);
  const cat = (c) => (lang === "en" && C.categorias_en && C.categorias_en[c]) || c;
  const txt = (p) => (lang === "en" && p.en ? p.en : p.pt);
  const campo = (p, k) => { const v = txt(p)[k]; return v && v.length ? v : p.pt[k]; };

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const img = (p, f) => "projetos/" + encodeURIComponent(p.pasta) + "/" + encodeURIComponent(f);
  const MARCA = C.marca || C.nome || "";
  const toque = matchMedia("(pointer: coarse)").matches;

  const BANDEIRAS = {
    pt: '<svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#009b3a"/><path d="M14 3l10 7-10 7-10-7z" fill="#fedf00"/><circle cx="14" cy="10" r="4.2" fill="#002776"/><path d="M10 9.3c2.6-.6 5.4-.3 7.9.9" stroke="#fff" stroke-width=".8" fill="none"/></svg>',
    en: '<svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#fff"/><g fill="#b22234">' +
      [0, 2, 4, 6, 8, 10, 12].map((i) => '<rect y="' + (i * 20 / 13) + '" width="28" height="' + (20 / 13) + '"/>').join("") +
      '</g><rect width="12" height="10.8" fill="#3c3b6e"/><rect width="28" height="20" rx="3" fill="none"/></svg>',
  };
  const ICONE = (d) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  const I_SETA = ICONE('<path d="M5 12h14M13 6l6 6-6 6"/>');
  const I_VOLTAR = ICONE('<path d="M19 12H5M11 18l-6-6 6-6"/>');
  const I_BUSCA = ICONE('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>');
  const I_CUBO = ICONE('<path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="M4 7.4l8 4.6 8-4.6M12 12v9.2"/>');
  const I_RESET = ICONE('<path d="M3 12a9 9 0 109-9 9.5 9.5 0 00-6.6 2.7L3 8"/><path d="M3 3v5h5"/>');
  const I_TELA = ICONE('<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>');
  const I_LUA = ICONE('<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>');
  const I_SOL = ICONE('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
  const I_MOVER = ICONE('<path d="M5 12a7 7 0 0112-4.9L19 9"/><path d="M19 4v5h-5"/><path d="M19 12a7 7 0 01-12 4.9L5 15"/><path d="M5 20v-5h5"/>');

  function aplicarIdioma() {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    const outro = lang === "pt" ? "en" : "pt";
    const b = document.getElementById("btn-idioma");
    b.innerHTML = BANDEIRAS[outro] + "<span>" + t("idioma_curto") + "</span>";
    b.setAttribute("aria-label", t("trocar_idioma"));
    b.title = t("trocar_idioma");
    document.getElementById("marca-nome").textContent = MARCA;
    document.getElementById("marca-sub").textContent = cfg("subtitulo") || "";
    document.getElementById("rodape-nome").textContent = "© " + new Date().getFullYear() + " " + MARCA;
    mostrarTema();
    const li = document.getElementById("rodape-linkedin"), url = (C.contato || {}).linkedin;
    li.hidden = !url;
    if (url) li.href = url;
  }
  document.getElementById("btn-idioma").addEventListener("click", () => {
    lang = lang === "pt" ? "en" : "pt";
    guardar("idioma", lang);
    aplicarIdioma();
    rotear(true);
  });

  // ---------- tema ----------
  // O <head> do index.html já aplicou o tema inicial. O botão alterna; se a escolha for igual
  // ao tema do sistema, a escolha salva é apagada e o site volta a seguir o sistema.
  const sistemaEscuro = matchMedia("(prefers-color-scheme: dark)");
  const docEl = document.documentElement;
  function definirTema(tema) {
    docEl.dataset.tema = tema;
    meta("name", "theme-color", tema === "escuro" ? "#09090b" : "#ffffff");
    mostrarTema();
  }
  function mostrarTema() {
    const b = document.getElementById("btn-tema"), escuro = docEl.dataset.tema === "escuro";
    b.innerHTML = escuro ? I_SOL : I_LUA;
    b.setAttribute("aria-label", t(escuro ? "tema_claro" : "tema_escuro"));
    b.title = b.getAttribute("aria-label");
  }
  document.getElementById("btn-tema").addEventListener("click", () => {
    const tema = docEl.dataset.tema === "escuro" ? "claro" : "escuro";
    if ((tema === "escuro") === sistemaEscuro.matches) { try { localStorage.removeItem("tema"); } catch (e) {} }
    else guardar("tema", tema);
    definirTema(tema);
  });
  sistemaEscuro.addEventListener("change", (e) => { if (!ler("tema")) definirTema(e.matches ? "escuro" : "claro"); });
  definirTema(docEl.dataset.tema);

  // ---------- componentes ----------
  function cartao(p) {
    return (
      '<a class="cartao" href="#/projeto/' + esc(p.slug) + '">' +
        '<div class="cartao__img">' +
          (p.capa ? '<img loading="lazy" src="' + img(p, p.capa) + '" alt="">' : "") +
          (p.modelo ? '<span class="selo-3d" title="' + esc(t("tem_3d_titulo")) + '">' + I_CUBO + esc(t("tem_3d")) + "</span>" : "") +
        "</div>" +
        '<div class="cartao__corpo">' +
          "<h3>" + esc(campo(p, "nome")) + "</h3>" +
          '<p class="cartao__cat">' + p.categorias.map((c) => esc(cat(c))).join(" · ") + "</p>" +
        "</div>" +
      "</a>"
    );
  }

  // Converte o texto das seções (parágrafos, listas com "-", **negrito**) em HTML seguro.
  function textoHTML(s) {
    const inline = (x) => esc(x).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return s.split(/\n\s*\n/).map((bloco) => {
      const linhas = bloco.split("\n");
      if (linhas.every((l) => /^\s*[-*]\s+/.test(l)))
        return "<ul>" + linhas.map((l) => "<li>" + inline(l.replace(/^\s*[-*]\s+/, "")) + "</li>").join("") + "</ul>";
      return "<p>" + linhas.map(inline).join("<br>") + "</p>";
    }).join("");
  }

  // ---------- páginas ----------
  let heroProj = null;   // projeto 3D sorteado para o topo da página inicial

  function paginaInicio() {
    // destaques primeiro; completa com os mais recentes para a grade fechar em 6
    const lista = P.filter((p) => p.destaque).concat(P.filter((p) => !p.destaque)).slice(0, 6);
    const com3D = P.filter((p) => p.modelo);
    heroProj = com3D[Math.floor(Math.random() * com3D.length)] || null;

    return (
      '<section class="hero"><div class="cont' + (heroProj ? " hero__in" : "") + '">' +
        '<div class="hero__texto">' +
          '<p class="sobretitulo">' + esc(cfg("cargo")) + "</p>" +
          "<h1>" + esc(cfg("chamada")) + "</h1>" +
          '<p class="lead">' + esc(cfg("resumo")) + "</p>" +
          '<div class="acoes"><a class="btn btn--pri" href="#/projetos">' + esc(t("ver_projetos")) + I_SETA + "</a>" +
          '<a class="btn" href="#/contato">' + esc(t("fale_comigo")) + "</a></div>" +
        "</div>" +
        (heroProj ? '<a class="hero__3d" id="hero-3d" href="#/projeto/' + esc(heroProj.slug) + '">' +
          '<model-viewer id="hero-mv" environment-image="neutral" exposure="0.95" shadow-intensity="0.5" shadow-softness="1"' +
            ' camera-orbit="-35deg 68deg auto" interpolation-decay="200" interaction-prompt="none" disable-zoom' +
            ' alt="' + esc(campo(heroProj, "nome")) + '"></model-viewer>' +
          '<span class="hero__legenda">' + esc(campo(heroProj, "nome")) + I_SETA + "</span></a>" : "") +
      "</div></section>" +

      '<section class="secao secao--colada"><div class="cont">' +
        '<div class="secao__cab"><h2>' + esc(t("destaques")) + "</h2>" +
        '<a class="link-seta" href="#/projetos">' + esc(t("ver_todos")) + I_SETA + "</a></div>" +
        '<div class="grade">' + lista.map(cartao).join("") + "</div>" +
      "</div></section>" +

      blocoCTA()
    );
  }

  function blocoCTA() {
    return (
      '<section class="secao"><div class="cont"><div class="cta">' +
        '<div><p class="rotulo">' + esc(t("cta_rotulo")) + "</p><h2>" + esc(t("cta_titulo")) + "</h2><p>" + esc(t("cta_sub")) + "</p></div>" +
        '<a class="btn btn--pri" href="#/contato">' + esc(t("cta_botao")) + I_SETA + "</a>" +
      "</div></div></section>"
    );
  }

  // Peça 3D do topo: sem fundo e sem controles; vira a "frente" para o lado do mouse.
  // No toque gira devagar sozinha; com "reduzir movimento" fica parada.
  function ligarInicio() {
    const caixa = document.getElementById("hero-3d"), mv = document.getElementById("hero-mv");
    if (!mv) return;
    const p = heroProj, [theta, phi] = [-35, 68];
    Promise.all([carregarScript("assets/vendor/model-viewer.min.js"), carregarScript(img(p, "modelo.js"))])
      .then(() => { if (mv.isConnected) mv.src = "data:model/gltf-binary;base64," + window.MODELOS[p.slug]; })
      .catch(() => caixa.remove());
    mv.addEventListener("load", () => caixa.classList.add("pronto"), { once: true });
    mv.addEventListener("error", () => caixa.remove());
    if (!anima) return;
    if (toque) { mv.setAttribute("auto-rotate", ""); mv.setAttribute("rotation-per-second", "12deg"); return; }
    const olhar = (e) => {
      if (!mv.isConnected) return removeEventListener("pointermove", olhar);
      const r = mv.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
      // a câmera vai para o lado oposto ao mouse, então a peça parece virar para ele
      mv.cameraOrbit = (theta - dx * 40) + "deg " + (phi - dy * 22) + "deg auto";
    };
    addEventListener("pointermove", olhar, { passive: true });
  }

  // --- projetos (lista com filtros) ---
  let filtro = { q: "", cat: "", fab: false };
  let ultimaLista = "#/projetos";

  function lerFiltroDaURL(query) {
    const u = new URLSearchParams(query || "");
    filtro = { q: u.get("q") || "", cat: u.get("cat") || "", fab: u.get("fab") === "1" };
  }
  function gravarFiltroNaURL() {
    const u = new URLSearchParams();
    if (filtro.q) u.set("q", filtro.q);
    if (filtro.cat) u.set("cat", filtro.cat);
    if (filtro.fab) u.set("fab", "1");
    const s = u.toString();
    ultimaLista = "#/projetos" + (s ? "?" + s : "");
    history.replaceState(null, "", ultimaLista);
    rotaAtual = ultimaLista;
  }
  const normal = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function filtrar() {
    const q = normal(filtro.q.trim());
    return P.filter((p) => {
      if (filtro.cat && p.categorias.indexOf(filtro.cat) < 0) return false;
      if (filtro.fab && !p.produzido) return false;
      if (q) {
        const alvo = [p.pt.nome, p.en && p.en.nome, p.categorias.map(cat).join(" "), p.categorias.join(" "),
          (p.pt.materiais || []).join(" "), p.en ? (p.en.materiais || []).join(" ") : ""].join(" ");
        if (normal(alvo).indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function paginaProjetos() {
    const cats = [...new Set(P.flatMap((p) => p.categorias))].sort();
    return (
      '<section class="cab-pagina"><div class="cont">' +
        "<h1>" + esc(t("projetos_titulo")) + "</h1><p>" + esc(t("projetos_sub")) + "</p>" +
      "</div></section>" +
      '<section class="secao secao--colada"><div class="cont">' +
        '<div class="ferramentas">' +
          '<label class="busca">' + I_BUSCA +
            '<input type="search" id="f-busca" autocomplete="off" placeholder="' + esc(t("buscar")) + '" aria-label="' + esc(t("buscar")) + '">' +
            (toque ? "" : '<kbd title="' + esc(t("atalho_busca")) + '">/</kbd>') + "</label>" +
          '<div class="ferramentas__linha">' +
            '<div class="chips" role="group" aria-label="' + esc(t("filtro_categoria")) + '">' +
              '<button type="button" class="chip" data-f="cat" data-v="">' + esc(t("todas")) + "</button>" +
              cats.map((c) => '<button type="button" class="chip" data-f="cat" data-v="' + esc(c) + '">' + esc(cat(c)) + "</button>").join("") +
            "</div>" +
            '<label class="interruptor"><input type="checkbox" id="f-fab"><span></span>' + esc(t("so_fabricados")) + "</label>" +
          "</div>" +
        "</div>" +
        '<div class="resultado"><span id="f-qtd" aria-live="polite"></span><button type="button" class="link-btn" id="f-limpar">' + esc(t("limpar")) + "</button></div>" +
        '<div class="grade" id="grade"></div>' +
      "</div></section>"
    );
  }

  function ligarProjetos() {
    const busca = document.getElementById("f-busca");
    const fab = document.getElementById("f-fab");
    busca.value = filtro.q; fab.checked = filtro.fab;

    function atualizar(digitando) {
      main.querySelectorAll("[data-f]").forEach((b) => {
        const ativo = filtro[b.dataset.f] === b.dataset.v;
        b.classList.toggle("ativo", ativo);
        b.setAttribute("aria-pressed", ativo);
      });
      const r = filtrar();
      document.getElementById("f-qtd").textContent = r.length === 1 ? t("resultado_1") : t("resultado_n", { n: r.length });
      document.getElementById("f-limpar").hidden = !(filtro.q || filtro.cat || filtro.fab);
      const grade = document.getElementById("grade");
      grade.innerHTML = r.length ? r.map(cartao).join("") : '<p class="vazio">' + esc(t("nenhum")) + "</p>";
      if (!digitando) revelar(grade);
      gravarFiltroNaURL();
    }
    main.addEventListener("click", (e) => {
      const b = e.target.closest("[data-f]");
      if (b) { filtro[b.dataset.f] = b.dataset.v; atualizar(); }
    });
    busca.addEventListener("input", () => { filtro.q = busca.value; atualizar(true); });
    fab.addEventListener("change", () => { filtro.fab = fab.checked; atualizar(); });
    document.getElementById("f-limpar").addEventListener("click", () => {
      filtro = { q: "", cat: "", fab: false };
      busca.value = ""; fab.checked = false; atualizar();
    });
    atualizar();
  }

  // atalho "/" foca a busca (ou leva até ela)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    e.preventDefault();
    const b = document.getElementById("f-busca");
    if (b) b.focus(); else location.hash = "#/projetos";
  });

  // --- projeto (detalhe) ---
  let galeria = [], galeriaProj = null;

  function paginaProjeto(slug) {
    const i = P.findIndex((p) => p.slug === slug);
    if (i < 0) return '<section class="secao"><div class="cont"><p class="vazio">' + esc(t("nao_encontrado")) + '</p><p class="centro"><a class="link-seta" href="#/projetos">' + esc(t("voltar")) + I_SETA + "</a></p></div></section>";
    const p = P[i];
    const mats = campo(p, "materiais") || [];

    const linhas = [
      ["f_categorias", p.categorias.map((c) => esc(cat(c))).join(", ")],
      ["f_fabricado", p.produzido ? esc(t("sim")) : ""],
      ["f_software", esc(p.software)],
      ["f_materiais", mats.length ? "<ul>" + mats.map((m) => "<li>" + esc(m) + "</li>").join("") + "</ul>" : ""],
      ["f_fabricacao", esc(campo(p, "fabricacao"))],
      ["f_montagem", esc(campo(p, "montagem"))],
      ["f_data", esc(formatarData(p.data))],
    ].filter((l) => l[1]);

    const secoes = campo(p, "secoes") || [];
    const ant = P[(i - 1 + P.length) % P.length], prox = P[(i + 1) % P.length];
    const vistas = p.modelo && p.imagens.length;

    return (
      '<section class="secao secao--proj"><div class="cont">' +
        '<a class="voltar" href="' + esc(ultimaLista) + '">' + I_VOLTAR + esc(t("voltar")) + "</a>" +
        '<header class="proj__cab">' +
          "<h1>" + esc(campo(p, "nome")) + "</h1>" +
          '<p class="proj__meta">' + p.categorias.map((c) => esc(cat(c))).join(" · ") +
            (p.produzido ? '<span class="selo-ok">' + esc(t("fabricado")) + "</span>" : "") + "</p>" +
          (lang === "en" && !p.en ? '<p class="aviso">' + esc(t("so_pt")) + "</p>" : "") +
        "</header>" +

        '<div class="visor">' +
          (vistas ? '<div class="seg" role="tablist">' +
            '<button type="button" class="seg__btn" role="tab" data-vista="3d">' + I_CUBO + esc(t("vista_3d")) + "</button>" +
            '<button type="button" class="seg__btn" role="tab" data-vista="img">' + esc(t("vista_imagens")) + " <b>" + p.imagens.length + "</b></button>" +
          "</div>" : "") +
          (p.modelo ?
            '<div class="palco palco--3d" id="palco-3d">' +
              '<model-viewer id="mv" camera-controls touch-action="pan-y" interaction-prompt="none" environment-image="neutral" exposure="0.95" shadow-intensity="0.7" shadow-softness="1" camera-orbit="-35deg 68deg auto" min-camera-orbit="auto auto auto" max-camera-orbit="auto auto 250%" interpolation-decay="120"' +
                (p.capa ? ' poster="' + img(p, p.capa) + '"' : "") + ' alt="' + esc(campo(p, "nome")) + '"></model-viewer>' +
              '<div class="carga" id="carga"><span></span></div>' +
              '<p class="palco__msg" id="msg-3d" role="status">' + esc(t("carregando_3d")) + "</p>" +
              '<div class="palco__barra">' +
                '<span class="dica" id="dica-3d">' + esc(t(toque ? "dica_3d_curta" : "dica_3d")) + "</span>" +
                '<span class="palco__btns">' +
                  '<button type="button" class="acao-btn" id="mv-acao" hidden>' + I_MOVER + "<span>" + esc(t("acao_abrir")) + "</span></button>" +
                  '<button type="button" class="icone-btn" id="mv-reset" aria-label="' + esc(t("resetar_vista")) + '" title="' + esc(t("resetar_vista")) + '">' + I_RESET + "</button>" +
                  '<button type="button" class="icone-btn" id="mv-tela" aria-label="' + esc(t("tela_cheia")) + '" title="' + esc(t("tela_cheia")) + '">' + I_TELA + "</button>" +
                "</span>" +
              "</div>" +
            "</div>" : "") +
          (p.imagens.length ?
            '<div class="vista-img" id="vista-img"' + (p.modelo ? " hidden" : "") + ">" +
              '<button type="button" class="palco" id="palco" aria-label="' + esc(t("ampliar")) + '"><img id="palco-img" alt=""><span class="palco__tipo" id="palco-tipo"></span></button>' +
              '<div class="miniaturas" id="miniaturas"></div>' +
            "</div>" : "") +
        "</div>" +

        '<div class="proj__corpo">' +
          '<div class="proj__texto">' +
            secoes.map((s) => '<section class="bloco"><h2>' + esc(s.titulo) + "</h2>" + textoHTML(s.texto) + "</section>").join("") +
          "</div>" +
          (linhas.length ? '<aside class="ficha"><h2>' + esc(t("ficha")) + "</h2><dl>" +
            linhas.map((l) => "<div><dt>" + esc(t(l[0])) + "</dt><dd>" + l[1] + "</dd></div>").join("") +
          "</dl></aside>" : "") +
        "</div>" +

        (P.length > 1 ? '<nav class="proj__nav">' +
          '<a href="#/projeto/' + esc(ant.slug) + '"><small>' + esc(t("anterior")) + "</small><span>" + esc(campo(ant, "nome")) + "</span></a>" +
          '<a class="dir" href="#/projeto/' + esc(prox.slug) + '"><small>' + esc(t("proximo")) + "</small><span>" + esc(campo(prox, "nome")) + "</span></a>" +
        "</nav>" : "") +
      "</div></section>"
    );
  }

  function ligarProjeto(slug) {
    const p = P.find((x) => x.slug === slug);
    if (!p) return;
    galeriaProj = p;
    galeria = p.imagens;
    let atual = 0;

    const palcoImg = document.getElementById("palco-img");
    const mostrar = (k) => {
      atual = k;
      const m = galeria[k];
      if (!m || !palcoImg) return;
      palcoImg.src = img(p, m.arquivo);
      palcoImg.alt = campo(p, "nome") + " — " + t("tipo_" + m.tipo);
      palcoImg.classList.remove("troca"); void palcoImg.offsetWidth; palcoImg.classList.add("troca");
      document.getElementById("palco-tipo").textContent = t("tipo_" + m.tipo) + (galeria.length > 1 ? " · " + (k + 1) + "/" + galeria.length : "");
      main.querySelectorAll(".mini").forEach((b, j) => { b.classList.toggle("ativo", j === k); b.setAttribute("aria-current", j === k); });
    };
    const mini = document.getElementById("miniaturas");
    if (mini) mini.innerHTML = galeria.length > 1 ? galeria.map((m, k) =>
      '<button type="button" class="mini" data-k="' + k + '" aria-label="' + esc(t("imagem_de", { i: k + 1, n: galeria.length })) + '"><img loading="lazy" src="' + img(p, m.arquivo) + '" alt=""></button>').join("") : "";
    mostrar(0);

    const vista = (v) => {
      main.querySelectorAll("[data-vista]").forEach((b) => { const on = b.dataset.vista === v; b.classList.toggle("ativo", on); b.setAttribute("aria-selected", on); });
      const p3 = document.getElementById("palco-3d"), pi = document.getElementById("vista-img");
      if (p3) p3.hidden = v !== "3d";
      if (pi) pi.hidden = v !== "img";
    };
    if (p.modelo) { vista("3d"); ligar3D(p); }

    main.addEventListener("click", (e) => {
      const v = e.target.closest("[data-vista]"); if (v) vista(v.dataset.vista);
      const m = e.target.closest(".mini"); if (m) mostrar(+m.dataset.k);
      if (e.target.closest("#palco")) abrirLightbox(atual);
    });
  }

  // --- visualizador 3D (model-viewer, carregado só quando há modelo) ---
  const scripts = {};
  function carregarScript(src) {
    return scripts[src] || (scripts[src] = new Promise((ok, erro) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok;
      s.onerror = () => { delete scripts[src]; s.remove(); erro(new Error(src)); };
      document.head.appendChild(s);
    }));
  }
  function ligar3D(p) {
    const mv = document.getElementById("mv"), palco = document.getElementById("palco-3d");
    const msg = document.getElementById("msg-3d"), carga = document.getElementById("carga");
    const orbitaInicial = mv.getAttribute("camera-orbit");
    const falhar = () => {
      if (!mv.isConnected) return;
      msg.textContent = t("erro_3d"); msg.hidden = false; carga.hidden = true;
      palco.classList.add("palco--erro");
    };
    Promise.all([carregarScript("assets/vendor/model-viewer.min.js"), carregarScript(img(p, "modelo.js"))])
      .then(() => { if (mv.isConnected) mv.src = "data:model/gltf-binary;base64," + window.MODELOS[p.slug]; })
      .catch(falhar);
    mv.addEventListener("progress", (e) => { carga.firstChild.style.transform = "scaleX(" + e.detail.totalProgress + ")"; });
    mv.addEventListener("load", () => { msg.hidden = true; carga.hidden = true; palco.classList.add("pronto"); });
    mv.addEventListener("error", falhar);
    // a dica some depois que a pessoa começa a girar
    mv.addEventListener("camera-change", (e) => { if (e.detail.source === "user-interaction") palco.classList.add("usado"); });
    mv.addEventListener("load", () => ligarMovimento(mv, palco), { once: true });
    document.getElementById("mv-reset").onclick = () => {
      mv.cameraOrbit = orbitaInicial; mv.cameraTarget = "auto auto auto"; mv.fieldOfView = "auto";
    };
    document.getElementById("mv-tela").addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (palco.requestFullscreen) palco.requestFullscreen();
    });
  }

  // Modelos com animação (ex.: trava que abre e fecha): t=0 é a posição fechada, o fim é a aberta.
  // Clicar na peça (sem arrastar) ou no botão alterna; o movimento pode ser invertido no meio.
  async function ligarMovimento(mv, palco) {
    const nomes = mv.availableAnimations || [];
    if (!nomes.length) return;
    const btn = document.getElementById("mv-acao"), rotulo = btn.querySelector("span");
    mv.animationName = nomes[0];
    mv.play(); mv.pause();
    const fim = mv.duration - 0.001;                  // exatamente "duration" volta ao início (animação em loop)
    // enquadra o movimento inteiro (posição aberta e fechada), não só a pose inicial
    const medir = async (tempo) => {
      mv.currentTime = tempo;
      await mv.updateFraming(); mv.jumpCameraToGoal();
      return { r: mv.getCameraOrbit().radius, c: mv.getCameraTarget() };
    };
    try {
      const a = await medir(fim), f = await medir(0);
      const meio = (k) => (a.c[k] + f.c[k]) / 2;
      const r = Math.max(a.r, f.r) + Math.hypot(a.c.x - f.c.x, a.c.y - f.c.y, a.c.z - f.c.z) / 2;
      const orbita = mv.getAttribute("camera-orbit").replace(/\S+$/, (r * 1.2).toFixed(4) + "m");
      const alvoCam = meio("x") + "m " + meio("y") + "m " + meio("z") + "m";
      mv.cameraTarget = alvoCam; mv.cameraOrbit = orbita; mv.jumpCameraToGoal();
      document.getElementById("mv-reset").onclick = () => { mv.cameraOrbit = orbita; mv.cameraTarget = alvoCam; mv.fieldOfView = "auto"; };
    } catch (e) { mv.currentTime = 0; }
    if (!mv.isConnected) return;
    document.getElementById("dica-3d").textContent = t(toque ? "dica_mov_curta" : "dica_mov");
    btn.hidden = false;
    palco.classList.add("animado");
    let alvo = 0, quadro = 0, antes = 0;
    const passo = (agora) => {
      const dt = antes ? Math.min((agora - antes) / 1000, 0.1) : 0;
      antes = agora;
      const falta = alvo - mv.currentTime;
      if (!mv.isConnected) return;
      if (Math.abs(falta) <= dt) { mv.currentTime = alvo; quadro = 0; antes = 0; return; }
      mv.currentTime += Math.sign(falta) * dt;
      quadro = requestAnimationFrame(passo);
    };
    const alternar = () => {
      alvo = alvo ? 0 : fim;
      rotulo.textContent = t(alvo ? "acao_fechar" : "acao_abrir");
      btn.setAttribute("aria-pressed", alvo > 0);
      palco.classList.add("usado");
      if (!anima) { mv.currentTime = alvo; return; }
      if (!quadro) quadro = requestAnimationFrame(passo);
    };
    btn.addEventListener("click", alternar);
    let ini = null;                                   // clique "limpo" na peça: sem arrastar e rápido
    mv.addEventListener("pointerdown", (e) => { ini = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    mv.addEventListener("pointerup", (e) => {
      if (!ini || e.button > 0) return;
      const parado = Math.hypot(e.clientX - ini.x, e.clientY - ini.y) < 6 && performance.now() - ini.t < 350;
      ini = null;
      if (parado) alternar();
    });
  }

  function formatarData(d) {
    if (!d) return "";
    const [a, m] = d.split("-");
    if (!m) return a;
    return new Date(+a, +m - 1, 1).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", { month: "short", year: "numeric" });
  }

  // --- lightbox ---
  const lb = document.getElementById("lightbox");
  let lbI = 0;
  // <dialog> modal: o navegador cuida do Esc, do foco preso dentro e da volta do foco ao fechar
  function abrirLightbox(i) { irLightbox(i); lb.showModal(); }
  const fecharLightbox = () => lb.close();
  function irLightbox(i) {
    lbI = (i + galeria.length) % galeria.length;
    const m = galeria[lbI];
    const im = lb.querySelector("img");
    im.src = img(galeriaProj, m.arquivo);
    im.alt = campo(galeriaProj, "nome") + " — " + t("tipo_" + m.tipo);
    lb.querySelector("figcaption").textContent = t("tipo_" + m.tipo) + " · " + (lbI + 1) + "/" + galeria.length;
    lb.querySelectorAll(".lightbox__nav").forEach((b) => (b.hidden = galeria.length < 2));
  }
  lb.addEventListener("click", (e) => {
    const a = e.target.closest("[data-acao]");
    if (a) { a.dataset.acao === "fechar" ? fecharLightbox() : irLightbox(lbI + (a.dataset.acao === "prox" ? 1 : -1)); }
    else if (e.target === lb || e.target.tagName === "FIGURE") fecharLightbox();
  });
  // deslizar o dedo troca a imagem
  let toqueX = null;
  lb.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX; toqueX = null;
    if (Math.abs(dx) > 50 && galeria.length > 1) irLightbox(lbI + (dx < 0 ? 1 : -1));
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.open) return;
    if (e.key === "ArrowRight") irLightbox(lbI + 1);
    if (e.key === "ArrowLeft") irLightbox(lbI - 1);
  });

  // --- sobre / contato ---
  function blocoContato() {
    const c = C.contato || {};
    const itens = [
      c.email && ["c_email", "mailto:" + c.email, c.email, '<path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/>'],
      c.linkedin && ["c_linkedin", c.linkedin, c.linkedin.replace(/^https?:\/\/(www\.)?/, ""), '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7"/>'],
      c.whatsapp && ["c_whatsapp", "https://wa.me/" + c.whatsapp, "+" + c.whatsapp.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, "$1 $2 $3-$4"), '<path d="M5 19l1.2-3.6A7.5 7.5 0 1112 19.5a7.4 7.4 0 01-3.4-.8z"/>'],
      c.curriculo && ["c_curriculo", c.curriculo, c.curriculo, '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>'],
    ].filter(Boolean);
    if (!itens.length) return '<p class="aviso">' + esc(t("contato_vazio")) + "</p>";
    return '<div class="contatos">' + itens.map((it) =>
      '<a class="contato" href="' + esc(it[1]) + '" target="_blank" rel="noopener">' + ICONE(it[3]) + "<span><small>" + esc(t(it[0])) + "</small>" + esc(it[2]) + "</span>" + I_SETA + "</a>").join("") + "</div>";
  }

  // Lista do lado da página Sobre (experiência, formação, idiomas); some se estiver vazia no config.js.
  function listaSobre(k) {
    const itens = cfg(k) || [];
    if (!itens.length) return "";
    return "<h2>" + esc(t(k)) + '</h2><ul class="formacao">' +
      itens.map((f) => "<li><strong>" + esc(f.titulo) + "</strong><span>" + esc(f.texto) + "</span></li>").join("") + "</ul>";
  }

  function paginaSobre() {
    return (
      '<section class="cab-pagina"><div class="cont"><p class="sobretitulo">' + esc(cfg("cargo")) + "</p><h1>" + esc(t("sobre_titulo")) + "</h1></div></section>" +
      '<section class="secao secao--colada"><div class="cont sobre">' +
        '<div class="sobre__texto">' + (cfg("sobre") || []).map((s) => "<p>" + esc(s) + "</p>").join("") + "</div>" +
        '<aside class="sobre__lado">' +
          (C.foto ? '<figure class="perfil"><img class="foto" src="' + esc(C.foto) + '" alt="' + esc(C.nome + " — " + (cfg("subtitulo") || "")) + '" width="400" height="400">' +
            "<figcaption><strong>" + esc(C.nome) + "</strong>" + (cfg("local") ? "<span>" + esc(cfg("local")) + "</span>" : "") + "</figcaption></figure>" : "") +
          listaSobre("experiencia") + listaSobre("formacao") + listaSobre("idiomas") +
          "<h2>" + esc(t("competencias")) + "</h2>" +
          '<ul class="competencias">' + (cfg("competencias") || []).map((c) => "<li>" + esc(c) + "</li>").join("") + "</ul>" +
        "</aside>" +
      "</div></section>" +
      blocoCTA()
    );
  }

  function paginaContato() {
    return (
      '<section class="cab-pagina"><div class="cont"><h1>' + esc(t("contato_titulo")) + "</h1><p>" + esc(t("contato_sub")) + "</p></div></section>" +
      '<section class="secao secao--colada"><div class="cont">' + blocoContato() + "</div></section>"
    );
  }

  // ---------- movimento ----------
  // Só anima se o sistema não pedir "reduzir movimento". Sem JS, nada fica escondido.
  const anima = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (anima) document.documentElement.classList.add("anima");
  const REVELA = ".cartao, .bloco, .ficha, .sobre__texto p, .formacao li, .contato, .cta, .proj__nav a";
  const observador = anima ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visivel"); observador.unobserve(e.target); }
  }), { rootMargin: "0px 0px -5% 0px" }) : null;
  function revelar(raiz) {
    if (!observador) return;
    raiz.querySelectorAll(REVELA).forEach((el) => {
      if (el.classList.contains("revela")) return;
      const pos = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--atraso", (pos % 3) * 60 + "ms");
      el.classList.add("revela");
      observador.observe(el);
    });
  }

  const topo = document.querySelector(".topo");
  const aoRolar = () => topo.classList.toggle("rolado", window.scrollY > 8);
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  // ---------- SEO ----------
  // Título, descrição e tags de compartilhamento de cada página, no idioma atual.
  function meta(attr, nome, valor) {
    let el = document.head.querySelector("meta[" + attr + '="' + nome + '"]');
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, nome); document.head.appendChild(el); }
    el.setAttribute("content", valor);
  }
  const resumir = (s, n) => { s = String(s || "").replace(/\*\*|^\s*[-*]\s+/gm, "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; };

  function atualizarMeta(rota, proj) {
    const base = MARCA + " · " + (cfg("subtitulo") || "");
    const h1 = main.querySelector("h1");
    let titulo = MARCA + " · " + (cfg("seo_titulo") || cfg("subtitulo") || "");
    let desc = cfg("seo_descricao") || "";
    if (proj) {
      const s = campo(proj, "secoes") || [];
      titulo = campo(proj, "nome") + " · " + base;
      desc = resumir(campo(proj, "nome") + ". " + proj.categorias.map(cat).join(", ") + ". " + (s[0] ? s[0].texto : ""), 160);
    } else if (rota !== "inicio" && h1) {
      titulo = h1.textContent + " · " + base;
      if (rota === "projetos") desc = t("projetos_sub") + " " + desc;
      if (rota === "sobre") desc = resumir((cfg("sobre") || [])[0] || desc, 160);
      if (rota === "contato") desc = t("contato_sub") + " " + desc;
    }
    desc = resumir(desc, 160);
    document.title = titulo;
    meta("name", "description", desc);
    meta("property", "og:title", titulo);
    meta("property", "og:description", desc);
    meta("name", "twitter:title", titulo);
    meta("name", "twitter:description", desc);
    meta("property", "og:locale", lang === "pt" ? "pt_BR" : "en_US");
    meta("property", "og:locale:alternate", lang === "pt" ? "en_US" : "pt_BR");
    if (C.site_url) {
      const url = C.site_url.replace(/\/?$/, "/") + location.hash;
      let can = document.head.querySelector('link[rel="canonical"]');
      if (!can) { can = document.createElement("link"); can.rel = "canonical"; document.head.appendChild(can); }
      can.href = url;
      meta("property", "og:url", url);
      if (proj && proj.capa) meta("property", "og:image", C.site_url.replace(/\/?$/, "/") + img(proj, proj.capa));
    }
  }

  // ---------- roteador ----------
  // Lembra a rolagem das listas: ao voltar de um projeto, a página volta para onde estava.
  const rolagem = {};
  let rotaAtual = "";
  history.scrollRestoration = "manual";

  function rotear(mesmoLugar) {
    const h = location.hash.replace(/^#/, "") || "/";
    const [caminho, query] = h.split("?");
    const partes = caminho.split("/").filter(Boolean);
    const rota = partes[0] || "inicio";
    const vinhaDeProjeto = rotaAtual.indexOf("#/projeto/") === 0;
    if (rotaAtual) rolagem[rotaAtual] = window.scrollY;
    rotaAtual = "#" + h;
    let html = "", ligar = null, menu = rota;

    if (rota === "projetos") { lerFiltroDaURL(query); html = paginaProjetos(); ligar = ligarProjetos; }
    else if (rota === "projeto") { const s = decodeURIComponent(partes[1] || ""); html = paginaProjeto(s); ligar = () => ligarProjeto(s); menu = "projetos"; }
    else if (rota === "sobre") html = paginaSobre();
    else if (rota === "contato") html = paginaContato();
    else { html = paginaInicio(); ligar = ligarInicio; menu = "inicio"; }

    if (document.fullscreenElement) document.exitFullscreen();
    // recria o <main> para limpar eventos da página anterior
    const novo = main.cloneNode(false);
    main.replaceWith(novo);
    main = novo;
    novo.innerHTML = html;
    if (ligar) ligar();
    revelar(novo);

    document.querySelectorAll(".menu a").forEach((a) => {
      const on = a.dataset.rota === menu;
      a.classList.toggle("ativo", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    atualizarMeta(rota, rota === "projeto" ? P.find((p) => p.slug === decodeURIComponent(partes[1] || "")) : null);
    if (mesmoLugar) return;
    const volta = vinhaDeProjeto && rota !== "projeto" ? rolagem[rotaAtual] : undefined;
    window.scrollTo(0, volta || 0);
  }

  window.addEventListener("hashchange", () => rotear(false));
  aplicarIdioma();
  rotear(false);
})();
