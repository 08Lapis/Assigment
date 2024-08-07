import React, {} from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';
import Form from './Form';
import Table from './Table';
import Edit from './Edit';

function App() {
  return (
    <div>
      <Nav />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/form' element={<Form />} />
          <Route path='/form/:paraId' element={<Form />} />
          <Route path='/table' element={<Table />} />
          <Route path='/edit/:paraId' element={<Edit />} />
      </Routes>
    </div>
  );
}
export default App;

