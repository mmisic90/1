import { describe, it, expect, beforeEach } from 'vitest';
import { wireCarousel, wireRemote } from '../src/wire.js';
import { createCarousel } from '../src/carousel.js';
import { createRemote } from '../src/remote.js';
import ideas from '../src/ideas.js';

function setupCarouselDOM() {
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

function setupRemoteDOM() {
  document.body.innerHTML = `
    <div class="remote">
      <button class="power-btn on" id="powerBtn"></button>
      <div class="display" id="display">
        <div class="display-channel" id="displayChannel">CH 1</div>
        <div class="display-label" id="displayLabel">HDMI 1</div>
      </div>
      <div class="vol-ch-value" id="volValue">50</div>
      <div class="vol-ch-value" id="chValue">1</div>
      <button class="mute-btn" id="muteBtn">MUTE</button>
      <button class="play-pause" id="playPauseBtn">▶</button>
    </div>
  `;
}

describe('wireCarousel', () => {
  let carousel;

  beforeEach(() => {
    setupCarouselDOM();
    carousel = createCarousel(ideas, document);
    wireCarousel(document, carousel);
  });

  it('clicking btnNext advances the carousel', () => {
    document.getElementById('btnNext').click();
    expect(carousel.getCurrent()).toBe(1);
  });

  it('clicking btnPrev retreats the carousel', () => {
    carousel.goTo(2);
    document.getElementById('btnPrev').click();
    expect(carousel.getCurrent()).toBe(1);
  });

  it('btnNext does not advance past the last step', () => {
    carousel.goTo(ideas.length - 1);
    document.getElementById('btnNext').click();
    expect(carousel.getCurrent()).toBe(ideas.length - 1);
  });
});

describe('wireRemote', () => {
  it('exposes remote methods on the target object as functions', () => {
    setupRemoteDOM();
    const remote = createRemote(document);
    const globalObj = {};
    wireRemote(globalObj, remote);

    ['togglePower', 'adjustVolume', 'toggleMute', 'adjustChannel', 'numInput',
      'clearInput', 'goToChannel', 'dpadAction', 'mediaAction', 'setSource']
      .forEach((name) => expect(typeof globalObj[name]).toBe('function'));
  });

  it('invoking an exposed handler mutates the display', () => {
    setupRemoteDOM();
    const remote = createRemote(document);
    const globalObj = {};
    wireRemote(globalObj, remote);

    globalObj.adjustVolume(1);
    expect(document.getElementById('volValue').textContent).toBe('55');
    expect(document.getElementById('displayChannel').textContent).toBe('VOL 55');
  });
});
