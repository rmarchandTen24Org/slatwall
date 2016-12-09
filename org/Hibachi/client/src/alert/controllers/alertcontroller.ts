/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
import {Alert} from "../model/alert";
interface IAlertControllerScope extends ng.IScope{
	alerts:Alert[]
}
class AlertController{
	//@ngInject
	constructor(
		$scope:IAlertControllerScope,
		alertService
	){

		$scope.alerts = alertService.getAlerts();
	}
}
export{AlertController,IAlertControllerScope}
