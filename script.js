(function () {
    'use strict';
  
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    /* ---------- Меню-бургер (телефон) ---------- */
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          nav.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  
    /* ---------- Если анимации не нужны или не поддерживаются: показываем всё сразу ---------- */
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
        el.classList.add('visible');
      });
      Array.prototype.forEach.call(document.querySelectorAll('.master'), function (el) {
        el.classList.add('in');
      });
      return;
    }
  
    /* ---------- 1. Плавное появление блоков при прокрутке ---------- */
    var revealObserver = new IntersectionObserver(function (entries) {
      var order = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // если несколько блоков появились одновременно — они выезжают по очереди
        entry.target.style.transitionDelay = (order * 0.1) + 's';
        order++;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
      revealObserver.observe(el);
    });
  
    /* ---------- 2. Мастера: сначала имя и фото, потом «печатается» описание ---------- */
    var texts = document.querySelectorAll('.master-text p');
    Array.prototype.forEach.call(texts, function (p) {
      p.style.visibility = 'hidden';            // прячем текст, но место под него остаётся
    });
  
    function typeText(p) {
      var full = p.textContent;
      p.style.minHeight = p.offsetHeight + 'px'; // чтобы страница не прыгала во время печати
      p.textContent = '';
      p.style.visibility = 'visible';
      var i = 0;
      (function step() {
        i += 2;
        p.textContent = full.slice(0, i);
        if (i < full.length) {
          setTimeout(step, 18);
        } else {
          p.textContent = full;
          p.style.minHeight = '';
        }
      })();
    }
  
    var masterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var master = entry.target;
        masterObserver.unobserve(master);
        master.classList.add('in');              // имя, затем фото
        var p = master.querySelector('.master-text p');
        setTimeout(function () { typeText(p); }, 1100);   // потом текст
      });
    }, { threshold: 0.3 });
  
    Array.prototype.forEach.call(document.querySelectorAll('.master'), function (m) {
      masterObserver.observe(m);
    });
  
    /* ---------- 3. Контакты: цифры времени «крутятся» и встают на место ---------- */
    function randomDigits(finalText) {
      return finalText.replace(/\d/g, function () { return Math.floor(Math.random() * 10); });
    }
  
    function runCounter(el) {
      var finalText = el.getAttribute('data-final');
      var start = Date.now();
      var duration = 1800;
      var timer = setInterval(function () {
        var progress = (Date.now() - start) / duration;
        var out = '';
        for (var i = 0; i < finalText.length; i++) {
          var ch = finalText.charAt(i);
          if (/\d/.test(ch) && progress < (i + 1) / (finalText.length + 1)) {
            out += Math.floor(Math.random() * 10);   // цифра ещё крутится
          } else {
            out += ch;                                // цифра встала на место
          }
        }
        el.textContent = out;
        if (progress >= 1) {
  
  clearInterval(timer);
          el.textContent = finalText;
        }
      }, 60);
    }
  
    var timeEl = document.querySelector('.time');
    if (timeEl) {
      timeEl.textContent = randomDigits(timeEl.getAttribute('data-final'));
      var timeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          timeObserver.unobserve(entry.target);
          setTimeout(function () { runCounter(timeEl); }, 500);
        });
      }, { threshold: 0.6 });
      timeObserver.observe(timeEl);
    }
  })();