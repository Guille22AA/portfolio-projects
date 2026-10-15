import { formatBonusAttackSpeed, formatScaling, humanize, parseFormula } from "./championStats";

// reference values from the LoL wiki (Lissandra), the same ones used in the sketch
test("stat formulas follow LoL's growth curve", () => {
  expect(formatScaling("620 + 110 × lvl²", null)).toBe("620 – 2783.15");
  expect(formatScaling("620 + 110 × lvl²", 1)).toBe("620");
  expect(formatBonusAttackSpeed("1.5%", null)).toBe("0 – 29.5%");
});

test("plain values and text are shown as they are", () => {
  expect(formatScaling("330", null)).toBe("330");
  expect(formatScaling("200%", 5)).toBe("200%");
  expect(parseFormula("Kills, assists, monster clears")).toBeNull();
});

test("resource maximums can grow per level", () => {
  expect(formatScaling({ base: 333, growth: 40 }, null)).toBe("333 – 1119.6");
});

test("keys are turned into readable labels", () => {
  expect(humanize("castTime")).toBe("Cast Time");
  expect(humanize("minion_monster_slow")).toBe("Minion monster slow");
});
