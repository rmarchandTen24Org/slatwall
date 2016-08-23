/// <reference path='../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../typings/tsd.d.ts' />
//modules
import {coremodule} from "../../../../org/Hibachi/client/src/core/core.module";
//controllers

//directives
import {SWCampaign} from "./components/swcampaign";
//models

var marketingautomationmodule = angular.module('marketingautomation',[coremodule.name])
        .config([()=>{

        }]).run([()=>{

        }])
//constants
        .constant('marketignAutomationPartialsPath','marketingautomation/components/')
//controllers

//directives
        .directive('swCampaign', SWCampaign.Factory())
    ;
export{
    marketingautomationmodule
};