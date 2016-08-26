/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWModalSliderController {

    public modalName;
    public title;
    public hasSaveAction:boolean;
    public hasCancelAction:boolean;
    public saveAction;
    public cancelAction;
    public showModal;
    public swModalLauncher;
    public name;
    private modalSize;


    public closeModal = ()=> {
        this.showModal = false;
    };

    public $onInit = ()=> {
        this.title = this.swModalLauncher.title;
        this.modalName = this.swModalLauncher.modalName;
        this.modalSize = this.swModalLauncher.modalSize || 'md';
    };



}

class SWModalSlider implements ng.IDirective{

    public templateUrl;
    public transclude={
        modalBody:"?swModalBody",
        modalHeader:"?swModalHeader"
    };
    public require = {
        swModalLauncher:'^?swModalLauncher'
    };
    public restrict = "EA";
    public scope = {};

    public bindToController = {
        modalName:"@?",
        title:"@?",
        hasSaveAction:"=?",
        showModal:"=?",
        saveAction:"&?",
        hasDeleteAction:"=?",
        deleteAction:"&?",
        hasCancelAction:"=?",
        cancelAction:"&?"
    };
    public controller=SWModalSliderController;
    public controllerAs="swModalSlider";

    // @ngInject
    constructor(public $compile, private corePartialsPath,hibachiPathBuilder){
        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + 'modalslider.html';
    }

    public compile = (element: JQuery, attrs: angular.IAttributes, transclude: any) => {
        return {
            pre: ($scope: any, element: JQuery, attrs) => {

            },
            post: ($scope: any, element: JQuery, attrs: angular.IAttributes) => {

            }
        };
    };

    public static Factory(){
        var directive:ng.IDirectiveFactory = (
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder

        )=> new SWModalSlider(
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        );
        directive.$inject = ["$compile","corePartialsPath", 'hibachiPathBuilder'];
        return directive;
    }
}
export{
    SWModalSlider,
    SWModalSliderController
}