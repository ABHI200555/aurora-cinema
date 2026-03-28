import React, { useState, useEffect } from 'react';
import { ArrowLeft, Popcorn, Star, Calendar, MapPin } from 'lucide-react';

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const BASE_URL = 'https://api.themoviedb.org/3';

const ActorProfile = ({ actorName, onBack, onMovieClick }) => {
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActorData = async () => {
      setLoading(true);
      try {
        // 1. Search for person
        const searchRes = await fetch(`${BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(actorName)}`);
        const searchData = await searchRes.json();
        
        if (searchData.results && searchData.results.length > 0) {
          // Get most popular matching result
          const personId = searchData.results[0].id;
          
          // 2. Fetch full details
          const detailRes = await fetch(`${BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}`);
          const detailData = await detailRes.json();
          setPerson(detailData);

          // 3. Fetch movie credits
          const creditsRes = await fetch(`${BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`);
          const creditsData = await creditsRes.json();
          setMovies(creditsData.cast || []);
        }
      } catch (err) {
        console.error("Failed fetching Actor via TMDB", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
  }, [actorName]);

  const calculateAge = (birthday, deathday) => {
    if (!birthday) return 'Unknown';
    const birthDate = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    let age = end.getFullYear() - birthDate.getFullYear();
    const m = end.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birthDate.getDate())) {
      age--;
    }
    return deathday ? `${age} (Deceased)` : `${age} years old`;
  };

  const mapTmdbToCustomSchema = (tmdbMovie) => ({
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.original_title,
    image: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster',
    rating: tmdbMovie.vote_average || 0,
    year: tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.split('-')[0]) : 'Unknown',
    genre: 'Drama', // TMDB cast credits don't return full genre strings natively
    language: tmdbMovie.original_language?.toUpperCase() || 'EN',
    duration: 'N/A',
    director: 'Unknown',
    platform: 'Unknown',
    cast: [`${person?.name || actorName}`],
    trailer_key: null // We don't fetch trailer arrays inside movie_credits sadly
  });

  if (loading) {
    return (
      <div className="actor-profile animation-fade glass-panel" style={{ padding: '4rem', textAlign: 'center', minHeight: '80vh' }}>
        <div className="spinner"></div>
        <h2 style={{ color: 'var(--accent-primary)', marginTop: '2rem' }}>Pinging TMDB for {actorName}...</h2>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="actor-profile animation-fade" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2 style={{ color: '#e11d48' }}>Could not find actor {actorName} on TMDB.</h2>
        <button onClick={onBack} style={{ marginTop: '2rem', padding: '1rem', background: 'var(--glass-bg)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '12px' }}>Go Back</button>
      </div>
    );
  }

  // Analytics for Movies
  const popularMovies = [...movies].sort((a, b) => b.popularity - a.popularity).slice(0, 10);
  const chronologicalMovies = [...movies].filter(m => m.release_date).sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  const firstMovie = chronologicalMovies[0];

  return (
    <div className="actor-profile animation-fade" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      <button 
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem',
          background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50px', cursor: 'pointer', marginBottom: '2rem', fontWeight: 600, transition: 'all 0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        <ArrowLeft size={20} /> Back to Explore
      </button>

      <div className="actor-hero glass-panel" style={{ display: 'flex', gap: '3rem', padding: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Stats Pan */}
        <div style={{ flex: '0 0 350px', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
               width: '100%', borderRadius: '24px', overflow: 'hidden',
               boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <img 
                src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Photo'} 
                alt={person.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={18} fill="var(--accent-primary)" /> Global Popularity: {person.popularity.toFixed(1)}
                </h3>
                {person.birthday && (
                  <div>
                    <strong style={{ color: 'var(--text-secondary)' }}><Calendar size={14} style={{ marginRight: 6, display: 'inline' }} /> Born:</strong> {person.birthday}
                    <div style={{ fontSize: '0.9rem', color: '#c4b5fd', marginTop: '0.2rem' }}>{calculateAge(person.birthday, person.deathday)}</div>
                  </div>
                )}
                {person.place_of_birth && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}><MapPin size={14} style={{ marginRight: 6, display: 'inline' }}/> Birthplace:</strong>
                    <div style={{ fontSize: '0.95rem' }}>{person.place_of_birth}</div>
                  </div>
                )}
                {firstMovie && (
                   <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--accent-secondary)' }}>First Movie:</strong>
                      <div style={{ fontWeight: 600 }}>{firstMovie.title} ({firstMovie.release_date.split('-')[0]})</div>
                   </div>
                )}
            </div>
        </div>

        {/* Right Info Pane */}
        <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ 
               fontSize: '4.5rem', fontWeight: 900, marginBottom: '0.5rem',
               background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 
            }}>
               {person.name}
            </h1>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '2rem', letterSpacing: '1px' }}>
                {person.known_for_department}
            </h2>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
               <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Biography</h3>
               <p style={{
                  fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.8,
                  maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' // Added safe scroll tracking for huge TMDB bios
               }}>
                  {person.biography ? person.biography.split('\n').map((paragraph, i) => (
                    <span key={i} style={{ display: 'block', marginBottom: '1rem' }}>{paragraph}</span>
                  )) : `No biography available for ${person.name} on TMDB yet.`}
               </p>
            </div>
        </div>

      </div>

      {popularMovies.length > 0 && (
          <div style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Popcorn size={28} color="var(--accent-secondary)" /> Known For
              </h3>
              
              {/* Horizontal Scroll Track */}
              <div style={{ 
                 display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem',
                 scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' 
              }}>
                 {popularMovies.map(m => (
                    <div 
                      key={m.id} 
                      className="actor-movie-card"
                      onClick={() => onMovieClick(mapTmdbToCustomSchema(m))}
                      style={{
                         minWidth: '200px', maxWidth: '200px', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                         borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.5)', overflow: 'hidden'
                      }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                    >
                      <img 
                         src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster'}
                         alt={m.title}
                         style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '1.2rem', textAlign: 'center' }}>
                         <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title || m.original_title}</p>
                         <p style={{ color: 'var(--accent-secondary)', fontWeight: 800, marginTop: '0.4rem', fontSize: '0.9rem' }}>★ {m.vote_average ? m.vote_average.toFixed(1) : 'NR'}</p>
                         {m.character && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>as {m.character}</p>}
                      </div>
                    </div>
                 ))}
              </div>
          </div>
      )}

    </div>
  );
};

export default ActorProfile;
