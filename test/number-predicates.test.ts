///<reference path="_references.ts"/>

import is = sanits.is;

describe('number predicates', function () {

    describe('lessThen', function () {

        it('should return true for lesser numbers', function () {

            expect(is(1.9).number.lessThan(2)).toBe(true);

        });

        it('should return false for equal numbers', function () {

            expect(is(1).number.lessThan(1)).toBe(false);

        });

        it('should return false for greater numbers', function () {

            expect(is(1).number.lessThan(0)).toBe(false);

        });

    });

});
