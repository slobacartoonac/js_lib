import { Transform } from './transform'
function Physics(speeds, mass, drag) {
	this.speeds = speeds
	this.mass = mass
	this.drag = isNaN(drag) ? 0.001 : drag
	this.maxSpeed = 100
}


Physics.prototype.applyForce = function (force) {
	for (var i = 0; i < this.speeds.length; i++) {
		this.speeds[i] += force[i] / this.mass
	}
}

Physics.prototype.applyAsc = function (asc) {
	for (var i = 0; i < this.speeds.length; i++) {
		this.speeds[i] += asc[i]
	}
}

Physics.prototype.compute = function () {
	var speedValue = 0
	var i
	for (i = 0; i < this.speeds.length; i++) {
		speedValue += this.speeds[i] * this.speeds[i]
	}

	var speedMultipliyer = Math.min(1 - this.drag, this.maxSpeed / speedValue)

	for (i = 0; i < this.speeds.length; i++) {
		this.speeds[i] *= speedMultipliyer
	}
}

function PhysicsEngine(manager, engines) {
	this.manager = manager
	this.engines = engines
}

PhysicsEngine.prototype.compute = function () {
	this.engines.forEach(engine => engine.compute())
	this.manager.getEnities(Physics).forEach(elem => {
		var physics = this.manager.get(Physics, elem)[0]
		physics.compute()
		var transform = this.manager.get(Transform, elem)[0]
		transform.positions.add(physics.speeds)
	})
}

export { PhysicsEngine, Physics }