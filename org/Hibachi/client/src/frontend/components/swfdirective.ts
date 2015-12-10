/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWFDirectiveController{
    private hibachiScope;
    //@ngInject
    constructor(private $route,private $log, private frontendPartialsPath, public $rootScope){
        this.$rootScope         = $rootScope;
        this.hibachiScope       = this.$rootScope.hibachiScope;
    } 
}

class SWFDirective implements ng.IDirective{
    
    public restrict:string = 'E';
    public scope : any;
    public bindToController={
		variables:"=",
		directive:"=",
        type:"@"
    };
    public controller=SWFDirectiveController
    public controllerAs="SWFDirective";
    public templateUrl;
    public $compile;
	
	// @ngInject
    constructor(pathBuilderConfig, private frontendPartialsPath:any, $compile){
        console.log("Config", pathBuilderConfig);
        console.log("front", frontendPartialsPath);
        this.templateUrl = pathBuilderConfig.buildPartialsPath(frontendPartialsPath)+'swfdirectivepartial.html';
		this.$compile = $compile;
    }
    /** allows you to build a directive without using another controller and directive config. */
    // @ngInject
	public link:ng.IDirectiveLinkFn = (scope:ng.IScope, element: ng.IAugmentedJQuery, attrs:any) =>{
        this.scope = scope;
        if (!attrs.type) { attrs.type = "A"}
        if (attrs.type == "A" || !attrs.type){
            var template = '<span ' + attrs.directive + ' ';
            if(angular.isDefined(this.scope.variables)){
                angular.forEach(this.scope.variables, function(value,key){
                    template += ' ' + key + '=' + value + ' ';
                });
            }
            template += + '>';
            template += '</span>';
        }else{
            var template = '<' + attrs.directive + ' ';
            if(this.scope.variables){
                angular.forEach(this.scope.variables, function(value,key){
                    template += ' ' + key + '=' + value + ' ';
                });
            }
            template += + '>';
            template += '</'+ attrs.directive +'>'; 
        }
        
		// Render the template.
		element.html('').append(this.$compile(template)(scope));
	}
    
    public static Factory():ng.IDirectiveFactory{
        var directive:ng.IDirectiveFactory = (
		    pathBuilderConfig,
			frontendPartialsPath,
			$compile
        ) => new SWFDirective(
            pathBuilderConfig,
			frontendPartialsPath,
			$compile
        );
        directive.$inject = [
            'pathBuilderConfig',
            'frontendPartialsPath',
            '$compile'
        ];
        return directive;
    }
}
export {SWFDirectiveController, SWFDirective};
	
	
