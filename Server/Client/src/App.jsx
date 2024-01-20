import { Route, Routes, BrowserRouter} from 'react-router-dom';
import React from 'react';

import HomePage from '../src/Pages/HomePage/HomePage'
import DetailPage from '../src/Pages/DetailPage/DetailPage'
import FormPage from '../src/Pages/FormPage/FormPage'
import LandingPage from '../src/Pages/LandingPage/LandingPage'
import AboutMe from '../src/Pages/AboutMe/Aboutme'
import Welcome from '../src/Pages/Welcome/Welcome'
import Created from '../src/Pages/Created/Created'

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path= "/" element={<LandingPage/>}/>
        <Route path= "/home" element={<HomePage/>}/>
        <Route path= "/form" element={<FormPage/>}/>
        <Route path= "/home/:id" element={<DetailPage/>}/>
        <Route path= "/aboutme" element={<AboutMe/>}/>
        <Route path= "/welcome" element={<Welcome/>}/>
        <Route path= "/created" element={<Created/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App