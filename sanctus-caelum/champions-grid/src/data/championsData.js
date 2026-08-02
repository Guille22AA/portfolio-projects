// src/data/championData.js (para webpack/Create React App)

// grabs every champion JSON file from the folder
const championContext = require.context('./../data/champions', false, /\.json$/);
// gives us the file list we need to loop through
const championFiles = championContext.keys();

export const championsData = championFiles
  .map(file => championContext(file))
  // load each one and sort by id so the list stays in a clean order
  .sort((a, b) => a.id - b.id);

  // these are the filter values the app shows in the dropdowns
  export const filterOptions = {
    anime: [
      'Naruto',
      'Bleach',
      'Jujutsu Kaisen',
      'Hunter x Hunter',
      "JoJo's Bizarre Adventure",
      'Tokyo Ghoul',
      'Fire Force',
      'Dragon Ball',
      'Black Clover'
    ],
    // role options for the search filters
    role: [
      'Top',
      'Jungle',
      'Mid',
      'Bot',
      'Support'
    ],
    class: [
      'Sorcerer',
      'Fighter',
      'Slayer',
      'Duelist',
      'Marksman',
      'Oracle',
      'Warden'
    ],
    difficulty: [
      'Easy',
      'Medium',
      'Hard'
    ]
  };
  export default championsData;