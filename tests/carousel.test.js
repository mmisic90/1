import { describe, it, expect, beforeEach } from 'vitest';
import { createCarousel } from '../src/carousel.js';
import ideas from '../src/ideas.js';

function setupDOM() {
  document.body.innerHTML = `
    <div class="wrapper">
      <div class="steps-indicator" id="stepsIndicator"></div>
      <div class="card-container" id="cardContainer"></div>
      <button class="btn btn-prev" id="btnPrev" disabled>← Back</button>
      <button class="btn btn-next" id="btnNext">Next →</button>
      <div class="counter" id="counter"></div>
    </div>
  `;
  if (typeof localStorage !== 'undefined') localStorage.clear();
}

function makeMockStorage(initialJson = null) {
  const data = { value: initialJson };
  return {
    getItem: () => data.value,
    setItem: (_key, value) => { data.value = value; },
  };
}

describe('carousel initialization', () => {
  let carousel;

  beforeEach(() => {
    setupDOM();
    carousel = createCarousel(ideas, document);
  });

  it('builds the correct number of step dots', () => {
    const dots = document.querySelectorAll('.step-dot');
    expect(dots.length).toBe(ideas.length);
  });

  it('builds the correct number of connecting lines', () => {
    const lines = document.querySelectorAll('.step-line');
    expect(lines.length).toBe(ideas.length - 1);
  });

  it('builds the correct number of cards', () => {
    const cards = document.querySelectorAll('.card');
    expect(cards.length).toBe(ideas.length);
  });

  it('renders card content from data', () => {
    ideas.forEach((idea, i) => {
      const card = document.getElementById(`card-${i}`);
      expect(card.querySelector('.card-title').textContent).toBe(idea.title);
      expect(card.querySelector('.card-body').textContent).toBe(idea.body);
      expect(card.querySelector('.card-tag').textContent).toBe(idea.tag);
    });
  });

  it('renders card numbers correctly', () => {
    ideas.forEach((_, i) => {
      const card = document.getElementById(`card-${i}`);
      expect(card.querySelector('.card-number').textContent).toBe(String(i + 1));
    });
  });

  it('renders step labels correctly', () => {
    ideas.forEach((_, i) => {
      const card = document.getElementById(`card-${i}`);
      expect(card.querySelector('.card-label').textContent).toBe(`Step ${i + 1} of ${ideas.length}`);
    });
  });

  it('starts on the first card', () => {
    expect(carousel.getCurrent()).toBe(0);
    expect(document.getElementById('card-0').classList.contains('active')).toBe(true);
  });

  it('shows only one card at a time on init', () => {
    const activeCards = document.querySelectorAll('.card.active');
    expect(activeCards.length).toBe(1);
  });
});

describe('updateUI', () => {
  let carousel;

  beforeEach(() => {
    setupDOM();
    carousel = createCarousel(ideas, document);
  });

  it('disables prev button on first step', () => {
    expect(document.getElementById('btnPrev').disabled).toBe(true);
  });

  it('enables prev button after navigating forward', () => {
    carousel.goTo(1);
    expect(document.getElementById('btnPrev').disabled).toBe(false);
  });

  it('shows "Next →" on non-final steps', () => {
    expect(document.getElementById('btnNext').textContent).toBe('Next →');
  });

  it('shows "Done ✓" on the last step', () => {
    carousel.goTo(ideas.length - 1);
    expect(document.getElementById('btnNext').textContent).toBe('Done ✓');
  });

  it('updates counter text', () => {
    carousel.goTo(2);
    expect(document.getElementById('counter').textContent).toBe('3 / 4');
  });

  it('marks current dot as active', () => {
    carousel.goTo(2);
    const dot = document.getElementById('dot-2');
    expect(dot.classList.contains('active')).toBe(true);
    expect(dot.classList.contains('done')).toBe(false);
  });

  it('marks previous dots as done', () => {
    carousel.goTo(2);
    expect(document.getElementById('dot-0').classList.contains('done')).toBe(true);
    expect(document.getElementById('dot-1').classList.contains('done')).toBe(true);
  });

  it('marks future dots as neither active nor done', () => {
    carousel.goTo(1);
    const dot3 = document.getElementById('dot-3');
    expect(dot3.classList.contains('active')).toBe(false);
    expect(dot3.classList.contains('done')).toBe(false);
  });

  it('marks lines as done up to current step', () => {
    carousel.goTo(2);
    expect(document.getElementById('line-1').classList.contains('done')).toBe(true);
    expect(document.getElementById('line-2').classList.contains('done')).toBe(true);
    expect(document.getElementById('line-3').classList.contains('done')).toBe(false);
  });
});

