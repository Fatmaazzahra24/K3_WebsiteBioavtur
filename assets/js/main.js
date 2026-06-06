const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('[data-reveal]');
const siteHeader = document.querySelector('.site-header');
const processModal = document.querySelector('.process-modal');
const processSteps = document.querySelectorAll('[data-process-step]');

const processDetails = {
  '01': {
    step: 'Tahap 01',
    tag: 'Bahan Baku',
    title: 'Minyak Jelantah sebagai Bahan Baku',
    lead: 'Bioavtur diawali dari pemanfaatan used cooking oil yang dikumpulkan, dipilah, dan dipastikan kualitasnya agar aman masuk ke rantai produksi.',
    points: [
      'Bahan baku berasal dari limbah minyak jelantah yang telah melalui proses seleksi awal.',
      'Tahap ini membantu mengurangi limbah sekaligus memberi nilai tambah pada sumber energi terbarukan.',
      'Konsistensi kualitas bahan baku penting agar proses lanjutan berjalan stabil dan efisien.'
    ]
  },
  '02': {
    step: 'Tahap 02',
    tag: 'Green Refinery',
    title: 'Green Refinery Pertamina',
    lead: 'Bahan baku terbarukan kemudian masuk ke fasilitas Green Refinery yang dirancang untuk memproses energi rendah emisi dengan standar industri modern.',
    points: [
      'Fasilitas refinery menyiapkan bahan baku agar sesuai dengan parameter proses berikutnya.',
      'Integrasi sistem kilang membantu menjaga efisiensi energi, keselamatan kerja, dan kontrol kualitas.',
      'Tahap ini menjadi fondasi utama agar produksi SAF tetap konsisten pada skala industri.'
    ]
  },
  '03': {
    step: 'Tahap 03',
    tag: 'Pengolahan',
    title: 'Proses Hydrotreating',
    lead: 'Pada tahap hydrotreating, bahan baku diolah untuk menghilangkan pengotor dan menyesuaikan karakteristiknya agar memenuhi kebutuhan bahan bakar penerbangan.',
    points: [
      'Reaksi dengan hidrogen membantu membersihkan senyawa yang tidak dibutuhkan dalam bahan bakar akhir.',
      'Tahapan ini mendukung hasil pembakaran yang lebih bersih dan performa yang lebih stabil.',
      'Kontrol temperatur, tekanan, dan kualitas produk dilakukan secara ketat selama proses berlangsung.'
    ]
  },
  '04': {
    step: 'Tahap 04',
    tag: 'Produk SAF',
    title: 'Menjadi Bioavtur (SAF)',
    lead: 'Setelah proses pengolahan selesai, produk akhir berupa Sustainable Aviation Fuel dipastikan memenuhi spesifikasi teknis untuk mendukung operasional penerbangan.',
    points: [
      'Produk akhir dirancang kompatibel dengan kebutuhan bahan bakar pesawat modern.',
      'Karakteristik SAF mendukung pengurangan emisi dibanding bahan bakar avtur konvensional.',
      'Kualitas akhir diverifikasi agar siap digunakan dalam ekosistem penerbangan yang aman dan andal.'
    ]
  },
  '05': {
    step: 'Tahap 05',
    tag: 'Aplikasi Akhir',
    title: 'Penerbangan Rendah Emisi',
    lead: 'SAF menjadi bagian dari perjalanan dekarbonisasi sektor penerbangan dengan manfaat nyata bagi efisiensi emisi dan transisi energi masa depan.',
    points: [
      'Penggunaan bioavtur membantu menurunkan jejak karbon penerbangan secara bertahap.',
      'Tahap ini menunjukkan hubungan langsung antara inovasi refinery dan manfaat lingkungan yang dirasakan pengguna akhir.',
      'Bioavtur mendukung target keberlanjutan nasional dan global di sektor transportasi udara.'
    ]
  }
};

function revealOnScroll() {
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupPlaneParallax() {
  const plane = document.querySelector('[data-parallax="plane"]');
  const hero = document.getElementById('hero');
  const takeoffDuration = 3100;

  if (!plane || !hero || reducedMotion) {
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const startedAt = performance.now();

  const updateTarget = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    targetX = (x - 0.5) * 14;
    targetY = (y - 0.5) * 10;
  };

  hero.addEventListener('pointermove', (event) => {
    updateTarget(event.clientX, event.clientY);
  });

  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
  });

  const animate = (now) => {
    const elapsed = now - startedAt;
    const idleProgress = Math.min(Math.max((elapsed - takeoffDuration) / 900, 0), 1);
    const idleStrength = idleProgress * idleProgress * (3 - 2 * idleProgress);
    const idleX = Math.sin(elapsed / 1700) * 7 * idleStrength;
    const idleY = Math.cos(elapsed / 2200) * 5 * idleStrength;

    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    const x = currentX * idleStrength + idleX;
    const y = currentY * idleStrength + idleY;

    plane.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(-7deg)`;
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

function setupHeaderState() {
  if (!siteHeader) {
    return;
  }

  const updateHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function setupProcessModal() {
  if (!processModal || !processSteps.length) {
    return;
  }

  const title = processModal.querySelector('#process-modal-title');
  const lead = processModal.querySelector('#process-modal-lead');
  const points = processModal.querySelector('#process-modal-points');
  const stepLabel = processModal.querySelector('#process-modal-step');
  const tagLabel = processModal.querySelector('#process-modal-tag');
  const closeButtons = processModal.querySelectorAll('[data-process-close]');
  let activeStep = null;

  const closeModal = () => {
    processModal.hidden = true;
    document.body.style.overflow = '';

    if (activeStep) {
      activeStep.focus();
      activeStep = null;
    }
  };

  const openModal = (step) => {
    const detail = processDetails[step.dataset.processStep];

    if (!detail) {
      return;
    }

    activeStep = step;
    stepLabel.textContent = detail.step;
    tagLabel.textContent = detail.tag;
    title.textContent = detail.title;
    lead.textContent = detail.lead;
    points.innerHTML = detail.points.map((point) => `<li>${point}</li>`).join('');
    processModal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  processSteps.forEach((step) => {
    step.addEventListener('click', () => openModal(step));
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !processModal.hidden) {
      closeModal();
    }
  });
}

revealOnScroll();
setupPlaneParallax();
setupHeaderState();
setupProcessModal();
