const fs = require('fs');
const https = require('https');

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const DB_PATH = './data/movies.json';

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

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
    if (lower.includes('hotstar') || lower.includes('disney')) return `https://www.hotstar.com/in/explore?search_query=${q}`;
    if (lower.includes('zee5')) return `https://www.zee5.com/search?q=${q}`;
    if (lower.includes('sun nxt') || lower.includes('sunnxt')) return `https://www.sunnxt.com/search/${q}`;
    if (lower.includes('sony')) return `https://www.sonyliv.com/search/${q}`;
    if (lower.includes('aha')) return `https://www.aha.video/search?q=${q}`;
    if (lower.includes('jio') || lower.includes('hbo') || lower.includes('max')) return `https://www.jiocinema.com/search?q=${q}`;
    if (lower.includes('apple')) return `https://tv.apple.com/search?term=${q}`;
    if (lower.includes('youtube') || lower.includes('google')) return `https://www.youtube.com/results?search_query=${q}+movie`;
    
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
        return { name: bestOption.provider_name, url: getDirectLink(bestOption.provider_name, title) };
    }
    return null;
};

async function processEnglishMovies() {
    const englishMovies = db.filter(m => m.language === 'English' || m.language === 'en');
    console.log(`Found ${englishMovies.length} English movies to process...`);
    
    if(englishMovies.length === 0) {
        console.log("No English movies found. Are you sure they are in data/movies.json?");
        return;
    }

    let updatedCount = 0;

    for (let i = 0; i < englishMovies.length; i++) {
        const movie = englishMovies[i];
        
        console.log(`[${i+1}/${englishMovies.length}] Processing: ${movie.title}`);
        
        try {
            const query = encodeURIComponent(movie.title);
            
            // 1. Search for movie ID
            let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${movie.year}`;
            let searchResult = await fetchUrl(searchUrl);
            
            let tmdbId = null;
            if (searchResult && searchResult.results && searchResult.results.length > 0) {
                let match = searchResult.results.find(r => r.original_language === 'en');
                if (!match) match = searchResult.results[0];
                tmdbId = match.id;
            } else {
                searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
                searchResult = await fetchUrl(searchUrl);
                if (searchResult && searchResult.results && searchResult.results.length > 0) {
                     let match = searchResult.results.find(r => r.original_language === 'en');
                     if (!match) match = searchResult.results[0];
                     tmdbId = match.id;
                }
            }

            // 2. Fetch Providers
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
                        movie.platform = 'Prime Video';
                        movie.platform_url = getDirectLink('Prime Video', movie.title);
                        updatedCount++;
                        console.log(`   -> Using Fallback: Prime Video`);
                    }
                }
            } else {
                movie.platform = 'Prime Video';
                movie.platform_url = getDirectLink('Prime Video', movie.title);
                console.log(`   -> TMDB ID not found, using Fallback: Prime Video`);
            }
        } catch (e) {
            console.error(`Error processing ${movie.title}:`, e.message);
        }

        await new Promise(r => setTimeout(r, 100)); // Rate limit
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log(`\nSuccessfully updated ${updatedCount} English movies.`);
}

processEnglishMovies();
