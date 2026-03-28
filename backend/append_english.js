const fs = require('fs');

const TMDB_API_KEY = '8882e29e0e1eb700fc79cadad2d868bc';
const BASE_URL = 'https://api.themoviedb.org/3';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchJson = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      if (res.status === 429) await sleep(500); 
    } catch (e) {
      await sleep(500);
    }
  }
  return null;
};

async function appendEnglishMovies() {
  console.log(`🎬 Pulling at least 150 English blockbusters...`);
  
  // 1. Read existing
  let existingMovies = [];
  try {
    existingMovies = JSON.parse(fs.readFileSync('./data/movies.json'));
  } catch (e) {
    console.log("Could not read existing movies.json!");
    return;
  }

  let maxId = 0;
  existingMovies.forEach(m => {
    if (m.id > maxId) maxId = m.id;
  });
  let idCounter = maxId + 1;

  // Track existing TMDB titles (approximate duplicate prevention across languages)
  const existingTitles = new Set(existingMovies.map(m => m.title));

  const langCode = 'en';
  const langName = 'English';

  const targets = [
    { sort: 'popularity.desc', pages: 8, label: 'Trending English Hits' },
    { sort: 'vote_average.desc', v_count: '1000', pages: 4, label: 'English Cult Classics' }
  ];

  let langMovieIds = new Set();

  for (const target of targets) {
    process.stdout.write(`\r-> Scanning for ${target.label}...      `);
    for (let page = 1; page <= target.pages; page++) {
      let discoverUrl = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${langCode}&sort_by=${target.sort}&page=${page}`;
      if (target.v_count) discoverUrl += `&vote_count.gte=${target.v_count}`;

      const data = await fetchJson(discoverUrl);
      if (data && data.results) {
        data.results.forEach(m => {
          if (m.poster_path && !existingTitles.has(m.title) && !existingTitles.has(m.original_title)) {
            langMovieIds.add(m.id);
          }
        });
      }
      await sleep(50); 
    }
  }

  console.log(`\n-> Extracted ${langMovieIds.size} unique English TMDB IDs. Fetching deep payloads...`);
  
  let successCount = 0;
  let newMovies = [];

  for (const tmdbId of langMovieIds) {
    if (successCount >= 180) break; // Hard ceiling to ensure we inject exactly what user requested (~150)
    
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

        let primaryGenre = 'Action'; // Default Fallback
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
          language: langName, // 'English'
          year: deepMovie.release_date ? parseInt(deepMovie.release_date.split('-')[0]) : 2020,
          duration: deepMovie.runtime ? `${Math.floor(deepMovie.runtime / 60)}h ${deepMovie.runtime % 60}m` : '2h 15m',
          director: director,
          cast: topCast,
          platform: 'Netflix',
          image: `https://image.tmdb.org/t/p/w500${deepMovie.poster_path}`,
          trailer_key: trailerKey
        };

        newMovies.push(finalMovie);
        successCount++;
        
        process.stdout.write(`\rLoaded [${successCount}/${langMovieIds.size}] ${finalMovie.title} (${finalMovie.year})         `);
    }
    await sleep(25); 
  }

  // Append & Shuffle
  const combinedDatabase = [...existingMovies, ...newMovies];

  for (let i = combinedDatabase.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedDatabase[i], combinedDatabase[j]] = [combinedDatabase[j], combinedDatabase[i]];
  }

  console.log(`\n======================================`);
  console.log(`💾 APPENDING ${newMovies.length} ENGLISH PIECES TO THE VAULT...`);
  fs.writeFileSync('./data/movies.json', JSON.stringify(combinedDatabase, null, 2));
  console.log(`✅ COMPLETE! You now possess ${combinedDatabase.length} records including Hollywood.`);
  console.log(`======================================`);
}

appendEnglishMovies();
