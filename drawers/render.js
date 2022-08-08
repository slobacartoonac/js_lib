import { Transform } from '../physics/transform.js'
import { ShapeBox } from '../shapes/box.js'
import { ShapeCircle } from '../shapes/circle.js'
import { ShapeText } from '../shapes/text.js'
import { Sprite } from '../shapes/sprite.js'

function Renderer(color, stroke) {
	this.color = color
	this.stroke = stroke
}

function RenderEngine(context, manager) {
	this.context = context
	this.manager = manager
}

function shapeDone(context, renderer) {
	if (renderer.color) {
		context.fillStyle = renderer.color;
		context.fill()
	}
	if (renderer.stroke) {
		context.strokeStyle = renderer.stroke.color;
		context.lineWidth = renderer.stroke.width;
		context.stroke()
	}
}

RenderEngine.prototype.draw = function (view) {
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const { x: centerX, y: centerY, scale } = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const points = this.manager.getEnities(Renderer).map(
		(elem) => {
			var transform = this.manager.get(Transform, elem)[0]
			var x = (transform.positions[0] - centerX) * scale + canvasWidthHalf
			var y = (transform.positions[1] - centerY) * scale + canvasHeightHalf
			if (x < 0 || y < 0 || x > canvasWidth || y > canvasHeight)
				return
			var renderers = this.manager.get(Renderer, elem)[0]

			let sprites = this.manager.get(Sprite, elem)
			let boxes = this.manager.get(ShapeBox, elem)
			for (let i in sprites) {
				let sprite = sprites[i];
				let box = boxes[0];
				if (!box) {
					break;
				}
				const size_x = box.x * scale > 1 ? box.x * scale : 1
				const size_y = box.y * scale > 1 ? box.y * scale : 1
				context.drawImage(sprite.image, x, y, size_x, size_y);
			}
			let circles = this.manager.get(ShapeCircle, elem)
			for (let i in circles) {
				let circle = circles[i];
				const elementSize = circle.radius * scale > 1 ? circle.radius * scale : 1
				context.beginPath()
				context.arc(x, y, elementSize, 0, 2 * Math.PI, false)
				shapeDone(context, renderers);
			}
			for (let i in boxes) {
				let box = boxes[i];
				const size_x = box.x * scale > 1 ? box.x * scale : 1
				const size_y = box.y * scale > 1 ? box.y * scale : 1
				context.beginPath();
				context.rect(x, y, size_x, size_y);
				shapeDone(context, renderers);
			}
			let texts = this.manager.get(ShapeText, elem)
			for (let i in texts) {
				let text = texts[i]
				const size_x = text.font * scale > 1 ? text.font * scale : 1
				context.fillStyle = renderers.color;
				context.font = parseInt(size_x) + 'px serif';
				context.fillText(text.text, x, y);
			}
		}
	)
}
RenderEngine.prototype.mesure = function (text) {
	const { context } = this
	context.font = parseInt(text.font) + 'px serif';
	return context.measureText(text.text);
}
export { RenderEngine, Renderer }
