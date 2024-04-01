import { useMainContext } from "../contexts/MainContext";

export default function ErrorMessage() {
  const { error } = useMainContext();
  
  return (
    <p className="error">
      <span>⛔</span> {error}
    </p>
  );
}
