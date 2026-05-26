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

  function el(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  function buildCards() {
    ideas.forEach((idea, i) => {
      const card = el('div', 'card' + (i === 0 ? ' active' : ''));
      card.id = `card-${i}`;

      const header = el('div', 'card-header');
      header.appendChild(el('div', 'card-number', String(i + 1)));
      const headerText = el('div');
      headerText.appendChild(el('div', 'card-label', `Step ${i + 1} of ${total}`));
      headerText.appendChild(el('div', 'card-title', idea.title));
      header.appendChild(headerText);
      card.appendChild(header);

      card.appendChild(el('div', 'card-divider'));

      if (idea.image) {
        const img = document.createElement('img');
        img.className = 'card-image';
        img.src = idea.image;
        img.alt = idea.imageAlt || idea.title;
        img.loading = 'lazy';
        card.appendChild(img);
      }

      card.appendChild(el('div', 'card-body', idea.body));
      card.appendChild(el('div', 'card-tag', idea.tag));

      const voteBlock = el('div', 'vote-block');
      const voteBtn = document.createElement('button');
      voteBtn.className = 'vote-btn';
      voteBtn.id = `vote-btn-${i}`;
      voteBtn.dataset.ideaIndex = String(i);
      voteBtn.type = 'button';
      voteBtn.appendChild(el('span', 'vote-btn-label', '★ Glasaj za ovu ideju'));
      voteBlock.appendChild(voteBtn);

      const voteCount = el('span', 'vote-count', '0 glasova');
      voteCount.id = `vote-count-${i}`;
      voteBlock.appendChild(voteCount);
      card.appendChild(voteBlock);

      containerEl.appendChild(card);

      voteBtn.addEventListener('click', () => handleVote(i));
    });
  }

  function voteCountLabel(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return `${n} glas`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} glasa`;
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
