import React from "react";
import { glyph } from "./Icons";

// the five axes go clockwise starting at the top
const AXES = ["damage", "toughness", "control", "mobility", "utility"];
const RINGS = [
  [20, 36],
  [40, 56],
  [60, 76]
];
const CENTER = 110;
const GAP = 5; // degrees left empty between two sectors

const point = (radius, degrees) => {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(radians), CENTER + radius * Math.sin(radians)];
};

// ring slice between two angles and two radii
const slice = (inner, outer, from, to) => {
  const [x1, y1] = point(outer, from);
  const [x2, y2] = point(outer, to);
  const [x3, y3] = point(inner, to);
  const [x4, y4] = point(inner, from);
  return `M${x1} ${y1}A${outer} ${outer} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${inner} ${inner} 0 0 0 ${x4} ${y4}Z`;
};

const RatingWheel = ({ ratings }) => (
  <svg className="rating-wheel" viewBox="0 0 220 220" role="img" aria-label="Champion ratings">
    <circle cx={CENTER} cy={CENTER} r="12" className="rating-wheel-core" />
    {AXES.map((axis, index) => {
      const value = ratings[axis] || 0;
      const middle = index * 72;
      const from = middle - 36 + GAP / 2;
      const to = middle + 36 - GAP / 2;
      const [iconX, iconY] = point(96, middle);

      return (
        <g key={axis}>
          <title>{`${axis[0].toUpperCase()}${axis.slice(1)}: ${value} / 3`}</title>
          {RINGS.map(([inner, outer], ring) => (
            <path
              key={ring}
              d={slice(inner, outer, from, to)}
              className={ring < value ? "rating-wheel-on" : "rating-wheel-off"}
            />
          ))}
          <svg x={iconX - 9} y={iconY - 9} width="18" height="18" viewBox="0 0 24 24" className="rating-wheel-icon">
            {glyph(axis)}
          </svg>
        </g>
      );
    })}
  </svg>
);

export default RatingWheel;
