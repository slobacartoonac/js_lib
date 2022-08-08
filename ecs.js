const ENTITY_INDEX_BITS = 22
const ENTITY_INDEX_MASK = (1 << ENTITY_INDEX_BITS) - 1

const ENTITY_GENERATION_BITS = 8
const ENTITY_GENERATION_MASK = (1 << ENTITY_GENERATION_BITS) - 1
const MINIMUM_FREE_INDICES = 0

function Entity(id) {
	this.id = id
}
Entity.prototype.index = function () { 
	return this.id & ENTITY_INDEX_MASK
}
Entity.prototype.generation = function () { 
	return (this.id >> ENTITY_INDEX_BITS) & ENTITY_GENERATION_MASK
}

function EntityManager() {
	this._generation = {}
	this._free_indices = []
	this._entities = {}
	this._components = {}
	this.__entities_with_type = {}
}

EntityManager.prototype.create = function () {
	var idx = 0
	if (this._free_indices.length > MINIMUM_FREE_INDICES) {
		idx = this._free_indices.shift()
	} else {
		idx = Object.keys(this._generation).length
		this._generation[idx] = 0
	}
	var entity = this.make_entity(idx, this._generation[idx])
	this._entities[idx] = entity
	return entity
}

EntityManager.prototype.make_entity = function (idx, generation) {
	return new Entity(idx + (generation << ENTITY_INDEX_BITS))
}

EntityManager.prototype.alive = function (e) {
	return this._generation[e.index()] == e.generation()
}

EntityManager.prototype.destroy = function (e) {
	delete this._entities[e.id]
	++this._generation[e.index()]
	this._free_indices.push(e.index())
}

EntityManager.prototype.asign = function(component, e){
	var entity_components = this._components[e.id]
	if(!entity_components){
		this._components[e.id] = {
			[component.constructor.name]: [component]
		}
		return
	}
	var components_of_type = entity_components[component.constructor.name]
	if(!components_of_type){
		this._components[e.id][component.constructor.name] = [component]
		return
	}
	if(components_of_type &&
		entity_components[component.constructor.name].find(comp=>component===comp)
		)
		throw Error('Component is allready asiged')
	entity_components[component.constructor.name].push(component)
}

EntityManager.prototype.get = function(c_type, e){
	var entity_components = this._components[e.id]
	if(!entity_components){
		return []
	}
	var components_of_type = entity_components[c_type.name]
	if(!components_of_type){
		return []
	}
	return components_of_type
}

EntityManager.prototype.remove = function(component, e){
	var entity_components = this._components[e.id]
	if(!entity_components){
		return
	}
	var components_of_type = entity_components[component.constructor.name]
	if(!components_of_type){
		return
	}
	entity_components[component.constructor.name] = entity_components[component.constructor.name].filter(function(compon){
		return compon !== component
	})
}

EntityManager.prototype.getEnities = function(c_type){
	return Object.values(this._entities).filter(
		(entity)=>{
			return this.get(c_type, entity).length
		}
	)
}

export { Entity,
	EntityManager }
