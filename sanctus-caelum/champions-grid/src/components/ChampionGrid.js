import React, { useMemo } from "react";
import ChampionCard from "./ChampionCard";
import "../styles/ChampionGrid.css";

const ChampionGrid = ({ champions, searchTerm, filters }) => {
  // quick check so the list updates only when needed
  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      // search by nickname, full name, or anime, just to keep it flexible
      const searchMatch =
      champion.nick.toLowerCase().includes(searchTerm.toLowerCase()) ||
      champion.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      champion.anime.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // if a selected option is not in the champion data, it gets skipped
      if (filters.anime.length > 0 && !filters.anime.includes(champion.anime)) {
        return false;
      }
      if (filters.class.length > 0 && !filters.class.includes(champion.class)) {
        return false;
      }
      if (filters.role.length > 0) {
        // roles are stored as an array, so we just need one match to keep it in the list
        const hasMatchingRole = champion.roles.some(role => filters.role.includes(role));
        if (!hasMatchingRole) return false;
      }
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(champion.difficulty)) {
        return false;
      }

      return true;
    });
  }, [champions, searchTerm, filters]);

  return (
    <section className="champions-section">
      <div className="champions-header">
      <div className="champions-title-wrapper">
        <div className="title-line left"></div>
          <img src="/iconos/sc_logo.png" alt="Sanctus Caelum" className="header-logo" />
          <h1 className="champions-title">CHAMPIONS</h1>
        <div className="title-line right"></div>
      </div>
        <p className="champions-subtitle">SELECT YOUR HERO</p>
      </div>

      {filteredChampions.length > 0 ? (
        // if the filtered array has something, we render the cards normally
        <div className="champions-list">
          {filteredChampions.map((champion) => (
            <ChampionCard key={champion.id} champion={champion} />
          ))}
        </div>
      ) : (
        // otherwise, just show the fallback message so the page doesn't look broken
        <div className="champions-empty">
          <p>No champions found matching your filters.</p>
        </div>
      )}
    </section>
  );
};

export default ChampionGrid;