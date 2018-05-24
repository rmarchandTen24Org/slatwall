/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

import {SWFForm,SWFFormController} from '../../form/components/swfform';

class SWFAddressFormController extends SWFFormController{
    //@ngInject
    public slatwall;
    public fields;
    public addressOptions;
    
    constructor(public $rootScope,
        public $scope,
        public $timeout,
        public $hibachi,
        public $element,
        public validationService,
        public hibachiValidationService){
        super( $rootScope,
         $scope,
         $timeout,
         $hibachi,
         $element,
         validationService,
         hibachiValidationService);
        this.$rootScope = $rootScope;
        this.slatwall = $rootScope.slatwall;
        
        $scope.$watch(angular.bind(this,()=>{
            return this.form['countryCode'].$modelValue
        }), (val)=>{
            console.log(val);
            this.slatwall.getStates(val)
        });
        
        $scope.$watch('slatwall.states.addressOptions', ()=>{
            if(this.slatwall.states && this.slatwall.states.addressOptions){
                this.addressOptions = this.slatwall.states.addressOptions;
                console.log(this.addressOptions);
            }
        });
    }
    
    public $onInit = ()=>{
        // if(this.form && this.form['countryCode']){
        //     console.log("I'm a little teapot")
        //     this.$scope.$watch(angular.bind(this, ()=> {
        //       return this.form['country'].$modelValue;
        //     }),this.slatwall.refreshAddressOptions);
        // }else{
        //     console.log("I'm not a little teapot", this.form)
        // }
    }
    
}
 
class SWFAddressForm extends SWFForm{
    public static Factory(){
        var directive = (
        )=> new SWFAddressForm(
        );
        return directive;
    }
    
    //@ngInject
    constructor(
    ){
        super();
        let swfForm = new SWFForm;
        swfForm.controller = SWFAddressFormController;
        swfForm.controllerAs="swfAddressForm";
        swfForm.bindToController['formID'] = '@id';
        return swfForm;
    }
}
export{
    SWFAddressFormController,
    SWFAddressForm
}
