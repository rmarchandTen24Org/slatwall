/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignActivityController{
    private object;
    private id;
    private campaignActivity;
    private campaignID;
    private campaign;
    private saving;
    private editing;
    private campaignActivityStatus;
    //@ngInject
    constructor(public $hibachi,
                public observerService){
        this.init();
    }


    private init():void {
        var getCampaingActivity = this.$hibachi.getCampaignActivity(this.id);
        this.campaignActivity = getCampaingActivity['value'];

        getCampaingActivity.promise.then(()=>{
            return this.campaignActivity.$$getCampaignActivityStatus();
        }).then((res)=>{
            if(res.records && res.records.length && res.records[0].campaignActivityStatus && res.records[0].campaignActivityStatus.length){
                this.campaignActivityStatus = res.records[0].campaignActivityStatus[0];
            }
        })


    }

    public saveCampaignActivityBasic =():void =>{
        this.saving = true;
        this.campaignActivity.$$save().then(()=>{
            this.editing = false;
        }).finally(()=>{
            this.saving = false;
        })
    };

    public saveCampaignActivity =():void =>{
        this.observerService.notify('saveNewCampaignActivity');
    };
}

class SWCampaignActivity implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        id:"@",
        campaignID:"@",
        campaignName:"@"
    };
    public controller=SWCampaignActivityController;
    public controllerAs="swCampaignActivity";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaignactivity.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCampaignActivity(
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
    SWCampaignActivity
}