const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  let entries = [
    { code:'DCIT 26', subject:'quiz', title:'Emerging Technologies', date:'2026-04-25', type:'Image',
      url:'files/dcit26_quiz1.1.jpg', images:['files/dcit26_quiz1.1.jpg', 'files/dcit26_quiz1.2.jpg'] },
    // Example with a real linked file and a thumbnail image:
    // { code:'ART 101', subject:'laboratory', title:'Color Theory Exercise', date:'2026-04-10',
    //   type:'PDF', url:'files/color-theory-lab.pdf', image:'files/color-theory-lab-thumb.jpg' },
  ];

  const SUBJECT_LABEL = { quiz:'Quiz', exam:'Exam', laboratory:'Laboratory' };
  const SUBJECT_STAMP = { quiz:'Quiz Logged', exam:'Exam Logged', laboratory:'Lab Logged' };

  let activeFilter = 'all';
  let searchTerm = '';

  const grid = document.getElementById('cardGrid');
  const emptyState = document.getElementById('emptyState');

  function fmtDate(d){
    return new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
  }

  function render(){
    grid.innerHTML = '';
    const filtered = entries.filter(e => {
      const matchesFilter = activeFilter === 'all' || e.subject === activeFilter;
      const matchesSearch = (e.title + ' ' + e.code).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    emptyState.style.display = filtered.length ? 'none' : 'block';

    filtered.forEach((e) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="stamp ${e.subject === 'laboratory' ? 'stamp-lab' : ''}">${SUBJECT_STAMP[e.subject]}</div>
        <div class="card-top">
          <span class="card-code">${e.code}</span>
          <span class="card-type">${e.type}</span>
        </div>
        <h3>${e.title}</h3>
        ${(e.image || (e.images && e.images[0])) ? `<div class="card-thumb" data-index="${entries.indexOf(e)}"><img src="${e.image || e.images[0]}" alt="${e.title}" loading="lazy"></div>` : ''}
        <div class="card-meta">
          <span>${SUBJECT_LABEL[e.subject]}</span>
          <span>${fmtDate(e.date)}</span>
        </div>
        <div class="card-actions">
          <button class="view" data-index="${entries.indexOf(e)}">View</button>
        </div>
      `;
      grid.appendChild(card);
    });

    const statExam = document.getElementById('statExam');
    const statQuiz = document.getElementById('statQuiz');
    const statLab = document.getElementById('statLab');
    if (statExam) statExam.textContent = entries.filter(e => e.subject === 'exam').length;
    if (statQuiz) statQuiz.textContent = entries.filter(e => e.subject === 'quiz').length;
    if (statLab) statLab.textContent = entries.filter(e => e.subject === 'laboratory').length;

    grid.querySelectorAll('.view').forEach(btn => {
      btn.addEventListener('click', () => openModal(entries[+btn.dataset.index]));
    });
    grid.querySelectorAll('.card-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => openModal(entries[+thumb.dataset.index]));
    });
  }

  // ---- filters & search ----
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
    });
  });
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      render();
    });
  }

  // ---- modal ----
  const modalBackdrop = document.getElementById('modalBackdrop');
  function openModal(entry){
    document.getElementById('modalCode').textContent = entry.code;
    document.getElementById('modalTitle').textContent = entry.title;
    document.getElementById('modalMeta').innerHTML =
      `Type: ${SUBJECT_LABEL[entry.subject]}<br>Date: ${fmtDate(entry.date)}<br>File: ${entry.type}` +
      (entry.url ? `<br><a href="${entry.url}" target="_blank" rel="noopener">Open file →</a>` : `<br><em>No linked file yet — add a "url" to this entry in script.js.</em>`);

    const modalGallery = document.getElementById('modalGallery');
    const imageList = entry.images || (entry.image ? [entry.image] : []);
    if (imageList.length) {
      modalGallery.innerHTML = imageList.map(src => `<img src="${src}" alt="${entry.title}" class="gallery-img">`).join('');
      modalGallery.style.display = 'flex';
      modalGallery.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.src));
      });
    } else {
      modalGallery.innerHTML = '';
      modalGallery.style.display = 'none';
    }

    modalBackdrop.classList.add('open');
  }
  document.getElementById('modalClose').addEventListener('click', () => modalBackdrop.classList.remove('open'));
  modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) modalBackdrop.classList.remove('open'); });

  // ---- lightbox (full-size image view) ----
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxImg = document.getElementById('lightboxImg');
  function openLightbox(src){
    lightboxImg.src = src;
    lightboxBackdrop.classList.add('open');
  }
  function closeLightbox(){
    lightboxBackdrop.classList.remove('open');
    lightboxImg.src = '';
  }
  lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  render();