import { Physics } from './physics.js'
import { Transform } from './transform.js'

function LinearGravityEngine(manager, interaction) {
	this.manager = manager
	this.interaction = interaction ? interaction : 0.1
}

LinearGravityEngine.prototype.compute = function () {

	var physic_entity = this.manager.getEnities(Physics)
		.map((elem) => {
			var physics = this.manager.get(Physics, elem)[0]
			var transform = this.manager.get(Transform, elem)[0]
			return {
				e: elem,
				mass: physics.mass,
				physics,
				positions: transform.positions
			}
		})

	for (var i = 0; i < physic_entity.length; i++) {
		var elem = physic_entity[i]
		var asc = [0, 0.1]
		elem.physics.applyAsc(asc)
	}
}

export {
	LinearGravityEngine
}