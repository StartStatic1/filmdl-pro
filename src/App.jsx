import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, Film, Tv, Search, ExternalLink } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Puxa as variáveis de ambiente do Vite
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const iptvHost = import.meta.env.VITE_IPTV_HOST;
  const iptvUser = import.meta.env.VITE_IPTV_USER;
  const iptvPass = import.meta.env.VITE_IPTV_PASS;

  // Busca filmes em alta (Tendências) ao carregar a página
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

  // FUNÇÃO MESTRE: Monta o link final usando o ID do filme (simulando o stream_id do IPTV)
  const generateIptvUrl = (movieId) => {
    // Como os IDs do TMDB são numéricos (ex: 1289967), usamos eles como o stream_id do arquivo .mp4
    return `${iptvHost}/movie/${iptvUser}/${iptvPass}/${movieId}.mp4`;
  };

  const handleCopyLink = (movieId) => {
    const finalUrl = generateIptvUrl(movieId);
    navigator.clipboard.writeText(finalUrl);
    setCopiedId(movieId);
    setTimeout(() => setCopiedId(null), 2000); // Reseta o ícone de copiado após 2 segundos
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
          
          {/* Barra de Busca */}
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
            Formato: MP4 / IPTV Player Ready
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
                  
                  {/* Container da Imagem */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                    <img 
                      src={posterUrl} 
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                    
                    {/* Nota do Filme */}
                    {movie.vote_average > 0 && (
                      <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur text-amber-400 text-xs font-bold px-2 py-1 rounded-md border border-slate-700">
                        ★ {movie.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Informações e Botões */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-base line-clamp-1 group-hover:text-cyan-400 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {movie.overview || "Sem sinopse disponível em português."}
                      </p>
                    </div>

                    {/* Ações de Download / IPTV */}
                    <div className="flex flex-col gap-2 mt-auto">
                      
                      {/* Botão Principal: Copiar para Player IPTV */}
                      <button
                        onClick={() => handleCopyLink(movie.id)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                          copiedId === movie.id 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50'
                        }`}
                      >
                        {copiedId === movie.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiado para o Player!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar Link IPTV
                          </>
                        )}
                      </button>

                      {/* Botão Secundário: Download Direto no Navegador */}
                      <a
                        href={generateIptvUrl(movie.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Direto .mp4
                      </a>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Rodapé explicativo */}
      <footer className="border-t border-slate-800 mt-20 bg-slate-950/30 text-slate-500 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col gap-2">
          <p>FilmDL Pro — Desenvolvido com foco em alta performance mobile.</p>
          <p className="text-slate-600">Os links gerados utilizam redirecionamento dinâmico compatível com XCIPTV, TiviMate e Smartes Player.</p>
        </div>
      </footer>

    </div>
  );
}
