
module Gaia.Root {

    //module for large/mid screen devices
    export const gaia = angular.module("gaia", ['ui.router']);


    //module for tiny screen devices (moblie)
    export const gaiaMobile = angular.module("gaia-mobile", ['ui.router']);    
}