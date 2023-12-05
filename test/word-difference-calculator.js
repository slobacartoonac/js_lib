var assert = require('assert')
import {computeWordDifference, getKeyboardDistance} from '../search/word-difference-calculator'

describe('Keyboard distance', function () {
	it('keyboard distance should be 0, 0, 1, 2 one row', function () {
		assert.equal(getKeyboardDistance('a', 'a'), 0)
		assert.equal(getKeyboardDistance('a', 'A'), 0)
		assert.equal(getKeyboardDistance('a', 's'), 1)
		assert.equal(getKeyboardDistance('a', 'd'), 2)
	})
	it('keyboard distance cross row', function () {
		assert.equal(getKeyboardDistance('a', 'q'), 1.5)
		assert.equal(getKeyboardDistance('s', 'z'), 1.5)
		assert.equal(getKeyboardDistance('z', 's'), 1.5)
		assert.equal(getKeyboardDistance('w', 'z'), 2)
		assert.equal(getKeyboardDistance('t', 'c'), 3)
		assert.equal(getKeyboardDistance('b', 't'), 3)
        assert.equal(getKeyboardDistance('A', 'L'), 8)
        assert.equal(getKeyboardDistance('q', 'm'), 9)
        assert.equal(getKeyboardDistance('z', 'p'), 10)
	})
})


describe('computeWordDifference', function () {
	it('distance one row', function () {
		assert.equal(computeWordDifference('a', 'a'), 0)
		assert.equal(computeWordDifference('a', 'A'), 0.1)
		assert.equal(computeWordDifference('a', 's'), 2 - 2/3)
		assert.equal(computeWordDifference('a', 'd'), 2 - 1/2)
	})

	it('distance multiple letters', function () {

		const tests = [[ 'wow', 'zow', 0.3333333333333333 ] ,
        [ 'tom', 'ton', 0.4444444444444445 ] ,
        [ 'perica', 'perjanica', 0.45443510737628384 ] ,
        [ 'trapezoid', 'gorgonzola', 1.3005130671797338 ] ,
        [ 'gorgonzola', 'trapezoid', 1.2917748917748917 ] ,
        [ 'otorinolaringologija', 'tra', 2.5142857142857142 ] ,
        [ 'mislilac', 'florida', 1.0741013544419118 ] ,
        [ 'fore', 'froe', 0.5238095238095238 ] ,
        [ 'froe', 'fore', 0.5238095238095238 ] ,
        [ 'marica', 'perica', 0.48148148148148157 ] ,
        [ 'perica', 'milica', 0.8576097105508871 ] ,
        [ 'marica', 'milica', 0.5368077055383557 ] ,
        [ 'perica', 'perica', 0 ] ,
        [ 'peirca', 'perica', 0.3333333333333333 ] ,
        [ 'peica', 'perica', 0.24000000000000005 ] ,
        [ 'peica', 'perice', 0.5672727272727273 ] ,
        [ 'perica', 'peica', 0.5900000000000001 ] ,
        [ 'oeri', 'perica', 0.43333333333333335 ] ,
        [ 'oeric', 'perica', 0.30666666666666664 ] ,
        [ 'oerica', 'perica', 0.22222222222222224 ] ,
        [ 'oriica', 'perica', 0.3333333333333334 ] ,
        [ 'perica', 'dzigerica', 0.9598617756512492 ] 
	]
		for(let [first, second, expect] of tests){
			let val = computeWordDifference(first, second)
			assert.ok(Math.abs(val- expect)<0.03,first+' '+second + ' e: '+ expect+' v: '+val)
		}
	})

	it('distance multiple letters test extra', function () {
		const tests = [
            [ 'o', 'Motor', 1.7333333333333334 ] ,
            [ 'ot', 'Motor', 0.7666666666666667 ] ,
            [ 'oto', 'Motor', 0.4444444444444445 ] ,
            [ 'otor', 'Motor', 0.2833333333333333 ] ,
            [ 'omo', 'Motor', 0.7555555555555556 ] ,
            [ 'omot', 'Motor', 0.5166666666666667 ] ,
            [ 'omoto', 'Motor', 0.37333333333333335 ] ,
            [ 'omotor', 'Motor', 0.4133333333333334 ] 
	]
    for(let [first, second, expect] of tests){
        let val = computeWordDifference(first , second)
        assert.ok(Math.abs(val- expect)<0.03,first+' '+second + ' e: '+ expect+' v: '+val)
    }
	})
})
