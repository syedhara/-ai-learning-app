// Multi-word terms are stored without a space (e.g. "DEEPLEARNING") plus a
// breakAfter letter-count marking where the two words split (see wordBank.json
// "_notes"). These helpers turn that stored form back into readable text —
// used anywhere a word is shown outside the crossword grid itself (flashcards,
// the glossary).

function titleCase(part) {
  return part.charAt(0) + part.slice(1).toLowerCase();
}

// "DEEPLEARNING", 4 -> "Deep Learning". No breakAfter -> "Chatbot".
export function formatWord(word, breakAfter) {
  if (!breakAfter) return titleCase(word);
  return `${titleCase(word.slice(0, breakAfter))} ${titleCase(word.slice(breakAfter))}`;
}

// Same shape as formatWord, but every letter is hidden behind an underscore —
// used by flashcards before the word is revealed.
export function formatBlanks(word, breakAfter) {
  const dashes = word.split('').map(() => '_').join(' ');
  if (!breakAfter) return dashes;
  const splitAt = breakAfter * 2 - 1; // each letter became "_ " (2 chars)
  return `${dashes.slice(0, splitAt)}   ${dashes.slice(splitAt)}`;
}
