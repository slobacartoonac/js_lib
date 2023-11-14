var assert = require('assert')
import { EntityManager } from '../ecs'
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

})

