import logo from './logo.svg';
import React, { useState } from 'react';
import { VisxTest } from './VisxTest';
import { NivoTest } from './NivoTest';
import {DonutChart} from './DonutChart';
import {StackedStemLabel} from './PieChart';
import {exoplanets} from '@visx/mock-data';
import './App.css';
import { pointAlongLine, radiansToDegrees } from './utils';
import {Text} from '@visx/text';

const width: number = 800;
const height: number = 800;
const radius: number = 200;
const thickness: number = 60;

function App() {
  const [displayingVisx, setDisplayingVisx] = useState<boolean>(true);
  const [toggle, setToggle] = useState<number>(0);
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setDisplayingVisx(!displayingVisx)}>toggle library</button>
        <DonutChart
          key={toggle}
          data={exoplanets.slice(0, 20)}
          outerRadius={radius}
          thickness={thickness}
          getValue={p => p.radius}
          getIdentifier={p => p.name}
          renderLabels={(datum, coords, angle) => {
            return (
              <>
                <Text
                  x={coords[0]}
                  y={coords[1]}
                  textAnchor={'middle'}
                  verticalAnchor={'middle'}
                  fontSize={'1rem'}
                  fill='white'>
                  {datum.name}
                </Text>
                <StackedStemLabel 
                  labelLength={100}
                  angle={angle}
                  coords={coords}
                  stemOffset={thickness/ 2}
                  primary={datum.name}
                  secondary={datum.radius.toString()}
                />
              </>
            )
          }}
          sortComparator={(d1, d2) => {
            const r = Math.random();
            if (r < 0.5) {
              return -1;
            }
            if (r > 0.5) {
              return 1;
            }
            return 0;

          }}
          hideLabels={(d, rad) => radiansToDegrees(rad) < 5}
        />
        <button onClick={() => toggle ? setToggle(0) : setToggle(1)}>randomize</button>
        </header>
    </div>
    );
}

export default App;
