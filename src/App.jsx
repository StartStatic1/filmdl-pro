import React, { useState, useEffect } from 'react';
import { Search, Download, Play, Star, Info, Volume2 } from 'lucide-react';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';
import './App.css';

const TMDB_API_KEY = '1c40bbe9a9f9e1e8a812d22c4c407d8f';
const DOWNLOAD_HOSTS = {
  host1: 'http://sventank.com:80',
  host2: 'http://x29.acxll.shop:80/movie/9119711526/9001391468'
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentDownloads, setRecentDownloads] = useState(() => {
    const saved = localStorage.getItem('recentDownloads');
    return saved ? JSON.parse(saved) : [];
  });

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedMovie(data);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setCurrentPage('search');
    
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const handleDownload = (movie) => {
    const newDownload = {
      id: movie.id,
      title: movie.title || movie.name,
      poster: movie.poster_path,
      timestamp: new Date().toISOString()
    };
    
    const updated = [newDownload, ...recentDownloads.slice(0, 9)];
    setRecentDownloads(updated);
    localStorage.setItem('recentDownloads', JSON.stringify(updated));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Download size={28} />
            <h1>FilmDL Pro</h1>
          </div>
          
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar filmes, séries..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          <nav className="nav">
            <button 
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => handleNavigate('home')}
            >
              Início
            </button>
            <button 
              className={currentPage === 'search' ? 'active' : ''}
              onClick={() => handleNavigate('search')}
            >
              Explorar
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={handleNavigate}
            tmdbKey={TMDB_API_KEY}
            recentDownloads={recentDownloads}
            onDownload={handleDownload}
          />
        )}
        
        {currentPage === 'search' && (
          <SearchPage 
            results={searchResults}
            onNavigate={handleNavigate}
            onDownload={handleDownload}
          />
        )}
        
        {currentPage === 'detail' && selectedMovie && (
          <DetailPage 
            movie={selectedMovie}
            onBack={() => handleNavigate('home')}
            onDownload={handleDownload}
            hosts={DOWNLOAD_HOSTS}
            tmdbKey={TMDB_API_KEY}
          />
        )}
      </main>
    </div>
  );
}

export default App;
