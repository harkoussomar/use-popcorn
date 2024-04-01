import Nav from "./components/Nav";
import Search from "./components/Search";
import ResultsNum from "./components/ResultsNum";
import Main from "./components/Main";
import BoxModal from "./components/BoxModal";
import MovieList from "./components/MovieList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";
import { useMainContext } from "./contexts/MainContext";
import { MovieDetailsProvider } from "./contexts/MovieDetailsContext";

export default function App() {
  const { isLoading, error, selectedId } = useMainContext();

  return (
    <>
      <Nav>
        <Search />
        <ResultsNum />
      </Nav>

      <Main>
        <BoxModal>
          {!isLoading && !error && <MovieList />}
          {isLoading && <Loader />}
          {error && <ErrorMessage />}
        </BoxModal>
        <BoxModal>
          {selectedId ? (
            <MovieDetailsProvider>
              <MovieDetails />
            </MovieDetailsProvider>
          ) : (
            <>
              <WatchedSummary />
              <WatchedList />
            </>
          )}
        </BoxModal>
      </Main>
    </>
  );
}
