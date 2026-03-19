// Generate stars
  const starsContainer = document.getElementById('stars');
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --d: ${Math.random() * 4 + 2}s;
      --op: ${Math.random() * 0.7 + 0.2};
      animation-delay: ${Math.random() * 5}s;
    `;
    starsContainer.appendChild(star);
  }

  // Generate particles
  const particlesContainer = document.getElementById('particles');
  const colors = ['#ffd700','#ff2d78','#00f5ff','#bf5fff','#7ecfff'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}%;
      bottom: -10px;
      --op: ${Math.random() * 0.4 + 0.1};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    particlesContainer.appendChild(p);
  }

  // 3D tilt effect on cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-12px) scale(1.03) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── CARD LIGHTBOX ──────────────────────────────────────────────────────
  const modal      = document.getElementById('card-modal');
  const modalImg   = document.getElementById('modal-img');
  const modalCard  = document.getElementById('modal-card');
  const modalShine = document.getElementById('modal-shine');
  const sparksEl   = document.getElementById('modal-sparks');
  const backdrop   = document.getElementById('modal-backdrop');
  const closeBtn   = document.getElementById('modal-close');

  function openModal(imgSrc) {
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    spawnSparks(10);
  }
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    modalCard.style.transform = '';
  }

  // Click on any card image → open modal
  document.querySelectorAll('.card-img-wrap img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(img.src);
    });
  });
  // Also clicking the whole card opens it
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.card-img-wrap img');
      if (img) openModal(img.src);
    });
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // 3D tilt on modal card
  let isDragging = false, startX = 0, startY = 0, curRX = 0, curRY = 0;

  modalCard.addEventListener('mousemove', (e) => {
    const rect = modalCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    modalCard.style.transform = `rotateY(${x * 28}deg) rotateX(${-y * 28}deg)`;
    // Move shine
    const px = ((e.clientX - rect.left) / rect.width)  * 100;
    const py = ((e.clientY - rect.top)  / rect.height) * 100;
    modalShine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.3) 0%, transparent 55%)`;
  });

  modalCard.addEventListener('mouseleave', () => {
    modalCard.style.transition = 'transform 0.5s ease';
    modalCard.style.transform = '';
    setTimeout(() => { modalCard.style.transition = 'transform 0.08s ease'; }, 500);
    modalShine.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)';
  });

  // Touch tilt
  modalCard.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = modalCard.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width  - 0.5;
    const y = (touch.clientY - rect.top)  / rect.height - 0.5;
    modalCard.style.transform = `rotateY(${x * 25}deg) rotateX(${-y * 25}deg)`;
  }, { passive: false });

  // Sparks on click
  modalCard.addEventListener('click', (e) => { spawnSparks(8, e); });

  function spawnSparks(count, e) {
    const colors = ['#ffd700','#ff2d78','#00f5ff','#bf5fff','#ffffff'];
    const rect = sparksEl.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist  = 40 + Math.random() * 80;
      const ox = e ? (e.clientX - rect.left) : (rect.width / 2);
      const oy = e ? (e.clientY - rect.top)  : (rect.height / 2);
      s.style.cssText = `
        left:${ox}px; top:${oy}px;
        background:${color};
        box-shadow: 0 0 6px ${color};
        --dx:${Math.cos(angle)*dist}px;
        --dy:${Math.sin(angle)*dist}px;
        animation-delay:${Math.random()*0.2}s;
        width:${3+Math.random()*4}px;
        height:${3+Math.random()*4}px;
      `;
      sparksEl.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  // Flash Offer Countdown Logic
  function initFlashTimer() {
    const timerElement = document.getElementById('tsubaki-timer');
    if (!timerElement) return;

    let timeInSeconds = 2 * 60 * 60; // 2 hours

    const interval = setInterval(() => {
      if (timeInSeconds <= 0) {
        clearInterval(interval);
        timerElement.textContent = "00:00:00";
        return;
      }
      timeInSeconds--;
      const h = Math.floor(timeInSeconds / 3600);
      const m = Math.floor((timeInSeconds % 3600) / 60);
      const s = timeInSeconds % 60;
      timerElement.textContent = 
        String(h).padStart(2, '0') + ':' + 
        String(m).padStart(2, '0') + ':' + 
        String(s).padStart(2, '0');
    }, 1000);
  }
  initFlashTimer();