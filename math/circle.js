function circleDistance ( posA, circleA, posB, circleB)
{
    var distanceX = (posA[0]-posB[0])
    var distanceY = (posA[1]-posB[1])
    var distance=Math.sqrt(
        distanceX*distanceX
        +distanceY*distanceY)
    return distance - circleA - circleB
}

export {
    circleDistance,
}