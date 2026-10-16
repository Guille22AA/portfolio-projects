// Checks every champion JSON before it reaches the site: required fields, allowed values,
// stat formulas, image files and leftover placeholders.
// Usage, from champions-grid: npm run validate   (exits with code 1 when something is wrong)
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "src", "data", "champions");
const vocabulary = require(path.join(ROOT, "src", "data", "vocabulary.json"));

const FORMULA = /^\s*[\d.]+\s*\+\s*[\d.]+\s*×\s*lvl/; // same notation championStats.js parses
const NUMBER = /^\d+(\.\d+)?$/;
const PLACEHOLDER = /por especificar|to be specified|url_por_especificar/i;
const RATING_AXES = ["damage", "toughness", "control", "mobility", "utility"];
const RELATIONS = ["ally", "enemy"];

const results = [];
let errorCount = 0;
let warningCount = 0;

const isText = (value) => typeof value === "string" && value.trim() !== "";
const list = (value) => [].concat(value ?? []);

const checkStats = (stats, where, error) => {
  if (!stats || typeof stats !== "object") return error(`${where}: missing "stats"`);
  ["health", "healthRegen", "armor", "attackDamage", "magicResistance"].forEach((key) => {
    if (!FORMULA.test(stats[key] ?? "")) error(`${where}.${key} must look like "604 + 108 × lvl²" (got ${JSON.stringify(stats[key])})`);
  });
  ["movementSpeed", "attackRange"].forEach((key) => {
    if (!NUMBER.test(String(stats[key] ?? ""))) error(`${where}.${key} must be a number (got ${JSON.stringify(stats[key])})`);
  });
  if (!isText(stats.criticalDamage)) error(`${where}.criticalDamage is missing`);
  const attackSpeed = stats.attackSpeed || {};
  ["base", "windup", "bonusAS"].forEach((key) => {
    if (!isText(attackSpeed[key])) error(`${where}.attackSpeed.${key} is missing`);
  });
};

const checkAbilities = (abilities, where, error, { needsAll = true } = {}) => {
  if (!abilities || typeof abilities !== "object") return error(`${where}: missing "abilities"`);
  ["h1", "h2", "h3", "h4"].forEach((slot) => {
    const ability = abilities[slot];
    if (!ability) {
      if (needsAll) error(`${where}.${slot} is missing`);
      return;
    }
    if (!isText(ability.name)) error(`${where}.${slot}.name is missing`);
    if (!isText(ability.description)) error(`${where}.${slot}.description is missing`);
  });
  [abilities.passive, abilities.passive2].flat().filter(Boolean).forEach((passive, index) => {
    if (!isText(passive.name) || !isText(passive.description)) error(`${where}: passive ${index + 1} needs a name and a description`);
  });
};

// mirrors readInteraction in ChampionDetail.js
const readableInteraction = (value) => {
  if (typeof value === "string") return true;
  if (Array.isArray(value) && value.length === 2 && typeof value[1] === "string") {
    const types = list(value[0]);
    if (types.every((type) => RELATIONS.includes(type))) return true;
  }
  return Array.isArray(value) && value.length > 0 && value.every(readableInteraction);
};

const files = fs.readdirSync(DATA).filter((file) => file.endsWith(".json")).sort();
const seenIds = new Map();
const slugs = new Set(files.map((file) => file.replace(/\.json$/, "")));

