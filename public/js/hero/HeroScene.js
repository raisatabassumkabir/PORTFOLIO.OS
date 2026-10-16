/* Hero Cybernetic Circuit Reveal Canvas & Skill Connectors */
(function() {
  'use strict';

  function initHeroReveal() {
    const stage = document.querySelector('.hero-reveal__stage');
    const canvas = document.getElementById('hero-reveal-canvas');
    const heroPortrait = document.getElementById('hero-reveal');
    if (!stage || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = stage.clientWidth || 400;
    let height = stage.clientHeight || 500;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const baseSrc = heroPortrait?.getAttribute('data-base-texture') || 'assets/portrait/portrait-base.png';
    const circuitSrc = heroPortrait?.getAttribute('data-circuit-texture') || 'assets/portrait/portrait-cyber.png';

    const baseImg = new Image();
    const circuitImg = new Image();
    let imagesLoaded = 0;

    function onImageLoad() {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        heroPortrait?.classList.add('hero-reveal-ready');
        drawReveal();
      }
    }

    baseImg.crossOrigin = 'anonymous';
    circuitImg.crossOrigin = 'anonymous';
    baseImg.onload = onImageLoad;
    circuitImg.onload = onImageLoad;
    baseImg.onerror = () => {
      // Graceful fallback to default asset if custom path doesn't load
      baseImg.src = 'public/assets/portrait/portrait-base.png';
    };
    circuitImg.onerror = () => {
      circuitImg.src = 'public/assets/portrait/portrait-cyber.png';
    };

    baseImg.src = baseSrc;
    circuitImg.src = circuitSrc;

    // Interactive lens tracking
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, radius: 0, targetRadius: 0 };
    let locked = false;

    stage.addEventListener('pointerenter', () => {
      if (!locked) mouse.targetRadius = Math.min(width, height) * 0.42;
    });

    stage.addEventListener('pointerleave', () => {
      if (!locked) mouse.targetRadius = 0;
    });

    stage.addEventListener('pointermove', (e) => {
      const rect = stage.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      if (!locked) mouse.targetRadius = Math.min(width, height) * 0.42;
    }, { passive: true });

    // Lock Toggle Button
    const lockBtn = document.querySelector('.hero-reveal-toggle');
    if (lockBtn) {
      lockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        locked = !locked;
        lockBtn.setAttribute('aria-pressed', locked ? 'true' : 'false');
        lockBtn.textContent = locked ? 'Unlock circuit view ✕' : 'Lock circuit view ↗';
        mouse.targetRadius = locked ? Math.min(width, height) * 0.48 : 0;
      });
    }

    function drawReveal() {
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;
      mouse.radius += (mouse.targetRadius - mouse.radius) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Draw cybernetic circuit base
      if (circuitImg.complete && circuitImg.naturalWidth) {
        ctx.drawImage(circuitImg, 0, 0, width, height);
      }

      // Draw normal portrait on top, clipped with lens hole revealing circuit underneath
      if (baseImg.complete && baseImg.naturalWidth) {
        ctx.save();
        if (mouse.radius > 2) {
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2, true);
          ctx.clip();
        }
        ctx.drawImage(baseImg, 0, 0, width, height);
        ctx.restore();

        // Glowing cyan-mint lens ring
        if (mouse.radius > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#62f5b7';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#62f5b7';
          ctx.shadowBlur = 18;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, mouse.radius * 0.94, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(84, 217, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      }

      requestAnimationFrame(drawReveal);
    }

    window.addEventListener('resize', () => {
      width = stage.clientWidth || 400;
      height = stage.clientHeight || 500;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroReveal);
  } else {
    initHeroReveal();
  }
})();
