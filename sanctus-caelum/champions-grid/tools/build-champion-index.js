// Builds src/data/championIndex.json: the few fields the grid, filters and cross-links need for every
// champion. The full champion files (abilities, lore, quotes) are then only downloaded when a champion
// page is opened, so the first load stays small however many champions are added.
// Runs automatically before `npm start`, `npm run build` and `npm test`.
const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "..", "src", "data", "champions");
const OUT = path.join(__dirname, "..", "src", "data", "championIndex.json");

const index = fs
  .readdirSync(DATA)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const champion = JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
    return {
      slug: file.replace(/\.json$/, ""),
      id: champion.id,
      nick: champion.nick,
      fullName: champion.fullName,
      anime: champion.anime,
      affiliation: champion.affiliation,
      roles: champion.roles,
      class: champion.class,
      difficulty: champion.difficulty,
      render: champion.render,
      // slugs this champion has interaction lines for, used to link related champions
      links: Object.keys(champion.quotes?.interactions || {})
    };
  })
  .sort((a, b) => a.fullName.localeCompare(b.fullName));

const json = JSON.stringify(index, null, 2) + "\n";
const previous = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
if (json !== previous) fs.writeFileSync(OUT, json);
console.log(`champion index: ${index.length} champions${json === previous ? " (unchanged)" : " (updated)"}`);
