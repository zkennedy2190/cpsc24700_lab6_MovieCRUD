require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Movie Schema and Model
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, default: '' },
    year: { type: Number, default: null },
    genre: { type: String, default: '' }
});
const Movie = mongoose.model('Movie', movieSchema);

// --- CRUD ROUTES ---

// GET all movies
app.get('/api/movies', async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

// GET one movie by ID
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch {
        res.status(400).json({ error: 'Invalid movie ID' });
    }
});

// POST add new movie
app.post('/api/movies', async (req, res) => {
    try {
        if (!req.body.title) return res.status(400).json({ error: 'Title is required' });
        if (req.body.year && isNaN(req.body.year)) return res.status(400).json({ error: 'Year must be a number' });
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update movie
app.put('/api/movies/:id', async (req, res) => {
    try {
        if (!req.body.title) return res.status(400).json({ error: 'Title is required' });
        if (req.body.year && isNaN(req.body.year)) return res.status(400).json({ error: 'Year must be a number' });
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE movie
app.delete('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    } catch {
        res.status(400).json({ error: 'Invalid movie ID' });
    }
});

// Serve static frontend if needed
const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));