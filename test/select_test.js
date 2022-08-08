var assert = require('assert')
const { default: Select } = require('../select')

var points = [[10, 10], [50, 8], [20, 60], [80, 50], [70, 100], [75, 0]]

describe('Select', function () {
	it('should create Select', function () {
		var select = new Select()
		assert.ok(select)
	})
	it('should click select', function () {
		var select = new Select()
		var selectedPoints = select.pointSelect([80, 52], points, 5)
		assert.equal(selectedPoints.length, 1)
	})
	it('should area select', function () {
		var select = new Select()
		var selectedPoints = select.areaSelect([65, 45], [85, 105], points)
		assert.equal(selectedPoints.length, 2)
	})
	it('should click select and add select area no double selection', function () {
		var select = new Select()
		var selectedPoints = select.pointSelect([80, 52], points, 5)
		assert.equal(selectedPoints.length, 1)
		selectedPoints = select.areaSelect([65, 45], [85, 105], points)
		assert.equal(selectedPoints.length, 2)
	})
	it('should click unselect', function () {
		var select = new Select()
		var selectedPoints = select.areaSelect([65, 45], [85, 105], points)
		assert.equal(selectedPoints.length, 2)
		selectedPoints = select.pointSelect([200, 200], points, 5)
		assert.equal(selectedPoints.length, 0)
	})
	it('it should order clockwise', function () {
		var select = new Select()
		select.pointSelect([50, 8], points, 5) // 2
		select.pointSelect([10, 10], points, 5) // 1
		var selectedPoints = select.pointSelect([70, 100], points, 5) // 5
		assert.equal(JSON.stringify(selectedPoints), JSON.stringify([[50, 8], [70, 100], [10, 10]]))
	})
})

