import React from "react";
import { useNavigate } from "react-router-dom";

const ChampionCard = ({ champion }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/champion/${champion.id}`);
  };

  return (
    <div className="champion-card" onClick={handleClick}>
      <div className="champion-splash">
        <img 
          src={champion.render} 
          alt={champion.fullName}
          style={{ border: 'none' }}
        />
      </div>
      <div className="champion-meta">
        <h3 className="champion-name">{champion.fullName}</h3>
        <p className="champion-anime">{champion.anime}</p>
      </div>
    </div>
  );
};

export default ChampionCard;