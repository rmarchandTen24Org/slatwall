/// <reference path='../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../typings/tsd.d.ts' />
//modules
import {coremodule} from "../../../../org/Hibachi/client/src/core/core.module";
//services

//filters

//directives
import {SWOrderFulfillmentList} from "./components/sworderfulfillmentlist";

var orderfulfillmentmodule = angular.module('hibachi.orderfulfillment',[coremodule.name]).config(()=>{

})
.constant('orderfulfillmentPartialsPath','orderfulfillment/components/')
//services

//filters

//directives
.directive('swOrderFulfillmentList',SWOrderFulfillmentList.Factory())
export{
	orderfulfillmentmodule
}