// ── Admin Configuration ────────────────────────────────────────────────────────
// Flip these true/false to control what users can see and do.
// No UI admin panel yet — this is a code-level setting for now.
//
// Turning something off hides it completely from the user interface.

export const adminConfig = {

  // Mode 1 — User fills the whole puzzle, then clicks Check Answers
  allowCheckAnswers: true,

  // Mode 2 — Each cell turns green or red the instant the user types a letter
  allowLiveFeedback: true,

  // Mode 3a — Reveal the correct letter for just the selected cell
  allowRevealLetter: true,

  // Mode 3b — Reveal all letters in the currently selected word
  allowRevealWord: true,

  // Which mode is pre-selected when the puzzle loads
  // Options: 'checkAnswers' | 'liveFeedback' | 'reveal'
  defaultMode: 'checkAnswers',

  // % of grid cells revealed when the user clicks "Need Help" (one time per
  // puzzle), like a Sudoku starting board. The grid loads empty — this is
  // opt-in, not automatic. Revealed letters are locked — can't be typed over.
  // Set to 0 to hide the Need Help button entirely.
  prefillPercentage: 12,

};
