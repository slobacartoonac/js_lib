function Vector() {
	const array = [...arguments];
	Array.call(this)
	if (array.length == 1) {
		var arr = Object.values(array[0])
		this.push(...arr)
	} else {
		this.push(...Object.values(array))
	}
	Object.defineProperty(this, 'length', {
		enumerable: false,
		writable: true,
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
		iterable: true
	}
})

Vector.prototype.constructor = Vector;


Vector.prototype.add = function (toAdd) {
	let ret = this.copy()
	for (var k in ret) {
		if (!Object.hasOwnProperty.call(toAdd, k)) {
			continue;
		}
		ret[k] += toAdd[k]
	}
	return ret
}

Object.defineProperty(Vector.prototype, 'add', {
	enumerable: false,
  });

  Object.defineProperty(Vector.prototype, 'x', {
	get() {
		return this[0];
	},
	set(value) {
		this[0] = value;
	}
});
Object.defineProperty(Vector.prototype, 'y', {
	get() {
		return this[1];
	},
	set(value) {
		this[1] = value;
	}
});
Object.defineProperty(Vector.prototype, 'z', {
	get() {
		return this[2];
	},
	set(value) {
		this[2] = value;
	}
});
Object.defineProperty(Vector.prototype, 'length', {
	enumerable: false,
	writable: true,
  });

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

Object.defineProperty(Vector.prototype, 'update', {
	enumerable: false,
});

Vector.prototype.negate = function () {
	let ret = this.copy()
	for (var k in this) {
		ret[k] = -ret[k]
	}
	return ret
}

Object.defineProperty(Vector.prototype, 'negate', {
	enumerable: false,
});

Vector.prototype.substract = function (toAdd) {
	return this.add(toAdd.negate())
}

Object.defineProperty(Vector.prototype, 'substract', {
	enumerable: false,
});


Vector.prototype.magnitude = function () {
	let magnitude = 0;
	for (var dim of this) {
		magnitude += dim * dim
	}
	return Math.sqrt(magnitude);
}

Object.defineProperty(Vector.prototype, 'magnitude', {
	enumerable: false,
});


Vector.prototype.normalise = function (toAdd) {
	let magnitude = this.magnitude()
	if(!magnitude) return this.scale(0)
	return this.scale(1 / magnitude)
}

Object.defineProperty(Vector.prototype, 'normalise', {
	enumerable: false,
});


Vector.prototype.scale = function (scale) {
	let ret = this.copy()
	for (var k in this) {
		ret[k] *= scale
	}
	return ret
}

Object.defineProperty(Vector.prototype, 'scale', {
	enumerable: false,
});


Vector.prototype.copy = function () {
	return new Vector(this)
}

Object.defineProperty(Vector.prototype, 'copy', {
	enumerable: false,
});


export { Vector }