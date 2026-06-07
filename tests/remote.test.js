import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRemote } from '../src/remote.js';

function setupDOM() {
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
      <div class="source-row">
        <button class="source-btn active" data-source="HDMI 1">HDMI 1</button>
        <button class="source-btn" data-source="HDMI 2">HDMI 2</button>
        <button class="source-btn" data-source="USB">USB</button>
        <button class="source-btn" data-source="AV">AV</button>
      </div>
    </div>
  `;
}

describe('initial state', () => {
  let remote;
  beforeEach(() => { setupDOM(); remote = createRemote(document); });

  it('starts powered on with default values', () => {
    const s = remote.getState();
    expect(s.power).toBe(true);
    expect(s.volume).toBe(50);
    expect(s.channel).toBe(1);
    expect(s.muted).toBe(false);
    expect(s.playing).toBe(false);
    expect(s.currentSource).toBe('HDMI 1');
    expect(s.channelInput).toBe('');
  });

  it('getState returns a copy that does not mutate internal state', () => {
    const snap = remote.getState();
    snap.volume = 999;
    expect(remote.getState().volume).toBe(50);
  });
});

describe('togglePower', () => {
  let remote;
  beforeEach(() => { setupDOM(); remote = createRemote(document); });

  it('toggles power off', () => {
    remote.togglePower();
    expect(remote.getState().power).toBe(false);
    expect(document.getElementById('powerBtn').classList.contains('on')).toBe(false);
    expect(document.getElementById('display').classList.contains('off')).toBe(true);
    expect(document.getElementById('displayChannel').textContent).toBe('');
    expect(document.getElementById('displayLabel').textContent).toBe('');
  });

  it('toggles power back on and restores display', () => {
    remote.togglePower();
    remote.togglePower();
    expect(remote.getState().power).toBe(true);
    expect(document.getElementById('powerBtn').classList.contains('on')).toBe(true);
    expect(document.getElementById('display').classList.contains('off')).toBe(false);
    expect(document.getElementById('displayChannel').textContent).toBe('Power On');
    expect(document.getElementById('displayLabel').textContent).toBe('HDMI 1');
  });

  it('all controls no-op when powered off', () => {
    remote.togglePower();
    const before = remote.getState();
    remote.adjustVolume(1);
    remote.toggleMute();
    remote.adjustChannel(1);
    remote.numInput(5);
    remote.goToChannel();
    remote.clearInput();
    remote.dpadAction('up');
    remote.mediaAction('playpause');
    remote.setSource(null, 'USB');
    const after = remote.getState();
    expect(after.volume).toBe(before.volume);
    expect(after.muted).toBe(before.muted);
    expect(after.channel).toBe(before.channel);
    expect(after.channelInput).toBe(before.channelInput);
    expect(after.playing).toBe(before.playing);
    expect(after.currentSource).toBe(before.currentSource);
  });
});

describe('adjustVolume', () => {
  let remote;
  beforeEach(() => { setupDOM(); remote = createRemote(document); });

  it('increments by 5', () => {
    remote.adjustVolume(1);
    expect(remote.getState().volume).toBe(55);
    expect(document.getElementById('volValue').textContent).toBe('55');
  });

  it('decrements by 5', () => {
    remote.adjustVolume(-1);
    expect(remote.getState().volume).toBe(45);
  });

  it('clamps at 100', () => {
    for (let i = 0; i < 20; i++) remote.adjustVolume(1);
    expect(remote.getState().volume).toBe(100);
    expect(document.getElementById('displayLabel').textContent).toBe('Maximum');
  });

  it('clamps at 0', () => {
    for (let i = 0; i < 20; i++) remote.adjustVolume(-1);
    expect(remote.getState().volume).toBe(0);
    expect(document.getElementById('displayLabel').textContent).toBe('Minimum');
  });

  it('auto-unmutes when adjusting volume while muted', () => {
    remote.toggleMute();
    expect(remote.getState().muted).toBe(true);
    remote.adjustVolume(1);
    expect(remote.getState().muted).toBe(false);
  });

  it('shows VOL message', () => {
    remote.adjustVolume(1);
    expect(document.getElementById('displayChannel').textContent).toBe('VOL 55');
  });
});

describe('toggleMute', () => {
  let remote;
  beforeEach(() => { setupDOM(); remote = createRemote(document); });

  it('toggles muted state and button label', () => {
    remote.toggleMute();
    expect(remote.getState().muted).toBe(true);
    expect(document.getElementById('muteBtn').textContent).toBe('UNMUTE');
    expect(document.getElementById('muteBtn').classList.contains('muted')).toBe(true);
    expect(document.getElementById('displayChannel').textContent).toBe('MUTED');

    remote.toggleMute();
    expect(remote.getState().muted).toBe(false);
    expect(document.getElementById('muteBtn').textContent).toBe('MUTE');
    expect(document.getElementById('muteBtn').classList.contains('muted')).toBe(false);
    expect(document.getElementById('displayChannel').textContent).toBe('VOL 50');
  });
});

describe('adjustChannel', () => {
  let remote;
  beforeEach(() => { setupDOM(); remote = createRemote(document); });

  it('increments channel', () => {
    remote.adjustChannel(1);
    expect(remote.getState().channel).toBe(2);
    expect(document.getElementById('chValue').textContent).toBe('2');
  });

  it('wraps from 1 down to 999', () => {
    remote.adjustChannel(-1);
    expect(remote.getState().channel).toBe(999);
  });

  it('wraps from 999 up to 1', () => {
    for (let i = 0; i < 998; i++) remote.adjustChannel(1);
    expect(remote.getState().channel).toBe(999);
    remote.adjustChannel(1);
    expect(remote.getState().channel).toBe(1);
  });

  it('shows current source in label', () => {
    remote.adjustChannel(1);
    expect(document.getElementById('displayLabel').textContent).toBe('HDMI 1');
  });
});

describe('numInput / goToChannel / clearInput', () => {
  beforeEach(() => { setupDOM(); vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('appends digits and shows them with cursor', () => {
    const remote = createRemote(document);
    remote.numInput(1);
    remote.numInput(2);
    remote.numInput(3);
    expect(remote.getState().channelInput).toBe('123');
    expect(document.getElementById('displayChannel').textContent).toBe('CH 123_');
  });

  it('resets buffer when more than 3 digits entered', () => {
    const remote = createRemote(document);
    remote.numInput(1);
    remote.numInput(2);
    remote.numInput(3);
    remote.numInput(4);
    expect(remote.getState().channelInput).toBe('4');
  });

  it('auto-submits after 2-second timeout', () => {
    const remote = createRemote(document);
    remote.numInput(4);
    remote.numInput(2);
    expect(remote.getState().channel).toBe(1);
    vi.advanceTimersByTime(2000);
    expect(remote.getState().channel).toBe(42);
    expect(remote.getState().channelInput).toBe('');
    expect(document.getElementById('chValue').textContent).toBe('42');
  });

  it('respects custom inputTimeoutMs option', () => {
    const remote = createRemote(document, { inputTimeoutMs: 500 });
    remote.numInput(7);
    vi.advanceTimersByTime(499);
    expect(remote.getState().channel).toBe(1);
    vi.advanceTimersByTime(1);
    expect(remote.getState().channel).toBe(7);
  });

  it('each new digit resets the timer', () => {
    const remote = createRemote(document);
    remote.numInput(1);
    vi.advanceTimersByTime(1500);
    remote.numInput(2);
    vi.advanceTimersByTime(1500);
    expect(remote.getState().channel).toBe(1);
    vi.advanceTimersByTime(500);
    expect(remote.getState().channel).toBe(12);
  });

  it('goToChannel applies a valid buffered input', () => {
    const remote = createRemote(document);
    remote.numInput(2);
    remote.numInput(5);
    remote.goToChannel();
    expect(remote.getState().channel).toBe(25);
    expect(remote.getState().channelInput).toBe('');
  });

  it('goToChannel ignores 0 (out of range)', () => {
    const remote = createRemote(document);
    remote.numInput(0);
    remote.goToChannel();
    expect(remote.getState().channel).toBe(1);
    expect(remote.getState().channelInput).toBe('');
  });

  it('goToChannel keeps current channel when buffer is empty', () => {
    const remote = createRemote(document);
    remote.adjustChannel(1);
    remote.goToChannel();
    expect(remote.getState().channel).toBe(2);
  });

  it('clearInput empties the buffer and cancels pending submit', () => {
    const remote = createRemote(document);
    remote.numInput(1);
    remote.numInput(2);
    remote.clearInput();
    expect(remote.getState().channelInput).toBe('');
    vi.advanceTimersByTime(5000);
    expect(remote.getState().channel).toBe(1);
  });
});

describe('dpadAction', () => {
  it('shows direction labels', () => {
    setupDOM();
    const remote = createRemote(document);
    const cases = [
      ['up', '▲ Up'],
      ['down', '▼ Down'],
      ['left', '◀ Left'],
      ['right', '▶ Right'],
      ['ok', 'Select'],
    ];
    for (const [dir, label] of cases) {
      remote.dpadAction(dir);
      expect(document.getElementById('displayChannel').textContent).toBe(label);
      expect(document.getElementById('displayLabel').textContent).toBe('Navigation');
    }
  });
});

describe('mediaAction', () => {
  let remote;
  beforeEach(() => { setupDOM(); remote = createRemote(document); });

  it('playpause toggles state and button glyph', () => {
    remote.mediaAction('playpause');
    expect(remote.getState().playing).toBe(true);
    expect(document.getElementById('playPauseBtn').textContent).toBe('⏸');
    expect(document.getElementById('displayChannel').textContent).toBe('Playing');

    remote.mediaAction('playpause');
    expect(remote.getState().playing).toBe(false);
    expect(document.getElementById('playPauseBtn').textContent).toBe('▶');
    expect(document.getElementById('displayChannel').textContent).toBe('Paused');
  });

  it('shows transport labels', () => {
    remote.mediaAction('prev');
    expect(document.getElementById('displayChannel').textContent).toBe('⏮ Previous');
    remote.mediaAction('rew');
    expect(document.getElementById('displayChannel').textContent).toBe('⏪ Rewind');
    remote.mediaAction('ff');
    expect(document.getElementById('displayChannel').textContent).toBe('⏩ Fast Forward');
    remote.mediaAction('next');
    expect(document.getElementById('displayChannel').textContent).toBe('⏭ Next');
  });
});

describe('setSource', () => {
  let remote;
  beforeEach(() => { setupDOM(); remote = createRemote(document); });

  it('updates currentSource and applies active class to chosen button only', () => {
    const usbBtn = document.querySelector('[data-source="USB"]');
    remote.setSource(usbBtn, 'USB');
    expect(remote.getState().currentSource).toBe('USB');
    expect(usbBtn.classList.contains('active')).toBe(true);
    const others = Array.from(document.querySelectorAll('.source-btn')).filter((b) => b !== usbBtn);
    others.forEach((b) => expect(b.classList.contains('active')).toBe(false));
    expect(document.getElementById('displayChannel').textContent).toBe('Input: USB');
  });
});
