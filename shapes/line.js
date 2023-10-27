function Line(from, too) {
	Array.call(this)
    this.push(from, too)

	Object.defineProperty(this, 'from', {
		get() {
			return this[0];
		},
		set(value) {
			this[0] = value;
		}
	});
	Object.defineProperty(this, 'to', {
		get() {
			return this[1];
		},
		set(value) {
			this[1] = value;
		}
	});
}

Line.prototype = Object.create(Array.prototype, {
	constructor: {
		value: Line,
		enumerable: false, // Make it non-enumerable, so it won't appear in `for...in` loop
		writable: true,
		configurable: true,
	}
});

Line.prototype.from = new Object()
Line.prototype.to = new Object()

// Line.prototype = function toArray(){
//         return [this[0][0], this[0][1], this[1][0], this[1][1]]
// }

export { Line }