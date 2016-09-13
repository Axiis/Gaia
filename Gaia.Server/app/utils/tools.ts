﻿
module Gaia.Utils {

    const lut = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
    export function NewGuid() {
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
               lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
               lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
               lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }

    //Class that implements pagination
    export class SequencePage<Data>{

        PageIndex: number;
        SequenceLength: number;
        PageCount: number;
        PageSize: number;

        Page: Data[] = [];

        constructor(page: Data[], pageIndex: number, pageSize: number, sequenceLength: number) {

            if (page == null || pageIndex < 0 || sequenceLength < 0) throw "invalid page";
            this.PageIndex = pageIndex;
            this.SequenceLength = sequenceLength;
            this.Page = page;
            this.PageSize = pageSize;
            this.PageCount = this.SequenceLength / this.PageSize + (this.SequenceLength % this.PageSize > 0 ? 1 : 0);
        }

        /// <summary>
        /// Returns an array containing page indexes for pages immediately adjecent to the current page.
        /// The span indicates how many pages indexes to each side of the current page should be returned
        /// </summary>
        /// <param name="span"></param>
        /// <returns></returns>
        AdjacentIndexes(span: number): Array<number> {

            if (span < 0) throw 'invalid span: ' + span;
            var fullspan = (span * 2) + 1,
                start = 0,
                count = 0;

            if (fullspan >= this.PageCount) count = this.PageCount;

            else {
                start = this.PageIndex - span;
                count = fullspan;

                if (start < 0) start = 0;
                if ((this.PageIndex + span) >= this.PageCount) start = this.PageCount - fullspan;
            }

            var pages: Array<number> = [];
            for (var indx = 0; indx < count; indx++) pages.push(indx + start);

            return pages;
        }

    }


    //Used to configure the registered angular modules with services and controllers
    class ModuleConfigurer {
        private _modules: Array<ng.IModule> = [];

        addModule(module: ng.IModule): ModuleConfigurer {

            if (!module) throw 'invalid module';
            //else
            this._modules.push(module);
            return this;
        }

        withService(name: string, service: Function): ModuleConfigurer {
            if (!service) throw 'invalid service';
            //else
            this._modules.forEach(_m => _m.service(name, service));
            return this;
        }

        withController(name: string, controller: Function): ModuleConfigurer {
            if (!controller) throw 'invalid controller';
            //else
            this._modules.forEach(_m => _m.controller(name, controller));
            return this;
        }
    }
    export const moduleConfig = new ModuleConfigurer();


    //Operation class
    export class Operation<R>{
        Message: string;
        Result: R;
        Succeeded: boolean;

        Resolve(): R {
            if (!this.Succeeded && this.Message) throw this.Message;
            else return this.Result;
        }
    }


    //constant for fetching authorization from local browser keystore
    export const OAuthTokenKey = 'Gaia.Security.OAuth.AuthorizationToken#KEY';

}