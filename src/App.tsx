import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BinaryExpansion } from './i-module/binary-expansion';

function App() {
  return (
    <div style={{padding: '1rem', maxWidth: '100vw'}}>
      <BinaryExpansion power={2}></BinaryExpansion>
    </div>
  );
}

export default App;
