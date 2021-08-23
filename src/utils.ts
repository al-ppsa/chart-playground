import { scaleOrdinal, StringLike } from "@visx/scale";
import { PieArcDatum } from "@visx/shape/lib/shapes/Pie";

export function generateColorScale<T extends string | number>(domain: T[]): (val: T) => string {
    return scaleOrdinal({
        domain: domain as StringLike[],
        range: [
            '#000000',
            '#0000FF',
            '#00FF00',
            '#FF0000',
            '#00FFFF',
            '#FF00FF',
            '#FFFF00',
            '#FFFFFF'
        ]
    });
}

export const pointAlongLine = (
    start: [x1: number, y1: number], 
    end: [x2: number, y2: number], 
    amount: number, 
): [x: number, y: number] => {
    const [x1, y1] = start;
    const [x2, y2] = end;
    const [diffX, diffY] = [x2 - x1, y2 - y1];
    const hypotenuse = Math.hypot(diffX, diffY);

    const extendHypot = hypotenuse + amount;
    const scale = extendHypot / hypotenuse;
    return [diffX * scale, diffY * scale];
}

// effectively same as pointAlongLine, but using a single point and an angle
export const followAngle = (start: [number, number], length: number, radians: number,): [number, number] => {
    const [x, y] = start;
    // hypotenuse = length, adjacent = x, opposite = y
    const dx = Math.sin(radians) * length;
    const dy = Math.cos(radians) * length;
    const adjCoords: [number, number]= [x + dx, y - dy]
    return adjCoords;
}

export type Coords = [x: number, y: number];

// get the angle that an arc is "facing"; that is, the angle of a line
// from the center of the circle through the midpoint of the arc
export function arcAngle <T,>(arc: PieArcDatum<T>) {
    return (arc.endAngle + arc.startAngle) / 2;
}

export function radiansToDegrees(radians: number) {
    return (radians % (Math.PI * 2)) * (180 / Math.PI);
}

export function degreesToRadians(degrees: number) {
    return (degrees % 360 ) * (Math.PI / 180);
}