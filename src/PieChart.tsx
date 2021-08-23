import React, { Children } from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape'; 
import { followAngle, generateColorScale, Coords, arcAngle, radiansToDegrees, degreesToRadians } from './utils';
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
    renderLabels?: (datum: T, arcCoords: Coords, arcAngle: number) => JSX.Element;
    getColor?: ((datum: T) => string);
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
        renderLabels,
        getColor,
        sortComparator,
        hideLabels
    } = props;

    const getArcColor = React.useCallback(generateColorScale(data.map(getIdentifier)),
        [data, getIdentifier]);

    const fill = (arc: PieArcDatum<T>): string => {
        if (getColor) {
            return getColor(arc.data);
        }

        return  getArcColor(getIdentifier(arc.data));
    }

    const centroid = (coords: Coords, arc: PieArcDatum<T>) => {
        if (!renderLabels) {
            return null;
        }

        if (hideLabels && hideLabels(arc.data, arc.endAngle - arc.startAngle)) {
            return null;
        }

       return renderLabels(arc.data, coords, arcAngle(arc));
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
                        fill={fill}
                        centroid={centroid}
                        pieSort={sortComparator}
                        padAngle={degreesToRadians(0.5)}
                    />
                </Group>
            </ScaleSVG>
        </div>
    );
}

export default PieChart;

// helper component for stem labels
interface RadialStemProps {
    angle: number;
    coords: Coords;
    stemOffset: number;
    baseStemLength?: number;
    children: (position: Coords) => JSX.Element;
}

const RadialStem = (props: RadialStemProps) => {
    const {
        angle, 
        coords, 
        stemOffset,
        baseStemLength,
        children
    } = {
        ...{
            baseStemLength: 30
        },
        ...props
    };

    const scaleStemLength = (length: number, angle: number) => {
        const normalized = Math.abs(Math.sin(angle));
        const translated = normalized - (Math.PI / 2);
        const scalar =  Math.pow(translated, 2);
        return scalar * length;
    }
     
    const stemLength = scaleStemLength(baseStemLength, angle);
    const [stemStartX, stemStartY] = followAngle(coords, stemOffset, angle);
    const [stemEndX, stemEndY] = followAngle([stemStartX, stemStartY], stemLength, angle);
    
    return (
        <g>
            {/* actual stem */}
            <line
                x1={stemStartX}
                y1={stemStartY}
                x2={stemEndX}
                y2={stemEndY}
                stroke='white'
            />
            {/* stem head */}
            {children([stemEndX, stemEndY])}
        </g>
    )
}

interface StackedLabelProps {
    coords: Coords;
    primary: string;
    secondary?: string;
    leftFacing?: boolean;
    labelLength?: number;
    labelPadding?: number;
}

const StackedLabel = <T,>(props: StackedLabelProps) => {
    const { primary, secondary, coords, leftFacing, labelLength, labelPadding } = {
        ...{
            labelLength: 60,
            labelPadding: 2,
        },
        ...props
    };

    const [x1, y1] = coords;
    const [x2, y2] = [x1 + (labelLength * (leftFacing ? -1 : 1)), y1];
    const anchorScheme = leftFacing ? 'start' : 'end';

    return (
        <g>
            <Text
                x={x2}
                y={y2 - (labelPadding || 0)}
                fill={'white'}
                textAnchor={anchorScheme}
                verticalAnchor={'end'}
                fontSize="1rem"
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
                    fontSize="1rem"
                >
                    {secondary}
                </Text>
            }
        </g>
    )
}

interface StackedStemLabelProps extends Omit<RadialStemProps, 'children'>, Omit<StackedLabelProps, 'leftFacing' | 'coords'> { }

export const StackedStemLabel = (props: StackedStemLabelProps) => {
    const { angle } = props;
    const leftFacing = angle >= Math.PI;

    return (
        <RadialStem
            {...props}
        >
            {position =>
                <StackedLabel
                    {...props}
                    leftFacing={leftFacing}
                    coords={position}
                />
            }
        </RadialStem>
    );
}