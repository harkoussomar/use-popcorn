import StarRating from "./StarRating";
import Loader from "./Loader";
import { useMainContext } from "../contexts/MainContext";
import { useMovieDetails } from "../contexts/MovieDetailsContext";

export default function MovieDetails() {
  const { onClosedMovie } = useMainContext();
  const {
    isLoading,
    userRating,
    isWatched,
    watchedUserRating,
    title,
    poster,
    runtime,
    imdbRating,
    plot,
    released,
    actors,
    director,
    genre,
    onAdd,
  } = useMovieDetails();

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClosedMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} size={24} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={onAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
