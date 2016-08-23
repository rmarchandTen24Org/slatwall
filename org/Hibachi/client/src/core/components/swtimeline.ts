/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWTimelineController{

    private object;
    private auditRecords;
    private id;
    //@ngInject
    constructor(
        protected collectionConfigService
    ){
        this.init();

    }

    public init =()=> {

        var collectionConfig = this.collectionConfigService.newCollectionConfig('Audit');
        collectionConfig.setDisplayProperties('auditID,auditDateTime,title,sessionAccountFullName,sessionAccountID');
        collectionConfig.addFilter('baseObject', this.object);
        collectionConfig.addFilter('baseID', this.id);
        collectionConfig.addOrderBy('auditDateTime|DESC');

        collectionConfig.getEntity().then((res) =>{
            this.auditRecords = res.records;
        });
    };



}

class SWTimeline implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        object:"@",
        id:"@"
    };
    public controller=SWTimelineController;
    public controllerAs="swTimeline";
    public static $inject = ['corePartialsPath','hibachiPathBuilder'];

    public templateUrl;
    //@ngInject
    constructor(
        public corePartialsPath,
        public hibachiPathBuilder
    ){
        this.corePartialsPath = corePartialsPath;
        this.hibachiPathBuilder = hibachiPathBuilder;
        this.templateUrl = this.hibachiPathBuilder.buildPartialsPath(this.corePartialsPath+'timeline.html');
    }
    public static Factory(){
        var directive = (
            corePartialsPath,
            hibachiPathBuilder
        )=>new SWTimeline(
            corePartialsPath,
            hibachiPathBuilder
        );
        directive.$inject = [
            'corePartialsPath',
            'hibachiPathBuilder'
        ];
        return directive;
    }

    public link:ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs:ng.IAttributes) =>{
    }
}
export{
    SWTimeline
}