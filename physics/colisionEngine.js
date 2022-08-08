import { ShapeCircle } from '../shapes/circle.js'
import { Physics } from './physics.js'
import { Transform } from './transform.js'

function ColisionEngine(manager){
	this.manager = manager
	this.physic_entity = null
}

function computeColision(
	compute,
	naibors
)
{
	var ret=[0,0]
	naibors.forEach(element => {
		if(element==compute) return
		var distanceX = (element.positions[0]-compute.positions[0])
		var distanceY = (element.positions[1]-compute.positions[1])
		var centerDistance = compute.radius + element.radius
		if(Math.abs(distanceX) > centerDistance || Math.abs(distanceY) > centerDistance)
			return
            
		var distanceAngle=Math.atan2( distanceY, distanceX )
		var distance=Math.sqrt(
			distanceX*distanceX
			+distanceY*distanceY)
		if(distance > centerDistance)
			return

		var distanceNormalised = distance / centerDistance
		var forceIntencity=(Math.pow(distanceNormalised-1,3))
		var forceComponents={
			x: Math.cos(distanceAngle)*forceIntencity,
			y: Math.sin(distanceAngle)*forceIntencity
		}
		ret[0]+=forceComponents.x
		ret[1]+=forceComponents.y
	})
	return ret
}

ColisionEngine.prototype.compute= function()
{

	var physic_entity = this.manager.getEnities(Physics).map((elem)=>{
		var circle = this.manager.get(ShapeCircle, elem)[0]
		var transform = this.manager.get(Transform, elem)[0]
		return {
			e:elem,
			radius:  circle.radius,
			positions: transform.positions
		}
	})

	for(var i = 0; i< physic_entity.length; i++){
		var elem = physic_entity[i]
		var force = computeColision(
			elem,
			physic_entity)
		var physics = this.manager.get(Physics, elem.e)[0]
		physics.applyForce(force)
	}
}

export {
	ColisionEngine
}