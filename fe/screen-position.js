import { Vector } from "../shapes/vector";

// written by Slobodan Zivkovic slobacartoonac@gmail.com
function ScreenPosition(screen, touch, options) {
    Vector.call(this)
    this.push(0, 0, 1)

    this.screen = screen;
    this.touch = touch;
    Object.assign(this, options || {})
    Object.defineProperty(this, 'scale', {
        get() {
            return this[2];
        },
        set(value) {
            this[2] = value;
        }
    });
}

ScreenPosition.prototype = Object.create(Vector.prototype)


ScreenPosition.prototype.zoom = function (scaleFactor) {
    this.scale *= scaleFactor
    if (!isNaN(this.minScale) && this.scale < this.minScale) {
        this.scale = this.minScale
        return
    }
    if (!isNaN(this.maxScale) && this.scale > this.maxScale) {
        this.scale = this.maxScale
        return
    }
    let scaleDiff = scaleFactor - 1
    let xOffset = (this.screen.width / 2 - this.touch.mousePosition.x) * scaleDiff
    let yOffset = (this.screen.height / 2 - this.touch.mousePosition.y) * scaleDiff
    this.move(xOffset, yOffset)
}

ScreenPosition.prototype.move = function (x, y) {
    let difX = x / this.scale
    let difY = y / this.scale
    this.x -= difX
    this.y -= difY
    if (!isNaN(this.minX) && this.x < this.minX) {
        this.x = this.minX
    }
    if (!isNaN(this.maxX) && this.x > this.maxX) {
        this.x = this.maxX
    }
    if (!isNaN(this.minY) && this.y < this.minY) {
        this.y = this.minY
    }
    if (!isNaN(this.maxY) && this.y > this.maxY) {
        this.y = this.maxY
    }
}

export { ScreenPosition }