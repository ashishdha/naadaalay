/* svara-map.js
   Full MIDI-range Hindustani svara mapper
   Internal int 0 = Middle Sa (MIDI 60)
*/

const BASE_MIDI = 60;

// Pitch class → svara
const SVARA_BY_PC = {
  0: "S",
  1: "r",
  2: "R",
  3: "g",
  4: "G",
  5: "M",
  6: "m",
  7: "P",
  8: "d",
  9: "D",
  10: "n",
  11: "N"
};

function svaraIntToSymbol(n) {
  if (n === null || n === undefined) return "";
  if (typeof n !== "number" || Number.isNaN(n)) return "";

  // Convert to MIDI
  const midi = BASE_MIDI + n;

  // Guard against absurd values
  if (midi < 0 || midi > 128) return "";

  // Pitch class
  const pc = ((midi % 12) + 12) % 12;
  const svara = SVARA_BY_PC[pc];

  // Octave offset from middle Sa
  const octaveOffset = Math.floor((midi - BASE_MIDI) / 12);

  if (octaveOffset === 0) return svara;

  const marks = "'".repeat(Math.abs(octaveOffset));

  // Below middle octave → before letter
  if (octaveOffset < 0) {
    return marks + svara;
  }

  // Above middle octave → after letter
  return svara + marks;
}

function svaraArrayToString(arr) {
  if (!Array.isArray(arr)) return "";
  return arr
    .filter(v => typeof v === "number" && Number.isFinite(v))
    .map(svaraIntToSymbol)
    .filter(Boolean)
    .join(" ");
}

window.SvaraMap = {
  svaraIntToSymbol,
  svaraArrayToString
};