import React from 'react';
import { X } from 'lucide-react';

const DownloadModal = ({ isOpen, onClose, movie, qualities, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2>Baixar {movie?.title || movie?.name}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          {qualities?.map(q => (
            <button
              key={q.name}
              onClick={() => onDownload(q)}
              className="quality-btn"
            >
              {q.name}
              <span className="quality-size">{q.size}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
