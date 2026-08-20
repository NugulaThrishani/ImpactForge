/* ============================================================
   OpportuMap — Profile Page Logic
   ============================================================ */

const SKILL_OPTIONS = [
  'JavaScript', 'HTML/CSS', 'React', 'Python', 'Git', 'Data Analysis',
  'Microsoft Excel', 'Communication', 'Teamwork', 'Arabic', 'English',
  'French', 'German', 'Farsi', 'Teaching', 'Nursing', 'Patient Care',
  'Customer Service', 'Driving License', 'Cooking', 'Sewing', 'Carpentry',
  'Empathy', 'Problem Solving', 'Research', 'Writing', 'Social Media',
  'Adobe Photoshop', 'Childcare', 'Attention to Detail', 'Physical Fitness'
];

let selectedProfileSkills = [];

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  buildSkillsPicker();
  loadProfile();
  renderSavedJobs();
  renderApplications();
  updateStats();
  initFormSubmit();
});

// ─── Tabs ─────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.profile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.profile-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-content-${tab}`).classList.add('active');

      if (tab === 'saved') renderSavedJobs();
      if (tab === 'tracker') renderApplications();
    });
  });

  // Handle hash links
  const hash = window.location.hash.replace('#', '');
  if (hash === 'saved' || hash === 'tracker') {
    document.querySelector(`[data-tab="${hash}"]`)?.click();
  }
}

// ─── Skills Picker ────────────────────────────────────────────
function buildSkillsPicker() {
  const container = document.getElementById('skills-picker');
  SKILL_OPTIONS.forEach(skill => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'skill-tag';
    btn.textContent = skill;
    btn.dataset.skill = skill;
    btn.addEventListener('click', () => {
      const idx = selectedProfileSkills.indexOf(skill);
      if (idx >= 0) {
        selectedProfileSkills.splice(idx, 1);
        btn.classList.remove('active');
      } else {
        selectedProfileSkills.push(skill);
        btn.classList.add('active');
      }
    });
    container.appendChild(btn);
  });
}

// ─── Load / Save Profile ──────────────────────────────────────
function loadProfile() {
  const profile = getProfile();
  if (!profile || !profile.name) return;

  document.getElementById('input-name').value     = profile.name || '';
  document.getElementById('input-location').value = profile.location || '';
  document.getElementById('input-email').value    = profile.email || '';
  document.getElementById('input-phone').value    = profile.phone || '';
  document.getElementById('input-bio').value      = profile.bio || '';
  document.getElementById('input-experience').value = profile.experience || '';
  document.getElementById('input-worktype').value = profile.worktype || '';
  document.getElementById('input-linkedin').value = profile.linkedin || '';

  // Languages
  (profile.languages || []).forEach(lang => {
    const cb = document.querySelector(`#language-grid input[value="${lang}"]`);
    if (cb) cb.checked = true;
  });

  // Skills
  selectedProfileSkills = profile.skills || [];
  selectedProfileSkills.forEach(skill => {
    const btn = document.querySelector(`#skills-picker [data-skill="${skill}"]`);
    if (btn) btn.classList.add('active');
  });

  updateDisplayCard(profile);
}

function updateDisplayCard(profile) {
  const name = profile.name || 'Your Name';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?';
  document.getElementById('profile-avatar-display').textContent = initials;
  document.getElementById('profile-name-display').textContent   = name;
  document.getElementById('profile-location-display').textContent = profile.location || 'Location not set';
}

function updateStats() {
  const saved = getSavedJobs().length;
  const apps  = getApplications().length;
  const profile = getProfile();
  const skills  = (profile && profile.skills) ? profile.skills.length : 0;

  document.getElementById('stat-saved').textContent   = saved;
  document.getElementById('stat-applied').textContent = apps;
  document.getElementById('stat-skills').textContent  = skills;
}

function initFormSubmit() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const languages = [...document.querySelectorAll('#language-grid input:checked')].map(cb => cb.value);

    const profile = {
      name:       document.getElementById('input-name').value.trim(),
      location:   document.getElementById('input-location').value.trim(),
      email:      document.getElementById('input-email').value.trim(),
      phone:      document.getElementById('input-phone').value.trim(),
      bio:        document.getElementById('input-bio').value.trim(),
      experience: document.getElementById('input-experience').value,
      worktype:   document.getElementById('input-worktype').value,
      linkedin:   document.getElementById('input-linkedin').value.trim(),
      languages,
      skills:     selectedProfileSkills,
    };

    saveProfile(profile);
    updateDisplayCard(profile);
    updateStats();
    showToast('Profile saved successfully! 🎉', 'success');
  });
}

