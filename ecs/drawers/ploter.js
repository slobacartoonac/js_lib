import { screenToWorld, worldToScreen } from "../../math/view"

function Ploter(canvas) {
	this.canvas = canvas
	this.context = this.canvas.getContext('2d', { willReadFrequently: true })
	this.img = this.context.createImageData(this.canvas.width, this.canvas.height)
}

Ploter.prototype.clear = function () {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

Ploter.prototype.getCanvas = function () {
	return this.canvas
}

Ploter.prototype.worldToScreen = function (view, point) {
	const { width: canvasWidth, height: canvasHeight } = this.canvas
	const { x: centerX, y: centerY, scale } = view
	return worldToScreen(
		centerX,
		centerY,
		scale,
		canvasWidth,
		canvasHeight,
		point[0],
		point[1]
	)
}

Ploter.prototype.screenToWorld = function (view, point) {
	const { width: canvasWidth, height: canvasHeight } = this.canvas
	const { x: centerX, y: centerY, scale } = view
	return screenToWorld(
		centerX,
		centerY,
		scale,
		canvasWidth,
		canvasHeight,
		point[0],
		point[1]
	)
}

export default Ploter