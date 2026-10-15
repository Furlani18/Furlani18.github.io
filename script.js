/* =========================================================
   PORTFÓLIO — LÓGICA
   ========================================================= */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Preferências salvas ---------- */
function lerPref(chave) {
  try { return localStorage.getItem(chave); } catch { return null; }
}
function salvarPref(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch {}
}

/* ---------- Idioma ---------- */
let idioma = lerPref("idioma") || ((navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en");

function t(chave, ...args) {
  const v = I18N[idioma][chave] ?? I18N.pt[chave] ?? chave;
  return typeof v === "function" ? v(...args) : v;
}

// Campo do projeto no idioma atual (cai para o PT se não houver tradução)
function campo(pr, chave) {
  return (idioma === "en" && pr.en && pr.en[chave]) || pr[chave];
}

function contextoDe(pr) {
  const mapa = I18N[idioma].contextos;
  return pr.contexto.split(" · ").map(c => mapa[c] || c).join(" · ");
}

function aplicarIdioma() {
  document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en";
  document.title = t("meta.title");
  $$("[data-i18n]").forEach(el => (el.textContent = t(el.dataset.i18n)));
  $$("[data-i18n-html]").forEach(el => (el.innerHTML = t(el.dataset.i18nHtml)));
  $$("[data-i18n-placeholder]").forEach(el => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  $("#langToggle").textContent = idioma === "pt" ? "EN" : "PT";
  if (reduzMovimento) $("#typed").textContent = t("hero.words")[0];
  atualizarBotaoTema();
}

function configurarIdioma() {
  $("#langToggle").addEventListener("click", () => {
    idioma = idioma === "pt" ? "en" : "pt";
    salvarPref("idioma", idioma);
    aplicarIdioma();
    renderHero();
    renderProjetos();
    renderTrajetoria();
    renderStack();
    if (modal.classList.contains("open")) preencherModal(modalId);
    document.dispatchEvent(new Event("idiomamudou"));
  });
}

/* ---------- Tema claro / escuro ---------- */
function atualizarBotaoTema() {
  const claro = document.documentElement.dataset.theme === "light";
  $("#themeToggle").setAttribute("aria-label", t(claro ? "theme.dark" : "theme.light"));
  $('meta[name="theme-color"]').content = claro ? "#f6f7f4" : "#0b0d10";
}

function configurarTema() {
  $("#themeToggle").addEventListener("click", () => {
    const novo = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = novo;
    salvarPref("tema", novo);
    atualizarBotaoTema();
  });
}

/* ---------- Efeito de digitação ---------- */
function iniciarDigitacao() {
  const alvo = $("#typed");
  if (reduzMovimento) { alvo.textContent = t("hero.words")[0]; return; }
  let p = 0, l = 0, apagando = false;

  function tick() {
    const palavras = t("hero.words");
    const palavra = palavras[p % palavras.length];
    alvo.textContent = palavra.slice(0, l);

    if (!apagando && l < palavra.length) { l++; setTimeout(tick, 90); }
    else if (!apagando) { apagando = true; setTimeout(tick, 1400); }
    else if (l > 0) { l--; setTimeout(tick, 45); }
    else { apagando = false; p = (p + 1) % palavras.length; setTimeout(tick, 300); }
  }
  tick();
}

/* ---------- Contadores ---------- */
function todasTecnologias() {
  const mapa = {};
  PROJETOS.forEach(pr => pr.tecnologias.forEach(tec => (mapa[tec] = (mapa[tec] || 0) + 1)));
  return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
}

function animarNumero(el, fim) {
  if (reduzMovimento) { el.textContent = fim; return; }
  let atual = 0;
  const passo = Math.max(1, Math.ceil(fim / 30));
  const id = setInterval(() => {
    atual = Math.min(fim, atual + passo);
    el.textContent = atual;
    if (atual >= fim) clearInterval(id);
  }, 35);
}

/* ---------- Capa ---------- */
function imagensDe(pr) {
  if (pr.imagens && pr.imagens.length) return pr.imagens;
  return pr.imagem ? [pr.imagem] : [];
}

function capaHTML(pr, src = imagensDe(pr)[0]) {
  if (src) return `<img src="${src}" alt="${pr.nome}" loading="lazy">`;
  const iniciais = pr.nome.replace(/[^A-Za-zÀ-ú ]/g, "").split(" ").filter(Boolean)
    .slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return `<span class="cover__mono">${iniciais}</span>`;
}

// Prévia animada (vídeo .mp4/.webm ou .gif) que aparece ao passar o mouse no card
function previewHTML(pr) {
  if (!pr.preview || reduzMovimento) return "";
  return /\.(mp4|webm)$/i.test(pr.preview)
    ? `<video class="cover__preview" src="${pr.preview}" muted loop playsinline preload="none"></video>`
    : `<img class="cover__preview" src="${pr.preview}" alt="" loading="lazy">`;
}

function configurarPreviews() {
  $("#projetos").addEventListener("mouseover", e => {
    const card = e.target.closest(".card");
    if (card && !card.contains(e.relatedTarget)) card.querySelector("video.cover__preview")?.play().catch(() => {});
  });
  $("#projetos").addEventListener("mouseout", e => {
    const card = e.target.closest(".card");
    if (card && !card.contains(e.relatedTarget)) card.querySelector("video.cover__preview")?.pause();
  });
}

/* ---------- Render dos cards ---------- */
let filtroAtual = "todos";
let busca = "";
let listaAtual = PROJETOS;

// tipo: "" (grade normal) | "featured" (faixa de destaques) | "main" (projeto principal, card largo)
function cardHTML(pr, i, tipo = "") {
  const principal = tipo === "main";
  const classes = tipo ? ` card--featured${principal ? " card--main" : ""}` : "";
  const selo = principal ? t("proj.principal") : t("proj.badge");
  return `
    <article class="card${classes}" style="--c:${pr.cor}; --d:${i * 50}ms"
      data-id="${pr.id}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${t("card.aria", pr.nome)}">
      <div class="card__cover">
        ${capaHTML(pr)}
        ${previewHTML(pr)}
        ${tipo ? `<span class="badge mono">${selo}</span>` : ""}
      </div>
      <div class="card__body">
        <div class="card__meta mono">
          <span>${t("cat." + pr.categoria)}</span>
          <span>${contextoDe(pr)}</span>
        </div>
        <h3>${pr.nome}</h3>
        <p>${campo(pr, principal ? "descricao" : "resumo")}</p>
        ${principal ? `<ul class="card__list">${campo(pr, "destaques").slice(0, 3).map(d => `<li>${d}</li>`).join("")}</ul>` : ""}
        <div class="tags">
          ${pr.tecnologias.slice(0, 4).map(tec => `<span class="tag">${tec}</span>`).join("")}
          ${pr.tecnologias.length > 4 ? `<span class="tag">+${pr.tecnologias.length - 4}</span>` : ""}
        </div>
        <span class="card__more mono">${t("card.mais")} <span aria-hidden="true">→</span></span>
      </div>
    </article>
  `;
}

/* ---------- Cards flutuantes do hero ---------- */
function renderHero() {
  $("#heroVisual").innerHTML = PROJETOS.filter(pr => pr.destaque).slice(0, 3).map((pr, i) => `
    <button class="hcard hcard--${i + 1}" style="--c:${pr.cor}" data-open="${pr.id}" aria-label="${t("card.aria", pr.nome)}">
      <span class="card__cover">
        ${capaHTML(pr)}
        ${i === 0 ? `<span class="badge mono">${t("proj.principal")}</span>` : ""}
      </span>
      <span class="hcard__body">
        <strong>${pr.nome}</strong>
        <small class="mono">${t("cat." + pr.categoria)}</small>
      </span>
    </button>
  `).join("");
}

function renderProjetos() {
  const termo = busca.trim().toLowerCase();

  listaAtual = PROJETOS.filter(pr => {
    const okCat = filtroAtual === "todos" || pr.categoria === filtroAtual;
    const texto = [pr.nome, pr.resumo, pr.en?.resumo || "", ...pr.tecnologias].join(" ").toLowerCase();
    return okCat && (!termo || texto.includes(termo));
  });

  $("#projectsGrid").innerHTML = listaAtual.map((pr, i) => cardHTML(pr, i)).join("");
  $("#emptyMsg").hidden = listaAtual.length > 0;

  // Destaques só aparecem na visão geral (sem filtro nem busca)
  const destaques = PROJETOS.filter(pr => pr.destaque);
  const mostrar = destaques.length > 0 && filtroAtual === "todos" && !termo;
  $("#featuredWrap").hidden = !mostrar;
  $("#featuredGrid").innerHTML = mostrar ? destaques.map((pr, i) => cardHTML(pr, i, i === 0 ? "main" : "featured")).join("") : "";
}

function definirFiltro(filtro) {
  filtroAtual = filtro;
  $$("#filters .filter").forEach(b => {
    const ativo = b.dataset.filter === filtro;
    b.classList.toggle("active", ativo);
    b.setAttribute("aria-pressed", ativo);
  });
}

function configurarFiltros() {
  $$("#filters .filter").forEach(btn => {
    btn.addEventListener("click", () => {
      definirFiltro(btn.dataset.filter);
      renderProjetos();
    });
  });

  $("#search").addEventListener("input", e => {
    busca = e.target.value;
    renderProjetos();
  });
}

/* ---------- Trajetória ---------- */
function renderTrajetoria() {
  $("#timeline").innerHTML = TRAJETORIA.map(item => {
    const projetos = item.projetos.map(id => PROJETOS.find(p => p.id === id)).filter(Boolean);
    return `
      <li class="timeline__item reveal${item.atual ? " is-now" : ""}">
        <span class="timeline__dot" aria-hidden="true"></span>
        <div class="timeline__period mono">
          ${item.periodo}${item.atual ? ` <span class="timeline__now">● ${t("traj.agora")}</span>` : ""}
        </div>
        <h3>${item.titulo[idioma]}</h3>
        <p>${item.texto[idioma]}</p>
        <div class="timeline__projects">
          ${projetos.map(pr => `<button class="chip" style="--c:${pr.cor}" data-open="${pr.id}">${pr.nome}</button>`).join("")}
        </div>
      </li>
    `;
  }).join("");
  observarReveal();
}

/* ---------- Stack ---------- */
function renderStack() {
  const techs = todasTecnologias();
  const maximo = techs[0][1];
  $("#stackGrid").innerHTML = techs.map(([nome, qtd]) => `
    <button class="stack__item reveal" data-tech="${nome}" title="${t("stack.filtrar", nome)}" style="--p:${qtd / maximo}">
      <span>${nome}</span>
      <small class="mono">${t("stack.count", qtd)}</small>
      <i class="stack__bar" aria-hidden="true"></i>
    </button>
  `).join("");

  $$(".stack__item").forEach(item => {
    item.addEventListener("click", () => {
      $("#search").value = item.dataset.tech;
      busca = item.dataset.tech;
      definirFiltro("todos");
      renderProjetos();
      $("#projetos").scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth" });
    });
  });
  observarReveal();
}

/* ---------- Modal ---------- */
const modal = $("#modal");
let modalId = null;
let listaModal = PROJETOS;
let focoAnterior = null;

let midiasModal = [];

function midiaHTML(pr, m) {
  if (!m) return capaHTML(pr);
  if (m.video) return `<video src="${m.video}" ${m.capa ? `poster="${m.capa}"` : ""} controls playsinline preload="metadata"></video>`;
  return capaHTML(pr, m.src);
}

function linkDoProjeto(id) {
  return `${location.href.split("#")[0]}#projeto=${id}`;
}

function preencherModal(id) {
  const pr = PROJETOS.find(p => p.id === id);
  if (!pr) return false;

  modalId = id;
  // Navega dentro da lista filtrada; se o projeto não estiver nela, usa todos
  listaModal = listaAtual.some(p => p.id === id) ? listaAtual : PROJETOS;

  // Galeria: vídeo de apresentação (se houver) seguido dos prints
  midiasModal = [
    ...(pr.video ? [{ video: pr.video, capa: pr.videoCapa }] : []),
    ...imagensDe(pr).map(src => ({ src }))
  ];
  modal.style.setProperty("--c", pr.cor);
  $("#modalCover").innerHTML = midiaHTML(pr, midiasModal[0]);
  $("#modalThumbs").innerHTML = midiasModal.length > 1
    ? midiasModal.map((m, i) => `
        <button class="thumb${i === 0 ? " active" : ""}${m.video ? " thumb--video" : ""}" data-i="${i}"
          aria-label="${m.video ? t("modal.video") : t("modal.foto", i + 1)}">
          ${m.video && !m.capa ? "" : `<img src="${m.capa || m.src}" alt="" loading="lazy">`}
        </button>`).join("")
    : "";

  $("#modalCat").textContent = `${t("cat." + pr.categoria)} · ${contextoDe(pr)}`;
  $("#modalTitle").textContent = pr.nome;
  $("#modalDesc").textContent = campo(pr, "descricao");
  $("#modalFeatures").innerHTML = campo(pr, "destaques").map(d => `<li>${d}</li>`).join("");
  $("#modalTags").innerHTML = pr.tecnologias.map(tec => `<span class="tag">${tec}</span>`).join("");

  const acoes = [];
  if (pr.jogavel && pr.demo) acoes.push(`<button class="btn btn--primary" id="playHere">▶ ${t("modal.jogar")}</button>`);
  if (pr.caso) acoes.push(`<a class="btn btn--primary" href="${pr.caso}">${t("modal.caso")} →</a>`);
  if (pr.demo) acoes.push(`<a class="btn ${pr.caso || pr.jogavel ? "btn--ghost" : "btn--primary"}" href="${pr.demo}" target="_blank" rel="noopener">${t("modal.demo")}</a>`);
  if (pr.repo) acoes.push(`<a class="btn btn--ghost" href="${pr.repo}" target="_blank" rel="noopener">${t("modal.repo")}</a>`);
  acoes.push(`<button class="btn btn--ghost" id="copyLink">${t("modal.link")}</button>`);
  $("#modalActions").innerHTML = acoes.join("");

  const pos = listaModal.findIndex(p => p.id === id);
  $("#modalPos").textContent = `${pos + 1} / ${listaModal.length}`;
  $(".modal__nav").hidden = listaModal.length < 2;
  return true;
}

function abrirModal(id, atualizarUrl = true) {
  const jaAberto = modal.classList.contains("open");
  if (!preencherModal(id)) return;

  $(".modal__box").scrollTop = 0;
  if (atualizarUrl) history[jaAberto ? "replaceState" : "pushState"](null, "", `#projeto=${id}`);
  if (jaAberto) return;

  focoAnterior = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal__close").focus();
}

function fecharModal(atualizarUrl = true) {
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  $("#modalCover iframe")?.remove(); // para o jogo (e o som) ao fechar
  $("#modalCover video")?.pause();
  if (atualizarUrl) history.replaceState(null, "", "#projetos");

  // Devolve o foco ao card que abriu o modal (mesmo se ele foi re-renderizado)
  const alvo = focoAnterior && focoAnterior.isConnected
    ? focoAnterior
    : $(`.card[data-id="${modalId}"]`);
  if (alvo) alvo.focus({ preventScroll: true });
}

function navegarModal(direcao) {
  const pos = listaModal.findIndex(p => p.id === modalId);
  const novo = listaModal[(pos + direcao + listaModal.length) % listaModal.length];
  abrirModal(novo.id);
}

async function copiarLink(botao) {
  const url = linkDoProjeto(modalId);
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const campoTmp = document.createElement("input");
    campoTmp.value = url;
    document.body.appendChild(campoTmp);
    campoTmp.select();
    document.execCommand("copy");
    campoTmp.remove();
  }
  botao.textContent = t("modal.copiado");
  setTimeout(() => (botao.textContent = t("modal.link")), 2000);
}

// Carrega a demo do jogo dentro do próprio modal
function jogarNoModal() {
  const pr = PROJETOS.find(p => p.id === modalId);
  $("#modalThumbs").innerHTML = "";
  $("#modalCover").innerHTML = `<iframe src="${pr.demo}" title="${pr.nome}" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>`;
  $(".modal__box").scrollTop = 0;
  $("#modalCover iframe").focus();
}

// Mantém o Tab circulando dentro do modal enquanto ele está aberto
function prenderFoco(e) {
  const focaveis = $$('button, a[href], [tabindex]:not([tabindex="-1"])', $(".modal__box"))
    .filter(el => el.offsetParent !== null);
  if (!focaveis.length) return;
  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];
  if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
}

function idDoHash() {
  const m = location.hash.match(/^#projeto=([\w-]+)$/);
  return m ? m[1] : null;
}

function configurarModal() {
  // Cards (grade e destaques)
  $("#projetos").addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) abrirModal(card.dataset.id);
  });
  $("#projetos").addEventListener("keydown", e => {
    const card = e.target.closest(".card");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abrirModal(card.dataset.id); }
  });

  // Atalhos da trajetória e cards do hero
  ["#timeline", "#heroVisual"].forEach(sel => $(sel).addEventListener("click", e => {
    const alvo = e.target.closest("[data-open]");
    if (alvo) abrirModal(alvo.dataset.open);
  }));

  $$("[data-close]", modal).forEach(el => el.addEventListener("click", () => fecharModal()));
  $("#modalPrev").addEventListener("click", () => navegarModal(-1));
  $("#modalNext").addEventListener("click", () => navegarModal(1));

  $("#modalThumbs").addEventListener("click", e => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return;
    $$(".thumb", modal).forEach(b => b.classList.toggle("active", b === thumb));
    const pr = PROJETOS.find(p => p.id === modalId);
    $("#modalCover").innerHTML = midiaHTML(pr, midiasModal[thumb.dataset.i]);
  });

  $("#modalActions").addEventListener("click", e => {
    if (e.target.id === "copyLink") copiarLink(e.target);
    if (e.target.id === "playHere") jogarNoModal();
  });

  document.addEventListener("keydown", e => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") fecharModal();
    else if (e.key === "ArrowLeft") navegarModal(-1);
    else if (e.key === "ArrowRight") navegarModal(1);
    else if (e.key === "Tab") prenderFoco(e);
  });

  // Botão voltar/avançar do navegador
  window.addEventListener("popstate", () => {
    const id = idDoHash();
    if (id) abrirModal(id, false);
    else fecharModal(false);
  });
}

