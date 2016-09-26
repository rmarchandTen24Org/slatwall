/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignWizardController{
    private newCampaignActivity;
    private emailCopied;
    private listIDs;
    private saveObserverID;
    private emailSendDateTime;
    public ui:any = {
        scheduleOpt : 0
    };
    private campaign;
    private scheduleID;

    //@ngInject
    constructor(
        public collectionConfigService,
        public observerService,
        public $hibachi,
        public selectionService,
        public utilityService,
        public $scope,
        public marketignAutomationPartialsPath,
        public slatwallPathBuilder
    ){
        this.init();
    }


    public getTemplateUrl =()=> {
        var template = 'campaignwizard.html';
        if (this.isCampaignActivity()){
            template = 'campaignactivitywizard.html';
        }
        return this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+template);
    };


    private isValid =(variable?)=>{
        return angular.isDefined(variable) && variable.length > 0;
    };

    private updateTabs=(data:any)=>{
        if(this.isValid(data.emailBodyHTML) && this.isValid(data.emailBodyText)){
            this.observerService.notify('updateTabIconcampaign-tabs', {id: 'messaging', icon:'fa-check'});
        }

        if(this.isValid(data.emailFromEmail) && this.isValid(data.emailFromName) && this.isValid(data.emailReplyTo) && this.isValid(data.emailSubject)){
            this.observerService.notify('updateTabIconcampaign-tabs', {id: 'email', icon:'fa-check'});
        }
        this.observerService.notify('updateTabIconcampaign-tabs', {id: 'lists', icon:'fa-check'});

        if(this.isValid(data.emailSendDateTime)){
            this.ui.scheduleOpt = 1;
            this.observerService.notify('updateTabIconcampaign-tabs', {id: 'schedule', icon:'fa-check'});
        }
    };

    private changeCampaignActivity=(data:any):void=>{
        window.location.replace('/default.cfm?slatAction=entity.detailCampaignActivity&campaignActivityID='+data.campaignActivityID);
    };


    public init =()=> {
        this.saveObserverID= this.utilityService.createID();
        this.emailCopied = false;
        this.observerService.attach(this.toggleSelection,'swSelectionToggleSelection');
        this.observerService.attach(this.saveCampaignActivity, 'saveNewCampaignActivity', this.saveObserverID);
        this.observerService.attach(this.scheduleSelected, 'scheduleSelected');

        if(this.isCampaignActivity()) {
            var params = this.utilityService.getQueryParamsFromUrl(self.location.href);
            var test = this.$hibachi.getCampaignActivity(params.campaignActivityID);
            this.newCampaignActivity = test['value'];
            test['promise'].then((data)=>{
                this.updateTabs(data);
            });
            this.observerService.attach(this.changeCampaignActivity, 'optionChangedCampaignActivity');
        }else{
            this.newCampaignActivity = this.$hibachi.newCampaignActivity();
            this.newCampaignActivity.emailFromName = this.campaign.defaultFromName;
            this.newCampaignActivity.emailFromEmail = this.campaign.defaultFromEmail;
            this.newCampaignActivity.emailReplyTo = this.campaign.defaultReplyTo;
        }


        console.log(this.newCampaignActivity);
        this.$scope.$on("$destroy",()=>{
            this.observerService.detachById(this.saveObserverID);
        })

    };

    private scheduleSelected=(schedule:any):void=>{
        this.scheduleID = schedule.scheduleID;
    };

    private isCampaignActivity=():boolean=>{
        return /entity\.(detail|edit)CampaignActivity/.test(self.location.href);
    };

    private toggleSelection =(action:any):void=>{

        console.log(action);
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
        this.newCampaignActivity.$$save('wizard').then((data)=>{
            this.updateTabs(this.newCampaignActivity)
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
        switch (option){
            case '0':
                this.emailSendDateTime = this.cfDate(new Date());
                this.scheduleID = '';
                break;
            case '1':
                this.scheduleID = '';
                break;
            case '2':
                this.emailSendDateTime = '';
                break;
        }
        this.newCampaignActivity.$$save('wizard', 'schedule').then((res: any)=>{
            console.log('Success');
            this.newCampaignActivity.emailSendDateTime = this.emailSendDateTime;
            if(!this.isCampaignActivity()){
                window.location.href = '/default.cfm?slatAction=entity.detailCampaignActivity&campaignActivityID='+ res.campaignActivityID;
            }
        }, (error)=>{
            //console.log('VALIDATION', error);
        });
    };

    public clearListIDs = ():void=>{
        this.selectionService.clearSelection('lists');
    };

    public cfDate = (date):string=>{
        return date.getFullYear() + '-' + ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
    }

}

class SWCampaignWizard implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        campaign:"="
    };
    public controller=SWCampaignWizardController;
    public controllerAs="swCampaignWizard";

    public template = '<ng-include src="swCampaignWizard.getTemplateUrl()"/>';

    public static Factory(){
        return ()=>new SWCampaignWizard();
    }
}
export{
    SWCampaignWizard
}