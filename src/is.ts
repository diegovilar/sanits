///<reference path="_references.ts"/>

module sanits {

    var testValue:any;

    var test = {
        testing : false,
        skipping : false,
        skip : function() {
            this.skipping = true;
            return true;
        },
        start: function(value:any) {
            if (this.testing) throw new Error('Previous test has not finished');
            testValue = value;
            this.testing = true;
        },
        end: function() {
            if (this.skipping) {
                this.skipping = false
            }
            else {
                testValue = null;
                this.testing = false;
            }
        }
    };

    //<editor-fold desc="HELPERS">
    function mix(target:any, ...sources:any[]) {

        for (let i = 0, count = sources.length; i < count; i++) {
            let source = sources[i];

            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    let value = source[key];
                    target[key] = value;
                }
            }
        }

    }
    //</editor-fold>



    //<editor-fold desc="TYPE CHECKES">
    function isNumber(value:any):boolean {

        return (typeof value == 'number') && isFinite(value) && !isNaN(value);

    }

    function isInt(value:any):boolean {

        return isNumber(value) && (parseInt(value, 10) === value);

    }

    function isArray(value:any):boolean {

        if (Array.isArray) {
            return Array.isArray(value);
        }
        else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }

    }
    //</editor-fold>


    //<editor-fold desc="GLOBAL PREDICATES">
    export interface IPredicates {
        in(collection:any[]):boolean;
    }

    function inPredicate(collection:any[]):boolean {

        if (isArray(collection)) {
            for (let i = 0, length = collection.length; i < length; i++) {
                if (testValue === collection[i]) return true;
            }
        }
        else if (typeof collection != null) {
            for (let key in collection) {
                if (collection.hasOwnProperty(key)) {
                    if (testValue === collection[key]) return true;
                }
            }
        }

        return false;

    }

    var predicates:IPredicates = {
        'in': inPredicate
    };
    //</editor-fold>


    //<editor-fold desc="NUMBER PREDICATES">
    export interface INumberPredicates {
        greaterThan(value:number):boolean;
        lessThan(value:number):boolean;
        between(lower:number, upper:number):boolean;
        positive(value:number):boolean;
        negative(value:number):boolean;
        even(value:number):boolean;
        odd(value:number):boolean;
    }

    function greaterThan(value:number):boolean {
        test.skip();
        var result = this() && testValue > value;
        test.end();
        return result;
    }

    function lessThan(value:number):boolean {
        test.skip();
        var result = this() && testValue < value;
        test.end();
        return result;
    }

    function between(lower:number, upper:number):boolean {
        test.skip();
        var result = this() && (testValue >= lower) && (testValue <= upper);
        test.end();
        return result;
    }

    function positive():boolean {
        test.skip();
        var result = this() && testValue > 0;
        test.end();
        return result;
    }

    function negative():boolean {
        test.skip();
        var result = this() && testValue < 0;
        test.end();
        return result;
    }

    function even():boolean {
        test.skip();
        var result = this() && !(testValue % 2);
        test.end();
        return result;
    }

    function odd():boolean {
        test.skip();
        var result = this() && !!(testValue % 2);
        test.end();
        return result;
    }

    var numberPredicates:INumberPredicates = {
        greaterThan: greaterThan,
        lessThan: lessThan,
        between: between,
        positive: positive,
        negative: negative,
        even: even,
        odd: odd
    };
    //</editor-fold>



    //<editor-fold desc="ARRAY PREDICATES">
    export interface IArrayPredicates {
    }


    function emptyArray():boolean {
        test.skip();
        var result = this() && testValue.length == 0;
        test.end();
        return result;
    }

    var arrayPredicates:IArrayPredicates = {
        empty: emptyArray
    };
    //</editor-fold>



    //<editor-fold desc="NUMBER CHECKER">
    export interface INumberChecker extends IPredicates, INumberPredicates {
        ():boolean;
    }

    function checkNumber():boolean {
        var result = isNumber(testValue);
        test.end();
        return result;
    }
    mix(checkNumber, predicates, numberPredicates);
    //</editor-fold>



    //<editor-fold desc="INTEGER CHECKER">
    function checkInteger():boolean {
        var result = isInt(testValue);
        test.end();
        return result;
    }
    mix(checkInteger, predicates, numberPredicates);
    //</editor-fold>



    //<editor-fold desc="ARRAY CHECKER">
    export interface IArrayChecker extends IPredicates, IArrayPredicates {
        ():boolean;
    }

    function checkArray():boolean {
        var result = isArray(testValue);
        test.end();
        return result;
    }
    mix(checkArray, predicates, arrayPredicates);
    //</editor-fold>



    export interface IWrappedValue {
        number:INumberChecker;
        int:INumberChecker;
    }

    export function is(value:any):IWrappedValue {

        test.start(value);

        return {
            number : <INumberChecker> checkNumber,
            int : <INumberChecker> checkInteger
        }

    }

}
