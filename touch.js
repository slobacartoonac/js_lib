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
	const link = this
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
	function moveTouchT(e) {
		e.preventDefault()
		const { top, left } = e.target.getBoundingClientRect()
		if (e.touches[1])
			return moveTouch({ x: e.touches[0].clientX - left, y: e.touches[0].clientY - top }
				, { x: e.touches[1].clientX - left, y: e.touches[1].clientY - top })
		if (e.touches[0])
			return moveTouch({ x: e.touches[0].clientX - left, y: e.touches[0].clientY - top })
	}
	function moveTouchM(e) {
		e.preventDefault()
		const { top, left } = e.target.getBoundingClientRect()
		if (mouseDown) moveTouch({ x: e.clientX - left, y: e.clientY - top })
	}
	function moveTouch(e, secound) {
		touch = true;
		if (secound && startMoveSecound == null) {
			touchSecound = true;
			startMoveSecound = { x: secound.x, y: secound.y }
			thisMoveSecound = { x: secound.x, y: secound.y }
		}
		if (!secound && startMoveSecound) {
			touchSecound = false;
			startMoveSecound = null
			thisMoveSecound = null
		}
		if (startMove == null) {
			startMove = { x: e.x, y: e.y }
			thisMove = { x: e.x, y: e.y }
			link.triger('start', thisMove)
			click = true
		} else {

			const delta = getDelta(thisMove, e, thisMoveSecound, secound)
			const deltaZoom = getZoom(thisMove, e, thisMoveSecound, secound)
			thisMove = { x: e.x, y: e.y }
			thisMoveSecound = secound ? { x: secound.x, y: secound.y } : null
			const direction = getDelta(startMove, thisMove, startMoveSecound, thisMoveSecound)
			const zoom = getZoom(startMove, thisMove, startMoveSecound, thisMoveSecound)
			link.triger('force', {
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
				isPrimary: (!touchSecound && mouseDown == 0) || mouseDown == 1
				// debug: `${startMove && JSON.stringify(startMove)},
				// ${startMove && JSON.stringify(thisMove)}, 
				// ${startMoveSecound && JSON.stringify(startMoveSecound)}, 
				// ${thisMoveSecound && JSON.stringify(thisMoveSecound)},
				// ${zoom},
				// ${deltaZoom}
				// `
			})
			if (distance2d(startMove, thisMove) > link.deadzone) {
				click = false
				if (Math.abs(direction.x) > Math.abs(direction.y)) {
					if (direction.x > 0) {
						link.triger('left')
					} else {
						link.triger('right')
					}
				} else if (direction.y > 0) {
					link.triger('down')
				} else {
					link.triger('up')
				}
			}
		}
	}
	//= {up:[],down:[],left:[],right:[],stop:[],click:[],force:[]}
	function stopTouch(e) {
		e.preventDefault()
		if (touch == false) {
			return
		}
		touch = false
		touchSecound = false
		if (click) {
			if (e.button) {
				if (e.button === 1) link.triger('bmiddle')
				if (e.button === 2) link.triger('bright')
			} else if (startMove) {
				link.triger('click', startMove)
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

		link.triger('stop', {
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
			func(args)
		})
}

export default Touch