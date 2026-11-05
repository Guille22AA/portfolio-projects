import vocabulary from './vocabulary.json';
import championIndex from './championIndex.json';

// Light list of every champion (name, anime, roles, render...), generated from the champion files by
// tools/build-champion-index.js and already sorted alphabetically: it is all the grid needs.
export const championsData = championIndex;

// The full champion files are split into their own chunks and downloaded only when a page needs them.
const championFiles = require.context('./champions', false, /\.json$/, 'lazy');

export const loadChampion = (slug) =>
  championFiles(`./${slug}.json`).then((module) => ({ ...(module.default || module), slug }));

// filter options come from the champions themselves, so a new anime or class shows up on its own.
// Known values keep the order of vocabulary.json; anything else is appended alphabetically.
const valuesOf = (field, order = []) => {
  const present = new Set(championsData.flatMap((champion) => [].concat(champion[field] || [])));
  const known = order.filter((value) => present.has(value));
  const extra = [...present].filter((value) => !order.includes(value)).sort();
  return [...known, ...extra];
};

export const filterOptions = {
  anime: valuesOf('anime'),
  role: valuesOf('roles', vocabulary.roles),
  class: valuesOf('class', vocabulary.classes),
  difficulty: valuesOf('difficulty', vocabulary.difficulties)
};

export default championsData;
