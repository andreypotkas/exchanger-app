import React from 'react';
import logo from './logo.svg';
import './App.scss';

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";
import Rates from './components/Rates/Rates';

function App() {
  return (
    <div className="App">
      <Rates />
    </div>
  );
}

export default App;
