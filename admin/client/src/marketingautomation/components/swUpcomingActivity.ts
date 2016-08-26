/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWUpcomingActivityController{
    private campaignId;
    private activities;
    //@ngInject
    constructor(
        protected collectionConfigService
    ){
        this.init();
    }

    public init =()=> {
        this.activities=[];
        var collectionConfig = this.collectionConfigService.newCollectionConfig('CampaignActivity');
        collectionConfig.addFilter('campaign.campaignID', this.campaignId);
        collectionConfig.addDisplayProperty('campaignActivityID,campaignActivityName,emailSendDateTime');

        collectionConfig.getEntity().then((res:any) =>{
            this.activities = res.pageRecords;
        });
    };
}

class SWUpcomingActivity implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        activityCount:"=",
        campaignId:"@"
    };
    public controller=SWUpcomingActivityController;
    public controllerAs="swUpcomingActivity";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'upcomingActivity.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWUpcomingActivity(
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
    SWUpcomingActivity
}