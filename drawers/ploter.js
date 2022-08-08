
function Ploter(canvas){
	this.canvas=canvas
	this.context = this.canvas.getContext('2d')
	this.img = this.context.createImageData(this.canvas.width, this.canvas.height)
}

Ploter.prototype.clear=function()
{
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

Ploter.prototype.getCanvas=function()
{
	return this.canvas
}

Ploter.prototype.worldToScreen=function(view, point){
	const { width: canvasWidth, height: canvasHeight}= this.canvas
	const {x: centerX, y: centerY, scale} = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	var screenX=(point[0]-centerX)*scale + canvasWidthHalf
	var screenY=(point[1]-centerY)*scale + canvasHeightHalf
	return [screenX, screenY]
}

Ploter.prototype.screenToWorld=function(view, point){
	const { width: canvasWidth, height: canvasHeight}= this.canvas
	const {x: centerX, y: centerY, scale} = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	var worldX = (point[0] - canvasWidthHalf) / scale + centerX
	var worldY = (point[1]- canvasHeightHalf) / scale + centerY
	return [worldX, worldY]
}

export default Ploter