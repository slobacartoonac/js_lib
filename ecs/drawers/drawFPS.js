function FPSPloter(context) {
	this.context = context
	this.time = (new Date()).getTime()
	this.i = 0
	this.fps = 0
}

FPSPloter.prototype.draw = function () {
	this.i++
	var newTime = (new Date()).getTime()
	var deltaT = newTime - this.time
	this.time = newTime
	this.context.font = '14px Verdana'

	if (!(this.i % 30)) this.fps = (Math.round(10000 / deltaT) / 10) + ' fps'
	this.context.beginPath();
	this.context.rect(10, 13, 60, 14);
	this.context.fillStyle = 'gray'
	this.context.fill();
	this.context.fillStyle = 'red'
	this.context.fillText(this.fps, 10, 24)

}

export default FPSPloter