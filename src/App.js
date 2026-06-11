import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routers/AppRoutes.jsx';
import ScrollToTop from './Components/ScrollToTop';
import SnackbarProvider from './Components/SnackbarProvider';
function App() {
  return (
      <BrowserRouter>
      <SnackbarProvider>
      <ScrollToTop />
      <AppRoutes/>
      </SnackbarProvider>
      </BrowserRouter>
  );
}
export default App;

