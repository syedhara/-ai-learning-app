/**
 * progress.js
 * Local-only profile + stats — everything lives in localStorage on this
 * device/browser. No accounts, no backend: a name is just a label for the
 * greeting, stats are tracked regardless of whether one's been set.
 */

const STORAGE_KEY = 'crossword.progress';

function emptyState() {
  return {
    profileName: '',
    seenWords: { beginner: [], intermediate: [], advanced: [] },
    totals: { attempted: 0, correct: 0 },
    bySubject: {},
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getProfileName() {
  return load().profileName;
}

export function setProfileName(name) {
  const state = load();
  state.profileName = name;
  save(state);
}

export function getSeenWords(difficulty) {
  return load().seenWords[difficulty] || [];
}

export function addSeenWords(difficulty, words) {
  const state = load();
  const existing = new Set(state.seenWords[difficulty] || []);
  words.forEach(w => existing.add(w));
  state.seenWords[difficulty] = [...existing];
  save(state);
}

export function resetSeenWords(difficulty) {
  const state = load();
  state.seenWords[difficulty] = [];
  save(state);
}

// One call per solved word — bumps the overall totals and that word's
// subject bucket. `correct` means solved without Reveal Letter/Word/Need Help.
export function recordAttempt({ subject, correct }) {
  const state = load();
  state.totals.attempted += 1;
  if (correct) state.totals.correct += 1;

  if (!state.bySubject[subject]) state.bySubject[subject] = { attempted: 0, correct: 0 };
  state.bySubject[subject].attempted += 1;
  if (correct) state.bySubject[subject].correct += 1;

  save(state);
}

// Returns stats for display — subjects sorted best-accuracy-first, subjects
// with no attempts omitted.
export function getStats() {
  const state = load();
  const bySubject = Object.entries(state.bySubject)
    .filter(([, { attempted }]) => attempted > 0)
    .map(([subject, { attempted, correct }]) => ({
      subject,
      attempted,
      correct,
      pct: Math.round((correct / attempted) * 100),
    }))
    .sort((a, b) => b.pct - a.pct);

  return {
    totalAttempted: state.totals.attempted,
    totalCorrect: state.totals.correct,
    totalPct: state.totals.attempted > 0
      ? Math.round((state.totals.correct / state.totals.attempted) * 100)
      : 0,
    bySubject,
  };
}
