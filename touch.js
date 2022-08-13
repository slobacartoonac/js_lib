// written by Slobodan Zivkovic slobacartoonac@gmail.com
function distance2d(a, b) {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
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

function Touch(div, deadzone) {
	this.deadzone = deadzone
	this.clear()
	let startMove = null
	let startMoveSecound = null
	let thisMove = null
	let thisMoveSecound = null
	let mouseDown = 0;
	let click = true;
	let touch = false;
	let touchSecound = false;
	this.mousePosition = { x: 0, y: 0 };
	this.debug = false;
	this.console_error = false;
	this.throw_error = false;
	this.last_error = ''
	const moveTouchT = (e) => {
		e.preventDefault()
		const { top, left } = e.target.getBoundingClientRect()
		if (e.touches[1] && e.touches[0]) {
			let first = { x: e.touches[0].clientX - left, y: e.touches[0].clientY - top }
			let secound = { x: e.touches[1].clientX - left, y: e.touches[1].clientY - top }
			this.mousePosition = { x: (first.x + secound.x) / 2, y: (first.y + secound.y) / 2 }
			return moveTouch(first, secound)
		}
		if (e.touches[0]) {
			let first = { x: e.touches[0].clientX - left, y: e.touches[0].clientY - top }
			this.mousePosition = { x: first.x, y: first.y }
			return moveTouch(first)
		}
	}
	const moveTouchM = (e) => {
		e.preventDefault()
		const { top, left } = e.target.getBoundingClientRect()
		this.mousePosition = { x: e.clientX - left, y: e.clientY - top }
		if (mouseDown) moveTouch({ x: e.clientX - left, y: e.clientY - top })
	}
	const moveTouch = (e, secound) => {
		touch = true;
		if (startMove == null) {
			startMove = { x: e.x, y: e.y }
			thisMove = { x: e.x, y: e.y }
			this.triger('start', thisMove)
			click = true
			return;
		}
		if (secound && startMoveSecound == null) {
			touchSecound = true;
			if (distance2d(startMove, secound) < distance2d(startMove, e)) {
				//switched touches
				startMove = { x: e.x, y: e.y };
				thisMove = { x: e.x, y: e.y };
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


		const delta = getDelta(thisMove, e, thisMoveSecound, secound)
		const deltaZoom = getZoom(thisMove, e, thisMoveSecound, secound)
		thisMove = { x: e.x, y: e.y }
		thisMoveSecound = secound ? { x: secound.x, y: secound.y } : null
		const direction = getDelta(startMove, thisMove, startMoveSecound, thisMoveSecound)
		const zoom = getZoom(startMove, thisMove, startMoveSecound, thisMoveSecound)
		this.triger('force', {
			delta,
			direction,
			startPosition: startMove,
			position: thisMove,
			distance: distance2d(startMove, thisMove),
			click,
			mouseDown,
			zoom,
			deltaZoom,
			touchSecound,
			isPrimary: ((!touchSecound && mouseDown == 0) || mouseDown == 1),
			debug: this.debug && `${startMove && 'Start: ' + JSON.stringify(startMove)},
${thisMove && 'This: ' + JSON.stringify(thisMove)}, 
${startMoveSecound && 'Start secound: ' + JSON.stringify(startMoveSecound)}, 
${thisMoveSecound && 'Start this: ' + JSON.stringify(thisMoveSecound)},
${delta && 'Delta: ' + JSON.stringify(delta)},
${'Zoom: ' + zoom},
${'DZoom: ' + deltaZoom}
${'isPrimary: ' + ((!touchSecound && mouseDown == 0) || mouseDown == 1)}
${this.last_error}`
		})
		if (distance2d(startMove, thisMove) > this.deadzone) {
			click = false
			if (Math.abs(direction.x) > Math.abs(direction.y)) {
				if (direction.x > 0) {
					this.triger('left')
				} else {
					this.triger('right')
				}
			} else if (direction.y > 0) {
				this.triger('down')
			} else {
				this.triger('up')
			}
		}
	}
	//= {up:[],down:[],left:[],right:[],stop:[],click:[],force:[]}
	const stopTouch = (e) => {
		e.preventDefault()
		if (touch == false) {
			return
		}
		touch = false
		touchSecound = false;
		let saveMove = startMove;

		if (click) {
			if (e.button) {
				if (e.button === 1) this.triger('bmiddle')
				if (e.button === 2) this.triger('bright')
			} else if (saveMove) {
				this.triger('click', saveMove)
			}
		}
		const delta = { x: 0, y: 0 }
		let direction = { x: 0, y: 0 }
		let distance = 0
		if (thisMove && startMove) {
			direction = {
				x: thisMove.x - startMove.x,
				y: thisMove.y - startMove.y,
			}
			distance = distance2d(startMove, thisMove)
		}

		this.triger('stop', {
			delta,
			direction,
			startPosition: startMove,
			position: thisMove,
			distance,
			click,
			mouseDown
		})
		startMove = null
		thisMove = null
		startMoveSecound = null
		thisMoveSecound = null
		mouseDown = 0
	}
	div.addEventListener(
		'touchstart',
		e => {
			e.preventDefault()
		},
		false,
	)
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
Touch.prototype.onStop = function (func) {
	this.events.stop.push(func)
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

export default Touch