export function worldToScreen(
    viewCenterX,
    viewCenterY,
    viewScale,
    screenW,
    screenH,
    pointX,
    pointY) {
    const widthHalf = screenW / 2
    const heightHalf = screenH / 2
    var screenX = (pointX - viewCenterX) * viewScale + widthHalf
    var screenY = (pointY - viewCenterY) * viewScale + heightHalf
    return [screenX, screenY]
}

export function screenToWorld(
    viewCenterX,
    viewCenterY,
    viewScale,
    screenW,
    screenH,
    pointX,
    pointY) {
    const widthHalf = screenW / 2
    const heightHalf = screenH / 2
    var worldX = (pointX - widthHalf) / viewScale + viewCenterX
    var worldY = (pointY - heightHalf) / viewScale + viewCenterY
    return [worldX, worldY]
}