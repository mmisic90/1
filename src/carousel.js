import { loadVotes, saveVotes, castVote, getCount } from './voting.js';

export function createCarousel(ideas, document, storage) {
  const stepsEl = document.getElementById('stepsIndicator');
  const containerEl = document.getElementById('cardContainer');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const counterEl = document.getElementById('counter');

  const voteStorage = storage
    || (typeof localStorage !== 'undefined' ? localStorage : null);

  let current = 0;
  const total = ideas.length;
  let votes = voteStorage ? loadVotes(voteStorage) : { counts: {}, myVote: null };

  function buildStepDots() {
    ideas.forEach((_, i) => {
      if (i > 0) {
        const line = document.createElement('div');
        line.className = 'step-line';
        line.id = `line-${i}`;
        stepsEl.appendChild(line);
      }
      const dot = document.createElement('div');
      dot.className = 'step-dot' + (i === 0 ? ' active' : '');
      dot.textContent = i + 1;
      dot.id = `dot-${i}`;
      dot.onclick = () => goTo(i);
      stepsEl.appendChild(dot);
    });
  }

  function buildCards() {
    ideas.forEach((idea, i) => {
      const card = document.createElement('div');
      card.className = 'card' + (i === 0 ? ' active' : '');
      card.id = `card-${i}`;
      const imageMarkup = idea.image
        ? `<img class="card-image" src="${idea.image}" alt="${idea.imageAlt || idea.title}" loading="lazy" />`
        : '';
      card.innerHTML = `
        <div class="card-header">
          <div class="card-number">${i + 1}</div>
          <div>
            <div class="card-label">Step ${i + 1} of ${total}</div>
            <div class="card-title">${idea.title}</div>
          </div>
        </div>
        <div class="card-divider"></div>
        ${imageMarkup}
        <div class="card-body">${idea.body}</div>
        <div class="card-tag">${idea.tag}</div>
        <div class="vote-block">
          <button class="vote-btn" id="vote-btn-${i}" data-idea-index="${i}" type="button">
            <span class="vote-btn-label">★ Glasaj za ovu ideju</span>
          </button>
          <span class="vote-count" id="vote-count-${i}">0 glasova</span>
        </div>
      `;
      containerEl.appendChild(card);

      const btn = card.querySelector(`#vote-btn-${i}`);
      btn.addEventListener('click', () => handleVote(i));
    });
  }

  function voteCountLabel(n) {
    if (n === 1) return '1 glas';
    if (n >= 2 && n <= 4) return `${n} glasa`;
    return `${n} glasova`;
  }

  function updateVotes() {
    ideas.forEach((_, i) => {
      const card = document.getElementById(`card-${i}`);
      const btn = document.getElementById(`vote-btn-${i}`);
      const countEl = document.getElementById(`vote-count-${i}`);
      const isVoted = votes.myVote === i;

      if (card) card.classList.toggle('voted', isVoted);
      if (btn) {
        btn.classList.toggle('voted', isVoted);
        const label = btn.querySelector('.vote-btn-label');
        if (label) label.textContent = isVoted ? '✓ Glasao' : '★ Glasaj za ovu ideju';
      }
      if (countEl) countEl.textContent = voteCountLabel(getCount(votes, i));
    });
  }

  function handleVote(ideaIndex) {
    votes = castVote(votes, ideaIndex);
    if (voteStorage) saveVotes(votes, voteStorage);
    updateVotes();
  }

  function updateUI() {
    document.querySelectorAll('.card').forEach((c, i) => {
      c.classList.toggle('active', i === current);
    });

    document.querySelectorAll('.step-dot').forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i === current) d.classList.add('active');
      else if (i < current) d.classList.add('done');
    });

    for (let i = 1; i < total; i++) {
      const line = document.getElementById(`line-${i}`);
      if (line) line.classList.toggle('done', i <= current);
    }

    btnPrev.disabled = current === 0;
    btnNext.textContent = current === total - 1 ? 'Done ✓' : 'Next →';
    counterEl.textContent = `${current + 1} / ${total}`;

    updateVotes();
  }

  function goTo(index) {
    current = Math.max(0, Math.min(total - 1, index));
    updateUI();
  }

  function changeStep(dir) {
    if (dir === 1 && current === total - 1) return;
    goTo(current + dir);
  }

  buildStepDots();
  buildCards();
  updateUI();

  return {
    goTo,
    changeStep,
    updateUI,
    getCurrent: () => current,
    getVotes: () => votes,
    vote: handleVote,
  };
}
