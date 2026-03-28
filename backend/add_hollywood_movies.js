const fs = require('fs');
const ytSearch = require('yt-search');
const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const dbFile = './data/movies.json';

const movieTitles = [
    "Oppenheimer", "Barbie", "Dune: Part Two", "Dune", "The Batman", "The Flash", "Aquaman and the Lost Kingdom", "Black Adam", "Shazam! Fury of the Gods", "Blue Beetle", "Guardians of the Galaxy Vol. 3", "Doctor Strange in the Multiverse of Madness", "Thor: Love and Thunder", "Black Panther: Wakanda Forever", "Ant-Man and the Wasp: Quantumania", "Spider-Man: No Way Home", "The Marvels", "Avatar: The Way of Water", "Top Gun: Maverick", "Mission: Impossible - Dead Reckoning Part One", "John Wick: Chapter 4", "The Matrix Resurrections", "Fast X", "F9: The Fast Saga", "No Time to Die", "Extraction", "Extraction 2", "The Gray Man", "Red Notice", "Army of the Dead", "The Adam Project", "Don't Look Up", "Glass Onion: A Knives Out Mystery", "Knives Out", "Murder Mystery", "Murder Mystery 2", "The Killer", "The Equalizer 3", "The Woman King", "The Creator", "Tenet", "Nope", "Get Out", "Us", "A Quiet Place Part II", "The Conjuring: The Devil Made Me Do It", "The Nun II", "It Chapter Two", "Smile", "Talk to Me", "M3GAN", "The Black Phone", "Halloween Ends", "Scream (2022)", "Scream VI", "Saw X", "Insidious: The Red Door", "Evil Dead Rise", "The Menu", "The Whale", "Everything Everywhere All at Once", "The Banshees of Inisherin", "The Fabelmans", "The Holdovers", "Past Lives", "Poor Things", "Saltburn", "Napoleon", "Killers of the Flower Moon", "The Irishman", "The Wolf of Wall Street", "The Social Network", "Whiplash", "La La Land", "The Prestige", "Memento", "The Revenant", "Bird Box", "Leave the World Behind", "Finch", "The Tomorrow War", "Edge of Tomorrow", "Oblivion", "Interstellar", "Ad Astra", "Passengers", "Ready Player One", "Free Guy", "The Hunger Games: The Ballad of Songbirds & Snakes", "The Hunger Games: Mockingjay Part 2", "Maze Runner: The Death Cure", "Divergent", "Insurgent", "Allegiant", "The Fault in Our Stars", "Five Feet Apart", "After", "After We Collided", "After We Fell", "After Ever Happy", "Me Before You", "The Notebook", "Anyone But You", "Ticket to Paradise", "Marry Me", "The Lost City", "Jungle Cruise", "Cruella", "Maleficent", "Maleficent: Mistress of Evil", "Encanto", "Frozen II", "Moana", "Raya and the Last Dragon", "Wish", "Lightyear", "Turning Red", "Soul", "Luca", "Onward", "Coco", "Toy Story 4", "Spider-Man: Into the Spider-Verse", "Spider-Man: Across the Spider-Verse", "The Super Mario Bros. Movie", "Minions: The Rise of Gru", "Despicable Me 3", "Sing 2", "The Boss Baby: Family Business", "Kung Fu Panda 4", "How to Train Your Dragon 3", "Puss in Boots: The Last Wish", "Shrek Forever After", "Hotel Transylvania: Transformania", "Ice Age: Collision Course", "The Croods: A New Age"
];

async function addMovies() {
    let db = [];
    if (fs.existsSync(dbFile)) {
        db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    }
    
    let maxId = 0;
    db.forEach(m => { if (m.id > maxId) maxId = m.id; });

    console.log(`Starting to fetch ${movieTitles.length} movies...`);
    let addedCount = 0;

    for (let i = 0; i < movieTitles.length; i++) {
        const titleQuery = movieTitles[i];
        
        // Skip if already in database (check by lowercasing title)
        if (db.some(m => m.title.toLowerCase() === titleQuery.toLowerCase())) {
            console.log(`[${i + 1}/${movieTitles.length}] Skipped (Already exists): ${titleQuery}`);
            continue;
        }

        try {
            await new Promise(r => setTimeout(r, 100)); // Rate limit TMDB 
            
            // 1. Search Movie
            let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(titleQuery)}`;
            let searchRes = await fetch(searchUrl, { headers: { 'Accept': 'application/json' } });
            let searchData = await searchRes.json();
            
            if (!searchData.results || searchData.results.length === 0) {
                console.log(`[${i + 1}/${movieTitles.length}] Not Found on TMDB: ${titleQuery}`);
                continue;
            }
            
            // Get the best English match or just the first result
            let tmdbMovie = searchData.results.find(m => m.original_language === 'en');
            if (!tmdbMovie) tmdbMovie = searchData.results[0];
            
            // 2. Fetch Details for Runtime and Genres
            let detailUrl = `https://api.themoviedb.org/3/movie/${tmdbMovie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`;
            let detailRes = await fetch(detailUrl, { headers: { 'Accept': 'application/json' } });
            let details = await detailRes.json();
            
            // 3. Extract Data
            const year = details.release_date ? parseInt(details.release_date.split('-')[0]) : 2024;
            const rating = Math.max(1, parseFloat((details.vote_average / 2).toFixed(1))); // scale out of 5
            const duration = details.runtime ? `${details.runtime}m` : "120m";
            const genre = details.genres && details.genres.length > 0 ? details.genres[0].name : "Action";
            
            // Image / Backdrop
            const image = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "";
            const backdrop = details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : "";
            
            // Director
            let directorRaw = details.credits?.crew?.find(c => c.job === 'Director');
            const director = directorRaw ? directorRaw.name : "Unknown Director";
            
            // Cast list
            let castList = [];
            if (details.credits && details.credits.cast) {
                castList = details.credits.cast.slice(0, 5).map(c => ({
                    name: c.name,
                    character: c.character,
                    profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null
                }));
            }
            if (castList.length === 0) { castList = ["Unknown Cast"]; } // Fallback
            
            const synopsis = details.overview || "";
            
            // Trailer
            let trailer_key = "";
            let videoRec = details.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
            if (videoRec) {
                trailer_key = videoRec.key;
            } else {
                // Secondary yt search fallback
                try {
                    const ytQuery = `${titleQuery} ${year} official trailer english`;
                    const ytRes = await ytSearch(ytQuery);
                    if (ytRes.videos && ytRes.videos.length > 0) {
                        trailer_key = ytRes.videos[0].videoId;
                    }
                } catch (e) {
                }
            }

            maxId++;
            const newMovie = {
                id: maxId,
                title: details.title || titleQuery,
                year: year,
                rating: rating,
                duration: duration,
                genre: genre,
                language: "English",
                platform: "unknown",
                image: image,
                backdrop: backdrop,
                director: director,
                cast: castList,
                synopsis: synopsis,
                trailer_key: trailer_key,
                overview: synopsis // Some templates use overview, some use synopsis
            };
            
            db.push(newMovie);
            addedCount++;
            console.log(`[${i + 1}/${movieTitles.length}] ✅ Added: ${newMovie.title}`);
            
            // Save incrementally
            if (addedCount % 10 === 0) {
                fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
            }
            
        } catch (e) {
            console.error(`[${i + 1}/${movieTitles.length}] Error processing ${titleQuery}: ${e.message}`);
        }
    }
    
    // Final save
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    console.log(`\n🎉 Process finished! Successfully added ${addedCount} new Hollywood movies.`);
}

addMovies();
