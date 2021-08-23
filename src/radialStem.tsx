import { Coords, followAngle } from "./utils";

export interface RadialStemProps {
    angle: number;
    coords: Coords;
    stemOffset: number;
    baseStemLength?: number;
    children: (position: Coords) => JSX.Element;
}

export function RadialStem (props: RadialStemProps) {
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

export default RadialStem;