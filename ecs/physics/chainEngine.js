import { Physics } from './physics.js'
import { Transform } from './transform.js'

const defaultForce = (distanceNormalised)=>{
	return Math.atan((distanceNormalised - 1) * 5) + Math.pow(distanceNormalised - 1, 3)
}

function ChainLink(connects, distance, force = defaultForce) {
	this.connects = connects
	this.distance = distance
	this.force = force
}

function computeChainForce(
	naibor,
	transform,
) {
	var ret = [0, 0]
	naibor.forEach(({ transform: naiborTranform, distance: naiborDistance, force }) => {
		var distanceX = (naiborTranform.positions[0] - transform.positions[0])
		var distanceY = (naiborTranform.positions[1] - transform.positions[1])
		var distanceAngle = Math.atan2(distanceY, distanceX)
		var distance = Math.sqrt(
			distanceX * distanceX
			+ distanceY * distanceY)
		var distanceNormalised = distance / naiborDistance
		var forceIntencity = force(distanceNormalised)
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
			var naibor = chainLinks.map(link => ({ transform: this.manager.get(Transform, link.connects)[0], distance: link.distance, force: link.force }))
			var transform = this.manager.get(Transform, elem)[0]
			var physics = this.manager.get(Physics, elem)[0]
			var force = computeChainForce(
				naibor,
				transform
			)
			physics.applyForce(force)
		}
	)
}

export {
	ChainLink,
	ChainEngine
}