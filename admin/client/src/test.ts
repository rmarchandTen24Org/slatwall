/// <reference path='../typings/slatwallTypescript.d.ts' />
/// <reference path='../typings/tsd.d.ts' />
/*jshint browser:true */

require('jquery-ui-timepicker-addon');
require('jquery-typewatch');
require('date');
require('angular');
require('angular-lazy-bootstrap');
require('ui.bootstrap');
require('angular-resource');
require('angular-cookies');
require('angular-route');
require('angular-animate');
require('angular-sanitize');
require('metismenu');
require('angularjs-datetime-picker');
(function(orig) {
    window.angular.modules = [];
    window.angular.module = function() {
        if (arguments.length > 1) {
            window.angular.modules.push(arguments[0]);
        }
        return orig.apply(null, arguments);
    }
})(window.angular.module);

import {BaseBootStrapper} from "../../../org/Hibachi/client/src/basebootstrap";
import {slatwalladminmodule} from "./slatwall/slatwalladmin.module";
declare var window:any;
declare var require:any;
declare var htmlTemplates:any;

//custom bootstrapper
class bootstrapper extends BaseBootStrapper{
    public myApplication;

    constructor(){

        var angular:any = super(slatwalladminmodule.name);

        //add all templates to the template cache
        window.angular.module('slatwalladmin').run(['$templateCache','appConfig',($templateCache)=>{
             for(var i in htmlTemplates){
                 $templateCache.put(i,htmlTemplates[i]);
             }
        }]);

        angular.done(function() {
       	 	//angular.element('#loading').hide();

            require('../../../node_modules/jasmine-core/lib/jasmine-core/boot');
            require('angular-mocks');


            describe('all Test',()=>{
                var $httpBackend;
                var getAccountHandler;
                var getCartHandler;
                var getCountriesHandler;
                var getStateByCountryCodeHandler;
                beforeEach(window.angular.mock.module('slatwalladmin'));
                beforeEach(()=>{
                    for(var m=0;m > window.angular.modules.length;m++){

                        window.mock.angular(window.angular.modules[m]);
                    }
                    window.angular.mock.module(($provide)=>{
                        var interceptorFake = jasmine.createSpy('request() spy').and.callFake(
                        (config)=>{
                            return config;
                        });
                        $provide.service('hibachiInterceptor',function (){
                            this.request = interceptorFake;
                            this.requestError = interceptorFake;
                            this.response = interceptorFake;
                            this.responseError = interceptorFake;
                        });
                    });
                    window.angular.mock.inject((_$httpBackend_)=>{
                       $httpBackend = _$httpBackend_;
                        //default state by countryCode
                        getStateByCountryCodeHandler = $httpBackend.when('POST','/index.cfm/api/scope/getStateCodeOptionsByCountryCode/?countryCode=US')
                        .respond({
                           "failureActions":[

                           ],
                           "messages":[

                           ],
                           "stateCodeOptions":[
                              {
                                 "name":"AA (Armed Forces Americas)",
                                 "value":"AA"
                              },
                              {
                                 "name":"AE (Armed Forces Europe)",
                                 "value":"AE"
                              },
                              {
                                 "name":"Alabama",
                                 "value":"AL"
                              },
                              {
                                 "name":"Alaska",
                                 "value":"AK"
                              },
                              {
                                 "name":"AP (Armed Forces Pacific)",
                                 "value":"AP"
                              },
                              {
                                 "name":"Arizona",
                                 "value":"AZ"
                              },
                              {
                                 "name":"Arkansas",
                                 "value":"AR"
                              },
                              {
                                 "name":"California",
                                 "value":"CA"
                              },
                              {
                                 "name":"Colorado",
                                 "value":"CO"
                              },
                              {
                                 "name":"Connecticut",
                                 "value":"CT"
                              },
                              {
                                 "name":"D.C.",
                                 "value":"DC"
                              },
                              {
                                 "name":"Delaware",
                                 "value":"DE"
                              },
                              {
                                 "name":"Florida",
                                 "value":"FL"
                              },
                              {
                                 "name":"Georgia",
                                 "value":"GA"
                              },
                              {
                                 "name":"Hawaii",
                                 "value":"HI"
                              },
                              {
                                 "name":"Idaho",
                                 "value":"ID"
                              },
                              {
                                 "name":"Illinois",
                                 "value":"IL"
                              },
                              {
                                 "name":"Indiana",
                                 "value":"IN"
                              },
                              {
                                 "name":"Iowa",
                                 "value":"IA"
                              },
                              {
                                 "name":"Kansas",
                                 "value":"KS"
                              },
                              {
                                 "name":"Kentucky",
                                 "value":"KY"
                              },
                              {
                                 "name":"Louisiana",
                                 "value":"LA"
                              },
                              {
                                 "name":"Maine",
                                 "value":"ME"
                              },
                              {
                                 "name":"Maryland",
                                 "value":"MD"
                              },
                              {
                                 "name":"Massachusetts",
                                 "value":"MA"
                              },
                              {
                                 "name":"Michigan",
                                 "value":"MI"
                              },
                              {
                                 "name":"Minnesota",
                                 "value":"MN"
                              },
                              {
                                 "name":"Mississippi",
                                 "value":"MS"
                              },
                              {
                                 "name":"Missouri",
                                 "value":"MO"
                              },
                              {
                                 "name":"Montana",
                                 "value":"MT"
                              },
                              {
                                 "name":"Nebraska",
                                 "value":"NE"
                              },
                              {
                                 "name":"Nevada",
                                 "value":"NV"
                              },
                              {
                                 "name":"New Hampshire",
                                 "value":"NH"
                              },
                              {
                                 "name":"New Jersey",
                                 "value":"NJ"
                              },
                              {
                                 "name":"New Mexico",
                                 "value":"NM"
                              },
                              {
                                 "name":"New York",
                                 "value":"NY"
                              },
                              {
                                 "name":"North Carolina",
                                 "value":"NC"
                              },
                              {
                                 "name":"North Dakota",
                                 "value":"ND"
                              },
                              {
                                 "name":"Ohio",
                                 "value":"OH"
                              },
                              {
                                 "name":"Oklahoma",
                                 "value":"OK"
                              },
                              {
                                 "name":"Oregon",
                                 "value":"OR"
                              },
                              {
                                 "name":"Pennsylvania",
                                 "value":"PA"
                              },
                              {
                                 "name":"Rhode Island",
                                 "value":"RI"
                              },
                              {
                                 "name":"South Carolina",
                                 "value":"SC"
                              },
                              {
                                 "name":"South Dakota",
                                 "value":"SD"
                              },
                              {
                                 "name":"Tennessee",
                                 "value":"TN"
                              },
                              {
                                 "name":"Texas",
                                 "value":"TX"
                              },
                              {
                                 "name":"Utah",
                                 "value":"UT"
                              },
                              {
                                 "name":"Vermont",
                                 "value":"VT"
                              },
                              {
                                 "name":"Virginia",
                                 "value":"VA"
                              },
                              {
                                 "name":"Washington",
                                 "value":"WA"
                              },
                              {
                                 "name":"West Virginia",
                                 "value":"WV"
                              },
                              {
                                 "name":"Wisconsin",
                                 "value":"WI"
                              },
                              {
                                 "name":"Wyoming",
                                 "value":"WY"
                              }
                           ],
                           "successfulActions":[

                           ]
                        });
                        //default countries
                        getCountriesHandler = $httpBackend.when('POST', '/index.cfm/api/scope/getCountries/')
                        .respond({
                           "failureActions":[

                           ],
                           "countryCodeOptions":[
                              {
                                 "name":"Afghanistan",
                                 "value":"AF"
                              },
                              {
                                 "name":"Aland Island",
                                 "value":"AX"
                              },
                              {
                                 "name":"Albania",
                                 "value":"AL"
                              },
                              {
                                 "name":"Algeria",
                                 "value":"DZ"
                              },
                              {
                                 "name":"American Samoa",
                                 "value":"AS"
                              },
                              {
                                 "name":"Andorra",
                                 "value":"AD"
                              },
                              {
                                 "name":"Angola",
                                 "value":"AO"
                              },
                              {
                                 "name":"Anguilla",
                                 "value":"AI"
                              },
                              {
                                 "name":"Antarctica",
                                 "value":"AQ"
                              },
                              {
                                 "name":"Antigua and Barbuda",
                                 "value":"AG"
                              },
                              {
                                 "name":"Argentina",
                                 "value":"AR"
                              },
                              {
                                 "name":"Armenia",
                                 "value":"AM"
                              },
                              {
                                 "name":"Aruba",
                                 "value":"AW"
                              },
                              {
                                 "name":"Australia",
                                 "value":"AU"
                              },
                              {
                                 "name":"Austria",
                                 "value":"AT"
                              },
                              {
                                 "name":"Azerbaijan",
                                 "value":"AZ"
                              },
                              {
                                 "name":"Bahamas",
                                 "value":"BS"
                              },
                              {
                                 "name":"Bahrain",
                                 "value":"BH"
                              },
                              {
                                 "name":"Bangladesh",
                                 "value":"BD"
                              },
                              {
                                 "name":"Barbados",
                                 "value":"BB"
                              },
                              {
                                 "name":"Belarus",
                                 "value":"BY"
                              },
                              {
                                 "name":"Belgium",
                                 "value":"BE"
                              },
                              {
                                 "name":"Belize",
                                 "value":"BZ"
                              },
                              {
                                 "name":"Benin",
                                 "value":"BJ"
                              },
                              {
                                 "name":"Bermuda",
                                 "value":"BM"
                              },
                              {
                                 "name":"Bhutan",
                                 "value":"BT"
                              },
                              {
                                 "name":"Bolivia",
                                 "value":"BO"
                              },
                              {
                                 "name":"Bonaire, Sint Eustatuis and Saba",
                                 "value":"BQ"
                              },
                              {
                                 "name":"Bosnia and Herzegovina",
                                 "value":"BA"
                              },
                              {
                                 "name":"Botswana",
                                 "value":"BW"
                              },
                              {
                                 "name":"Bouvet Island",
                                 "value":"BV"
                              },
                              {
                                 "name":"Brazil",
                                 "value":"BR"
                              },
                              {
                                 "name":"Britich Indian Ocean Territory",
                                 "value":"IO"
                              },
                              {
                                 "name":"Brunei Darussalam",
                                 "value":"BN"
                              },
                              {
                                 "name":"Bulgaria",
                                 "value":"BG"
                              },
                              {
                                 "name":"Burkina Faso",
                                 "value":"BF"
                              },
                              {
                                 "name":"Burma (Myanmar)",
                                 "value":"MM"
                              },
                              {
                                 "name":"Burundi",
                                 "value":"BI"
                              },
                              {
                                 "name":"Cambodia",
                                 "value":"KH"
                              },
                              {
                                 "name":"Cameroon",
                                 "value":"CM"
                              },
                              {
                                 "name":"Canada",
                                 "value":"CA"
                              },
                              {
                                 "name":"Cape Verde",
                                 "value":"CV"
                              },
                              {
                                 "name":"Cayman Islands",
                                 "value":"KY"
                              },
                              {
                                 "name":"Central African Republic",
                                 "value":"CF"
                              },
                              {
                                 "name":"Chad",
                                 "value":"TD"
                              },
                              {
                                 "name":"Chile",
                                 "value":"CL"
                              },
                              {
                                 "name":"China",
                                 "value":"CN"
                              },
                              {
                                 "name":"Christmas Island",
                                 "value":"CX"
                              },
                              {
                                 "name":"Cocos (Keeling) Islands",
                                 "value":"CC"
                              },
                              {
                                 "name":"Colombia",
                                 "value":"CO"
                              },
                              {
                                 "name":"Comoros",
                                 "value":"KM"
                              },
                              {
                                 "name":"Congo, Republic",
                                 "value":"CG"
                              },
                              {
                                 "name":"Congo, The Democratic Rebublic Of The",
                                 "value":"CD"
                              },
                              {
                                 "name":"Cook Islands",
                                 "value":"CK"
                              },
                              {
                                 "name":"Costa Rica",
                                 "value":"CR"
                              },
                              {
                                 "name":"Croatia",
                                 "value":"HR"
                              },
                              {
                                 "name":"Cuba",
                                 "value":"CU"
                              },
                              {
                                 "name":"Curacao",
                                 "value":"CW"
                              },
                              {
                                 "name":"Cyprus",
                                 "value":"CY"
                              },
                              {
                                 "name":"Czech Republic",
                                 "value":"CZ"
                              },
                              {
                                 "name":"Denmark",
                                 "value":"DK"
                              },
                              {
                                 "name":"Djibouti",
                                 "value":"DJ"
                              },
                              {
                                 "name":"Dominica",
                                 "value":"DM"
                              },
                              {
                                 "name":"Dominican Republic",
                                 "value":"DO"
                              },
                              {
                                 "name":"Ecuador",
                                 "value":"EC"
                              },
                              {
                                 "name":"Egypt",
                                 "value":"EG"
                              },
                              {
                                 "name":"El Salvador",
                                 "value":"SV"
                              },
                              {
                                 "name":"Equatorial Guinea",
                                 "value":"GQ"
                              },
                              {
                                 "name":"Eritrea",
                                 "value":"ER"
                              },
                              {
                                 "name":"Estonia",
                                 "value":"EE"
                              },
                              {
                                 "name":"Ethiopia",
                                 "value":"ET"
                              },
                              {
                                 "name":"Falkland Islands (Malvinas)",
                                 "value":"FK"
                              },
                              {
                                 "name":"Faroe Islands",
                                 "value":"FO"
                              },
                              {
                                 "name":"Fiji",
                                 "value":"FJ"
                              },
                              {
                                 "name":"Finland",
                                 "value":"FI"
                              },
                              {
                                 "name":"France",
                                 "value":"FR"
                              },
                              {
                                 "name":"French Guiana",
                                 "value":"GF"
                              },
                              {
                                 "name":"French Polynesia",
                                 "value":"PF"
                              },
                              {
                                 "name":"French Southern Territories",
                                 "value":"TF"
                              },
                              {
                                 "name":"Futuna Islands",
                                 "value":"WF"
                              },
                              {
                                 "name":"Gabon",
                                 "value":"GA"
                              },
                              {
                                 "name":"Gambia",
                                 "value":"GM"
                              },
                              {
                                 "name":"Georgia",
                                 "value":"GE"
                              },
                              {
                                 "name":"Germany",
                                 "value":"DE"
                              },
                              {
                                 "name":"Ghana",
                                 "value":"GH"
                              },
                              {
                                 "name":"Gibraltar",
                                 "value":"GI"
                              },
                              {
                                 "name":"Greece",
                                 "value":"GR"
                              },
                              {
                                 "name":"Greenland",
                                 "value":"GL"
                              },
                              {
                                 "name":"Grenada",
                                 "value":"GD"
                              },
                              {
                                 "name":"Guadeloupe",
                                 "value":"GP"
                              },
                              {
                                 "name":"Guam",
                                 "value":"GU"
                              },
                              {
                                 "name":"Guatemala",
                                 "value":"GT"
                              },
                              {
                                 "name":"Guernsey",
                                 "value":"GG"
                              },
                              {
                                 "name":"Guinea",
                                 "value":"GN"
                              },
                              {
                                 "name":"Guinea-Bissau",
                                 "value":"GW"
                              },
                              {
                                 "name":"Guyana",
                                 "value":"GY"
                              },
                              {
                                 "name":"Haiti",
                                 "value":"HT"
                              },
                              {
                                 "name":"Heard Island and Mcdonald Islands",
                                 "value":"HM"
                              },
                              {
                                 "name":"Honduras",
                                 "value":"HN"
                              },
                              {
                                 "name":"Hong Kong",
                                 "value":"HK"
                              },
                              {
                                 "name":"Hungary",
                                 "value":"HU"
                              },
                              {
                                 "name":"Iceland",
                                 "value":"IS"
                              },
                              {
                                 "name":"India",
                                 "value":"IN"
                              },
                              {
                                 "name":"Indonesia",
                                 "value":"ID"
                              },
                              {
                                 "name":"Iran",
                                 "value":"IR"
                              },
                              {
                                 "name":"Iraq",
                                 "value":"IQ"
                              },
                              {
                                 "name":"Ireland",
                                 "value":"IE"
                              },
                              {
                                 "name":"Isle of Man",
                                 "value":"IM"
                              },
                              {
                                 "name":"Israel",
                                 "value":"IL"
                              },
                              {
                                 "name":"Italy",
                                 "value":"IT"
                              },
                              {
                                 "name":"Ivory Coast",
                                 "value":"CI"
                              },
                              {
                                 "name":"Jamaica",
                                 "value":"JM"
                              },
                              {
                                 "name":"Japan",
                                 "value":"JP"
                              },
                              {
                                 "name":"Jersey",
                                 "value":"JE"
                              },
                              {
                                 "name":"Jordan",
                                 "value":"JO"
                              },
                              {
                                 "name":"Kazakhstan",
                                 "value":"KZ"
                              },
                              {
                                 "name":"Kenya",
                                 "value":"KE"
                              },
                              {
                                 "name":"Kiribati",
                                 "value":"KI"
                              },
                              {
                                 "name":"Korea, Democratic People's Republic of",
                                 "value":"KP"
                              },
                              {
                                 "name":"Kuwait",
                                 "value":"KW"
                              },
                              {
                                 "name":"Kyrgyzstan",
                                 "value":"KG"
                              },
                              {
                                 "name":"Laos",
                                 "value":"LA"
                              },
                              {
                                 "name":"Latvia",
                                 "value":"LV"
                              },
                              {
                                 "name":"Lebanon",
                                 "value":"LB"
                              },
                              {
                                 "name":"Lesotho",
                                 "value":"LS"
                              },
                              {
                                 "name":"Liberia",
                                 "value":"LR"
                              },
                              {
                                 "name":"Libya",
                                 "value":"LY"
                              },
                              {
                                 "name":"Liechtenstein",
                                 "value":"LI"
                              },
                              {
                                 "name":"Lithuania",
                                 "value":"LT"
                              },
                              {
                                 "name":"Luxembourg",
                                 "value":"LU"
                              },
                              {
                                 "name":"Macao",
                                 "value":"MO"
                              },
                              {
                                 "name":"Macedonia",
                                 "value":"MK"
                              },
                              {
                                 "name":"Madagascar",
                                 "value":"MG"
                              },
                              {
                                 "name":"Malawi",
                                 "value":"MW"
                              },
                              {
                                 "name":"Malaysia",
                                 "value":"MY"
                              },
                              {
                                 "name":"Maldives",
                                 "value":"MV"
                              },
                              {
                                 "name":"Mali",
                                 "value":"ML"
                              },
                              {
                                 "name":"Malta",
                                 "value":"MT"
                              },
                              {
                                 "name":"Marshall Islands",
                                 "value":"MH"
                              },
                              {
                                 "name":"Martinique",
                                 "value":"MQ"
                              },
                              {
                                 "name":"Mauritania",
                                 "value":"MR"
                              },
                              {
                                 "name":"Mauritius",
                                 "value":"MU"
                              },
                              {
                                 "name":"Mayotte",
                                 "value":"YT"
                              },
                              {
                                 "name":"Mexico",
                                 "value":"MX"
                              },
                              {
                                 "name":"Micronesia, Federated States Of",
                                 "value":"FM"
                              },
                              {
                                 "name":"Moldova",
                                 "value":"MD"
                              },
                              {
                                 "name":"Monaco",
                                 "value":"MC"
                              },
                              {
                                 "name":"Mongolia",
                                 "value":"MN"
                              },
                              {
                                 "name":"Montenegro",
                                 "value":"ME"
                              },
                              {
                                 "name":"Montserrat",
                                 "value":"MS"
                              },
                              {
                                 "name":"Morocco",
                                 "value":"MA"
                              },
                              {
                                 "name":"Mozambique",
                                 "value":"MZ"
                              },
                              {
                                 "name":"Namibia",
                                 "value":"NA"
                              },
                              {
                                 "name":"Nauru",
                                 "value":"NR"
                              },
                              {
                                 "name":"Nepal",
                                 "value":"NP"
                              },
                              {
                                 "name":"Netherlands",
                                 "value":"NL"
                              },
                              {
                                 "name":"New Caledonia",
                                 "value":"NC"
                              },
                              {
                                 "name":"New Zealand",
                                 "value":"NZ"
                              },
                              {
                                 "name":"Nicaragua",
                                 "value":"NI"
                              },
                              {
                                 "name":"Niger",
                                 "value":"NE"
                              },
                              {
                                 "name":"Nigeria",
                                 "value":"NG"
                              },
                              {
                                 "name":"Niue",
                                 "value":"NU"
                              },
                              {
                                 "name":"Norfolk Island",
                                 "value":"NF"
                              },
                              {
                                 "name":"Northern Mariana Islands",
                                 "value":"MP"
                              },
                              {
                                 "name":"Norway",
                                 "value":false
                              },
                              {
                                 "name":"Oman",
                                 "value":"OM"
                              },
                              {
                                 "name":"Pakistan",
                                 "value":"PK"
                              },
                              {
                                 "name":"Palau",
                                 "value":"PW"
                              },
                              {
                                 "name":"Palestinian Territory, Occupied",
                                 "value":"PS"
                              },
                              {
                                 "name":"Panama",
                                 "value":"PA"
                              },
                              {
                                 "name":"Papua New Guinea",
                                 "value":"PG"
                              },
                              {
                                 "name":"Paraguay",
                                 "value":"PY"
                              },
                              {
                                 "name":"Peru",
                                 "value":"PE"
                              },
                              {
                                 "name":"Philippines",
                                 "value":"PH"
                              },
                              {
                                 "name":"Pitcairn Island",
                                 "value":"PN"
                              },
                              {
                                 "name":"Poland",
                                 "value":"PL"
                              },
                              {
                                 "name":"Portugal",
                                 "value":"PT"
                              },
                              {
                                 "name":"Puerto Rico",
                                 "value":"PR"
                              },
                              {
                                 "name":"Qatar",
                                 "value":"QA"
                              },
                              {
                                 "name":"Reunion",
                                 "value":"RE"
                              },
                              {
                                 "name":"Romania",
                                 "value":"RO"
                              },
                              {
                                 "name":"Russian Federation",
                                 "value":"RU"
                              },
                              {
                                 "name":"Rwanda",
                                 "value":"RW"
                              },
                              {
                                 "name":"Saint Barthelemy",
                                 "value":"BL"
                              },
                              {
                                 "name":"Saint Helena",
                                 "value":"SH"
                              },
                              {
                                 "name":"Saint Lucia",
                                 "value":"LC"
                              },
                              {
                                 "name":"Saint Martin (French Part)",
                                 "value":"MF"
                              },
                              {
                                 "name":"Saint Pierre and Miquelon",
                                 "value":"PM"
                              },
                              {
                                 "name":"Saint Vincent and Grenadi",
                                 "value":"VC"
                              },
                              {
                                 "name":"San Marino",
                                 "value":"SM"
                              },
                              {
                                 "name":"Sao Tome and Principe",
                                 "value":"ST"
                              },
                              {
                                 "name":"Saudi Arabia",
                                 "value":"SA"
                              },
                              {
                                 "name":"Savalbard and Jan Mayen",
                                 "value":"SJ"
                              },
                              {
                                 "name":"Senegal",
                                 "value":"SN"
                              },
                              {
                                 "name":"Serbia",
                                 "value":"RS"
                              },
                              {
                                 "name":"Seychelles",
                                 "value":"SC"
                              },
                              {
                                 "name":"Sierra Leone",
                                 "value":"SL"
                              },
                              {
                                 "name":"Singapore",
                                 "value":"SG"
                              },
                              {
                                 "name":"Sint Maarten (Dutch Part)",
                                 "value":"SX"
                              },
                              {
                                 "name":"Slovakia",
                                 "value":"SK"
                              },
                              {
                                 "name":"Slovenia",
                                 "value":"SI"
                              },
                              {
                                 "name":"Solomon Islands",
                                 "value":"SB"
                              },
                              {
                                 "name":"Somalia",
                                 "value":"SO"
                              },
                              {
                                 "name":"South Africa",
                                 "value":"ZA"
                              },
                              {
                                 "name":"South Georgia and the South Sandwich Islands",
                                 "value":"GS"
                              },
                              {
                                 "name":"South Korea",
                                 "value":"KR"
                              },
                              {
                                 "name":"South Sudan",
                                 "value":"SS"
                              },
                              {
                                 "name":"Spain",
                                 "value":"ES"
                              },
                              {
                                 "name":"Sri Lanka",
                                 "value":"LK"
                              },
                              {
                                 "name":"St. Christopher",
                                 "value":"KN"
                              },
                              {
                                 "name":"Sudan",
                                 "value":"SD"
                              },
                              {
                                 "name":"Suriname",
                                 "value":"SR"
                              },
                              {
                                 "name":"Swaziland",
                                 "value":"SZ"
                              },
                              {
                                 "name":"Sweden",
                                 "value":"SE"
                              },
                              {
                                 "name":"Switzerland",
                                 "value":"CH"
                              },
                              {
                                 "name":"Syria",
                                 "value":"SY"
                              },
                              {
                                 "name":"Taiwan",
                                 "value":"TW"
                              },
                              {
                                 "name":"Tajikistan",
                                 "value":"TJ"
                              },
                              {
                                 "name":"Tanzania",
                                 "value":"TZ"
                              },
                              {
                                 "name":"Thailand",
                                 "value":"TH"
                              },
                              {
                                 "name":"Timor-Leste",
                                 "value":"TL"
                              },
                              {
                                 "name":"Togo",
                                 "value":"TG"
                              },
                              {
                                 "name":"Tokelau",
                                 "value":"TK"
                              },
                              {
                                 "name":"Tonga",
                                 "value":"TO"
                              },
                              {
                                 "name":"Trinidad and Tobago",
                                 "value":"TT"
                              },
                              {
                                 "name":"Tunisia",
                                 "value":"TN"
                              },
                              {
                                 "name":"Turkey",
                                 "value":"TR"
                              },
                              {
                                 "name":"Turkmenistan",
                                 "value":"TM"
                              },
                              {
                                 "name":"Turks and Caicos Islands",
                                 "value":"TC"
                              },
                              {
                                 "name":"Tuvalu",
                                 "value":"TV"
                              },
                              {
                                 "name":"Uganda",
                                 "value":"UG"
                              },
                              {
                                 "name":"Ukraine",
                                 "value":"UA"
                              },
                              {
                                 "name":"United Arab Emirates",
                                 "value":"AE"
                              },
                              {
                                 "name":"United Kingdom",
                                 "value":"GB"
                              },
                              {
                                 "name":"United States",
                                 "value":"US"
                              },
                              {
                                 "name":"United States Minor Outlying Islands",
                                 "value":"UM"
                              },
                              {
                                 "name":"Uruguay",
                                 "value":"UY"
                              },
                              {
                                 "name":"Uzbekistan",
                                 "value":"UZ"
                              },
                              {
                                 "name":"Vanuatu",
                                 "value":"VU"
                              },
                              {
                                 "name":"Vatican City",
                                 "value":"VA"
                              },
                              {
                                 "name":"Venezuela",
                                 "value":"VE"
                              },
                              {
                                 "name":"Vietnam",
                                 "value":"VN"
                              },
                              {
                                 "name":"Virgin Islands, British",
                                 "value":"VG"
                              },
                              {
                                 "name":"Virgin Islands, US",
                                 "value":"VI"
                              },
                              {
                                 "name":"Western Sahara",
                                 "value":"EH"
                              },
                              {
                                 "name":"Western Samoa",
                                 "value":"WS"
                              },
                              {
                                 "name":"Yemen",
                                 "value":"YE"
                              },
                              {
                                 "name":"Zambia",
                                 "value":"ZM"
                              },
                              {
                                 "name":"Zimbabwe",
                                 "value":"ZW"
                              }
                           ],
                           "messages":[

                           ],
                           "successfulActions":[

                           ]
                        });
                        //default cart
                        getCartHandler = $httpBackend.when('POST', '/index.cfm/api/scope/getCart/')
                        .respond({
                           "errors":{

                           },
                           "orderPayments":[

                           ],
                           "fulfillmentChargeAfterDiscountTotal":0,
                           "promotionCodeList":"",
                           "fulfillmentTotal":0.00,
                           "orderID":"ff8080815ab91389015ab9369e610013",
                           "promotionCodes":[

                           ],
                           "failureActions":[

                           ],
                           "subtotal":0,
                           "orderFulfillments":[

                           ],
                           "processObjects":{

                           },
                           "messages":[

                           ],
                           "orderOpenDateTime":"",
                           "calculatedTotal":0.00,
                           "discountTotal":0.00,
                           "hasErrors":false,
                           "taxTotal":0,
                           "orderItems":[

                           ],
                           "successfulActions":[

                           ]
                        });

                        getAccountHandler = $httpBackend.when('POST', '/index.cfm/api/scope/getAccount/')
                        .respond({
                           "primaryPhoneNumber":{
                              "errors":{

                              },
                              "phoneNumber":"",
                              "hasErrors":false,
                              "accountPhoneNumberID":""
                           },
                           "errors":{

                           },
                           "primaryAddress":{
                              "errors":{

                              },
                              "hasErrors":false,
                              "accountAddressID":"ff80808159cbfcca0159cc01ebf60008"
                           },
                           "firstName":"testrunner",
                           "company":"",
                           "failureActions":[

                           ],
                           "remoteID":"",
                           "primaryEmailAddress":{
                              "errors":{

                              },
                              "emailAddress":"testrunner@ten24web.com",
                              "hasErrors":false,
                              "accountEmailAddressID":"ff808081598f3eae0159934e4a7d0029"
                           },
                           "lastName":"testrunning",
                           "processObjects":{

                           },
                           "messages":[

                           ],
                           "accountID":"ff808081598f3eae0159934e45e90028",
                           "accountAddresses":[
                              {
                                 "errors":{

                                 },
                                 "accountAddressName":"",
                                 "address":{
                                    "postalcode":"01601",
                                    "errors":{

                                    },
                                    "city":"Worcester",
                                    "statecode":"MA",
                                    "countrycode":"US",
                                    "addressID":"ff80808159cbfcca0159cc01e67f0004",
                                    "streetAddress":"20 Franklin st",
                                    "street2Address":"",
                                    "hasErrors":false
                                 },
                                 "hasErrors":false,
                                 "accountAddressID":"ff80808159cbfcca0159cc01ebf60008"
                              }
                           ],
                           "hasErrors":false,
                           "successfulActions":[

                           ]
                        });


                        //default account

                    });

                });

                 var requireAll = function(requireContext) {
                    return requireContext.keys().map(requireContext);
                }
                requireAll(require.context("../../../", true, /^\.\/.*\.spec.ts$/));
            });
            window.onload();

        });
        angular.bootstrap();


    }
}

export = new bootstrapper();




