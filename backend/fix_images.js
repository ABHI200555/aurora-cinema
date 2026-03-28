const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

let updatedCount = 0;
const newDb = db.map(movie => {
    if (movie.image && movie.image.startsWith('https://upload.wikimedia.org')) {
        movie.image = `https://wsrv.nl/?url=${encodeURIComponent(movie.image)}`;
        updatedCount++;
    }
    return movie;
});

fs.writeFileSync('./data/movies.json', JSON.stringify(newDb, null, 2));
console.log('Successfully fixed ' + updatedCount + ' images using proxy.');
