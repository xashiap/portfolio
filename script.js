/**
 * PERSONAL PORTFOLIO - VIDEO EDITOR & MOTION GRAPHICS
 * Logic for bilingual i18n, dark/light theme, portfolio filtering, and modal viewer
 */

document.addEventListener('DOMContentLoaded', () => {
  // State management
  let currentLang = localStorage.getItem('portfolio_lang') || 'fa';
  let currentTheme = localStorage.getItem('portfolio_theme') || 'dark';
  let currentFilter = 'all';

  // DOM Elements
  const htmlRoot = document.documentElement;
  const langToggleBtn = document.getElementById('langToggle');
  const langText = document.getElementById('langText');
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');
  const portfolioGrid = document.getElementById('portfolioGrid');
  const timelineContainer = document.getElementById('timelineContainer');
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalMediaContainer = document.getElementById('modalMediaContainer');
  const modalClient = document.getElementById('modalClient');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTools = document.getElementById('modalTools');
  const modalDate = document.getElementById('modalDate');
  const heroShowreelBtn = document.getElementById('heroShowreelBtn');
  const heroMonitorPlay = document.getElementById('heroMonitorPlay');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const currentYearSpan = document.getElementById('currentYear');

  // Set current year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     THEME SYSTEM
     -------------------------------------------------------------------------- */
  function applyTheme(theme) {
    currentTheme = theme;
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);

    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.setAttribute('title', currentLang === 'fa' ? 'تغییر به تم روشن' : 'Switch to Light Mode');
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.setAttribute('title', currentLang === 'fa' ? 'تغییر به تم تیره' : 'Switch to Dark Mode');
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Initial Theme
  applyTheme(currentTheme);

  /* --------------------------------------------------------------------------
     BILINGUAL (i18n) SYSTEM
     -------------------------------------------------------------------------- */
  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);

    // Direction and language attributes
    htmlRoot.setAttribute('lang', lang);
    htmlRoot.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

    // Toggle button text (shows the OTHER language to switch to)
    langText.textContent = lang === 'fa' ? 'EN' : 'فا';

    // Update document title
    document.title = lang === 'fa' 
      ? 'خشایار آذرپیرا | تدوینگر، طراح موشن گرافیک و گرافیک' 
      : 'Khashayar Azarpira | Video Editor & Motion Designer';

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations[lang], key);
      if (translation) {
        elem.textContent = translation;
      }
    });

    // Update Logo text based on language
    document.querySelectorAll('.logo-text').forEach(lt => {
      lt.innerHTML = lang === 'fa' 
        ? '<span class="gradient-text">خشایار</span> آذرپیرا' 
        : '<span class="gradient-text">Khashayar</span> Azarpira';
    });

    // Update Form Placeholders based on language
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const msgInput = document.getElementById('userMessage');

    if (nameInput) {
      nameInput.placeholder = lang === 'fa' ? 'مثال: علی رضایی' : 'e.g. John Doe';
    }
    if (emailInput) {
      emailInput.placeholder = 'example@domain.com';
    }
    if (msgInput) {
      msgInput.placeholder = lang === 'fa' 
        ? 'ایده، اهداف و جزئیات پروژه خود را بنویسید...' 
        : 'Describe your project vision, timeline, and deliverables...';
    }

    // Re-render dynamic portfolio, timeline & testimonials
    renderPortfolio(currentFilter);
    renderTimeline();
    renderTestimonials();
    updateLikeWidgetTexts();
    applyTheme(currentTheme); // refresh theme tooltips
  }

  langToggleBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'fa' ? 'en' : 'fa');
  });

  /* --------------------------------------------------------------------------
     PORTFOLIO GRID & FILTERING
     -------------------------------------------------------------------------- */
  function renderPortfolio(filter = 'all') {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.category === filter);

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-id', project.id);

      const categoryLabel = translations[currentLang].portfolio[
        project.category === 'computer' ? 'filterComputer' :
        project.category === 'film' ? 'filterFilm' : 'filterPhoto'
      ];

      const toolsBadges = project.tools
        .map(tool => `<span class="tool-chip">${tool}</span>`)
        .join('');

      card.innerHTML = `
        <div class="project-thumb-wrapper">
          <img src="${project.poster}" alt="${project.title[currentLang]}" class="project-thumb" loading="lazy">
          <div class="project-overlay">
            <div class="project-play-icon">
              <i class="fa-solid ${project.type === 'video' ? 'fa-play' : 'fa-magnifying-glass-plus'}"></i>
            </div>
          </div>
          <span class="project-tag">
            <i class="fa-solid ${project.category === 'computer' ? 'fa-desktop' : project.category === 'film' ? 'fa-film' : 'fa-camera'}"></i>
          </span>
        </div>
        <div class="project-body">
          <div class="project-client">${project.client}</div>
          <h3 class="project-title">${project.title[currentLang]}</h3>
          <p class="project-desc">${project.desc[currentLang]}</p>
          <div class="project-tools">
            ${toolsBadges}
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openModal(project);
      });

      portfolioGrid.appendChild(card);
    });
  }

  // Filter Buttons listener
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderPortfolio(currentFilter);
    });
  });

  /* --------------------------------------------------------------------------
     TIMELINE RENDERING
     -------------------------------------------------------------------------- */
  function renderTimeline() {
    if (!timelineContainer) return;
    timelineContainer.innerHTML = '';

    timelineData.forEach(item => {
      const itemElem = document.createElement('div');
      itemElem.className = 'timeline-item';

      itemElem.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <span class="timeline-period">${item.period}</span>
          <h3 class="timeline-role">${item.role[currentLang]}</h3>
          <div class="timeline-company">${item.company[currentLang]}</div>
          <p class="timeline-desc">${item.desc[currentLang]}</p>
        </div>
      `;

      timelineContainer.appendChild(itemElem);
    });
  }

  /* --------------------------------------------------------------------------
     TESTIMONIALS & BRANDS CAROUSEL
     -------------------------------------------------------------------------- */
  const testimonialsTrack = document.getElementById('testimonialsTrack');

  function renderTestimonials() {
    if (!testimonialsTrack || typeof testimonialsData === 'undefined') return;
    testimonialsTrack.innerHTML = '';

    // Duplicate list to achieve continuous seamless marquee loop
    const duplicated = testimonialsData.concat(testimonialsData);

    duplicated.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';

      // Stars
      let starsHtml = '';
      for (let i = 0; i < (t.rating || 5); i++) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      }

      card.innerHTML = `
        <div class="testimonial-top">
          <div class="testimonial-brand-badge">
            <i class="${t.brandIcon || 'fa-solid fa-briefcase'}"></i>
            <span>${t.brand[currentLang]}</span>
          </div>
          <div class="testimonial-stars">
            ${starsHtml}
          </div>
        </div>

        <p class="testimonial-comment">
          «${t.comment[currentLang]}»
        </p>

        <div class="testimonial-author">
          <div class="testimonial-avatar">
            <i class="${t.brandIcon || 'fa-solid fa-user'}"></i>
          </div>
          <div class="testimonial-info">
            <h4>${t.name[currentLang]}</h4>
            <p>${t.role[currentLang]}</p>
          </div>
        </div>
      `;

      testimonialsTrack.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     MODAL VIEWER / SHOWREEL
     -------------------------------------------------------------------------- */
  function openModal(project) {
    if (!projectModal) return;

    modalMediaContainer.innerHTML = '';

    if (project.type === 'video' && project.videoUrl) {
      const video = document.createElement('video');
      video.src = project.videoUrl;
      video.poster = project.poster;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';
      modalMediaContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = project.imageUrl || project.poster;
      img.alt = project.title[currentLang];
      modalMediaContainer.appendChild(img);
    }

    modalClient.textContent = project.client;
    modalTitle.textContent = project.title[currentLang];
    modalDesc.textContent = project.desc[currentLang];
    modalDate.textContent = project.date || '2025';

    modalTools.innerHTML = project.tools
      .map(t => `<span class="tool-chip">${t}</span>`)
      .join('');

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent page scroll
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';

    // Stop video playback when closing
    const video = modalMediaContainer.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
    }
  }

  modalCloseBtn.addEventListener('click', closeModal);

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Hero Showreel Button & Preview Screen Play
  const showreelProject = {
    type: 'video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
    client: 'خشایار آذرپیرا | Showreel',
    title: {
      fa: 'شو ریل تدوین و موشن گرافیک خشایار آذرپیرا',
      en: 'Khashayar Azarpira - Video & Motion Showreel'
    },
    desc: {
      fa: 'مجموعه‌ای گلچین شده از ریتم‌های تند، تدوین‌های سینمایی، اصلاح رنگ و جلوه‌های بصری اجرا شده در سال‌های اخیر.',
      en: 'A compilation of high-impact cuts, cinematic pacing, dynamic sound design, and broadcast motion graphics.'
    },
    tools: ['Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator', 'AI Tools'],
    date: '2025 - 2026'
  };

  if (heroShowreelBtn) {
    heroShowreelBtn.addEventListener('click', () => openModal(showreelProject));
  }

  if (heroMonitorPlay) {
    heroMonitorPlay.addEventListener('click', () => openModal(showreelProject));
  }

  /* --------------------------------------------------------------------------
     MOBILE NAVIGATION
     -------------------------------------------------------------------------- */
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = hamburgerBtn.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburgerBtn.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  /* --------------------------------------------------------------------------
     NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT
     -------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active section link
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     CONTACT FORM HANDLING (Telegram Bot Integration)
     -------------------------------------------------------------------------- */
  if (contactForm) {
    const TG_BOT_TOKEN = '8688674357:AAEAZ_qYsBrgIBzkWC6S4hyX8JouN0rwf_k';
    const TG_CHAT_ID = '6595586966';

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('formSubmitBtn');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const serviceSelect = document.getElementById('userService');
      const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
      const message = document.getElementById('userMessage').value.trim();

      // Show loading indicator
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${translations[currentLang].contact.sending}</span>`;
      formFeedback.style.display = 'none';

      const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const tgMessage = 
`🎬 <b>درخواست پروژه جدید از سایت پورتفولیو</b>\n\n` +
`👤 <b>نام کارفرما:</b> ${escapeHtml(name)}\n` +
`📧 <b>ایمیل:</b> ${escapeHtml(email)}\n` +
`🏷 <b>نوع پروژه:</b> ${escapeHtml(serviceText)}\n\n` +
`📝 <b>توضیحات:</b>\n${escapeHtml(message)}\n\n` +
`🌐 <b>زبان سایت:</b> ${currentLang.toUpperCase()}\n` +
`⏰ <b>زمان ثبت:</b> ${new Date().toLocaleString('fa-IR')}`;

      // Plain text for direct telegram/whatsapp fallback link
      const fallbackText = encodeURIComponent(
`سلام خشایار عزیز، من از طریق سایت پیام می‌دهم:\n\nنام: ${name}\nایمیل: ${email}\nنوع پروژه: ${serviceText}\nتوضیحات: ${message}`
      );

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: tgMessage,
            parse_mode: 'HTML'
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = await response.json();

        if (result.ok) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${translations[currentLang].contact.sentSuccess}`;
          formFeedback.style.display = 'block';
          contactForm.reset();
        } else {
          throw new Error(result.description || 'Telegram API Error');
        }
      } catch (err) {
        // Fallback if Telegram API blocked or network fails
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = `
          <div><i class="fa-solid fa-triangle-exclamation"></i> ${translations[currentLang].contact.sentError}</div>
          <div class="feedback-actions">
            <a href="https://t.me/xashiap?text=${fallbackText}" target="_blank" class="feedback-btn">
              <i class="fa-brands fa-telegram"></i> ${translations[currentLang].contact.btnTelegram}
            </a>
            <a href="https://wa.me/989351289395?text=${fallbackText}" target="_blank" class="feedback-btn">
              <i class="fa-brands fa-whatsapp"></i> ${translations[currentLang].contact.btnWhatsapp}
            </a>
          </div>
        `;
        formFeedback.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /* --------------------------------------------------------------------------
     FLOATING LIKE WIDGET (Bottom-Left)
     -------------------------------------------------------------------------- */
  const likeBtn = document.getElementById('likeBtn');
  const likeCounter = document.getElementById('likeCounter');
  const likeFeedbackTooltip = document.getElementById('likeFeedbackTooltip');
  const likeParticles = document.getElementById('likeParticles');

  const BASE_LIKES = 148;
  let currentLikes = parseInt(localStorage.getItem('portfolio_likes_count'), 10) || BASE_LIKES;
  let hasLiked = localStorage.getItem('portfolio_has_liked') === 'true';
  let tooltipTimeout = null;

  function updateLikeWidgetTexts() {
    if (!likeBtn) return;
    const title = translations[currentLang]?.likeWidget?.btnTitle || 'Like';
    const tooltipText = translations[currentLang]?.likeWidget?.likedText || 'Thanks! ❤️';
    likeBtn.setAttribute('title', title);
    likeBtn.setAttribute('aria-label', title);
    if (likeFeedbackTooltip) {
      likeFeedbackTooltip.textContent = tooltipText;
    }
  }

  function spawnLikeParticles() {
    if (!likeParticles) return;
    const icons = ['❤️', '✨', '💖', '🔥', '🎬'];
    for (let i = 0; i < 7; i++) {
      const p = document.createElement('span');
      p.className = 'like-particle';
      p.textContent = icons[Math.floor(Math.random() * icons.length)];
      
      const dx = (Math.random() * 80 - 40) + 'px';
      const rot = (Math.random() * 60 - 30) + 'deg';
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--rot', rot);
      p.style.left = (Math.random() * 20 - 10) + 'px';
      p.style.top = (Math.random() * 10 - 5) + 'px';
      
      likeParticles.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  function initLikeWidget() {
    if (!likeBtn || !likeCounter) return;

    likeCounter.textContent = currentLikes;
    if (hasLiked) {
      likeBtn.classList.add('liked');
    }

    likeBtn.addEventListener('click', () => {
      // Increment like count
      currentLikes++;
      localStorage.setItem('portfolio_likes_count', currentLikes);
      localStorage.setItem('portfolio_has_liked', 'true');
      likeCounter.textContent = currentLikes;
      likeBtn.classList.add('liked');

      // Heart bounce animation
      const heart = likeBtn.querySelector('.like-heart');
      if (heart) {
        heart.classList.remove('heart-pop');
        void heart.offsetWidth; // force reflow
        heart.classList.add('heart-pop');
      }

      // Spawn burst particles
      spawnLikeParticles();

      // Show tooltip
      if (likeFeedbackTooltip) {
        likeFeedbackTooltip.classList.add('show');
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
          likeFeedbackTooltip.classList.remove('show');
        }, 3000);
      }
    });

    updateLikeWidgetTexts();
  }

  // Initialize Like Widget
  initLikeWidget();

  // Initialize Language
  applyLanguage(currentLang);
});
