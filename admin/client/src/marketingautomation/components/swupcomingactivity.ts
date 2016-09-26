/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWUpcomingActivityController{
    private campaignId;
    private activities;
    //@ngInject
    constructor(
        protected collectionConfigService,
        public observerService
    ){
        this.init();
    }

    public init =()=> {
        this.activities=[];
        var collectionConfig = this.collectionConfigService.newCollectionConfig('CampaignActivity');
        collectionConfig.addFilter('campaign.campaignID', this.campaignId);
        //Scheduled
        //collectionConfig.addFilter('campaignActivityStatus.typeID', '402828c656eafa1d01574400d4920249');

        collectionConfig.addDisplayProperty('campaignActivityID,campaignActivityName,emailSendDateTime');
        collectionConfig.addOrderBy("emailSendDateTime|DESC");
        collectionConfig.setPageShow(5);

        collectionConfig.getEntity().then((res:any) =>{
            this.activities = res.pageRecords;
        });

    };

    public viewActivities=()=>{
        this.observerService.notify('SwitchTab:campaign-tabs', 'activities');
    }
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
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'upcomingactivity.html');
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