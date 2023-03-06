import React from 'react';
import './App.css';

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  return (
    <div className="App">
    </div>
  );
}

export default App;
