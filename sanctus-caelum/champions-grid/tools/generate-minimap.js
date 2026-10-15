// Generates the Sanctus Caelum main-mode minimap as a static SVG (public/maps/minimap.svg).
// Usage, from champions-grid: node tools/generate-minimap.js [output.svg]
// Jungle corridors and pits are not drawn: they are the gaps left by trees and rocks.
const fs = require("fs");
const path = require("path");
const out = process.argv[2] || path.join(__dirname, "..", "public", "maps", "minimap.svg");

let seed = 20261012;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rr = (a, b) => a + rnd() * (b - a);
const pick = (list) => list[Math.floor(rnd() * list.length)];
const f = (n) => Math.round(n * 10) / 10;
const mirror = ([x, y]) => [1000 - x, 1000 - y];
const mirrorAll = (points) => points.map(mirror);
const deg = (d) => (d * Math.PI) / 180;

// ---------- layout ----------
const MIN = 60, MAX = 940;
const BASE_R = 255;
const blueCorner = [MIN, MAX], redCorner = [MAX, MIN];

const lanes = [
  "M90 700L90 130Q90 90 130 90L700 90",
  "M300 910L870 910Q910 910 910 870L910 300",
  "M240 760L760 240"
];
const laneLines = [
  [[90, 850], [90, 90], [850, 90]],
  [[150, 910], [910, 910], [910, 150]],
  [[140, 860], [860, 140]]
];
const riverPath = "M150 215Q300 290 330 350T500 500T670 650T850 785";
const riverLine = [[150, 215], [250, 262], [330, 350], [415, 428], [500, 500], [585, 572], [670, 650], [750, 738], [850, 785]];

// quadrants: W and E are jungle, N and S are arid
const quads = {
  W: [[60, 142], [500, 500], [60, 940]],
  N: [[60, 142], [60, 60], [940, 60], [500, 500]],
  E: mirrorAll([[60, 142], [500, 500], [60, 940]]),
  S: mirrorAll([[60, 142], [60, 60], [940, 60], [500, 500]])
};
const biome = { W: "jungle", E: "jungle", N: "arid", S: "arid" };
const quadKeys = ["N", "S", "W", "E"];

// a pit is an alcove: closed behind (180 degrees of trees or rocks), open towards "dir"
const mirrorPit = (p) => ({ ...p, c: mirror(p.c), dir: p.dir + Math.PI });
const wPits = [
  { c: [285, 485], r: 40, dir: deg(90), reach: 66 },
  { c: [190, 372], r: 26, dir: deg(90), reach: 40 },
  { c: [250, 665], r: 26, dir: deg(180), reach: 24 }
];
const nPits = [
  { c: [575, 300], r: 40, dir: deg(180), reach: 46 },
  { c: [330, 175], r: 26, dir: deg(0), reach: 66 },
  { c: [650, 150], r: 26, dir: deg(90), reach: 26 }
];
const pits = { W: wPits, N: nPits, E: wPits.map(mirrorPit), S: nPits.map(mirrorPit) };
const towards = (from, to) => Math.atan2(to[1] - from[1], to[0] - from[0]);
const elder = { c: [390, 276], r: 54, dir: towards([390, 276], [330, 350]), reach: 44, epic: "pitElder" };
const bijuu = { c: [610, 724], r: 43, dir: towards([610, 724], [670, 650]), reach: 54, epic: "pitBijuu" };
const epicPits = { N: [elder], S: [bijuu], W: [], E: [] };

// corridors: only used as "keep clear" zones, never drawn
const wCorridors = [
  [[113, 440], [190, 440], [250, 405], [285, 345], [295, 315]],
  [[190, 440], [205, 540], [200, 610], [212, 700], [216, 748]],
  [[205, 555], [290, 592], [365, 612], [397, 603]],
  [[300, 595], [355, 530], [395, 445], [412, 425]]
];
const nCorridors = [
  [[425, 113], [430, 170], [470, 230], [485, 300], [470, 385], [455, 450]],
  [[470, 230], [560, 205], [640, 200], [700, 215], [758, 243]],
  [[560, 205], [560, 113]],
  [[485, 330], [540, 390], [585, 415]]
];

// ---------- geometry helpers ----------
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const inPoly = ([x, y], poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const distSeg = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
};
const distLine = (p, line) => { let d = Infinity; for (let i = 0; i < line.length - 1; i++) d = Math.min(d, distSeg(p, line[i], line[i + 1])); return d; };

