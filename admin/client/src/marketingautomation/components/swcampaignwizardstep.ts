/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCampaignWizardStepController{
    private template;

    //@ngInject
    constructor(
        public marketignAutomationPartialsPath,
        public slatwallPathBuilder
    ){}

    public getTemplateUrl =()=> {
        return this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'campaignwizard/'+this.template+'.html')
    };
}

class SWCampaignWizardStep implements ng.IDirective{

    public restrict:string = 'E';
    public scope=true;
    public bindToController ={
        template:'@'
    };
    public controller=SWCampaignWizardStepController;
    public controllerAs='swCampaignWizardStep';

    public template = '<ng-include src="swCampaignWizardStep.getTemplateUrl()"/>';


    public static Factory(){
        return ()=>new SWCampaignWizardStep();
    }
}
export{
    SWCampaignWizardStep
}