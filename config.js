/* =========================================================
   CONFIGURAÇÃO PESSOAL
   Edite aqui seus dados — o site inteiro usa estas informações.
   ========================================================= */

const CONFIG = {
  email: "furlanigabriel49@gmail.com",
  github: "https://github.com/Furlani18",
  linkedin: "https://www.linkedin.com/in/gabriel-furlani-72727a30b/",

  // Coloque o PDF na pasta do portfólio com este nome ("" esconde o botão)
  curriculo: "Currículo Gabriel Furlani.pdf.pdf",

  // Formulário de contato:
  // 1. Crie uma conta grátis em https://formspree.io e um novo form
  // 2. Cole aqui o endpoint (ex: "https://formspree.io/f/abcdwxyz")
  // Vazio = o formulário abre o app de e-mail do visitante já preenchido
  formspree: "",

  // Contador de visitas (GoatCounter — grátis e sem cookies):
  // 1. Crie uma conta em https://www.goatcounter.com/signup
  // 2. Escolha um código (ex: "furlani") e cole aqui
  // 3. Veja as visitas em https://SEU-CODIGO.goatcounter.com
  goatcounter: ""
};

/* ---------- Trajetória (linha do tempo) ----------
   - periodo: texto livre (ex: "2025.1")
   - projetos: ids de projetos.js (viram atalhos clicáveis)
   - atual: true destaca o item como "agora"
*/
const TRAJETORIA = [
  {
    periodo: "2025.1",
    titulo: { pt: "Início em ADS", en: "Started my degree" },
    texto: {
      pt: "Entrei em Análise e Desenvolvimento de Sistemas e comecei pelos fundamentos: lógica, HTML, CSS e os primeiros passos com PHP e MySQL.",
      en: "Started my Systems Analysis and Development degree with the fundamentals: logic, HTML, CSS and my first steps with PHP and MySQL."
    },
    projetos: ["mini-php"]
  },
  {
    periodo: "2025.2",
    titulo: { pt: "Banco de dados e CRUDs", en: "Databases and CRUDs" },
    texto: {
      pt: "Aprofundei em modelagem relacional e SQL, construindo sistemas completos de cadastro — inclusive em grupo.",
      en: "Went deeper into relational modeling and SQL, building complete CRUD systems — including team projects."
    },
    projetos: ["crud-clientes", "autovenda"]
  },
  {
    periodo: "2026.1",
    titulo: { pt: "Sistemas de verdade", en: "Real-world systems" },
    texto: {
      pt: "Primeiros sistemas com regras de negócio, perfis de acesso e deploy: gestão de canis, help desk e gestão escolar.",
      en: "First systems with business rules, access roles and deployment: kennel management, help desk and school management."
    },
    projetos: ["canigest", "gesistec", "regime-escolar"]
  },
  {
    periodo: "2026.2",
    atual: true,
    titulo: { pt: "Agora", en: "Now" },
    texto: {
      pt: "Estudando React com TypeScript, Node.js e tempo real com Socket.io — e criando jogos no navegador nas horas vagas.",
      en: "Studying React with TypeScript, Node.js and real-time with Socket.io — and building browser games in my spare time."
    },
    projetos: ["autoelite", "draft-brasileirao"]
  }
];
