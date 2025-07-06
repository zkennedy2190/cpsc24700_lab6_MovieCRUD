const apiUrl = '/api/movies';
const form = document.getElementById('movieForm');
const table = document.getElementById('movieTable');

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
window.editMovie = async (id) => {
    const res = await fetch(`${apiUrl}/${id}`);
    const movie = await res.json();
    document.getElementById('movieId').value = movie._id;
    document.getElementById('title').value = movie.title;
    document.getElementById('director').value = movie.director || '';
    document.getElementById('year').value = movie.year || '';
    document.getElementById('genre').value = movie.genre || '';
};
window.deleteMovie = async (id) => {
    if (confirm('Delete this movie?')) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchMovies();
    }
};
form.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        title: form.title.value,
        director: form.director.value,
        year: form.year.value,
        genre: form.genre.value
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
fetchMovies();