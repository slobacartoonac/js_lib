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
        let res = search([0],{getNeighbors,heuristic})
        assert.equal(res.pop(),0)
        assert.equal(res.pop(),8)
        assert.equal(res.pop(),5)
        assert.equal(res.pop(),13)
        assert.equal(res.pop(),10)
    });


    // it('longer search', function () {
    //     function heuristic(position){
    //         return Math.abs(131 - position)
    //     }
    //     function getNeighbors(position){
    //         return [position + 8, position - 3, position + 30, , position + 97]
    //     }
    //     let res = search([0],{getNeighbors,heuristic, maxPathLength: 10})
    //     assert.equal(res.pop(),0)
    //     assert.equal(res.pop(),97)
    //     assert.equal(res.pop(),94)
    //     assert.equal(res.pop(),124)
    //     assert.equal(res.pop(),121)
    //     assert.equal(res.pop(),129)
    //     assert.equal(res.pop(),126)
    //     assert.equal(res.pop(),134)
    //     assert.equal(res.pop(),131)
    //     assert.equal(res.pop(),undefined)
    // });

    // it('longer search with isGoal and getScore', function () {
    //     function heuristic(position){
    //         return Math.abs(132 - position)
    //     }
    //     function getNeighbors(position){
    //         return [position + 8, position - 5, position + 30, , position + 97]
    //     }
        
    //     function isGoal(position){
    //         return position == 132
    //     }

    //     function getScore(position){
    //         return Math.abs(131 - position)
    //     }

    //     let res = search([0],{getNeighbors, heuristic, isGoal, getScore, maxPathLength: 10})
    //     assert.equal(res.pop(),0)
    //     assert.equal(res.pop(),97)
    //     assert.equal(res.pop(),105)
    //     assert.equal(res.pop(),113)
    //     assert.equal(res.pop(),121)
    //     assert.equal(res.pop(),129)
    //     assert.equal(res.pop(),137)
    //     assert.equal(res.pop(),132)
    //     assert.equal(res.pop(),undefined)
    // });
    // it('longer search for closest complex', function () {
    //     function heuristic(position){
    //         return Math.abs(12 - position.value)
    //     }
    //     function getNeighbors(position){
    //         return [{op: '+8', value: position.value + 8},{op:'-5', value: position.value - 5}]
    //     }

    //     let res = search([{value: 0}],{getNeighbors, heuristic, maxPathLength: 10})
    //     console.log(res)
    //     assert.deepEqual(res.pop(), {value: 0})
    //     assert.deepEqual(res.pop(), {op: '+8', value: 8})
    //     assert.deepEqual(res.pop(), {op: '+8', value: 16})
    //     assert.deepEqual(res.pop(), { op: '-5', value: 11 })
    //     assert.deepEqual(res.pop(), { op: '-5', value: 6 })
    //     assert.deepEqual(res.pop(), { op: '+8', value: 14 })
    //     assert.deepEqual(res.pop(),  { op: '-5', value: 9 })
    //     assert.deepEqual(res.pop(), { op: '+8', value: 17 })
    //     assert.deepEqual(res.pop(), { op: '-5', value: 12 })
    // });
    it('sort search for closest complex', function () {
        function heuristic(position){
            return Math.abs(12 - position.value)
        }
        function getNeighbors(position){
            return [{op: '+8', value: position.value + 8},{op:'-5', value: position.value - 5}]
        }

        let res = search([{value: 0}],{getNeighbors, heuristic, maxPathLength: 6})
        console.log(res)
        assert.deepEqual(res.pop(), {value: 0})
        assert.deepEqual(res.pop(), {op: '+8', value: 8})
        assert.deepEqual(res.pop(), {op: '+8', value: 16})
        assert.deepEqual(res.pop(), { op: '-5', value: 11 })
    });
})
