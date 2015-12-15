/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/slatwallTypeScript.d.ts" />
//modules
import {ngslatwallmodelmodule} 	from "../ngslatwallmodel/ngslatwallmodel.module";
//controllers
import {FrontendController} from './controllers/frontend';
//directives
import {SWFDirective} 		from "./components/swfdirective";
import {SWFCart} 			from "./components/swfcart"; 
import {SWFCreateAccount} 	from "./components/swfcreateaccount";
import {SWFLogin} 			from "./components/swflogin";
import {SWFLogout} 			from "./components/swflogout";
import {SWFPromo} 			from "./components/swfpromo";

declare var slatwallAngular:any;
//need to inject the public service into the rootscope for use in the directives.
//Also, we set the initial value for account and cart.
var frontendmodule = angular.module('frontend', ['ngRoute',ngslatwallmodelmodule.name])
.config(['$routeProvider','pathBuilderConfig',($routeProvider,pathBuilderConfig)=>{
	 //configure partials path properties
     pathBuilderConfig.setBaseURL('/'); 
     pathBuilderConfig.setBasePartialsPath('org/Hibachi/client/src/');//<--move to custom assets
	 
	 //change to partialPath.
	 
}])
.run(['$rootScope', 'publicService', function($rootScope, publicService) {
	$rootScope.hibachiScope = publicService;
	$rootScope.hibachiScope.getAccount(); 
	$rootScope.hibachiScope.getCart();
	$rootScope.slatwall = $rootScope.hibachiScope;
	
}])

//constants
.constant('frontendPartialsPath','frontend/components/')
//controllers
.controller('frontendController',FrontendController)
//directives
.directive('swfDirective', SWFDirective.Factory())
.directive('swfCart', SWFCart.Factory())
.directive('swfCreateAccount', SWFCreateAccount.Factory())
.directive('swfLogin', SWFLogin.Factory())
.directive('swfLogout', SWFLogout.Factory())
.directive('swfPromo', 	SWFPromo.Factory());

export{
	frontendmodule
}