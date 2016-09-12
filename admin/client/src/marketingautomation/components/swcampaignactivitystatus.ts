/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignActivityStatusController{

    //@ngInject
    constructor(
        protected collectionConfigService
    ){
        this.init();
    }

    public init =()=> {

    };
}

class SWCampaignActivityStatus implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
    };
    public controller=SWCampaignActivityStatusController;
    public controllerAs="swCampaignStats";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaignactivitystatus.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCampaignActivityStatus(
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        );
        directive.$inject = [
            'marketignAutomationPartialsPath',
            'slatwallPathBuilder'
        ];
        return directive;
    }

    public link:ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs:ng.IAttributes) =>{
    }
}
export{
    SWCampaignActivityStatus
}