/// <reference path='../typings/slatwallTypescript.d.ts' />
/// <reference path='../typings/tsd.d.ts' />
/*jshint browser:true */


import {BaseBootStrapper} from "../../../org/Hibachi/client/src/basebootstrap";
import {slatwalladminmodule} from "./slatwall/slatwalladmin.module";

//custom bootstrapper
class bootstrapper extends BaseBootStrapper{
    public myApplication:any;
    constructor(){
        super(slatwalladminmodule.name);

        angular.bootstrap(document,[slatwalladminmodule.name])
    }


}

export = new bootstrapper();



