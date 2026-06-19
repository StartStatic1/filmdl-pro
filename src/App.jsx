import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, Film, Tv, Search } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [customIds, setCustomIds] = useState({});

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const iptvHost = import.meta.env.VITE_IPTV_HOST;
  const iptvUser = import.meta.env.VITE_IPTV_USER;
  const iptvPass = import.meta.env.VITE_IPTV_PASS;

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
      console.error("Erro ao buscar filmes:", err);
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
      console.error("Erro na busca:", err);
    } finally {
      setLoading(false);
    }
  };

  // Retorna o link HTTP limpo caso queira apenas copiar para colar em apps de IPTV
  const generateIptvUrl = (movieId) => {
    const finalStreamId = customIds[movieId] || movieId;
    return `${iptvHost}/movie/${iptvUser}/${iptvPass}/${finalStreamId}.mp4`;
  };

  // Nova lógica de download usando nossa rota segura HTTPS do Vercel
  const getSecureDownloadUrl = (movieId) => {
    const finalStreamId = customIds[movieId] || movieId;
    return `/api/download?id=${finalStreamId}`;
  };

  const handleCopyLink = (movieId) => {
    const finalUrl = generateIptvUrl(movieId);
    navigator.clipboard.writeText(finalUrl);
    setCopiedId(movieId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCustomIdChange = (movieId, value) => {
    setCustomIds(prev => ({ ...prev, [movieId]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-900">
      
      {/* Cabeçalho */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-cyan-500 animate-pulse" />
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FilmDL Pro
            </span>
          </div>
          
          <form onSubmit={handleSearch} className="w-full sm:w-96 relative">
            <input
              type="text"
              placeholder="Buscar filme para gerar link..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-300">
            <Tv className="w-5 h-5 text-cyan-500" />
            {search ? `Resultados para: ${search}` : 'Filmes Populares Disponíveis'}
          </h2>
          <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700">
            Alvo: Download via HTTPS Bypass
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Nenhum filme encontrado. Tente outro termo de busca.
          </div>
        ) : (
          /* Grade de Filmes */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => {
              const hasPoster = movie.poster_path;
              const posterUrl = hasPoster 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';

              return (
                <div key={movie.id} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between shadow-xl">
                  
                  {/* Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                    <img 
                      src={posterUrl} 
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                  </div>

                  {/* Informações */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-base line-clamp-1 group-hover:text-cyan-400 transition-colors">
                        {movie.title}
                      </h3>
                      
                      {/* Campo para ajustar o ID do painel */}
                      <div className="mt-3">
                        <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">ID do Painel IPTV:</label>
                        <input 
                          type="text" 
                          placeholder={`Ex: 1289967`}
                          value={customIds[movie.id] || ''}
                          onChange={(e) => handleCustomIdChange(movie.id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-cyan-400 focus:outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-2 mt-auto">
                      
                      {/* Botão 1: Baixar Filme usando a rota segura HTTPS */}
                      <a
                        href={getSecureDownloadUrl(movie.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors shadow-lg shadow-cyan-500/10"
                      >
                        <Download className="w-4 h-4" />
                        Baixar Filme .MP4
                      </a>

                      {/* Botão 2: Copiar Link de Download Direto HTTP */}
                      <button
                        onClick={() => handleCopyLink(movie.id)}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium transition-all ${
                          copiedId === movie.id 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {copiedId === movie.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Link Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Link IPTV (HTTP)
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

      <footer className="border-t border-slate-800 mt-20 bg-slate-950/30 text-slate-500 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>FilmDL Pro — Sistema de download com criptografia e bypass de segurança ativo.</p>
        </div>
      </footer>

    </div>
  );
}
