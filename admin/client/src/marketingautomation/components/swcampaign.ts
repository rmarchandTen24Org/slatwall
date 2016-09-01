/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignController{
    private id;
    private data:any = {};
    private campaignObject;
    private editing = false;
    private saving = false;

    //@ngInject
    constructor(
        public $hibachi,
        public observerService
    ){
        this.init();
    }

    public init =():void => {
        this.campaignObject = this.$hibachi.getCampaign(this.id)['value'];
    };

    public saveCampaign =():void =>{
        this.saving = true;
        this.campaignObject.$$save().then(()=>{
            this.editing = false;
        }).finally(()=>{
            this.saving = false;
        })
    };

    public saveCampaignActivity =():void =>{
        this.observerService.notify('saveNewCampaignActivity');
    }
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