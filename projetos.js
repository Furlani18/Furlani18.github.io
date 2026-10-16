/* =========================================================
   DADOS DOS PROJETOS
   Para adicionar um projeto, copie um objeto e edite.
   - categoria: "sistema" | "web" | "esporte" | "jogo"
   - destaque: true coloca o projeto na faixa "Em destaque"
   - imagens: lista de prints (ex: ["img/canigest-1.png", "img/canigest-2.png"]).
     A primeira vira a capa; com 2+ aparece uma galeria no modal.
     Sem imagens, gera capa automática.
   - repo / demo: coloque os links quando tiver ("" esconde o botão)
   - jogavel: true + demo preenchido mostra o botão "Jogar aqui" (abre a demo dentro do modal)
   - preview: vídeo curto (.mp4/.webm) ou .gif que toca ao passar o mouse no card
     (ex: preview: "img/rabisco.mp4" — ideal: 5 a 10 s, sem som, até ~2 MB)
   - caso: página de estudo de caso (ex: "gesistec.html")
   - video / videoCapa: vídeo de apresentação (com som e controles) + imagem de capa.
     Vira o primeiro item da galeria do modal.
   - en: tradução para a versão em inglês do site
   ========================================================= */

const PROJETOS = [
  {
    id: "canigest",
    nome: "CANIGEST",
    categoria: "sistema",
    contexto: "Acadêmico",
    cor: "#22c55e",
    resumo: "Sistema de gestão para canis municipais com perfis administrativo e veterinário.",
    descricao: "Plataforma para organizar o dia a dia de canis municipais: cadastro de munícipes e pets, agendamentos, atendimentos veterinários, fichas médicas e controle de estoque. Back-end modular em Python sobre MySQL e interface web separada.",
    destaques: [
      "Back-end em módulos Python (auth, munícipes, agenda, fichas, estoque)",
      "Dois perfis de acesso: administrativo e veterinário",
      "Requisitos funcionais RF01–RF06 mapeados nas telas",
      "Modelagem relacional completa em MySQL (schema.sql)"
    ],
    en: {
      resumo: "Management system for municipal kennels with admin and veterinary roles.",
      descricao: "A platform to organize the daily routine of municipal kennels: citizen and pet records, scheduling, veterinary appointments, medical records and inventory control. Modular Python back-end on MySQL with a separate web interface.",
      destaques: [
        "Python back-end split into modules (auth, citizens, schedule, records, inventory)",
        "Two access roles: administrative and veterinary",
        "Functional requirements FR01–FR06 mapped to screens",
        "Full relational model in MySQL (schema.sql)"
      ]
    },
    tecnologias: ["Python", "MySQL", "HTML", "CSS", "JavaScript"],
    imagens: [], repo: "", demo: ""
  },
  {
    id: "gesistec",
    nome: "GESISTEC",
    categoria: "sistema",
    contexto: "Acadêmico",
    destaque: true,
    cor: "#f97316",
    resumo: "Help desk web com perfis de admin, colaborador e cliente, API em PHP e deploy automático.",
    descricao: "Sistema de chamados com abertura, conversa e acompanhamento de tickets para várias empresas. Corrigi a persistência dos campos de descrição, migrei o back-end de Node.js/Express para uma API em PHP para hospedar no InfinityFree e adicionei recuperação de senha, limite de tentativas e deploy automático.",
    destaques: [
      "Três perfis (admin, colaborador e cliente) atendendo várias empresas",
      "API REST em PHP com sessão por token salvo como hash SHA-256",
      "Recuperação de senha por e-mail e limite de tentativas contra força bruta",
      "Histórico de status e prioridade dentro da conversa do chamado",
      "Deploy automático com GitHub Actions + FTP no InfinityFree"
    ],
    en: {
      resumo: "Web help desk with admin, staff and customer roles, a PHP API and automated deploys.",
      descricao: "Ticketing system for opening, discussing and tracking support requests across multiple companies. I fixed persistence of the description fields, migrated the back-end from Node.js/Express to a PHP API to host it on InfinityFree, and added password recovery, rate limiting and automated deployment.",
      destaques: [
        "Three roles (admin, staff and customer) serving multiple companies",
        "PHP REST API with session tokens stored as SHA-256 hashes",
        "Password recovery by email and rate limiting against brute force",
        "Status and priority history shown inside the ticket thread",
        "Automated deploys with GitHub Actions + FTP to InfinityFree"
      ]
    },
    tecnologias: ["PHP", "MySQL", "JavaScript", "GitHub Actions", "PHPMailer", "Node.js"],
    imagens: ["img/gesistec-1.jpg", "img/gesistec-solucoes.jpg", "img/gesistec-login.jpg"], repo: "", demo: "https://gesistec.infinityfree.me",
    caso: "gesistec.html",
    video: "img/gesistec-video.mp4", videoCapa: "img/gesistec-video-capa.jpg",
    preview: "img/gesistec-preview.mp4"
  },
  {
    id: "regime-escolar",
    nome: "Regime Escolar",
    categoria: "sistema",
    contexto: "Acadêmico",
    cor: "#eab308",
    resumo: "Gestão escolar com turmas, alunos, notas e frequência — visual de caderneta.",
    descricao: "Aplicação de gestão escolar com cadastro de turmas, alunos, professores e disciplinas, lançamento de notas e controle de frequência. Identidade visual inspirada em caderneta escolar e JavaScript totalmente modularizado.",
    destaques: [
      "CRUD de turmas, alunos, professores e disciplinas",
      "Lançamento de notas e frequência",
      "Estética de \"caderneta escolar\"",
      "JS refatorado em arquivos por página (js/pages/)"
    ],
    en: {
      resumo: "School management with classes, students, grades and attendance — notebook-style UI.",
      descricao: "School management app to register classes, students, teachers and subjects, record grades and track attendance. Visual identity inspired by a school notebook, with fully modular JavaScript.",
      destaques: [
        "CRUD for classes, students, teachers and subjects",
        "Grade and attendance tracking",
        "\"School notebook\" look and feel",
        "JS refactored into per-page files (js/pages/)"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "localStorage"],
    imagens: ["img/regime-escolar-1.jpg"], repo: "https://github.com/Furlani18/regime-escolar", demo: "https://furlani18.github.io/regime-escolar/"
  },
  {
    id: "crud-clientes",
    nome: "Gestão de Clientes",
    categoria: "sistema",
    contexto: "Acadêmico · Grupo",
    cor: "#06b6d4",
    resumo: "CRUD temático de clientes em PHP/MySQL para Laboratório de Banco de Dados.",
    descricao: "Sistema de gerenciamento de clientes desenvolvido em grupo para a disciplina de Laboratório de Banco de Dados, com operações completas de cadastro, consulta, edição e exclusão.",
    destaques: [
      "CRUD completo integrado ao MySQL",
      "Interface temática",
      "Trabalho em equipe"
    ],
    en: {
      resumo: "Themed customer CRUD in PHP/MySQL for a Database Lab course.",
      descricao: "Customer management system built as a team for the Database Lab course, with full create, read, update and delete operations.",
      destaques: [
        "Full CRUD backed by MySQL",
        "Themed interface",
        "Team project"
      ]
    },
    tecnologias: ["PHP", "MySQL", "HTML", "CSS"],
    imagens: [], repo: "", demo: ""
  },
  {
    id: "mini-php",
    nome: "Mini Sistema PHP",
    categoria: "sistema",
    contexto: "Estudo",
    cor: "#8b5cf6",
    resumo: "Cadastro, listagem e login de usuários com PHP e MySQL.",
    descricao: "Sistema enxuto para praticar os fundamentos de PHP com banco de dados: cadastro de usuários, listagem e autenticação com sessão.",
    destaques: [
      "Cadastro e listagem de usuários",
      "Login com sessões PHP",
      "Persistência em MySQL local"
    ],
    en: {
      resumo: "User sign-up, listing and login with PHP and MySQL.",
      descricao: "A lean system to practice PHP fundamentals with a database: user sign-up, listing and session-based authentication.",
      destaques: [
        "User sign-up and listing",
        "Login with PHP sessions",
        "Local MySQL persistence"
      ]
    },
    tecnologias: ["PHP", "MySQL", "HTML", "CSS"],
    imagens: [], repo: "https://github.com/Furlani18/Mini_Sistema", demo: ""
  },
  {
    id: "prazo",
    nome: "Prazo.",
    categoria: "web",
    contexto: "Pessoal",
    cor: "#ef4444",
    resumo: "Organizador de prazos acadêmicos que roda 100% no navegador.",
    descricao: "Ferramenta front-end para acompanhar entregas e provas da faculdade, com dados salvos no próprio navegador.",
    destaques: [
      "Cadastro e acompanhamento de prazos",
      "Funciona sem servidor (localStorage)",
      "Interface minimalista"
    ],
    en: {
      resumo: "Academic deadline organizer that runs 100% in the browser.",
      descricao: "Front-end tool to keep track of college assignments and exams, with data saved in the browser itself.",
      destaques: [
        "Create and track deadlines",
        "No server needed (localStorage)",
        "Minimalist interface"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "localStorage"],
    imagens: ["img/prazo-1.jpg"], repo: "https://github.com/Furlani18/prazo", demo: "https://furlani18.github.io/prazo/",
    preview: "img/prazo-preview.mp4"
  },
  {
    id: "vertice",
    nome: "Vértice Imóveis",
    categoria: "web",
    contexto: "Portfólio",
    cor: "#0ea5e9",
    resumo: "Site imobiliário com portal público e painel administrativo.",
    descricao: "Portal de imóveis com vitrine pública e área administrativa para gerenciar anúncios, seguindo minha arquitetura padrão com camada de dados compartilhada.",
    destaques: [
      "Portal público de imóveis",
      "Painel admin com autenticação",
      "Camada de dados db.js compartilhada"
    ],
    en: {
      resumo: "Real estate website with a public portal and admin panel.",
      descricao: "Property portal with a public showcase and an admin area to manage listings, following my standard architecture with a shared data layer.",
      destaques: [
        "Public property portal",
        "Admin panel with authentication",
        "Shared db.js data layer"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "localStorage"],
    imagens: [], repo: "", demo: ""
  },
  {
    id: "autoelite",
    nome: "AutoElite",
    categoria: "web",
    contexto: "Portfólio",
    cor: "#c9a54a",
    resumo: "Concessionária online em PHP + MySQL com catálogo filtrável, painel de leads e backup automático.",
    descricao: "Plataforma de venda de veículos com catálogo filtrável por marca, tipo, combustível e preço, galeria de fotos por carro, favoritos e formulário de avaliação de usados. O painel administrativo gerencia estoque, fotos e leads e mostra os carros mais vistos. Back-end em PHP com MySQL, login com bloqueio por tentativas, recuperação de senha por e-mail, backup diário e deploy automático.",
    destaques: [
      "Catálogo com filtros, galeria de fotos, favoritos e contador de visualizações",
      "Painel admin: estoque, upload de fotos validado e funil de leads (novo → negociando → vendido)",
      "Login com bloqueio após 5 tentativas e redefinição de senha por link que expira",
      "Backup diário do banco enviado por e-mail, sem precisar de cron",
      "Deploy automático com GitHub Actions + FTP no InfinityFree"
    ],
    en: {
      resumo: "Online car dealership in PHP + MySQL with a filterable catalog, lead dashboard and automatic backups.",
      descricao: "Car sales platform with a catalog filterable by brand, type, fuel and price, a photo gallery per car, favorites and a trade-in valuation form. The admin panel manages inventory, photos and leads and shows the most viewed cars. PHP back-end with MySQL, login lockout after failed attempts, password reset by email, daily backups and automated deployment.",
      destaques: [
        "Catalog with filters, photo gallery, favorites and view counter",
        "Admin panel: inventory, validated photo uploads and a lead funnel (new → negotiating → sold)",
        "Login lockout after 5 attempts and expiring password-reset links",
        "Daily database backup sent by email, no cron required",
        "Automated deploys with GitHub Actions + FTP to InfinityFree"
      ]
    },
    tecnologias: ["PHP", "MySQL", "JavaScript", "PHPMailer", "GitHub Actions", "HTML", "CSS"],
    imagens: ["img/autoelite-1.jpg", "img/autoelite-catalogo.jpg", "img/autoelite-detalhe.jpg", "img/autoelite-avaliacao.jpg"],
    repo: "https://github.com/Furlani18/Auto-Elite", demo: "https://autoelite.infinityfree.me",
    caso: "autoelite.html",
    preview: "img/autoelite-preview.mp4"
  },
  {
    id: "autovenda",
    nome: "AutoVenda",
    categoria: "web",
    contexto: "Portfólio",
    cor: "#64748b",
    resumo: "Site de vendas de veículos com back-end PHP e MySQL.",
    descricao: "Site de vendas de veículos com páginas dinâmicas em PHP, banco MySQL e front em HTML/CSS/JS, com o código organizado em arquivos separados.",
    destaques: [
      "Catálogo de veículos dinâmico",
      "Back-end em PHP com MySQL",
      "Código separado por responsabilidade"
    ],
    en: {
      resumo: "Car sales website with a PHP and MySQL back-end.",
      descricao: "Car sales website with dynamic PHP pages, a MySQL database and an HTML/CSS/JS front-end, with code organized into separate files.",
      destaques: [
        "Dynamic vehicle catalog",
        "PHP back-end with MySQL",
        "Code split by responsibility"
      ]
    },
    tecnologias: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    imagens: [], repo: "", demo: ""
  },
  {
    id: "brasa-nobre",
    nome: "Brasa Nobre",
    categoria: "web",
    contexto: "Portfólio",
    cor: "#b45309",
    resumo: "Site de restaurante com pedidos online e reservas.",
    descricao: "Site para restaurante com cardápio, sistema de pedidos e agendamento de reservas.",
    destaques: [
      "Cardápio e carrinho de pedidos",
      "Reserva de mesas",
      "Visual temático de churrascaria"
    ],
    en: {
      resumo: "Restaurant website with online ordering and reservations.",
      descricao: "Restaurant website with a menu, ordering system and table reservations.",
      destaques: [
        "Menu and order cart",
        "Table reservations",
        "Steakhouse-themed visuals"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript"],
    imagens: [], repo: "", demo: ""
  },
  {
    id: "futstats",
    nome: "FUTSTATS",
    categoria: "esporte",
    contexto: "Portfólio",
    destaque: true,
    cor: "#10b981",
    resumo: "Estatísticas de futebol inspiradas no SofaScore, com classificação dinâmica.",
    descricao: "Site de estatísticas de futebol com partidas, times e tabela de classificação calculada automaticamente, além de painel administrativo com CRUD completo.",
    destaques: [
      "Tabela de classificação dinâmica",
      "CRUD admin de times e partidas",
      "Layout inspirado no SofaScore"
    ],
    en: {
      resumo: "SofaScore-inspired football stats with a live-calculated league table.",
      descricao: "Football statistics website with matches, teams and an automatically calculated league table, plus an admin panel with full CRUD.",
      destaques: [
        "Dynamic league table",
        "Admin CRUD for teams and matches",
        "SofaScore-inspired layout"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "localStorage"],
    imagens: ["img/futstats-1.jpg"], repo: "https://github.com/Furlani18/futstats", demo: "https://furlani18.github.io/futstats/",
    preview: "img/futstats-preview.mp4"
  },
  {
    id: "esporte-total",
    nome: "Esporte Total",
    categoria: "esporte",
    contexto: "Portfólio",
    cor: "#2563eb",
    resumo: "Portal de notícias esportivas com painel admin e ticker ao vivo.",
    descricao: "Portal de notícias esportivas com publicação de matérias pelo painel administrativo e faixa de placares ao vivo.",
    destaques: [
      "Ticker de placares ao vivo",
      "Painel admin para publicar notícias",
      "Layout de portal jornalístico"
    ],
    en: {
      resumo: "Sports news portal with an admin panel and live score ticker.",
      descricao: "Sports news portal where articles are published from an admin panel, with a live score ticker.",
      destaques: [
        "Live score ticker",
        "Admin panel to publish news",
        "News portal layout"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "localStorage"],
    imagens: [], repo: "", demo: ""
  },
  {
    id: "pelada-manager",
    nome: "Pelada Manager",
    categoria: "esporte",
    contexto: "Pessoal",
    cor: "#84cc16",
    resumo: "Gerenciador de pelada: cadastro de jogadores e sorteio de times.",
    descricao: "Site para organizar a pelada da semana: cadastro de jogadores e sorteio de times equilibrados, com evolução planejada para novas funções.",
    destaques: [
      "Cadastro de jogadores",
      "Sorteio de times",
      "Código separado em arquivos"
    ],
    en: {
      resumo: "Pickup football manager: player roster and random team draw.",
      descricao: "Website to organize the weekly pickup game: player registration and balanced team draws, with more features planned.",
      destaques: [
        "Player registration",
        "Random team draw",
        "Code split into files"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript"],
    imagens: [], repo: "", demo: ""
  },
  {
    id: "draft-brasileirao",
    nome: "Draft Brasileirão",
    categoria: "jogo",
    contexto: "Pessoal",
    destaque: true,
    cor: "#facc15",
    resumo: "Jogo de draft de futebol com simulação estatística de partidas.",
    descricao: "Jogo de draft com elencos históricos do futebol brasileiro. Partidas simuladas com modelos estatísticos e back-end planejado para multiplayer em tempo real.",
    destaques: [
      "Simulação com Poisson / Binomial Negativa",
      "Elencos históricos em JSON",
      "Multiplayer com Node.js + Socket.io"
    ],
    en: {
      resumo: "Football draft game with statistically simulated matches.",
      descricao: "Draft game featuring historic Brazilian football squads. Matches are simulated with statistical models, with a back-end planned for real-time multiplayer.",
      destaques: [
        "Poisson / Negative Binomial match simulation",
        "Historic squads stored as JSON",
        "Multiplayer with Node.js + Socket.io"
      ]
    },
    tecnologias: ["Node.js", "Socket.io", "JavaScript", "JSON"],
    imagens: [], repo: "", demo: "", jogavel: true
  },
  {
    id: "academia-tycoon",
    nome: "Academia Tycoon",
    categoria: "jogo",
    contexto: "Pessoal",
    cor: "#ec4899",
    resumo: "Tycoon de gerenciar academia com visual 3D.",
    descricao: "Jogo de gerenciamento em que você administra uma academia: aulas coletivas com horário, planos mensal e anual, concorrência abrindo ao lado e alunos andando pelo piso.",
    destaques: [
      "Aulas coletivas com grade de horários",
      "Planos mensal e anual",
      "Concorrente dinâmico",
      "Visual 3D de pessoas e aparelhos"
    ],
    en: {
      resumo: "Gym management tycoon game with 3D visuals.",
      descricao: "Management game where you run a gym: scheduled group classes, monthly and yearly plans, a competitor opening next door and members walking around the floor.",
      destaques: [
        "Group classes with a timetable",
        "Monthly and yearly plans",
        "Dynamic competitor",
        "3D people and equipment"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "3D"],
    imagens: [], repo: "", demo: "", jogavel: true
  },
  {
    id: "rabisco",
    nome: "Rabisco",
    categoria: "jogo",
    contexto: "Pessoal",
    cor: "#6366f1",
    resumo: "Shooter arcade de nave com loja de melhorias.",
    descricao: "Jogo arcade de nave no espaço com visual realista, menu inicial e loja para comprar upgrades entre as partidas.",
    destaques: [
      "Gameplay arcade de tiro",
      "Loja de melhorias da nave",
      "Visual espacial realista"
    ],
    en: {
      resumo: "Arcade spaceship shooter with an upgrade shop.",
      descricao: "Arcade space shooter with realistic visuals, a start menu and a shop to buy upgrades between runs.",
      destaques: [
        "Arcade shooting gameplay",
        "Ship upgrade shop",
        "Realistic space visuals"
      ]
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "Canvas"],
    imagens: [], repo: "", demo: "", jogavel: true
  }
];
