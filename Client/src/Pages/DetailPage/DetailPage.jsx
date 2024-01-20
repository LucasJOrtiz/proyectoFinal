import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getById, clearDetail } from '../../Redux/Actions/Actions';
import Default from '../../assets/Default.png';

import './DetailPage.css'

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const driverDetails = useSelector((state) => state.driverDetails);

  useEffect(() => {
    dispatch(getById(id))
    .then(() => setIsLoading(false)) 
    .catch(() => {
      setIsLoading(false);
      dispatch(clearDetail());
    });
  }, [dispatch, id]);

  if (isLoading) {
    return <div>Loading driver...</div>; 
  }

  if (!driverDetails || Object.keys(driverDetails).length === 0) {
    return <div>Driver details not found</div>;
  }

  const renderImage = () => {
    const image = driverDetails.data.image;
    if (image && image.url !== '') {
      return <img src={image} alt={`${driverDetails.data.forename} ${driverDetails.data.surname}`} />;
    } else {
      return <img src={Default} alt="Default" />;
    }
  };

  const generateSearchLink = () => {
    const { forename, surname } = driverDetails.data;
    const searchQuery = `${forename}+${surname}+F1+race+career`;
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    return searchUrl;
  };

  return (
    <div className="detail-page">
      <div className="navigation-buttons">
        <button className="nav-button">
          <Link to="/welcome">Welcome</Link>
        </button>
        <button className="nav-button">
          <Link to="/home">Home</Link>
        </button>
        <button className="nav-button">
          <Link to="/aboutme">About Me</Link>
        </button>
      </div>
      <div className="image-container">{renderImage()}</div>
      <div className="driver-details">
      <h1>🚦 This is {driverDetails.data.forename} {driverDetails.data.surname} 🚦</h1>
      <p><strong>Nationality:</strong> {driverDetails.data.nationality}</p>
      <p><strong>Birthday:</strong> {driverDetails.data.dob}</p>
      <p><strong>History:</strong> {driverDetails.data.description}</p>
      <p><strong>Working with:</strong> {driverDetails.data.teams}</p>
      <p><strong>Visit</strong> {" "}
      <a href={generateSearchLink()} target="_blank" rel="noopener noreferrer">
            {driverDetails.data.forename} {driverDetails.data.surname} For more info...
          </a> 🏁
          </p>
    </div>
      <div className="text"><p>- {driverDetails.data.id} -</p></div>
    </div>
  );
}

export default DetailPage;