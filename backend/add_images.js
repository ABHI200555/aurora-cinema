const fs = require('fs');
let db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

db = db.map((movie, index) => {
    // Generate a beautiful placeholder from loremflickr matching the movie's genre
    movie.image = `https://loremflickr.com/500/750/${encodeURIComponent(movie.genre.toLowerCase())},movie?lock=${index}`;
    return movie;
});

fs.writeFileSync('./data/movies.json', JSON.stringify(db, null, 2));
console.log('Images added to all movies successfully.');
