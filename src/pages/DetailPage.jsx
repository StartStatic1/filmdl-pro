import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Star, Clock, AlertCircle, Check } from 'lucide-react';
import DownloadModal from '../components/DownloadModal';

const DetailPage = ({ movie, onBack, onDownload, hosts, tmdbKey }) => {
  const [details, setDetails] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const type = movie.media_type || (movie.name ? 'tv' : 'movie');
        const endpoint = type === 'tv' ? 'tv' : 'movie';
        
        const response = await fetch(
          `https://api.themoviedb.org/3/${endpoint}/${movie.id}?api_key=${tmdbKey}&language=pt-BR`
        );
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id, tmdbKey]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#cbd5e1' }}>
        <p>Carregando informações...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <p>Erro ao carregar informações do filme</p>
        <button onClick={onBack} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          ← Voltar
        </button>
      </div>
    );
  }

  const title = details.title || details.name;
  const year = (details.release_date || details.first_air_date || '').split('-')[0];
  const rating = details.vote_average?.toFixed(1);
  const backdrop = `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w342${details.poster_path}`;
  const genres = details.genres?.map(g => g.name).join(', ') || 'Não disponível';
  const runtime = details.runtime ? `${details.runtime} min` : (details.episode_run_time?.[0] ? `${details.episode_run_time[0]} min` : 'N/A');

  const qualities = [
    { name: '480p', size: '400-600 MB', bitrate: 'SD' },
    { name: '720p', size: '900-1.2 GB', bitrate: 'HD' },
    { name: '1080p', size: '2-3 GB', bitrate: 'Full HD' },
    { name: '4K', size: '4-6 GB', bitrate: '4K UHD' }
  ];

  const generateDownloadLink = (quality) => {
    const id = movie.id;
    const type = movie.media_type || (movie.name ? 'tv' : 'movie');
    
    // Simula diferentes qualidades
    const qualityParams = {
      '480p': 'sd',
      '720p': 'hd',
      '1080p': 'fhd',
      '4K': '4k'
    };

    const link = `${hosts.host2}/${qualityParams[quality]}_${id}.mp4`;
    return link;
  };

  const handleDownloadClick = (quality) => {
    const link = generateDownloadLink(quality);
    onDownload(movie);
    
    // Copia o link para clipboard
    navigator.clipboard.writeText(link);
    setCopiedLink(quality);
    
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="detail-page">
      <button 
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid #334155',
          color: '#f8fafc',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backdropFilter: 'blur(10px)'
        }}
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div className="detail-poster">
        <img src={poster} alt={title} />
      </div>

      <div className="detail-content">
        <div className="detail-header">
          <h1 className="detail-title">{title}</h1>
          
          <div className="detail-meta">
            <div className="meta-item">
              <span>{year}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{runtime}</span>
            </div>
            <div className="meta-item">
              <span>{genres}</span>
            </div>
          </div>

          {rating && (
            <div className="detail-rating">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(rating / 2) ? 'currentColor' : 'none'}
                    color={i < Math.round(rating / 2) ? '#f59e0b' : '#cbd5e1'}
                  />
                ))}
              </div>
              <span className="rating-value">{rating}/10</span>
            </div>
          )}
        </div>

        {details.overview && (
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Sinopse</h3>
            <p className="detail-description">{details.overview}</p>
          </div>
        )}

        <div className="download-section">
          <div className="download-header">
            <Download size={20} />
            Escolha a qualidade e baixe
          </div>

          <div className="qualities">
            {qualities.map(quality => (
              <button
                key={quality.name}
                className="quality-btn"
                onClick={() => handleDownloadClick(quality.name)}
              >
                {copiedLink === quality.name ? (
                  <>
                    <Check size={16} style={{ color: '#10b981' }} />
                    <span>Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <strong>{quality.name}</strong>
                    <span className="quality-size">{quality.size}</span>
                    <span className="quality-size">{quality.bitrate}</span>
                  </>
                )}
              </button>
            ))}
          </div>

          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #7f1d1d',
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'flex',
            gap: '0.75rem',
            fontSize: '0.9rem',
            color: '#fca5a5'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <strong>Requisitos:</strong> Descompactador (7-Zip, WinRAR). Alguns arquivos podem exigir senha.
            </div>
          </div>
        </div>

        {details.credits?.cast && details.credits.cast.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Elenco Principal</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {details.credits.cast.slice(0, 6).map(actor => (
                <div key={actor.id} style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  {actor.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      style={{
                        width: '100%',
                        borderRadius: '0.5rem',
                        marginBottom: '0.75rem'
                      }}
                    />
                  )}
                  <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{actor.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
