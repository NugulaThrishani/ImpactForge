/* ============================================================
   OpportuMap — Mentors Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  buildMentorFilters();
  renderMentors();
  initMentorEvents();
  initVolunteerForm();
});

function buildMentorFilters() {
  const expSel  = document.getElementById('mentor-expertise-filter');
  const langSel = document.getElementById('mentor-lang-filter');
  MENTOR_EXPERTISE.forEach(e => { const o = document.createElement('option'); o.value = e; o.textContent = e; expSel.appendChild(o); });
  MENTOR_LANGUAGES.forEach(l => { const o = document.createElement('option'); o.value = l; o.textContent = l; langSel.appendChild(o); });
}

function getMentorFilters() {
  return {
    search:    (document.getElementById('mentor-search').value || '').toLowerCase().trim(),
    expertise: document.getElementById('mentor-expertise-filter').value,
    lang:      document.getElementById('mentor-lang-filter').value,
    available: document.getElementById('available-only').checked
  };
}

function renderMentors() {
  const f = getMentorFilters();
  let data = [...MENTORS_DATA];

  if (f.search) {
    data = data.filter(m =>
      m.name.toLowerCase().includes(f.search) ||
      m.role.toLowerCase().includes(f.search) ||
      m.expertise.some(e => e.toLowerCase().includes(f.search)) ||
      m.languages.some(l => l.toLowerCase().includes(f.search)) ||
      m.bio.toLowerCase().includes(f.search)
    );
  }
  if (f.expertise) data = data.filter(m => m.expertise.includes(f.expertise));
  if (f.lang)      data = data.filter(m => m.languages.includes(f.lang));
  if (f.available) data = data.filter(m => m.available);

  const grid  = document.getElementById('mentors-grid');
  const empty = document.getElementById('mentor-empty');
  const count = document.getElementById('mentor-count');

  grid.innerHTML = '';
  count.textContent = `${data.length} mentor${data.length !== 1 ? 's' : ''} available`;

  if (data.length === 0) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';

  data.forEach((m, i) => {
    const connected = (storage.get('mentor_connections') || []).includes(m.id);
    const card = document.createElement('div');
    card.className = `card mentor-card${m.available ? '' : ' unavailable'}`;
    card.style.animationDelay = `${Math.min(i * 0.06, 0.4)}s`;
    card.setAttribute('role','listitem');

    card.innerHTML = `
      <div class="mentor-card__header">
        <div class="mentor-avatar" style="background: linear-gradient(135deg, ${m.color}, ${m.color}cc);">
          ${m.initials}
          <span class="mentor-available-dot ${m.available ? 'available' : 'unavailable'}"
                title="${m.available ? 'Available' : 'Currently unavailable'}"></span>
        </div>
        <div style="flex:1; min-width:0;">
          <div class="mentor-card__name">${m.name}</div>
          <div class="mentor-card__role">${m.role}</div>
          <div class="mentor-card__company">${m.company}</div>
        </div>
        <div class="mentor-card__rating">
          <div class="mentor-rating-val">⭐ ${m.rating}</div>
          <div class="mentor-sessions">${m.sessions} sessions</div>
        </div>
      </div>
      <p class="mentor-bio">${m.bio}</p>
      <div class="mentor-expertise">
        ${m.expertise.map(e => `<span class="badge badge--primary">${e}</span>`).join('')}
      </div>
      <div class="mentor-langs">🗣️ ${m.languages.join(' · ')}</div>
      <div class="mentor-card__footer">
        <span class="mentor-status ${m.available ? 'available' : 'unavailable'}">
          ${m.available ? '● Available now' : '● Currently busy'}
        </span>
        <button class="btn btn--sm ${connected ? 'btn--accent' : 'btn--primary'} connect-btn"
          data-id="${m.id}"
          ${!m.available && !connected ? 'disabled' : ''}
          id="connect-${m.id}"
          aria-label="Connect with ${m.name}">
          ${connected ? '✓ Connected' : 'Connect →'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Connect buttons
  grid.querySelectorAll('.connect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const mentor = MENTORS_DATA.find(m => m.id === id);
      const connections = storage.get('mentor_connections') || [];
      if (!connections.includes(id)) {
        connections.push(id);
        storage.set('mentor_connections', connections);
        btn.textContent = '✓ Connected';
        btn.className = 'btn btn--sm btn--accent connect-btn';
        showToast(`Connected with ${mentor.name}! They'll reach out soon. 🎉`, 'success');
      }
    });
  });
}

function initMentorEvents() {
  ['mentor-search','mentor-expertise-filter','mentor-lang-filter','available-only'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderMentors);
    document.getElementById(id)?.addEventListener('change', renderMentors);
  });
}

function initVolunteerForm() {
  const form = document.getElementById('mentor-signup-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('vol-name').value.trim();
    if (!name) { showToast('Please enter your name', 'error'); return; }
    showToast(`Thank you, ${name}! We'll review your application and reach out within 48 hours. 🙌`, 'success', 5000);
    form.reset();
  });
}
