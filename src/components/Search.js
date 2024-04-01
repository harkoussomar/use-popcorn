import { useEffect, useRef } from "react";
import { useMainContext } from "../contexts/MainContext";

export default function Search() {
  const { query, dispatch } = useMainContext();

  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          dispatch({ type: "QUERY<3", payload: "" });
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [dispatch]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => dispatch({ type: "SET_QUERY", payload: e.target.value })}
      ref={inputEl}
    />
  );
}
