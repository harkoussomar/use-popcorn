import { useMainContext } from "../contexts/MainContext";
import Movie from "./Movie";

export default function MovieList() {
  const { movies } = useMainContext();
  
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}
