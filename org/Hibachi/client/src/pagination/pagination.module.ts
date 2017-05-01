/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/hibachiTypescript.d.ts" />
//services
import {PaginationService} from "./services/paginationservice";
import {SWPaginationBar} from "./components/swpaginationbar";
import {coremodule} from '../core/core.module';

import * as reducers from './reducers/paginationreducers';
import { combineReducers } from 'redux';
//import loggingMiddleware from './loggingMiddleware';
import ngRedux from 'ng-redux';

var paginationmodule = angular.module('hibachi.pagination', [ngRedux,coremodule.name])
 .config(['$ngReduxProvider',($ngReduxProvider)=>{
    $ngReduxProvider.createStoreWith(reducers, ['promiseMiddleware'
		//, loggingMiddleware
	]);
 }])
.run([()=> {
}])
//services
.service('paginationService', PaginationService)
.directive('swPaginationBar', SWPaginationBar.Factory())
//constants
.constant('partialsPath','pagination/components/')
;

export{
	paginationmodule
}




