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
	this._generation = new Map()
	this._free_indices = []
	this._entities = new Map()
	this._components = new Map()
	this.__entities_with_type = new Map()
}

EntityManager.prototype.create = function () {
	var idx = 0
	if (this._free_indices.length > MINIMUM_FREE_INDICES) {
		idx = this._free_indices.shift()
	} else {
		idx = this._generation.size
		this._generation.set(idx, 0)
	}
	var entity = this.make_entity(idx, this._generation.get(idx))
	this._entities.set(idx, entity)
	return entity
}

EntityManager.prototype.make_entity = function (idx, generation) {
	return new Entity(idx + (generation << ENTITY_INDEX_BITS))
}

EntityManager.prototype.alive = function (e) {
	return this._generation.get(e.index()) == e.generation()
}

EntityManager.prototype.destroy = function (e) {
	this._components.delete(e.id)
	this._entities.delete(e.id)
	let index = e.index()
	let generation = this._generation.get(index) + 1
	this._generation.set(index, generation)
	this._free_indices.push(index)
}

EntityManager.prototype.asign = function (component, e) {
	if(!e){
		throw Error("Can't asign to "+e)
	}
	if(!(e instanceof Entity)){
		throw Error(e+" is not Entity")
	}
	var entity_components = this._components.get(e.id)
	if (!entity_components) {
		this._components.set(e.id, new Map([[component.constructor.name, [component]]]))
		return
	}
	var components_of_type = entity_components.get(component.constructor.name);
	if (!components_of_type) {
		let elComponents = this._components.get(e.id)
		elComponents.set(component.constructor.name, [component])
		return
	}
	if (components_of_type &&
		entity_components.get(component.constructor.name).find(comp => component === comp)
	)
		throw Error('Component is allready asiged')
	entity_components.get(component.constructor.name).push(component)
}

EntityManager.prototype.get = function (c_type, e) {
	var entity_components = this._components.get(e.id)
	if (!entity_components) {
		return []
	}
	var components_of_type = entity_components.get(c_type.name)
	if (!components_of_type) {
		return []
	}
	return components_of_type
}

EntityManager.prototype.remove = function (component, e) {
	var entity_components = this._components.get(e.id)
	if (!entity_components) {
		return
	}
	var components_of_type = entity_components.get(component.constructor.name)
	if (!components_of_type) {
		return
	}
	entity_components.set(component.constructor.name, entity_components.get(component.constructor.name).filter(function (compon) {
		return compon !== component
	}))
}

EntityManager.prototype.getEnities = function (c_type) {
	return [...this._entities.values()].filter(
		(entity) => {
			return entity && this.get(c_type, entity).length
		}
	)
}

export {
	Entity,
	EntityManager
}
