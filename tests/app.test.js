const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

function setupDOM() {
  document.documentElement.innerHTML = html;
  const app = require('../app');
  return app;
}

let app;

beforeEach(() => {
  jest.resetModules();
  document.documentElement.innerHTML = '';
  app = setupDOM();
  app.init();
  app.setCurrent(0);
  app.updateUI();
});

describe('ideas data', () => {
  test('has 4 entries', () => {
    expect(app.ideas).toHaveLength(4);
  });

  test('each idea has title, tag, and body strings', () => {
    app.ideas.forEach((idea) => {
      expect(typeof idea.title).toBe('string');
      expect(typeof idea.tag).toBe('string');
      expect(typeof idea.body).toBe('string');
      expect(idea.title.length).toBeGreaterThan(0);
      expect(idea.tag.length).toBeGreaterThan(0);
      expect(idea.body.length).toBeGreaterThan(0);
    });
  });
});

describe('goTo(index)', () => {
  test('sets current to valid index', () => {
    app.goTo(2);
    expect(app.getCurrent()).toBe(2);
  });

  test('clamps negative index to 0', () => {
    app.goTo(-5);
    expect(app.getCurrent()).toBe(0);
  });

  test('clamps out-of-range index to total - 1', () => {
    app.goTo(100);
    expect(app.getCurrent()).toBe(app.total - 1);
  });
});

describe('changeStep(dir)', () => {
  test('advances from step 0 to step 1', () => {
    app.setCurrent(0);
    app.changeStep(1);
    expect(app.getCurrent()).toBe(1);
  });

  test('moves back from step 2 to step 1', () => {
    app.setCurrent(2);
    app.changeStep(-1);
    expect(app.getCurrent()).toBe(1);
  });

  test('does nothing at last step when moving forward', () => {
    app.setCurrent(app.total - 1);
    app.changeStep(1);
    expect(app.getCurrent()).toBe(app.total - 1);
  });

  test('clamps to 0 when moving back from first step', () => {
    app.setCurrent(0);
    app.changeStep(-1);
    expect(app.getCurrent()).toBe(0);
  });
});

describe('updateUI()', () => {
  test('only active card has class active', () => {
    app.goTo(2);
    const cards = document.querySelectorAll('.card');
    cards.forEach((c, i) => {
      if (i === 2) expect(c.classList.contains('active')).toBe(true);
      else expect(c.classList.contains('active')).toBe(false);
    });
  });

  test('active dot gets active class, previous dots get done', () => {
    app.goTo(2);
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((d, i) => {
      if (i === 2) {
        expect(d.classList.contains('active')).toBe(true);
        expect(d.classList.contains('done')).toBe(false);
      } else if (i < 2) {
        expect(d.classList.contains('done')).toBe(true);
        expect(d.classList.contains('active')).toBe(false);
      } else {
        expect(d.classList.contains('active')).toBe(false);
        expect(d.classList.contains('done')).toBe(false);
      }
    });
  });

  test('connector lines up to current get done class', () => {
    app.goTo(2);
    for (let i = 1; i < app.total; i++) {
      const line = document.getElementById(`line-${i}`);
      if (i <= 2) expect(line.classList.contains('done')).toBe(true);
      else expect(line.classList.contains('done')).toBe(false);
    }
  });

  test('previous button is disabled when current is 0', () => {
    app.goTo(0);
    expect(document.getElementById('btnPrev').disabled).toBe(true);
  });

  test('previous button is enabled when current > 0', () => {
    app.goTo(1);
    expect(document.getElementById('btnPrev').disabled).toBe(false);
  });

  test('next button shows Done on last step', () => {
    app.goTo(app.total - 1);
    expect(document.getElementById('btnNext').textContent).toBe('Done ✓');
  });

  test('next button shows Next on non-last step', () => {
    app.goTo(0);
    expect(document.getElementById('btnNext').textContent).toBe('Next →');
  });

  test('counter shows correct format', () => {
    app.goTo(2);
    expect(document.getElementById('counter').textContent).toBe('3 / 4');
  });
});

describe('DOM builders', () => {
  test('creates correct number of step dots', () => {
    expect(document.querySelectorAll('.step-dot')).toHaveLength(4);
  });

  test('creates correct number of cards', () => {
    expect(document.querySelectorAll('.card')).toHaveLength(4);
  });

  test('creates correct number of connector lines', () => {
    expect(document.querySelectorAll('.step-line')).toHaveLength(3);
  });

  test('card content matches ideas data', () => {
    app.ideas.forEach((idea, i) => {
      const card = document.getElementById(`card-${i}`);
      expect(card.querySelector('.card-title').textContent).toBe(idea.title);
      expect(card.querySelector('.card-body').textContent).toBe(idea.body);
      expect(card.querySelector('.card-tag').textContent).toBe(idea.tag);
    });
  });
});
