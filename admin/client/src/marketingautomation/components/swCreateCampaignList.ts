/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCreateCampaignListController{
    private campaignId;
    private totalSent;
    private newCampaignList;

    //@ngInject
    constructor(
        protected $hibachi,
        protected observerService
    ){
        this.init();
    }

    public init =()=> {
        this.observerService.attach(this.saveCampaignList, 'saveNewCampaignList');
        this.newCampaignList = this.$hibachi.newCampaignList();
        console.log(this.newCampaignList);
    };

    private saveCampaignList =()=>{
        this.newCampaignList.$$save().then(()=>{
            console.log('DONE');
        })
    }
}

class SWCreateCampaignList implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        activityCount:"=",
        campaignId:"@"
    };
    public controller=SWCreateCampaignListController;
    public controllerAs="swCreateCampaignList";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'createcampaignlist.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCreateCampaignList(
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
    SWCreateCampaignList
}