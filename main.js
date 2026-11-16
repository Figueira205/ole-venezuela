/* Olé Venezuela · movimiento e interacción. El contenido vive en index.html. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Cabecera compacta al salir del hero
  var nav = $('#nav'), hero = $('#inicio');
  if (nav && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { nav.classList.toggle('is-scrolled', !e[0].isIntersecting); },
      { rootMargin: '-90px 0px 0px 0px' }).observe(hero);
  }

  // Menú móvil
  var toggle = $('#navToggle'), links = $('#navLinks');
  function setMenu(open) { links.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', open); }
  toggle.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Hero: rota el plato y la palabra
  var shots = $$('.hero__shot'), word = $('[data-word]'), i = 0;
  if (shots.length > 1 && !reduce) {
    setInterval(function () {
      if (document.hidden) return;
      shots[i].classList.remove('is-on');
      i = (i + 1) % shots.length;
      shots[i].classList.add('is-on');
      word.classList.add('is-out');
      setTimeout(function () { word.textContent = shots[i].dataset.name; word.classList.remove('is-out'); }, 300);
    }, 3600);
  }

  // Aparición al hacer scroll
  var items = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el, n) { el.style.transitionDelay = (n % 4) * 80 + 'ms'; io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Pestañas de la carta (sin JS se ve la carta entera)
  var tabs = $('[data-tabs]');
  if (tabs) {
    var btns = $$('[role="tab"]', tabs);
    var show = function (btn) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', on);
        b.tabIndex = on ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.hidden = false;
    $('#carta').classList.add('has-tabs');
    btns.forEach(function (b, n) {
      b.addEventListener('click', function () { show(b); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { var t = btns[(n + d + btns.length) % btns.length]; show(t); t.focus(); }
      });
    });
    show(btns[0]);
  }

  var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
