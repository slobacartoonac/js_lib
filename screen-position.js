import { Vector } from "./shapes/vector";

// written by Slobodan Zivkovic slobacartoonac@gmail.com
function ScreenPosition(screen, touch) {
    Vector.call(this)
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
    this.scale *= scaleFactor
    let scaleDiff = scaleFactor - 1
    let xOffset = (this.touch.mousePosition.x - this.screen.width / 2) * scaleDiff
    let yOffset = (this.touch.mousePosition.y - this.screen.height / 2) * scaleDiff
    this.x += xOffset / this.scale
    this.y += yOffset / this.scale
}

ScreenPosition.prototype.move = function (x, y) {
    this.x -= x / this.scale
    this.y -= y / this.scale
}

export { ScreenPosition }