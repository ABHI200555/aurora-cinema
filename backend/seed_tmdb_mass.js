const fs = require('fs');

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const BASE_URL = 'https://api.themoviedb.org/3';

const LANGUAGES = [
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' }
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchJson = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      if (res.status === 429) await sleep(500); // Backoff for limit
    } catch (e) {
      await sleep(500);
    }
  }
  return null;
};

async function harvestMovies() {
  console.log(`🚀 Booting up the 2000+ Massive Aurora Ingestion Engine...`);
  
  let finalDatabase = [];
  const uniqueIds = new Set();
  let idCounter = 1;

  for (const lang of LANGUAGES) {
    console.log(`\n======================================`);
    console.log(`🎬 Harvesting ${lang.name} Cinema...`);
    console.log(`======================================`);
    
    // To cleanly hit 2000+, we need ~350 per language.
    // TMDB has 20 items per page. 350 / 20 = ~18 pages
    const targets = [
      { sort: 'popularity.desc', pages: 15, label: 'Trending Hits' },
      { sort: 'vote_average.desc', v_count: '20', pages: 10, label: 'Cult Classics' }
    ];

    let langMovieIds = new Set();

    for (const target of targets) {
      process.stdout.write(`\r-> Scanning for ${target.label} in ${lang.name}...      `);
      for (let page = 1; page <= target.pages; page++) {
        let discoverUrl = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${lang.code}&sort_by=${target.sort}&page=${page}`;
        if (target.v_count) discoverUrl += `&vote_count.gte=${target.v_count}`;

        const data = await fetchJson(discoverUrl);
        if (data && data.results) {
          data.results.forEach(m => {
            if (m.poster_path && !uniqueIds.has(m.id)) {
              langMovieIds.add(m.id);
              uniqueIds.add(m.id);
            }
          });
        }
        await sleep(50); 
      }
    }

    console.log(`\n-> Extracted ${langMovieIds.size} unique TMDB IDs for ${lang.name}. Fetching deep actor payloads...`);
    
    let successCount = 0;
    for (const tmdbId of langMovieIds) {
      if (finalDatabase.length >= 2500) break; // Hard ceiling to avoid excessive size over 2000 required.
      
      const detailUrl = `${BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`;
      const deepMovie = await fetchJson(detailUrl);

      if (deepMovie) {
          const rawCast = deepMovie.credits?.cast || [];
          const topCast = rawCast.slice(0, 4).map(c => ({
              name: c.name,
              character: c.character || 'Leading Role',
              image: c.profile_path ? `https://image.tmdb.org/t/p/w300${c.profile_path}` : null
          }));
          
          const crew = deepMovie.credits?.crew || [];
          const directorObj = crew.find(c => c.job === 'Director');
          const director = directorObj ? directorObj.name : 'Unknown';

          const videos = deepMovie.videos?.results || [];
          let trailerKey = null;
          let officialTrailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos.find(v => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip'));
          if (officialTrailer) trailerKey = officialTrailer.key;

          let primaryGenre = 'Drama';
          if (deepMovie.genres && deepMovie.genres.length > 0) {
              primaryGenre = deepMovie.genres[0].name;
              if (primaryGenre === 'Science Fiction') primaryGenre = 'Sci-Fi';
              if (primaryGenre === 'Family') primaryGenre = 'Comedy';
          }

          const finalMovie = {
            id: idCounter++,
            title: deepMovie.title || deepMovie.original_title,
            genre: primaryGenre,
            rating: Number(deepMovie.vote_average) || 7.0,
            language: lang.name,
            year: deepMovie.release_date ? parseInt(deepMovie.release_date.split('-')[0]) : 2020,
            duration: deepMovie.runtime ? `${Math.floor(deepMovie.runtime / 60)}h ${deepMovie.runtime % 60}m` : '2h 15m',
            director: director,
            cast: topCast,
            platform: 'Prime Video',
            image: `https://image.tmdb.org/t/p/w500${deepMovie.poster_path}`,
            trailer_key: trailerKey
          };

          finalDatabase.push(finalMovie);
          successCount++;
          
          process.stdout.write(`\rLoaded [${successCount}/${langMovieIds.size}] ${finalMovie.title} (${finalMovie.year})         `);
      }
      await sleep(25); // 40 API reqs a sec. TMDB limits 50.
    }
    console.log(`\n✅ Finished ${lang.name}! Added ${successCount} cinematic masterpieces.`);
  }

  console.log(`\n======================================`);
  console.log(`🔀 Shuffling the master database of ${finalDatabase.length} records...`);
  for (let i = finalDatabase.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalDatabase[i], finalDatabase[j]] = [finalDatabase[j], finalDatabase[i]];
  }

  console.log(`💾 WRITING ${finalDatabase.length} MASSIVE MOVIES TO FILE...`);
  fs.writeFileSync('./data/movies.json', JSON.stringify(finalDatabase, null, 2));
  console.log(`✅ OVERWRITE COMPLETE! You now possess ${finalDatabase.length} records.`);
  console.log(`======================================`);
}

harvestMovies();
