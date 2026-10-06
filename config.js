// ============================================================
//  CONFIGURAÇÃO DO SITE — edite aqui seus dados pessoais.
//  Campos vazios ("") são escondidos automaticamente.
// ============================================================
window.CONFIG = {
  nome: "Lucas Guibes",   // nome completo: usado só nos metadados (SEO), não aparece no topo
  marca: "GUIBES",        // nome exibido no topo e no rodapé

  // Endereço público do site, quando publicado (ex.: "https://seu-usuario.github.io/portfolio/").
  // Preencha também as tags marcadas com SITE_URL no index.html.
  site_url: "",

  // Foto da página Sobre (coloque o arquivo na pasta do site; quadrada ou retrato, ~800 px de largura).
  foto: "foto-perfil.jpeg",

  contato: {
    email: "lbguibes@hotmail.com",
    linkedin: "https://www.linkedin.com/in/lucas-guibes",
    whatsapp: "5541984459883", // só números com DDI
    curriculo: "",             // ex.: "curriculo.pdf" (coloque o arquivo na pasta do site)
  },

  pt: {
    subtitulo: "Projetista mecânico",
    local: "Curitiba, Paraná, Brasil",
    seo_titulo: "Projetista mecânico em Curitiba | Modelagem 3D em SolidWorks",
    seo_descricao: "Projetista mecânico e engenheiro mecânico em Curitiba (PR): modelagem 3D em SolidWorks, desenho técnico 2D, montagens, estruturas metálicas e engenharia reversa para fabricação.",
    cargo: "Engenheiro Mecânico · Modelagem 3D",
    chamada: "Projetos mecânicos, do modelo 3D à peça fabricada.",
    resumo: "Engenheiro mecânico com formação técnica em informática e 10 anos de experiência em marketing e design. Desenvolvo peças, montagens e desenhos técnicos no SolidWorks, incluindo projetos de engenharia reversa.",
    sobre: [
      "Sou formado em Engenharia Mecânica e tenho curso técnico em Informática. Em paralelo à engenharia, construí uma carreira de 10 anos em marketing e design.",
      "Hoje atuo como projetista mecânico na indústria de máquinas e equipamentos pesados: desenvolvo e adapto peças e conjuntos, elaboro desenhos técnicos e modelos 3D de componentes e montagens no SolidWorks e acompanho a montagem, a fabricação e a inspeção técnica das peças.",
      "Essa combinação me permite unir o rigor técnico do projeto mecânico a uma comunicação visual clara: modelos bem construídos, desenhos fáceis de ler e apresentações que explicam o porquê de cada decisão.",
      "Aqui reúno projetos desenvolvidos no trabalho, muitos deles fabricados, e desafios de modelagem que faço para continuar evoluindo.",
    ],
    experiencia: [
      { titulo: "Projetista mecânico", texto: "Indústria de máquinas e equipamentos · 2025 – atual" },
      { titulo: "Marketing", texto: "Indústria · 2022 – 2025" },
      { titulo: "Designer gráfico", texto: "Freelance · 2015 – 2022" },
    ],
    formacao: [
      { titulo: "Engenharia Mecânica", texto: "Bacharelado · 2015 – 2020" },
      { titulo: "Técnico em Informática", texto: "Curso técnico · 2013 – 2014" },
      { titulo: "Inglês como segunda língua", texto: "Curso no exterior · 2015" },
    ],
    idiomas: [
      { titulo: "Português", texto: "Nativo" },
      { titulo: "Inglês", texto: "Profissional pleno" },
      { titulo: "Espanhol", texto: "Profissional" },
      { titulo: "Francês", texto: "Básico" },
    ],
    competencias: ["SolidWorks", "Modelagem de peças", "Montagens", "Desenho técnico 2D", "Engenharia reversa", "Acompanhamento de fabricação", "Inspeção técnica", "Estruturas metálicas", "Renderização", "SketchUp", "Comunicação visual"],
  },

  en: {
    subtitulo: "Mechanical designer",
    local: "Curitiba, Paraná, Brazil",
    seo_titulo: "Mechanical designer in Curitiba, Brazil | SolidWorks 3D modeling",
    seo_descricao: "Mechanical designer and mechanical engineer based in Curitiba, Brazil: SolidWorks 3D modeling, 2D technical drawings, assemblies, steel structures and reverse engineering for manufacturing.",
    cargo: "Mechanical Engineer · 3D Modeling",
    chamada: "Mechanical projects, from 3D model to manufactured part.",
    resumo: "Mechanical engineer with a technical background in IT and 10 years of experience in marketing and design. I develop parts, assemblies and technical drawings in SolidWorks, including reverse engineering projects.",
    sobre: [
      "I hold a degree in Mechanical Engineering and a technical diploma in IT. Alongside engineering, I built a 10-year career in marketing and design.",
      "I currently work as a mechanical designer in the heavy machinery and equipment industry: I develop and adapt parts and assemblies, produce technical drawings and 3D models of components and assemblies in SolidWorks, and follow the assembly, manufacturing and technical inspection of parts.",
      "This mix lets me combine the technical rigor of mechanical design with clear visual communication: well-built models, easy-to-read drawings and presentations that explain the reason behind each decision.",
      "Here I gather projects developed at work, many of them manufactured, and modeling challenges I take on to keep improving.",
    ],
    experiencia: [
      { titulo: "Mechanical designer", texto: "Machinery and equipment industry · 2025 – present" },
      { titulo: "Marketing", texto: "Industry · 2022 – 2025" },
      { titulo: "Graphic designer", texto: "Freelance · 2015 – 2022" },
    ],
    formacao: [
      { titulo: "Mechanical Engineering", texto: "Bachelor's degree · 2015 – 2020" },
      { titulo: "IT Technician", texto: "Technical course · 2013 – 2014" },
      { titulo: "English as a Second Language", texto: "Course abroad · 2015" },
    ],
    idiomas: [
      { titulo: "Portuguese", texto: "Native" },
      { titulo: "English", texto: "Full professional" },
      { titulo: "Spanish", texto: "Professional working" },
      { titulo: "French", texto: "Elementary" },
    ],
    competencias: ["SolidWorks", "Part modeling", "Assemblies", "2D technical drawing", "Reverse engineering", "Manufacturing follow-up", "Technical inspection", "Steel structures", "Rendering", "SketchUp", "Visual communication"],
  },

  // Tradução das categorias usadas nos info.md (escreva a categoria em português
  // no info.md e acrescente a tradução aqui). Categorias sem tradução aparecem como estão.
  categorias_en: {
    "Desenho mecânico": "Mechanical drawing",
    "Peça estática": "Static part",
    "Engenharia reversa": "Reverse engineering",
    "Montagem": "Assembly",
    "Estrutura metálica": "Steel structure",
  },
};
