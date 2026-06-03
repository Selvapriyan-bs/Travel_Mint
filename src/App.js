import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routers/AppRoutes.jsx';
function App() {
  return (
      <>
      
      <BrowserRouter>
      <AppRoutes/>
      </BrowserRouter>
      </>
  );
}
export default App;

