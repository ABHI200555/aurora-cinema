import React from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

const MovieGrid = ({ movies, loading, onMovieClick, watchlistIds = [], onToggleWatchlist }) => {
  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={`skeleton-${index}`}
            className="animate-fade-in-up" 
            style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <p>No movies found matching your criteria. Try adjusting your filters!</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <div 
          key={movie.id} 
          className="animate-fade-in-up" 
          style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
        >
          <MovieCard 
            movie={movie} 
            onClick={onMovieClick} 
            isInWatchlist={watchlistIds.includes(movie.id)}
            onToggleWatchlist={onToggleWatchlist}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
