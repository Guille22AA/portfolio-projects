import React, { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ChampionGrid from "./components/ChampionGrid";
import Footer from "./components/Footer";
import SuggestChampion from './components/SuggestChampion';
import { championsData } from "./data/championsData";
import "./App.css";
import ContactForm from './components/ContactForm';

function App() {
  // just stores what the user typed in the search box
  const [searchTerm, setSearchTerm] = useState("");

  // all the filter options are grouped here so the grid can narrow the results
  const [filters, setFilters] = useState({
    anime: [],
    class: [],
    role: [],
    difficulty: []
  });

  // this controls which section of the app is being shown right now
  const [page, setPage] = useState('champions');

  return (
    <div className="app-container">
      {/* header is used to move between the main pages */}
      <Header setPage={setPage} />

      {page === 'champions' && (
        <>
          {/* search and filters only matter for the champions view */}
          <SearchBar onSearchChange={setSearchTerm} onFilterChange={setFilters} />
          {/* the grid gets the full data and the current search state */}
          <ChampionGrid champions={championsData} searchTerm={searchTerm} filters={filters} />
        </>
      )}

      {page === 'suggest' && <SuggestChampion setPage={setPage} />}

      {page === 'contact' && <ContactForm setPage={setPage} />}

      {/* footer also has access to the page switcher */}
      <Footer setPage={setPage} />
    </div>
  );
}

export default App;