const fs = require('fs');
const https = require('https');

// TMDB API KEY
const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const DB_PATH = './data/movies.json';

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const langMap = {
    'Telugu': 'te',
    'Hindi': 'hi',
    'English': 'en',
    'Tamil': 'ta',
    'Malayalam': 'ml',
    'Kannada': 'kn'
};

const fetchUrl = (url) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
};

const getDirectLink = (providerName, title) => {
    const q = encodeURIComponent(title);
    const lower = providerName.toLowerCase();
    
    if (lower.includes('netflix')) return `https://www.netflix.com/search?q=${q}`;
    if (lower.includes('prime')) return `https://www.primevideo.com/search/ref=atv_sr_sug_1?phrase=${q}`;
    if (lower.includes('hotstar')) return `https://www.hotstar.com/in/explore?search_query=${q}`;
    if (lower.includes('zee5')) return `https://www.zee5.com/search?q=${q}`;
    if (lower.includes('sun nxt') || lower.includes('sunnxt')) return `https://www.sunnxt.com/search/${q}`;
    if (lower.includes('sony')) return `https://www.sonyliv.com/search/${q}`;
    if (lower.includes('aha')) return `https://www.aha.video/search?q=${q}`;
    if (lower.includes('jio')) return `https://www.jiocinema.com/search?q=${q}`;
    if (lower.includes('apple')) return `https://tv.apple.com/search?term=${q}`;
    if (lower.includes('youtube')) return `https://www.youtube.com/results?search_query=${q}+movie`;
    
    // Fallback general search
    return `https://www.google.com/search?q=Watch+${q}+on+${encodeURIComponent(providerName)}`;
};

const extractProvider = (providerData, title) => {
    if (!providerData) return null;
    
    const region = providerData.IN || providerData.US;
    if (!region) return null;

    const bestOption = (region.flatrate && region.flatrate[0]) || 
                       (region.rent && region.rent[0]) ||
                       (region.buy && region.buy[0]);
                       
    if (bestOption) {
        const name = bestOption.provider_name;
        return {
            name: name,
            url: getDirectLink(name, title)
        };
    }
    return null;
};

async function processMovies(limit = db.length) {
    console.log(`Starting provider fetch for ${limit} movies...`);
    let updatedCount = 0;

    for (let i = 0; i < limit; i++) {
        const movie = db[i];
        
        // Skip removed to force update

        console.log(`[${i+1}/${limit}] Processing: ${movie.title}`);
        
        try {
            const query = encodeURIComponent(movie.title);
            const targetLang = langMap[movie.language];
            
            // 1. Search for movie ID
            let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${movie.year}`;
            let searchResult = await fetchUrl(searchUrl);
            
            let tmdbId = null;
            if (searchResult && searchResult.results && searchResult.results.length > 0) {
                // Try strictly filtering by language if known
                let match = searchResult.results.find(r => r.original_language === targetLang);
                if (!match) match = searchResult.results[0];
                tmdbId = match.id;
            } else {
                // Broad search without year
                searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
                searchResult = await fetchUrl(searchUrl);
                if (searchResult && searchResult.results && searchResult.results.length > 0) {
                     let match = searchResult.results.find(r => r.original_language === targetLang);
                     if (!match) match = searchResult.results[0];
                     tmdbId = match.id;
                }
            }

            // 2. Fetch Providers if ID is found
            if (tmdbId) {
                const provUrl = `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`;
                const provResult = await fetchUrl(provUrl);
                
                if (provResult && provResult.results) {
                    const provider = extractProvider(provResult.results, movie.title);
                    if (provider) {
                        movie.platform = provider.name;
                        movie.platform_url = provider.url;
                        updatedCount++;
                        console.log(`   -> Found: ${provider.name}`);
                    } else {
                        // Fallback to existing or "Prime Video"
                        movie.platform = (movie.platform && movie.platform !== 'Unknown') ? movie.platform : 'Prime Video';
                        movie.platform_url = getDirectLink(movie.platform, movie.title);
                        updatedCount++;
                        console.log(`   -> Using Fallback: ${movie.platform}`);
                    }
                }
            } else {
                movie.platform = (movie.platform && movie.platform !== 'Unknown') ? movie.platform : 'Prime Video';
                movie.platform_url = getDirectLink(movie.platform, movie.title);
                console.log(`   -> TMDB ID not found, using Fallback: ${movie.platform}`);
            }
        } catch (e) {
            console.error(`Error processing ${movie.title}:`, e.message);
        }

        // Wait to respect TMDB rate limits (40 req/sec max) -> 2 requests per movie = ~100ms is perfectly safe
        await new Promise(r => setTimeout(r, 100));
        
        // Save periodically
        if ((i + 1) % 50 === 0) {
            fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
            console.log(`[Progress Saved at index ${i+1}]`);
        }
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log(`\nSuccessfully updated ${updatedCount} out of ${limit} movies processed.`);
    console.log('Restart the backend server to load updated data.');
}

const limitArgs = process.argv[2] ? parseInt(process.argv[2]) : db.length;
processMovies(limitArgs);
