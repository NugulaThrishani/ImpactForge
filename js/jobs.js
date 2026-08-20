/* ============================================================
   OpportuMap â€” Jobs Board Logic
   ============================================================ */

let filteredJobs = [...JOBS_DATA];
let selectedSkills = [];
let activeCategory = '';
let activeMode = '';
let activeType = '';
let searchQuery = '';
let locationQuery = '';
let activeQuickFilter = 'all';
let isGridView = true;
let openJobId = null;

// â”€â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.addEventListener('DOMContentLoaded', () => {
  buildSkillFilters();
  buildCategoryFilters();
  buildTypeFilters();
  applyUrlParams();
  renderJobs();
  initJobEvents();
});

// â”€â”€â”€ URL Param handling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('category')) {
    activeCategory = params.get('category');
  }
  if (params.get('mode')) {
    const mode = params.get('mode');
    activeMode = mode;
    const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (radio) radio.checked = true;
  }
  // Apply filters if any URL params were set
  if (params.get('category') || params.get('mode')) {
    applyFilters();
  }
}

// â”€â”€â”€ Build Sidebar Filters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildSkillFilters() {
  const container = document.getElementById('skill-filter-tags');
  const topSkills = JOB_SKILLS.slice(0, 20);
  topSkills.forEach(skill => {
    const tag = document.createElement('button');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    tag.dataset.skill = skill;
    tag.addEventListener('click', () => toggleSkill(skill, tag));
    container.appendChild(tag);
  });
}

function buildCategoryFilters() {
  const container = document.getElementById('category-filters');
  const allItem = createCategoryItem('All Categories', '', JOBS_DATA.length);
  container.appendChild(allItem);
  JOB_CATEGORIES.forEach(cat => {
    const count = JOBS_DATA.filter(j => j.category === cat).length;
    container.appendChild(createCategoryItem(cat, cat, count));
  });
}

function createCategoryItem(label, value, count) {
  const div = document.createElement('div');
  div.className = 'category-filter-item' + (value === activeCategory ? ' active' : '');
  div.dataset.cat = value;
  div.innerHTML = `<span>${label}</span><span class="category-count">${count}</span>`;
  div.addEventListener('click', () => {
    activeCategory = value;
    document.querySelectorAll('.category-filter-item').forEach(el => el.classList.remove('active'));
    div.classList.add('active');
    applyFilters();
  });
  return div;
}

function buildTypeFilters() {
  const container = document.getElementById('type-filters');
  JOB_TYPES.forEach((type, i) => {
    const label = document.createElement('label');
    label.className = 'checkbox-wrap' + (i > 0 ? ' mt-2' : '');
    label.setAttribute('for', `type-${i}`);
    label.innerHTML = `<input type="checkbox" id="type-${i}" value="${type}"> ${type}`;
    label.querySelector('input').addEventListener('change', () => {
      activeType = label.querySelector('input').checked ? type : '';
      document.querySelectorAll('#type-filters input[type="checkbox"]').forEach(cb => {
        if (cb !== label.querySelector('input')) cb.checked = false;
      });
      applyFilters();
    });
    container.appendChild(label);
  });
}

// â”€â”€â”€ Skill Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function toggleSkill(skill, tagEl) {
  const idx = selectedSkills.indexOf(skill);
  if (idx >= 0) {
    selectedSkills.splice(idx, 1);
    tagEl.classList.remove('active');
  } else {
    selectedSkills.push(skill);
    tagEl.classList.add('active');
  }
  const banner = document.getElementById('match-banner');
  if (banner) banner.style.display = selectedSkills.length ? 'flex' : 'none';
  applyFilters();
}

// â”€â”€â”€ Apply All Filters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function applyFilters() {
  let jobs = [...JOBS_DATA];

  // Search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.skills.some(s => s.toLowerCase().includes(q)) ||
      j.category.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q)
    );
  }

  // Location
  if (locationQuery) {
    const l = locationQuery.toLowerCase();
    jobs = jobs.filter(j =>
      j.location.toLowerCase().includes(l) ||
      (l === 'remote' && j.mode === 'Remote')
    );
  }

  // Quick filter
  if (activeQuickFilter === 'remote') jobs = jobs.filter(j => j.mode === 'Remote');
  if (activeQuickFilter === 'urgent') jobs = jobs.filter(j => j.urgent);
  if (activeQuickFilter === 'fulltime') jobs = jobs.filter(j => j.type === 'Full-time');
  if (activeQuickFilter === 'parttime') jobs = jobs.filter(j => j.type === 'Part-time');
  if (activeQuickFilter === 'freelance') jobs = jobs.filter(j => j.type === 'Freelance');

  // Category
  if (activeCategory) jobs = jobs.filter(j => j.category === activeCategory);

  // Mode
  if (activeMode) jobs = jobs.filter(j => j.mode === activeMode);

  // Type
  if (activeType) jobs = jobs.filter(j => j.type === activeType);

  // Skill match sort (matching jobs first)
  if (selectedSkills.length > 0) {
    jobs = jobs.sort((a, b) => {
      const aMatch = selectedSkills.filter(s => a.skills.includes(s)).length;
      const bMatch = selectedSkills.filter(s => b.skills.includes(s)).length;
      return bMatch - aMatch;
    });
  }

  filteredJobs = jobs;
  renderJobs();
}

