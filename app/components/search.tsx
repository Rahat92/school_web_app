const Search = () => {
    return (
        <div>
            <label htmlFor="search" className="sr-only">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search students..."
              className="border rounded p-2"
            />
          </div>
    );
}

export default Search;