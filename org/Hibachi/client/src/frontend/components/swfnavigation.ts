/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWFNavigationController{
    //@ngInject
    public slatwall;
    public fulfillmentTabDisabled=true;
    public paymentTabDisabled=true;
    public reviewTabDisabled=true;
    
    private updateNavbar = (newList)=>{
        this.fulfillmentTabDisabled = newList.indexOf('account') > -1;
        this.paymentTabDisabled = this.fulfillmentTabDisabled || newList.indexOf('fulfillment') > -1;
        this.reviewTabDisabled = this.paymentTabDisabled || newList.indexOf('payment') > -1;
    }
    
    // private selectTab = (newList,oldList){
        
    // }
    
    private updateView = (newList, oldList)=>{
        this.updateNavbar(newList);
        // this.selectTab(newList,oldList);
    }
    
    constructor(private $rootScope, private $scope){
        this.$rootScope = $rootScope;
        this.slatwall = $rootScope.slatwall;
        $scope.$watch('slatwall.cart.orderRequirementsList',this.updateView)
    }
    
}
 
class SWFNavigation{
    public static Factory(){
        var directive = (
            $rootScope
        )=> new SWFNavigation(
            $rootScope
        );
        directive.$inject = ['$rootScope'];
        return directive;
    }
    
    //@ngInject
    constructor(
        $rootScope
    ){
        return {
            controller:SWFNavigationController,
            controllerAs:"swfNavigation",
            bindToController: {
            },
            restrict: "A",
            link: function(scope, element, attributes, ngModel) {
            }
        };
    }
}
export{
    SWFNavigationController,
    SWFNavigation
}
