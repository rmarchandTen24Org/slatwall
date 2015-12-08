/// <reference path='../../../../../../client/typings/slatwallTypescript.d.ts' />
/// <reference path='../../../../../../client/typings/tsd.d.ts' />

export class SWFLoginController{
    public pObject:string;
    // @ngInject
    constructor(private $route,private $log:ng.ILogService, private $window:ng.IWindowService, private $slatwall:any, private dialogService:any){
        this.$slatwall = $slatwall; 
        this.pObject   = "Account_Login";
    }
}

export class SWFLogin implements ng.IDirective{
    
    public restrict:string = 'E';
    public scope = {};
    public bindToController={};
    public controller=SWFLoginController
    public controllerAs="SWFLogin";
    public templateUrl;
    
    // @ngInject
    constructor(private pathBuilderConfig, private frontendPartialsPath ){
        this.templateUrl = pathBuilderConfig.buildPartialsPath(frontendPartialsPath)+'logindirectivepartial.html';
    }
    
    public link:ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs:ng.IAttributes) =>{}
    
    public static Factory():ng.IDirectiveFactory{
        var directive:ng.IDirectiveFactory = (
		    frontendPartialsPath,
			pathBuilderConfig
        ) => new SWFLogin(
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
   SWFLoginController, SWFLogin 
};

