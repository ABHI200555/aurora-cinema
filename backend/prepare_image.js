const fs = require('fs');
let db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

db = db.map(movie => {
   delete movie.image;
   return movie;
});

fs.writeFileSync('./data/movies.json', JSON.stringify(db, null, 2));
console.log('Images fully wiped.');
