import React from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape'; 
import { followAngle, generateColorScale, Coords, arcAngle } from './utils';
import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import {Text} from '@visx/text'
import {ScaleSVG} from '@visx/responsive';

import styles from './PieChart.module.css'

export interface PieChartProps<T> {
    height: number;
    width: number;
    data: T[];
    outerRadius: number;
    innerRadius?: number;
    labelThreshold?: number;
    getValue: (datum: T) => number;
    getIdentifier: (datum: T) => string;
    getArcLabel?: (datum: T) => string; // | React.Node
    getStemLabel?: (datum: T) => [primary: string, secondary?: string]; // | React.Node
    getArcColor?: ((datum: T) => string);
    sortComparator?: (datum1: T, datum2: T) => number;
    // automatically hide labels where this returns true
    hideLabels?: (datum: T, radians: number) => boolean;
}

export const PieChart = <T,>(props: PieChartProps<T>) => {
    const {
        height, 
        width, 
        innerRadius,
        outerRadius, 
        data, 
        getValue,
        getIdentifier,
        getArcLabel,
        getStemLabel,
        getArcColor,
        sortComparator,
        hideLabels
    } = props;

    const getColor = React.useCallback(generateColorScale(data.map(getIdentifier)),
        [data, getIdentifier]);

    const getArcFillColor = (arc: PieArcDatum<T>): string => {
        if (getArcColor) {
            return getArcColor(arc.data);
        }

        return  getColor(getIdentifier(arc.data));
    }

    const renderArcLabel = (coords: Coords, label: string) => {
        return (
            <Text
                x={coords[0]}
                y={coords[1]}
                textAnchor={'middle'}
                verticalAnchor={'middle'}
                fontSize={'1rem'}
                fill='white'>
                {'test'}
            </Text>
        );
    }

    const renderLabels = (coords: Coords, arc: PieArcDatum<T>) => {
        if (!getStemLabel && !getArcLabel) {
            return null;
        }

        if (hideLabels && hideLabels(arc.data, arc.endAngle - arc.startAngle)) {
            return null;
        }

        // TODO magic numbers
        const stemOffset = ((outerRadius - (innerRadius || 0)) / 2) + 2;
        return (
            <g>
                {getArcLabel &&
                    renderArcLabel(coords, getArcLabel(arc.data))}
                {getStemLabel &&
                    <StemLabel 
                        arc={arc}
                        arcCoords={coords}
                        labels={getStemLabel(arc.data)}
                        stemOffset={stemOffset}
                    />
                }
            </g>
        )
    }

    return (
        <div className={styles['container']}>
            <ScaleSVG 
                height={height}
                width={width}
            >
                <Group>
                    <Pie
                        top={height / 2}
                        left={width / 2}
                        data={data}
                        pieValue={getValue}
                        outerRadius={outerRadius}
                        innerRadius={innerRadius}
                        fill={getArcFillColor}
                        centroid={renderLabels}
                        pieSort={sortComparator}
                    />
                </Group>
            </ScaleSVG>
        </div>
    );
}

export default PieChart;

// helper component for stem labels
interface StemLabelProps<T> {
    arc: PieArcDatum<T>;
    arcCoords: Coords;
    labels: [primary: string, secondary?: string];
    stemOffset: number;
    labelLength?: number;
    labelPadding?: number;
    baseStemLength?: number;
    primaryColor?: string;
    secondaryColor?: string;
    stemColor?: string;
}

// TODO extract head into own component for reuse/flexibility
// convert primary/secondary/colors to HEAD component/labbelrenderer function
const StemLabel = <T,>(props: StemLabelProps<T>) => {
    const {
        arc, 
        arcCoords, 
        labels: [primary, secondary], 
        stemOffset,
        labelLength,
        labelPadding,
        baseStemLength,
        primaryColor,
        secondaryColor,
        stemColor
    } = {
        ...{
            labelLength: 60,
            labelPadding: 2,
            baseStemLength: 15
        },
        ...props
    };

    const renderHead = (start: Coords, arc: PieArcDatum<T>, primary: string, secondary?: string) => {
        const [x1, y1] = start;
        const leftFacing = arcAngle(arc) >= Math.PI;
        const [x2, y2] = [x1 + (labelLength * (leftFacing ? -1 : 1)), y1];
        const anchorScheme = leftFacing ? 'start' : 'end';

        return (
            <g>
                <Text
                    x={x2}
                    y={y2 - labelPadding}
                    fill={'white'}
                    textAnchor={anchorScheme}
                    verticalAnchor={'end'}
                    fontSize="14px"
                >
                    {primary}
                </Text>
                <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="white"
                />
                {secondary &&
                    <Text
                        x={x2}
                        y={y2 + labelPadding}
                        fill={'white'}
                        textAnchor={anchorScheme}
                        verticalAnchor={'start'}
                        fontSize="14px"
                    >
                        {secondary}
                    </Text>
                }
            </g>
        )
    }

    const scaleStemLength = (length: number, angle: number) => {
        const normalized = Math.abs(Math.sin(angle));
        const translated = normalized - (Math.PI / 2);
        const scalar =  2.1 * Math.pow(translated, 2);
        return scalar * length;
    }
     
    const stemAngle = arcAngle(arc);
    const stemLength = scaleStemLength(baseStemLength, stemAngle);

    const [stemStartX, stemStartY] = followAngle(arcCoords, stemOffset, stemAngle);
    const [elbowX, elbowY] = followAngle([stemStartX, stemStartY], stemLength, stemAngle);
    
    return (
        <g>
            {/* actual stem */}
            <line
                x1={stemStartX}
                y1={stemStartY}
                x2={elbowX}
                y2={elbowY}
                stroke='white'
            />
            {/* stem head */}
            {renderHead([elbowX, elbowY], arc, primary, secondary)}
        </g>
    )
}