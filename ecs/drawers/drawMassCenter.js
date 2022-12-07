import { ShapeBox } from '../../shapes/box.js'
import { ShapeCircle } from '../../shapes/circle.js'
import { Physics } from '../physics/physics.js'
import { Transform } from '../physics/transform.js'
import { interpolateVecs } from '../../math/vec'

function MasCenterRender() {
}

function MasCenterRenderEngine(context, manager) {
	this.context = context
	this.manager = manager
}

MasCenterRenderEngine.prototype.draw = function (view) {
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const { x: centerX, y: centerY, scale } = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const points = this.manager.getEnities(MasCenterRender)
		.map(
			(elem, index) => {
				var transform = this.manager.get(Transform, elem)[0]
				var box = this.manager.get(ShapeBox, elem)[0]
				var physics = this.manager.get(Physics, elem)[0]
				return [
					transform.positions[0] + box.x / 2,
					transform.positions[1] + box.y / 2,
					physics.mass / 10000,
					"#ffffff",
					index
				]
			}
		)

	points.forEach((element) => {
		var x = (element[0] - centerX) * scale + canvasWidthHalf
		var y = (element[1] - centerY) * scale + canvasHeightHalf
		if (x < 0 || y < 0 || x > canvasWidth || y > canvasHeight)
			return
		const elementSize = element[2] * scale > 1 ? element[2] * scale : 1
		context.beginPath()
		context.arc(x, y, elementSize, 0, 2 * Math.PI, false)
		context.lineWidth = 1
		context.strokeStyle = element[3]
		context.stroke()
		context.font = '14px Verdana'
		context.fillStyle = element[3]
		context.fillText(element[4], x, y + elementSize + 14)
	})


	if (points.length > 0) {
		let mean = points.reduce((acc, point) => {
			let totalMass = point[2] + acc[2]
			let over = point[2] / totalMass
			let newCenter = interpolateVecs({ x: acc[0], y: acc[1] }, { x: point[0], y: point[1] }, over)
			return [newCenter.x, newCenter.y, totalMass]
		}, [0, 0, 0])
		var x = (mean[0] - centerX) * scale + canvasWidthHalf
		var y = (mean[1] - centerY) * scale + canvasHeightHalf
		context.beginPath()
		context.arc(x, y, 5, 0, 2 * Math.PI, false)
		context.lineWidth = 1
		context.strokeStyle = "#ff0000"
		context.fillStyle = "#ff0000"
		context.stroke()
		context.fill()
	}
}

export { MasCenterRenderEngine, MasCenterRender }