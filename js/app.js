/* ============================================================
   OpportuMap — Shared App Utilities
   ============================================================ */

// ─── Toast Notifications ─────────────────────────────────────
function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  document.body.appendChild(el);
  return el;
}

// ─── LocalStorage Helpers ─────────────────────────────────────
const storage = {
  get(key) {
    try { return JSON.parse(localStorage.getItem('opportunmap_' + key)); } catch { return null; }
  },
  set(key, val) {
    try { localStorage.setItem('opportunmap_' + key, JSON.stringify(val)); } catch {}
  },
  remove(key) { localStorage.removeItem('opportunmap_' + key); }
};

// ─── Saved Jobs ───────────────────────────────────────────────
function getSavedJobs() { return storage.get('saved_jobs') || []; }
function toggleSaveJob(jobId) {
  const saved = getSavedJobs();
  const idx = saved.indexOf(jobId);
  if (idx >= 0) { saved.splice(idx, 1); showToast('Job removed from saved', 'error'); }
  else { saved.push(jobId); showToast('Job saved! ✨', 'success'); }
  storage.set('saved_jobs', saved);
  return idx < 0;
}
function isJobSaved(jobId) { return getSavedJobs().includes(jobId); }

// ─── User Profile ─────────────────────────────────────────────
function getProfile() { return storage.get('profile') || {}; }
function saveProfile(data) { storage.set('profile', data); }

// ─── Applications ─────────────────────────────────────────────
function getApplications() { return storage.get('applications') || []; }
function addApplication(job) {
  const apps = getApplications();
  if (apps.find(a => a.jobId === job.id)) { showToast('Already applied to this job', 'error'); return false; }
  apps.push({ jobId: job.id, jobTitle: job.title, company: job.company, appliedDate: new Date().toISOString(), status: 'applied' });
  storage.set('applications', apps);
  showToast(`Applied to ${job.title} at ${job.company}! 🎉`, 'success');
  return true;
}

// ─── Active Nav Link ──────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── Mobile Nav Toggle ────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!hamburger || !nav) return;
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

// ─── Animate on Scroll ───────────────────────────────────────
function initScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ─── Counter Animation ────────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + (el.dataset.suffix || '');
    if (start >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileNav();
  initScrollAnimation();
  initCounters();
});
