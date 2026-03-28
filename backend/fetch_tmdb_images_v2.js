const fs = require('fs');

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const langMap = {
    'Telugu': 'te',
    'Hindi': 'hi',
    'English': 'en'
};

const getAccuratePoster = async (movie) => {
    const query = encodeURIComponent(movie.title);
    const yearUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${movie.year}`;
    const broadUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
    
    const targetLang = langMap[movie.language];

    try {
        const options = { headers: { 'Accept': 'application/json' } };
        
        // 1. Try strict search (Year + Title)
        let res = await fetch(yearUrl, options);
        let data = await res.json();
        let results = data.results || [];
        
        let match = results.find(r => r.original_language === targetLang && r.poster_path);
        if (match) return `https://image.tmdb.org/t/p/w500${match.poster_path}`;

        // 2. Try broad search (Title only)
        res = await fetch(broadUrl, options);
        data = await res.json();
        results = data.results || [];
        
        match = results.find(r => r.original_language === targetLang && r.poster_path);
        if (match) return `https://image.tmdb.org/t/p/w500${match.poster_path}`;
        
        // 3. Fallbacks
        if (results.length > 0 && results[0].poster_path) {
             return `https://image.tmdb.org/t/p/w500${results[0].poster_path}`;
        }
    } catch (e) {
        console.log(`Fetch error for ${movie.title}: ${e.message}`);
    }
    return null;
};

async function updateDb() {
    console.log(`Starting bulletproof TMDB validation for ${db.length} movies...`);
    let updatedCount = 0;

    for (let i = 0; i < db.length; i++) {
        const movie = db[i];
        
        // Wait 500ms to comfortably bypass any rate limits or CDN blocks
        await new Promise(r => setTimeout(r, 500)); 
        
        const accurateUrl = await getAccuratePoster(movie);
        
        if (accurateUrl && movie.image !== accurateUrl) {
            console.log(`[${i+1}/${db.length}] ✅ Resolved proper poster for: ${movie.title} (${movie.language})`);
            movie.image = accurateUrl;
            updatedCount++;
        }
    }

    fs.writeFileSync('./data/movies.json', JSON.stringify(db, null, 2));
    console.log(`\n✅ Database permanently rectified! ${updatedCount} precise movie posters loaded.`);
}

updateDb();
