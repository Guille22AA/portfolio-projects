import React from "react";
import Icon from "./Icons";
import { humanize } from "../utils/championStats";

const SLOTS = ["h1", "h2", "h3", "h4"];

// fields that are shown somewhere else in the card, so they never become a stat chip
const HEADER_FIELDS = ["name", "description", "type", "effects"];

// the icon of an ability is picked from the first of these words that shows up in its text
const ICON_KEYWORDS = [
  ["dash", /\b(dash|blink|lunge|leap|teleport)/],
  ["shield", /\b(shield|barrier|block|damage reduction|reducing incoming)/],
  ["heal", /\b(heal|restor|reviv|regenerat)/],
  ["summon", /\b(summon|puppet|clone|spawn)/],
  ["transform", /\b(transform|overclock|empowered state|fuses|assumes|envelops)/],
  ["control", /\b(stun|root|knock|pull|taunt|polymorph|paralyz|slow)/],
  ["mark", /\b(mark|locks? onto|execut)/],
  ["area", /\b(area|zone|domain|field|flood|circular)/],
  ["projectile", /\b(fire|launch|throw|shot|bullet|arrow|orb|blast|hurl)/],
  ["strike", /\b(basic attack|slash|stab|strike|slam)/]
];

const pickIcon = (ability) => {
  const text = `${ability.name} ${ability.description || ""}`.toLowerCase();
  let best = ["aura", Infinity];
  ICON_KEYWORDS.forEach(([icon, pattern]) => {
    const position = text.search(pattern);
    if (position !== -1 && position < best[1]) best = [icon, position];
  });
  return best[0];
};

const isPlain = (value) => value === null || typeof value !== "object";

const plainText = (value) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

// flattens any nested object into [label, text] rows
const toRows = (value, label = "") => {
  if (isPlain(value)) return [[label, plainText(value)]];
  if (Array.isArray(value)) {
    if (value.every(isPlain)) return [[label, value.map(plainText).join(", ")]];
    return value.flatMap((item, index) => toRows(item, `${label} ${index + 1}`.trim()));
  }
  // nested damage ("50 / 70 / 90" + "40% AP" + "Magic") reads better as a single row
  const amount = value.baseValues || value.values || value.perTick;
  if (label && amount && isPlain(amount)) {
    const { baseValues, values, perTick, scaling, type, ...rest } = value;
    const parts = [amount, isPlain(scaling) && scaling ? `(+ ${scaling})` : "", typeof type === "string" ? `· ${type}` : ""];
    return [[label, parts.filter(Boolean).join(" ")], ...toRows(rest, label).filter(() => Object.keys(rest).length)];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    toRows(child, label ? `${label} · ${humanize(key)}` : humanize(key))
  );
};

// turns one entry of "effects" (or any other nested field) into a titled block
const toBlock = (key, value) => {
  if (isPlain(value) || (Array.isArray(value) && value.every(isPlain))) {
    return { title: humanize(key), rows: toRows(value) };
  }
  if (Array.isArray(value)) {
    return { title: humanize(key), rows: toRows(value) };
  }

  const { name, type, baseValues, values, perTick, scaling, ...rest } = value;
  const amount = baseValues || values || perTick;
  const block = { title: name || humanize(key), damageType: null, headline: null, rows: [] };

  if (amount && isPlain(amount)) {
    // damage-like effect: "80 / 115 / 150 (+ 75% AP)"
    block.headline = scaling && isPlain(scaling) ? `${amount} (+ ${scaling})` : String(amount);
    block.damageType = typeof type === "string" ? type : null;
    if (block.damageType) block.title = `${block.title} · ${block.damageType}`;
    if (scaling && !isPlain(scaling)) rest.scaling = scaling;
  } else {
    if (type !== undefined) rest.type = type;
    if (amount !== undefined) rest.values = amount;
    if (scaling !== undefined) rest.scaling = scaling;
  }

  block.rows = toRows(rest).filter(([, text]) => text !== "");
  return block;
};

const toBlocks = (ability) => {
  const blocks = [];
  const { effects } = ability;

  if (Array.isArray(effects)) {
    effects.forEach((effect, index) => {
      if (isPlain(effect)) {
        blocks.push({ title: `Effect ${index + 1}`, rows: toRows(effect) });
        return;
      }
      const { type, ...rest } = effect;
      blocks.push({ title: type || `Effect ${index + 1}`, rows: toRows(rest) });
    });
  } else if (effects && typeof effects === "object") {
    Object.entries(effects).forEach(([key, value]) => blocks.push(toBlock(key, value)));
  }

  // any other nested field (modes, phases, transformations...) is shown the same way
  Object.entries(ability).forEach(([key, value]) => {
    if (HEADER_FIELDS.includes(key) || isPlain(value)) return;
    if (Array.isArray(value)) {
      blocks.push({ title: humanize(key), rows: toRows(value) });
      return;
    }
    const children = Object.entries(value);
    // a group of named sub-sections (three sword modes, five phases) becomes one block each
    if (children.every(([, child]) => !isPlain(child) && !Array.isArray(child))) {
      children.forEach(([childKey, child]) => blocks.push(toBlock(childKey, child)));
    } else {
      blocks.push(toBlock(key, value));
    }
  });

  return blocks;
};

const Ability = ({ ability, passive = false }) => {
  const chips = Object.entries(ability).filter(
    ([key, value]) => !HEADER_FIELDS.includes(key) && isPlain(value)
  );
  const blocks = toBlocks(ability);
  const icon = pickIcon(ability);

  return (
    <article className="ability">
      <header className="ability-header">
        <h3 className="ability-name">{ability.name}</h3>
        {chips.map(([key, value]) => (
          <span className="ability-chip" key={key}>
            <span className="ability-chip-label">{humanize(key)}:</span> {plainText(value)}
          </span>
        ))}
      </header>

      <div className="ability-body">
        <div className="ability-icon">
          <Icon name={icon} size={30} />
        </div>

        <div className="ability-text">
          <p>
            <span className="ability-type">{ability.type || (passive ? "Innate" : "Active")}:</span>{" "}
            {ability.description}
          </p>
        </div>

        {blocks.length > 0 && (
          <div className="ability-blocks">
            {blocks.map((block, index) => (
              <div className="ability-block" key={`${block.title}-${index}`}>
                <h4 className="ability-block-title">{block.title}</h4>
                {block.headline && (
                  <p className={`ability-block-headline damage-${(block.damageType || "none").toLowerCase()}`}>
                    {block.headline}
                  </p>
                )}
                {block.rows.map(([label, text], row) => (
                  <p className="ability-block-row" key={row}>
                    {label && <span className="ability-block-label">{label}: </span>}
                    {text}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

const AbilityList = ({ abilities }) => {
  // the passive can be a single object, an array, or come split as "passive" + "passive2"
  const passives = [abilities.passive, abilities.passive2].flat().filter(Boolean);

  return (
    <div className="ability-list">
      {passives.map((passive) => (
        <Ability key={passive.name} ability={passive} passive />
      ))}
      {SLOTS.filter((key) => abilities[key]).map((key) => (
        <Ability key={key} ability={abilities[key]} />
      ))}
    </div>
  );
};

export default AbilityList;
