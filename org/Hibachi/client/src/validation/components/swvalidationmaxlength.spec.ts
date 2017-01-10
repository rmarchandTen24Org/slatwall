/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

require("angular-mocks");
import {validationmodule} from "../validation.module";
class test{
    constructor(

    ){
        describe('swValidationMaxLength Test',()=>{
            var $compile,$rootScope, form, element;
            beforeEach(()=>{
                angular.module('ngAnimate',[]);
                angular.module('ngSanitize',[]);
                angular.module('ui.bootstrap',[]);
                angular.module('hibachi.core',['ngAnimate','ngSanitize','ui.bootstrap']);
                angular.mock.module('hibachi.validation');
                angular.mock.module(($provide)=>{
                    $provide.service('validationService', ()=>{
                        return {
                            validateMaxLength: (value, maxLength)=>{
                                var length = 0
                                if(value && value.length){
                                    length = value.length
                                }
                                if(angular.isString(value)){
                                    value = value.length
                                }
                                if(angular.isString(maxLength)){
                                    maxLength = parseInt(<string>maxLength)
                                }
                                return (value <= maxLength);
                            }
                        }
                    })
                })

            });

            beforeEach(inject((_$compile_,_$rootScope_)=>{
                $compile = _$compile_;
                $rootScope = _$rootScope_;

                var elString = '<form name="form"><input type="text" sw-validation-max-length="6" ng-model="model.value" name="valueInput"></form>';
                $rootScope.model = {email:null};
                element = element = $compile(elString)($rootScope);
                form = $rootScope.form;
            }));

            it('Should be valid if input length equals max length',()=>{
                form.valueInput.$setViewValue('Willow');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationMaxLength).toBeFalsy();
            });

            it('Should be valid if value is less than max length', ()=>{
                form.valueInput.$setViewValue('Park');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationMaxLength).toBeFalsy();

                form.valueInput.$setViewValue('9.9');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationMaxLength).toBeFalsy();
            })

            it('Should be invalid if value is greater than max length',()=>{
                form.valueInput.$setViewValue('Magnitude');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationMaxLength).toBeTruthy();
            });


        });
    }
}
new test();