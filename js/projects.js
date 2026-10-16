/* Project Matrix Switcher, Dynamic Ambient Colors & Dossier Modal */
(function() {
  'use strict';

  function initProjects() {
    const portfolio = document.getElementById('portfolio');
    if (!portfolio) return;

    const cards = portfolio.querySelectorAll('.project-card');
    const currentEl = document.getElementById('project-current');
    const modal = document.getElementById('project-modal');
    let activeIndex = 0;

    // Theme RGB palettes for the projects
    const palettes = [
      { panel: [255, 255, 255], muted: [92, 101, 76], text: [14, 17, 7], accent: [0, 143, 101], bg: [239, 250, 225] }, // Ryde
      { panel: [10, 28, 32], muted: [100, 140, 148], text: [230, 245, 248], accent: [45, 185, 215], bg: [4, 15, 18] },   // MIA
      { panel: [255, 250, 240], muted: [120, 105, 80], text: [24, 20, 14], accent: [180, 140, 60], bg: [248, 242, 230] }, // ClientBook
      { panel: [12, 22, 34], muted: [110, 145, 175], text: [235, 245, 255], accent: [70, 155, 240], bg: [5, 12, 20] },    // SaifLocators
      { panel: [22, 18, 38], muted: [140, 130, 180], text: [245, 240, 255], accent: [165, 130, 255], bg: [9, 7, 18] },    // Linear Craze
      { panel: [28, 16, 12], muted: [160, 125, 110], text: [255, 242, 235], accent: [230, 130, 75], bg: [12, 7, 5] }      // CoffeeBrew
    ];

    function applyProjectTheme(index) {
      const theme = palettes[index] || palettes[0];
      const root = document.documentElement;

      root.style.setProperty('--project-panel-r', theme.panel[0]);
      root.style.setProperty('--project-panel-g', theme.panel[1]);
      root.style.setProperty('--project-panel-b', theme.panel[2]);

      root.style.setProperty('--project-muted-r', theme.muted[0]);
      root.style.setProperty('--project-muted-g', theme.muted[1]);
      root.style.setProperty('--project-muted-b', theme.muted[2]);

      root.style.setProperty('--project-text-r', theme.text[0]);
      root.style.setProperty('--project-text-g', theme.text[1]);
      root.style.setProperty('--project-text-b', theme.text[2]);

      root.style.setProperty('--project-accent-r', theme.accent[0]);
      root.style.setProperty('--project-accent-g', theme.accent[1]);
      root.style.setProperty('--project-accent-b', theme.accent[2]);

      root.style.setProperty('--project-background-r', theme.bg[0]);
      root.style.setProperty('--project-background-g', theme.bg[1]);
      root.style.setProperty('--project-background-b', theme.bg[2]);
    }

    function setActiveProject(index) {
      if (index < 0 || index >= cards.length) return;
      activeIndex = index;

      cards.forEach((card, idx) => {
        card.classList.toggle('active', idx === index);
      });

      if (currentEl) {
        currentEl.textContent = String(index + 1).padStart(2, '0');
      }

      applyProjectTheme(index);
    }

    // Scroll-based advance through project cards
    window.addEventListener('scroll', () => {
      const rect = portfolio.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top <= viewportHeight * 0.5 && rect.bottom >= viewportHeight * 0.5) {
        const progress = Math.max(0, Math.min(1, (viewportHeight * 0.5 - rect.top) / (rect.height - viewportHeight)));
        const targetIndex = Math.min(cards.length - 1, Math.floor(progress * cards.length));
        if (targetIndex !== activeIndex) {
          setActiveProject(targetIndex);
        }
      }
    }, { passive: true });

    // Initial project theme
    applyProjectTheme(0);

    // Modal Manager
    if (modal) {
      const modalIndex = document.getElementById('project-modal-index');
      const modalCategory = document.getElementById('project-modal-category');
      const modalTitle = document.getElementById('project-modal-title');
      const modalDesc = document.getElementById('project-modal-description');
      const modalTech = document.getElementById('project-modal-tech');
      const modalLinks = document.getElementById('project-modal-links');
      const modalCaseStudy = document.getElementById('project-case-study');
      const modalMockup = document.getElementById('project-modal-mockup');
      const modalCode = document.getElementById('project-modal-code');
      const closeBtn = modal.querySelector('.project-modal__close');

      function openModal(card) {
        const code = card.getAttribute('data-code') || 'PROJ';
        const caseStudyKey = card.getAttribute('data-case-study');
        const num = card.querySelector('.project-card__number')?.textContent || 'P / 01';
        const category = card.querySelector('.project-card__body p:first-child')?.textContent || '';
        const title = card.querySelector('.project-card__body h3')?.textContent || '';
        const desc = card.querySelector('.project-card__body p:nth-child(3)')?.textContent || '';
        const mockupSrc = card.getAttribute('data-mockup');

        if (modalIndex) modalIndex.textContent = num;
        if (modalCategory) modalCategory.textContent = category;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalCode) modalCode.textContent = code;

        if (modalMockup && mockupSrc) {
          modalMockup.src = mockupSrc;
          modalMockup.hidden = false;
        }

        // Tech pills
        if (modalTech) {
          modalTech.innerHTML = '';
          const pills = card.querySelectorAll('.project-card__body li');
          pills.forEach((p) => {
            const li = document.createElement('li');
            li.textContent = p.textContent;
            modalTech.appendChild(li);
          });
        }

        // Case study injection from template
        if (modalCaseStudy && caseStudyKey) {
          const tmpl = document.getElementById(`case-study-${caseStudyKey}`);
          if (tmpl) {
            modalCaseStudy.innerHTML = tmpl.innerHTML;
            modalCaseStudy.hidden = false;
          } else {
            modalCaseStudy.hidden = true;
          }
        }

        modal.showModal();
        document.body.style.overflow = 'hidden';
      }

      function closeModal() {
        modal.close();
        document.body.style.overflow = '';
      }

      cards.forEach((card) => {
        const btn = card.querySelector('.project-card__open');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(card);
          });
        }
        card.addEventListener('click', () => openModal(card));
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.open) closeModal();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
  } else {
    initProjects();
  }
})();
