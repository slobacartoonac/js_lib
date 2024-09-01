var assert = require('assert')
import { EntityManager } from '../ecs'
import { ScreenPosition } from '../fe/screen-position'
import { Vector } from '../shapes/vector'

describe('EntityManager', function () {
	it('should create entity manager', function () {
		var manager = new EntityManager()
		assert.ok(manager)
		var a = manager.create()
		var b = manager.create()
		manager.destroy(a)
		manager.create()
		manager.create()
	})
	it('should create entity', function () {
		var manager = new EntityManager()
		var a = manager.create()
		var b = manager.create()
	})
	it('should create entity, delete entity, overide entity', function () {
		var manager = new EntityManager()
		var a = manager.create()
		var b = manager.create()
		manager.destroy(a)
		assert.ok(!manager.alive(a))
		assert.ok(manager.alive(b))
		var c = manager.create()
		assert.ok(!manager.alive(a))
	})

	it('it should add component, find component, run function, remove component', function () {
		function Component(a) {
			this.a = a
		}
		Component.prototype.f = function () { this.a++ }
		var manager = new EntityManager()
		var entity = manager.create()
		var component = new Component(5)
		manager.asign(component, entity)
		var component_array = manager.get(Component, entity)
		assert.equal(component_array.length, 1)
		assert.equal(component_array[0].a, 5)
		component_array.forEach(element => {
			element.f()
		})
		assert.equal(component_array[0].a, 6)
		manager.asign(new Component(3), entity)
		manager.remove(component, entity)
		assert.equal(manager.get(Component, entity).length, 1)
		manager.destroy(entity)
		assert.equal(manager.get(Component, entity).length, 0)
	})
	it('it should add 2 components', function () {
		function Component(a) {
			this.a = a
		}
		function ComponentB(a) {
			this.a = a
		}
		var manager = new EntityManager()
		var entity = manager.create()
		var comp = new Component(2)
		manager.asign(comp, entity)
		manager.asign(new ComponentB(3), entity)
		assert.equal(manager.get(Component, entity).length, 1)
		assert.throws(() => manager.asign(comp, entity))
	})
	it('it should add 2 components with Component', function () {
		function Component(a) {
			this.a = a
		}
		function ComponentB(a) {
			this.a = a
		}
		var manager = new EntityManager()
		var entity0 = manager.create()
		var entity1 = manager.create()
		var entity2 = manager.create()
		manager.asign(new Component(2), entity0)
		manager.asign(new Component(2), entity2)
		manager.asign(new ComponentB(2), entity2)
		manager.asign(new ComponentB(2), entity1)
		assert.equal(manager.getEnities(Component).length, 2)
	})
	it('it should add 1 component with Vector', function () {
		var manager = new EntityManager()
		var entity = manager.create()
		var component = new Vector(5)
		manager.asign(component, entity)
		var component_array = manager.get(Vector, entity)
		assert.equal(component_array.length, 1)
	})
	it(`it should add 1 component with Vector 
		asign to two Entityes,
		serialize,
		desiarize
		create other Manager change value and then aply to other`, function () {
		var manager = new EntityManager()
		var entity1 = manager.create()
		var entity2 = manager.create()
		var component = new Vector([5])
		manager.asign(component, entity1)
		manager.asign(component, entity2)
		var stringManager = manager.toString()
		var manager2 = EntityManager.fromString(stringManager, [Vector])

		let ent1Prim = manager2.getEnities(Vector)[0]

		var myVec = manager2.get(Vector, entity1)[0]
		assert.equal(myVec.length, 1)
		myVec.x = 3

		var myVec2 = manager2.get(Vector, ent1Prim)[0]
		assert.equal(myVec2.length, 1)
		assert.equal(myVec2.x, 3)
		assert.notEqual(ent1Prim, entity1)
		assert.deepEqual(ent1Prim, entity1)
	})

	it(`it should save twice and load to ensure proper load, test multiple inheretance`, function () {
		function Component(a) {
			this.a = a
		}
		var manager = new EntityManager()
		var entity1 = manager.create()
		var component = new Vector([5])
		manager.asign(component, entity1)
		var component1 = new Component(5)
		manager.asign(component1, entity1)


		var sc = new ScreenPosition()
		manager.asign(sc, entity1)
		sc.angle = 5

		var stringManager = manager.toString()
		var string2 = EntityManager.fromString(stringManager, [Vector, Component, ScreenPosition]).toString()
		var manager2 = EntityManager.fromString(string2, [Vector, Component, ScreenPosition])

		let ent1Prim = manager2.getEnities(Vector)[0]

		var myVec = manager2.get(Vector, entity1)[0]
		assert.equal(myVec.length, 1)
		assert.notEqual(ent1Prim, entity1)
		assert.deepEqual(ent1Prim, entity1)

		var myCom = manager2.get(Component, entity1)[0]
		assert.equal(myCom.a, 5)

		var mySc = manager2.get(ScreenPosition, entity1)[0]
		assert.equal(mySc.angle, 5)
	})

	it('should handle invalid operations gracefully', function () {
		var manager = new EntityManager();
		var entity = manager.create();
		manager.destroy(entity)
		assert.throws(() => manager.get(Position, entity));
	});

	it('should handle null or undefined components gracefully', function () {
		var manager = new EntityManager();
		var entity = manager.create();
		assert.throws(() => manager.asign(null, entity));
		assert.throws(() => manager.remove(null, entity));
	});
	
	it('should measure time to create and destroy 10000 entities', function () {
		function ComponentCommon() {
		}
		function ComponentRare(){
		}
		var manager = new EntityManager();
		for (let i = 0; i < 100_000; i++) {
		  var entity = manager.create();
		  manager.asign(new ComponentCommon(), entity);
		  if(i%150 === 0){
			manager.asign(new ComponentRare(), entity);
		  }
		}
		console.time('throughputTestC');
		manager.getEnities(ComponentCommon)
		console.timeEnd('throughputTestC');
		console.time('throughputTestR');
		manager.getEnities(ComponentRare)
		console.timeEnd('throughputTestR');
	});
})

