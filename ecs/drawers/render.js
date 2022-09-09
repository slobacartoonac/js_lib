import { Transform } from '../physics/transform.js'
import { ShapeBox } from '../../shapes/box.js'
import { ShapeCircle } from '../../shapes/circle.js'
import { ShapeText } from '../../shapes/text.js'
import { Sprite } from '../../shapes/sprite.js'
import { ShapeRounded } from '../../shapes/rounded-box.js'
import { TransformRotate } from '../physics/transformRotate.js'

function Renderer(color, stroke, layer) {
	this.color = color
	this.stroke = stroke
	this.layer = layer || 0
}

function RenderEngine(context, manager) {
	this.context = context
	this.manager = manager
	this.maxSize = 100
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

function roundedRect(context, x, y, width, height, radius) {
	context.moveTo(x, y + radius);
	context.lineTo(x, y + height - radius);
	context.arcTo(x, y + height, x + radius, y + height, radius);
	context.lineTo(x + width - radius, y + height);
	context.arcTo(x + width, y + height, x + width, y + height - radius, radius);
	context.lineTo(x + width, y + radius);
	context.arcTo(x + width, y, x + width - radius, y, radius);
	context.lineTo(x + radius, y);
	context.arcTo(x, y, x, y + radius, radius);
}

RenderEngine.prototype.draw = function (view) {
	const { context } = this
	var canvasWidth = context.canvas.clientWidth
	var canvasHeight = context.canvas.clientHeight
	const { x: centerX, y: centerY, scale } = view
	const canvasWidthHalf = canvasWidth / 2
	const canvasHeightHalf = canvasHeight / 2
	const maxSize = this.maxSize * scale;
	this.manager.getEnities(Renderer).map(elem => {
		var renderer = this.manager.get(Renderer, elem)[0]
		return [elem, renderer]
	}).sort(([, a], [, b]) => {
		if (a.layer < b.layer) {
			return -1;
		}
		if (a.layer > b.layer) {
			return 1;
		}
		// a must be equal to b
		return 0;
	}
	).map(
		([elem, renderer]) => {
			var transform = this.manager.get(Transform, elem)[0]
			var x = (transform.positions[0] - centerX) * scale + canvasWidthHalf
			var y = (transform.positions[1] - centerY) * scale + canvasHeightHalf
			if (x < -maxSize || y < -maxSize || x > canvasWidth || y > canvasHeight)
				return

			let circles = this.manager.get(ShapeCircle, elem)
			for (let i in circles) {
				let circle = circles[i];
				const elementSize = circle.radius * scale > 1 ? circle.radius * scale : 1
				context.beginPath()
				context.arc(x, y, elementSize, 0, 2 * Math.PI, false)
				shapeDone(context, renderer);
			}
			let boxes = this.manager.get(ShapeBox, elem)
			let rounded = this.manager.get(ShapeRounded, elem)
			let rotate = this.manager.get(TransformRotate, elem)[0]
			for (let i in boxes) {
				let box = boxes[i];
				const size_x = box.x * scale > 1 ? box.x * scale : 1
				const size_y = box.y * scale > 1 ? box.y * scale : 1
				context.save();
				if (rotate) {
					context.translate(x + size_x / 2, y + size_y / 2);
					context.rotate(rotate.rotate);
					context.translate(-x - size_x / 2, -y - size_y / 2);
				}
				context.beginPath();
				if (rounded[0]) {
					roundedRect(context, x, y, size_x, size_y, rounded[0].radius)
				}
				else {
					context.rect(x, y, size_x, size_y);
				}
				shapeDone(context, renderer);
				context.restore();
			}
			let sprites = this.manager.get(Sprite, elem)
			for (let i in sprites) {
				let sprite = sprites[i];
				let box = boxes[0];
				if (!box) {
					break;
				}
				const size_x = box.x * scale > 1 ? box.x * scale : 1
				const size_y = box.y * scale > 1 ? box.y * scale : 1
				context.save();
				if (rotate) {
					context.translate(x + size_x / 2, y + size_y / 2);
					context.rotate(rotate.rotate);
					context.translate(-x - size_x / 2, -y - size_y / 2);
				}
				context.drawImage(sprite.image, x, y, size_x, size_y);
				context.restore();
			}
			let texts = this.manager.get(ShapeText, elem)
			for (let i in texts) {
				let text = texts[i]
				const size_y = text.font * scale > 1 ? text.font * scale : 1
				context.fillStyle = renderer.color;
				context.font = parseInt(size_y) + 'px serif';
				context.save();
				if (rotate) {
					context.translate(x, y);
					context.rotate(rotate.rotate);
					context.translate(-x, -y);
				}
				context.fillText(text.text, x, y + parseInt(size_y));
				context.restore();
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
