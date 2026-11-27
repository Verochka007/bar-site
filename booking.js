/* =====================================================
   БАРБЕРШОП «ДЖЕНТЛЬМЕН»: запись к мастеру
   Окно создаётся этим файлом само, в index.html его писать не нужно.
   Шаги: мастер → услуга и причёска → дата → время → контакты.
   Все цены и названия можно менять в блоках ДАННЫЕ ниже.
   ===================================================== */
   (function () {
    'use strict';
  
    /* ================= ДАННЫЕ ================= */
  
    var MASTERS = [
      { id: 'valeriy', name: 'Валерий', role: 'Барбер · 6 лет опыта', photo: 'valeriy', off: [1], seed: 1 },   // выходной: понедельник (1)
      { id: 'tatyana', name: 'Татьяна', role: 'Барбер · 5 лет опыта', photo: 'tatyana', off: [0], seed: 2 }    // выходной: воскресенье (0)
    ];
  
    // Режим работы, как в контактах: ежедневно 10:00–22:00
    var OPEN = 10, CLOSE = 22;
    var STEP_MIN = 30;           // начало записи каждые 30 минут
    var MAX_MONTH_AHEAD = 2;
  
    // Услуги из прайса: min — длительность в минутах, len — к какой длине волос относится
    var SERVICES = [
      { id: 'cut-short',  name: 'Короткая стрижка',              price: 1800, min: 40,  len: 'short' },
      { id: 'cut-medium', name: 'Стрижка средней длины',          price: 2500, min: 60,  len: 'medium' },
      { id: 'cut-long',   name: 'Длинная причёска',               price: 3500, min: 90,  len: 'long' },
      { id: 'cut-own',    name: 'Своя причёска / выбор мастера',  price: 2000, min: 60 },
      { id: 'beard',      name: 'Стрижка бороды',                 price: 1200, min: 30 },
      { id: 'kids',       name: 'Детская стрижка',                price: 1500, min: 45 },
      { id: 'styling',    name: 'Укладка / стайлинг',             price: 800,  min: 20 },
      { id: 'vip',        name: 'VIP-ритуал',                     price: 5000, min: 120 }
    ];
  
    // Причёски из раздела «Услуги»: file — название фото в папке images (без расширения)
    var CUTS = [
      { group: 'Короткие', len: 'short', items: [
        ['Бокс', 'boks'], ['Полубокс', 'polubox'], ['Кроп', 'krop'], ['Цезарь', 'cezar'], ['Ёжик', 'ezhik'], ['Милитари', 'militari'] ]},
      { group: 'Средней длины', len: 'medium', items: [
        ['Андеркат', 'anderkat'], ['Британка', 'britanka'], ['Канадка', 'kanadka'], ['Помпадур', 'pompadur'], ['Квифф', 'kviff'],
        ['Хай-контраст', 'hay-kontrast'], ['Шторки', 'shtorki'], ['Боб', 'bob'], ['Площадка', 'ploshchadka'] ]},
      { group: 'Длинные', len: 'long', items: [
        ['Каре', 'kare'], ['Каскад', 'kaskad'], ['Шэг', 'sheg'], ['Лесенка', 'lesenka'], ['Гранж', 'grandzh'], ['Маллет', 'mallet'] ]}
    ];
  
    var MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    var MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    var STEP_TITLES = ['', 'Мастер', 'Услуга', 'Дата', 'Время', 'Контакты'];
  
    /* ================= ОКНО ================= */
  
    var html =
      '<div class="bk-modal" id="bkModal" role="dialog" aria-modal="true" aria-labelledby="bkTitle" aria-hidden="true">' +
        '<div class="bk-box" tabindex="-1">' +
          '<button type="button" class="bk-close" id="bkClose" aria-label="Закрыть">&times;</button>' +
          '<h2 id="bkTitle">Запись к мастеру</h2>' +
          '<p class="bk-progress" id="bkProgress"></p>' +
          '<p class="bk-demo">Демо-проект: запись нигде не сохраняется, занятость дней и времени условная.</p>' +
          '<section class="bk-step" data-step="1"><div class="bk-masters" id="bkMasters"></div></section>' +
          '<section class="bk-step" data-step="2" hidden>' +
            '<div id="bkSvc"></div><p class="bk-sum" id="bkSum"></p>' +
            '<h3 class="bk-sub">Причёска (по желанию)</h3>' +
            '<p class="bk-hint">Выберите образ из каталога, и мастер будет знать, что вы хотите.</p>' +
            '<div id="bkCuts"></div>' +

  
  
  '</section>' +
          '<section class="bk-step" data-step="3" hidden>' +
            '<div class="bk-cal-head">' +
              '<button type="button" class="bk-nav-btn" id="bkPrev" aria-label="Предыдущий месяц">&lsaquo;</button>' +
              '<h3 class="bk-month" id="bkMonth"></h3>' +
              '<button type="button" class="bk-nav-btn" id="bkNextM" aria-label="Следующий месяц">&rsaquo;</button>' +
            '</div>' +
            '<div class="bk-cal" id="bkCal"></div>' +
            '<ul class="bk-legend">' +
              '<li><i class="bk-dot bk-dot--free"></i>Свободные дни</li>' +
              '<li><i class="bk-dot bk-dot--busy"></i>Все места заняты</li>' +
              '<li><i class="bk-dot bk-dot--off"></i>Выходной мастера</li>' +
              '<li><i class="bk-dot bk-dot--sel"></i>Ваш выбор</li>' +
            '</ul>' +
          '</section>' +
          '<section class="bk-step" data-step="4" hidden>' +
            '<p class="bk-slot-date" id="bkSlotDate"></p>' +
            '<div class="bk-slots" id="bkSlots"></div>' +
            '<p class="bk-empty" id="bkEmpty" hidden>На этот день для выбранных услуг нет свободного времени. Вернитесь назад и выберите другой день.</p>' +
          '</section>' +
          '<section class="bk-step" data-step="5" hidden>' +
            '<div class="bk-summary" id="bkSummary"></div>' +
            '<label class="bk-field">Имя<input type="text" id="bkName" autocomplete="off"></label>' +
            '<label class="bk-field">Телефон<input type="tel" id="bkPhone" placeholder="+7 900 000-00-00" autocomplete="off"></label>' +
            '<label class="bk-field">Пожелания (необязательно)<textarea id="bkComment" rows="2"></textarea></label>' +
          '</section>' +
          '<section class="bk-step bk-done" data-step="6" hidden id="bkDone" tabindex="-1"></section>' +
          '<p class="bk-err" id="bkErr" role="alert"></p>' +
          '<div class="bk-actions">' +
            '<button type="button" class="bk-ghost" id="bkBack">Назад</button>' +
            '<button type="button" class="bk-btn" id="bkNext">Далее</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="bk-btn bk-fab" data-open-booking>Записаться</button>';
  
    var holder = document.createElement('div');
    holder.innerHTML = html;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);
  
    var modal = document.getElementById('bkModal');
    var box = modal.querySelector('.bk-box');
    var $ = function (id) { return document.getElementById(id); };
    var elProgress = $('bkProgress'), elMasters = $('bkMasters'), elSvc = $('bkSvc'), elSum = $('bkSum'), elCuts = $('bkCuts');
    var elMonth = $('bkMonth'), elCal = $('bkCal'), btnPrevM = $('bkPrev'), btnNextM = $('bkNextM');
    var elSlotDate = $('bkSlotDate'), elSlots = $('bkSlots'), elEmpty = $('bkEmpty');
    var elSummary = $('bkSummary'), elDone = $('bkDone'), elErr = $('bkErr');
    var btnBack = $('bkBack'), btnNext = $('bkNext');
    var fName = $('bkName'), fPhone = $('bkPhone'), fComment = $('bkComment');
  
    /* ================= СОСТОЯНИЕ ================= */
  
    var step = 1;
    var masterId = 'any';
    var chosen = {};            // выбранные услуги: id -> услуга
    var chosenCut = null;       // { name, len }
    var chosenDate = null;
    var chosenTime = null;      // минуты от полуночи
    var assigned = null;        // мастер, закреплённый за выбранным временем
    var monthOffset = 0;
    var lastFocus = null;
  
    /* ================= ПОМОЩНИКИ ================= */
  
    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    }
  
    function money(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0\u20BD'; }
    function dur(min) {
      var h = Math.floor(min / 60), m = min % 60;
      if (!h) return m + '\u00A0\u043C\u0438\u043D';
      return h + '\u00A0\u0447' + (m ? ' ' + m + '\u00A0\u043C\u0438\u043D' : '');
    }

  function clock(min) { var h = Math.floor(min / 60), m = min % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
    function dateText(d) { return d.getDate() + ' ' + MONTHS_GEN[d.getMonth()] + ' ' + d.getFullYear() + ', ' + WEEKDAYS[d.getDay()]; }
    function dayKey(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
    function masterById(id) { for (var i = 0; i < MASTERS.length; i++) if (MASTERS[i].id === id) return MASTERS[i]; return null; }
    function activeMasters() { return masterId === 'any' ? MASTERS : [masterById(masterId)]; }
  
    // Постоянное «случайное» число 0–99 для одних и тех же входных данных (демо-занятость)
    function hash(n) {
      n = (n ^ 61) ^ (n >>> 16);
      n = n + (n << 3);
      n = n ^ (n >>> 4);
      n = Math.imul(n, 0x27d4eb2d);
      n = n ^ (n >>> 15);
      return Math.abs(n) % 100;
    }
  
    var today = new Date(); today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
    function totals() {
      var price = 0, min = 0, count = 0;
      Object.keys(chosen).forEach(function (id) { price += chosen[id].price; min += chosen[id].min; count++; });
      return { price: price, min: min, count: count };
    }
  
    // Картинка пробует расширения по очереди; если файла нет совсем, скрывается
    function setImg(img, base) {
      var exts = ['jpg', 'jpeg', 'png', 'webp'], i = 0;
      img.addEventListener('error', function () {
        i++;
        if (i < exts.length) img.src = 'images/' + base + '.' + exts[i];
        else img.style.display = 'none';
      });
      img.src = 'images/' + base + '.' + exts[0];
    }
  
    /* ================= ЗАНЯТОСТЬ (демо) ================= */
  
    function masterDay(m, date) {
      if (date < tomorrow) return 'past';
      if (m.off.indexOf(date.getDay()) > -1) return 'off';
      var ahead = Math.round((date - today) / 86400000);
      if (ahead === 2 || (ahead === 9 && m.id === 'valeriy')) return 'busy';   // чтобы занятые дни были видны всегда
      var weekend = date.getDay() === 0 || date.getDay() === 6;
      return hash(dayKey(date) * 7 + m.seed) < (weekend ? 45 : 28) ? 'busy' : 'free';
    }
  
    function dayState(date) {
      if (date < tomorrow) return 'past';
      var list = activeMasters(), work = false, free = false;
      list.forEach(function (m) {
        var s = masterDay(m, date);
        if (s !== 'off') work = true;
        if (s === 'free') free = true;
      });
      if (!work) return 'off';
      return free ? 'free' : 'busy';
    }
  
    function unitTaken(m, date, startMin) {
      return hash(dayKey(date) * 1000 + m.seed * 100 + startMin / STEP_MIN) < 18;
    }
  
    // Мастер, свободный на всё время услуги (или null)
    function freeMaster(date, start, need) {
      var list = activeMasters();
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (masterDay(m, date) !== 'free') continue;
        var ok = true;
        for (var t = start; t < start + need; t += STEP_MIN) {
          if (unitTaken(m, date, t)) { ok = false; break; }
        }
        if (ok) return m;
      }
      return null;
    }
  
    /* ================= ШАГ 1: МАСТЕР ================= */
  
    function buildMasters() {
      elMasters.innerHTML = '';
      var all = MASTERS.map(function (m) { return { id: m.id, name: m.name, role: m.role, photo: m.photo }; });
      all.push({ id: 'any', name: 'Любой мастер', role: 'Подберём ближайшее свободное время', photo: null });
  
      all.forEach(function (m) {
        var b = el('button', 'bk-master');
        b.type = 'button';
        b.setAttribute('data-id', m.id);
        var ph = el('span', 'bk-master__photo');
        if (m.photo) { var img = document.createElement('img'); img.alt = ''; setImg(img, m.photo); ph.appendChild(img); }
        else { ph.appendChild(el('span', 'bk-master__any', '\u2702')); }
        var tx = el('span', 'bk-master__text');
        tx.appendChild(el('strong', '', m.name));
        tx.appendChild(el('span', '', m.role));
  b.appendChild(ph); b.appendChild(tx);
        b.addEventListener('click', function () { selectMaster(m.id); });
        elMasters.appendChild(b);
      });
      markMaster();
    }
  
    function markMaster() {
      Array.prototype.forEach.call(elMasters.querySelectorAll('.bk-master'), function (b) {
        var on = b.getAttribute('data-id') === masterId;
        b.className = 'bk-master' + (on ? ' is-selected' : '');
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
  
    function selectMaster(id) {
      masterId = id;
      chosenDate = null; chosenTime = null; assigned = null;
      elErr.textContent = '';
      markMaster();
    }
  
    /* ================= ШАГ 2: УСЛУГИ И ПРИЧЁСКА ================= */
  
    function buildServices() {
      elSvc.innerHTML = '';
      SERVICES.forEach(function (s) {
        var label = el('label', 'bk-svc');
        var input = document.createElement('input');
        input.type = 'checkbox'; input.value = s.id;
        input.addEventListener('change', function () {
          if (input.checked) chosen[s.id] = s; else delete chosen[s.id];
          chosenTime = null; assigned = null; elErr.textContent = '';
          renderSum();
        });
        var body = el('span', 'bk-svc__body');
        body.appendChild(el('span', 'bk-svc__name', s.name));
        body.appendChild(el('span', 'bk-svc__meta', dur(s.min) + ' \u00B7 ' + money(s.price)));
        label.appendChild(input); label.appendChild(body);
        elSvc.appendChild(label);
      });
    }
  
    function syncServiceBoxes() {
      Array.prototype.forEach.call(elSvc.querySelectorAll('input'), function (i) { i.checked = !!chosen[i.value]; });
    }
  
    function renderSum() {
      var t = totals();
      elSum.textContent = t.count ? 'Выбрано: ' + t.count + ' \u00B7 ' + dur(t.min) + ' \u00B7 ' + money(t.price) : 'Выберите хотя бы одну услугу';
    }
  
    function buildCuts() {
      elCuts.innerHTML = '';
      CUTS.forEach(function (g) {
        elCuts.appendChild(el('h4', 'bk-cut-group', g.group));
        var grid = el('div', 'bk-cuts');
        g.items.forEach(function (it) {
          var b = el('button', 'bk-cut');
          b.type = 'button';
          b.setAttribute('data-name', it[0]);
          var ph = el('span', 'bk-cut__photo');
          var img = document.createElement('img'); img.alt = ''; setImg(img, it[1]); ph.appendChild(img);
          b.appendChild(ph); b.appendChild(el('span', 'bk-cut__name', it[0]));
          b.addEventListener('click', function () { selectCut(it[0], g.len); });
          grid.appendChild(b);
        });
        elCuts.appendChild(grid);
      });
      markCut();
    }
  
    function markCut() {
      Array.prototype.forEach.call(elCuts.querySelectorAll('.bk-cut'), function (b) {
        var on = chosenCut && b.getAttribute('data-name') === chosenCut.name;
        b.className = 'bk-cut' + (on ? ' is-selected' : '');
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
  
    function selectCut(name, len) {
      if (chosenCut && chosenCut.name === name) { chosenCut = null; }          // повторный клик снимает выбор
      else {
        chosenCut = { name: name, len: len };
        // если ни одна стрижка ещё не выбрана, подставляем подходящую по длине
        var hasCut = ['cut-short', 'cut-medium', 'cut-long', 'cut-own', 'kids'].some(function (id) { return chosen[id]; });
        if (!hasCut) {
          SERVICES.forEach(function (s) { if (s.len === len) chosen[s.id] = s; });
          syncServiceBoxes(); renderSum(); chosenTime = null; assigned = null;
        }
      }
      elErr.textContent = '';
      markCut();
    }
  
    /* ================= ШАГ 3: КАЛЕНДАРЬ ================= */
  
    function renderCalendar() {
      var base = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      var y = base.getFullYear(), m = base.getMonth();
      elMonth.textContent = MONTHS[m] + ' ' + y;
      btnPrevM.disabled = monthOffset <= 0;
      btnNextM.disabled = monthOffset >= MAX_MONTH_AHEAD;
      elCal.innerHTML = '';

  ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(function (n) { elCal.appendChild(el('div', 'bk-dow', n)); });
      for (var i = 0; i < (base.getDay() + 6) % 7; i++) elCal.appendChild(el('span'));
  
      var days = new Date(y, m + 1, 0).getDate();
      for (var d = 1; d <= days; d++) {
        (function (date) {
          var st = dayState(date);
          var b = el('button', 'bk-day is-' + st, String(date.getDate()));
          b.type = 'button';
          var label = date.getDate() + ' ' + MONTHS_GEN[date.getMonth()];
          if (st === 'free') {
            b.setAttribute('aria-label', label + ', есть свободное время');
            if (chosenDate && dayKey(chosenDate) === dayKey(date)) b.className += ' is-selected';
            b.addEventListener('click', function () {
              chosenDate = date; chosenTime = null; assigned = null; elErr.textContent = '';
              renderCalendar();
            });
          } else {
            b.disabled = true;
            b.setAttribute('aria-label', label + (st === 'busy' ? ', все места заняты' : st === 'off' ? ', выходной' : ', недоступно'));
          }
          elCal.appendChild(b);
        })(new Date(y, m, d));
      }
    }
  
    /* ================= ШАГ 4: ВРЕМЯ ================= */
  
    function renderSlots() {
      elSlots.innerHTML = '';
      var need = totals().min, any = false;
      elSlotDate.textContent = dateText(chosenDate) + ' \u00B7 ' + dur(need);
      for (var start = OPEN * 60; start + need <= CLOSE * 60; start += STEP_MIN) {
        any = true;
        (function (start) {
          var m = freeMaster(chosenDate, start, need);
          var b = el('button', 'bk-slot', clock(start));
          b.type = 'button';
          if (!m) { b.disabled = true; b.setAttribute('aria-label', clock(start) + ', занято'); }
          else {
            if (chosenTime === start) b.className += ' is-selected';
            b.addEventListener('click', function () {
              chosenTime = start; assigned = m; elErr.textContent = '';
              renderSlots();
            });
          }
          elSlots.appendChild(b);
        })(start);
      }
      elEmpty.hidden = any && elSlots.querySelector('.bk-slot:not(:disabled)') !== null;
    }
  
    /* ================= ШАГ 5: ИТОГ ================= */
  
    function summaryLines() {
      var t = totals();
      var names = Object.keys(chosen).map(function (id) { return chosen[id].name; }).join(', ');
      var lines = [
        'Мастер: ' + assigned.name,
        'Услуги: ' + names
      ];
      if (chosenCut) lines.push('Причёска: ' + chosenCut.name);
      lines.push('Дата: ' + dateText(chosenDate));
      lines.push('Время: ' + clock(chosenTime) + '\u2013' + clock(chosenTime + t.min) + ' (' + dur(t.min) + ')');
      lines.push('Стоимость: ' + money(t.price));
      return lines;
    }
  
    function renderSummary() {
      elSummary.innerHTML = '';
      summaryLines().forEach(function (l) { elSummary.appendChild(el('div', '', l)); });
    }
  
    /* ================= ПЕРЕХОДЫ ================= */
  
    function showStep(n) {
      step = n;
      Array.prototype.forEach.call(modal.querySelectorAll('.bk-step'), function (s) {
        s.hidden = Number(s.getAttribute('data-step')) !== n;
      });
      elErr.textContent = '';
      elProgress.textContent = n <= 5 ? 'Шаг ' + n + ' из 5 \u00B7 ' + STEP_TITLES[n] : '';
      if (n === 3) renderCalendar();
      if (n === 4) renderSlots();
      if (n === 5) renderSummary();
      btnBack.hidden = (n === 1 || n === 6);
      btnNext.textContent = n === 5 ? 'Записаться' : (n === 6 ? 'Закрыть' : 'Далее');
      box.scrollTop = 0;
    }
  
    function validate() {
      if (step === 2 && !totals().count) return 'Выберите хотя бы одну услугу';
      if (step === 3 && !chosenDate) return 'Выберите свободный день';
      if (step === 4 && chosenTime === null) return 'Выберите время';
      if (step === 5) {
        if (fName.value.trim().length < 2) return 'Введите имя';
        var digits = fPhone.value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 11) return 'Введите номер телефона (10\u201311 цифр)';
      }
  return '';
    }
  
    function finish() {
      elDone.innerHTML = '';
      elDone.appendChild(el('h3', '', fName.value.trim() + ', вы записаны (демо)'));
      summaryLines().forEach(function (l) { elDone.appendChild(el('p', '', l)); });
      elDone.appendChild(el('p', '', 'Мастер перезвонит по номеру ' + fPhone.value.trim() + ' для подтверждения.'));
      elDone.appendChild(el('p', 'bk-demo', 'Это демо-проект: запись никуда не отправлена.'));
      showStep(6);
      elDone.focus();
    }
  
    btnNext.addEventListener('click', function () {
      if (step === 6) { closeModal(); return; }
      var err = validate();
      if (err) { elErr.textContent = err; return; }
      if (step === 5) finish(); else showStep(step + 1);
    });
    btnBack.addEventListener('click', function () { if (step > 1 && step < 6) showStep(step - 1); });
    btnPrevM.addEventListener('click', function () { if (monthOffset > 0) { monthOffset--; renderCalendar(); } });
    btnNextM.addEventListener('click', function () { if (monthOffset < MAX_MONTH_AHEAD) { monthOffset++; renderCalendar(); } });
  
    /* ================= ОТКРЫТИЕ И ЗАКРЫТИЕ ================= */
  
    function resetAll() {
      step = 1; masterId = 'any'; chosen = {}; chosenCut = null; chosenDate = null; chosenTime = null; assigned = null; monthOffset = 0;
      fName.value = ''; fPhone.value = ''; fComment.value = '';
      buildMasters(); buildServices(); buildCuts(); renderSum();
    }
  
    function openModal(preMaster) {
      lastFocus = document.activeElement;
      if (step === 6) resetAll();
      if (preMaster && masterById(preMaster)) selectMaster(preMaster);
      showStep(step);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      box.focus();
    }
  
    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (step === 6) resetAll();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  
    // Любая кнопка или ссылка с атрибутом data-open-booking открывает окно.
    // Чтобы сразу выбрать мастера: data-master="valeriy" или data-master="tatyana"
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-open-booking]') : null;
      if (!t) return;
      e.preventDefault();
      openModal(t.getAttribute('data-master'));
    });
  
    $('bkClose').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') {
        var list = Array.prototype.filter.call(box.querySelectorAll('button:not([disabled]), input, textarea'), function (n) { return n.offsetParent !== null; });
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  
    resetAll();
  })();