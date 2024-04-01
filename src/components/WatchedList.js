import { useMainContext } from "../contexts/MainContext";
import WatchedMovie from "./WatchedMovie";

export default function WatchedList() {
  const { watched } = useMainContext();

  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
