/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/hibachiTypescript.d.ts" />

//components
import {SWValidate} from "./components/swvalidate";
import {SWValidationMinLength} from "./components/swvalidationminlength";
import {SWValidationDataType} from "./components/swvalidationdatatype";
import {SWValidationEq} from "./components/swvalidationeq";
import {SWValidationGte} from "./components/swvalidationgte";
import {SWValidationLte} from "./components/swvalidationlte";
import {SWValidationMaxLength} from "./components/swvalidationmaxlength";
import {SWValidationMaxValue} from "./components/swvalidationmaxvalue";
import {SWValidationMinValue} from "./components/swvalidationminvalue";
import {SWValidationNeq} from "./components/swvalidationneq";
import {SWValidationNumeric} from "./components/swvalidationnumeric";
import {SWValidationRegex} from "./components/swvalidationregex";
import {SWValidationRequired} from "./components/swvalidationrequired";
import {SWValidationUnique} from "./components/swvalidationunique";
import {SWValidationUniqueOrNull} from "./components/swvalidationuniqueornull";
import {SWValidationEmail} from "./components/swvalidationemail";
//services
import {ValidationService} from "./services/validationservice";
import {coremodule} from "../core/core.module";
var validationmodule = angular.module('hibachi.validation', [coremodule.name])
.run([function() {
}])
//directives
.directive('swValidate',SWValidate.Factory())
.directive('swValidationMinlength',SWValidationMinLength.Factory())
.directive('swValidationDatatype',SWValidationDataType.Factory())
.directive('swValidationEq',SWValidationEq.Factory())
.directive("swValidationGte", SWValidationGte.Factory())
.directive("swValidationLte",SWValidationLte.Factory())
.directive('swValidationMaxLength',SWValidationMaxLength.Factory())
.directive("swValidationMaxValue",SWValidationMaxValue.Factory())
.directive("swValidationMinValue",SWValidationMinValue.Factory())
.directive("swValidationNeq",SWValidationNeq.Factory())
.directive("swValidationNumeric",SWValidationNumeric.Factory())
.directive("swValidationRegex",SWValidationRegex.Factory())
.directive("swValidationRequired",SWValidationRequired.Factory())
.directive("swValidationUnique",SWValidationUnique.Factory())
.directive("swValidationUniqueOrNull",SWValidationUniqueOrNull.Factory())
.directive("swValidationEmail", SWValidationEmail.Factory())
//services
.service("validationService",ValidationService);

export{
	validationmodule
}