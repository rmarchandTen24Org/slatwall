/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWTabGroupController {
    public name:string;
    public switchTabEventName:string;
    public tabs:any[];
    public showTabs;

    // @ngInject
    constructor(private utilityService,
                private rbkeyService,
                private observerService
    ){
        if(angular.isUndefined(this.showTabs)){
            this.showTabs = true;
        }
        if(angular.isUndefined(this.tabs)){
            this.tabs = [];
        }
        if(angular.isUndefined(this.name)){
            this.name = "TG" + this.utilityService.createID(30)
        }
        this.switchTabEventName = "SwitchTab:" + this.name;
        this.observerService.attach(this.switchTabByID, this.switchTabEventName);
    }

    public switchTab = (tabToActivate) => {
        for(var i = 0; i < this.tabs.length; i++){
            this.tabs[i].active = false;
        }
        tabToActivate.active = true;
        tabToActivate.loaded = true;
    };

    // @ngInject
    constructor(private utilityService, 
                private rbkeyService, 
                private observerService
        ){
        if(angular.isUndefined(this.tabs)){
            this.tabs = []; 
        } 
        this.tabGroupID = "TG" + this.utilityService.createID(30);
        this.switchTabEventName = "SwitchTab:" + this.tabGroupID;
        this.observerService.attach(this.switchTab, this.switchTabEventName)
    }

    public switchTab = (tabToActivate) => {
        console.log("switchTab called", tabToActivate)
        for(var i = 0; i < this.tabs.length; i++){
            this.tabs[i].active = false; 
        }
        tabToActivate.active = true;  
        tabToActivate.loaded = true;  
    }
>>>>>>> origin/develop

    public getTabByName = (name) =>{
        for(var i = 0; i < this.tabs.length; i++){
            if(this.tabs[i].name == name){
                return this.tabs[i];
            }
        }
    };

    public getTabById = (id) =>{
        for(var i = 0; i < this.tabs.length; i++){
            if(this.tabs[i].id == id){
                return this.tabs[i];
            }
        }
    };

    public switchTabByID = (id) => {
        var tabToActivate = this.getTabById(id);
        if(angular.isDefined(tabToActivate)){
            this.switchTab(tabToActivate);
        }
    };
}

class SWTabGroup implements ng.IDirective{

    public templateUrl;
    public transclude=true;
    public restrict = "EA";
    public scope = {};

    public bindToController = {
        "showTabs" : "=?",
        "name" : "@?"
    };
    public controller=SWTabGroupController;
    public controllerAs="swTabGroup";

    // @ngInject
    constructor(public $compile, private corePartialsPath,hibachiPathBuilder){
        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "tabgroup.html";
    }

    public compile = (element: JQuery, attrs: angular.IAttributes, transclude: any) => {
        return {
            pre: ($scope: any, element: JQuery, attrs: angular.IAttributes) => {},
            post: ($scope: any, element: JQuery, attrs: angular.IAttributes) => {}
        };
    }

    public static Factory(){
        var directive:ng.IDirectiveFactory = (
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        )=> new SWTabGroup(
            $compile
            ,corePartialsPath
            ,hibachiPathBuilder
        );
        directive.$inject = ["$compile","corePartialsPath", "hibachiPathBuilder"];
        return directive;
    }
}
export{
    SWTabGroup,
    SWTabGroupController
}