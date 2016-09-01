/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWTabNavController {
    public for;
    public tabs = [];

    // @ngInject
    constructor(public observerService){
        this.init();
    }

    public init = ():void => {
        this.observerService.attach(this.addTab,'addTab'+this.for);
    };

    private addTab =(tab):void=>{
        this.tabs.push(tab);
    };

    public changeTab=(id):void=>{
        this.observerService.notify('SwitchTab:'+this.for, id);
    }

}

class SWTabNav implements ng.IDirective{

    public templateUrl;
    public transclude=true;
    public restrict = "EA";
    public scope = {};

    public bindToController = {
        "for" : "@"
    };
    public controller=SWTabNavController;
    public controllerAs="swTabNav";

    // @ngInject
    constructor(public $compile, private corePartialsPath,hibachiPathBuilder){
        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "tabnav.html";
    }

    public static Factory(){
        var directive:ng.IDirectiveFactory = (
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        )=> new SWTabNav(
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        );
        directive.$inject = ["$compile","corePartialsPath", 'hibachiPathBuilder'];
        return directive;
    }
}
export{
    SWTabNav
}