// ─── Saved Jobs ───────────────────────────────────────────────
function renderSavedJobs() {
  const container = document.getElementById('saved-jobs-list');
  if (!container) return;

  const savedIds = getSavedJobs();
  const savedJobs = JOBS_DATA.filter(j => savedIds.includes(j.id));

  if (savedJobs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">★</div>
        <h3>No saved jobs yet</h3>
        <p class="text-muted">Browse jobs and click ☆ to save them here.</p>
        <a href="jobs.html" class="btn btn--primary mt-4" id="goto-jobs-btn">Browse Jobs</a>
      </div>`;
    return;
  }

  container.innerHTML = '';
  savedJobs.forEach(job => {
    const row = document.createElement('div');
    row.className = 'saved-job-row';
    row.innerHTML = `
      <div class="saved-job-icon" style="background:${job.color}18; border:1px solid ${job.color}30;">${job.logo}</div>
      <div style="flex:1; min-width:0;">
        <div class="font-semibold">${job.title}</div>
        <div class="text-muted text-sm">${job.company} · ${job.location}</div>
        <div class="flex gap-2 mt-1">
          <span class="badge badge--neutral">${job.type}</span>
          <span class="text-accent text-sm font-semibold">${job.salary}</span>
        </div>
      </div>
      <div class="saved-job-actions">
        <a href="jobs.html" class="btn btn--primary btn--sm">View →</a>
        <button class="btn btn--ghost btn--sm unsave-btn" data-id="${job.id}" aria-label="Remove saved job">✕</button>
      </div>
    `;
    container.appendChild(row);
  });

  // Unsave
  container.querySelectorAll('.unsave-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleSaveJob(btn.dataset.id);
      renderSavedJobs();
      updateStats();
    });
  });
}

// ─── Applications ─────────────────────────────────────────────
const STATUS_OPTIONS = ['applied', 'interview', 'offered', 'rejected'];
const STATUS_LABELS  = { applied: '📩 Applied', interview: '🗓️ Interview', offered: '🎉 Offered', rejected: '✗ Rejected' };

function renderApplications() {
  const container = document.getElementById('applications-list');
  if (!container) return;

  const apps = getApplications();

  if (apps.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No applications yet</h3>
        <p class="text-muted">Apply to jobs from the jobs board to track them here.</p>
        <a href="jobs.html" class="btn btn--primary mt-4" id="goto-jobs-apply-btn">Find Jobs</a>
      </div>`;
    return;
  }

  container.innerHTML = '';
  apps.forEach((app, i) => {
    const row = document.createElement('div');
    row.className = 'app-row';
    const date = new Date(app.appliedDate).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    row.innerHTML = `
      <div>
        <div class="font-semibold">${app.jobTitle}</div>
        <div class="text-muted text-sm">${app.company} · Applied ${date}</div>
      </div>
      <div class="app-status status--${app.status}" data-idx="${i}" title="Click to update status">
        ${STATUS_LABELS[app.status]}
      </div>
      <button class="btn btn--ghost btn--sm remove-app-btn" data-idx="${i}" aria-label="Remove application">✕</button>
    `;
    container.appendChild(row);
  });

  // Status cycle
  container.querySelectorAll('.app-status').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.idx);
      const apps = getApplications();
      const curStatus = apps[idx].status;
      const nextStatus = STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(curStatus) + 1) % STATUS_OPTIONS.length];
      apps[idx].status = nextStatus;
      storage.set('applications', apps);
      renderApplications();
      showToast(`Status updated to "${STATUS_LABELS[nextStatus]}"`, 'success');
    });
  });

  // Remove
  container.querySelectorAll('.remove-app-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const apps = getApplications();
      apps.splice(idx, 1);
      storage.set('applications', apps);
      renderApplications();
      updateStats();
      showToast('Application removed', 'error');
    });
  });
}
