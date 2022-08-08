import { Physics } from './physics.js'
import { Transform } from './transform.js'

function GravityEngine(manager, interaction){
	this.manager = manager
	this.interaction = interaction ? interaction : 0.1
}

function computeAttraction(
	compute,
	naibors,
	interaction
)
{
	var ret=[0,0]
	naibors.forEach(element => {
		if(element==compute) return
		var distanceX = (element.positions[0]-compute.positions[0])
		var distanceY = (element.positions[1]-compute.positions[1])
		
		var distance2= distanceX*distanceX + distanceY*distanceY
		var distance = Math.sqrt(distance2)

		var ascIntencity = element.mass / distance2 * interaction
		ret[0] += distanceX / distance * ascIntencity
		ret[1] += distanceY / distance * ascIntencity
	})
	return ret
}

GravityEngine.prototype.compute= function()
{

	var physic_entity = this.manager.getEnities(Physics).map((elem)=>{
		var physics = this.manager.get(Physics, elem)[0]
		var transform = this.manager.get(Transform, elem)[0]
		return {
			e: elem,
			mass:  physics.mass,
			physics,
			positions: transform.positions
		}
	})

	for(var i = 0; i< physic_entity.length; i++){
		var elem = physic_entity[i]
		var asc = computeAttraction(
			elem,
			physic_entity, this.interaction)
		elem.physics.applyAsc(asc)
	}
}

export {
	GravityEngine
}