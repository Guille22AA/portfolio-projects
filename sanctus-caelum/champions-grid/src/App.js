import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ChampionGrid from "./components/ChampionGrid";
import Footer from "./components/Footer";
import SuggestChampion from './components/SuggestChampion';
import ContactForm from './components/ContactForm';
import ChampionDetail from './components/ChampionDetail';
import { championsData } from "./data/championsData";
import "./App.css";

function ChampionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    anime: [],
    class: [],
    role: [],
    difficulty: []
  });

  return (
    <>
      <SearchBar onSearchChange={setSearchTerm} onFilterChange={setFilters} />
      <ChampionGrid champions={championsData} searchTerm={searchTerm} filters={filters} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<ChampionsPage />} />
          <Route path="/suggest" element={<SuggestChampion />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/champion/:slug" element={<ChampionDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;