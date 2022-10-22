var assert = require('assert');
const { Vector } = require('../shapes/vector');

function Vec2(...params) {
    Vector.call(this, ...params)
}
Vec2.prototype = Object.create(Vector.prototype,
    {
        constructor: {
            value: Vec2,
            enumerable: false, // Make it non-enumerable, so it won't appear in `for...in` loop
            writable: true,
            configurable: true,
        }
    })


describe('const tests', function () {
    it('Create and test', function () {
        let test = new Vector();
        assert.equal(test.constructor.name, "Vector")
    });

    it('Create and test', function () {
        let test = new Vec2(1).scale(2);
        assert.equal(test.constructor.name, "Vec2")
    });

})
