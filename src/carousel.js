export function createCarousel(ideas, document) {
  const stepsEl = document.getElementById('stepsIndicator');
  const containerEl = document.getElementById('cardContainer');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const counterEl = document.getElementById('counter');

  let current = 0;
  const total = ideas.length;

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
      card.innerHTML = `
        <div class="card-header">
          <div class="card-number">${i + 1}</div>
          <div>
            <div class="card-label">Step ${i + 1} of ${total}</div>
            <div class="card-title">${idea.title}</div>
          </div>
        </div>
        <div class="card-divider"></div>
        <div class="card-body">${idea.body}</div>
        <div class="card-tag">${idea.tag}</div>
      `;
      containerEl.appendChild(card);
    });
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

  return { goTo, changeStep, updateUI, getCurrent: () => current };
}
