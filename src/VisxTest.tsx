import React from 'react';

import Pie, { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { letterFrequency, exoplanets } from '@visx/mock-data';
import { Group } from '@visx/group';
import {Text} from '@visx/text';
import { followAngle } from './utils';

export interface VisxProps {
    width: number;
    height: number;
    radius: number;
    thickness: number;
}


export const VisxTest = (props: VisxProps) => {
    const { width, height, radius, thickness } = props;
    const [showLabels, setShowLabels] = React.useState<boolean>(false);

    const getColor = (data: {letter: string, frequency: number}) => {
        const freqMod = data.frequency * 10;
        const r = Math.random() * 255;
        const g = Math.random() * 255; 
        const b = Math.random() * 255;
        return `rgb(${r}, ${g}, ${b})`
    }

    const getCentroid = (data: {letter: string, frequency: number}, coords: [x: number, y: number], arc: PieArcDatum<any>) => {
        const [centroidX, centroidY] = coords;
        const angle = (arc.startAngle + arc.endAngle) / 2;
        const baseStemLength = 15;
        const stemLengthMod = getStemLengthMod(angle);
        const stemLength = baseStemLength * stemLengthMod; 
        const separation = 2;
        const stemLabelOffset = 2;
        const stemLeft = centroidX < 0;
        // considered trying to do a transform on this, but the length is too finicky 
        const forearmLength = 80;
        const [outerX, outerY] = followAngle(coords, (thickness / 2) + separation, angle);
        const [elbowX, elbowY] = followAngle([outerX, outerY], stemLength, angle);
        const [adjX, adjY] = [stemLeft ? elbowX - forearmLength : elbowX + forearmLength, elbowY]

        return (
            <>
                <Text 
                    x={adjX} 
                    y={elbowY - stemLabelOffset} 
                    fill={'white'}
                    textAnchor={`${stemLeft ? 'start' : 'end'}`}
                    verticalAnchor={'end'}
                    fontSize="14px"
                >
                        {`letter: ${data.letter}`}
                </Text>
                <Text 
                    x={adjX} 
                    y={elbowY + stemLabelOffset} 
                    fill={'white'}
                    textAnchor={`${stemLeft ? 'start' : 'end'}`}
                    verticalAnchor={'start'}
                    fontSize="14px"
                >
                        {/*`${data.frequency}`*/}
                        {arc.startAngle.toFixed(4)}
                </Text>
                <line
                    x1={elbowX}
                    y1={elbowY}
                    x2={outerX}
                    y2={outerY}
                    stroke="white"
                />
                <line
                    x1={elbowX}
                    y1={elbowY}
                    x2={adjX}
                    y2={adjY}
                    stroke="white"
                />
                <Text
                    x={centroidX}
                    y={centroidY}
                    textAnchor={'middle'}
                    verticalAnchor={'middle'}
                    fontSize={'1rem'}
                    fill='white'
                >
                    {data.letter}
                </Text>
            </>
        )
    }

    const getLabelHead = () => {


    }

    const getArcMiddle = <T,>(arc: PieArcDatum<T>) => {


    }

    return (
        <>
            <h1>Visx Test</h1>
            <p>minimal example of donut chart in visx </p>
            <svg height={height} width={width}>
                <Group>
                    <Pie
                        top={height / 2}
                        left={width / 2}
                        data={letterFrequency}
                        outerRadius={radius}
                        innerRadius={radius - thickness}
                        pieValue={l => l.frequency}
                        fill={s => getColor(s.data)}
                        centroid={showLabels ? (xy, arc) => getCentroid(arc.data, xy, arc) : undefined}
                        pieSort={(a, b) => a.letter.localeCompare(b.letter)}
                    />
                </Group>
            </svg>
            <button onClick={() => setShowLabels(!showLabels)}>Toggle Labels</button>
        </>
    )
}


const getStemLengthMod = (angle: number) => {
    const normalized = Math.abs(Math.sin(angle));
    const translated = normalized - (Math.PI / 2);
    return 1.3 * Math.pow(translated, 4);
}