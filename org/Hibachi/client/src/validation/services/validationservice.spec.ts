/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

require("angular-mocks");
import {validationmodule} from "../validation.module";
class test{
    constructor(

    ){
        describe('validationService Test',()=>{
            var $compile,$rootScope, form, element, service, objects;
            beforeEach(()=>{
                angular.module('ngAnimate',[]);
                angular.module('ngSanitize',[]);
                angular.module('ui.bootstrap',[]);
                angular.module('hibachi.core',['ngAnimate','ngSanitize','ui.bootstrap']);
                angular.mock.module('hibachi.validation');
                angular.mock.module(($provide)=>{
                    $provide.service('$hibachi', ()=>{
                        return {
                            checkUniqueValue: (objectName, property, value)=>{
                                if(value === null) return false;
                                //if(objects[objectName].hasOwnProperty)

                            },
                            checkUniqueOrNullValue: (objectName, property, value)=>{
                                if(value === null) return true;
                            }
                        }
                    });

                    $provide.service('$q', ()=>{
                        
                    })
                })
            });

            beforeEach(inject((_$compile_,_$rootScope_, _validationService_)=>{
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                service= _validationService_
            }));

            describe('validateEq', ()=>{
                it('Should be valid if value equals expected value',()=>{
                    expect(service.validateEq(4,4)).toBe(true);
                    expect(service.validateEq(9,9)).toBe(true);
                    expect(service.validateEq('house','house')).toBe(true);
                });

                it('Should be invalid if value does not equal expected value', ()=>{
                    expect(service.validateEq(4,6)).toBe(false);
                    expect(service.validateEq(4,'4')).toBe(false);
                    expect(service.validateEq('car','house')).toBe(false);
                })
            })

            describe('validateNeq', ()=>{
                it('Should be valid if value does not equal expected value',()=>{
                    expect(service.validateNeq(4,6)).toBe(true);
                    expect(service.validateNeq(9,'9')).toBe(true);
                    expect(service.validateNeq('house','boat')).toBe(true);
                });

                it('Should be invalid if value equals expected value', ()=>{
                    expect(service.validateNeq(4,4)).toBe(false);
                    expect(service.validateNeq(6,6)).toBe(false);
                    expect(service.validateNeq('house','house')).toBe(false);
                })
            })

            describe('validateEmail', ()=>{
                it('Should be valid if passed valid email address',()=>{
                    expect(service.validateEmail('gus.erickson@ten24web.com')).toBe(true);
                    expect(service.validateEmail('gus&erickson+900.422-1hello@ten24web.com')).toBe(true);
                });

                it('Should be invalid if passed invalid email address', ()=>{
                    expect(service.validateEmail('gus.ericksonten24web.com')).toBe(false);
                    expect(service.validateEmail('gus.erickson@ten24web.com@')).toBe(false);
                    expect(service.validateEmail('@gus.ericksonten24web.com')).toBe(false);
                })
            })

            describe('validateGte', ()=>{
                it('Should be valid if value equals expected value',()=>{
                    expect(service.validateGte(4,4)).toBe(true);
                    expect(service.validateGte('9',9)).toBe(true);
                });

                it('Should be valid if value is greater than expected value',()=>{
                    expect(service.validateGte('4',3)).toBe(true);
                    expect(service.validateGte(12,0)).toBe(true);
                });

                it('Should be invalid if value is less than expected value',()=>{
                    expect(service.validateGte(3,4)).toBe(false);
                    expect(service.validateGte(0,'40')).toBe(false);
                });

                it('Should be invalid if value cannot be parsed to an integer',()=>{
                    expect(service.validateGte('couch',4)).toBe(false);
                });

            })

            describe('validateLte', ()=>{
                it('Should be valid if value equals expected value',()=>{
                    expect(service.validateLte(4,4)).toBe(true);
                    expect(service.validateLte('9',9)).toBe(true);
                });

                it('Should be valid if value is less than expected value',()=>{
                    expect(service.validateLte('4',6)).toBe(true);
                    expect(service.validateLte(12,'20')).toBe(true);
                });

                it('Should be invalid if value is greater than expected value',()=>{
                    expect(service.validateLte(30,4)).toBe(false);
                    expect(service.validateLte(100,'40')).toBe(false);
                });

                it('Should be invalid if value cannot be parsed to an integer',()=>{
                    expect(service.validateLte('couch',4)).toBe(false);
                    expect(service.validateLte(3,'blind mice')).toBe(false);
                });
            })

            describe('validateMaxLength', ()=>{
                it('Should be valid if input length equals max length',()=>{
                    expect(service.validateMaxLength('pear',4)).toBe(true);
                    expect(service.validateMaxLength('numbernin',9)).toBe(true);
                });

                it('Should be valid if input length is less than max length',()=>{
                    expect(service.validateMaxLength('4',6)).toBe(true);
                    expect(service.validateMaxLength('hi','10')).toBe(true);
                });

                it('Should be invalid if input length is greater than max length',()=>{
                    expect(service.validateMaxLength('thirty',4)).toBe(false);
                    expect(service.validateMaxLength('squanto','4')).toBe(false);
                });

                it('Should be invalid if max length cannot be parsed to an integer',()=>{
                    expect(service.validateMaxLength('couch','four')).toBe(false);
                    expect(service.validateMaxLength(3,'')).toBe(false);
                });
            })

            describe('validateMinLength', ()=>{
                it('Should be valid if input length equals min length',()=>{
                    expect(service.validateMinLength('pear',4)).toBe(true);
                    expect(service.validateMinLength('numbernin',9)).toBe(true);
                });

                it('Should be valid if input length is greater than min length',()=>{
                    expect(service.validateMinLength('letters',6)).toBe(true);
                    expect(service.validateMinLength('ten letters','10')).toBe(true);
                });

                it('Should be invalid if input length is less than min length',()=>{
                    expect(service.validateMinLength('five',5)).toBe(false);
                    expect(service.validateMinLength('squanto','9')).toBe(false);
                });

                it('Should be invalid if min length cannot be parsed to an integer',()=>{
                    expect(service.validateMinLength('couch','four')).toBe(false);
                    expect(service.validateMinLength(3,'')).toBe(false);
                });
            })

            describe('validateNumeric', ()=>{
                it('Should return true if given a number or a string representation of a number', ()=>{
                    expect(service.validateNumeric(4)).toBe(true);
                    expect(service.validateNumeric('9')).toBe(true);
                    expect(service.validateNumeric('0')).toBe(true);
                    expect(service.validateNumeric(Infinity)).toBe(true);
                });
                it('Should return false if given something else',()=>{
                    expect(service.validateNumeric([])).toBe(false);
                    expect(service.validateNumeric({})).toBe(false);
                    expect(service.validateNumeric('twelve')).toBe(false);
                    expect(service.validateNumeric(null)).toBe(false);
                    expect(service.validateNumeric(undefined)).toBe(false);
                });
            })

            describe('validateRequired', ()=>{
                it('Should return true if a value is supplied', ()=>{
                    expect(service.validateRequired(4)).toBe(true);
                    expect(service.validateRequired('ocho')).toBe(true);
                    expect(service.validateRequired({})).toBe(true);
                    expect(service.validateRequired([])).toBe(true);
                    expect(service.validateRequired(Infinity)).toBe(true);
                    expect(service.validateRequired(0)).toBe(true);
                });
                it('Should return false if given nothing',()=>{
                    expect(service.validateRequired()).toBe(false);
                });
            })

            describe('validateRegex', ()=>{
                it('Should return true if value matches pattern', ()=>{
                    expect(service.validateRegex('459','\\d+')).toBe(true)
                });
                it('Should return false if value does not match pattern',()=>{
                    expect(service.validateRegex('459','\\D+')).toBe(false)
                });
            })

            describe('validateMinValue', ()=>{
                it('Should be valid if value equals expected value',()=>{
                    expect(service.validateGte(4,4)).toBe(true);
                    expect(service.validateGte('9',9)).toBe(true);
                });

                it('Should be valid if value is greater than expected value',()=>{
                    expect(service.validateGte('4',3)).toBe(true);
                    expect(service.validateGte(12,0)).toBe(true);
                });

                it('Should be invalid if value is less than expected value',()=>{
                    expect(service.validateGte(3,4)).toBe(false);
                    expect(service.validateGte(0,'40')).toBe(false);
                });

                it('Should be invalid if value cannot be parsed to an integer',()=>{
                    expect(service.validateGte('couch',4)).toBe(false);
                });
            })

            describe('validateMaxValue', ()=>{
                it('Should be valid if value equals expected value',()=>{
                    expect(service.validateLte(4,4)).toBe(true);
                    expect(service.validateLte('9',9)).toBe(true);
                });

                it('Should be valid if value is less than expected value',()=>{
                    expect(service.validateLte('4',6)).toBe(true);
                    expect(service.validateLte(12,'20')).toBe(true);
                });

                it('Should be invalid if value is greater than expected value',()=>{
                    expect(service.validateLte(30,4)).toBe(false);
                    expect(service.validateLte(100,'40')).toBe(false);
                });

                it('Should be invalid if value cannot be parsed to an integer',()=>{
                    expect(service.validateLte('couch',4)).toBe(false);
                    expect(service.validateLte(3,'blind mice')).toBe(false);
                });
            })
            
            describe('validateDataType', ()=>{
                it('Should return true if value matches type', ()=>{
                    expect(service.validateDataType([], 'array')).toBe(true);
                    expect(service.validateDataType('howdy', 'string')).toBe(true);
                    expect(service.validateDataType({}, 'object')).toBe(true);
                    expect(service.validateDataType([], 'array')).toBe(true);
                    expect(service.validateDataType(new Date, 'date')).toBe(true);
                    expect(service.validateDataType('email@gmail.com', 'email')).toBe(true);
                    expect(service.validateDataType(undefined, 'undefined')).toBe(true);
                });
                it('Should return false if value does not match type',()=>{
                    expect(service.validateDataType('howdy', 'array')).toBe(false);
                    expect(service.validateDataType(8, 'string')).toBe(false);
                    expect(service.validateDataType([], 'object')).toBe(false);
                    expect(service.validateDataType({}, 'date')).toBe(false);
                    expect(service.validateDataType(null, 'undefined')).toBe(false);
                });
            })

            describe('validateUnique', ()=>{
                beforeEach(()=>{
                    objects = {
                        circle:{
                            radius:4
                        },
                        square:{
                            height:5,
                            width:5
                        }
                    }
                })
                it('Should return true if value is not already a property on object', ()=>{ //Maybe?
                    //add assertions here
                });
                it('Should return false if value is not unique on object or is null',()=>{
                    //add assertions here
                });
            })

            describe('validateUniqueOrNull', ()=>{
                it('Should return true if value is unique on object or null', ()=>{ //Maybe?
                    //add assertions here
                });
                it('Should return false if value is not unique on object',()=>{
                    //add assertions here
                });
            })
        });
    }
}
new test();