import React, { useState, useEffect } from 'react';
import { Search, Popcorn, X, Sparkles, User, Heart } from 'lucide-react';
import MovieGrid from './components/MovieGrid';
import AuthModal from './components/AuthModal';
import AiWizard from './components/AiWizard';
import ActorProfile from './components/ActorProfile';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genres: [], languages: [] });
  
  // App States
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'watchlist'
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('aurora_watchlist') || '[]'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAiWizard, setShowAiWizard] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('aurora_user') || 'null'));

  // States for selected filters
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [viewActorName, setViewActorName] = useState(null);

  useEffect(() => {
    fetchFilters();
    fetchMovies();
  }, []);

  useEffect(() => {
    if (currentTab === 'home') fetchMovies();
  }, [selectedGenre, selectedLanguage, currentTab]);

  useEffect(() => {
    localStorage.setItem('aurora_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aurora_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aurora_user');
    }
  }, [currentUser]);

  const fetchFilters = async () => {
    try {
      const response = await fetch(`${API_URL}/filters`);
      const data = await response.json();
      setFilters(data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/movies?`;
      if (selectedGenre) url += `genre=${encodeURIComponent(selectedGenre)}&`;
      if (selectedLanguage) url += `language=${encodeURIComponent(selectedLanguage)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      // Simulate slight network delay for premium skeleton effect
      setTimeout(() => setLoading(false), 800);
    }
  };

  const fetchRecommendations = async (id) => {
    try {
      const response = await fetch(`${API_URL}/movies/${id}/recommendations`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (currentTab !== 'home') setCurrentTab('home');
    fetchMovies();
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    fetchRecommendations(movie.id);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRecommendations([]);
    document.body.style.overflow = 'auto';
  };

  const toggleWatchlist = (movie) => {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id);
      if (exists) return prev.filter(m => m.id !== movie.id);
      return [...prev, movie];
    });
  };

  // Compute movies to show based on tab (Strictly limit to 300 to protect RAM on 2000+ DB scale)
  const displayedMovies = currentTab === 'watchlist' ? watchlist : [...movies].reverse().slice(0, 300);

  return (
    <div className="app-container">
      {/* Premium Navbar */}
      <nav className="navbar" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '1.5rem 0', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setCurrentTab('home')}>
            <Popcorn size={40} className="hero-icon" />
            Aurora
          </h1>
          <div className="nav-tabs" style={{ display: 'flex', gap: '2rem', fontSize: '1.2rem', fontWeight: 600 }}>
            <span 
              onClick={() => setCurrentTab('home')}
              style={{ cursor: 'pointer', transition: 'color 0.3s', color: currentTab === 'home' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              Explore
            </span>
            <span 
              onClick={() => setCurrentTab('watchlist')}
              style={{ cursor: 'pointer', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.4rem', color: currentTab === 'watchlist' ? '#e11d48' : 'var(--text-secondary)' }}
            >
              {currentTab === 'watchlist' && <Heart size={18} fill="#e11d48" />} My Watchlist
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="ai-btn"
            onClick={() => setShowAiWizard(true)}
            style={{
               display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
               background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)',
               borderRadius: '30px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            <Sparkles size={18} /> What Should I Watch?
          </button>
          
          {currentUser ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                   <User size={18} color="var(--accent-secondary)" /> {currentUser.name}
                </span>
                <button 
                  onClick={() => setCurrentUser(null)}
                  style={{
                    padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-secondary)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
             </div>
          ) : (
             <>
               <button 
                 onClick={() => setShowAuthModal(true)}
                 style={{
                   display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                   background: 'transparent', color: 'white', border: 'none',
                   fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.3s'
                 }}
               >
                 Sign In
               </button>
               
               <button 
                 onClick={() => setShowAuthModal(true)}
                 style={{
                   display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                   background: 'var(--accent-primary)', color: 'white', border: 'none',
                   borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)'
                 }}
               >
                 Sign Up
               </button>
             </>
          )}
        </div>
      </nav>

      {currentTab === 'home' && (
        <div className="controls glass-panel" style={{ animation: 'fadeInDown 0.5s ease' }}>
          <form onSubmit={handleSearch} className="control-group" style={{ flexDirection: 'row', alignItems: 'flex-end', flexGrow: 1 }}>
            <div className="control-group" style={{ flexGrow: 1, padding: 0 }}>
              <label>Search Collection</label>
              <input 
                type="text" 
                className="search-input"
                placeholder="Find a movie..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-button">
              <Search size={22} />
            </button>
          </form>

          <div className="control-group">
            <label>Language</label>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="">All Languages</option>
              {filters.languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Genre</label>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value="">All Genres</option>
              {filters.genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {currentTab === 'watchlist' && (
        <div style={{ marginBottom: '3rem', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Heart size={36} fill="#e11d48" color="#e11d48" /> My Watchlist
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
            {watchlist.length === 0 ? "Your watchlist is currently empty. Start exploring and save your favorites!" : `You have saved ${watchlist.length} titles to binge later.`}
          </p>
        </div>
      )}

      <main>
        {currentTab === 'actor' && viewActorName ? (
           <ActorProfile 
             actorName={viewActorName} 
             onBack={() => { setCurrentTab('home'); setViewActorName(null); document.body.style.overflow = 'auto'; }} 
             onMovieClick={(proxyMovie) => openModal(proxyMovie)} 
           />
        ) : (
           <MovieGrid 
             movies={displayedMovies} 
             loading={currentTab === 'home' && loading} 
             onMovieClick={openModal} 
             watchlistIds={watchlist.map(m => m.id)}
             onToggleWatchlist={toggleWatchlist}
           />
        )}
      </main>

      {/* Modals Layer */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={setCurrentUser} />}
      {showAiWizard && <AiWizard onClose={() => setShowAiWizard(false)} onMovieClick={openModal} movies={movies} />}

      {selectedMovie && (
        <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            {selectedMovie.image && (
              <div className="modal-image-wrapper">
                <img 
                  src={selectedMovie.image} 
                  alt={selectedMovie.title} 
                  className="modal-image" 
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = `https://via.placeholder.com/400x600?text=${encodeURIComponent(selectedMovie.title)}`; 
                  }}
                />
              </div>
            )}
            <div className="modal-details" style={{ width: selectedMovie.image ? '55%' : '100%' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: '2.4rem' }}>{selectedMovie.title}</h2>
                <button 
                  onClick={() => toggleWatchlist(selectedMovie)}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.75rem', 
                    borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', transition: 'background 0.3s' 
                  }}
                >
                  <Heart size={28} fill={watchlist.some(m => m.id === selectedMovie.id) ? '#e11d48' : 'none'} color={watchlist.some(m => m.id === selectedMovie.id) ? '#e11d48' : 'white'} />
                </button>
              </div>

              <div className="movie-meta" style={{ fontSize: '1.05rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                <span>{selectedMovie.year}</span>
                <span>&bull;</span>
                <span>{selectedMovie.duration}</span>
                <span>&bull;</span>
                <span className="movie-rating" style={{ display: 'inline-flex', padding: '0.2rem 0.6rem' }}>★ {selectedMovie.rating.toFixed(1)} / 10</span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <span className="movie-genre">{selectedMovie.language}</span>
                <span className="movie-genre">{selectedMovie.genre}</span>
                  <a 
                    href={selectedMovie.platform_url || `https://www.google.com/search?q=Watch+${encodeURIComponent(selectedMovie.title)}+movie+on+${encodeURIComponent(selectedMovie.platform || 'streaming')}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="platform-badge platform-link"
                    title={`Watch ${selectedMovie.title} on ${selectedMovie.platform || 'Online'}`}
                  >
                    {selectedMovie.platform || 'Watch Now'}
                  </a>
              </div>

              {selectedMovie.trailer_key && (
                  <div className="trailer-section" style={{ marginBottom: '2rem', animation: 'fadeInUp 0.6s ease' }}>
                    <div className="video-responsive" style={{
                       overflow: 'hidden', paddingBottom: '56.25%', position: 'relative', height: 0,
                       borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                       <iframe
                         style={{ left: 0, top: 0, height: '100%', width: '100%', position: 'absolute' }}
                         src={`https://www.youtube.com/embed/${selectedMovie.trailer_key}?autoplay=0&rel=0`}
                         frameBorder="0"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                         title={`${selectedMovie.title} Trailer`}
                       />
                    </div>
                  </div>
              )}

              <div className="director">
                <h3>Director</h3>
                <p>{selectedMovie.director}</p>
              </div>

              <div className="cast">
                <h3>Hero / Cast</h3>
                <div className="cast-list">
                  {selectedMovie.cast.map(actor => {
                    const actorRef = typeof actor === 'object' ? actor : { name: actor };
                    return (
                      <button 
                        key={actorRef.name} 
                        className="cast-item hover-bump"
                        onClick={(e) => { 
                           e.stopPropagation(); 
                           setViewActorName(actorRef.name); 
                           setCurrentTab('actor');
                           closeModal(); 
                        }}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      >
                        {actorRef.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {recommendations.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 className="similar-h3">Similar Movies You Might Like</h3>
                  <div className="similar-movies-container">
                    {recommendations.map(rec => (
                      <div 
                        key={rec.id} 
                        className="similar-movie-card"
                        onClick={() => openModal(rec)}
                      >
                        {rec.image ? (
                           <img 
                             src={rec.image} 
                             alt={rec.title} 
                             className="similar-movie-image" 
                             onError={(e) => {
                               e.target.onerror = null;
                               e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(rec.title)}`;
                             }}
                           />
                        ) : (
                           <div className="similar-movie-fallback"><Popcorn size={32} opacity={0.5} color="var(--text-secondary)" /></div>
                        )}
                        <div className="similar-movie-info">
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rec.title}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.25rem', fontWeight: 800 }}>{rec.rating.toFixed(1)} ★</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
