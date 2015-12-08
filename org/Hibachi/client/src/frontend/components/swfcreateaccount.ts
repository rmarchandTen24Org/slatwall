/// <reference path='../../../../../../client/typings/slatwallTypescript.d.ts' />
/// <reference path='../../../../../../client/typings/tsd.d.ts' />
class SWFCreateAccountController{
    //@ngInject
    constructor(private $route,private $log:ng.ILogService, private $window:ng.IWindowService, private frontendPartialsPath, private $slatwall:any, private dialogService:any){
        this.$slatwall = $slatwall; 
    }
}

class SWFCreateAccount implements ng.IDirective {
    
    public restrict:string = 'E';
    public scope = {};
    public bindToController={};
    public controller=SWFCreateAccountController;
    public controllerAs="SwfCreateAccount";
    public templateUrl;
    public static Factory():ng.IDirectiveFactory{
    var directive:ng.IDirectiveFactory = (
        frontendPartialsPath,
        pathBuilderConfig
    ) => new SWFCreateAccount(
        frontendPartialsPath,
        pathBuilderConfig
    );
    
    directive.$inject = [
        'frontendPartialsPath',
        'pathBuilderConfig'
    ];
    return directive;
}
    //@ngInject
    constructor(private pathBuilderConfig, private frontendPartialsPath:any){
        this.templateUrl = this.templateUrl = pathBuilderConfig.buildPartialsPath(frontendPartialsPath)+'createaccountpartial.html';
    }

    public link:ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs:ng.IAttributes) =>{}

}
export {
  SWFCreateAccount, SWFCreateAccountController  
};
