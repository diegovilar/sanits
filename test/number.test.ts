///<reference path="_references.ts"/>

import is = sanits.is;

describe('number', function () {

    it('should return true for valid number primitives', function () {

        expect(is(-1).number()).toBe(true);
        expect(is(0).number()).toBe(true);
        expect(is(1).number()).toBe(true);

        expect(is(-1.1).number()).toBe(true);
        expect(is(0.1).number()).toBe(true);
        expect(is(1.1).number()).toBe(true);

        expect(is(3.4239698234563945e+40).number()).toBe(true);

    });

    it('should return false for number Objects', function () {

        expect(is(new Number(1)).number()).toBe(false);

    });

    it('should return false to NaN', function () {

        expect(is(NaN).number()).toBe(false);

    });

    it('should return false for Infinity and -Infitiny', function () {

        expect(is(-Infinity).number()).toBe(false);
        expect(is(Infinity).number()).toBe(false);

    });

    it('should return false for all other value types', function () {

        expect(is(undefined).number()).toBe(false);
        expect(is(null).number()).toBe(false);
        expect(is('').number()).toBe(false);
        expect(is({}).number()).toBe(false);
        expect(is([]).number()).toBe(false);
        expect(is(false).number()).toBe(false);
        expect(is(true).number()).toBe(false);
        expect(is(new Date()).number()).toBe(false);
        expect(is(/./).number()).toBe(false);

    });

});
