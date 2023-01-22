import { screenToWorld, worldToScreen } from "../../math/view"
import { interpolate } from "../../math/vec"

function GridPloter(ctx, options) {
	this.context = ctx
	this.showCords = options?.showCords
	this.showAxis = options?.showAxis
	this.axisCords = options?.axisCords
	this.axisScale = options?.axisScale || 100
	this.devide = options?.devide || 2
}

GridPloter.prototype.draw = function (sizex, sizey, view) {
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const { x: centerX, y: centerY, scale } = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	var gridScale = scale || 1
	while (gridScale > 2)
		gridScale /= 2
	while (gridScale < 1)
		gridScale *= 2
	const stepX = sizex * gridScale
	const stepY = sizey * gridScale
	var startx = (canvasWidthHalf - centerX * scale) % stepX
	var starty = (canvasHeightHalf - centerY * scale) % stepY
	if (startx < 0) {
		startx += stepX
	}
	if (starty < 0) {
		starty += stepY
	}
	if (this.showAxis) {
		context.beginPath()
		let [scrCenterX, scrCenterY] = worldToScreen(
			centerX,
			centerY,
			scale,
			canvasWidth,
			canvasHeight,
			0, 0)
		context.lineWidth = 2
		context.moveTo(scrCenterX, 0)
		context.lineTo(scrCenterX, canvasHeight)
		context.moveTo(0, scrCenterY)
		context.lineTo(canvasWidth, scrCenterY)
		context.strokeStyle = 'rgba(0, 0, 0, 1.0)'
		context.stroke()
	}

	context.beginPath()
	for (var x = startx; x <= canvasWidth; x += stepX) {
		context.moveTo(x, 0)
		context.lineTo(x, canvasHeight)
		if (!this.axisCords) continue;
		let cordX = screenToWorld(
			centerX,
			centerY,
			scale,
			canvasWidth,
			canvasHeight,
			x,
			0
		)[0]
		this.drawCod(cordX, 0, view, context)
	}

	for (var y = starty; y <= canvasHeight; y += stepY) {
		context.moveTo(0, y)
		context.lineTo(canvasWidth, y)
		if (!this.axisCords) continue;
		let cordY = screenToWorld(
			centerX,
			centerY,
			scale,
			canvasWidth,
			canvasHeight,
			0,
			y
		)[1]
		this.drawCod(0, cordY, view, context)
	}
	context.lineWidth = 2
	context.strokeStyle = 'rgba(128, 128, 128, 0.5)'
	context.stroke()
	for (var i = 0; i < this.devide - 1; i++) {
		var startx = (startx + stepX / this.devide) % stepX
		var starty = (starty + stepY / this.devide) % stepY

		context.beginPath()
		for (var x = startx; x <= canvasWidth; x += stepX) {
			context.moveTo(x, 0)
			context.lineTo(x, canvasHeight)
		}

		for (var y = starty; y <= canvasHeight; y += stepY) {
			context.moveTo(0, y)
			context.lineTo(canvasWidth, y)
		}
		context.lineWidth = 1
		context.strokeStyle = 'rgba(128, 128, 128, ' + interpolate(0.25, 0.5, gridScale - 1) + ')'
		context.stroke()
	}
	if (this.showCords) {
		context.font = '10px Arial'
		context.fillText(
			(Math.round(view.x * this.axisScale) / this.axisScale + Number.EPSILON) +
			',' + (Math.round(view.y * this.axisScale + Number.EPSILON) / this.axisScale) +
			',' + (Math.round(view.scale * this.axisScale + Number.EPSILON) / this.axisScale), 10, 50)
	}
}


GridPloter.prototype.drawCod = function (eX, eY, view, context) {
	const { x: centerX, y: centerY, scale } = view
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	var x = (eX - centerX) * scale + canvasWidthHalf
	var y = (eY - centerY) * scale + canvasHeightHalf
	let outOfScreen = false
	if (x < 5 ||
		x > canvasWidth - 19 ||
		y > canvasHeight - 28 ||
		y < 14) {
		outOfScreen = true
	}


	if (x < 5) {
		x = 5
	}
	if (y < 14) {
		y = 14
	}
	if (x > canvasWidth - 19) {
		x = canvasWidth - 19
	}
	if (y > canvasHeight - 28) {
		y = canvasHeight - 28
	}
	context.font = '14px Verdana'
	context.fillStyle = 'rgb(0, 0, 0, 1.0)'
	function trimNum(value) {
		return +parseFloat(value).toFixed(2)
	}

	let text = ""
	let ext = trimNum((eX / this.axisScale))
	let eyt = trimNum((-eY / this.axisScale))
	if (ext) {
		text += ext
	}
	if (eyt) {
		text += eyt
	}
	if (!eyt && !ext && !outOfScreen) {
		text += "0"
	}

	context.fillText(text, x + 5, y + 14)
}

GridPloter.prototype.line = function (startx, starty, sizex, sizey, color) {
	this.context.lineWidth = 1
	this.context.moveTo(startx, starty)
	this.context.lineTo(startx + sizex, starty + sizey)
	this.context.strokeStyle = color
	this.context.stroke()
}

export default GridPloter