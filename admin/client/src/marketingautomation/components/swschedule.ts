/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWScheduleController{
    private scheduleCollectionConfig;
    private createSchedule;
    private scheduleEntity;
    private daysOfweek = [];
    private daysOfMonth = [];

    //@ngInject
    constructor(
        public collectionConfigService,
        public $hibachi,
        public formService
    ){
        this.init();
    }


    private init=():void=> {
        this.scheduleCollectionConfig = this.collectionConfigService.newCollectionConfig("Schedule");
        this.scheduleCollectionConfig.setDisplayProperties("scheduleID,scheduleName,daysOfMonthToRun," +
            "daysOfWeekToRun,recuringType,frequencyStartTime,frequencyEndTime,frequencyInterval");
    };


    public addNewSchedule=():void=> {
        this.createSchedule = true;
        this.scheduleEntity = this.$hibachi.newSchedule();
    };

    public saveSchedule=():void=> {
        if(this.scheduleEntity.data.recuringType == 'weekly'){
            //this.scheduleEntity.data.daysOfWeekToRun = this.daysOfweek.filter(Number).join();
        }else if(this.scheduleEntity.data.recuringType == 'monthly'){
            var scope;
            //this.scheduleEntity.data.daysOfMonthToRun = this.daysOfMonth.filter(Number).join();
        }
        this.scheduleEntity.$$save().then((res) =>{
            scope.schedule.selectedName = angular.copy(scope.scheduleEntity.data.scheduleName);
            scope.selectSchedule(angular.copy(scope.scheduleEntity.data));

            this.formService.resetForm(scope.scheduleEntity.forms['scheduleForm']);
                scope.createSchedule = false;
            });
    }
}

class SWSchedule implements ng.IDirective{

    public restrict:string = 'EA';
    public scope=true;
    public bindToController ={
        object:"="
    };
    public controller=SWScheduleController;
    public controllerAs="swSchedule";

    public templateUrl;
    //@ngInject
    constructor(public marketignAutomationPartialsPath, public slatwallPathBuilder){
        this.templateUrl = this.slatwallPathBuilder.buildPartialsPath(this.marketignAutomationPartialsPath+'schedule.html');
    }
    public static Factory(){
        var directive = (
            marketignAutomationPartialsPath,
            slatwallPathBuilder
        )=>new SWSchedule(
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
    SWSchedule
}