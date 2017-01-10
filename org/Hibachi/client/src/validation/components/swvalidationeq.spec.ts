/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

require("angular-mocks");
import {validationmodule} from "../validation.module";
class test{
    constructor(

    ){
        describe('swValidationEq Test',()=>{
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
                            validateEq: (value, expectedValue)=>{
                                return (value === expectedValue);
                            }
                        }
                    })
                })

            });

            beforeEach(inject((_$compile_,_$rootScope_)=>{
                $compile = _$compile_;
                $rootScope = _$rootScope_;

                var elString = '<form name="form"><input type="text" sw-validation-eq="theExpectedValue" ng-model="model.value" name="valueInput"></form>';
                $rootScope.model = {email:null};
                element = element = $compile(elString)($rootScope);
                form = $rootScope.form;
            }));

            it('Should be valid if value equals expected value',()=>{
                form.valueInput.$setViewValue('theExpectedValue');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationEq).toBeFalsy();
            });

            it('Should be invalid if value does not equal expected value', ()=>{
                form.valueInput.$setViewValue('unexpectedValue');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationEq).toBeTruthy();

                form.valueInput.$setViewValue('somethingElse');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationEq).toBeTruthy();

                form.valueInput.$setViewValue('a third thing');
                $rootScope.$digest();
                expect(form.valueInput.$error.swValidationEq).toBeTruthy();
            })
        });
    }
}
new test();