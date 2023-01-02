import { screenToWorld, worldToScreen } from "../../math/view"

function FunctionPloter(ctx) {
	this.context = ctx
}

FunctionPloter.prototype.draw = function (view, a, h, k, color) {
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const { x: centerX, y: centerY, scale } = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	var gridScale = scale
	while (gridScale > 2)
		gridScale /= 2
	while (gridScale < 1)
		gridScale *= 2
	const stepX = 5 * gridScale
	//const stepY = sizey * gridScale
	var startx = (-centerX * scale + canvasWidthHalf) % stepX
	context.beginPath()
	context.moveTo(x, 0)
	for (var x = startx; x <= canvasWidth; x += stepX) {
		let cordX = screenToWorld(
			centerX,
			centerY,
			scale,
			canvasWidth,
			canvasHeight,
			x,
			0
		)[0]
		let cordY = a * ((cordX / 100 - h) * (cordX / 100 - h)) + k
		let scrY = worldToScreen(
			centerX,
			centerY,
			scale,
			canvasWidth,
			canvasHeight,
			0,
			- cordY * 100
		)[1]
		context.lineTo(x, scrY)
	}
	context.lineWidth = 2
	context.strokeStyle = color || 'rgba(0, 0, 0, 1)'
	context.stroke()
}

export default FunctionPloter