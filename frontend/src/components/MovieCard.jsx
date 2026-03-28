import React, { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';

const langMap = {
    'Telugu': 'te',
    'Hindi': 'hi',
    'English': 'en'
};

const MovieCard = ({ movie, onClick, isInWatchlist, onToggleWatchlist }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoaded(false);

    const fetchDynamicPoster = async () => {
      try {
        const query = encodeURIComponent(movie.title);
        const targetLang = langMap[movie.language];
        const yearUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${movie.year}`;
        const broadUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

        // 1. Strict search with Year and exact Language match
        let res = await fetch(yearUrl);
        let data = await res.json();
        let results = data.results || [];
        
        let match = results.find(r => r.original_language === targetLang && r.poster_path);
        
        // 2. Broad search if strict search fails (sometimes TMDB years are slightly off)
        if (!match) {
            res = await fetch(broadUrl);
            data = await res.json();
            results = data.results || [];
            match = results.find(r => r.original_language === targetLang && r.poster_path);
        }

        // 3. Ultimate Fallback to highest ranked result
        if (!match && results.length > 0 && results[0].poster_path) {
            match = results[0];
        }
        
        if (isMounted && match && match.poster_path) {
          setImageUrl(`https://image.tmdb.org/t/p/w500${match.poster_path}`);
        } else if (isMounted) {
          setImageUrl('https://via.placeholder.com/300x450?text=' + encodeURIComponent(movie.title));
        }
      } catch (e) {
        if (isMounted) setImageUrl('https://via.placeholder.com/300x450?text=' + encodeURIComponent(movie.title));
      }
    };

    if (TMDB_API_KEY !== 'YOUR_API_KEY') {
      fetchDynamicPoster();
    } else {
      setImageUrl(movie.image || `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`);
    }

    return () => { isMounted = false; };
  }, [movie]);

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="card-content-wrapper">
        <div className="movie-image-container" style={{ minHeight: '400px', backgroundColor: 'var(--bg-card)' }}>
             <img 
               src={imageUrl} 
               alt={movie.title} 
               className="movie-image" 
               loading="lazy"
               onLoad={() => setLoaded(true)}
               onError={(e) => { 
                  if (imageUrl !== movie.image && imageUrl !== 'https://via.placeholder.com/300x450') {
                    setImageUrl('https://via.placeholder.com/300x450?text=' + encodeURIComponent(movie.title));
                  }
               }}
               style={{
                 opacity: loaded ? 1 : 0,
                 transition: 'opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                 objectFit: 'cover',
                 width: '100%',
                 height: '100%'
               }}
             />
             <div className="movie-overlay">
               <button 
                 className={`watchlist-btn ${isInWatchlist ? 'active' : ''}`}
                 onClick={(e) => {
                   e.stopPropagation();
                   onToggleWatchlist?.(movie);
                 }}
                 style={{
                   position: 'absolute',
                   top: '1rem',
                   right: '1rem',
                   background: 'rgba(0,0,0,0.5)',
                   border: 'none',
                   borderRadius: '50%',
                   padding: '0.5rem',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   backdropFilter: 'blur(4px)',
                   transition: 'all 0.3s ease'
                 }}
               >
                 <Heart
                   size={20} 
                   fill={isInWatchlist ? '#e11d48' : 'none'} 
                   color={isInWatchlist ? '#e11d48' : 'white'} 
                   style={{
                     transform: isInWatchlist ? 'scale(1.1)' : 'scale(1)',
                     transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                   }}
                 />
               </button>
               <div className="movie-rating">
                 <Star size={16} fill="currentColor" />
                 <span>{movie.rating.toFixed(1)}</span>
               </div>
             </div>
        </div>
        
        <div className="movie-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 className="movie-title" style={{ margin: 0, paddingRight: '1rem' }}>{movie.title}</h3>
          </div>
          
          <div className="movie-meta">
            <span>{movie.year}</span>
            <span>&bull;</span>
            <span>{movie.duration || '120 min'}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <span className="movie-genre">{movie.language}</span>
            <span className="movie-genre">{movie.genre}</span>
          </div>
            <a 
              href={movie.platform_url || `https://www.google.com/search?q=Watch+${encodeURIComponent(movie.title)}+movie+on+${encodeURIComponent(movie.platform || 'streaming')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="platform-badge platform-link"
              onClick={(e) => e.stopPropagation()}
              title={`Watch ${movie.title} on ${movie.platform || 'Online'}`}
            >
              {movie.platform || 'Watch Now'}
            </a>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
