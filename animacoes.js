/* =========================================================
   ANIMAÇÕES — efeitos extras de movimento
   Tudo aqui é desligado para quem pede "reduzir movimento" no sistema.
   Efeitos de mouse (paralaxe, 3D, ímã) só rodam em computador.
   ========================================================= */

const temMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Cards entram em cascata quando aparecem na tela ---------- */
const obsCards = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); obsCards.unobserve(en.target); }
  });
}, { threshold: 0.12 });

function observarCards() {
  $$(".card:not(.in)").forEach(c => (reduzMovimento ? c.classList.add("in") : obsCards.observe(c)));
}
// Registrado já na leitura do arquivo: o primeiro render acontece antes do DOMContentLoaded deste script
document.addEventListener("cardsrenderizados", observarCards);

/* ---------- Faixa infinita de tecnologias ---------- */
function montarFaixa() {
  const itens = todasTecnologias().map(([nome]) => `<span>${nome}</span><i>✦</i>`).join("");
  // Duas cópias lado a lado: quando a primeira sai, a segunda está no mesmo lugar (loop perfeito)
  $("#marquee").innerHTML = `<div>${itens}</div><div>${itens}</div>`;
}

/* ---------- Texto que "embaralha" antes de aparecer ---------- */
const SIMBOLOS = "!<>-_\\/[]{}=+*^?#01";
function embaralhar(el) {
  const final = el.textContent;
  const total = 22; // quadros (~0,4 s)
  let quadro = 0;
  const passo = () => {
    // Se o idioma mudou no meio, para e deixa o texto novo
    if (el.dataset.embaralhando !== final) return;
    el.textContent = [...final].map((ch, i) =>
      ch === " " || i < (quadro / total) * final.length ? ch : SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)]
    ).join("");
    if (++quadro <= total) requestAnimationFrame(passo);
    else { el.textContent = final; delete el.dataset.embaralhando; }
  };
  el.dataset.embaralhando = final;
  passo();
}

const obsTitulos = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    const h2 = en.target.querySelector("h2");
    if (h2 && !reduzMovimento) embaralhar(h2);
    obsTitulos.unobserve(en.target);
  });
}, { threshold: 0.6 });

/* ---------- Paralaxe e luz no topo ---------- */
function configurarHero() {
  const hero = $(".hero");
  let pedido = null, mx = 0, my = 0, gx = 0, gy = 0;

  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;   // -1 a 1
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
    gx = e.clientX - r.left; gy = e.clientY - r.top;
    pedido ??= requestAnimationFrame(() => {
      hero.style.setProperty("--mx", mx.toFixed(3));
      hero.style.setProperty("--my", my.toFixed(3));
      hero.style.setProperty("--gx", `${gx}px`);
      hero.style.setProperty("--gy", `${gy}px`);
      hero.classList.add("com-luz");
      pedido = null;
    });
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--mx", 0);
    hero.style.setProperty("--my", 0);
    hero.classList.remove("com-luz");
  });
}

/* ---------- Cards inclinam em 3D seguindo o mouse ---------- */
function configurarTilt() {
  const area = $("#projetos");
  let ativo = null;

  area.addEventListener("pointermove", e => {
    const card = e.target.closest(".card");
    if (ativo && ativo !== card) soltar(ativo);
    if (!card) return;
    ativo = card;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const forca = card.classList.contains("card--main") ? 4 : 8; // card largo inclina menos
    card.style.transform = `perspective(900px) rotateX(${((0.5 - py) * forca).toFixed(2)}deg) rotateY(${((px - 0.5) * forca).toFixed(2)}deg) translateY(-6px)`;
    card.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
    card.classList.add("tilt");
  });
  area.addEventListener("pointerleave", () => ativo && soltar(ativo));

  function soltar(card) {
    card.style.transform = "";
    card.classList.remove("tilt");
    ativo = null;
  }
}

/* ---------- Botões magnéticos ---------- */
function configurarIma() {
  document.addEventListener("pointermove", e => {
    const btn = e.target.closest(".btn--primary, .icon-btn");
    $$(".ima").forEach(b => b !== btn && soltarIma(b));
    if (!btn || btn.disabled) return;
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    btn.classList.add("ima");
    btn.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
  });
  const soltarIma = b => { b.classList.remove("ima"); b.style.transform = ""; };
}

/* ---------- Linha da trajetória se preenche ao rolar ---------- */
function configurarTimeline() {
  const linha = $("#timeline");
  let pedido = null;
  const atualizar = () => {
    pedido = null;
    const r = linha.getBoundingClientRect();
    const meio = innerHeight * 0.6;
    const prog = Math.min(1, Math.max(0, (meio - r.top) / r.height));
    linha.style.setProperty("--prog", prog.toFixed(3));
    $$(".timeline__item", linha).forEach(item => {
      const dot = item.querySelector(".timeline__dot").getBoundingClientRect();
      item.classList.toggle("passou", dot.top < meio);
    });
  };
  addEventListener("scroll", () => (pedido ??= requestAnimationFrame(atualizar)), { passive: true });
  document.addEventListener("idiomamudou", atualizar);
  atualizar();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  montarFaixa();
  observarCards();
  if (reduzMovimento) {
    $$(".section__head").forEach(h => h.classList.add("visible"));
    $("#timeline").style.setProperty("--prog", 1);
    $$(".timeline__item").forEach(i => i.classList.add("passou"));
    return;
  }
  $$(".section__head").forEach(h => obsTitulos.observe(h));
  configurarTimeline();
  if (temMouse) {
    configurarHero();
    configurarTilt();
    configurarIma();
  }
});
