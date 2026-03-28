import React, { useState } from 'react';
import { X, Sparkles, Smile, Frown, Coffee, Heart, Zap } from 'lucide-react';
import MovieCard from './MovieCard';

const MOODS = [
  { id: 'happy', label: 'Happy', icon: <Smile size={28} />, genres: ['Comedy', 'Animation'] },
  { id: 'sad', label: 'Sad', icon: <Frown size={28} />, genres: ['Drama', 'Romance'] },
  { id: 'chill', label: 'Chill', icon: <Coffee size={28} />, genres: ['Sci-Fi', 'Fantasy', 'Comedy'] },
  { id: 'romantic', label: 'Romantic', icon: <Heart size={28} />, genres: ['Romance', 'Drama'] },
  { id: 'action', label: 'Action Packed', icon: <Zap size={28} />, genres: ['Action', 'Thriller', 'Adventure'] }
];

const AiWizard = ({ onClose, onMovieClick, movies }) => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendationsFromDataset = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const moodDef = MOODS.find(m => m.id === selectedMood);
        
        let filtered = movies.filter(m => {
          if (!m.genre) return false;
          const movieGenres = m.genre.toLowerCase();
          return moodDef.genres.some(g => movieGenres.includes(g.toLowerCase()));
        });
        
        if (selectedLanguage) {
          filtered = filtered.filter(m => m.language === selectedLanguage);
        }
        
        // Sort by rating and pick top 6
        const results = filtered.sort((a, b) => b.rating - a.rating).slice(0, 6);
        setRecommendations(results);
      } catch (e) {
        console.error("AI Filtering Error:", e);
      }
      setLoading(false);
      setStep(3);
    }, 1500); // Simulate AI crunching time for dramatic effect
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{
           width: '100%',
           maxWidth: step === 3 ? '1000px' : '550px',
           maxHeight: '90vh',
           overflowY: 'auto',
           padding: '2.5rem',
           position: 'relative',
           animation: 'fadeInUp 0.4s ease forwards',
           transition: 'max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <button className="modal-close" onClick={onClose} style={{ top: '15px', right: '15px' }}>
          <X size={24} />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Sparkles color="var(--accent-secondary)" /> AI Movie Wizard
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            {step === 1 && "What's your current mood?"}
            {step === 2 && "Any specific language preference?"}
            {step === 3 && "Here are your perfect matches!"}
          </p>
        </div>

        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                style={{
                  background: selectedMood === mood.id ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${selectedMood === mood.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px',
                  padding: '2rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: selectedMood === mood.id ? 'translateY(-5px)' : 'none'
                }}
              >
                {mood.icon}
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{mood.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {[...new Set(movies.filter(m => m.language).map(m => m.language))].slice(0, 10).concat(['Any']).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang === 'Any' ? '' : lang)}
                style={{
                  background: (selectedLanguage === lang || (lang === 'Any' && selectedLanguage === '')) ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${(selectedLanguage === lang || (lang === 'Any' && selectedLanguage === '')) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  padding: '1rem 2.5rem',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {step < 3 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              style={{ padding: '0.75rem 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            
            <button 
              onClick={() => {
                if (step === 1 && selectedMood) setStep(2);
                if (step === 2) fetchRecommendationsFromDataset();
              }}
              disabled={step === 1 && !selectedMood}
              style={{ 
                padding: '0.75rem 2.5rem', 
                background: (step === 1 && !selectedMood) ? 'rgba(255,255,255,0.1)' : 'var(--accent-primary)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: (step === 1 && !selectedMood) ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              {loading ? 'Crunching AI Data...' : (step === 2 ? 'Show My Movies!' : 'Next')}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            {recommendations.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {recommendations.map(movie => (
                  <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                <Frown size={48} style={{ margin: '0 auto 1rem' }} />
                <h3>No perfect match found</h3>
                <p>Try widening your search criteria!</p>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <button 
                onClick={() => { setStep(1); setSelectedMood(null); setSelectedLanguage(''); }}
                style={{ padding: '0.75rem 3rem', background: 'transparent', border: '2px solid var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Start Over
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AiWizard;
