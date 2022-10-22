var assert = require('assert');
const { Vector } = require('../shapes/vector');

describe('const tests', function () {
    it('Create and test', function () {
        let test = new Vector();
        assert.equal(test.constructor.name, "Vector")
    });
})
