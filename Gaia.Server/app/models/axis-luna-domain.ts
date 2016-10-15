
module Axis.Luna.Domain {

    export class Operation<R> {        

        Result: R;
        Succeeded: boolean;
        Message: string;

        constructor(initArg?: Object) {
            if (initArg) initArg.copyTo(this);
        }
    }
}