import { useMainContext } from "../contexts/MainContext";

export default function ResultsNum() {
    const { movies } = useMainContext();
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
