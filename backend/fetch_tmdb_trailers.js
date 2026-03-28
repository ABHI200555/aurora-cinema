const fs = require('fs');

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const langMap = {
    'Telugu': 'te',
    'Hindi': 'hi',
    'English': 'en'
};

const getTmdbTrailer = async (movie) => {
    const query = encodeURIComponent(movie.title);
    const targetLang = langMap[movie.language];
    
    // Strict search
    const yearUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${movie.year}`;
    const broadUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
    
    try {
        const options = { headers: { 'Accept': 'application/json' } };
        
        let res = await fetch(yearUrl, options);
        let data = await res.json();
        let match = (data.results || []).find(r => r.original_language === targetLang);

        if (!match) {
            res = await fetch(broadUrl, options);
            data = await res.json();
            match = (data.results || []).find(r => r.original_language === targetLang);
        }
        
        if (!match && data.results && data.results.length > 0) {
            match = data.results[0];
        }

        if (match && match.id) {
            // Fetch videos for this movie ID
            const videosUrl = `https://api.themoviedb.org/3/movie/${match.id}/videos?api_key=${TMDB_API_KEY}`;
            const vidRes = await fetch(videosUrl, options);
            const vidData = await vidRes.json();
            
            // Look for official YouTube Trailer
            if (vidData.results && vidData.results.length > 0) {
                // Prioritize Official Trailers
                let trailer = vidData.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
                // Fallback to any YouTube video (Teaser, Clip)
                if (!trailer) trailer = vidData.results.find(v => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip'));
                
                if (trailer) {
                    return trailer.key; 
                }
            }
        }
    } catch (e) {
        console.log(`Error updating trailer for ${movie.title}: ${e.message}`);
    }
    return null;
};

async function patchTrailers() {
    console.log(`Connecting to TMDB to map official YouTube trailers to ${db.length} movies...`);
    let updatedCount = 0;

    for (let i = 0; i < db.length; i++) {
        const movie = db[i];
        
        // Target movies without a trailer_key
        if (!movie.trailer_key) {
            await new Promise(r => setTimeout(r, 400)); // 400ms buffer 
            
            const trailerKey = await getTmdbTrailer(movie);
            if (trailerKey) {
                console.log(`[${i+1}/${db.length}] ✅ Mapped trailer for: ${movie.title} [https://youtube.com/watch?v=${trailerKey}]`);
                movie.trailer_key = trailerKey;
                updatedCount++;
            } else {
                 console.log(`[${i+1}/${db.length}] ❌ No trailer found for: ${movie.title}`);
            }
        }
    }

    fs.writeFileSync('./data/movies.json', JSON.stringify(db, null, 2));
    console.log(`\n✅ Database permanently updated! Added YouTube trailers to ${updatedCount} movies natively.`);
}

patchTrailers();
