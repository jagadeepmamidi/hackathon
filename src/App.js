import React from 'react';
import MetaMaskAuth from './MetaMaskAuth';
import Dashboard from './Dash';



function App() {
  return (
    <div className="App">
      <h1>MetaMask Authentication</h1>
      <MetaMaskAuth />
      <Dashboard />
      
    </div>
  );
}

export default App;