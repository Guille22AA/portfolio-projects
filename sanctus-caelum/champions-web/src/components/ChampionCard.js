import React from "react";

const ChampionCard = ({ champion }) => {
  // small click handler, just logs which champion was pressed
  const handleClick = () => {
    console.log(`Clicked on ${champion.fullName}`);
  };

  // this card is basically the mini profile for one champion
  // it shows the image and the basic info under it
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