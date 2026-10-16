/* =========================================================
   ESTUDOS DE CASO — idioma, tema e navbar (gesistec.html, autoelite.html)
   O tema e o idioma já são aplicados no <head> para não piscar.
   ========================================================= */
(function () {
  var raiz = document.documentElement;
  var salvar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var langBtn = document.getElementById("langToggle");
  var tituloPt = document.title;
  var tituloEn = tituloPt.replace("Estudo de caso", "Case study");

  var atualizar = function () {
    langBtn.textContent = raiz.dataset.lang === "pt" ? "EN" : "PT";
    document.title = raiz.dataset.lang === "pt" ? tituloPt : tituloEn;
  };
  langBtn.addEventListener("click", function () {
    raiz.dataset.lang = raiz.dataset.lang === "pt" ? "en" : "pt";
    raiz.lang = raiz.dataset.lang === "pt" ? "pt-BR" : "en";
    salvar("idioma", raiz.dataset.lang);
    atualizar();
  });
  document.getElementById("themeToggle").addEventListener("click", function () {
    raiz.dataset.theme = raiz.dataset.theme === "light" ? "dark" : "light";
    salvar("tema", raiz.dataset.theme);
  });
  window.addEventListener("scroll", function () {
    document.getElementById("nav").classList.toggle("scrolled", scrollY > 30);
  }, { passive: true });
  document.getElementById("year").textContent = new Date().getFullYear();
  atualizar();
})();