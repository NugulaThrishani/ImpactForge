/* ============================================================
   OpportuMap — Stories Page Logic
   ============================================================ */

let activeStoryCat = 'All';
let likedStories = [];
let storyLikeCounts = {};

document.addEventListener('DOMContentLoaded', () => {
  likedStories = storage.get('liked_stories') || [];
  STORIES_DATA.forEach(s => { storyLikeCounts[s.id] = s.likes; });
  renderStories();
  initStoryFilters();
  initStoryForm();
});

function initStoryFilters() {
  document.querySelectorAll('.stories-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stories-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStoryCat = btn.dataset.cat;
      renderStories();
    });
  });
}

function renderStories() {
  let data = [...STORIES_DATA];
  if (activeStoryCat !== 'All') {
    data = data.filter(s => s.category === activeStoryCat);
  }

  const container = document.getElementById('stories-container');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">💬</div><h3>No stories in this category yet</h3></div>`;
    return;
  }

  data.forEach((story, i) => {
    const liked = likedStories.includes(story.id);
    const likeCount = storyLikeCounts[story.id] || story.likes;

    const article = document.createElement('article');
    article.className = 'card story-article';
    article.style.animationDelay = `${Math.min(i * 0.1, 0.5)}s`;
    article.setAttribute('role', 'listitem');
    article.setAttribute('aria-label', `Story by ${story.name}`);

    article.innerHTML = `
      <div class="story-article__sidebar">
        <div class="story-avatar" style="background: linear-gradient(135deg, ${story.color}, ${story.color}99);">
          ${story.initials}
        </div>
        <div class="story-article__meta">
          <div class="story-name">${story.name}</div>
          <div class="story-journey">✈️ ${story.from} → ${story.to}</div>
          <div class="text-faint text-xs mt-1">${story.profession}</div>
        </div>
        <div class="story-outcome">✅ ${story.outcome}</div>
        <div class="story-tags">
          ${story.tags.map(t => `<span class="badge badge--neutral" style="font-size:0.7rem;">${t}</span>`).join('')}
        </div>
      </div>
      <div class="story-article__main">
        <div class="story-article__headline">"${story.headline}"</div>
        <div class="story-article__text">${story.story}</div>
        <div class="story-article__footer">
          <span class="story-date">${story.date}</span>
          <button class="like-btn${liked ? ' liked' : ''}" data-id="${story.id}" id="like-${story.id}" aria-label="${liked ? 'Unlike' : 'Like'} story">
            ${liked ? '❤️' : '🤍'} <span class="like-count">${likeCount}</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(article);
  });

  // Like buttons
  container.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const isLiked = likedStories.includes(id);
      if (isLiked) {
        likedStories = likedStories.filter(lid => lid !== id);
        storyLikeCounts[id] = Math.max(0, (storyLikeCounts[id] || 0) - 1);
        btn.classList.remove('liked');
        btn.querySelector('.like-count').textContent = storyLikeCounts[id];
        btn.innerHTML = `🤍 <span class="like-count">${storyLikeCounts[id]}</span>`;
        btn.classList.remove('liked');
      } else {
        likedStories.push(id);
        storyLikeCounts[id] = (storyLikeCounts[id] || 0) + 1;
        btn.classList.add('liked');
        btn.innerHTML = `❤️ <span class="like-count">${storyLikeCounts[id]}</span>`;
        btn.classList.add('liked');
        showToast('Thanks for the ❤️', 'success', 1500);
      }
      storage.set('liked_stories', likedStories);
    });
  });
}

function initStoryForm() {
  const form = document.getElementById('story-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('story-name').value.trim();
    const journey = document.getElementById('story-journey').value.trim();
    const headline = document.getElementById('story-headline').value.trim();
    const text = document.getElementById('story-text').value.trim();
    if (!name || !headline || !text) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    const journeyNote = journey ? ' (' + journey + ')' : '';
    showToast('Thank you, ' + name + journeyNote + '! Your story has been submitted for review.', 'success', 5000);
    form.reset();
  });
}
