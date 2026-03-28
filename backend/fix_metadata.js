const fs = require('fs');
const ytSearch = require('yt-search');
const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const dbFile = './data/movies.json';
const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

const langMap = {
    'Telugu': 'te',
    'Hindi': 'hi',
    'English': 'en'
};

const getAccuratePoster = async (movie) => {
    const query = encodeURIComponent(movie.title);
    const yearUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${movie.year}`;
    const targetLang = langMap[movie.language];

    try {
        const options = { headers: { 'Accept': 'application/json' } };
        let res = await fetch(yearUrl, options);
        let data = await res.json();
        let results = data.results || [];
        
        let match = results.find(r => r.original_language === targetLang && r.poster_path);
        if (match) return `https://image.tmdb.org/t/p/w500${match.poster_path}`;

        const broadUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
        res = await fetch(broadUrl, options);
        data = await res.json();
        results = data.results || [];
        
        match = results.find(r => r.original_language === targetLang && r.poster_path);
        if (match) return `https://image.tmdb.org/t/p/w500${match.poster_path}`;

        if (results.length > 0 && results[0].poster_path) {
             return `https://image.tmdb.org/t/p/w500${results[0].poster_path}`;
        }
    } catch (e) {
    }
    return null;
};

const getAccurateTrailer = async (movie) => {
    try {
        const query = `${movie.title} ${movie.year} official trailer ${movie.language}`;
        const r = await ytSearch(query);
        const videos = r.videos.slice(0, 3);
        if (videos.length > 0) {
            return videos[0].videoId;
        }
    } catch (e) {
    }
    return null;
};

async function fixMetadata() {
    console.log(`Starting to check metadata for ${db.length} movies...`);
    let updatedImages = 0;
    let updatedTrailers = 0;

    for (let i = 0; i < db.length; i++) {
        const movie = db[i];
        let modified = false;

        await new Promise(r => setTimeout(r, 80)); 

        const accurateUrl = await getAccuratePoster(movie);
        if (accurateUrl && movie.image !== accurateUrl) {
            movie.image = accurateUrl;
            modified = true;
            updatedImages++;
        }

        if (!movie.trailer_key || movie.trailer_key === '') {
            const trailerId = await getAccurateTrailer(movie);
            if (trailerId) {
                movie.trailer_key = trailerId;
                modified = true;
                updatedTrailers++;
            }
        }

        if (modified) {
            if (i % 25 === 0) console.log(`[${i+1}/${db.length}] Fixed: ${movie.title}`);
            if (i % 50 === 0) fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
        } else if (i % 200 === 0) {
            console.log(`[${i+1}/${db.length}] OK...`);
        }
    }

    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    console.log(`\n✅ Metadata check complete! Fixed ${updatedImages} images and ${updatedTrailers} trailers.`);
}

fixMetadata();
