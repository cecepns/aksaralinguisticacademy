/**
 * AKSARA LINGUISTIC ACADEMY - Main JavaScript Interactions & Language Switcher
 * Default Language: English (en)
 * Supported: English (en), Bahasa Indonesia (id), Chinese / 中文 (zh)
 */

document.addEventListener('DOMContentLoaded', () => {
  const ALA_WA_NUMBER = '6281770070026'; // Official contact phone (0817-700-700-26)

  // =========================================================================
  // 1. LANGUAGE SWITCHING ENGINE
  // =========================================================================
  const savedLang = localStorage.getItem('ala_lang') || 'en'; // English is default!

  const langNames = {
    en: { label: 'English', flagSrc: 'assets/flags/uk.svg', alt: 'UK Flag' },
    id: { label: 'Indonesia', flagSrc: 'assets/flags/id.svg', alt: 'Indonesia Flag' },
    zh: { label: '中文', flagSrc: 'assets/flags/cn.svg', alt: 'China Flag' }
  };

  function applyLanguage(lang) {
    if (!translations || !translations[lang]) {
      lang = 'en';
    }

    localStorage.setItem('ala_lang', lang);
    document.documentElement.lang = lang;

    // Update all text nodes with [data-i18n]
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Update all input placeholders with [data-i18n-ph]
    const inputsWithPh = document.querySelectorAll('[data-i18n-ph]');
    inputsWithPh.forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Update Language Dropdown Button Text & Flag
    const currentLangText = document.getElementById('currentLangText');
    const currentLangFlag = document.getElementById('currentLangFlag');
    if (currentLangText && langNames[lang]) {
      currentLangText.textContent = langNames[lang].label;
    }
    if (currentLangFlag && langNames[lang]) {
      currentLangFlag.innerHTML = `<img src="${langNames[lang].flagSrc}" alt="${langNames[lang].alt}" class="flag-icon" />`;
    }

    // Update active class on dropdown options
    document.querySelectorAll('.lang-option').forEach(opt => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  // Language Dropdown Interactivity
  const langDropdownBtn = document.getElementById('langDropdownBtn');
  const langMenu = document.getElementById('langMenu');

  if (langDropdownBtn && langMenu) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      langMenu.classList.remove('show');
    });

    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = opt.getAttribute('data-lang');
        applyLanguage(selectedLang);
        langMenu.classList.remove('show');
        showToast(
          selectedLang === 'zh'
            ? '已切换为中文语言'
            : selectedLang === 'id'
            ? 'Bahasa Indonesia aktif'
            : 'English language active'
        );
      });
    });
  }

  // Initial application of language
  applyLanguage(savedLang);

  // =========================================================================
  // 2. STICKY HEADER & MOBILE NAVIGATION
  // =========================================================================
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#9776;';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#9776;';
      });
    });
  }

  // =========================================================================
  // 3. FAQ ACCORDION
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isCurrentActive = item.classList.contains('active');
        faqItems.forEach(otherItem => {
          if (otherItem !== item) otherItem.classList.remove('active');
        });
        if (isCurrentActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // =========================================================================
  // 4. INTERACTIVE WHATSAPP INQUIRY GENERATOR
  // =========================================================================
  const consultForm = document.getElementById('consultationForm');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const curLang = localStorage.getItem('ala_lang') || 'en';
      const name = document.getElementById('userName')?.value.trim() || 'Prospective Student';
      const program = document.getElementById('userProgram')?.value || 'Language / School Program';
      const mode = document.getElementById('userMode')?.value || 'Private 1-on-1';
      const ageGroup = document.getElementById('userAgeGroup')?.value || 'General';
      const notes = document.getElementById('userNotes')?.value.trim() || '-';

      let message = '';
      if (curLang === 'zh') {
        message = `您好，阿克萨拉语言学院！%0A%0A我想咨询报读以下课程：` +
          `%0A• *姓名*：${encodeURIComponent(name)}` +
          `%0A• *意向课程*：${encodeURIComponent(program)}` +
          `%0A• *学员年龄/水平*：${encodeURIComponent(ageGroup)}` +
          `%0A• *期望班型*：${encodeURIComponent(mode)}` +
          `%0A• *学习目标/备注*：${encodeURIComponent(notes)}` +
          `%0A%0A请协助提供课表安排、课程大纲及报名详情。非常感谢！%0A(We are ALAvators - achieve higher!)`;
      } else if (curLang === 'id') {
        message = `Halo Aksara Linguistic Academy!%0A%0ASaya ingin berkonsultasi mengenai program belajar:` +
          `%0A• *Nama*: ${encodeURIComponent(name)}` +
          `%0A• *Pilihan Program*: ${encodeURIComponent(program)}` +
          `%0A• *Kategori Usia/Level*: ${encodeURIComponent(ageGroup)}` +
          `%0A• *Metode Kelas*: ${encodeURIComponent(mode)}` +
          `%0A• *Catatan / Kebutuhan Khusus*: ${encodeURIComponent(notes)}` +
          `%0A%0AMohon informasi jadwal tersedia, silabus, dan pendaftarannya. Terima kasih!%0A(We are ALAvators - achieve higher!)`;
      } else {
        message = `Hello Aksara Linguistic Academy!%0A%0AI would like to inquire about your learning programs:` +
          `%0A• *Name*: ${encodeURIComponent(name)}` +
          `%0A• *Selected Program*: ${encodeURIComponent(program)}` +
          `%0A• *Age Group / Current Level*: ${encodeURIComponent(ageGroup)}` +
          `%0A• *Preferred Learning Mode*: ${encodeURIComponent(mode)}` +
          `%0A• *Special Goals / Notes*: ${encodeURIComponent(notes)}` +
          `%0A%0APlease share available class schedules, syllabus, and enrollment details. Thank you!%0A(We are ALAvators - achieve higher!)`;
      }

      const waUrl = `https://wa.me/${ALA_WA_NUMBER}?text=${message}`;
      window.open(waUrl, '_blank');
      showToast(
        curLang === 'zh'
          ? '正在连接至阿克萨拉官方 WhatsApp...'
          : curLang === 'id'
          ? 'Menghubungkan ke WhatsApp Aksara...'
          : 'Connecting to Aksara Linguistic Academy WhatsApp...'
      );
    });
  }

  // Direct WhatsApp program buttons
  const directWABtns = document.querySelectorAll('.btn-direct-wa');
  directWABtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const curLang = localStorage.getItem('ala_lang') || 'en';
      const progName = btn.getAttribute('data-program') || 'Course Information';
      let text = '';
      if (curLang === 'zh') {
        text = `您好，阿克萨拉语言学院！%0A%0A我对【${encodeURIComponent(progName)}】课程非常感兴趣。想请教最新的课程安排、大纲与课表，谢谢！`;
      } else if (curLang === 'id') {
        text = `Halo Admin Aksara Linguistic Academy!%0A%0ASaya tertarik untuk mengetahui informasi lebih lanjut mengenai program: *${encodeURIComponent(progName)}*. Boleh dibantu info jadwal dan silabusnya? Terima kasih!`;
      } else {
        text = `Hello Aksara Linguistic Academy!%0A%0AI am interested in learning more about the *${encodeURIComponent(progName)}* programme. Could you please provide information on schedule, syllabus, and enrollment? Thank you!`;
      }
      const waUrl = `https://wa.me/${ALA_WA_NUMBER}?text=${text}`;
      window.open(waUrl, '_blank');
    });
  });

  // Direct WhatsApp branch/campus buttons
  const branchWABtns = document.querySelectorAll('.btn-branch-wa');
  branchWABtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const curLang = localStorage.getItem('ala_lang') || 'en';
      const branchName = btn.getAttribute('data-branch') || 'Campus';
      let text = '';
      if (curLang === 'zh') {
        text = `您好，阿克萨拉官方招生处！我想咨询 ${encodeURIComponent(branchName)} 校区的班级与课程安排。谢谢！`;
      } else if (curLang === 'id') {
        text = `Halo Admin Aksara ${encodeURIComponent(branchName)}! Saya ingin berkonsultasi mengenai kelas di Cabang ${encodeURIComponent(branchName)}. Terima kasih!`;
      } else {
        text = `Hello Aksara Linguistic Academy! I would like to inquire about classes and schedules at the ${encodeURIComponent(branchName)} Campus. Thank you!`;
      }
      const waUrl = `https://wa.me/${ALA_WA_NUMBER}?text=${text}`;
      window.open(waUrl, '_blank');
    });
  });

  // Toast Notification
  function showToast(text) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
});
