const apiUrl = '/api/movies';
const form = document.getElementById('movieForm');
const table = document.getElementById('movieTable');

// Fetch and display all movies
async function fetchMovies() {
    const res = await fetch(apiUrl);
    const movies = await res.json();
    table.innerHTML = '';
    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.director || ''}</td>
            <td>${movie.year || ''}</td>
            <td>${movie.genre || ''}</td>
            <td>
                <button onclick="editMovie('${movie._id}')">Edit</button>
                <button onclick="deleteMovie('${movie._id}')">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Edit movie
window.editMovie = async (id) => {
    const res = await fetch(`${apiUrl}/${id}`);
    const movie = await res.json();
    form.movieId.value = movie._id;
    form.title.value = movie.title;
    form.director.value = movie.director || '';
    form.year.value = movie.year || '';
    form.genre.value = movie.genre || '';
};

// Delete movie
window.deleteMovie = async (id) => {
    if (confirm('Delete this movie?')) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchMovies();
    }
};

// Handle form submission with frontend validation
form.onsubmit = async (e) => {
    e.preventDefault();
    if (!form.title.value.trim()) {
        alert('Title is required!');
        return;
    }
    const data = {
        title: form.title.value.trim(),
        director: form.director.value.trim(),
        year: form.year.value ? Number(form.year.value) : undefined,
        genre: form.genre.value.trim()
    };
    const id = form.movieId.value;
    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
    form.reset();
    fetchMovies();
};

// Initial load
fetchMovies();