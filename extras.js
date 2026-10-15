/* =========================================================
   EXTRAS — GitHub ao vivo, terminal (Ctrl+K) e contador de visitas
   Usa as funções globais de script.js ($, t, idioma, abrirModal...)
   ========================================================= */

// Texto curto nos dois idiomas, usado no terminal
const tt = (pt, en) => (idioma === "pt" ? pt : en);

/* ---------- GitHub ao vivo ---------- */
const GH_USER = ((CONFIG.github || "").match(/github\.com\/([^/?#]+)/) || [])[1];
const GH_CORES = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", PHP: "#4f5d95", Python: "#3572a5",
  HTML: "#e34c26", CSS: "#663399", Java: "#b07219", "C#": "#178600", SQL: "#e38c00"
};
let ghDados = null;

function tempoRelativo(data) {
  const seg = (new Date(data) - Date.now()) / 1000;
  const fmt = new Intl.RelativeTimeFormat(idioma === "pt" ? "pt-BR" : "en", { numeric: "auto" });
  const passos = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [un, s] of passos) if (Math.abs(seg) >= s) return fmt.format(Math.round(seg / s), un);
  return fmt.format(0, "minute");
}

async function buscarGitHub() {
  // Guarda por 1h na sessão: a API pública permite só 60 requisições/hora por IP
  try {
    const cache = JSON.parse(sessionStorage.getItem("gh"));
    if (cache && Date.now() - cache.em < 3600e3) return cache;
  } catch {}

  const pegar = url => fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
  const [user, repos] = await Promise.all([
    pegar(`https://api.github.com/users/${GH_USER}`),
    pegar(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`)
  ]);
  const dados = {
    em: Date.now(),
    user: { login: user.login, nome: user.name, avatar: user.avatar_url, url: user.html_url, repos: user.public_repos, seguidores: user.followers, criado: user.created_at },
    repos: repos.filter(r => !r.fork).map(r => ({
      nome: r.name, url: r.html_url, desc: r.description, lang: r.language,
      estrelas: r.stargazers_count, push: r.pushed_at, site: r.has_pages
    }))
  };
  try { sessionStorage.setItem("gh", JSON.stringify(dados)); } catch {}
  return dados;
}

function renderGitHub() {
  const box = $("#ghBox");
  if (!ghDados) return;
  const { user, repos } = ghDados;

  const contagem = {};
  repos.forEach(r => r.lang && (contagem[r.lang] = (contagem[r.lang] || 0) + 1));
  const langs = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
  const total = langs.reduce((s, [, n]) => s + n, 0) || 1;
  const ultimo = repos.reduce((m, r) => (r.push > m ? r.push : m), "");
  const cor = l => GH_CORES[l] || "var(--muted)";

  box.innerHTML = `
    <div class="gh__profile">
      <a class="gh__user" href="${user.url}" target="_blank" rel="noopener">
        <img src="${user.avatar}" alt="" width="56" height="56" loading="lazy">
        <span><strong>${user.nome || user.login}</strong><small class="mono">@${user.login}</small></span>
      </a>
      <div class="gh__stats">
        <div><strong>${user.repos}</strong><span>${t("gh.repos")}</span></div>
        <div><strong>${user.seguidores}</strong><span>${t("gh.seguidores")}</span></div>
        <div><strong>${new Date(user.criado).getFullYear()}</strong><span>${t("gh.desde")}</span></div>
      </div>
      ${langs.length ? `
        <h3 class="gh__label mono">${t("gh.linguagens")}</h3>
        <div class="gh__bar">${langs.map(([l, n]) => `<i style="width:${(n / total) * 100}%; background:${cor(l)}" title="${l}"></i>`).join("")}</div>
        <ul class="gh__legend">${langs.map(([l, n]) => `<li><i style="background:${cor(l)}"></i>${l} <span>${Math.round((n / total) * 100)}%</span></li>`).join("")}</ul>
      ` : ""}
      ${ultimo ? `<p class="gh__last mono"><span class="pulse" aria-hidden="true"></span>${t("gh.ultimo")} ${tempoRelativo(ultimo)}</p>` : ""}
      <a class="btn btn--ghost" href="${user.url}" target="_blank" rel="noopener">${t("gh.perfil")} →</a>
    </div>
    <div>
      <h3 class="gh__label mono">${t("gh.recentes")}</h3>
      <div class="gh__repos">
        ${repos.slice(0, 6).map(r => `
          <a class="gh__repo" href="${r.url}" target="_blank" rel="noopener">
            <strong>${r.nome}</strong>
            <p>${r.desc || t("gh.semDesc")}</p>
            <span class="gh__meta mono">
              ${r.lang ? `<span><i style="background:${cor(r.lang)}"></i>${r.lang}</span>` : ""}
              ${r.estrelas ? `<span>★ ${r.estrelas}</span>` : ""}
              <span>${tempoRelativo(r.push)}</span>
            </span>
          </a>`).join("")}
      </div>
    </div>
  `;
}

async function iniciarGitHub() {
  if (!GH_USER) { $("#github").hidden = true; return; }
  $("#ghBox").innerHTML = `<p class="gh__msg mono">${t("gh.carregando")}</p>`;
  try {
    ghDados = await buscarGitHub();
    renderGitHub();
  } catch {
    $("#ghBox").innerHTML = `<p class="gh__msg">${t("gh.erro")} <a class="accent" href="${CONFIG.github}" target="_blank" rel="noopener">${t("gh.perfil")} →</a></p>`;
  }
}

/* ---------- Terminal (Ctrl+K) ---------- */
const term = $("#term");
const termOut = $("#termOut");
const termIn = $("#termIn");
const historico = [];
let posHist = 0;

function escrever(html, classe = "") {
  const linha = document.createElement("div");
  linha.className = "term__row " + classe;
  linha.innerHTML = html;
  termOut.appendChild(linha);
  termOut.scrollTop = termOut.scrollHeight;
}

function abrirTerminal() {
  term.hidden = false;
  document.body.style.overflow = "hidden";
  if (!termOut.children.length) {
    escrever(tt(
      `Bem-vindo ao terminal do <span class="accent">gabriel.dev</span>. Digite <b>help</b> para ver os comandos.`,
      `Welcome to the <span class="accent">gabriel.dev</span> terminal. Type <b>help</b> to see the commands.`
    ), "muted");
  }
  termIn.focus();
}

function fecharTerminal() {
  term.hidden = true;
  if (!modal.classList.contains("open")) document.body.style.overflow = "";
}

function acharProjeto(busca) {
  const b = busca.toLowerCase();
  return PROJETOS.find(p => p.id === b) || PROJETOS.find(p => p.id.includes(b) || p.nome.toLowerCase().includes(b));
}

const COMANDOS = {
  help: () => {
    const lista = [
      ["whoami", tt("quem sou eu", "who I am")],
      ["ls", tt("lista os projetos", "list projects")],
      ["open &lt;projeto&gt;", tt("abre um projeto (ex: open gesistec)", "open a project (e.g. open gesistec)")],
      ["stack", tt("tecnologias que uso", "technologies I use")],
      ["contact", tt("como falar comigo", "how to reach me")],
      ["github", tt("abre meu GitHub", "open my GitHub")],
      ["cv", tt("baixa meu currículo", "download my résumé")],
      ["theme", tt("alterna tema claro/escuro", "toggle light/dark theme")],
      ["lang", tt("alterna português/inglês", "toggle Portuguese/English")],
      ["clear", tt("limpa a tela", "clear the screen")],
      ["exit", tt("fecha o terminal", "close the terminal")]
    ];
    escrever(lista.map(([c, d]) => `<span class="term__cmd">${c.padEnd(16, " ").replace(/ /g, "&nbsp;")}</span>${d}`).join("<br>"));
  },
  whoami: () => escrever(tt(
    "Gabriel — estudante do 4º semestre de ADS. Gosto do sistema inteiro: banco, back-end e front. Disponível para estágio.",
    "Gabriel — 4th-semester Systems Analysis student. I like the whole system: database, back-end and front-end. Open to internships."
  )),
  ls: () => escrever(PROJETOS.map(p => `<span class="term__cmd" style="color:${p.cor}">${p.id.padEnd(20, " ").replace(/ /g, "&nbsp;")}</span>${p.nome}`).join("<br>")),
  open: args => {
    if (!args) return escrever(tt("uso: open &lt;projeto&gt; — veja os nomes com <b>ls</b>", "usage: open &lt;project&gt; — see names with <b>ls</b>"), "erro");
    const pr = acharProjeto(args);
    if (!pr) return escrever(tt(`projeto não encontrado: ${args}`, `project not found: ${args}`), "erro");
    escrever(tt(`abrindo ${pr.nome}...`, `opening ${pr.nome}...`), "muted");
    setTimeout(() => { fecharTerminal(); abrirModal(pr.id); }, 250);
  },
  stack: () => escrever(todasTecnologias().map(([n, q]) => `${n} <span class="muted">(${q})</span>`).join(" · ")),
  contact: () => escrever([
    `email&nbsp;&nbsp;&nbsp; <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>`,
    CONFIG.github ? `github&nbsp;&nbsp; <a href="${CONFIG.github}" target="_blank" rel="noopener">${CONFIG.github.replace(/^https?:\/\//, "")}</a>` : "",
    CONFIG.linkedin ? `linkedin <a href="${CONFIG.linkedin}" target="_blank" rel="noopener">${CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</a>` : ""
  ].filter(Boolean).join("<br>")),
  github: () => { escrever(tt("abrindo GitHub...", "opening GitHub..."), "muted"); window.open(CONFIG.github, "_blank", "noopener"); },
  cv: () => {
    if (!CONFIG.curriculo) return escrever(tt("currículo indisponível", "résumé unavailable"), "erro");
    escrever(tt("baixando currículo...", "downloading résumé..."), "muted");
    $(".js-cv").click();
  },
  theme: () => { $("#themeToggle").click(); escrever(tt("tema alterado", "theme changed"), "muted"); },
  lang: () => { $("#langToggle").click(); escrever(tt("idioma: português", "language: English"), "muted"); },
  clear: () => { termOut.innerHTML = ""; },
  exit: () => fecharTerminal(),
  date: () => escrever(new Date().toLocaleString(idioma === "pt" ? "pt-BR" : "en")),
  echo: args => escrever(args.replace(/</g, "&lt;")),
  sudo: () => escrever(tt("Permissão negada. Mas boa tentativa 😄", "Permission denied. Nice try though 😄"), "erro")
};
// Apelidos em português
Object.assign(COMANDOS, {
  ajuda: COMANDOS.help, sobre: COMANDOS.whoami, about: COMANDOS.whoami, projetos: COMANDOS.ls, projects: COMANDOS.ls,
  abrir: COMANDOS.open, contato: COMANDOS.contact, curriculo: COMANDOS.cv, tema: COMANDOS.theme,
  idioma: COMANDOS.lang, limpar: COMANDOS.clear, cls: COMANDOS.clear, sair: COMANDOS.exit
});

function executar(linha) {
  const [cmd, ...resto] = linha.trim().split(/\s+/);
  escrever(`<span class="term__prompt">gabriel@portfolio:~$</span> ${linha.replace(/</g, "&lt;")}`);
  if (!cmd) return;
  const fn = COMANDOS[cmd.toLowerCase()];
  if (fn) fn(resto.join(" "));
  else escrever(tt(`comando não encontrado: ${cmd.replace(/</g, "&lt;")} — digite <b>help</b>`, `command not found: ${cmd.replace(/</g, "&lt;")} — type <b>help</b>`), "erro");
}

function configurarTerminal() {
  $("#termOpen").addEventListener("click", abrirTerminal);
  $$("[data-term-close]").forEach(el => el.addEventListener("click", fecharTerminal));

  $("#termForm").addEventListener("submit", e => {
    e.preventDefault();
    const linha = termIn.value;
    if (linha.trim()) historico.push(linha);
    posHist = historico.length;
    termIn.value = "";
    executar(linha);
  });

  termIn.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && posHist > 0) { e.preventDefault(); termIn.value = historico[--posHist]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); posHist = Math.min(historico.length, posHist + 1); termIn.value = historico[posHist] || ""; }
    else if (e.key === "Tab") {
      // Autocompleta comandos e, depois de "open", ids de projeto
      e.preventDefault();
      const partes = termIn.value.split(" ");
      const ultima = partes.pop().toLowerCase();
      const opcoes = partes.length ? PROJETOS.map(p => p.id) : Object.keys(COMANDOS);
      const achou = opcoes.filter(o => o.startsWith(ultima));
      if (achou.length === 1) termIn.value = [...partes, achou[0]].join(" ") + " ";
      else if (achou.length > 1) escrever(achou.join("&nbsp;&nbsp;"), "muted");
    }
  });

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      term.hidden ? abrirTerminal() : fecharTerminal();
    } else if (e.key === "Escape" && !term.hidden) {
      e.stopImmediatePropagation();
      fecharTerminal();
    }
  }, true);
}

/* ---------- Contador de visitas (GoatCounter) ---------- */
function iniciarContador() {
  if (!CONFIG.goatcounter || location.protocol === "file:") return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${CONFIG.goatcounter}.goatcounter.com/count`;
  document.body.appendChild(s);
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarGitHub();
  configurarTerminal();
  iniciarContador();
  document.addEventListener("idiomamudou", renderGitHub);
});
