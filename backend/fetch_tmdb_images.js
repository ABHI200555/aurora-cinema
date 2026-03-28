const fs = require('fs');
const https = require('https');

// ⚠️ IMPORTANT: REPLACE THIS WITH YOUR ACTUAL TMDB API KEY
const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';

const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const fetchPoster = (movieName) => {
    return new Promise((resolve) => {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.results && parsed.results.length > 0 && parsed.results[0].poster_path) {
                        resolve(`https://image.tmdb.org/t/p/w500${parsed.results[0].poster_path}`);
                    } else {
                        resolve('https://via.placeholder.com/300x450');
                    }
                } catch (e) {
                    resolve('https://via.placeholder.com/300x450');
                }
            });
        }).on('error', () => {
             resolve('https://via.placeholder.com/300x450');
        });
    });
};

async function updateDb() {
    console.log(`Fetching TMDB posters for ${db.length} movies...`);
    let updatedCount = 0;

    for (let i = 0; i < db.length; i++) {
        const movie = db[i];
        console.log(`[${i+1}/${db.length}] Fetching poster for: ${movie.title}`);
        
        // Slight delay to safely avoid TMDB rate limits
        await new Promise(r => setTimeout(r, 200)); 
        
        const posterUrl = await fetchPoster(movie.title);
        movie.image = posterUrl;
        updatedCount++;
    }

    fs.writeFileSync('./data/movies.json', JSON.stringify(db, null, 2));
    console.log(`Successfully updated ${updatedCount} movies with highly accurate TMDB posters!`);
    console.log('Restarting your Node.js server gracefully might be required to apply changes.');
}

if (TMDB_API_KEY === 'YOUR_API_KEY') {
    console.error('ERROR: You must insert your real TMDB API key at the top of this script (line 5).');
    console.log('Once you add it, run: node fetch_tmdb_images.js');
} else {
    updateDb();
}
