/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignStatsController{

    //@ngInject
    constructor(
        protected collectionConfigService
    ){
        this.init();
    }

    public init =()=> {

    };
}

class SWCampaignStats implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        activityCount:"=",
        campaignId:"@"
    };
    public controller=SWCampaignStatsController;
    public controllerAs="swCampaignStats";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaignstats.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCampaignStats(
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
    SWCampaignStats
}