function Vector(...array) {
	Array.call(this)
	if (array.length == 1) {
		var item = array[0]
		var arr = Object.values(item)
		if (Object.hasOwnProperty.call(item, 'length') &&
			item.length !== arr.length) {
			arr.pop()
		}
		this.push(...arr)
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

Vector.from =  function(some){
	return new Vector(some)
}

Vector.prototype.x = 0;
Vector.prototype.y = 0;
Vector.prototype.z = 0;

Vector.prototype = Object.create(Array.prototype, {
	constructor: {
		value: Vector,
		enumerable: false, // Make it non-enumerable, so it won't appear in `for...in` loop
		writable: true,
		configurable: true,
	}
})

Vector.prototype.add = function (toAdd) {
	let ret = this.copy()
	for (var k = 0; k < ret.length; k++) {
		if (!Object.hasOwnProperty.call(ret, k)) {
			continue;
		}
		if (!Object.hasOwnProperty.call(toAdd, k)) {
			continue;
		}
		ret[k] += toAdd[k]
	}
	return ret
}

Vector.prototype.update = function (newValues) {
	let enteries = Object.entries(newValues)
	for (var k = 0; k < enteries.length; k++) {
		let enterie = enteries[k]
		if (!Object.hasOwnProperty.call(this, enterie[0])) {
			continue;
		}
		this[k] = enterie[1]
	}
}

Vector.prototype.negate = function () {
	let ret = this.copy()
	for (var k = 0; k < ret.length; k++) {
		if (!Object.hasOwnProperty.call(ret, k)) {
			continue;
		}
		ret[k] = -ret[k]
	}
	return ret
}
Vector.prototype.substract = function (toAdd) {
	return this.add(toAdd.negate())
}
Vector.prototype.magnitude = function () {
	let magnitude = 0;
	for (var k = 0; k < this.length; k++) {
		if (!Object.hasOwnProperty.call(this, k)) {
			continue;
		}
		magnitude += this[k] * this[k]
	}
	return Math.sqrt(magnitude);
}
Vector.prototype.normalise = function (toAdd) {
	let magnitude = this.magnitude()
	return this.scale(1 / magnitude)
}
Vector.prototype.scale = function (scale) {
	let ret = this.copy()
	for (var k = 0; k < ret.length; k++) {
		if (!Object.hasOwnProperty.call(ret, k)) {
			continue;
		}
		ret[k] *= scale
	}
	return ret
}

Vector.prototype.copy = function () {
	return new this.constructor(this)
}

export { Vector }