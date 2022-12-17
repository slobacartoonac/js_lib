import { interpolate, distance } from '../../math/vec.js'
import { ShapeCircle } from '../../shapes/circle.js'
import { Physics } from '../physics/physics.js'
import { Transform } from '../physics/transform'

var COLORS = 16 * 16

function GassPloter(context, manager) {
	this.context = context
	this.update();
	this.manager = manager
}

GassPloter.prototype.update = function () {
	this.width = this.context.canvas.clientWidth
	this.height = this.context.canvas.clientHeight
	this.step = 4
	this.widthSteps = this.width / this.step
	this.heightSteps = this.height / this.step
	this.number = this.widthSteps * this.heightSteps
	this.cells = {
		p: new Float32Array(this.number),
		v: new Float32Array(this.number),
		h: new Float32Array(this.number),
		o: new Uint8Array(this.number),
	}
	this.cells.p.fill(1)
	this.cells.v.fill(0)
	this.cells.h.fill(0)
	this.cells.o.fill(0)
	this.img = this.context.createImageData(this.width, this.height)
}

GassPloter.prototype.draw = function (view) {
	const { x: centerX, y: centerY, scale } = view
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const stepX = this.step
	const stepY = this.step
	const halfStepX = stepX / 2
	const halfStepY = stepY / 2
	var startx = (centerX + canvasWidthHalf) % stepX
	var starty = (centerY + canvasHeightHalf) % stepY
	var inverseScale = stepY / scale
	this.img = context.getImageData(0, 0,
		this.context.canvas.clientWidth,
		this.context.canvas.clientHeight)
	const points = this.manager.getEnities(Physics).map(
		(elem) => {
			var transform = this.manager.get(Transform, elem)[0]
			var shape = this.manager.get(ShapeCircle, elem)[0]
			var physics = this.manager.get(Physics, elem)[0]
			return {
				speeds: physics.speeds,
				radius: shape && shape.radius,
				positions: transform.positions
			}
		}).filter(({ radius }) => !!radius)
	//this.cells.o.fill(0)
	for (var x = startx; x <= canvasWidth; x += stepX) {
		var realX = (x - canvasWidthHalf) / scale + centerX
		var realY = (starty - canvasHeightHalf) / scale + centerY
		var realXround = Math.max(Math.round(realX - halfStepX), 0)
		for (var y = starty; y <= canvasHeight; y += stepY) {
			var realYround = Math.max(Math.round(realY - halfStepY), 0)
			var cellId = realXround + realYround * this.widthSteps
			var sum = 0
			var pointsLength = points.length
			for (var i = 0; i < pointsLength; i++) {
				var point = points[i]
				if (point.radius >
					distance(point.positions[0],
						point.positions[1],
						realX,
						realY)) {
					this.cells.o[cellId] = 1
				}
			}
			if (this.cells[cellId]) {
				sum += 128
			}
			var colorMin2 = Math.min(sum, COLORS - 1)
			var colorMin = Math.max(Math.min(sum, COLORS - 1) - colorMin2 * colorMin2 * 0.3, 0)
			var colorMax = Math.max(colorMin, colorMin2)
			this.imgRect(x - halfStepX, y - halfStepY, stepX, stepY, [255 - colorMin, 0, 255 - colorMin2, colorMax])
			realY += inverseScale
		}
	}
	context.putImageData(this.img, 0, 0)
}

GassPloter.prototype.imgRect = function (x, y, width, height, color) {

	const realWidth = Math.max(Math.min(width, this.context.canvas.clientWidth - x), 0)
	const realHeight = Math.max(Math.min(height, this.context.canvas.clientHeight - y), 0)
	const realX = Math.max(Math.round(x), 0)
	const realY = Math.max(Math.round(y), 0)
	const data = this.img.data
	const startX = realX * 4
	const endX = realWidth * 4 + startX
	const rowLength = this.context.canvas.clientWidth * 4
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

export default GassPloter