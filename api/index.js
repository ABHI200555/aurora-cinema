const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Load movies DB using __dirname to ensure paths work on Vercel
let movies = [];
const moviesPath = path.join(__dirname, '..', 'backend', 'data', 'movies.json');
const usersPath = path.join(__dirname, '..', 'backend', 'data', 'users.json');

try {
    if (fs.existsSync(moviesPath)) {
        movies = JSON.parse(fs.readFileSync(moviesPath, 'utf8'));
    }
} catch (err) {
    console.error('Error reading movies.json:', err);
}

// GET all movies
app.get('/api/movies', (req, res) => {
    let result = [...movies];
    
    // Filter by genre
    if (req.query.genre) {
        result = result.filter(m => m.genre.toLowerCase() === req.query.genre.toLowerCase());
    }
    
    // Filter by language
    if (req.query.language) {
        result = result.filter(m => m.language.toLowerCase() === req.query.language.toLowerCase());
    }
    
    // Search by title
    if (req.query.search) {
        const query = req.query.search.toLowerCase();
        result = result.filter(m => m.title.toLowerCase().includes(query));
    }

    res.json(result);
});

// GET single movie
app.get('/api/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ message: 'Movie not found' });
    }
});

// GET recommended movies
app.get('/api/movies/:id/recommendations', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }
    
    const recommendations = movies.filter(m => 
        m.id !== movie.id && 
        (m.genre === movie.genre || m.language === movie.language)
    ).sort((a, b) => b.rating - a.rating).slice(0, 5);

    res.json(recommendations);
});

// Get unique filter values
app.get('/api/filters', (req, res) => {
    const genres = [...new Set(movies.map(m => m.genre))].sort();
    const languages = [...new Set(movies.map(m => m.language))].sort();
    res.json({ genres, languages });
});

// User Auth Routes (Note: Stateless on Vercel)
let users = [];
try {
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }
} catch (e) {
    console.error('No users db found');
}

app.post('/api/users/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    // Note: Writing to file won't persist across Vercel function calls reliably
    try {
        fs.writeFileSync(usersPath, JSON.stringify(users));
    } catch (e) {}
    res.json(newUser);
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Export the Express app as a Vercel Serverless Function
module.exports = app;
