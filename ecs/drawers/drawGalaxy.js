import { interpolate } from '../../math/vec.js'
import { Physics } from '../physics/physics.js'
import { Transform } from '../physics/transform'

const distance = (point, nodeB) => {
	var square = 0
	for (var i = 0; i < point.length; i++)
		square += Math.pow((point[i] - nodeB.positions[i]), 2)
	return isNaN(square) || square < 1 ? 1 : Math.sqrt(square)
}

function GalaxyPloter(context, manager, colors) {
	this.colors = colors
	this.context = context
	this.update();
	this.manager = manager
}

GalaxyPloter.prototype.update = function () {
	this.img = this.context.createImageData(this.context.canvas.clientWidth, this.context.canvas.clientHeight)
}

GalaxyPloter.prototype.draw = function (view) {
	const { x: centerX, y: centerY, scale } = view
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const stepX = 4
	const stepY = 4
	const halfStepX = stepX / 2
	const halfStepY = stepY / 2
	var startx = (centerX + canvasWidthHalf) % stepX
	var starty = (centerY + canvasHeightHalf) % stepY
	var inverseScale = stepY / scale
	const points = this.manager.getEnities(Physics).map(
		(elem) => {
			var physics = this.manager.get(Physics, elem)[0]
			var transform = this.manager.get(Transform, elem)[0]
			return {
				mass: physics.mass,
				positions: transform.positions
			}
		})
	for (var x = startx; x <= canvasWidth; x += stepX) {
		var realX = (x - canvasWidthHalf) / scale + centerX
		var realY = (starty - canvasHeightHalf) / scale + centerY
		for (var y = starty; y <= canvasHeight; y += stepY) {
			var sum = 0
			var pointsLength = points.length
			for (var i = 0; i < pointsLength; i++) {
				var point = points[i]
				sum += point.mass / distance([realX, realY], point)
			}
			var colorPosition = Math.min(sum / 64.0, this.colors.length - 1)
			var index = this.colors.length - 1 - Math.floor(colorPosition)
			var color = this.colors[index]
			if (index < this.colors.length - 1) {
				let color2 = this.colors[index + 1]
				var over = colorPosition % 1
				color = color.map((c, index) => interpolate(color2[index], c, over))
			}


			this.imgRect(x - halfStepX, y - halfStepY, stepX, stepY, [color[0], color[1], color[2], 255])
			realY += inverseScale
		}
	}
	context.putImageData(this.img, 0, 0)
}

GalaxyPloter.prototype.imgRect = function (x, y, width, height, color) {

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
	for (var i = startY; i < endY; i += rowLength) {
		for (var j = startX; j < endX; j += 4) {
			var ij = i + j
			data[ij] = color[0]
			data[ij + 1] = color[1]
			data[ij + 2] = color[2]
			data[ij + 3] = color[3]
		}
	}
}

export default GalaxyPloter