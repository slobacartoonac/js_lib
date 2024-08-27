function randomInt(){
	return 1+Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER))
}

function Entity(id) {
	this.id = id || randomInt()
}

function EntityManager() {
	this._entities = new Map()
	this._components = new Map()
}

EntityManager.prototype.create = function () {
	var entity = this.make_entity()
	this._entities.set(entity.id, entity)
	this._components.set(entity.id, new Map())
	return entity
}

EntityManager.prototype.make_entity = function () {
	return new Entity()
}

EntityManager.prototype.alive = function (e) {
	return this._entities.has(e.id)
}

EntityManager.prototype.destroy = function (e) {
	this._entities.delete(e.id)
	this._components.delete(e.id)
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
		throw Error(e+" not Entity form this set")
		return
	}
	var components_of_type = entity_components.get(component.constructor.name);
	if (!components_of_type) {
		let elComponents = this._components.get(e.id)
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
	var entity_components = this._components.get(e.id)
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
	var entity_components = this._components.get(e.id)
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
	const res = []
	this._entities.forEach(
		(entity) => {
			if(entity && this.get(c_type, entity).length){
				res.push(entity)
			}
		}
	)
	return res
}

EntityManager.prototype.toString = function (){
    const seen = new WeakSet();
	const arrayLike = new WeakMap(); 

    function replacer(key, value) {
        if (value && typeof value === 'object') {
			if(Array.isArray(value)){
				return value
			}
			let myObject = value
			if(value instanceof Array){
				if(arrayLike.has(value)){
					myObject = arrayLike.get(value)
				} else {
					myObject = {
						__forceType: value.constructor.name,
						data: value.slice()
					}
					arrayLike.set(value, myObject)
				}
			}
            // Handle circular references
            if (seen.has(myObject)) {
                return Object.assign({}, myObject);
            }
            seen.add(myObject);

            // Add type information
            myObject.__type = value.constructor.name;
			//if(value.__type == 'Vector') debugger
			myObject.__id = randomInt();

            // Continue traversal
            return myObject;
        }
        return value;
    }
	let mapEnteries = Array.from(this._components.entries())
		.map(([key,mapValue])=>[key, Array.from(mapValue.entries())
			.map(([key,setValue])=> [key, Array.from(setValue)])])

    return JSON.stringify(mapEnteries, replacer);
}

EntityManager.fromString = function(jsonString, classMap){
	const seen = new Map();
	Object.assign(classMap, {"Map": Map})
    function reviver(key, value) {
        if (value && typeof value === 'object' && value.__type) {
            // Get the constructor function from classMap
            const Constructor = classMap[value.__forceType || value.__type];
            if (Constructor) {
				if (seen.has(value.__id)) {
					return seen.get(value.__id);
				}
				var data = value.__forceType ? value.data : value
				Object.setPrototypeOf(data, Constructor.prototype);
                // Remove the __type property
				let id = value.__id
                delete value.__type;
				delete value.__id;
				delete value.__forceType;
				seen.set(id, data)
                return data;
            } else {
				throw new Error("No classMap provided for "+value.__type)
			}
        }
        return value;
    }

    let componentsEnteries = JSON.parse(jsonString, reviver)
		.map(([key, value])=>[key,
			new Map(value.map(([key, value])=>[
				key, new Set(value)
			]))])
	let componentsMap = new Map(componentsEnteries)
	let entitiesMap = new Map([...componentsMap.keys()].map(id=>[id, new Entity(id)]))
	let newEntityManager = new EntityManager()
	Object.assign(newEntityManager, {_components: componentsMap});
	Object.assign(newEntityManager, {_entities: entitiesMap})
	return newEntityManager
}

export {
	Entity,
	EntityManager
}
