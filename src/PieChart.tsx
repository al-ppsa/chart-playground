import React from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape'; 
import { generateColorScale, Coords, arcAngle, degreesToRadians } from './utils';
import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import {ScaleSVG} from '@visx/responsive';

import styles from './PieChart.module.css'

export interface PieChartProps<T> {
    viewBoxHeight?: number;
    viewBoxWidth?: number;
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
        viewBoxHeight, 
        viewBoxWidth, 
        innerRadius,
        outerRadius, 
        data, 
        getValue,
        getIdentifier,
        renderLabels,
        getColor,
        sortComparator,
        hideLabels
    } = {
        ...{
            viewBoxHeight: 800,
            viewBoxWidth: 800
        },
        ...props};

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

    /* wrap in div with default min/max values? accept sizing props? let consumer wrap in their own container */
    return (
        <div className={styles['container']}>
            <ScaleSVG 
                height={viewBoxHeight}
                width={viewBoxWidth}
            >
                    <Pie
                        top={viewBoxHeight / 2}
                        left={viewBoxWidth / 2}
                        data={data}
                        pieValue={getValue}
                        outerRadius={outerRadius}
                        innerRadius={innerRadius}
                        fill={fill}
                        centroid={centroid}
                        pieSort={sortComparator}
                        padAngle={degreesToRadians(0.5)}
                    />
            </ScaleSVG>
        </div>
    );
}

export default PieChart;