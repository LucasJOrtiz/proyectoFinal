import React from 'react';
import Default from '../../assets/Default.png';
import { Link } from "react-router-dom";

import './Card.css'

function Card({ driver }) {
  const { forename, surname, teams, image, id } = driver;
  const fullName = `${forename} ${surname}`;
  const formattedTeams = teams ? teams : 'No teams provided';

  const renderImage = () => {
    if (image && image.url !== '') {
      return <img src={image} alt={fullName} />;
    } else {
      return <img src={Default} alt="Default" />;
    }
  };

  return (
      <div className='card'>
        <Link to = {`/home/${id}`}>
        {renderImage()}
        <h2>{fullName}</h2>
        <p>{formattedTeams}</p>
        </Link>
      </div>
  )
}

export default Card