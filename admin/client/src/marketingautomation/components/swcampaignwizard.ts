/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignWizardController{
    private newCampaignActivity;
    private emailCopied;

    //@ngInject
    constructor(
        public collectionConfigService,
        public observerService,
        public $hibachi
    ){
        this.init();
    }

    public init =()=> {
        this.emailCopied = false;
        this.observerService.attach(this.toggleSelection,'swSelectionToggleSelection');
        this.observerService.attach(this.saveCampaignActivity, 'saveNewCampaignActivity');
        this.newCampaignActivity = this.$hibachi.newCampaignActivity();
    };

    private toggleSelection =(action:any):void=>{
       switch (action.selectionid){
           case "previousEmail":
               this.loadPreviousEmail(action.selection);
               break;
       }
    };

    private loadPreviousEmail =(emailID:string):void=>{
        this.emailCopied = true;
    };

    public saveCampaignActivity = ():void =>{

        this.newCampaignActivity.$$save('wizard').then(()=>{
            console.log('Success');
        }, (error)=>{
            console.log('VALIDATION', error);
        });
        //this.newCampaignActivity = this.$hibachi.newCampaignActivity();
    };
}

class SWCampaignWizard implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        campaignId:"@"
    };
    public controller=SWCampaignWizardController;
    public controllerAs="swCampaignWizard";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaignwizard.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCampaignWizard(
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
    SWCampaignWizard
}