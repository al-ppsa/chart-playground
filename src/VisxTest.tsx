import React from 'react';

import Pie from '@visx/shape/lib/shapes/Pie';
import { letterFrequency } from '@visx/mock-data';
import { Group } from '@visx/group';

export interface VisxProps {
    width: number;
    height: number;
    radius: number;
    thickness: number;
}
export const VisxTest = (props: VisxProps) => {
    const { width, height, radius, thickness } = props;
    const [showLabels, setShowLabels] = React.useState<boolean>(false);

    // when rendering colors this way (vs, say, a static string "rgb(0, 0, 255)") I can't seem to get 
    // the full value. Everythign is very dull...unsure if there's some svg quirk I don't know about
    const getColor = (data: {letter: string, frequency: number}) => {
        const freqMod = data.frequency * 10;
        const r = Math.random() * 255;
        const g = Math.random() * 255; 
        const b = Math.random() * 255;
        return `rgb(${r}, ${g}, ${b})`
    }

    const getCentroid = (data: {letter: string, frequency: number}, coords: [x: number, y: number]) => {
        const [x, y] = coords;
        const [cX, cY] = [0, 0];
        const [diffX, diffY] = [x-cX, y-cY];
        const scale = 0.4;
        const [adjX, adjY] = [x + diffX*scale, y + diffY*scale];

        return (
            <g>
                <text 
                    x={adjX} 
                    y={adjY} 
                    textAnchor="middle"
                >
                    {data.letter}
                </text>
                <line
                    x1={x}
                    x2={adjX}
                    y1={y}
                    y2={adjY}
                    stroke="black"
                />
            </g>
        )
    }

    return (
        <>
            <h1>Visx Test</h1>
            <p>minimal example of donut chart in visx </p>
            <svg height={height} width={width}>
                <Group>
                    <text x={width/2} y={height/2} fill="white" textAnchor="middle">Donut Chart</text>
                    <Pie
                        top={height / 2}
                        left={width / 2}
                        data={letterFrequency}
                        outerRadius={radius}
                        innerRadius={radius - thickness}
                        pieValue={l => l.frequency}
                        //endAngle={Math.PI * 3 / 2}
                        fill={s => getColor(s.data)}
                        centroid={showLabels ? (xy, arc) => getCentroid(arc.data, xy) : undefined}
                    />
                </Group>
            </svg>
            <button onClick={() => setShowLabels(!showLabels)}>Toggle Labels</button>
        </>
    )
}