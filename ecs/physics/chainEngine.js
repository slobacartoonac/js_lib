import { Physics } from './physics.js'
import { Transform } from './transform.js'

const defaultForce = (distanceNormalised, distance, distanceGoal)=>{
	return Math.atan((distanceNormalised - 1) * 5) + Math.pow(distanceNormalised - 1, 3)
}

function ChainLink(connects, distance, force = defaultForce) {
	this.connects = connects
	this.distance = distance
	this.force = force
	this.dampening = 0.05
}

/**
 * Description placeholder
 *
 * @param {number[]} force
 * @param {number[]} velocity
 * @returns {number[]}
 */
function dampenForceBasedOnVelocity(force, velocity, dampening) {
	//project velocity on force
	//make force smaller based on velocity
	// use dot product
	let velocityMagnitude = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
	let forceMagnitude = Math.sqrt(force[0] * force[0] + force[1] * force[1]);
	let devider = velocityMagnitude * forceMagnitude
	
	if(devider == 0){
		return force
	}
	let dotProduct = (force[0] * velocity[0] + force[1] * velocity[1]) / devider;
	let dampingFactor = Math.max(0, 1 - dotProduct*dampening);
	
	return [force[0] * dampingFactor, force[1] * dampingFactor];
}

function computeChainForce(
	naibors,
	transform,
) {
	var ret = [0, 0]
	naibors.forEach(({ transform: naiborTranform, distance: distanceGoal, force }) => {
		var distanceX = (naiborTranform.positions[0] - transform.positions[0])
		var distanceY = (naiborTranform.positions[1] - transform.positions[1])
		var distanceAngle = Math.atan2(distanceY, distanceX)
		var distance = Math.sqrt(
			distanceX * distanceX
			+ distanceY * distanceY)
		var distanceNormalised = distance / distanceGoal
		var forceIntencity = force(distanceNormalised, distance, distanceGoal)
		var forceComponents = {
			x: Math.cos(distanceAngle) * forceIntencity,
			y: Math.sin(distanceAngle) * forceIntencity
		}
		ret[0] += forceComponents.x
		ret[1] += forceComponents.y
	})
	return ret
}

function ChainEngine(manager) {
	this.manager = manager

}

ChainEngine.prototype.compute = function () {
	this.manager.getEnities(ChainLink).map(
		(elem) => {
			var chainLinks = this.manager.get(ChainLink, elem)
			var naibors = chainLinks.map(link => ({ transform: this.manager.get(Transform, link.connects)[0], distance: link.distance, force: link.force }))
			var transform = this.manager.get(Transform, elem)[0]
			var physics = this.manager.get(Physics, elem)[0] 
			var force = computeChainForce(
				naibors,
				transform
			)

			//dampen force based on velocity
			
			force = dampenForceBasedOnVelocity(force, physics.speeds, chainLinks[0].dampening)
			
			physics.applyForce(force)
		}
	)
}

export {
	ChainLink,
	ChainEngine
}