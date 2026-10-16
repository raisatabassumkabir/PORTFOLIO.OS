/* Master Portfolio.OS Controller & Animation Engine */
(function() {
  'use strict';

  // 1. Boot Sequence
  function initBoot() {
    const boot = document.getElementById('boot');
    if (!boot) return;

    const barSpan = boot.querySelector('.boot__bar span');
    const onlineText = boot.querySelector('.boot__online');
    let progress = 0;

    const interval = setInterval(() => {
      progress += 5;
      if (barSpan) barSpan.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        if (onlineText) {
          onlineText.style.opacity = '1';
          onlineText.style.letterSpacing = '0.25em';
        }

        setTimeout(() => {
          boot.classList.add('done');
          document.body.classList.remove('booting');
          triggerHeroReveal();
        }, 400);
      }
    }, 25);
  }

  // 2. SplitText & Hero Intro Animation
  function triggerHeroReveal() {
    const chars = document.querySelectorAll('.hero__title .split-text .char');
    chars.forEach((char, index) => {
      char.style.opacity = '0';
      char.style.transform = 'translateY(100%) rotateZ(8deg)';

      setTimeout(() => {
        char.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
        char.style.opacity = '1';
        char.style.transform = 'translateY(0%) rotateZ(0deg)';
      }, 50 + index * 45);
    });

    const lines = document.querySelectorAll('.hero .reveal-line');
    lines.forEach((line, idx) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(20px)';

      setTimeout(() => {
        line.style.transition = 'transform 0.7s ease, opacity 0.7s ease';
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 300 + idx * 80);
    });
  }

  // 3. Custom Cyber Cursor & Telemetry Coordinates
  function initCursor() {
    const cursor = document.querySelector('.cursor');
    const coordEl = document.getElementById('coordinates');
    if (!cursor) return;

    const dot = cursor.querySelector('i');
    const ring = cursor.querySelector('span');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }

      if (coordEl) {
        coordEl.textContent = `X ${Math.round(mouseX)} / Y ${Math.round(mouseY)}`;
      }
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover triggers
    const hoverTargets = document.querySelectorAll('a, button, [role="button"], .magnetic, .skill-access li, .project-card');
    hoverTargets.forEach((target) => {
      target.addEventListener('pointerenter', () => cursor.classList.add('hover'));
      target.addEventListener('pointerleave', () => cursor.classList.remove('hover'));
    });

    const targetAreas = document.querySelectorAll('#hero-reveal, .hero-portrait, #world');
    targetAreas.forEach((area) => {
      area.addEventListener('pointerenter', () => cursor.classList.add('target'));
      area.addEventListener('pointerleave', () => cursor.classList.remove('target'));
    });
  }

  // 4. Scroll, Sequence Rail & Navbar
  function initScrollSystem() {
    const navbar = document.getElementById('navbar');
    const navProgress = navbar?.querySelector('.nav-progress i');
    const railTrack = document.querySelector('.rail__track i');
    const railLinks = document.querySelectorAll('.rail a');
    const navLinks = document.querySelectorAll('#nav-menu a');
    const chapters = document.querySelectorAll('.chapter');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFrac = Math.max(0, Math.min(1, scrollY / (docHeight || 1)));

      // Navbar state
      if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 60);
      }

      if (navProgress) {
        navProgress.style.width = `${(scrollFrac * 100).toFixed(2)}%`;
      }

      if (railTrack) {
        railTrack.style.top = `${(scrollFrac * 100).toFixed(2)}%`;
      }

      // Active Chapter detection
      let activeChapterId = 'home';
      chapters.forEach((chap) => {
        const rect = chap.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45) {
          activeChapterId = chap.id;
        }
      });

      railLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${activeChapterId}`);
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${activeChapterId}`);
      });
    }, { passive: true });
  }

  // 5. Skills Readout Badges
  function initSkillsReadout() {
    const readout = document.querySelector('.skill-readout');
    const skillItems = document.querySelectorAll('.skill-access li');
    if (!readout || !skillItems.length) return;

    const strong = readout.querySelector('strong');
    const span = readout.querySelector('span');

    skillItems.forEach((item) => {
      item.addEventListener('pointerenter', () => {
        skillItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');

        const skillName = item.getAttribute('data-skill') || item.querySelector('span')?.textContent;
        const detail = item.getAttribute('data-detail') || '';

        if (strong) strong.textContent = skillName.toUpperCase();
        if (span) span.textContent = detail;
      });
    });
  }

  // 6. Career Constellation Spine & Peeks
  function initCareerTimeline() {
    const expSection = document.getElementById('experience');
    if (!expSection) return;

    const spine = expSection.querySelector('.career-line i');
    const nodes = expSection.querySelectorAll('.career-node');
    const counterEl = document.getElementById('career-current');

    window.addEventListener('scroll', () => {
      const rect = expSection.getBoundingClientRect();
      const h = expSection.offsetHeight;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - rect.top) / h));
        if (spine) spine.style.height = `${(progress * 100).toFixed(1)}%`;

        const activeIdx = Math.min(nodes.length - 1, Math.floor(progress * nodes.length));
        nodes.forEach((node, idx) => {
          node.classList.toggle('active', idx === activeIdx);
        });

        if (counterEl) {
          counterEl.textContent = String(activeIdx + 1).padStart(2, '0');
        }
      }
    }, { passive: true });
  }

  // 7. Signature SVG Mask Stroke Draw Animation
  function initSignatureAnimation() {
    const sig = document.querySelector('.contact-cinematic__signature');
    if (!sig) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sig.style.setProperty('--signature-progress', '1');
        }
      });
    }, { threshold: 0.3 });

    observer.observe(sig);
  }

  // 8. Lenis Smooth Scroll Initializer (if script loaded)
  function initLenis() {
    if (typeof window.Lenis === 'function') {
      const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Initialize all subsystems on DOM ready
  function initAll() {
    document.body.classList.add('booting');
    initBoot();
    initCursor();
    initScrollSystem();
    initSkillsReadout();
    initCareerTimeline();
    initSignatureAnimation();
    initLenis();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
