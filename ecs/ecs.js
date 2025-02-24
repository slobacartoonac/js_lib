function randomInt(){
	return 1+Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER))
}

function Entity(id) {
	this.id = id || randomInt()
}

function EntityNice(id, manager) {
	Entity.call(this, id); 
	this._manager = manager;
}

// Inherit from Entity
EntityNice.prototype = Object.create(Entity.prototype);
EntityNice.prototype.constructor = EntityNice;

// Prototype methods use the entity's assigned manager
EntityNice.prototype.get = function (componentType) {
    return this._manager.get(componentType, this);
};

EntityNice.prototype.has = function (componentType) {
    return this._manager.get(componentType, this).length > 0;
};

EntityNice.prototype.assign = function (component) {
    this._manager.assign(component, this);
};

EntityNice.prototype.remove = function (componentType) {
    this._manager.remove(componentType, this);
};

EntityNice.prototype.destroy = function () {
	this._manager.destroy(this);
};

function EntityManager(isNice) {
	this._entities = new Map()
	this._components = new Map()
	this._nice = !!isNice
}

EntityManager.prototype.create = function () {
	if(this._nice){
		return this.create_nice()
	}
	var entity = this.make_entity()
	this._entities.set(entity.id, entity)
	return entity
}

EntityManager.prototype.create_nice = function () {
	var entity = this.make_entity_nice()
	this._entities.set(entity.id, entity)
	return entity
}

EntityManager.prototype.make_entity = function () {
	return new Entity()
}

EntityManager.prototype.make_entity_nice = function () {
	return new EntityNice(undefined,this)
}

EntityManager.prototype.alive = function (e) {
	return this._entities.has(e.id)
}

EntityManager.prototype.destroy = function (e) {
	this._entities.delete(e.id)
	// ["ComponentType",
	// 	["EntityId", ["ComponentInstance"]]
	// ]
	this._components.forEach((value)=>{
		if(value.has(e.id)){
			value.delete(e.id)
		}
	})
}

EntityManager.prototype.asign = function (component, e) {
	if(!e){
		throw Error("Can't asign to "+e)
	}
	if(!(e instanceof Entity)){
		throw Error(e+" is not Entity")
	}
	var entity = this._entities.get(e.id)
	if (!entity) {
		throw Error(e+" not Entity form this set")
		return
	}

	var componentTypeName = component.constructor.name

	var entitiesMap = this._components.get(componentTypeName)
	if (!entitiesMap) {
		let entitiesMap = new Map()
		entitiesMap.set(e.id, new Set([component]))
		this._components.set(componentTypeName, entitiesMap)
		return
	}
	let componetSet =  entitiesMap.get(e.id)
	if (!componetSet) {
		entitiesMap.set(e.id, new Set([component]))
		return
	}

	if (componetSet.has(component)){
		throw Error('Component is allready asiged')
	}
	componetSet.add(component)
}

EntityManager.prototype.assign = EntityManager.prototype.asign

EntityManager.prototype.get = function (c_type, e) {
	var entity_components = this._components.get(c_type.name)
	if (!entity_components) {
		return []
	}
	var components_of_type = entity_components.get(e.id)
	if (!components_of_type) {
		return []
	}
	return Array.from(components_of_type)
}

EntityManager.prototype.remove = function (component, e) {
	var entity_components = this._components.get(component.constructor.name)
	if (!entity_components) {
		return
	}
	var components_of_entity = entity_components.get(e.id)
	if (!components_of_entity) {
		return
	}
	components_of_entity.delete(component)
}

EntityManager.prototype.getEnities = function (c_type) {
	if(!this._components.has(c_type.name)){
		return []
	}
	const res = []
	this._components.get(c_type.name).forEach(
		(components, eid) => {
			if(components && components.size){
				res.push(this._entities.get(eid))
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

EntityManager.fromString = function(jsonString, classes){
	let entries = classes.map(cl=>[cl.name, cl])
	const classMap = new Map(entries)
	const seen = new Map();
	Object.assign(classMap, {"Map": Map})
    function reviver(key, value) {
        if (value && typeof value === 'object' && value.__type) {
            // Get the constructor function from classMap
            const instanceType = value.__forceType || value.__type;
            if (classMap.has(instanceType)) {
				const Constructor = classMap.get(instanceType)
				if (seen.has(value.__id)) {
					return seen.get(value.__id);
				}
				var data = value.__forceType ? value.data : value
				if(Array.isArray(data)){
					let data1 = data
					data = Object.create(Constructor.prototype)
					data.push(...data1)
				}
				else{
					Object.setPrototypeOf(data, Constructor.prototype);
				}
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
	let componentsTypesMapMap = new Map(componentsEnteries)
	let entitiesSet = new Set()
	let addEnt =  entitiesSet.add.bind(entitiesSet)
	componentsTypesMapMap.forEach((value)=>{
		[...value.keys()].forEach(addEnt)
	})

	let newEntityManager = new EntityManager()
	let entitiesMap = new Map([...entitiesSet.values()].map(id=>[id, new Entity(id, newEntityManager)]))
	
	Object.assign(newEntityManager, {_components: componentsTypesMapMap});
	Object.assign(newEntityManager, {_entities: entitiesMap})
	return newEntityManager
}

export {
	Entity,
	EntityManager
}
