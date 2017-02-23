/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWListController {
	public getCollection:Function;
	public $log:ng.ILogService;
	public $hibachi:any;
    public $scope:any;
	public pageShow:any;
	public entityName:string;
	public collection:any;
	public collectionConfig:any;
	public currentPage:number;
	public keywords:string;
	//@ngInject
	constructor(
		$log,
		$hibachi,
        $scope
	){
			this.$log = $log;
   			this.$hibachi = $hibachi;
            this.$scope = $scope;

			this.$log.debug('slatwallList init');
            console.log('scope',this.$scope);
			this.$scope.getCollection = ()=>{

				var pageShow = 50;
				if(this.$scope.pageShow !== 'Auto'){
					pageShow = this.$scope.pageShow;
				}
				this.$scope.entityName = this.$scope.entityName.charAt(0).toUpperCase()+this.$scope.entityName.slice(1);
				this.$scope.collectionListingPromise = $hibachi.getEntity(this.$scope.entityName, {currentPage:this.$scope.currentPage, pageShow:pageShow, keywords:this.$scope.keywords});
				return this.$scope.collectionListingPromise.then((value)=>{
					this.$scope.collection = value;
					this.$scope.collectionConfig = angular.fromJson(this.$scope.collection.collectionConfig);
				});
			};
			this.$scope.getCollection();

	}
}

class SWList{
	public restrict:string = 'E';

    //public bindToController=true;
    public controller=SWListController;
    public controllerAs="swList";
	public templateUrl;
    public partialsPath;
    public observerService;

	public static Factory(){
		var directive = (
			coreEntityPartialsPath,
			hibachiPathBuilder
		)=> new SWList(
			coreEntityPartialsPath,
			hibachiPathBuilder
		);
		directive.$inject = [
			'coreEntityPartialsPath',
			'hibachiPathBuilder'
		];
		return directive;
	}
	constructor(
		coreEntityPartialsPath,
		hibachiPathBuilder
	){

        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath)+'list.html';
	}
}
export{
	SWList
}