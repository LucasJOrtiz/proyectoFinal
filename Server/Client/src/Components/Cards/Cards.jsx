import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from '../Card/Card';
import { getDrivers } from '../../Redux/Actions/Actions';

import './Cards.css'

function Cards({ allDrivers, currentPage, changePage, sortedFilteredDrivers }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const driversPerPage = 9;
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const totalDrivers = sortedFilteredDrivers.length || allDrivers.length;
  const [selectedPage, setSelectedPage] = useState(currentPage);
  const currentDrivers = filteredDrivers.slice(
    indexOfFirstDriver,
    indexOfLastDriver
  );

  useEffect(() => {
    dispatch(getDrivers()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);
  
  useEffect(() => {
    setFilteredDrivers(sortedFilteredDrivers);
    if (currentPage > Math.ceil(sortedFilteredDrivers.length / driversPerPage)) {
      changePage(1); 
    }
  }, [sortedFilteredDrivers, changePage, currentPage, driversPerPage]);

  useEffect(() => {
    setSelectedPage(currentPage);
  }, [currentPage]);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalDrivers / driversPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className='cards-wrapper'>
      <div>
        {pageNumbers.map((number) => (
          <button 
          key={number} 
          onClick={() => changePage(number)} 
          className={`pagination ${selectedPage === number ? 'selected' : ''}`}>
            {number}
          </button>
        ))}
      </div>

    <div className='cards'>
      {currentDrivers.map((driver, index) => (
        <Card key={index} driver={driver} />
      ))}
    </div>
    </div>
  );
}

export default Cards