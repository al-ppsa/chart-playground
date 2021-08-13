import React from 'react';
import { Pie } from '@nivo/pie';

// using visx here for their sick mock data library
import { letterFrequency } from '@visx/mock-data';
const data = letterFrequency.map(datum => ({
    id: datum.letter,
    label: datum.letter,
    value: datum.frequency,
    color: `rgba(150, 160, 255, ${1 - (1 - datum.frequency * 10)})`

}))

export interface NivoProps {
    width: number;
    height: number;
    radius: number;
    thickness: number;
}

export const NivoTest = (props: NivoProps) => {
    const {height, width, radius, thickness} = props;
    const [showLabels, setShowLabels] = React.useState<boolean>(false);

    const marginX: number = (width / 2) - radius;
    const marginY: number = (height / 2) - radius;

    return (
        <>
            <h1>Nivo Test</h1>
            <p>minimal example of donut chart in nivo </p>
            <div style={{ height: height, width: width }}>
                <Pie
                    height={height}
                    width={width}
                    innerRadius={ 1 - (thickness / radius)}
                    data={data}
                    margin={{top: marginY, left: marginX, bottom: marginY, right: marginX}}
                    enableArcLinkLabels={showLabels}
                    enableArcLabels={false}
                    arcLinkLabel={'label'}
                    arcLinkLabelsTextColor={'#fff'}
                    // christ this is an awful statement
                    //colors={datum => data.find((d) => d.id = datum.id.toString())?.color || 'blue'}
                />

            </div>
            <button onClick={() => setShowLabels(!showLabels)}>Toggle Labels</button>
        </>
    )
}