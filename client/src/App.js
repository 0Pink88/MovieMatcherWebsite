import React, { useState, useEffect } from 'react';
import SwipeCard from './components/SwipeCard';


function App() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetching movies from TMDB
useEffect(() => {
  const fetchMovies = async () => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY; // pulling API key from env file
    const page = Math.floor(Math.random() * 500) +1; // Random page number between 1 and 500
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`);
      const data = await res.json(); // Parse the response as JSON
      const filteredMovies = data.results.filter(movie => movie.poster_path); // Filter out movies without a poster
      console.log("Fetched movies:", filteredMovies); // Log the fetched movies
      setMovies(filteredMovies); // Update state with filtered movies
    } catch (error) {
      console.error("Error fetching movies:", error); // Log any errors
    }
  };
  fetchMovies(); // call the async function inside useEffect
}, []);


  const handleLike = (movie) => {
    console.log("Liked:", movie.title);
    saveLikedMovie(movie);
    nextMovie();

  };

  const handleDislike = (movie) => {
    console.log("Disliked:", movie.title);
    saveDislikedMovie(movie)
    nextMovie();
  };

  const handleClear = () => {
    localStorage.clear();
    console.log("Cleared movie storage");
  };

  const nextMovie = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("No more movies!");
    }
  };

  //Add liked movies to a liked web-cache for now
  const saveLikedMovie = (movie) => {
    let liked = JSON.parse(localStorage.getItem('likedMovies')) || [];

    //only store movie id and title
    const simplifiedMovie = {
      id: movie.id,
      title: movie.title
    };

    liked.push(simplifiedMovie);
    localStorage.setItem('likedMovies', JSON.stringify(liked));
  };

  //Add disliked movies to a disliked web-cache for now
  const saveDislikedMovie = (movie) => {
    let disliked = JSON.parse(localStorage.getItem('dislikedMovies')) || [];

    const simplifiedMovie = {
      id: movie.id,
      title: movie.title
    };

    disliked.push(simplifiedMovie);
    localStorage.setItem('dislikedMovies', JSON.stringify(disliked));
  };


  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎬 Movie Matcher</h1>
      <SwipeCard
        movie={movies[currentIndex]}
        onLike={handleLike}
        onDislike={handleDislike}
        onClear={handleClear}
      />
    </div>
  );
}

export default App;