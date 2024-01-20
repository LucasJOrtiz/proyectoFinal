import Navbar from '../../Components/Navbar/Navbar'
import Cards from '../../Components/Cards/Cards'
import './HomePage.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getByName, getDrivers, getBySource, getByTeam, getTeams } from '../../Redux/Actions/Actions';

function HomePage() {
  const dispatch = useDispatch();
  const [searchString, setSearchString]= useState ("");
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [foundDriver, setFoundDriver] = useState(null);
  const [showCards, setShowCards] = useState(true);

  function handleChange (e){
    setSearchString (e.target.value);
    setError('');
  }

  function handleSubmit(){
    if (!searchString.trim()) {
      setError('Please enter a valid driver name.');
      return;
    }

    dispatch (getByName (searchString)).then((response) => {
      if (response.payload && response.payload.length === 0) {
        setError('Please enter a VALID driver name or CREATE a new driver');
      } else {
        setError('');
        setFoundDriver(response.payload);
      }
    });
  }

  const clearDetail = () => {
    setSearchString("");
  }

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    dispatch(getDrivers());
    dispatch(getTeams());
    handleOrderByChange({ target: { value: 'forename' } }); 
    handleOrderDirectionChange({ target: { value: 'ASC' } });
    return clearDetail;
  }, [dispatch]);

  useEffect(() => {
    if (error && error === 'Please enter a VALID driver name or CREATE a new driver') {
      setShowCards(false);
    } else {
      setShowCards(true);
    }
  }, [error]);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

//Filtros
  const allDrivers = useSelector((state)=> state.allDrivers);
  const allTeams = useSelector((state) => state.allTeams);
  const [selectedSource, setSelectedSource] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderDirection, setOrderDirection] = useState('');
  
  const handleSourceFilter = (source) => {

    if (source === 'API' || source === 'DB') {
      dispatch(getBySource(source)).then((response) => {

        if (response.payload) {
          setFilteredDrivers(response.payload);
          setSelectedSource(source);
        }
      }).catch((error) => {
        console.error('Error fetching drivers by source:', error);
        setFilteredDrivers([]);
        setSelectedSource('');
        });
        } else if (source === '') { 
          dispatch(getDrivers()).then((response) => {
            if (response.payload) {
              setFilteredDrivers(response.payload);
              setSelectedSource('');
            }
          }).catch((error) => {
            console.error('Error fetching all drivers:', error);
            setFilteredDrivers([]);
            setSelectedSource('');
          });
    } else {
      console.error('Invalid source. Please select a valid source.');
    }
    setSelectedTeam('');
  };

  const handleTeamFilter = (teamId) => {
    const selectedTeam = allTeams.find((team) => team.id === teamId);
  
    if (selectedTeam) {
      setSelectedTeam(selectedTeam.name);
      const filteredDrivers = allDrivers.filter((driver) => {
        if (typeof driver.teams === 'string') {
          return driver.teams.includes(selectedTeam.name);
        } else if (Array.isArray(driver.teams)) {
          return driver.teams.includes(selectedTeam.name);
        }
        return false;
      });
  
      setFilteredDrivers(filteredDrivers);
    } else {
      console.error("Error to find the id driver");
      setFilteredDrivers(allDrivers);
      setSelectedTeam('');
    }
  };

const handleOrderByChange = (e) => {
    setOrderBy(e.target.value);
    if (e.target.value === 'forename' || e.target.value === 'dob' || e.target.value === 'random') {
      setOrderDirection('ASC');
    } else {
      setOrderDirection('');
    }
  };
  const handleOrderDirectionChange = (e) => {
    setOrderDirection(e.target.value);
  };

  useEffect(() => {
    let filteredResults = [...allDrivers];
  
    if (selectedSource !== '') {
      if (selectedSource === 'API') {
      filteredResults = allDrivers.filter((driver) => typeof driver.id === 'number');
    } else if (selectedSource === 'DB') {
      filteredResults = allDrivers.filter((driver) => driver.created === true);
    }
  }
  
    if (selectedTeam !== '') {
      filteredResults = filteredResults.filter((driver) => driver.teams.includes(selectedTeam));
    }
  
    let sortedFilteredResults = [...filteredResults];
  
    if (orderBy === 'forename') {
      sortedFilteredResults.sort((a, b) => {
        if (orderDirection === 'ASC') {
          return a.forename.localeCompare(b.forename);
        } else if (orderDirection === 'DESC') {
          return b.forename.localeCompare(a.forename);
        }
        return 0;
      });
    } else if (orderBy === 'dob') {
      sortedFilteredResults.sort((a, b) => {
        const dateA = new Date(a.dob);
        const dateB = new Date(b.dob);
        if (orderDirection === 'newDate') {
          return dateA - dateB;
        } else if (orderDirection === 'oldDate') {
          return dateB - dateA;
        }
        return 0;
      });
    } else if (orderBy === 'random') {
      sortedFilteredResults.sort(() => Math.random() - 0.5);
    }
  
    setFilteredDrivers(sortedFilteredResults);
  }, [selectedSource, selectedTeam, orderBy, orderDirection, allDrivers]);

  useEffect(() => {
    setOrderBy('random');
  }, []);
  
return (
  <div className='home'>
    <div className="header-container">
      <h2 className='title'>
      <a href="/home">Home</a>
        <button className="nav-button">
          <Link to="/welcome">Welcome</Link>
        </button>
        <button className="nav-button">
          <Link to="/form">Create a Driver</Link>
        </button>
      <button className="nav-button">
          <Link to="/aboutme">About Me</Link>
        </button>
      </h2>
    </div>
    
      <Navbar 
      searchString={searchString}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      error={error}
      setError={setError}
      />
      
      {error && (
        <div className="error-container">
          <p className="message">{error}</p>
          <button className="clear-error" onClick={clearError}>x</button>
        </div>
      )}

      <div className="filter-container">
        <div className="filter">
          <p>Drivers from: </p>
          <select 
            value={selectedSource} 
            onChange={(e) => handleSourceFilter(e.target.value)}>
            <option value="">All Sources</option>
            <option value="API">API</option>
            <option value="DB">Database</option>
          </select>
        </div>

        <div className="filter">
        <p>Working with: </p>
        <select 
            value={selectedTeam ? selectedTeam.id : -1}
            onChange={(e) => handleTeamFilter(e.target.value)}
          >
            <option value={-1}>All Teams</option>
            {allTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

      <div className="filter">
      <p>Order by: </p>
        <select value={orderBy} onChange={handleOrderByChange}>
          <option value="random">Random</option>
          <option value="forename">Name</option>
          <option value="dob">Birthday</option>
        </select>

        <select value={orderDirection} onChange={handleOrderDirectionChange}>
          {orderBy === 'forename' ? (
            <>
          <option value="ASC">A-Z</option>
          <option value="DESC">Z-A</option>
          </>
          ) : orderBy === 'dob' ? (
            <>
          <option value="oldDate">Youngest</option>
          <option value="newDate">Older</option>
          </>
          ) : null}
        </select>
      </div>

      </div>

      {showCards && (
      <Cards
        allDrivers={foundDriver ? [foundDriver] : allDrivers}
        sortedFilteredDrivers={filteredDrivers}
        currentPage={currentPage}
        changePage={changePage}
      />
      )}
  </div>
  );
}

export default HomePage