/* ---------- Contato ---------- */
function configurarContato() {
  const email = $("#linkEmail");
  email.href = `mailto:${CONFIG.email}`;
  email.textContent = CONFIG.email;
  $("#linkGithub").href = CONFIG.github;
  $("#linkGithub").hidden = !CONFIG.github;
  $("#linkLinkedin").href = CONFIG.linkedin;
  $("#linkLinkedin").hidden = !CONFIG.linkedin;
  $("#footGithub").href = CONFIG.github;
  $("#footGithub").hidden = !CONFIG.github;
  $("#footLinkedin").href = CONFIG.linkedin;
  $("#footLinkedin").hidden = !CONFIG.linkedin;

  $$(".js-cv").forEach(a => {
    a.hidden = !CONFIG.curriculo;
    a.href = CONFIG.curriculo;
  });

  const form = $("#contactForm");
  const status = $("#formStatus");
  const botao = $("button[type=submit]", form);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const { nome, email: remetente, mensagem } = Object.fromEntries(new FormData(form));
    const assunto = t("form.assunto", nome);
    status.className = "form__status";

    // Sem Formspree configurado: abre o app de e-mail do visitante já preenchido
    if (!CONFIG.formspree) {
      const corpo = `${mensagem}\n\n— ${nome} (${remetente})`;
      status.textContent = t("form.mailto");
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
      return;
    }

    botao.disabled = true;
    botao.textContent = t("form.enviando");
    try {
      const resp = await fetch(CONFIG.formspree, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: nome, email: remetente, message: mensagem, _subject: assunto })
      });
      if (!resp.ok) throw new Error(resp.status);
      form.reset();
      status.textContent = t("form.ok");
      status.classList.add("ok");
    } catch {
      status.textContent = t("form.erro");
      status.classList.add("erro");
    } finally {
      botao.disabled = false;
      botao.textContent = t("form.enviar");
    }
  });
}

