// written by Slobodan Zivkovic slobacartoonac@gmail.com
function distance2d(a, b) {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}

function len2d(a) {
	return Math.sqrt(a.x * a.x + a.y * a.y)
}

function getDelta(p1, n1, p2, n2) {
	if (!n2) {
		return { x: n1.x - p1.x, y: n1.y - p1.y }
	}
	return { x: ((n1.x - p1.x) + (n2.x - p2.x)) / 2, y: ((n1.y - p1.y) + (n2.y - p2.y)) / 2 }
}

function getZoom(p1, n1, p2, n2) {
	if (!n2) {
		return 1
	}
	if (!p2) {
		return 1
	}
	let initialDistance = distance2d(p1, p2);
	let newDistance = distance2d(n1, n2);
	if (initialDistance < 0.01)
		return 1
	else
		return newDistance / initialDistance
}

function getAngleDelta(p1, n1, p2, n2) {
	if (!n2) {
		return 0
	}
	let angle1 = getAngle(p1, p2)
	let angle2 = getAngle(n1, n2)
	return angle2 - angle1
}

function getAngle(p1, n1) {
	let delta = getDelta(p1, n1)
	let angle = Math.atan2(delta.y, delta.x)
	return angle
}

function Touch(div, deadzone) {
	this.deadzone = deadzone
	this.clear()
	let startPosition = null
	let startTime = null
	let startMoveSecound = null
	let position = null
	let thisMoveSecound = null
	let mouseDown = 0;
	let click = true;
	let touch = false;
	let touchSecound = false;
	this.centerPosition = { x: 0, y: 0 };
	this.debug = false;
	this.console_error = false;
	this.throw_error = false;
	this.last_error = ''
	this.preventDefault = true;
	const moveTouchT = (e) => {
		if (this.preventDefault) {
			e.preventDefault();
		}
		const { top, left } = e.currentTarget.getBoundingClientRect()
		if (e.touches[1] && e.touches[0]) {
			let first = { x: e.touches[0].clientX - left, y: e.touches[0].clientY - top }
			let secound = { x: e.touches[1].clientX - left, y: e.touches[1].clientY - top }
			this.centerPosition = { x: (first.x + secound.x) / 2, y: (first.y + secound.y) / 2 }
			return moveTouch(first, secound)
		}
		if (e.touches[0]) {
			let first = { x: e.touches[0].clientX - left, y: e.touches[0].clientY - top }
			this.centerPosition = { x: first.x, y: first.y }
			return moveTouch(first)
		}
	}
	const moveTouchM = (e) => {
		if (this.preventDefault) {
			e.preventDefault();
		}
		const { top, left } = e.currentTarget.getBoundingClientRect()
		this.centerPosition = { x: e.clientX - left, y: e.clientY - top }
		if (mouseDown) moveTouch({ x: e.clientX - left, y: e.clientY - top })
	}

	const moveTouch = (e, secound) => {
		touch = true;
		if (startPosition == null) {
			startPosition = { x: e.x, y: e.y }
			startTime = +(new Date())
			position = { x: e.x, y: e.y }
			this.triger('start', position)
			click = true
			return;
		}
		if (secound && startMoveSecound == null) {
			touchSecound = true;
			if (distance2d(startPosition, secound) < distance2d(startPosition, e)) {
				//switched touches
				startPosition = { x: e.x, y: e.y };
				startTime = +(new Date())
				position = { x: e.x, y: e.y };
			}
			startMoveSecound = { x: secound.x, y: secound.y }
			thisMoveSecound = { x: secound.x, y: secound.y }
			return;
		}
		if (!secound && startMoveSecound) {
			touchSecound = false;
			startMoveSecound = null
			thisMoveSecound = null
			return;
		}


		let delta = getDelta(position, e, thisMoveSecound, secound)
		let deltaZoom = getZoom(position, e, thisMoveSecound, secound)
		let deltaAngle = getAngleDelta(position, e, thisMoveSecound, secound)
		position = { x: e.x, y: e.y }
		thisMoveSecound = secound ? { x: secound.x, y: secound.y } : null
		let direction = getDelta(startPosition, position, startMoveSecound, thisMoveSecound)
		let zoom = getZoom(startPosition, position, startMoveSecound, thisMoveSecound)
		let distance = len2d(direction)
		let angle = getAngleDelta(startPosition, position, startMoveSecound, thisMoveSecound)
		let deltaTime = (+(new Date()))-startTime
		let debug = this.debug && `${startPosition && 'Start: ' + JSON.stringify(startPosition)},
		${position && 'This: ' + JSON.stringify(position)}, 
		${startMoveSecound && 'Start secound: ' + JSON.stringify(startMoveSecound)}, 
		${thisMoveSecound && 'Start this: ' + JSON.stringify(thisMoveSecound)},
		${delta && 'Delta: ' + JSON.stringify(delta)},
		${'Zoom: ' + zoom},
		${'DZoom: ' + deltaZoom}
		${'Angle: ' + angle}
		${'DAngle: ' + deltaAngle}
		${'isPrimary: ' + ((!touchSecound && mouseDown == 0) || mouseDown == 1)}
		${this.last_error}`
		let addition = {
			delta,
			direction,
			startPosition,
			position,
			distance,
			click,
			isClick: click,
			mouseDown,
			zoom,
			deltaZoom,
			touchSecound,
			angle,
			deltaAngle,
			startTime,
			deltaTime,
			isPrimary: ((!touchSecound && mouseDown == 0) || mouseDown == 1),
			debug,
			centerPosition: this.centerPosition
		}

		this.triger('force', addition)
		if (distance > this.deadzone) {
			click = false
			if (Math.abs(direction.x) > Math.abs(direction.y)) {
				if (direction.x > 0) {
					this.triger('right', addition)
				} else {
					this.triger('left', addition)
				}
			} else if (direction.y > 0) {
				this.triger('down', addition)
			} else {
				this.triger('up', addition)
			}
		}
	}
	//= {up:[],down:[],left:[],right:[],stop:[],click:[],force:[]}
	const stopTouch = (e) => {
		if (this.preventDefault) {
			e.preventDefault();
		}
		if (touch == false) {
			return
		}
		let delta = { x: 0, y: 0 }
		let deltaZoom = 0
		let deltaAngle = 0
		let direction = getDelta(startPosition, position, startMoveSecound, thisMoveSecound)
		let zoom = getZoom(startPosition, position, startMoveSecound, thisMoveSecound)
		let angle = getAngleDelta(startPosition, position, startMoveSecound, thisMoveSecound)
		let distance = len2d(direction)
		let deltaTime = (+(new Date()))-startTime
		let debug = this.debug && `${startPosition && 'Start: ' + JSON.stringify(startPosition)},
		${position && 'This: ' + JSON.stringify(position)}, 
		${startMoveSecound && 'Start secound: ' + JSON.stringify(startMoveSecound)}, 
		${thisMoveSecound && 'Start this: ' + JSON.stringify(thisMoveSecound)},
		${delta && 'Delta: ' + JSON.stringify(delta)},
		${'Zoom: ' + zoom},
		${'DZoom: ' + deltaZoom}
		${'Angle: ' + angle}
		${'DAngle: ' + deltaAngle}
		${'isPrimary: ' + ((!touchSecound && mouseDown == 0) || mouseDown == 1)}
		${this.last_error}`
		const addition = {
			x: startPosition.x,
			y: startPosition.y,
			delta,
			direction,
			startPosition,
			position,
			distance,
			click,
			isClick: click,
			mouseDown,
			zoom,
			deltaZoom,
			touchSecound,
			angle,
			deltaAngle,
			startTime,
			deltaTime,
			isPrimary: ((!touchSecound && mouseDown == 0) || mouseDown == 1),
			debug,
			centerPosition: this.centerPosition
		}
		touch = false
		touchSecound = false;
		let saveMove = startPosition;

		if (click) {
			if (e.button) {
				if (e.button === 1) this.triger('bmiddle', addition)
				if (e.button === 2) this.triger('bright', addition)
			}
			if (saveMove) {
				this.triger('click', addition)
			}
		}
		this.triger('stop', addition)
		startPosition = null
		startTime = null

		position = null
		startMoveSecound = null
		thisMoveSecound = null
		mouseDown = 0
	}
	div.addEventListener('touchmove', moveTouchT, false)
	div.addEventListener('touchend', stopTouch, false)
	div.addEventListener('touchstart', moveTouchT, false)
	div.addEventListener('mouseleave', stopTouch, false)
	div.addEventListener('mousemove', moveTouchM)
	div.addEventListener('mouseup', stopTouch)
	div.addEventListener('mousedown', e => {
		mouseDown = 1 + e.button;
		moveTouchM(e)
	})
}
/*eslint-disable */
Touch.prototype.sub = function (ev, func) {
	if (this.events[ev]) this.events[ev].push(func)
}

