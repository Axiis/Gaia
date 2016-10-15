
module Axis.Luna {

    export interface IOperation<R> {        

        Result: R;
        Succeeded: boolean;
        Message: string;
    }
}