// rounds a polyline (Chaikin) and resamples it, giving each sample its own width so the corridor breathes
const smooth = (points) => {
  let line = points;
  for (let k = 0; k < 3; k++) {
    const next = [line[0]];
    for (let i = 0; i < line.length - 1; i++) {
      const [a, b] = [line[i], line[i + 1]];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    next.push(line[line.length - 1]);
    line = next;
  }
  const samples = [];
  const phase = rr(0, 6), phase2 = rr(0, 6);
  let travelled = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const length = dist(line[i], line[i + 1]), steps = Math.max(1, Math.ceil(length / 5));
    for (let s = 0; s < steps; s++) {
      const t = s / steps, d = travelled + length * t;
      samples.push({ p: [line[i][0] + (line[i + 1][0] - line[i][0]) * t, line[i][1] + (line[i + 1][1] - line[i][1]) * t], w: 15.5 + 3.5 * Math.sin(d / 23 + phase) + 2 * Math.sin(d / 9 + phase2) });
    }
    travelled += length;
  }
  return samples;
};
const corridors = {
  W: wCorridors.map(smooth), N: nCorridors.map(smooth),
  E: wCorridors.map(mirrorAll).map(smooth), S: nCorridors.map(mirrorAll).map(smooth)
};

const pitTip = (pit) => [pit.c[0] + Math.cos(pit.dir) * (pit.r + pit.reach), pit.c[1] + Math.sin(pit.dir) * (pit.r + pit.reach)];
const inPitClearing = (p, pit, pad) => {
  const d = dist(p, pit.c);
  if (d < pit.r + 1 + pad) return true;
  // the open half: everything in front of the pit stays clear
  const front = (p[0] - pit.c[0]) * Math.cos(pit.dir) + (p[1] - pit.c[1]) * Math.sin(pit.dir);
  if (front > 0 && d < pit.r + 15 + pad) return true;
  return distSeg(p, pit.c, pitTip(pit)) < pit.r * 0.72 + pad;
};

const blocked = (p, quad, pad) => {
  if (dist(p, blueCorner) < BASE_R + 10 + pad || dist(p, redCorner) < BASE_R + 10 + pad) return true;
  if (laneLines.some((line) => distLine(p, line) < 30 + pad)) return true;
  if (distLine(p, riverLine) < 41 + pad) return true;
  if ([...pits[quad], ...epicPits[quad]].some((pit) => inPitClearing(p, pit, pad))) return true;
  return corridors[quad].some((samples) => samples.some((s) => dist(p, s.p) < s.w + pad));
};
const scatter = (quad, count, pad, minGap, taken = []) => {
  const poly = quads[quad], placed = [];
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  let tries = 0;
  while (placed.length < count && tries++ < count * 70) {
    const p = [rr(Math.min(...xs), Math.max(...xs)), rr(Math.min(...ys), Math.max(...ys))];
    if (!inPoly(p, poly) || (pad !== null && blocked(p, quad, pad))) continue;
    if (placed.some((q) => dist(p, q) < minGap) || taken.some((q) => dist(p, q) < minGap)) continue;
    placed.push(p);
  }
  return placed;
};
// trees or rocks hugging the back half of a pit, so it is only open on one side
const backWall = (pit, spacing, offset) => {
  const radius = pit.r + offset, span = deg(172), count = Math.ceil((radius * span) / spacing);
  return Array.from({ length: count + 1 }, (_, i) => {
    const a = pit.dir + Math.PI - span / 2 + (span * i) / count, rad = radius + rr(-2, 3);
    return [pit.c[0] + Math.cos(a) * rad, pit.c[1] + Math.sin(a) * rad];
  });
};
const poly = (points) => points.map((p) => `${f(p[0])},${f(p[1])}`).join(" ");
const ngon = ([cx, cy], r, sides, rot = 0, jitter = 0) =>
  Array.from({ length: sides }, (_, i) => {
    const a = rot + (i / sides) * Math.PI * 2, rad = r * (1 + (jitter ? rr(-jitter, jitter) : 0));
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  });

// ---------- decoration ----------
const GREENS = ["#1f4a2a", "#245832", "#2c6a3a", "#1a3f24", "#2f7340"];
const DEEP = ["#12301b", "#163a20", "#0f2916"];
const canopy = (p, r) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${pick(DEEP)}"/>`;
const crown = (p, r) =>
  `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${pick(GREENS)}" stroke="#0e2414" stroke-width="1"/>` +
  `<circle cx="${f(p[0] - r * 0.28)}" cy="${f(p[1] - r * 0.3)}" r="${f(r * 0.42)}" fill="#4f9a55" opacity="0.5"/>`;
