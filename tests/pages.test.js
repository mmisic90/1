import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRemote } from '../src/remote.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadBody(file) {
  const html = readFileSync(resolve(ROOT, file), 'utf8');
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!match) throw new Error(`No <body> in ${file}`);
  return match[1].replace(/<script[\s\S]*?<\/script>/gi, '');
}

describe('index.html (advokat landing page)', () => {
  beforeEach(() => {
    document.body.innerHTML = loadBody('index.html');
  });

  it('contains the law-firm sections', () => {
    for (const id of ['hero', 'about', 'oblasti', 'kontakt']) {
      expect(document.getElementById(id), `#${id} missing from index.html`).not.toBeNull();
    }
  });

  it('has the cinematic intro that routes to the about section', () => {
    expect(document.getElementById('intro')).not.toBeNull();
    expect(document.querySelector('#introVideo source').getAttribute('src')).toMatch(
      /reel-03-lineage-animatic\.mp4$/,
    );
    expect(document.getElementById('introEnter').getAttribute('href')).toBe('#about');
  });

  it('shows the about portrait image', () => {
    const img = document.querySelector('.about-img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toMatch(/about-misic-portrait\.png$/);
  });

  it('no longer contains the business-ideas carousel', () => {
    for (const id of ['stepsIndicator', 'cardContainer', 'btnPrev', 'btnNext', 'counter']) {
      expect(document.getElementById(id), `#${id} should be removed`).toBeNull();
    }
    expect(document.body.innerHTML).not.toMatch(/Business Ideas/);
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
