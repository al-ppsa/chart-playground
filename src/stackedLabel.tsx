import { Coords } from "./utils";
import { Text } from '@visx/text';

export interface StackedLabelProps {
    coords: Coords;
    primary: string;
    secondary?: string;
    leftFacing?: boolean;
    labelLength?: number;
    labelPadding?: number;
}

export function StackedLabel<T,>(props: StackedLabelProps) {
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

export default StackedLabel;