/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCreateFollowupController{
    private campaignId;
    private totalSent;

    //@ngInject
    constructor(
        protected collectionConfigService
    ){
        this.init();
    }

    public init =()=> {
        var collectionConfig = this.collectionConfigService.newCollectionConfig('CampaignActivityAccount');
        collectionConfig.addFilter('campaignActivity.campaign.campaignID', this.campaignId);
        collectionConfig.addDisplayProperty('campaignActivityAccountID');
        //collectionConfig.addDisplayAggregate('campaignActivity.totalEmailOpen', 'SUM');

        collectionConfig.getEntity().then((res:any) =>{
            console.log('RES', res);
            this.totalSent = res.recordsCount;
        });

    };
}

class SWCreateFollowUp implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        activityCount:"=",
        campaignId:"@"
    };
    public controller=SWCreateFollowupController;
    public controllerAs="swCreateFollowUp";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'createfollowup.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCreateFollowUp(
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
    SWCreateFollowUp
}