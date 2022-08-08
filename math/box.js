import { Vector } from "../shapes/vector"
function boxOverlap(positionsA, sieA, transformB, sizeB) {
    var distanceX = (positionsA[0] - transformB[0])
    var distanceY = (positionsA[1] - transformB[1])
    var distance = Math.sqrt(
        distanceX * distanceX
        + distanceY * distanceY)
    return distance - circleA - boxB
}
function pointInBox(positionsA, boxA, point) {
    let vecPositions = new Vector(positionsA)
    let vecBoxA = new Vector(boxA)
    let vecPoint = new Vector(point)
    if (vecPositions[0] > vecPoint[0] || vecPositions[1] > vecPoint[1]) {
        return false
    }
    if ((vecPositions[0] + vecBoxA[0]) < vecPoint[0]
        ||
        (vecPositions[1] + vecBoxA[1]) < vecPoint[1]) {
        return false
    }
    return true
}

export {
    pointInBox,
}