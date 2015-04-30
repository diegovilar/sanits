/// <reference path="../build/sanits.d.ts" />
export declare module sanits.is {
    function number(value: any): boolean;
    function int(value: any): boolean;
    var not: {
        number: (value: any) => boolean;
        int: (value: any) => boolean;
    };
}
