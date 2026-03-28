const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const missing = db.filter(m => !m.image).map(m => m.title);
console.log('Missing images for (' + missing.length + ' movies):');
console.log(missing);