describe('goTo', () => {
  let carousel;

  beforeEach(() => {
    setupDOM();
    carousel = createCarousel(ideas, document);
  });

  it('navigates to a valid index', () => {
    carousel.goTo(2);
    expect(carousel.getCurrent()).toBe(2);
    expect(document.getElementById('card-2').classList.contains('active')).toBe(true);
  });

  it('clamps negative index to 0', () => {
    carousel.goTo(-5);
    expect(carousel.getCurrent()).toBe(0);
  });

  it('clamps index beyond total to last step', () => {
    carousel.goTo(100);
    expect(carousel.getCurrent()).toBe(ideas.length - 1);
  });

  it('shows only the target card', () => {
    carousel.goTo(3);
    const activeCards = document.querySelectorAll('.card.active');
    expect(activeCards.length).toBe(1);
    expect(activeCards[0].id).toBe('card-3');
  });
});

describe('changeStep', () => {
  let carousel;

  beforeEach(() => {
    setupDOM();
    carousel = createCarousel(ideas, document);
  });

  it('moves forward by 1', () => {
    carousel.changeStep(1);
    expect(carousel.getCurrent()).toBe(1);
  });

  it('moves backward by 1', () => {
    carousel.goTo(2);
    carousel.changeStep(-1);
    expect(carousel.getCurrent()).toBe(1);
  });

  it('does not go past the last step', () => {
    carousel.goTo(ideas.length - 1);
    carousel.changeStep(1);
    expect(carousel.getCurrent()).toBe(ideas.length - 1);
  });

  it('does not go before the first step', () => {
    carousel.changeStep(-1);
    expect(carousel.getCurrent()).toBe(0);
  });

  it('navigating forward then back returns to original', () => {
    carousel.changeStep(1);
    carousel.changeStep(1);
    carousel.changeStep(-1);
    carousel.changeStep(-1);
    expect(carousel.getCurrent()).toBe(0);
  });
});

describe('dot click navigation', () => {
  let carousel;

  beforeEach(() => {
    setupDOM();
    carousel = createCarousel(ideas, document);
  });

  it('clicking a dot navigates to that step', () => {
    document.getElementById('dot-3').click();
    expect(carousel.getCurrent()).toBe(3);
    expect(document.getElementById('card-3').classList.contains('active')).toBe(true);
  });

  it('clicking the current dot stays on that step', () => {
    document.getElementById('dot-0').click();
    expect(carousel.getCurrent()).toBe(0);
  });
});

describe('edge case: single idea', () => {
  it('works with a single idea', () => {
    setupDOM();
    const singleIdea = [ideas[0]];
    const carousel = createCarousel(singleIdea, document);

    expect(carousel.getCurrent()).toBe(0);
    expect(document.querySelectorAll('.card').length).toBe(1);
    expect(document.querySelectorAll('.step-line').length).toBe(0);
    expect(document.getElementById('btnPrev').disabled).toBe(true);
    expect(document.getElementById('btnNext').textContent).toBe('Done ✓');
    expect(document.getElementById('counter').textContent).toBe('1 / 1');
  });

  it('changeStep does nothing with single idea', () => {
    setupDOM();
    const carousel = createCarousel([ideas[0]], document);
    carousel.changeStep(1);
    expect(carousel.getCurrent()).toBe(0);
    carousel.changeStep(-1);
    expect(carousel.getCurrent()).toBe(0);
  });
});

describe('edge case: two ideas', () => {
  it('navigates correctly with two ideas', () => {
    setupDOM();
    const carousel = createCarousel(ideas.slice(0, 2), document);

    expect(carousel.getCurrent()).toBe(0);
    expect(document.getElementById('btnNext').textContent).toBe('Next →');

    carousel.changeStep(1);
    expect(carousel.getCurrent()).toBe(1);
    expect(document.getElementById('btnNext').textContent).toBe('Done ✓');
    expect(document.getElementById('btnPrev').disabled).toBe(false);

    carousel.changeStep(-1);
    expect(carousel.getCurrent()).toBe(0);
    expect(document.getElementById('btnPrev').disabled).toBe(true);
  });
});

