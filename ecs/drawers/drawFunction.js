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
	const stepX = 5
	//const stepY = sizey * gridScale
	var startx = (-centerX * scale + canvasWidthHalf) % stepX
	context.beginPath()
	context.moveTo(x, 0)
	for (var x = startx; x <= canvasWidth; x += stepX) {
		//(pointX - widthHalf) / viewScale + viewCenterX
		let cordX = ((x - canvasWidthHalf) / scale + centerX) / 100
		let cordY = -(a * (cordX - h) * (cordX - h) + k) * 100
		//var screenY = (pointY - viewCenterY) * viewScale + heightHalf
		var scrY = (cordY - centerY) * scale + canvasHeightHalf
		context.lineTo(x, scrY)
	}
	context.lineWidth = 2
	context.strokeStyle = color || 'rgba(0, 0, 0, 1)'
	context.stroke()
}

export default FunctionPloter