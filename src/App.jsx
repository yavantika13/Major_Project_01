
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './Pages/HomePage';
import ExplorePage from './Pages/ExplorePage';
import AuthPage from './Pages/AuthPage';
import HeritageDetails from "./Pages/HeritageDetails";
import MyFavourites from "./Pages/MyFavourites";
import './index.css';

function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
    </>
  );
}

function Explore() {
  return (
    <>
      <Navbar />
      <ExplorePage />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/place/:id" element={<HeritageDetails />} />
          <Route path="/favorites" element={<MyFavourites />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
