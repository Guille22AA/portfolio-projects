// src/data/championData.js (para webpack/Create React App)

import vocabulary from './vocabulary.json';

// grabs every champion JSON file from the folder
const championContext = require.context('./../data/champions', false, /\.json$/);
// gives us the file list we need to loop through
const championFiles = championContext.keys();

export const championsData = championFiles
  // the file name doubles as the URL slug and as the key for the cutout and gallery of each champion
  .map(file => ({ ...championContext(file), slug: file.split('/').pop().replace('.json', '') }))
  // load each one and sort by id so the list stays in a clean order
  .sort((a, b) => a.id - b.id);

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