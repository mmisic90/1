const ideas = [
  {
    title: "AI-Powered Contract Review",
    tag: "LegalTech · AI",
    body: "An automated platform that uses artificial intelligence to review, summarize, and flag risks in legal contracts within minutes, saving businesses thousands in attorney fees."
  },
  {
    title: "Online Dispute Resolution",
    tag: "LegalTech · Marketplace",
    body: "A digital platform that connects parties in a dispute with certified mediators and arbitrators to resolve conflicts quickly and affordably without going to court."
  },
  {
    title: "Legal Document Automation",
    tag: "SaaS · Productivity",
    body: "A SaaS tool that enables individuals and small businesses to generate legally sound documents—NDAs, leases, wills—through a guided questionnaire interface."
  },
  {
    title: "Lawyer Marketplace",
    tag: "Marketplace · Services",
    body: "A peer-to-peer platform matching clients with vetted freelance lawyers based on practice area, availability, and budget, with transparent pricing and reviews."
  }
];

let current = 0;
const total = ideas.length;

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

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const counterEl = document.getElementById('counter');

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

function init() {
  const stepsEl = document.getElementById('stepsIndicator');
  const containerEl = document.getElementById('cardContainer');

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

  updateUI();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ideas, goTo, changeStep, updateUI, init, getCurrent: () => current, setCurrent: (v) => { current = v; }, total };
} else {
  document.addEventListener('DOMContentLoaded', init);
}
