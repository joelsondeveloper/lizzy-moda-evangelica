import { FaSearch } from "react-icons/fa";

const Search = () => {
  return (
    <div className="search-bar relative h-12 flex-1 max-w-[clamp(18.75rem,80vw,30rem)] flex items-center justify-center rounded-xl bg-link-light dark:bg-link-dark border">
      <button type="submit" className="absolute right-2">
        <FaSearch />
      </button>
      <input
        type="text"
        className="w-full h-full px-4 py-2 rounded-full focus:outline-none"
        placeholder="Buscar..."
      />
    </div>
  );
};

export default Search;
