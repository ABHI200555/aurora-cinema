const fs = require('fs');

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const langMap = {
    'Telugu': 'te',
    'Hindi': 'hi',
    'English': 'en'
};

const getTmdbData = async (movie) => {
    const query = encodeURIComponent(movie.title);
    const targetLang = langMap[movie.language];
    
    // 1. Search for the movie ID first using strict matching
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
            // 2. Fetch the movie's credits
            const creditsUrl = `https://api.themoviedb.org/3/movie/${match.id}/credits?api_key=${TMDB_API_KEY}`;
            const credRes = await fetch(creditsUrl, options);
            const credData = await credRes.json();
            
            let topCast = [];
            if (credData.cast && credData.cast.length > 0) {
                topCast = credData.cast.slice(0, 3).map(c => c.name); // Get top 3 actors
            }
            
            let director = 'Unknown';
            if (credData.crew) {
                const d = credData.crew.find(c => c.job === 'Director');
                if (d) director = d.name;
            }
            
            return { cast: topCast, director };
        }
        
    } catch (e) {
        console.log(`Error updating cast for ${movie.title}: ${e.message}`);
    }
    return null;
};

async function patchCast() {
    console.log(`Applying real TMDB cast & directors to ${db.length} movies...`);
    let updatedCount = 0;

    for (let i = 0; i < db.length; i++) {
        const movie = db[i];
        
        // Target specifically movies that have placeholder cast OR placeholder director
        if (movie.cast.includes('Actor 1') || movie.cast.includes('Actor 2') || movie.director === 'Unknown' || typeof movie.director === 'undefined') {
            await new Promise(r => setTimeout(r, 400)); // 400ms buffer 
            
            const tmdbData = await getTmdbData(movie);
            if (tmdbData && tmdbData.cast.length > 0) {
                console.log(`[${i+1}/${db.length}] ✅ Replaced cast for: ${movie.title} -> ${tmdbData.cast.join(', ')}`);
                movie.cast = tmdbData.cast;
                if (tmdbData.director !== 'Unknown') movie.director = tmdbData.director;
                updatedCount++;
            }
        }
    }

    fs.writeFileSync('./data/movies.json', JSON.stringify(db, null, 2));
    console.log(`\n✅ Database permanently updated! Fixed cast for ${updatedCount} movies using pure TMDB data.`);
}

patchCast();
