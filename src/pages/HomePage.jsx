import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, TrendingUp, Clock } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const HomePage = ({ onNavigate, tmdbKey, recentDownloads, onDownload }) => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, topRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbKey}&language=pt-BR`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbKey}&language=pt-BR`)
        ]);

        const trendingData = await trendingRes.json();
        const topData = await topRes.json();

        setTrending(trendingData.results?.slice(0, 10) || []);
        setTopRated(topData.results?.slice(0, 10) || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tmdbKey]);

  return (
    <div className="home-page">
      <div className="hero">
        <h2>Baixe seus filmes e séries favoritos</h2>
        <p>Acesso rápido a conteúdo em alta qualidade. Sem complicações, sem limitações.</p>
        <div className="hero-cta">
          <button className="btn btn-primary">
            <Zap size={18} />
            Explorar Agora
          </button>
          <button className="btn btn-secondary">
            <TrendingUp size={18} />
            Ver em Destaque
          </button>
        </div>
      </div>

      {recentDownloads.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h3>
              <Clock size={20} />
              Últimos Downloads
            </h3>
            <a href="#view-all">Ver tudo →</a>
          </div>
          <div className="grid">
            {recentDownloads.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={() => onNavigate('detail', movie)}
                onDownload={() => onDownload(movie)}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && trending.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h3>
              <Zap size={20} />
              Em Tendência
            </h3>
            <a href="#view-all">Ver tudo →</a>
          </div>
          <div className="grid">
            {trending.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={() => onNavigate('detail', movie)}
                onDownload={() => onDownload(movie)}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && topRated.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h3>
              <TrendingUp size={20} />
              Melhor Avaliados
            </h3>
            <a href="#view-all">Ver tudo →</a>
          </div>
          <div className="grid">
            {topRated.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={() => onNavigate('detail', movie)}
                onDownload={() => onDownload(movie)}
              />
            ))}
          </div>
        </section>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#cbd5e1' }}>
          <p>Carregando conteúdo...</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
