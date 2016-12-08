/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWOrderFulfillmentListController{
	//@ngInject
	constructor(

	){

	}

}

class SWOrderFulfillmentList{

	public restrict:string = 'E';


    public controller=SWOrderFulfillmentListController;
    public controllerAs="swContentList";
    public templateUrl;

	public static Factory():ng.IDirectiveFactory{
        var directive:ng.IDirectiveFactory = (
			slatwallPathBuilder,
			orderfulfillmentPartialsPath
        ) => new SWOrderFulfillmentList(
			slatwallPathBuilder,
			orderfulfillmentPartialsPath
        );
        directive.$inject = [
			'slatwallPathBuilder',
			'orderfulfillmentPartialsPath'
        ];
        return directive;
    }

	//@ngInject
	constructor(
		slatwallPathBuilder,
		orderfulfillmentPartialsPath
	){
		console.log('yo');
		this.templateUrl = slatwallPathBuilder.buildPartialsPath(orderfulfillmentPartialsPath)+'orderfulfillmentlist.html';
	}
}

export{
	SWOrderFulfillmentListController,
	SWOrderFulfillmentList
}