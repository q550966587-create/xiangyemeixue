/* ==========================================================
   向野美学 · XIANGYE AESTHETICS — 交互脚本
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 头部吸顶 ---------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- 移动端导航 ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navToggle.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });

  /* ---------- 滚动渐显 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 数字统计 ---------- */
  var statEls = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var dur = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var ioStat = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          ioStat.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { ioStat.observe(el); });
  } else {
    statEls.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- 作品筛选 ---------- */
  var filterBtns = document.querySelectorAll('#worksFilter .filter-btn');
  var workItems = document.querySelectorAll('#worksGrid .work-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      workItems.forEach(function (item) {
        var match = f === 'all' || item.getAttribute('data-cat') === f;
        item.classList.toggle('hide', !match);
        if (match) item.classList.add('in');
      });
    });
  });

  /* ---------- 留言轮播 ---------- */
  var items = document.querySelectorAll('.testi-item');
  var dotsWrap = document.getElementById('testiDots');
  var idx = 0;
  if (items.length > 0) {
    items.forEach(function (_, i) {
      var btnDot = document.createElement('button');
      btnDot.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(btnDot);
    });
    function go(n) {
      idx = (n + items.length) % items.length;
      items.forEach(function (it, i) { it.classList.toggle('active', i === idx); });
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.classList.toggle('active', i === idx); });
    }
    function next() { go(idx + 1); }
    var t = setInterval(next, 5200);
    dotsWrap.querySelectorAll('button').forEach(function (d, i) {
      d.addEventListener('mouseenter', function () { clearInterval(t); });
    });
    go(0);
  }

  /* ---------- 导航激活态 ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window && sections.length) {
    var ioNav = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.getAttribute('id');
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { ioNav.observe(s); });
  }

  /* ---------- 返回顶部 ---------- */
  var backTop = document.getElementById('backTop');
  window.addEventListener('scroll', function () {
    backTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 预约表单 ---------- */
  var form = document.getElementById('bookForm');
  var tip = document.getElementById('formTip');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('bName').value.trim();
      var phone = document.getElementById('bPhone').value.trim();
      if (!name || !phone) {
        tip.textContent = '请填写称呼与联系方式，方便我们为您预留档期。';
        return;
      }
      tip.textContent = '预约信息已收到，我们会在 30 分钟内与您确认到店时间。欢迎来到向野美学。';
      form.reset();
    });
  }
})();
