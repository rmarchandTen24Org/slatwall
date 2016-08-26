/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWWizardStepController {

    public active:boolean;
    public loaded:boolean;
    public name:string;

    constructor(){
        if(angular.isUndefined(this.active)){
            this.active = false;
        }
        if(angular.isUndefined(this.loaded)){
            this.loaded = false;
        }
        if(angular.isUndefined(this.name)){
            //generate a unique name
        }
    }

}

class SWWizardStep implements ng.IDirective{

    public templateUrl;
    public transclude=true;
    public restrict = "EA";
    public scope = {};

    public bindToController = {
        active:"=?",
        loaded:"=?",
        count:"=?",
        name:"@?"
    };
    public controller=SWWizardStepController;
    public controllerAs="swWizardStep";

    // @ngInject
    constructor(public $compile, private scopeService, private corePartialsPath,hibachiPathBuilder){
        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "wizardstep.html";
    }

    public compile = (element: JQuery, attrs: angular.IAttributes, transclude: any) => {
        return {
            pre: ($scope: any, element: JQuery, attrs: angular.IAttributes) => {

            },
            post: ($scope: any, element: JQuery, attrs: angular.IAttributes) => {
                var parentDirective = this.scopeService.locateParentScope($scope,"swWizard")["swWizard"];
                if(angular.isDefined(parentDirective) && angular.isDefined(parentDirective.steps)){
                    parentDirective.steps.push($scope.swWizardStep);
                    if(parentDirective.steps.length == 1){
                        $scope.swWizardStep.active = true;
                        $scope.swWizardStep.loaded = true;
                    }
                }
            }
        };
    };

    public static Factory(){
        var directive:ng.IDirectiveFactory = (
            $compile
            ,scopeService
            ,corePartialsPath
            ,hibachiPathBuilder

        )=> new SWWizardStep(
            $compile
            ,scopeService
            ,corePartialsPath
            ,hibachiPathBuilder
        );
        directive.$inject = ["$compile","scopeService","corePartialsPath", "hibachiPathBuilder"];
        return directive;
    }
}
export{
    SWWizardStep,
    SWWizardStepController
}