/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignActivityStatsController{
    private campaignId;
    private campaignActivity;
    public totalSent;

    //@ngInject
    constructor(
        protected collectionConfigService
    ){
        this.init();
    }

    public init =()=> {

        var totalSentCollection = this.collectionConfigService.newCollectionConfig('CampaignActivityAccount');
        totalSentCollection.setDisplayProperties('campaignActivityAccountID');
        totalSentCollection.addFilter('campaignActivity.campaignActivityID', this.campaignActivity.data.campaignActivityID);
        totalSentCollection.getEntity().then((data:any)=>{
               this.totalSent = data.recordsCount;
                console.log(this.totalSent);
            }
        );

    };
}

class SWCampaignActivityStats implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        campaignActivity:"="
    };
    public controller=SWCampaignActivityStatsController;
    public controllerAs="swCampaignActivityStats";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaignactivitystats.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCampaignActivityStats(
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
    SWCampaignActivityStats
}