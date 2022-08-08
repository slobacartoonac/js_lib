import { ShapeCircle } from '../shapes/circle.js'
import { Physics } from './physics.js'
import { Transform } from './transform.js'

function PlasticColisionEngine(manager){
	this.manager = manager
	this.physic_entity = null
}

function squareDistance(nodeA, nodeB)
{
	var square=0
	for(var i=0;i<nodeA.positions.length;i++)
		square+=Math.pow((nodeA.positions[i]-nodeB.positions[i]),2)
	return square
}

function computeColision(
	compute,
	naibors
)
{
	var collisions = []
	naibors.forEach(element => {
		if(element==compute) return
		var distanceX = (element.positions[0]-compute.positions[0])
		var distanceY = (element.positions[1]-compute.positions[1])
		var centerDistance = compute.radius + element.radius
		if(Math.abs(distanceX) > centerDistance || Math.abs(distanceY) > centerDistance)
			return
            
		var distance2=squareDistance(compute, element)
		if(distance2 > Math.pow(centerDistance, 2))
			return
		if(compute.radius > element.radius)
			collisions.push(element)
	})
	return collisions
}

PlasticColisionEngine.prototype.compute= function()
{

	var physic_entity = this.manager.getEnities(Physics).map((elem)=>{
		var circle = this.manager.get(ShapeCircle, elem)[0]
		var transform = this.manager.get(Transform, elem)[0]
		var physics = this.manager.get(Physics, elem)[0]
		return {
			e:elem,
			radius:  circle.radius,
			circle,
			positions: transform.positions,
			speeds: physics.speeds,
			physics
		}
	})

	for(var i = 0; i< physic_entity.length; i++){
		
		var elem = physic_entity[i]
		if(!this.manager.alive(elem.e))
			continue
		var colisions = computeColision(
			elem,
			physic_entity)
		for(var collisionIndex in colisions){
			var collision = colisions[collisionIndex]
			if(!this.manager.alive(collision.e))
				continue
			this.manager.destroy(collision.e)
			this.merge(elem, collision)
		}
	}
}

PlasticColisionEngine.prototype.merge=function(nodeA, nodeB)
{
    var cubeRadiusA=Math.pow(nodeA.radius, 3);
    var cubeRadiusB=Math.pow(nodeB.radius, 3);
    var newRadious= Math.cbrt( cubeRadiusA + cubeRadiusB );

	nodeA.circle.radius = newRadious
	var massA=nodeA.physics.mass
    var massB=nodeB.physics.mass
	nodeA.physics.mass = massA + massB

	for (var i=0;i< nodeA.speeds.length;i++)
    {
        nodeA.speeds[i]=(nodeA.speeds[i]*massA + nodeB.speeds[i]*massB)/(massA+massB)
    }
}

export {
	PlasticColisionEngine
}