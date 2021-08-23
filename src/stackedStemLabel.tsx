import React from "react";
import RadialStem, { RadialStemProps } from "./radialStem";
import StackedLabel, { StackedLabelProps } from "./stackedLabel";

export interface StackedStemLabelProps extends Omit<RadialStemProps, 'children'>, Omit<StackedLabelProps, 'leftFacing' | 'coords'> { }

export function StackedStemLabel(props: StackedStemLabelProps) {
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
 
export default StackedStemLabel;