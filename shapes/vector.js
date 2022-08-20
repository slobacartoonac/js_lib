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

Vector.prototype = Object.create(Array.prototype)

Vector.prototype.add = function (toAdd) {
	let ret = new Vector(this)
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
Vector.prototype.negate = function () {
	let ret = new Vector(this)
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

export { Vector }