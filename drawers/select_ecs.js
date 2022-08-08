import { ShapeCircle} from 'my_lib/shapes/circle.js'
import { Transform } from 'my_lib/physics/transform.js'

function Selectable(){
    this.isSelected =  false;
    this.index = 0;
}

function SelectableRenderEngine(context, manager, selector){
	this.context = context
	this.manager = manager
    this.selector = selector
}

SelectableRenderEngine.prototype.draw=function(view)
{
	const { context }= this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const {x: centerX, y: centerY, scale} = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const points = this.manager.getEnities(Selectable)
        .filter((elem)=>{
            var selectable = this.manager.get(Selectable, elem)[0]
            return selectable.isSelected
        })
        .map(
		(elem)=>{
            var selectable = this.manager.get(Selectable, elem)[0]
			var transform = this.manager.get(Transform, elem)[0]
			var circle = this.manager.get(ShapeCircle, elem)[0]
			return [
				transform.positions[0],
				transform.positions[1],
				circle.radius+1,
				"#ffffff",
                selectable.index
			]
		}
	)

	points.forEach((element)=>{
		var x=(element[0]-centerX)*scale + canvasWidthHalf
		var y=(element[1]-centerY)*scale + canvasHeightHalf
		if(x<0||y<0||x>canvasWidth||y>canvasHeight)
			return
		const elementSize=element[2]*scale>1?element[2]*scale:1
		context.beginPath()
		context.arc(x,y, elementSize, 0, 2 * Math.PI, false)
		context.lineWidth = 1
		context.strokeStyle = element[3]
		context.stroke()
        context.font = '14px Verdana'
        context.fillStyle = element[3]
        context.fillText(element[4], x, y + elementSize + 14 )
	})
    if(points.length > 1){
		const mean = this.selector.findMean()
        var x=(mean[0]-centerX)*scale + canvasWidthHalf
		var y=(mean[1]-centerY)*scale + canvasHeightHalf
        context.beginPath()
        context.arc(x,y, 5, 0, 2 * Math.PI, false)
        context.lineWidth = 1
        context.strokeStyle = "#00ff00"
        context.stroke()
    }
	if(this.selector.area.length){
		var startx = (this.selector.area[0][0]-centerX)*scale + canvasWidthHalf
		var starty = (this.selector.area[0][1]-centerY)*scale + canvasHeightHalf
		var endx = (this.selector.area[1][0]-centerX)*scale + canvasWidthHalf
		var endy = (this.selector.area[1][1]-centerY)*scale + canvasHeightHalf
		
		context.beginPath()
		context.moveTo( startx , starty)
		context.lineTo( endx, starty)
		context.lineTo( endx , endy)
		context.lineTo( startx , endy)
		context.lineTo( startx , starty)
		context.lineWidth = 2
		context.strokeStyle = 'rgba(255, 255, 255, 1.0)'
		context.stroke()
	}
}

export { Selectable, SelectableRenderEngine }