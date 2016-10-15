

module Gaia.Utils {

    //key value pair
    export interface Map<K, V> {
        Key: K;
        Value: V;
    }

    export class StringPair implements Map<string, string> {
        Key: string;
        Value: string;

        toString(encoding: Encoding): string {

            //if(encoding == ...) //encode

            //else //default encoding
            return this.Key + ':' + this.Value + ';';
        }

        static ParseStringPairs(value: string, encoding?: Encoding): Array<StringPair> {
            encoding = encoding || Encoding.InlineCss;
            if (encoding == Encoding.InlineCss) return value.split(';')
                .map(v => {
                    var parts = v.split(':');
                    var sp = new StringPair();
                    sp.Key = this.DecodeDelimiters(parts[0]).trim();
                    if (parts.length > 1) sp.Value = this.DecodeDelimiters(parts[1]).trim();
                    return sp;
                })
                .filter(pair => pair.Key != null && pair.Key != '');

            //unknown encoding
            else return [];
        }

        static EncodeDelimiters(value: string): string {
            return value.replace(':', '##col').replace(';', '##scol');
        }

        static DecodeDelimiters(value: string): string {
            return value.replace('##col', ':').replace('##scol', ';');
        }
    }

    export enum Encoding {
        InlineCss
    }    
}