// http://www.omdbapi.com/?i=tt3896198&apikey=d1d9a944

const movieSearchBox = document.getElementById('movie-search-box')
const searchList = document.getElementById('search-list')
const resultGrid = document.getElementById('result-grid')

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=d1d9a944`
  const res = await fetch(`${URL}`)
  const data = await res.json()
  // console.log(data.Search)
  if (data.Response == 'True') displayMovieList(data.Search)
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim()

  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list')
    loadMovies(searchTerm)
  } else {
    searchList.classList.add('hide-search-list')
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = ''

  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div')
    movieListItem.dataset.id = movies[idx].imdbID
    movieListItem.classList.add('search-list-item')

    if (movies[idx].Post !== 'N/A') {
      moviePoster = movies[idx].Poster
    } else {
      moviePoster = 'image_not_found.png'
    }

    if (moviePoster !== 'N/A') {
      movieListItem.innerHTML = `
    <div class="search-item-thumbnail">
      <img src="${moviePoster}">
    </div>
    <div class="search-item-info">
      <h3>${movies[idx].Title}</h3>
      <p>${movies[idx].Year}</p>
    </div>
    `
    }

    searchList.appendChild(movieListItem)
  }
  loadMovieDetails()
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item')

  searchListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list')
      movieSearchBox.value = ''
      const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=d1d9a944`)
      const movieDetails = await result.json()

      displayMovieDetails(movieDetails)
    })
  })
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
  <div class="movie-poster">
    <img src="${details.Poste !== 'N/A' ? details.Poster : 'image_not_found.png'}" alt="영화 포스터" />
  </div>
  <div class="movie-info">
    <h3 class="movie-title">${details.Title}</h3>
    <ul class="movie-misc-info">
      <li class="year">${details.Year}</li>
      <li class="rated">${details.Rated}</li>
      <li class="released">${details.Released}</li>
    </ul>
    <p class="genre"><b>장르: </b>${details.Genre}</p>
    <p class="writer"><b>작가: </b>${details.Writer}</p>
    <p class="actors"><b>배우: </b>${details.Actors}</p>
    <p class="plot"><b>구성: </b>${details.Plot}</p>
    <p class="language"><b>언어: </b>${details.Language}</p>
    <p class="awards">
    <b><i class="fas fa-award"></i></b>${details.Awards}
    </p>
  </div>
  `
}

window.addEventListener('click', (event) => {
  if (event.target.className !== 'form-control') {
    searchList.classList.add('hide-search-list')
  }
})