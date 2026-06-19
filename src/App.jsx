import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, Film, Search, Tv } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=pt-BR`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return fetchTrendingMovies();
    
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(search)}&language=pt-BR`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Copia o link HTTP para a área de transferência usando o título para a busca automática se necessário
  const handleCopyLink = (movie) => {
    const secureUrl = `${window.location.origin}/api/download?title=${encodeURIComponent(movie.title)}`;
    navigator.clipboard.writeText(secureUrl);
    setCopiedId(movie.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased">
      
      {/* Header Minimalista Premium */}
      <header className="border-b border-slate-800/60 bg-[#0e1322]/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Film className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FilmDL Pro
            </span>
          </div>
          
          {/* Caixa de busca compacta */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Buscar filme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131a2e] border border-slate-800 rounded-xl py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:border-cyan-500/50 transition-all text-slate-200 placeholder-slate-500"
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </header>

      {/* Conteúdo Centralizado e mais enxuto */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-cyan-500" />
            {search ? 'Resultados encontrados' : 'Filmes em Destaque'}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-500 bg-[#0e1322] rounded-2xl border border-slate-900">
            Nenhum título encontrado na nuvem.
          </div>
        ) : (
          /* Grid Compacto Estilo Premium */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.map((movie) => {
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop';

              return (
                <div key={movie.id} className="bg-[#0e1322] rounded-xl overflow-hidden border border-slate-900 hover:border-slate-800/80 transition-all flex flex-col group shadow-lg">
                  
                  {/* Poster do Filme */}
                  <div className="relative aspect-[2/3] bg-slate-950 overflow-hidden">
                    <img 
                      src={posterUrl} 
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1322] via-transparent to-transparent opacity-80" />
                    
                    {movie.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-slate-800">
                        ★ {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Informações embaixo do Poster */}
                  <div className="p-3 flex flex-col flex-grow justify-between bg-[#0e1322]">
                    <div className="mb-2.5">
                      <h3 className="font-bold text-xs text-slate-200 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'Streaming'}
                      </p>
                    </div>

                    {/* Botões de Ação Direta */}
                    <div className="space-y-1.5 mt-auto">
                      <a
                        href={`/api/download?title=${encodeURIComponent(movie.title)}`}
                        download
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md shadow-cyan-500/5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Direto
                      </a>

                      <button
                        onClick={() => handleCopyLink(movie)}
                        className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all ${
                          copiedId === movie.id 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800/80 border border-slate-800'
                        }`}
                      >
                        {copiedId === movie.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copiar Link
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}
