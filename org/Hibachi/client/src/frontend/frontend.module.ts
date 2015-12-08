/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/slatwallTypeScript.d.ts" />
//modules
import {coremodule} from '../hibachi/core/core.module';
import {ngslatwallmodule} from "../ngslatwall/ngslatwall.module";
//controllers
import {FrontendController} from './controllers/frontend';
//directives
import {SWFCart} from "./components/swfcart"; 
import {SWFCreateAccount} from "./components/swfcreateaccount";
import {SWFLogin} from "./components/swflogin";
import {SWFLogout} from "./components/swflogout";
import {SWFPromo} from "./components/swfpromo";

//need to inject the public service into the rootscope for use in the directives.
var frontendmodule = angular.module('frontend', [coremodule.name, ngslatwallmodule.name])
.run(['$rootScope', 'publicService', function($rootScope, publicService) {
	$rootScope.hibachiScope = publicService;
	$rootScope.hibachiScope.getAccount();
	$rootScope.hibachiScope.getCart();
}])
//constants
.constant('frontendPartialsPath','frontend/components/')
//controllers
.controller('frontendController',FrontendController)
//directives
.directive('swCart', SWFCart.Factory())
.directive('swCreateAccount', SWFCreateAccount.Factory())
.directive('swLogin', SWFLogin.Factory())
.directive('swLogout', SWFLogout.Factory())
.directive('swPromo', SWFPromo.Factory());

export{
	frontendmodule
}