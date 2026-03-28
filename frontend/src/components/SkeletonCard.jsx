import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="movie-card skeleton-card">
      <div className="card-content-wrapper">
        <div className="movie-image-container skeleton-box" style={{ minHeight: '400px' }}></div>
        
        <div className="movie-info">
          <div className="skeleton-box skeleton-title" style={{ width: '70%', height: '24px', marginBottom: '0.75rem', borderRadius: '4px' }}></div>
          
          <div className="movie-meta" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div className="skeleton-box" style={{ width: '40px', height: '16px', borderRadius: '4px' }}></div>
            <div className="skeleton-box" style={{ width: '60px', height: '16px', borderRadius: '4px' }}></div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div className="skeleton-box" style={{ width: '60px', height: '22px', borderRadius: '12px' }}></div>
            <div className="skeleton-box" style={{ width: '70px', height: '22px', borderRadius: '12px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
