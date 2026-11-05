import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ChampionGrid from "./components/ChampionGrid";
import Footer from "./components/Footer";
import { championsData } from "./data/championsData";
import "./App.css";

// the grid loads first; every other page is downloaded only when it is opened
const SuggestChampion = lazy(() => import('./components/SuggestChampion'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const ChampionDetail = lazy(() => import('./components/ChampionDetail'));

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
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<ChampionsPage />} />
            <Route path="/suggest" element={<SuggestChampion />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/champion/:slug" element={<ChampionDetail />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;