// â”€â”€â”€ Render Jobs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderJobs() {
  const container = document.getElementById('jobs-container');
  const emptyState = document.getElementById('empty-state');
  const countEl = document.getElementById('results-count');

  if (!container) return;

  container.innerHTML = '';

  if (filteredJobs.length === 0) {
    emptyState.style.display = 'flex';
    countEl.textContent = '0 jobs found';
    return;
  }

  emptyState.style.display = 'none';
  countEl.textContent = `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`;

  filteredJobs.forEach((job, i) => {
    const matchCount = selectedSkills.length > 0
      ? selectedSkills.filter(s => job.skills.includes(s)).length
      : 0;
    const isMatch = matchCount > 0;
    const saved = isJobSaved(job.id);

    const card = document.createElement('div');
    card.className = `card job-card${isMatch ? ' match-highlight' : ''}`;
    card.style.animationDelay = `${Math.min(i * 0.05, 0.4)}s`;
    card.dataset.id = job.id;
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${job.title} at ${job.company}`);

    card.innerHTML = `
      <div class="job-card__top">
        <div class="job-icon" style="background:${job.color}18; border:1px solid ${job.color}30;">
          ${job.logo}
        </div>
        <div style="flex:1; min-width:0;">
          <div class="job-card__title">${job.title}</div>
          <div class="job-card__company">${job.company}</div>
        </div>
        <button class="job-card__save ${saved ? 'saved' : ''}" data-id="${job.id}" aria-label="${saved ? 'Unsave' : 'Save'} ${job.title}">
          ${saved ? 'â˜…' : 'â˜†'}
        </button>
      </div>
      <div class="job-card__meta">
        <span class="badge badge--neutral">ðŸ“ ${job.location}</span>
        <span class="badge badge--neutral">${job.mode}</span>
        <span class="badge badge--neutral">${job.type}</span>
        ${job.urgent ? '<span class="badge badge--warn">ðŸ”¥ Urgent</span>' : ''}
      </div>
      <div class="job-card__skills">
        ${job.skills.slice(0, 3).map(s => {
          const isSelected = selectedSkills.includes(s);
          return `<span class="skill-tag${isSelected ? ' active' : ''}">${s}</span>`;
        }).join('')}
        ${job.skills.length > 3 ? `<span class="skill-tag">+${job.skills.length - 3}</span>` : ''}
      </div>
      <div class="job-card__footer">
        <div>
          <div class="job-salary">${job.salary}</div>
          <div class="job-posted text-xs text-faint">${job.posted}</div>
        </div>
        <button class="btn btn--primary btn--sm" data-action="view" data-id="${job.id}" id="view-job-${job.id}">View â†’</button>
      </div>
    `;

    container.appendChild(card);
  });

  container.classList.toggle('list-view', !isGridView);
}

// â”€â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function initJobEvents() {
  // Search
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const locationInput = document.getElementById('location-input');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchQuery = searchInput.value.trim();
      locationQuery = locationInput.value.trim();
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.trim();
        locationQuery = locationInput.value.trim();
        applyFilters();
      }
    });
  }

  // Quick filters
  document.querySelectorAll('.quick-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quick-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeQuickFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  // Mode radio
  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      activeMode = radio.value;
      applyFilters();
    });
  });

  // Clear skills
  const clearSkillsBtn = document.getElementById('clear-skills-btn');
  if (clearSkillsBtn) {
    clearSkillsBtn.addEventListener('click', () => {
      selectedSkills = [];
      document.querySelectorAll('.skill-tag').forEach(t => t.classList.remove('active'));
      const banner = document.getElementById('match-banner');
      if (banner) banner.style.display = 'none';
      applyFilters();
    });
  }

  const clearMatchBtn = document.getElementById('clear-match-btn');
  if (clearMatchBtn) {
    clearMatchBtn.addEventListener('click', () => {
      selectedSkills = [];
      document.querySelectorAll('.skill-tag').forEach(t => t.classList.remove('active'));
      document.getElementById('match-banner').style.display = 'none';
      applyFilters();
    });
  }

  // Reset all
  const resetBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  [resetBtn, emptyResetBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', resetAll);
  });

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      if (sortSelect.value === 'urgent') {
        filteredJobs = [...filteredJobs].sort((a, b) => b.urgent - a.urgent);
      } else if (sortSelect.value === 'newest') {
        filteredJobs = [...JOBS_DATA].filter(j => filteredJobs.find(f => f.id === j.id));
      }
      renderJobs();
    });
  }

  // View toggle
  const gridBtn = document.getElementById('view-grid');
  const listBtn = document.getElementById('view-list');
  if (gridBtn) {
    gridBtn.addEventListener('click', () => {
      isGridView = true;
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      document.getElementById('jobs-container').classList.remove('list-view');
    });
  }
  if (listBtn) {
    listBtn.addEventListener('click', () => {
      isGridView = false;
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      document.getElementById('jobs-container').classList.add('list-view');
    });
  }

  // Job card clicks â€” open modal
  document.getElementById('jobs-container').addEventListener('click', e => {
    const saveBtn = e.target.closest('.job-card__save');
    if (saveBtn) {
      e.stopPropagation();
      const id = saveBtn.dataset.id;
      const nowSaved = toggleSaveJob(id);
      saveBtn.textContent = nowSaved ? 'â˜…' : 'â˜†';
      saveBtn.classList.toggle('saved', nowSaved);

      // Also update modal save button if open
      if (openJobId === id) {
        const modalSaveBtn = document.getElementById('modal-save-btn');
        if (modalSaveBtn) {
          modalSaveBtn.textContent = nowSaved ? 'â˜… Saved' : 'â˜† Save Job';
        }
      }
      return;
    }

    const card = e.target.closest('.job-card');
    if (card) openJobModal(card.dataset.id);
  });

  // Modal close
  const modal = document.getElementById('job-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeJobModal);
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeJobModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeJobModal();
  });

  // Modal buttons
  const modalSaveBtn = document.getElementById('modal-save-btn');
  const modalApplyBtn = document.getElementById('modal-apply-btn');
  if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', () => {
      if (!openJobId) return;
      const nowSaved = toggleSaveJob(openJobId);
      modalSaveBtn.textContent = nowSaved ? 'â˜… Saved' : 'â˜† Save Job';
      // Update card save button
      const cardSave = document.querySelector(`.job-card__save[data-id="${openJobId}"]`);
      if (cardSave) {
        cardSave.textContent = nowSaved ? 'â˜…' : 'â˜†';
        cardSave.classList.toggle('saved', nowSaved);
      }
    });
  }
  if (modalApplyBtn) {
    modalApplyBtn.addEventListener('click', () => {
      if (!openJobId) return;
      const job = JOBS_DATA.find(j => j.id === openJobId);
      if (job) {
        addApplication(job);
        closeJobModal();
      }
    });
  }
}

// â”€â”€â”€ Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function openJobModal(id) {
  const job = JOBS_DATA.find(j => j.id === id);
  if (!job) return;
  openJobId = id;

  document.getElementById('modal-icon').style.background = `${job.color}18`;
  document.getElementById('modal-icon').style.border = `1px solid ${job.color}40`;
  document.getElementById('modal-icon').textContent = job.logo;
  document.getElementById('modal-job-title').textContent = job.title;
  document.getElementById('modal-company').textContent = `${job.company} Â· ${job.location}`;
  document.getElementById('modal-salary').textContent = job.salary;
  document.getElementById('modal-description').textContent = job.description;

  document.getElementById('modal-badges').innerHTML = `
    <span class="badge badge--neutral">${job.mode}</span>
    <span class="badge badge--neutral">${job.type}</span>
    <span class="badge badge--neutral">ðŸ“ ${job.location}</span>
    ${job.urgent ? '<span class="badge badge--warn">ðŸ”¥ Urgent Hiring</span>' : ''}
    <span class="badge badge--neutral">Posted ${job.posted}</span>
  `;

  document.getElementById('modal-skills').innerHTML =
    job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');

  const saved = isJobSaved(id);
  document.getElementById('modal-save-btn').textContent = saved ? 'â˜… Saved' : 'â˜† Save Job';

  document.getElementById('job-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeJobModal() {
  document.getElementById('job-modal').classList.remove('open');
  document.body.style.overflow = '';
  openJobId = null;
}

// â”€â”€â”€ Reset â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function resetAll() {
  searchQuery = '';
  locationQuery = '';
  activeCategory = '';
  activeMode = '';
  activeType = '';
  activeQuickFilter = 'all';
  selectedSkills = [];

  const si = document.getElementById('search-input');
  const li = document.getElementById('location-input');
  if (si) si.value = '';
  if (li) li.value = '';

  document.querySelectorAll('.quick-filter').forEach(b => b.classList.remove('active'));
  document.querySelector('.quick-filter[data-filter="all"]')?.classList.add('active');
  document.querySelector('input[name="mode"][value=""]')?.click();
  document.querySelectorAll('#type-filters input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('.category-filter-item').forEach((el, i) => {
    el.classList.toggle('active', i === 0);
  });
  document.querySelectorAll('.skill-tag').forEach(t => t.classList.remove('active'));

  const banner = document.getElementById('match-banner');
  if (banner) banner.style.display = 'none';

  filteredJobs = [...JOBS_DATA];
  renderJobs();
}

