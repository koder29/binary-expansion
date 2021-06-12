import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BinaryExpansion } from './i-module/binary-expansion';
import { Generations } from './i-module/generations';

function App() {
  return (
    <div style={{padding: '1rem', maxWidth: '100vw'}}>
      <Generations></Generations>
    </div>
  );
}

export default App;