describe('voting integration', () => {
  it('renders a vote button and count for every idea', () => {
    setupDOM();
    createCarousel(ideas, document, makeMockStorage());

    ideas.forEach((_, i) => {
      expect(document.getElementById(`vote-btn-${i}`)).not.toBeNull();
      expect(document.getElementById(`vote-count-${i}`).textContent).toBe('0 glasova');
    });
  });

  it('clicking a vote button increments that idea count', () => {
    setupDOM();
    createCarousel(ideas, document, makeMockStorage());

    document.getElementById('vote-btn-1').click();

    expect(document.getElementById('vote-count-1').textContent).toBe('1 glas');
    expect(document.getElementById('card-1').classList.contains('voted')).toBe(true);
    expect(document.getElementById('vote-btn-1').classList.contains('voted')).toBe(true);
  });

  it('voting another idea moves the vote', () => {
    setupDOM();
    createCarousel(ideas, document, makeMockStorage());

    document.getElementById('vote-btn-0').click();
    document.getElementById('vote-btn-2').click();

    expect(document.getElementById('vote-count-0').textContent).toBe('0 glasova');
    expect(document.getElementById('vote-count-2').textContent).toBe('1 glas');
    expect(document.getElementById('card-0').classList.contains('voted')).toBe(false);
    expect(document.getElementById('card-2').classList.contains('voted')).toBe(true);
  });

  it('clicking the same vote button again toggles the vote off', () => {
    setupDOM();
    createCarousel(ideas, document, makeMockStorage());

    document.getElementById('vote-btn-3').click();
    document.getElementById('vote-btn-3').click();

    expect(document.getElementById('vote-count-3').textContent).toBe('0 glasova');
    expect(document.getElementById('card-3').classList.contains('voted')).toBe(false);
    expect(document.getElementById('vote-btn-3').classList.contains('voted')).toBe(false);
  });

  it('loads existing votes from storage on init', () => {
    setupDOM();
    const seeded = makeMockStorage(JSON.stringify({ counts: { 2: 1 }, myVote: 2 }));
    createCarousel(ideas, document, seeded);

    expect(document.getElementById('vote-count-2').textContent).toBe('1 glas');
    expect(document.getElementById('card-2').classList.contains('voted')).toBe(true);
  });

  it('persists votes back to storage', () => {
    setupDOM();
    const storage = makeMockStorage();
    let lastWrite = null;
    storage.setItem = (_k, v) => { lastWrite = v; };
    createCarousel(ideas, document, storage);

    document.getElementById('vote-btn-1').click();

    expect(lastWrite).not.toBeNull();
    const parsed = JSON.parse(lastWrite);
    expect(parsed.myVote).toBe(1);
    expect(parsed.counts[1]).toBe(1);
  });

  it('uses Serbian pluralization for vote counts', () => {
    setupDOM();
    const seeded = makeMockStorage(JSON.stringify({ counts: { 0: 1, 1: 3, 2: 5 }, myVote: 0 }));
    createCarousel(ideas, document, seeded);

    expect(document.getElementById('vote-count-0').textContent).toBe('1 glas');
    expect(document.getElementById('vote-count-1').textContent).toBe('3 glasa');
    expect(document.getElementById('vote-count-2').textContent).toBe('5 glasova');
  });
});

describe('full navigation flow', () => {
  it('navigates through all steps and back', () => {
    setupDOM();
    const carousel = createCarousel(ideas, document);

    for (let i = 0; i < ideas.length - 1; i++) {
      expect(carousel.getCurrent()).toBe(i);
      expect(document.getElementById(`card-${i}`).classList.contains('active')).toBe(true);
      carousel.changeStep(1);
    }

    expect(carousel.getCurrent()).toBe(ideas.length - 1);
    expect(document.getElementById('btnNext').textContent).toBe('Done ✓');

    for (let i = ideas.length - 1; i > 0; i--) {
      expect(carousel.getCurrent()).toBe(i);
      carousel.changeStep(-1);
    }

    expect(carousel.getCurrent()).toBe(0);
    expect(document.getElementById('btnPrev').disabled).toBe(true);
    expect(document.getElementById('btnNext').textContent).toBe('Next →');
  });
});
