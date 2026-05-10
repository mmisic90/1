export function createRemote(document, options = {}) {
  const displayEl = document.getElementById('display');
  const displayChannel = document.getElementById('displayChannel');
  const displayLabel = document.getElementById('displayLabel');
  const volValue = document.getElementById('volValue');
  const chValue = document.getElementById('chValue');
  const muteBtn = document.getElementById('muteBtn');
  const powerBtn = document.getElementById('powerBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');

  const inputTimeoutMs = options.inputTimeoutMs ?? 2000;

  const state = {
    power: true,
    volume: 50,
    channel: 1,
    muted: false,
    playing: false,
    channelInput: '',
    currentSource: 'HDMI 1',
  };
  let inputTimeout = null;

  function showMessage(main, sub) {
    if (displayChannel) displayChannel.textContent = main;
    if (displayLabel) displayLabel.textContent = sub || '';
  }

  function togglePower() {
    state.power = !state.power;
    if (powerBtn) powerBtn.classList.toggle('on', state.power);
    if (displayEl) displayEl.classList.toggle('off', !state.power);
    if (state.power) {
      showMessage('Power On', state.currentSource);
    } else {
      clearTimeout(inputTimeout);
      state.channelInput = '';
      if (displayChannel) displayChannel.textContent = '';
      if (displayLabel) displayLabel.textContent = '';
    }
  }

  function adjustVolume(dir) {
    if (!state.power) return;
    if (state.muted) toggleMute();
    state.volume = Math.max(0, Math.min(100, state.volume + dir * 5));
    if (volValue) volValue.textContent = String(state.volume);
    const sub = state.volume === 0 ? 'Minimum' : state.volume === 100 ? 'Maximum' : '';
    showMessage('VOL ' + state.volume, sub);
  }

  function toggleMute() {
    if (!state.power) return;
    state.muted = !state.muted;
    if (muteBtn) {
      muteBtn.classList.toggle('muted', state.muted);
      muteBtn.textContent = state.muted ? 'UNMUTE' : 'MUTE';
    }
    showMessage(state.muted ? 'MUTED' : 'VOL ' + state.volume, '');
  }

  function adjustChannel(dir) {
    if (!state.power) return;
    state.channel = state.channel + dir;
    if (state.channel < 1) state.channel = 999;
    if (state.channel > 999) state.channel = 1;
    if (chValue) chValue.textContent = String(state.channel);
    showMessage('CH ' + state.channel, state.currentSource);
  }

  function numInput(num) {
    if (!state.power) return;
    clearTimeout(inputTimeout);
    state.channelInput += String(num);
    if (state.channelInput.length > 3) state.channelInput = String(num);
    showMessage('CH ' + state.channelInput + '_', 'Press GO or wait...');
    inputTimeout = setTimeout(() => {
      goToChannel();
    }, inputTimeoutMs);
  }

  function clearInput() {
    state.channelInput = '';
    clearTimeout(inputTimeout);
    showMessage('CH ' + state.channel, state.currentSource);
  }

  function goToChannel() {
    if (!state.power) return;
    clearTimeout(inputTimeout);
    if (state.channelInput) {
      const ch = parseInt(state.channelInput, 10);
      if (ch >= 1 && ch <= 999) {
        state.channel = ch;
        if (chValue) chValue.textContent = String(state.channel);
      }
      state.channelInput = '';
    }
    showMessage('CH ' + state.channel, state.currentSource);
  }

  function dpadAction(dir) {
    if (!state.power) return;
    const labels = { up: '▲ Up', down: '▼ Down', left: '◀ Left', right: '▶ Right', ok: 'Select' };
    showMessage(labels[dir], 'Navigation');
  }

  function mediaAction(action) {
    if (!state.power) return;
    if (action === 'playpause') {
      state.playing = !state.playing;
      if (playPauseBtn) playPauseBtn.textContent = state.playing ? '⏸' : '▶';
      showMessage(state.playing ? 'Playing' : 'Paused', '');
    } else {
      const labels = { prev: '⏮ Previous', rew: '⏪ Rewind', ff: '⏩ Fast Forward', next: '⏭ Next' };
      showMessage(labels[action], '');
    }
  }

  function setSource(btn, source) {
    if (!state.power) return;
    state.currentSource = source;
    document.querySelectorAll('.source-btn').forEach((b) => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    showMessage('Input: ' + source, '');
  }

  return {
    togglePower,
    adjustVolume,
    toggleMute,
    adjustChannel,
    numInput,
    clearInput,
    goToChannel,
    dpadAction,
    mediaAction,
    setSource,
    getState: () => ({ ...state }),
  };
}
