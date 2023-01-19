import { interpolate } from '../../math/vec.js'

const distance = (point, pointB) => {
    var square = 0
    for (var i = 0; i < point.length; i++)
        square += (point[i] - pointB[i]) * (point[i] - pointB[i])
    return isNaN(square) || square < 1 ? 1 : Math.sqrt(square)
}

export function ImageDataPloter(context, manager) {
    this.context = context
    this.update();
    this.manager = manager
}

ImageDataPloter.prototype.update = function () {
    this.width = this.context.canvas.clientWidth
    this.height = this.context.canvas.clientHeight
    this.img = this.context.createImageData(this.width, this.height)
}
ImageDataPloter.prototype.pull = function () {
    this.img = this.context.getImageData(0, 0,
        this.width, this.height)
}

ImageDataPloter.prototype.imgRect = function (x, y, width, height, color) {
    if (color[3] == undefined) {
        color.push(Math.min(distance(color, [0, 0, 0]) * 2, 255))
    }

    const realWidth = Math.max(Math.min(width, this.width - x), 0)
    const realHeight = Math.max(Math.min(height, this.height - y), 0)
    const realX = Math.max(Math.round(x), 0)
    const realY = Math.max(Math.round(y), 0)
    const data = this.img.data
    const startX = realX * 4
    const endX = realWidth * 4 + startX
    const rowLength = this.width * 4
    const startY = realY * rowLength
    const endY = realHeight * rowLength + startY
    const over = color[3] / 255
    for (var i = startY; i < endY; i += rowLength) {
        for (var j = startX; j < endX; j += 4) {
            var ij = i + j
            data[ij] = interpolate(data[ij], color[0], over)
            data[ij + 1] = interpolate(data[ij + 1], color[1], over)
            data[ij + 2] = interpolate(data[ij + 2], color[2], over)
            data[ij + 3] = Math.max(color[3], data[ij + 3])
        }
    }
}