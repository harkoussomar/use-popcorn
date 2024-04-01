import { createContext, useContext, useEffect, useReducer } from "react";

const MainContext = createContext();
const initialState = {
  movies: [],
  isLoading: false,
  error: "",
  query: "",
  selectedId: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload,
        isLoading: false,
        error: "",
      };
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: true,
        error: "",
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload,
      };
    case "SET_SELECTED_ID":
      return {
        ...state,
        selectedId: action.payload === state.selectedId ? null : action.payload,
      };
    case "QUERY<3":
      return {
        ...state,
        movies: [],
        error: "",
      };
    default:
      return state;
  }
}

function watchedReducer(state, action) {
  switch (action.type) {
    case "ADD_MOVIE":
      return [...state, action.payload];
    case "DELETE_MOVIE":
      return state.filter((movie) => movie.imdbID !== action.payload);
    default:
      return state;
  }
}

function MainProvider({ children }) {
  const [{ movies, isLoading, error, query, selectedId }, dispatch] =
    useReducer(reducer, initialState);

  const [watched, watchedDispatch] = useReducer(watchedReducer, [], () => {
    try {
      const storedWatched = localStorage.getItem("watched");
      if (storedWatched === null) {
        return [];
      }
      return JSON.parse(storedWatched);
    } catch (error) {
      console.error("Error parsing watched movies from localStorage:", error);
      return [];
    }
  });

  function handleSelectedMovie(id) {
    dispatch({ type: "SET_SELECTED_ID", payload: id });
  }

  function handleClosedMovie() {
    dispatch({ type: "SET_SELECTED_ID", payload: null });
  }

  function handleAddWatched(movie) {
    watchedDispatch({ type: "ADD_MOVIE", payload: movie });
  }
  function handleDeleteWatched(id) {
    watchedDispatch({ type: "DELETE_MOVIE", payload: id });
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchData() {
        dispatch({ type: "SET_IS_LOADING" });
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=c2062f5b&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Failed to fetch movies. Please try again later.");
          }

          const data = await res.json();

          // Check if the API response indicates an error
          if (data.Response === "False") {
            throw new Error(
              "No movies found. Please try a different search query."
            );
          }

          dispatch({ type: "SET_MOVIES", payload: data.Search });
        } catch (error) {
          // Handle specific error cases
          if (error.name === "AbortError") {
            // Request was aborted (e.g., due to component unmounting)
            console.log("Fetch request aborted:", error);
          } else {
            // Other errors (e.g., network error, invalid JSON)
            dispatch({ type: "SET_ERROR", payload: error.message });
            console.error("Fetch error:", error);
          }
        }
      }

      if (query.length < 3) {
        dispatch({ type: "QUERY<3" });
        return;
      }

      handleClosedMovie();
      fetchData();

      return  () => {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <MainContext.Provider
      value={{
        movies,
        isLoading,
        error,
        query,
        selectedId,
        watched,
        dispatch,
        onSelectedMovie: handleSelectedMovie,
        onClosedMovie: handleClosedMovie,
        onAddWatched: handleAddWatched,
        onDeleteWatched: handleDeleteWatched,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

function useMainContext() {
  const context = useContext(MainContext);
  if (context === undefined) throw new Error("Context is undefined");
  return context;
}

export { useMainContext, MainProvider };
