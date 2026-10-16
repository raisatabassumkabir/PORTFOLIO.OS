/* Three.js Background 3D Cybernetic World Canvas */
(function() {
  'use strict';

  function initThreeWorld() {
    const canvas = document.getElementById('world');
    if (!canvas || !window.THREE) return;

    const THREE = window.THREE;
    const isMobile = window.innerWidth <= 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020706, 0.035);

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 55 : 45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    // Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0x6dbbaa, 0.4);
    const keyLight = new THREE.PointLight(0x62f5b7, 15, 30);
    keyLight.position.set(4, 5, 6);
    const rimLight = new THREE.PointLight(0x54d9ff, 10, 25);
    rimLight.position.set(-5, -2, 4);
    scene.add(ambientLight, keyLight, rimLight);

    // Perspective Ground Grid
    const gridHelper = new THREE.GridHelper(60, 60, 0x174d3b, 0x0c251d);
    gridHelper.position.y = -4.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    scene.add(gridHelper);

    // Particle Cloud
    const particleCount = reducedMotion ? 150 : (isMobile ? 400 : 900);
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 45;
      posArray[i + 1] = (Math.random() - 0.5) * 25;
      posArray[i + 2] = (Math.random() - 0.5) * 40;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x69cdae,
      size: isMobile ? 0.03 : 0.045,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Central Cybernetic Gyro Rings & Core
    const coreGroup = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x62f5b7,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });

    const rings = [2.2, 2.7, 3.2].map((radius, idx) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.02, 6, 80), ringMat);
      ring.rotation.set(idx * 0.7, idx * 0.35, 0);
      coreGroup.add(ring);
      return ring;
    });

    const coreIcosa = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshBasicMaterial({
        color: 0x75ffd0,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      })
    );
    coreGroup.add(coreIcosa);
    coreGroup.position.set(0, 0, -2);
    scene.add(coreGroup);

    // Pointer Interaction
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    window.addEventListener('pointermove', (e) => {
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Scroll Depth Interaction
    let scrollY = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    // Render Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;

      // Parallax & Rotation
      coreGroup.rotation.x = elapsedTime * 0.15 + pointer.y * 0.2;
      coreGroup.rotation.y = elapsedTime * 0.2 + pointer.x * 0.3;

      rings[0].rotation.z = elapsedTime * 0.1;
      rings[1].rotation.x = elapsedTime * -0.15;
      rings[2].rotation.y = elapsedTime * 0.08;

      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      // Camera responds to scroll depth & mouse
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const scrollFrac = scrollY / maxScroll;

      camera.position.x = pointer.x * 0.8;
      camera.position.y = pointer.y * 0.8 - scrollFrac * 2.5;
      camera.position.z = 12 - scrollFrac * 4;
      camera.lookAt(0, -scrollFrac * 2, 0);

      renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeWorld);
  } else {
    initThreeWorld();
  }
})();
