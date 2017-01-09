/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

require("angular-mocks");
import {validationmodule} from "../validation.module";
class test{
    constructor(

    ){
        describe('swvalidationemail Test',()=>{
            var $compile,$rootScope, form, element;
            beforeEach(()=>{
                angular.module('ngAnimate',[]);
                angular.module('ngSanitize',[]);
                angular.module('ui.bootstrap',[]);
                angular.module('hibachi.core',['ngAnimate','ngSanitize','ui.bootstrap']);
                angular.mock.module('hibachi.validation');
                angular.mock.module(($provide)=>{
                    $provide.service('validationService', ()=>{
                        const MY_EMAIL_REGEXP =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return {
                            validateEmail: (value)=>{
                                console.log(value);
                                console.log('test: ', MY_EMAIL_REGEXP.test('value'))
                                return MY_EMAIL_REGEXP.test('value');
                            }
                        }
                    })
                })

            });

            beforeEach(inject((_$compile_,_$rootScope_)=>{
                $compile = _$compile_;
                $rootScope = _$rootScope_;

                var elString = '<form name="form"><input type="email" sw-validation-email ng-model="model.email" name="emailInput"></form>';
                $rootScope.model = {email:null};
                element = element = $compile(elString)($rootScope);
                form = $rootScope.form;
            }));

            it('Should be valid if given a valid email',()=>{
                console.log("validationmodule", validationmodule)

                form.emailInput.$setViewValue('ryan.marchand@ten24web.com');
                $rootScope.$digest();
                console.log("inspect dis 1=>", form.emailInput.$error)
                expect(form.emailInput.$error.swvalidationemail).toBeFalsy();
            });

            it('Should be invalid if given an invalid email', ()=>{
                form.emailInput.$setViewValue('ryan.marchandten24web.com');
                $rootScope.$digest();
                console.log(element)
                console.log("inspect dis =>", form.emailInput.$error)
                expect(form.emailInput.$error.swvalidationemail).toBeTruthy();
            })
        });
    }
}
new test();