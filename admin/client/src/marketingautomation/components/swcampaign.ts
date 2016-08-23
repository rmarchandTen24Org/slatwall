/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignController{
    private id;
    private data:any = {};
    private campaignObject;

    //@ngInject
    constructor(
        protected collectionConfigService,
        protected $hibachi
    ){
        this.init();
    }

    public init =()=> {
        this.campaignObject = this.$hibachi.newCampaign();
        var collectionConfig = this.collectionConfigService.newCollectionConfig('Campaign');
        collectionConfig.addFilter('campaignID', this.id);
        collectionConfig.addDisplayProperty('campaignName,campaignDescription,defaultFromName,defaultFromEmail,defaultReplyTo');
        collectionConfig.addDisplayAggregate('campaignActivities', 'COUNT');
        collectionConfig.getEntity().then((res:any) =>{
            if(res.pageRecords && res.pageRecords.length){
                this.data = res.pageRecords[0];

                console.warn('sd', this.campaignObject);
            }
        });
    };

}

class SWCampaign implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        id:"@"
    };
    public controller=SWCampaignController;
    public controllerAs="swCampaign";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaign.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCampaign(
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
    SWCampaign
}