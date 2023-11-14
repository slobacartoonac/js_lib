function Entity() {}

function EntityManager() {
	this._entities = new Set()
	this._components = new Map()
}

EntityManager.prototype.create = function () {
	var entity = this.make_entity()
	this._entities.add(entity)
	this._components.set(entity, new Map())
	return entity
}

EntityManager.prototype.make_entity = function () {
	return new Entity()
}

EntityManager.prototype.alive = function (e) {
	return this._entities.has(e)
}

EntityManager.prototype.destroy = function (e) {
	this._components.delete(e)
	this._entities.delete(e)
}

EntityManager.prototype.asign = function (component, e) {
	if(!e){
		throw Error("Can't asign to "+e)
	}
	if(!(e instanceof Entity)){
		throw Error(e+" is not Entity")
	}
	var entity_components = this._components.get(e)
	if (!entity_components) {
		throw Error(e+" not Entity form this set")
		return
	}
	var components_of_type = entity_components.get(component.constructor.name);
	if (!components_of_type) {
		let elComponents = this._components.get(e)
		elComponents.set(component.constructor.name, new Set([component]))
		return
	}
	if (components_of_type &&
		entity_components.get(component.constructor.name).has(component)
	){
		throw Error('Component is allready asiged')
	}
	components_of_type.add(component)
}

EntityManager.prototype.get = function (c_type, e) {
	var entity_components = this._components.get(e)
	if (!entity_components) {
		return []
	}
	var components_of_type = entity_components.get(c_type.name)
	if (!components_of_type) {
		return []
	}
	return Array.from(components_of_type)
}

EntityManager.prototype.remove = function (component, e) {
	var entity_components = this._components.get(e)
	if (!entity_components) {
		return
	}
	var components_of_type = entity_components.get(component.constructor.name)
	if (!components_of_type) {
		return
	}
	components_of_type.delete(component)
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
