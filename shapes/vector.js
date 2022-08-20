function Vector(...array) {
	Array.call(this)
	if (array.length == 1) {
		this.push(...Object.values(array[0]))
	} else {
		this.push(...Object.values(array))
	}

	Object.defineProperty(this, 'x', {
		get() {
			return this[0];
		},
		set(value) {
			this[0] = value;
		}
	});
	Object.defineProperty(this, 'y', {
		get() {
			return this[1];
		},
		set(value) {
			this[1] = value;
		}
	});
	Object.defineProperty(this, 'z', {
		get() {
			return this[2];
		},
		set(value) {
			this[2] = value;
		}
	});
}

Vector.prototype = Object.create(Array.prototype)
Vector.prototype.add = function (toAdd) {
	for (var k = 0; k < this.length; k++) {
		if (!Object.hasOwnProperty.call(this, k)) {
			break;
		}
		if (!Object.hasOwnProperty.call(toAdd, k)) {
			break;
		}
		this[k] += toAdd[k]
	}
	return this
}
Vector.prototype.negate = function () {
	for (var k = 0; k < this.length; k++) {
		this[k] = -this[k]
	}
	return this
}
Vector.prototype.substract = function (toAdd) {
	return this.add(toAdd.negate())
}

export { Vector }