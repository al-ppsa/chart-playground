import logo from './logo.svg';
import React, { useState } from 'react';
import { VisxTest } from './VisxTest';
import { NivoTest } from './NivoTest';
import './App.css';

const width: number = 600;
const height: number = 600;
const radius: number = 200;
const thickness: number = 40;

function App() {
  const [displayingVisx, setDisplayingVisx] = useState<boolean>(true);
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setDisplayingVisx(!displayingVisx)}>toggle library</button>
        {displayingVisx
        ? <VisxTest 
            height={height}
            width={width}
            radius={radius}
            thickness={thickness}
        />
        : <NivoTest />
      }
      </header>
    </div>
  );
}

export default App;
