/// <reference path='../typings/slatwallTypescript.d.ts' />
/// <reference path='../typings/tsd.d.ts' />
/*jshint browser:true */
import {BaseBootStrapper} from "../../../org/Hibachi/client/src/basebootstrap";
import {slatwalladminmodule} from "./slatwall/slatwalladmin.module";


//custom bootstrapper
class bootstrapper extends BaseBootStrapper{
    public myApplication;
    constructor(){
        var angular:any = super(slatwalladminmodule.name);

        // angular.done(useStuff);
        // angular.bootstrap()
        require('../../../node_modules/jasmine-core/lib/jasmine-core/boot');
        requireAll(require.context("../../../", true, /^\.\/.*\.spec.ts$/));



            // requires and returns all modules that match
            // console.log('here');
            // var modules =
            // console.log(modules);


        //require.context("../../../", true, /^\.\/.*\.spec.ts$/);
    }

    function useStuff(){
        console.log(angular);
        console.log('done');

    }

    function requireAll(requireContext) {
        return requireContext.keys().map(requireContext);
    }
}

export = new bootstrapper();



