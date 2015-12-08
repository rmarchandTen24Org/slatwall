/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/slatwallTypeScript.d.ts" />

//modules
import {coremodule} from '../core/core.module';
import {ngslatwallmodule} from "../ngslatwall/ngslatwall.module";
//controllers
import {FrontendController} from './controllers/frontend';

var frontendmodule = angular.module('frontend', [coremodule.name,ngslatwallmodule.name])
.run([function($rootScope, publicService) {
	$rootScope.hibachiScope = publicService;
	$rootScope.hibachiScope.getAccount();
	$rootScope.hibachiScope.getCart();
}])
.constant('frontendPartialsPath','frontend/components/');
export{
	frontendmodule
}