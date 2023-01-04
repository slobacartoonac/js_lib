import { Vector } from "../shapes/vector"
function boxOverlapAny(aStartA, aWithA, aStartB, aWithB) {
    let startA = new Vector(aStartA)
    let withA = new Vector(aWithA)
    let startB = new Vector(aStartB)
    let withB = new Vector(aWithB)

    return boxOverlap(startA, withA, startB, withB)
}

function boxOverlap(startA, withA, startB, withB) {

    // If one rectangle is on left side of other
    let endA = startA.add(withA)
    let endB = startB.add(withB)

    if (startA.x > endB.x || startB.x > endA.x)
        return false;

    // If one rectangle is above other
    if (startA.y > endB.y || startB.y > endA.y)
        return false;

    return true;
}

function pointInBoxAny(positionsA, boxA, point) {
    let vecPositions = new Vector(positionsA)
    let vecBoxA = new Vector(boxA)
    let vecPoint = new Vector(point)
    return pointInBox(vecPositions, vecBoxA, vecPoint)
}

function pointInBox(positions, boxA, point) {
    if (positions[0] > point[0] ||
        positions[1] > point[1]) {
        return false
    }
    if ((positions[0] + boxA[0]) < point[0] ||
        (positions[1] + boxA[1]) < point[1]) {
        return false
    }
    return true
}

export {
    pointInBox,
    boxOverlap,
    boxOverlapAny,
    pointInBoxAny
}