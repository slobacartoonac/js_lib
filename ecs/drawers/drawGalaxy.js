import { interpolate } from '../../math/vec.js'
import { Physics } from '../physics/physics.js'
import { Transform } from '../physics/transform'
import { ImageDataPloter } from './imageData'

const distance = (point, pointB) => {
	var square = 0
	for (var i = 0; i < point.length; i++)
		square += (point[i] - pointB[i]) * (point[i] - pointB[i])
	return isNaN(square) || square < 1 ? 1 : Math.sqrt(square)
}

function GalaxyPloter(context, manager, colors) {
	this.colors = colors
	this.context = context
	this.imgData = new ImageDataPloter(context, manager)
	this.manager = manager
}

GalaxyPloter.prototype.update = function () {
	this.imgData.update()
}

GalaxyPloter.prototype.draw = function (view) {
	const { x: centerX, y: centerY, scale } = view
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const stepX = 2
	const stepY = 2
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
	this.imgData.pull()
	var colorCount = new Array(this.colors.length).fill(0)
	for (var x = startx; x <= canvasWidth; x += stepX) {
		var realX = (x - canvasWidthHalf) / scale + centerX
		var realY = (starty - canvasHeightHalf) / scale + centerY
		for (var y = starty; y <= canvasHeight; y += stepY) {
			var sum = 0
			var pointsLength = points.length
			for (var i = 0; i < pointsLength; i++) {
				var point = points[i]
				sum += point.mass / distance([realX, realY], point.positions)
			}
			var colorPosition = Math.max(this.colors.length - sum / 64.0, 0);
			var over = colorPosition % 1
			var index1 = Math.min(this.colors.length - 1, Math.floor(colorPosition))
			var index2 = Math.min(this.colors.length - 1, Math.ceil(colorPosition))
			var color = this.colors[index2]
			let color2 = this.colors[index1]
			colorCount[index1]++
			color = color.map((c, index) => interpolate(color2[index], c, over))

			this.imgData.imgRect(x - halfStepX, y - halfStepY, stepX, stepY, [color[0], color[1], color[2]])
			realY += inverseScale
		}
	}
	//console.log(colorCount)
	context.putImageData(this.imgData.img, 0, 0)
}

export default GalaxyPloter