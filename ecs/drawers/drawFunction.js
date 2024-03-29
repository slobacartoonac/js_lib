function FunctionPloter(ctx) {
	this.context = ctx
	this.scale = 100
}

FunctionPloter.prototype.draw = function (view, func, color) {
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const { x: centerX, y: centerY, scale } = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const stepX = 2
	//const stepY = sizey * gridScale
	var startx = (-centerX * scale + canvasWidthHalf) % stepX
	context.beginPath()
	context.moveTo(x, 0)
	for (var x = startx; x <= canvasWidth; x += stepX) {
		//(pointX - widthHalf) / viewScale + viewCenterX
		let cordX = ((x - canvasWidthHalf) / scale + centerX) / this.scale
		let cordY = -func(cordX) * this.scale
		//var screenY = (pointY - viewCenterY) * viewScale + heightHalf
		var scrY = (cordY - centerY) * scale + canvasHeightHalf
		if (isNaN(scrY)) {
			continue
		}
		if (scrY > canvasHeight + 5) {
			scrY = canvasHeight + 5
		}
		if (scrY < -5) {
			scrY = -5
		}
		context.lineTo(x, scrY)
	}
	context.lineWidth = 2
	context.strokeStyle = color || 'rgba(0, 0, 0, 1)'
	context.stroke()
}

export default FunctionPloter