
module Axis.Luna.Domain {

    export class Operation<R> {        

        Result: R;
        Succeeded: boolean;
        Message: string;

        constructor(initArg?: Object) {
            if (initArg) initArg.copyTo(this);
        }
    }


    export class BinaryData {

        Name: string = null;
        Address: string = null;
        Mime: string = null;
        Data: string = null; //B64 encoded string

        Extension(): string {
            try {
                return this.Name.substr(this.Name.lastIndexOf('.') + 1);
            } catch (e) {
                return null;
            }
        }

        DataUrl(): string {
            return "data:" + (this.Mime || 'application/octet-stream') + ";base64," + this.Data;
        }

        constructor(dataUrl?: string)
        {
            if (dataUrl) {
                var parts = dataUrl.trimLeft("data:").split(';');
                this.Mime = parts[0];
                this.Data = parts[1].trimLeft("base64,");
            }
        }
    }
}