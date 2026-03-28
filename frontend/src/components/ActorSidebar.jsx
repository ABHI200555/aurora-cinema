import React from 'react';
import { X, User } from 'lucide-react';

const ActorSidebar = ({ actor, onClose }) => {

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '320px',
        backgroundColor: 'rgba(2, 6, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        zIndex: 50,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
        animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        overflowY: 'auto'
      }}
    >
      <button 
        onClick={onClose}
        style={{
          alignSelf: 'flex-start',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          marginBottom: '2rem',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        <X size={20} />
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid var(--accent-primary)',
          boxShadow: '0 10px 30px rgba(20, 184, 166, 0.3)',
          margin: '0 auto 1.5rem',
          backgroundColor: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {actor.image ? (
            <img 
              src={actor.image} 
              alt={actor.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <User size={80} color="var(--text-secondary)" />
          )}
        </div>
        
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'white' }}>{actor.name}</h3>
        {actor.character && (
            <p style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: 600, marginTop: '0.5rem' }}>
                as {actor.character}
            </p>
        )}
      </div>

    </div>
  );
};

export default ActorSidebar;
