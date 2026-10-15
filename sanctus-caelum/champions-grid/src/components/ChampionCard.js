import React from "react";
import { Link } from "react-router-dom";

// a real link, so cards can be opened in a new tab and reached with the keyboard
const ChampionCard = ({ champion }) => (
  <Link className="champion-card" to={`/champion/${champion.slug}`}>
    <div className="champion-splash">
      <img
        src={champion.render}
        alt={champion.fullName}
        loading="lazy"
        decoding="async"
        width="270"
        height="335"
      />
    </div>
    <div className="champion-meta">
      <h3 className="champion-name">{champion.fullName}</h3>
      <p className="champion-anime">{champion.anime}</p>
    </div>
  </Link>
);

export default ChampionCard;
