/* ============================================================
   OpportuMap — Resources Page Logic
   ============================================================ */

const CATEGORY_ICONS = { Food:'🍽️', Shelter:'🏠', 'Legal Aid':'⚖️', Language:'🗣️', Healthcare:'🏥', Government:'📋' };
const CATEGORY_COLORS = { Food:'#00D4AA', Shelter:'#7C6FFF', 'Legal Aid':'#FF6B6B', Language:'#FFD700', Healthcare:'#FF6B6B', Government:'#7C6FFF' };

let resActiveCategory = 'All';
let resSearch = '';
let resLocation = '';

document.addEventListener('DOMContentLoaded', () => {
  renderResources();

  // Category tabs
  document.querySelectorAll('.res-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.res-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      resActiveCategory = tab.dataset.cat;
      renderResources();
    });
  });

  // Search
  document.getElementById('res-search-btn').addEventListener('click', () => {
    resSearch   = document.getElementById('res-search').value.trim().toLowerCase();
    resLocation = document.getElementById('res-location').value.trim().toLowerCase();
    renderResources();
  });

  document.getElementById('res-search').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('res-search-btn').click();
  });
  document.getElementById('res-location').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('res-search-btn').click();
  });
});

function renderResources() {
  let data = [...RESOURCES_DATA];

  if (resActiveCategory !== 'All') {
    data = data.filter(r => r.category === resActiveCategory);
  }

  if (resSearch) {
    data = data.filter(r =>
      r.name.toLowerCase().includes(resSearch) ||
      r.description.toLowerCase().includes(resSearch) ||
      r.category.toLowerCase().includes(resSearch) ||
      r.tags.some(t => t.toLowerCase().includes(resSearch))
    );
  }

  if (resLocation) {
    data = data.filter(r => r.location.toLowerCase().includes(resLocation));
  }

  // Urgent first
  data = [...data].sort((a,b) => b.urgency - a.urgency);

  const grid = document.getElementById('resources-grid');
  const empty = document.getElementById('res-empty');
  const count = document.getElementById('res-count');

  grid.innerHTML = '';
  count.textContent = `${data.length} resource${data.length !== 1 ? 's' : ''} found`;

  if (data.length === 0) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  data.forEach((res, i) => {
    const color = CATEGORY_COLORS[res.category] || '#7C6FFF';
    const icon  = CATEGORY_ICONS[res.category]  || '📦';
    const card  = document.createElement('div');
    card.className = `card resource-card${res.urgency ? ' urgent-resource' : ''}`;
    card.style.animationDelay = `${Math.min(i * 0.05, 0.4)}s`;
    card.setAttribute('role','listitem');
    card.innerHTML = `
      <div class="resource-card__top">
        <div class="resource-icon" style="background:${color}18; border:1px solid ${color}30;">${icon}</div>
        <div style="flex:1; min-width:0;">
          <h3>${res.name}</h3>
          <div class="resource-loc">📍 ${res.location}</div>
        </div>
        <span class="badge badge--neutral" style="flex-shrink:0;">${res.category}</span>
      </div>
      <p class="resource-desc">${res.description}</p>
      <div class="resource-tags">
        ${res.tags.map(t => `<span class="badge badge--accent">${t}</span>`).join('')}
      </div>
      <div class="resource-card__footer">
        ${res.hours !== 'online' ? `<div class="resource-info-row">🕐 <span>${res.hours}</span></div>` : ''}
        ${res.address !== 'online' ? `<div class="resource-info-row">📍 <span>${res.address}</span></div>` : ''}
        <div class="resource-info-row">📞 <span>${res.contact}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });
}
