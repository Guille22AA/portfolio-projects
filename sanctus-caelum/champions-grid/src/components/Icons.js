import React from "react";

// every icon of the site is drawn here as SVG (24x24 grid), so no emojis or image files are needed

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

const GLYPHS = {
  // stats and rating wheel
  damage: <path {...stroke} d="M20 4L10 14M20 4h-4M20 4v4M7 11l6 6M5 19l4-4" />,
  toughness: <path {...stroke} d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />,
  control: (
    <path
      {...stroke}
      d="M12 12a1.5 1.5 0 0 1 1.5 1.5 3 3 0 0 1-3 3A4.5 4.5 0 0 1 6 12a6 6 0 0 1 6-6 7.5 7.5 0 0 1 7.5 7.5"
    />
  ),
  mobility: <path {...stroke} d="M5 6l6 6-6 6M13 6l6 6-6 6" />,
  utility: <path {...stroke} d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />,
  health: <path {...stroke} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  resource: <path {...stroke} d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  magicResist: (
    <path {...stroke} d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  ),
  crit: <path {...stroke} d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />,
  range: <path {...stroke} d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 2v5M12 17v5M2 12h5M17 12h5" />,
  attackSpeed: <path {...stroke} d="M3 8h8M3 12h12M3 16h8M15 7l5 5-5 5" />,

  // roles
  Top: (
    <g fill="currentColor">
      <path d="M4 4h13l-3 3H7v7l-3 3z" />
      <path d="M20 7v13H7l3-3h7v-7z" opacity="0.3" />
      <path d="M10 10h4v4h-4z" opacity="0.3" />
    </g>
  ),
  Bot: (
    <g fill="currentColor">
      <path d="M4 4h13l-3 3H7v7l-3 3z" opacity="0.3" />
      <path d="M20 7v13H7l3-3h7v-7z" />
      <path d="M10 10h4v4h-4z" opacity="0.3" />
    </g>
  ),
  Mid: (
    <g fill="currentColor">
      <path d="M17 4h3v3L7 20H4v-3z" />
      <path d="M4 4h9l-3 3H7v3l-3 3z" opacity="0.3" />
      <path d="M20 20h-9l3-3h3v-3l3-3z" opacity="0.3" />
    </g>
  ),
  Jungle: (
    <path
      fill="currentColor"
      d="M12 21c-1-5-4-7-6-9 3 .5 4 2 5 4-.5-5-1.5-8-3-11 4 3 5.5 7 5 11 1-3 2-4.5 5-6-1.5 3-5 5-6 11z"
    />
  ),
  Support: (
    <path
      fill="currentColor"
      d="M12 8l2 2-2 10-2-10zM3 7h6l1 2-3 3zM21 7h-6l-1 2 3 3zM10.5 4h3L12 7z"
    />
  ),

  // currencies
  coin: (
    <g>
      <circle cx="12" cy="12" r="9" fill="#d9a531" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="#f6dc8b" strokeWidth="1.5" />
      <path d="M12 8l3 8M12 8l-3 8M10.2 13.5h3.6" fill="none" stroke="#7a5a12" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
  shard: (
    <g>
      <path d="M12 2l7 8-7 12-7-12z" fill="#8e4fd8" />
      <path d="M12 2l3 8-3 12-3-12z" fill="#b98cf0" />
      <path d="M5 10h14" fill="none" stroke="#e3d0ff" strokeWidth="1" />
    </g>
  ),

  // ability glyphs
  dash: <path {...stroke} d="M5 6l6 6-6 6M13 6l6 6-6 6" />,
  shield: <path {...stroke} d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />,
  heal: <path {...stroke} strokeWidth="3" d="M12 5v14M5 12h14" />,
  summon: (
    <path {...stroke} d="M6 20v-9a6 6 0 0 1 12 0v9l-3-2-3 2-3-2zM9.5 11h.01M14.5 11h.01" />
  ),
  transform: (
    <path {...stroke} d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />
  ),
  mark: <path {...stroke} d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 2v5M12 17v5M2 12h5M17 12h5" />,
  area: (
    <path {...stroke} d="M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0M8.5 12a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0" />
  ),
  projectile: <path {...stroke} d="M4 20L18 6M11 5h8v8" />,
  strike: <path {...stroke} d="M20 4L10 14M20 4h-4M20 4v4M7 11l6 6M5 19l4-4" />,
  aura: <path {...stroke} d="M12 3l9 9-9 9-9-9zM12 9.5l2.5 2.5-2.5 2.5L9.5 12z" />,

  // interface
  chevronLeft: <path {...stroke} d="M15 5l-7 7 7 7" />,
  chevronRight: <path {...stroke} d="M9 5l7 7-7 7" />,
  close: <path {...stroke} d="M6 6l12 12M18 6L6 18" />,
  brush: <path {...stroke} d="M20 4l-9 9M9 13a3 3 0 0 0-3 3c0 2-2 3-3 3 4 1 8 0 8-4a2 2 0 0 0-2-2z" />,
  compass: <path {...stroke} d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z" />,
  scroll: <path {...stroke} d="M7 4h11v13a3 3 0 0 1-3 3H6a2 2 0 0 1-2-2v-1h10M10 9h5M10 13h5" />,
  quote: <path {...stroke} d="M5 16c0-5 1-7 5-8M5 16h4v-4H5.5M14 16c0-5 1-7 5-8M14 16h4v-4h-3.5" />
};

const Icon = ({ name, size = 16, className = "", title }) => (
  <svg
    className={`icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    role={title ? "img" : "presentation"}
    aria-hidden={title ? undefined : true}
  >
    {title && <title>{title}</title>}
    {GLYPHS[name] || null}
  </svg>
);

// raw glyph, for drawing an icon inside another SVG (the rating wheel)
export const glyph = (name) => GLYPHS[name] || null;

export default Icon;
