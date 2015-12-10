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
    public scope : {directive:any, variables:any};
    public bindToController={
		variables:"=",
		directive:"="
    };
    public controller=SWFDirectiveController
    public controllerAs="SWFDirective";
    public templateUrl;
    public $compile;
	
	// @ngInject
    constructor(private frontendPartialsPath:any, pathBuilderConfig, $compile){
        this.templateUrl = pathBuilderConfig.buildPartialsPath(frontendPartialsPath)+'swfdirectivepartial.html';
		this.$compile = $compile;
    }
    /** allows you to build a directive without using another controller and directive config. */
    // @ngInject
	public link:ng.IDirectiveLinkFn = (scope:ng.IScope, element: ng.IAugmentedJQuery, attrs:ng.IAttributes) =>{
        
		var template = '<span ' + this.scope.directive + ' ';
		if(angular.isDefined(this.scope.variables)){
			angular.forEach(this.scope.variables, function(value,key){
				template += ' ' + key + '=' + value + ' ';
			});
		}
		template += + '>';
		template += '</span>';
	
		// Render the template.
		element.html('').append(this.$compile(template)(scope));
	}
    
    public static Factory():ng.IDirectiveFactory{
        var directive:ng.IDirectiveFactory = (
		    frontendPartialsPath,
			pathBuilderConfig,
			$compile
        ) => new SWFDirective(
			frontendPartialsPath,
			pathBuilderConfig,
			$compile
        );
        directive.$inject = [
            'frontendPartialsPath',
			'pathBuilderConfig'
        ];
        return directive;
    }
}
export {SWFDirectiveController, SWFDirective};
	
	
