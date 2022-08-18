import { Vector } from "./shapes/vector";

// written by Slobodan Zivkovic slobacartoonac@gmail.com
function ScreenPosition(screen, touch, width, height) {
    Vector.call(this)
    this.width = width
    this.height = height
    this.push(0, 0, 1)
    this.screen = screen;
    this.touch = touch;
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
    if (this.scale * scaleFactor > 2 ||
        this.scale * scaleFactor < 0.5
    ) return;
    this.scale *= scaleFactor
    let scaleDiff = scaleFactor - 1
    let xOffset = (this.touch.mousePosition.x - this.screen.width / 2) * scaleDiff
    let yOffset = (this.touch.mousePosition.y - this.screen.height / 2) * scaleDiff
    this.x += xOffset / this.scale
    this.y += yOffset / this.scale
}

ScreenPosition.prototype.move = function (x, y) {
    let difX = x / this.scale
    let difY = y / this.scale
    if (this.x - difX > 0 &&
        this.x - difX < this.width) {
        this.x -= difX
    }
    if (this.y - difY > 0 &&
        this.y - difY < this.height
    ) {
        this.y -= difY
    }

}

export { ScreenPosition }