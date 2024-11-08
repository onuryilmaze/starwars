import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Starships.css';

const Starships = () => {
  const [starships, setStarships] = useState([]);
  const [nextPage, setNextPage] = useState('https://swapi.dev/api/starships/');
  const [selectedStarship, setSelectedStarship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(5); 

  const getImagePath = (index) => `./starships-images/${index}.jpg`;

  useEffect(() => {
    if (nextPage) {
      axios.get(nextPage)
        .then(response => {
          setStarships(prevStarships => {
            const allStarships = [...prevStarships, ...response.data.results];
            const uniqueStarships = Array.from(new Set(allStarships.map(starship => starship.name)))
              .map(name => allStarships.find(starship => starship.name === name));

            const starshipsWithImages = uniqueStarships.map((starship, index) => ({
              ...starship,
              imageIndex: index + 1
            }));

            return starshipsWithImages;
          });
          setNextPage(response.data.next);
        })
        .catch(error => console.error(error));
    }
  }, [nextPage]);

  const handleSearch = () => {
    axios.get(`https://swapi.dev/api/starships/?search=${searchTerm}`)
      .then(response => {
        const uniqueStarships = Array.from(new Set(response.data.results.map(starship => starship.name)))
          .map(name => response.data.results.find(starship => starship.name === name));

        const starshipsWithImages = uniqueStarships.map((starship, index) => ({
          ...starship,
          imageIndex: index + 1
        }));

        setStarships(starshipsWithImages);
        setDisplayCount(12); 
      })
      .catch(error => console.error(error));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStarshipClick = (starship) => {
    setSelectedStarship(starship);
  };

  const handleBack = () => {
    setSelectedStarship(null);
  };

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };

  return (
    <div className="starships-container">
      {selectedStarship ? (
        <div className="starship-detail">
          <h2>{selectedStarship.name}</h2>
          <img src={getImagePath(selectedStarship.imageIndex)} alt={selectedStarship.name} />
          <p><strong>Model:</strong> {selectedStarship.model}</p>
          <p><strong>Passenger Capacity:</strong> {selectedStarship.passengers}</p>
          <p><strong>Max Speed in Atmosphere:</strong> {selectedStarship.max_atmosphering_speed}</p>
          <p><strong>Manufacturer:</strong> {selectedStarship.manufacturer}</p>
          <p><strong>Crew:</strong> {selectedStarship.crew}</p>
          <p><strong>Cargo Capacity:</strong> {selectedStarship.cargo_capacity}</p>
          <button id="btmp" onClick={handleBack}>Back to Main Page</button>
        </div>
      ) : (
        <div className="starships-list">
          <header className="header">
            <div className="logo"></div>
            <input
              type="text"
              placeholder="Search by Name or Model"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button id="search" onClick={handleSearch}>Search</button>
          </header>

          <ul>
            {starships.slice(0, displayCount).map((starship) => (
              <li key={starship.name} onClick={() => handleStarshipClick(starship)}>
                <h2 className="starship-name">{starship.name}</h2>
                <img src={getImagePath(starship.imageIndex)} alt={starship.name} />
                <div className="model-speed">
                  <p><strong>Model:</strong> {starship.model}</p>
                  <p><strong>Speed:</strong> {starship.max_atmosphering_speed}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="load">
            {displayCount < starships.length && (
              <button id="loadmore" onClick={handleLoadMore}>Load More</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Starships;
