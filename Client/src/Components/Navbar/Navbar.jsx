import React from 'react';
import './Navbar.css'

function Navbar({searchString, handleChange, handleSubmit}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
      <div className='container'>
        <form onSubmit={handleFormSubmit}>
          <input
          type="search"
          className='navbar'
          value={searchString}
          onChange={handleChange}
          placeholder='Find your Driver' />
          <button 
          className='button'
          type='submit'>Go!</button>
        </form>
      </div>
  )
}

export default Navbar
