///<reference path="_references.ts"/>

module sanits {

    export function assert(condition:any, error?:string|Error) {

        error = (error instanceof Error) ? error :
            (error == null) ? 'Assertion failed' :
                new Error(<string> error);

        if (!condition) {
            throw error;
        }

    }

}
