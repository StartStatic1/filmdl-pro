import React from 'react';
import { Download, Play, Star } from 'lucide-react';

const MovieCard = ({ movie, onSelect, onDownload }) => {
  const poster = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div className="card" onClick={onSelect}>
      <div className="card-poster">
        {movie.poster_path ? (
          <img src={poster} alt={title} />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1'
          }}>
            Sem imagem
          </div>
        )}
        
        <div className="card-overlay">
          <div className="card-actions">
            <button
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              title="Ver detalhes"
            >
              <Play size={20} fill="currentColor" />
            </button>
            <button
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              title="Baixar"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="card-info">
        <h4 className="card-title" title={title}>
          {title}
        </h4>
        
        <div className="card-meta">
          <span>{year}</span>
          {rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={12} fill="currentColor" color="#f59e0b" />
              <span>{rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
