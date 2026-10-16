/* Profile Section Assembly Card Tilt & Counter Telemetry */
(function() {
  'use strict';

  function initProfileAssembly() {
    const section = document.getElementById('about');
    if (!section) return;

    const cards = section.querySelectorAll('.profile-assembly-card');
    const counters = section.querySelectorAll('[data-count]');

    // Pointer-driven 3D tilt on assembly cards
    section.addEventListener('pointermove', (e) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card, idx) => {
        const factor = (idx % 2 === 0 ? 1 : -1) * (1 + idx * 0.2);
        const turn = nx * 8 * factor;
        const moveX = nx * 15 * factor;
        const moveY = ny * 15 * factor;

        card.style.setProperty('--assembly-turn', `${turn.toFixed(2)}deg`);
        card.style.setProperty('--assembly-x', `${moveX.toFixed(1)}px`);
        card.style.setProperty('--assembly-y', `${moveY.toFixed(1)}px`);
      });
    }, { passive: true });

    section.addEventListener('pointerleave', () => {
      cards.forEach((card) => {
        card.style.setProperty('--assembly-turn', '0deg');
        card.style.setProperty('--assembly-x', '0px');
        card.style.setProperty('--assembly-y', '0px');
      });
    });

    // Count-up animation on scroll into view
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((el) => {
            const target = parseInt(el.getAttribute('data-count'), 10) || 0;
            let current = 0;
            const duration = 1500;
            const stepTime = 30;
            const stepIncrement = Math.max(1, Math.ceil(target / (duration / stepTime)));

            const timer = setInterval(() => {
              current += stepIncrement;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = current;
            }, stepTime);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileAssembly);
  } else {
    initProfileAssembly();
  }
})();
