/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

require("angular-mocks");
import {validationmodule} from "../validation.module";
class test{
    constructor(

    ){
        describe('swValidationLte Test',()=>{
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
                            validateLte: (value, comparisonValue)=>{
                                if(angular.isString(value)){
                                    value = parseInt(<string>value)
                                }
                                if(angular.isString(comparisonValue)){
                                    comparisonValue = parseInt(<string>comparisonValue)
                                }
                                return (value <= comparisonValue);
                            }
                        }
                    })
                })

            });

            beforeEach(inject((_$compile_,_$rootScope_)=>{
                $compile = _$compile_;
                $rootScope = _$rootScope_;

                var elString = '<form name="form"><input type="text" sw-validation-lte="10" ng-model="model.value" name="valueInput"></form>';
                $rootScope.model = {email:null};
                element = element = $compile(elString)($rootScope);
                form = $rootScope.form;
            }));

            it('Should be valid if value equals comparison value',()=>{
                form.valueInput.$setViewValue('10');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationLte).toBeFalsy();
            });

            it('Should be invalid if value is greater than comparison value',()=>{
                form.valueInput.$setViewValue('11');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationLte).toBeTruthy();
            });

            it('Should be valid if value is less than comparison value', ()=>{
                form.valueInput.$setViewValue('8');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationLte).toBeFalsy();

                form.valueInput.$setViewValue('9.9');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationLte).toBeFalsy();
            })

            it('Should be invalid if value cannot be parsed to an integer', ()=>{
                form.valueInput.$setViewValue('elGuapo');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationLte).toBeTruthy();
            })
        });
    }
}
new test();