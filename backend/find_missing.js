const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const missing = db.filter(m => !m.image || typeof m.image !== 'string' || !m.image.startsWith('http'));
console.log(`Found ${missing.length} movies with missing/invalid images in DB:`);
missing.forEach(m => console.log(`- ${m.title} (${m.year})`));
