var assert = require('assert')
import { Adjust } from '../adjust'

describe('Adjust tests', function () {
    it('Subscribe then publish', function () {
        let test = false;
        let value = new Adjust();
        value.subscribe(v => test = v);
        value.publish(true);
        assert.ok(test)
    });
    it('publish then subscribe', function () {
        let test = false;
        let value = new Adjust();
        value.publish(true);
        value.subscribe(v => test = v);
        assert.ok(test)
    });
    it('Multiple publish', function () {
        let test = 1;
        let value = new Adjust();
        value.publish(2);
        value.subscribe(v => test += v);
        value.publish(1);
        assert.equal(test, 4);
    });
    it('unusbscribe', function () {
        let test = 1;
        let value = new Adjust();
        let sub = value.subscribe(v => test + v);
        value.unsubscribe(sub)
        value.publish(1);
        assert.equal(test, 1);
    });
})