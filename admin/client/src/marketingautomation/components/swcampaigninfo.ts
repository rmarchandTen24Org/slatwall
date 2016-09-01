/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignInfoController{
    private id;
    private data:any = {};
    private campaignObject;
    private editing = false;
    private saving = false;
    private newCampaignActivity;

    //@ngInject
    constructor(){}

    public saveCampaign =():void =>{
        this.saving = true;
        this.campaignObject.$$save().then(()=>{
            this.editing = false;
        }).finally(()=>{
            this.saving = false;
        })
    };
}

class SWCampaignInfo implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        object:"="
    };
    public controller=SWCampaignInfoController;
    public controllerAs="swCampaignInfo";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaigninfo.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWCampaignInfo(
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
    SWCampaignInfo
}