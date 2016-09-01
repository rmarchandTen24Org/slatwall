/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWWizardController {
    public wizardID:string;
    public stepEventName:string;
    public steps:any[];
    private stepsCount;
    private currentStepPosition;

    // @ngInject
    constructor(private utilityService,
                private observerService
    ){
        if(angular.isUndefined(this.steps)){
            this.steps = [];
        }
        this.stepsCount = this.steps.length;
        this.currentStepPosition = 0;
        this.wizardID = "WZ" + this.utilityService.createID(30);
        this.stepEventName = "Step:" + this.wizardID;
        this.observerService.attach(this.step, this.stepEventName)
    }

    public stepNext = () => {
        var nextStep = this.currentStepPosition + 1;
        if(nextStep > this.steps.length - 1) return;
        this.step(nextStep);
    };

    public stepBack = () => {
        var previousStep = this.currentStepPosition - 1;
        if(previousStep < 0) return;
        this.step(previousStep);
    };

    public step = (index) => {
        this.currentStepPosition = index;
        for(var i = 0; i < this.steps.length; i++){
            if(i != index){
                this.steps[i].active = false;
                continue;
            }
            this.steps[i].active = true;
            this.steps[i].loaded = true;
        }
    };

    public getStepByName = (name) =>{
        for(var i = 0; i < this.steps.length; i++){
            if(this.steps[i].name == name){
                return this.steps[i];
            }
        }
    };
}

class SWWizard implements ng.IDirective{

    public templateUrl;
    public transclude=true;
    public restrict = "EA";
    public scope = {};

    public bindToController = {

    };
    public controller=SWWizardController;
    public controllerAs="swWizard";

    // @ngInject
    constructor(public $compile, private corePartialsPath,hibachiPathBuilder){
        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "wizard.html";
    }

    public compile = (element: JQuery, attrs: angular.IAttributes, transclude: any) => {
        return {
            pre: ($scope: any, element: JQuery, attrs: angular.IAttributes) => {},
            post: ($scope: any, element: JQuery, attrs: angular.IAttributes) => {}
        };
    };

    public static Factory(){
        var directive:ng.IDirectiveFactory = (
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        )=> new SWWizard(
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        );
        directive.$inject = ["$compile","corePartialsPath",
            'hibachiPathBuilder'];
        return directive;
    };
}
export{
    SWWizard,
    SWWizardController
}