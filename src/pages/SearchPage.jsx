import React from 'react';
import { Search } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const SearchPage = ({ results, onNavigate, onDownload }) => {
  return (
    <div className="search-results">
      <div className="results-header">
        <h2>Resultados da Busca</h2>
        <p className="results-count">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid">
          {results.map(item => (
            <MovieCard
              key={item.id}
              movie={item}
              onSelect={() => onNavigate('detail', item)}
              onDownload={() => onDownload(item)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <Search size={48} />
          <h3>Nenhum resultado encontrado</h3>
          <p>Tente buscar outro título</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
