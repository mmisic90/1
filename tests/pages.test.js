import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCarousel } from '../src/carousel.js';
import { createRemote } from '../src/remote.js';
import ideas from '../src/ideas.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadBody(file) {
  const html = readFileSync(resolve(ROOT, file), 'utf8');
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!match) throw new Error(`No <body> in ${file}`);
  return match[1].replace(/<script[\s\S]*?<\/script>/gi, '');
}

describe('index.html (carousel page)', () => {
  beforeEach(() => {
    document.body.innerHTML = loadBody('index.html');
  });

  it('contains every element createCarousel looks up', () => {
    for (const id of ['stepsIndicator', 'cardContainer', 'btnPrev', 'btnNext', 'counter']) {
      expect(document.getElementById(id), `#${id} missing from index.html`).not.toBeNull();
    }
  });

  it('createCarousel initialises against the real page without throwing', () => {
    expect(() => createCarousel(ideas, document)).not.toThrow();
    expect(document.querySelectorAll('.card').length).toBe(ideas.length);
    expect(document.querySelectorAll('.step-dot').length).toBe(ideas.length);
    expect(document.getElementById('counter').textContent).toBe(`1 / ${ideas.length}`);
    expect(document.getElementById('btnPrev').disabled).toBe(true);
  });

  it('navigates after initialising against the real page', () => {
    const carousel = createCarousel(ideas, document);
    carousel.changeStep(1);
    expect(carousel.getCurrent()).toBe(1);
    expect(document.getElementById('card-1').classList.contains('active')).toBe(true);
    expect(document.getElementById('btnPrev').disabled).toBe(false);
  });
});

describe('remote.html (remote page)', () => {
  beforeEach(() => {
    document.body.innerHTML = loadBody('remote.html');
  });

  it('contains every element createRemote looks up', () => {
    for (const id of [
      'powerBtn',
      'display',
      'displayChannel',
      'displayLabel',
      'volValue',
      'chValue',
      'muteBtn',
      'playPauseBtn',
    ]) {
      expect(document.getElementById(id), `#${id} missing from remote.html`).not.toBeNull();
    }
    expect(document.querySelectorAll('.source-btn').length).toBeGreaterThan(0);
  });

  it('createRemote initialises against the real page and reacts to input', () => {
    const remote = createRemote(document);
    expect(remote.getState().power).toBe(true);
    expect(remote.getState().volume).toBe(50);

    remote.adjustVolume(1);
    expect(remote.getState().volume).toBe(55);
    expect(document.getElementById('volValue').textContent).toBe('55');

    remote.adjustChannel(1);
    expect(remote.getState().channel).toBe(2);
    expect(document.getElementById('chValue').textContent).toBe('2');
  });
});
