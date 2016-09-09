/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignWizardController{
    private newCampaignActivity;
    private emailCopied;
    private listIDs;
    private saveObserverID;
    private emailSendDateTime;

    //@ngInject
    constructor(
        public collectionConfigService,
        public observerService,
        public $hibachi,
        public selectionService,
        public utilityService,
        public $scope
    ){
        this.init();
    }

    public init =()=> {
        this.saveObserverID= this.utilityService.createID();
        this.emailCopied = false;
        this.observerService.attach(this.toggleSelection,'swSelectionToggleSelection');
        this.observerService.attach(this.saveCampaignActivity, 'saveNewCampaignActivity', this.saveObserverID);
        this.newCampaignActivity = this.$hibachi.newCampaignActivity();

        console.log(this.newCampaignActivity);
        this.$scope.$on("$destroy",()=>{
            this.observerService.detachById(this.saveObserverID);
        })

    };

    private toggleSelection =(action:any):void=>{
       switch (action.selectionid){
           case "previousEmail":
               this.loadPreviousEmail(action.selection);
               break;
           case "lists":
               this.listIDs = this.selectionService.getSelections('lists').join();
               break;
       }
    };

    private loadPreviousEmail =(campaignActivityID:string):void=>{
        var tempCampaignActivity = this.collectionConfigService.newCollectionConfig('CampaignActivity');
        tempCampaignActivity.setDisplayProperties('emailBodyHTML,emailBodyText,emailStyle');
        tempCampaignActivity.getEntity(campaignActivityID).then((data)=>{
            this.newCampaignActivity.emailBodyHTML = data.emailBodyHTML;
            this.newCampaignActivity.emailBodyText = data.emailBodyText;
            this.newCampaignActivity.emailStyle = data.emailStyle;
            this.emailCopied = true;
        });
    };

    public saveCampaignActivity = ():void =>{
        this.newCampaignActivity.$$save('wizard').then(()=>{
            console.log('Success');
        }, (error)=>{
            //console.log('VALIDATION', error);
        });
        //this.newCampaignActivity = this.$hibachi.newCampaignActivity();
    };


    public sendTestEmail = ():void =>{
        this.newCampaignActivity.$$save('wizard', 'test').then(()=>{
            console.log('Success');
        }, (error)=>{
            //console.log('VALIDATION', error);
        });
        //this.newCampaignActivity = this.$hibachi.newCampaignActivity();
    };

    public scheduleEmail = (option:string): void =>{
        if(option == '0'){
            this.emailSendDateTime = new Date();
        }
    }



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