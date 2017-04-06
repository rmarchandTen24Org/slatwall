/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/hibachiTypescript.d.ts" />
//services
import {PaginationService} from "./services/paginationservice";
import {SWPaginationBarConfig} from "./components/swpaginationbar";
import {coremodule} from '../core/core.module';

var paginationmodule = angular.module('hibachi.pagination', [coremodule.name])
// .config(['$provide','baseURL',($provide,baseURL)=>{
// 	$provide.constant('paginationPartials', baseURL+basePartialsPath+'pagination/components/');
// }])
.run([()=> {

}])
//services
.service('paginationService', PaginationService)
.component('swPaginationBar', SWPaginationBarConfig)
//constants
.constant('partialsPath','pagination/components/')
;

export{
	paginationmodule
}




