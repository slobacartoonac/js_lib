var assert = require('assert');
const { search } = require('../search/aStar');

/*
startPositions, {
getScore,
isGoal,
getNeighbors,
heuristic,
maxPathLength }
*/

describe('search tests', function () {
    it('minimal search', function () {
        function heuristic(position){
            return Math.abs(10 - position)
        }
        function getNeighbors(position){
            return [position + 8, position - 3]
        }
        search([0],{getNeighbors,heuristic})
    });

    // it('Create and test', function () {
    //     let test = new Vec2(1).scale(2);
    //     assert.equal(test.constructor.name, "Vec2")
    // });

})