const jungleDecor = (quad) => {
  let s = "";
  // forest floor: tufts of grass and moss, visible only where no tree grows
  scatter(quad, 420, null, 9).forEach((p) => { s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(rr(1.5, 3.2))}" fill="${pick(["#6c7438", "#4c5a2a", "#7a7c44"])}" opacity="0.7"/>`; });
  const walls = pits[quad].flatMap((pit) => backWall(pit, 13, 11));
  // dense canopy first (darker, bigger), then lighter crowns on top
  scatter(quad, 330, 3, 12).forEach((p) => { s += canopy(p, rr(11, 18)); });
  walls.forEach((p) => { s += canopy(p, rr(12, 15)); });
  scatter(quad, 430, 0, 9.5, walls).forEach((p) => { s += crown(p, rr(6.5, 12.5)); });
  walls.forEach((p) => { s += crown(p, rr(8.5, 11.5)); });
  // overgrown ruins: small broken stone blocks between the trees
  scatter(quad, 9, 2, 60).forEach((p) => {
    const size = rr(5, 8);
    s += `<rect x="${f(p[0] - size / 2)}" y="${f(p[1] - size / 2)}" width="${f(size)}" height="${f(size)}" fill="#7d8474" stroke="#2b3328" stroke-width="1" transform="rotate(${f(rr(0, 90))} ${f(p[0])} ${f(p[1])})"/>`;
  });
  return s;
};
const ROCKS = ["#7b7b78", "#8d8c88", "#66665f", "#9a9891"];
const rock = (p, r) => {
  const shape = ngon(p, r, Math.floor(rr(5, 8)), rr(0, 6), 0.26);
  return `<polygon points="${poly(shape.map(([x, y]) => [x + 2, y + 3]))}" fill="#3d2f1a" opacity="0.55"/>` +
    `<polygon points="${poly(shape)}" fill="${pick(ROCKS)}" stroke="#3f3d38" stroke-width="1"/>` +
    `<polygon points="${poly(ngon([p[0] - r * 0.2, p[1] - r * 0.25], r * 0.45, 5, rr(0, 6), 0.2))}" fill="#b9b6ad" opacity="0.55"/>`;
};
const aridDecor = (quad) => {
  let s = "";
  // dune ripples over the whole sand floor
  scatter(quad, 150, null, 18).forEach((p) => {
    const w = rr(12, 26), a = rr(-0.5, 0.5);
    const x1 = p[0] - Math.cos(a) * w, y1 = p[1] - Math.sin(a) * w, x2 = p[0] + Math.cos(a) * w, y2 = p[1] + Math.sin(a) * w;
    s += `<path d="M${f(x1)} ${f(y1)}Q${f(p[0])} ${f(p[1] - rr(5, 10))} ${f(x2)} ${f(y2)}" fill="none" stroke="#e3c98e" stroke-width="1.5" opacity="0.6"/>`;
  });
  const allPits = [...pits[quad], ...epicPits[quad]];
  const walls = allPits.flatMap((pit) => backWall(pit, 15, 12));
  // rocky plateaus (darker ground) with grey outcrops on top: the walls of the desert
  scatter(quad, 300, 3, 13).forEach((p) => { s += `<polygon points="${poly(ngon(p, rr(12, 19), 7, rr(0, 6), 0.2))}" fill="${pick(["#7d6238", "#866a3d", "#745a33"])}"/>`; });
  walls.forEach((p) => { s += `<polygon points="${poly(ngon(p, rr(13, 16), 7, rr(0, 6), 0.15))}" fill="#745a33"/>`; });
  scatter(quad, 270, 1, 13.5, walls).forEach((p) => { s += rock(p, rr(7, 14)); });
  walls.forEach((p) => { s += rock(p, rr(9.5, 13)); });
  // dry shrubs and toppled columns
  scatter(quad, 40, 2, 20).forEach((p) => { s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(rr(2.5, 4))}" fill="#7c7a3a" opacity="0.85"/>`; });
  scatter(quad, 8, 2, 70).forEach((p) => {
    s += `<rect x="${f(p[0] - 9)}" y="${f(p[1] - 2.5)}" width="18" height="5" rx="2" fill="#cfc4a6" stroke="#5d5238" stroke-width="1" transform="rotate(${f(rr(0, 180))} ${f(p[0])} ${f(p[1])})"/>`;
  });
  // standing stones crown the back of the two river pits
  epicPits[quad].forEach((pit) => {
    [-58, -29, 0, 29, 58].forEach((offset) => {
      const a = pit.dir + Math.PI + deg(offset), x = pit.c[0] + Math.cos(a) * (pit.r + 9), y = pit.c[1] + Math.sin(a) * (pit.r + 9);
      s += `<polygon points="${f(x)},${f(y - 7)} ${f(x + 5)},${f(y)} ${f(x)},${f(y + 7)} ${f(x - 5)},${f(y)}" fill="#24212b" stroke="#c8aa6e" stroke-width="1.2"/>`;
    });
  });
  return s;
};

// the hollow itself: a soft shadow on the ground, with no edge, so it never reads as a platform
const pitHollow = (pit) =>
  `<circle cx="${pit.c[0]}" cy="${pit.c[1]}" r="${pit.r + 2}" fill="url(#${pit.epic || "pit"})"/>`;

// ---------- structures ----------
const TEAM = { blue: "#4aa8ff", red: "#ee4b4b" };
const tower = ([x, y], team) =>
  `<g transform="translate(${x} ${y})"><polygon points="0,-13 13,0 0,13 -13,0" fill="#0e0d0b" stroke="#000" stroke-width="3" opacity="0.6"/>` +
  `<polygon points="0,-11 11,0 0,11 -11,0" fill="#1c1a16" stroke="#d9bd7c" stroke-width="1.6"/>` +
  `<circle r="4.6" fill="${TEAM[team]}"/><circle r="4.6" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.6"/></g>`;
const inhibitor = ([x, y], team) =>
  `<g transform="translate(${x} ${y})"><circle r="10" fill="#14120f" stroke="#000" stroke-width="2" opacity="0.7"/>` +
  `<circle r="8" fill="#1c1a16" stroke="${TEAM[team]}" stroke-width="2.6"/><circle r="2.6" fill="#d9bd7c"/></g>`;
const nexus = ([x, y], team) =>
  `<g transform="translate(${x} ${y})"><circle r="27" fill="none" stroke="${TEAM[team]}" stroke-width="1.5" opacity="0.55"/>` +
  `<polygon points="${poly(Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 11 : 22; return [Math.cos(a) * r, Math.sin(a) * r]; }))}" fill="#1c1a16" stroke="#d9bd7c" stroke-width="1.8"/>` +
  `<circle r="8" fill="${TEAM[team]}"/><circle r="8" fill="none" stroke="#fff" stroke-width="1" opacity="0.7"/></g>`;

const blueTowers = [[90, 330], [90, 560], [90, 716], [670, 910], [440, 910], [284, 910], [420, 580], [340, 660], [245, 755], [150, 822], [178, 850]];
const blueInhibs = [[90, 782], [218, 910], [203, 797]];
const blueNexus = [116, 884];

// ---------- svg ----------
const base = (corner, team, d) =>
  `<path d="${d}" fill="#6a6252"/><path d="${d}" fill="url(#${team}Glow)"/>` +
  `<circle cx="${corner[0]}" cy="${corner[1]}" r="170" fill="none" stroke="#2f2b24" stroke-width="2" stroke-dasharray="10 7"/>` +
  `<circle cx="${corner[0]}" cy="${corner[1]}" r="105" fill="none" stroke="#2f2b24" stroke-width="2"/>`;
const baseWall = (d) =>
  `<path d="${d}" fill="none" stroke="#1d1b17" stroke-width="15"/><path d="${d}" fill="none" stroke="#7f7867" stroke-width="9"/>` +
  `<path d="${d}" fill="none" stroke="#c8aa6e" stroke-width="1.4" stroke-dasharray="14 6"/>`;
const blueArc = "M60 685A255 255 0 0 1 315 940", redArc = "M940 315A255 255 0 0 1 685 60";
const hollowStops = (inner, outer) =>
  `<stop offset="0" stop-color="${inner}" stop-opacity="0.92"/><stop offset="0.55" stop-color="${inner}" stop-opacity="0.8"/><stop offset="0.85" stop-color="${outer}" stop-opacity="0.45"/><stop offset="1" stop-color="${outer}" stop-opacity="0"/>`;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="mm-title">
<title id="mm-title">Sanctus Caelum main mode minimap</title>
<defs>
<clipPath id="field"><rect x="60" y="60" width="880" height="880" rx="14"/></clipPath>
<radialGradient id="pit">${hollowStops("#060605", "#1d1a14")}</radialGradient>
<radialGradient id="pitElder">${hollowStops("#0b0612", "#2e1f45")}</radialGradient>
<radialGradient id="pitBijuu">${hollowStops("#100604", "#4a2410")}</radialGradient>
<radialGradient id="blueGlow" cx="60" cy="940" r="255" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2f7fd0" stop-opacity="0.75"/><stop offset="1" stop-color="#2f7fd0" stop-opacity="0.08"/></radialGradient>
<radialGradient id="redGlow" cx="940" cy="60" r="255" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#c93a3a" stop-opacity="0.75"/><stop offset="1" stop-color="#c93a3a" stop-opacity="0.08"/></radialGradient>
<radialGradient id="vignette" cx="0.5" cy="0.5" r="0.72"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>
<linearGradient id="water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a8ea6"/><stop offset="1" stop-color="#1f6f93"/></linearGradient>
</defs>
<rect width="1000" height="1000" fill="#0b0a09"/>
<g clip-path="url(#field)">
<polygon points="${poly(quads.N)}" fill="#cfae6f"/><polygon points="${poly(quads.S)}" fill="#cfae6f"/>
<polygon points="${poly(quads.W)}" fill="#5a5a30"/><polygon points="${poly(quads.E)}" fill="#5a5a30"/>
`;
quadKeys.forEach((q) => { svg += `<g>${biome[q] === "jungle" ? jungleDecor(q) : aridDecor(q)}</g>\n`; });
quadKeys.forEach((q) => [...pits[q], ...epicPits[q]].forEach((pit) => { svg += pitHollow(pit); }));

svg += `
<path d="${riverPath}" fill="none" stroke="#0f2f3b" stroke-width="70" stroke-linecap="round"/>
<path d="${riverPath}" fill="none" stroke="url(#water)" stroke-width="58" stroke-linecap="round"/>
<path d="${riverPath}" fill="none" stroke="#7fd3e0" stroke-width="2" stroke-dasharray="18 26" opacity="0.5" transform="translate(-9 9)"/>
<path d="${riverPath}" fill="none" stroke="#7fd3e0" stroke-width="2" stroke-dasharray="12 30" stroke-dashoffset="20" opacity="0.4" transform="translate(9 -9)"/>
`;

// bases
svg += base(blueCorner, "blue", `${blueArc}L60 940Z`) + base(redCorner, "red", `${redArc}L940 60Z`) + baseWall(blueArc) + baseWall(redArc) + "\n";

// lanes: worn stone roads
lanes.forEach((d) => { svg += `<path d="${d}" fill="none" stroke="#2c261b" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>`; });
lanes.forEach((d) => { svg += `<path d="${d}" fill="none" stroke="#9c8a66" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>`; });
lanes.forEach((d) => { svg += `<path d="${d}" fill="none" stroke="#b9a67d" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#7d6d4d" stroke-width="30" stroke-dasharray="1.5 15" opacity="0.7"/>`; });
// ford where the mid lane crosses the river
svg += `<path d="M472 528L528 472" fill="none" stroke="#5fb6c9" stroke-width="30" opacity="0.55"/>\n`;

// structures
blueTowers.forEach((p) => { svg += tower(p, "blue") + tower(mirror(p), "red"); });
blueInhibs.forEach((p) => { svg += inhibitor(p, "blue") + inhibitor(mirror(p), "red"); });
svg += nexus(blueNexus, "blue") + nexus(mirror(blueNexus), "red");

svg += `
<rect x="60" y="60" width="880" height="880" fill="url(#vignette)"/>
</g>
<rect x="60" y="60" width="880" height="880" rx="14" fill="none" stroke="#000" stroke-width="6"/>
<rect x="54" y="54" width="892" height="892" rx="18" fill="none" stroke="#c8aa6e" stroke-width="3"/>
<rect x="38" y="38" width="924" height="924" rx="6" fill="none" stroke="#856b34" stroke-width="1.5"/>
<rect x="28" y="28" width="944" height="944" rx="4" fill="none" stroke="#c8aa6e" stroke-width="1" stroke-dasharray="2 8"/>
${[[46, 46], [954, 46], [46, 954], [954, 954]].map(([x, y]) => `<g transform="translate(${x} ${y})"><polygon points="0,-17 17,0 0,17 -17,0" fill="#0b0a09" stroke="#c8aa6e" stroke-width="2"/><polygon points="0,-8 8,0 0,8 -8,0" fill="#c8aa6e"/></g>`).join("")}
${[[500, 46], [500, 954], [46, 500], [954, 500]].map(([x, y]) => `<polygon points="${x},${y - 9} ${x + 9},${y} ${x},${y + 9} ${x - 9},${y}" fill="#0b0a09" stroke="#c8aa6e" stroke-width="1.5"/>`).join("")}
</svg>
`;
fs.writeFileSync(out, svg);
console.log("written", out, (svg.length / 1024).toFixed(0) + " KB");
