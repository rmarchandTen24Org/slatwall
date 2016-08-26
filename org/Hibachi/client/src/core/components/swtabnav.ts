/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWTabHeaderController {

    // @ngInject
    constructor(){}


}

class SWTabHeader implements ng.IDirective{

    public templateUrl;
    public transclude=true;
    public restrict = "EA";
    public scope = {};

    public bindToController = {
    };
    public controller=SWTabHeaderController;
    public controllerAs="swTabHeader";

    // @ngInject
    constructor(public $compile, private corePartialsPath,hibachiPathBuilder){
        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "tabheader.html";
    }

    public static Factory(){
        var directive:ng.IDirectiveFactory = (
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        )=> new SWTabHeader(
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        );
        directive.$inject = ["$compile","corePartialsPath", 'hibachiPathBuilder'];
        return directive;
    }
}
export{
    SWTabHeader
}