/* ---------- Navbar ---------- */
function configurarNav() {
  const nav = $("#nav");
  const links = $("#navLinks");
  const toggle = $("#navToggle");

  const abrirMenu = aberto => {
    links.classList.toggle("open", aberto);
    toggle.setAttribute("aria-expanded", aberto);
  };

  const progresso = $("#progress");
  const aoRolar = () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
    const total = document.documentElement.scrollHeight - innerHeight;
    progresso.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
  };
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  toggle.addEventListener("click", () => abrirMenu(!links.classList.contains("open")));
  $$("a", links).forEach(a => a.addEventListener("click", () => abrirMenu(false)));

  // Destaca no menu a seção que está na tela
  const espiao = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      $$("a", links).forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(sec => espiao.observe(sec));
}

/* ---------- Animação ao rolar ---------- */
const observador = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visible"); observador.unobserve(en.target); }
  });
}, { threshold: 0.15 });

function observarReveal() {
  $$(".reveal:not(.visible)").forEach(el => observador.observe(el));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  aplicarIdioma();
  iniciarDigitacao();
  renderHero();
  renderProjetos();
  renderTrajetoria();
  renderStack();
  configurarIdioma();
  configurarTema();
  configurarFiltros();
  configurarModal();
  configurarPreviews();
  configurarContato();
  configurarNav();
  observarReveal();
  animarNumero($("#statProjetos"), PROJETOS.length);
  animarNumero($("#statTechs"), todasTecnologias().length);

  // Link direto: index.html#projeto=canigest
  const id = idDoHash();
  if (id) abrirModal(id, false);
});