Touch.prototype.onClick = function (func) {
	this.events.click.push(func)
}
Touch.prototype.onForce = function (func) {
	this.events.force.push(func)
}
Touch.prototype.onStart = function (func) {
	this.events.start.push(func)
}
Touch.prototype.onStop = function (func) {
	this.events.stop.push(func)
}
Touch.prototype.onUp = function (func) {
	this.events.up.push(func)
}
Touch.prototype.onDown = function (func) {
	this.events.down.push(func)
}
Touch.prototype.onLeft = function (func) {
	this.events.left.push(func)
}
Touch.prototype.onRight = function (func) {
	this.events.right.push(func)
}

Touch.prototype.unsub = function (ev, func) {
	if (this.events[ev])
		this.events[ev] = this.events[ev].filter(fu => fu !== func)
}
Touch.prototype.clearEvlent = function (ev) {
	if (this.events[ev]) this.events[ev] = []
}
Touch.prototype.clear = function () {
	this.events = {
		up: [],
		down: [],
		left: [],
		right: [],
		stop: [],
		start: [],
		click: [],
		force: [],
		bmiddle: [],
		bright: [],
	}
}
Touch.prototype.triger = function (ev, args) {
	if (this.events[ev])
		this.events[ev].forEach(func => {
			try {
				func(args)
			}
			catch (e) {
				if (this.console_error) console.log(e)
				this.last_error = 'Error: ' + e.name +
					' ' + e.foo +
					' ' + e.message +
					' ' + e.stack
				if (this.throw_error) throw e
			}
		})
}

export { Touch as default}