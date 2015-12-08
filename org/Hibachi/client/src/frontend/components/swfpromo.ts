/// <reference path='../../../../../../client/typings/slatwallTypescript.d.ts' />
/// <reference path='../../../../../../client/typings/tsd.d.ts' />   
class SWFPromoController{
    constructor(private $route,private $log:ng.ILogService, private $window:ng.IWindowService, private $slatwall, private dialogService:any){
        this.$slatwall = $slatwall; 
    }
}

class SWFPromo implements ng.IDirective{
    
    public restrict:string = 'E';
    public scope = {};
    public bindToController={};
    public controller=SWFPromoController
    public controllerAs="SWFPromo";
    public templateUrl;
    
    // @ngInject
    constructor(private pathBuilderConfig, private frontendPartialsPath ){
        this.templateUrl = pathBuilderConfig.buildPartialsPath(frontendPartialsPath)+'promopartial.html';
    }
    
    public link:ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs:ng.IAttributes) =>{}
    
    public static Factory():ng.IDirectiveFactory{
        var directive:ng.IDirectiveFactory = (
		    frontendPartialsPath,
			pathBuilderConfig
        ) => new SWFPromo(
			frontendPartialsPath,
			pathBuilderConfig
        );
        directive.$inject = [
            'frontendPartialsPath',
			'pathBuilderConfig'
        ];
        return directive;
    }
    
}
export {
  SWFPromoController, SWFPromo  
};

