import { Link } from 'react-router-dom';
import './Created.css'

function Created() {

  return (
      <div>
        <div className="car-animation-container">
        <div className="car car1"></div>
        <div className="car car2"></div>
        <div className="car car5"></div>
      </div>
        <h1>Created</h1>
        <div className="car-animation-container">
        <div className="car car3"></div>
        <div className="car car4"></div>
        <div className="car car6"></div>
      </div>
        <div className="button-container">
        <Link to="/form">
          <button className="nav-button">Create Other Driver</button>
        </Link>
        <Link to="/home">
          <button className="nav-button">Search a Driver</button>
        </Link>
      </div>
      </div>
  )
}

export default Created
