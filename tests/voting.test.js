import { describe, it, expect } from 'vitest';
import { loadVotes, saveVotes, castVote, getCount, getTotal, STORAGE_KEY } from '../src/voting.js';

function makeStorage(initial = null) {
  const data = { value: initial };
  return {
    getItem: () => data.value,
    setItem: (_key, value) => { data.value = value; },
    _peek: () => data.value,
  };
}

describe('loadVotes', () => {
  it('returns default state when storage is empty', () => {
    const state = loadVotes(makeStorage(null));
    expect(state).toEqual({ counts: {}, myVote: null });
  });

  it('parses saved state', () => {
    const storage = makeStorage(JSON.stringify({ counts: { 0: 2, 1: 1 }, myVote: 0 }));
    const state = loadVotes(storage);
    expect(state.counts).toEqual({ 0: 2, 1: 1 });
    expect(state.myVote).toBe(0);
  });

  it('falls back to default state on malformed JSON', () => {
    const state = loadVotes(makeStorage('{not valid json'));
    expect(state).toEqual({ counts: {}, myVote: null });
  });

  it('coerces missing fields to defaults', () => {
    const storage = makeStorage(JSON.stringify({}));
    const state = loadVotes(storage);
    expect(state).toEqual({ counts: {}, myVote: null });
  });
});

describe('saveVotes', () => {
  it('writes JSON to storage under the expected key', () => {
    const storage = makeStorage(null);
    let writtenKey = null;
    storage.setItem = (key, value) => { writtenKey = key; storage._value = value; };
    saveVotes({ counts: { 2: 1 }, myVote: 2 }, storage);
    expect(writtenKey).toBe(STORAGE_KEY);
    expect(JSON.parse(storage._value)).toEqual({ counts: { 2: 1 }, myVote: 2 });
  });
});

describe('castVote', () => {
  it('increments count and sets myVote on first vote', () => {
    const next = castVote({ counts: {}, myVote: null }, 0);
    expect(next.myVote).toBe(0);
    expect(next.counts[0]).toBe(1);
  });

  it('moves vote: decrements old, increments new', () => {
    const start = { counts: { 0: 1 }, myVote: 0 };
    const next = castVote(start, 2);
    expect(next.myVote).toBe(2);
    expect(next.counts[0]).toBe(0);
    expect(next.counts[2]).toBe(1);
  });

  it('toggles off when voting same idea twice', () => {
    const start = { counts: { 1: 1 }, myVote: 1 };
    const next = castVote(start, 1);
    expect(next.myVote).toBe(null);
    expect(next.counts[1]).toBe(0);
  });

  it('does not mutate the input state', () => {
    const start = { counts: { 0: 1 }, myVote: 0 };
    castVote(start, 1);
    expect(start).toEqual({ counts: { 0: 1 }, myVote: 0 });
  });

  it('preserves other ideas counts when moving vote', () => {
    const start = { counts: { 0: 5, 1: 3, 2: 1 }, myVote: 0 };
    const next = castVote(start, 1);
    expect(next.counts[0]).toBe(4);
    expect(next.counts[1]).toBe(4);
    expect(next.counts[2]).toBe(1);
  });
});

describe('getCount', () => {
  it('returns 0 for never-voted ideas', () => {
    expect(getCount({ counts: {}, myVote: null }, 5)).toBe(0);
  });

  it('returns the stored count', () => {
    expect(getCount({ counts: { 3: 7 }, myVote: 3 }, 3)).toBe(7);
  });
});

describe('getTotal', () => {
  it('returns 0 for empty counts', () => {
    expect(getTotal({ counts: {}, myVote: null })).toBe(0);
  });

  it('sums all counts', () => {
    expect(getTotal({ counts: { 0: 2, 1: 5, 3: 1 }, myVote: 1 })).toBe(8);
  });
});
