import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './Register';
import Welcome from './Welcome';
import Login from './Login';

export default function Phreddit() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