files.forEach((file) => {
  const slug = file.replace(/\.json$/, "");
  const errors = [];
  const warnings = [];
  const error = (message) => errors.push(message);
  const warn = (message) => warnings.push(message);

  let champion;
  try {
    champion = JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
  } catch (parseError) {
    results.push({ slug, errors: [`invalid JSON: ${parseError.message}`], warnings });
    errorCount += 1;
    return;
  }

  if (!/^[a-z0-9-]+$/.test(slug)) error(`file name must be lowercase letters, numbers or "-" (it is used in the URL)`);

  if (!Number.isInteger(champion.id)) error(`"id" must be a whole number`);
  else if (seenIds.has(champion.id)) error(`"id" ${champion.id} is already used by ${seenIds.get(champion.id)}`);
  else seenIds.set(champion.id, slug);

  ["nick", "fullName", "alias", "anime", "affiliation", "lore"].forEach((key) => {
    if (!isText(champion[key])) error(`"${key}" is missing`);
  });

  const inList = (key, allowed, { single = false } = {}) => {
    const values = list(champion[key]);
    if (!values.length) return error(`"${key}" is missing`);
    if (single && Array.isArray(champion[key])) error(`"${key}" must be a single value`);
    values.filter((value) => !allowed.includes(value)).forEach((value) =>
      error(`"${key}" has "${value}", allowed: ${allowed.join(", ")} (add it to src/data/vocabulary.json if it is new)`));
  };
  inList("roles", vocabulary.roles);
  inList("attackTypes", vocabulary.attackTypes);
  inList("damageTypes", vocabulary.damageTypes);
  inList("class", vocabulary.classes);
  inList("difficulty", vocabulary.difficulties, { single: true });
  inList("tags", Object.keys(vocabulary.tags));
  if (new Set(list(champion.tags)).size !== list(champion.tags).length) error(`"tags" has duplicates`);

  const price = champion.price || {};
  if (!Number.isInteger(price.coins) || !Number.isInteger(price.premium)) error(`"price" needs whole numbers for "coins" and "premium"`);
  RATING_AXES.forEach((axis) => {
    const value = champion.ratings?.[axis];
    if (!Number.isInteger(value) || value < 0 || value > 3) error(`"ratings.${axis}" must be 0, 1, 2 or 3`);
  });
  if (!Number.isInteger(champion.style) || champion.style < 0 || champion.style > 100) error(`"style" must be a whole number from 0 to 100`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(champion.releaseDate ?? "")) error(`"releaseDate" must look like 2026-10-12`);
  if (!isText(champion.lastChanged)) error(`"lastChanged" is missing`);

  const resource = champion.resource || {};
  if (!isText(resource.name) || !isText(resource.type)) error(`"resource" needs "name" and "type" ("None" for champions without resource)`);
  else if (resource.type !== "None" && typeof resource.maxValue !== "number") error(`"resource.maxValue" must be a number`);

  if (champion.forms) {
    Object.entries(champion.forms).forEach(([form, data]) => {
      checkStats(data.stats, `forms.${form}.stats`, error);
      checkAbilities({ ...data.abilities, ...champion.sharedAbilities }, `forms.${form}.abilities`, error);
    });
  } else {
    checkStats(champion.stats, "stats", error);
    checkAbilities(champion.abilities, "abilities", error);
  }

  const quotes = champion.quotes || {};
  // a champion may be silent (no selection or general quotes), but if one is given it must be valid
  if (quotes.selection !== undefined && !isText(quotes.selection)) error(`"quotes.selection" must be a quote`);
  if (quotes.general !== undefined && !Array.isArray(quotes.general)) error(`"quotes.general" must be a list of quotes`);
  if (!isText(quotes.selection) && !(quotes.general || []).length && !Object.keys(quotes.interactions || {}).length) warn(`no quotes at all`);
  Object.entries(quotes.interactions || {}).forEach(([key, value]) => {
    if (!/^[a-z0-9-]+$/.test(key)) error(`interaction key "${key}" must be the target's file name (e.g. "gojo", "kaneki")`);
    if (!readableInteraction(value)) error(`interaction "${key}" must be "quote", ["ally"|"enemy", "quote"] or [["ally", "enemy"], "quote"]`);
  });

  const render = champion.render || "";
  if (!render) error(`"render" is missing`);
  else if (!fs.existsSync(path.join(ROOT, "public", render))) error(`render file not found: public${render}`);
  if (!fs.existsSync(path.join(ROOT, "public", "cutouts", `${slug}.webp`))) {
    error(`cutout not found: public/cutouts/${slug}.webp (python tools/prepare_assets.py cutout ${slug} <image>)`);
  }
  const galleryFolder = path.join(ROOT, "src", "assets", "gallery", slug);
  const galleryImages = fs.existsSync(galleryFolder) ? fs.readdirSync(galleryFolder).filter((name) => !name.startsWith(".")) : [];
  if (!galleryImages.length) warn(`no gallery images in src/assets/gallery/${slug}/ (the section will be hidden)`);
  galleryImages.filter((name) => !/\.webp$/i.test(name)).forEach((name) =>
    warn(`gallery image ${name} is not WebP (python tools/prepare_assets.py gallery ${slug})`));

  const raw = fs.readFileSync(path.join(DATA, file), "utf8");
  raw.split(/\r?\n/).forEach((line, index) => {
    if (PLACEHOLDER.test(line)) error(`line ${index + 1} still has a placeholder: ${line.trim().slice(0, 80)}`);
  });

  errorCount += errors.length;
  warningCount += warnings.length;
  results.push({ slug, errors, warnings });
});

results.forEach(({ slug, errors, warnings }) => {
  if (!errors.length && !warnings.length) return;
  console.log(`\n${slug}`);
  errors.forEach((message) => console.log(`  error    ${message}`));
  warnings.forEach((message) => console.log(`  warning  ${message}`));
});

const linked = files.reduce((count, file) => {
  const champion = JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
  return count + Object.keys(champion.quotes?.interactions || {}).filter((key) => slugs.has(key)).length;
}, 0);

console.log(`\n${files.length} champions checked: ${errorCount} error(s), ${warningCount} warning(s). ${linked} interactions point to champions in the roster.`);
process.exitCode = errorCount ? 1 : 0;
