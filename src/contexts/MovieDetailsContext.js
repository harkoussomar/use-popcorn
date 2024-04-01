import { createContext, useContext, useEffect, useReducer } from "react";
import { useMainContext } from "./MainContext";

const MovieDetailsContext = createContext();
const KEY = "c2062f5b";
const initialState = {
  movie: {},
  isLoading: false,
  userRating: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MOVIE":
      return {
        ...state,
        movie: action.payload,
        isLoading: false,
      };
    case "SET_IS-LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_USER_RATING":
      return {
        ...state,
        userRating: action.payload,
      };
    default:
      return state;
  }
}

function MovieDetailsProvider({ children }) {
  const { selectedId, onClosedMovie, onAddWatched, watched } = useMainContext();

  const [{ movie, isLoading, userRating }, MovieDetailsDispatch] = useReducer(
    reducer,
    initialState
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onClosedMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        MovieDetailsDispatch({ type: "SET_IS-LOADING", payload: true });
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        MovieDetailsDispatch({ type: "SET_MOVIE", payload: data });
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;

      return function () {
        document.title = "USEPOPCORN";
      };
    },
    [title]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        onClosedMovie();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClosedMovie]);
  return (
    <MovieDetailsContext.Provider
      value={{
        movie,
        isLoading,
        userRating,
        isWatched,
        watchedUserRating,
        title,
        year,
        poster,
        runtime,
        imdbRating,
        plot,
        released,
        actors,
        director,
        genre,
        MovieDetailsDispatch,
        onAdd: handleAdd,
      }}
    >
      {children}
    </MovieDetailsContext.Provider>
  );
}

function useMovieDetails() {
  const context = useContext(MovieDetailsContext);
  if (context === undefined) throw new Error("Context is undefined");
  return context;
}

export { MovieDetailsProvider, useMovieDetails };
