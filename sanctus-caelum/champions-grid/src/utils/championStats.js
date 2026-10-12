// Helpers to turn the stat strings stored in the champion JSON files into numbers per level.
// Stats are written as "604 + 108 × lvl²": base value + growth per level, using LoL's growth curve.

export const MAX_LEVEL = 20;

// LoL's official stat growth curve: how many "growths" have been applied at a given level
const growthFactor = (level) => (level - 1) * (0.7025 + 0.0175 * (level - 1));

export const formatNumber = (value) => String(Math.round(value * 100) / 100);

// returns { base, growth } or null when the value is plain text ("200%", "Passive regen + ability cast")
export const parseFormula = (value) => {
  if (typeof value === "number") return { base: value, growth: 0 };
  const match = String(value ?? "").match(/^\s*([\d.]+)\s*\+\s*([\d.]+)\s*×\s*lvl/);
  if (!match) return null;
  return { base: Number(match[1]), growth: Number(match[2]) };
};

// level = null shows the whole range (level 1 – max level), otherwise the value at that level
export const formatScaling = (value, level, suffix = "") => {
  const formula = value && typeof value === "object" ? value : parseFormula(value);
  if (!formula) return value ?? "—";
  if (!formula.growth) return formatNumber(formula.base) + suffix;
  if (level) return formatNumber(formula.base + formula.growth * growthFactor(level)) + suffix;
  const max = formula.base + formula.growth * growthFactor(MAX_LEVEL);
  return `${formatNumber(formula.base)} – ${formatNumber(max)}${suffix}`;
};

// bonus attack speed starts at 0 and only has a growth value ("2.5%")
export const formatBonusAttackSpeed = (value, level) => {
  const growth = parseFloat(value);
  if (Number.isNaN(growth)) return value ?? "—";
  if (level) return `${formatNumber(growth * growthFactor(level))}%`;
  return `0 – ${formatNumber(growth * growthFactor(MAX_LEVEL))}%`;
};

// "castTime" / "minion_monster_slow" / "ZoneControl" -> "Cast Time" / "Minion Monster Slow" / "Zone Control"
export const humanize = (key) =>
  String(key)
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
