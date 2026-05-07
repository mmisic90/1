const STORAGE_KEY = 'business-ideas-votes';

function defaultState() {
  return { counts: {}, myVote: null };
}

export function loadVotes(storage = localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      counts: parsed.counts && typeof parsed.counts === 'object' ? { ...parsed.counts } : {},
      myVote: typeof parsed.myVote === 'number' ? parsed.myVote : null,
    };
  } catch {
    return defaultState();
  }
}

export function saveVotes(state, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function castVote(state, ideaIndex) {
  const counts = { ...state.counts };
  const previous = state.myVote;

  if (previous === ideaIndex) {
    counts[ideaIndex] = Math.max(0, (counts[ideaIndex] || 0) - 1);
    return { counts, myVote: null };
  }

  if (previous !== null && previous !== undefined) {
    counts[previous] = Math.max(0, (counts[previous] || 0) - 1);
  }
  counts[ideaIndex] = (counts[ideaIndex] || 0) + 1;
  return { counts, myVote: ideaIndex };
}

export function getCount(state, ideaIndex) {
  return state.counts[ideaIndex] || 0;
}

export function getTotal(state) {
  return Object.values(state.counts).reduce((sum, n) => sum + (n || 0), 0);
}

export { STORAGE_KEY };
