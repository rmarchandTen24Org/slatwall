/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/// <reference path='../typings/slatwallTypescript.d.ts' />
	/// <reference path='../typings/tsd.d.ts' />
	/*jshint browser:true */
	var basebootstrap_1 = __webpack_require__(1);
	var slatwalladmin_module_1 = __webpack_require__(63);
	//custom bootstrapper
	var bootstrapper = (function (_super) {
	    __extends(bootstrapper, _super);
	    function bootstrapper() {
	        var angular = _super.call(this, slatwalladmin_module_1.slatwalladminmodule.name);
	        angular.bootstrap();
	    }
	    return bootstrapper;
	})(basebootstrap_1.BaseBootStrapper);
	module.exports = new bootstrapper();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../typings/hibachiTypescript.d.ts' />
	/// <reference path='../typings/tsd.d.ts' />
	var core_module_1 = __webpack_require__(2);
	//generic bootstrapper
	var BaseBootStrapper = (function () {
	    function BaseBootStrapper(myApplication) {
	        var _this = this;
	        this._resourceBundle = {};
	        this.getData = function () {
	            return _this.$http.get(hibachiConfig.baseURL + '?' + hibachiConfig.action + '=api:main.getConfig')
	                .then(function (resp) {
	                core_module_1.coremodule.constant('appConfig', resp.data.data);
	                localStorage.setItem('appConfig', JSON.stringify(resp.data.data));
	                _this.appConfig = resp.data.data;
	                return _this.getResourceBundles();
	            });
	        };
	        this.getResourceBundle = function (locale) {
	            var deferred = _this.$q.defer();
	            var locale = locale || _this.appConfig.rbLocale;
	            if (_this._resourceBundle[locale]) {
	                return _this._resourceBundle[locale];
	            }
	            var urlString = _this.appConfig.baseURL + '/index.cfm/?' + _this.appConfig.action + '=api:main.getResourceBundle&instantiationKey=' + _this.appConfig.instantiationKey + '&locale=' + locale;
	            _this.$http({
	                url: urlString,
	                method: "GET"
	            }).success(function (response, status, headersGetter) {
	                _this._resourceBundle[locale] = response.data;
	                console.log(_this._resourceBundle);
	                deferred.resolve(response);
	            }).error(function (response) {
	                _this._resourceBundle[locale] = {};
	                deferred.reject(response);
	            });
	            return deferred.promise;
	        };
	        this.getResourceBundles = function () {
	            ////$log.debug('hasResourceBundle');
	            ////$log.debug(this._loadedResourceBundle);
	            //$log.debug(this.getConfigValue('rbLocale').split('_'));
	            var rbLocale = _this.appConfig.rbLocale.split('_');
	            var localeListArray = rbLocale;
	            var rbPromise;
	            var rbPromises = [];
	            rbPromise = _this.getResourceBundle(_this.appConfig.rbLocale);
	            rbPromises.push(rbPromise);
	            if (localeListArray.length === 2) {
	                //$log.debug('has two');
	                rbPromise = _this.getResourceBundle(localeListArray[0]);
	                rbPromises.push(rbPromise);
	            }
	            if (localeListArray[0] !== 'en') {
	                //$log.debug('get english');
	                _this.getResourceBundle('en_us');
	                _this.getResourceBundle('en');
	            }
	            var resourceBundlePromises = _this.$q.all(rbPromises).then(function (data) {
	                core_module_1.coremodule.constant('resourceBundles', _this._resourceBundle);
	                localStorage.setItem('resourceBundles', JSON.stringify(_this._resourceBundle));
	            }, function (error) {
	            });
	            return resourceBundlePromises;
	        };
	        this.myApplication = myApplication;
	        return angular.lazy(this.myApplication)
	            .resolve(['$http', '$q', '$timeout', function ($http, $q, $timeout) {
	                _this.$http = $http;
	                _this.$q = $q;
	                if (localStorage.getItem('appConfig')
	                    && localStorage.getItem('appConfig') !== 'undefined'
	                    && localStorage.getItem('resourceBundles')
	                    && localStorage.getItem('resourceBundles') !== 'undefined') {
	                    return $http.get(hibachiConfig.baseURL + '?' + hibachiConfig.action + '=api:main.getInstantiationKey')
	                        .then(function (resp) {
	                        var appConfig = JSON.parse(localStorage.getItem('appConfig'));
	                        if (resp.data.data === appConfig.instantiationKey) {
	                            core_module_1.coremodule.constant('appConfig', appConfig)
	                                .constant('resourceBundles', JSON.parse(localStorage.getItem('resourceBundles')));
	                        }
	                        else {
	                            return _this.getData();
	                        }
	                    });
	                }
	                else {
	                    return _this.getData();
	                }
	            }])
	            .loading(function () {
	            //angular.element('#loading').show();
	        })
	            .error(function () {
	            //angular.element('#error').show();
	        })
	            .done(function () {
	            //angular.element('#loading').hide();
	        });
	    }
	    return BaseBootStrapper;
	})();
	exports.BaseBootStrapper = BaseBootStrapper;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	var hibachiinterceptor_1 = __webpack_require__(3);
	//constant
	var hibachipathbuilder_1 = __webpack_require__(4);
	//services
	var publicservice_1 = __webpack_require__(5);
	var utilityservice_1 = __webpack_require__(6);
	var selectionservice_1 = __webpack_require__(8);
	var observerservice_1 = __webpack_require__(9);
	var formservice_1 = __webpack_require__(10);
	var expandableservice_1 = __webpack_require__(11);
	var metadataservice_1 = __webpack_require__(12);
	var rbkeyservice_1 = __webpack_require__(13);
	var hibachiservice_1 = __webpack_require__(14);
	var localstorageservice_1 = __webpack_require__(15);
	var hibachiservicedecorator_1 = __webpack_require__(16);
	var hibachiscope_1 = __webpack_require__(17);
	//controllers
	var globalsearch_1 = __webpack_require__(18);
	//filters
	var percentage_1 = __webpack_require__(19);
	var entityrbkey_1 = __webpack_require__(20);
	var swtrim_1 = __webpack_require__(21);
	//directives
	//  components
	var swactioncaller_1 = __webpack_require__(22);
	var swtypeaheadsearch_1 = __webpack_require__(23);
	var swtypeaheadinputfield_1 = __webpack_require__(24);
	var swtypeaheadsearchlineitem_1 = __webpack_require__(25);
	var swcollectionconfig_1 = __webpack_require__(26);
	var swcollectionfilter_1 = __webpack_require__(27);
	var swcollectioncolumn_1 = __webpack_require__(28);
	var swactioncallerdropdown_1 = __webpack_require__(29);
	var swcolumnsorter_1 = __webpack_require__(30);
	var swconfirm_1 = __webpack_require__(31);
	var swentityactionbar_1 = __webpack_require__(32);
	var swentityactionbarbuttongroup_1 = __webpack_require__(33);
	var swexpandablerecord_1 = __webpack_require__(34);
	var swgravatar_1 = __webpack_require__(35);
	var swlistingdisplay_1 = __webpack_require__(40);
	var swlistingcontrols_1 = __webpack_require__(41);
	var swlistingaggregate_1 = __webpack_require__(42);
	var swlistingcolorfilter_1 = __webpack_require__(43);
	var swlistingcolumn_1 = __webpack_require__(44);
	var swlistingfilter_1 = __webpack_require__(45);
	var swlistingfiltergroup_1 = __webpack_require__(46);
	var swlistingorderby_1 = __webpack_require__(47);
	var swlogin_1 = __webpack_require__(48);
	var swnumbersonly_1 = __webpack_require__(49);
	var swloading_1 = __webpack_require__(50);
	var swscrolltrigger_1 = __webpack_require__(51);
	var swtooltip_1 = __webpack_require__(52);
	var swrbkey_1 = __webpack_require__(53);
	var swoptions_1 = __webpack_require__(54);
	var swselection_1 = __webpack_require__(55);
	var swclickoutside_1 = __webpack_require__(56);
	var swdirective_1 = __webpack_require__(57);
	var swexportaction_1 = __webpack_require__(58);
	var swhref_1 = __webpack_require__(59);
	var swprocesscaller_1 = __webpack_require__(60);
	var swsortable_1 = __webpack_require__(61);
	var swlistingglobalsearch_1 = __webpack_require__(62);
	var coremodule = angular.module('hibachi.core', [
	    //Angular Modules
	    'ngAnimate',
	    'ngSanitize',
	    //3rdParty modules
	    'ui.bootstrap'
	]).config(['$httpProvider', '$logProvider', '$filterProvider', '$provide', 'hibachiPathBuilder', 'appConfig', function ($httpProvider, $logProvider, $filterProvider, $provide, hibachiPathBuilder, appConfig) {
	        hibachiPathBuilder.setBaseURL(appConfig.baseURL);
	        hibachiPathBuilder.setBasePartialsPath('/org/Hibachi/client/src/');
	        $logProvider.debugEnabled(appConfig.debugFlag);
	        $filterProvider.register('likeFilter', function () {
	            return function (text) {
	                if (angular.isDefined(text) && angular.isString(text)) {
	                    return text.replace(new RegExp('%', 'g'), '');
	                }
	            };
	        });
	        $filterProvider.register('truncate', function () {
	            return function (input, chars, breakOnWord) {
	                if (isNaN(chars))
	                    return input;
	                if (chars <= 0)
	                    return '';
	                if (input && input.length > chars) {
	                    input = input.substring(0, chars);
	                    if (!breakOnWord) {
	                        var lastspace = input.lastIndexOf(' ');
	                        //get last space
	                        if (lastspace !== -1) {
	                            input = input.substr(0, lastspace);
	                        }
	                    }
	                    else {
	                        while (input.charAt(input.length - 1) === ' ') {
	                            input = input.substr(0, input.length - 1);
	                        }
	                    }
	                    return input + '...';
	                }
	                return input;
	            };
	        });
	        hibachiPathBuilder.setBaseURL(appConfig.baseURL);
	        hibachiPathBuilder.setBasePartialsPath('/org/Hibachi/client/src/');
	        // $provide.decorator('$hibachi',
	        $httpProvider.interceptors.push('hibachiInterceptor');
	    }])
	    .run(['$rootScope', '$hibachi', '$route', '$location', function ($rootScope, $hibachi, $route, $location) {
	        $rootScope.buildUrl = $hibachi.buildUrl;
	        var original = $location.path;
	        $location.path = function (path, reload) {
	            if (reload === false) {
	                var lastRoute = $route.current;
	                var un = $rootScope.$on('$locationChangeSuccess', function () {
	                    $route.current = lastRoute;
	                    un();
	                });
	            }
	            return original.apply($location, [path]);
	        };
	    }])
	    .constant('hibachiPathBuilder', new hibachipathbuilder_1.HibachiPathBuilder())
	    .constant('corePartialsPath', 'core/components/')
	    .service('publicService', publicservice_1.PublicService)
	    .service('utilityService', utilityservice_1.UtilityService)
	    .service('selectionService', selectionservice_1.SelectionService)
	    .service('observerService', observerservice_1.ObserverService)
	    .service('expandableService', expandableservice_1.ExpandableService)
	    .service('formService', formservice_1.FormService)
	    .service('metadataService', metadataservice_1.MetaDataService)
	    .service('rbkeyService', rbkeyservice_1.RbKeyService)
	    .provider('$hibachi', hibachiservice_1.$Hibachi)
	    .decorator('$hibachi', hibachiservicedecorator_1.HibachiServiceDecorator)
	    .service('hibachiInterceptor', hibachiinterceptor_1.HibachiInterceptor.Factory())
	    .service('hibachiScope', hibachiscope_1.HibachiScope)
	    .service('localStorageService', localstorageservice_1.LocalStorageService)
	    .controller('globalSearch', globalsearch_1.GlobalSearchController)
	    .filter('percentage', [percentage_1.PercentageFilter.Factory])
	    .filter('trim', [swtrim_1.SWTrim.Factory])
	    .filter('entityRBKey', ['rbkeyService', entityrbkey_1.EntityRBKey.Factory])
	    .directive('swCollectionConfig', swcollectionconfig_1.SWCollectionConfig.Factory())
	    .directive('swCollectionColumn', swcollectioncolumn_1.SWCollectionColumn.Factory())
	    .directive('swCollectionFilter', swcollectionfilter_1.SWCollectionFilter.Factory())
	    .directive('swTypeaheadSearch', swtypeaheadsearch_1.SWTypeaheadSearch.Factory())
	    .directive('swTypeaheadInputField', swtypeaheadinputfield_1.SWTypeaheadInputField.Factory())
	    .directive('swTypeaheadSearchLineItem', swtypeaheadsearchlineitem_1.SWTypeaheadSearchLineItem.Factory())
	    .directive('swActionCaller', swactioncaller_1.SWActionCaller.Factory())
	    .directive('swActionCallerDropdown', swactioncallerdropdown_1.SWActionCallerDropdown.Factory())
	    .directive('swColumnSorter', swcolumnsorter_1.SWColumnSorter.Factory())
	    .directive('swConfirm', swconfirm_1.SWConfirm.Factory())
	    .directive('swEntityActionBar', swentityactionbar_1.SWEntityActionBar.Factory())
	    .directive('swEntityActionBarButtonGroup', swentityactionbarbuttongroup_1.SWEntityActionBarButtonGroup.Factory())
	    .directive('swExpandableRecord', swexpandablerecord_1.SWExpandableRecord.Factory())
	    .directive('swGravatar', swgravatar_1.SWGravatar.Factory())
	    .directive('swListingDisplay', swlistingdisplay_1.SWListingDisplay.Factory())
	    .directive('swListingControls', swlistingcontrols_1.SWListingControls.Factory())
	    .directive('swListingAggregate', swlistingaggregate_1.SWListingAggregate.Factory())
	    .directive('swListingColorFilter', swlistingcolorfilter_1.SWListingColorFilter.Factory())
	    .directive('swListingColumn', swlistingcolumn_1.SWListingColumn.Factory())
	    .directive('swListingFilter', swlistingfilter_1.SWListingFilter.Factory())
	    .directive('swListingFilterGroup', swlistingfiltergroup_1.SWListingFilterGroup.Factory())
	    .directive('swListingOrderBy', swlistingorderby_1.SWListingOrderBy.Factory())
	    .directive('swLogin', swlogin_1.SWLogin.Factory())
	    .directive('swNumbersOnly', swnumbersonly_1.SWNumbersOnly.Factory())
	    .directive('swLoading', swloading_1.SWLoading.Factory())
	    .directive('swScrollTrigger', swscrolltrigger_1.SWScrollTrigger.Factory())
	    .directive('swRbkey', swrbkey_1.SWRbKey.Factory())
	    .directive('swOptions', swoptions_1.SWOptions.Factory())
	    .directive('swSelection', swselection_1.SWSelection.Factory())
	    .directive('swTooltip', swtooltip_1.SWTooltip.Factory())
	    .directive('swClickOutside', swclickoutside_1.SWClickOutside.Factory())
	    .directive('swDirective', swdirective_1.SWDirective.Factory())
	    .directive('swExportAction', swexportaction_1.SWExportAction.Factory())
	    .directive('swHref', swhref_1.SWHref.Factory())
	    .directive('swProcessCaller', swprocesscaller_1.SWProcessCaller.Factory())
	    .directive('sw:sortable', swsortable_1.SWSortable.Factory())
	    .directive('swListingGlobalSearch', swlistingglobalsearch_1.SWListingGlobalSearch.Factory());
	exports.coremodule = coremodule;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var HibachiInterceptor = (function () {
	    //@ngInject
	    function HibachiInterceptor($location, $q, $log, $injector, localStorageService, alertService, appConfig, dialogService, utilityService, hibachiPathBuilder) {
	        var _this = this;
	        this.$location = $location;
	        this.$q = $q;
	        this.$log = $log;
	        this.$injector = $injector;
	        this.localStorageService = localStorageService;
	        this.alertService = alertService;
	        this.appConfig = appConfig;
	        this.dialogService = dialogService;
	        this.utilityService = utilityService;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.urlParam = null;
	        this.authHeader = 'Authorization';
	        this.authPrefix = 'Bearer ';
	        this.request = function (config) {
	            _this.$log.debug('request');
	            //bypass interceptor rules when checking template cache
	            if (config.url.charAt(0) !== '/') {
	                return config;
	            }
	            if (config.method == 'GET' && config.url.indexOf('.html') > 0 && config.url.indexOf('admin/client/partials') > 0) {
	                //all partials are bound to instantiation key
	                config.url = config.url + '?instantiationKey=' + $.hibachi.getConfig().instantiationKey;
	                return config;
	            }
	            config.cache = true;
	            config.headers = config.headers || {};
	            if (_this.localStorageService.hasItem('token')) {
	                config.headers['Auth-Token'] = 'Bearer ' + _this.localStorageService.getItem('token');
	            }
	            var queryParams = _this.utilityService.getQueryParamsFromUrl(config.url);
	            if (config.method == 'GET' && (queryParams[_this.appConfig.action] && queryParams[_this.appConfig.action] === 'api:main.get')) {
	                _this.$log.debug(config);
	                config.method = 'POST';
	                config.data = {};
	                var data = {};
	                if (angular.isDefined(config.params)) {
	                    data = config.params;
	                }
	                var params = {};
	                params.serializedJsonData = angular.toJson(data);
	                params.context = "GET";
	                config.data = $.param(params);
	                delete config.params;
	                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	            }
	            return config;
	        };
	        this.requestError = function (rejection) {
	            return _this.$q.reject(rejection);
	        };
	        this.response = function (response) {
	            if (response.data.messages) {
	                var alerts = _this.alertService.formatMessagesToAlerts(response.data.messages);
	                _this.alertService.addAlerts(alerts);
	            }
	            return response;
	        };
	        this.responseError = function (rejection) {
	            if (angular.isDefined(rejection.status) && rejection.status !== 404 && rejection.status !== 403 && rejection.status !== 499) {
	                if (rejection.data && rejection.data.messages) {
	                    var alerts = _this.alertService.formatMessagesToAlerts(rejection.data.messages);
	                    _this.alertService.addAlerts(alerts);
	                }
	                else {
	                    var message = {
	                        msg: 'there was error retrieving data',
	                        type: 'error'
	                    };
	                    _this.alertService.addAlert(message);
	                }
	            }
	            if (rejection.status === 499) {
	                // handle the case where the user is not authenticated
	                if (rejection.data && rejection.data.messages) {
	                    //var deferred = $q.defer();
	                    var $http = _this.$injector.get('$http');
	                    if (rejection.data.messages[0].message === 'timeout') {
	                        //open dialog
	                        _this.dialogService.addPageDialog(_this.hibachiPathBuilder.buildPartialsPath('preprocesslogin'), {});
	                    }
	                    else if (rejection.data.messages[0].message === 'invalid_token') {
	                        return $http.get(_this.baseUrl + '/index.cfm/api/auth/login').then(function (loginResponse) {
	                            if (loginResponse.status === 200) {
	                                _this.localStorageService.setItem('token', loginResponse.data.token);
	                                rejection.config.headers = rejection.config.headers || {};
	                                rejection.config.headers['Auth-Token'] = 'Bearer ' + _this.localStorageService.getItem('token');
	                                return $http(rejection.config).then(function (response) {
	                                    return response;
	                                });
	                            }
	                        }, function (rejection) {
	                            return rejection;
	                        });
	                    }
	                }
	            }
	            return rejection;
	        };
	        this.$location = $location;
	        this.$q = $q;
	        this.$log = $log;
	        this.$injector = $injector;
	        this.alertService = alertService;
	        this.appConfig = appConfig;
	        this.baseUrl = appConfig.baseURL;
	        this.dialogService = dialogService;
	        this.utilityService = utilityService;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.localStorageService = localStorageService;
	    }
	    HibachiInterceptor.Factory = function () {
	        var eventHandler = function ($location, $q, $log, $injector, localStorageService, alertService, appConfig, dialogService, utilityService, hibachiPathBuilder) {
	            return new HibachiInterceptor($location, $q, $log, $injector, localStorageService, alertService, appConfig, dialogService, utilityService, hibachiPathBuilder);
	        };
	        eventHandler.$inject = [
	            '$location',
	            '$q',
	            '$log',
	            '$injector',
	            'localStorageService',
	            'alertService',
	            'appConfig',
	            'dialogService',
	            'utilityService',
	            'hibachiPathBuilder'
	        ];
	        return eventHandler;
	    };
	    return HibachiInterceptor;
	})();
	exports.HibachiInterceptor = HibachiInterceptor;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/*services return promises which can be handled uniquely based on success or failure by the controller*/
	var HibachiPathBuilder = (function () {
	    //@ngInject
	    function HibachiPathBuilder() {
	        var _this = this;
	        this.setBaseURL = function (baseURL) {
	            _this.baseURL = baseURL;
	        };
	        this.setBasePartialsPath = function (basePartialsPath) {
	            _this.basePartialsPath = basePartialsPath;
	        };
	        this.buildPartialsPath = function (componentsPath) {
	            if (angular.isDefined(_this.baseURL) && angular.isDefined(_this.basePartialsPath)) {
	                return _this.baseURL + _this.basePartialsPath + componentsPath;
	            }
	            else {
	                throw ('need to define baseURL and basePartialsPath in hibachiPathBuilder. Inject hibachiPathBuilder into module and configure it there');
	            }
	        };
	    }
	    return HibachiPathBuilder;
	})();
	exports.HibachiPathBuilder = HibachiPathBuilder;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var PublicService = (function () {
	    ///index.cfm/api/scope/
	    //@ngInject
	    function PublicService($http, $q, $window) {
	        var _this = this;
	        this.$http = $http;
	        this.$q = $q;
	        this.$window = $window;
	        this.formType = { 'Content-Type': "application/x-www-form-urlencoded" };
	        this.ajaxRequestParam = "?ajaxRequest=1";
	        this.loading = false;
	        this.baseActionPath = "";
	        this.months = [{ name: '01 - JAN', value: 1 }, { name: '02 - FEB', value: 2 }, { name: '03 - MAR', value: 3 }, { name: '04 - APR', value: 4 }, { name: '05 - MAY', value: 5 }, { name: '06 - JUN', value: 6 }, { name: '07 - JUL', value: 7 }, { name: '08 - AUG', value: 8 }, { name: '09 - SEP', value: 9 }, { name: '10 - OCT', value: 10 }, { name: '11 - NOV', value: 11 }, { name: '12 - DEC', value: 12 }];
	        this.years = [];
	        this.shippingAddress = "";
	        this.billingAddress = "";
	        /** grab the valid expiration years for credit cards  */
	        this.getExpirationYears = function () {
	            var baseDate = new Date();
	            var today = baseDate.getFullYear();
	            var start = today;
	            for (var i = 0; i <= 5; i++) {
	                console.log("I:", start + i);
	                _this.years.push(start + i);
	            }
	            console.log("This Years", _this.years);
	        };
	        /** accessors for account */
	        this.getAccount = function () {
	            var urlBase = '/index.cfm/api/scope/getAccount/';
	            return _this.getData(urlBase, "account", "");
	        };
	        /** accessors for cart */
	        this.getCart = function () {
	            var urlBase = '/index.cfm/api/scope/getCart/';
	            return _this.getData(urlBase, "cart", "");
	        };
	        /** accessors for countries */
	        this.getCountries = function () {
	            var urlBase = '/index.cfm/api/scope/getCountries/';
	            return _this.getData(urlBase, "countries", "");
	        };
	        /** accessors for states */
	        this.getStates = function (countryCode) {
	            if (!angular.isDefined(countryCode))
	                countryCode = "US";
	            var urlBase = '/index.cfm/api/scope/getStateCodeOptionsByCountryCode/';
	            return _this.getData(urlBase, "states", "&countryCode=" + countryCode);
	        };
	        /** accessors for states */
	        this.getAddressOptions = function (countryCode) {
	            if (!angular.isDefined(countryCode))
	                countryCode = "US";
	            var urlBase = '/index.cfm/api/scope/getAddressOptionsByCountryCode/';
	            return _this.getData(urlBase, "addressOptions", "&countryCode=" + countryCode);
	        };
	        /** accessors for states */
	        this.getData = function (url, setter, param) {
	            _this.loading = true;
	            var urlBase = url + _this.ajaxRequestParam + param;
	            var deferred = _this.$q.defer();
	            _this.$http.get(urlBase).success(function (result) {
	                //don't need account and cart for anything other than account and cart calls.
	                if (setter.indexOf('account') == -1 || setter.indexOf('cart') == -1) {
	                    if (result['account']) {
	                        delete result['account'];
	                    }
	                    if (result['cart']) {
	                        delete result['cart'];
	                    }
	                    console.log("Result Sans", result);
	                }
	                _this[setter] = result;
	                _this.loading = false;
	                deferred.resolve(result);
	            }).error(function (reason) {
	                _this.loading = false;
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        /** sets the current shipping address */
	        this.setShippingAddress = function (shippingAddress) {
	            _this.shippingAddress = shippingAddress;
	        };
	        /** sets the current shipping address */
	        this.setBillingAddress = function (billingAddress) {
	            _this.billingAddress = billingAddress;
	        };
	        /** this is the generic method used to call all server side actions.
	        *  @param action {string} the name of the action (method) to call in the public service.
	        *  @param data   {object} the params as key value pairs to pass in the post request.
	        *  @return a deferred promise that resolves server response or error. also includes updated account and cart.
	        */
	        this.doAction = function (action, data) {
	            _this.loading = true;
	            var method = "";
	            if (!action) {
	                throw "Action is required exception";
	            }
	            if (action != undefined && data == undefined) {
	                method = "get";
	            }
	            else {
	                method = "post";
	            }
	            //check if the caller is defining a path to hit, otherwise use the public scope.
	            if (action.indexOf("/") !== -1) {
	                _this.baseActionPath = action; //any path
	            }
	            else {
	                _this.baseActionPath = "/index.cfm/api/scope/" + action; //public path
	            }
	            _this.hasErrors = false;
	            _this.success = false;
	            _this.errors = undefined;
	            _this.header = { headers: _this.formType };
	            var deferred = _this.$q.defer();
	            var urlBase = _this.baseActionPath + _this.ajaxRequestParam;
	            if (method == "post") {
	                data.returnJsonObjects = "cart,account";
	                //post
	                var promise = _this.$http.post(urlBase, _this.toFormParams(data), _this.header).then(function (result) {
	                    /** update the account and the cart */
	                    _this.account = result.data.account;
	                    _this.cart = result.data.cart;
	                    //if the action that was called was successful, then success is true.
	                    if (result.data.successfulActions.length) {
	                        _this.success = true;
	                        for (var action in result.data.successfulActions) {
	                            if (result.data.successfulActions[action].indexOf('public:cart.placeOrder') !== -1) {
	                                _this.window.location.href = _this.confirmationUrl;
	                                console.log(_this.window);
	                            }
	                        }
	                    }
	                    if (result.data.failureActions.length) {
	                        _this.hasErrors = true;
	                        console.log("Errors:", result.data.errors);
	                    }
	                    _this.loading = false;
	                    deferred.resolve(result);
	                }).catch(function (response) {
	                    console.log("There was an error making this http call", response.status, response.data);
	                    _this.loading = false;
	                    deferred.reject(response);
	                });
	                return deferred.promise;
	            }
	            else {
	                //get
	                var url = urlBase + "&returnJsonObject=cart,account";
	                var deferred = _this.$q.defer();
	                _this.$http.get(url).success(function (result) {
	                    deferred.resolve(result);
	                }).error(function (reason) {
	                    deferred.reject(reason);
	                });
	                return deferred.promise;
	            }
	        };
	        /** used to turn data into a correct format for the post */
	        this.toFormParams = function (data) {
	            return data = $.param(data) || "";
	        };
	        /**
	         * Helper methods so that everything in account and cart can be accessed using getters.
	         */
	        this.userIsLoggedIn = function () {
	            if (_this.account !== undefined && _this.account.accountID !== '') {
	                return true;
	            }
	            return false;
	        };
	        /**
	         * Helper methods for getting errors from the cart
	         */
	        this.getErrors = function () {
	            if (_this.errors !== undefined) {
	                return _this.errors;
	            }
	            return {};
	        };
	        this.baseActionPath = "/index.cfm/api/scope/"; //default path
	        this.confirmationUrl = "/order-confirmation";
	        this.$http = $http;
	        this.$q = $q;
	        this.getExpirationYears();
	        this.window = $window;
	        console.log("Window: ", $window);
	    }
	    return PublicService;
	})();
	exports.PublicService = PublicService;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/*services return promises which can be handled uniquely based on success or failure by the controller*/
	var baseservice_1 = __webpack_require__(7);
	var UtilityService = (function (_super) {
	    __extends(UtilityService, _super);
	    function UtilityService() {
	        var _this = this;
	        _super.call(this);
	        this.getQueryParamsFromUrl = function (url) {
	            // This function is anonymous, is executed immediately and
	            // the return value is assigned to QueryString!
	            var query_string = {};
	            if (url && url.split) {
	                var spliturl = url.split('?');
	                if (spliturl.length) {
	                    url = spliturl[1];
	                    if (url && url.split) {
	                        var vars = url.split("&");
	                        if (vars && vars.length) {
	                            for (var i = 0; i < vars.length; i++) {
	                                var pair = vars[i].split("=");
	                                // If first entry with this name
	                                if (typeof query_string[pair[0]] === "undefined") {
	                                    query_string[pair[0]] = pair[1];
	                                }
	                                else if (typeof query_string[pair[0]] === "string") {
	                                    var arr = [query_string[pair[0]], pair[1]];
	                                    query_string[pair[0]] = arr;
	                                }
	                                else {
	                                    query_string[pair[0]].push(pair[1]);
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	            return query_string;
	        };
	        this.isAngularRoute = function () {
	            return /[\?&]ng#!/.test(window.location.href);
	        };
	        this.ArrayFindByPropertyValue = function (arr, property, value) {
	            var currentIndex = -1;
	            arr.forEach(function (arrItem, index) {
	                if (arrItem[property] && arrItem[property] === value) {
	                    currentIndex = index;
	                }
	            });
	            return currentIndex;
	        };
	        this.listLast = function (list, delimiter) {
	            if (list === void 0) { list = ''; }
	            if (delimiter === void 0) { delimiter = ','; }
	            var listArray = list.split(delimiter);
	            return listArray[listArray.length - 1];
	        };
	        this.listRest = function (list, delimiter) {
	            if (list === void 0) { list = ''; }
	            if (delimiter === void 0) { delimiter = ","; }
	            var listArray = list.split(delimiter);
	            if (listArray.length) {
	                listArray.splice(0, 1);
	            }
	            return listArray.join(delimiter);
	        };
	        this.listFirst = function (list, delimiter) {
	            if (list === void 0) { list = ''; }
	            if (delimiter === void 0) { delimiter = ','; }
	            var listArray = list.split(delimiter);
	            return listArray[0];
	        };
	        this.listPrepend = function (list, substring, delimiter) {
	            if (list === void 0) { list = ''; }
	            if (delimiter === void 0) { delimiter = ','; }
	            var listArray = list.split(delimiter);
	            if (listArray.length) {
	                return substring + delimiter + list;
	            }
	            else {
	                return substring;
	            }
	        };
	        this.listAppend = function (list, substring, delimiter) {
	            if (list === void 0) { list = ''; }
	            if (delimiter === void 0) { delimiter = ','; }
	            var listArray = list.split(delimiter);
	            if (listArray.length) {
	                return list + delimiter + substring;
	            }
	            else {
	                return substring;
	            }
	        };
	        this.formatValue = function (value, formatType, formatDetails, entityInstance) {
	            if (angular.isUndefined(formatDetails)) {
	                formatDetails = {};
	            }
	            var typeList = ["currency", "date", "datetime", "pixels", "percentage", "second", "time", "truefalse", "url", "weight", "yesno"];
	            if (typeList.indexOf(formatType)) {
	                _this['format_' + formatType](value, formatDetails, entityInstance);
	            }
	            return value;
	        };
	        this.format_currency = function (value, formatDetails, entityInstance) {
	            if (angular.isUndefined) {
	                formatDetails = {};
	            }
	        };
	        this.format_date = function (value, formatDetails, entityInstance) {
	            if (angular.isUndefined) {
	                formatDetails = {};
	            }
	        };
	        this.format_datetime = function (value, formatDetails, entityInstance) {
	            if (angular.isUndefined) {
	                formatDetails = {};
	            }
	        };
	        this.format_pixels = function (value, formatDetails, entityInstance) {
	            if (angular.isUndefined) {
	                formatDetails = {};
	            }
	        };
	        this.format_yesno = function (value, formatDetails, entityInstance) {
	            if (angular.isUndefined) {
	                formatDetails = {};
	            }
	            if (Boolean(value) === true) {
	                return entityInstance.metaData.$$getRBKey("define.yes");
	            }
	            else if (value === false || value.trim() === 'No' || value.trim === 'NO' || value.trim() === '0') {
	                return entityInstance.metaData.$$getRBKey("define.no");
	            }
	        };
	        this.left = function (stringItem, count) {
	            return stringItem.substring(0, count);
	        };
	        this.right = function (stringItem, count) {
	            return stringItem.substring(stringItem.length - count, stringItem.length);
	        };
	        //this.utilityService.mid(propertyIdentifier,1,propertyIdentifier.lastIndexOf('.'));
	        this.mid = function (stringItem, start, count) {
	            var end = start + count;
	            return stringItem.substring(start, end);
	        };
	        this.getPropertiesFromString = function (stringItem) {
	            if (!stringItem)
	                return;
	            var capture = false;
	            var property = '';
	            var results = [];
	            for (var i = 0; i < stringItem.length; i++) {
	                if (!capture && stringItem.substr(i, 2) == "${") {
	                    property = '';
	                    capture = true;
	                    i = i + 1; //skip the ${
	                }
	                else if (capture && stringItem[i] != '}') {
	                    property = property.concat(stringItem[i]);
	                }
	                else if (capture) {
	                    results.push(property);
	                    capture = false;
	                }
	            }
	            return results;
	        };
	        this.replacePropertiesWithData = function (stringItem, data) {
	            var results = _this.getPropertiesFromString(stringItem);
	            for (var i = 0; i < results.length; i++) {
	                stringItem = stringItem.replace('${' + results[i] + '}', data[i]);
	            }
	            return stringItem;
	        };
	        this.replaceAll = function (stringItem, find, replace) {
	            return stringItem.replace(new RegExp(_this.escapeRegExp(find), 'g'), replace);
	        };
	        this.escapeRegExp = function (stringItem) {
	            return stringItem.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	        };
	        this.createID = function (count) {
	            var count = count || 26;
	            var text = "";
	            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	            for (var i = 0; i < count; i++)
	                text += possible.charAt(Math.floor(Math.random() * possible.length));
	            return text;
	        };
	        //list functions
	        this.arrayToList = function (array, delimiter) {
	            if (delimiter != null) {
	                return array.join(delimiter);
	            }
	            else {
	                return array.join();
	            }
	        };
	        this.isDescendantElement = function (parent, child) {
	            var node = child.parentNode;
	            while (node != null) {
	                if (node == parent) {
	                    return true;
	                }
	                node = node.parentNode;
	            }
	            return false;
	        };
	        this.listFind = function (list, value, delimiter) {
	            if (list === void 0) { list = ''; }
	            if (delimiter === void 0) { delimiter = ','; }
	            var splitString = list.split(delimiter);
	            var stringFound = -1;
	            for (var i = 0; i < splitString.length; i++) {
	                var stringPart = splitString[i];
	                if (stringPart === value) {
	                    stringFound = i;
	                }
	            }
	            return stringFound;
	        };
	        this.listLen = function (list, delimiter) {
	            if (list === void 0) { list = ''; }
	            if (delimiter === void 0) { delimiter = ','; }
	            var splitString = list.split(delimiter);
	            return splitString.length;
	        };
	        //This will enable you to sort by two separate keys in the order they are passed in
	        this.arraySorter = function (array, keysToSortBy) {
	            var arrayOfTypes = [], returnArray = [], firstKey = keysToSortBy[0];
	            if (angular.isDefined(keysToSortBy[1])) {
	                var secondKey = keysToSortBy[1];
	            }
	            for (var itemIndex in array) {
	                if (!(arrayOfTypes.indexOf(array[itemIndex][firstKey]) > -1)) {
	                    arrayOfTypes.push(array[itemIndex][firstKey]);
	                }
	            }
	            arrayOfTypes.sort(function (a, b) {
	                if (a < b) {
	                    return -1;
	                }
	                else if (a > b) {
	                    return 1;
	                }
	                else {
	                    return 0;
	                }
	            });
	            for (var typeIndex in arrayOfTypes) {
	                var tempArray = [];
	                for (var itemIndex in array) {
	                    if (array[itemIndex][firstKey] == arrayOfTypes[typeIndex]) {
	                        tempArray.push(array[itemIndex]);
	                    }
	                }
	                if (keysToSortBy[1] != null) {
	                    tempArray.sort(function (a, b) {
	                        if (a[secondKey] < b[secondKey]) {
	                            return -1;
	                        }
	                        else if (a[secondKey] > b[secondKey]) {
	                            return 1;
	                        }
	                        else {
	                            return 0;
	                        }
	                    });
	                }
	                for (var finalIndex in tempArray) {
	                    returnArray.push(tempArray[finalIndex]);
	                }
	            }
	            return returnArray;
	        };
	        this.minutesOfDay = function (m) {
	            return m.getMinutes() + m.getHours() * 60;
	        };
	    }
	    return UtilityService;
	})(baseservice_1.BaseService);
	exports.UtilityService = UtilityService;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var BaseService = (function () {
	    function BaseService() {
	    }
	    return BaseService;
	})();
	exports.BaseService = BaseService;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/*services return promises which can be handled uniquely based on success or failure by the controller*/
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var baseservice_1 = __webpack_require__(7);
	var SelectionService = (function (_super) {
	    __extends(SelectionService, _super);
	    //@ngInject
	    function SelectionService(observerService) {
	        var _this = this;
	        _super.call(this);
	        this.observerService = observerService;
	        this._selection = {};
	        /* add current selectionid to main selection object*/
	        this.createSelections = function (selectionid) {
	            _this._selection[selectionid] = {
	                allSelected: false,
	                ids: []
	            };
	        };
	        this.radioSelection = function (selectionid, selection) {
	            _this.createSelections(selectionid);
	            _this._selection[selectionid].ids.push(selection);
	            _this.observerService.notify('swSelectionToggleSelection', { action: 'check', selectionid: selectionid, selection: selection });
	        };
	        this.addSelection = function (selectionid, selection) {
	            /*if allSelected flag is true addSelection will remove selection*/
	            if (_this.isAllSelected(selectionid)) {
	                var index = _this._selection[selectionid].ids.indexOf(selection);
	                if (index > -1) {
	                    _this._selection[selectionid].ids.splice(index, 1);
	                    _this.observerService.notify('swSelectionToggleSelection', { action: 'check', selectionid: selectionid, selection: selection });
	                }
	            }
	            else if (!_this.hasSelection(selectionid, selection)) {
	                _this._selection[selectionid].ids.push(selection);
	                _this.observerService.notify('swSelectionToggleSelection', { action: 'check', selectionid: selectionid, selection: selection });
	            }
	            console.info(_this._selection[selectionid]);
	        };
	        this.setSelection = function (selectionid, selections) {
	            if (angular.isUndefined(_this._selection[selectionid])) {
	                _this.createSelections(selectionid);
	            }
	            _this._selection[selectionid].ids = selections;
	        };
	        this.removeSelection = function (selectionid, selection) {
	            if (angular.isUndefined(_this._selection[selectionid])) {
	                return;
	            }
	            if (!_this.isAllSelected(selectionid)) {
	                var index = _this._selection[selectionid].ids.indexOf(selection);
	                if (index > -1) {
	                    _this._selection[selectionid].ids.splice(index, 1);
	                    _this.observerService.notify('swSelectionToggleSelection', { action: 'uncheck', selectionid: selectionid, selection: selection });
	                }
	            }
	            else if (!_this.hasSelection(selectionid, selection)) {
	                _this._selection[selectionid].ids.push(selection);
	                _this.observerService.notify('swSelectionToggleSelection', { action: 'uncheck', selectionid: selectionid, selection: selection });
	            }
	            console.info(_this._selection[selectionid]);
	        };
	        this.hasSelection = function (selectionid, selection) {
	            if (angular.isUndefined(_this._selection[selectionid])) {
	                return false;
	            }
	            return _this._selection[selectionid].ids.indexOf(selection) > -1;
	        };
	        this.getSelections = function (selectionid) {
	            if (angular.isUndefined(_this._selection[selectionid])) {
	                _this.createSelections(selectionid);
	            }
	            return _this._selection[selectionid].ids;
	        };
	        this.getSelectionCount = function (selectionid) {
	            if (angular.isUndefined(_this._selection[selectionid])) {
	                _this.createSelections(selectionid);
	            }
	            return _this._selection[selectionid].ids.length;
	        };
	        this.clearSelection = function (selectionid) {
	            _this.createSelections(selectionid);
	            _this.observerService.notify('swSelectionToggleSelection', { action: 'clear' });
	            console.info(_this._selection[selectionid]);
	        };
	        this.selectAll = function (selectionid) {
	            _this._selection[selectionid] = {
	                allSelected: true,
	                ids: []
	            };
	            _this.observerService.notify('swSelectionToggleSelection', { action: 'selectAll' });
	            console.info(_this._selection[selectionid]);
	        };
	        this.isAllSelected = function (selectionid) {
	            if (angular.isUndefined(_this._selection[selectionid])) {
	                _this.createSelections(selectionid);
	            }
	            return _this._selection[selectionid].allSelected;
	        };
	    }
	    return SelectionService;
	})(baseservice_1.BaseService);
	exports.SelectionService = SelectionService;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * @ngdoc service
	 * @name sdt.models:ObserverService
	 * @description
	 * # ObserverService
	 * Manages all events inside the application
	 *
	 */
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var baseservice_1 = __webpack_require__(7);
	var ObserverService = (function (_super) {
	    __extends(ObserverService, _super);
	    //@ngInject
	    function ObserverService(utilityService) {
	        var _this = this;
	        /**
	         * @ngdoc property
	         * @name ObserverService#observers
	         * @propertyOf sdt.models:ObserverService
	         * @description object to store all observers in
	         * @returns {object} object
	         */
	        _super.call(this);
	        this.utilityService = utilityService;
	        /* Declare methods */
	        /**
	         * @ngdoc method
	         * @name ObserverService#attach
	         * @methodOf sdt.models:ObserverService
	         * @param {function} callback the callback function to fire
	         * @param {string} event name of the event
	         * @param {string} id unique id for the object that is listening i.e. namespace
	         * @description adds events listeners
	         */
	        this.attach = function (callback, event, id) {
	            console.log('event attached:' + event);
	            if (!id) {
	                id = _this.utilityService.createID();
	            }
	            if (!_this.observers[event]) {
	                _this.observers[event] = {};
	            }
	            if (!_this.observers[event][id])
	                _this.observers[event][id] = [];
	            _this.observers[event][id].push(callback);
	        };
	        /**
	         * @ngdoc method
	         * @name ObserverService#detachById
	         * @methodOf sdt.models:ObserverService
	         * @param {string} id unique id for the object that is listening i.e. namespace
	         * @description removes all events for a specific id from the observers object
	         */
	        this.detachById = function (id) {
	            for (var event in _this.observers) {
	                _this.detachByEventAndId(event, id);
	            }
	        };
	        /**
	         * @ngdoc method
	         * @name ObserverService#detachById
	         * @methodOf sdt.models:ObserverService
	         * @param {string} event name of the event
	         * @description removes removes all the event from the observer object
	         */
	        this.detachByEvent = function (event) {
	            if (event in _this.observers) {
	                delete _this.observers[event];
	            }
	        };
	        /**
	         * @ngdoc method
	         * @name ObserverService#detachByEventAndId
	         * @methodOf sdt.models:ObserverService
	         * @param {string} event name of the event
	         * @param {string} id unique id for the object that is listening i.e. namespace
	         * @description removes removes all callbacks for an id in a specific event from the observer object
	         */
	        this.detachByEventAndId = function (event, id) {
	            if (event in _this.observers) {
	                if (id in _this.observers[event]) {
	                    delete _this.observers[event][id];
	                }
	            }
	        };
	        /**
	         * @ngdoc method
	         * @name ObserverService#notify
	         * @methodOf sdt.models:ObserverService
	         * @param {string} event name of the event
	         * @param {string|object|array|number} parameters pass whatever your listener is expecting
	         * @description notifies all observers of a specific event
	         */
	        this.notify = function (event, parameters) {
	            console.log('event called:' + event);
	            for (var id in _this.observers[event]) {
	                angular.forEach(_this.observers[event][id], function (callback) {
	                    callback(parameters);
	                });
	            }
	        };
	        this.notifyById = function (event, eventId, parameters) {
	            console.log('event called:' + event);
	            for (var id in _this.observers[event]) {
	                if (id != eventId)
	                    continue;
	                angular.forEach(_this.observers[event][id], function (callback) {
	                    callback(parameters);
	                });
	            }
	        };
	        this.observers = {};
	    }
	    return ObserverService;
	})(baseservice_1.BaseService);
	exports.ObserverService = ObserverService;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var Form = (function () {
	    //@ngInject
	    function Form(name, object, editing) {
	        this.$addControl = function (control) { };
	        this.$removeControl = function (control) { };
	        this.$setValidity = function (validationErrorKey, isValid, control) { };
	        this.$setDirty = function () { };
	        this.$setPristine = function () { };
	        this.$commitViewValue = function () { };
	        this.$rollbackViewValue = function () { };
	        this.$setSubmitted = function () { };
	        this.$setUntouched = function () { };
	        this.name = name;
	        this.object = object;
	        this.editing = editing;
	    }
	    return Form;
	})();
	var FormService = (function () {
	    function FormService($log) {
	        var _this = this;
	        this.$log = $log;
	        this.setPristinePropertyValue = function (property, value) {
	            _this._pristinePropertyValue[property] = value;
	        };
	        this.getPristinePropertyValue = function (property) {
	            return _this._pristinePropertyValue[property];
	        };
	        this.setForm = function (form) {
	            _this._forms[form.name] = form;
	        };
	        this.getForm = function (formName) {
	            return _this._forms[formName];
	        };
	        this.getForms = function () {
	            return _this._forms;
	        };
	        this.getFormsByObjectName = function (objectName) {
	            var forms = [];
	            for (var f in _this._forms) {
	                if (angular.isDefined(_this._forms[f].$$swFormInfo.object) && _this._forms[f].$$swFormInfo.object.metaData.className === objectName) {
	                    forms.push(_this._forms[f]);
	                }
	            }
	            return forms;
	        };
	        this.createForm = function (name, object, editing) {
	            var _form = new Form(name, object, editing);
	            _this.setForm(_form);
	            return _form;
	        };
	        this.resetForm = function (form) {
	            _this.$log.debug('resetting form');
	            _this.$log.debug(form);
	            for (var key in form) {
	                if (angular.isDefined(form[key])
	                    && typeof form[key].$setViewValue == 'function'
	                    && angular.isDefined(form[key].$viewValue)) {
	                    _this.$log.debug(form[key]);
	                    if (angular.isDefined(_this.getPristinePropertyValue(key))) {
	                        form[key].$setViewValue(_this.getPristinePropertyValue(key));
	                    }
	                    else {
	                        form[key].$setViewValue('');
	                    }
	                    form[key].$setUntouched(true);
	                    form[key].$render();
	                    _this.$log.debug(form[key]);
	                }
	            }
	            form.$submitted = false;
	            form.$setPristine();
	            form.$setUntouched();
	        };
	        this.$log = $log;
	        this._forms = {};
	        this._pristinePropertyValue = {};
	    }
	    FormService.$inject = ['$log'];
	    return FormService;
	})();
	exports.FormService = FormService;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var ExpandableService = (function () {
	    function ExpandableService() {
	        var _this = this;
	        this.recordStates = {};
	        this.addRecord = function (recordID, state) {
	            if (angular.isUndefined(state)) {
	                state = { isLoaded: true };
	            }
	            _this.recordStates[recordID] = state;
	        };
	        this.updateState = function (recordID, state) {
	            _this.recordStates[recordID] = state;
	        };
	        this.getState = function (recordID, key) {
	            if (angular.isDefined(_this.recordStates[recordID]) && angular.isDefined(key)) {
	                var dataToReturn = _this.recordStates[recordID][key];
	            }
	            else {
	                var dataToReturn = _this.recordStates[recordID];
	            }
	            if (angular.isDefined(dataToReturn)) {
	                return dataToReturn;
	            }
	            return false;
	        };
	    }
	    return ExpandableService;
	})();
	exports.ExpandableService = ExpandableService;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var MetaDataService = (function () {
	    //@ngInject
	    function MetaDataService($filter, $log) {
	        var _this = this;
	        this.$filter = $filter;
	        this.$log = $log;
	        this.getPropertiesList = function () {
	            return _this._propertiesList;
	        };
	        this.getPropertiesListByBaseEntityAlias = function (baseEntityAlias) {
	            return _this._propertiesList[baseEntityAlias];
	        };
	        this.setPropertiesList = function (value, key) {
	            _this._propertiesList[key] = value;
	        };
	        this.formatPropertiesList = function (propertiesList, propertyIdentifier) {
	            var simpleGroup = {
	                $$group: 'simple',
	            };
	            propertiesList.data.push(simpleGroup);
	            var drillDownGroup = {
	                $$group: 'drilldown',
	            };
	            propertiesList.data.push(drillDownGroup);
	            var compareCollections = {
	                $$group: 'compareCollections',
	            };
	            propertiesList.data.push(compareCollections);
	            var attributeCollections = {
	                $$group: 'attribute',
	            };
	            propertiesList.data.push(attributeCollections);
	            for (var i in propertiesList.data) {
	                if (angular.isDefined(propertiesList.data[i].ormtype)) {
	                    if (angular.isDefined(propertiesList.data[i].attributeID)) {
	                        propertiesList.data[i].$$group = 'attribute';
	                    }
	                    else {
	                        propertiesList.data[i].$$group = 'simple';
	                    }
	                }
	                if (angular.isDefined(propertiesList.data[i].fieldtype)) {
	                    if (propertiesList.data[i].fieldtype === 'id') {
	                        propertiesList.data[i].$$group = 'simple';
	                    }
	                    if (propertiesList.data[i].fieldtype === 'many-to-one') {
	                        propertiesList.data[i].$$group = 'drilldown';
	                    }
	                    if (propertiesList.data[i].fieldtype === 'many-to-many' || propertiesList.data[i].fieldtype === 'one-to-many') {
	                        propertiesList.data[i].$$group = 'compareCollections';
	                    }
	                }
	                propertiesList.data[i].propertyIdentifier = propertyIdentifier + '.' + propertiesList.data[i].name;
	            }
	            //propertiesList.data = _orderBy(propertiesList.data,['displayPropertyIdentifier'],false);
	            //--------------------------------Removes empty lines from dropdown.
	            var temp = [];
	            for (var i_1 = 0; i_1 <= propertiesList.data.length - 1; i_1++) {
	                if (propertiesList.data[i_1].propertyIdentifier.indexOf(".undefined") != -1) {
	                    _this.$log.debug("removing: " + propertiesList.data[i_1].displayPropertyIdentifier);
	                    propertiesList.data[i_1].displayPropertyIdentifier = "hide";
	                }
	                else {
	                    temp.push(propertiesList.data[i_1]);
	                    _this.$log.debug(propertiesList.data[i_1]);
	                }
	            }
	            temp.sort;
	            propertiesList.data = temp;
	            _this.$log.debug("----------------------PropertyList\n\n\n\n\n");
	            propertiesList.data = _this._orderBy(propertiesList.data, ['propertyIdentifier'], false);
	            //--------------------------------End remove empty lines.
	        };
	        this.orderBy = function (propertiesList, predicate, reverse) {
	            return _this._orderBy(propertiesList, predicate, reverse);
	        };
	        this.$filter = $filter;
	        this.$log = $log;
	        this._propertiesList = {};
	        this._orderBy = $filter('orderBy');
	    }
	    MetaDataService.$inject = [
	        '$filter',
	        '$log'
	    ];
	    return MetaDataService;
	})();
	exports.MetaDataService = MetaDataService;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var RbKeyService = (function () {
	    //@ngInject
	    function RbKeyService($http, $q, appConfig, resourceBundles) {
	        var _this = this;
	        this.$http = $http;
	        this.$q = $q;
	        this.appConfig = appConfig;
	        this.resourceBundles = resourceBundles;
	        this._resourceBundle = {};
	        this._resourceBundleLastModified = '';
	        this._loadingResourceBundle = false;
	        this._loadedResourceBundle = false;
	        this.getRBLoaded = function () {
	            return _this._loadedResourceBundle;
	        };
	        this.rbKey = function (key, replaceStringData) {
	            ////$log.debug('rbkey');
	            ////$log.debug(key);
	            ////$log.debug(this.getConfig().rbLocale);
	            var keyValue = _this.getRBKey(key, _this.appConfig.rbLocale);
	            ////$log.debug(keyValue);
	            return keyValue;
	        };
	        this.getRBKey = function (key, locale, checkedKeys, originalKey) {
	            ////$log.debug('getRBKey');
	            ////$log.debug('loading:'+this._loadingResourceBundle);
	            ////$log.debug('loaded'+this._loadedResourceBundle);
	            if (_this.resourceBundles) {
	                key = key.toLowerCase();
	                checkedKeys = checkedKeys || "";
	                locale = locale || 'en_us';
	                ////$log.debug('locale');
	                ////$log.debug(locale);
	                var keyListArray = key.split(',');
	                ////$log.debug('keylistAray');
	                ////$log.debug(keyListArray);
	                if (keyListArray.length > 1) {
	                    var keyValue = "";
	                    for (var i = 0; i < keyListArray.length; i++) {
	                        keyValue = _this.getRBKey(keyListArray[i], locale, keyValue);
	                        //$log.debug('keyvalue:'+keyValue);
	                        if (keyValue.slice(-8) != "_missing") {
	                            break;
	                        }
	                    }
	                    return keyValue;
	                }
	                var bundle = _this.resourceBundles[locale];
	                if (angular.isDefined(bundle[key])) {
	                    //$log.debug('rbkeyfound:'+bundle[key]);
	                    return bundle[key];
	                }
	                var checkedKeysListArray = checkedKeys.split(',');
	                checkedKeysListArray.push(key + '_' + locale + '_missing');
	                checkedKeys = checkedKeysListArray.join(",");
	                if (angular.isUndefined(originalKey)) {
	                    originalKey = key;
	                }
	                //$log.debug('originalKey:'+key);
	                //$log.debug(checkedKeysListArray);
	                var localeListArray = locale.split('_');
	                //$log.debug(localeListArray);
	                if (localeListArray.length === 2) {
	                    bundle = _this.resourceBundles[localeListArray[0]];
	                    if (angular.isDefined(bundle[key])) {
	                        //$log.debug('rbkey found:'+bundle[key]);
	                        return bundle[key];
	                    }
	                    checkedKeysListArray.push(key + '_' + localeListArray[0] + '_missing');
	                    checkedKeys = checkedKeysListArray.join(",");
	                }
	                var keyDotListArray = key.split('.');
	                if (keyDotListArray.length >= 3
	                    && keyDotListArray[keyDotListArray.length - 2] === 'define') {
	                    var newKey = key.replace(keyDotListArray[keyDotListArray.length - 3] + '.define', 'define');
	                    //$log.debug('newkey1:'+newKey);
	                    return _this.getRBKey(newKey, locale, checkedKeys, originalKey);
	                }
	                else if (keyDotListArray.length >= 2 && keyDotListArray[keyDotListArray.length - 2] !== 'define') {
	                    var newKey = key.replace(keyDotListArray[keyDotListArray.length - 2] + '.', 'define.');
	                    //$log.debug('newkey:'+newKey);
	                    return _this.getRBKey(newKey, locale, checkedKeys, originalKey);
	                }
	                //$log.debug(localeListArray);
	                if (localeListArray[0] !== "en") {
	                    return _this.getRBKey(originalKey, 'en', checkedKeys);
	                }
	                return checkedKeys;
	            }
	            return '';
	        };
	        this.$q = $q;
	        this.$http = $http;
	        this.appConfig = appConfig;
	        this.resourceBundles = resourceBundles;
	    }
	    return RbKeyService;
	})();
	exports.RbKeyService = RbKeyService;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	// interface ISlatwallRootScopeService extends ng.IRootScopeService{
	//     loadedResourceBundle:boolean;
	// 	loadingResourceBundle:boolean;
	// }
	var HibachiService = (function () {
	    //@ngInject
	    function HibachiService($window, $q, $http, $timeout, $log, $rootScope, $location, $anchorScroll, utilityService, formService, rbkeyService, appConfig, _config, _jsEntities, _jsEntityInstances) {
	        var _this = this;
	        this.$window = $window;
	        this.$q = $q;
	        this.$http = $http;
	        this.$timeout = $timeout;
	        this.$log = $log;
	        this.$rootScope = $rootScope;
	        this.$location = $location;
	        this.$anchorScroll = $anchorScroll;
	        this.utilityService = utilityService;
	        this.formService = formService;
	        this.rbkeyService = rbkeyService;
	        this.appConfig = appConfig;
	        this._config = _config;
	        this._jsEntities = _jsEntities;
	        this._jsEntityInstances = _jsEntityInstances;
	        this._deferred = {};
	        this._resourceBundle = {};
	        this.buildUrl = function (action, queryString) {
	            //actionName example: slatAction. defined in FW1 and populated to config
	            var actionName = _this.appConfig.action;
	            var baseUrl = _this.appConfig.baseURL;
	            queryString = queryString || '';
	            if (angular.isDefined(queryString) && queryString.length) {
	                if (queryString.indexOf('&') !== 0) {
	                    queryString = '&' + queryString;
	                }
	            }
	            return baseUrl + '?' + actionName + '=' + action + queryString;
	        };
	        this.getUrlWithActionPrefix = function () {
	            return _this.appConfig.baseURL + '/index.cfm/?' + _this.appConfig.action + "=";
	        };
	        this.getJsEntities = function () {
	            return _this._jsEntities;
	        };
	        this.setJsEntities = function (jsEntities) {
	            _this._jsEntities = jsEntities;
	        };
	        this.getJsEntityInstances = function () {
	            return _this._jsEntityInstances;
	        };
	        this.setJsEntityInstances = function (jsEntityInstances) {
	            _this._jsEntityInstances = jsEntityInstances;
	        };
	        this.getEntityExample = function (entityName) {
	            return _this._jsEntityInstances[entityName];
	        };
	        this.getEntityMetaData = function (entityName) {
	            return _this._jsEntityInstances[entityName].metaData;
	        };
	        this.getPropertyByEntityNameAndPropertyName = function (entityName, propertyName) {
	            return _this.getEntityMetaData(entityName)[propertyName];
	        };
	        this.getPrimaryIDPropertyNameByEntityName = function (entityName) {
	            return _this.getEntityMetaData(entityName).$$getIDName();
	        };
	        this.getEntityHasPropertyByEntityName = function (entityName, propertyName) {
	            return angular.isDefined(_this.getEntityMetaData(entityName)[propertyName]);
	        };
	        this.getPropertyIsObjectByEntityNameAndPropertyIdentifier = function (entityName, propertyIdentifier) {
	            var lastEntity = _this.getLastEntityNameInPropertyIdentifier(entityName, propertyIdentifier);
	            var entityMetaData = _this.getEntityMetaData(lastEntity);
	            return angular.isDefined(entityMetaData[_this.utilityService.listLast(propertyIdentifier, '.')].cfc);
	        };
	        this.getLastEntityNameInPropertyIdentifier = function (entityName, propertyIdentifier) {
	            if (!entityName) {
	                throw ('No entity name was supplied to getLastEntityNameInPropertyIdentifier in hibachi service.');
	            }
	            //strip alias if it exists
	            if (propertyIdentifier.charAt(0) === '_') {
	                propertyIdentifier = _this.utilityService.listRest(propertyIdentifier, '.');
	            }
	            if (propertyIdentifier.split('.').length > 1) {
	                var propertiesStruct = _this.getEntityMetaData(entityName);
	                if (!propertiesStruct[_this.utilityService.listFirst(propertyIdentifier, '.')]
	                    || !propertiesStruct[_this.utilityService.listFirst(propertyIdentifier, '.')].cfc) {
	                    throw ("The Property Identifier " + propertyIdentifier + " is invalid for the entity " + entityName);
	                }
	                var currentEntityName = _this.utilityService.listLast(propertiesStruct[_this.utilityService.listFirst(propertyIdentifier, '.')].cfc, '.');
	                var currentPropertyIdentifier = _this.utilityService.right(propertyIdentifier, propertyIdentifier.length - (_this.utilityService.listFirst(propertyIdentifier, '.').length + 1));
	                return _this.getLastEntityNameInPropertyIdentifier(currentEntityName, currentPropertyIdentifier);
	            }
	            return entityName;
	        };
	        //service method used to transform collection data to collection objects based on a collectionconfig
	        this.populateCollection = function (collectionData, collectionConfig) {
	            //create array to hold objects
	            var entities = [];
	            //loop over all collection data to create objects
	            var hibachiService = _this;
	            angular.forEach(collectionData, function (collectionItemData, key) {
	                //create base Entity
	                var entity = hibachiService['new' + collectionConfig.baseEntityName.replace('Slatwall', '')]();
	                //populate entity with data based on the collectionConfig
	                angular.forEach(collectionConfig.columns, function (column, key) {
	                    //get objects base properties
	                    var propertyIdentifier = column.propertyIdentifier.replace(collectionConfig.baseEntityAlias.toLowerCase() + '.', '');
	                    var propertyIdentifierArray = propertyIdentifier.split('.');
	                    var propertyIdentifierKey = propertyIdentifier.replace(/\./g, '_');
	                    var currentEntity = entity;
	                    angular.forEach(propertyIdentifierArray, function (property, key) {
	                        if (key === propertyIdentifierArray.length - 1) {
	                            //if we are on the last item in the array
	                            if (angular.isObject(collectionItemData[propertyIdentifierKey]) && currentEntity.metaData[property].fieldtype === 'many-to-one') {
	                                var relatedEntity = hibachiService['new' + currentEntity.metaData[property].cfc]();
	                                relatedEntity.$$init(collectionItemData[propertyIdentifierKey][0]);
	                                currentEntity['$$set' + currentEntity.metaData[property].name.charAt(0).toUpperCase() + currentEntity.metaData[property].name.slice(1)](relatedEntity);
	                            }
	                            else if (angular.isArray(collectionItemData[propertyIdentifierKey]) && (currentEntity.metaData[property].fieldtype === 'one-to-many')) {
	                                angular.forEach(collectionItemData[propertyIdentifierKey], function (arrayItem, key) {
	                                    var relatedEntity = hibachiService['new' + currentEntity.metaData[property].cfc]();
	                                    relatedEntity.$$init(arrayItem);
	                                    currentEntity['$$add' + currentEntity.metaData[property].singularname.charAt(0).toUpperCase() + currentEntity.metaData[property].singularname.slice(1)](relatedEntity);
	                                });
	                            }
	                            else {
	                                currentEntity.data[property] = collectionItemData[propertyIdentifierKey];
	                            }
	                        }
	                        else {
	                            var propertyMetaData = currentEntity.metaData[property];
	                            if (angular.isUndefined(currentEntity.data[property])) {
	                                if (propertyMetaData.fieldtype === 'one-to-many') {
	                                    relatedEntity = [];
	                                }
	                                else {
	                                    relatedEntity = hibachiService['new' + propertyMetaData.cfc]();
	                                }
	                            }
	                            else {
	                                relatedEntity = currentEntity.data[property];
	                            }
	                            currentEntity['$$set' + propertyMetaData.name.charAt(0).toUpperCase() + propertyMetaData.name.slice(1)](relatedEntity);
	                            currentEntity = relatedEntity;
	                        }
	                    });
	                });
	                entities.push(entity);
	            });
	            return entities;
	        };
	        /*basic entity getter where id is optional, returns a promise*/
	        this.getDefer = function (deferKey) {
	            return _this._deferred[deferKey];
	        };
	        this.cancelPromise = function (deferKey) {
	            var deferred = _this.getDefer(deferKey);
	            if (angular.isDefined(deferred)) {
	                deferred.resolve({ messages: [{ messageType: 'error', message: 'User Cancelled' }] });
	            }
	        };
	        this.newEntity = function (entityName) {
	            return new _this._jsEntities[entityName];
	        };
	        /*basic entity getter where id is optional, returns a promise*/
	        this.getEntity = function (entityName, options) {
	            /*
	                *
	                * getEntity('Product', '12345-12345-12345-12345');
	                * getEntity('Product', {keywords='Hello'});
	                *
	                */
	            if (angular.isUndefined(options)) {
	                options = {};
	            }
	            if (angular.isDefined(options.deferKey)) {
	                _this.cancelPromise(options.deferKey);
	            }
	            var params = {};
	            if (typeof options === 'string') {
	                var urlString = _this.getUrlWithActionPrefix() + 'api:main.get&entityName=' + entityName + '&entityID=' + options;
	            }
	            else {
	                params['P:Current'] = options.currentPage || 1;
	                params['P:Show'] = options.pageShow || 10;
	                params.keywords = options.keywords || '';
	                params.columnsConfig = options.columnsConfig || '';
	                params.filterGroupsConfig = options.filterGroupsConfig || '';
	                params.joinsConfig = options.joinsConfig || '';
	                params.orderByConfig = options.orderByConfig || '';
	                params.groupBysConfig = options.groupBysConfig || '';
	                params.isDistinct = options.isDistinct || false;
	                params.propertyIdentifiersList = options.propertyIdentifiersList || '';
	                params.allRecords = options.allRecords || '';
	                params.defaultColumns = options.defaultColumns || true;
	                params.processContext = options.processContext || '';
	                console.log(_this.appConfig);
	                console.log(_this.appConfig);
	                var urlString = _this.getUrlWithActionPrefix() + 'api:main.get&entityName=' + entityName;
	            }
	            var deferred = _this.$q.defer();
	            if (angular.isDefined(options.id)) {
	                urlString += '&entityId=' + options.id;
	            }
	            /*var transformRequest = (data) => {
	    
	                return data;
	            };
	            //check if we are using a service to transform the request
	            if(angular.isDefined(options.transformRequest)) => {
	                transformRequest=options.transformRequest;
	            }*/
	            var transformResponse = function (data) {
	                if (angular.isString(data)) {
	                    data = JSON.parse(data);
	                }
	                return data;
	            };
	            //check if we are using a service to transform the response
	            if (angular.isDefined(options.transformResponse)) {
	                transformResponse = function (data) {
	                    var data = JSON.parse(data);
	                    if (angular.isDefined(data.records)) {
	                        data = options.transformResponse(data.records);
	                    }
	                    return data;
	                };
	            }
	            _this.$http.get(urlString, {
	                params: params,
	                timeout: deferred.promise,
	                //transformRequest:transformRequest,
	                transformResponse: transformResponse
	            })
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            if (options.deferKey) {
	                _this._deferred[options.deferKey] = deferred;
	            }
	            return deferred.promise;
	        };
	        this.getResizedImageByProfileName = function (profileName, skuIDs) {
	            var deferred = _this.$q.defer();
	            return _this.$http.get(_this.getUrlWithActionPrefix() + 'api:main.getResizedImageByProfileName&profileName=' + profileName + '&skuIDs=' + skuIDs)
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	        };
	        this.getEventOptions = function (entityName) {
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getEventOptionsByEntityName&entityName=' + entityName;
	            _this.$http.get(urlString)
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        this.getProcessOptions = function (entityName) {
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getProcessMethodOptionsByEntityName&entityName=' + entityName;
	            _this.$http.get(urlString)
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        this.checkUniqueOrNullValue = function (object, property, value) {
	            return _this.$http.get(_this.getUrlWithActionPrefix() + 'api:main.getValidationPropertyStatus&object=' + object + '&propertyidentifier=' + property +
	                '&value=' + escape(value)).then(function (results) {
	                return results.data.uniqueStatus;
	            });
	        };
	        this.checkUniqueValue = function (object, property, value) {
	            return _this.$http.get(_this.getUrlWithActionPrefix() + 'api:main.getValidationPropertyStatus&object=' + object + '&propertyidentifier=' + property +
	                '&value=' + escape(value)).then(function (results) {
	                return results.data.uniqueStatus;
	            });
	        };
	        this.getPropertyDisplayData = function (entityName, options) {
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getPropertyDisplayData&entityName=' + entityName;
	            var params = {};
	            params.propertyIdentifiersList = options.propertyIdentifiersList || '';
	            _this.$http.get(urlString, { params: params })
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        this.getPropertyDisplayOptions = function (entityName, options) {
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getPropertyDisplayOptions&entityName=' + entityName;
	            var params = {};
	            params.property = options.property || '';
	            if (angular.isDefined(options.argument1)) {
	                params.argument1 = options.argument1;
	            }
	            _this.$http.get(urlString, { params: params })
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        this.saveEntity = function (entityName, id, params, context) {
	            //$log.debug('save'+ entityName);
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.post';
	            if (angular.isDefined(entityName)) {
	                params.entityName = entityName;
	            }
	            if (angular.isDefined(id)) {
	                params.entityID = id;
	            }
	            if (angular.isDefined(context)) {
	                params.context = context;
	            }
	            _this.$http({
	                url: urlString,
	                method: 'POST',
	                data: $.param(params),
	                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	            })
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        this.getExistingCollectionsByBaseEntity = function (entityName) {
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getExistingCollectionsByBaseEntity&entityName=' + entityName;
	            _this.$http.get(urlString)
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        this.getFilterPropertiesByBaseEntityName = function (entityName) {
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getFilterPropertiesByBaseEntityName&EntityName=' + entityName;
	            _this.$http.get(urlString)
	                .success(function (data) {
	                deferred.resolve(data);
	            }).error(function (reason) {
	                deferred.reject(reason);
	            });
	            return deferred.promise;
	        };
	        this.login = function (emailAddress, password) {
	            var deferred = _this.$q.defer();
	            var urlString = _this.appConfig.baseURL + '/index.cfm/api/auth/login';
	            var params = {
	                emailAddress: emailAddress,
	                password: password
	            };
	            return _this.$http.get(urlString, { params: params }).success(function (response) {
	                deferred.resolve(response);
	            }).error(function (response) {
	                deferred.reject(response);
	            });
	        };
	        this.getResourceBundle = function (locale) {
	            var deferred = _this.$q.defer();
	            var locale = locale || _this.appConfig.rbLocale;
	            if (_this._resourceBundle[locale]) {
	                return _this._resourceBundle[locale];
	            }
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getResourceBundle&instantiationKey=' + _this.appConfig.instantiationKey + '&locale=' + locale;
	            _this.$http({
	                url: urlString,
	                method: "GET"
	            }).success(function (response, status, headersGetter) {
	                _this._resourceBundle[locale] = response.data;
	                deferred.resolve(response);
	            }).error(function (response) {
	                _this._resourceBundle[locale] = {};
	                deferred.reject(response);
	            });
	            return deferred.promise;
	        };
	        this.getCurrencies = function () {
	            var deferred = _this.$q.defer();
	            var urlString = _this.getUrlWithActionPrefix() + 'api:main.getCurrencies&instantiationKey=' + _this.appConfig.instantiationKey;
	            _this.$http.get(urlString).success(function (response) {
	                deferred.resolve(response);
	            }).error(function (response) {
	                deferred.reject(response);
	            });
	            return deferred.promise;
	        };
	        this.getConfig = function () {
	            return _this._config;
	        };
	        this.getConfigValue = function (key) {
	            return _this._config[key];
	        };
	        this.setConfigValue = function (key, value) {
	            _this._config[key] = value;
	        };
	        this.setConfig = function (config) {
	            _this._config = config;
	        };
	        this.$window = $window;
	        this.$q = $q;
	        this.$http = $http;
	        this.$timeout = $timeout;
	        this.$log = $log;
	        this.$rootScope = $rootScope;
	        this.$location = $location;
	        this.$anchorScroll = $anchorScroll;
	        this.utilityService = utilityService;
	        this.formService = formService;
	        this.rbkeyService = rbkeyService;
	        this.appConfig = appConfig;
	        this._config = _config;
	        this._jsEntities = _jsEntities;
	        this._jsEntityInstances = _jsEntityInstances;
	    }
	    return HibachiService;
	})();
	exports.HibachiService = HibachiService;
	var $Hibachi = (function () {
	    //@ngInject
	    function $Hibachi(appConfig) {
	        var _this = this;
	        this._config = {};
	        this.angular = angular;
	        this.setJsEntities = function (jsEntities) {
	            _this._jsEntities = jsEntities;
	        };
	        this.getConfig = function () {
	            return _this._config;
	        };
	        this.getConfigValue = function (key) {
	            return _this._config[key];
	        };
	        this.setConfigValue = function (key, value) {
	            _this._config[key] = value;
	        };
	        this.setConfig = function (config) {
	            _this._config = config;
	        };
	        this._config = appConfig;
	        this.$get.$inject = [
	            '$window',
	            '$q',
	            '$http',
	            '$timeout',
	            '$log',
	            '$rootScope',
	            '$location',
	            '$anchorScroll',
	            'utilityService',
	            'formService',
	            'rbkeyService',
	            'appConfig'
	        ];
	    }
	    $Hibachi.prototype.$get = function ($window, $q, $http, $timeout, $log, $rootScope, $location, $anchorScroll, utilityService, formService, rbkeyService, appConfig) {
	        return new HibachiService($window, $q, $http, $timeout, $log, $rootScope, $location, $anchorScroll, utilityService, formService, rbkeyService, appConfig, this._config, this._jsEntities, this._jsEntityInstances);
	    };
	    return $Hibachi;
	})();
	exports.$Hibachi = $Hibachi;


/***/ },
/* 15 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var LocalStorageService = (function () {
	    //@ngInject
	    function LocalStorageService($window) {
	        var _this = this;
	        this.$window = $window;
	        this.hasItem = function (key) {
	            return (_this.$window.localStorage.getItem(key)
	                && _this.$window.localStorage.getItem(key) !== null
	                && _this.$window.localStorage.getItem(key) !== "undefined");
	        };
	        this.getItem = function (key) {
	            var value = _this.$window.localStorage.getItem(key);
	            if (value.charAt(0) === '{' || value.charAt(0) === '[') {
	                value = angular.fromJson(value);
	            }
	            return value;
	        };
	        this.setItem = function (key, data) {
	            if (angular.isObject(data) || angular.isArray(data)) {
	                data = angular.toJson(data);
	            }
	            _this.$window.localStorage.setItem(key, data);
	        };
	        this.$window = $window;
	    }
	    return LocalStorageService;
	})();
	exports.LocalStorageService = LocalStorageService;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var HibachiServiceDecorator = (function () {
	    //@ngInject
	    function HibachiServiceDecorator($delegate, $http, $timeout, $log, $rootScope, $location, $anchorScroll, $q, utilityService, formService, rbkeyService, appConfig, observerService) {
	        var _deferred = {};
	        var _config = appConfig;
	        var _jsEntities = {};
	        var _jsEntityInstances = {};
	        var entities = appConfig.modelConfig.entities, validations = appConfig.modelConfig.validations, defaultValues = appConfig.modelConfig.defaultValues;
	        angular.forEach(entities, function (entity) {
	            $delegate['get' + entity.className] = function (options) {
	                var entityInstance = $delegate.newEntity(entity.className);
	                var entityDataPromise = $delegate.getEntity(entity.className, options);
	                entityDataPromise.then(function (response) {
	                    if (angular.isDefined(response.processData)) {
	                        entityInstance.$$init(response.data);
	                        var processObjectInstance = $delegate['new' + entity.className + '_' + options.processContext.charAt(0).toUpperCase() + options.processContext.slice(1)]();
	                        processObjectInstance.$$init(response.processData);
	                        processObjectInstance.data[entity.className.charAt(0).toLowerCase() + entity.className.slice(1)] = entityInstance;
	                        entityInstance.processObject = processObjectInstance;
	                    }
	                    else {
	                        entityInstance.$$init(response);
	                    }
	                });
	                return {
	                    promise: entityDataPromise,
	                    value: entityInstance
	                };
	            };
	            $delegate['get' + entity.className] = function (options) {
	                var entityInstance = $delegate.newEntity(entity.className);
	                var entityDataPromise = $delegate.getEntity(entity.className, options);
	                entityDataPromise.then(function (response) {
	                    if (angular.isDefined(response.processData)) {
	                        entityInstance.$$init(response.data);
	                        var processObjectInstance = $delegate['new' + entity.className + options.processContext.charAt(0).toUpperCase() + options.processContext.slice(1)]();
	                        processObjectInstance.$$init(response.processData);
	                        processObjectInstance.data[entity.className.charAt(0).toLowerCase() + entity.className.slice(1)] = entityInstance;
	                        entityInstance.processObject = processObjectInstance;
	                    }
	                    else {
	                        entityInstance.$$init(response);
	                    }
	                });
	                return {
	                    promise: entityDataPromise,
	                    value: entityInstance
	                };
	            };
	            $delegate['new' + entity.className] = function () {
	                return $delegate.newEntity(entity.className);
	            };
	            entity.isProcessObject = entity.className.indexOf('_') >= 0;
	            _jsEntities[entity.className] = function () {
	                this.validations = validations[entity.className];
	                this.metaData = entity;
	                this.metaData.className = entity.className;
	                if (entity.hb_parentPropertyName) {
	                    this.metaData.hb_parentPropertyName = entity.hb_parentPropertyName;
	                }
	                if (entity.hb_childPropertyName) {
	                    this.metaData.hb_childPropertyName = entity.hb_childPropertyName;
	                }
	                this.metaData.$$getRBKey = function (rbKey, replaceStringData) {
	                    return rbkeyService.rbKey(rbKey, replaceStringData);
	                };
	                this.metaData.$$getPropertyTitle = function (propertyName) {
	                    return _getPropertyTitle(propertyName, this);
	                };
	                this.metaData.$$getPropertyHint = function (propertyName) {
	                    return _getPropertyHint(propertyName, this);
	                };
	                this.metaData.$$getManyToManyName = function (singularname) {
	                    var metaData = this;
	                    for (var i in metaData) {
	                        if (metaData[i].singularname === singularname) {
	                            return metaData[i].name;
	                        }
	                    }
	                };
	                this.metaData.$$getPropertyFieldType = function (propertyName) {
	                    return _getPropertyFieldType(propertyName, this);
	                };
	                this.metaData.$$getPropertyFormatType = function (propertyName) {
	                    return _getPropertyFormatType(propertyName, this);
	                };
	                this.metaData.$$getDetailTabs = function () {
	                    var deferred = $q.defer();
	                    var urlString = _config.baseURL + '/index.cfm/?' + appConfig.action + '=api:main.getDetailTabs&entityName=' + this.className;
	                    var detailTabs = [];
	                    $http.get(urlString)
	                        .success(function (data) {
	                        deferred.resolve(data);
	                    }).error(function (reason) {
	                        deferred.reject(reason);
	                    });
	                    return deferred.promise;
	                };
	                this.$$getFormattedValue = function (propertyName, formatType) {
	                    return _getFormattedValue(propertyName, formatType, this);
	                };
	                this.data = {};
	                this.modifiedData = {};
	                var jsEntity = this;
	                if (entity.isProcessObject) {
	                    (function (entity) {
	                        _jsEntities[entity.className].prototype = {
	                            $$getID: function () {
	                                return '';
	                            },
	                            $$getIDName: function () {
	                                var IDNameString = '';
	                                return IDNameString;
	                            }
	                        };
	                    })(entity);
	                }
	                angular.forEach(entity, function (property) {
	                    if (angular.isObject(property) && angular.isDefined(property.name)) {
	                        if (angular.isDefined(defaultValues[entity.className][property.name])) {
	                            jsEntity.data[property.name] = angular.copy(defaultValues[entity.className][property.name]);
	                        }
	                    }
	                });
	            };
	            _jsEntities[entity.className].prototype = {
	                $$getPropertyByName: function (propertyName) {
	                    return this['$$get' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1)]();
	                },
	                $$isPersisted: function () {
	                    return this.$$getID() !== '';
	                },
	                $$init: function (data) {
	                    _init(this, data);
	                },
	                $$save: function () {
	                    return _save(this);
	                },
	                $$delete: function () {
	                    return _delete(this);
	                },
	                $$getValidationsByProperty: function (property) {
	                    return _getValidationsByProperty(this, property);
	                },
	                $$getValidationByPropertyAndContext: function (property, context) {
	                    return _getValidationByPropertyAndContext(this, property, context);
	                },
	                $$getTitleByPropertyIdentifier: function (propertyIdentifier) {
	                    if (propertyIdentifier.split('.').length > 1) {
	                        var listFirst = utilityService.listFirst(propertyIdentifier, '.');
	                        var relatedEntityName = this.metaData[listFirst].cfc;
	                        var exampleEntity = $delegate.newEntity(relatedEntityName);
	                        return exampleEntity.$$getTitleByPropertyIdentifier(propertyIdentifier.replace(listFirst, ''));
	                    }
	                    return this.metaData.$$getPropertyTitle(propertyIdentifier);
	                },
	                $$getMetaData: function (propertyName) {
	                    if (propertyName === undefined) {
	                        return this.metaData;
	                    }
	                    else {
	                        if (angular.isDefined(this.metaData[propertyName].name) && angular.isUndefined(this.metaData[propertyName].nameCapitalCase)) {
	                            this.metaData[propertyName].nameCapitalCase = this.metaData[propertyName].name.charAt(0).toUpperCase() + this.metaData[propertyName].name.slice(1);
	                        }
	                        if (angular.isDefined(this.metaData[propertyName].cfc) && angular.isUndefined(this.metaData[propertyName].cfcProperCase)) {
	                            this.metaData[propertyName].cfcProperCase = this.metaData[propertyName].cfc.charAt(0).toLowerCase() + this.metaData[propertyName].cfc.slice(1);
	                        }
	                        return this.metaData[propertyName];
	                    }
	                }
	            };
	            angular.forEach(entity, function (property) {
	                if (angular.isObject(property) && angular.isDefined(property.name)) {
	                    if (angular.isUndefined(property.persistent)) {
	                        if (angular.isDefined(property.fieldtype)) {
	                            if (['many-to-one'].indexOf(property.fieldtype) >= 0) {
	                                _jsEntities[entity.className].prototype['$$get' + property.name.charAt(0).toUpperCase() + property.name.slice(1)] = function () {
	                                    var thisEntityInstance = this;
	                                    if (angular.isDefined(this['$$get' + this.$$getIDName().charAt(0).toUpperCase() + this.$$getIDName().slice(1)]())) {
	                                        var options = {
	                                            columnsConfig: angular.toJson([
	                                                {
	                                                    "propertyIdentifier": "_" + this.metaData.className.toLowerCase() + "_" + property.name
	                                                }
	                                            ]),
	                                            joinsConfig: angular.toJson([
	                                                {
	                                                    "associationName": property.name,
	                                                    "alias": "_" + this.metaData.className.toLowerCase() + "_" + property.name
	                                                }
	                                            ]),
	                                            filterGroupsConfig: angular.toJson([{
	                                                    "filterGroup": [
	                                                        {
	                                                            "propertyIdentifier": "_" + this.metaData.className.toLowerCase() + "." + this.$$getIDName(),
	                                                            "comparisonOperator": "=",
	                                                            "value": this.$$getID()
	                                                        }
	                                                    ]
	                                                }]),
	                                            allRecords: true
	                                        };
	                                        var collectionPromise = $delegate.getEntity(entity.className, options);
	                                        collectionPromise.then(function (response) {
	                                            for (var i in response.records) {
	                                                var entityInstance = $delegate.newEntity(thisEntityInstance.metaData[property.name].cfc);
	                                                //Removed the array index here at the end of local.property.name.
	                                                if (angular.isArray(response.records[i][property.name])) {
	                                                    entityInstance.$$init(response.records[i][property.name][0]);
	                                                }
	                                                else {
	                                                    entityInstance.$$init(response.records[i][property.name]); //Shouldn't have the array index'
	                                                }
	                                                thisEntityInstance['$$set' + property.name.charAt(0).toUpperCase() + property.name.slice(1)](entityInstance);
	                                            }
	                                        });
	                                        return collectionPromise;
	                                    }
	                                    return null;
	                                };
	                                _jsEntities[entity.className].prototype['$$set' + property.name.charAt(0).toUpperCase() + property.name.slice(1)] = function (entityInstance) {
	                                    var thisEntityInstance = this;
	                                    var metaData = this.metaData;
	                                    var manyToManyName = '';
	                                    //if entityInstance is not passed in, clear related object
	                                    if (angular.isUndefined(entityInstance)) {
	                                        if (angular.isDefined(thisEntityInstance.data[property.name])) {
	                                            delete thisEntityInstance.data[property.name];
	                                        }
	                                        if (!thisEntityInstance.parents) {
	                                            return;
	                                        }
	                                        for (var i = 0; i <= thisEntityInstance.parents.length; i++) {
	                                            if (angular.isDefined(thisEntityInstance.parents[i]) && thisEntityInstance.parents[i].name == property.name.charAt(0).toLowerCase() + property.name.slice(1)) {
	                                                thisEntityInstance.parents.splice(i, 1);
	                                            }
	                                        }
	                                        return;
	                                    }
	                                    if (property.name === 'parent' + this.metaData.className) {
	                                        var childName = 'child' + this.metaData.className;
	                                        manyToManyName = entityInstance.metaData.$$getManyToManyName(childName);
	                                    }
	                                    else {
	                                        manyToManyName = entityInstance.metaData.$$getManyToManyName(metaData.className.charAt(0).toLowerCase() + metaData.className.slice(1));
	                                    }
	                                    if (angular.isUndefined(thisEntityInstance.parents)) {
	                                        thisEntityInstance.parents = [];
	                                    }
	                                    thisEntityInstance.parents.push(thisEntityInstance.metaData[property.name]);
	                                    if (angular.isDefined(manyToManyName)) {
	                                        if (angular.isUndefined(entityInstance.children)) {
	                                            entityInstance.children = [];
	                                        }
	                                        var child = entityInstance.metaData[manyToManyName];
	                                        if (entityInstance.children.indexOf(child) === -1) {
	                                            entityInstance.children.push(child);
	                                        }
	                                        if (angular.isUndefined(entityInstance.data[manyToManyName])) {
	                                            entityInstance.data[manyToManyName] = [];
	                                        }
	                                        entityInstance.data[manyToManyName].push(thisEntityInstance);
	                                    }
	                                    thisEntityInstance.data[property.name] = entityInstance;
	                                };
	                            }
	                            else if (['one-to-many', 'many-to-many'].indexOf(property.fieldtype) >= 0) {
	                                _jsEntities[entity.className].prototype['$$add' + property.singularname.charAt(0).toUpperCase() + property.singularname.slice(1)] = function (entityInstance) {
	                                    if (angular.isUndefined(entityInstance)) {
	                                        var entityInstance = $delegate.newEntity(this.metaData[property.name].cfc);
	                                    }
	                                    var metaData = this.metaData;
	                                    if (metaData[property.name].fieldtype === 'one-to-many') {
	                                        entityInstance.data[metaData[property.name].fkcolumn.slice(0, -2)] = this;
	                                    }
	                                    else if (metaData[property.name].fieldtype === 'many-to-many') {
	                                        var manyToManyName = entityInstance.metaData.$$getManyToManyName(metaData.className.charAt(0).toLowerCase() + this.metaData.className.slice(1));
	                                        if (angular.isUndefined(entityInstance.data[manyToManyName])) {
	                                            entityInstance.data[manyToManyName] = [];
	                                        }
	                                        entityInstance.data[manyToManyName].push(this);
	                                    }
	                                    if (angular.isDefined(metaData[property.name])) {
	                                        if (angular.isDefined(entityInstance.metaData[metaData[property.name].fkcolumn.slice(0, -2)])) {
	                                            if (angular.isUndefined(entityInstance.parents)) {
	                                                entityInstance.parents = [];
	                                            }
	                                            entityInstance.parents.push(entityInstance.metaData[metaData[property.name].fkcolumn.slice(0, -2)]);
	                                        }
	                                        if (angular.isUndefined(this.children)) {
	                                            this.children = [];
	                                        }
	                                        var child = metaData[property.name];
	                                        if (this.children.indexOf(child) === -1) {
	                                            this.children.push(child);
	                                        }
	                                    }
	                                    if (angular.isUndefined(this.data[property.name])) {
	                                        this.data[property.name] = [];
	                                    }
	                                    this.data[property.name].push(entityInstance);
	                                    return entityInstance;
	                                };
	                                _jsEntities[entity.className].prototype['$$get' + property.name.charAt(0).toUpperCase() + property.name.slice(1)] = function () {
	                                    var thisEntityInstance = this;
	                                    if (angular.isDefined(this['$$get' + this.$$getIDName().charAt(0).toUpperCase() + this.$$getIDName().slice(1)])) {
	                                        var options = {
	                                            filterGroupsConfig: angular.toJson([{
	                                                    "filterGroup": [
	                                                        {
	                                                            "propertyIdentifier": "_" + property.cfc.toLowerCase() + "." + property.fkcolumn.replace('ID', '') + "." + this.$$getIDName(),
	                                                            "comparisonOperator": "=",
	                                                            "value": this.$$getID()
	                                                        }
	                                                    ]
	                                                }]),
	                                            allRecords: true
	                                        };
	                                        var collectionPromise = $delegate.getEntity(property.cfc, options);
	                                        collectionPromise.then(function (response) {
	                                            for (var i in response.records) {
	                                                var entityInstance = thisEntityInstance['$$add' + thisEntityInstance.metaData[property.name].singularname.charAt(0).toUpperCase() + thisEntityInstance.metaData[property.name].singularname.slice(1)]();
	                                                entityInstance.$$init(response.records[i]);
	                                                if (angular.isUndefined(thisEntityInstance[property.name])) {
	                                                    thisEntityInstance[property.name] = [];
	                                                }
	                                                thisEntityInstance[property.name].push(entityInstance);
	                                            }
	                                        });
	                                        return collectionPromise;
	                                    }
	                                };
	                            }
	                            else {
	                                if (['id'].indexOf(property.fieldtype) >= 0) {
	                                    _jsEntities[entity.className].prototype['$$getID'] = function () {
	                                        //this should retreive id from the metadata
	                                        return this.data[this.$$getIDName()];
	                                    };
	                                    _jsEntities[entity.className].prototype['$$getIDName'] = function () {
	                                        var IDNameString = property.name;
	                                        return IDNameString;
	                                    };
	                                }
	                                _jsEntities[entity.className].prototype['$$get' + property.name.charAt(0).toUpperCase() + property.name.slice(1)] = function () {
	                                    return this.data[property.name];
	                                };
	                            }
	                        }
	                        else {
	                            _jsEntities[entity.className].prototype['$$get' + property.name.charAt(0).toUpperCase() + property.name.slice(1)] = function () {
	                                return this.data[property.name];
	                            };
	                        }
	                    }
	                }
	            });
	        });
	        $delegate.setJsEntities(_jsEntities);
	        angular.forEach(_jsEntities, function (jsEntity) {
	            var jsEntityInstance = new jsEntity;
	            _jsEntityInstances[jsEntityInstance.metaData.className] = jsEntityInstance;
	        });
	        $delegate.setJsEntityInstances(_jsEntityInstances);
	        var _init = function (entityInstance, data) {
	            for (var key in data) {
	                if (key.charAt(0) !== '$' && angular.isDefined(entityInstance.metaData[key])) {
	                    var propertyMetaData = entityInstance.metaData[key];
	                    if (angular.isDefined(propertyMetaData) && angular.isDefined(propertyMetaData.hb_formfieldtype) && propertyMetaData.hb_formfieldtype === 'json') {
	                        if (data[key].trim() !== '') {
	                            entityInstance.data[key] = angular.fromJson(data[key]);
	                        }
	                    }
	                    else {
	                        entityInstance.data[key] = data[key];
	                    }
	                }
	            }
	        };
	        var _getPropertyTitle = function (propertyName, metaData) {
	            var propertyMetaData = metaData[propertyName];
	            if (angular.isDefined(propertyMetaData['hb_rbkey'])) {
	                return metaData.$$getRBKey(propertyMetaData['hb_rbkey']);
	            }
	            else if (angular.isUndefined(propertyMetaData['persistent'])) {
	                if (angular.isDefined(propertyMetaData['fieldtype'])
	                    && angular.isDefined(propertyMetaData['cfc'])
	                    && ["one-to-many", "many-to-many"].indexOf(propertyMetaData.fieldtype) > -1) {
	                    return metaData.$$getRBKey("entity." + metaData.className.toLowerCase() + "." + propertyName + ',entity.' + propertyMetaData.cfc + '_plural');
	                }
	                else if (angular.isDefined(propertyMetaData.fieldtype)
	                    && angular.isDefined(propertyMetaData.cfc)
	                    && ["many-to-one"].indexOf(propertyMetaData.fieldtype) > -1) {
	                    return metaData.$$getRBKey("entity." + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase() + ',entity.' + propertyMetaData.cfc);
	                }
	                return metaData.$$getRBKey('entity.' + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase());
	            }
	            else if (metaData.isProcessObject) {
	                if (angular.isDefined(propertyMetaData.fieldtype)
	                    && angular.isDefined(propertyMetaData.cfc)
	                    && ["one-to-many", "many-to-many"].indexOf(propertyMetaData.fieldtype) > -1) {
	                    return metaData.$$getRBKey('processObject.' + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase() + ',entity.' + propertyMetaData.cfc.toLowerCase() + '_plural');
	                }
	                else if (angular.isDefined(propertyMetaData.fieldtype)
	                    && angular.isDefined(propertyMetaData.cfc)) {
	                    return metaData.$$getRBKey('processObject.' + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase() + ',entity.' + propertyMetaData.cfc.toLowerCase());
	                }
	                return metaData.$$getRBKey('processObject.' + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase());
	            }
	            return metaData.$$getRBKey('object.' + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase());
	        };
	        var _getPropertyHint = function (propertyName, metaData) {
	            var propertyMetaData = metaData[propertyName];
	            var keyValue = '';
	            if (angular.isDefined(propertyMetaData['hb_rbkey'])) {
	                keyValue = metaData.$$getRBKey(propertyMetaData['hb_rbkey'] + '_hint');
	            }
	            else if (angular.isUndefined(propertyMetaData['persistent']) || (angular.isDefined(propertyMetaData['persistent']) && propertyMetaData['persistent'] === true)) {
	                keyValue = metaData.$$getRBKey('entity.' + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase() + '_hint');
	            }
	            else {
	                keyValue = metaData.$$getRBKey('object.' + metaData.className.toLowerCase() + '.' + propertyName.toLowerCase());
	            }
	            if (keyValue.slice(-8) !== '_missing') {
	                return keyValue;
	            }
	            return '';
	        };
	        var _getPropertyFieldType = function (propertyName, metaData) {
	            var propertyMetaData = metaData[propertyName];
	            if (angular.isDefined(propertyMetaData['hb_formfieldtype'])) {
	                return propertyMetaData['hb_formfieldtype'];
	            }
	            if (angular.isUndefined(propertyMetaData.fieldtype) || propertyMetaData.fieldtype === 'column') {
	                var dataType = "";
	                if (angular.isDefined(propertyMetaData.ormtype)) {
	                    dataType = propertyMetaData.ormtype;
	                }
	                else if (angular.isDefined(propertyMetaData.type)) {
	                    dataType = propertyMetaData.type;
	                }
	                if (["boolean", "yes_no", "true_false"].indexOf(dataType) > -1) {
	                    return "yesno";
	                }
	                else if (["date", "timestamp"].indexOf(dataType) > -1) {
	                    return "dateTime";
	                }
	                else if ("array" === dataType) {
	                    return "select";
	                }
	                else if ("struct" === dataType) {
	                    return "checkboxgroup";
	                }
	                else if (propertyName.indexOf('password') > -1) {
	                    return "password";
	                }
	            }
	            else if (angular.isDefined(propertyMetaData.fieldtype) && propertyMetaData.fieldtype === 'many-to-one') {
	                return 'select';
	            }
	            else if (angular.isDefined(propertyMetaData.fieldtype) && propertyMetaData.fieldtype === 'one-to-many') {
	                return 'There is no property field type for one-to-many relationship properties, which means that you cannot get a fieldtype for ' + propertyName;
	            }
	            else if (angular.isDefined(propertyMetaData.fieldtype) && propertyMetaData.fieldtype === 'many-to-many') {
	                return "listingMultiselect";
	            }
	            return "text";
	        };
	        var _getPropertyFormatType = function (propertyName, metaData) {
	            var propertyMetaData = metaData[propertyName];
	            if (angular.isDefined(propertyMetaData['hb_formattype'])) {
	                return propertyMetaData['hb_formattype'];
	            }
	            else if (angular.isUndefined(propertyMetaData.fieldtype) || propertyMetaData.fieldtype === 'column') {
	                var dataType = "";
	                if (angular.isDefined(propertyMetaData.ormtype)) {
	                    dataType = propertyMetaData.ormtype;
	                }
	                else if (angular.isDefined(propertyMetaData.type)) {
	                    dataType = propertyMetaData.type;
	                }
	                if (["boolean", "yes_no", "true_false"].indexOf(dataType) > -1) {
	                    return "yesno";
	                }
	                else if (["date", "timestamp"].indexOf(dataType) > -1) {
	                    return "dateTime";
	                }
	                else if (["big_decimal"].indexOf(dataType) > -1 && propertyName.slice(-6) === 'weight') {
	                    return "weight";
	                }
	                else if (["big_decimal"].indexOf(dataType) > -1) {
	                    return "currency";
	                }
	            }
	            return 'none';
	        };
	        var _isSimpleValue = function (value) {
	            return !!(angular.isString(value) || angular.isNumber(value)
	                || angular.isDate(value) || value === false || value === true);
	        };
	        var _getFormattedValue = function (propertyName, formatType, entityInstance) {
	            var value = entityInstance.$$getPropertyByName(propertyName);
	            if (angular.isUndefined(formatType)) {
	                formatType = entityInstance.metaData.$$getPropertyFormatType(propertyName);
	            }
	            if (formatType === "custom") {
	            }
	            else if (formatType === "rbkey") {
	                if (angular.isDefined(value)) {
	                    return entityInstance.$$getRBKey('entity.' + entityInstance.metaData.className.toLowerCase() + '.' + propertyName.toLowerCase() + '.' + value);
	                }
	                else {
	                    return '';
	                }
	            }
	            if (angular.isUndefined(value)) {
	                var propertyMeta = entityInstance.metaData[propertyName];
	                if (angular.isDefined(propertyMeta['hb_nullRBKey'])) {
	                    return entityInstance.$$getRbKey(propertyMeta['hb_nullRBKey']);
	                }
	                return "";
	            }
	            else if (_isSimpleValue(value)) {
	                var formatDetails = {};
	                if (angular.isDefined(entityInstance.data['currencyCode'])) {
	                    formatDetails.currencyCode = entityInstance.$$getCurrencyCode();
	                }
	                return utilityService.formatValue(value, formatType, formatDetails, entityInstance);
	            }
	        };
	        var _delete = function (entityInstance) {
	            var entityName = entityInstance.metaData.className;
	            var entityID = entityInstance.$$getID();
	            var context = 'delete';
	            return $delegate.saveEntity(entityName, entityID, {}, context);
	        };
	        var _setValueByPropertyPath = function (obj, path, value) {
	            var a = path.split('.');
	            var context = obj;
	            var selector;
	            var myregexp = /([a-zA-Z]+)(\[(\d)\])+/; // matches:  item[0]
	            var match = null;
	            for (var i = 0; i < a.length - 1; i += 1) {
	                match = myregexp.exec(a[i]);
	                if (match !== null)
	                    context = context[match[1]][match[3]];
	                else
	                    context = context[a[i]];
	            }
	            // check for ending item[xx] syntax
	            match = myregexp.exec([a[a.length - 1]]);
	            if (match !== null)
	                context[match[1]][match[3]] = value;
	            else
	                context[a[a.length - 1]] = value;
	        };
	        var _getValueByPropertyPath = function (obj, path) {
	            var paths = path.split('.'), current = obj, i;
	            for (i = 0; i < paths.length; ++i) {
	                if (current[paths[i]] == undefined) {
	                    return undefined;
	                }
	                else {
	                    current = current[paths[i]];
	                }
	            }
	            return current;
	        };
	        var _addReturnedIDs = function (returnedIDs, entityInstance) {
	            for (var key in returnedIDs) {
	                if (angular.isArray(returnedIDs[key])) {
	                    var arrayItems = returnedIDs[key];
	                    var entityInstanceArray = entityInstance.data[key];
	                    for (var i in arrayItems) {
	                        var arrayItem = arrayItems[i];
	                        var entityInstanceArrayItem = entityInstance.data[key][i];
	                        _addReturnedIDs(arrayItem, entityInstanceArrayItem);
	                    }
	                }
	                else if (angular.isObject(returnedIDs[key])) {
	                    for (var k in returnedIDs[key]) {
	                        _addReturnedIDs(returnedIDs[key][k], entityInstance.data[key][k]);
	                    }
	                }
	                else {
	                    entityInstance.data[key] = returnedIDs[key];
	                }
	            }
	        };
	        var _save = function (entityInstance) {
	            var deferred = $q.defer();
	            $timeout(function () {
	                //$log.debug('save begin');
	                //$log.debug(entityInstance);
	                var entityID = entityInstance.$$getID();
	                var modifiedData = _getModifiedData(entityInstance);
	                //$log.debug('modifiedData complete');
	                //$log.debug(modifiedData);
	                //timeoutPromise.valid = modifiedData.valid;
	                if (modifiedData.valid) {
	                    var params = {};
	                    params.serializedJsonData = angular.toJson(modifiedData.value);
	                    //if we have a process object then the context is different from the standard save
	                    var entityName = '';
	                    var context = 'save';
	                    if (entityInstance.metaData.isProcessObject === 1) {
	                        var processStruct = modifiedData.objectLevel.metaData.className.split('_');
	                        entityName = processStruct[0];
	                        context = processStruct[1];
	                    }
	                    else {
	                        entityName = modifiedData.objectLevel.metaData.className;
	                    }
	                    var savePromise = $delegate.saveEntity(entityName, entityID, params, context);
	                    savePromise.then(function (response) {
	                        var returnedIDs = response.data;
	                        if (angular.isDefined(response.SUCCESS) && response.SUCCESS === true) {
	                            if ($location.url() == '/entity/' + entityName + '/create' && response.data[modifiedData.objectLevel.$$getIDName()]) {
	                                $location.path('/entity/' + entityName + '/' + response.data[modifiedData.objectLevel.$$getIDName()], false);
	                            }
	                            _addReturnedIDs(returnedIDs, modifiedData.objectLevel);
	                            deferred.resolve(returnedIDs);
	                            observerService.notify('saveSuccess', returnedIDs);
	                            observerService.notify('saveSuccess' + entityName, returnedIDs);
	                        }
	                        else {
	                            deferred.reject(angular.isDefined(response.messages) ? response.messages : response);
	                            observerService.notify('saveFailed', response);
	                            observerService.notify('saveFailed' + entityName, response);
	                        }
	                    }, function (reason) {
	                        deferred.reject(reason);
	                        observerService.notify('saveFailed', reason);
	                        observerService.notify('saveFailed' + entityName, reason);
	                    });
	                }
	                else {
	                    //select first, visible, and enabled input with a class of ng-invalid
	                    var target = $('input.ng-invalid:first:visible:enabled');
	                    if (angular.isDefined(target)) {
	                        target.focus();
	                        var targetID = target.attr('id');
	                        $anchorScroll();
	                    }
	                    deferred.reject('Input is invalid.');
	                    observerService.notify('validationFailed');
	                    observerService.notify('validationFailed' + entityName);
	                }
	            });
	            //return timeoutPromise;
	            return deferred.promise;
	            /*




	            */
	        };
	        var _getModifiedData = function (entityInstance) {
	            var modifiedData = {};
	            modifiedData = getModifiedDataByInstance(entityInstance);
	            return modifiedData;
	        };
	        var getObjectSaveLevel = function (entityInstance) {
	            var objectLevel = entityInstance;
	            var entityID = entityInstance.$$getID();
	            angular.forEach(entityInstance.parents, function (parentObject) {
	                if (angular.isDefined(entityInstance.data[parentObject.name]) && entityInstance.data[parentObject.name].$$getID() === '' && (angular.isUndefined(entityID) || !entityID.trim().length)) {
	                    var parentEntityInstance = entityInstance.data[parentObject.name];
	                    var parentEntityID = parentEntityInstance.$$getID();
	                    if (parentEntityID === '' && parentEntityInstance.forms) {
	                        objectLevel = getObjectSaveLevel(parentEntityInstance);
	                    }
	                }
	            });
	            return objectLevel;
	        };
	        var validateObject = function (entityInstance) {
	            var modifiedData = {};
	            var valid = true;
	            var forms = entityInstance.forms;
	            //$log.debug('process base level data');
	            for (var f in forms) {
	                var form = forms[f];
	                form.$setSubmitted(); //Sets the form to submitted for the validation errors to pop up.
	                if (form.$dirty && form.$valid) {
	                    for (var key in form) {
	                        //$log.debug('key:'+key);
	                        if (key.charAt(0) !== '$' && angular.isObject(form[key])) {
	                            var inputField = form[key];
	                            if (inputField.$modelValue) {
	                                inputField.$dirty = true;
	                            }
	                            if (angular.isDefined(inputField.$valid) && inputField.$valid === true && (inputField.$dirty === true || (form.autoDirty && form.autoDirty == true))) {
	                                if (angular.isDefined(entityInstance.metaData[key])
	                                    && angular.isDefined(entityInstance.metaData[key].hb_formfieldtype)
	                                    && entityInstance.metaData[key].hb_formfieldtype === 'json') {
	                                    modifiedData[key] = angular.toJson(inputField.$modelValue);
	                                }
	                                else {
	                                    modifiedData[key] = inputField.$modelValue;
	                                }
	                            }
	                        }
	                    }
	                }
	                else {
	                    if (!form.$valid) {
	                        valid = false;
	                    }
	                }
	            }
	            modifiedData[entityInstance.$$getIDName()] = entityInstance.$$getID();
	            //$log.debug(modifiedData);
	            //$log.debug('process parent data');
	            if (angular.isDefined(entityInstance.parents)) {
	                for (var p in entityInstance.parents) {
	                    var parentObject = entityInstance.parents[p];
	                    var parentInstance = entityInstance.data[parentObject.name];
	                    if (angular.isUndefined(modifiedData[parentObject.name])) {
	                        modifiedData[parentObject.name] = {};
	                    }
	                    var forms = parentInstance.forms;
	                    for (var f in forms) {
	                        var form = forms[f];
	                        form.$setSubmitted();
	                        if (form.$dirty && form.$valid) {
	                            for (var key in form) {
	                                if (key.charAt(0) !== '$' && angular.isObject(form[key])) {
	                                    var inputField = form[key];
	                                    if (inputField.$modelValue) {
	                                        inputField.$dirty = true;
	                                    }
	                                    if (angular.isDefined(inputField) && angular.isDefined(inputField.$valid) && inputField.$valid === true && (inputField.$dirty === true || (form.autoDirty && form.autoDirty == true))) {
	                                        if (angular.isDefined(parentInstance.metaData[key])
	                                            && angular.isDefined(parentInstance.metaData[key].hb_formfieldtype)
	                                            && parentInstance.metaData[key].hb_formfieldtype === 'json') {
	                                            modifiedData[parentObject.name][key] = angular.toJson(inputField.$modelValue);
	                                        }
	                                        else {
	                                            modifiedData[parentObject.name][key] = inputField.$modelValue;
	                                        }
	                                    }
	                                }
	                            }
	                        }
	                        else {
	                            if (!form.$valid) {
	                                valid = false;
	                            }
	                        }
	                    }
	                    modifiedData[parentObject.name][parentInstance.$$getIDName()] = parentInstance.$$getID();
	                }
	            }
	            //$log.debug(modifiedData);
	            //$log.debug('begin child data');
	            var childrenData = validateChildren(entityInstance);
	            //$log.debug('child Data');
	            //$log.debug(childrenData);
	            angular.extend(modifiedData, childrenData);
	            return {
	                valid: valid,
	                value: modifiedData
	            };
	        };
	        var validateChildren = function (entityInstance) {
	            var data = {};
	            if (angular.isDefined(entityInstance.children) && entityInstance.children.length) {
	                data = getDataFromChildren(entityInstance);
	            }
	            return data;
	        };
	        var processChild = function (entityInstance, entityInstanceParent) {
	            var data = {};
	            var forms = entityInstance.forms;
	            for (var f in forms) {
	                var form = forms[f];
	                angular.extend(data, processForm(form, entityInstance));
	            }
	            if (angular.isDefined(entityInstance.children) && entityInstance.children.length) {
	                var childData = getDataFromChildren(entityInstance);
	                angular.extend(data, childData);
	            }
	            if (angular.isDefined(entityInstance.parents) && entityInstance.parents.length) {
	                var parentData = getDataFromParents(entityInstance, entityInstanceParent);
	                angular.extend(data, parentData);
	            }
	            return data;
	        };
	        var processParent = function (entityInstance) {
	            var data = {};
	            if (entityInstance.$$getID() !== '') {
	                data[entityInstance.$$getIDName()] = entityInstance.$$getID();
	            }
	            //$log.debug('processParent');
	            //$log.debug(entityInstance);
	            var forms = entityInstance.forms;
	            for (var f in forms) {
	                var form = forms[f];
	                data = angular.extend(data, processForm(form, entityInstance));
	            }
	            return data;
	        };
	        var processForm = function (form, entityInstance) {
	            //$log.debug('begin process form');
	            var data = {};
	            form.$setSubmitted();
	            for (var key in form) {
	                if (key.charAt(0) !== '$' && angular.isObject(form[key])) {
	                    var inputField = form[key];
	                    if (inputField.$modelValue) {
	                        inputField.$dirty = true;
	                    }
	                    if (angular.isDefined(inputField) && angular.isDefined(inputField) && inputField.$valid === true && (inputField.$dirty === true || (form.autoDirty && form.autoDirty == true))) {
	                        if (angular.isDefined(entityInstance.metaData[key]) && angular.isDefined(entityInstance.metaData[key].hb_formfieldtype) && entityInstance.metaData[key].hb_formfieldtype === 'json') {
	                            data[key] = angular.toJson(inputField.$modelValue);
	                        }
	                        else {
	                            data[key] = inputField.$modelValue;
	                        }
	                    }
	                }
	            }
	            data[entityInstance.$$getIDName()] = entityInstance.$$getID();
	            //$log.debug('process form data');
	            //$log.debug(data);
	            return data;
	        };
	        var getDataFromParents = function (entityInstance, entityInstanceParent) {
	            var data = {};
	            for (var c in entityInstance.parents) {
	                var parentMetaData = entityInstance.parents[c];
	                if (angular.isDefined(parentMetaData)) {
	                    var parent = entityInstance.data[parentMetaData.name];
	                    if (angular.isObject(parent) && entityInstanceParent !== parent && parent.$$getID() !== '') {
	                        if (angular.isUndefined(data[parentMetaData.name])) {
	                            data[parentMetaData.name] = {};
	                        }
	                        var parentData = processParent(parent);
	                        //$log.debug('parentData:'+parentMetaData.name);
	                        //$log.debug(parentData);
	                        angular.extend(data[parentMetaData.name], parentData);
	                    }
	                    else {
	                    }
	                }
	            }
	            ;
	            return data;
	        };
	        var getDataFromChildren = function (entityInstance) {
	            var data = {};
	            //$log.debug('childrenFound');
	            //$log.debug(entityInstance.children);
	            for (var c in entityInstance.children) {
	                var childMetaData = entityInstance.children[c];
	                var children = entityInstance.data[childMetaData.name];
	                //$log.debug(childMetaData);
	                //$log.debug(children);
	                if (angular.isArray(entityInstance.data[childMetaData.name])) {
	                    if (angular.isUndefined(data[childMetaData.name])) {
	                        data[childMetaData.name] = [];
	                    }
	                    angular.forEach(entityInstance.data[childMetaData.name], function (child, key) {
	                        //$log.debug('process child array item')
	                        var childData = processChild(child, entityInstance);
	                        //$log.debug('process child return');
	                        //$log.debug(childData);
	                        data[childMetaData.name].push(childData);
	                    });
	                }
	                else {
	                    if (angular.isUndefined(data[childMetaData.name])) {
	                        data[childMetaData.name] = {};
	                    }
	                    var child = entityInstance.data[childMetaData.name];
	                    //$log.debug('begin process child');
	                    var childData = processChild(child, entityInstance);
	                    //$log.debug('process child return');
	                    //$log.debug(childData);
	                    angular.extend(data, childData);
	                }
	            }
	            //$log.debug('returning child data');
	            //$log.debug(data);
	            return data;
	        };
	        var getModifiedDataByInstance = function (entityInstance) {
	            var modifiedData = {};
	            var objectSaveLevel = getObjectSaveLevel(entityInstance);
	            //$log.debug('objectSaveLevel : ' + objectSaveLevel );
	            var valueStruct = validateObject(objectSaveLevel);
	            //$log.debug('validateObject data');
	            //$log.debug(valueStruct.value);
	            modifiedData = {
	                objectLevel: objectSaveLevel,
	                value: valueStruct.value,
	                valid: valueStruct.valid
	            };
	            return modifiedData;
	        };
	        var _getValidationsByProperty = function (entityInstance, property) {
	            return entityInstance.validations.properties[property];
	        };
	        var _getValidationByPropertyAndContext = function (entityInstance, property, context) {
	            var validations = _getValidationsByProperty(entityInstance, property);
	            for (var i in validations) {
	                var contexts = validations[i].contexts.split(',');
	                for (var j in contexts) {
	                    if (contexts[j] === context) {
	                        return validations[i];
	                    }
	                }
	            }
	        };
	        return $delegate;
	    }
	    return HibachiServiceDecorator;
	})();
	exports.HibachiServiceDecorator = HibachiServiceDecorator;


/***/ },
/* 17 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var HibachiScope = (function () {
	    //@ngInject
	    function HibachiScope(appConfig) {
	        var _this = this;
	        this.loginDisplayed = false;
	        this.isValidToken = true;
	        this.setToken = function (token) {
	            _this.token = token;
	            var stringArray = token.split('.');
	            try {
	                _this.jwtInfo = angular.fromJson(window.atob(stringArray[0]).trim());
	                _this.session = angular.fromJson(window.atob(stringArray[1]).trim());
	            }
	            catch (err) {
	                _this.isValidToken = false;
	            }
	        };
	        this.config = appConfig;
	    }
	    return HibachiScope;
	})();
	exports.HibachiScope = HibachiScope;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var GlobalSearchController = (function () {
	    //@ngInject
	    function GlobalSearchController($scope, $log, $window, $timeout, $hibachi, rbkeyService) {
	        $scope.keywords = '';
	        $scope.searchResultsOpen = false;
	        $scope.sidebarClass = 'sidebar';
	        $scope.loading = false; //Set loading wheel to false
	        $scope.resultsFound = true; // Set the results Found to true because no search has been done yet
	        $scope.searchResults = {
	            'product': {
	                'title': 'Products',
	                'resultNameFilter': function (data) {
	                    return data['productName'];
	                },
	                'results': [],
	                'id': function (data) {
	                    return data['productID'];
	                }
	            },
	            'brand': {
	                'title': rbkeyService.getRBKey('entity.brand_plural'),
	                'resultNameFilter': function (data) {
	                    return data['brandName'];
	                },
	                'results': [],
	                'id': function (data) {
	                    return data['brandID'];
	                }
	            },
	            'account': {
	                'title': 'Accounts',
	                'resultNameFilter': function (data) {
	                    return data['firstName'] + ' ' + data['lastName'];
	                },
	                'results': [],
	                'id': function (data) {
	                    return data['accountID'];
	                }
	            },
	            'vendor': {
	                'title': 'Vendors',
	                'resultNameFilter': function (data) {
	                    return data['vendorName'];
	                },
	                'results': [],
	                'id': function (data) {
	                    return data['vendorID'];
	                }
	            }
	        };
	        var _timeoutPromise;
	        var _loadingCount = 0;
	        $scope.updateSearchResults = function () {
	            $scope.loading = true;
	            $scope.showResults();
	            if (_timeoutPromise) {
	                $timeout.cancel(_timeoutPromise);
	            }
	            _timeoutPromise = $timeout(function () {
	                // If no keywords, then set everything back to their defaults
	                if ($scope.keywords === '') {
	                    $scope.hideResults();
	                }
	                else {
	                    $scope.showResults();
	                    // Set the loadingCount to the number of AJAX Calls we are about to do
	                    _loadingCount = Object.keys($scope.searchResults).length;
	                    for (var entityName in $scope.searchResults) {
	                        (function (entityName) {
	                            var searchPromise = $hibachi.getEntity(entityName, { keywords: $scope.keywords, pageShow: 4, deferkey: 'global-search-' + entityName });
	                            searchPromise.then(function (data) {
	                                // Clear out the old Results
	                                $scope.searchResults[entityName].results = [];
	                                $scope.searchResults[entityName].title = rbkeyService.getRBKey('entity.' + entityName.toLowerCase() + '_plural');
	                                // push in the new results
	                                for (var i in data.pageRecords) {
	                                    $scope.searchResults[entityName].results.push({
	                                        'name': $scope.searchResults[entityName].resultNameFilter(data.pageRecords[i]),
	                                        'link': $hibachi.buildUrl('entity.detail' + entityName) + '&' + entityName + 'ID=' + $scope.searchResults[entityName].id(data.pageRecords[i]),
	                                    });
	                                }
	                                // Increment Down The Loading Count
	                                _loadingCount--;
	                                // If the loadingCount drops to 0, then we can update scope
	                                if (_loadingCount == 0) {
	                                    $scope.loading = false;
	                                    var _foundResults = false;
	                                    for (var _thisEntityName in $scope.searchResults) {
	                                        if ($scope.searchResults[_thisEntityName].results.length) {
	                                            _foundResults = true;
	                                            break;
	                                        }
	                                    }
	                                    $scope.resultsFound = _foundResults;
	                                }
	                            });
	                        })(entityName);
	                    }
	                }
	            }, 500);
	        };
	        $scope.showResults = function () {
	            $scope.searchResultsOpen = true;
	            $scope.sidebarClass = 'sidebar s-search-width';
	            $window.onclick = function (event) {
	                var _targetClassOfSearch = event.target.parentElement.offsetParent.classList.contains('sidebar');
	                if (!_targetClassOfSearch) {
	                    $scope.hideResults();
	                    $scope.$apply();
	                }
	            };
	        };
	        $scope.hideResults = function () {
	            $scope.searchResultsOpen = false;
	            $scope.sidebarClass = 'sidebar';
	            $scope.search.$setPristine();
	            $scope.keywords = "";
	            $window.onclick = null;
	            $scope.loading = false;
	            $scope.resultsFound = true;
	            for (var entityName in $scope.searchResults) {
	                $scope.searchResults[entityName].results = [];
	            }
	        };
	    }
	    return GlobalSearchController;
	})();
	exports.GlobalSearchController = GlobalSearchController;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var PercentageFilter = (function () {
	    function PercentageFilter() {
	    }
	    PercentageFilter.Factory = function () {
	        return function (input, decimals, suffix) {
	            decimals = angular.isNumber(decimals) ? decimals : 3;
	            suffix = suffix || '%';
	            if (isNaN(input)) {
	                return '';
	            }
	            return Math.round(input * Math.pow(10, decimals + 2)) / Math.pow(10, decimals) + suffix;
	        };
	    };
	    return PercentageFilter;
	})();
	exports.PercentageFilter = PercentageFilter;


/***/ },
/* 20 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var EntityRBKey = (function () {
	    function EntityRBKey() {
	    }
	    //@ngInject
	    EntityRBKey.Factory = function (rbkeyService) {
	        return function (text) {
	            if (angular.isDefined(text) && angular.isString(text)) {
	                text = text.replace('_', '').toLowerCase();
	                text = rbkeyService.getRBKey('entity.' + text);
	            }
	            return text;
	        };
	    };
	    return EntityRBKey;
	})();
	exports.EntityRBKey = EntityRBKey;


/***/ },
/* 21 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWTrim = (function () {
	    function SWTrim() {
	    }
	    //@ngInject
	    SWTrim.Factory = function (rbkeyService) {
	        return function (text, max, wordwise, tail) {
	            if (wordwise === void 0) { wordwise = true; }
	            if (tail === void 0) { tail = "..."; }
	            if (angular.isDefined(text) && angular.isString(text)) {
	                if (!text)
	                    return '';
	                max = parseInt(max, 10);
	                if (!max)
	                    return text;
	                if (text.length <= max)
	                    return text;
	                text = text.substr(0, max);
	                if (wordwise) {
	                    var lastSpace = text.lastIndexOf(' ');
	                    if (lastSpace != -1) {
	                        text = text.substr(0, lastSpace);
	                    }
	                }
	                return text + tail;
	            }
	            return text;
	        };
	    };
	    return SWTrim;
	})();
	exports.SWTrim = SWTrim;


/***/ },
/* 22 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWActionCallerController = (function () {
	    //@ngInject
	    function SWActionCallerController($scope, $element, $templateRequest, $compile, corePartialsPath, utilityService, $hibachi, rbkeyService, hibachiPathBuilder) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$element = $element;
	        this.$templateRequest = $templateRequest;
	        this.$compile = $compile;
	        this.corePartialsPath = corePartialsPath;
	        this.utilityService = utilityService;
	        this.$hibachi = $hibachi;
	        this.rbkeyService = rbkeyService;
	        this.init = function () {
	            //Check if is NOT a ngRouter
	            if (angular.isUndefined(_this.isAngularRoute)) {
	                _this.isAngularRoute = _this.utilityService.isAngularRoute();
	            }
	            if (!_this.isAngularRoute) {
	                _this.actionUrl = _this.$hibachi.buildUrl(_this.action, _this.queryString);
	            }
	            else {
	                _this.actionUrl = '#!/entity/' + _this.action + '/' + _this.queryString.split('=')[1];
	            }
	            //			this.class = this.utilityService.replaceAll(this.utilityService.replaceAll(this.getAction(),':',''),'.','') + ' ' + this.class;
	            _this.type = _this.type || 'link';
	            if (angular.isDefined(_this.titleRbKey)) {
	                _this.title = _this.rbkeyService.getRBKey(_this.titleRbKey);
	            }
	            if (angular.isUndefined(_this.text)) {
	                _this.text = _this.title;
	            }
	            if (_this.type == "button") {
	                //handle submit.
	                /** in order to attach the correct controller to local vm, we need a watch to bind */
	                var unbindWatcher = _this.$scope.$watch(function () { return _this.$scope.frmController; }, function (newValue, oldValue) {
	                    if (newValue !== undefined) {
	                        _this.formCtrl = newValue;
	                    }
	                    unbindWatcher();
	                });
	            }
	            //			this.actionItem = this.getActionItem();
	            //			this.actionItemEntityName = this.getActionItemEntityName();
	            //			this.text = this.getText();
	            //			if(this.getDisabled()){
	            //				this.getDisabledText();
	            //			}else if(this.getConfirm()){
	            //				this.getConfirmText();
	            //			}
	            //
	            //			if(this.modalFullWidth && !this.getDisabled()){
	            //				this.class = this.class + " modalload-fullwidth";
	            //			}
	            //
	            //			if(this.modal && !this.getDisabled() && !this.modalFullWidth){
	            //				this.class = this.class + " modalload";
	            //			}
	            /*need authentication lookup by api to disable
	            <cfif not attributes.hibachiScope.authenticateAction(action=attributes.action)>
	                <cfset attributes.class &= " disabled" />
	            </cfif>
	            */
	        };
	        this.submit = function () {
	            _this.formCtrl.submit(_this.action);
	        };
	        this.getAction = function () {
	            return _this.action || '';
	        };
	        this.getActionItem = function () {
	            return _this.utilityService.listLast(_this.getAction(), '.');
	        };
	        this.getActionItemEntityName = function () {
	            var firstFourLetters = _this.utilityService.left(_this.actionItem, 4);
	            var firstSixLetters = _this.utilityService.left(_this.actionItem, 6);
	            var minus4letters = _this.utilityService.right(_this.actionItem, 4);
	            var minus6letters = _this.utilityService.right(_this.actionItem, 6);
	            var actionItemEntityName = "";
	            if (firstFourLetters === 'list' && _this.actionItem.length > 4) {
	                actionItemEntityName = minus4letters;
	            }
	            else if (firstFourLetters === 'edit' && _this.actionItem.length > 4) {
	                actionItemEntityName = minus4letters;
	            }
	            else if (firstFourLetters === 'save' && _this.actionItem.length > 4) {
	                actionItemEntityName = minus4letters;
	            }
	            else if (firstSixLetters === 'create' && _this.actionItem.length > 6) {
	                actionItemEntityName = minus6letters;
	            }
	            else if (firstSixLetters === 'detail' && _this.actionItem.length > 6) {
	                actionItemEntityName = minus6letters;
	            }
	            else if (firstSixLetters === 'delete' && _this.actionItem.length > 6) {
	                actionItemEntityName = minus6letters;
	            }
	            return actionItemEntityName;
	        };
	        this.getTitle = function () {
	            //if title is undefined then use text
	            if (angular.isUndefined(_this.title) || !_this.title.length) {
	                _this.title = _this.getText();
	            }
	            return _this.title;
	        };
	        this.getTextByRBKeyByAction = function (actionItemType, plural) {
	            if (plural === void 0) { plural = false; }
	            var navRBKey = _this.rbkeyService.getRBKey('admin.define.' + actionItemType + '_nav');
	            var entityRBKey = '';
	            var replaceKey = '';
	            if (plural) {
	                entityRBKey = _this.rbkeyService.getRBKey('entity.' + _this.actionItemEntityName + '_plural');
	                replaceKey = '${itemEntityNamePlural}';
	            }
	            else {
	                entityRBKey = _this.rbkeyService.getRBKey('entity.' + _this.actionItemEntityName);
	                replaceKey = '${itemEntityName}';
	            }
	            return _this.utilityService.replaceAll(navRBKey, replaceKey, entityRBKey);
	        };
	        this.getText = function () {
	            //if we don't have text then make it up based on rbkeys
	            if (angular.isUndefined(_this.text) || (angular.isDefined(_this.text) && !_this.text.length)) {
	                _this.text = _this.rbkeyService.getRBKey(_this.utilityService.replaceAll(_this.getAction(), ":", ".") + '_nav');
	                var minus8letters = _this.utilityService.right(_this.text, 8);
	                //if rbkey is still missing. then can we infer it
	                if (minus8letters === '_missing') {
	                    var firstFourLetters = _this.utilityService.left(_this.actionItem, 4);
	                    var firstSixLetters = _this.utilityService.left(_this.actionItem, 6);
	                    var minus4letters = _this.utilityService.right(_this.actionItem, 4);
	                    var minus6letters = _this.utilityService.right(_this.actionItem, 6);
	                    if (firstFourLetters === 'list' && _this.actionItem.length > 4) {
	                        _this.text = _this.getTextByRBKeyByAction('list', true);
	                    }
	                    else if (firstFourLetters === 'edit' && _this.actionItem.length > 4) {
	                        _this.text = _this.getTextByRBKeyByAction('edit', false);
	                    }
	                    else if (firstFourLetters === 'save' && _this.actionItem.length > 4) {
	                        _this.text = _this.getTextByRBKeyByAction('save', false);
	                    }
	                    else if (firstSixLetters === 'create' && _this.actionItem.length > 6) {
	                        _this.text = _this.getTextByRBKeyByAction('create', false);
	                    }
	                    else if (firstSixLetters === 'detail' && _this.actionItem.length > 6) {
	                        _this.text = _this.getTextByRBKeyByAction('detail', false);
	                    }
	                    else if (firstSixLetters === 'delete' && _this.actionItem.length > 6) {
	                        _this.text = _this.getTextByRBKeyByAction('delete', false);
	                    }
	                }
	                if (_this.utilityService.right(_this.text, 8)) {
	                    _this.text = _this.rbkeyService.getRBKey(_this.utilityService.replaceAll(_this.getAction(), ":", "."));
	                }
	            }
	            if (!_this.title || (_this.title && !_this.title.length)) {
	                _this.title = _this.text;
	            }
	            return _this.text;
	        };
	        this.getDisabled = function () {
	            //if item is disabled
	            if (angular.isDefined(_this.disabled) && _this.disabled) {
	                return true;
	            }
	            else {
	                return false;
	            }
	        };
	        this.getDisabledText = function () {
	            if (_this.getDisabled()) {
	                //and no disabled text specified
	                if (angular.isUndefined(_this.disabledtext) || !_this.disabledtext.length) {
	                    var disabledrbkey = _this.utilityService.replaceAll(_this.action, ':', '.') + '_disabled';
	                    _this.disabledtext = _this.rbkeyService.getRBKey(disabledrbkey);
	                }
	                //add disabled class
	                _this.class += " btn-disabled";
	                _this.confirm = false;
	                return _this.disabledtext;
	            }
	            return "";
	        };
	        this.getConfirm = function () {
	            if (angular.isDefined(_this.confirm) && _this.confirm) {
	                return true;
	            }
	            else {
	                return false;
	            }
	        };
	        this.getConfirmText = function () {
	            if (_this.getConfirm()) {
	                if (angular.isUndefined(_this.confirmtext) && _this.confirmtext.length) {
	                    var confirmrbkey = _this.utilityService.replaceAll(_this.action, ':', '.') + '_confirm';
	                    _this.confirmtext = _this.rbkeyService.getRBKey(confirmrbkey);
	                }
	                _this.class += " alert-confirm";
	                return _this.confirm;
	            }
	            return "";
	        };
	        this.$scope = $scope;
	        this.$element = $element;
	        this.$templateRequest = $templateRequest;
	        this.$compile = $compile;
	        this.rbkeyService = rbkeyService;
	        this.$hibachi = $hibachi;
	        this.utilityService = utilityService;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.$templateRequest(this.hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "actioncaller.html").then(function (html) {
	            var template = angular.element(html);
	            _this.$element.parent().append(template);
	            $compile(template)($scope);
	            //need to perform init after promise completes
	            _this.init();
	        });
	    }
	    return SWActionCallerController;
	})();
	exports.SWActionCallerController = SWActionCallerController;
	var SWActionCaller = (function () {
	    function SWActionCaller(partialsPath, utiltiyService, $hibachi) {
	        this.partialsPath = partialsPath;
	        this.utiltiyService = utiltiyService;
	        this.$hibachi = $hibachi;
	        this.restrict = 'EA';
	        this.scope = {};
	        this.bindToController = {
	            action: "@",
	            text: "@",
	            type: "@",
	            queryString: "@",
	            title: "@?",
	            titleRbKey: "@?",
	            'class': "@",
	            icon: "@",
	            iconOnly: "=",
	            name: "@",
	            confirm: "=",
	            confirmtext: "@",
	            disabled: "=",
	            disabledtext: "@",
	            modal: "=",
	            modalFullWidth: "=",
	            id: "@",
	            isAngularRoute: "=?"
	        };
	        this.controller = SWActionCallerController;
	        this.controllerAs = "swActionCaller";
	        this.link = function (scope, element, attrs) {
	        };
	    }
	    SWActionCaller.Factory = function () {
	        var directive = function (partialsPath, utiltiyService, $hibachi) {
	            return new SWActionCaller(partialsPath, utiltiyService, $hibachi);
	        };
	        directive.$inject = [
	            'partialsPath',
	            'utilityService',
	            '$hibachi'
	        ];
	        return directive;
	    };
	    return SWActionCaller;
	})();
	exports.SWActionCaller = SWActionCaller;


/***/ },
/* 23 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWTypeaheadSearchController = (function () {
	    // @ngInject
	    function SWTypeaheadSearchController($scope, $q, $transclude, $hibachi, $timeout, utilityService, rbkeyService, collectionConfigService) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$q = $q;
	        this.$transclude = $transclude;
	        this.$hibachi = $hibachi;
	        this.$timeout = $timeout;
	        this.utilityService = utilityService;
	        this.rbkeyService = rbkeyService;
	        this.collectionConfigService = collectionConfigService;
	        this.columns = [];
	        this.filters = [];
	        this.clearSearch = function () {
	            _this.searchText = "";
	            _this.hideSearch = true;
	            if (angular.isDefined(_this.addFunction)) {
	                _this.addFunction()(undefined);
	            }
	        };
	        this.toggleOptions = function () {
	            if (_this.hideSearch && !_this.searchText.length) {
	                _this.search(_this.searchText);
	            }
	            else {
	                _this.hideSearch = !_this.hideSearch;
	            }
	        };
	        this.search = function (search) {
	            if (_this._timeoutPromise) {
	                _this.$timeout.cancel(_this._timeoutPromise);
	            }
	            _this.collectionConfig.setKeywords(search);
	            if (angular.isDefined(_this.filterGroupsConfig)) {
	                //allows for filtering on search text
	                var filterConfig = _this.filterGroupsConfig.replace("replaceWithSearchString", search);
	                filterConfig = filterConfig.trim();
	                _this.collectionConfig.loadFilterGroups(JSON.parse(filterConfig));
	            }
	            _this._timeoutPromise = _this.$timeout(function () {
	                var promise = _this.collectionConfig.getEntity();
	                promise.then(function (response) {
	                    if (angular.isDefined(_this.allRecords) && _this.allRecords == false) {
	                        _this.results = response.pageRecords;
	                    }
	                    else {
	                        _this.results = response.records;
	                    }
	                }).finally(function () {
	                    _this.resultsDeferred.resolve();
	                    _this.hideSearch = (_this.results.length == 0);
	                });
	            }, 500);
	        };
	        this.addItem = function (item) {
	            if (!_this.hideSearch) {
	                _this.hideSearch = true;
	            }
	            if (angular.isDefined(_this.propertyToShow)) {
	                _this.searchText = item[_this.propertyToShow];
	            }
	            else if (angular.isDefined(_this.columns) &&
	                _this.columns.length &&
	                angular.isDefined(_this.columns[0].propertyIdentifier)) {
	                _this.searchText = item[_this.columns[0].propertyIdentifier];
	            }
	            if (angular.isDefined(_this.addFunction)) {
	                _this.addFunction()(item);
	            }
	        };
	        this.addButtonItem = function () {
	            if (!_this.hideSearch) {
	                _this.hideSearch = true;
	            }
	            if (angular.isDefined(_this.addButtonFunction)) {
	                _this.addButtonFunction()(_this.searchText);
	            }
	        };
	        this.viewButtonClick = function () {
	            _this.viewFunction()();
	        };
	        this.closeThis = function (clickOutsideArgs) {
	            _this.hideSearch = true;
	            if (angular.isDefined(clickOutsideArgs)) {
	                for (var callBackAction in clickOutsideArgs.callBackActions) {
	                    clickOutsideArgs.callBackActions[callBackAction]();
	                }
	            }
	        };
	        //populates all needed variables
	        this.$transclude($scope, function () { });
	        this.resultsDeferred = $q.defer();
	        this.resultsPromise = this.resultsDeferred.promise;
	        if (angular.isUndefined(this.searchText) || this.searchText == null) {
	            this.searchText = "";
	        }
	        if (angular.isUndefined(this.results)) {
	            this.results = [];
	        }
	        if (angular.isUndefined(this.validateRequired)) {
	            this.validateRequired = false;
	        }
	        if (angular.isUndefined(this.hideSearch)) {
	            this.hideSearch = true;
	        }
	        if (angular.isUndefined(this.collectionConfig)) {
	            if (angular.isDefined(this.entity)) {
	                this.collectionConfig = collectionConfigService.newCollectionConfig(this.entity);
	            }
	            else {
	                throw ("You did not pass the correct collection config data to swTypeaheadSearch");
	            }
	        }
	        if (angular.isDefined(this.placeholderRbKey)) {
	            this.placeholderText = this.rbkeyService.getRBKey(this.placeholderRbKey);
	        }
	        else if (angular.isUndefined(this.placeholderText)) {
	            this.placeholderText = this.rbkeyService.getRBKey('define.search');
	        }
	        if (angular.isDefined(this.addButtonFunction)) {
	            console.warn("there is an add button function");
	            this.showAddButton = true;
	        }
	        if (angular.isDefined(this.viewFunction)) {
	            this.showViewButton = true;
	        }
	        //init timeoutPromise for link
	        this._timeoutPromise = this.$timeout(function () { }, 500);
	        if (angular.isDefined(this.propertiesToDisplay)) {
	            this.collectionConfig.addDisplayProperty(this.propertiesToDisplay.split(","));
	        }
	        angular.forEach(this.columns, function (column) {
	            _this.collectionConfig.addDisplayProperty(column.propertyIdentifier, '', column);
	        });
	        angular.forEach(this.filters, function (filter) {
	            _this.collectionConfig.addFilter(filter.propertyIdentifier, filter.comparisonValue, filter.comparisonOperator, filter.logicalOperator, filter.hidden);
	        });
	        if (angular.isDefined(this.allRecords)) {
	            this.collectionConfig.setAllRecords(this.allRecords);
	        }
	        else {
	            this.collectionConfig.setAllRecords(true);
	        }
	        if (angular.isDefined(this.maxRecords)) {
	            this.collectionConfig.setPageShow(this.maxRecords);
	        }
	    }
	    return SWTypeaheadSearchController;
	})();
	exports.SWTypeaheadSearchController = SWTypeaheadSearchController;
	var SWTypeaheadSearch = (function () {
	    // @ngInject
	    function SWTypeaheadSearch($compile, corePartialsPath, hibachiPathBuilder) {
	        var _this = this;
	        this.$compile = $compile;
	        this.corePartialsPath = corePartialsPath;
	        this.transclude = true;
	        this.restrict = "EA";
	        this.scope = {};
	        this.bindToController = {
	            collectionConfig: "=?",
	            entity: "@?",
	            properties: "@?",
	            propertiesToDisplay: "@?",
	            filterGroupsConfig: "@?",
	            placeholderText: "@?",
	            placeholderRbKey: "@?",
	            searchText: "=?",
	            results: "=?",
	            addFunction: "&?",
	            addButtonFunction: "&?",
	            viewFunction: "&?",
	            validateRequired: "=?",
	            clickOutsideArguments: "=?",
	            propertyToShow: "=?",
	            hideSearch: "=?",
	            allRecords: "=?",
	            maxRecords: "=?",
	            disabled: "=?"
	        };
	        this.controller = SWTypeaheadSearchController;
	        this.controllerAs = "swTypeaheadSearch";
	        this.compile = function (element, attrs, transclude) {
	            return {
	                pre: function ($scope, element, attrs) { },
	                post: function ($scope, element, attrs) {
	                    var target = element.find(".dropdown-menu");
	                    var listItemTemplate = angular.element('<li ng-repeat="item in swTypeaheadSearch.results"></li>');
	                    var actionTemplate = angular.element('<a ng-click="swTypeaheadSearch.addItem(item)" ></a>');
	                    var transcludeContent = transclude($scope, function () { });
	                    //strip out the ng-transclude if this typeahead exists inside typeaheadinputfield directive (causes infinite compilation error)
	                    for (var i = 0; i < transcludeContent.length; i++) {
	                        if (angular.isDefined(transcludeContent[i].localName) &&
	                            transcludeContent[i].localName == 'ng-transclude') {
	                            transcludeContent = transcludeContent.children();
	                        }
	                    }
	                    //prevent collection config from being recompiled  (also causes infinite compilation error)
	                    for (var i = 0; i < transcludeContent.length; i++) {
	                        if (angular.isDefined(transcludeContent[i].localName) &&
	                            transcludeContent[i].localName == 'sw-collection-config') {
	                            transcludeContent.splice(i, 1);
	                        }
	                    }
	                    actionTemplate.append(transcludeContent);
	                    listItemTemplate.append(actionTemplate);
	                    $scope.swTypeaheadSearch.resultsPromise.then(function () {
	                        target.append(_this.$compile(listItemTemplate)($scope));
	                    });
	                }
	            };
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "typeaheadsearch.html";
	    }
	    SWTypeaheadSearch.Factory = function () {
	        var directive = function ($compile, corePartialsPath, hibachiPathBuilder) {
	            return new SWTypeaheadSearch($compile, corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ["$compile", "corePartialsPath",
	            'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWTypeaheadSearch;
	})();
	exports.SWTypeaheadSearch = SWTypeaheadSearch;


/***/ },
/* 24 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWTypeaheadInputFieldController = (function () {
	    // @ngInject
	    function SWTypeaheadInputFieldController($scope, $q, $transclude, $hibachi, $timeout, utilityService, collectionConfigService) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$q = $q;
	        this.$transclude = $transclude;
	        this.$hibachi = $hibachi;
	        this.$timeout = $timeout;
	        this.utilityService = utilityService;
	        this.collectionConfigService = collectionConfigService;
	        this.columns = [];
	        this.filters = [];
	        this.addFunction = function (value) {
	            _this.modelValue = value[_this.propertyToSave];
	        };
	        if (angular.isUndefined(this.allRecords)) {
	            this.allRecords = false;
	        }
	        if (angular.isUndefined(this.maxRecords)) {
	            this.maxRecords = 100;
	        }
	        if (angular.isUndefined(this.entityName)) {
	            throw ("The typeahead input field directive requires an entity name.");
	        }
	        if (angular.isUndefined(this.propertyToSave)) {
	            throw ("You must select a property to save for the input field directive");
	        }
	        this.typeaheadCollectionConfig = collectionConfigService.newCollectionConfig(this.entityName);
	        //populate the display list
	        this.$transclude($scope, function () { });
	        if (angular.isDefined(this.propertiesToLoad)) {
	            this.typeaheadCollectionConfig.addDisplayProperty(this.propertiesToLoad);
	        }
	        angular.forEach(this.columns, function (column) {
	            _this.typeaheadCollectionConfig.addDisplayProperty(column.propertyIdentifier, '', column);
	        });
	        angular.forEach(this.filters, function (filter) {
	            _this.typeaheadCollectionConfig.addFilter(filter.propertyIdentifier, filter.comparisonValue, filter.comparisonOperator, filter.logicalOperator, filter.hidden);
	        });
	    }
	    return SWTypeaheadInputFieldController;
	})();
	exports.SWTypeaheadInputFieldController = SWTypeaheadInputFieldController;
	var SWTypeaheadInputField = (function () {
	    // @ngInject
	    function SWTypeaheadInputField(corePartialsPath, hibachiPathBuilder) {
	        this.corePartialsPath = corePartialsPath;
	        this.transclude = true;
	        this.restrict = "EA";
	        this.scope = {};
	        this.priority = 100;
	        this.bindToController = {
	            fieldName: "@",
	            entityName: "@",
	            allRecords: "=?",
	            maxRecords: "@",
	            propertiesToLoad: "@?",
	            placeholderRbKey: "@?",
	            propertyToShow: "@",
	            propertyToSave: "@"
	        };
	        this.controller = SWTypeaheadInputFieldController;
	        this.controllerAs = "swTypeaheadInputField";
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "typeaheadinputfield.html";
	    }
	    SWTypeaheadInputField.Factory = function () {
	        var directive = function (corePartialsPath, hibachiPathBuilder) {
	            return new SWTypeaheadInputField(corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ["corePartialsPath", 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWTypeaheadInputField;
	})();
	exports.SWTypeaheadInputField = SWTypeaheadInputField;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	var SWTypeaheadSearchLineItemController = (function () {
	    function SWTypeaheadSearchLineItemController() {
	    }
	    return SWTypeaheadSearchLineItemController;
	})();
	exports.SWTypeaheadSearchLineItemController = SWTypeaheadSearchLineItemController;
	var SWTypeaheadSearchLineItem = (function () {
	    //@ngInject
	    function SWTypeaheadSearchLineItem($compile) {
	        this.$compile = $compile;
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            propertyIdentifier: "@",
	            isSearchable: "@?",
	        };
	        this.controller = SWTypeaheadSearchLineItemController;
	        this.controllerAs = "swTypeaheadSearchLineItem";
	        this.compile = function (element, attrs, transclude) {
	            return {
	                pre: function (scope, element, attrs) {
	                    var innerHTML = '<span ng-bind="item.' + scope.swTypeaheadSearchLineItem.propertyIdentifier + '"></span>';
	                    element.append(innerHTML);
	                },
	                post: function (scope, element, attrs) { }
	            };
	        };
	    }
	    SWTypeaheadSearchLineItem.Factory = function () {
	        var directive = function ($compile) {
	            return new SWTypeaheadSearchLineItem($compile);
	        };
	        directive.$inject = [
	            '$compile'
	        ];
	        return directive;
	    };
	    return SWTypeaheadSearchLineItem;
	})();
	exports.SWTypeaheadSearchLineItem = SWTypeaheadSearchLineItem;


/***/ },
/* 26 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	var SWCollectionConfigController = (function () {
	    //@ngInject
	    function SWCollectionConfigController(collectionConfigService) {
	        this.collectionConfigService = collectionConfigService;
	        this.filters = [];
	        this.columns = [];
	    }
	    return SWCollectionConfigController;
	})();
	exports.SWCollectionConfigController = SWCollectionConfigController;
	var SWCollectionConfig = (function () {
	    //@ngInject
	    function SWCollectionConfig(collectionConfigService) {
	        var _this = this;
	        this.collectionConfigService = collectionConfigService;
	        this.restrict = 'EA';
	        this.scope = true;
	        this.transclude = true;
	        this.bindToController = {
	            entityName: "@",
	            allRecords: "@?",
	            parentDirectiveControllerAsName: "@",
	            collectionConfigProperty: "@?"
	        };
	        this.controller = SWCollectionConfigController;
	        this.controllerAs = "swCollectionConfig";
	        this.compile = function (element, attrs, transclude) {
	            return {
	                pre: function (scope, element, attrs) {
	                    if (angular.isUndefined(scope.swCollectionConfig.entityName)) {
	                        throw ("You must provide an entityname to swCollectionConfig");
	                    }
	                    if (angular.isUndefined(scope.swCollectionConfig.parentDirectiveControllerAsName)) {
	                        throw ("You must privde the parent directives Controller-As Name to swCollectionConfig");
	                    }
	                    if (angular.isUndefined(scope.swCollectionConfig.collectionConfigProperty)) {
	                        scope.swCollectionConfig.collectionConfigProperty = "collectionConfig";
	                    }
	                    if (angular.isUndefined(scope.swCollectionConfig.allRecords)) {
	                        scope.swCollectionConfig.allRecords = false;
	                    }
	                    var newCollectionConfig = _this.collectionConfigService.newCollectionConfig(scope.swCollectionConfig.entityName);
	                    newCollectionConfig.setAllRecords(scope.swCollectionConfig.allRecords);
	                    var parentScope = scope.$parent;
	                    for (var tries = 0; tries < 3; tries++) {
	                        if (tries > 0) {
	                            var parentScope = parentScope.$parent;
	                        }
	                        if (angular.isDefined(parentScope)) {
	                            var parentDirective = parentScope[scope.swCollectionConfig.parentDirectiveControllerAsName];
	                        }
	                        if (angular.isDefined(parentDirective)) {
	                            break;
	                        }
	                    }
	                    //populate the columns and the filters
	                    transclude(scope, function () { });
	                    angular.forEach(scope.swCollectionConfig.columns, function (column) {
	                        newCollectionConfig.addDisplayProperty(column.propertyIdentifier, '', column);
	                    });
	                    angular.forEach(scope.swCollectionConfig.filters, function (filter) {
	                        newCollectionConfig.addFilter(filter.propertyIdentifier, filter.comparisonValue, filter.comparisonOperator, filter.logicalOperator, filter.hidden);
	                    });
	                    if (angular.isDefined(parentDirective)) {
	                        parentDirective[scope.swCollectionConfig.collectionConfigProperty] = newCollectionConfig;
	                    }
	                },
	                post: function (scope, element, attrs) { }
	            };
	        };
	    }
	    SWCollectionConfig.Factory = function () {
	        var directive = function (collectionConfigService) {
	            return new SWCollectionConfig(collectionConfigService);
	        };
	        directive.$inject = [
	            'collectionConfigService'
	        ];
	        return directive;
	    };
	    return SWCollectionConfig;
	})();
	exports.SWCollectionConfig = SWCollectionConfig;


/***/ },
/* 27 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	var SWCollectionFilterController = (function () {
	    function SWCollectionFilterController() {
	    }
	    return SWCollectionFilterController;
	})();
	exports.SWCollectionFilterController = SWCollectionFilterController;
	var SWCollectionFilter = (function () {
	    //@ngInject
	    function SWCollectionFilter(utilityService) {
	        this.utilityService = utilityService;
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            propertyIdentifier: "@",
	            comparisonOperator: "@?",
	            comparisonValue: "@?",
	            logicalOperator: "@?",
	            hidden: "@?"
	        };
	        this.controller = SWCollectionFilterController;
	        this.controllerAs = "SWCollectionFilter";
	        this.link = function (scope, element, attrs) {
	            var filter = {
	                propertyIdentifier: scope.SWCollectionFilter.propertyIdentifier,
	                comparisonOperator: scope.SWCollectionFilter.comparisonOperator,
	                comparisonValue: scope.SWCollectionFilter.comparisonValue,
	                logicalOperator: scope.SWCollectionFilter.logicalOperator,
	                hidden: scope.SWCollectionFilter.hidden
	            };
	            if (angular.isDefined(scope.swCollectionConfig)) {
	                scope.swCollectionConfig.filters.push(filter);
	            }
	        };
	    }
	    SWCollectionFilter.Factory = function () {
	        var directive = function (utilityService) {
	            return new SWCollectionFilter(utilityService);
	        };
	        directive.$inject = [
	            'utilityService'
	        ];
	        return directive;
	    };
	    return SWCollectionFilter;
	})();
	exports.SWCollectionFilter = SWCollectionFilter;


/***/ },
/* 28 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	var SWCollectionColumnController = (function () {
	    function SWCollectionColumnController() {
	    }
	    return SWCollectionColumnController;
	})();
	exports.SWCollectionColumnController = SWCollectionColumnController;
	var SWCollectionColumn = (function () {
	    //@ngInject
	    function SWCollectionColumn(utilityService) {
	        this.utilityService = utilityService;
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            propertyIdentifier: "@",
	            isVisible: "@?",
	            isSearchable: "@?",
	            isDeletable: "@?",
	            isExportable: "@?",
	            hidden: "@?"
	        };
	        this.controller = SWCollectionColumn;
	        this.controllerAs = "swCollectionColumn";
	        this.template = "";
	        this.link = function (scope, element, attrs) {
	            var column = {
	                propertyIdentifier: scope.swCollectionColumn.propertyIdentifier,
	                isVisible: scope.swCollectionColumn.isVisible,
	                isSearchable: scope.swCollectionColumn.isSearchable,
	                isDeletable: scope.swCollectionColumn.isDeletable,
	                isExportable: scope.swCollectionColumn.isExportable,
	                hidden: scope.swCollectionColumn.hidden
	            };
	            if (angular.isDefined(scope.swCollectionConfig)) {
	                scope.swCollectionConfig.columns.push(column);
	            }
	        };
	    }
	    SWCollectionColumn.Factory = function () {
	        var directive = function (utilityService) {
	            return new SWCollectionColumn(utilityService);
	        };
	        directive.$inject = [
	            'utilityService'
	        ];
	        return directive;
	    };
	    return SWCollectionColumn;
	})();
	exports.SWCollectionColumn = SWCollectionColumn;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWActionCallerDropdownController = (function () {
	    function SWActionCallerDropdownController() {
	        this.title = this.title || '';
	        this.icon = this.icon || 'plus';
	        this.type = this.type || 'button';
	        this.dropdownClass = this.dropdownClass || '';
	        this.dropdownId = this.dropdownId || '';
	        this.buttonClass = this.buttonClass || 'btn-primary';
	    }
	    return SWActionCallerDropdownController;
	})();
	exports.SWActionCallerDropdownController = SWActionCallerDropdownController;
	var SWActionCallerDropdown = (function () {
	    function SWActionCallerDropdown(corePartialsPath, hibachiPathBuilder) {
	        this.corePartialsPath = corePartialsPath;
	        this.restrict = 'E';
	        this.scope = {};
	        this.transclude = true;
	        this.bindToController = {
	            title: "@",
	            icon: "@",
	            type: "=",
	            dropdownClass: "@",
	            dropdownId: "@",
	            buttonClass: "@"
	        };
	        this.controller = SWActionCallerDropdownController;
	        this.controllerAs = "swActionCallerDropdown";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + 'actioncallerdropdown.html';
	    }
	    SWActionCallerDropdown.Factory = function () {
	        var directive = function (corePartialsPath, hibachiPathBuilder) { return new SWActionCallerDropdown(corePartialsPath, hibachiPathBuilder); };
	        directive.$inject = ['corePartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWActionCallerDropdown;
	})();
	exports.SWActionCallerDropdown = SWActionCallerDropdown;


/***/ },
/* 30 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWColumnSorter = (function () {
	    //@ngInject
	    function SWColumnSorter($log, observerService, corePartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'AE',
	            scope: {
	                column: "=",
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "columnsorter.html",
	            link: function (scope, element, attrs) {
	                var orderBy = {
	                    "propertyIdentifier": scope.column.propertyIdentifier,
	                };
	                scope.sortAsc = function () {
	                    orderBy.direction = 'Asc';
	                    this.observerService.notify('sortByColumn', orderBy);
	                };
	                scope.sortDesc = function () {
	                    orderBy.direction = 'Desc';
	                    observerService.notify('sortByColumn', orderBy);
	                };
	            }
	        };
	    }
	    SWColumnSorter.Factory = function () {
	        var directive = function ($log, observerService, corePartialsPath, hibachiPathBuilder) {
	            return new SWColumnSorter($log, observerService, corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            'observerService',
	            'corePartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWColumnSorter;
	})();
	exports.SWColumnSorter = SWColumnSorter;


/***/ },
/* 31 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * <------------------------------------------------------------------------------------------------------------------------------------>
	 *   This directive can be used to prompt the user with a confirmation dialog.
	 *
	 *   Example Usage 1:
	 *   <a swconfirm
	 *   						use-rb-key=true
	 * 							yes-text="define.yes"
	 * 							no-text="define.no"
	 * 							confirm-text="define.confirm"
	 * 							message-text="define.delete.message"
	 * 							callback="someFunction()">
	 *   </a>
	 *   Alternate Version (No Rbkeys):
	 *   <a swconfirm
	 *   						use-rb-key=false
	 * 							yes-text="Sure"
	 * 							no-text="Not Sure!"
	 * 							confirm-text="Sure"
	 * 							message-text="Are you sure?"
	 * 							callback="sure()">
	 *   </a>
	 *
	 *   Note: Because the template is dynamic, the following keywords can not be used anywhere in the text for this modal.
	 *
	 *   [yes] [no] [confirm] [message] [callback]
	 *
	 *   The above words in upper-case can be used - just not those words inside square brackets.
	 *   Note: Your callback function on-confirm should return true;
	 *<------------------------------------------------------------------------------------------------------------------------------------->
	 */
	var SWConfirm = (function () {
	    //@ngInject
	    function SWConfirm($hibachi, $log, $compile, $modal, partialsPath) {
	        var buildConfirmationModal = function (simple, useRbKey, confirmText, messageText, noText, yesText) {
	            /* Keys */
	            var confirmKey = "[confirm]";
	            var messageKey = "[message]";
	            var noKey = "[no]";
	            var yesKey = "[yes]";
	            var swRbKey = "sw-rbkey=";
	            /* Values */
	            var confirmVal = "<confirm>";
	            var messageVal = "<message>";
	            var noVal = "<no>";
	            var yesVal = "<yes>";
	            /* Parse Tags */
	            var startTag = "\"'";
	            var endTag = "'\"";
	            var startParen = "'";
	            var endParen = "'";
	            var empty = "";
	            /* Modal String */
	            var parsedKeyString = "";
	            var finishedString = "";
	            //Figure out which version of this tag we are using
	            var templateString = "<div>" +
	                "<div class='modal-header'><a class='close' data-dismiss='modal' ng-click='cancel()'>×</a><h3 [confirm]><confirm></h3></div>" +
	                "<div class='modal-body' [message]>" + "<message>" + "</div>" +
	                "<div class='modal-footer'>" +
	                "<button class='btn btn-sm btn-default btn-inverse' ng-click='cancel()' [no]><no></button>" +
	                "<button class='btn btn-sm btn-default btn-primary' ng-click='fireCallback(callback)' [yes]><yes></button></div></div></div>";
	            /* Use RbKeys or Not? */
	            if (useRbKey === "true") {
	                $log.debug("Using RbKey? " + useRbKey);
	                /* Then decorate the template with the keys. */
	                confirmText = swRbKey + startTag + confirmText + endTag;
	                messageText = swRbKey + startTag + messageText + endTag;
	                yesText = swRbKey + startTag + yesText + endTag;
	                noText = swRbKey + startTag + noText + endTag;
	                parsedKeyString = templateString.replace(confirmKey, confirmText)
	                    .replace(messageText, messageText)
	                    .replace(noKey, noText)
	                    .replace(yesKey, yesText);
	                $log.debug(finishedString);
	                finishedString = parsedKeyString.replace(confirmKey, empty)
	                    .replace(messageVal, empty)
	                    .replace(noVal, empty)
	                    .replace(yesVal, empty);
	                $log.debug(finishedString);
	                return finishedString;
	            }
	            else {
	                /* Then decorate the template without the keys. */
	                $log.debug("Using RbKey? " + useRbKey);
	                parsedKeyString = templateString.replace(confirmVal, confirmText)
	                    .replace(messageVal, messageText)
	                    .replace(noVal, noText)
	                    .replace(yesVal, yesText);
	                finishedString = parsedKeyString.replace(confirmKey, empty)
	                    .replace(messageKey, empty)
	                    .replace(noKey, empty)
	                    .replace(yesKey, empty);
	                $log.debug(finishedString);
	                return finishedString;
	            }
	        };
	        return {
	            restrict: 'EA',
	            scope: {
	                callback: "&",
	                entity: "="
	            },
	            link: function (scope, element, attr) {
	                /* Grab the template and build the modal on click */
	                $log.debug("Modal is: ");
	                $log.debug($modal);
	                element.bind('click', function () {
	                    /* Default Values */
	                    var useRbKey = attr.useRbKey || "false";
	                    var simple = attr.simple || false;
	                    var yesText = attr.yesText || "define.yes";
	                    var noText = attr.noText || "define.no";
	                    var confirmText = attr.confirmText || "define.delete";
	                    var messageText = attr.messageText || "define.delete_message";
	                    var templateString = buildConfirmationModal(simple, useRbKey, confirmText, messageText, noText, yesText);
	                    var modalInstance = $modal.open({
	                        template: templateString,
	                        controller: 'confirmationController',
	                        scope: scope
	                    });
	                    /**
	                        * Handles the result - callback or dismissed
	                        */
	                    modalInstance.result.then(function (result) {
	                        $log.debug("Result:" + result);
	                        return true;
	                    }, function () {
	                        //There was an error
	                    });
	                }); //<--end bind
	            }
	        };
	    }
	    SWConfirm.Factory = function () {
	        var directive = function ($hibachi, $log, $compile, $modal, partialsPath) {
	            return new SWConfirm($hibachi, $log, $compile, $modal, partialsPath);
	        };
	        directive.$inject = ['$hibachi', '$log', '$compile', '$modal', 'partialsPath'];
	        return directive;
	    };
	    return SWConfirm;
	})();
	exports.SWConfirm = SWConfirm;


/***/ },
/* 32 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWEntityActionBarController = (function () {
	    //@ngInject
	    function SWEntityActionBarController(rbkeyService) {
	        var _this = this;
	        this.rbkeyService = rbkeyService;
	        this.init = function () {
	            if (angular.isDefined(_this.pageTitleRbKey)) {
	                _this.pageTitle = _this.rbkeyService.getRBKey(_this.pageTitleRbKey);
	            }
	        };
	        this.init();
	    }
	    return SWEntityActionBarController;
	})();
	var SWEntityActionBar = (function () {
	    //@ngInject
	    function SWEntityActionBar(corePartialsPath, hibachiPathBuilder) {
	        this.corePartialsPath = corePartialsPath;
	        this.restrict = 'E';
	        this.scope = {};
	        this.transclude = true;
	        this.bindToController = {
	            /*Core settings*/
	            type: "@",
	            object: "=",
	            pageTitle: "@?",
	            pageTitleRbKey: "@?",
	            edit: "=",
	            /*Action Callers (top buttons)*/
	            showcancel: "=",
	            showcreate: "=",
	            showedit: "=",
	            showdelete: "=",
	            /*Basic Action Caller Overrides*/
	            createModal: "=",
	            createAction: "=",
	            createQueryString: "=",
	            backAction: "=",
	            backQueryString: "=",
	            cancelAction: "=",
	            cancelQueryString: "=",
	            deleteAction: "=",
	            deleteQueryString: "=",
	            /*Process Specific Values*/
	            processAction: "=",
	            processContext: "="
	        };
	        this.controller = SWEntityActionBarController;
	        this.controllerAs = "swEntityActionBar";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + 'entityactionbar.html';
	    }
	    SWEntityActionBar.Factory = function () {
	        var directive = function (corePartialsPath, hibachiPathBuilder) {
	            return new SWEntityActionBar(corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['corePartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWEntityActionBar;
	})();
	exports.SWEntityActionBar = SWEntityActionBar;
	//	angular.module('slatwalladmin').directive('swEntityActionBar',['corePartialsPath',(corePartialsPath) => new SWEntityActionBar(corePartialsPath)]);


/***/ },
/* 33 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWEntityActionBarButtonGroupController = (function () {
	    function SWEntityActionBarButtonGroupController() {
	    }
	    return SWEntityActionBarButtonGroupController;
	})();
	var SWEntityActionBarButtonGroup = (function () {
	    //@ngInject
	    function SWEntityActionBarButtonGroup(corePartialsPath, hibachiPathBuilder) {
	        this.corePartialsPath = corePartialsPath;
	        this.restrict = 'E';
	        this.scope = {};
	        this.transclude = true;
	        this.bindToController = {};
	        this.controller = SWEntityActionBarButtonGroupController;
	        this.controllerAs = "swEntityActionBarButtonGroup";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + 'entityactionbarbuttongroup.html';
	    }
	    SWEntityActionBarButtonGroup.Factory = function () {
	        var directive = function (corePartialsPath, hibachiPathBuilder) {
	            return new SWEntityActionBarButtonGroup(corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['corePartialsPath',
	            'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWEntityActionBarButtonGroup;
	})();
	exports.SWEntityActionBarButtonGroup = SWEntityActionBarButtonGroup;


/***/ },
/* 34 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWExpandableRecordController = (function () {
	    //@ngInject
	    function SWExpandableRecordController($timeout, utilityService, $hibachi, collectionConfigService, expandableService) {
	        var _this = this;
	        this.$timeout = $timeout;
	        this.utilityService = utilityService;
	        this.$hibachi = $hibachi;
	        this.collectionConfigService = collectionConfigService;
	        this.expandableService = expandableService;
	        this.childrenLoaded = false;
	        this.childrenOpen = false;
	        this.children = [];
	        this.toggleChild = function () {
	            _this.$timeout(function () {
	                _this.childrenOpen = !_this.childrenOpen;
	                _this.expandableService.updateState(_this.recordID, { isOpen: _this.childrenOpen });
	                if (!_this.childrenLoaded) {
	                    var childCollectionConfig = _this.collectionConfigService.newCollectionConfig(_this.entity.metaData.className);
	                    //set up parent
	                    var parentName = _this.entity.metaData.hb_parentPropertyName;
	                    var parentCFC = _this.entity.metaData[parentName].cfc;
	                    var parentIDName = _this.$hibachi.getEntityExample(parentCFC).$$getIDName();
	                    //set up child
	                    var childName = _this.entity.metaData.hb_childPropertyName;
	                    var childCFC = _this.entity.metaData[childName].cfc;
	                    var childIDName = _this.$hibachi.getEntityExample(childCFC).$$getIDName();
	                    childCollectionConfig.clearFilterGroups();
	                    childCollectionConfig.collection = _this.entity;
	                    childCollectionConfig.addFilter(parentName + '.' + parentIDName, _this.parentId);
	                    childCollectionConfig.setAllRecords(true);
	                    angular.forEach(_this.collectionConfig.columns, function (column) {
	                        childCollectionConfig.addColumn(column.propertyIdentifier, column.title, column);
	                    });
	                    angular.forEach(_this.collectionConfig.joins, function (join) {
	                        childCollectionConfig.addJoin(join);
	                    });
	                    childCollectionConfig.groupBys = _this.collectionConfig.groupBys;
	                    _this.collectionPromise = childCollectionConfig.getEntity();
	                    _this.collectionPromise.then(function (data) {
	                        _this.collectionData = data;
	                        _this.collectionData.pageRecords = _this.collectionData.pageRecords || _this.collectionData.records;
	                        if (_this.collectionData.pageRecords.length) {
	                            angular.forEach(_this.collectionData.pageRecords, function (pageRecord) {
	                                _this.expandableService.addRecord(pageRecord[parentIDName], true);
	                                pageRecord.dataparentID = _this.recordID;
	                                pageRecord.depth = _this.recordDepth || 0;
	                                pageRecord.depth++;
	                                //push the children into the listing display
	                                _this.children.push(pageRecord);
	                                _this.records.splice(_this.recordIndex + 1, 0, pageRecord);
	                            });
	                        }
	                        _this.childrenLoaded = true;
	                    });
	                }
	                angular.forEach(_this.children, function (child) {
	                    child.dataIsVisible = _this.childrenOpen;
	                    var entityPrimaryIDName = _this.entity.$$getIDName();
	                    var idsToCheck = [];
	                    idsToCheck.push(child[entityPrimaryIDName]);
	                    _this.expandableService.updateState(child[entityPrimaryIDName], { isOpen: _this.childrenOpen });
	                    //close all children of the child if we are closing
	                    var childrenTraversed = false;
	                    var recordLength = _this.records.length;
	                    while (!childrenTraversed && idsToCheck.length > 0) {
	                        var found = false;
	                        var idToCheck = idsToCheck.pop();
	                        for (var i = 0; i < recordLength; i++) {
	                            var record = _this.records[i];
	                            if (record['dataparentID'] == idToCheck) {
	                                idsToCheck.push(record[entityPrimaryIDName]);
	                                _this.expandableService.updateState(record[entityPrimaryIDName], { isOpen: _this.childrenOpen });
	                                record.dataIsVisible = _this.childrenOpen;
	                                found = true;
	                            }
	                        }
	                        if (!found) {
	                            childrenTraversed = true;
	                        }
	                    }
	                });
	            });
	        };
	        this.$timeout = $timeout;
	        this.$hibachi = $hibachi;
	        this.utilityService = utilityService;
	        this.collectionConfigService = collectionConfigService;
	        this.recordID = this.parentId; //this is what parent is initalized to in the listing display
	        expandableService.addRecord(this.recordID);
	    }
	    return SWExpandableRecordController;
	})();
	var SWExpandableRecord = (function () {
	    //@ngInject
	    function SWExpandableRecord($compile, $templateRequest, $timeout, corePartialsPath, utilityService, expandableService, hibachiPathBuilder) {
	        var _this = this;
	        this.$compile = $compile;
	        this.$templateRequest = $templateRequest;
	        this.$timeout = $timeout;
	        this.corePartialsPath = corePartialsPath;
	        this.utilityService = utilityService;
	        this.expandableService = expandableService;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.restrict = 'EA';
	        this.scope = {};
	        this.bindToController = {
	            recordValue: "=",
	            link: "@",
	            expandable: "=",
	            parentId: "=",
	            entity: "=",
	            collectionConfig: "=",
	            records: "=",
	            recordIndex: "=",
	            recordDepth: "=",
	            childCount: "=",
	            autoOpen: "=",
	            multiselectIdPaths: "="
	        };
	        this.controller = SWExpandableRecordController;
	        this.controllerAs = "swExpandableRecord";
	        this.link = function (scope, element, attrs) {
	            if (scope.swExpandableRecord.expandable && scope.swExpandableRecord.childCount) {
	                if (scope.swExpandableRecord.recordValue) {
	                    var id = scope.swExpandableRecord.records[scope.swExpandableRecord.recordIndex][scope.swExpandableRecord.entity.$$getIDName()];
	                    if (scope.swExpandableRecord.multiselectIdPaths && scope.swExpandableRecord.multiselectIdPaths.length) {
	                        var multiselectIdPathsArray = scope.swExpandableRecord.multiselectIdPaths.split(',');
	                        if (!scope.swExpandableRecord.childrenLoaded) {
	                            angular.forEach(multiselectIdPathsArray, function (multiselectIdPath) {
	                                var position = _this.utilityService.listFind(multiselectIdPath, id, '/');
	                                var multiSelectIDs = multiselectIdPath.split('/');
	                                var multiselectPathLength = multiSelectIDs.length;
	                                if (position !== -1 && position < multiselectPathLength - 1 && !_this.expandableService.getState(id, "isOpen")) {
	                                    _this.expandableService.updateState(id, { isOpen: true });
	                                    scope.swExpandableRecord.toggleChild();
	                                }
	                            });
	                        }
	                    }
	                }
	                _this.$templateRequest(_this.hibachiPathBuilder.buildPartialsPath(_this.corePartialsPath) + "expandablerecord.html").then(function (html) {
	                    var template = angular.element(html);
	                    //get autoopen reference to ensure only the root is autoopenable
	                    var autoOpen = angular.copy(scope.swExpandableRecord.autoOpen);
	                    scope.swExpandableRecord.autoOpen = false;
	                    template = _this.$compile(template)(scope);
	                    element.html(template);
	                    element.on('click', scope.swExpandableRecord.toggleChild);
	                    if (autoOpen) {
	                        scope.swExpandableRecord.toggleChild();
	                    }
	                });
	            }
	        };
	        this.$compile = $compile;
	        this.$templateRequest = $templateRequest;
	        this.corePartialsPath = corePartialsPath;
	        this.$timeout = $timeout;
	        this.utilityService = utilityService;
	        this.expandableService = expandableService;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	    }
	    SWExpandableRecord.Factory = function () {
	        var directive = function ($compile, $templateRequest, $timeout, corePartialsPath, utilityService, expandableService, hibachiPathBuilder) {
	            return new SWExpandableRecord($compile, $templateRequest, $timeout, corePartialsPath, utilityService, expandableService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$compile',
	            '$templateRequest',
	            '$timeout',
	            'corePartialsPath',
	            'utilityService',
	            'expandableService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWExpandableRecord;
	})();
	exports.SWExpandableRecord = SWExpandableRecord;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var md5 = __webpack_require__(36);
	var SWGravatarController = (function () {
	    // @ngInject
	    function SWGravatarController() {
	        this.gravatarURL = "http://www.gravatar.com/avatar/" + md5(this.emailAddress.toLowerCase().trim());
	    }
	    return SWGravatarController;
	})();
	exports.SWGravatarController = SWGravatarController;
	var SWGravatar = (function () {
	    function SWGravatar() {
	        this.template = "<img src='{{swGravatar.gravatarURL}}' />";
	        this.transclude = false;
	        this.restrict = "E";
	        this.scope = {};
	        this.bindToController = {
	            emailAddress: "@"
	        };
	        this.controller = SWGravatarController;
	        this.controllerAs = "swGravatar";
	        this.link = function (scope, element, attrs, controller, transclude) {
	        };
	    }
	    SWGravatar.Factory = function () {
	        var directive = function () { return new SWGravatar(); };
	        directive.$inject = [];
	        return directive;
	    };
	    SWGravatar.$inject = ["$hibachi", "$timeout", "collectionConfigService", "corePartialsPath",
	        'hibachiPathBuilder'];
	    return SWGravatar;
	})();
	exports.SWGravatar = SWGravatar;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	(function(){
	  var crypt = __webpack_require__(37),
	      utf8 = __webpack_require__(38).utf8,
	      isBuffer = __webpack_require__(39),
	      bin = __webpack_require__(38).bin,

	  // The core
	  md5 = function (message, options) {
	    // Convert to byte array
	    if (message.constructor == String)
	      if (options && options.encoding === 'binary')
	        message = bin.stringToBytes(message);
	      else
	        message = utf8.stringToBytes(message);
	    else if (isBuffer(message))
	      message = Array.prototype.slice.call(message, 0);
	    else if (!Array.isArray(message))
	      message = message.toString();
	    // else, assume byte array already

	    var m = crypt.bytesToWords(message),
	        l = message.length * 8,
	        a =  1732584193,
	        b = -271733879,
	        c = -1732584194,
	        d =  271733878;

	    // Swap endian
	    for (var i = 0; i < m.length; i++) {
	      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
	             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
	    }

	    // Padding
	    m[l >>> 5] |= 0x80 << (l % 32);
	    m[(((l + 64) >>> 9) << 4) + 14] = l;

	    // Method shortcuts
	    var FF = md5._ff,
	        GG = md5._gg,
	        HH = md5._hh,
	        II = md5._ii;

	    for (var i = 0; i < m.length; i += 16) {

	      var aa = a,
	          bb = b,
	          cc = c,
	          dd = d;

	      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
	      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
	      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
	      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
	      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
	      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
	      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
	      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
	      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
	      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
	      c = FF(c, d, a, b, m[i+10], 17, -42063);
	      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
	      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
	      d = FF(d, a, b, c, m[i+13], 12, -40341101);
	      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
	      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

	      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
	      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
	      c = GG(c, d, a, b, m[i+11], 14,  643717713);
	      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
	      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
	      d = GG(d, a, b, c, m[i+10],  9,  38016083);
	      c = GG(c, d, a, b, m[i+15], 14, -660478335);
	      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
	      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
	      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
	      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
	      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
	      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
	      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
	      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
	      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

	      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
	      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
	      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
	      b = HH(b, c, d, a, m[i+14], 23, -35309556);
	      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
	      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
	      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
	      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
	      a = HH(a, b, c, d, m[i+13],  4,  681279174);
	      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
	      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
	      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
	      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
	      d = HH(d, a, b, c, m[i+12], 11, -421815835);
	      c = HH(c, d, a, b, m[i+15], 16,  530742520);
	      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

	      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
	      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
	      c = II(c, d, a, b, m[i+14], 15, -1416354905);
	      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
	      a = II(a, b, c, d, m[i+12],  6,  1700485571);
	      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
	      c = II(c, d, a, b, m[i+10], 15, -1051523);
	      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
	      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
	      d = II(d, a, b, c, m[i+15], 10, -30611744);
	      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
	      b = II(b, c, d, a, m[i+13], 21,  1309151649);
	      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
	      d = II(d, a, b, c, m[i+11], 10, -1120210379);
	      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
	      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

	      a = (a + aa) >>> 0;
	      b = (b + bb) >>> 0;
	      c = (c + cc) >>> 0;
	      d = (d + dd) >>> 0;
	    }

	    return crypt.endian([a, b, c, d]);
	  };

	  // Auxiliary functions
	  md5._ff  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._gg  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._hh  = function (a, b, c, d, x, s, t) {
	    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._ii  = function (a, b, c, d, x, s, t) {
	    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };

	  // Package private blocksize
	  md5._blocksize = 16;
	  md5._digestsize = 16;

	  module.exports = function (message, options) {
	    if(typeof message == 'undefined')
	      return;

	    var digestbytes = crypt.wordsToBytes(md5(message, options));
	    return options && options.asBytes ? digestbytes :
	        options && options.asString ? bin.bytesToString(digestbytes) :
	        crypt.bytesToHex(digestbytes);
	  };

	})();


/***/ },
/* 37 */
/***/ function(module, exports) {

	(function() {
	  var base64map
	      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	  crypt = {
	    // Bit-wise rotation left
	    rotl: function(n, b) {
	      return (n << b) | (n >>> (32 - b));
	    },

	    // Bit-wise rotation right
	    rotr: function(n, b) {
	      return (n << (32 - b)) | (n >>> b);
	    },

	    // Swap big-endian to little-endian and vice versa
	    endian: function(n) {
	      // If number given, swap endian
	      if (n.constructor == Number) {
	        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
	      }

	      // Else, assume array and swap all items
	      for (var i = 0; i < n.length; i++)
	        n[i] = crypt.endian(n[i]);
	      return n;
	    },

	    // Generate an array of any length of random bytes
	    randomBytes: function(n) {
	      for (var bytes = []; n > 0; n--)
	        bytes.push(Math.floor(Math.random() * 256));
	      return bytes;
	    },

	    // Convert a byte array to big-endian 32-bit words
	    bytesToWords: function(bytes) {
	      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
	        words[b >>> 5] |= bytes[i] << (24 - b % 32);
	      return words;
	    },

	    // Convert big-endian 32-bit words to a byte array
	    wordsToBytes: function(words) {
	      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
	        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a hex string
	    bytesToHex: function(bytes) {
	      for (var hex = [], i = 0; i < bytes.length; i++) {
	        hex.push((bytes[i] >>> 4).toString(16));
	        hex.push((bytes[i] & 0xF).toString(16));
	      }
	      return hex.join('');
	    },

	    // Convert a hex string to a byte array
	    hexToBytes: function(hex) {
	      for (var bytes = [], c = 0; c < hex.length; c += 2)
	        bytes.push(parseInt(hex.substr(c, 2), 16));
	      return bytes;
	    },

	    // Convert a byte array to a base-64 string
	    bytesToBase64: function(bytes) {
	      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
	        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
	        for (var j = 0; j < 4; j++)
	          if (i * 8 + j * 6 <= bytes.length * 8)
	            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
	          else
	            base64.push('=');
	      }
	      return base64.join('');
	    },

	    // Convert a base-64 string to a byte array
	    base64ToBytes: function(base64) {
	      // Remove non-base-64 characters
	      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

	      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
	          imod4 = ++i % 4) {
	        if (imod4 == 0) continue;
	        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
	            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
	            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
	      }
	      return bytes;
	    }
	  };

	  module.exports = crypt;
	})();


/***/ },
/* 38 */
/***/ function(module, exports) {

	var charenc = {
	  // UTF-8 encoding
	  utf8: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
	    }
	  },

	  // Binary encoding
	  bin: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      for (var bytes = [], i = 0; i < str.length; i++)
	        bytes.push(str.charCodeAt(i) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      for (var str = [], i = 0; i < bytes.length; i++)
	        str.push(String.fromCharCode(bytes[i]));
	      return str.join('');
	    }
	  }
	};

	module.exports = charenc;


/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * Determine if an object is Buffer
	 *
	 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * License:  MIT
	 *
	 * `npm install is-buffer`
	 */

	module.exports = function (obj) {
	  return !!(
	    obj != null &&
	    obj.constructor &&
	    typeof obj.constructor.isBuffer === 'function' &&
	    obj.constructor.isBuffer(obj)
	  )
	}


/***/ },
/* 40 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingDisplayController = (function () {
	    //@ngInject
	    function SWListingDisplayController($scope, $transclude, $q, $hibachi, utilityService, collectionConfigService, paginationService, selectionService, observerService, rbkeyService) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$transclude = $transclude;
	        this.$q = $q;
	        this.$hibachi = $hibachi;
	        this.utilityService = utilityService;
	        this.collectionConfigService = collectionConfigService;
	        this.paginationService = paginationService;
	        this.selectionService = selectionService;
	        this.observerService = observerService;
	        this.rbkeyService = rbkeyService;
	        /* local state variables */
	        this.actions = [];
	        this.allpropertyidentifiers = "";
	        this.allprocessobjectproperties = "false";
	        this.aggregates = [];
	        this.buttonGroup = [];
	        this.colorFilters = [];
	        this.columns = [];
	        this.exampleEntity = "";
	        this.filters = [];
	        this.filterGroups = [];
	        this.multiselectable = false;
	        this.orderBys = [];
	        this.orderByStates = {};
	        this.orderByIndices = {};
	        this.searching = false;
	        this.selectable = false;
	        this.sortable = false;
	        this.initialSetup = function () {
	            if (angular.isUndefined(_this.isAngularRoute)) {
	                _this.isAngularRoute = true;
	            }
	            //default search is available
	            if (angular.isUndefined(_this.hasSearch)) {
	                _this.hasSearch = true;
	            }
	            if (angular.isString(_this.showSearch)) {
	                _this.showSearch = (_this.showSearch.toLowerCase() === 'true');
	            }
	            if (angular.isString(_this.showTopPagination)) {
	                _this.showTopPagination = (_this.showTopPagination.toLowerCase() === 'true');
	            }
	            if (angular.isUndefined(_this.name)) {
	                _this.name = 'ListingDisplay';
	            }
	            _this.paginator = _this.paginationService.createPagination();
	            _this.hasCollectionPromise = false;
	            if (angular.isUndefined(_this.getChildCount)) {
	                _this.getChildCount = false;
	            }
	            if (!_this.collection || !angular.isString(_this.collection)) {
	                _this.hasCollectionPromise = true;
	            }
	            else {
	                _this.collectionObject = _this.collection;
	                _this.collectionConfig = _this.collectionConfigService.newCollectionConfig(_this.collectionObject);
	            }
	            if (angular.isDefined(_this.pageShow)) {
	                _this.collectionConfig.setPageShow(_this.pageShow);
	            }
	            _this.setupDefaultCollectionInfo();
	            //if columns doesn't exist then make it
	            if (!_this.collectionConfig.columns) {
	                _this.collectionConfig.columns = [];
	            }
	            //if a collectionConfig was not passed in then we can run run swListingColumns
	            //this is performed early to populate columns with swlistingcolumn info
	            _this.$transclude(_this.$scope, function () { });
	            //add filterGroups
	            angular.forEach(_this.filterGroups, function (filterGroup) {
	                _this.collectionConfig.addFilterGroup(filterGroup);
	            });
	            //add filters
	            _this.setupColumns();
	            angular.forEach(_this.filters, function (filter) {
	                _this.collectionConfig.addFilter(filter.propertyIdentifier, filter.comparisonValue, filter.comparisonOperator, filter.logicalOperator, filter.hidden);
	            });
	            //add order bys
	            angular.forEach(_this.orderBys, function (orderBy) {
	                _this.collectionConfig.addOrderBy(orderBy.orderBy);
	            });
	            angular.forEach(_this.aggregates, function (aggregate) {
	                _this.collectionConfig.addDisplayAggregate(aggregate.propertyIdentifier, aggregate.aggregateFunction, aggregate.aggregateAlias);
	            });
	            //make sure we have necessary properties to make the actions 
	            angular.forEach(_this.actions, function (action) {
	                if (angular.isDefined(action.queryString)) {
	                    var parsedProperties = _this.utilityService.getPropertiesFromString(action.queryString);
	                    if (parsedProperties && parsedProperties.length) {
	                        _this.collectionConfig.addDisplayProperty(_this.utilityService.arrayToList(parsedProperties), "", { isVisible: false });
	                    }
	                }
	            });
	            //also make sure we have necessary color filter properties
	            angular.forEach(_this.colorFilters, function (colorFilter) {
	                if (angular.isDefined(colorFilter.propertyToCompare)) {
	                    _this.collectionConfig.addDisplayProperty(colorFilter.propertyToCompare, "", { isVisible: false });
	                }
	            });
	            _this.exampleEntity = _this.$hibachi.getEntityExample(_this.collectionObject);
	            if (_this.collectionConfig.hasColumns()) {
	                _this.collectionConfig.addDisplayProperty(_this.exampleEntity.$$getIDName(), undefined, { isVisible: false });
	            }
	            _this.initData();
	            _this.$scope.$watch('swListingDisplay.collectionPromise', function (newValue, oldValue) {
	                if (newValue) {
	                    _this.collectionData = undefined;
	                    _this.$q.when(_this.collectionPromise).then(function (data) {
	                        _this.collectionData = data;
	                        _this.setupDefaultCollectionInfo();
	                        if (_this.collectionConfig.hasColumns()) {
	                            _this.setupColumns();
	                        }
	                        else {
	                            _this.collectionConfig.loadJson(data.collectionConfig);
	                        }
	                        _this.collectionData.pageRecords = _this.collectionData.pageRecords || _this.collectionData.records;
	                        _this.paginator.setPageRecordsInfo(_this.collectionData);
	                        _this.searching = false;
	                    });
	                }
	            });
	            _this.tableID = 'LD' + _this.utilityService.createID();
	            //if getCollection doesn't exist then create it
	            if (angular.isUndefined(_this.getCollection)) {
	                _this.getCollection = _this.setupDefaultGetCollection();
	            }
	            _this.paginator.getCollection = _this.getCollection;
	            //this.getCollection();
	            _this.observerService.attach(_this.getCollectionObserver, 'getCollection', (_this.name || 'ListingDisplay'));
	        };
	        this.getCollectionObserver = function (param) {
	            console.warn("getCollectionObserver", param);
	            _this.collectionConfig.loadJson(param.collectionConfig);
	            _this.collectionData = undefined;
	            _this.getCollection();
	        };
	        this.setupDefaultCollectionInfo = function () {
	            if (_this.hasCollectionPromise) {
	                _this.collectionObject = _this.collection.collectionObject;
	                _this.collectionConfig = _this.collectionConfigService.newCollectionConfig(_this.collectionObject);
	                _this.collectionConfig.loadJson(_this.collection.collectionConfig);
	            }
	            //this.collectionConfig.setPageShow(this.paginator.getPageShow());
	            _this.paginator.setPageShow(_this.collectionConfig.getPageShow());
	            _this.collectionConfig.setCurrentPage(_this.paginator.getCurrentPage());
	            //this.collectionConfig.setKeywords(this.paginator.keywords);
	        };
	        this.setupDefaultGetCollection = function () {
	            _this.collectionPromise = _this.collectionConfig.getEntity();
	            return function () {
	                _this.collectionConfig.setCurrentPage(_this.paginator.getCurrentPage());
	                _this.collectionConfig.setPageShow(_this.paginator.getPageShow());
	                _this.collectionData = undefined;
	                _this.collectionConfig.getEntity().then(function (data) {
	                    _this.collectionData = data;
	                    _this.setupDefaultCollectionInfo();
	                    //this.setupColumns();
	                    _this.collectionData.pageRecords = _this.collectionData.pageRecords || _this.collectionData.records;
	                    _this.paginator.setPageRecordsInfo(_this.collectionData);
	                });
	            };
	        };
	        this.initData = function () {
	            _this.collectionConfig.setPageShow(_this.paginator.pageShow);
	            _this.collectionConfig.setCurrentPage(_this.paginator.currentPage);
	            //setup export action
	            if (angular.isDefined(_this.exportAction)) {
	                _this.exportAction = _this.$hibachi.buildUrl('main.collectionExport') + '&collectionExportID=';
	            }
	            //Setup Select
	            if (_this.selectFieldName && _this.selectFieldName.length) {
	                _this.selectable = true;
	                _this.tableclass = _this.utilityService.listAppend(_this.tableclass, 'table-select', ' ');
	                _this.tableattributes = _this.utilityService.listAppend(_this.tableattributes, 'data-selectfield="' + _this.selectFieldName + '"', ' ');
	            }
	            //Setup MultiSelect
	            if (_this.multiselectFieldName && _this.multiselectFieldName.length) {
	                _this.multiselectable = true;
	                _this.tableclass = _this.utilityService.listAppend(_this.tableclass, 'table-multiselect', ' ');
	                _this.tableattributes = _this.utilityService.listAppend(_this.tableattributes, 'data-multiselectpropertyidentifier="' + _this.multiselectPropertyIdentifier + '"', ' ');
	                //attach observer so we know when a selection occurs
	                _this.observerService.attach(_this.updateMultiselectValues, 'swSelectionToggleSelection', _this.collectionObject);
	                //attach observer so we know when a pagination change occurs
	                _this.observerService.attach(_this.paginationPageChange, 'swPaginationAction');
	            }
	            if (_this.multiselectable && (!_this.columns || !_this.columns.length)) {
	                //check if it has an active flag and if so then add the active flag
	                if (_this.exampleEntity.metaData.activeProperty && !_this.hasCollectionPromise) {
	                    _this.collectionConfig.addFilter('activeFlag', 1, '=', undefined, true);
	                }
	            }
	            //Look for Hierarchy in example entity
	            if (!_this.parentPropertyName || (_this.parentPropertyName && !_this.parentPropertyName.length)) {
	                if (_this.exampleEntity.metaData.hb_parentPropertyName) {
	                    _this.parentPropertyName = _this.exampleEntity.metaData.hb_parentPropertyName;
	                }
	            }
	            if (!_this.childPropertyName || (_this.childPropertyName && !_this.childPropertyName.length)) {
	                if (_this.exampleEntity.metaData.hb_childPropertyName) {
	                    _this.childPropertyName = _this.exampleEntity.metaData.hb_childPropertyName;
	                }
	            }
	            //Setup Hierachy Expandable
	            if (_this.parentPropertyName && _this.parentPropertyName.length && _this.expandable != false) {
	                if (angular.isUndefined(_this.expandable)) {
	                    _this.expandable = true;
	                }
	                _this.tableclass = _this.utilityService.listAppend(_this.tableclass, 'table-expandable', ' ');
	                //add parent property root filter
	                if (!_this.hasCollectionPromise) {
	                    _this.collectionConfig.addFilter(_this.parentPropertyName + '.' + _this.exampleEntity.$$getIDName(), 'NULL', 'IS', undefined, true);
	                }
	                //this.collectionConfig.addDisplayProperty(this.exampleEntity.$$getIDName()+'Path',undefined,{isVisible:false});
	                //add children column
	                if (_this.childPropertyName && _this.childPropertyName.length) {
	                    if (_this.getChildCount || !_this.hasCollectionPromise) {
	                        _this.collectionConfig.addDisplayAggregate(_this.childPropertyName, 'COUNT', _this.childPropertyName + 'Count');
	                    }
	                }
	                _this.allpropertyidentifiers = _this.utilityService.listAppend(_this.allpropertyidentifiers, _this.exampleEntity.$$getIDName() + 'Path');
	                _this.tableattributes = _this.utilityService.listAppend(_this.tableattributes, 'data-parentidproperty=' + _this.parentPropertyName + '.' + _this.exampleEntity.$$getIDName(), ' ');
	                _this.collectionConfig.setAllRecords(true);
	            }
	            //            if(
	            //                !this.edit
	            //                && this.multiselectable
	            //                && (!this.parentPropertyName || !!this.parentPropertyName.length)
	            //                && (this.multiselectPropertyIdentifier && this.multiselectPropertyIdentifier.length)
	            //            ){
	            //                if(this.multiselectValues && this.multiselectValues.length){
	            //                    this.collectionConfig.addFilter(this.multiselectPropertyIdentifier,this.multiselectValues,'IN');
	            //                }else{
	            //                    this.collectionConfig.addFilter(this.multiselectPropertyIdentifier,'_','IN');
	            //                }
	            //            }
	            if (_this.multiselectIdPaths && _this.multiselectIdPaths.length) {
	                angular.forEach(_this.multiselectIdPaths.split(','), function (value) {
	                    var id = _this.utilityService.listLast(value, '/');
	                    _this.selectionService.addSelection(_this.name, id);
	                });
	            }
	            if (_this.multiselectValues && _this.multiselectValues.length) {
	                //select all owned ids
	                console.log('swListingDisplay');
	                console.log(_this.multiselectValues);
	                angular.forEach(_this.multiselectValues.split(','), function (value) {
	                    _this.selectionService.addSelection(_this.name, value);
	                });
	            }
	            //set defaults if value is not specified
	            //this.edit = this.edit || $location.edit
	            _this.processObjectProperties = _this.processObjectProperties || '';
	            _this.recordProcessButtonDisplayFlag = _this.recordProcessButtonDisplayFlag || true;
	            //this.collectionConfig = this.collectionConfig || this.collectionData.collectionConfig;
	            _this.norecordstext = _this.rbkeyService.getRBKey('entity.' + _this.collectionObject + '.norecords');
	            //Setup Sortability
	            if (_this.sortProperty && _this.sortProperty.length) {
	            }
	            //Setup the admin meta info
	            _this.administrativeCount = 0;
	            //Detail
	            if (_this.recordDetailAction && _this.recordDetailAction.length) {
	                _this.administrativeCount++;
	                _this.adminattributes = _this.getAdminAttributesByType('detail');
	            }
	            //Edit
	            if (_this.recordEditAction && _this.recordEditAction.length) {
	                _this.administrativeCount++;
	                _this.adminattributes = _this.getAdminAttributesByType('edit');
	            }
	            //Delete
	            if (_this.recordDeleteAction && _this.recordDeleteAction.length) {
	                _this.administrativeCount++;
	                _this.adminattributes = _this.getAdminAttributesByType('delete');
	            }
	            //Add
	            if (_this.recordAddAction && _this.recordAddAction.length) {
	                _this.administrativeCount++;
	                _this.adminattributes = _this.getAdminAttributesByType('add');
	            }
	            //Process
	            // if(this.recordProcessAction && this.recordProcessAction.length && this.recordProcessButtonDisplayFlag){
	            //     this.administrativeCount++;
	            //     this.tableattributes = this.utilityService.listAppend(this.tableattributes, 'data-processcontext="'+this.recordProcessContext+'"', " ");
	            //     this.tableattributes = this.utilityService.listAppend(this.tableattributes, 'data-processentity="'+this.recordProcessEntity.metaData.className+'"', " ");
	            //     this.tableattributes = this.utilityService.listAppend(this.tableattributes, 'data-processentityid="'+this.recordProcessEntity.$$getID+'"', " ");
	            //     this.adminattributes = this.utilityService.listAppend(this.adminattributes, 'data-processaction="'+this.recordProcessAction+'"', " ");
	            //     this.adminattributes = this.utilityService.listAppend(this.adminattributes, 'data-processcontext="'+this.recordProcessContext+'"', " ");
	            //     this.adminattributes = this.utilityService.listAppend(this.adminattributes, 'data-processquerystring="'+this.recordProcessQueryString+'"', " ");
	            //     this.adminattributes = this.utilityService.listAppend(this.adminattributes, 'data-processupdatetableid="'+this.recordProcessUpdateTableID+'"', " ");
	            // }
	            //Setup the primary representation column if no columns were passed in
	            /*
	            <cfif not arrayLen(thistag.columns)>
	                <cfset arrayAppend(thistag.columns, {
	                    propertyIdentifier = thistag.exampleentity.getSimpleRepresentationPropertyName(),
	                    title = "",
	                    tdclass="primary",
	                    search = true,
	                    sort = true,
	                    filter = false,
	                    range = false,
	                    editable = false,
	                    buttonGroup = true
	                }) />
	            </cfif>
	            */
	            //Setup the list of all property identifiers to be used later
	            angular.forEach(_this.columns, function (column) {
	                //If this is a standard propertyIdentifier
	                if (column.propertyIdentifier) {
	                    //Add to the all property identifiers
	                    _this.allpropertyidentifiers = _this.utilityService.listAppend(_this.allpropertyidentifiers, column.propertyIdentifier);
	                    //Check to see if we need to setup the dynamic filters, etc
	                    //<cfif not len(column.search) || not len(column.sort) || not len(column.filter) || not len(column.range)>
	                    if (!column.searchable || !!column.searchable.length || !column.sort || !column.sort.length) {
	                        //Get the entity object to get property metaData
	                        var thisEntityName = _this.$hibachi.getLastEntityNameInPropertyIdentifier(_this.exampleEntity.metaData.className, column.propertyIdentifier);
	                        var thisPropertyName = _this.utilityService.listLast(column.propertyIdentifier, '.');
	                        var thisPropertyMeta = _this.$hibachi.getPropertyByEntityNameAndPropertyName(thisEntityName, thisPropertyName);
	                    }
	                }
	                else if (column.processObjectProperty) {
	                    column.searchable = false;
	                    column.sort = false;
	                    /*
	                    <cfset column.filter = false />
	                    <cfset column.range = false />
	                    */
	                    _this.allprocessobjectproperties = _this.utilityService.listAppend(_this.allprocessobjectproperties, column.processObjectProperty);
	                }
	                if (column.tdclass) {
	                    var tdclassArray = column.tdclass.split(' ');
	                    if (tdclassArray.indexOf("primary") >= 0 && _this.expandable) {
	                        _this.tableattributes = _this.utilityService.listAppend(_this.tableattributes, 'data-expandsortproperty=' + column.propertyIdentifier, " ");
	                        column.sort = false;
	                    }
	                }
	            });
	            //Setup a variable for the number of columns so that the none can have a proper colspan
	            _this.columnCount = (_this.columns) ? _this.columns.length : 0;
	            if (_this.selectable) {
	                _this.columnCount++;
	            }
	            if (_this.multiselectable) {
	                _this.columnCount++;
	            }
	            if (_this.sortable) {
	                _this.columnCount++;
	            }
	            if (_this.administrativeCount) {
	                _this.administrativeCount++;
	            }
	            //Setup table class
	            _this.tableclass = _this.tableclass || '';
	            _this.tableclass = _this.utilityService.listPrepend(_this.tableclass, 'table table-bordered table-hover', ' ');
	        };
	        this.setupColumns = function () {
	            //assumes no alias formatting
	            angular.forEach(_this.columns, function (column) {
	                var lastEntity = _this.$hibachi.getLastEntityNameInPropertyIdentifier(_this.collectionObject, column.propertyIdentifier);
	                if (angular.isUndefined(column.title)) {
	                    column.title = _this.rbkeyService.getRBKey('entity.' + lastEntity.toLowerCase() + '.' + _this.utilityService.listLast(column.propertyIdentifier, '.'));
	                }
	                if (angular.isUndefined(column.isVisible)) {
	                    column.isVisible = true;
	                }
	                var metadata = _this.$hibachi.getPropertyByEntityNameAndPropertyName(lastEntity, _this.utilityService.listLast(column.propertyIdentifier, '.'));
	                if (angular.isDefined(metadata) && angular.isDefined(metadata.hb_formattype)) {
	                    column.type = metadata.hb_formattype;
	                }
	                else {
	                    column.type = "none";
	                }
	                if (angular.isDefined(column.tooltip)) {
	                    var parsedProperties = _this.utilityService.getPropertiesFromString(column.tooltip);
	                    if (parsedProperties && parsedProperties.length) {
	                        _this.collectionConfig.addDisplayProperty(_this.utilityService.arrayToList(parsedProperties), "", { isVisible: false });
	                    }
	                }
	                else {
	                    column.tooltip = '';
	                }
	                if (angular.isDefined(column.queryString)) {
	                    var parsedProperties = _this.utilityService.getPropertiesFromString(column.queryString);
	                    if (parsedProperties && parsedProperties.length) {
	                        _this.collectionConfig.addDisplayProperty(_this.utilityService.arrayToList(parsedProperties), "", { isVisible: false });
	                    }
	                }
	                _this.columnOrderBy(column);
	                _this.collectionConfig.addDisplayProperty(column.propertyIdentifier, column.title, column);
	            });
	            //if the passed in collection has columns perform some formatting
	            if (_this.hasCollectionPromise) {
	                //assumes alias formatting from collectionConfig
	                angular.forEach(_this.collectionConfig.columns, function (column) {
	                    var lastEntity = _this.$hibachi.getLastEntityNameInPropertyIdentifier(_this.collectionObject, _this.utilityService.listRest(column.propertyIdentifier, '.'));
	                    column.title = column.title || _this.rbkeyService.getRBKey('entity.' + lastEntity.toLowerCase() + '.' + _this.utilityService.listLast(column.propertyIdentifier, '.'));
	                    if (angular.isUndefined(column.isVisible)) {
	                        column.isVisible = true;
	                    }
	                });
	            }
	        };
	        this.getColorFilterNGClassObject = function (pageRecord) {
	            var classObjectString = "{";
	            angular.forEach(_this.colorFilters, function (colorFilter, index) {
	                classObjectString = classObjectString.concat("'" + colorFilter.colorClass + "':" + _this.getColorFilterConditionString(colorFilter, pageRecord));
	                if (index < _this.colorFilters.length - 1) {
	                    classObjectString = classObjectString.concat(",");
	                }
	            });
	            return classObjectString + "}";
	        };
	        this.getColorFilterConditionString = function (colorFilter, pageRecord) {
	            if (angular.isDefined(colorFilter.comparisonProperty)) {
	                return pageRecord[colorFilter.propertyToCompare.replace('.', '_')] + colorFilter.comparisonOperator + pageRecord[colorFilter.comparisonProperty.replace('.', '_')];
	            }
	            else {
	                return pageRecord[colorFilter.propertyToCompare.replace('.', '_')] + colorFilter.comparisonOperator + colorFilter.comparisonValue;
	            }
	        };
	        this.toggleOrderBy = function (column) {
	            _this.collectionConfig.toggleOrderBy(column.propertyIdentifier, true);
	            _this.getCollection();
	        };
	        this.columnOrderBy = function (column) {
	            var isfound = false;
	            angular.forEach(_this.collectionConfig.orderBy, function (orderBy, index) {
	                if (column.propertyIdentifier == orderBy.propertyIdentifier) {
	                    isfound = true;
	                    _this.orderByStates[column.propertyIdentifier] = orderBy.direction;
	                }
	            });
	            if (!isfound) {
	                _this.orderByStates[column.propertyIdentifier] = '';
	            }
	            return _this.orderByStates[column.propertyIdentifier];
	        };
	        this.columnOrderByIndex = function (column) {
	            var isfound = false;
	            angular.forEach(_this.collectionConfig.orderBy, function (orderBy, index) {
	                if (column.propertyIdentifier == orderBy.propertyIdentifier) {
	                    isfound = true;
	                    _this.orderByIndices[column.propertyIdentifier] = index + 1;
	                }
	            });
	            if (!isfound) {
	                _this.orderByIndices[column.propertyIdentifier] = '';
	            }
	            return _this.orderByIndices[column.propertyIdentifier];
	        };
	        this.updateMultiselectValues = function (res) {
	            _this.multiselectValues = _this.selectionService.getSelections(_this.name);
	            if (_this.selectionService.isAllSelected(_this.name)) {
	                _this.multiselectCount = _this.collectionData.recordsCount - _this.selectionService.getSelectionCount(_this.name);
	            }
	            else {
	                _this.multiselectCount = _this.selectionService.getSelectionCount(_this.name);
	            }
	            switch (res.action) {
	                case 'uncheck':
	                    _this.isCurrentPageRecordsSelected = false;
	                    break;
	                case 'selectAll':
	                    _this.allSelected = true;
	                    _this.isCurrentPageRecordsSelected = false;
	                    break;
	                case 'clear':
	                    _this.allSelected = false;
	                    _this.isCurrentPageRecordsSelected = false;
	                    break;
	            }
	        };
	        this.getPageRecordKey = function (propertyIdentifier) {
	            if (propertyIdentifier) {
	                var propertyIdentifierWithoutAlias = '';
	                if (propertyIdentifier.indexOf('_') === 0) {
	                    propertyIdentifierWithoutAlias = propertyIdentifier.substring(propertyIdentifier.indexOf('.') + 1, propertyIdentifier.length);
	                }
	                else {
	                    propertyIdentifierWithoutAlias = propertyIdentifier;
	                }
	                return _this.utilityService.replaceAll(propertyIdentifierWithoutAlias, '.', '_');
	            }
	            return '';
	        };
	        this.getAdminAttributesByType = function (type) {
	            var recordActionName = 'record' + type.toUpperCase() + 'Action';
	            var recordActionPropertyName = recordActionName + 'Property';
	            var recordActionQueryStringName = recordActionName + 'QueryString';
	            var recordActionModalName = recordActionName + 'Modal';
	            _this.adminattributes = _this.utilityService.listAppend(_this.adminattributes, 'data-' + type + 'action="' + _this[recordActionName] + '"', " ");
	            if (_this[recordActionPropertyName] && _this[recordActionPropertyName].length) {
	                _this.adminattributes = _this.utilityService.listAppend(_this.adminattributes, 'data-' + type + 'actionproperty="' + _this[recordActionPropertyName] + '"', " ");
	            }
	            _this.adminattributes = _this.utilityService.listAppend(_this.adminattributes, 'data-' + type + 'querystring="' + _this[recordActionQueryStringName] + '"', " ");
	            _this.adminattributes = _this.utilityService.listAppend(_this.adminattributes, 'data-' + type + 'modal="' + _this[recordActionModalName] + '"', " ");
	        };
	        this.getExportAction = function () {
	            return _this.exportAction + _this.collectionID;
	        };
	        this.exportCurrentList = function (selection) {
	            if (selection === void 0) { selection = false; }
	            var exportCollectionConfig = angular.copy(_this.collectionConfig.getCollectionConfig());
	            if (selection && !angular.isUndefined(_this.selectionService.getSelections(_this.name))
	                && (_this.selectionService.getSelections(_this.name).length > 0)) {
	                exportCollectionConfig.filterGroups[0].filterGroup = [
	                    {
	                        "displayPropertyIdentifier": _this.rbkeyService.getRBKey("entity." + exportCollectionConfig.baseEntityName.toLowerCase() + "." + _this.exampleEntity.$$getIDName().toLowerCase()),
	                        "propertyIdentifier": exportCollectionConfig.baseEntityAlias + "." + _this.exampleEntity.$$getIDName(),
	                        "comparisonOperator": (_this.allSelected) ? "not in" : "in",
	                        "value": _this.selectionService.getSelections(_this.name).join(),
	                        "displayValue": _this.selectionService.getSelections(_this.name).join(),
	                        "ormtype": "string",
	                        "fieldtype": "id",
	                        "conditionDisplay": "In List"
	                    }
	                ];
	            }
	            $('body').append('<form action="/?' + _this.$hibachi.getConfigValue('action') + '=admin:main.collectionConfigExport" method="post" id="formExport"></form>');
	            $('#formExport')
	                .append("<input type='hidden' name='collectionConfig' value='" + angular.toJson(exportCollectionConfig) + "' />")
	                .submit()
	                .remove();
	        };
	        this.paginationPageChange = function (res) {
	            _this.isCurrentPageRecordsSelected = false;
	        };
	        this.selectCurrentPageRecords = function () {
	            if (!_this.collectionData.pageRecords)
	                return;
	            for (var i = 0; i < _this.collectionData.pageRecords.length; i++) {
	                if (_this.isCurrentPageRecordsSelected == true) {
	                    _this.selectionService.addSelection(_this.name, _this.collectionData.pageRecords[i][_this.exampleEntity.$$getIDName()]);
	                }
	                else {
	                    _this.selectionService.removeSelection(_this.name, _this.collectionData.pageRecords[i][_this.exampleEntity.$$getIDName()]);
	                }
	            }
	        };
	        this.clearSelection = function () {
	            _this.selectionService.clearSelection(_this.name);
	        };
	        this.selectAll = function () {
	            _this.selectionService.selectAll(_this.name);
	        };
	        this.initialSetup();
	        this.$scope.$on('$destroy', function () {
	            _this.observerService.detachById(_this.$scope.collection);
	        });
	    }
	    return SWListingDisplayController;
	})();
	var SWListingDisplay = (function () {
	    //@ngInject
	    function SWListingDisplay(corePartialsPath, hibachiPathBuilder) {
	        this.corePartialsPath = corePartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.restrict = 'E';
	        this.scope = {};
	        this.transclude = true;
	        this.bindToController = {
	            isRadio: "=?",
	            angularLinks: "=?",
	            isAngularRoute: "=?",
	            name: "@?",
	            /*required*/
	            collection: "=?",
	            collectionConfig: "=?",
	            getCollection: "&?",
	            collectionPromise: "=?",
	            edit: "=?",
	            /*Optional*/
	            title: "@?",
	            /*Admin Actions*/
	            actions: "=?",
	            recordEditAction: "@?",
	            recordEditActionProperty: "@?",
	            recordEditQueryString: "@?",
	            recordEditModal: "=?",
	            recordEditDisabled: "=?",
	            recordDetailAction: "@?",
	            recordDetailActionProperty: "@?",
	            recordDetailQueryString: "@?",
	            recordDetailModal: "=?",
	            recordDeleteAction: "@?",
	            recordDeleteActionProperty: "@?",
	            recordDeleteQueryString: "@?",
	            recordAddAction: "@?",
	            recordAddActionProperty: "@?",
	            recordAddQueryString: "@?",
	            recordAddModal: "=?",
	            recordAddDisabled: "=?",
	            recordProcessesConfig: "=?",
	            /* record processes config is an array of actions. Example:
	            [
	            {
	                recordProcessAction:"@",
	                recordProcessActionProperty:"@",
	                recordProcessQueryString:"@",
	                recordProcessContext:"@",
	                recordProcessEntity:"=",
	                recordProcessEntityData:"=",
	                recordProcessUpdateTableID:"=",
	                recordProcessButtonDisplayFlag:"=",
	            }
	            ]
	            */
	            /*Hierachy Expandable*/
	            parentPropertyName: "@?",
	            //booleans
	            expandable: "=?",
	            expandableOpenRoot: "=?",
	            /*Searching*/
	            searchText: "=?",
	            /*Sorting*/
	            sortProperty: "@?",
	            sortContextIDColumn: "@?",
	            sortContextIDValue: "@?",
	            /*Single Select*/
	            selectFiledName: "@?",
	            selectValue: "@?",
	            selectTitle: "@?",
	            /*Multiselect*/
	            multiselectFieldName: "@?",
	            multiselectPropertyIdentifier: "@?",
	            multiselectIdPaths: "@?",
	            multiselectValues: "@?",
	            /*Helper / Additional / Custom*/
	            tableattributes: "@?",
	            tableclass: "@?",
	            adminattributes: "@?",
	            /* Settings */
	            showheader: "=?",
	            showSearch: "=?",
	            showTopPagination: "=?",
	            /* Basic Action Caller Overrides*/
	            createModal: "=?",
	            createAction: "@?",
	            createQueryString: "@?",
	            exportAction: "@?",
	            getChildCount: "=?",
	            hasSearch: "=?",
	            hasActionBar: "=?",
	            showPagination: "@?",
	            pageShow: "@?",
	        };
	        this.controller = SWListingDisplayController;
	        this.controllerAs = "swListingDisplay";
	        this.corePartialsPath = corePartialsPath;
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(this.corePartialsPath) + 'listingdisplay.html';
	    }
	    SWListingDisplay.Factory = function () {
	        var directive = function (corePartialsPath, hibachiPathBuilder) {
	            return new SWListingDisplay(corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            'corePartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWListingDisplay;
	})();
	exports.SWListingDisplay = SWListingDisplay;


/***/ },
/* 41 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingControlsController = (function () {
	    //@ngInject
	    function SWListingControlsController($hibachi, metadataService, collectionService, observerService) {
	        var _this = this;
	        this.$hibachi = $hibachi;
	        this.metadataService = metadataService;
	        this.collectionService = collectionService;
	        this.observerService = observerService;
	        this.displayOptionsClosed = true;
	        this.filtersClosed = true;
	        this.filterActions = function (res) {
	            if (res.action == 'add') {
	                _this.paginator.setCurrentPage(1);
	            }
	            _this.filtersClosed = true;
	        };
	        this.selectSearchColumn = function (column) {
	            _this.selectedSearchColumn = column;
	            if (_this.searchText) {
	                _this.search();
	            }
	        };
	        this.getSelectedSearchColumnName = function () {
	            return (angular.isUndefined(_this.selectedSearchColumn)) ? 'All' : _this.selectedSearchColumn.title;
	        };
	        this.search = function () {
	            if (angular.isDefined(_this.selectedSearchColumn)) {
	                _this.backupColumnsConfig = angular.copy(_this.collectionConfig.getColumns());
	                var collectionColumns = _this.collectionConfig.getColumns();
	                for (var i = 0; i < collectionColumns.length; i++) {
	                    if (collectionColumns[i].propertyIdentifier != _this.selectedSearchColumn.propertyIdentifier) {
	                        collectionColumns[i].isSearchable = false;
	                    }
	                }
	                _this.collectionConfig.setKeywords(_this.searchText);
	                _this.paginator.setCurrentPage(1);
	                _this.collectionConfig.setColumns(_this.backupColumnsConfig);
	            }
	            else {
	                _this.collectionConfig.setKeywords(_this.searchText);
	                _this.paginator.setCurrentPage(1);
	            }
	        };
	        this.addSearchFilter = function () {
	            if (angular.isUndefined(_this.selectedSearchColumn) || !_this.searchText)
	                return;
	            var keywords = _this.searchText.split(" ");
	            for (var i = 0; i < keywords.length; i++) {
	                _this.collectionConfig.addLikeFilter(_this.selectedSearchColumn.propertyIdentifier, keywords[i], '%w%', undefined, _this.selectedSearchColumn.title);
	            }
	            _this.searchText = '';
	            _this.collectionConfig.setKeywords(_this.searchText);
	            _this.paginator.setCurrentPage(1);
	        };
	        this.toggleDisplayOptions = function (closeButton) {
	            if (closeButton === void 0) { closeButton = false; }
	            if (_this.displayOptionsClosed) {
	                _this.displayOptionsClosed = false;
	            }
	            else if (closeButton) {
	                _this.displayOptionsClosed = true;
	            }
	        };
	        this.setItemInUse = function (booleanValue) {
	            _this.itemInUse = booleanValue;
	        };
	        this.removeFilter = function (array, index, reloadCollection) {
	            if (reloadCollection === void 0) { reloadCollection = true; }
	            array.splice(index, 1);
	            if (reloadCollection) {
	                _this.paginator.setCurrentPage(1);
	            }
	        };
	        this.toggleFilters = function () {
	            if (_this.filtersClosed) {
	                _this.filtersClosed = false;
	                _this.newFilterPosition = _this.collectionService.newFilterItem(_this.collectionConfig.filterGroups[0].filterGroup, _this.setItemInUse);
	            }
	        };
	        this.selectFilterItem = function (filterItem) {
	            _this.filtersClosed = false;
	            _this.collectionService.selectFilterItem(filterItem);
	        };
	        this.saveCollection = function () {
	            _this.getCollection()();
	        };
	        this.backupColumnsConfig = this.collectionConfig.getColumns();
	        this.filterPropertiesList = {};
	        $hibachi.getFilterPropertiesByBaseEntityName(this.collectionConfig.baseEntityAlias).then(function (value) {
	            metadataService.setPropertiesList(value, _this.collectionConfig.baseEntityAlias);
	            _this.filterPropertiesList[_this.collectionConfig.baseEntityAlias] = metadataService.getPropertiesListByBaseEntityAlias(_this.collectionConfig.baseEntityAlias);
	            metadataService.formatPropertiesList(_this.filterPropertiesList[_this.collectionConfig.baseEntityAlias], _this.collectionConfig.baseEntityAlias);
	        });
	        this.observerService.attach(this.filterActions, 'filterItemAction');
	    }
	    return SWListingControlsController;
	})();
	var SWListingControls = (function () {
	    function SWListingControls(collectionPartialsPath, hibachiPathBuilder) {
	        this.collectionPartialsPath = collectionPartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.restrict = 'E';
	        this.scope = {};
	        this.bindToController = {
	            collectionConfig: "=",
	            paginator: "=",
	            getCollection: "&"
	        };
	        this.controller = SWListingControlsController;
	        this.controllerAs = 'swListingControls';
	        this.templateUrl = this.hibachiPathBuilder.buildPartialsPath(this.collectionPartialsPath) + "listingcontrols.html";
	    }
	    SWListingControls.Factory = function () {
	        var directive = function (corePartialsPath, hibachiPathBuilder) {
	            return new SWListingControls(corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['corePartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    SWListingControls.$inject = ['corePartialsPath', 'hibachiPathBuilder'];
	    return SWListingControls;
	})();
	exports.SWListingControls = SWListingControls;


/***/ },
/* 42 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingAggregateController = (function () {
	    function SWListingAggregateController() {
	        var _this = this;
	        this.init = function () {
	            _this.editable = _this.editable || false;
	        };
	        this.init();
	    }
	    return SWListingAggregateController;
	})();
	var SWListingAggregate = (function () {
	    function SWListingAggregate() {
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            propertyIdentifier: "@",
	            aggregateFunction: "@",
	            aggregateAlias: "@?"
	        };
	        this.controller = SWListingAggregateController;
	        this.controllerAs = "swListingAggregate";
	        this.link = function (scope, element, attrs) {
	            var aggregate = {
	                propertyIdentifier: scope.swListingAggregate.propertyIdentifier,
	                aggregateFunction: scope.swListingAggregate.aggregateFunction,
	                aggregateAlias: scope.swListingAggregate.aggregateAlias,
	            };
	            scope.$parent.swListingDisplay.aggregates.push(aggregate);
	        };
	    }
	    SWListingAggregate.Factory = function () {
	        var directive = function () {
	            return new SWListingAggregate();
	        };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWListingAggregate;
	})();
	exports.SWListingAggregate = SWListingAggregate;


/***/ },
/* 43 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingColorFilterController = (function () {
	    function SWListingColorFilterController() {
	        this.init = function () {
	        };
	        this.init();
	    }
	    return SWListingColorFilterController;
	})();
	var SWListingColorFilter = (function () {
	    function SWListingColorFilter(utilityService) {
	        var _this = this;
	        this.utilityService = utilityService;
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            propertyToCompare: "@",
	            comparisonOperator: "@",
	            comparisonValue: "@",
	            comparisonProperty: "@",
	            colorClass: "@",
	            color: "@"
	        };
	        this.controller = SWListingColorFilterController;
	        this.controllerAs = "swListingColorFilter";
	        this.link = function (scope, element, attrs) {
	            var colorFilter = {
	                propertyToCompare: scope.swListingColorFilter.propertyToCompare,
	                comparisonOperator: scope.swListingColorFilter.comparisonOperator,
	                comparisonValue: scope.swListingColorFilter.comparisonValue,
	                comparisonProperty: scope.swListingColorFilter.comparisonProperty,
	                colorClass: scope.swListingColorFilter.colorClass,
	                color: scope.swListingColorFilter.color
	            };
	            if (_this.utilityService.ArrayFindByPropertyValue(scope.$parent.swListingDisplay.colorFilters, 'propertyToCompare', colorFilter.propertyToCompare) === -1) {
	                scope.$parent.swListingDisplay.colorFilters.push(colorFilter);
	            }
	        };
	    }
	    SWListingColorFilter.Factory = function () {
	        var directive = function (utilityService) {
	            return new SWListingColorFilter(utilityService);
	        };
	        directive.$inject = [
	            'utilityService'
	        ];
	        return directive;
	    };
	    return SWListingColorFilter;
	})();
	exports.SWListingColorFilter = SWListingColorFilter;


/***/ },
/* 44 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingColumnController = (function () {
	    function SWListingColumnController() {
	        var _this = this;
	        this.init = function () {
	            _this.editable = _this.editable || false;
	        };
	        this.init();
	    }
	    return SWListingColumnController;
	})();
	var SWListingColumn = (function () {
	    function SWListingColumn(utilityService) {
	        var _this = this;
	        this.utilityService = utilityService;
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            propertyIdentifier: "@",
	            processObjectProperty: "@?",
	            title: "@?",
	            tdclass: "@?",
	            search: "=?",
	            sort: "=?",
	            filter: "=?",
	            range: "=?",
	            editable: "=?",
	            buttonGroup: "=?"
	        };
	        this.controller = SWListingColumnController;
	        this.controllerAs = "swListingColumn";
	        this.link = function (scope, element, attrs) {
	            var column = {
	                propertyIdentifier: scope.swListingColumn.propertyIdentifier,
	                processObjectProperty: scope.swListingColumn.processObjectProperty,
	                title: scope.swListingColumn.title,
	                tdclass: scope.swListingColumn.tdclass,
	                search: scope.swListingColumn.search,
	                sort: scope.swListingColumn.sort,
	                filter: scope.swListingColumn.filter,
	                range: scope.swListingColumn.range,
	                editable: scope.swListingColumn.editable,
	                buttonGroup: scope.swListingColumn.buttonGroup
	            };
	            if (_this.utilityService.ArrayFindByPropertyValue(scope.$parent.swListingDisplay.columns, 'propertyIdentifier', column.propertyIdentifier) === -1) {
	                scope.$parent.swListingDisplay.columns.unshift(column);
	            }
	        };
	    }
	    SWListingColumn.Factory = function () {
	        var directive = function (utilityService) {
	            return new SWListingColumn(utilityService);
	        };
	        directive.$inject = [
	            'utilityService'
	        ];
	        return directive;
	    };
	    SWListingColumn.$inject = ['utilityService'];
	    return SWListingColumn;
	})();
	exports.SWListingColumn = SWListingColumn;


/***/ },
/* 45 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingFilterController = (function () {
	    function SWListingFilterController() {
	        this.init = function () {
	        };
	        this.init();
	    }
	    return SWListingFilterController;
	})();
	var SWListingFilter = (function () {
	    function SWListingFilter() {
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            propertyIdentifier: "@",
	            comparisonOperator: "@",
	            comparisonValue: "@",
	            logicalOperator: "@",
	            hidden: "@?"
	        };
	        this.controller = SWListingFilterController;
	        this.controllerAs = "swListingFilter";
	        this.link = function (scope, element, attrs) {
	            var filter = {
	                propertyIdentifier: scope.swListingFilter.propertyIdentifier,
	                comparisonOperator: scope.swListingFilter.comparisonOperator,
	                comparisonValue: scope.swListingFilter.comparisonValue,
	                logicalOperator: scope.swListingFilter.logicalOperator,
	                hidden: false
	            };
	            if (angular.isDefined(scope.swListingFilter.hidden)) {
	                filter['hidden'] = scope.swListingFilter.hidden;
	            }
	            if (angular.isDefined(scope.$parent.swListingFilterGroup)) {
	                scope.$parent.swListingFilterGroup.filters.push(filter);
	            }
	            else {
	                scope.$parent.swListingDisplay.filters.push(filter);
	            }
	        };
	    }
	    SWListingFilter.Factory = function () {
	        var directive = function () {
	            return new SWListingFilter();
	        };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWListingFilter;
	})();
	exports.SWListingFilter = SWListingFilter;


/***/ },
/* 46 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingFilterGroupController = (function () {
	    function SWListingFilterGroupController($scope, $transclude) {
	        this.$scope = $scope;
	        this.$transclude = $transclude;
	        this.filters = [];
	        $transclude($scope, function () { });
	        $scope.$parent.swListingDisplay.filterGroups.push(this.filters);
	    }
	    return SWListingFilterGroupController;
	})();
	var SWListingFilterGroup = (function () {
	    function SWListingFilterGroup() {
	        this.restrict = 'EA';
	        this.transclude = true;
	        this.scope = true;
	        this.bindToController = {};
	        this.controller = SWListingFilterGroupController;
	        this.controllerAs = "swListingFilterGroup";
	    }
	    SWListingFilterGroup.Factory = function () {
	        var directive = function () { return new SWListingFilterGroup(); };
	        directive.$inject = [];
	        return directive;
	    };
	    SWListingFilterGroup.$inject = [];
	    return SWListingFilterGroup;
	})();
	exports.SWListingFilterGroup = SWListingFilterGroup;


/***/ },
/* 47 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingOrderByController = (function () {
	    //@ngInject
	    function SWListingOrderByController() {
	        this.init = function () {
	        };
	        this.init();
	    }
	    return SWListingOrderByController;
	})();
	var SWListingOrderBy = (function () {
	    //@ngInject
	    function SWListingOrderBy(utilityService) {
	        this.utilityService = utilityService;
	        this.restrict = 'EA';
	        this.scope = true;
	        this.bindToController = {
	            orderBy: "@",
	        };
	        this.controller = SWListingOrderByController;
	        this.controllerAs = "swListingOrderBy";
	        this.link = function (scope, element, attrs) {
	            var orderBy = {
	                orderBy: scope.swListingOrderBy.orderBy,
	            };
	            scope.$parent.swListingDisplay.orderBys.push(orderBy);
	        };
	    }
	    SWListingOrderBy.Factory = function () {
	        var directive = function (utilityService) {
	            return new SWListingOrderBy(utilityService);
	        };
	        directive.$inject = [
	            'utilityService'
	        ];
	        return directive;
	    };
	    return SWListingOrderBy;
	})();
	exports.SWListingOrderBy = SWListingOrderBy;


/***/ },
/* 48 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWLoginController = (function () {
	    //@ngInject
	    function SWLoginController($route, $log, $window, corePartialsPath, $hibachi, dialogService, hibachiScope) {
	        var _this = this;
	        this.$route = $route;
	        this.$log = $log;
	        this.$window = $window;
	        this.corePartialsPath = corePartialsPath;
	        this.$hibachi = $hibachi;
	        this.dialogService = dialogService;
	        this.hibachiScope = hibachiScope;
	        this.login = function () {
	            var loginPromise = _this.$hibachi.login(_this.account_login.data.emailAddress, _this.account_login.data.password);
	            loginPromise.then(function (loginResponse) {
	                if (loginResponse && loginResponse.data && loginResponse.data.token) {
	                    _this.$window.localStorage.setItem('token', loginResponse.data.token);
	                    _this.hibachiScope.loginDisplayed = false;
	                    _this.$route.reload();
	                    _this.dialogService.removeCurrentDialog();
	                }
	            }, function (rejection) {
	            });
	        };
	        this.$hibachi = $hibachi;
	        this.$window = $window;
	        this.$route = $route;
	        this.hibachiScope = hibachiScope;
	        this.account_login = $hibachi.newEntity('Account_Login');
	    }
	    return SWLoginController;
	})();
	var SWLogin = (function () {
	    //@ngInject
	    function SWLogin($route, $log, $window, corePartialsPath, $hibachi, dialogService, hibachiPathBuilder) {
	        this.$route = $route;
	        this.$log = $log;
	        this.$window = $window;
	        this.corePartialsPath = corePartialsPath;
	        this.$hibachi = $hibachi;
	        this.dialogService = dialogService;
	        this.restrict = 'E';
	        this.scope = {};
	        this.bindToController = {};
	        this.controller = SWLoginController;
	        this.controllerAs = "SwLogin";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(this.corePartialsPath + '/login.html');
	    }
	    SWLogin.Factory = function () {
	        var directive = function ($route, $log, $window, corePartialsPath, $hibachi, dialogService, hibachiPathBuilder) {
	            return new SWLogin($route, $log, $window, corePartialsPath, $hibachi, dialogService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$route',
	            '$log',
	            '$window',
	            'corePartialsPath',
	            '$hibachi',
	            'dialogService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWLogin;
	})();
	exports.SWLogin = SWLogin;


/***/ },
/* 49 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWNumbersOnly = (function () {
	    function SWNumbersOnly() {
	        this.restrict = "A";
	        this.require = "ngModel";
	        this.scope = {
	            ngModel: '=',
	            minNumber: '=?',
	            maxNumber: '=?'
	        };
	        this.link = function ($scope, element, attrs, modelCtrl) {
	            modelCtrl.$parsers.unshift(function (inputValue) {
	                var modelValue = modelCtrl.$modelValue;
	                if (inputValue != "" && !isNaN(Number(inputValue))) {
	                    if (angular.isDefined($scope.minNumber)) {
	                        if (Number(inputValue) >= $scope.minNumber || !angular.isDefined($scope.minNumber)) {
	                            modelCtrl.$setValidity("minNumber", true);
	                        }
	                        else if (angular.isDefined($scope.minNumber)) {
	                            modelCtrl.$setValidity("minNumber", false);
	                        }
	                    }
	                    if (angular.isDefined($scope.maxNumber)) {
	                        if (Number(inputValue) <= $scope.maxNumber || !angular.isDefined($scope.maxNumber)) {
	                            modelCtrl.$setValidity("maxNumber", true);
	                        }
	                        else if (angular.isDefined($scope.maxNumber)) {
	                            modelCtrl.$setValidity("maxNumber", false);
	                        }
	                    }
	                    if (modelCtrl.$valid) {
	                        modelValue = Number(inputValue);
	                    }
	                    else {
	                        modelValue = $scope.minNumber;
	                    }
	                }
	                return modelValue;
	            });
	        };
	    }
	    SWNumbersOnly.Factory = function () {
	        var directive = function () { return new SWNumbersOnly(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWNumbersOnly;
	})();
	exports.SWNumbersOnly = SWNumbersOnly;


/***/ },
/* 50 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWLoading = (function () {
	    function SWLoading($log, corePartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'A',
	            transclude: true,
	            templateUrl: hibachiPathBuilder.buildPartialsPath(corePartialsPath) + 'loading.html',
	            scope: {
	                swLoading: '='
	            },
	            link: function (scope, attrs, element) {
	            }
	        };
	    }
	    SWLoading.Factory = function () {
	        var directive = function ($log, corePartialsPath, hibachiPathBuilder) {
	            return new SWLoading($log, corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            'corePartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWLoading;
	})();
	exports.SWLoading = SWLoading;


/***/ },
/* 51 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWScrollTrigger = (function () {
	    function SWScrollTrigger($rootScope, $window, $timeout) {
	        return {
	            link: function (scope, elem, attrs) {
	                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
	                $window = angular.element($window);
	                scrollDistance = 0;
	                if (attrs.infiniteScrollDistance != null) {
	                    scope
	                        .$watch(attrs.infiniteScrollDistance, function (value) {
	                        return scrollDistance = parseInt(value, 10);
	                    });
	                }
	                scrollEnabled = true;
	                checkWhenEnabled = false;
	                if (attrs.infiniteScrollDisabled != null) {
	                    scope
	                        .$watch(attrs.infiniteScrollDisabled, function (value) {
	                        scrollEnabled = !value;
	                        if (scrollEnabled
	                            && checkWhenEnabled) {
	                            checkWhenEnabled = false;
	                            return handler();
	                        }
	                    });
	                }
	                handler = function () {
	                    var elementBottom, remaining, shouldScroll, windowBottom;
	                    windowBottom = $window.height()
	                        + $window.scrollTop();
	                    elementBottom = elem.offset().top
	                        + elem.height();
	                    remaining = elementBottom
	                        - windowBottom;
	                    shouldScroll = remaining <= $window
	                        .height()
	                        * scrollDistance;
	                    if (shouldScroll && scrollEnabled) {
	                        if ($rootScope.$$phase) {
	                            return scope
	                                .$eval(attrs.infiniteScroll);
	                        }
	                        else {
	                            return scope
	                                .$apply(attrs.infiniteScroll);
	                        }
	                    }
	                    else if (shouldScroll) {
	                        return checkWhenEnabled = true;
	                    }
	                };
	                $window.on('scroll', handler);
	                scope.$on('$destroy', function () {
	                    return $window.off('scroll', handler);
	                });
	                return $timeout((function () {
	                    if (attrs.infiniteScrollImmediateCheck) {
	                        if (scope
	                            .$eval(attrs.infiniteScrollImmediateCheck)) {
	                            return handler();
	                        }
	                    }
	                    else {
	                        return handler();
	                    }
	                }), 0);
	            }
	        };
	    }
	    SWScrollTrigger.Factory = function () {
	        var directive = function ($rootScope, $window, $timeout) {
	            return new SWScrollTrigger($rootScope, $window, $timeout);
	        };
	        directive.$inject = [
	            '$rootScope',
	            '$window',
	            '$timeout'
	        ];
	        return directive;
	    };
	    return SWScrollTrigger;
	})();
	exports.SWScrollTrigger = SWScrollTrigger;


/***/ },
/* 52 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWTooltipController = (function () {
	    // @ngInject
	    function SWTooltipController(rbkeyService) {
	        var _this = this;
	        this.rbkeyService = rbkeyService;
	        this.showTooltip = false;
	        this.show = function () {
	            _this.showTooltip = true;
	        };
	        this.hide = function () {
	            _this.showTooltip = false;
	        };
	        if (angular.isDefined(this.rbKey)) {
	            this.text = rbkeyService.getRBKey(this.rbKey);
	        }
	        if (angular.isUndefined(this.position)) {
	            this.position = "top";
	        }
	    }
	    return SWTooltipController;
	})();
	exports.SWTooltipController = SWTooltipController;
	var SWTooltip = (function () {
	    // @ngInject
	    function SWTooltip($document, corePartialsPath, hibachiPathBuilder) {
	        this.$document = $document;
	        this.corePartialsPath = corePartialsPath;
	        this.transclude = true;
	        this.restrict = "EA";
	        this.scope = {};
	        this.bindToController = {
	            rbKey: "@?",
	            text: "@?",
	            position: "@?",
	            showTooltip: "=?"
	        };
	        this.controller = SWTooltipController;
	        this.controllerAs = "swTooltip";
	        this.link = function (scope, element, attrs, controller, transclude) {
	            var tooltip = element.find(".tooltip");
	            var elementPosition = element.position();
	            var tooltipStyle = tooltip[0].style;
	            if (attrs && attrs.position) {
	                switch (attrs.position.toLowerCase()) {
	                    case 'top':
	                        tooltipStyle.top = "0px";
	                        tooltipStyle.left = "0px";
	                        break;
	                    case 'bottom':
	                        //where the element is rendered to begin with
	                        break;
	                    case 'left':
	                        tooltipStyle.top = (elementPosition.top + element[0].offsetHeight - 5) + "px";
	                        tooltipStyle.left = (-1 * (elementPosition.left + element[0].offsetLeft - 5)) + "px";
	                        element.find(".tooltip-inner")[0].style.maxWidth = "none";
	                        break;
	                    default:
	                        //right is the default
	                        tooltipStyle.top = (elementPosition.top + element[0].offsetHeight - 5) + "px";
	                        tooltipStyle.left = (elementPosition.left + element[0].offsetWidth - 5) + "px";
	                }
	            }
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "tooltip.html";
	    }
	    SWTooltip.Factory = function () {
	        var directive = function ($document, corePartialsPath, hibachiPathBuilder) { return new SWTooltip($document, corePartialsPath, hibachiPathBuilder); };
	        directive.$inject = ["$document", "corePartialsPath", "hibachiPathBuilder"];
	        return directive;
	    };
	    return SWTooltip;
	})();
	exports.SWTooltip = SWTooltip;


/***/ },
/* 53 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWRbKey = (function () {
	    function SWRbKey($hibachi, observerService, utilityService, $rootScope, $log, rbkeyService) {
	        return {
	            restrict: 'A',
	            scope: {
	                swRbkey: "="
	            },
	            link: function (scope, element, attrs) {
	                var rbKeyValue = scope.swRbkey;
	                var bindRBKey = function () {
	                    if (angular.isDefined(rbKeyValue) && angular.isString(rbKeyValue)) {
	                        element.text(rbkeyService.getRBKey(rbKeyValue));
	                    }
	                };
	                bindRBKey();
	            }
	        };
	    }
	    SWRbKey.Factory = function () {
	        var directive = function ($hibachi, observerService, utilityService, $rootScope, $log, rbkeyService) {
	            return new SWRbKey($hibachi, observerService, utilityService, $rootScope, $log, rbkeyService);
	        };
	        directive.$inject = [
	            '$hibachi',
	            'observerService',
	            'utilityService',
	            '$rootScope',
	            '$log',
	            'rbkeyService'
	        ];
	        return directive;
	    };
	    return SWRbKey;
	})();
	exports.SWRbKey = SWRbKey;


/***/ },
/* 54 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWOptions = (function () {
	    function SWOptions($log, $hibachi, observerService, corePartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'AE',
	            scope: {
	                objectName: '@'
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "options.html",
	            link: function (scope, element, attrs) {
	                scope.swOptions = {};
	                scope.swOptions.objectName = scope.objectName;
	                //sets up drop down options via collections
	                scope.getOptions = function () {
	                    scope.swOptions.object = $hibachi['new' + scope.swOptions.objectName]();
	                    var columnsConfig = [
	                        {
	                            "propertyIdentifier": scope.swOptions.objectName.charAt(0).toLowerCase() + scope.swOptions.objectName.slice(1) + 'Name'
	                        },
	                        {
	                            "propertyIdentifier": scope.swOptions.object.$$getIDName()
	                        }
	                    ];
	                    $hibachi.getEntity(scope.swOptions.objectName, { allRecords: true, columnsConfig: angular.toJson(columnsConfig) })
	                        .then(function (value) {
	                        scope.swOptions.options = value.records;
	                        observerService.notify('optionsLoaded');
	                    });
	                };
	                scope.getOptions();
	                var selectOption = function (option) {
	                    if (option) {
	                        scope.swOptions.selectOption(option);
	                    }
	                    else {
	                        scope.swOptions.selectOption(scope.swOptions.options[0]);
	                    }
	                };
	                observerService.attach(selectOption, 'selectOption', 'selectOption');
	                //use by ng-change to record changes
	                scope.swOptions.selectOption = function (selectedOption) {
	                    scope.swOptions.selectedOption = selectedOption;
	                    observerService.notify('optionsChanged', selectedOption);
	                };
	            }
	        };
	    }
	    SWOptions.Factory = function () {
	        var directive = function ($log, $hibachi, observerService, corePartialsPath, hibachiPathBuilder) {
	            return new SWOptions($log, $hibachi, observerService, corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            'observerService',
	            'corePartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWOptions;
	})();
	exports.SWOptions = SWOptions;


/***/ },
/* 55 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWSelectionController = (function () {
	    //@ngInject
	    function SWSelectionController(selectionService, observerService) {
	        var _this = this;
	        this.selectionService = selectionService;
	        this.observerService = observerService;
	        this.updateSelectValue = function (res) {
	            if (res.action == 'clear') {
	                _this.toggleValue = false;
	            }
	            else if (res.action == 'selectAll') {
	                _this.toggleValue = true;
	            }
	            else if (res.selection == _this.selection) {
	                _this.toggleValue = (res.action == 'check');
	            }
	        };
	        this.toggleSelection = function (toggleValue, selectionid, selection) {
	            console.log(toggleValue);
	            console.log(selectionid);
	            console.log(selection);
	            if (_this.isRadio) {
	                _this.selectionService.radioSelection(selectionid, selection);
	                _this.toggleValue = toggleValue;
	            }
	            else {
	                if (toggleValue) {
	                    _this.selectionService.addSelection(selectionid, selection);
	                }
	                else {
	                    _this.selectionService.removeSelection(selectionid, selection);
	                }
	            }
	        };
	        if (angular.isUndefined(this.name)) {
	            this.name = 'selection';
	        }
	        if (selectionService.isAllSelected(this.selectionid)) {
	            this.toggleValue = !selectionService.hasSelection(this.selectionid, this.selection);
	        }
	        else {
	            this.toggleValue = selectionService.hasSelection(this.selectionid, this.selection);
	        }
	        //attach observer so we know when a selection occurs
	        observerService.attach(this.updateSelectValue, 'swSelectionToggleSelection');
	    }
	    return SWSelectionController;
	})();
	var SWSelection = (function () {
	    function SWSelection(collectionPartialsPath, hibachiPathBuilder) {
	        this.collectionPartialsPath = collectionPartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.restrict = 'E';
	        this.scope = {};
	        this.bindToController = {
	            selection: "=",
	            selectionid: "@",
	            id: "=",
	            isRadio: "=",
	            name: "@",
	            disabled: "="
	        };
	        this.controller = SWSelectionController;
	        this.controllerAs = 'swSelection';
	        this.templateUrl = this.hibachiPathBuilder.buildPartialsPath(this.collectionPartialsPath) + "selection.html";
	    }
	    SWSelection.Factory = function () {
	        var directive = function (corePartialsPath, hibachiPathBuilder) {
	            return new SWSelection(corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['corePartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    SWSelection.$inject = ['corePartialsPath', 'hibachiPathBuilder'];
	    return SWSelection;
	})();
	exports.SWSelection = SWSelection;


/***/ },
/* 56 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWClickOutside = (function () {
	    //@ngInject
	    function SWClickOutside($document, $timeout, utilityService) {
	        var _this = this;
	        this.$document = $document;
	        this.$timeout = $timeout;
	        this.utilityService = utilityService;
	        this.restrict = 'A';
	        this.scope = {
	            swClickOutside: '&'
	        };
	        this.link = function (scope, elem, attr) {
	            _this.$document.on('click', function (e) {
	                if (!e || !e.target)
	                    return;
	                //check if our element already hidden
	                if (angular.element(elem).hasClass("ng-hide")) {
	                    return;
	                }
	                if (e.target !== elem && !_this.utilityService.isDescendantElement(elem, e.target)) {
	                    _this.$timeout(function () {
	                        scope.swClickOutside();
	                    });
	                }
	            });
	        };
	        this.$document = $document;
	        this.$timeout = $timeout;
	        this.utilityService = utilityService;
	    }
	    SWClickOutside.Factory = function () {
	        var directive = function ($document, $timeout, utilityService) {
	            return new SWClickOutside($document, $timeout, utilityService);
	        };
	        directive.$inject = [
	            '$document', '$timeout', 'utilityService'
	        ];
	        return directive;
	    };
	    return SWClickOutside;
	})();
	exports.SWClickOutside = SWClickOutside;


/***/ },
/* 57 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWDirective = (function () {
	    //@ngInject
	    function SWDirective($compile) {
	        return {
	            restrict: 'A',
	            replace: true,
	            scope: {
	                variables: "=",
	                directive: "="
	            },
	            link: function (scope, element, attrs) {
	                var template = '<span ' + scope.directive + ' ';
	                if (angular.isDefined(scope.variables)) {
	                    angular.forEach(scope.variables, function (value, key) {
	                        template += ' ' + key + '=' + value + ' ';
	                    });
	                }
	                template += +'>';
	                template += '</span>';
	                // Render the template.
	                element.html('').append($compile(template)(scope));
	            }
	        };
	    }
	    SWDirective.Factory = function () {
	        var directive = function ($compile) {
	            return new SWDirective($compile);
	        };
	        directive.$inject = [
	            '$compile'
	        ];
	        return directive;
	    };
	    return SWDirective;
	})();
	exports.SWDirective = SWDirective;


/***/ },
/* 58 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWExportAction = (function () {
	    //@ngInject
	    function SWExportAction($log, corePartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'A',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(corePartialsPath) + 'exportaction.html',
	            scope: {},
	            link: function (scope, element, attrs) {
	            }
	        };
	    }
	    SWExportAction.Factory = function () {
	        var directive = function ($log, corePartialsPath, hibachiPathBuilder) {
	            return new SWExportAction($log, corePartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            'corePartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWExportAction;
	})();
	exports.SWExportAction = SWExportAction;


/***/ },
/* 59 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWHref = (function () {
	    function SWHref() {
	        return {
	            restrict: 'A',
	            scope: {
	                swHref: "@"
	            },
	            link: function (scope, element, attrs) {
	                /*convert link to use hashbang*/
	                var hrefValue = attrs.swHref;
	                hrefValue = '?ng#!' + hrefValue;
	                element.attr('href', hrefValue);
	            }
	        };
	    }
	    SWHref.Factory = function () {
	        var directive = function () {
	            return new SWHref();
	        };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWHref;
	})();
	exports.SWHref = SWHref;


/***/ },
/* 60 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWProcessCallerController = (function () {
	    //@ngInject
	    function SWProcessCallerController(rbkeyService, $templateRequest, $compile, corePartialsPath, $scope, $element, $transclude, utilityService, hibachiPathBuilder) {
	        var _this = this;
	        this.rbkeyService = rbkeyService;
	        this.$templateRequest = $templateRequest;
	        this.$compile = $compile;
	        this.corePartialsPath = corePartialsPath;
	        this.$scope = $scope;
	        this.$element = $element;
	        this.$transclude = $transclude;
	        this.$templateRequest = $templateRequest;
	        this.$compile = $compile;
	        this.corePartialsPath = corePartialsPath;
	        this.utilityService = utilityService;
	        this.type = this.type || 'link';
	        this.queryString = this.queryString || '';
	        this.$scope = $scope;
	        this.$element = $element;
	        this.$transclude = this.$transclude;
	        this.$templateRequest(hibachiPathBuilder.buildPartialsPath(this.corePartialsPath) + "processcaller.html").then(function (html) {
	            var template = angular.element(html);
	            _this.$element.parent().append(template);
	            $compile(template)(_this.$scope);
	        });
	        if (angular.isDefined(this.titleRbKey)) {
	            this.title = this.rbkeyService.getRBKey(this.titleRbKey);
	        }
	        if (angular.isUndefined(this.text)) {
	            this.text = this.title;
	        }
	    }
	    return SWProcessCallerController;
	})();
	var SWProcessCaller = (function () {
	    function SWProcessCaller(corePartialsPath, utilityService) {
	        this.corePartialsPath = corePartialsPath;
	        this.utilityService = utilityService;
	        this.restrict = 'E';
	        this.scope = {};
	        this.bindToController = {
	            action: "@",
	            entity: "@",
	            processContext: "@",
	            hideDisabled: "=",
	            type: "@",
	            queryString: "@",
	            text: "@",
	            title: "@?",
	            titleRbKey: "@?",
	            'class': "@",
	            icon: "=",
	            iconOnly: "=",
	            submit: "=",
	            confirm: "=",
	            disabled: "=",
	            disabledText: "@",
	            modal: "="
	        };
	        this.controller = SWProcessCallerController;
	        this.controllerAs = "swProcessCaller";
	        this.link = function (scope, element, attrs) {
	        };
	        this.corePartialsPath = corePartialsPath;
	        this.utilityService = utilityService;
	    }
	    SWProcessCaller.Factory = function () {
	        var directive = function (corePartialsPath, utilityService) {
	            return new SWProcessCaller(corePartialsPath, utilityService);
	        };
	        directive.$inject = [
	            'corePartialsPath', 'utilityService'
	        ];
	        return directive;
	    };
	    SWProcessCaller.$inject = ['corePartialsPath', 'utilityService'];
	    return SWProcessCaller;
	})();
	exports.SWProcessCaller = SWProcessCaller;


/***/ },
/* 61 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWSortable = (function () {
	    function SWSortable(expression, compiledElement) {
	        return function (linkElement) {
	            var scope = this;
	            linkElement.sortable({
	                placeholder: "placeholder",
	                opacity: 0.8,
	                axis: "y",
	                update: function (event, ui) {
	                    // get model
	                    var model = scope.$apply(expression);
	                    // remember its length
	                    var modelLength = model.length;
	                    // rember html nodes
	                    var items = [];
	                    // loop through items in new order
	                    linkElement.children().each(function (index) {
	                        var item = $(this);
	                        // get old item index
	                        var oldIndex = parseInt(item.attr("sw:sortable-index"), 10);
	                        // add item to the end of model
	                        model.push(model[oldIndex]);
	                        if (item.attr("sw:sortable-index")) {
	                            // items in original order to restore dom
	                            items[oldIndex] = item;
	                            // and remove item from dom
	                            item.detach();
	                        }
	                    });
	                    model.splice(0, modelLength);
	                    // restore original dom order, so angular does not get confused
	                    linkElement.append.apply(linkElement, items);
	                    // notify angular of the change
	                    scope.$digest();
	                }
	            });
	        };
	    }
	    SWSortable.Factory = function () {
	        var directive = function (expression, compiledElement) { return new SWSortable(expression, compiledElement); };
	        directive.$inject = ['expression', 'compiledElement'];
	        return directive;
	    };
	    return SWSortable;
	})();
	exports.SWSortable = SWSortable;


/***/ },
/* 62 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWListingGlobalSearchController = (function () {
	    //@ngInject
	    function SWListingGlobalSearchController($timeout) {
	        var _this = this;
	        this.$timeout = $timeout;
	        this.init = function () {
	            _this.searching = false;
	        };
	        this.search = function () {
	            _this.searching = true;
	            if (_this._timeoutPromise) {
	                _this.$timeout.cancel(_this._timeoutPromise);
	            }
	            _this._timeoutPromise = _this.$timeout(function () {
	                _this.getCollection();
	            }, 500);
	        };
	        this.init();
	    }
	    return SWListingGlobalSearchController;
	})();
	var SWListingGlobalSearch = (function () {
	    //@ngInject
	    function SWListingGlobalSearch(utilityService, corePartialsPath, hibachiPathBuilder) {
	        this.utilityService = utilityService;
	        this.restrict = 'EA';
	        this.scope = {};
	        this.bindToController = {
	            searching: "=",
	            searchText: "=",
	            getCollection: "="
	        };
	        this.controller = SWListingGlobalSearchController;
	        this.controllerAs = "swListingGlobalSearch";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(corePartialsPath) + "listingglobalsearch.html";
	    }
	    SWListingGlobalSearch.Factory = function () {
	        var directive = function (utilityService, corePartialsPath, hibachiPathBuilder) { return new SWListingGlobalSearch(utilityService, corePartialsPath, hibachiPathBuilder); };
	        directive.$inject = ['utilityService', 'corePartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWListingGlobalSearch;
	})();
	exports.SWListingGlobalSearch = SWListingGlobalSearch;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	/// <reference path="../../typings/slatwallTypescript.d.ts" />
	var hibachi_module_1 = __webpack_require__(64);
	var workflow_module_1 = __webpack_require__(138);
	var entity_module_1 = __webpack_require__(97);
	var content_module_1 = __webpack_require__(154);
	var formbuilder_module_1 = __webpack_require__(159);
	var giftcard_module_1 = __webpack_require__(161);
	var optiongroup_module_1 = __webpack_require__(172);
	var orderitem_module_1 = __webpack_require__(175);
	var product_module_1 = __webpack_require__(182);
	var productbundle_module_1 = __webpack_require__(184);
	//constant
	var slatwallpathbuilder_1 = __webpack_require__(191);
	//directives
	var swcurrencyformatter_1 = __webpack_require__(192);
	//filters
	var swcurrency_1 = __webpack_require__(193);
	var slatwalladminmodule = angular.module('slatwalladmin', [
	    //custom modules
	    hibachi_module_1.hibachimodule.name,
	    entity_module_1.entitymodule.name,
	    content_module_1.contentmodule.name,
	    formbuilder_module_1.formbuildermodule.name,
	    giftcard_module_1.giftcardmodule.name,
	    optiongroup_module_1.optiongroupmodule.name,
	    orderitem_module_1.orderitemmodule.name,
	    product_module_1.productmodule.name,
	    productbundle_module_1.productbundlemodule.name,
	    workflow_module_1.workflowmodule.name
	])
	    .constant("baseURL", $.slatwall.getConfig().baseURL)
	    .constant('slatwallPathBuilder', new slatwallpathbuilder_1.SlatwallPathBuilder())
	    .config(["$provide", '$logProvider', '$filterProvider', '$httpProvider', '$routeProvider', '$injector', '$locationProvider', 'datepickerConfig', 'datepickerPopupConfig', 'slatwallPathBuilder', 'appConfig',
	    function ($provide, $logProvider, $filterProvider, $httpProvider, $routeProvider, $injector, $locationProvider, datepickerConfig, datepickerPopupConfig, slatwallPathBuilder, appConfig) {
	        //configure partials path properties
	        slatwallPathBuilder.setBaseURL($.slatwall.getConfig().baseURL);
	        slatwallPathBuilder.setBasePartialsPath('/admin/client/src/');
	        datepickerConfig.showWeeks = false;
	        datepickerConfig.format = 'MMM dd, yyyy hh:mm a';
	        datepickerPopupConfig.toggleWeeksText = null;
	        // route provider configuration
	    }])
	    .run(['$rootScope', '$filter', '$anchorScroll', '$hibachi', 'dialogService', 'observerService', 'utilityService', 'slatwallPathBuilder', function ($rootScope, $filter, $anchorScroll, $hibachi, dialogService, observerService, utilityService, slatwallPathBuilder) {
	        $anchorScroll.yOffset = 100;
	        $rootScope.openPageDialog = function (partial) {
	            dialogService.addPageDialog(partial);
	        };
	        $rootScope.closePageDialog = function (index) {
	            dialogService.removePageDialog(index);
	        };
	        // $rootScope.loadedResourceBundle = false;
	        // $rootScope.loadedResourceBundle = $hibachi.hasResourceBundle();
	        $rootScope.createID = utilityService.createID;
	        // var rbListener = $rootScope.$watch('loadedResourceBundle',function(newValue,oldValue){
	        //     if(newValue !== oldValue){
	        //         $rootScope.$broadcast('hasResourceBundle');
	        //         rbListener();
	        //     }
	        // });
	    }])
	    .directive('swCurrencyFormatter', swcurrencyformatter_1.SWCurrencyFormatter.Factory())
	    .filter('swcurrency', ['$sce', '$log', '$hibachi', swcurrency_1.SWCurrency.Factory]);
	exports.slatwalladminmodule = slatwalladminmodule;
	// ((): void => {
	//     var app = angular.module('slatwalladmin', ['hibachi','ngSlatwall','ngSlatwallModel','ui.bootstrap','ngAnimate','ngRoute','ngSanitize','ngCkeditor']);
	//     app.config(
	//         ["$provide",'$logProvider','$filterProvider','$httpProvider','$routeProvider','$injector','$locationProvider','datepickerConfig', 'datepickerPopupConfig',
	//         ($provide, $logProvider,$filterProvider,$httpProvider,$routeProvider,$injector,$locationProvider,datepickerConfig, datepickerPopupConfig) =>
	//      {
	//         datepickerConfig.showWeeks = false;
	//         datepickerConfig.format = 'MMM dd, yyyy hh:mm a';
	//             datepickerPopupConfig.toggleWeeksText = null;
	//         if(slatwallAngular.hashbang){
	//             $locationProvider.html5Mode( false ).hashPrefix('!');
	//         }
	//         //
	//         $provide.constant("baseURL", $.slatwall.getConfig().baseURL);
	//         var _partialsPath = $.slatwall.getConfig().baseURL + '/admin/client/partials/';
	//         $provide.constant("partialsPath", _partialsPath);
	//         $provide.constant("productBundlePartialsPath", _partialsPath+'productbundle/');
	//         angular.forEach(slatwallAngular.constantPaths, function(constantPath,key){
	//             var constantKey = constantPath.charAt(0).toLowerCase()+constantPath.slice(1)+'PartialsPath';
	//             var constantPartialsPath = _partialsPath+constantPath.toLowerCase()+'/';
	//             $provide.constant(constantKey, constantPartialsPath);
	//         });
	//         $logProvider.debugEnabled( $.slatwall.getConfig().debugFlag );
	//         $filterProvider.register('likeFilter',function(){
	//             return function(text){
	//                 if(angular.isDefined(text) && angular.isString(text)){
	//                     return text.replace(new RegExp('%', 'g'), '');
	//                 }
	//             };
	//         });
	//         $filterProvider.register('truncate',function(){
	//             return function (input, chars, breakOnWord) {
	//                 if (isNaN(chars)) return input;
	//                 if (chars <= 0) return '';
	//                 if (input && input.length > chars) {
	//                     input = input.substring(0, chars);
	//                     if (!breakOnWord) {
	//                         var lastspace = input.lastIndexOf(' ');
	//                         //get last space
	//                         if (lastspace !== -1) {
	//                             input = input.substr(0, lastspace);
	//                         }
	//                     }else{
	//                         while(input.charAt(input.length-1) === ' '){
	//                             input = input.substr(0, input.length -1);
	//                         }
	//                     }
	//                     return input + '...';
	//                 }
	//                 return input;
	//             };
	//         });
	//         $httpProvider.interceptors.push('slatwallInterceptor');
	//         // route provider configuration
	//         $routeProvider.when('/entity/:entityName/', {
	//             template: function(params){
	//                 var entityDirectiveExists = $injector.has('sw'+params.entityName+'ListDirective');
	//                 if(entityDirectiveExists){
	//                     return '<sw-'+params.entityName.toLowerCase()+'-list>';
	//                 }else{
	//                     return '<sw-list></sw-list>';
	//                 }
	//             },
	//             controller: 'routerController'
	//         }).when('/entity/:entityName/:entityID', {
	//             template: function(params){
	//                 var entityDirectiveExists = $injector.has('sw'+params.entityName+'DetailDirective');
	//                 if(entityDirectiveExists){
	//                     return '<sw-'+params.entityName.toLowerCase()+'-detail>';
	//                 }else{
	//                     return '<sw-detail></sw-detail>';
	//                 }
	//             },
	//             controller: 'routerController',
	//         }).otherwise({
	//             //controller:'otherwiseController'
	//             templateUrl: $.slatwall.getConfig().baseURL + '/admin/client/js/partials/otherwise.html',
	//         });
	//     }]).run(['$rootScope','$filter','$anchorScroll','$hibachi','dialogService','observerService','utilityService', ($rootScope,$filter,$anchorScroll,$hibachi,dialogService,observerService,utilityService) => {
	//         $anchorScroll.yOffset = 100;
	//         $rootScope.openPageDialog = function( partial ) {
	//             dialogService.addPageDialog( partial );
	//         };
	//         $rootScope.closePageDialog = function( index ) {
	//             dialogService.removePageDialog( index );
	//         };
	//         $rootScope.loadedResourceBundle = false;
	//         $rootScope.loadedResourceBundle = $hibachi.hasResourceBundle();
	//         $rootScope.buildUrl = $hibachi.buildUrl;
	//         $rootScope.createID = utilityService.createID;
	//         var rbListener = $rootScope.$watch('loadedResourceBundle',function(newValue,oldValue){
	//             if(newValue !== oldValue){
	//                 $rootScope.$broadcast('hasResourceBundle');
	//                 rbListener();
	//             }
	//         });
	//     }])
	// })();


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//import alertmodule = require('./alert/alert.module');
	var alert_module_1 = __webpack_require__(65);
	var collection_module_1 = __webpack_require__(69);
	var core_module_1 = __webpack_require__(2);
	var dialog_module_1 = __webpack_require__(94);
	var entity_module_1 = __webpack_require__(97);
	var pagination_module_1 = __webpack_require__(103);
	var form_module_1 = __webpack_require__(106);
	var validation_module_1 = __webpack_require__(122);
	var workflow_module_1 = __webpack_require__(138);
	//directives
	var swsaveandfinish_1 = __webpack_require__(153);
	var hibachimodule = angular.module('hibachi', [
	    alert_module_1.alertmodule.name,
	    core_module_1.coremodule.name,
	    collection_module_1.collectionmodule.name,
	    entity_module_1.entitymodule.name,
	    dialog_module_1.dialogmodule.name,
	    pagination_module_1.paginationmodule.name,
	    form_module_1.formmodule.name,
	    validation_module_1.validationmodule.name,
	    workflow_module_1.workflowmodule.name
	])
	    .constant('hibachiPartialsPath', 'hibachi/components/')
	    .directive('swSaveAndFinish', swsaveandfinish_1.SWSaveAndFinish.Factory());
	exports.hibachimodule = hibachimodule;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//controllers
	var alertcontroller_1 = __webpack_require__(66);
	//services
	var alertservice_1 = __webpack_require__(67);
	var alertmodule = angular.module('hibachi.alert', [])
	    .controller('alertController', alertcontroller_1.AlertController)
	    .service('alertService', alertservice_1.AlertService);
	exports.alertmodule = alertmodule;


/***/ },
/* 66 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var AlertController = (function () {
	    //@ngInject
	    function AlertController($scope, alertService) {
	        $scope.$id = "alertController";
	        $scope.alerts = alertService.getAlerts();
	    }
	    return AlertController;
	})();
	exports.AlertController = AlertController;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	//import Alert = require('../model/alert');
	var alert_1 = __webpack_require__(68);
	var AlertService = (function () {
	    function AlertService($timeout, alerts) {
	        var _this = this;
	        this.$timeout = $timeout;
	        this.alerts = alerts;
	        this.newAlert = function () {
	            return new alert_1.Alert();
	        };
	        this.get = function () {
	            return _this.alerts || [];
	        };
	        this.addAlert = function (alert) {
	            _this.alerts.push(alert);
	            _this.$timeout(function () {
	                _this.removeAlert(alert);
	            }, 3500);
	        };
	        this.addAlerts = function (alerts) {
	            angular.forEach(alerts, function (alert) {
	                _this.addAlert(alert);
	            });
	        };
	        this.removeAlert = function (alert) {
	            var index = _this.alerts.indexOf(alert, 0);
	            if (index != undefined) {
	                _this.alerts.splice(index, 1);
	            }
	        };
	        this.getAlerts = function () {
	            return _this.alerts;
	        };
	        this.formatMessagesToAlerts = function (messages) {
	            var alerts = [];
	            if (messages && messages.length) {
	                for (var message in messages) {
	                    var alert = new alert_1.Alert(messages[message].message, messages[message].messageType);
	                    alerts.push(alert);
	                    if (alert.type === 'success' || alert.type === 'error') {
	                        _this.$timeout(function () {
	                            alert.fade = true;
	                        }, 3500);
	                        alert.dismissable = false;
	                    }
	                    else {
	                        alert.fade = false;
	                        alert.dismissable = true;
	                    }
	                }
	            }
	            return alerts;
	        };
	        this.removeOldestAlert = function () {
	            _this.alerts.splice(0, 1);
	        };
	        this.alerts = [];
	    }
	    AlertService.$inject = [
	        '$timeout'
	    ];
	    return AlertService;
	})();
	exports.AlertService = AlertService;


/***/ },
/* 68 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	//model
	var Alert = (function () {
	    function Alert(msg, type, fade, dismissable) {
	        this.fade = false;
	        this.dismissable = false;
	        this.msg = msg;
	        this.type = type;
	        this.fade = fade;
	        this.dismissable = dismissable;
	    }
	    return Alert;
	})();
	exports.Alert = Alert;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//modules
	var core_module_1 = __webpack_require__(2);
	//services
	var collectionconfigservice_1 = __webpack_require__(70);
	var collectionservice_1 = __webpack_require__(71);
	//controllers
	var collections_1 = __webpack_require__(72);
	var createcollection_1 = __webpack_require__(73);
	var confirmationcontroller_1 = __webpack_require__(74);
	//directives
	var swcollection_1 = __webpack_require__(75);
	var swaddfilterbuttons_1 = __webpack_require__(76);
	var swdisplayoptions_1 = __webpack_require__(77);
	var swdisplayitem_1 = __webpack_require__(78);
	var swcollectiontable_1 = __webpack_require__(79);
	var swcolumnitem_1 = __webpack_require__(80);
	var swconditioncriteria_1 = __webpack_require__(81);
	var swcriteria_1 = __webpack_require__(82);
	var swcriteriaboolean_1 = __webpack_require__(83);
	var swcriteriadate_1 = __webpack_require__(84);
	var swcriteriamanytomany_1 = __webpack_require__(85);
	var swcriteriamanytoone_1 = __webpack_require__(86);
	var swcriterianumber_1 = __webpack_require__(87);
	var swcriteriaonetomany_1 = __webpack_require__(88);
	var swcriteriastring_1 = __webpack_require__(89);
	var sweditfilteritem_1 = __webpack_require__(90);
	var swfiltergroups_1 = __webpack_require__(91);
	var swfilteritem_1 = __webpack_require__(92);
	var swfiltergroupitem_1 = __webpack_require__(93);
	var collectionmodule = angular.module('hibachi.collection', [core_module_1.coremodule.name])
	    .config([function () {
	    }]).run([function () {
	    }])
	    .constant('collectionPartialsPath', 'collection/components/')
	    .controller('collections', collections_1.CollectionController)
	    .controller('confirmationController', confirmationcontroller_1.ConfirmationController)
	    .controller('createCollection', createcollection_1.CreateCollection)
	    .factory('collectionConfigService', ['rbkeyService', '$hibachi', 'utilityService', 'observerService', function (rbkeyService, $hibachi, utilityService, observerService) { return new collectionconfigservice_1.CollectionConfig(rbkeyService, $hibachi, utilityService, observerService); }])
	    .service('collectionService', collectionservice_1.CollectionService)
	    .directive('swCollection', swcollection_1.SWCollection.Factory())
	    .directive('swAddFilterButtons', swaddfilterbuttons_1.SWAddFilterButtons.Factory())
	    .directive('swDisplayOptions', swdisplayoptions_1.SWDisplayOptions.Factory())
	    .directive('swDisplayItem', swdisplayitem_1.SWDisplayItem.Factory())
	    .directive('swCollectionTable', swcollectiontable_1.SWCollectionTable.Factory())
	    .directive('swColumnItem', swcolumnitem_1.SWColumnItem.Factory())
	    .directive('swConditionCriteria', swconditioncriteria_1.SWConditionCriteria.Factory())
	    .directive('swCriteria', swcriteria_1.SWCriteria.Factory())
	    .directive('swCriteriaBoolean', swcriteriaboolean_1.SWCriteriaBoolean.Factory())
	    .directive('swCriteriaDate', swcriteriadate_1.SWCriteriaDate.Factory())
	    .directive('swCriteriaManyToMany', swcriteriamanytomany_1.SWCriteriaManyToMany.Factory())
	    .directive('swCriteriaManyToOne', swcriteriamanytoone_1.SWCriteriaManyToOne.Factory())
	    .directive('swCriteriaNumber', swcriterianumber_1.SWCriteriaNumber.Factory())
	    .directive('swCriteriaOneToMany', swcriteriaonetomany_1.SWCriteriaOneToMany.Factory())
	    .directive('swCriteriaString', swcriteriastring_1.SWCriteriaString.Factory())
	    .directive('swEditFilterItem', sweditfilteritem_1.SWEditFilterItem.Factory())
	    .directive('swFilterGroups', swfiltergroups_1.SWFilterGroups.Factory())
	    .directive('swFilterItem', swfilteritem_1.SWFilterItem.Factory())
	    .directive('swFilterGroupItem', swfiltergroupitem_1.SWFilterGroupItem.Factory());
	exports.collectionmodule = collectionmodule;


/***/ },
/* 70 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var Column = (function () {
	    function Column(propertyIdentifier, title, isVisible, isDeletable, isSearchable, isExportable, persistent, ormtype, attributeID, attributeSetObject) {
	        if (isVisible === void 0) { isVisible = true; }
	        if (isDeletable === void 0) { isDeletable = true; }
	        if (isSearchable === void 0) { isSearchable = true; }
	        if (isExportable === void 0) { isExportable = true; }
	        this.propertyIdentifier = propertyIdentifier;
	        this.title = title;
	        this.isVisible = isVisible;
	        this.isDeletable = isDeletable;
	        this.isSearchable = isSearchable;
	        this.isExportable = isExportable;
	        this.persistent = persistent;
	        this.ormtype = ormtype;
	        this.attributeID = attributeID;
	        this.attributeSetObject = attributeSetObject;
	    }
	    return Column;
	})();
	exports.Column = Column;
	var Filter = (function () {
	    function Filter(propertyIdentifier, value, comparisonOperator, logicalOperator, displayPropertyIdentifier, displayValue, hidden, pattern) {
	        if (hidden === void 0) { hidden = false; }
	        this.propertyIdentifier = propertyIdentifier;
	        this.value = value;
	        this.comparisonOperator = comparisonOperator;
	        this.logicalOperator = logicalOperator;
	        this.displayPropertyIdentifier = displayPropertyIdentifier;
	        this.displayValue = displayValue;
	        this.hidden = hidden;
	        this.pattern = pattern;
	    }
	    return Filter;
	})();
	exports.Filter = Filter;
	var CollectionFilter = (function () {
	    function CollectionFilter(propertyIdentifier, displayPropertyIdentifier, displayValue, collectionID, criteria, fieldtype, readOnly) {
	        if (readOnly === void 0) { readOnly = false; }
	        this.propertyIdentifier = propertyIdentifier;
	        this.displayPropertyIdentifier = displayPropertyIdentifier;
	        this.displayValue = displayValue;
	        this.collectionID = collectionID;
	        this.criteria = criteria;
	        this.fieldtype = fieldtype;
	        this.readOnly = readOnly;
	    }
	    return CollectionFilter;
	})();
	exports.CollectionFilter = CollectionFilter;
	var Join = (function () {
	    function Join(associationName, alias) {
	        this.associationName = associationName;
	        this.alias = alias;
	    }
	    return Join;
	})();
	exports.Join = Join;
	var OrderBy = (function () {
	    function OrderBy(propertyIdentifier, direction) {
	        this.propertyIdentifier = propertyIdentifier;
	        this.direction = direction;
	    }
	    return OrderBy;
	})();
	exports.OrderBy = OrderBy;
	var CollectionConfig = (function () {
	    // @ngInject
	    function CollectionConfig(rbkeyService, $hibachi, utilityService, observerService, baseEntityName, baseEntityAlias, columns, filterGroups, joins, orderBy, groupBys, id, currentPage, pageShow, keywords, allRecords, isDistinct) {
	        var _this = this;
	        if (filterGroups === void 0) { filterGroups = [{ filterGroup: [] }]; }
	        if (currentPage === void 0) { currentPage = 1; }
	        if (pageShow === void 0) { pageShow = 10; }
	        if (keywords === void 0) { keywords = ''; }
	        if (allRecords === void 0) { allRecords = false; }
	        if (isDistinct === void 0) { isDistinct = false; }
	        this.rbkeyService = rbkeyService;
	        this.$hibachi = $hibachi;
	        this.utilityService = utilityService;
	        this.observerService = observerService;
	        this.baseEntityName = baseEntityName;
	        this.baseEntityAlias = baseEntityAlias;
	        this.columns = columns;
	        this.filterGroups = filterGroups;
	        this.joins = joins;
	        this.orderBy = orderBy;
	        this.groupBys = groupBys;
	        this.id = id;
	        this.currentPage = currentPage;
	        this.pageShow = pageShow;
	        this.keywords = keywords;
	        this.allRecords = allRecords;
	        this.isDistinct = isDistinct;
	        this.clearFilterGroups = function () {
	            _this.filterGroups = [{ filterGroup: [] }];
	            return _this;
	        };
	        this.newCollectionConfig = function (baseEntityName, baseEntityAlias) {
	            return new CollectionConfig(_this.rbkeyService, _this.$hibachi, _this.utilityService, _this.observerService, baseEntityName, baseEntityAlias);
	        };
	        this.loadJson = function (jsonCollection) {
	            //if json then make a javascript object else use the javascript object
	            if (angular.isString(jsonCollection)) {
	                jsonCollection = angular.fromJson(jsonCollection);
	            }
	            _this.baseEntityAlias = jsonCollection.baseEntityAlias;
	            _this.baseEntityName = jsonCollection.baseEntityName;
	            if (angular.isDefined(jsonCollection.filterGroups)) {
	                _this.validateFilter(jsonCollection.filterGroups);
	                _this.filterGroups = jsonCollection.filterGroups;
	            }
	            _this.columns = jsonCollection.columns;
	            _this.joins = jsonCollection.joins;
	            _this.keywords = jsonCollection.keywords;
	            _this.orderBy = jsonCollection.orderBy;
	            _this.groupBys = jsonCollection.groupBys;
	            _this.pageShow = jsonCollection.pageShow;
	            _this.allRecords = jsonCollection.allRecords;
	            _this.isDistinct = jsonCollection.isDistinct;
	            _this.currentPage = jsonCollection.currentPage || 1;
	            _this.pageShow = jsonCollection.pageShow || 10;
	            _this.keywords = jsonCollection.keywords;
	            return _this;
	        };
	        this.loadFilterGroups = function (filterGroupsConfig) {
	            if (filterGroupsConfig === void 0) { filterGroupsConfig = [{ filterGroup: [] }]; }
	            _this.filterGroups = filterGroupsConfig;
	            return _this;
	        };
	        this.loadColumns = function (columns) {
	            _this.columns = columns;
	            return _this;
	        };
	        this.getCollectionConfig = function () {
	            _this.validateFilter(_this.filterGroups);
	            return {
	                baseEntityAlias: _this.baseEntityAlias,
	                baseEntityName: _this.baseEntityName,
	                columns: _this.columns,
	                filterGroups: _this.filterGroups,
	                joins: _this.joins,
	                groupBys: _this.groupBys,
	                currentPage: _this.currentPage,
	                pageShow: _this.pageShow,
	                keywords: _this.keywords,
	                defaultColumns: (!_this.columns || !_this.columns.length),
	                allRecords: _this.allRecords,
	                isDistinct: _this.isDistinct,
	                orderBy: _this.orderBy
	            };
	        };
	        this.getEntityName = function () {
	            return _this.baseEntityName.charAt(0).toUpperCase() + _this.baseEntityName.slice(1);
	        };
	        this.getOptions = function () {
	            _this.validateFilter(_this.filterGroups);
	            var options = {
	                columnsConfig: angular.toJson(_this.columns),
	                filterGroupsConfig: angular.toJson(_this.filterGroups),
	                joinsConfig: angular.toJson(_this.joins),
	                orderByConfig: angular.toJson(_this.orderBy),
	                groupBysConfig: angular.toJson(_this.groupBys),
	                currentPage: _this.currentPage,
	                pageShow: _this.pageShow,
	                keywords: _this.keywords,
	                defaultColumns: (!_this.columns || !_this.columns.length),
	                allRecords: _this.allRecords,
	                isDistinct: _this.isDistinct
	            };
	            if (angular.isDefined(_this.id)) {
	                options['id'] = _this.id;
	            }
	            return options;
	        };
	        this.debug = function () {
	            return _this;
	        };
	        this.formatPropertyIdentifier = function (propertyIdentifier, addJoin) {
	            if (addJoin === void 0) { addJoin = false; }
	            //if already starts with alias, strip it out
	            if (propertyIdentifier.lastIndexOf(_this.baseEntityAlias, 0) === 0) {
	                propertyIdentifier = propertyIdentifier.slice(_this.baseEntityAlias.length + 1);
	            }
	            var _propertyIdentifier = _this.baseEntityAlias;
	            if (addJoin === true) {
	                _propertyIdentifier += _this.processJoin(propertyIdentifier);
	            }
	            else {
	                _propertyIdentifier += '.' + propertyIdentifier;
	            }
	            return _propertyIdentifier;
	        };
	        this.processJoin = function (propertyIdentifier) {
	            var _propertyIdentifier = '', propertyIdentifierParts = propertyIdentifier.split('.'), current_collection = _this.collection;
	            for (var i = 0; i < propertyIdentifierParts.length; i++) {
	                if (angular.isDefined(current_collection.metaData[propertyIdentifierParts[i]]) && ('cfc' in current_collection.metaData[propertyIdentifierParts[i]])) {
	                    current_collection = _this.$hibachi.getEntityExample(current_collection.metaData[propertyIdentifierParts[i]].cfc);
	                    _propertyIdentifier += '_' + propertyIdentifierParts[i];
	                    _this.addJoin(new Join(_propertyIdentifier.replace(/_/g, '.').substring(1), _this.baseEntityAlias + _propertyIdentifier));
	                }
	                else {
	                    _propertyIdentifier += '.' + propertyIdentifierParts[i];
	                }
	            }
	            return _propertyIdentifier;
	        };
	        this.addJoin = function (join) {
	            if (!_this.joins) {
	                _this.joins = [];
	            }
	            var joinFound = false;
	            angular.forEach(_this.joins, function (configJoin) {
	                if (configJoin.alias === join.alias) {
	                    joinFound = true;
	                }
	            });
	            if (!joinFound) {
	                _this.joins.push(join);
	            }
	            return _this;
	        };
	        this.addAlias = function (propertyIdentifier) {
	            var parts = propertyIdentifier.split('.');
	            if (parts.length > 1 && parts[0] !== _this.baseEntityAlias) {
	                return _this.baseEntityAlias + '.' + propertyIdentifier;
	            }
	            return propertyIdentifier;
	        };
	        this.addColumn = function (column, title, options) {
	            if (title === void 0) { title = ''; }
	            if (options === void 0) { options = {}; }
	            if (!_this.columns || _this.utilityService.ArrayFindByPropertyValue(_this.columns, 'propertyIdentifier', column) === -1) {
	                var isVisible = true, isDeletable = true, isSearchable = true, isExportable = true, persistent, ormtype = 'string', lastProperty = column.split('.').pop();
	                var lastEntity = _this.$hibachi.getEntityExample(_this.$hibachi.getLastEntityNameInPropertyIdentifier(_this.baseEntityName, column));
	                if (angular.isUndefined(lastEntity)) {
	                    throw ("You have passed an incorrect entity name to a collection config");
	                }
	                if (angular.isUndefined(_this.columns)) {
	                    _this.columns = [];
	                }
	                if (!angular.isUndefined(options['isVisible'])) {
	                    isVisible = options['isVisible'];
	                }
	                if (!angular.isUndefined(options['isDeletable'])) {
	                    isDeletable = options['isDeletable'];
	                }
	                if (!angular.isUndefined(options['isSearchable'])) {
	                    isSearchable = options['isSearchable'];
	                }
	                if (!angular.isUndefined(options['isExportable'])) {
	                    isExportable = options['isExportable'];
	                }
	                if (angular.isUndefined(options['isExportable']) && !isVisible) {
	                    isExportable = false;
	                }
	                if (!angular.isUndefined(options['ormtype'])) {
	                    ormtype = options['ormtype'];
	                }
	                else if (lastEntity.metaData[lastProperty] && lastEntity.metaData[lastProperty].ormtype) {
	                    ormtype = lastEntity.metaData[lastProperty].ormtype;
	                }
	                if (angular.isDefined(lastEntity.metaData[lastProperty])) {
	                    persistent = lastEntity.metaData[lastProperty].persistent;
	                }
	                var columnObject = new Column(column, title, isVisible, isDeletable, isSearchable, isExportable, persistent, ormtype, options['attributeID'], options['attributeSetObject']);
	                if (options['aggregate']) {
	                    columnObject['aggregate'] = options['aggregate'],
	                        columnObject['aggregateAlias'] = title;
	                }
	                //add any non-conventional options
	                for (var key in options) {
	                    if (!columnObject[key]) {
	                        columnObject[key] = options[key];
	                    }
	                }
	                _this.columns.push(columnObject);
	            }
	            return _this;
	        };
	        this.setDisplayProperties = function (propertyIdentifier, title, options) {
	            if (title === void 0) { title = ''; }
	            if (options === void 0) { options = {}; }
	            _this.addDisplayProperty(propertyIdentifier, title, options);
	            return _this;
	        };
	        this.addDisplayAggregate = function (propertyIdentifier, aggregateFunction, aggregateAlias, options) {
	            if (angular.isUndefined(aggregateAlias)) {
	                aggregateAlias = propertyIdentifier.replace(/\./g, '_') + aggregateFunction;
	            }
	            var column = {
	                propertyIdentifier: _this.formatPropertyIdentifier(propertyIdentifier, true),
	                title: _this.rbkeyService.getRBKey("entity." + _this.$hibachi.getLastEntityNameInPropertyIdentifier(_this.baseEntityName, propertyIdentifier) + "." + _this.utilityService.listLast(propertyIdentifier)),
	                aggregate: {
	                    aggregateFunction: aggregateFunction,
	                    aggregateAlias: aggregateAlias
	                }
	            };
	            angular.extend(column, options);
	            //Add columns
	            _this.addColumn(column.propertyIdentifier, undefined, column);
	            return _this;
	        };
	        this.addGroupBy = function (groupByAlias) {
	            if (!_this.groupBys) {
	                _this.groupBys = '';
	            }
	            _this.groupBys = _this.utilityService.listAppend(_this.groupBys, groupByAlias);
	            return _this;
	        };
	        this.addDisplayProperty = function (propertyIdentifier, title, options) {
	            if (title === void 0) { title = ''; }
	            if (options === void 0) { options = {}; }
	            var _DividedColumns = propertyIdentifier.trim().split(',');
	            var _DividedTitles = title.trim().split(',');
	            _DividedColumns.forEach(function (column, index) {
	                column = column.trim();
	                if (angular.isDefined(_DividedTitles[index]) && _DividedTitles[index].trim() != '') {
	                    title = _DividedTitles[index].trim();
	                }
	                else {
	                    title = _this.rbkeyService.getRBKey("entity." + _this.$hibachi.getLastEntityNameInPropertyIdentifier(_this.baseEntityName, column) + "." + _this.utilityService.listLast(column, "."));
	                }
	                _this.addColumn(_this.formatPropertyIdentifier(column), title, options);
	            });
	            return _this;
	        };
	        this.addFilter = function (propertyIdentifier, value, comparisonOperator, logicalOperator, hidden) {
	            if (comparisonOperator === void 0) { comparisonOperator = '='; }
	            if (hidden === void 0) { hidden = false; }
	            //create filter
	            var filter = _this.createFilter(propertyIdentifier, value, comparisonOperator, logicalOperator, hidden);
	            _this.filterGroups[0].filterGroup.push(filter);
	            return _this;
	        };
	        this.addLikeFilter = function (propertyIdentifier, value, pattern, logicalOperator, displayPropertyIdentifier, hidden) {
	            if (pattern === void 0) { pattern = '%w%'; }
	            if (hidden === void 0) { hidden = false; }
	            //if filterGroups does not exists then set a default
	            if (!_this.filterGroups) {
	                _this.filterGroups = [{ filterGroup: [] }];
	            }
	            //if filterGroups is longer than 0 then we at least need to default the logical Operator to AND
	            if (_this.filterGroups[0].filterGroup.length && !logicalOperator)
	                logicalOperator = 'AND';
	            var join = propertyIdentifier.split('.').length > 1;
	            if (angular.isUndefined(displayPropertyIdentifier)) {
	                displayPropertyIdentifier = _this.rbkeyService.getRBKey("entity." + _this.$hibachi.getLastEntityNameInPropertyIdentifier(_this.baseEntityName, propertyIdentifier) + "." + _this.utilityService.listLast(propertyIdentifier));
	            }
	            //create filter group
	            var filter = new Filter(_this.formatPropertyIdentifier(propertyIdentifier, join), value, 'like', logicalOperator, displayPropertyIdentifier, value, hidden, pattern);
	            _this.filterGroups[0].filterGroup.push(filter);
	            return _this;
	        };
	        this.createFilter = function (propertyIdentifier, value, comparisonOperator, logicalOperator, hidden) {
	            if (comparisonOperator === void 0) { comparisonOperator = '='; }
	            if (hidden === void 0) { hidden = false; }
	            //if filterGroups does not exists then set a default
	            if (!_this.filterGroups) {
	                _this.filterGroups = [{ filterGroup: [] }];
	            }
	            //if filterGroups is longer than 0 then we at least need to default the logical Operator to AND
	            if (_this.filterGroups[0].filterGroup.length && !logicalOperator)
	                logicalOperator = 'AND';
	            var join = propertyIdentifier.split('.').length > 1;
	            //create filter group
	            var filter = new Filter(_this.formatPropertyIdentifier(propertyIdentifier, join), value, comparisonOperator, logicalOperator, propertyIdentifier.split('.').pop(), value, hidden);
	            return filter;
	        };
	        this.addFilterGroup = function (filterGroup) {
	            var group = {
	                filterGroup: []
	            };
	            for (var i = 0; i < filterGroup.length; i++) {
	                var filter = _this.createFilter(filterGroup[i].propertyIdentifier, filterGroup[i].comparisonValue, filterGroup[i].comparisonOperator, filterGroup[i].logicalOperator, filterGroup[i].hidden);
	                group.filterGroup.push(filter);
	            }
	            _this.filterGroups[0].filterGroup.push(group);
	            return _this;
	        };
	        this.removeFilter = function (propertyIdentifier, value, comparisonOperator) {
	            if (comparisonOperator === void 0) { comparisonOperator = '='; }
	            _this.removeFilterHelper(_this.filterGroups, propertyIdentifier, value, comparisonOperator);
	            return _this;
	        };
	        this.removeFilterHelper = function (filter, propertyIdentifier, value, comparisonOperator, currentGroup) {
	            if (angular.isUndefined(currentGroup)) {
	                currentGroup = filter;
	            }
	            if (angular.isArray(filter)) {
	                angular.forEach(filter, function (key) {
	                    _this.removeFilterHelper(key, propertyIdentifier, value, comparisonOperator, filter);
	                });
	            }
	            else if (angular.isArray(filter.filterGroup)) {
	                _this.removeFilterHelper(filter.filterGroup, propertyIdentifier, value, comparisonOperator, filter.filterGroup);
	            }
	            else {
	                if (filter.propertyIdentifier == propertyIdentifier && filter.value == value && filter.comparisonOperator == comparisonOperator) {
	                    currentGroup.splice(currentGroup.indexOf(filter), 1);
	                }
	            }
	        };
	        this.addCollectionFilter = function (propertyIdentifier, displayPropertyIdentifier, displayValue, collectionID, criteria, fieldtype, readOnly) {
	            if (criteria === void 0) { criteria = 'One'; }
	            if (readOnly === void 0) { readOnly = false; }
	            _this.filterGroups[0].filterGroup.push(new CollectionFilter(_this.formatPropertyIdentifier(propertyIdentifier), displayPropertyIdentifier, displayValue, collectionID, criteria, fieldtype, readOnly));
	            return _this;
	        };
	        //orderByList in this form: "property|direction" concrete: "skuName|ASC"
	        this.setOrderBy = function (orderByList) {
	            var orderBys = orderByList.split(',');
	            angular.forEach(orderBys, function (orderBy) {
	                _this.addOrderBy(orderBy);
	            });
	            return _this;
	        };
	        this.addOrderBy = function (orderByString, formatPropertyIdentifier) {
	            if (formatPropertyIdentifier === void 0) { formatPropertyIdentifier = true; }
	            if (!_this.orderBy) {
	                _this.orderBy = [];
	            }
	            var propertyIdentifier = _this.utilityService.listFirst(orderByString, '|');
	            if (formatPropertyIdentifier) {
	                propertyIdentifier = _this.formatPropertyIdentifier(propertyIdentifier);
	            }
	            var direction = _this.utilityService.listLast(orderByString, '|');
	            var orderBy = {
	                propertyIdentifier: propertyIdentifier,
	                direction: direction
	            };
	            _this.orderBy.push(orderBy);
	        };
	        this.toggleOrderBy = function (formattedPropertyIdentifier, singleColumn) {
	            if (singleColumn === void 0) { singleColumn = false; }
	            if (!_this.orderBy) {
	                _this.orderBy = [];
	            }
	            var found = false;
	            for (var i = _this.orderBy.length - 1; i >= 0; i--) {
	                if (_this.orderBy[i].propertyIdentifier == formattedPropertyIdentifier) {
	                    found = true;
	                    if (_this.orderBy[i].direction.toUpperCase() == "DESC") {
	                        _this.orderBy[i].direction = "ASC";
	                    }
	                    else if (_this.orderBy[i].direction.toUpperCase() == "ASC") {
	                        _this.orderBy.splice(i, 1);
	                    }
	                    break;
	                }
	            }
	            if (!found) {
	                if (singleColumn) {
	                    _this.orderBy = [];
	                    for (var i = 0; i < _this.columns.length; i++) {
	                        if (_this.columns[i]["sorting"] && _this.columns[i]["sorting"]["active"]) {
	                            _this.columns[i]["sorting"]["active"] = false;
	                            _this.columns[i]["sorting"]["sortOrder"] = 'asc';
	                        }
	                    }
	                }
	                _this.addOrderBy(formattedPropertyIdentifier + '|DESC', false);
	            }
	        };
	        this.removeOrderBy = function (formattedPropertyIdentifier) {
	            angular.forEach(_this.orderBy, function (orderBy, index) {
	                if (orderBy.propertyIdentifier == formattedPropertyIdentifier) {
	                    _this.orderBy.splice(index, 1);
	                    return true;
	                }
	            });
	            return false;
	        };
	        this.setCurrentPage = function (pageNumber) {
	            _this.currentPage = pageNumber;
	            return _this;
	        };
	        this.getCurrentPage = function () {
	            return _this.currentPage;
	        };
	        this.setPageShow = function (NumberOfPages) {
	            _this.pageShow = NumberOfPages;
	            return _this;
	        };
	        this.getPageShow = function () {
	            return _this.pageShow;
	        };
	        this.setAllRecords = function (allFlag) {
	            if (allFlag === void 0) { allFlag = false; }
	            _this.allRecords = allFlag;
	            return _this;
	        };
	        this.setDistinct = function (flag) {
	            if (flag === void 0) { flag = true; }
	            _this.isDistinct = flag;
	            return _this;
	        };
	        this.setKeywords = function (keyword) {
	            _this.keywords = keyword;
	            return _this;
	        };
	        this.setId = function (id) {
	            _this.id = id;
	            return _this;
	        };
	        this.hasFilters = function () {
	            return (_this.filterGroups.length && _this.filterGroups[0].filterGroup.length);
	        };
	        this.hasColumns = function () {
	            return (_this.columns.length > 0);
	        };
	        this.clearFilters = function () {
	            _this.filterGroups = [{ filterGroup: [] }];
	            return _this;
	        };
	        this.getEntity = function (id) {
	            if (angular.isDefined(id)) {
	                _this.setId(id);
	            }
	            return _this.$hibachi.getEntity(_this.baseEntityName, _this.getOptions());
	        };
	        this.validateFilter = function (filter, currentGroup) {
	            if (angular.isUndefined(currentGroup)) {
	                currentGroup = filter;
	            }
	            if (angular.isArray(filter)) {
	                angular.forEach(filter, function (key) {
	                    _this.validateFilter(key, filter);
	                });
	            }
	            else if (angular.isArray(filter.filterGroup)) {
	                _this.validateFilter(filter.filterGroup, filter.filterGroup);
	            }
	            else {
	                if ((!filter.comparisonOperator || !filter.comparisonOperator.length) && (!filter.propertyIdentifier || !filter.propertyIdentifier.length)) {
	                    var index = currentGroup.indexOf(filter);
	                    if (index > -1) {
	                        _this.observerService.notify('filterItemAction', {
	                            action: 'remove',
	                            filterItemIndex: index
	                        });
	                        currentGroup.splice(index, 1);
	                    }
	                }
	            }
	        };
	        this.getColumns = function () {
	            if (!_this.columns) {
	                _this.columns = [];
	            }
	            return _this.columns;
	        };
	        this.setColumns = function (columns) {
	            _this.columns = columns;
	            return _this;
	        };
	        console.log('abc');
	        console.log(rbkeyService);
	        console.log($hibachi);
	        this.$hibachi = $hibachi;
	        this.rbkeyService = rbkeyService;
	        if (angular.isDefined(this.baseEntityName)) {
	            this.collection = this.$hibachi.getEntityExample(this.baseEntityName);
	            if (angular.isUndefined(this.baseEntityAlias)) {
	                this.baseEntityAlias = '_' + this.baseEntityName.toLowerCase();
	            }
	        }
	    }
	    return CollectionConfig;
	})();
	exports.CollectionConfig = CollectionConfig;


/***/ },
/* 71 */
/***/ function(module, exports) {

	var CollectionService = (function () {
	    function CollectionService($filter, $log) {
	        var _this = this;
	        this.$filter = $filter;
	        this.$log = $log;
	        this.get = function () {
	            return _this._pageDialogs || [];
	        };
	        //test
	        this.setFilterCount = function (count) {
	            _this.$log.debug('incrementFilterCount');
	            _this._filterCount = count;
	        };
	        this.getFilterCount = function () {
	            return _this._filterCount;
	        };
	        this.getColumns = function () {
	            return _this._collection.collectionConfig.columns;
	        };
	        this.getFilterPropertiesList = function () {
	            return _this._filterPropertiesList;
	        };
	        this.getFilterPropertiesListByBaseEntityAlias = function (baseEntityAlias) {
	            return _this._filterPropertiesList[baseEntityAlias];
	        };
	        this.setFilterPropertiesList = function (value, key) {
	            if (angular.isUndefined(_this._filterPropertiesList[key])) {
	                _this._filterPropertiesList[key] = value;
	            }
	        };
	        this.stringifyJSON = function (jsonObject) {
	            var jsonString = angular.toJson(jsonObject);
	            return jsonString;
	        };
	        this.removeFilterItem = function (filterItem, filterGroup) {
	            filterGroup.pop(filterGroup.indexOf(filterItem));
	        };
	        this.selectFilterItem = function (filterItem) {
	            if (filterItem.$$isClosed) {
	                for (var i in filterItem.$$siblingItems) {
	                    filterItem.$$siblingItems[i].$$isClosed = true;
	                    filterItem.$$siblingItems[i].$$disabled = true;
	                }
	                filterItem.$$isClosed = false;
	                filterItem.$$disabled = false;
	                filterItem.setItemInUse(true);
	            }
	            else {
	                for (var i in filterItem.$$siblingItems) {
	                    filterItem.$$siblingItems[i].$$disabled = false;
	                }
	                filterItem.$$isClosed = true;
	                filterItem.setItemInUse(false);
	            }
	        };
	        this.selectFilterGroupItem = function (filterGroupItem) {
	            if (filterGroupItem.$$isClosed) {
	                for (var i in filterGroupItem.$$siblingItems) {
	                    filterGroupItem.$$siblingItems[i].$$disabled = true;
	                }
	                filterGroupItem.$$isClosed = false;
	                filterGroupItem.$$disabled = false;
	            }
	            else {
	                for (var i in filterGroupItem.$$siblingItems) {
	                    filterGroupItem.$$siblingItems[i].$$disabled = false;
	                }
	                filterGroupItem.$$isClosed = true;
	            }
	            filterGroupItem.setItemInUse(!filterGroupItem.$$isClosed);
	        };
	        this.newFilterItem = function (filterItemGroup, setItemInUse, prepareForFilterGroup) {
	            if (angular.isUndefined(prepareForFilterGroup)) {
	                prepareForFilterGroup = false;
	            }
	            var filterItem = {
	                displayPropertyIdentifier: "",
	                propertyIdentifier: "",
	                comparisonOperator: "",
	                value: "",
	                $$disabled: false,
	                $$isClosed: true,
	                $$isNew: true,
	                $$siblingItems: filterItemGroup,
	                setItemInUse: setItemInUse
	            };
	            if (filterItemGroup.length !== 0) {
	                filterItem.logicalOperator = "AND";
	            }
	            if (prepareForFilterGroup === true) {
	                filterItem.$$prepareForFilterGroup = true;
	            }
	            filterItemGroup.push(filterItem);
	            _this.selectFilterItem(filterItem);
	            return (filterItemGroup.length - 1);
	        };
	        this.newFilterGroupItem = function (filterItemGroup, setItemInUse) {
	            var filterGroupItem = {
	                filterGroup: [],
	                $$disabled: "false",
	                $$isClosed: "true",
	                $$siblingItems: filterItemGroup,
	                $$isNew: "true",
	                setItemInUse: setItemInUse
	            };
	            if (filterItemGroup.length !== 0) {
	                filterGroupItem.logicalOperator = "AND";
	            }
	            filterItemGroup.push(filterGroupItem);
	            _this.selectFilterGroupItem(filterGroupItem);
	            _this.newFilterItem(filterGroupItem.filterGroup, setItemInUse, undefined);
	        };
	        this.transplantFilterItemIntoFilterGroup = function (filterGroup, filterItem) {
	            var filterGroupItem = {
	                filterGroup: [],
	                $$disabled: "false",
	                $$isClosed: "true",
	                $$isNew: "true"
	            };
	            if (angular.isDefined(filterItem.logicalOperator)) {
	                filterGroupItem.logicalOperator = filterItem.logicalOperator;
	                delete filterItem.logicalOperator;
	            }
	            filterGroupItem.setItemInUse = filterItem.setItemInUse;
	            filterGroupItem.$$siblingItems = filterItem.$$siblingItems;
	            filterItem.$$siblingItems = [];
	            filterGroup.pop(filterGroup.indexOf(filterItem));
	            filterItem.$$prepareForFilterGroup = false;
	            filterGroupItem.filterGroup.push(filterItem);
	            filterGroup.push(filterGroupItem);
	        };
	        this.formatFilterPropertiesList = function (filterPropertiesList, propertyIdentifier) {
	            _this.$log.debug('format Filter Properties List arguments 2');
	            _this.$log.debug(filterPropertiesList);
	            _this.$log.debug(propertyIdentifier);
	            var simpleGroup = {
	                $$group: 'simple',
	                displayPropertyIdentifier: '-----------------'
	            };
	            filterPropertiesList.data.push(simpleGroup);
	            var drillDownGroup = {
	                $$group: 'drilldown',
	                displayPropertyIdentifier: '-----------------'
	            };
	            filterPropertiesList.data.push(drillDownGroup);
	            var compareCollections = {
	                $$group: 'compareCollections',
	                displayPropertyIdentifier: '-----------------'
	            };
	            filterPropertiesList.data.push(compareCollections);
	            var attributeCollections = {
	                $$group: 'attribute',
	                displayPropertyIdentifier: '-----------------'
	            };
	            filterPropertiesList.data.push(attributeCollections);
	            for (var i in filterPropertiesList.data) {
	                if (angular.isDefined(filterPropertiesList.data[i].ormtype)) {
	                    if (angular.isDefined(filterPropertiesList.data[i].attributeID)) {
	                        filterPropertiesList.data[i].$$group = 'attribute';
	                    }
	                    else {
	                        filterPropertiesList.data[i].$$group = 'simple';
	                    }
	                }
	                if (angular.isDefined(filterPropertiesList.data[i].fieldtype)) {
	                    if (filterPropertiesList.data[i].fieldtype === 'id') {
	                        filterPropertiesList.data[i].$$group = 'simple';
	                    }
	                    if (filterPropertiesList.data[i].fieldtype === 'many-to-one') {
	                        filterPropertiesList.data[i].$$group = 'drilldown';
	                    }
	                    if (filterPropertiesList.data[i].fieldtype === 'many-to-many' || filterPropertiesList.data[i].fieldtype === 'one-to-many') {
	                        filterPropertiesList.data[i].$$group = 'compareCollections';
	                    }
	                }
	                filterPropertiesList.data[i].propertyIdentifier = propertyIdentifier + '.' + filterPropertiesList.data[i].name;
	            }
	            filterPropertiesList.data = _this._orderBy(filterPropertiesList.data, ['-$$group', 'propertyIdentifier'], false);
	        };
	        this.orderBy = function (propertiesList, predicate, reverse) {
	            return _this._orderBy(propertiesList, predicate, reverse);
	        };
	        this.$filter = $filter;
	        this.$log = $log;
	        this._collection = null;
	        this._collectionConfig = null;
	        this._filterPropertiesList = {};
	        this._filterCount = 0;
	        this._orderBy = $filter('orderBy');
	    }
	    CollectionService.$inject = [
	        '$filter', '$log'
	    ];
	    return CollectionService;
	})();
	exports.CollectionService = CollectionService;


/***/ },
/* 72 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var CollectionController = (function () {
	    //@ngInject
	    function CollectionController($scope, $location, $log, $timeout, $hibachi, collectionService, metadataService, selectionService, paginationService, collectionConfigService, appConfig) {
	        //init values
	        //$scope.collectionTabs =[{tabTitle:'PROPERTIES',isActive:true},{tabTitle:'FILTERS ('+filterCount+')',isActive:false},{tabTitle:'DISPLAY OPTIONS',isActive:false}];
	        $scope.$id = "collectionsController";
	        /*used til we convert to use route params*/
	        var QueryString = function () {
	            // This function is anonymous, is executed immediately and
	            // the return value is assigned to QueryString!
	            var query_string = {};
	            var query = window.location.search.substring(1);
	            var vars = query.split("&");
	            for (var i = 0; i < vars.length; i++) {
	                var pair = vars[i].split("=");
	                // If first entry with this name
	                if (typeof query_string[pair[0]] === "undefined") {
	                    query_string[pair[0]] = pair[1];
	                }
	                else if (typeof query_string[pair[0]] === "string") {
	                    var arr = [query_string[pair[0]], pair[1]];
	                    query_string[pair[0]] = arr;
	                }
	                else {
	                    query_string[pair[0]].push(pair[1]);
	                }
	            }
	            return query_string;
	        }();
	        //get url param to retrieve collection listing
	        $scope.collectionID = QueryString.collectionID;
	        $scope.paginator = paginationService.createPagination();
	        $scope.appendToCollection = function () {
	            if ($scope.paginator.getPageShow() === 'Auto') {
	                $log.debug('AppendToCollection');
	                if ($scope.autoScrollPage < $scope.collection.totalPages) {
	                    $scope.autoScrollDisabled = true;
	                    $scope.autoScrollPage++;
	                    var collectionListingPromise = $hibachi.getEntity('collection', { id: $scope.collectionID, currentPage: $scope.paginator.autoScrollPage, pageShow: 50 });
	                    collectionListingPromise.then(function (value) {
	                        $scope.collection.pageRecords = $scope.collection.pageRecords.concat(value.pageRecords);
	                        $scope.autoScrollDisabled = false;
	                    }, function (reason) {
	                    });
	                }
	            }
	        };
	        $scope.keywords = "";
	        $scope.loadingCollection = false;
	        var searchPromise;
	        $scope.searchCollection = function () {
	            if (searchPromise) {
	                $timeout.cancel(searchPromise);
	            }
	            searchPromise = $timeout(function () {
	                $log.debug('search with keywords');
	                $log.debug($scope.keywords);
	                //Set current page here so that the pagination does not break when getting collection
	                $scope.paginator.setCurrentPage(1);
	                $scope.loadingCollection = true;
	            }, 500);
	        };
	        $scope.getCollection = function () {
	            var pageShow = 50;
	            if ($scope.paginator.getPageShow() !== 'Auto') {
	                pageShow = $scope.paginator.getPageShow();
	            }
	            //			$scope.currentPage = $scope.pagination.getCurrentPage();
	            var collectionListingPromise = $hibachi.getEntity('collection', { id: $scope.collectionID, currentPage: $scope.paginator.getCurrentPage(), pageShow: pageShow, keywords: $scope.keywords });
	            collectionListingPromise.then(function (value) {
	                $scope.collection = value;
	                $scope.paginator.setPageRecordsInfo($scope.collection);
	                $scope.collectionInitial = angular.copy($scope.collection);
	                if (angular.isUndefined($scope.collectionConfig)) {
	                    var test = collectionConfigService.newCollectionConfig();
	                    test.loadJson(value.collectionConfig);
	                    $scope.collectionConfig = test.getCollectionConfig();
	                }
	                //check if we have any filter Groups
	                if (angular.isUndefined($scope.collectionConfig.filterGroups)) {
	                    $scope.collectionConfig.filterGroups = [
	                        {
	                            filterGroup: []
	                        }
	                    ];
	                }
	                collectionService.setFilterCount(filterItemCounter());
	                $scope.loadingCollection = false;
	            }, function (reason) {
	            });
	            return collectionListingPromise;
	        };
	        $scope.paginator.getCollection = $scope.getCollection;
	        $scope.getCollection();
	        var unbindCollectionObserver = $scope.$watch('collection', function (newValue, oldValue) {
	            if (newValue !== oldValue) {
	                if (angular.isUndefined($scope.filterPropertiesList)) {
	                    $scope.filterPropertiesList = {};
	                    var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName($scope.collectionConfig.baseEntityAlias);
	                    filterPropertiesPromise.then(function (value) {
	                        metadataService.setPropertiesList(value, $scope.collectionConfig.baseEntityAlias);
	                        $scope.filterPropertiesList[$scope.collectionConfig.baseEntityAlias] = metadataService.getPropertiesListByBaseEntityAlias($scope.collectionConfig.baseEntityAlias);
	                        metadataService.formatPropertiesList($scope.filterPropertiesList[$scope.collectionConfig.baseEntityAlias], $scope.collectionConfig.baseEntityAlias);
	                    });
	                }
	                unbindCollectionObserver();
	            }
	        });
	        $scope.setCollectionForm = function (form) {
	            $scope.collectionForm = form;
	        };
	        $scope.collectionDetails = {
	            isOpen: false,
	            openCollectionDetails: function () {
	                $scope.collectionDetails.isOpen = true;
	            }
	        };
	        $scope.errorMessage = {};
	        var filterItemCounter = function (filterGroupArray) {
	            var filterItemCount = 0;
	            if (!angular.isDefined(filterGroupArray)) {
	                filterGroupArray = $scope.collectionConfig.filterGroups[0].filterGroup;
	            }
	            //Start out loop
	            for (var index in filterGroupArray) {
	                //If filter isn't new then increment the count
	                if (!filterGroupArray[index].$$isNew
	                    && !angular.isDefined(filterGroupArray[index].filterGroup)) {
	                    filterItemCount++;
	                }
	                else if (angular.isDefined(filterGroupArray[index].filterGroup)) {
	                    //Call function recursively
	                    filterItemCount += filterItemCounter(filterGroupArray[index].filterGroup);
	                }
	                else {
	                    break;
	                }
	            }
	            return filterItemCount;
	        };
	        $scope.saveCollection = function () {
	            $timeout(function () {
	                $log.debug('saving Collection');
	                var entityName = 'collection';
	                var collection = $scope.collection;
	                $log.debug($scope.collectionConfig);
	                if (isFormValid($scope.collectionForm)) {
	                    var collectionConfigString = collectionService.stringifyJSON($scope.collectionConfig);
	                    $log.debug(collectionConfigString);
	                    var data = angular.copy(collection);
	                    data.collectionConfig = collectionConfigString;
	                    //has to be removed in order to save transient correctly
	                    delete data.pageRecords;
	                    var saveCollectionPromise = $hibachi.saveEntity(entityName, collection.collectionID, data, 'save');
	                    saveCollectionPromise.then(function (value) {
	                        $scope.errorMessage = {};
	                        //Set current page here so that the pagination does not break when getting collection
	                        $scope.paginator.setCurrentPage(1);
	                        $scope.collectionDetails.isOpen = false;
	                    }, function (reason) {
	                        //revert to original
	                        angular.forEach(reason.errors, function (value, key) {
	                            $scope.collectionForm[key].$invalid = true;
	                            $scope.errorMessage[key] = value[0];
	                        });
	                        //$scope.collection = angular.copy($scope.collectionInitial);
	                    });
	                }
	                collectionService.setFilterCount(filterItemCounter());
	            });
	        };
	        var isFormValid = function (angularForm) {
	            $log.debug('validateForm');
	            var formValid = true;
	            for (var field in angularForm) {
	                // look at each form input with a name attribute set
	                // checking if it is pristine and not a '$' special field
	                if (field[0] != '$') {
	                    // need to use formValid variable instead of formController.$valid because checkbox dropdown is not an input
	                    // and somehow formController didn't invalid if checkbox dropdown is invalid
	                    if (angularForm[field].$invalid) {
	                        formValid = false;
	                        for (var error in angularForm[field].$error) {
	                            if (error == 'required') {
	                                $scope.errorMessage[field] = 'This field is required';
	                            }
	                        }
	                    }
	                    if (angularForm[field].$pristine) {
	                        if (angular.isUndefined(angularForm[field].$viewValue)) {
	                            angularForm[field].$setViewValue("");
	                        }
	                        else {
	                            angularForm[field].$setViewValue(angularForm[field].$viewValue);
	                        }
	                    }
	                }
	            }
	            return formValid;
	        };
	        $scope.copyExistingCollection = function () {
	            $scope.collection.collectionConfig = $scope.selectedExistingCollection;
	        };
	        $scope.setSelectedExistingCollection = function (selectedExistingCollection) {
	            $scope.selectedExistingCollection = selectedExistingCollection;
	        };
	        $scope.setSelectedFilterProperty = function (selectedFilterProperty) {
	            $scope.selectedFilterProperty = selectedFilterProperty;
	        };
	        $scope.filterCount = collectionService.getFilterCount;
	        //export action
	        $scope.exportCollection = function () {
	            var url = '/?' + appConfig.action + '=main.collectionExport&collectionExportID=' + $scope.collectionID + '&downloadReport=1';
	            var data = { "ids": selectionService.getSelections('collectionSelection') };
	            var target = "downloadCollection";
	            $('body').append('<form action="' + url + '" method="post" target="' + target + '" id="postToIframe"></form>');
	            $.each(data, function (n, v) {
	                $('#postToIframe').append('<input type="hidden" name="' + n + '" value="' + v + '" />');
	            });
	            $('#postToIframe').submit().remove();
	        };
	    }
	    return CollectionController;
	})();
	exports.CollectionController = CollectionController;
	// 'use strict';
	// angular.module('slatwalladmin')
	// //using $location to get url params, this will probably change to using routes eventually
	// .controller('collections', [
	// 	'$scope',
	// '$location',
	// '$log',
	// '$timeout',
	// '$hibachi',
	// 'collectionService',
	// 'metadataService',
	// 'selectionService',
	// 'paginationService',
	// 	function(
	// 		$scope,
	// $location,
	// $log,
	// $timeout,
	// $hibachi,
	// collectionService,
	// metadataService,
	// selectionService,
	// paginationService
	// 	){
	//
	// 	}
	// ]);


/***/ },
/* 73 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var CreateCollection = (function () {
	    //@ngInject
	    function CreateCollection($scope, $log, $timeout, $hibachi, collectionService, metadataService, paginationService, dialogService, observerService, selectionService, collectionConfigService, rbkeyService, $window) {
	        $window.scrollTo(0, 0);
	        $scope.params = dialogService.getCurrentDialog().params;
	        $scope.readOnly = angular.isDefined($scope.params.readOnly) && $scope.params.readOnly == true;
	        $scope.myCollection = collectionConfigService.newCollectionConfig($scope.params.entityName);
	        var hibachiConfig = $hibachi.getConfig();
	        if ($scope.params.entityName == 'Type' && angular.isUndefined($scope.params.entityId) && angular.isDefined($scope.params.parentEntity)) {
	            $scope.params.parentEntity = $scope.params.parentEntity.replace(new RegExp('^' + hibachiConfig.applicationKey, 'i'), '');
	            var systemCode = $scope.params.parentEntity.charAt(0).toLowerCase() + $scope.params.parentEntity.slice(1) + 'Type';
	            $scope.myCollection.addFilter('parentType.systemCode', systemCode);
	        }
	        $scope.keywords = '';
	        $scope.paginator = paginationService.createPagination();
	        //$scope.isRadio = true;
	        $scope.hideEditView = true;
	        //$scope.closeSaving = true;
	        $scope.hasSelection = selectionService.getSelectionCount;
	        $scope.idsSelected = selectionService.getSelections;
	        $scope.unselectAll = function () {
	            selectionService.clearSelections('collectionSelection');
	            $scope.getCollection();
	        };
	        $scope.newCollection = $hibachi.newCollection();
	        $scope.newCollection.data.collectionCode = $scope.params.entityName + "-" + new Date().valueOf();
	        $scope.newCollection.data.collectionObject = $scope.params.entityName;
	        if (angular.isDefined($scope.params.entityId)) {
	            $scope.newCollection.data.collectionID = $scope.params.entityId;
	            $timeout(function () {
	                $scope.newCollection.forms['form.createCollection'].$setDirty();
	            });
	        }
	        if (angular.isDefined($scope.params.collectionName)) {
	            $scope.newCollection.data.collectionName = $scope.params.collectionName;
	            $timeout(function () {
	                $scope.newCollection.forms['form.createCollection'].$setDirty();
	            });
	        }
	        $scope.saveCollection = function () {
	            $scope.myCollection.loadJson($scope.collectionConfig);
	            $scope.getCollection();
	        };
	        $scope.getCollection = function () {
	            $scope.closeSaving = true;
	            $scope.myCollection.setPageShow($scope.paginator.getPageShow());
	            $scope.myCollection.setCurrentPage($scope.paginator.getCurrentPage());
	            $scope.myCollection.setKeywords($scope.keywords);
	            var collectionOptions;
	            if (angular.isDefined($scope.params.entityId)) {
	                collectionOptions = {
	                    id: $scope.params.entityId,
	                    currentPage: $scope.paginator.getCurrentPage(),
	                    pageShow: $scope.paginator.getPageShow(),
	                    keywords: $scope.keywords
	                };
	            }
	            else {
	                collectionOptions = $scope.myCollection.getOptions();
	            }
	            $log.debug($scope.myCollection.getOptions());
	            var collectionListingPromise = $hibachi.getEntity($scope.myCollection.getEntityName(), collectionOptions);
	            collectionListingPromise.then(function (value) {
	                if (angular.isDefined($scope.params.entityId)) {
	                    $scope.newCollection.data.collectionName = value.collectionName;
	                }
	                $scope.collection = value;
	                $scope.collection.collectionObject = $scope.myCollection.baseEntityName;
	                $scope.collectionInitial = angular.copy($scope.collection);
	                $scope.paginator.setRecordsCount($scope.collection.recordsCount);
	                $scope.paginator.setPageRecordsInfo($scope.collection);
	                if (angular.isUndefined($scope.myCollection.columns)) {
	                    var colConfig = angular.fromJson(value.collectionConfig);
	                    colConfig.baseEntityName = colConfig.baseEntityName.replace(new RegExp('^' + hibachiConfig.applicationKey, 'i'), '');
	                    $scope.myCollection.loadJson(colConfig);
	                }
	                if (angular.isUndefined($scope.collectionConfig)) {
	                    var tempCollectionConfig = collectionConfigService.newCollectionConfig();
	                    tempCollectionConfig.loadJson(value.collectionConfig);
	                    $scope.collectionConfig = tempCollectionConfig.getCollectionConfig();
	                }
	                if (angular.isUndefined($scope.collectionConfig.filterGroups) || !$scope.collectionConfig.filterGroups.length) {
	                    $scope.collectionConfig.filterGroups = [
	                        {
	                            filterGroup: []
	                        }
	                    ];
	                }
	                collectionService.setFilterCount(filterItemCounter());
	                $scope.loadingCollection = false;
	                $scope.closeSaving = false;
	            }, function (reason) {
	            });
	            return collectionListingPromise;
	        };
	        $scope.paginator.collection = $scope.newCollection;
	        $scope.paginator.getCollection = $scope.getCollection;
	        var unbindCollectionObserver = $scope.$watch('collection', function (newValue, oldValue) {
	            if (newValue !== oldValue) {
	                if (angular.isUndefined($scope.filterPropertiesList)) {
	                    $scope.filterPropertiesList = {};
	                    var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName($scope.collectionConfig.baseEntityAlias);
	                    filterPropertiesPromise.then(function (value) {
	                        metadataService.setPropertiesList(value, $scope.collectionConfig.baseEntityAlias);
	                        $scope.filterPropertiesList[$scope.collectionConfig.baseEntityAlias] = metadataService.getPropertiesListByBaseEntityAlias($scope.collectionConfig.baseEntityAlias);
	                        metadataService.formatPropertiesList($scope.filterPropertiesList[$scope.collectionConfig.baseEntityAlias], $scope.collectionConfig.baseEntityAlias);
	                    });
	                }
	                unbindCollectionObserver();
	            }
	        });
	        var filterItemCounter = function (filterGroupArray) {
	            var filterItemCount = 0;
	            if (!angular.isDefined(filterGroupArray)) {
	                filterGroupArray = $scope.collectionConfig.filterGroups[0].filterGroup;
	            }
	            //Start out loop
	            for (var index in filterGroupArray) {
	                //If filter isn't new then increment the count
	                if (!filterGroupArray[index].$$isNew && !angular.isDefined(filterGroupArray[index].filterGroup)) {
	                    filterItemCount++;
	                }
	                else if (angular.isDefined(filterGroupArray[index].filterGroup)) {
	                    //Call function recursively
	                    filterItemCount += filterItemCounter(filterGroupArray[index].filterGroup);
	                }
	                else {
	                    break;
	                }
	            }
	            return filterItemCount;
	        };
	        $scope.getCollection();
	        $scope.copyExistingCollection = function () {
	            $scope.collection.collectionConfig = $scope.selectedExistingCollection;
	        };
	        $scope.setSelectedExistingCollection = function (selectedExistingCollection) {
	            $scope.selectedExistingCollection = selectedExistingCollection;
	        };
	        $scope.setSelectedFilterProperty = function (selectedFilterProperty) {
	            $scope.selectedFilterProperty = selectedFilterProperty;
	        };
	        $scope.loadingCollection = false;
	        var searchPromise;
	        $scope.searchCollection = function () {
	            if (searchPromise) {
	                $timeout.cancel(searchPromise);
	            }
	            searchPromise = $timeout(function () {
	                //$log.debug('search with keywords');
	                //$log.debug($scope.keywords);
	                //Set current page here so that the pagination does not break when getting collection
	                $scope.paginator.setCurrentPage(1);
	                $scope.loadingCollection = true;
	                $scope.getCollection();
	            }, 500);
	        };
	        $scope.filterCount = collectionService.getFilterCount;
	        //
	        $scope.hideExport = true;
	        $scope.saveNewCollection = function ($index) {
	            if ($scope.closeSaving)
	                return;
	            $scope.closeSaving = true;
	            if (!angular.isUndefined(selectionService.getSelections('collectionSelection'))
	                && (selectionService.getSelections('collectionSelection').length > 0)) {
	                $scope.collectionConfig.filterGroups[0].filterGroup = [
	                    {
	                        "displayPropertyIdentifier": rbkeyService.getRBKey("entity." + $scope.myCollection.baseEntityName.toLowerCase() + "." + $scope.myCollection.collection.$$getIDName().toLowerCase()),
	                        "propertyIdentifier": $scope.myCollection.baseEntityAlias + "." + $scope.myCollection.collection.$$getIDName(),
	                        "comparisonOperator": "in",
	                        "value": selectionService.getSelections('collectionSelection').join(),
	                        "displayValue": selectionService.getSelections('collectionSelection').join(),
	                        "ormtype": "string",
	                        "fieldtype": "id",
	                        "conditionDisplay": "In List"
	                    }
	                ];
	            }
	            $scope.newCollection.data.collectionConfig = $scope.collectionConfig;
	            if ($scope.newCollection.data.collectionConfig.baseEntityName.lastIndexOf(hibachiConfig.applicationKey, 0) !== 0) {
	                $scope.newCollection.data.collectionConfig.baseEntityName = hibachiConfig.applicationKey + $scope.newCollection.data.collectionConfig.baseEntityName;
	            }
	            $scope.newCollection.$$save().then(function () {
	                observerService.notify('addCollection', $scope.newCollection.data);
	                selectionService.clearSelection('collectionSelection');
	                dialogService.removePageDialog($index);
	                $scope.closeSaving = false;
	            }, function () {
	                $scope.closeSaving = false;
	            });
	        };
	    }
	    return CreateCollection;
	})();
	exports.CreateCollection = CreateCollection;


/***/ },
/* 74 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var ConfirmationController = (function () {
	    //@ngInject
	    function ConfirmationController($scope, $log, $modalInstance) {
	        $scope.deleteEntity = function (entity) {
	            $log.debug("Deleting an entity.");
	            $log.debug($scope.entity);
	            this.close();
	        };
	        $scope.fireCallback = function (callbackFunction) {
	            callbackFunction();
	            this.close();
	        };
	        /**
	        * Closes the modal window
	        */
	        $scope.close = function () {
	            $modalInstance.close();
	        };
	        /**
	        * Cancels the modal window
	        */
	        $scope.cancel = function () {
	            $modalInstance.dismiss("cancel");
	        };
	    }
	    return ConfirmationController;
	})();
	exports.ConfirmationController = ConfirmationController;


/***/ },
/* 75 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCollection = (function () {
	    //@ngInject
	    function SWCollection($http, $compile, $log, hibachiPathBuilder, collectionPartialsPath, collectionService) {
	        return {
	            restrict: 'A',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "collection.html",
	            link: function (scope, $element, $attrs) {
	                scope.tabsUniqueID = Math.floor(Math.random() * 999);
	                scope.toggleCogOpen = $attrs.toggleoption;
	                //Toggles open/close of filters and display options
	                scope.toggleFiltersAndOptions = function () {
	                    if (scope.toggleCogOpen === false) {
	                        scope.toggleCogOpen = true;
	                    }
	                    else {
	                        scope.toggleCogOpen = false;
	                    }
	                };
	            }
	        };
	    }
	    SWCollection.Factory = function () {
	        var directive = function ($http, $compile, $log, hibachiPathBuilder, collectionPartialsPath, collectionService) {
	            return new SWCollection($http, $compile, $log, hibachiPathBuilder, collectionPartialsPath, collectionService);
	        };
	        directive.$inject = [
	            '$http',
	            '$compile',
	            '$log',
	            'hibachiPathBuilder',
	            'collectionPartialsPath',
	            'collectionService'
	        ];
	        return directive;
	    };
	    return SWCollection;
	})();
	exports.SWCollection = SWCollection;


/***/ },
/* 76 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWAddFilterButtons = (function () {
	    //@ngInject
	    function SWAddFilterButtons($http, $compile, $templateCache, collectionService, collectionPartialsPath, hibachiPathBuilder) {
	        return {
	            require: '^swFilterGroups',
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "addfilterbuttons.html",
	            scope: {
	                itemInUse: "=",
	                readOnly: "="
	            },
	            link: function (scope, element, attrs, filterGroupsController) {
	                scope.filterGroupItem = filterGroupsController.getFilterGroupItem();
	                scope.addFilterItem = function () {
	                    collectionService.newFilterItem(filterGroupsController.getFilterGroupItem(), filterGroupsController.setItemInUse);
	                };
	                scope.addFilterGroupItem = function () {
	                    collectionService.newFilterItem(filterGroupsController.getFilterGroupItem(), filterGroupsController.setItemInUse, true);
	                };
	            }
	        };
	    }
	    SWAddFilterButtons.Factory = function () {
	        var directive = function ($http, $compile, $templateCache, collectionService, collectionPartialsPath, hibachiPathBuilder) {
	            return new SWAddFilterButtons($http, $compile, $templateCache, collectionService, collectionPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$compile',
	            '$templateCache',
	            'collectionService',
	            'collectionPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWAddFilterButtons;
	})();
	exports.SWAddFilterButtons = SWAddFilterButtons;


/***/ },
/* 77 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWDisplayOptions = (function () {
	    //@ngInject
	    function SWDisplayOptions($log, $hibachi, hibachiPathBuilder, collectionPartialsPath, rbkeyService) {
	        return {
	            restrict: 'E',
	            transclude: true,
	            scope: {
	                orderBy: "=",
	                columns: '=',
	                propertiesList: "=",
	                saveCollection: "&",
	                baseEntityAlias: "=?",
	                baseEntityName: "=?"
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "displayoptions.html",
	            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
	                    $log.debug('display options initialize');
	                    $scope.breadCrumbs = [{
	                            entityAlias: $scope.baseEntityAlias,
	                            cfc: $scope.baseEntityAlias,
	                            propertyIdentifier: $scope.baseEntityAlias
	                        }];
	                    this.removeColumn = function (columnIndex) {
	                        $log.debug('parent remove column');
	                        $log.debug($scope.columns);
	                        if ($scope.columns.length) {
	                            $scope.columns.splice(columnIndex, 1);
	                        }
	                    };
	                    this.getPropertiesList = function () {
	                        return $scope.propertiesList;
	                    };
	                    $scope.addDisplayDialog = {
	                        isOpen: false,
	                        toggleDisplayDialog: function () {
	                            $scope.addDisplayDialog.isOpen = !$scope.addDisplayDialog.isOpen;
	                        }
	                    };
	                    var getTitleFromProperty = function (selectedProperty) {
	                        var baseEntityCfcName = $scope.baseEntityName.replace('Slatwall', '').charAt(0).toLowerCase() + $scope.baseEntityName.replace('Slatwall', '').slice(1);
	                        var propertyIdentifier = selectedProperty.propertyIdentifier;
	                        var title = '';
	                        var propertyIdentifierArray = propertyIdentifier.split('.');
	                        var currentEntity;
	                        var currentEntityInstance;
	                        var prefix = 'entity.';
	                        if (selectedProperty.$$group == "attribute") {
	                            return selectedProperty.displayPropertyIdentifier;
	                        }
	                        angular.forEach(propertyIdentifierArray, function (propertyIdentifierItem, key) {
	                            //pass over the initial item
	                            if (key !== 0) {
	                                if (key === 1) {
	                                    currentEntityInstance = $hibachi['new' + $scope.baseEntityName.replace('Slatwall', '')]();
	                                    currentEntity = currentEntityInstance.metaData[propertyIdentifierArray[key]];
	                                    title += rbkeyService.getRBKey(prefix + baseEntityCfcName + '.' + propertyIdentifierItem);
	                                }
	                                else {
	                                    var currentEntityInstance = $hibachi['new' + currentEntity.cfc.charAt(0).toUpperCase() + currentEntity.cfc.slice(1)]();
	                                    currentEntity = currentEntityInstance.metaData[propertyIdentifierArray[key]];
	                                    title += rbkeyService.getRBKey(prefix + currentEntityInstance.metaData.className + '.' + currentEntity.name);
	                                }
	                                if (key < propertyIdentifierArray.length - 1) {
	                                    title += ' | ';
	                                }
	                            }
	                        });
	                        return title;
	                    };
	                    $scope.addColumn = function (selectedProperty, closeDialog) {
	                        $log.debug('add Column');
	                        $log.debug(selectedProperty);
	                        if (selectedProperty.$$group === 'simple' || 'attribute') {
	                            $log.debug($scope.columns);
	                            if (angular.isDefined(selectedProperty)) {
	                                var column = {
	                                    title: getTitleFromProperty(selectedProperty),
	                                    propertyIdentifier: selectedProperty.propertyIdentifier,
	                                    isVisible: true,
	                                    isDeletable: true,
	                                    isSearchable: true,
	                                    isExportable: true
	                                };
	                                //only add attributeid if the selectedProperty is attributeid
	                                if (angular.isDefined(selectedProperty.attributeID)) {
	                                    column['attributeID'] = selectedProperty.attributeID;
	                                    column['attributeSetObject'] = selectedProperty.attributeSetObject;
	                                }
	                                if (angular.isDefined(selectedProperty.ormtype)) {
	                                    column['ormtype'] = selectedProperty.ormtype;
	                                }
	                                if (selectedProperty.hb_formattype) {
	                                    column['type'] = selectedProperty.hb_formattype;
	                                }
	                                else {
	                                    column['type'] = 'none';
	                                }
	                                $scope.columns.push(column);
	                                $scope.saveCollection();
	                                if (angular.isDefined(closeDialog) && closeDialog === true) {
	                                    $scope.addDisplayDialog.toggleDisplayDialog();
	                                    $scope.selectBreadCrumb(0);
	                                }
	                            }
	                        }
	                    };
	                    $scope.selectBreadCrumb = function (breadCrumbIndex) {
	                        //splice out array items above index
	                        var removeCount = $scope.breadCrumbs.length - 1 - breadCrumbIndex;
	                        $scope.breadCrumbs.splice(breadCrumbIndex + 1, removeCount);
	                        $scope.selectedPropertyChanged(null);
	                    };
	                    var unbindBaseEntityAlias = $scope.$watch('baseEntityAlias', function (newValue, oldValue) {
	                        if (newValue !== oldValue) {
	                            $scope.breadCrumbs = [{
	                                    entityAlias: $scope.baseEntityAlias,
	                                    cfc: $scope.baseEntityAlias,
	                                    propertyIdentifier: $scope.baseEntityAlias
	                                }];
	                            unbindBaseEntityAlias();
	                        }
	                    });
	                    $scope.selectedPropertyChanged = function (selectedProperty) {
	                        // drill down or select field?
	                        $log.debug('selectedPropertyChanged');
	                        $log.debug(selectedProperty);
	                        $scope.selectedProperty = selectedProperty;
	                    };
	                    jQuery(function ($) {
	                        var panelList = angular.element($element).children('ul');
	                        panelList.sortable({
	                            // Only make the .panel-heading child elements support dragging.
	                            // Omit this to make then entire <li>...</li> draggable.
	                            handle: '.s-pannel-name',
	                            update: function (event, ui) {
	                                var tempColumnsArray = [];
	                                $('.s-pannel-name', panelList).each(function (index, elem) {
	                                    var newIndex = $(elem).attr('j-column-index');
	                                    var columnItem = $scope.columns[newIndex];
	                                    tempColumnsArray.push(columnItem);
	                                });
	                                $scope.$apply(function () {
	                                    $scope.columns = tempColumnsArray;
	                                });
	                                $scope.saveCollection();
	                            }
	                        });
	                    });
	                    /*var unbindBaseEntityAlaisWatchListener = scope.$watch('baseEntityAlias',function(){
	                     $("select").selectBoxIt();
	                     unbindBaseEntityAlaisWatchListener();
	                     });*/
	                }]
	        };
	    }
	    SWDisplayOptions.Factory = function () {
	        var directive = function ($log, $hibachi, hibachiPathBuilder, collectionPartialsPath, rbkeyService) {
	            return new SWDisplayOptions($log, $hibachi, hibachiPathBuilder, collectionPartialsPath, rbkeyService);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            'hibachiPathBuilder',
	            'collectionPartialsPath',
	            'rbkeyService'
	        ];
	        return directive;
	    };
	    return SWDisplayOptions;
	})();
	exports.SWDisplayOptions = SWDisplayOptions;


/***/ },
/* 78 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWDisplayItem = (function () {
	    //@ngInject
	    function SWDisplayItem($http, $compile, $templateCache, $log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	        return {
	            require: '^swDisplayOptions',
	            restrict: 'A',
	            scope: {
	                selectedProperty: "=",
	                propertiesList: "=",
	                breadCrumbs: "=",
	                selectedPropertyChanged: "&"
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "displayitem.html",
	            link: function (scope, element, attrs, displayOptionsController) {
	                scope.showDisplayItem = false;
	                scope.selectedDisplayOptionChanged = function (selectedDisplayOption) {
	                    var breadCrumb = {
	                        entityAlias: scope.selectedProperty.name,
	                        cfc: scope.selectedProperty.cfc,
	                        propertyIdentifier: scope.selectedProperty.propertyIdentifier
	                    };
	                    scope.breadCrumbs.push(breadCrumb);
	                    scope.selectedPropertyChanged({ selectedProperty: selectedDisplayOption });
	                };
	                scope.$watch('selectedProperty', function (selectedProperty) {
	                    if (angular.isDefined(selectedProperty)) {
	                        if (selectedProperty === null) {
	                            scope.showDisplayItem = false;
	                            return;
	                        }
	                        if (selectedProperty.$$group !== 'drilldown') {
	                            scope.showDisplayItem = false;
	                            return;
	                        }
	                        if (selectedProperty.$$group === 'drilldown') {
	                            if (angular.isUndefined(scope.propertiesList[selectedProperty.propertyIdentifier])) {
	                                var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(selectedProperty.cfc);
	                                filterPropertiesPromise.then(function (value) {
	                                    metadataService.setPropertiesList(value, selectedProperty.propertyIdentifier);
	                                    scope.propertiesList[selectedProperty.propertyIdentifier] = metadataService.getPropertiesListByBaseEntityAlias(selectedProperty.propertyIdentifier);
	                                    metadataService.formatPropertiesList(scope.propertiesList[selectedProperty.propertyIdentifier], selectedProperty.propertyIdentifier);
	                                }, function (reason) {
	                                });
	                            }
	                        }
	                        scope.showDisplayItem = true;
	                    }
	                });
	            }
	        };
	    }
	    SWDisplayItem.Factory = function () {
	        var directive = function ($http, $compile, $templateCache, $log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	            return new SWDisplayItem($http, $compile, $templateCache, $log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$compile',
	            '$templateCache',
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWDisplayItem;
	})();
	exports.SWDisplayItem = SWDisplayItem;


/***/ },
/* 79 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCollectionTable = (function () {
	    //@ngInject
	    function SWCollectionTable($http, $compile, $log, hibachiPathBuilder, collectionPartialsPath, paginationService, selectionService, $hibachi) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "collectiontable.html",
	            scope: {
	                collection: "=",
	                collectionConfig: "=",
	                isRadio: "=?",
	                //angularLink:true || false
	                angularLinks: "=?"
	            },
	            link: function (scope, element, attrs) {
	                if (angular.isUndefined(scope.angularLinks)) {
	                    scope.angularLinks = false;
	                }
	                console.log('here');
	                console.log(scope.collection);
	                console.log($hibachi);
	                scope.collectionObject = $hibachi['new' + scope.collection.collectionObject]();
	                var escapeRegExp = function (str) {
	                    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	                };
	                scope.replaceAll = function (str, find, replace) {
	                    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	                };
	                /*
	                 * Handles setting the key on the data.
	                 * */
	                angular.forEach(scope.collectionConfig.columns, function (column) {
	                    $log.debug("Config Key : " + column);
	                    column.key = column.propertyIdentifier.replace(/\./g, '_').replace(scope.collectionConfig.baseEntityAlias + '_', '');
	                });
	                scope.addSelection = function (selectionid, selection) {
	                    selectionService.addSelection(selectionid, selection);
	                };
	            }
	        };
	    }
	    SWCollectionTable.Factory = function () {
	        var directive = function ($http, $compile, $log, hibachiPathBuilder, collectionPartialsPath, paginationService, selectionService, $hibachi) {
	            return new SWCollectionTable($http, $compile, $log, hibachiPathBuilder, collectionPartialsPath, paginationService, selectionService, $hibachi);
	        };
	        directive.$inject = [
	            '$http',
	            '$compile',
	            '$log',
	            'hibachiPathBuilder',
	            'collectionPartialsPath',
	            'paginationService',
	            'selectionService',
	            '$hibachi'
	        ];
	        return directive;
	    };
	    return SWCollectionTable;
	})();
	exports.SWCollectionTable = SWCollectionTable;


/***/ },
/* 80 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWColumnItem = (function () {
	    function SWColumnItem($log, hibachiPathBuilder, collectionPartialsPath) {
	        return {
	            restrict: 'A',
	            require: "^swDisplayOptions",
	            scope: {
	                column: "=",
	                columns: "=",
	                columnIndex: "=",
	                saveCollection: "&",
	                propertiesList: "=",
	                orderBy: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "columnitem.html",
	            link: function (scope, element, attrs, displayOptionsController) {
	                scope.editingDisplayTitle = false;
	                scope.editDisplayTitle = function () {
	                    if (angular.isUndefined(scope.column.displayTitle) || !scope.column.displayTitle.length) {
	                        scope.column.displayTitle = scope.column.title;
	                    }
	                    scope.previousDisplayTitle = scope.column.displayTitle;
	                    scope.editingDisplayTitle = true;
	                };
	                scope.saveDisplayTitle = function () {
	                    scope.saveCollection();
	                    scope.editingDisplayTitle = false;
	                };
	                scope.cancelDisplayTitle = function () {
	                    scope.column.displayTitle = scope.previousDisplayTitle;
	                    scope.editingDisplayTitle = false;
	                };
	                $log.debug('displayOptionsController');
	                if (angular.isUndefined(scope.column.sorting)) {
	                    scope.column.sorting = {
	                        active: false,
	                        sortOrder: 'asc',
	                        priority: 0
	                    };
	                }
	                scope.toggleVisible = function (column) {
	                    $log.debug('toggle visible');
	                    if (angular.isUndefined(column.isVisible)) {
	                        column.isVisible = false;
	                    }
	                    column.isVisible = !column.isVisible;
	                    scope.saveCollection();
	                };
	                scope.toggleSearchable = function (column) {
	                    $log.debug('toggle searchable');
	                    if (angular.isUndefined(column.isSearchable)) {
	                        column.isSearchable = false;
	                    }
	                    column.isSearchable = !column.isSearchable;
	                    scope.saveCollection();
	                };
	                scope.toggleExportable = function (column) {
	                    $log.debug('toggle exporable');
	                    if (angular.isUndefined(column.isExportable)) {
	                        column.isExportable = false;
	                    }
	                    column.isExportable = !column.isExportable;
	                    scope.saveCollection();
	                };
	                var compareByPriority = function (a, b) {
	                    if (angular.isDefined(a.sorting) && angular.isDefined(a.sorting.priority)) {
	                        if (a.sorting.priority < b.sorting.priority) {
	                            return -1;
	                        }
	                        if (a.sorting.priority > b.sorting.priority) {
	                            return 1;
	                        }
	                    }
	                    return 0;
	                };
	                var updateOrderBy = function () {
	                    if (angular.isDefined(scope.columns)) {
	                        var columnsCopy = angular.copy(scope.columns);
	                        columnsCopy.sort(compareByPriority);
	                        scope.orderBy = [];
	                        angular.forEach(columnsCopy, function (column) {
	                            if (angular.isDefined(column.sorting) && column.sorting.active === true) {
	                                var orderBy = {
	                                    propertyIdentifier: column.propertyIdentifier,
	                                    direction: column.sorting.sortOrder
	                                };
	                                scope.orderBy.push(orderBy);
	                            }
	                        });
	                    }
	                };
	                scope.toggleSortable = function (column) {
	                    $log.debug('toggle sortable');
	                    if (angular.isUndefined(column.sorting)) {
	                        column.sorting = {
	                            active: true,
	                            sortOrder: 'asc',
	                            priority: 0
	                        };
	                    }
	                    if (column.sorting.active === true) {
	                        if (column.sorting.sortOrder === 'asc') {
	                            column.sorting.sortOrder = 'desc';
	                        }
	                        else {
	                            removeSorting(column);
	                            column.sorting.active = false;
	                        }
	                    }
	                    else {
	                        column.sorting.active = true;
	                        column.sorting.sortOrder = 'asc';
	                        column.sorting.priority = getActivelySorting().length;
	                    }
	                    updateOrderBy();
	                    scope.saveCollection();
	                };
	                var removeSorting = function (column, saving) {
	                    if (column.sorting.active === true) {
	                        for (var i in scope.columns) {
	                            if (scope.columns[i].sorting.active === true && scope.columns[i].sorting.priority > column.sorting.priority) {
	                                scope.columns[i].sorting.priority = scope.columns[i].sorting.priority - 1;
	                            }
	                        }
	                        column.sorting.priority = 0;
	                    }
	                    if (!saving) {
	                        updateOrderBy();
	                        scope.saveCollection();
	                    }
	                };
	                scope.prioritize = function (column) {
	                    if (column.sorting.priority === 1) {
	                        var activelySorting = getActivelySorting();
	                        for (var i in scope.columns) {
	                            if (scope.columns[i].sorting.active === true) {
	                                scope.columns[i].sorting.priority = scope.columns[i].sorting.priority - 1;
	                            }
	                        }
	                        column.sorting.priority = activelySorting.length;
	                    }
	                    else {
	                        for (var i in scope.columns) {
	                            if (scope.columns[i].sorting.active === true && scope.columns[i].sorting.priority === column.sorting.priority - 1) {
	                                scope.columns[i].sorting.priority = scope.columns[i].sorting.priority + 1;
	                            }
	                        }
	                        column.sorting.priority -= 1;
	                    }
	                    updateOrderBy();
	                    scope.saveCollection();
	                };
	                var getActivelySorting = function () {
	                    var activelySorting = [];
	                    for (var i in scope.columns) {
	                        if (scope.columns[i].sorting.active === true) {
	                            activelySorting.push(scope.columns[i]);
	                        }
	                    }
	                    return activelySorting;
	                };
	                scope.removeColumn = function (columnIndex) {
	                    $log.debug('remove column');
	                    $log.debug(columnIndex);
	                    removeSorting(scope.columns[columnIndex], true);
	                    displayOptionsController.removeColumn(columnIndex);
	                    updateOrderBy();
	                    scope.saveCollection();
	                };
	            }
	        };
	    }
	    SWColumnItem.Factory = function () {
	        var directive = function ($log, hibachiPathBuilder, collectionPartialsPath) {
	            return new SWColumnItem($log, hibachiPathBuilder, collectionPartialsPath);
	        };
	        directive.$inject = [
	            '$log',
	            'hibachiPathBuilder',
	            'collectionPartialsPath'
	        ];
	        return directive;
	    };
	    return SWColumnItem;
	})();
	exports.SWColumnItem = SWColumnItem;


/***/ },
/* 81 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWConditionCriteria = (function () {
	    function SWConditionCriteria($http, $compile, $templateCache, $log, $hibachi, $filter, workflowPartialsPath, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	        /* Template info begin*/
	        var getTemplate = function (selectedFilterProperty) {
	            var template = '';
	            var templatePath = '';
	            if (angular.isUndefined(selectedFilterProperty.ormtype) && angular.isUndefined(selectedFilterProperty.fieldtype)) {
	                templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criteria.html";
	            }
	            else {
	                var criteriaormtype = selectedFilterProperty.ormtype;
	                var criteriafieldtype = selectedFilterProperty.fieldtype;
	                /*TODO: convert all switches to object literals*/
	                switch (criteriaormtype) {
	                    case 'boolean':
	                        templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criteriaboolean.html";
	                        break;
	                    case 'string':
	                        templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criteriastring.html";
	                        break;
	                    case 'timestamp':
	                        templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criteriadate.html";
	                        break;
	                    case 'big_decimal':
	                    case 'integer':
	                    case 'float':
	                        templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criterianumber.html";
	                        break;
	                }
	                switch (criteriafieldtype) {
	                    case "many-to-one":
	                        templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criteriamanytoone.html";
	                        break;
	                    case "many-to-many":
	                        templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criteriamanytomany.html";
	                        break;
	                    case "one-to-many":
	                        templatePath = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "criteriaonetomany.html";
	                        break;
	                }
	            }
	            var templateLoader = $http.get(templatePath, { cache: $templateCache });
	            return templateLoader;
	        };
	        /* Template info end*/
	        /* Options info begin */
	        var getStringOptions = function (type) {
	            var stringOptions = [];
	            if (angular.isUndefined(type)) {
	                type = 'filter';
	            }
	            if (type == 'filter') {
	                stringOptions = [
	                    {
	                        display: "Equals",
	                        comparisonOperator: "="
	                    },
	                    {
	                        display: "Doesn't Equal",
	                        comparisonOperator: "<>"
	                    },
	                    {
	                        display: "Contains",
	                        comparisonOperator: "like",
	                        pattern: "%w%"
	                    },
	                    {
	                        display: "Doesn't Contain",
	                        comparisonOperator: "not like",
	                        pattern: "%w%"
	                    },
	                    {
	                        display: "Starts With",
	                        comparisonOperator: "like",
	                        pattern: "w%"
	                    },
	                    {
	                        display: "Doesn't Start With",
	                        comparisonOperator: "not like",
	                        pattern: "w%"
	                    },
	                    {
	                        display: "Ends With",
	                        comparisonOperator: "like",
	                        pattern: "%w"
	                    },
	                    {
	                        display: "Doesn't End With",
	                        comparisonOperator: "not like",
	                        pattern: "%w"
	                    },
	                    {
	                        display: "In List",
	                        comparisonOperator: "in"
	                    },
	                    {
	                        display: "Not In List",
	                        comparisonOperator: "not in"
	                    },
	                    {
	                        display: "Defined",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Defined",
	                        comparisonOperator: "is",
	                        value: "null"
	                    }
	                ];
	                if (type === 'condition') {
	                    stringOptions = [
	                        {
	                            display: "Equals",
	                            comparisonOperator: "="
	                        },
	                        {
	                            display: "In List",
	                            comparisonOperator: "in"
	                        },
	                        {
	                            display: "Defined",
	                            comparisonOperator: "is not",
	                            value: "null"
	                        },
	                        {
	                            display: "Not Defined",
	                            comparisonOperator: "is",
	                            value: "null"
	                        }
	                    ];
	                }
	            }
	            return stringOptions;
	        };
	        var getBooleanOptions = function (type) {
	            var booleanOptions = [];
	            if (angular.isUndefined(type)) {
	                type = 'filter';
	            }
	            if (type === 'filter' || type === 'condition') {
	                booleanOptions = [
	                    {
	                        display: "True",
	                        comparisonOperator: "=",
	                        value: "True"
	                    },
	                    {
	                        display: "False",
	                        comparisonOperator: "=",
	                        value: "False"
	                    },
	                    {
	                        display: "Defined",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Defined",
	                        comparisonOperator: "is",
	                        value: "null"
	                    }
	                ];
	            }
	            return booleanOptions;
	        };
	        var getDateOptions = function (type) {
	            var dateOptions = [];
	            if (angular.isUndefined(type)) {
	                type = 'filter';
	            }
	            if (type === 'filter') {
	                dateOptions = [
	                    {
	                        display: "Date",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'exactDate',
	                        }
	                    },
	                    {
	                        display: "In Range",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'range'
	                        }
	                    },
	                    {
	                        display: "Not In Range",
	                        comparisonOperator: "not between",
	                        dateInfo: {
	                            type: 'range'
	                        }
	                    },
	                    {
	                        display: "Today",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'd',
	                            measureCount: 0,
	                            behavior: 'toDate'
	                        }
	                    },
	                    {
	                        display: "Yesterday",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'd',
	                            measureCount: -1,
	                            behavior: 'toDate'
	                        }
	                    },
	                    {
	                        display: "This Week",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'w',
	                            behavior: 'toDate'
	                        }
	                    },
	                    {
	                        display: "This Month",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'm',
	                            behavior: 'toDate'
	                        }
	                    },
	                    {
	                        display: "This Quarter",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'q',
	                            behavior: 'toDate'
	                        }
	                    },
	                    {
	                        display: "This Year",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'y',
	                            behavior: 'toDate'
	                        }
	                    },
	                    {
	                        display: "Last N Hour(s)",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'h',
	                            measureTypeDisplay: 'Hours'
	                        }
	                    },
	                    {
	                        display: "Last N Day(s)",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'd',
	                            measureTypeDisplay: 'Days'
	                        }
	                    },
	                    {
	                        display: "Last N Week(s)",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'w',
	                            measureTypeDisplay: 'Weeks'
	                        }
	                    },
	                    {
	                        display: "Last N Month(s)",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'm',
	                            measureTypeDisplay: 'Months'
	                        }
	                    },
	                    {
	                        display: "Last N Quarter(s)",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'q',
	                            measureTypeDisplay: 'Quarters'
	                        }
	                    },
	                    {
	                        display: "Last N Year(s)",
	                        comparisonOperator: "between",
	                        dateInfo: {
	                            type: 'calculation',
	                            measureType: 'y',
	                            measureTypeDisplay: 'Years'
	                        }
	                    },
	                    {
	                        display: "Defined",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Defined",
	                        comparisonOperator: "is",
	                        value: "null"
	                    }
	                ];
	            }
	            if (type === 'condition') {
	                dateOptions = [
	                    {
	                        display: "Defined",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Defined",
	                        comparisonOperator: "is",
	                        value: "null"
	                    }
	                ];
	            }
	            return dateOptions;
	        };
	        var getNumberOptions = function (type) {
	            var numberOptions = [];
	            if (angular.isUndefined(type)) {
	                type = 'filter';
	            }
	            if (type == 'filter') {
	                numberOptions = [
	                    {
	                        display: "Equals",
	                        comparisonOperator: "="
	                    },
	                    {
	                        display: "Doesn't Equal",
	                        comparisonOperator: "<>"
	                    },
	                    {
	                        display: "In Range",
	                        comparisonOperator: "between",
	                        type: "range"
	                    },
	                    {
	                        display: "Not In Range",
	                        comparisonOperator: "not between",
	                        type: "range"
	                    },
	                    {
	                        display: "Greater Than",
	                        comparisonOperator: ">"
	                    },
	                    {
	                        display: "Greater Than Or Equal",
	                        comparisonOperator: ">="
	                    },
	                    {
	                        display: "Less Than",
	                        comparisonOperator: "<"
	                    },
	                    {
	                        display: "Less Than Or Equal",
	                        comparisonOperator: "<="
	                    },
	                    {
	                        display: "In List",
	                        comparisonOperator: "in"
	                    },
	                    {
	                        display: "Not In List",
	                        comparisonOperator: "not in"
	                    },
	                    {
	                        display: "Defined",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Defined",
	                        comparisonOperator: "is",
	                        value: "null"
	                    }
	                ];
	            }
	            if (type === 'condition') {
	                numberOptions = [
	                    {
	                        display: "Equals",
	                        comparisonOperator: "="
	                    },
	                    {
	                        display: "Doesn't Equal",
	                        comparisonOperator: "<>"
	                    },
	                    {
	                        display: "Greater Than",
	                        comparisonOperator: ">"
	                    },
	                    {
	                        display: "Greater Than Or Equal",
	                        comparisonOperator: ">="
	                    },
	                    {
	                        display: "Less Than",
	                        comparisonOperator: "<"
	                    },
	                    {
	                        display: "Less Than Or Equal",
	                        comparisonOperator: "<="
	                    },
	                    {
	                        display: "In List",
	                        comparisonOperator: "in"
	                    },
	                    {
	                        display: "Defined",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Defined",
	                        comparisonOperator: "is",
	                        value: "null"
	                    }
	                ];
	            }
	            return numberOptions;
	        };
	        var getOneToManyOptions = function (type) {
	            var oneToManyOptions = [];
	            if (angular.isUndefined(type)) {
	                type = 'filter';
	            }
	            if (type == 'filter') {
	                oneToManyOptions = [
	                    {
	                        display: "All Exist In Collection",
	                        comparisonOperator: "All"
	                    },
	                    {
	                        display: "None Exist In Collection",
	                        comparisonOperator: "None"
	                    },
	                    {
	                        display: "Some Exist In Collection",
	                        comparisonOperator: "One"
	                    }
	                ];
	            }
	            if (type === 'condition') {
	                oneToManyOptions = [];
	            }
	            return oneToManyOptions;
	        };
	        var getManyToManyOptions = function (type) {
	            var manyToManyOptions = [];
	            if (angular.isUndefined(type)) {
	                type = 'filter';
	            }
	            if (type == 'filter') {
	                manyToManyOptions = [
	                    {
	                        display: "All Exist In Collection",
	                        comparisonOperator: "All"
	                    },
	                    {
	                        display: "None Exist In Collection",
	                        comparisonOperator: "None"
	                    },
	                    {
	                        display: "Some Exist In Collection",
	                        comparisonOperator: "One"
	                    },
	                    {
	                        display: "Empty",
	                        comparisonOperator: "is",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Empty",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    }
	                ];
	            }
	            if (type === 'condition') {
	                manyToManyOptions = [
	                    {
	                        display: "Empty",
	                        comparisonOperator: "is",
	                        value: "null"
	                    },
	                    {
	                        display: "Not Empty",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    }
	                ];
	            }
	            return manyToManyOptions;
	        };
	        var getManyToOneOptions = function (type) {
	            var manyToOneOptions = [];
	            if (angular.isUndefined(type)) {
	                type = 'filter';
	            }
	            if (type == 'filter') {
	                manyToOneOptions = {
	                    drillEntity: {},
	                    hasEntity: {
	                        display: "Defined",
	                        comparisonOperator: "is not",
	                        value: "null"
	                    },
	                    notHasEntity: {
	                        display: "Not Defined",
	                        comparisonOperator: "is",
	                        value: "null"
	                    }
	                };
	            }
	            return manyToOneOptions;
	        };
	        /* Options info end */
	        var linker = function (scope, element, attrs) {
	            /*show the user the value without % symbols as these are reserved*/
	            scope.$watch('selectedFilterProperty.criteriaValue', function (criteriaValue) {
	                if (angular.isDefined(criteriaValue)) {
	                    scope.selectedFilterProperty.criteriaValue = $filter('likeFilter')(criteriaValue);
	                }
	            });
	            scope.$watch('selectedFilterProperty', function (selectedFilterProperty) {
	                if (angular.isDefined(selectedFilterProperty)) {
	                    $log.debug('watchSelectedFilterProperty');
	                    $log.debug(scope.selectedFilterProperty);
	                    /*prepopulate if we have a comparison operator and value*/
	                    if (selectedFilterProperty === null) {
	                        return;
	                    }
	                    if (angular.isDefined(selectedFilterProperty.ormtype)) {
	                        switch (scope.selectedFilterProperty.ormtype) {
	                            case "boolean":
	                                scope.conditionOptions = getBooleanOptions();
	                                break;
	                            case "string":
	                                scope.conditionOptions = getStringOptions();
	                                scope.selectedConditionChanged = function (selectedFilterProperty) {
	                                    //scope.selectedFilterProperty.criteriaValue = '';
	                                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                                        selectedFilterProperty.showCriteriaValue = false;
	                                    }
	                                    else {
	                                        selectedFilterProperty.showCriteriaValue = true;
	                                    }
	                                };
	                                break;
	                            case "timestamp":
	                                scope.conditionOptions = getDateOptions();
	                                scope.today = function () {
	                                    if (angular.isDefined(scope.selectedFilterProperty)) {
	                                        scope.selectedFilterProperty.criteriaRangeStart = new Date();
	                                        scope.selectedFilterProperty.criteriaRangeEnd = new Date();
	                                    }
	                                };
	                                scope.clear = function () {
	                                    scope.selectedFilterProperty.criteriaRangeStart = null;
	                                    scope.selectedFilterProperty.criteriaRangeEnd = null;
	                                };
	                                scope.openCalendarStart = function ($event) {
	                                    $event.preventDefault();
	                                    $event.stopPropagation();
	                                    scope.openedCalendarStart = true;
	                                };
	                                scope.openCalendarEnd = function ($event) {
	                                    $event.preventDefault();
	                                    $event.stopPropagation();
	                                    scope.openedCalendarEnd = true;
	                                };
	                                scope.formats = [
	                                    'dd-MMMM-yyyy',
	                                    'yyyy/MM/dd',
	                                    'dd.MM.yyyy',
	                                    'shortDate'];
	                                scope.format = scope.formats[1];
	                                scope.selectedConditionChanged = function (selectedFilterProperty) {
	                                    $log.debug('selectedConditionChanged Begin');
	                                    var selectedCondition = selectedFilterProperty.selectedCriteriaType;
	                                    //check whether condition is checking for null values in date
	                                    if (angular.isDefined(selectedCondition.dateInfo)) {
	                                        //is condition a calculation
	                                        if (selectedCondition.dateInfo.type === 'calculation') {
	                                            selectedCondition.showCriteriaStart = true;
	                                            selectedCondition.showCriteriaEnd = true;
	                                            selectedCondition.disableCriteriaStart = true;
	                                            selectedCondition.disableCriteriaEnd = true;
	                                            //if item is a calculation of an N number of measure display the measure and number input
	                                            if (angular.isUndefined(selectedCondition.dateInfo.behavior)) {
	                                                $log.debug('Not toDate');
	                                                selectedCondition.showNumberOf = true;
	                                                selectedCondition.conditionDisplay = 'Number of ' + selectedCondition.dateInfo.measureTypeDisplay + ' :';
	                                            }
	                                            else {
	                                                $log.debug('toDate');
	                                                var today = Date.parse('today');
	                                                var todayEOD = today.setHours(23, 59, 59, 999);
	                                                selectedFilterProperty.criteriaRangeEnd = todayEOD;
	                                                //get this Measure to date
	                                                switch (selectedCondition.dateInfo.measureType) {
	                                                    case 'd':
	                                                        var dateBOD = Date.parse('today').add(selectedCondition.dateInfo.measureCount).days();
	                                                        dateBOD.setHours(0, 0, 0, 0);
	                                                        selectedFilterProperty.criteriaRangeStart = dateBOD.getTime();
	                                                        break;
	                                                    case 'w':
	                                                        var firstDayOfWeek = Date.today().last().monday();
	                                                        selectedFilterProperty.criteriaRangeStart = firstDayOfWeek.getTime();
	                                                        break;
	                                                    case 'm':
	                                                        var firstDayOfMonth = Date.today().moveToFirstDayOfMonth();
	                                                        selectedFilterProperty.criteriaRangeStart = firstDayOfMonth.getTime();
	                                                        break;
	                                                    case 'q':
	                                                        var month = Date.parse('today').toString('MM');
	                                                        var year = Date.parse('today').toString('yyyy');
	                                                        var quarterMonth = (Math.floor(month / 3) * 3);
	                                                        var firstDayOfQuarter = new Date(year, quarterMonth, 1);
	                                                        selectedFilterProperty.criteriaRangeStart = firstDayOfQuarter.getTime();
	                                                        break;
	                                                    case 'y':
	                                                        var year = Date.parse('today').toString('yyyy');
	                                                        var firstDayOfYear = new Date(year, 0, 1);
	                                                        selectedFilterProperty.criteriaRangeStart = firstDayOfYear.getTime();
	                                                        break;
	                                                }
	                                            }
	                                        }
	                                        if (selectedCondition.dateInfo.type === 'range') {
	                                            selectedCondition.showCriteriaStart = true;
	                                            selectedCondition.showCriteriaEnd = true;
	                                            selectedCondition.disableCriteriaStart = false;
	                                            selectedCondition.disableCriteriaEnd = false;
	                                            selectedCondition.showNumberOf = false;
	                                        }
	                                        if (selectedCondition.dateInfo.type === 'exactDate') {
	                                            selectedCondition.showCriteriaStart = true;
	                                            selectedCondition.showCriteriaEnd = false;
	                                            selectedCondition.disableCriteriaStart = false;
	                                            selectedCondition.disableCriteriaEnd = true;
	                                            selectedCondition.showNumberOf = false;
	                                            selectedCondition.conditionDisplay = '';
	                                            selectedFilterProperty.criteriaRangeStart = new Date(selectedFilterProperty.criteriaRangeStart).setHours(0, 0, 0, 0);
	                                            selectedFilterProperty.criteriaRangeEnd = new Date(selectedFilterProperty.criteriaRangeStart).setHours(23, 59, 59, 999);
	                                        }
	                                    }
	                                    else {
	                                        selectedCondition.showCriteriaStart = false;
	                                        selectedCondition.showCriteriaEnd = false;
	                                        selectedCondition.showNumberOf = false;
	                                        selectedCondition.conditionDisplay = '';
	                                    }
	                                    $log.debug('selectedConditionChanged End');
	                                    $log.debug('selectedConditionChanged Result');
	                                    $log.debug(selectedCondition);
	                                    $log.debug(selectedFilterProperty);
	                                };
	                                scope.criteriaRangeChanged = function (selectedFilterProperty) {
	                                    var selectedCondition = selectedFilterProperty.selectedCriteriaType;
	                                    if (selectedCondition.dateInfo.type === 'calculation') {
	                                        var measureCount = selectedFilterProperty.criteriaNumberOf;
	                                        switch (selectedCondition.dateInfo.measureType) {
	                                            case 'h':
	                                                var today = Date.parse('today');
	                                                selectedFilterProperty.criteriaRangeEnd = today.getTime();
	                                                var todayXHoursAgo = Date.parse('today').add(-(measureCount)).hours();
	                                                selectedFilterProperty.criteriaRangeStart = todayXHoursAgo.getTime();
	                                                break;
	                                            case 'd':
	                                                var lastFullDay = Date.parse('today').add(-1).days();
	                                                lastFullDay.setHours(23, 59, 59, 999);
	                                                selectedFilterProperty.criteriaRangeEnd = lastFullDay.getTime();
	                                                var lastXDaysAgo = Date.parse('today').add(-(measureCount)).days();
	                                                selectedFilterProperty.criteriaRangeStart = lastXDaysAgo.getTime();
	                                                break;
	                                            case 'w':
	                                                var lastFullWeekEnd = Date.today().last().sunday();
	                                                lastFullWeekEnd.setHours(23, 59, 59, 999);
	                                                selectedFilterProperty.criteriaRangeEnd = lastFullWeekEnd.getTime();
	                                                var lastXWeeksAgo = Date.today().last().sunday().add(-(measureCount)).weeks();
	                                                selectedFilterProperty.criteriaRangeStart = lastXWeeksAgo.getTime();
	                                                break;
	                                            case 'm':
	                                                var lastFullMonthEnd = Date.today().add(-1).months().moveToLastDayOfMonth();
	                                                lastFullMonthEnd.setHours(23, 59, 59, 999);
	                                                selectedFilterProperty.criteriaRangeEnd = lastFullMonthEnd.getTime();
	                                                var lastXMonthsAgo = Date.today().add(-1).months().moveToLastDayOfMonth().add(-(measureCount)).months();
	                                                selectedFilterProperty.criteriaRangeStart = lastXMonthsAgo.getTime();
	                                                break;
	                                            case 'q':
	                                                var currentQuarter = Math.floor((Date.parse('today').getMonth() / 3));
	                                                var firstDayOfCurrentQuarter = new Date(Date.parse('today').getFullYear(), currentQuarter * 3, 1);
	                                                var lastDayOfPreviousQuarter = firstDayOfCurrentQuarter.add(-1).days();
	                                                lastDayOfPreviousQuarter.setHours(23, 59, 59, 999);
	                                                selectedFilterProperty.criteriaRangeEnd = lastDayOfPreviousQuarter.getTime();
	                                                var lastXQuartersAgo = new Date(Date.parse('today').getFullYear(), currentQuarter * 3, 1);
	                                                lastXQuartersAgo.add(-(measureCount * 3)).months();
	                                                selectedFilterProperty.criteriaRangeStart = lastXQuartersAgo.getTime();
	                                                break;
	                                            case 'y':
	                                                var lastFullYearEnd = new Date(new Date().getFullYear(), 11, 31).add(-1).years();
	                                                lastFullYearEnd.setHours(23, 59, 59, 999);
	                                                selectedFilterProperty.criteriaRangeEnd = lastFullYearEnd.getTime();
	                                                var lastXYearsAgo = new Date(new Date().getFullYear(), 11, 31).add(-(measureCount) - 1).years();
	                                                selectedFilterProperty.criteriaRangeStart = lastXYearsAgo.getTime();
	                                                break;
	                                        }
	                                    }
	                                    if (selectedCondition.dateInfo.type === 'exactDate') {
	                                        selectedFilterProperty.criteriaRangeStart = selectedFilterProperty.criteriaRangeStart.setHours(0, 0, 0, 0);
	                                        selectedFilterProperty.criteriaRangeEnd = new Date(selectedFilterProperty.criteriaRangeStart).setHours(23, 59, 59, 999);
	                                    }
	                                    if (selectedCondition.dateInfo.type === 'range') {
	                                        if (angular.isDefined(selectedFilterProperty.criteriaRangeStart)) {
	                                            selectedFilterProperty.criteriaRangeStart = new Date(selectedFilterProperty.criteriaRangeStart).setHours(0, 0, 0, 0);
	                                        }
	                                        if (angular.isDefined(selectedFilterProperty.criteriaRangeEnd)) {
	                                            selectedFilterProperty.criteriaRangeEnd = new Date(selectedFilterProperty.criteriaRangeEnd).setHours(23, 59, 59, 999);
	                                        }
	                                    }
	                                    $log.debug('criteriaRangeChanged');
	                                    $log.debug(selectedCondition);
	                                    $log.debug(selectedFilterProperty);
	                                };
	                                break;
	                            case "big_decimal":
	                            case "integer":
	                            case "float":
	                                scope.conditionOptions = getNumberOptions();
	                                scope.criteriaRangeChanged = function (selectedFilterProperty) {
	                                    var selectedCondition = selectedFilterProperty.selectedCriteriaType;
	                                };
	                                scope.selectedConditionChanged = function (selectedFilterProperty) {
	                                    selectedFilterProperty.showCriteriaValue = true;
	                                    //check whether the type is a range
	                                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.type)) {
	                                        selectedFilterProperty.showCriteriaValue = false;
	                                        selectedFilterProperty.selectedCriteriaType.showCriteriaStart = true;
	                                        selectedFilterProperty.selectedCriteriaType.showCriteriaEnd = true;
	                                    }
	                                    //is null or is not null
	                                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                                        selectedFilterProperty.showCriteriaValue = false;
	                                    }
	                                };
	                                break;
	                        }
	                    }
	                    if (angular.isDefined(scope.selectedFilterProperty.fieldtype)) {
	                        switch (scope.selectedFilterProperty.fieldtype) {
	                            case "many-to-one":
	                                scope.conditionOptions = getManyToOneOptions(scope.comparisonType);
	                                $log.debug('many-to-one');
	                                $log.debug(scope.selectedFilterProperty);
	                                $log.debug(scope.filterPropertiesList);
	                                if (angular.isUndefined(scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier])) {
	                                    var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(scope.selectedFilterProperty.cfc);
	                                    filterPropertiesPromise.then(function (value) {
	                                        scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier] = value;
	                                        metadataService.formatPropertiesList(scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier], scope.selectedFilterProperty.propertyIdentifier);
	                                    }, function (reason) {
	                                    });
	                                }
	                                break;
	                            case "many-to-many":
	                            case "one-to-many":
	                                scope.manyToManyOptions = getManyToManyOptions();
	                                scope.oneToManyOptions = getOneToManyOptions();
	                                var existingCollectionsPromise = $hibachi.getExistingCollectionsByBaseEntity(selectedFilterProperty.cfc);
	                                existingCollectionsPromise.then(function (value) {
	                                    scope.collectionOptions = value.data;
	                                    if (angular.isDefined(scope.workflowCondition.collectionID)) {
	                                        for (var i in scope.collectionOptions) {
	                                            if (scope.collectionOptions[i].collectionID === scope.workflowCondition.collectionID) {
	                                                scope.selectedFilterProperty.selectedCollection = scope.collectionOptions[i];
	                                            }
	                                        }
	                                        for (var i in scope.oneToManyOptions) {
	                                            if (scope.oneToManyOptions[i].comparisonOperator === scope.workflowCondition.criteria) {
	                                                scope.selectedFilterProperty.selectedCriteriaType = scope.oneToManyOptions[i];
	                                            }
	                                        }
	                                    }
	                                });
	                                break;
	                        }
	                    }
	                    $log.debug('workflowCondition');
	                    $log.debug(scope.workflowCondition);
	                    angular.forEach(scope.conditionOptions, function (conditionOption) {
	                        if (conditionOption.display == scope.workflowCondition.conditionDisplay) {
	                            scope.selectedFilterProperty.selectedCriteriaType = conditionOption;
	                            scope.selectedFilterProperty.criteriaValue = scope.workflowCondition.value;
	                            if (angular.isDefined(scope.selectedFilterProperty.selectedCriteriaType.dateInfo)
	                                && angular.isDefined(scope.workflowCondition.value)
	                                && scope.workflowCondition.value.length) {
	                                var dateRangeArray = scope.workflowCondition.value.split("-");
	                                scope.selectedFilterProperty.criteriaRangeStart = new Date(parseInt(dateRangeArray[0]));
	                                scope.selectedFilterProperty.criteriaRangeEnd = new Date(parseInt(dateRangeArray[1]));
	                            }
	                            if (angular.isDefined(scope.workflowCondition.criteriaNumberOf)) {
	                                scope.selectedFilterProperty.criteriaNumberOf = scope.workflowCondition.criteriaNumberOf;
	                            }
	                            if (angular.isDefined(scope.selectedConditionChanged)) {
	                                scope.selectedConditionChanged(scope.selectedFilterProperty);
	                            }
	                        }
	                    });
	                    $log.debug('templateLoader');
	                    $log.debug(selectedFilterProperty);
	                    var templateLoader = getTemplate(selectedFilterProperty);
	                    var promise = templateLoader.success(function (html) {
	                        element.html(html);
	                        $compile(element.contents())(scope);
	                    });
	                }
	            });
	            scope.selectedCriteriaChanged = function (selectedCriteria) {
	                $log.debug(selectedCriteria);
	                //update breadcrumbs as array of filterpropertylist keys
	                $log.debug(scope.selectedFilterProperty);
	                var breadCrumb = {
	                    entityAlias: scope.selectedFilterProperty.name,
	                    cfc: scope.selectedFilterProperty.cfc,
	                    propertyIdentifier: scope.selectedFilterProperty.propertyIdentifier
	                };
	                scope.workflowCondition.breadCrumbs.push(breadCrumb);
	                //populate editfilterinfo with the current level of the filter property we are inspecting by pointing to the new scope key
	                scope.selectedFilterPropertyChanged({ selectedFilterProperty: scope.selectedFilterProperty.selectedCriteriaType });
	                //update criteria to display the condition of the new critera we have selected
	            };
	        };
	        return {
	            restrict: 'A',
	            scope: {
	                workflowCondition: "=",
	                selectedFilterProperty: "=",
	                filterPropertiesList: "=",
	                selectedFilterPropertyChanged: "&"
	            },
	            link: linker
	        };
	    }
	    SWConditionCriteria.Factory = function () {
	        var directive = function ($http, $compile, $templateCache, $log, $hibachi, $filter, workflowPartialsPath, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	            return new SWConditionCriteria($http, $compile, $templateCache, $log, $hibachi, $filter, workflowPartialsPath, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$compile',
	            '$templateCache',
	            '$log',
	            '$hibachi',
	            '$filter',
	            'workflowPartialsPath',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWConditionCriteria;
	})();
	exports.SWConditionCriteria = SWConditionCriteria;


/***/ },
/* 82 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteria = (function () {
	    function SWCriteria($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            scope: {
	                filterItem: "=",
	                selectedFilterProperty: "=",
	                filterPropertiesList: "=",
	                selectedFilterPropertyChanged: "&",
	                comparisonType: "=",
	                collectionConfig: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criteria.html',
	            link: function (scope, element, attrs) {
	            }
	        };
	    }
	    SWCriteria.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	            return new SWCriteria($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWCriteria;
	})();
	exports.SWCriteria = SWCriteria;


/***/ },
/* 83 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteriaBoolean = (function () {
	    function SWCriteriaBoolean($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criteriaboolean.html',
	            link: function (scope, element, attrs) {
	                var getBooleanOptions = function (type) {
	                    if (angular.isUndefined(type)) {
	                        type = 'filter';
	                    }
	                    var booleanOptions = [];
	                    if (type === 'filter') {
	                        booleanOptions = [
	                            {
	                                display: "True",
	                                comparisonOperator: "=",
	                                value: "True"
	                            },
	                            {
	                                display: "False",
	                                comparisonOperator: "=",
	                                value: "False"
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "is not",
	                                value: "null"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "is",
	                                value: "null"
	                            }
	                        ];
	                    }
	                    else if (type === 'condition') {
	                        booleanOptions = [
	                            {
	                                display: "True",
	                                comparisonOperator: "eq",
	                                value: "True"
	                            },
	                            {
	                                display: "False",
	                                comparisonOperator: "eq",
	                                value: "False"
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "null",
	                                value: "False"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "null",
	                                value: "True"
	                            }
	                        ];
	                    }
	                    return booleanOptions;
	                };
	                scope.conditionOptions = getBooleanOptions(scope.comparisonType);
	                angular.forEach(scope.conditionOptions, function (conditionOption) {
	                    if (conditionOption.display == scope.filterItem.conditionDisplay) {
	                        scope.selectedFilterProperty.selectedCriteriaType = conditionOption;
	                        scope.selectedFilterProperty.criteriaValue = scope.filterItem.value;
	                        if (angular.isDefined(scope.selectedConditionChanged)) {
	                            scope.selectedConditionChanged(scope.selectedFilterProperty);
	                        }
	                    }
	                });
	            }
	        };
	    }
	    SWCriteriaBoolean.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	            return new SWCriteriaBoolean($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWCriteriaBoolean;
	})();
	exports.SWCriteriaBoolean = SWCriteriaBoolean;


/***/ },
/* 84 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteriaDate = (function () {
	    function SWCriteriaDate($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criteriadate.html',
	            link: function (scope, element, attrs) {
	                var getDateOptions = function (type) {
	                    if (angular.isUndefined(type)) {
	                        type = 'filter';
	                    }
	                    var dateOptions = [];
	                    if (type === 'filter') {
	                        dateOptions = [
	                            {
	                                display: "Date",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'exactDate',
	                                }
	                            },
	                            {
	                                display: "In Range",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'range'
	                                }
	                            },
	                            {
	                                display: "Not In Range",
	                                comparisonOperator: "not between",
	                                dateInfo: {
	                                    type: 'range'
	                                }
	                            },
	                            {
	                                display: "Today",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'd',
	                                    measureCount: 0,
	                                    behavior: 'toDate'
	                                }
	                            },
	                            {
	                                display: "Yesterday",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'd',
	                                    measureCount: -1,
	                                    behavior: 'toDate'
	                                }
	                            },
	                            {
	                                display: "This Week",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'w',
	                                    behavior: 'toDate'
	                                }
	                            },
	                            {
	                                display: "This Month",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'm',
	                                    behavior: 'toDate'
	                                }
	                            },
	                            {
	                                display: "This Quarter",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'q',
	                                    behavior: 'toDate'
	                                }
	                            },
	                            {
	                                display: "This Year",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'y',
	                                    behavior: 'toDate'
	                                }
	                            },
	                            {
	                                display: "Last N Hour(s)",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'h',
	                                    measureTypeDisplay: 'Hours'
	                                }
	                            },
	                            {
	                                display: "Last N Day(s)",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'd',
	                                    measureTypeDisplay: 'Days'
	                                }
	                            },
	                            {
	                                display: "Last N Week(s)",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'w',
	                                    measureTypeDisplay: 'Weeks'
	                                }
	                            },
	                            {
	                                display: "Last N Month(s)",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'm',
	                                    measureTypeDisplay: 'Months'
	                                }
	                            },
	                            {
	                                display: "Last N Quarter(s)",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'q',
	                                    measureTypeDisplay: 'Quarters'
	                                }
	                            },
	                            {
	                                display: "Last N Year(s)",
	                                comparisonOperator: "between",
	                                dateInfo: {
	                                    type: 'calculation',
	                                    measureType: 'y',
	                                    measureTypeDisplay: 'Years'
	                                }
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "is not",
	                                value: "null"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "is",
	                                value: "null"
	                            }
	                        ];
	                    }
	                    else if (type === 'condition') {
	                        dateOptions = [
	                            {
	                                display: "Equals",
	                                comparisonOperator: "eq"
	                            },
	                            {
	                                display: "Doesn't Equal",
	                                comparisonOperator: "neq"
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "null",
	                                value: "False"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "null",
	                                value: "True"
	                            }
	                        ];
	                    }
	                    return dateOptions;
	                };
	                scope.conditionOptions = getDateOptions(scope.comparisonType);
	                scope.today = function () {
	                    if (angular.isDefined(scope.selectedFilterProperty)) {
	                        scope.selectedFilterProperty.criteriaRangeStart = new Date();
	                        scope.selectedFilterProperty.criteriaRangeEnd = new Date();
	                    }
	                };
	                scope.clear = function () {
	                    scope.selectedFilterProperty.criteriaRangeStart = null;
	                    scope.selectedFilterProperty.criteriaRangeEnd = null;
	                };
	                scope.openCalendarStart = function ($event) {
	                    $event.preventDefault();
	                    $event.stopPropagation();
	                    scope.openedCalendarStart = true;
	                };
	                scope.openCalendarEnd = function ($event) {
	                    $event.preventDefault();
	                    $event.stopPropagation();
	                    scope.openedCalendarEnd = true;
	                };
	                scope.formats = [
	                    'dd-MMMM-yyyy',
	                    'yyyy/MM/dd',
	                    'dd.MM.yyyy',
	                    'shortDate'];
	                scope.format = scope.formats[1];
	                scope.selectedConditionChanged = function (selectedFilterProperty) {
	                    $log.debug('selectedConditionChanged Begin');
	                    var selectedCondition = selectedFilterProperty.selectedCriteriaType;
	                    //check whether condition is checking for null values in date
	                    if (angular.isDefined(selectedCondition.dateInfo)) {
	                        //is condition a calculation
	                        if (selectedCondition.dateInfo.type === 'calculation') {
	                            selectedCondition.showCriteriaStart = true;
	                            selectedCondition.showCriteriaEnd = true;
	                            selectedCondition.disableCriteriaStart = true;
	                            selectedCondition.disableCriteriaEnd = true;
	                            //if item is a calculation of an N number of measure display the measure and number input
	                            if (angular.isUndefined(selectedCondition.dateInfo.behavior)) {
	                                $log.debug('Not toDate');
	                                selectedCondition.showNumberOf = true;
	                                selectedCondition.conditionDisplay = 'Number of ' + selectedCondition.dateInfo.measureTypeDisplay + ' :';
	                            }
	                            else {
	                                $log.debug('toDate');
	                                var today = Date.parse('today');
	                                var todayEOD = today.setHours(23, 59, 59, 999);
	                                selectedFilterProperty.criteriaRangeEnd = todayEOD;
	                                //get this Measure to date
	                                switch (selectedCondition.dateInfo.measureType) {
	                                    case 'd':
	                                        var dateBOD = Date.parse('today').add(selectedCondition.dateInfo.measureCount).days();
	                                        dateBOD.setHours(0, 0, 0, 0);
	                                        selectedFilterProperty.criteriaRangeStart = dateBOD.getTime();
	                                        break;
	                                    case 'w':
	                                        var firstDayOfWeek = Date.today().last().monday();
	                                        selectedFilterProperty.criteriaRangeStart = firstDayOfWeek.getTime();
	                                        break;
	                                    case 'm':
	                                        var firstDayOfMonth = Date.today().moveToFirstDayOfMonth();
	                                        selectedFilterProperty.criteriaRangeStart = firstDayOfMonth.getTime();
	                                        break;
	                                    case 'q':
	                                        var month = Date.parse('today').toString('MM');
	                                        var year = Date.parse('today').toString('yyyy');
	                                        var quarterMonth = (Math.floor(month / 3) * 3);
	                                        var firstDayOfQuarter = new Date(year, quarterMonth, 1);
	                                        selectedFilterProperty.criteriaRangeStart = firstDayOfQuarter.getTime();
	                                        break;
	                                    case 'y':
	                                        var year = Date.parse('today').toString('yyyy');
	                                        var firstDayOfYear = new Date(year, 0, 1);
	                                        selectedFilterProperty.criteriaRangeStart = firstDayOfYear.getTime();
	                                        break;
	                                }
	                            }
	                        }
	                        if (selectedCondition.dateInfo.type === 'range') {
	                            selectedCondition.showCriteriaStart = true;
	                            selectedCondition.showCriteriaEnd = true;
	                            selectedCondition.disableCriteriaStart = false;
	                            selectedCondition.disableCriteriaEnd = false;
	                            selectedCondition.showNumberOf = false;
	                        }
	                        if (selectedCondition.dateInfo.type === 'exactDate') {
	                            selectedCondition.showCriteriaStart = true;
	                            selectedCondition.showCriteriaEnd = false;
	                            selectedCondition.disableCriteriaStart = false;
	                            selectedCondition.disableCriteriaEnd = true;
	                            selectedCondition.showNumberOf = false;
	                            selectedCondition.conditionDisplay = '';
	                            selectedFilterProperty.criteriaRangeStart = new Date(selectedFilterProperty.criteriaRangeStart).setHours(0, 0, 0, 0);
	                            selectedFilterProperty.criteriaRangeEnd = new Date(selectedFilterProperty.criteriaRangeStart).setHours(23, 59, 59, 999);
	                        }
	                    }
	                    else {
	                        selectedCondition.showCriteriaStart = false;
	                        selectedCondition.showCriteriaEnd = false;
	                        selectedCondition.showNumberOf = false;
	                        selectedCondition.conditionDisplay = '';
	                    }
	                    $log.debug('selectedConditionChanged End');
	                    $log.debug('selectedConditionChanged Result');
	                    $log.debug(selectedCondition);
	                    $log.debug(selectedFilterProperty);
	                };
	                scope.criteriaRangeChanged = function (selectedFilterProperty) {
	                    $log.debug('criteriaRangeChanged');
	                    $log.debug(selectedFilterProperty);
	                    var selectedCondition = selectedFilterProperty.selectedCriteriaType;
	                    if (selectedCondition.dateInfo.type === 'calculation') {
	                        var measureCount = selectedFilterProperty.criteriaNumberOf;
	                        switch (selectedCondition.dateInfo.measureType) {
	                            case 'h':
	                                var today = Date.parse('today');
	                                selectedFilterProperty.criteriaRangeEnd = today.getTime();
	                                var todayXHoursAgo = Date.parse('today').add(-(measureCount)).hours();
	                                selectedFilterProperty.criteriaRangeStart = todayXHoursAgo.getTime();
	                                break;
	                            case 'd':
	                                var lastFullDay = Date.parse('today').add(-1).days();
	                                lastFullDay.setHours(23, 59, 59, 999);
	                                selectedFilterProperty.criteriaRangeEnd = lastFullDay.getTime();
	                                var lastXDaysAgo = Date.parse('today').add(-(measureCount)).days();
	                                selectedFilterProperty.criteriaRangeStart = lastXDaysAgo.getTime();
	                                break;
	                            case 'w':
	                                var lastFullWeekEnd = Date.today().last().sunday();
	                                lastFullWeekEnd.setHours(23, 59, 59, 999);
	                                selectedFilterProperty.criteriaRangeEnd = lastFullWeekEnd.getTime();
	                                var lastXWeeksAgo = Date.today().last().sunday().add(-(measureCount)).weeks();
	                                selectedFilterProperty.criteriaRangeStart = lastXWeeksAgo.getTime();
	                                break;
	                            case 'm':
	                                var lastFullMonthEnd = Date.today().add(-1).months().moveToLastDayOfMonth();
	                                lastFullMonthEnd.setHours(23, 59, 59, 999);
	                                selectedFilterProperty.criteriaRangeEnd = lastFullMonthEnd.getTime();
	                                var lastXMonthsAgo = Date.today().add(-1).months().moveToLastDayOfMonth().add(-(measureCount)).months();
	                                selectedFilterProperty.criteriaRangeStart = lastXMonthsAgo.getTime();
	                                break;
	                            case 'q':
	                                var currentQuarter = Math.floor((Date.parse('today').getMonth() / 3));
	                                var firstDayOfCurrentQuarter = new Date(Date.parse('today').getFullYear(), currentQuarter * 3, 1);
	                                var lastDayOfPreviousQuarter = firstDayOfCurrentQuarter.add(-1).days();
	                                lastDayOfPreviousQuarter.setHours(23, 59, 59, 999);
	                                selectedFilterProperty.criteriaRangeEnd = lastDayOfPreviousQuarter.getTime();
	                                var lastXQuartersAgo = new Date(Date.parse('today').getFullYear(), currentQuarter * 3, 1);
	                                lastXQuartersAgo.add(-(measureCount * 3)).months();
	                                selectedFilterProperty.criteriaRangeStart = lastXQuartersAgo.getTime();
	                                break;
	                            case 'y':
	                                var lastFullYearEnd = new Date(new Date().getFullYear(), 11, 31).add(-1).years();
	                                lastFullYearEnd.setHours(23, 59, 59, 999);
	                                selectedFilterProperty.criteriaRangeEnd = lastFullYearEnd.getTime();
	                                var lastXYearsAgo = new Date(new Date().getFullYear(), 11, 31).add(-(measureCount) - 1).years();
	                                selectedFilterProperty.criteriaRangeStart = lastXYearsAgo.getTime();
	                                break;
	                        }
	                    }
	                    if (selectedCondition.dateInfo.type === 'exactDate' && angular.isDefined(selectedFilterProperty.criteriaRangeStart) && angular.isDefined(selectedFilterProperty.criteriaRangeStart.setHours)) {
	                        selectedFilterProperty.criteriaRangeStart = selectedFilterProperty.criteriaRangeStart.setHours(0, 0, 0, 0);
	                        selectedFilterProperty.criteriaRangeEnd = new Date(selectedFilterProperty.criteriaRangeStart).setHours(23, 59, 59, 999);
	                    }
	                    if (selectedCondition.dateInfo.type === 'range') {
	                        if (angular.isDefined(selectedFilterProperty.criteriaRangeStart) && angular.isDefined(selectedFilterProperty.criteriaRangeStart)) {
	                            selectedFilterProperty.criteriaRangeStart = new Date(selectedFilterProperty.criteriaRangeStart).setHours(0, 0, 0, 0);
	                        }
	                        if (angular.isDefined(selectedFilterProperty.criteriaRangeEnd) && angular.isDefined(selectedFilterProperty.criteriaRangeStart)) {
	                            selectedFilterProperty.criteriaRangeEnd = new Date(selectedFilterProperty.criteriaRangeEnd).setHours(23, 59, 59, 999);
	                        }
	                    }
	                    $log.debug('criteriaRangeChanged');
	                    $log.debug(selectedCondition);
	                    $log.debug(selectedFilterProperty);
	                };
	                if (angular.isUndefined(scope.filterItem.$$isNew) || scope.filterItem.$$isNew === false) {
	                    angular.forEach(scope.conditionOptions, function (conditionOption) {
	                        if (conditionOption.display == scope.filterItem.conditionDisplay) {
	                            scope.selectedFilterProperty.selectedCriteriaType = conditionOption;
	                            scope.selectedFilterProperty.criteriaValue = scope.filterItem.value;
	                            if (angular.isDefined(scope.selectedFilterProperty.selectedCriteriaType.dateInfo)
	                                && angular.isDefined(scope.filterItem.value)
	                                && scope.filterItem.value.length) {
	                                var dateRangeArray = scope.filterItem.value.split("-");
	                                scope.selectedFilterProperty.criteriaRangeStart = new Date(parseInt(dateRangeArray[0]));
	                                scope.selectedFilterProperty.criteriaRangeEnd = new Date(parseInt(dateRangeArray[1]));
	                            }
	                            if (angular.isDefined(scope.selectedConditionChanged)) {
	                                scope.selectedConditionChanged(scope.selectedFilterProperty);
	                            }
	                        }
	                    });
	                }
	                else {
	                    scope.selectedFilterProperty.criteriaValue = '';
	                    scope.selectedFilterProperty.criteriaRangeStart = '';
	                    scope.selectedFilterProperty.criteriaRangeEnd = '';
	                }
	            }
	        };
	    }
	    SWCriteriaDate.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	            return new SWCriteriaDate($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWCriteriaDate;
	})();
	exports.SWCriteriaDate = SWCriteriaDate;


/***/ },
/* 85 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteriaManyToMany = (function () {
	    function SWCriteriaManyToMany($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, dialogService, observerService, hibachiPathBuilder, rbkeyService) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criteriamanytomany.html',
	            link: function (scope, element, attrs) {
	                scope.data = {};
	                scope.collectionOptionsOpen = false;
	                scope.toggleCollectionOptions = function (flag) {
	                    scope.collectionOptionsOpen = (!angular.isUndefined(flag)) ? flag : !scope.collectionOptionsOpen;
	                };
	                scope.selectCollection = function (collection) {
	                    scope.toggleCollectionOptions();
	                    scope.selectedFilterProperty.selectedCollection = collection;
	                    scope.selectedFilterProperty.selectedCriteriaType = scope.manyToManyOptions[2];
	                };
	                scope.cleanSelection = function () {
	                    scope.toggleCollectionOptions(false);
	                    scope.data.collectionName = "";
	                    scope.selectedFilterProperty.selectedCollection = null;
	                };
	                var getManyToManyOptions = function (type) {
	                    if (angular.isUndefined(type)) {
	                        type = 'filter';
	                    }
	                    $log.debug('type', type);
	                    var manyToManyOptions = [];
	                    if (type == 'filter') {
	                        manyToManyOptions = [
	                            {
	                                display: "All Exist In Collection",
	                                comparisonOperator: "All"
	                            },
	                            {
	                                display: "None Exist In Collection",
	                                comparisonOperator: "None"
	                            },
	                            {
	                                display: "Some Exist In Collection",
	                                comparisonOperator: "One"
	                            },
	                            {
	                                display: "Empty",
	                                comparisonOperator: "is",
	                                value: "null"
	                            },
	                            {
	                                display: "Not Empty",
	                                comparisonOperator: "is not",
	                                value: "null"
	                            }
	                        ];
	                    }
	                    else if (type === 'condition') {
	                        manyToManyOptions = [];
	                    }
	                    return manyToManyOptions;
	                };
	                scope.manyToManyOptions = getManyToManyOptions(scope.comparisonType);
	                var existingCollectionsPromise = $hibachi.getExistingCollectionsByBaseEntity(scope.selectedFilterProperty.cfc);
	                existingCollectionsPromise.then(function (value) {
	                    scope.collectionOptions = value.data;
	                    if (angular.isDefined(scope.filterItem.collectionID)) {
	                        for (var i in scope.collectionOptions) {
	                            if (scope.collectionOptions[i].collectionID === scope.filterItem.collectionID) {
	                                scope.selectedFilterProperty.selectedCollection = scope.collectionOptions[i];
	                            }
	                        }
	                        for (var i in scope.manyToManyOptions) {
	                            if (scope.manyToManyOptions[i].comparisonOperator === scope.filterItem.criteria) {
	                                scope.selectedFilterProperty.selectedCriteriaType = scope.manyToManyOptions[i];
	                            }
	                        }
	                    }
	                });
	                function populateUI(collection) {
	                    scope.collectionOptions.push(collection);
	                    scope.selectedFilterProperty.selectedCollection = collection;
	                    scope.selectedFilterProperty.selectedCriteriaType = scope.manyToManyOptions[2];
	                }
	                observerService.attach(populateUI, 'addCollection', 'addCollection');
	                scope.selectedCriteriaChanged = function (selectedCriteria) {
	                    $log.debug(selectedCriteria);
	                    //update breadcrumbs as array of filterpropertylist keys
	                    $log.debug(scope.selectedFilterProperty);
	                    var breadCrumb = {
	                        entityAlias: scope.selectedFilterProperty.name,
	                        cfc: scope.selectedFilterProperty.cfc,
	                        propertyIdentifier: scope.selectedFilterProperty.propertyIdentifier,
	                        rbKey: rbkeyService.getRBKey('entity.' + scope.selectedFilterProperty.cfc.replace('_', ''))
	                    };
	                    scope.filterItem.breadCrumbs.push(breadCrumb);
	                    //populate editfilterinfo with the current level of the filter property we are inspecting by pointing to the new scope key
	                    scope.selectedFilterPropertyChanged({ selectedFilterProperty: scope.selectedFilterProperty.selectedCriteriaType });
	                    //update criteria to display the condition of the new critera we have selected
	                };
	                scope.addNewCollection = function () {
	                    dialogService.addPageDialog('org/Hibachi/client/src/collection/components/criteriacreatecollection', {
	                        entityName: scope.selectedFilterProperty.cfc,
	                        collectionName: scope.data.collectionName,
	                        parentEntity: scope.collectionConfig.baseEntityName
	                    });
	                    scope.cleanSelection();
	                };
	                scope.viewSelectedCollection = function () {
	                    dialogService.addPageDialog('org/Hibachi/client/src/collection/components/criteriacreatecollection', {
	                        entityName: 'collection',
	                        entityId: scope.selectedFilterProperty.selectedCollection.collectionID,
	                        parentEntity: scope.collectionConfig.baseEntityName
	                    });
	                };
	            }
	        };
	    }
	    SWCriteriaManyToMany.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, dialogService, observerService, hibachiPathBuilder, rbkeyService) {
	            return new SWCriteriaManyToMany($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, dialogService, observerService, hibachiPathBuilder, rbkeyService);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'dialogService',
	            'observerService',
	            'hibachiPathBuilder',
	            'rbkeyService',
	        ];
	        return directive;
	    };
	    return SWCriteriaManyToMany;
	})();
	exports.SWCriteriaManyToMany = SWCriteriaManyToMany;


/***/ },
/* 86 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteriaManyToOne = (function () {
	    function SWCriteriaManyToOne($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder, rbkeyService) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criteriamanytoone.html',
	            link: function (scope, element, attrs) {
	                var getManyToOneOptions = function () {
	                    var manyToOneOptions = {
	                        drillEntity: {},
	                        hasEntity: {
	                            display: "Defined",
	                            comparisonOperator: "is not",
	                            value: "null"
	                        },
	                        notHasEntity: {
	                            display: "Not Defined",
	                            comparisonOperator: "is",
	                            value: "null"
	                        }
	                    };
	                    return manyToOneOptions;
	                };
	                scope.manyToOneOptions = getManyToOneOptions();
	                scope.conditionOptions = getManyToOneOptions();
	                $log.debug('many-to-one');
	                $log.debug(scope.selectedFilterProperty);
	                $log.debug(scope.filterPropertiesList);
	                scope.$watch('selectedFilterProperty', function (selectedFilterProperty) {
	                    if (angular.isUndefined(scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier])) {
	                        var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(selectedFilterProperty.cfc);
	                        filterPropertiesPromise.then(function (value) {
	                            scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier] = value;
	                            metadataService.formatPropertiesList(scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier], scope.selectedFilterProperty.propertyIdentifier);
	                        }, function (reason) {
	                        });
	                    }
	                    scope.selectedCriteriaChanged = function (selectedCriteria) {
	                        $log.debug(selectedCriteria);
	                        $log.debug('changed');
	                        //update breadcrumbs as array of filterpropertylist keys
	                        $log.debug(scope.selectedFilterProperty);
	                        var breadCrumb = {
	                            entityAlias: scope.selectedFilterProperty.name,
	                            cfc: scope.selectedFilterProperty.cfc,
	                            propertyIdentifier: scope.selectedFilterProperty.propertyIdentifier,
	                            rbKey: rbkeyService.getRBKey('entity.' + scope.selectedFilterProperty.cfc.replace('_', ''))
	                        };
	                        $log.debug('breadcrumb');
	                        $log.debug(breadCrumb);
	                        $log.debug(scope.filterItem.breadCrumbs);
	                        scope.filterItem.breadCrumbs.push(breadCrumb);
	                        //populate editfilterinfo with the current level of the filter property we are inspecting by pointing to the new scope key
	                        scope.selectedFilterPropertyChanged({ selectedFilterProperty: scope.selectedFilterProperty.selectedCriteriaType });
	                        //update criteria to display the condition of the new critera we have selected
	                        $log.debug(scope.selectedFilterProperty);
	                    };
	                });
	            }
	        };
	    }
	    SWCriteriaManyToOne.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder, rbkeyService) {
	            return new SWCriteriaManyToOne($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder, rbkeyService);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder',
	            'rbkeyService'
	        ];
	        return directive;
	    };
	    return SWCriteriaManyToOne;
	})();
	exports.SWCriteriaManyToOne = SWCriteriaManyToOne;
	// 'use strict';
	// angular.module('slatwalladmin')
	// .directive('swCriteriaManyToOne', [
	// 	'$log',
	// 	'$hibachi',
	// 	'$filter',
	// 	'collectionPartialsPath',
	// 	'collectionService',
	// 	'metadataService',
	// 	function(
	// 		$log,
	// 		$hibachi,
	// 		$filter,
	// 		collectionPartialsPath,
	// 		collectionService,
	// 		metadataService
	// 	){
	// 		return {
	// 			restrict: 'E',
	// 			templateUrl:collectionPartialsPath+'criteriamanytoone.html',
	// 			link: function(scope, element, attrs){
	// 				var getManyToOneOptions = function(){
	// 			    	var manyToOneOptions = {
	// 			            drillEntity:{},
	// 						hasEntity:{
	// 							display:"Defined",
	// 							comparisonOperator:"is not",
	// 							value:"null"
	// 						},
	// 						notHasEntity:{
	// 							display:"Not Defined",
	// 							comparisonOperator:"is",
	// 							value:"null"
	// 						}
	// 			    	};
	// 			    	return manyToOneOptions;
	// 			    };
	// 			    scope.manyToOneOptions = getManyToOneOptions();
	// 			    scope.conditionOptions = getManyToOneOptions();
	// 				$log.debug('many-to-one');
	// 				$log.debug(scope.selectedFilterProperty);
	// 				$log.debug(scope.filterPropertiesList);
	// 				scope.$watch('selectedFilterProperty',function(selectedFilterProperty){
	// 					if(angular.isUndefined(scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier])){
	// 						var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(selectedFilterProperty.cfc);
	// 						filterPropertiesPromise.then(function(value){
	// 							scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier] = value;
	// 							metadataService.formatPropertiesList(scope.filterPropertiesList[scope.selectedFilterProperty.propertyIdentifier],scope.selectedFilterProperty.propertyIdentifier);
	// 						}, function(reason){
	// 						});
	// 					}
	// 					scope.selectedCriteriaChanged = function(selectedCriteria){
	// 						$log.debug(selectedCriteria);
	// 						$log.debug('changed');
	// 						//update breadcrumbs as array of filterpropertylist keys
	// 						$log.debug(scope.selectedFilterProperty);
	// 						var breadCrumb = {
	// 								entityAlias:scope.selectedFilterProperty.name,
	// 								cfc:scope.selectedFilterProperty.cfc,
	// 								propertyIdentifier:scope.selectedFilterProperty.propertyIdentifier,
	// 								rbKey:rbkeyService.getRBKey('entity.'+scope.selectedFilterProperty.cfc.replace('_',''))
	// 						};
	// 						$log.debug('breadcrumb');
	// 						$log.debug(breadCrumb);
	// 						$log.debug(scope.filterItem.breadCrumbs);
	// 						scope.filterItem.breadCrumbs.push(breadCrumb);
	// 						//populate editfilterinfo with the current level of the filter property we are inspecting by pointing to the new scope key
	// 						scope.selectedFilterPropertyChanged({selectedFilterProperty:scope.selectedFilterProperty.selectedCriteriaType});
	// 						//update criteria to display the condition of the new critera we have selected
	// 						$log.debug(scope.selectedFilterProperty);
	// 					};
	// 				});
	// 			}
	// 		};
	// 	}
	// ]);


/***/ },
/* 87 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteriaNumber = (function () {
	    function SWCriteriaNumber($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criterianumber.html',
	            link: function (scope, element, attrs) {
	                var getNumberOptions = function (type) {
	                    if (angular.isUndefined(type)) {
	                        type = 'filter';
	                    }
	                    var numberOptions = [];
	                    if (type === 'filter') {
	                        numberOptions = [
	                            {
	                                display: "Equals",
	                                comparisonOperator: "="
	                            },
	                            {
	                                display: "Doesn't Equal",
	                                comparisonOperator: "<>"
	                            },
	                            {
	                                display: "In Range",
	                                comparisonOperator: "between",
	                                type: "range"
	                            },
	                            {
	                                display: "Not In Range",
	                                comparisonOperator: "not between",
	                                type: "range"
	                            },
	                            {
	                                display: "Greater Than",
	                                comparisonOperator: ">"
	                            },
	                            {
	                                display: "Greater Than Or Equal",
	                                comparisonOperator: ">="
	                            },
	                            {
	                                display: "Less Than",
	                                comparisonOperator: "<"
	                            },
	                            {
	                                display: "Less Than Or Equal",
	                                comparisonOperator: "<="
	                            },
	                            {
	                                display: "In List",
	                                comparisonOperator: "in"
	                            },
	                            {
	                                display: "Not In List",
	                                comparisonOperator: "not in"
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "is not",
	                                value: "null"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "is",
	                                value: "null"
	                            }
	                        ];
	                    }
	                    else if (type === 'condition') {
	                        numberOptions = [
	                            {
	                                display: "Equals",
	                                comparisonOperator: "eq"
	                            },
	                            {
	                                display: "Doesn't Equal",
	                                comparisonOperator: "neq"
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "null",
	                                value: "False"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "null",
	                                value: "True"
	                            }
	                        ];
	                    }
	                    return numberOptions;
	                };
	                scope.$watch('selectedFilterProperty.criteriaValue', function (criteriaValue) {
	                    if (angular.isDefined(criteriaValue)) {
	                        scope.selectedFilterProperty.criteriaValue = criteriaValue;
	                        $log.debug(scope.selectedFilterProperty);
	                    }
	                });
	                scope.conditionOptions = getNumberOptions(scope.comparisonType);
	                scope.criteriaRangeChanged = function (selectedFilterProperty) {
	                    var selectedCondition = selectedFilterProperty.selectedCriteriaType;
	                };
	                scope.selectedConditionChanged = function (selectedFilterProperty) {
	                    selectedFilterProperty.showCriteriaValue = true;
	                    //check whether the type is a range
	                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.type)) {
	                        selectedFilterProperty.showCriteriaValue = false;
	                        selectedFilterProperty.selectedCriteriaType.showCriteriaStart = true;
	                        selectedFilterProperty.selectedCriteriaType.showCriteriaEnd = true;
	                    }
	                    //is null or is not null
	                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                        selectedFilterProperty.showCriteriaValue = false;
	                    }
	                };
	                angular.forEach(scope.conditionOptions, function (conditionOption) {
	                    $log.debug('populate');
	                    if (conditionOption.display == scope.filterItem.conditionDisplay) {
	                        scope.selectedFilterProperty.selectedCriteriaType = conditionOption;
	                        $log.debug(scope.filterItem);
	                        if (scope.filterItem.comparisonOperator === 'between' || scope.filterItem.comparisonOperator === 'not between') {
	                            var criteriaRangeArray = scope.filterItem.value.split('-');
	                            $log.debug(criteriaRangeArray);
	                            scope.selectedFilterProperty.criteriaRangeStart = parseInt(criteriaRangeArray[0]);
	                            scope.selectedFilterProperty.criteriaRangeEnd = parseInt(criteriaRangeArray[1]);
	                        }
	                        else {
	                            scope.selectedFilterProperty.criteriaValue = scope.filterItem.value;
	                        }
	                        if (angular.isDefined(scope.filterItem.criteriaNumberOf)) {
	                            scope.selectedFilterProperty.criteriaNumberOf = scope.filterItem.criteriaNumberOf;
	                        }
	                        if (angular.isDefined(scope.selectedConditionChanged)) {
	                            scope.selectedConditionChanged(scope.selectedFilterProperty);
	                        }
	                    }
	                });
	            }
	        };
	    }
	    SWCriteriaNumber.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	            return new SWCriteriaNumber($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWCriteriaNumber;
	})();
	exports.SWCriteriaNumber = SWCriteriaNumber;


/***/ },
/* 88 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteriaOneToMany = (function () {
	    function SWCriteriaOneToMany($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, dialogService, observerService, hibachiPathBuilder, rbkeyService) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criteriaonetomany.html',
	            link: function (scope, element, attrs) {
	                scope.data = {};
	                scope.collectionOptionsOpen = false;
	                scope.toggleCollectionOptions = function (flag) {
	                    scope.collectionOptionsOpen = (!angular.isUndefined(flag)) ? flag : !scope.collectionOptionsOpen;
	                };
	                scope.selectCollection = function (collection) {
	                    scope.toggleCollectionOptions();
	                    scope.selectedFilterProperty.selectedCollection = collection;
	                    scope.selectedFilterProperty.selectedCriteriaType = scope.oneToManyOptions[2];
	                };
	                scope.cleanSelection = function () {
	                    scope.toggleCollectionOptions(false);
	                    scope.data.collectionName = "";
	                    scope.selectedFilterProperty.selectedCollection = null;
	                };
	                var getOneToManyOptions = function (type) {
	                    if (angular.isUndefined(type)) {
	                        type = 'filter';
	                    }
	                    var oneToManyOptions = [];
	                    if (type == 'filter') {
	                        oneToManyOptions = [
	                            {
	                                display: "All Exist In Collection",
	                                comparisonOperator: "All"
	                            },
	                            {
	                                display: "None Exist In Collection",
	                                comparisonOperator: "None"
	                            },
	                            {
	                                display: "Some Exist In Collection",
	                                comparisonOperator: "One"
	                            }
	                        ];
	                    }
	                    else if (type === 'condition') {
	                        oneToManyOptions = [];
	                    }
	                    return oneToManyOptions;
	                };
	                $log.debug('onetomany');
	                $log.debug(scope.selectedFilterProperty);
	                scope.oneToManyOptions = getOneToManyOptions(scope.comparisonType);
	                var existingCollectionsPromise = $hibachi.getExistingCollectionsByBaseEntity(scope.selectedFilterProperty.cfc);
	                existingCollectionsPromise.then(function (value) {
	                    scope.collectionOptions = value.data;
	                    if (angular.isDefined(scope.filterItem.collectionID)) {
	                        for (var i in scope.collectionOptions) {
	                            if (scope.collectionOptions[i].collectionID === scope.filterItem.collectionID) {
	                                scope.selectedFilterProperty.selectedCollection = scope.collectionOptions[i];
	                            }
	                        }
	                        for (var i in scope.oneToManyOptions) {
	                            if (scope.oneToManyOptions[i].comparisonOperator === scope.filterItem.criteria) {
	                                scope.selectedFilterProperty.selectedCriteriaType = scope.oneToManyOptions[i];
	                            }
	                        }
	                    }
	                });
	                function populateUI(collection) {
	                    scope.collectionOptions.push(collection);
	                    scope.selectedFilterProperty.selectedCollection = collection;
	                    scope.selectedFilterProperty.selectedCriteriaType = scope.oneToManyOptions[2];
	                }
	                observerService.attach(populateUI, 'addCollection', 'addCollection');
	                scope.selectedCriteriaChanged = function (selectedCriteria) {
	                    $log.debug(selectedCriteria);
	                    //update breadcrumbs as array of filterpropertylist keys
	                    $log.debug(scope.selectedFilterProperty);
	                    var breadCrumb = {
	                        entityAlias: scope.selectedFilterProperty.name,
	                        cfc: scope.selectedFilterProperty.cfc,
	                        propertyIdentifier: scope.selectedFilterProperty.propertyIdentifier,
	                        rbKey: rbkeyService.getRBKey('entity.' + scope.selectedFilterProperty.cfc.replace('_', '')),
	                        filterProperty: scope.selectedFilterProperty
	                    };
	                    scope.filterItem.breadCrumbs.push(breadCrumb);
	                    $log.debug('criteriaChanged');
	                    //$log.debug(selectedFilterPropertyChanged);
	                    $log.debug(scope.selectedFilterProperty);
	                    //populate editfilterinfo with the current level of the filter property we are inspecting by pointing to the new scope key
	                    scope.selectedFilterPropertyChanged({ selectedFilterProperty: scope.selectedFilterProperty.selectedCriteriaType });
	                    //update criteria to display the condition of the new critera we have selected
	                };
	                scope.addNewCollection = function () {
	                    dialogService.addPageDialog('org/Hibachi/client/src/collection/components/criteriacreatecollection', {
	                        entityName: scope.selectedFilterProperty.cfc,
	                        collectionName: scope.data.collectionName,
	                        parentEntity: scope.collectionConfig.baseEntityName
	                    });
	                    scope.cleanSelection();
	                };
	                scope.viewSelectedCollection = function () {
	                    scope.toggleCollectionOptions();
	                    dialogService.addPageDialog('org/Hibachi/client/src/collection/components/criteriacreatecollection', {
	                        entityName: 'collection',
	                        entityId: scope.selectedFilterProperty.selectedCollection.collectionID,
	                        parentEntity: scope.collectionConfig.baseEntityName
	                    });
	                };
	            }
	        };
	    }
	    SWCriteriaOneToMany.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, dialogService, observerService, hibachiPathBuilder, rbkeyService) {
	            return new SWCriteriaOneToMany($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, dialogService, observerService, hibachiPathBuilder, rbkeyService);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'dialogService',
	            'observerService',
	            'hibachiPathBuilder',
	            'rbkeyService'
	        ];
	        return directive;
	    };
	    return SWCriteriaOneToMany;
	})();
	exports.SWCriteriaOneToMany = SWCriteriaOneToMany;


/***/ },
/* 89 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCriteriaString = (function () {
	    function SWCriteriaString($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + 'criteriastring.html',
	            link: function (scope, element, attrs) {
	                var getStringOptions = function (type) {
	                    if (angular.isUndefined(type)) {
	                        type = 'filter';
	                    }
	                    var stringOptions = [];
	                    if (type === 'filter') {
	                        stringOptions = [
	                            {
	                                display: "Equals",
	                                comparisonOperator: "="
	                            },
	                            {
	                                display: "Doesn't Equal",
	                                comparisonOperator: "<>"
	                            },
	                            {
	                                display: "Contains",
	                                comparisonOperator: "like",
	                                pattern: "%w%"
	                            },
	                            {
	                                display: "Doesn't Contain",
	                                comparisonOperator: "not like",
	                                pattern: "%w%"
	                            },
	                            {
	                                display: "Starts With",
	                                comparisonOperator: "like",
	                                pattern: "w%"
	                            },
	                            {
	                                display: "Doesn't Start With",
	                                comparisonOperator: "not like",
	                                pattern: "w%"
	                            },
	                            {
	                                display: "Ends With",
	                                comparisonOperator: "like",
	                                pattern: "%w"
	                            },
	                            {
	                                display: "Doesn't End With",
	                                comparisonOperator: "not like",
	                                pattern: "%w"
	                            },
	                            {
	                                display: "In List",
	                                comparisonOperator: "in"
	                            },
	                            {
	                                display: "Not In List",
	                                comparisonOperator: "not in"
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "is not",
	                                value: "null"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "is",
	                                value: "null"
	                            }
	                        ];
	                    }
	                    else if (type === 'condition') {
	                        stringOptions = [
	                            {
	                                display: "Equals",
	                                comparisonOperator: "eq"
	                            },
	                            {
	                                display: "Doesn't Equal",
	                                comparisonOperator: "neq"
	                            },
	                            {
	                                display: "Defined",
	                                comparisonOperator: "null",
	                                value: "False"
	                            },
	                            {
	                                display: "Not Defined",
	                                comparisonOperator: "null",
	                                value: "True"
	                            }
	                        ];
	                    }
	                    return stringOptions;
	                };
	                //initialize values
	                scope.conditionOptions = getStringOptions(scope.comparisonType);
	                scope.inListArray = [];
	                if (angular.isDefined(scope.filterItem.value)) {
	                    scope.inListArray = scope.filterItem.value.split(',');
	                }
	                scope.newListItem = '';
	                //declare functions
	                scope.addToValueInListFormat = function (inListItem) {
	                    // Adds item into array
	                    scope.inListArray.push(inListItem);
	                    //set value field to the user generated list
	                    scope.filterItem.value = scope.inListArray.toString();
	                    scope.filterItem.displayValue = scope.inListArray.toString().replace(/,/g, ', ');
	                    scope.newListItem = '';
	                };
	                scope.removelistItem = function (argListIndex) {
	                    scope.inListArray.splice(argListIndex, 1);
	                    scope.filterItem.value = scope.inListArray.toString();
	                    scope.filterItem.displayValue = scope.inListArray.toString().replace(/,/g, ', ');
	                };
	                scope.clearField = function () {
	                    scope.newListItem = '';
	                };
	                scope.selectedConditionChanged = function (selectedFilterProperty) {
	                    //scope.selectedFilterProperty.criteriaValue = '';
	                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                        selectedFilterProperty.showCriteriaValue = false;
	                    }
	                    else {
	                        if (selectedFilterProperty.selectedCriteriaType.comparisonOperator === 'in' || selectedFilterProperty.selectedCriteriaType.comparisonOperator === 'not in') {
	                            selectedFilterProperty.showCriteriaValue = false;
	                            scope.comparisonOperatorInAndNotInFlag = true;
	                        }
	                        else {
	                            selectedFilterProperty.showCriteriaValue = true;
	                        }
	                    }
	                };
	                scope.$watch('filterItem.value', function (criteriaValue) {
	                    //remove percents for like values
	                    if (angular.isDefined(scope.filterItem) && angular.isDefined(scope.filterItem.value)) {
	                        scope.filterItem.value = scope.filterItem.value.replace('%', '');
	                    }
	                });
	                scope.$watch('selectedFilterProperty', function (selectedFilterProperty) {
	                    if (angular.isDefined(selectedFilterProperty)) {
	                        angular.forEach(scope.conditionOptions, function (conditionOption) {
	                            if (conditionOption.display == scope.filterItem.conditionDisplay) {
	                                scope.selectedFilterProperty.selectedCriteriaType = conditionOption;
	                                scope.selectedFilterProperty.criteriaValue = scope.filterItem.value;
	                                if (angular.isDefined(scope.selectedConditionChanged)) {
	                                    scope.selectedConditionChanged(scope.selectedFilterProperty);
	                                }
	                            }
	                        });
	                    }
	                });
	            }
	        };
	    }
	    SWCriteriaString.Factory = function () {
	        var directive = function ($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder) {
	            return new SWCriteriaString($log, $hibachi, $filter, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            '$filter',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWCriteriaString;
	})();
	exports.SWCriteriaString = SWCriteriaString;


/***/ },
/* 90 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWEditFilterItem = (function () {
	    function SWEditFilterItem($log, $filter, $timeout, $hibachi, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder, rbkeyService, observerService) {
	        return {
	            require: '^swFilterGroups',
	            restrict: 'E',
	            scope: {
	                collectionConfig: "=",
	                filterItem: "=",
	                filterPropertiesList: "=",
	                saveCollection: "&",
	                removeFilterItem: "&",
	                filterItemIndex: "=",
	                comparisonType: "=",
	                simple: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "editfilteritem.html",
	            link: function (scope, element, attrs, filterGroupsController) {
	                function daysBetween(first, second) {
	                    // Copy date parts of the timestamps, discarding the time parts.
	                    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
	                    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());
	                    // Do the math.
	                    var millisecondsPerDay = 1000 * 60 * 60 * 24;
	                    var millisBetween = two.getTime() - one.getTime();
	                    var days = millisBetween / millisecondsPerDay;
	                    // Round down.
	                    return Math.floor(days);
	                }
	                if (angular.isUndefined(scope.filterItem.breadCrumbs)) {
	                    scope.filterItem.breadCrumbs = [];
	                    if (scope.filterItem.propertyIdentifier === "") {
	                        scope.filterItem.breadCrumbs = [
	                            {
	                                rbKey: rbkeyService.getRBKey('entity.' + scope.collectionConfig.baseEntityAlias.replace('_', '')),
	                                entityAlias: scope.collectionConfig.baseEntityAlias,
	                                cfc: scope.collectionConfig.baseEntityAlias,
	                                propertyIdentifier: scope.collectionConfig.baseEntityAlias
	                            }
	                        ];
	                    }
	                    else {
	                        var entityAliasArrayFromString = scope.filterItem.propertyIdentifier.split('.');
	                        entityAliasArrayFromString.pop();
	                        for (var i in entityAliasArrayFromString) {
	                            var breadCrumb = {
	                                rbKey: rbkeyService.getRBKey('entity.' + scope.collectionConfig.baseEntityAlias.replace('_', '')),
	                                entityAlias: entityAliasArrayFromString[i],
	                                cfc: entityAliasArrayFromString[i],
	                                propertyIdentifier: entityAliasArrayFromString[i]
	                            };
	                            scope.filterItem.breadCrumbs.push(breadCrumb);
	                        }
	                    }
	                }
	                else {
	                    angular.forEach(scope.filterItem.breadCrumbs, function (breadCrumb, key) {
	                        if (angular.isUndefined(scope.filterPropertiesList[breadCrumb.propertyIdentifier])) {
	                            var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(breadCrumb.cfc);
	                            filterPropertiesPromise.then(function (value) {
	                                metadataService.setPropertiesList(value, breadCrumb.propertyIdentifier);
	                                scope.filterPropertiesList[breadCrumb.propertyIdentifier] = metadataService.getPropertiesListByBaseEntityAlias(breadCrumb.propertyIdentifier);
	                                metadataService.formatPropertiesList(scope.filterPropertiesList[breadCrumb.propertyIdentifier], breadCrumb.propertyIdentifier);
	                                var entityAliasArrayFromString = scope.filterItem.propertyIdentifier.split('.');
	                                entityAliasArrayFromString.pop();
	                                entityAliasArrayFromString = entityAliasArrayFromString.join('.').trim();
	                                if (angular.isDefined(scope.filterPropertiesList[entityAliasArrayFromString])) {
	                                    for (var i in scope.filterPropertiesList[entityAliasArrayFromString].data) {
	                                        var filterProperty = scope.filterPropertiesList[entityAliasArrayFromString].data[i];
	                                        if (filterProperty.propertyIdentifier === scope.filterItem.propertyIdentifier) {
	                                            //selectItem from drop down
	                                            scope.selectedFilterProperty = filterProperty;
	                                            //decorate with value and comparison Operator so we can use it in the Condition section
	                                            scope.selectedFilterProperty.value = scope.filterItem.value;
	                                            scope.selectedFilterProperty.comparisonOperator = scope.filterItem.comparisonOperator;
	                                        }
	                                    }
	                                }
	                            });
	                        }
	                        else {
	                            var entityAliasArrayFromString = scope.filterItem.propertyIdentifier.split('.');
	                            entityAliasArrayFromString.pop();
	                            entityAliasArrayFromString = entityAliasArrayFromString.join('.').trim();
	                            if (angular.isDefined(scope.filterPropertiesList[entityAliasArrayFromString])) {
	                                for (var i in scope.filterPropertiesList[entityAliasArrayFromString].data) {
	                                    var filterProperty = scope.filterPropertiesList[entityAliasArrayFromString].data[i];
	                                    if (filterProperty.propertyIdentifier === scope.filterItem.propertyIdentifier) {
	                                        //selectItem from drop down
	                                        scope.selectedFilterProperty = filterProperty;
	                                        //decorate with value and comparison Operator so we can use it in the Condition section
	                                        scope.selectedFilterProperty.value = scope.filterItem.value;
	                                        scope.selectedFilterProperty.comparisonOperator = scope.filterItem.comparisonOperator;
	                                    }
	                                }
	                            }
	                        }
	                    });
	                }
	                if (angular.isUndefined(scope.filterItem.$$isClosed)) {
	                    scope.filterItem.$$isClosed = true;
	                }
	                scope.filterGroupItem = filterGroupsController.getFilterGroupItem();
	                scope.togglePrepareForFilterGroup = function () {
	                    scope.filterItem.$$prepareForFilterGroup = !scope.filterItem.$$prepareForFilterGroup;
	                };
	                //public functions
	                scope.selectBreadCrumb = function (breadCrumbIndex) {
	                    //splice out array items above index
	                    var removeCount = scope.filterItem.breadCrumbs.length - 1 - breadCrumbIndex;
	                    scope.filterItem.breadCrumbs.splice(breadCrumbIndex + 1, removeCount);
	                    $log.debug('selectBreadCrumb');
	                    $log.debug(scope.selectedFilterProperty);
	                    //scope.selectedFilterPropertyChanged(scope.filterItem.breadCrumbs[scope.filterItem.breadCrumbs.length -1].filterProperty);
	                    scope.selectedFilterPropertyChanged(null);
	                };
	                scope.selectedFilterPropertyChanged = function (selectedFilterProperty) {
	                    $log.debug('selectedFilterProperty');
	                    $log.debug(selectedFilterProperty);
	                    if (angular.isDefined(scope.selectedFilterProperty) && scope.selectedFilterProperty === null) {
	                        scope.selectedFilterProperty = {};
	                    }
	                    if (angular.isDefined(scope.selectedFilterProperty) && angular.isDefined(scope.selectedFilterProperty.selectedCriteriaType)) {
	                        delete scope.selectedFilterProperty.selectedCriteriaType;
	                    }
	                    if (angular.isDefined(scope.filterItem.value)) {
	                        delete scope.filterItem.value;
	                    }
	                    scope.selectedFilterProperty.showCriteriaValue = false;
	                    scope.selectedFilterProperty = selectedFilterProperty;
	                };
	                scope.addFilterItem = function () {
	                    collectionService.newFilterItem(filterGroupsController.getFilterGroupItem(), filterGroupsController.setItemInUse);
	                };
	                scope.cancelFilterItem = function () {
	                    $log.debug('cancelFilterItem');
	                    $log.debug(scope.filterItemIndex);
	                    //scope.deselectItems(scope.filterGroupItem[filterItemIndex]);
	                    scope.filterItem.setItemInUse(false);
	                    scope.filterItem.$$isClosed = true;
	                    for (var siblingIndex in scope.filterItem.$$siblingItems) {
	                        scope.filterItem.$$siblingItems[siblingIndex].$$disabled = false;
	                    }
	                    if (scope.filterItem.$$isNew === true) {
	                        observerService.notify('filterItemAction', { action: 'remove', filterItemIndex: scope.filterItemIndex });
	                        scope.removeFilterItem({ filterItemIndex: scope.filterItemIndex });
	                    }
	                    else {
	                        observerService.notify('filterItemAction', { action: 'close', filterItemIndex: scope.filterItemIndex });
	                    }
	                };
	                scope.saveFilter = function (selectedFilterProperty, filterItem, callback) {
	                    $log.debug('saveFilter begin');
	                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType) && angular.equals({}, selectedFilterProperty.selectedCriteriaType)) {
	                        return;
	                    }
	                    if (angular.isDefined(selectedFilterProperty) && angular.isDefined(selectedFilterProperty.selectedCriteriaType)) {
	                        //populate filterItem with selectedFilterProperty values
	                        filterItem.$$isNew = false;
	                        filterItem.propertyIdentifier = selectedFilterProperty.propertyIdentifier;
	                        filterItem.displayPropertyIdentifier = selectedFilterProperty.displayPropertyIdentifier;
	                        switch (selectedFilterProperty.ormtype) {
	                            case 'boolean':
	                                filterItem.comparisonOperator = selectedFilterProperty.selectedCriteriaType.comparisonOperator;
	                                filterItem.value = selectedFilterProperty.selectedCriteriaType.value;
	                                filterItem.displayValue = filterItem.value;
	                                break;
	                            case 'string':
	                                if (angular.isDefined(selectedFilterProperty.attributeID)) {
	                                    filterItem.attributeID = selectedFilterProperty.attributeID;
	                                    filterItem.attributeSetObject = selectedFilterProperty.attributeSetObject;
	                                }
	                                filterItem.comparisonOperator = selectedFilterProperty.selectedCriteriaType.comparisonOperator;
	                                //retrieving implied value or user input | ex. implied:prop is null, user input:prop = "Name"
	                                if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                                    filterItem.value = selectedFilterProperty.selectedCriteriaType.value;
	                                }
	                                else if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.pattern)) {
	                                    filterItem.pattern = selectedFilterProperty.selectedCriteriaType.pattern;
	                                }
	                                filterItem.displayValue = filterItem.value;
	                                break;
	                            //TODO:simplify timestamp and big decimal to leverage reusable function for null, range, and value
	                            case 'timestamp':
	                                //retrieving implied value or user input | ex. implied:prop is null, user input:prop = "Name"
	                                filterItem.comparisonOperator = selectedFilterProperty.selectedCriteriaType.comparisonOperator;
	                                //is it null or a range
	                                if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                                    filterItem.value = selectedFilterProperty.selectedCriteriaType.value;
	                                    filterItem.displayValue = filterItem.value;
	                                }
	                                else {
	                                    if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.dateInfo.type) && selectedFilterProperty.selectedCriteriaType.dateInfo.type === 'calculation') {
	                                        var _daysBetween = daysBetween(new Date(selectedFilterProperty.criteriaRangeStart), new Date(selectedFilterProperty.criteriaRangeEnd));
	                                        filterItem.value = _daysBetween;
	                                        filterItem.displayValue = selectedFilterProperty.selectedCriteriaType.display;
	                                        if (angular.isDefined(selectedFilterProperty.criteriaNumberOf)) {
	                                            filterItem.criteriaNumberOf = selectedFilterProperty.criteriaNumberOf;
	                                        }
	                                    }
	                                    else {
	                                        var dateValueString = selectedFilterProperty.criteriaRangeStart + '-' + selectedFilterProperty.criteriaRangeEnd;
	                                        filterItem.value = dateValueString;
	                                        var formattedDateValueString = $filter('date')(angular.copy(selectedFilterProperty.criteriaRangeStart), 'MM/dd/yyyy @ h:mma') + '-' + $filter('date')(angular.copy(selectedFilterProperty.criteriaRangeEnd), 'MM/dd/yyyy @ h:mma');
	                                        filterItem.displayValue = formattedDateValueString;
	                                        if (angular.isDefined(selectedFilterProperty.criteriaNumberOf)) {
	                                            filterItem.criteriaNumberOf = selectedFilterProperty.criteriaNumberOf;
	                                        }
	                                    }
	                                }
	                                break;
	                            case 'big_decimal':
	                            case 'integer':
	                            case 'float':
	                                filterItem.comparisonOperator = selectedFilterProperty.selectedCriteriaType.comparisonOperator;
	                                //is null, is not null
	                                if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                                    filterItem.value = selectedFilterProperty.selectedCriteriaType.value;
	                                }
	                                else {
	                                    if (angular.isUndefined(selectedFilterProperty.selectedCriteriaType.type)) {
	                                        filterItem.value = selectedFilterProperty.criteriaValue;
	                                    }
	                                    else {
	                                        var decimalValueString = selectedFilterProperty.criteriaRangeStart + '-' + selectedFilterProperty.criteriaRangeEnd;
	                                        filterItem.value = decimalValueString;
	                                    }
	                                }
	                                filterItem.displayValue = filterItem.value;
	                                break;
	                        }
	                        switch (selectedFilterProperty.fieldtype) {
	                            case 'many-to-one':
	                                filterItem.comparisonOperator = selectedFilterProperty.selectedCriteriaType.comparisonOperator;
	                                //is null, is not null
	                                if (angular.isDefined(selectedFilterProperty.selectedCriteriaType.value)) {
	                                    filterItem.value = selectedFilterProperty.selectedCriteriaType.value;
	                                }
	                                filterItem.displayValue = filterItem.value;
	                                break;
	                            case 'one-to-many':
	                            case 'many-to-many':
	                                filterItem.collectionID = selectedFilterProperty.selectedCollection.collectionID;
	                                filterItem.displayValue = selectedFilterProperty.selectedCollection.collectionName;
	                                filterItem.criteria = selectedFilterProperty.selectedCriteriaType.comparisonOperator;
	                                break;
	                        }
	                        if (angular.isUndefined(filterItem.displayValue)) {
	                            filterItem.displayValue = filterItem.value;
	                        }
	                        if (angular.isDefined(selectedFilterProperty.ormtype)) {
	                            filterItem.ormtype = selectedFilterProperty.ormtype;
	                        }
	                        if (angular.isDefined(selectedFilterProperty.fieldtype)) {
	                            filterItem.fieldtype = selectedFilterProperty.fieldtype;
	                        }
	                        for (var siblingIndex in filterItem.$$siblingItems) {
	                            filterItem.$$siblingItems[siblingIndex].$$disabled = false;
	                        }
	                        filterItem.conditionDisplay = selectedFilterProperty.selectedCriteriaType.display;
	                        //if the add to New group checkbox has been checked then we need to transplant the filter item into a filter group
	                        if (filterItem.$$prepareForFilterGroup === true) {
	                            collectionService.transplantFilterItemIntoFilterGroup(filterGroupsController.getFilterGroupItem(), filterItem);
	                        }
	                        //persist Config and 
	                        scope.saveCollection();
	                        $log.debug(selectedFilterProperty);
	                        $log.debug(filterItem);
	                        observerService.notify('filterItemAction', { action: 'add', filterItemIndex: scope.filterItemIndex });
	                        $timeout(function () {
	                            callback();
	                        });
	                        $log.debug('saveFilter end');
	                    }
	                };
	            }
	        };
	    }
	    SWEditFilterItem.Factory = function () {
	        var directive = function ($log, $filter, $timeout, $hibachi, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder, rbkeyService, observerService) {
	            return new SWEditFilterItem($log, $filter, $timeout, $hibachi, collectionPartialsPath, collectionService, metadataService, hibachiPathBuilder, rbkeyService, observerService);
	        };
	        directive.$inject = [
	            '$log',
	            '$filter',
	            '$timeout',
	            '$hibachi',
	            'collectionPartialsPath',
	            'collectionService',
	            'metadataService',
	            'hibachiPathBuilder',
	            'rbkeyService',
	            'observerService'
	        ];
	        return directive;
	    };
	    return SWEditFilterItem;
	})();
	exports.SWEditFilterItem = SWEditFilterItem;


/***/ },
/* 91 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFilterGroups = (function () {
	    function SWFilterGroups($log, collectionPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'EA',
	            scope: {
	                collectionConfig: "=?",
	                filterGroupItem: "=?",
	                filterPropertiesList: "=?",
	                saveCollection: "&",
	                filterGroup: "=?",
	                comparisonType: "=?",
	                simple: "=",
	                readOnly: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "filtergroups.html",
	            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
	                    //if the filter group comparisontype is not specified, then assume we are doing filters
	                    if (!angular.isDefined($scope.comparisonType)) {
	                        $scope.comparisonType = 'filter';
	                    }
	                    $scope.itemInUse = false;
	                    $log.debug('collectionConfig');
	                    $log.debug($scope.collectionConfig);
	                    this.getFilterGroup = function () {
	                        return $scope.filterGroup;
	                    };
	                    this.getFilterGroupItem = function () {
	                        return $scope.filterGroupItem;
	                    };
	                    this.setItemInUse = function (booleanValue) {
	                        $scope.itemInUse = booleanValue;
	                    };
	                    this.getItemInUse = function () {
	                        return $scope.itemInUse;
	                    };
	                    this.saveCollection = function () {
	                        $scope.saveCollection();
	                    };
	                    $scope.deselectItems = function (filterItem) {
	                        for (var i in filterItem.$$siblingItems) {
	                            filterItem.$$siblingItems[i].$$disabled = false;
	                        }
	                    };
	                    this.removeFilterItem = function (filterItemIndex) {
	                        if (angular.isDefined(filterItemIndex)) {
	                            $scope.deselectItems($scope.filterGroupItem[filterItemIndex]);
	                            $scope.filterGroupItem[filterItemIndex].setItemInUse(false);
	                            //remove item
	                            $log.debug('removeFilterItem');
	                            $log.debug(filterItemIndex);
	                            $scope.filterGroupItem.splice(filterItemIndex, 1);
	                            //make sure first item has no logical operator if it exists
	                            if ($scope.filterGroupItem.length) {
	                                delete $scope.filterGroupItem[0].logicalOperator;
	                            }
	                            $log.debug('removeFilterItem');
	                            $log.debug(filterItemIndex);
	                            $scope.saveCollection();
	                        }
	                    };
	                    this.removeFilterGroupItem = function (filterGroupItemIndex) {
	                        //remove Item
	                        $scope.deselectItems($scope.filterGroupItem[filterGroupItemIndex]);
	                        $scope.filterGroupItem[filterGroupItemIndex].setItemInUse(false);
	                        $scope.filterGroupItem.splice(filterGroupItemIndex, 1);
	                        //make sure first item has no logical operator if it exists
	                        if ($scope.filterGroupItem.length) {
	                            delete $scope.filterGroupItem[0].logicalOperator;
	                        }
	                        $log.debug('removeFilterGroupItem');
	                        $log.debug(filterGroupItemIndex);
	                        $scope.saveCollection();
	                    };
	                }]
	        };
	    }
	    SWFilterGroups.Factory = function () {
	        var directive = function ($log, collectionPartialsPath, hibachiPathBuilder) {
	            return new SWFilterGroups($log, collectionPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            'collectionPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFilterGroups;
	})();
	exports.SWFilterGroups = SWFilterGroups;


/***/ },
/* 92 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFilterItem = (function () {
	    function SWFilterItem($log, collectionService, collectionPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'A',
	            require: '^swFilterGroups',
	            scope: {
	                collectionConfig: "=",
	                filterItem: "=",
	                siblingItems: "=",
	                filterPropertiesList: "=",
	                filterItemIndex: "=",
	                saveCollection: "&",
	                comparisonType: "=",
	                simple: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "filteritem.html",
	            link: function (scope, element, attrs, filterGroupsController) {
	                scope.baseEntityAlias = scope.collectionConfig.baseEntityAlias;
	                if (angular.isUndefined(scope.filterItem.$$isClosed)) {
	                    scope.filterItem.$$isClosed = true;
	                }
	                if (angular.isUndefined(scope.filterItem.$$disabled)) {
	                    scope.filterItem.$$disabled = false;
	                }
	                if (angular.isUndefined(scope.filterItem.siblingItems)) {
	                    scope.filterItem.$$siblingItems = scope.siblingItems;
	                }
	                scope.filterItem.setItemInUse = filterGroupsController.setItemInUse;
	                scope.selectFilterItem = function (filterItem) {
	                    collectionService.selectFilterItem(filterItem);
	                };
	                scope.removeFilterItem = function () {
	                    filterGroupsController.removeFilterItem(scope.filterItemIndex, filterGroupsController.getFilterGroupItem());
	                };
	                scope.filterGroupItem = filterGroupsController.getFilterGroupItem();
	                scope.logicalOperatorChanged = function (logicalOperatorValue) {
	                    $log.debug('logicalOperatorChanged');
	                    $log.debug(logicalOperatorValue);
	                    scope.filterItem.logicalOperator = logicalOperatorValue;
	                    filterGroupsController.saveCollection();
	                };
	            }
	        };
	    }
	    SWFilterItem.Factory = function () {
	        var directive = function ($log, collectionService, collectionPartialsPath, hibachiPathBuilder) {
	            return new SWFilterItem($log, collectionService, collectionPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            'collectionService',
	            'collectionPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFilterItem;
	})();
	exports.SWFilterItem = SWFilterItem;


/***/ },
/* 93 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFilterGroupItem = (function () {
	    function SWFilterGroupItem($http, $compile, $templateCache, $log, collectionService, collectionPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'A',
	            require: "^swFilterGroups",
	            scope: {
	                collectionConfig: "=",
	                filterGroupItem: "=",
	                siblingItems: "=",
	                filterPropertiesList: "=",
	                filterGroupItemIndex: "=",
	                saveCollection: "&",
	                comparisonType: "="
	            },
	            link: function (scope, element, attrs, filterGroupsController) {
	                var Partial = hibachiPathBuilder.buildPartialsPath(collectionPartialsPath) + "filtergroupitem.html";
	                var templateLoader = $http.get(Partial, { cache: $templateCache });
	                var promise = templateLoader.success(function (html) {
	                    element.html(html);
	                }).then(function (response) {
	                    element.replaceWith($compile(element.html())(scope));
	                });
	                //for(item in filterGroupItem){}
	                scope.filterGroupItem.setItemInUse = filterGroupsController.setItemInUse;
	                scope.filterGroupItem.$$index = scope.filterGroupItemIndex;
	                scope.removeFilterGroupItem = function () {
	                    filterGroupsController.removeFilterGroupItem(scope.filterGroupItemIndex);
	                };
	                scope.filterGroupItem.removeFilterGroupItem = scope.removeFilterGroupItem;
	                scope.filterGroupItem.$$disabled = false;
	                if (angular.isUndefined(scope.filterGroupItem.$$isClosed)) {
	                    scope.filterGroupItem.$$isClosed = true;
	                }
	                scope.filterGroupItem.$$siblingItems = scope.siblingItems;
	                scope.selectFilterGroupItem = function (filterGroupItem) {
	                    collectionService.selectFilterGroupItem(filterGroupItem);
	                };
	                scope.logicalOperatorChanged = function (logicalOperatorValue) {
	                    $log.debug('logicalOperatorChanged');
	                    $log.debug(logicalOperatorValue);
	                    scope.filterGroupItem.logicalOperator = logicalOperatorValue;
	                    filterGroupsController.saveCollection();
	                };
	            }
	        };
	    }
	    SWFilterGroupItem.Factory = function () {
	        var directive = function ($http, $compile, $templateCache, $log, collectionService, collectionPartialsPath, hibachiPathBuilder) {
	            return new SWFilterGroupItem($http, $compile, $templateCache, $log, collectionService, collectionPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$compile',
	            '$templateCache',
	            '$log',
	            'collectionService',
	            'collectionPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFilterGroupItem;
	})();
	exports.SWFilterGroupItem = SWFilterGroupItem;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//services
	var dialogservice_1 = __webpack_require__(95);
	//controllers
	var pagedialog_1 = __webpack_require__(96);
	var dialogmodule = angular.module('hibachi.dialog', []).config(function () {
	})
	    .service('dialogService', dialogservice_1.DialogService)
	    .controller('pageDialog', pagedialog_1.PageDialogController)
	    .constant('dialogPartials', 'dialog/components/');
	exports.dialogmodule = dialogmodule;


/***/ },
/* 95 */
/***/ function(module, exports) {

	var DialogService = (function () {
	    function DialogService(hibachiPathBuilder) {
	        var _this = this;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.get = function () {
	            return _this._pageDialogs || [];
	        };
	        this.addPageDialog = function (name, params) {
	            var newDialog = {
	                'path': name + '.html',
	                'params': params
	            };
	            _this._pageDialogs.push(newDialog);
	        };
	        this.removePageDialog = function (index) {
	            _this._pageDialogs.splice(index, 1);
	        };
	        this.getPageDialogs = function () {
	            return _this._pageDialogs;
	        };
	        this.removeCurrentDialog = function () {
	            _this._pageDialogs.splice(_this._pageDialogs.length - 1, 1);
	        };
	        this.getCurrentDialog = function () {
	            return _this._pageDialogs[_this._pageDialogs.length - 1];
	        };
	        this._pageDialogs = [];
	        this.hibachiPathBuilder = hibachiPathBuilder;
	    }
	    DialogService.$inject = [
	        'hibachiPathBuilder'
	    ];
	    return DialogService;
	})();
	exports.DialogService = DialogService;


/***/ },
/* 96 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var PageDialogController = (function () {
	    //@ngInject
	    function PageDialogController($scope, $location, $log, $anchorScroll, $hibachi, dialogService) {
	        $scope.$id = 'pageDialogController';
	        //get url param to retrieve collection listing
	        $scope.pageDialogs = dialogService.getPageDialogs();
	        $scope.scrollToTopOfDialog = function () {
	            $location.hash('/#topOfPageDialog');
	            $anchorScroll();
	        };
	        $scope.pageDialogStyle = { "z-index": 3000 };
	    }
	    return PageDialogController;
	})();
	exports.PageDialogController = PageDialogController;


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//services
	// import {AccountService} from "./services/accountservice";
	// import {CartService} from "./services/cartservice";
	// import {UtilityService} from "./services/utilityservice";
	// import {SelectionService} from "./services/selectionservice";
	// import {ObserverService} from "./services/observerservice";
	// import {FormService} from "./services/formservice";
	// import {MetaDataService} from "./services/metadataservice";
	//controllers
	var otherwisecontroller_1 = __webpack_require__(98);
	var routercontroller_1 = __webpack_require__(99);
	//directives
	var swdetailtabs_1 = __webpack_require__(100);
	var swdetail_1 = __webpack_require__(101);
	var swlist_1 = __webpack_require__(102);
	var core_module_1 = __webpack_require__(2);
	var entitymodule = angular.module('hibachi.entity', ['ngRoute', core_module_1.coremodule.name])
	    .config(['$routeProvider', '$injector', '$locationProvider', 'appConfig',
	    function ($routeProvider, $injector, $locationProvider, appConfig) {
	        //detect if we are in hashbang mode
	        var vars = {};
	        var parts = window.location.href.replace(/[?&]+([^=&]+)#([^/]*)/gi, function (m, key, value) {
	            vars[key] = value;
	        });
	        if (vars.ng) {
	            $locationProvider.html5Mode(false).hashPrefix('!');
	        }
	        $routeProvider.when('/entity/:entityName/', {
	            template: function (params) {
	                var entityDirectiveExists = $injector.has('sw' + params.entityName + 'ListDirective');
	                if (entityDirectiveExists) {
	                    return '<sw-' + params.entityName.toLowerCase() + '-list>';
	                }
	                else {
	                    return '<sw-list></sw-list>';
	                }
	            },
	            controller: 'routerController'
	        }).when('/entity/:entityName/:entityID', {
	            template: function (params) {
	                var entityDirectiveExists = $injector.has('sw' + params.entityName + 'DetailDirective');
	                if (entityDirectiveExists) {
	                    return '<sw-' + params.entityName.toLowerCase() + '-detail>';
	                }
	                else {
	                    return '<sw-detail></sw-detail>';
	                }
	            },
	            controller: 'routerController',
	        });
	        //        .otherwise({
	        //         //controller:'otherwiseController'
	        //         templateUrl: appConfig.baseURL + '/admin/client/js/partials/otherwise.html',
	        //     });
	    }])
	    .constant('coreEntityPartialsPath', 'entity/components/')
	    .controller('otherwiseController', otherwisecontroller_1.OtherWiseController)
	    .controller('routerController', routercontroller_1.RouterController)
	    .directive('swDetail', swdetail_1.SWDetail.Factory())
	    .directive('swDetailTabs', swdetailtabs_1.SWDetailTabs.Factory())
	    .directive('swList', swlist_1.SWList.Factory());
	exports.entitymodule = entitymodule;


/***/ },
/* 98 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var OtherWiseController = (function () {
	    //@ngInject
	    function OtherWiseController($scope) {
	        $scope.$id = "otherwiseController";
	    }
	    return OtherWiseController;
	})();
	exports.OtherWiseController = OtherWiseController;


/***/ },
/* 99 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var RouterController = (function () {
	    //@ngInject
	    function RouterController($scope, $routeParams, $location, $log, partialsPath, baseURL) {
	        $scope.$id = "routerController";
	        $scope.partialRoute = '';
	        $log.debug($routeParams);
	        $log.debug($location);
	        var path = $location.path();
	        $scope.controllerType = path.split('/')[1];
	        var type;
	        if ($scope.controllerType === 'entity') {
	            $scope.entityName = $routeParams.entityName;
	            if (angular.isDefined($routeParams.entityID)) {
	                $scope.entityID = $routeParams.entityID || '';
	            }
	        }
	    }
	    return RouterController;
	})();
	exports.RouterController = RouterController;


/***/ },
/* 100 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWDetailTabs = (function () {
	    function SWDetailTabs($location, $log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath) + 'detailtabs.html',
	            link: function (scope, element, attr) {
	            }
	        };
	    }
	    SWDetailTabs.Factory = function () {
	        var directive = function ($location, $log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder) {
	            return new SWDetailTabs($location, $log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$location',
	            '$log',
	            '$hibachi',
	            'coreEntityPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWDetailTabs;
	})();
	exports.SWDetailTabs = SWDetailTabs;


/***/ },
/* 101 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWDetail = (function () {
	    function SWDetail($location, $log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath) + '/detail.html',
	            link: function (scope, element, attr) {
	                scope.$id = "slatwallDetailController";
	                $log.debug('slatwallDetailController');
	                /*Sets the view dirty on save*/
	                scope.setDirty = function (entity) {
	                    angular.forEach(entity.forms, function (form) {
	                        form.$setSubmitted();
	                    });
	                };
	                var setupMetaData = function () {
	                    scope[scope.entityName.toLowerCase()] = scope.entity;
	                    scope.entity.metaData.$$getDetailTabs().then(function (value) {
	                        scope.detailTabs = value.data;
	                        $log.debug('detailtabs');
	                        $log.debug(scope.detailTabs);
	                    });
	                };
	                var propertyCasedEntityName = scope.entityName.charAt(0).toUpperCase() + scope.entityName.slice(1);
	                scope.tabPartialPath = hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath);
	                scope.getEntity = function () {
	                    if (scope.entityID === 'create') {
	                        scope.createMode = true;
	                        scope.entity = $hibachi['new' + propertyCasedEntityName]();
	                        console.log('Entity', scope.entity);
	                        setupMetaData();
	                    }
	                    else {
	                        scope.createMode = false;
	                        var entityPromise = $hibachi['get' + propertyCasedEntityName]({ id: scope.entityID });
	                        entityPromise.promise.then(function () {
	                            scope.entity = entityPromise.value;
	                            console.log('Entity', scope.entity);
	                            setupMetaData();
	                        });
	                    }
	                };
	                scope.getEntity();
	                scope.deleteEntity = function () {
	                    var deletePromise = scope.entity.$$delete();
	                    deletePromise.then(function () {
	                        $location.path('/entity/' + propertyCasedEntityName + '/');
	                    });
	                };
	                scope.allTabsOpen = false;
	            }
	        };
	    }
	    SWDetail.Factory = function () {
	        var directive = function ($location, $log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder) {
	            return new SWDetail($location, $log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$location',
	            '$log',
	            '$hibachi',
	            'coreEntityPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWDetail;
	})();
	exports.SWDetail = SWDetail;


/***/ },
/* 102 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWList = (function () {
	    function SWList($log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath) + '/list.html',
	            link: function (scope, element, attr) {
	                $log.debug('slatwallList init');
	                //scope.getCollection = function(){
	                //
	                //	var pageShow = 50;
	                //	if(scope.pageShow !== 'Auto'){
	                //		pageShow = scope.pageShow;
	                //	}
	                //	scope.entityName = scope.entityName.charAt(0).toUpperCase()+scope.entityName.slice(1);
	                //	var collectionListingPromise = $hibachi.getEntity(scope.entityName, {currentPage:scope.currentPage, pageShow:pageShow, keywords:scope.keywords});
	                //	collectionListingPromise.then(function(value){
	                //		scope.collection = value;
	                //		scope.collectionConfig = angular.fromJson(scope.collection.collectionConfig);
	                //	});
	                //};
	                //scope.getCollection();
	            }
	        };
	    }
	    SWList.Factory = function () {
	        var directive = function ($log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder) {
	            return new SWList($log, $hibachi, coreEntityPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            'coreEntityPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWList;
	})();
	exports.SWList = SWList;


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	/// <reference path="../../typings/hibachiTypescript.d.ts" />
	//services
	var paginationservice_1 = __webpack_require__(104);
	var swpaginationbar_1 = __webpack_require__(105);
	var core_module_1 = __webpack_require__(2);
	var paginationmodule = angular.module('hibachi.pagination', [core_module_1.coremodule.name])
	    .run([function () {
	    }])
	    .service('paginationService', paginationservice_1.PaginationService)
	    .directive('swPaginationBar', swpaginationbar_1.SWPaginationBar.Factory())
	    .constant('partialsPath', 'pagination/components/');
	exports.paginationmodule = paginationmodule;


/***/ },
/* 104 */
/***/ function(module, exports) {

	/// <reference path="../../../typings/tsd.d.ts" />
	/// <reference path="../../../typings/hibachiTypescript.d.ts" />
	/*collection service is used to maintain the state of the ui*/
	var Pagination = (function () {
	    //@ngInject
	    function Pagination(observerService, uuid) {
	        var _this = this;
	        this.observerService = observerService;
	        this.uuid = uuid;
	        this.pageShow = 10;
	        this.currentPage = 1;
	        this.pageStart = 0;
	        this.pageEnd = 0;
	        this.recordsCount = 0;
	        this.totalPages = 0;
	        this.pageShowOptions = [
	            { display: 10, value: 10 },
	            { display: 20, value: 20 },
	            { display: 50, value: 50 },
	            { display: 250, value: 250 },
	            { display: "Auto", value: "Auto" }
	        ];
	        this.autoScrollPage = 1;
	        this.autoScrollDisabled = false;
	        this.getSelectedPageShowOption = function () {
	            return _this.selectedPageShowOption;
	        };
	        this.pageShowOptionChanged = function (pageShowOption) {
	            _this.setPageShow(pageShowOption.value);
	            _this.setCurrentPage(1);
	        };
	        this.getTotalPages = function () {
	            return _this.totalPages;
	        };
	        this.setTotalPages = function (totalPages) {
	            _this.totalPages = totalPages;
	        };
	        this.getPageStart = function () {
	            return _this.pageStart;
	        };
	        this.setPageStart = function (pageStart) {
	            _this.pageStart = pageStart;
	        };
	        this.getPageEnd = function () {
	            return _this.pageEnd;
	        };
	        this.setPageEnd = function (pageEnd) {
	            _this.pageEnd = pageEnd;
	        };
	        this.getRecordsCount = function () {
	            return _this.recordsCount;
	        };
	        this.setRecordsCount = function (recordsCount) {
	            _this.recordsCount = recordsCount;
	        };
	        this.getPageShowOptions = function () {
	            return _this.pageShowOptions;
	        };
	        this.setPageShowOptions = function (pageShowOptions) {
	            _this.pageShowOptions = pageShowOptions;
	        };
	        this.getPageShow = function () {
	            return _this.pageShow;
	        };
	        this.setPageShow = function (pageShow) {
	            _this.pageShow = pageShow;
	        };
	        this.getCurrentPage = function () {
	            return _this.currentPage;
	        };
	        this.setCurrentPage = function (currentPage) {
	            _this.currentPage = currentPage;
	            _this.getCollection();
	            _this.observerService.notify('swPaginationAction', { action: 'pageChange', currentPage: currentPage });
	        };
	        this.previousPage = function () {
	            if (_this.getCurrentPage() == 1)
	                return;
	            _this.setCurrentPage(_this.getCurrentPage() - 1);
	        };
	        this.nextPage = function () {
	            if (_this.getCurrentPage() < _this.getTotalPages()) {
	                _this.setCurrentPage(_this.getCurrentPage() + 1);
	            }
	        };
	        this.hasPrevious = function () {
	            return (_this.getPageStart() <= 1);
	        };
	        this.hasNext = function () {
	            return (_this.getPageEnd() === _this.getRecordsCount());
	        };
	        this.showPreviousJump = function () {
	            return (angular.isDefined(_this.getCurrentPage()) && _this.getCurrentPage() > 3);
	        };
	        this.showNextJump = function () {
	            return !!(_this.getCurrentPage() < _this.getTotalPages() - 3 && _this.getTotalPages() > 6);
	        };
	        this.previousJump = function () {
	            _this.setCurrentPage(_this.currentPage - 3);
	        };
	        this.nextJump = function () {
	            _this.setCurrentPage(_this.getCurrentPage() + 3);
	        };
	        this.showPageNumber = function (pageNumber) {
	            if (_this.getCurrentPage() >= _this.getTotalPages() - 3) {
	                if (pageNumber > _this.getTotalPages() - 6) {
	                    return true;
	                }
	            }
	            if (_this.getCurrentPage() <= 3) {
	                if (pageNumber < 6) {
	                    return true;
	                }
	            }
	            else {
	                var bottomRange = _this.getCurrentPage() - 2;
	                var topRange = _this.getCurrentPage() + 2;
	                if (pageNumber > bottomRange && pageNumber < topRange) {
	                    return true;
	                }
	            }
	            return false;
	        };
	        this.setPageRecordsInfo = function (collection) {
	            _this.setRecordsCount(collection.recordsCount);
	            if (_this.getRecordsCount() === 0) {
	                _this.setPageStart(0);
	            }
	            else {
	                _this.setPageStart(collection.pageRecordsStart);
	            }
	            _this.setPageEnd(collection.pageRecordsEnd);
	            _this.setTotalPages(collection.totalPages);
	            _this.totalPagesArray = [];
	            if (angular.isUndefined(_this.getCurrentPage()) || _this.getCurrentPage() < 5) {
	                var start = 1;
	                var end = (_this.getTotalPages() <= 10) ? _this.getTotalPages() + 1 : 10;
	            }
	            else {
	                var start = (!_this.showNextJump()) ? _this.getTotalPages() - 4 : _this.getCurrentPage() - 3;
	                var end = (_this.showNextJump()) ? _this.getCurrentPage() + 5 : _this.getTotalPages() + 1;
	            }
	            for (var i = start; i < end; i++) {
	                _this.totalPagesArray.push(i);
	            }
	        };
	        this.uuid = uuid;
	        this.selectedPageShowOption = this.pageShowOptions[0];
	    }
	    return Pagination;
	})();
	exports.Pagination = Pagination;
	var PaginationService = (function () {
	    //@ngInject
	    function PaginationService(utilityService, observerService) {
	        var _this = this;
	        this.utilityService = utilityService;
	        this.observerService = observerService;
	        this.paginations = {};
	        this.createPagination = function () {
	            var uuid = _this.utilityService.createID(10);
	            _this.paginations[uuid] = new Pagination(_this.observerService, uuid);
	            return _this.paginations[uuid];
	        };
	        this.getPagination = function (uuid) {
	            if (!uuid)
	                return;
	            return _this.paginations[uuid];
	        };
	    }
	    return PaginationService;
	})();
	exports.PaginationService = PaginationService;


/***/ },
/* 105 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	//import pagination = require('../services/paginationservice');
	//var PaginationService = pagination.PaginationService;
	//'use strict';
	var SWPaginationBarController = (function () {
	    //@ngInject
	    function SWPaginationBarController(paginationService) {
	        this.paginationService = paginationService;
	        if (angular.isUndefined(this.paginator)) {
	            this.paginator = paginationService.createPagination();
	        }
	    }
	    return SWPaginationBarController;
	})();
	exports.SWPaginationBarController = SWPaginationBarController;
	var SWPaginationBar = (function () {
	    //@ngInject
	    function SWPaginationBar(hibachiPathBuilder, partialsPath) {
	        this.restrict = 'E';
	        this.scope = {};
	        this.bindToController = {
	            paginator: "=?"
	        };
	        this.controller = SWPaginationBarController;
	        this.controllerAs = "swPaginationBar";
	        this.link = function (scope, element, attrs) { };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(partialsPath) + 'paginationbar.html';
	    }
	    SWPaginationBar.Factory = function () {
	        var directive = function (hibachiPathBuilder, partialsPath) { return new SWPaginationBar(hibachiPathBuilder, partialsPath); };
	        directive.$inject = ['hibachiPathBuilder', 'partialsPath'];
	        return directive;
	    };
	    return SWPaginationBar;
	})();
	exports.SWPaginationBar = SWPaginationBar;


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//services
	// import {AccountService} from "./services/accountservice";
	// import {CartService} from "./services/cartservice";
	// import {UtilityService} from "./services/utilityservice";
	// import {SelectionService} from "./services/selectionservice";
	// import {ObserverService} from "./services/observerservice";
	// import {FormService} from "./services/formservice";
	// import {MetaDataService} from "./services/metadataservice";
	//directives
	//  components
	//form
	var swinput_1 = __webpack_require__(107);
	var swfformfield_1 = __webpack_require__(108);
	var swform_1 = __webpack_require__(109);
	var swformfield_1 = __webpack_require__(110);
	var swformfieldjson_1 = __webpack_require__(111);
	var swformfieldnumber_1 = __webpack_require__(112);
	var swformfieldpassword_1 = __webpack_require__(113);
	var swformfieldradio_1 = __webpack_require__(114);
	var swformfieldsearchselect_1 = __webpack_require__(115);
	var swformfieldselect_1 = __webpack_require__(116);
	var swformfieldtext_1 = __webpack_require__(117);
	var swformfielddate_1 = __webpack_require__(118);
	var swformregistrar_1 = __webpack_require__(119);
	var swfpropertydisplay_1 = __webpack_require__(120);
	var swpropertydisplay_1 = __webpack_require__(121);
	var formmodule = angular.module('hibachi.form', ['angularjs-datetime-picker']).config(function () {
	})
	    .constant('coreFormPartialsPath', 'form/components/')
	    .directive('swInput', swinput_1.SWInput.Factory())
	    .directive('swfFormField', swfformfield_1.SWFFormField.Factory())
	    .directive('swForm', swform_1.SWForm.Factory())
	    .directive('swFormField', swformfield_1.SWFormField.Factory())
	    .directive('swFormFieldJson', swformfieldjson_1.SWFormFieldJson.Factory())
	    .directive('swFormFieldNumber', swformfieldnumber_1.SWFormFieldNumber.Factory())
	    .directive('swFormFieldPassword', swformfieldpassword_1.SWFormFieldPassword.Factory())
	    .directive('swFormFieldRadio', swformfieldradio_1.SWFormFieldRadio.Factory())
	    .directive('swFormFieldSearchSelect', swformfieldsearchselect_1.SWFormFieldSearchSelect.Factory())
	    .directive('swFormFieldSelect', swformfieldselect_1.SWFormFieldSelect.Factory())
	    .directive('swFormFieldText', swformfieldtext_1.SWFormFieldText.Factory())
	    .directive('swFormFieldDate', swformfielddate_1.SWFormFieldDate.Factory())
	    .directive('swFormRegistrar', swformregistrar_1.SWFormRegistrar.Factory())
	    .directive('swfPropertyDisplay', swfpropertydisplay_1.SWFPropertyDisplay.Factory())
	    .directive('swPropertyDisplay', swpropertydisplay_1.SWPropertyDisplay.Factory());
	exports.formmodule = formmodule;


/***/ },
/* 107 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * This validate directive will look at the current element, figure out the context (save, edit, delete) and
	 * validate based on that context as defined in the validation properties object.
	 */
	var SWInput = (function () {
	    function SWInput($log, $compile, $hibachi, utilityService, rbkeyService) {
	        var getValidationDirectives = function (propertyDisplay) {
	            var spaceDelimitedList = '';
	            var name = propertyDisplay.property;
	            var form = propertyDisplay.form.$$swFormInfo;
	            $log.debug("Name is:" + name + " and form is: " + form);
	            if (angular.isUndefined(propertyDisplay.object.validations)
	                || angular.isUndefined(propertyDisplay.object.validations.properties)
	                || angular.isUndefined(propertyDisplay.object.validations.properties[propertyDisplay.property])) {
	                return '';
	            }
	            var validations = propertyDisplay.object.validations.properties[propertyDisplay.property];
	            $log.debug("Validations: ", validations);
	            $log.debug(propertyDisplay.form.$$swFormInfo);
	            var validationsForContext = [];
	            //get the form context and the form name.
	            var formContext = propertyDisplay.form.$$swFormInfo.context;
	            var formName = propertyDisplay.form.$$swFormInfo.name;
	            $log.debug("Form context is: ");
	            $log.debug(formContext);
	            $log.debug("Form Name: ");
	            $log.debug(formName);
	            //get the validations for the current element.
	            var propertyValidations = propertyDisplay.object.validations.properties[name];
	            /*
	            * Investigating why number inputs are not working.
	            * */
	            //check if the contexts match.
	            if (angular.isObject(propertyValidations)) {
	                //if this is a procesobject validation then the context is implied
	                if (angular.isUndefined(propertyValidations[0].contexts) && propertyDisplay.object.metaData.isProcessObject) {
	                    propertyValidations[0].contexts = propertyDisplay.object.metaData.className.split('_')[1];
	                }
	                if (propertyValidations[0].contexts === formContext) {
	                    $log.debug("Matched");
	                    for (var prop in propertyValidations[0]) {
	                        if (prop != "contexts" && prop !== "conditions") {
	                            spaceDelimitedList += (" swvalidation" + prop.toLowerCase() + "='" + propertyValidations[0][prop] + "'");
	                        }
	                    }
	                }
	                $log.debug(spaceDelimitedList);
	            }
	            //loop over validations that are required and create the space delimited list
	            $log.debug(validations);
	            //get all validations related to the form context;
	            $log.debug(form);
	            $log.debug(propertyDisplay);
	            angular.forEach(validations, function (validation, key) {
	                if (utilityService.listFind(validation.contexts.toLowerCase(), form.context.toLowerCase()) !== -1) {
	                    $log.debug("Validations for context");
	                    $log.debug(validation);
	                    validationsForContext.push(validation);
	                }
	            });
	            //now that we have all related validations for the specific form context that we are working with collection the directives we need
	            //getValidationDirectiveByType();
	            return spaceDelimitedList;
	        };
	        var getTemplate = function (propertyDisplay) {
	            var template = '';
	            var validations = '';
	            var currency = '';
	            if (!propertyDisplay.noValidate) {
	                validations = getValidationDirectives(propertyDisplay);
	            }
	            if (propertyDisplay.object.metaData.$$getPropertyFormatType(propertyDisplay.property) == "currency") {
	                currency = 'sw-currency-formatter ';
	                if (angular.isDefined(propertyDisplay.object.data.currencyCode)) {
	                    currency = currency + 'data-currency-code="' + propertyDisplay.object.data.currencyCode + '" ';
	                }
	            }
	            var appConfig = $hibachi.getConfig();
	            console.log('propertyDisplay', propertyDisplay);
	            var placeholder = '';
	            if (angular.isDefined(propertyDisplay.object.metaData[propertyDisplay.property].hb_nullrbkey)) {
	                placeholder = rbkeyService.getRBKey(propertyDisplay.object.metaData[propertyDisplay.property].hb_nullrbkey);
	            }
	            if (propertyDisplay.fieldType === 'text') {
	                template = '<input type="text" class="form-control" ' +
	                    'ng-model="propertyDisplay.object.data[propertyDisplay.property]" ' +
	                    'ng-disabled="!propertyDisplay.editable" ' +
	                    'ng-show="propertyDisplay.editing" ' +
	                    'name="' + propertyDisplay.property + '" ' +
	                    'placeholder="' + placeholder + '" ' +
	                    validations + currency +
	                    'id="swinput' + utilityService.createID(26) + '"' +
	                    ' />';
	            }
	            else if (propertyDisplay.fieldType === 'password') {
	                template = '<input type="password" class="form-control" ' +
	                    'ng-model="propertyDisplay.object.data[propertyDisplay.property]" ' +
	                    'ng-disabled="!propertyDisplay.editable" ' +
	                    'ng-show="propertyDisplay.editing" ' +
	                    'name="' + propertyDisplay.property + '" ' +
	                    'placeholder="' + placeholder + '" ' +
	                    validations +
	                    'id="swinput' + utilityService.createID(26) + '"' +
	                    ' />';
	            }
	            else if (propertyDisplay.fieldType === 'number') {
	                template = '<input type="number" class="form-control" ' +
	                    'ng-model="propertyDisplay.object.data[propertyDisplay.property]" ' +
	                    'ng-disabled="!propertyDisplay.editable" ' +
	                    'ng-show="propertyDisplay.editing" ' +
	                    'name="' + propertyDisplay.property + '" ' +
	                    'placeholder="' + placeholder + '" ' +
	                    validations +
	                    'id="swinput' + utilityService.createID(26) + '"' +
	                    ' />';
	            }
	            else if (propertyDisplay.fieldType === 'time') {
	                template = '<input type="text" class="form-control" ' +
	                    'datetime-picker data-time-only="true" date-format="' + appConfig.timeFormat.replace('tt', 'a') + '" ' +
	                    'ng-model="propertyDisplay.object.data[propertyDisplay.property]" ' +
	                    'ng-disabled="!propertyDisplay.editable" ' +
	                    'ng-show="propertyDisplay.editing" ' +
	                    'name="' + propertyDisplay.property + '" ' +
	                    'placeholder="' + placeholder + '" ' +
	                    validations +
	                    'id="swinput' + utilityService.createID(26) + '"' +
	                    ' />';
	            }
	            else if (propertyDisplay.fieldType === 'date') {
	                template = '<input type="text" class="form-control" ' +
	                    'datetime-picker data-date-only="true" future-only date-format="' + appConfig.dateFormat + '" ' +
	                    'ng-model="propertyDisplay.object.data[propertyDisplay.property]" ' +
	                    'ng-disabled="!propertyDisplay.editable" ' +
	                    'ng-show="propertyDisplay.editing" ' +
	                    'name="' + propertyDisplay.property + '" ' +
	                    'placeholder="' + placeholder + '" ' +
	                    validations +
	                    'id="swinput' + utilityService.createID(26) + '"' +
	                    ' />';
	            }
	            else if (propertyDisplay.fieldType === 'dateTime') {
	                template = '<input type="text" class="form-control" ' +
	                    'datetime-picker ' +
	                    'ng-model="propertyDisplay.object.data[propertyDisplay.property]" ' +
	                    'ng-disabled="!propertyDisplay.editable" ' +
	                    'ng-show="propertyDisplay.editing" ' +
	                    'name="' + propertyDisplay.property + '" ' +
	                    'placeholder="' + placeholder + '" ' +
	                    validations +
	                    'id="swinput' + utilityService.createID(26) + '"' +
	                    ' />';
	            }
	            return template;
	        };
	        return {
	            require: '^form',
	            scope: {
	                propertyDisplay: "=",
	                type: "@?"
	            },
	            restrict: "E",
	            //adding model and form controller
	            link: function (scope, element, attr, formController) {
	                //renders the template and compiles it
	                element.html(getTemplate(scope.propertyDisplay));
	                $compile(element.contents())(scope);
	            }
	        };
	    }
	    SWInput.Factory = function () {
	        var directive = function ($log, $compile, $hibachi, utilityService, rbkeyService) {
	            return new SWInput($log, $compile, $hibachi, utilityService, rbkeyService);
	        };
	        directive.$inject = [
	            '$log',
	            '$compile',
	            '$hibachi',
	            'utilityService',
	            'rbkeyService'
	        ];
	        return directive;
	    };
	    return SWInput;
	})();
	exports.SWInput = SWInput;


/***/ },
/* 108 */
/***/ function(module, exports) {

	/**********************************************************************************************
	 **********************************************************************************************
	 **********************************************************************************************
	 **		___________________________________________
	 ** 	Form Field - type have the following options (This is for the frontend so it can be modified):
	 **
	 **		checkbox			|	As a single checkbox this doesn't require any options, but it will create a hidden field for you so that the key gets submitted even when not checked.  The value of the checkbox will be 1
	 **		checkboxgroup		|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		file				|	No value can be passed in
	 **		multiselect			|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		password			|	No Value can be passed in
	 **		radiogroup			|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		select      		|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		text				|	Simple Text Field
	 **		textarea			|	Simple Textarea
	 **		yesno				|	This is used by booleans and flags to create a radio group of Yes and No
	 **		submit				|	submit button to post these properties back to the server.
	 **		------------------------------------------------------------------------------------------------------
	 **
	 **		attr.valueObject" type="any" default="" />
	 **		attr.valueObjectProperty" type="string" default="" />
	 **
	 **		General Settings that end up getting applied to the value object
	 **		attr.type" type="string" default="text"
	 **		attr.name" type="string" default=""
	 **		attr.class" type="string" default=""
	 **		attr.value" type="any" default=""
	 **		attr.valueOptions" type="array" default="#arrayNew(1)#"		<!--- Used for select, checkbox group, multiselect --->
	 **		attr.fieldAttributes" type="string" default=""
	 **
	 *********************************************************************************************
	 *********************************************************************************************
	 *********************************************************************************************
	 */
	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	    * Property Display Controller handles the logic for this directive.
	    */
	var SWFFormFieldController = (function () {
	    function SWFFormFieldController($scope) {
	        //let vm:IFormFieldControllerVM = this;
	        //
	        //if (this.propertyDisplay){
	        //    vm.propertyDisplay = this.propertyDisplay;
	        //}else{
	        //    vm.propertyDisplay =  {
	        //        name: vm.name,
	        //        class: vm.class,
	        //        errorClass: vm.errorClass,
	        //        type: vm.type,
	        //        object: vm.object,
	        //        propertyIdentifier: vm.propertyIdentifier
	        //    };
	        //    //console.log("Built a property display");
	        //}
	        this.$scope = $scope;
	    }
	    /**
	        * Handles the logic for the frontend version of the property display.
	        */
	    SWFFormFieldController.$inject = ['$scope'];
	    return SWFFormFieldController;
	})();
	/**
	    * This class handles configuring formFields for use in process forms on the front end.
	    */
	var SWFFormField = (function () {
	    function SWFFormField(coreFormPartialsPath, hibachiPathBuilder) {
	        this.restrict = "E";
	        this.require = "^?swfPropertyDisplay";
	        this.controller = SWFFormFieldController;
	        this.controllerAs = "swfFormField";
	        this.scope = true;
	        this.bindToController = {
	            propertyDisplay: "=?",
	            propertyIdentifier: "@?",
	            name: "@?",
	            class: "@?",
	            errorClass: "@?",
	            type: "@?"
	        };
	        this.link = function (scope, element, attrs, formController, transcludeFn) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + 'swfformfield.html';
	    }
	    /**
	        * Handles injecting the partials path into this class
	        */
	    SWFFormField.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFFormField(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            'coreFormPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFFormField;
	})();
	exports.SWFFormField = SWFFormField;


/***/ },
/* 109 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Form Controller handles the logic for this directive.
	 */
	var SWFormController = (function () {
	    /**
	     * This controller handles most of the logic for the swFormDirective when more complicated self inspection is needed.
	     */
	    // @ngInject
	    function SWFormController($scope, $element, $hibachi, $http, $timeout, observerService, $rootScope) {
	        this.$scope = $scope;
	        this.$element = $element;
	        this.$hibachi = $hibachi;
	        this.$http = $http;
	        this.$timeout = $timeout;
	        this.observerService = observerService;
	        this.$rootScope = $rootScope;
	        /** only use if the developer has specified these features with isProcessForm */
	        if (angular.isUndefined(this.isDirty)) {
	            this.isDirty = false;
	        }
	        this.isProcessForm = this.isProcessForm || "false";
	        if (this.isProcessForm == "true") {
	            this.handleForm(this, $scope);
	        }
	    }
	    /**
	     * Iterates through the form elements and checks if the names of any of them match
	     * the meta data that comes back from the processObject call. Supplies a generic submit
	     * method that can be called by any subclasses that inject formCtrl. On submit,
	     * this class will attach any errors to the correspnding form element.
	     */
	    SWFormController.prototype.handleForm = function (context, $scope) {
	        var _this = this;
	        //console.log("Context", context);
	        /** local variables */
	        this.processObject = this.name || "";
	        var vm = context;
	        vm.hiddenFields = this.hiddenFields;
	        vm.entityName = this.entityName;
	        vm.processObject = this.processObject;
	        vm.action = this.action;
	        vm.actions = this.actions;
	        vm.$timeout = this.$timeout;
	        vm.postOnly = false;
	        vm.hibachiScope = this.$rootScope.hibachiScope;
	        var observerService = this.observerService;
	        /** parse the name */
	        vm.entityName = this.processObject.split("_")[0];
	        var processObject = this.processObject.split("_")[1];
	        /** try to grab the meta data from the process entity in slatwall in a process exists
	         *  otherwise, just use the service method to access it.
	         */
	        /** Cart is an alias for an Order */
	        if (vm.entityName == "Order") {
	            vm.entityName = "Cart";
	        }
	        ;
	        /** find the form scope */
	        this.$scope.$on('anchor', function (event, data) {
	            if (data.anchorType == "form" && data.scope !== undefined) {
	                vm["formCtrl"] = data.scope;
	            }
	        });
	        /** make sure we have our data using new logic and $hibachi*/
	        if (this.processObject == undefined || vm.entityName == undefined) {
	            throw ("ProcessObject Undefined Exception");
	        }
	        if (angular.isDefined(this.object) && this.object.name) {
	            vm.actionFn = this.object;
	        }
	        else {
	            vm.postOnly = true;
	        }
	        /** We use these for our models */
	        vm.formData = {};
	        /** returns all the data from the form by iterating the form elements */
	        vm.getFormData = function () {
	            var _this = this;
	            //console.log("Form Data:", this.object);
	            angular.forEach(this.object, function (val, key) {
	                /** Check for form elements that have a name that doesn't start with $ */
	                if (angular.isString(val)) {
	                    _this.formData[key] = val;
	                }
	            });
	            return vm.formData || "";
	        };
	        /****
	          * Handle parsing through the server errors and injecting the error text for that field
	          * If the form only has a submit, then simply call that function and set errors.
	          ***/
	        vm.parseErrors = function (result) {
	            var _this = this;
	            //console.log("Resultant Errors: ", result);
	            if (angular.isDefined(result.errors) && result.errors) {
	                angular.forEach(result.errors, function (val, key) {
	                    //console.log("Parsing Rule: ", result.errors[key]);
	                    //console.log(this.object, key, this.object[key]);
	                    //console.log("Yes, is defined...");
	                    var primaryElement = _this.$element.find("[error-for='" + key + "']");
	                    //console.log("Primary Element: ", primaryElement);
	                    vm.$timeout(function () {
	                        //console.log("Appending");
	                        primaryElement.append("<span name='" + key + "Error'>" + result.errors[key] + "</span>");
	                    }, 0);
	                    //vm["formCtrl"][vm.processObject][key].$setValidity(key, false);//set field invalid
	                    //vm["formCtrl"][vm.processObject][key].$setPristine(key, false);
	                }, this);
	            }
	        };
	        vm.eventsObj = [];
	        /** looks at the onSuccess, onError, and onLoading and parses the string into useful subcategories */
	        vm.parseEventString = function (evntStr, evntType) {
	            vm.events = vm.parseEvents(evntStr, evntType); //onSuccess : [hide:this, show:someOtherForm, refresh:Account]
	        };
	        vm.eventsHandler = function (params) {
	            for (var e in params.events) {
	                if (angular.isDefined(params.events[e].value) && params.events[e].value == vm.processObject.toLowerCase()) {
	                    if (params.events[e].name == "hide") {
	                        vm.hide(params.events[e].value);
	                    }
	                    if (params.events[e].name == "show") {
	                        vm.show(params.events[e].value);
	                    }
	                    if (params.events[e].name == "update") {
	                        vm.update(params.events[e].value);
	                    }
	                    if (params.events[e].name == "refresh") {
	                        vm.refresh(params.events[e].value);
	                    }
	                    ;
	                }
	            }
	        };
	        /** hides this directive on event */
	        vm.hide = function (param) {
	            if (vm.processObject.toLowerCase() == param) {
	                _this.$element.hide();
	            }
	        };
	        /** shows this directive on event */
	        vm.show = function (param) {
	            if (vm.processObject.toLowerCase() == param) {
	                _this.$element.show();
	            }
	        };
	        /** refreshes this directive on event */
	        vm.refresh = function (params) {
	            //stub
	        };
	        /** updates this directive on event */
	        vm.update = function (params) {
	            //stub
	        };
	        /** clears this directive on event */
	        vm.clear = function (params) {
	            //stub
	        };
	        vm.parseEvents = function (str, evntType) {
	            if (str == undefined)
	                return;
	            var strTokens = str.split(","); //this gives the format [hide:this, show:Account_Logout, update:Account or Cart]
	            var eventsObj = {
	                "events": []
	            }; //will hold events
	            for (var token in strTokens) {
	                var t = strTokens[token].split(":")[0].toLowerCase().replace(' ', '');
	                var u = strTokens[token].split(":")[1].toLowerCase().replace(' ', '');
	                if (t == "show" || t == "hide" || t == "refresh" || t == "update") {
	                    if (u == "this") {
	                        u == vm.processObject.toLowerCase();
	                    } //<--replaces the alias this with the name of this form.
	                    var event_1 = { "name": t, "value": u };
	                    eventsObj.events.push(event_1);
	                }
	            }
	            if (eventsObj.events.length) {
	                observerService.attach(vm.eventsHandler, "onSuccess");
	            }
	            return eventsObj;
	        };
	        /** find and clear all errors on form */
	        vm.clearErrors = function () {
	            /** clear all form errors on submit. */
	            _this.$timeout(function () {
	                var errorElements = _this.$element.find("[error-for]");
	                errorElements.empty();
	                //vm["formCtrl"][vm.processObject].$setPristine(true);
	            }, 0);
	        };
	        /** iterates through the factory submitting data */
	        vm.iterateFactory = function (submitFunction) {
	            if (!submitFunction) {
	                throw "Action not defined on form";
	            }
	            var submitFn = vm.hibachiScope.doAction;
	            vm.formData = vm.formData || {};
	            //console.log("Calling Final Submit");
	            submitFn(submitFunction, vm.formData).then(function (result) {
	                if (vm.hibachiScope.hasErrors) {
	                    vm.parseErrors(result.data);
	                    //trigger an onError event
	                    observerService.notify("onError", { "caller": _this.processObject, "events": vm.events.events || "" });
	                }
	                else {
	                    //trigger a on success event
	                    observerService.notify("onSuccess", { "caller": _this.processObject, "events": vm.events.events || "" });
	                }
	            }, angular.noop);
	            //console.log("Leaving iterateFactory.");
	        };
	        /** does either a single or multiple actions */
	        vm.doAction = function (actionObject) {
	            if (angular.isArray(actionObject)) {
	                for (var _i = 0; _i < actionObject.length; _i++) {
	                    var submitFunction = actionObject[_i];
	                    vm.iterateFactory(submitFunction);
	                }
	            }
	            else if (angular.isString(actionObject)) {
	                vm.iterateFactory(actionObject);
	            }
	            else {
	                throw ("Unknown type of action exception");
	            }
	        };
	        /** create the generic submit function */
	        vm.submit = function (Action) {
	            var action = Action || _this.action;
	            vm.clearErrors();
	            vm.formData = vm.getFormData() || "";
	            vm.doAction(action);
	        };
	        this.submit = vm.submit;
	        /* give children access to the process
	        */
	        vm.getProcessObject = function () {
	            return vm.processEntity;
	        };
	        /* handle events
	        */
	        if (this.onSuccess) {
	            vm.parseEventString(this.onSuccess, "onSuccess");
	            observerService.attach(vm.eventsHandler, "onSuccess");
	        }
	        else if (this.onError) {
	            vm.parseEventString(this.onError, "onError");
	            observerService.attach(vm.eventsHandler, "onError"); //stub
	        }
	    };
	    return SWFormController;
	})();
	var SWForm = (function () {
	    // @ngInject
	    function SWForm(coreFormPartialsPath, hibachiPathBuilder) {
	        this.coreFormPartialsPath = coreFormPartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.templateUrl = "";
	        this.transclude = true;
	        this.restrict = "E";
	        this.controller = SWFormController;
	        this.controllerAs = "swForm";
	        this.scope = {};
	        /**
	         * Binds all of our variables to the controller so we can access using this
	         */
	        this.bindToController = {
	            name: "@?",
	            context: "@?",
	            entityName: "@?",
	            processObject: "@?",
	            hiddenFields: "=?",
	            action: "@?",
	            actions: "@?",
	            formClass: "@?",
	            formData: "=?",
	            object: "=?",
	            onSuccess: "@?",
	            onError: "@?",
	            hideUntil: "@?",
	            isProcessForm: "@?",
	            isDirty: "=?"
	        };
	        /**
	            * Sets the context of this form
	            */
	        this.link = function (scope, element, attrs, controller) {
	            scope.context = scope.context || 'save';
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(this.coreFormPartialsPath) + "formPartial.html";
	    }
	    /**
	     * Handles injecting the partials path into this class
	     */
	    SWForm.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWForm(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['coreFormPartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWForm;
	})();
	exports.SWForm = SWForm;


/***/ },
/* 110 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormField = (function () {
	    function SWFormField($log, $templateCache, $window, $hibachi, formService, coreFormPartialsPath, hibachiPathBuilder) {
	        return {
	            require: "^form",
	            restrict: 'AE',
	            scope: {
	                propertyDisplay: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + 'formfield.html',
	            link: function (scope, element, attrs, formController) {
	                if (angular.isUndefined(scope.propertyDisplay.object.$$getID) || scope.propertyDisplay.object.$$getID() === '') {
	                    scope.propertyDisplay.isDirty = true;
	                }
	                if (angular.isDefined(formController[scope.propertyDisplay.property])) {
	                    scope.propertyDisplay.errors = formController[scope.propertyDisplay.property].$error;
	                    formController[scope.propertyDisplay.property].formType = scope.propertyDisplay.fieldType;
	                }
	            }
	        };
	    }
	    SWFormField.Factory = function () {
	        var directive = function ($log, $templateCache, $window, $hibachi, formService, coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormField($log, $templateCache, $window, $hibachi, formService, coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$templateCache',
	            '$window',
	            '$hibachi',
	            'formService',
	            'coreFormPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormField;
	})();
	exports.SWFormField = SWFormField;
	//	angular.module('slatwalladmin').directive('swFormField',['$log','$templateCache', '$window', '$hibachi', 'formService', 'coreFormPartialsPath',($log, $templateCache, $window, $hibachi, formService, coreFormPartialsPath) => new swFormField($log, $templateCache, $window, $hibachi, formService, coreFormPartialsPath)]);


/***/ },
/* 111 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormFieldJsonController = (function () {
	    //@ngInject
	    function SWFormFieldJsonController(formService) {
	        this.propertyDisplay.form.$dirty = this.propertyDisplay.isDirty;
	    }
	    return SWFormFieldJsonController;
	})();
	var SWFormFieldJson = (function () {
	    function SWFormFieldJson(coreFormPartialsPath, hibachiPathBuilder) {
	        this.restrict = 'E';
	        this.require = "^form";
	        this.scope = true;
	        this.controller = SWFormFieldJsonController;
	        this.bindToController = {
	            propertyDisplay: "=?"
	        };
	        this.controllerAs = "ctrl";
	        this.templateUrl = "";
	        this.link = function (scope, element, attrs, formController) { };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + "json.html";
	    }
	    SWFormFieldJson.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormFieldJson(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            'coreFormPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormFieldJson;
	})();
	exports.SWFormFieldJson = SWFormFieldJson;


/***/ },
/* 112 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormFieldNumberController = (function () {
	    function SWFormFieldNumberController() {
	        if (this.propertyDisplay.isDirty == undefined)
	            this.propertyDisplay.isDirty = false;
	        this.propertyDisplay.form.$dirty = this.propertyDisplay.isDirty;
	    }
	    return SWFormFieldNumberController;
	})();
	var SWFormFieldNumber = (function () {
	    function SWFormFieldNumber(coreFormPartialsPath, hibachiPathBuilder) {
	        this.restrict = 'E';
	        this.require = "^form";
	        this.scope = true;
	        this.bindToController = {
	            propertyDisplay: "=?"
	        };
	        this.templateUrl = "";
	        this.controller = SWFormFieldNumberController;
	        this.controllerAs = "ctrl";
	        this.link = function (scope, element, attrs, formController) { };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + "number.html";
	    }
	    SWFormFieldNumber.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormFieldNumber(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['coreFormPartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWFormFieldNumber;
	})();
	exports.SWFormFieldNumber = SWFormFieldNumber;


/***/ },
/* 113 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var swFormFieldPasswordController = (function () {
	    //@ngInject
	    function swFormFieldPasswordController() {
	        this.propertyDisplay.form.$dirty = this.propertyDisplay.isDirty;
	    }
	    return swFormFieldPasswordController;
	})();
	var SWFormFieldPassword = (function () {
	    //@ngInject
	    function SWFormFieldPassword(coreFormPartialsPath, hibachiPathBuilder) {
	        this.restrict = 'E';
	        this.require = "^form";
	        this.scope = true;
	        this.bindToController = {
	            propertyDisplay: "=?"
	        };
	        this.controller = swFormFieldPasswordController;
	        this.controllerAs = "ctrl";
	        this.link = function (scope, element, attrs, formController) { };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + "password.html";
	    }
	    SWFormFieldPassword.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormFieldPassword(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['coreFormPartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWFormFieldPassword;
	})();
	exports.SWFormFieldPassword = SWFormFieldPassword;


/***/ },
/* 114 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormFieldRadio = (function () {
	    //@ngInject
	    function SWFormFieldRadio($log, $timeout, coreFormPartialsPath, hibachiPathBuilder) {
	        return {
	            templateUrl: hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + 'radio.html',
	            require: "^form",
	            restrict: 'E',
	            scope: {
	                propertyDisplay: "="
	            },
	            link: function (scope, element, attr, formController) {
	                console.log('radio');
	                var makeRandomID = function makeid(count) {
	                    var text = "";
	                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	                    for (var i = 0; i < count; i++)
	                        text += possible.charAt(Math.floor(Math.random() * possible.length));
	                    return text;
	                };
	                if (scope.propertyDisplay.fieldType === 'yesno') {
	                    //format value
	                    scope.selectedRadioFormName = makeRandomID(26);
	                    scope.propertyDisplay.object.data[scope.propertyDisplay.property] = (scope.propertyDisplay.object.data[scope.propertyDisplay.property].length && scope.propertyDisplay.object.data[scope.propertyDisplay.property].toLowerCase().trim() === 'yes') || scope.propertyDisplay.object.data[scope.propertyDisplay.property] == 1 ? 1 : 0;
	                    scope.formFieldChanged = function (option) {
	                        scope.propertyDisplay.object.data[scope.propertyDisplay.property] = option.value;
	                        scope.propertyDisplay.form[scope.propertyDisplay.property].$dirty = true;
	                        scope.propertyDisplay.form['selected' + scope.propertyDisplay.object.metaData.className + scope.propertyDisplay.property + scope.selectedRadioFormName].$dirty = false;
	                    };
	                    scope.propertyDisplay.options = [
	                        {
	                            name: 'Yes',
	                            value: 1
	                        },
	                        {
	                            name: 'No',
	                            value: 0
	                        }
	                    ];
	                    if (angular.isDefined(scope.propertyDisplay.object.data[scope.propertyDisplay.property])) {
	                        for (var i in scope.propertyDisplay.options) {
	                            if (scope.propertyDisplay.options[i].value === scope.propertyDisplay.object.data[scope.propertyDisplay.property]) {
	                                scope.selected = scope.propertyDisplay.options[i];
	                                scope.propertyDisplay.object.data[scope.propertyDisplay.property] = scope.propertyDisplay.options[i].value;
	                            }
	                        }
	                    }
	                    else {
	                        scope.selected = scope.propertyDisplay.options[0];
	                        scope.propertyDisplay.object.data[scope.propertyDisplay.property] = scope.propertyDisplay.options[0].value;
	                    }
	                    $timeout(function () {
	                        scope.propertyDisplay.form[scope.propertyDisplay.property].$dirty = scope.propertyDisplay.isDirty;
	                    });
	                }
	            }
	        };
	    }
	    SWFormFieldRadio.Factory = function () {
	        var directive = function ($log, $timeout, coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormFieldRadio($log, $timeout, coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log', '$timeout', 'coreFormPartialsPath', 'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormFieldRadio;
	})();
	exports.SWFormFieldRadio = SWFormFieldRadio;


/***/ },
/* 115 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormFieldSearchSelect = (function () {
	    function SWFormFieldSearchSelect($http, $log, $hibachi, formService, coreFormPartialsPath, hibachiPathBuilder) {
	        return {
	            templateUrl: hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + 'search-select.html',
	            require: "^form",
	            restrict: 'E',
	            scope: {
	                propertyDisplay: "="
	            },
	            link: function (scope, element, attr, formController) {
	                //set up selectionOptions
	                scope.selectionOptions = {
	                    value: [],
	                    $$adding: false
	                };
	                //match in matches track by
	                //function to set state of adding new item
	                scope.setAdding = function (isAdding) {
	                    scope.isAdding = isAdding;
	                    scope.showAddBtn = false;
	                };
	                scope.selectedOption = {};
	                scope.showAddBtn = false;
	                var propertyMetaData = scope.propertyDisplay.object.$$getMetaData(scope.propertyDisplay.property);
	                //create basic
	                var object = $hibachi.newEntity(propertyMetaData.cfc);
	                //				scope.propertyDisplay.template = '';
	                //				//check for a template
	                //				//rules are tiered: check if an override is specified at scope.template, check if the cfc name .html exists, use
	                //				var templatePath = coreFormPartialsPath + 'formfields/searchselecttemplates/';
	                //				if(angular.isUndefined(scope.propertyDisplay.template)){
	                //					var templatePromise = $http.get(templatePath+propertyMetaData.cfcProperCase+'.html',function(){
	                //						$log.debug('template');
	                //						scope.propertyDisplay.template = templatePath+propertyMetaData.cfcProperCase+'.html';
	                //					},function(){
	                //						scope.propertyDisplay.template = templatePath+'index.html';
	                //						$log.debug('template');
	                //						$log.debug(scope.propertyDisplay.template);
	                //					});
	                //				}
	                //set up query function for finding related object
	                scope.cfcProperCase = propertyMetaData.cfcProperCase;
	                scope.selectionOptions.getOptionsByKeyword = function (keyword) {
	                    var filterGroupsConfig = '[' +
	                        ' {  ' +
	                        '"filterGroup":[  ' +
	                        '{' +
	                        ' "propertyIdentifier":"_' + scope.cfcProperCase.toLowerCase() + '.' + scope.cfcProperCase + 'Name",' +
	                        ' "comparisonOperator":"like",' +
	                        ' "ormtype":"string",' +
	                        ' "value":"%' + keyword + '%"' +
	                        '  }' +
	                        ' ]' +
	                        ' }' +
	                        ']';
	                    return $hibachi.getEntity(propertyMetaData.cfc, { filterGroupsConfig: filterGroupsConfig.trim() })
	                        .then(function (value) {
	                        $log.debug('typesByKeyword');
	                        $log.debug(value);
	                        scope.selectionOptions.value = value.pageRecords;
	                        var myLength = keyword.length;
	                        if (myLength > 0) {
	                            scope.showAddBtn = true;
	                        }
	                        else {
	                            scope.showAddBtn = false;
	                        }
	                        return scope.selectionOptions.value;
	                    });
	                };
	                var propertyPromise = scope.propertyDisplay.object['$$get' + propertyMetaData.nameCapitalCase]();
	                propertyPromise.then(function (data) {
	                });
	                //set up behavior when selecting an item
	                scope.selectItem = function ($item, $model, $label) {
	                    scope.$item = $item;
	                    scope.$model = $model;
	                    scope.$label = $label;
	                    scope.showAddBtn = false; //turns off the add btn on select
	                    //angular.extend(inflatedObject.data,$item);
	                    object.$$init($item);
	                    $log.debug('select item');
	                    $log.debug(object);
	                    scope.propertyDisplay.object['$$set' + propertyMetaData.nameCapitalCase](object);
	                };
	                //				if(angular.isUndefined(scope.propertyDipslay.object[scope.propertyDisplay.property])){
	                //					$log.debug('getmeta');
	                //					$log.debug(scope.propertyDisplay.object.metaData[scope.propertyDisplay.property]);
	                //
	                //					//scope.propertyDipslay.object['$$get'+]
	                //				}
	                //
	                //				scope.propertyDisplay.object.data[scope.propertyDisplay.property].$dirty = true;
	            }
	        };
	    }
	    SWFormFieldSearchSelect.Factory = function () {
	        var directive = function ($http, $log, $hibachi, formService, coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormFieldSearchSelect($http, $log, $hibachi, formService, coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$log',
	            '$hibachi',
	            'formService',
	            'coreFormPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormFieldSearchSelect;
	})();
	exports.SWFormFieldSearchSelect = SWFormFieldSearchSelect;


/***/ },
/* 116 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormFieldSelect = (function () {
	    //@ngInject
	    function SWFormFieldSelect($log, $hibachi, formService, coreFormPartialsPath, utilityService, observerService, hibachiPathBuilder) {
	        return {
	            templateUrl: hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + 'select.html',
	            require: "^form",
	            restrict: 'E',
	            scope: {
	                propertyDisplay: "="
	            },
	            link: function (scope, element, attr, formController) {
	                if (angular.isDefined(scope.propertyDisplay.object.metaData[scope.propertyDisplay.property].fieldtype)) {
	                    scope.selectType = 'object';
	                    $log.debug('selectType:object');
	                }
	                else {
	                    scope.selectType = 'string';
	                    $log.debug('selectType:string');
	                }
	                scope.formFieldChanged = function (option) {
	                    $log.debug('formfieldchanged');
	                    $log.debug(option);
	                    if (scope.selectType === 'object' && typeof scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName == "function") {
	                        scope.propertyDisplay.object.data[scope.propertyDisplay.property]['data'][scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName()] = option.value;
	                        if (angular.isDefined(scope.propertyDisplay.form[scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName()])) {
	                            scope.propertyDisplay.form[scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName()].$dirty = true;
	                        }
	                    }
	                    else if (scope.selectType === 'string') {
	                        scope.propertyDisplay.object.data[scope.propertyDisplay.property] = option.value;
	                        scope.propertyDisplay.form[scope.propertyDisplay.property].$dirty = true;
	                    }
	                    observerService.notify(scope.propertyDisplay.object.metaData.className + scope.propertyDisplay.property.charAt(0).toUpperCase() + scope.propertyDisplay.property.slice(1) + 'OnChange', option);
	                };
	                scope.getOptions = function () {
	                    if (angular.isUndefined(scope.propertyDisplay.options)) {
	                        var optionsPromise = $hibachi.getPropertyDisplayOptions(scope.propertyDisplay.object.metaData.className, scope.propertyDisplay.optionsArguments);
	                        optionsPromise.then(function (value) {
	                            scope.propertyDisplay.options = value.data;
	                            if (scope.selectType === 'object') {
	                                if (angular.isUndefined(scope.propertyDisplay.object.data[scope.propertyDisplay.property])) {
	                                    scope.propertyDisplay.object.data[scope.propertyDisplay.property] = $hibachi['new' + scope.propertyDisplay.object.metaData[scope.propertyDisplay.property].cfc]();
	                                }
	                                if (scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getID() === '') {
	                                    $log.debug('no ID');
	                                    $log.debug(scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName());
	                                    scope.propertyDisplay.object.data['selected' + scope.propertyDisplay.property] = scope.propertyDisplay.options[0];
	                                    scope.propertyDisplay.object.data[scope.propertyDisplay.property] = $hibachi['new' + scope.propertyDisplay.object.metaData[scope.propertyDisplay.property].cfc]();
	                                    scope.propertyDisplay.object.data[scope.propertyDisplay.property]['data'][scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName()] = scope.propertyDisplay.options[0].value;
	                                }
	                                else {
	                                    var found = false;
	                                    for (var i in scope.propertyDisplay.options) {
	                                        if (angular.isObject(scope.propertyDisplay.options[i].value)) {
	                                            $log.debug('isObject');
	                                            $log.debug(scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName());
	                                            if (scope.propertyDisplay.options[i].value === scope.propertyDisplay.object.data[scope.propertyDisplay.property]) {
	                                                scope.propertyDisplay.object.data['selected' + scope.propertyDisplay.property] = scope.propertyDisplay.options[i];
	                                                scope.propertyDisplay.object.data[scope.propertyDisplay.property] = scope.propertyDisplay.options[i].value;
	                                                found = true;
	                                                break;
	                                            }
	                                        }
	                                        else {
	                                            $log.debug('notisObject');
	                                            $log.debug(scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName());
	                                            if (scope.propertyDisplay.options[i].value === scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getID()) {
	                                                scope.propertyDisplay.object.data['selected' + scope.propertyDisplay.property] = scope.propertyDisplay.options[i];
	                                                scope.propertyDisplay.object.data[scope.propertyDisplay.property]['data'][scope.propertyDisplay.object.data[scope.propertyDisplay.property].$$getIDName()] = scope.propertyDisplay.options[i].value;
	                                                found = true;
	                                                break;
	                                            }
	                                        }
	                                        if (!found) {
	                                            scope.propertyDisplay.object.data['selected' + scope.propertyDisplay.property] = scope.propertyDisplay.options[0];
	                                        }
	                                    }
	                                }
	                            }
	                            else if (scope.selectType === 'string') {
	                                if (scope.propertyDisplay.object.data[scope.propertyDisplay.property] !== null) {
	                                    for (var i in scope.propertyDisplay.options) {
	                                        if (scope.propertyDisplay.options[i].value === scope.propertyDisplay.object.data[scope.propertyDisplay.property]) {
	                                            scope.propertyDisplay.object.data['selected' + scope.propertyDisplay.property] = scope.propertyDisplay.options[i];
	                                            scope.propertyDisplay.object.data[scope.propertyDisplay.property] = scope.propertyDisplay.options[i].value;
	                                        }
	                                    }
	                                }
	                                else {
	                                    scope.propertyDisplay.object.data['selected' + scope.propertyDisplay.property] = scope.propertyDisplay.options[0];
	                                    scope.propertyDisplay.object.data[scope.propertyDisplay.property] = scope.propertyDisplay.options[0].value;
	                                }
	                            }
	                        });
	                    }
	                };
	                if (scope.propertyDisplay.eagerLoadOptions == true) {
	                    scope.getOptions();
	                }
	                //formService.setPristinePropertyValue(scope.propertyDisplay.property,scope.propertyDisplay.object[scope.propertyDisplay.valueOptions].value[0]);
	            }
	        }; //<--end return
	    }
	    SWFormFieldSelect.Factory = function () {
	        var directive = function ($log, $hibachi, formService, coreFormPartialsPath, utilityService, observerService, hibachiPathBuilder) {
	            return new SWFormFieldSelect($log, $hibachi, formService, coreFormPartialsPath, utilityService, observerService, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            'formService',
	            'coreFormPartialsPath',
	            'utilityService',
	            'observerService',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormFieldSelect;
	})();
	exports.SWFormFieldSelect = SWFormFieldSelect;


/***/ },
/* 117 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormFieldTextController = (function () {
	    //@ngInject
	    function SWFormFieldTextController(formService) {
	        this.formService = formService;
	        if (this.propertyDisplay.isDirty == undefined)
	            this.propertyDisplay.isDirty = false;
	        this.propertyDisplay.form.$dirty = this.propertyDisplay.isDirty;
	        this.formService.setPristinePropertyValue(this.propertyDisplay.property, this.propertyDisplay.object.data[this.propertyDisplay.property]);
	    }
	    return SWFormFieldTextController;
	})();
	var SWFormFieldText = (function () {
	    function SWFormFieldText(coreFormPartialsPath, hibachiPathBuilder) {
	        this.restrict = 'E';
	        this.require = "^form";
	        this.controller = SWFormFieldTextController;
	        this.controllerAs = "ctrl";
	        this.scope = true;
	        this.bindToController = {
	            propertyDisplay: "="
	        };
	        //@ngInject
	        this.link = function (scope, element, attr, formController) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + "text.html";
	    }
	    SWFormFieldText.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormFieldText(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            'coreFormPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormFieldText;
	})();
	exports.SWFormFieldText = SWFormFieldText;
	//     angular.module('slatwalladmin').directive('swFormFieldText', ['$log','$hibachi','formService','partialsPath', ($log, $hibachi, formService, partialsPath) => new SWFormFieldText($log, $hibachi, formService, partialsPath)]);
	// }


/***/ },
/* 118 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormFieldDateController = (function () {
	    //@ngInject
	    function SWFormFieldDateController(formService) {
	        this.formService = formService;
	        if (this.propertyDisplay.isDirty == undefined)
	            this.propertyDisplay.isDirty = false;
	        this.propertyDisplay.form.$dirty = this.propertyDisplay.isDirty;
	        this.formService.setPristinePropertyValue(this.propertyDisplay.property, this.propertyDisplay.object.data[this.propertyDisplay.property]);
	    }
	    return SWFormFieldDateController;
	})();
	var SWFormFieldDate = (function () {
	    function SWFormFieldDate(coreFormPartialsPath, hibachiPathBuilder) {
	        this.restrict = 'E';
	        this.require = "^form";
	        this.controller = SWFormFieldDateController;
	        this.controllerAs = "ctrl";
	        this.scope = true;
	        this.bindToController = {
	            propertyDisplay: "="
	        };
	        //@ngInject
	        this.link = function (scope, element, attr, formController) {
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + "date.html";
	    }
	    SWFormFieldDate.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormFieldDate(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            'coreFormPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormFieldDate;
	})();
	exports.SWFormFieldDate = SWFormFieldDate;


/***/ },
/* 119 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormRegistrar = (function () {
	    //@ngInject
	    function SWFormRegistrar(formService, coreFormPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            require: "^form",
	            scope: {
	                object: "=",
	                context: "@",
	                name: "@",
	                isDirty: "="
	            },
	            link: function (scope, element, attrs, formController) {
	                /*add form info at the form level*/
	                formController.$$swFormInfo = {
	                    object: scope.object,
	                    context: scope.context || 'save',
	                    name: scope.name
	                };
	                var makeRandomID = function makeid(count) {
	                    var text = "";
	                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	                    for (var i = 0; i < count; i++)
	                        text += possible.charAt(Math.floor(Math.random() * possible.length));
	                    return text;
	                };
	                if (scope.isDirty) {
	                    formController.autoDirty = true;
	                }
	                scope.form = formController;
	                /*register form with service*/
	                formController.name = scope.name;
	                formController.$setDirty();
	                formService.setForm(formController);
	                /*register form at object level*/
	                if (!angular.isDefined(scope.object.forms)) {
	                    scope.object.forms = {};
	                }
	                scope.object.forms[scope.name] = formController;
	            }
	        };
	    }
	    SWFormRegistrar.Factory = function () {
	        var directive = function (formService, coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFormRegistrar(formService, coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            'formService',
	            'coreFormPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormRegistrar;
	})();
	exports.SWFormRegistrar = SWFormRegistrar;
	// 	angular.module('slatwalladmin').directive('swFormRegistrar',[ 'formService', 'partialsPath', (formService, partialsPath) => new swFormRegistrar(formService, partialsPath)]);
	// }


/***/ },
/* 120 */
/***/ function(module, exports) {

	/**********************************************************************************************
	 **********************************************************************************************
	 **********************************************************************************************
	 **		Property Display (This one is specifically for the frontend so that it can be modified)
	 **		isHidden
	 **		requiredFlag
	 **		title
	 **		hint
	 **		editting
	 **		object
	 **		class
	 **		___________________________________________
	 ** 	attr.type have the following options:
	 **
	 **		checkbox			|	As a single checkbox this doesn't require any options, but it will create a hidden field for you so that the key gets submitted even when not checked.  The value of the checkbox will be 1
	 **		checkboxgroup		|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		file				|	No value can be passed in
	 **		multiselect			|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		password			|	No Value can be passed in
	 **		radiogroup			|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		select      		|	Requires the valueOptions to be an array of simple value if name and value is same or array of structs with the format of {value="", name=""}
	 **		text				|	Simple Text Field
	 **		textarea			|	Simple Textarea
	 **		yesno				|	This is used by booleans and flags to create a radio group of Yes and No
	 **		submit				|	submit button to post these properties back to the server.
	 **		------------------------------------------------------------------------------------------------------
	 **
	 **		attr.valueObject" type="any" default="" />
	 **		attr.valueObjectProperty" type="string" default="" />
	 **
	 **		General Settings that end up getting applied to the value object
	 **		attr.type" type="string" default="text"
	 **		attr.name" type="string" default=""
	 **		attr.class" type="string" default=""
	 **		attr.value" type="any" default=""
	 **		attr.valueOptions" type="array" default="#arrayNew(1)#"		<!--- Used for select, checkbox group, multiselect --->
	 **		attr.fieldAttributes" type="string" default=""
	 **
	 *********************************************************************************************
	 *********************************************************************************************
	 *********************************************************************************************
	 */
	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	    * Property Display Controller handles the logic for this directive.
	    */
	var SWFPropertyDisplayController = (function () {
	    /**
	        * Handles the logic for the frontend version of the property display.
	        */
	    //@ngInject
	    function SWFPropertyDisplayController($scope) {
	        this.$scope = $scope;
	        this.optionValues = [];
	        var vm = this;
	        vm.processObject = {};
	        vm.valueObjectProperty = this.valueObjectProperty;
	        vm.type = this.type || "text";
	        vm.class = this.class || "formControl";
	        vm.valueObject = this.valueObject;
	        vm.fieldAttributes = this.fieldAttributes || "";
	        vm.label = this.label || "true";
	        vm.labelText = this.labelText || "";
	        vm.labelClass = this.labelClass || "";
	        vm.name = this.name || "unnamed";
	        vm.options = this.options;
	        vm.valueOptions = this.valueOptions;
	        vm.errorClass = this.errorClass;
	        vm.errorText = this.errorText;
	        vm.object = this.object; //this is the process object
	        vm.propertyIdentifier = this.propertyIdentifier; //this is the property
	        vm.loader = this.loader;
	        vm.noValidate = this.noValidate;
	        /** in order to attach the correct controller to local vm, we need a watch to bind */
	        /** handle options */
	        if (vm.options && angular.isString(vm.options)) {
	            var optionsArray = [];
	            optionsArray = vm.options.toString().split(",");
	            angular.forEach(optionsArray, function (o) {
	                var newOption = {
	                    name: "",
	                    value: ""
	                };
	                newOption.name = o;
	                newOption.value = o;
	                this.optionValues.push(newOption);
	            }, vm);
	        }
	        if (angular.isDefined(vm.valueOptions) && angular.isObject(vm.valueOptions)) {
	            vm.optionsValues = [];
	            angular.forEach(vm.valueOptions, function (o) {
	                var newOption = {
	                    name: "",
	                    value: ""
	                };
	                if (angular.isDefined(o.name) && angular.isDefined(o.value)) {
	                    newOption.name = o.name;
	                    newOption.value = o.value;
	                    vm.optionValues.push(newOption);
	                }
	            });
	        }
	        /** handle turning the options into an array of objects */
	        /** handle setting the default value for the yes / no element  */
	        if (this.type == "yesno" && (this.value && angular.isString(this.value))) {
	            vm.selected == this.value;
	        }
	        this.propertyDisplay = {
	            type: vm.type,
	            name: vm.name,
	            class: vm.class,
	            loader: vm.loader,
	            errorClass: vm.errorClass,
	            option: vm.options,
	            valueObject: vm.valueObject,
	            object: vm.object,
	            label: vm.label,
	            labelText: vm.labelText,
	            labelClass: vm.labelClass,
	            optionValues: vm.optionValues,
	            edit: vm.editting,
	            title: vm.title,
	            value: vm.value || "",
	            errorText: vm.errorText,
	        };
	        //console.log("Property Display", this.propertyDisplay);
	    }
	    return SWFPropertyDisplayController;
	})();
	/**
	    * This class handles configuring formFields for use in process forms on the front end.
	    */
	var SWFPropertyDisplay = (function () {
	    //@ngInject
	    function SWFPropertyDisplay(coreFormPartialsPath, hibachiPathBuilder) {
	        this.restrict = "E";
	        this.require = "?^swForm";
	        this.transclude = true;
	        this.templateUrl = "";
	        this.controller = SWFPropertyDisplayController;
	        this.controllerAs = "swfPropertyDisplayController";
	        this.scope = {};
	        this.bindToController = {
	            type: "@?",
	            name: "@?",
	            class: "@?",
	            edit: "@?",
	            title: "@?",
	            hint: "@?",
	            valueObject: "=?",
	            valueObjectProperty: "=?",
	            propertyIdentifier: "@?",
	            options: "@?",
	            valueOptions: "=?",
	            fieldAttributes: "@?",
	            object: "=",
	            label: "@?",
	            labelText: "@?",
	            labelClass: "@?",
	            errorText: "@?",
	            errorClass: "@?",
	            formTemplate: "@?"
	        };
	        this.link = function (scope, element, attrs, formController, transcludeFn) {
	            scope.frmController = formController;
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(coreFormPartialsPath) + 'swfpropertydisplaypartial.html';
	    }
	    SWFPropertyDisplay.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWFPropertyDisplay(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['coreFormPartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    return SWFPropertyDisplay;
	})();
	exports.SWFPropertyDisplay = SWFPropertyDisplay;


/***/ },
/* 121 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWPropertyDisplayController = (function () {
	    //@ngInject
	    function SWPropertyDisplayController($filter) {
	        var _this = this;
	        this.$filter = $filter;
	        this.$onInit = function () {
	            if (!angular.isDefined(_this.object)) {
	                _this.object = _this.form.$$swFormInfo.object;
	            }
	            if (angular.isUndefined(_this.fieldType)) {
	                _this.fieldType = _this.object.metaData.$$getPropertyFieldType(_this.property);
	            }
	            if (angular.isUndefined(_this.hint)) {
	                _this.hint = _this.object.metaData.$$getPropertyHint(_this.property);
	            }
	            if (angular.isUndefined(_this.title)) {
	                _this.title = _this.object.metaData.$$getPropertyTitle(_this.property);
	            }
	        };
	        this.errors = {};
	        if (angular.isUndefined(this.editing)) {
	            this.editing = false;
	        }
	        if (angular.isUndefined(this.editable)) {
	            this.editable = true;
	        }
	        if (angular.isUndefined(this.isHidden)) {
	            this.isHidden = false;
	        }
	        if (angular.isUndefined(this.eagerLoadOptions)) {
	            this.eagerLoadOptions = true;
	        }
	        if (angular.isUndefined(this.noValidate)) {
	            this.noValidate = false;
	        }
	        if (angular.isUndefined(this.optionsArguments)) {
	            this.optionsArguments = {};
	        }
	        this.applyFilter = function (model, filter) {
	            try {
	                return $filter(filter)(model);
	            }
	            catch (e) {
	                return model;
	            }
	        };
	    }
	    return SWPropertyDisplayController;
	})();
	var SWPropertyDisplay = (function () {
	    function SWPropertyDisplay(coreFormPartialsPath, hibachiPathBuilder) {
	        this.coreFormPartialsPath = coreFormPartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.require = { form: '^form' };
	        this.restrict = 'AE';
	        this.scope = {};
	        this.bindToController = {
	            property: "@",
	            object: "=?",
	            options: "=?",
	            editable: "=?",
	            editing: "=?",
	            isHidden: "=?",
	            title: "=?",
	            hint: "@?",
	            optionsArguments: "=?",
	            eagerLoadOptions: "=?",
	            isDirty: "=?",
	            onChange: "=?",
	            fieldType: "@?",
	            noValidate: "=?"
	        };
	        this.controller = SWPropertyDisplayController;
	        this.controllerAs = "swPropertyDisplay";
	        this.link = function ($scope, element, attrs, formController) {
	        };
	        console.warn(this);
	        this.templateUrl = this.hibachiPathBuilder.buildPartialsPath(this.coreFormPartialsPath) + "propertydisplay.html";
	    }
	    SWPropertyDisplay.Factory = function () {
	        var directive = function (coreFormPartialsPath, hibachiPathBuilder) {
	            return new SWPropertyDisplay(coreFormPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['coreFormPartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    SWPropertyDisplay.$inject = ['coreFormPartialsPath', 'hibachiPathBuilder'];
	    return SWPropertyDisplay;
	})();
	exports.SWPropertyDisplay = SWPropertyDisplay;


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	/// <reference path="../../typings/hibachiTypescript.d.ts" />
	var swvalidate_1 = __webpack_require__(123);
	var swvalidationminlength_1 = __webpack_require__(124);
	var swvalidationdatatype_1 = __webpack_require__(125);
	var swvalidationeq_1 = __webpack_require__(126);
	var swvalidationgte_1 = __webpack_require__(127);
	var swvalidationlte_1 = __webpack_require__(128);
	var swvalidationmaxlength_1 = __webpack_require__(129);
	var swvalidationmaxvalue_1 = __webpack_require__(130);
	var swvalidationminvalue_1 = __webpack_require__(131);
	var swvalidationneq_1 = __webpack_require__(132);
	var swvalidationnumeric_1 = __webpack_require__(133);
	var swvalidationregex_1 = __webpack_require__(134);
	var swvalidationrequired_1 = __webpack_require__(135);
	var swvalidationunique_1 = __webpack_require__(136);
	var swvalidationuniqueornull_1 = __webpack_require__(137);
	var validationmodule = angular.module('hibachi.validation', [])
	    .run([function () {
	    }])
	    .directive('swValidate', swvalidate_1.SWValidate.Factory())
	    .directive('swvalidationminlength', swvalidationminlength_1.SWValidationMinLength.Factory())
	    .directive('swvalidationdatatype', swvalidationdatatype_1.SWValidationDataType.Factory())
	    .directive('swvalidationeq', swvalidationeq_1.SWValidationEq.Factory())
	    .directive("swvalidationgte", swvalidationgte_1.SWValidationGte.Factory())
	    .directive("swvalidationlte", swvalidationlte_1.SWValidationLte.Factory())
	    .directive('swvalidationmaxlength', swvalidationmaxlength_1.SWValidationMaxLength.Factory())
	    .directive("swvalidationmaxvalue", swvalidationmaxvalue_1.SWValidationMaxValue.Factory())
	    .directive("swvalidationminvalue", swvalidationminvalue_1.SWValidationMinValue.Factory())
	    .directive("swvalidationneq", swvalidationneq_1.SWValidationNeq.Factory())
	    .directive("swvalidationnumeric", swvalidationnumeric_1.SWValidationNumeric.Factory())
	    .directive("swvalidationregex", swvalidationregex_1.SWValidationRegex.Factory())
	    .directive("swvalidationrequired", swvalidationrequired_1.SWValidationRequired.Factory())
	    .directive("swvalidationunique", swvalidationunique_1.SWValidationUnique.Factory())
	    .directive("swvalidationuniqueornull", swvalidationuniqueornull_1.SWValidationUniqueOrNull.Factory());
	exports.validationmodule = validationmodule;


/***/ },
/* 123 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * This validate directive will look at the current element, figure out the context (save, edit, delete) and
	 * validate based on that context as defined in the validation properties object.
	 */
	// 'use strict';
	// angular.module('slatwalladmin').directive('swValidate',
	// [ '$log','$hibachi', function($log, $hibachi) {
	var SWValidate = (function () {
	    function SWValidate($log, $hibachi) {
	        return {
	            restrict: "A",
	            require: '^ngModel',
	            link: function (scope, elem, attr, ngModel) {
	                //Define our contexts and validation property enums.
	                var ContextsEnum = {
	                    SAVE: { name: "save", value: 0 },
	                    DELETE: { name: "delete", value: 1 },
	                    EDIT: { name: "edit", value: 2 }
	                };
	                var ValidationPropertiesEnum = {
	                    REGEX: { name: "regex", value: 0 },
	                    MIN_VALUE: { name: "minValue", value: 1 },
	                    MAX_VALUE: { name: "maxValue", value: 2 },
	                    EQ: { name: "eq", value: 3 },
	                    NEQ: { name: "neq", value: 4 },
	                    UNIQUE: { name: "unique", value: 5 },
	                    LTE: { name: "lte", value: 6 },
	                    GTE: { name: "gte", value: 7 },
	                    MIN_LENGTH: { name: "minLength", value: 8 },
	                    MAX_LENGTH: { name: "maxLength", value: 9 },
	                    DATA_TYPE: { name: "dataType", value: 10 },
	                    REQUIRED: { name: "required", value: 11 }
	                };
	                scope.validationPropertiesEnum = ValidationPropertiesEnum;
	                scope.contextsEnum = ContextsEnum;
	                var myCurrentContext = scope.contextsEnum.SAVE; //We are only checking the save context right now.
	                var contextNamesArray = getNamesFromObject(ContextsEnum); //Convert for higher order functions.
	                var validationPropertiesArray = getNamesFromObject(ValidationPropertiesEnum); //Convert for higher order functions.
	                var validationObject = scope.propertyDisplay.object.validations.properties; //Get the scope validation object.
	                var errors = scope.propertyDisplay.errors;
	                var errorMessages = [];
	                var failFlag = 0;
	                /**
	                * Iterates over the validation object looking for the current elements validations, maps that to a validation function list
	                * and calls those validate functions. When a validation fails, an error is set, the elements border turns red.
	                */
	                function validate(name, context, elementValue) {
	                    var validationResults = {};
	                    validationResults = { "name": "name", "context": "context", "required": "required", "error": "none", "errorkey": "none" };
	                    for (var key in validationObject) {
	                        // Look for the current attribute in the
	                        // validation parameters.
	                        if (key === name || key === name + "Flag") {
	                            // Now that we have found the current
	                            // validation parameters, iterate
	                            // through them looking for
	                            // the required parameters that match
	                            // the current page context (save,
	                            // delete, etc.)
	                            for (var inner in validationObject[key]) {
	                                var required = validationObject[key][inner].required || "false"; // Get
	                                // the
	                                // required
	                                // value
	                                var context = validationObject[key][inner].contexts || "none"; // Get
	                                // the
	                                // element
	                                // context
	                                //Setup the validation results object to pass back to caller.
	                                validationResults = { "name": key, "context": context, "required": required, "error": "none", "errorkey": "none" };
	                                var elementValidationArr = map(checkHasValidationType, validationPropertiesArray, validationObject[key][inner]);
	                                //Iterate over the array and call the validate function if it has that property.
	                                for (var i = 0; i < elementValidationArr.length; i++) {
	                                    if (elementValidationArr[i] == true) {
	                                        if (validationPropertiesArray[i] === "regex" && elementValue !== "") {
	                                            //Get the regex string to match and send to validation function.
	                                            var re = validationObject[key][inner].regex;
	                                            var result = validate_RegExp(elementValue, re); //true if pattern match, fail otherwise.
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Invalid input");
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["REGEX"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            else {
	                                                errorMessages
	                                                    .push("Valid input");
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["REGEX"].name;
	                                                validationResults.fail = false;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "minValue") {
	                                            var validationMinValue = validationObject[key][inner].minValue;
	                                            $log.debug(validationMinValue);
	                                            var result = validate_MinValue(elementValue, validationMinValue);
	                                            $log.debug("e>v" + result + " :" + elementValue, ":" + validationMinValue);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Minimum value is: "
	                                                    + validationMinValue);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["MIN_VALUE"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            else {
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["MIN_VALUE"].name;
	                                                validationResults.fail = false;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "maxValue") {
	                                            var validationMaxValue = validationObject[key][inner].maxValue;
	                                            var result = validate_MaxValue(elementValue, validationMaxValue);
	                                            $log.debug("Max Value result is: " + result);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Maximum value is: "
	                                                    + validationMaxValue);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["MAX_VALUE"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "minLength") {
	                                            var validationMinLength = validationObject[key][inner].minLength;
	                                            var result = validate_MinLength(elementValue, validationMinLength);
	                                            $log.debug("Min Length result is: " + result);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Minimum length must be: "
	                                                    + validationMinLength);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["MIN_LENGTH"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "maxLength") {
	                                            var validationMaxLength = validationObject[key][inner].maxLength;
	                                            var result = validate_MaxLength(elementValue, validationMaxLength);
	                                            $log.debug("Max Length result is: " + result);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Maximum length is: "
	                                                    + validationMaxLength);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["MAX_LENGTH"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "eq") {
	                                            var validationEq = validationObject[key][inner].eq;
	                                            var result = validate_Eq(elementValue, validationEq);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Must equal "
	                                                    + validationEq);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["EQ"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "neq") {
	                                            var validationNeq = validationObject[key][inner].neq;
	                                            var result = validate_Neq(elementValue, validationNeq);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Must not equal: "
	                                                    + validationNeq);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["NEQ"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "lte") {
	                                            var validationLte = validationObject[key][inner].lte;
	                                            var result = validate_Lte(elementValue, validationLte);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Must be less than "
	                                                    + validationLte);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["LTE"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "gte") {
	                                            var validationGte = validationObject[key][inner].gte;
	                                            var result = validate_Gte(elementValue, validationGte);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Must be greater than: "
	                                                    + validationGte);
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = "invalid-" + ValidationPropertiesEnum["GTE"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            return validationResults;
	                                        }
	                                        if (validationPropertiesArray[i] === "required") {
	                                            var validationRequire = validationObject[key][inner].require;
	                                            var result = validate_Required(elementValue, validationRequire);
	                                            if (result != true) {
	                                                errorMessages
	                                                    .push("Required");
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = ValidationPropertiesEnum["REQUIRED"].name;
	                                                validationResults.fail = true;
	                                            }
	                                            else {
	                                                errorMessages
	                                                    .push("Required");
	                                                validationResults.error = errorMessages[errorMessages.length - 1];
	                                                validationResults.errorkey = ValidationPropertiesEnum["REQUIRED"].name;
	                                                validationResults.fail = false;
	                                            }
	                                            return validationResults;
	                                        }
	                                    }
	                                }
	                            }
	                        }
	                    } //<---end validate.			
	                }
	                /**
	                * Function to map if we need a validation on this element.
	                */
	                function checkHasValidationType(validationProp, validationType) {
	                    if (validationProp[validationType] != undefined) {
	                        return true;
	                    }
	                    else {
	                        return false;
	                    }
	                }
	                /**
	                * Iterates over the properties object finding which types of validation are needed.
	                */
	                function map(func, array, obj) {
	                    var result = [];
	                    forEach(array, function (element) {
	                        result.push(func(obj, element));
	                    });
	                    return result;
	                }
	                /**
	                * Array iteration helper.
	                */
	                function forEach(array, action) {
	                    for (var i = 0; i < array.length; i++)
	                        action(array[i]);
	                }
	                /**
	                * Helper function to read all the names in our enums into an array that the higher order functions can use.
	                */
	                function getNamesFromObject(obj) {
	                    var result = [];
	                    for (var i in obj) {
	                        var name = obj[i].name || "stub";
	                        result.push(name);
	                    }
	                    return result;
	                }
	                /**
	                * Tests the value for a RegExp match given by the pattern string.
	                * Validates true if pattern match, false otherwise.
	                */
	                function validate_RegExp(value, pattern) {
	                    var regex = new RegExp(pattern);
	                    if (regex.test(value)) {
	                        return true;
	                    }
	                    return false;
	                }
	                /**
	                * Validates true if userValue >= minValue (inclusive)
	                */
	                function validate_MinValue(userValue, minValue) {
	                    return (userValue >= minValue);
	                }
	                /**
	                * Validates true if userValue <= maxValue (inclusive)
	                */
	                function validate_MaxValue(userValue, maxValue) {
	                    return (userValue <= maxValue) ? true : false;
	                }
	                /**
	                * Validates true if length of the userValue >= minLength (inclusive)
	                */
	                function validate_MinLength(userValue, minLength) {
	                    return (userValue.length >= minLength) ? true : false;
	                }
	                /**
	                * Validates true if length of the userValue <= maxLength (inclusive)
	                */
	                function validate_MaxLength(userValue, maxLength) {
	                    return (userValue.length <= maxLength) ? true : false;
	                }
	                /**
	                * Validates true if the userValue == eqValue
	                */
	                function validate_Eq(userValue, eqValue) {
	                    return (userValue == eqValue) ? true : false;
	                }
	                /**
	                * Validates true if the userValue != neqValue
	                */
	                function validate_Neq(userValue, neqValue) {
	                    return (userValue != neqValue) ? true : false;
	                }
	                /**
	                * Validates true if the userValue < decisionValue (exclusive)
	                */
	                function validate_Lte(userValue, decisionValue) {
	                    return (userValue < decisionValue) ? true : false;
	                }
	                /**
	                * Validates true if the userValue > decisionValue (exclusive)
	                */
	                function validate_Gte(userValue, decisionValue) {
	                    return (userValue > decisionValue) ? true : false;
	                }
	                /**
	                * Validates true if the userValue === property
	                */
	                function validate_EqProperty(userValue, property) {
	                    return (userValue === property) ? true : false;
	                }
	                /**
	                * Validates true if the given value is !NaN (Negate, Not a Number).
	                */
	                function validate_IsNumeric(value) {
	                    return !isNaN(value) ? true : false;
	                }
	                /**
	                * Validates true if the given userValue is empty and the field is required.
	                */
	                function validate_Required(property, userValue) {
	                    return (userValue == "" && property == true) ? true : false;
	                }
	                /**
	                * Handles the 'eager' validation on every key press.
	                */
	                ngModel.$parsers.unshift(function (value) {
	                    var name = elem.context.name; //Get the element name for the validate function.
	                    var currentValue = elem.val(); //Get the current element value to check validations against.
	                    var val = validate(name, myCurrentContext, currentValue) || {};
	                    //Check if field is required.				
	                    $log.debug(scope);
	                    $log.debug(val);
	                    ngModel.$setValidity(val.errorkey, !val.fail);
	                    return true;
	                }); //<---end $parsers
	                /**
	                * This handles 'lazy' validation on blur.
	                */
	                elem.bind('blur', function (e) {
	                });
	            }
	        };
	    }
	    SWValidate.Factory = function () {
	        var directive = function ($log, $hibachi) { return new SWValidate($log, $hibachi); };
	        directive.$inject = ['$log', '$hibachi'];
	        return directive;
	    };
	    return SWValidate;
	})();
	exports.SWValidate = SWValidate;


/***/ },
/* 124 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Returns true if the user value is greater than the min length.
	 */
	/**
	 * Returns true if the user value is greater than the minimum value.
	 */
	var SWValidationMinLength = (function () {
	    function SWValidationMinLength($log) {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationminlength =
	                    function (modelValue, viewValue) {
	                        var constraintValue = attributes.swvalidationminlength;
	                        var userValue = viewValue || 0;
	                        if (parseInt(viewValue.length) >= parseInt(constraintValue)) {
	                            return true;
	                        }
	                        $log.debug('invalid min length');
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationMinLength.Factory = function () {
	        var directive = function ($log) { return new SWValidationMinLength($log); };
	        directive.$inject = ['$log'];
	        return directive;
	    };
	    return SWValidationMinLength;
	})();
	exports.SWValidationMinLength = SWValidationMinLength;


/***/ },
/* 125 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * True if the data type matches the given data type.
	 */
	/**
	 * Validates true if the model value is a numeric value.
	 */
	var SWValidationDataType = (function () {
	    function SWValidationDataType() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                var MY_EMAIL_REGEXP = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9_]+?\.[a-zA-Z]{2,3}$/;
	                ngModel.$validators.swvalidationdatatype =
	                    function (modelValue) {
	                        if (angular.isString(modelValue) && attributes.swvalidationdatatype === "string") {
	                            return true;
	                        }
	                        if (angular.isNumber(parseInt(modelValue)) && attributes.swvalidationdatatype === "numeric") {
	                            return true;
	                        }
	                        if (angular.isArray(modelValue) && attributes.swvalidationdatatype === "array") {
	                            return true;
	                        }
	                        if (angular.isDate(modelValue) && attributes.swvalidationdatatype === "date") {
	                            return true;
	                        }
	                        if (angular.isObject(modelValue) && attributes.swvalidationdatatype === "object") {
	                            return true;
	                        }
	                        if (attributes.swvalidationdatatype === 'email') {
	                            return MY_EMAIL_REGEXP.test(modelValue);
	                        }
	                        if (angular.isUndefined(modelValue && attributes.swvalidationdatatype === "undefined")) {
	                            return true;
	                        }
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationDataType.Factory = function () {
	        var directive = function () {
	            return new SWValidationDataType();
	        };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationDataType;
	})();
	exports.SWValidationDataType = SWValidationDataType;


/***/ },
/* 126 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * SwValidationEQ: Validates true if the user value == the constraint value.
	 * @usage <input type='text' swvalidationgte='5' /> will validate false if the user enters
	 * value other than 5.
	 */
	var SWValidationEq = (function () {
	    function SWValidationEq() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationeq =
	                    function (modelValue, viewValue) {
	                        var constraintValue = attributes.swvalidationeq;
	                        if (modelValue === constraintValue) {
	                            return true;
	                        }
	                        else {
	                            return false;
	                        }
	                    }; //<--end function
	            } //<--end link
	        };
	    }
	    SWValidationEq.Factory = function () {
	        var directive = function () {
	            return new SWValidationEq();
	        };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationEq;
	})();
	exports.SWValidationEq = SWValidationEq;


/***/ },
/* 127 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * SwValidationGTE: Validates true if the user value >= to the constraint value.
	 * @usage <input type='text' swvalidationGte='5' /> will validate false if the user enters
	 * value less than OR equal to 5.
	 */
	var SWValidationGte = (function () {
	    function SWValidationGte() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationGte =
	                    function (modelValue, viewValue) {
	                        var constraintValue = attributes.swvalidationGte || 0;
	                        if (parseInt(modelValue) >= parseInt(constraintValue)) {
	                            return true; //Passes the validation
	                        }
	                        return false;
	                    }; //<--end function
	            } //<--end link
	        };
	    }
	    SWValidationGte.Factory = function () {
	        var directive = function () { return new SWValidationGte(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationGte;
	})();
	exports.SWValidationGte = SWValidationGte;


/***/ },
/* 128 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * SwValidationLTE: Validates true if the user value <= to the constraint value.
	 * @usage <input type='number' swvalidationlte='5000' /> will validate false if the user enters
	 * value greater than OR equal to 5,000.
	 */
	var SWValidationLte = (function () {
	    function SWValidationLte() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationlte =
	                    function (modelValue, viewValue) {
	                        var constraintValue = attributes.swvalidationlte;
	                        var userValue = viewValue || 0;
	                        if (parseInt(viewValue) <= parseInt(constraintValue)) {
	                            return true;
	                        }
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationLte.Factory = function () {
	        var directive = function () { return new SWValidationLte(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationLte;
	})();
	exports.SWValidationLte = SWValidationLte;


/***/ },
/* 129 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Returns true if the user value is greater than the max length.
	 */
	var SWValidationMaxLength = (function () {
	    function SWValidationMaxLength() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationmaxlength =
	                    function (modelValue, viewValue) {
	                        var constraintValue = attributes.swvalidationmaxlength;
	                        var userValue = viewValue || 0;
	                        if (parseInt(viewValue.length) >= parseInt(constraintValue)) {
	                            return true;
	                        }
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationMaxLength.Factory = function () {
	        var directive = function () { return new SWValidationMaxLength(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationMaxLength;
	})();
	exports.SWValidationMaxLength = SWValidationMaxLength;


/***/ },
/* 130 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Returns true if the user value is greater than the min value.
	 */
	var SWValidationMaxValue = (function () {
	    function SWValidationMaxValue() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationmaxvalue =
	                    function (modelValue, viewValue) {
	                        var constraintValue = attributes.swvalidationmaxvalue;
	                        var userValue = viewValue || 0;
	                        if (parseInt(viewValue) <= parseInt(constraintValue)) {
	                            return true;
	                        }
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationMaxValue.Factory = function () {
	        var directive = function () { return new SWValidationMaxValue(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationMaxValue;
	})();
	exports.SWValidationMaxValue = SWValidationMaxValue;


/***/ },
/* 131 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Returns true if the user value is greater than the minimum value.
	 */
	var SWValidationMinValue = (function () {
	    function SWValidationMinValue() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationminvalue =
	                    function (modelValue, viewValue) {
	                        var constraintValue = attributes.swvalidationminvalue;
	                        var userValue = viewValue || 0;
	                        if (parseInt(modelValue) >= parseInt(constraintValue)) {
	                            return true;
	                        }
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationMinValue.Factory = function () {
	        var directive = function () { return new SWValidationMinValue(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationMinValue;
	})();
	exports.SWValidationMinValue = SWValidationMinValue;


/***/ },
/* 132 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 *  Validates true if the user value != the property value.
	 */
	var SWValidationNeq = (function () {
	    function SWValidationNeq() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationneq =
	                    function (modelValue) {
	                        if (modelValue != attributes.swvalidationneq) {
	                            return true;
	                        }
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationNeq.Factory = function () {
	        var directive = function () { return new SWValidationNeq(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationNeq;
	})();
	exports.SWValidationNeq = SWValidationNeq;


/***/ },
/* 133 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Validates true if the model value (user value) is a numeric value.
	 * @event This event fires on every change to an input.
	 */
	var SWValidationNumeric = (function () {
	    function SWValidationNumeric() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationnumeric =
	                    function (modelValue, viewValue) {
	                        //Returns true if this is not a number.
	                        if (!isNaN(viewValue)) {
	                            return true;
	                        }
	                        else {
	                            return false;
	                        }
	                    };
	            }
	        };
	    }
	    SWValidationNumeric.Factory = function () {
	        var directive = function () { return new SWValidationNumeric(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationNumeric;
	})();
	exports.SWValidationNumeric = SWValidationNumeric;


/***/ },
/* 134 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Validates true if the model value matches a regex string.
	 */
	var SWValidationRegex = (function () {
	    function SWValidationRegex() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationregex =
	                    function (modelValue) {
	                        //Returns true if this user value (model value) does match the pattern
	                        var pattern = attributes.swvalidationregex;
	                        var regex = new RegExp(pattern);
	                        if (regex.test(modelValue)) {
	                            return true;
	                        }
	                        else {
	                            return false;
	                        }
	                    };
	            }
	        };
	    }
	    SWValidationRegex.Factory = function () {
	        var directive = function () { return new SWValidationRegex(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationRegex;
	})();
	exports.SWValidationRegex = SWValidationRegex;


/***/ },
/* 135 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Returns true if the uservalue is empty and false otherwise
	 */
	var SWValidationRequired = (function () {
	    function SWValidationRequired() {
	        return {
	            restrict: "A",
	            require: "^ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$validators.swvalidationrequired =
	                    function (modelValue, viewValue) {
	                        var value = modelValue || viewValue;
	                        if (value) {
	                            return true;
	                        }
	                        return false;
	                    };
	            }
	        };
	    }
	    SWValidationRequired.Factory = function () {
	        var directive = function () { return new SWValidationRequired(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return SWValidationRequired;
	})();
	exports.SWValidationRequired = SWValidationRequired;


/***/ },
/* 136 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Validates true if the given object is 'unique' and false otherwise.
	 */
	var SWValidationUnique = (function () {
	    function SWValidationUnique($http, $q, $hibachi, $log) {
	        return {
	            restrict: "A",
	            require: "ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$asyncValidators.swvalidationunique = function (modelValue, viewValue) {
	                    $log.debug('asyc');
	                    var deferred = $q.defer(), currentValue = modelValue || viewValue, key = scope.propertyDisplay.object.metaData.className, property = scope.propertyDisplay.property;
	                    //First time the asyncValidators function is loaded the
	                    //key won't be set  so ensure that we have
	                    //key and propertyName before checking with the server
	                    if (key && property) {
	                        $hibachi.checkUniqueValue(key, property, currentValue)
	                            .then(function (unique) {
	                            $log.debug('uniquetest');
	                            $log.debug(unique);
	                            if (unique) {
	                                deferred.resolve(); //It's unique
	                            }
	                            else {
	                                deferred.reject(); //Add unique to $errors
	                            }
	                        });
	                    }
	                    else {
	                        deferred.resolve(); //Ensure promise is resolved if we hit this
	                    }
	                    return deferred.promise;
	                };
	            }
	        };
	    }
	    SWValidationUnique.Factory = function () {
	        var directive = function ($http, $q, $hibachi, $log) { return new SWValidationUnique($http, $q, $hibachi, $log); };
	        directive.$inject = ['$http', '$q', '$hibachi', '$log'];
	        return directive;
	    };
	    return SWValidationUnique;
	})();
	exports.SWValidationUnique = SWValidationUnique;


/***/ },
/* 137 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Validates true if the given object is 'unique' and false otherwise.
	 */
	var SWValidationUniqueOrNull = (function () {
	    function SWValidationUniqueOrNull($http, $q, $hibachi, $log) {
	        return {
	            restrict: "A",
	            require: "ngModel",
	            link: function (scope, element, attributes, ngModel) {
	                ngModel.$asyncValidators.swvalidationuniqueornull = function (modelValue, viewValue) {
	                    $log.debug('async');
	                    var deferred = $q.defer(), currentValue = modelValue || viewValue, key = scope.propertyDisplay.object.metaData.className, property = scope.propertyDisplay.property;
	                    //First time the asyncValidators function is loaded the
	                    //key won't be set  so ensure that we have
	                    //key and propertyName before checking with the server
	                    if (key && property) {
	                        $hibachi.checkUniqueOrNullValue(key, property, currentValue)
	                            .then(function (unique) {
	                            $log.debug('uniquetest');
	                            $log.debug(unique);
	                            if (unique) {
	                                deferred.resolve(); //It's unique
	                            }
	                            else {
	                                deferred.reject(); //Add unique to $errors
	                            }
	                        });
	                    }
	                    else {
	                        deferred.resolve(); //Ensure promise is resolved if we hit this
	                    }
	                    return deferred.promise;
	                };
	            }
	        };
	    }
	    SWValidationUniqueOrNull.Factory = function () {
	        var directive = function ($http, $q, $hibachi, $log) { return new SWValidationUniqueOrNull($http, $q, $hibachi, $log); };
	        directive.$inject = ['$http', '$q', '$hibachi', '$log'];
	        return directive;
	    };
	    return SWValidationUniqueOrNull;
	})();
	exports.SWValidationUniqueOrNull = SWValidationUniqueOrNull;


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//services
	var workflowconditionservice_1 = __webpack_require__(139);
	var scheduleservice_1 = __webpack_require__(140);
	//directives
	var swadmincreatesuperuser_1 = __webpack_require__(141);
	var swworkflowbasic_1 = __webpack_require__(142);
	var swworkflowcondition_1 = __webpack_require__(143);
	var swworkflowconditiongroupitem_1 = __webpack_require__(144);
	var swworkflowconditiongroups_1 = __webpack_require__(145);
	var swworkflowtask_1 = __webpack_require__(146);
	var swworkflowtaskactions_1 = __webpack_require__(147);
	var swworkflowtasks_1 = __webpack_require__(148);
	var swworkflowtrigger_1 = __webpack_require__(149);
	var swworkflowtriggers_1 = __webpack_require__(150);
	var swworkflowtriggerhistory_1 = __webpack_require__(151);
	var swschedulepreview_1 = __webpack_require__(152);
	//filters
	var workflowmodule = angular.module('hibachi.workflow', ['hibachi.collection']).config(function () {
	})
	    .constant('workflowPartialsPath', 'workflow/components/')
	    .service('workflowConditionService', workflowconditionservice_1.WorkflowConditionService)
	    .service('scheduleService', scheduleservice_1.ScheduleService)
	    .directive('swAdminCreateSuperUser', swadmincreatesuperuser_1.SWAdminCreateSuperUser.Factory())
	    .directive('swWorkflowBasic', swworkflowbasic_1.SWWorkflowBasic.Factory())
	    .directive('swWorkflowCondition', swworkflowcondition_1.SWWorkflowCondition.Factory())
	    .directive('swWorkflowConditionGroupItem', swworkflowconditiongroupitem_1.SWWorkflowConditionGroupItem.Factory())
	    .directive('swWorkflowConditionGroups', swworkflowconditiongroups_1.SWWorkflowConditionGroups.Factory())
	    .directive('swWorkflowTask', swworkflowtask_1.SWWorkflowTask.Factory())
	    .directive('swWorkflowTaskActions', swworkflowtaskactions_1.SWWorkflowTaskActions.Factory())
	    .directive('swWorkflowTasks', swworkflowtasks_1.SWWorkflowTasks.Factory())
	    .directive('swWorkflowTrigger', swworkflowtrigger_1.SWWorkflowTrigger.Factory())
	    .directive('swWorkflowTriggers', swworkflowtriggers_1.SWWorkflowTriggers.Factory())
	    .directive('swWorkflowTriggerHistory', swworkflowtriggerhistory_1.SWWorkflowTriggerHistory.Factory())
	    .directive('swSchedulePreview', swschedulepreview_1.SWSchedulePreview.Factory());
	exports.workflowmodule = workflowmodule;


/***/ },
/* 139 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var WorkflowCondition = (function () {
	    function WorkflowCondition() {
	        this.propertyIdentifer = "";
	        this.comparisonOperator = "";
	        this.value = "";
	        this.displayPropertyIdentifier = "";
	        this.$$disabled = false;
	        this.$$isClosed = true;
	        this.$$isNew = true;
	    }
	    return WorkflowCondition;
	})();
	exports.WorkflowCondition = WorkflowCondition;
	var WorkflowConditionGroupItem = (function () {
	    function WorkflowConditionGroupItem() {
	        this.workflowConditionGroup = [];
	    }
	    return WorkflowConditionGroupItem;
	})();
	exports.WorkflowConditionGroupItem = WorkflowConditionGroupItem;
	var WorkflowConditionService = (function () {
	    function WorkflowConditionService($log, $hibachi, alertService) {
	        var _this = this;
	        this.$log = $log;
	        this.newWorkflowCondition = function () {
	            return new WorkflowCondition;
	        };
	        this.addWorkflowCondition = function (groupItem, condition) {
	            _this.$log.debug('addWorkflowCondition');
	            _this.$log.debug(groupItem);
	            _this.$log.debug(condition);
	            if (groupItem.length >= 1) {
	                condition.logicalOperator = 'AND';
	            }
	            groupItem.push(condition);
	        };
	        this.newWorkflowConditionGroupItem = function () {
	            return new WorkflowConditionGroupItem;
	        };
	        this.addWorkflowConditionGroupItem = function (group, groupItem) {
	            group.push(groupItem);
	        };
	    }
	    WorkflowConditionService.$inject = ["$log", "$hibachi", "alertService"];
	    return WorkflowConditionService;
	})();
	exports.WorkflowConditionService = WorkflowConditionService;


/***/ },
/* 140 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var ScheduleService = (function () {
	    function ScheduleService(utilityService) {
	        var _this = this;
	        this.utilityService = utilityService;
	        this.schedulePreview = {};
	        this.clearSchedulePreview = function () {
	            _this.schedulePreview = {};
	        };
	        this.addSchedulePreviewItem = function (cdate, longMonthName) {
	            if (longMonthName === void 0) { longMonthName = true; }
	            var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	            var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	            var monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	            var currentDate = (cdate.getMonth() + 1) + '-' + cdate.getDate() + '-' + cdate.getFullYear();
	            if (_this.schedulePreview[currentDate] === undefined) {
	                _this.schedulePreview[currentDate] = {
	                    day: cdate.getDate(),
	                    month: (longMonthName) ? month[cdate.getMonth() + 1] : monthShort[cdate.getMonth() + 1],
	                    year: cdate.getFullYear(),
	                    weekday: weekday[cdate.getDay()],
	                    times: []
	                };
	            }
	            _this.schedulePreview[currentDate].times.push(cdate.toLocaleTimeString());
	        };
	        this.buildSchedulePreview = function (scheduleObject, totalOfPreviews) {
	            if (totalOfPreviews === void 0) { totalOfPreviews = 10; }
	            _this.clearSchedulePreview();
	            var startTime = new Date(Date.parse(scheduleObject.frequencyStartTime));
	            var endTime = (scheduleObject.frequencyEndTime.trim()) ? new Date(Date.parse(scheduleObject.frequencyEndTime)) : false;
	            var now = new Date();
	            var startPoint = new Date();
	            startPoint.setHours(startTime.getHours());
	            startPoint.setMinutes(startTime.getMinutes());
	            startPoint.setSeconds(startTime.getSeconds());
	            var daysToRun = [];
	            if (scheduleObject.recuringType == 'weekly') {
	                daysToRun = scheduleObject.daysOfWeekToRun.toString().split(',');
	                if (!daysToRun.length || scheduleObject.daysOfWeekToRun.toString().trim() == '') {
	                    return _this.schedulePreview;
	                }
	            }
	            if (scheduleObject.recuringType == 'monthly') {
	                daysToRun = scheduleObject.daysOfMonthToRun.toString().split(',');
	                if (!daysToRun.length || !scheduleObject.daysOfWeekToRun || scheduleObject.daysOfWeekToRun.toString().trim() == '') {
	                    return _this.schedulePreview;
	                }
	            }
	            var datesAdded = 0;
	            for (var i = 0;; i++) {
	                if (datesAdded >= totalOfPreviews || i >= 500)
	                    break;
	                var timeToadd = (scheduleObject.frequencyInterval && scheduleObject.frequencyInterval.toString().trim()) ? (scheduleObject.frequencyInterval * i) * 60000 : i * 24 * 60 * 60 * 1000;
	                var currentDatetime = new Date(startPoint.getTime() + timeToadd);
	                if (currentDatetime < now)
	                    continue;
	                if (scheduleObject.recuringType == 'weekly') {
	                    if (daysToRun.indexOf((currentDatetime.getDay() + 1).toString()) == -1)
	                        continue;
	                }
	                else if (scheduleObject.recuringType == 'monthly') {
	                    if (daysToRun.indexOf(currentDatetime.getDate().toString()) == -1)
	                        continue;
	                }
	                if (!endTime) {
	                    _this.addSchedulePreviewItem(currentDatetime);
	                    datesAdded++;
	                }
	                else {
	                    if (_this.utilityService.minutesOfDay(startTime) <= _this.utilityService.minutesOfDay(currentDatetime)
	                        && _this.utilityService.minutesOfDay(endTime) >= _this.utilityService.minutesOfDay(currentDatetime)) {
	                        _this.addSchedulePreviewItem(currentDatetime);
	                        datesAdded++;
	                    }
	                }
	            }
	            return _this.schedulePreview;
	        };
	    }
	    ScheduleService.$inject = ["utilityService"];
	    return ScheduleService;
	})();
	exports.ScheduleService = ScheduleService;


/***/ },
/* 141 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWAdminCreateSuperUser = (function () {
	    function SWAdminCreateSuperUser($log, $hibachi, workflowPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            scope: {},
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "admincreatesuperuser.html",
	            link: function (scope, element, attrs) {
	                scope.Account_SetupInitialAdmin = $hibachi.newAccount_SetupInitialAdmin();
	            }
	        };
	    }
	    SWAdminCreateSuperUser.Factory = function () {
	        var directive = function ($log, $hibachi, workflowPartialsPath, hibachiPathBuilder) {
	            return new SWAdminCreateSuperUser($log, $hibachi, workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            'workflowPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWAdminCreateSuperUser;
	})();
	exports.SWAdminCreateSuperUser = SWAdminCreateSuperUser;


/***/ },
/* 142 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowBasic = (function () {
	    function SWWorkflowBasic($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'A',
	            scope: {
	                workflow: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowbasic.html",
	            link: function (scope, element, attrs) {
	                console.log('workflowtest');
	                console.log(scope.workflow);
	            }
	        };
	    }
	    SWWorkflowBasic.Factory = function () {
	        var directive = function ($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder) {
	            return new SWWorkflowBasic($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$location',
	            '$hibachi',
	            'formService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWWorkflowBasic;
	})();
	exports.SWWorkflowBasic = SWWorkflowBasic;


/***/ },
/* 143 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowCondition = (function () {
	    function SWWorkflowCondition($log, $location, $hibachi, formService, metadataService, workflowPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            scope: {
	                workflowCondition: "=",
	                workflowConditionIndex: "=",
	                workflow: "=",
	                filterPropertiesList: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowcondition.html",
	            link: function (scope, element, attrs) {
	                $log.debug('workflowCondition init');
	                $log.debug(scope);
	                scope.selectBreadCrumb = function (breadCrumbIndex) {
	                    //splice out array items above index
	                    var removeCount = scope.filterItem.breadCrumbs.length - 1 - breadCrumbIndex;
	                    scope.filterItem.breadCrumbs.splice(breadCrumbIndex + 1, removeCount);
	                    scope.selectedFilterPropertyChanged(null);
	                };
	                scope.selectedFilterPropertyChanged = function (selectedFilterProperty) {
	                    $log.debug('selectedFilterProperty');
	                    $log.debug(selectedFilterProperty);
	                    scope.selectedFilterProperty = selectedFilterProperty;
	                };
	                if (angular.isUndefined(scope.workflowCondition.breadCrumbs)) {
	                    scope.workflowCondition.breadCrumbs = [];
	                    if (scope.workflowCondition.propertyIdentifier === "") {
	                        scope.workflowCondition.breadCrumbs = [
	                            {
	                                entityAlias: scope.workflow.data.workflowObject,
	                                cfc: scope.workflow.data.workflowObject,
	                                propertyIdentifier: scope.workflow.data.workflowObject
	                            }
	                        ];
	                    }
	                    else {
	                        var entityAliasArrayFromString = scope.workflowCondition.propertyIdentifier.split('.');
	                        entityAliasArrayFromString.pop();
	                        for (var i in entityAliasArrayFromString) {
	                            var breadCrumb = {
	                                entityAlias: entityAliasArrayFromString[i],
	                                cfc: entityAliasArrayFromString[i],
	                                propertyIdentifier: entityAliasArrayFromString[i]
	                            };
	                            scope.workflowCondition.breadCrumbs.push(breadCrumb);
	                        }
	                    }
	                }
	                else {
	                    angular.forEach(scope.workflowCondition.breadCrumbs, function (breadCrumb, key) {
	                        if (angular.isUndefined(scope.filterPropertiesList[breadCrumb.propertyIdentifier])) {
	                            var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(breadCrumb.cfc);
	                            filterPropertiesPromise.then(function (value) {
	                                metadataService.setPropertiesList(value, breadCrumb.propertyIdentifier);
	                                scope.filterPropertiesList[breadCrumb.propertyIdentifier] = metadataService.getPropertiesListByBaseEntityAlias(breadCrumb.propertyIdentifier);
	                                metadataService.formatPropertiesList(scope.filterPropertiesList[breadCrumb.propertyIdentifier], breadCrumb.propertyIdentifier);
	                                var entityAliasArrayFromString = scope.workflowCondition.propertyIdentifier.split('.');
	                                entityAliasArrayFromString.pop();
	                                entityAliasArrayFromString = entityAliasArrayFromString.join('.').trim();
	                                if (angular.isDefined(scope.filterPropertiesList[entityAliasArrayFromString])) {
	                                    for (var i in scope.filterPropertiesList[entityAliasArrayFromString].data) {
	                                        var filterProperty = scope.filterPropertiesList[entityAliasArrayFromString].data[i];
	                                        if (filterProperty.propertyIdentifier === scope.workflowCondition.propertyIdentifier) {
	                                            //selectItem from drop down
	                                            scope.selectedFilterProperty = filterProperty;
	                                            //decorate with value and comparison Operator so we can use it in the Condition section
	                                            scope.selectedFilterProperty.value = scope.workflowCondition.value;
	                                            scope.selectedFilterProperty.comparisonOperator = scope.workflowCondition.comparisonOperator;
	                                        }
	                                    }
	                                }
	                            });
	                        }
	                        else {
	                            var entityAliasArrayFromString = scope.workflowCondition.propertyIdentifier.split('.');
	                            entityAliasArrayFromString.pop();
	                            entityAliasArrayFromString = entityAliasArrayFromString.join('.').trim();
	                            if (angular.isDefined(scope.filterPropertiesList[entityAliasArrayFromString])) {
	                                for (var i in scope.filterPropertiesList[entityAliasArrayFromString].data) {
	                                    var filterProperty = scope.filterPropertiesList[entityAliasArrayFromString].data[i];
	                                    if (filterProperty.propertyIdentifier === scope.workflowCondition.propertyIdentifier) {
	                                        //selectItem from drop down
	                                        scope.selectedFilterProperty = filterProperty;
	                                        //decorate with value and comparison Operator so we can use it in the Condition section
	                                        scope.selectedFilterProperty.value = scope.workflowCondition.value;
	                                        scope.selectedFilterProperty.comparisonOperator = scope.workflowCondition.comparisonOperator;
	                                    }
	                                }
	                            }
	                        }
	                    });
	                }
	            }
	        };
	    }
	    SWWorkflowCondition.Factory = function () {
	        var directive = function ($log, $location, $hibachi, formService, metadataService, workflowPartialsPath, hibachiPathBuilder) {
	            return new SWWorkflowCondition($log, $location, $hibachi, formService, metadataService, workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$location',
	            '$hibachi',
	            'formService',
	            'metadataService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWWorkflowCondition;
	})();
	exports.SWWorkflowCondition = SWWorkflowCondition;


/***/ },
/* 144 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowConditionGroupItem = (function () {
	    function SWWorkflowConditionGroupItem($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowconditiongroupitem.html",
	            link: function (scope, element, attrs) {
	            }
	        };
	    }
	    SWWorkflowConditionGroupItem.Factory = function () {
	        var directive = function ($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder) {
	            return new ($log,
	                $location,
	                $hibachi,
	                formService,
	                workflowPartialsPath,
	                hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$location',
	            '$hibachi',
	            'formService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWWorkflowConditionGroupItem;
	})();
	exports.SWWorkflowConditionGroupItem = SWWorkflowConditionGroupItem;


/***/ },
/* 145 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowConditionGroups = (function () {
	    function SWWorkflowConditionGroups($log, workflowConditionService, workflowPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            scope: {
	                workflowConditionGroupItem: "=",
	                workflowConditionGroup: "=",
	                workflow: "=",
	                filterPropertiesList: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowconditiongroups.html",
	            link: function (scope, element, attrs) {
	                $log.debug('workflowconditiongroups init');
	                scope.addWorkflowCondition = function () {
	                    $log.debug('addWorkflowCondition');
	                    var workflowCondition = workflowConditionService.newWorkflowCondition();
	                    workflowConditionService.addWorkflowCondition(scope.workflowConditionGroupItem, workflowCondition);
	                };
	                scope.addWorkflowGroupItem = function () {
	                    $log.debug('addWorkflowGrouptItem');
	                    var workflowConditionGroupItem = workflowConditionService.newWorkflowConditionGroupItem();
	                    workflowConditionService.addWorkflowConditionGroupItem(scope.workflowConditionItem, workflowConditionGroupItem);
	                };
	            }
	        };
	    }
	    SWWorkflowConditionGroups.Factory = function () {
	        var directive = function ($log, workflowConditionService, workflowPartialsPath, hibachiPathBuilder) {
	            return new SWWorkflowConditionGroups($log, workflowConditionService, workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            'workflowConditionService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWWorkflowConditionGroups;
	})();
	exports.SWWorkflowConditionGroups = SWWorkflowConditionGroups;


/***/ },
/* 146 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowTask = (function () {
	    function SWWorkflowTask($log, $location, $timeout, $hibachi, metadataService, collectionService, workflowPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'E',
	            scope: {
	                workflowTask: "=",
	                workflowTasks: "=",
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowtask.html",
	            link: function (scope, element, attrs) {
	                scope.removeWorkflowTask = function (workflowTask) {
	                    var deletePromise = workflowTask.$$delete();
	                    deletePromise.then(function () {
	                        if (workflowTask === scope.workflowTasks.selectedTask) {
	                            delete scope.workflowTasks.selectedTask;
	                        }
	                        scope.workflowTasks.splice(workflowTask.$$index, 1);
	                        for (var i in scope.workflowTasks) {
	                            scope.workflowTasks[i].$$index = i;
	                        }
	                    });
	                };
	            }
	        };
	    }
	    SWWorkflowTask.Factory = function () {
	        var directive = function ($log, $location, $timeout, $hibachi, metadataService, collectionService, workflowPartialsPath, hibachiPathBuilder) {
	            return new SWWorkflowTask($log, $location, $timeout, $hibachi, metadataService, collectionService, workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$location',
	            '$timeout',
	            '$hibachi',
	            'metadataService',
	            'collectionService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWWorkflowTask;
	})();
	exports.SWWorkflowTask = SWWorkflowTask;


/***/ },
/* 147 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowTaskActionsController = (function () {
	    //@ngInject
	    function SWWorkflowTaskActionsController($scope, $log, $hibachi, metadataService, collectionService, workflowPartialsPath, hibachiPathBuilder, collectionConfigService, observerService) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$log = $log;
	        this.$hibachi = $hibachi;
	        this.metadataService = metadataService;
	        this.collectionService = collectionService;
	        this.workflowPartialsPath = workflowPartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.collectionConfigService = collectionConfigService;
	        this.observerService = observerService;
	        this.$log.debug('Workflow Task Actions Init');
	        this.$log.debug(this.workflowTask);
	        this.openActions = false;
	        this.observerService.attach(function (item) {
	            if (angular.isDefined(_this.emailTemplateCollectionConfig)) {
	                _this.emailTemplateCollectionConfig.clearFilters();
	                _this.emailTemplateCollectionConfig.addFilter("emailTemplateObject", item.value);
	            }
	            if (angular.isDefined(_this.printTemplateCollectionConfig)) {
	                _this.printTemplateCollectionConfig.clearFilters();
	                _this.printTemplateCollectionConfig.addFilter("printTemplateObject", item.value);
	            }
	        }, 'WorkflowWorkflowObjectOnChange');
	        /**
	         * Returns the correct object based on the selected object type.
	         */
	        var getObjectByActionType = function (workflowTaskAction) {
	            if (workflowTaskAction.data.actionType === 'email') {
	                workflowTaskAction.$$getEmailTemplate();
	            }
	            else if (workflowTaskAction.data.actionType === 'print') {
	                workflowTaskAction.$$getPrintTemplate();
	            }
	        };
	        /**
	         * --------------------------------------------------------------------------------------------------------
	         * Returns workflow task action, and saves them to the scope variable workflowtaskactions
	         * --------------------------------------------------------------------------------------------------------
	         */
	        this.getWorkflowTaskActions = function () {
	            /***
	             Note:
	             This conditional is checking whether or not we need to be retrieving to
	             items all over again. If we already have them, we won't make another
	             trip to the database.

	             ***/
	            if (angular.isUndefined(_this.workflowTask.data.workflowTaskActions)) {
	                var workflowTaskPromise = _this.workflowTask.$$getWorkflowTaskActions();
	                workflowTaskPromise.then(function () {
	                    _this.workflowTaskActions = _this.workflowTask.data.workflowTaskActions;
	                    angular.forEach(_this.workflowTaskActions, function (workflowTaskAction) {
	                        getObjectByActionType(workflowTaskAction);
	                    });
	                    _this.$log.debug(_this.workflowTaskActions);
	                });
	            }
	            else {
	                _this.workflowTaskActions = _this.workflowTask.data.workflowTaskActions;
	            }
	            if (angular.isUndefined(_this.workflowTask.data.workflowTaskActions)) {
	                _this.workflowTask.data.workflowTaskActions = [];
	                _this.workflowTaskActions = _this.workflowTask.data.workflowTaskActions;
	            }
	        };
	        this.getWorkflowTaskActions(); //Call get
	        /**
	         * --------------------------------------------------------------------------------------------------------
	         * Saves the workflow task actions by calling the objects $$save method.
	         * @param taskAction
	         * --------------------------------------------------------------------------------------------------------
	         */
	        this.saveWorkflowTaskAction = function (taskAction, context) {
	            _this.$log.debug("Context: " + context);
	            _this.$log.debug("saving task action and parent task");
	            _this.$log.debug(taskAction);
	            var savePromise = _this.workflowTaskActions.selectedTaskAction.$$save();
	            savePromise.then(function () {
	                var taSavePromise = taskAction.$$save;
	                //Clear the form by adding a new task action if 'save and add another' otherwise, set save and set finished
	                if (context == 'add') {
	                    _this.$log.debug("Save and New");
	                    _this.addWorkflowTaskAction(taskAction);
	                    _this.finished = false;
	                }
	                else if (context == "finish") {
	                    _this.finished = true;
	                }
	            }, function (err) {
	                angular.element('a[href="/##j-basic-2"]').click();
	                console.warn(err);
	            });
	        }; //<--end save
	        /**
	         * Sets the editing state to show/hide the edit screen.
	         */
	        this.setHidden = function (task) {
	            if (!angular.isObject(task)) {
	                task = {};
	            }
	            if (angular.isUndefined(task.hidden)) {
	                task.hidden = false;
	            }
	            else {
	                _this.$log.debug("setHidden()", "Setting Hide Value To " + !task.hidden);
	                task.hidden = !task.hidden;
	            }
	        };
	        /**
	         * --------------------------------------------------------------------------------------------------------
	         * Adds workflow action items by calling the workflowTask objects $$addWorkflowTaskAction() method
	         * and sets the result to scope.
	         * @param taskAction
	         * --------------------------------------------------------------------------------------------------------
	         */
	        this.addWorkflowTaskAction = function (taskAction) {
	            var workflowTaskAction = _this.workflowTask.$$addWorkflowTaskAction();
	            _this.selectWorkflowTaskAction(workflowTaskAction);
	            _this.$log.debug(_this.workflow);
	        };
	        /**
	         * --------------------------------------------------------------------------------------------------------
	         * Selects a new task action and populates the task action properties.
	         * --------------------------------------------------------------------------------------------------------
	         */
	        this.selectWorkflowTaskAction = function (workflowTaskAction) {
	            _this.$log.debug("Selecting new task action for editing: ");
	            _this.$log.debug(workflowTaskAction);
	            _this.finished = false;
	            _this.workflowTaskActions.selectedTaskAction = undefined;
	            var filterPropertiesPromise = _this.$hibachi.getFilterPropertiesByBaseEntityName(_this.workflowTask.data.workflow.data.workflowObject);
	            filterPropertiesPromise.then(function (value) {
	                _this.filterPropertiesList = {
	                    baseEntityName: _this.workflowTask.data.workflow.data.workflowObject,
	                    baseEntityAlias: "_" + _this.workflowTask.data.workflow.data.workflowObject
	                };
	                _this.metadataService.setPropertiesList(value, _this.workflowTask.data.workflow.data.workflowObject);
	                _this.filterPropertiesList[_this.workflowTask.data.workflow.data.workflowObject] = _this.metadataService.getPropertiesListByBaseEntityAlias(_this.workflowTask.data.workflow.data.workflowObject);
	                _this.metadataService.formatPropertiesList(_this.filterPropertiesList[_this.workflowTask.data.workflow.data.workflowObject], _this.workflowTask.data.workflow.data.workflowObject);
	                _this.workflowTaskActions.selectedTaskAction = workflowTaskAction;
	                _this.emailTemplateSelected = (_this.workflowTaskActions.selectedTaskAction.data.emailTemplate) ? _this.workflowTaskActions.selectedTaskAction.data.emailTemplate.data.emailTemplateName : '';
	                _this.emailTemplateCollectionConfig = _this.collectionConfigService.newCollectionConfig("EmailTemplate");
	                _this.emailTemplateCollectionConfig.setDisplayProperties("emailTemplateID,emailTemplateName");
	                _this.emailTemplateCollectionConfig.addFilter("emailTemplateObject", _this.workflowTask.data.workflow.data.workflowObject);
	                _this.printTemplateSelected = (_this.workflowTaskActions.selectedTaskAction.data.printTemplate) ? _this.workflowTaskActions.selectedTaskAction.data.printTemplate.data.printTemplateName : '';
	                _this.printTemplateCollectionConfig = _this.collectionConfigService.newCollectionConfig("PrintTemplate");
	                _this.printTemplateCollectionConfig.setDisplayProperties("printTemplateID,printTemplateName");
	                _this.printTemplateCollectionConfig.addFilter("printTemplateObject", _this.workflowTask.data.workflow.data.workflowObject);
	            });
	        };
	        /**
	         * Overrides the confirm directive method deleteEntity. This is needed for the modal popup.
	         */
	        this.deleteEntity = function (entity) {
	            _this.removeWorkflowTaskAction(entity);
	        };
	        /**
	         * --------------------------------------------------------------------------------------------------------
	         * Removes a workflow task action by calling the selected tasks $$delete method
	         * and reindexes the list.
	         * --------------------------------------------------------------------------------------------------------
	         */
	        this.removeWorkflowTaskAction = function (workflowTaskAction) {
	            var deletePromise = workflowTaskAction.$$delete();
	            deletePromise.then(function () {
	                if (workflowTaskAction === _this.workflowTaskActions.selectedTaskAction) {
	                    delete _this.workflowTaskActions.selectedTaskAction;
	                }
	                _this.$log.debug("removeWorkflowTaskAction");
	                _this.$log.debug(workflowTaskAction);
	                _this.workflowTaskActions.splice(workflowTaskAction.$$actionIndex, 1);
	                for (var i in _this.workflowTaskActions) {
	                    _this.workflowTaskActions[i].$$actionIndex = i;
	                }
	            });
	        };
	        this.searchProcess = {
	            name: ''
	        };
	        /**
	         * Watches for changes in the proccess
	         */
	        this.showProcessOptions = false;
	        this.processOptions = {};
	        //this.$scope.$watch('swWorkflowTaskActions.searchProcess.name', (newValue, oldValue)=>{
	        //    if(newValue !== oldValue){
	        //        this.getProcessOptions(this.workflowTask.data.workflow.data.workflowObject);
	        //    }
	        //});
	        /**
	         * Retrieves the proccess options for a workflow trigger action.
	         */
	        this.getProcessOptions = function (objectName) {
	            if (!_this.processOptions.length) {
	                var proccessOptionsPromise = _this.$hibachi.getProcessOptions(objectName);
	                proccessOptionsPromise.then(function (value) {
	                    _this.$log.debug('getProcessOptions');
	                    _this.processOptions = value.data;
	                });
	            }
	            _this.showProcessOptions = true;
	        };
	        /**
	         * Changes the selected process option value.
	         */
	        this.selectProcess = function (processOption) {
	            _this.workflowTaskActions.selectedTaskAction.data.processMethod = processOption.value;
	            _this.searchProcess.name = processOption.name;
	            _this.workflowTaskActions.selectedTaskAction.forms.selectedTaskAction.$setDirty();
	            //this.searchProcess = processOption.name;
	            _this.showProcessOptions = false;
	        };
	        this.selectEmailTemplate = function (item) {
	            if (angular.isDefined(_this.workflowTaskActions.selectedTaskAction.data.emailTemplate)) {
	                _this.workflowTaskActions.selectedTaskAction.data.emailTemplate.data.emailTemplateID = item.emailTemplateID;
	            }
	            else {
	                var templateEmail = _this.$hibachi.newEmailTemplate();
	                templateEmail.data.emailTemplateID = item.emailTemplateID;
	                _this.workflowTaskActions.selectedTaskAction.$$setEmailTemplate(templateEmail);
	            }
	        };
	        this.selectPrintTemplate = function (item) {
	            if (angular.isDefined(_this.workflowTaskActions.selectedTaskAction.data.printTemplate)) {
	                _this.workflowTaskActions.selectedTaskAction.data.printTemplate.data.printTemplateID = item.printTemplateID;
	            }
	            else {
	                var templatePrint = _this.$hibachi.newPrintTemplate();
	                templatePrint.data.printTemplateID = item.printTemplateID;
	                _this.workflowTaskActions.selectedTaskAction.$$setPrintTemplate(templatePrint);
	            }
	        };
	    }
	    return SWWorkflowTaskActionsController;
	})();
	var SWWorkflowTaskActions = (function () {
	    function SWWorkflowTaskActions(workflowPartialsPath, hibachiPathBuilder) {
	        this.workflowPartialsPath = workflowPartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.restrict = 'AE';
	        this.scope = {};
	        this.bindToController = {
	            workflowTask: "="
	        };
	        this.controller = SWWorkflowTaskActionsController;
	        this.controllerAs = "swWorkflowTaskActions";
	        this.link = function ($scope, element, attrs) {
	        };
	        this.templateUrl = this.hibachiPathBuilder.buildPartialsPath(this.workflowPartialsPath) + "workflowtaskactions.html";
	    }
	    SWWorkflowTaskActions.Factory = function () {
	        var directive = function (workflowPartialsPath, hibachiPathBuilder) {
	            return new SWWorkflowTaskActions(workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['workflowPartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    SWWorkflowTaskActions.$inject = ['workflowPartialsPath', 'hibachiPathBuilder'];
	    return SWWorkflowTaskActions;
	})();
	exports.SWWorkflowTaskActions = SWWorkflowTaskActions;


/***/ },
/* 148 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Handles adding, editing, and deleting Workflows Tasks.
	 */
	var SWWorkflowTasks = (function () {
	    function SWWorkflowTasks($log, $hibachi, metadataService, workflowPartialsPath, hibachiPathBuilder) {
	        return {
	            restrict: 'A',
	            scope: {
	                workflow: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowtasks.html",
	            link: function (scope, element, attrs) {
	                scope.workflowPartialsPath = hibachiPathBuilder.buildPartialsPath(workflowPartialsPath);
	                scope.propertiesList = {};
	                function logger(context, message) {
	                    $log.debug("SwWorkflowTasks :" + context + " : " + message);
	                }
	                /**
	                 * Sets workflowTasks on the scope by populating with $$getWorkflowTasks()
	                 */
	                scope.getWorkflowTasks = function () {
	                    logger("getWorkflowTasks", "Retrieving items");
	                    logger("getWorkflowTasks", "Workflow Tasks");
	                    $log.debug(scope.workflowTasks);
	                    if (!scope.workflow.$$isPersisted()) {
	                        scope.workflow.data.workflowTasks = [];
	                        scope.workflowTasks = scope.workflow.data.workflowTasks;
	                        return;
	                    }
	                    /***
	                       Note:
	                       This conditional is checking whether or not we need to be retrieving to
	                       items all over again. If we already have them, we won't make another
	                       trip to the database.

	                     ***/
	                    if (angular.isUndefined(scope.workflow.data.workflowTasks)) {
	                        var workflowTasksPromise = scope.workflow.$$getWorkflowTasks();
	                        workflowTasksPromise.then(function () {
	                            scope.workflowTasks = scope.workflow.data.workflowTasks;
	                        });
	                    }
	                    else {
	                        logger("getWorkflowTasks", "Retrieving cached Items");
	                        scope.workflowTasks = scope.workflow.data.workflowTasks;
	                    }
	                    if (angular.isUndefined(scope.workflow.data.workflowTasks)) {
	                        //Reset the workflowTasks.
	                        logger("getWorkflowTasks", "workflowTasks is undefined.");
	                        scope.workflow.data.workflowTasks = [];
	                        scope.workflowTasks = scope.workflow.data.workflowTasks;
	                    }
	                };
	                scope.getWorkflowTasks(); //call tasks
	                /**
	                 * Sets the editing state to show/hide the edit screen.
	                 */
	                scope.setHidden = function (task) {
	                    if (!angular.isObject(task) || angular.isUndefined(task.hidden)) {
	                        task.hidden = false;
	                    }
	                    else {
	                        logger("setHidden()", "Setting Hide Value To " + !task.hidden);
	                        task.hidden = !task.hidden;
	                    }
	                };
	                /**
	                 * Add a workflow task and logs the result.
	                 */
	                scope.addWorkflowTask = function () {
	                    var newWorkflowTask = scope.workflow.$$addWorkflowTask();
	                    logger("var newWorkflowTask", newWorkflowTask);
	                    scope.selectWorkflowTask(newWorkflowTask);
	                };
	                /**
	                  * Watches the select for changes.
	                  */
	                scope.$watch('workflowTasks.selectedTask.data.workflow.data.workflowObject', function (newValue, oldValue) {
	                    logger("scope.$watch", "Change Detected " + newValue + " from " + oldValue);
	                    if ((newValue !== oldValue && angular.isDefined(scope.workflowTasks.selectedTask))) {
	                        logger("scope.$watch", "Change to " + newValue);
	                        scope.workflowTasks.selectedTask.data.taskConditionsConfig.baseEntityAlias = newValue;
	                        scope.workflowTasks.selectedTask.data.taskConditionsConfig.baseEntityName = newValue;
	                    }
	                });
	                /**
	                   * --------------------------------------------------------------------------------------------------------
	                   * Saves the workflow task by calling the objects $$save method.
	                   * @param task
	                   * --------------------------------------------------------------------------------------------------------
	                   */
	                scope.saveWorkflowTask = function (task, context) {
	                    console.log("Context: " + context);
	                    console.log("saving task");
	                    console.log(scope.workflowTasks.selectedTask);
	                    //scope.workflowTasks.selectedTask.$$setWorkflow(scope.workflow);
	                    scope.workflowTasks.selectedTask.$$save().then(function (res) {
	                        scope.done = true;
	                        delete scope.workflowTasks.selectedTask;
	                        if (context === 'add') {
	                            logger("SaveWorkflowTask", "Save and New");
	                            scope.addWorkflowTask();
	                            scope.finished = true;
	                        }
	                        else if (context == "finish") {
	                            scope.finished = false;
	                        }
	                    }, function (err) {
	                    });
	                }; //<--end save*/
	                /**
	                 * Select a workflow task.
	                 */
	                scope.selectWorkflowTask = function (workflowTask) {
	                    scope.done = false;
	                    logger("selectWorkflowTask", "selecting a workflow task");
	                    $log.debug(workflowTask);
	                    scope.finished = false;
	                    scope.workflowTasks.selectedTask = undefined;
	                    var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(scope.workflow.data.workflowObject);
	                    filterPropertiesPromise.then(function (value) {
	                        scope.filterPropertiesList = {
	                            baseEntityName: scope.workflow.data.workflowObject,
	                            baseEntityAlias: "_" + scope.workflow.data.workflowObject
	                        };
	                        metadataService.setPropertiesList(value, scope.workflow.data.workflowObject);
	                        scope.filterPropertiesList[scope.workflow.data.workflowObject] = metadataService.getPropertiesListByBaseEntityAlias(scope.workflow.data.workflowObject);
	                        metadataService.formatPropertiesList(scope.filterPropertiesList[scope.workflow.data.workflowObject], scope.workflow.data.workflowObject);
	                        scope.workflowTasks.selectedTask = workflowTask;
	                    });
	                };
	                /* Does a delete of the property using delete */
	                scope.softRemoveTask = function (workflowTask) {
	                    logger("SoftRemoveTask", "calling delete");
	                    if (workflowTask === scope.workflowTasks.selectedTask) {
	                        delete scope.workflowTasks.selectedTask;
	                    }
	                    scope.removeIndexFromTasks(workflowTask.$$index);
	                    scope.reindexTaskList();
	                };
	                /* Does an API call delete using $$delete */
	                scope.hardRemoveTask = function (workflowTask) {
	                    logger("HardRemoveTask", "$$delete");
	                    var deletePromise = workflowTask.$$delete();
	                    deletePromise.then(function () {
	                        if (workflowTask === scope.workflowTasks.selectedTask) {
	                            delete scope.workflowTasks.selectedTask;
	                        }
	                        scope.removeIndexFromTasks(workflowTask.$$index);
	                        scope.reindexTaskList();
	                    });
	                };
	                /*Override the delete entity in the confirmation controller*/
	                scope.deleteEntity = function (entity) {
	                    scope.hardRemoveTask(entity);
	                };
	                /* Re-indexes the task list */
	                scope.reindexTaskList = function () {
	                    for (var i in scope.workflowTasks) {
	                        logger("ReIndexing the list", i);
	                        scope.workflowTasks[i].$$index = i;
	                    }
	                };
	                /* Removes the tasks index from the tasks array */
	                scope.removeIndexFromTasks = function (index) {
	                    logger("RemoveIndexFromTasks", index);
	                    scope.workflowTasks.splice(index, 1);
	                };
	            }
	        };
	    }
	    SWWorkflowTasks.Factory = function () {
	        var directive = function ($log, $hibachi, metadataService, workflowPartialsPath, hibachiPathBuilder) {
	            return new SWWorkflowTasks($log, $hibachi, metadataService, workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            'metadataService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder'
	        ];
	        return directive;
	    };
	    return SWWorkflowTasks;
	})();
	exports.SWWorkflowTasks = SWWorkflowTasks;


/***/ },
/* 149 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowTrigger = (function () {
	    function SWWorkflowTrigger($hibachi, alertService, metadataService, workflowPartialsPath, hibachiPathBuilder, $http) {
	        return {
	            restrict: 'A',
	            replace: true,
	            scope: {
	                workflowTrigger: "=",
	                workflowTriggers: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowtrigger.html",
	            link: function (scope, element, attrs) {
	                console.log('workflow trigger init');
	                /**
	                 * Selects the current workflow trigger.
	                 */
	                scope.selectWorkflowTrigger = function (workflowTrigger) {
	                    console.log('SelectWorkflowTriggers');
	                    scope.done = false;
	                    console.log(workflowTrigger);
	                    scope.finished = false;
	                    scope.workflowTriggers.selectedTrigger = undefined;
	                    var filterPropertiesPromise = $hibachi.getFilterPropertiesByBaseEntityName(scope.workflowTrigger.data.workflow.data.workflowObject);
	                    filterPropertiesPromise.then(function (value) {
	                        scope.filterPropertiesList = {
	                            baseEntityName: scope.workflowTrigger.data.workflow.data.workflowObject,
	                            baseEntityAlias: "_" + scope.workflowTrigger.data.workflow.data.workflowObject
	                        };
	                        metadataService.setPropertiesList(value, scope.workflowTrigger.data.workflow.data.workflowObject);
	                        scope.filterPropertiesList[scope.workflowTrigger.data.workflow.data.workflowObject] = metadataService.getPropertiesListByBaseEntityAlias(scope.workflowTrigger.data.workflow.data.workflowObject);
	                        metadataService.formatPropertiesList(scope.filterPropertiesList[scope.workflowTrigger.data.workflow.data.workflowObject], scope.workflowTrigger.data.workflow.data.workflowObject);
	                        scope.workflowTriggers.selectedTrigger = workflowTrigger;
	                    });
	                };
	                scope.executingTrigger = false;
	                scope.executeWorkflowTrigger = function (workflowTrigger) {
	                    if (scope.executingTrigger)
	                        return;
	                    if (!workflowTrigger.data.workflow.data.workflowTasks || !workflowTrigger.data.workflow.data.workflowTasks.length) {
	                        var alert = alertService.newAlert();
	                        alert.msg = "You don't have any  Task yet!";
	                        alert.type = "error";
	                        alert.fade = true;
	                        alertService.addAlert(alert);
	                        return;
	                    }
	                    scope.executingTrigger = true;
	                    var appConfig = $hibachi.getConfig();
	                    var urlString = appConfig.baseURL + '/index.cfm/?' + appConfig.action + '=admin:workflow.executeScheduleWorkflowTrigger&workflowTriggerID=' + workflowTrigger.data.workflowTriggerID;
	                    $http.get(urlString).finally(function () {
	                        scope.executingTrigger = false;
	                        var alert = alertService.newAlert();
	                        alert.msg = "Task Triggered Successfully. Check History for Status";
	                        alert.type = "success";
	                        alert.fade = true;
	                        alertService.addAlert(alert);
	                    });
	                };
	                /**
	                 * Overrides the delete function for the confirmation modal. Delegates to the normal delete method.
	                 */
	                scope.deleteEntity = function (entity) {
	                    console.log("Delete Called");
	                    console.log(entity);
	                    scope.deleteTrigger(entity);
	                };
	                /**
	                 * Hard deletes a workflow trigger
	                 */
	                scope.deleteTrigger = function (workflowTrigger) {
	                    var deleteTriggerPromise = $hibachi.saveEntity('WorkflowTrigger', workflowTrigger.data.workflowTriggerID, {}, 'Delete');
	                    deleteTriggerPromise.then(function (value) {
	                        console.log('deleteTrigger');
	                        scope.workflowTriggers.splice(workflowTrigger.$$index, 1);
	                    });
	                };
	            }
	        };
	    }
	    SWWorkflowTrigger.Factory = function () {
	        var directive = function ($hibachi, alertService, metadataService, workflowPartialsPath, hibachiPathBuilder, $http) {
	            return new SWWorkflowTrigger($hibachi, alertService, metadataService, workflowPartialsPath, hibachiPathBuilder, $http);
	        };
	        directive.$inject = [
	            '$hibachi',
	            'alertService',
	            'metadataService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder',
	            '$http'
	        ];
	        return directive;
	    };
	    return SWWorkflowTrigger;
	})();
	exports.SWWorkflowTrigger = SWWorkflowTrigger;


/***/ },
/* 150 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowTriggers = (function () {
	    function SWWorkflowTriggers($hibachi, workflowPartialsPath, formService, observerService, hibachiPathBuilder, collectionConfigService, scheduleService, dialogService, $timeout) {
	        return {
	            restrict: 'E',
	            scope: {
	                workflow: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowtriggers.html",
	            link: function (scope, element, attrs, formController) {
	                scope.schedule = {};
	                scope.$watch('workflowTriggers.selectedTrigger', function (newValue, oldValue) {
	                    if (newValue !== undefined && newValue !== oldValue) {
	                        console.log('Ooh watch me, watch me', newValue);
	                        if (newValue.data.triggerType == 'Schedule') {
	                            if (angular.isDefined(newValue.data.schedule)) {
	                                scope.schedule.selectedName = newValue.data.schedule.data.scheduleName;
	                                scope.selectSchedule(newValue.data.schedule.data);
	                            }
	                            if (angular.isDefined(newValue.data.scheduleCollection)) {
	                                scope.selectedCollection = newValue.data.scheduleCollection.data.collectionName;
	                            }
	                        }
	                        else if (newValue.data.triggerEventTitle) {
	                            scope.searchEvent.name = newValue.data.triggerEventTitle;
	                        }
	                    }
	                });
	                scope.collectionCollectionConfig = collectionConfigService.newCollectionConfig("Collection");
	                scope.collectionCollectionConfig.setDisplayProperties("collectionID,collectionName");
	                scope.collectionCollectionConfig.addFilter("collectionObject", scope.workflow.data.workflowObject);
	                observerService.attach(function (item) {
	                    scope.collectionCollectionConfig.clearFilters();
	                    scope.collectionCollectionConfig.addFilter("collectionObject", item.value);
	                    scope.eventOptions = [];
	                }, 'WorkflowWorkflowObjectOnChange');
	                scope.scheduleCollectionConfig = collectionConfigService.newCollectionConfig("Schedule");
	                scope.scheduleCollectionConfig.setDisplayProperties("scheduleID,scheduleName,daysOfMonthToRun,daysOfWeekToRun,recuringType,frequencyStartTime,frequencyEndTime,frequencyInterval");
	                scope.daysOfweek = [];
	                scope.daysOfMonth = [];
	                console.log('Workflow triggers init');
	                scope.$id = 'swWorkflowTriggers';
	                /**
	                 * Retrieves the workflow triggers.
	                 */
	                scope.getWorkflowTriggers = function () {
	                    /***
	                       Note:
	                       This conditional is checking whether or not we need to be retrieving to
	                       items all over again. If we already have them, we won't make another
	                       trip to the database.

	                    ***/
	                    if (!scope.workflow.$$isPersisted()) {
	                        scope.workflow.data.workflowTriggers = [];
	                        scope.workflowTriggers = scope.workflow.data.workflowTriggers;
	                        return;
	                    }
	                    if (angular.isUndefined(scope.workflow.data.workflowTriggers)) {
	                        var workflowTriggersPromise = scope.workflow.$$getWorkflowTriggers();
	                        workflowTriggersPromise.then(function () {
	                            scope.workflowTriggers = scope.workflow.data.workflowTriggers;
	                            console.log('workflowtriggers');
	                            console.log(scope.workflowTriggers);
	                            /* resets the workflow trigger */
	                            if (angular.isUndefined(scope.workflow.data.workflowTriggers)) {
	                                scope.workflow.data.workflowTriggers = [];
	                                scope.workflowTriggers = scope.workflow.data.workflowTriggers;
	                            }
	                            angular.forEach(scope.workflowTriggers, function (workflowTrigger, key) {
	                                console.log('trigger');
	                                console.log(workflowTrigger);
	                                if (workflowTrigger.data.triggerType === 'Schedule') {
	                                    workflowTrigger.$$getSchedule();
	                                    workflowTrigger.$$getScheduleCollection();
	                                } //<---end if
	                            }); //<---end forEach
	                        }); //<---end workflow triggers promise
	                    }
	                    else {
	                        //Use the cached versions.
	                        scope.workflowTriggers = scope.workflow.data.workflowTriggers;
	                    } //<---end else
	                };
	                scope.getWorkflowTriggers(); //call triggers
	                scope.showCollections = false;
	                scope.collections = [];
	                scope.searchEvent = {
	                    name: ''
	                };
	                /**
	                 * Watches for changes in the event
	                 */
	                scope.showEventOptions = false;
	                scope.eventOptions = [];
	                /**
	                 * Retrieves the event options for a workflow trigger item.
	                 */
	                scope.getEventOptions = function (objectName) {
	                    if (!scope.eventOptions.length) {
	                        var eventOptionsPromise = $hibachi.getEventOptions(objectName);
	                        eventOptionsPromise.then(function (value) {
	                            console.log('getEventOptions');
	                            scope.eventOptions = value.data;
	                            console.log(scope.eventOptions.name);
	                        });
	                    }
	                    scope.showEventOptions = !scope.showEventOptions;
	                };
	                /**
	                 * Saves the workflow triggers.
	                 */
	                scope.saveWorkflowTrigger = function (context) {
	                    if (!scope.workflowTriggers.selectedTrigger.$$isPersisted()) {
	                        scope.workflowTriggers.selectedTrigger.$$setWorkflow(scope.workflow);
	                        console.warn(scope.workflow);
	                    }
	                    var saveWorkflowTriggerPromise = scope.workflowTriggers.selectedTrigger.$$save();
	                    saveWorkflowTriggerPromise.then(function () {
	                        scope.showEventOptions = true;
	                        scope.searchEvent = {
	                            name: ''
	                        };
	                        scope.schedule.selectedName = '';
	                        scope.schedulePreview = {};
	                        //Clear the form by adding a new task action if 'save and add another' otherwise, set save and set finished
	                        if (context == 'add') {
	                            console.log("Save and New");
	                            scope.addWorkflowTrigger();
	                        }
	                        else if (context == "finish") {
	                            scope.workflowTriggers.selectedTrigger = undefined;
	                        }
	                    });
	                };
	                scope.closeTrigger = function () {
	                    console.warn("workflow", scope.workflow);
	                    if (!scope.workflowTriggers.selectedTrigger.$$isPersisted()) {
	                        scope.workflowTriggers.selectedTrigger.$$setWorkflow();
	                    }
	                    scope.workflowTriggers.selectedTrigger = undefined;
	                };
	                /**
	                 * Changes the selected trigger value.
	                 */
	                scope.selectEvent = function (eventOption) {
	                    console.log("SelectEvent");
	                    console.log(eventOption);
	                    //Needs to clear old and set new.
	                    scope.workflowTriggers.selectedTrigger.data.triggerEventTitle = eventOption.name;
	                    scope.workflowTriggers.selectedTrigger.data.triggerEvent = eventOption.value;
	                    if (eventOption.entityName == scope.workflow.data.workflowObject) {
	                        scope.workflowTriggers.selectedTrigger.data.objectPropertyIdentifier = '';
	                    }
	                    else {
	                        scope.workflowTriggers.selectedTrigger.data.objectPropertyIdentifier = eventOption.entityName;
	                    }
	                    scope.searchEvent.name = eventOption.name;
	                    scope.showEventOptions = false;
	                    console.log(eventOption);
	                    console.log(scope.workflowTriggers);
	                };
	                /**
	                 * Selects a new collection.
	                 */
	                scope.selectCollection = function (collection) {
	                    console.log('selectCollection');
	                    scope.workflowTriggers.selectedTrigger.data.scheduleCollection = collection;
	                    scope.showCollections = false;
	                };
	                /**
	                 * Removes a workflow trigger
	                 */
	                scope.removeWorkflowTrigger = function (workflowTrigger) {
	                    if (workflowTrigger === scope.workflowTriggers.selectedTrigger) {
	                        delete scope.workflowTriggers.selectedTrigger;
	                    }
	                    scope.workflowTriggers.splice(workflowTrigger.$$index, 1);
	                };
	                scope.setAsEvent = function (workflowTrigger) {
	                    //add event,  clear schedule
	                };
	                scope.setAsSchedule = function (workflowTrigger) {
	                };
	                /**
	                 * Adds a workflow trigger.
	                 */
	                scope.addWorkflowTrigger = function () {
	                    console.log('addWorkflowTrigger', scope.schedule);
	                    var newWorkflowTrigger = $hibachi.newWorkflowTrigger();
	                    scope.workflowTriggers.selectedTrigger = newWorkflowTrigger;
	                };
	                scope.addNewSchedule = function () {
	                    scope.createSchedule = true;
	                    scope.scheduleEntity = $hibachi.newSchedule();
	                };
	                scope.saveSchedule = function () {
	                    if (scope.scheduleEntity.data.recuringType == 'weekly') {
	                        scope.scheduleEntity.data.daysOfWeekToRun = scope.daysOfweek.filter(Number).join();
	                    }
	                    else if (scope.scheduleEntity.data.recuringType == 'monthly') {
	                        scope.scheduleEntity.data.daysOfMonthToRun = scope.daysOfMonth.filter(Number).join();
	                    }
	                    scope.scheduleEntity.$$save().then(function (res) {
	                        scope.schedule.selectedName = angular.copy(scope.scheduleEntity.data.scheduleName);
	                        scope.selectSchedule(angular.copy(scope.scheduleEntity.data));
	                        formService.resetForm(scope.scheduleEntity.forms['scheduleForm']);
	                        scope.createSchedule = false;
	                    }, function () {
	                        console.log('ERROR');
	                    });
	                };
	                scope.selectCollection = function (item) {
	                    if (item === undefined) {
	                        scope.workflowTriggers.selectedTrigger.$$setScheduleCollection();
	                        return;
	                    }
	                    if (angular.isDefined(scope.workflowTriggers.selectedTrigger.data.scheduleCollection)) {
	                        scope.workflowTriggers.selectedTrigger.data.scheduleCollection.data.collectionID = item.collectionID;
	                        scope.workflowTriggers.selectedTrigger.data.scheduleCollection.data.collectionName = item.collectionName;
	                    }
	                    else {
	                        var _collection = $hibachi.newCollection();
	                        _collection.data.collectionID = item.collectionID;
	                        _collection.data.collectionName = item.collectionName;
	                        scope.workflowTriggers.selectedTrigger.$$setScheduleCollection(_collection);
	                    }
	                };
	                scope.viewCollection = function () {
	                    if (angular.isDefined(scope.workflowTriggers.selectedTrigger.data.scheduleCollection)) {
	                        dialogService.addPageDialog('org/Hibachi/client/src/collection/components/criteriacreatecollection', {
	                            entityName: 'Collection',
	                            entityId: scope.workflowTriggers.selectedTrigger.data.scheduleCollection.data.collectionID,
	                            readOnly: true
	                        });
	                    }
	                };
	                scope.selectSchedule = function (item) {
	                    if (item === undefined) {
	                        scope.schedulePreview = {};
	                        scope.workflowTriggers.selectedTrigger.$$setSchedule();
	                        return;
	                    }
	                    scope.schedulePreview = scheduleService.buildSchedulePreview(item, 6);
	                    if (angular.isDefined(scope.workflowTriggers.selectedTrigger.data.schedule)) {
	                        scope.workflowTriggers.selectedTrigger.data.schedule.data.scheduleID = item.scheduleID;
	                        scope.workflowTriggers.selectedTrigger.data.schedule.data.scheduleName = item.scheduleName;
	                    }
	                    else {
	                        var _schedule = $hibachi.newSchedule();
	                        _schedule.data.scheduleID = item.scheduleID;
	                        _schedule.data.scheduleName = item.scheduleName;
	                        scope.workflowTriggers.selectedTrigger.$$setSchedule(_schedule);
	                    }
	                };
	            }
	        };
	    }
	    SWWorkflowTriggers.Factory = function () {
	        var directive = function ($hibachi, workflowPartialsPath, formService, observerService, hibachiPathBuilder, collectionConfigService, scheduleService, dialogService, $timeout) {
	            return new SWWorkflowTriggers($hibachi, workflowPartialsPath, formService, observerService, hibachiPathBuilder, collectionConfigService, scheduleService, dialogService, $timeout);
	        };
	        directive.$inject = [
	            '$hibachi',
	            'workflowPartialsPath',
	            'formService',
	            'observerService',
	            'hibachiPathBuilder',
	            'collectionConfigService',
	            'scheduleService',
	            'dialogService',
	            '$timeout'
	        ];
	        return directive;
	    };
	    return SWWorkflowTriggers;
	})();
	exports.SWWorkflowTriggers = SWWorkflowTriggers;


/***/ },
/* 151 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWWorkflowTriggerHistory = (function () {
	    function SWWorkflowTriggerHistory($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder, $rootScope) {
	        return {
	            restrict: 'A',
	            scope: {
	                workflow: "="
	            },
	            templateUrl: hibachiPathBuilder.buildPartialsPath(workflowPartialsPath) + "workflowtriggerhistory.html",
	            link: function (scope, element, attrs) {
	                $rootScope.workflowID = scope.workflow.data.workflowID;
	            }
	        };
	    }
	    SWWorkflowTriggerHistory.Factory = function () {
	        var directive = function ($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder, $rootScope) {
	            return new SWWorkflowTriggerHistory($log, $location, $hibachi, formService, workflowPartialsPath, hibachiPathBuilder, $rootScope);
	        };
	        directive.$inject = [
	            '$log',
	            '$location',
	            '$hibachi',
	            'formService',
	            'workflowPartialsPath',
	            'hibachiPathBuilder',
	            '$rootScope'
	        ];
	        return directive;
	    };
	    return SWWorkflowTriggerHistory;
	})();
	exports.SWWorkflowTriggerHistory = SWWorkflowTriggerHistory;


/***/ },
/* 152 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWSchedulePreviewController = (function () {
	    function SWSchedulePreviewController() {
	    }
	    return SWSchedulePreviewController;
	})();
	var SWSchedulePreview = (function () {
	    function SWSchedulePreview(workflowPartialsPath, hibachiPathBuilder) {
	        this.workflowPartialsPath = workflowPartialsPath;
	        this.hibachiPathBuilder = hibachiPathBuilder;
	        this.restrict = 'AE';
	        this.scope = {};
	        this.bindToController = {
	            schedule: "="
	        };
	        this.controller = SWSchedulePreviewController;
	        this.controllerAs = "swSchedulePreview";
	        this.templateUrl = this.hibachiPathBuilder.buildPartialsPath(this.workflowPartialsPath) + "schedulepreview.html";
	    }
	    SWSchedulePreview.Factory = function () {
	        var directive = function (workflowPartialsPath, hibachiPathBuilder) {
	            return new SWSchedulePreview(workflowPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ['workflowPartialsPath', 'hibachiPathBuilder'];
	        return directive;
	    };
	    SWSchedulePreview.$inject = ['workflowPartialsPath', 'hibachiPathBuilder'];
	    return SWSchedulePreview;
	})();
	exports.SWSchedulePreview = SWSchedulePreview;


/***/ },
/* 153 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/hibachiTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWSaveAndFinishController = (function () {
	    //@ngInject
	    function SWSaveAndFinishController($hibachi, dialogService, alertService, rbkeyService, $log) {
	        var _this = this;
	        this.$hibachi = $hibachi;
	        this.dialogService = dialogService;
	        this.alertService = alertService;
	        this.rbkeyService = rbkeyService;
	        this.$log = $log;
	        this.saving = false;
	        this.initialSetup = function () {
	            if (!angular.isDefined(_this.finish)) {
	                _this.openNewDialog = false;
	            }
	            else {
	                _this.openNewDialog = (_this.finish.toLowerCase() == 'true') ? false : true;
	            }
	            if (_this.openNewDialog) {
	                _this.rbKey = 'admin.define.saveandnew';
	            }
	            else {
	                _this.rbKey = 'admin.define.saveandfinish';
	            }
	        };
	        this.save = function () {
	            _this.saving = true;
	            var savePromise = _this.entity.$$save();
	            savePromise.then(function (data) {
	                _this.dialogService.removeCurrentDialog();
	                if (_this.openNewDialog && angular.isDefined(_this.partial)) {
	                    _this.dialogService.addPageDialog(_this.partial);
	                }
	                else {
	                    if (angular.isDefined(_this.redirectUrl)) {
	                        window.location = _this.redirectUrl;
	                    }
	                    else if (angular.isDefined(_this.redirectAction)) {
	                        if (angular.isUndefined(_this.redirectQueryString)) {
	                            _this.redirectQueryString = "";
	                        }
	                        window.location = _this.$hibachi.buildUrl(_this.redirectAction, _this.redirectQueryString);
	                    }
	                    else {
	                        _this.$log.debug("You did not specify a redirect for swSaveAndFinish");
	                    }
	                }
	            }).catch(function (data) {
	                if (angular.isDefined(_this.customErrorRbkey)) {
	                    data = _this.rbkeyService.getRBKey(_this.customErrorRbkey);
	                }
	                if (angular.isString(data)) {
	                    var alert = _this.alertService.newAlert();
	                    alert.msg = data;
	                    alert.type = "error";
	                    alert.fade = true;
	                    _this.alertService.addAlert(alert);
	                }
	                else {
	                    _this.alertService.addAlerts(data);
	                }
	            }).finally(function () {
	                _this.saving = false;
	            });
	        };
	        if (!angular.isFunction(this.entity.$$save)) {
	            throw ("Your entity does not have the $$save function.");
	        }
	        this.initialSetup();
	    }
	    return SWSaveAndFinishController;
	})();
	exports.SWSaveAndFinishController = SWSaveAndFinishController;
	var SWSaveAndFinish = (function () {
	    //@ngInject
	    function SWSaveAndFinish(hibachiPartialsPath, hibachiPathBuilder) {
	        this.hibachiPartialsPath = hibachiPartialsPath;
	        this.restrict = "EA";
	        this.scope = {};
	        this.controller = SWSaveAndFinishController;
	        this.controllerAs = "swSaveAndFinish";
	        this.bindToController = {
	            entity: "=",
	            redirectUrl: "@?",
	            redirectAction: "@?",
	            redirectQueryString: "@?",
	            finish: "@?",
	            partial: "@?",
	            customErrorRbkey: "@?"
	        };
	        this.templateUrl = hibachiPathBuilder.buildPartialsPath(hibachiPartialsPath) + "saveandfinish.html";
	    }
	    SWSaveAndFinish.Factory = function () {
	        var directive = function (hibachiPartialsPath, hibachiPathBuilder) {
	            return new SWSaveAndFinish(hibachiPartialsPath, hibachiPathBuilder);
	        };
	        directive.$inject = ["hibachiPartialsPath", "hibachiPathBuilder"];
	        return directive;
	    };
	    return SWSaveAndFinish;
	})();
	exports.SWSaveAndFinish = SWSaveAndFinish;


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//modules
	var core_module_1 = __webpack_require__(2);
	//services
	//filters
	//directives
	var swcontentbasic_1 = __webpack_require__(155);
	var swcontenteditor_1 = __webpack_require__(156);
	var swcontentlist_1 = __webpack_require__(157);
	var swcontentnode_1 = __webpack_require__(158);
	var contentmodule = angular.module('hibachi.content', [core_module_1.coremodule.name]).config(function () {
	})
	    .constant('contentPartialsPath', 'content/components/')
	    .directive('swContentBasic', swcontentbasic_1.SWContentBasic.Factory())
	    .directive('swContentEditor', swcontenteditor_1.SWContentEditor.Factory())
	    .directive('swContentList', swcontentlist_1.SWContentList.Factory())
	    .directive('swContentNode', swcontentnode_1.SWContentNode.Factory());
	exports.contentmodule = contentmodule;


/***/ },
/* 155 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWContentBasic = (function () {
	    function SWContentBasic($log, $routeParams, $hibachi, formService, contentPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: 'EA',
	            templateUrl: slatwallPathBuilder.buildPartialsPath(contentPartialsPath) + "contentbasic.html",
	            link: function (scope, element, attrs) {
	                if (!scope.content.$$isPersisted()) {
	                    if (angular.isDefined($routeParams.siteID)) {
	                        var sitePromise;
	                        var options = {
	                            id: $routeParams.siteID
	                        };
	                        sitePromise = $hibachi.getSite(options);
	                        sitePromise.promise.then(function () {
	                            var site = sitePromise.value;
	                            scope.content.$$setSite(site);
	                        });
	                    }
	                    else {
	                        var site = $hibachi.newSite();
	                        scope.content.$$setSite(site);
	                    }
	                    var parentContent;
	                    if (angular.isDefined($routeParams.parentContentID)) {
	                        var parentContentPromise;
	                        var options = {
	                            id: $routeParams.parentContentID
	                        };
	                        parentContentPromise = $hibachi.getContent(options);
	                        parentContentPromise.promise.then(function () {
	                            var parentContent = parentContentPromise.value;
	                            scope.content.$$setParentContent(parentContent);
	                            $log.debug('contenttest');
	                            $log.debug(scope.content);
	                        });
	                    }
	                    else {
	                        var parentContent = $hibachi.newContent();
	                        scope.content.$$setParentContent(parentContent);
	                    }
	                    var contentTemplateType = $hibachi.newType();
	                    scope.content.$$setContentTemplateType(contentTemplateType);
	                }
	                else {
	                    scope.content.$$getSite();
	                    scope.content.$$getParentContent();
	                    scope.content.$$getContentTemplateType();
	                }
	            }
	        };
	    }
	    SWContentBasic.Factory = function () {
	        var directive = function ($log, $routeParams, $hibachi, formService, contentPartialsPath, slatwallPathBuilder) {
	            return new SWContentBasic($log, $routeParams, $hibachi, formService, contentPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$routeParams',
	            '$hibachi',
	            'formService',
	            'contentPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWContentBasic;
	})();
	exports.SWContentBasic = SWContentBasic;


/***/ },
/* 156 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWContentEditor = (function () {
	    function SWContentEditor($log, $location, $http, $hibachi, formService, contentPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: 'EA',
	            scope: {
	                content: "="
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(contentPartialsPath) + "contenteditor.html",
	            link: function (scope, element, attrs) {
	                scope.editorOptions = CKEDITOR.editorConfig;
	                scope.onContentChange = function () {
	                    var form = formService.getForm('contentEditor');
	                    form.contentBody.$setDirty();
	                };
	                //                scope.saveContent = function(){
	                //                   var urlString = _config.baseURL+'/index.cfm/?slatAction=api:main.post';
	                //                   var params = {
	                //                        entityID:scope.content.contentID,
	                //                        templateHTML:scope.content.templateHTML,
	                //                        context:'saveTemplateHTML',
	                //                        entityName:'content'
	                //                   }
	                //                   $http.post(urlString,
	                //                        {
	                //                            params:params
	                //                        }
	                //                    )
	                //                    .success(function(data){
	                //                    }).error(function(reason){
	                //                    });
	                //                }
	            }
	        };
	    }
	    SWContentEditor.Factory = function () {
	        var directive = function ($log, $location, $http, $hibachi, formService, contentPartialsPath, slatwallPathBuilder) {
	            return new SWContentEditor($log, $location, $http, $hibachi, formService, contentPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$location',
	            '$http',
	            '$hibachi',
	            'formService',
	            'contentPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWContentEditor;
	})();
	exports.SWContentEditor = SWContentEditor;


/***/ },
/* 157 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWContentListController = (function () {
	    //@ngInject
	    function SWContentListController($scope, $log, $timeout, $hibachi, paginationService, observerService, collectionConfigService, localStorageService) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$log = $log;
	        this.$timeout = $timeout;
	        this.$hibachi = $hibachi;
	        this.paginationService = paginationService;
	        this.observerService = observerService;
	        this.collectionConfigService = collectionConfigService;
	        this.localStorageService = localStorageService;
	        this.openRoot = true;
	        this.$log.debug('slatwallcontentList init');
	        var pageShow = 50;
	        if (this.pageShow !== 'Auto') {
	            pageShow = this.pageShow;
	        }
	        this.pageShowOptions = [
	            { display: 10, value: 10 },
	            { display: 20, value: 20 },
	            { display: 50, value: 50 },
	            { display: 250, value: 250 }
	        ];
	        this.loadingCollection = false;
	        if (this.localStorageService.hasItem('selectedSiteOption')) {
	            this.selectedSite = this.localStorageService.getItem('selectedSiteOption');
	        }
	        this.orderBy;
	        var orderByConfig;
	        this.getCollection = function (isSearching) {
	            _this.collectionConfig = collectionConfigService.newCollectionConfig('Content');
	            var columnsConfig = [
	                //{"propertyIdentifier":"_content_childContents","title":"","isVisible":true,"isDeletable":true,"isSearchable":true,"isExportable":true,"ormtype":"string","aggregate":{"aggregateFunction":"COUNT","aggregateAlias":"childContentsCount"}},
	                {
	                    propertyIdentifier: '_content.contentID',
	                    isVisible: false,
	                    ormtype: 'id',
	                    isSearchable: true
	                },
	                {
	                    propertyIdentifier: '_content.urlTitlePath',
	                    isVisible: false,
	                    isSearchable: true
	                },
	                //need to get template via settings
	                {
	                    propertyIdentifier: '_content.allowPurchaseFlag',
	                    isVisible: true,
	                    ormtype: 'boolean',
	                    isSearchable: false
	                },
	                {
	                    propertyIdentifier: '_content.productListingPageFlag',
	                    isVisible: true,
	                    ormtype: 'boolean',
	                    isSearchable: false
	                },
	                {
	                    propertyIdentifier: '_content.activeFlag',
	                    isVisible: true,
	                    ormtype: 'boolean',
	                    isSearchable: false
	                }
	            ];
	            var options = {
	                currentPage: '1',
	                pageShow: '1',
	                keywords: _this.keywords
	            };
	            var column = {};
	            if (!isSearching || _this.keywords === '') {
	                _this.isSearching = false;
	                var filterGroupsConfig = [
	                    {
	                        "filterGroup": [
	                            {
	                                "propertyIdentifier": "parentContent",
	                                "comparisonOperator": "is",
	                                "value": 'null'
	                            }
	                        ]
	                    }
	                ];
	                column = {
	                    propertyIdentifier: '_content.title',
	                    isVisible: true,
	                    ormtype: 'string',
	                    isSearchable: true,
	                    tdclass: 'primary'
	                };
	                columnsConfig.unshift(column);
	            }
	            else {
	                _this.collectionConfig.setKeywords(_this.keywords);
	                _this.isSearching = true;
	                var filterGroupsConfig = [
	                    {
	                        "filterGroup": [
	                            {
	                                "propertyIdentifier": "excludeFromSearch",
	                                "comparisonOperator": "!=",
	                                "value": true
	                            }
	                        ]
	                    }
	                ];
	                column = {
	                    propertyIdentifier: '_content.title',
	                    isVisible: false,
	                    ormtype: 'string',
	                    isSearchable: true
	                };
	                columnsConfig.unshift(column);
	                var titlePathColumn = {
	                    propertyIdentifier: '_content.titlePath',
	                    isVisible: true,
	                    ormtype: 'string',
	                    isSearchable: false
	                };
	                columnsConfig.unshift(titlePathColumn);
	            }
	            //if we have a selected Site add the filter
	            if (_this.selectedSite && _this.selectedSite.siteID) {
	                var selectedSiteFilter = {
	                    logicalOperator: "AND",
	                    propertyIdentifier: "site.siteID",
	                    comparisonOperator: "=",
	                    value: _this.selectedSite.siteID
	                };
	                filterGroupsConfig[0].filterGroup.push(selectedSiteFilter);
	            }
	            if (angular.isDefined(_this.orderBy)) {
	                var orderByConfig = [];
	                orderByConfig.push(_this.orderBy);
	                options.orderByConfig = angular.toJson(orderByConfig);
	            }
	            angular.forEach(columnsConfig, function (column) {
	                _this.collectionConfig.addColumn(column.propertyIdentifier, column.title, column);
	            });
	            _this.collectionConfig.addDisplayAggregate('childContents', 'COUNT', 'childContentsCount', { isVisible: false, isSearchable: false, title: 'test' });
	            _this.collectionConfig.addDisplayProperty('site.siteID', undefined, {
	                isVisible: false,
	                ormtype: 'id',
	                isSearchable: false
	            });
	            _this.collectionConfig.addDisplayProperty('site.domainNames', undefined, {
	                isVisible: false,
	                isSearchable: true
	            });
	            angular.forEach(filterGroupsConfig[0].filterGroup, function (filter) {
	                _this.collectionConfig.addFilter(filter.propertyIdentifier, filter.value, filter.comparisonOperator, filter.logicalOperator);
	            });
	            _this.collectionListingPromise = _this.collectionConfig.getEntity();
	            _this.collectionListingPromise.then(function (value) {
	                _this.$timeout(function () {
	                    _this.collection = value;
	                    _this.collection.collectionConfig = _this.collectionConfig;
	                    _this.firstLoad = true;
	                    _this.loadingCollection = false;
	                });
	            });
	            return _this.collectionListingPromise;
	        };
	        //this.getCollection(false);
	        this.loadingCollection = false;
	        this.searchCollection = function () {
	            $log.debug('search with keywords');
	            $log.debug(_this.keywords);
	            $('.childNode').remove();
	            //Set current page here so that the pagination does not break when getting collection
	            _this.loadingCollection = true;
	            var promise = _this.getCollection(true);
	            promise.then(function () {
	                _this.collection.collectionConfig = _this.collectionConfig;
	                _this.loadingCollection = false;
	            });
	        };
	        var siteChanged = function (selectedSiteOption) {
	            _this.localStorageService.setItem('selectedSiteOption', selectedSiteOption);
	            _this.selectedSite = _this.localStorageService.getItem('selectedSiteOption');
	            _this.openRoot = true;
	            _this.getCollection();
	        };
	        this.observerService.attach(siteChanged, 'optionsChanged', 'siteOptions');
	        var sortChanged = function (orderBy) {
	            _this.orderBy = orderBy;
	            _this.getCollection();
	        };
	        this.observerService.attach(sortChanged, 'sortByColumn', 'siteSorting');
	        var optionsLoaded = function () {
	            var option;
	            if (_this.selectedSite) {
	                option = _this.selectedSite;
	            }
	            _this.observerService.notify('selectOption', option);
	        };
	        this.observerService.attach(optionsLoaded, 'optionsLoaded', 'siteOptionsLoaded');
	    }
	    return SWContentListController;
	})();
	var SWContentList = (function () {
	    //@ngInject
	    function SWContentList(contentPartialsPath, observerService, slatwallPathBuilder) {
	        this.restrict = 'E';
	        //public bindToController=true;
	        this.controller = SWContentListController;
	        this.controllerAs = "swContentList";
	        this.link = function (scope, element, attrs, controller, transclude) {
	            scope.$on('$destroy', function handler() {
	                this.observerService.detachByEvent('optionsChanged');
	                this.observerService.detachByEvent('sortByColumn');
	            });
	        };
	        this.observerService = observerService;
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(contentPartialsPath) + 'contentlist.html';
	    }
	    SWContentList.Factory = function () {
	        var directive = function (contentPartialsPath, observerService, slatwallPathBuilder) {
	            return new SWContentList(contentPartialsPath, observerService, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'contentPartialsPath',
	            'observerService',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWContentList;
	})();
	exports.SWContentList = SWContentList;


/***/ },
/* 158 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWContentNode = (function () {
	    function SWContentNode($log, $compile, $hibachi, contentPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: 'A',
	            scope: {
	                contentData: '=',
	                loadChildren: "="
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(contentPartialsPath) + 'contentnode.html',
	            link: function (scope, element, attr) {
	                if (angular.isUndefined(scope.depth)) {
	                    scope.depth = 0;
	                }
	                if (angular.isDefined(scope.$parent.depth)) {
	                    scope.depth = scope.$parent.depth + 1;
	                }
	                var childContentColumnsConfig = [{
	                        propertyIdentifier: '_content.contentID',
	                        isVisible: false,
	                        isSearchable: false
	                    },
	                    {
	                        propertyIdentifier: '_content.title',
	                        isVisible: true,
	                        isSearchable: true
	                    },
	                    {
	                        propertyIdentifier: '_content.urlTitlePath',
	                        isVisible: true,
	                        isSearchable: true
	                    },
	                    {
	                        propertyIdentifier: '_content.site.siteID',
	                        isVisible: false,
	                        isSearchable: false
	                    },
	                    {
	                        propertyIdentifier: '_content.site.siteName',
	                        isVisible: true,
	                        isSearchable: true
	                    },
	                    {
	                        propertyIdentifier: '_content.site.domainNames',
	                        isVisible: true,
	                        isSearchable: true
	                    },
	                    //                            {
	                    //                                propertyIdentifier: '_content.contentTemplateFile',
	                    //                                persistent: false,
	                    //                                setting: true,
	                    //                                isVisible: true
	                    //                            },
	                    //need to get template via settings
	                    {
	                        propertyIdentifier: '_content.allowPurchaseFlag',
	                        isVisible: true,
	                        isSearchable: true
	                    }, {
	                        propertyIdentifier: '_content.productListingPageFlag',
	                        isVisible: true,
	                        isSearchable: true
	                    }, {
	                        propertyIdentifier: '_content.activeFlag',
	                        isVisible: true,
	                        isSearchable: true
	                    }
	                ];
	                var childContentOrderBy = [
	                    {
	                        "propertyIdentifier": "_content.sortOrder",
	                        "direction": "DESC"
	                    }
	                ];
	                scope.toggleChildContent = function (parentContentRecord) {
	                    if (angular.isUndefined(scope.childOpen) || scope.childOpen === false) {
	                        scope.childOpen = true;
	                        if (!scope.childrenLoaded) {
	                            scope.getChildContent(parentContentRecord);
	                        }
	                    }
	                    else {
	                        scope.childOpen = false;
	                    }
	                };
	                scope.getChildContent = function (parentContentRecord) {
	                    var childContentfilterGroupsConfig = [{
	                            "filterGroup": [{
	                                    "propertyIdentifier": "_content.parentContent.contentID",
	                                    "comparisonOperator": "=",
	                                    "value": parentContentRecord.contentID
	                                }]
	                        }];
	                    var collectionListingPromise = $hibachi.getEntity('Content', {
	                        columnsConfig: angular.toJson(childContentColumnsConfig),
	                        filterGroupsConfig: angular.toJson(childContentfilterGroupsConfig),
	                        orderByConfig: angular.toJson(childContentOrderBy),
	                        allRecords: true
	                    });
	                    collectionListingPromise.then(function (value) {
	                        parentContentRecord.children = value.records;
	                        var index = 0;
	                        angular.forEach(parentContentRecord.children, function (child) {
	                            child.site_domainNames = child.site_domainNames.split(",")[0];
	                            scope['child' + index] = child;
	                            element.after($compile('<tr class="childNode" style="margin-left:{{depth*15||0}}px" ng-if="childOpen"  sw-content-node data-content-data="child' + index + '"></tr>')(scope));
	                            index++;
	                        });
	                        scope.childrenLoaded = true;
	                    });
	                };
	                scope.childrenLoaded = false;
	                //if the children have never been loaded and we are not in search mode based on the title received
	                if (angular.isDefined(scope.loadChildren) && scope.loadChildren === true && !(scope.contentData.titlePath && scope.contentData.titlePath.trim().length)) {
	                    scope.toggleChildContent(scope.contentData);
	                }
	            }
	        };
	    }
	    SWContentNode.Factory = function () {
	        var directive = function ($log, $compile, $hibachi, contentPartialsPath, slatwallPathBuilder) {
	            return new SWContentNode($log, $compile, $hibachi, contentPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$compile',
	            '$hibachi',
	            'contentPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWContentNode;
	})();
	exports.SWContentNode = SWContentNode;


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//modules
	var core_module_1 = __webpack_require__(2);
	//controllers
	//directives
	var swformresponselisting_1 = __webpack_require__(160);
	//models
	var formbuildermodule = angular.module('formbuilder', [core_module_1.coremodule.name])
	    .config([function () {
	    }]).run([function () {
	    }])
	    .constant('formBuilderPartialsPath', 'formbuilder/components/')
	    .directive('swFormResponseListing', swformresponselisting_1.SWFormResponseListing.Factory());
	exports.formbuildermodule = formbuildermodule;


/***/ },
/* 160 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWFormResponseListingController = (function () {
	    //@ngInject
	    function SWFormResponseListingController($http, $hibachi, paginationService) {
	        var _this = this;
	        this.$http = $http;
	        this.$hibachi = $hibachi;
	        this.paginationService = paginationService;
	        this.init = function () {
	            if (angular.isUndefined(_this.formId)) {
	                throw ("Form ID is required for swFormResponseListing");
	            }
	            _this.paginator = _this.paginationService.createPagination();
	            _this.paginator.getCollection = _this.updateFormResponses;
	            _this.updateFormResponses();
	        };
	        this.export = function () {
	            $('body').append('<form action="'
	                + _this.$hibachi.getUrlWithActionPrefix()
	                + 'api:main.exportformresponses&formID=' + _this.formId
	                + '" method="post" id="formExport"></form>');
	            $('#formExport')
	                .submit()
	                .remove();
	        };
	        this.updateFormResponses = function () {
	            var formResponsesRequestUrl = _this.$hibachi.getUrlWithActionPrefix() + "api:main.getformresponses&formID=" + _this.formId;
	            var params = {};
	            params.currentPage = _this.paginator.currentPage || 1;
	            params.pageShow = _this.paginator.pageShow || 10;
	            var formResponsesPromise = _this.$http({
	                method: 'GET',
	                url: formResponsesRequestUrl,
	                params: params
	            });
	            formResponsesPromise.then(function (response) {
	                _this.columns = response.data.columnRecords;
	                _this.pageRecords = response.data.pageRecords;
	                _this.paginator.recordsCount = response.data.recordsCount;
	                _this.paginator.totalPages = response.data.totalPages;
	                _this.paginator.pageStart = response.data.pageRecordsStart;
	                _this.paginator.pageEnd = response.data.pageRecordsEnd;
	            }, function (response) {
	                throw ("There was a problem collecting the form responses");
	            });
	        };
	        this.init();
	    }
	    return SWFormResponseListingController;
	})();
	exports.SWFormResponseListingController = SWFormResponseListingController;
	var SWFormResponseListing = (function () {
	    //@ngInject
	    function SWFormResponseListing($http, $hibachi, paginationService, formBuilderPartialsPath, slatwallPathBuilder) {
	        this.$http = $http;
	        this.$hibachi = $hibachi;
	        this.paginationService = paginationService;
	        this.formBuilderPartialsPath = formBuilderPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.restrict = "EA";
	        this.scope = {};
	        this.bindToController = {
	            "formId": "@"
	        };
	        this.controller = SWFormResponseListingController;
	        this.controllerAs = "swFormResponseListing";
	        this.link = function ($scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(formBuilderPartialsPath) + "/formresponselisting.html";
	    }
	    SWFormResponseListing.Factory = function () {
	        var directive = function ($http, $hibachi, paginationService, formBuilderPartialsPath, slatwallPathBuilder) {
	            return new SWFormResponseListing($http, $hibachi, paginationService, formBuilderPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$hibachi',
	            'paginationService',
	            'formBuilderPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWFormResponseListing;
	})();
	exports.SWFormResponseListing = SWFormResponseListing;


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//modules
	var core_module_1 = __webpack_require__(2);
	//controllers
	var preprocessorderitem_addorderitemgiftrecipient_1 = __webpack_require__(162);
	//directives
	var swaddorderitemgiftrecipient_1 = __webpack_require__(164);
	var swgiftcardbalance_1 = __webpack_require__(165);
	var swgiftcarddetail_1 = __webpack_require__(166);
	var swgiftcardhistory_1 = __webpack_require__(167);
	var swgiftcardoverview_1 = __webpack_require__(168);
	var swgiftcardorderinfo_1 = __webpack_require__(169);
	var swgiftcardrecipientinfo_1 = __webpack_require__(170);
	var sworderitemgiftrecipientrow_1 = __webpack_require__(171);
	var giftcardmodule = angular.module('giftcard', [core_module_1.coremodule.name])
	    .config([function () {
	    }]).run([function () {
	    }])
	    .constant('giftCardPartialsPath', 'giftcard/components/')
	    .controller('preprocessorderitem_addorderitemgiftrecipient', preprocessorderitem_addorderitemgiftrecipient_1.OrderItemGiftRecipientControl)
	    .directive('swAddOrderItemGiftRecipient', swaddorderitemgiftrecipient_1.SWAddOrderItemGiftRecipient.Factory())
	    .directive('swGiftCardBalance', swgiftcardbalance_1.SWGiftCardBalance.Factory())
	    .directive('swGiftCardOverview', swgiftcardoverview_1.SWGiftCardOverview.Factory())
	    .directive('swGiftCardDetail', swgiftcarddetail_1.SWGiftCardDetail.Factory())
	    .directive('swGiftCardHistory', swgiftcardhistory_1.SWGiftCardHistory.Factory())
	    .directive('swGiftCardRecipientInfo', swgiftcardrecipientinfo_1.SWGiftCardRecipientInfo.Factory())
	    .directive('swGiftCardOrderInfo', swgiftcardorderinfo_1.SWGiftCardOrderInfo.Factory())
	    .directive('swOrderItemGiftRecipientRow', sworderitemgiftrecipientrow_1.SWOrderItemGiftRecipientRow.Factory());
	exports.giftcardmodule = giftcardmodule;


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var giftrecipient_1 = __webpack_require__(163);
	var OrderItemGiftRecipientControl = (function () {
	    //@ngInject
	    function OrderItemGiftRecipientControl($scope, $hibachi) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$hibachi = $hibachi;
	        this.getUnassignedCountArray = function () {
	            var unassignedCountArray = new Array();
	            for (var i = 1; i <= _this.getUnassignedCount(); i++) {
	                unassignedCountArray.push(i);
	            }
	            return unassignedCountArray;
	        };
	        this.getAssignedCount = function () {
	            var assignedCount = 0;
	            angular.forEach(_this.orderItemGiftRecipients, function (orderItemGiftRecipient) {
	                assignedCount += orderItemGiftRecipient.quantity;
	            });
	            return assignedCount;
	        };
	        this.getUnassignedCount = function () {
	            var unassignedCount = _this.quantity;
	            angular.forEach(_this.orderItemGiftRecipients, function (orderItemGiftRecipient) {
	                unassignedCount -= orderItemGiftRecipient.quantity;
	            });
	            return unassignedCount;
	        };
	        this.orderItemGiftRecipients = $scope.orderItemGiftRecipients = [];
	        $scope.collection = {};
	        this.adding = false;
	        this.searchText = "";
	        var count = 1;
	        this.currentGiftRecipient = new giftrecipient_1.GiftRecipient();
	    }
	    OrderItemGiftRecipientControl.$inject = ["$scope", "$hibachi"];
	    return OrderItemGiftRecipientControl;
	})();
	exports.OrderItemGiftRecipientControl = OrderItemGiftRecipientControl;


/***/ },
/* 163 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var GiftRecipient = (function () {
	    function GiftRecipient(firstName, lastName, emailAddress, giftMessage, quantity, account, editing) {
	        var _this = this;
	        this.reset = function () {
	            _this.firstName = null;
	            _this.lastName = null;
	            _this.emailAddress = null;
	            _this.account = null;
	            _this.editing = false;
	            _this.quantity = 1;
	        };
	        this.quantity = 1;
	        this.editing = false;
	        this.account = false;
	    }
	    return GiftRecipient;
	})();
	exports.GiftRecipient = GiftRecipient;


/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var giftrecipient_1 = __webpack_require__(163);
	var SWAddOrderItemRecipientController = (function () {
	    //@ngInject
	    function SWAddOrderItemRecipientController($hibachi, collectionConfigService) {
	        var _this = this;
	        this.$hibachi = $hibachi;
	        this.collectionConfigService = collectionConfigService;
	        this.unassignedCountArray = [];
	        this.addGiftRecipientFromAccountList = function (account) {
	            var giftRecipient = new giftrecipient_1.GiftRecipient();
	            giftRecipient.firstName = account.firstName;
	            giftRecipient.lastName = account.lastName;
	            giftRecipient.emailAddress = account.primaryEmailAddress_emailAddress;
	            giftRecipient.account = true;
	            _this.orderItemGiftRecipients.push(giftRecipient);
	            _this.searchText = "";
	        };
	        this.getUnassignedCountArray = function () {
	            if (_this.getUnassignedCount() < _this.unassignedCountArray.length) {
	                _this.unassignedCountArray.splice(_this.getUnassignedCount(), _this.unassignedCountArray.length);
	            }
	            if (_this.getUnassignedCount() > _this.unassignedCountArray.length) {
	                for (var i = _this.unassignedCountArray.length + 1; i <= _this.getUnassignedCount(); i++) {
	                    _this.unassignedCountArray.push({ name: i, value: i });
	                }
	            }
	            return _this.unassignedCountArray;
	        };
	        this.getAssignedCount = function () {
	            _this.assignedCount = 0;
	            angular.forEach(_this.orderItemGiftRecipients, function (orderItemGiftRecipient) {
	                _this.assignedCount += orderItemGiftRecipient.quantity;
	            });
	            return _this.assignedCount;
	        };
	        this.getUnassignedCount = function () {
	            _this.unassignedCount = _this.quantity;
	            angular.forEach(_this.orderItemGiftRecipients, function (orderItemGiftRecipient) {
	                _this.unassignedCount -= orderItemGiftRecipient.quantity;
	            });
	            return _this.unassignedCount;
	        };
	        this.addGiftRecipient = function () {
	            if (_this.currentGiftRecipient.forms.createRecipient.$valid) {
	                _this.showInvalidAddFormMessage = true;
	                _this.adding = false;
	                var giftRecipient = new giftrecipient_1.GiftRecipient();
	                angular.extend(giftRecipient, _this.currentGiftRecipient.data);
	                _this.orderItemGiftRecipients.push(giftRecipient);
	                _this.searchText = "";
	                _this.currentGiftRecipient = _this.$hibachi.newEntity("OrderItemGiftRecipient");
	            }
	            else {
	                _this.showInvalidAddFormMessage = true;
	            }
	        };
	        this.cancelAddRecipient = function () {
	            _this.adding = false;
	            _this.currentGiftRecipient.reset();
	            _this.searchText = "";
	            _this.showInvalidAddFormMessage = false;
	        };
	        this.startFormWithName = function (searchString) {
	            if (searchString === void 0) { searchString = _this.searchText; }
	            _this.adding = !_this.adding;
	            if (_this.adding) {
	                _this.currentGiftRecipient.forms.createRecipient.$setUntouched();
	                _this.currentGiftRecipient.forms.createRecipient.$setPristine();
	                if (searchString != "") {
	                    _this.currentGiftRecipient.firstName = searchString;
	                    _this.searchText = "";
	                }
	            }
	        };
	        this.getTotalQuantity = function () {
	            var totalQuantity = 0;
	            angular.forEach(_this.orderItemGiftRecipients, function (orderItemGiftRecipient) {
	                totalQuantity += orderItemGiftRecipient.quantity;
	            });
	            return totalQuantity;
	        };
	        this.getMessageCharactersLeft = function () {
	            if (angular.isDefined(_this.currentGiftRecipient.giftMessage)) {
	                return 250 - _this.currentGiftRecipient.giftMessage.length;
	            }
	            else {
	                return 250;
	            }
	        };
	        if (angular.isUndefined(this.adding)) {
	            this.adding = false;
	        }
	        if (angular.isUndefined(this.assignedCount)) {
	            this.assignedCount = 0;
	        }
	        if (angular.isUndefined(this.searchText)) {
	            this.searchText = "";
	        }
	        var count = 1;
	        this.currentGiftRecipient = $hibachi.newEntity("OrderItemGiftRecipient");
	        if (angular.isUndefined(this.orderItemGiftRecipients)) {
	            this.orderItemGiftRecipients = [];
	        }
	        if (angular.isUndefined(this.showInvalidAddFormMessage)) {
	            this.showInvalidAddFormMessage = false;
	        }
	        this.typeaheadCollectionConfig = collectionConfigService.newCollectionConfig('Account');
	        this.typeaheadCollectionConfig.addFilter("primaryEmailAddress", "null", "is not");
	    }
	    return SWAddOrderItemRecipientController;
	})();
	exports.SWAddOrderItemRecipientController = SWAddOrderItemRecipientController;
	var SWAddOrderItemGiftRecipient = (function () {
	    function SWAddOrderItemGiftRecipient($hibachi, giftCardPartialsPath, slatwallPathBuilder) {
	        this.$hibachi = $hibachi;
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.require = "^form";
	        this.restrict = "EA";
	        this.transclude = true;
	        this.scope = {};
	        this.bindToController = {
	            "quantity": "=?",
	            "orderItemGiftRecipients": "=?",
	            "adding": "=?",
	            "searchText": "=?",
	            "currentgiftRecipient": "=?",
	            "showInvalidAddFormMessage": "=?",
	            "showInvalidRowMessage": "=?",
	            "tableForm": "=?",
	            "recipientAddForm": "=?"
	        };
	        this.controller = SWAddOrderItemRecipientController;
	        this.controllerAs = "addGiftRecipientControl";
	        this.link = function ($scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(giftCardPartialsPath) + "/addorderitemgiftrecipient.html";
	    }
	    SWAddOrderItemGiftRecipient.Factory = function () {
	        var directive = function ($hibachi, giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWAddOrderItemGiftRecipient($hibachi, giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$hibachi',
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    SWAddOrderItemGiftRecipient.$inject = ["$hibachi"];
	    return SWAddOrderItemGiftRecipient;
	})();
	exports.SWAddOrderItemGiftRecipient = SWAddOrderItemGiftRecipient;


/***/ },
/* 165 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWGiftCardBalanceController = (function () {
	    function SWGiftCardBalanceController(collectionConfigService) {
	        var _this = this;
	        this.collectionConfigService = collectionConfigService;
	        this.init = function () {
	            _this.initialBalance = 0;
	            var totalDebit = 0;
	            var totalCredit = 0;
	            var transactionConfig = _this.collectionConfigService.newCollectionConfig('GiftCardTransaction');
	            transactionConfig.setDisplayProperties("giftCardTransactionID, creditAmount, debitAmount, giftCard.giftCardID");
	            transactionConfig.addFilter('giftCard.giftCardID', _this.giftCard.giftCardID);
	            transactionConfig.setAllRecords(true);
	            transactionConfig.setOrderBy("createdDateTime|DESC");
	            var transactionPromise = transactionConfig.getEntity();
	            transactionPromise.then(function (response) {
	                _this.transactions = response.records;
	                var initialCreditIndex = _this.transactions.length - 1;
	                _this.initialBalance = _this.transactions[initialCreditIndex].creditAmount;
	                angular.forEach(_this.transactions, function (transaction, index) {
	                    if (!angular.isString(transaction.debitAmount)) {
	                        totalDebit += transaction.debitAmount;
	                    }
	                    if (!angular.isString(transaction.creditAmount)) {
	                        totalCredit += transaction.creditAmount;
	                    }
	                });
	                _this.currentBalance = totalCredit - totalDebit;
	                _this.balancePercentage = parseInt(((_this.currentBalance / _this.initialBalance) * 100).toString());
	            });
	        };
	        this.init();
	    }
	    SWGiftCardBalanceController.$inject = ["collectionConfigService"];
	    return SWGiftCardBalanceController;
	})();
	exports.SWGiftCardBalanceController = SWGiftCardBalanceController;
	var SWGiftCardBalance = (function () {
	    function SWGiftCardBalance(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	        this.collectionConfigService = collectionConfigService;
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.scope = {};
	        this.bindToController = {
	            giftCard: "=?",
	            transactions: "=?",
	            initialBalance: "=?",
	            currentBalance: "=?",
	            balancePercentage: "=?"
	        };
	        this.controller = SWGiftCardBalanceController;
	        this.controllerAs = "swGiftCardBalance";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(giftCardPartialsPath) + "/balance.html";
	        this.restrict = "EA";
	    }
	    SWGiftCardBalance.Factory = function () {
	        var directive = function (collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWGiftCardBalance(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'collectionConfigService',
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWGiftCardBalance;
	})();
	exports.SWGiftCardBalance = SWGiftCardBalance;


/***/ },
/* 166 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWGiftCardDetailController = (function () {
	    function SWGiftCardDetailController(collectionConfigService) {
	        var _this = this;
	        this.collectionConfigService = collectionConfigService;
	        this.init = function () {
	            var giftCardConfig = _this.collectionConfigService.newCollectionConfig('GiftCard');
	            giftCardConfig.setDisplayProperties("giftCardID, giftCardCode, currencyCode, giftCardPin, expirationDate, ownerFirstName, ownerLastName, ownerEmailAddress, activeFlag, balanceAmount,  originalOrderItem.sku.product.productName, originalOrderItem.sku.product.productID, originalOrderItem.order.orderID, originalOrderItem.orderItemID, orderItemGiftRecipient.firstName, orderItemGiftRecipient.lastName, orderItemGiftRecipient.emailAddress, orderItemGiftRecipient.giftMessage");
	            giftCardConfig.addFilter('giftCardID', _this.giftCardId);
	            giftCardConfig.setAllRecords(true);
	            giftCardConfig.getEntity().then(function (response) {
	                _this.giftCard = response.records[0];
	            });
	        };
	        this.init();
	    }
	    SWGiftCardDetailController.$inject = ["collectionConfigService"];
	    return SWGiftCardDetailController;
	})();
	exports.SWGiftCardDetailController = SWGiftCardDetailController;
	var SWGiftCardDetail = (function () {
	    function SWGiftCardDetail(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	        this.collectionConfigService = collectionConfigService;
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.scope = {};
	        this.bindToController = {
	            giftCardId: "@",
	            giftCard: "=?"
	        };
	        this.controller = SWGiftCardDetailController;
	        this.controllerAs = "swGiftCardDetail";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(giftCardPartialsPath) + "/basic.html";
	        this.restrict = "E";
	    }
	    SWGiftCardDetail.Factory = function () {
	        var directive = function (collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWGiftCardDetail(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'collectionConfigService',
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWGiftCardDetail;
	})();
	exports.SWGiftCardDetail = SWGiftCardDetail;


/***/ },
/* 167 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWGiftCardHistoryController = (function () {
	    function SWGiftCardHistoryController(collectionConfigService) {
	        var _this = this;
	        this.collectionConfigService = collectionConfigService;
	        this.init = function () {
	            var initialBalance = 0;
	            var totalDebit = 0;
	            var transactionConfig = _this.collectionConfigService.newCollectionConfig('GiftCardTransaction');
	            transactionConfig.setDisplayProperties("giftCardTransactionID, creditAmount, debitAmount, createdDateTime, giftCard.giftCardID, orderPayment.order.orderNumber, orderPayment.order.orderOpenDateTime", "id,credit,debit,created,giftcardID,ordernumber,orderdatetime");
	            transactionConfig.addFilter('giftCard.giftCardID', _this.giftCard.giftCardID);
	            transactionConfig.setAllRecords(true);
	            transactionConfig.setOrderBy("createdDateTime|DESC");
	            var emailBounceConfig = _this.collectionConfigService.newCollectionConfig('EmailBounce');
	            emailBounceConfig.setDisplayProperties("emailBounceID, rejectedEmailTo, rejectedEmailSendTime, relatedObject, relatedObjectID");
	            emailBounceConfig.addFilter('relatedObjectID', _this.giftCard.giftCardID);
	            emailBounceConfig.setAllRecords(true);
	            emailBounceConfig.setOrderBy("rejectedEmailSendTime|DESC");
	            var emailConfig = _this.collectionConfigService.newCollectionConfig('Email');
	            emailConfig.setDisplayProperties('emailID, emailTo, relatedObject, relatedObjectID, createdDateTime');
	            emailConfig.addFilter('relatedObjectID', _this.giftCard.giftCardID);
	            emailConfig.setAllRecords(true);
	            emailConfig.setOrderBy("createdDateTime|DESC");
	            emailConfig.getEntity().then(function (response) {
	                _this.emails = response.records;
	                emailBounceConfig.getEntity().then(function (response) {
	                    _this.bouncedEmails = response.records;
	                    transactionConfig.getEntity().then(function (response) {
	                        _this.transactions = response.records;
	                        var initialCreditIndex = _this.transactions.length - 1;
	                        var initialBalance = _this.transactions[initialCreditIndex].creditAmount;
	                        var currentBalance = initialBalance;
	                        for (var i = initialCreditIndex; i >= 0; i--) {
	                            var transaction = _this.transactions[i];
	                            if (typeof transaction.debitAmount !== "string") {
	                                transaction.debit = true;
	                                totalDebit += transaction.debitAmount;
	                            }
	                            else if (typeof transaction.creditAmount !== "string") {
	                                if (i != initialCreditIndex) {
	                                    currentBalance += transaction.creditAmount;
	                                }
	                                transaction.debit = false;
	                            }
	                            var tempCurrentBalance = currentBalance - totalDebit;
	                            transaction.balance = tempCurrentBalance;
	                            if (i == initialCreditIndex) {
	                                var activeCard = {
	                                    activated: true,
	                                    debit: false,
	                                    activeAt: transaction.orderPayment_order_orderOpenDateTime,
	                                    balance: initialBalance
	                                };
	                                _this.transactions.splice(i, 0, activeCard);
	                                if (angular.isDefined(_this.bouncedEmails)) {
	                                    angular.forEach(_this.bouncedEmails, function (email, bouncedEmailIndex) {
	                                        email.bouncedEmail = true;
	                                        email.balance = initialBalance;
	                                        _this.transactions.splice(i, 0, email);
	                                    });
	                                }
	                                if (angular.isDefined(_this.emails)) {
	                                    angular.forEach(_this.emails, function (email) {
	                                        email.emailSent = true;
	                                        email.debit = false;
	                                        email.sentAt = email.createdDateTime;
	                                        email.balance = initialBalance;
	                                        _this.transactions.splice(i, 0, email);
	                                    });
	                                }
	                            }
	                        }
	                    });
	                });
	            });
	            var orderConfig = _this.collectionConfigService.newCollectionConfig('Order');
	            orderConfig.setDisplayProperties("orderID,orderNumber,orderOpenDateTime,account.firstName,account.lastName,account.accountID,account.primaryEmailAddress.emailAddress");
	            orderConfig.addFilter('orderID', _this.giftCard.originalOrderItem_order_orderID);
	            orderConfig.setAllRecords(true);
	            orderConfig.getEntity().then(function (response) {
	                _this.order = response.records[0];
	            });
	        };
	        this.init();
	    }
	    SWGiftCardHistoryController.$inject = ["collectionConfigService"];
	    return SWGiftCardHistoryController;
	})();
	exports.SWGiftCardHistoryController = SWGiftCardHistoryController;
	var SWGiftCardHistory = (function () {
	    function SWGiftCardHistory(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	        this.collectionConfigService = collectionConfigService;
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.scope = {};
	        this.bindToController = {
	            giftCard: "=?",
	            transactions: "=?",
	            bouncedEmails: "=?",
	            order: "=?"
	        };
	        this.controller = SWGiftCardHistoryController;
	        this.controllerAs = "swGiftCardHistory";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(giftCardPartialsPath) + "/history.html";
	        this.restrict = "EA";
	    }
	    SWGiftCardHistory.Factory = function () {
	        var directive = function (collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWGiftCardHistory(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'collectionConfigService',
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWGiftCardHistory;
	})();
	exports.SWGiftCardHistory = SWGiftCardHistory;


/***/ },
/* 168 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWGiftCardOverviewController = (function () {
	    function SWGiftCardOverviewController() {
	    }
	    return SWGiftCardOverviewController;
	})();
	exports.SWGiftCardOverviewController = SWGiftCardOverviewController;
	var SWGiftCardOverview = (function () {
	    function SWGiftCardOverview(giftCardPartialsPath, slatwallPathBuilder) {
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.scope = {};
	        this.bindToController = {
	            giftCard: "=?"
	        };
	        this.controller = SWGiftCardOverviewController;
	        this.controllerAs = "swGiftCardOverview";
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(giftCardPartialsPath) + "/overview.html";
	        this.restrict = "EA";
	    }
	    SWGiftCardOverview.Factory = function () {
	        var directive = function (giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWGiftCardOverview(giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWGiftCardOverview;
	})();
	exports.SWGiftCardOverview = SWGiftCardOverview;


/***/ },
/* 169 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWGiftCardOrderInfoController = (function () {
	    function SWGiftCardOrderInfoController(collectionConfigService) {
	        var _this = this;
	        this.collectionConfigService = collectionConfigService;
	        this.init = function () {
	            var orderConfig = _this.collectionConfigService.newCollectionConfig('Order');
	            orderConfig.setDisplayProperties("orderID, orderNumber, orderOpenDateTime, account.firstName, account.lastName");
	            orderConfig.addFilter('orderID', _this.giftCard.originalOrderItem_order_orderID);
	            orderConfig.setAllRecords(true);
	            orderConfig.getEntity().then(function (response) {
	                _this.order = response.records[0];
	            });
	        };
	        this.init();
	    }
	    SWGiftCardOrderInfoController.$inject = ["collectionConfigService"];
	    return SWGiftCardOrderInfoController;
	})();
	exports.SWGiftCardOrderInfoController = SWGiftCardOrderInfoController;
	var SWGiftCardOrderInfo = (function () {
	    function SWGiftCardOrderInfo(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	        this.collectionConfigService = collectionConfigService;
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.scope = {};
	        this.bindToController = {
	            giftCard: "=?",
	            order: "=?"
	        };
	        this.controller = SWGiftCardOrderInfoController;
	        this.controllerAs = "swGiftCardOrderInfo";
	        this.link = function (scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(giftCardPartialsPath) + "/orderinfo.html";
	        this.restrict = "EA";
	    }
	    SWGiftCardOrderInfo.Factory = function () {
	        var directive = function (collectionConfigService, giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWGiftCardOrderInfo(collectionConfigService, giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'collectionConfigService',
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    SWGiftCardOrderInfo.$inject = ["collectionConfigService", "partialsPath"];
	    return SWGiftCardOrderInfo;
	})();
	exports.SWGiftCardOrderInfo = SWGiftCardOrderInfo;


/***/ },
/* 170 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWGiftCardRecipientInfoController = (function () {
	    function SWGiftCardRecipientInfoController() {
	    }
	    return SWGiftCardRecipientInfoController;
	})();
	exports.SWGiftCardRecipientInfoController = SWGiftCardRecipientInfoController;
	var SWGiftCardRecipientInfo = (function () {
	    function SWGiftCardRecipientInfo(giftCardPartialsPath, slatwallPathBuilder) {
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.scope = {};
	        this.bindToController = {
	            giftCard: "=?"
	        };
	        this.controller = SWGiftCardRecipientInfoController;
	        this.controllerAs = "swGiftCardRecipientInfo";
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(giftCardPartialsPath) + "/recipientinfo.html";
	        this.restrict = "EA";
	    }
	    SWGiftCardRecipientInfo.Factory = function () {
	        var directive = function (giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWGiftCardRecipientInfo(giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWGiftCardRecipientInfo;
	})();
	exports.SWGiftCardRecipientInfo = SWGiftCardRecipientInfo;


/***/ },
/* 171 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWOrderItemGiftRecipientRowController = (function () {
	    function SWOrderItemGiftRecipientRowController() {
	        var _this = this;
	        this.edit = function (recipient) {
	            angular.forEach(_this.recipients, function (recipient) {
	                recipient.editing = false;
	            });
	            if (!recipient.editing) {
	                recipient.editing = true;
	            }
	        };
	        this.delete = function (recipient) {
	            _this.recipients.splice(_this.recipients.indexOf(recipient), 1);
	        };
	        this.saveGiftRecipient = function (recipient) {
	            if (_this.tableForm.$valid) {
	                _this.showInvalidRecipientMessage = false;
	                recipient.editing = false;
	            }
	            else {
	                _this.showInvalidRecipientMessage = true;
	            }
	        };
	        this.getQuantity = function () {
	            if (isNaN(_this.quantity)) {
	                return 0;
	            }
	            else {
	                return _this.quantity;
	            }
	        };
	        this.getUnassignedCount = function () {
	            var unassignedCount = _this.getQuantity();
	            angular.forEach(_this.recipients, function (recipient) {
	                unassignedCount -= recipient.quantity;
	            });
	            return unassignedCount;
	        };
	        this.getMessageCharactersLeft = function () {
	            if (angular.isDefined(_this.recipient.giftMessage)) {
	                return 250 - _this.recipient.giftMessage.length;
	            }
	            else {
	                return 250;
	            }
	        };
	        this.getUnassignedCountArray = function () {
	            var unassignedCountArray = new Array();
	            for (var i = 1; i <= _this.recipient.quantity + _this.getUnassignedCount(); i++) {
	                unassignedCountArray.push(i);
	            }
	            return unassignedCountArray;
	        };
	    }
	    return SWOrderItemGiftRecipientRowController;
	})();
	exports.SWOrderItemGiftRecipientRowController = SWOrderItemGiftRecipientRowController;
	var SWOrderItemGiftRecipientRow = (function () {
	    function SWOrderItemGiftRecipientRow(giftCardPartialsPath, slatwallPathBuilder) {
	        var _this = this;
	        this.giftCardPartialsPath = giftCardPartialsPath;
	        this.slatwallPathBuilder = slatwallPathBuilder;
	        this.restrict = 'AE';
	        this.scope = {
	            recipient: "=",
	            recipients: "=",
	            quantity: "=",
	            showInvalidRecipientMessage: "=",
	            tableForm: "=?",
	            index: "="
	        };
	        this.bindToController = {
	            recipient: "=",
	            recipients: "=",
	            quantity: "=",
	            showInvalidRecipientMessage: "=",
	            tableForm: "=?",
	            index: "="
	        };
	        this.controller = SWOrderItemGiftRecipientRowController;
	        this.controllerAs = "giftRecipientRowControl";
	        this.init = function () {
	            _this.templateUrl = _this.slatwallPathBuilder.buildPartialsPath(_this.giftCardPartialsPath) + "/orderitemgiftrecipientrow.html";
	        };
	        this.init();
	    }
	    SWOrderItemGiftRecipientRow.Factory = function () {
	        var directive = function (giftCardPartialsPath, slatwallPathBuilder) {
	            return new SWOrderItemGiftRecipientRow(giftCardPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            'giftCardPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWOrderItemGiftRecipientRow;
	})();
	exports.SWOrderItemGiftRecipientRow = SWOrderItemGiftRecipientRow;


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//modules
	var core_module_1 = __webpack_require__(2);
	//controllers
	//directives
	var swaddoptiongroup_1 = __webpack_require__(173);
	var swoptionsforoptiongroup_1 = __webpack_require__(174);
	var optiongroupmodule = angular.module('optiongroup', [core_module_1.coremodule.name])
	    .config([function () {
	    }]).run([function () {
	    }])
	    .constant('optionGroupPartialsPath', 'optiongroup/components/')
	    .directive('swAddOptionGroup', swaddoptiongroup_1.SWAddOptionGroup.Factory())
	    .directive('swOptionsForOptionGroup', swoptionsforoptiongroup_1.SWOptionsForOptionGroup.Factory());
	exports.optiongroupmodule = optiongroupmodule;


/***/ },
/* 173 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var optionWithGroup = (function () {
	    function optionWithGroup(optionID, optionGroupID, match) {
	        var _this = this;
	        this.optionID = optionID;
	        this.optionGroupID = optionGroupID;
	        this.match = match;
	        this.toString = function () {
	            return _this.optionID;
	        };
	    }
	    return optionWithGroup;
	})();
	exports.optionWithGroup = optionWithGroup;
	var SWAddOptionGroupController = (function () {
	    // @ngInject
	    function SWAddOptionGroupController($hibachi, $timeout, collectionConfigService, observerService, utilityService) {
	        var _this = this;
	        this.$hibachi = $hibachi;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.observerService = observerService;
	        this.utilityService = utilityService;
	        this.getOptionList = function () {
	            return _this.utilityService.arrayToList(_this.selection);
	        };
	        this.validateOptions = function (args) {
	            _this.addToSelection(args[0], args[1].optionGroupID);
	            if (_this.hasCompleteSelection()) {
	                if (_this.validateSelection()) {
	                    _this.selectedOptionList = _this.getOptionList();
	                    _this.showValidFlag = true;
	                    _this.showInvalidFlag = false;
	                }
	                else {
	                    _this.showValidFlag = false;
	                    _this.showInvalidFlag = true;
	                }
	            }
	        };
	        this.validateSelection = function () {
	            var valid = true;
	            angular.forEach(_this.usedOptions, function (combination) {
	                if (valid) {
	                    var counter = 0;
	                    angular.forEach(combination, function (usedOption) {
	                        if (_this.selection[counter].optionGroupID === usedOption.optionGroup_optionGroupID
	                            && _this.selection[counter].optionID != usedOption.optionID) {
	                            _this.selection[counter].match = true;
	                        }
	                        counter++;
	                    });
	                    if (!_this.allSelectionFieldsValidForThisCombination()) {
	                        valid = false;
	                    }
	                }
	            });
	            return valid;
	        };
	        this.allSelectionFieldsValidForThisCombination = function () {
	            var matches = 0;
	            angular.forEach(_this.selection, function (pair) {
	                if (!pair.match) {
	                    matches++;
	                }
	                //reset 
	                pair.match = false;
	            });
	            return matches != _this.selection.length;
	        };
	        this.hasCompleteSelection = function () {
	            var answer = true;
	            angular.forEach(_this.selection, function (pair) {
	                if (pair.optionID.length === 0) {
	                    answer = false;
	                }
	            });
	            return answer;
	        };
	        this.addToSelection = function (optionId, optionGroupId) {
	            angular.forEach(_this.selection, function (pair) {
	                if (pair.optionGroupID === optionGroupId) {
	                    pair.optionID = optionId;
	                    return true;
	                }
	            });
	            return false;
	        };
	        this.optionGroupIds = this.optionGroups.split(",");
	        this.optionGroupIds.sort();
	        this.selection = [];
	        this.showValidFlag = false;
	        this.showInvalidFlag = false;
	        for (var i = 0; i < this.optionGroupIds.length; i++) {
	            this.selection.push(new optionWithGroup("", this.optionGroupIds[i], false));
	        }
	        this.productCollectionConfig = collectionConfigService.newCollectionConfig("Product");
	        this.productCollectionConfig.addDisplayProperty("productID, productName, productType.productTypeID");
	        this.productCollectionConfig.getEntity(this.productId).then(function (response) {
	            _this.product = response;
	            _this.productTypeID = response.productType_productTypeID;
	            _this.skuCollectionConfig = collectionConfigService.newCollectionConfig("Sku");
	            _this.skuCollectionConfig.addDisplayProperty("skuID, skuCode, product.productID");
	            _this.skuCollectionConfig.addFilter("product.productID", _this.productId);
	            _this.skuCollectionConfig.setAllRecords(true);
	            _this.usedOptions = [];
	            _this.skuCollectionConfig.getEntity().then(function (response) {
	                _this.skus = response.records;
	                angular.forEach(_this.skus, function (sku) {
	                    var optionCollectionConfig = collectionConfigService.newCollectionConfig("Option");
	                    optionCollectionConfig.addDisplayProperty("optionID, optionName, optionCode, optionGroup.optionGroupID");
	                    optionCollectionConfig.setAllRecords(true);
	                    optionCollectionConfig.addFilter("skus.skuID", sku.skuID);
	                    optionCollectionConfig.getEntity().then(function (response) {
	                        _this.usedOptions.push(utilityService.arraySorter(response.records, ["optionGroup_optionGroupID"]));
	                    });
	                });
	            });
	        });
	        this.observerService.attach(this.validateOptions, "validateOptions");
	    }
	    return SWAddOptionGroupController;
	})();
	exports.SWAddOptionGroupController = SWAddOptionGroupController;
	var SWAddOptionGroup = (function () {
	    // @ngInject
	    function SWAddOptionGroup($hibachi, $timeout, collectionConfigService, observerService, optionGroupPartialsPath, slatwallPathBuilder) {
	        this.$hibachi = $hibachi;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.observerService = observerService;
	        this.optionGroupPartialsPath = optionGroupPartialsPath;
	        this.restrict = "EA";
	        this.scope = {};
	        this.bindToController = {
	            productId: "@",
	            optionGroups: "="
	        };
	        this.controller = SWAddOptionGroupController;
	        this.controllerAs = "swAddOptionGroup";
	        this.link = function ($scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(optionGroupPartialsPath) + "addoptiongroup.html";
	    }
	    SWAddOptionGroup.Factory = function () {
	        var directive = function ($hibachi, $timeout, collectionConfigService, observerService, optionGroupPartialsPath, slatwallPathBuilder) {
	            return new SWAddOptionGroup($hibachi, $timeout, collectionConfigService, observerService, optionGroupPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$hibachi',
	            '$timeout',
	            'collectionConfigService',
	            'observerService',
	            'optionGroupPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWAddOptionGroup;
	})();
	exports.SWAddOptionGroup = SWAddOptionGroup;


/***/ },
/* 174 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWOptionsForOptionGroupController = (function () {
	    // @ngInject
	    function SWOptionsForOptionGroupController($hibachi, $timeout, collectionConfigService, observerService) {
	        var _this = this;
	        this.$hibachi = $hibachi;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.observerService = observerService;
	        this.validateChoice = function () {
	            _this.observerService.notify("validateOptions", [_this.selectedOption, _this.optionGroup]);
	        };
	        this.optionGroupCollectionConfig = collectionConfigService.newCollectionConfig("OptionGroup");
	        this.optionGroupCollectionConfig.getEntity(this.optionGroupId).then(function (response) {
	            _this.optionGroup = response;
	        });
	        this.optionCollectionConfig = collectionConfigService.newCollectionConfig("Option");
	        this.optionCollectionConfig.setDisplayProperties("optionID, optionName, optionGroup.optionGroupID");
	        this.optionCollectionConfig.addFilter("optionGroup.optionGroupID", this.optionGroupId);
	        this.optionCollectionConfig.setAllRecords(true);
	        this.optionCollectionConfig.getEntity().then(function (response) {
	            _this.options = response.records;
	        });
	    }
	    return SWOptionsForOptionGroupController;
	})();
	exports.SWOptionsForOptionGroupController = SWOptionsForOptionGroupController;
	var SWOptionsForOptionGroup = (function () {
	    // @ngInject
	    function SWOptionsForOptionGroup($hibachi, $timeout, collectionConfigService, observerService, optionGroupPartialsPath, slatwallPathBuilder) {
	        this.$hibachi = $hibachi;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.observerService = observerService;
	        this.optionGroupPartialsPath = optionGroupPartialsPath;
	        this.restrict = "EA";
	        this.scope = {};
	        this.bindToController = {
	            optionGroupId: "@",
	            usedOptions: "="
	        };
	        this.controller = SWOptionsForOptionGroupController;
	        this.controllerAs = "swOptionsForOptionGroup";
	        this.link = function ($scope, element, attrs) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(optionGroupPartialsPath) + "optionsforoptiongroup.html";
	    }
	    SWOptionsForOptionGroup.Factory = function () {
	        var directive = function ($hibachi, $timeout, collectionConfigService, observerService, optionGroupPartialsPath, slatwallPathBuilder) {
	            return new SWOptionsForOptionGroup($hibachi, $timeout, collectionConfigService, observerService, optionGroupPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$hibachi',
	            '$timeout',
	            'collectionConfigService',
	            'observerService',
	            'optionGroupPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWOptionsForOptionGroup;
	})();
	exports.SWOptionsForOptionGroup = SWOptionsForOptionGroup;


/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	/// <reference path="../../typings/slatwallTypescript.d.ts" />
	var core_module_1 = __webpack_require__(2);
	//directives
	var swchildorderitem_1 = __webpack_require__(176);
	var sworderitem_1 = __webpack_require__(177);
	var swoishippinglabelstamp_1 = __webpack_require__(178);
	var sworderitemdetailstamp_1 = __webpack_require__(179);
	var sworderitems_1 = __webpack_require__(180);
	var swresizedimage_1 = __webpack_require__(181);
	var orderitemmodule = angular.module('hibachi.orderitem', [core_module_1.coremodule.name])
	    .run([function () {
	    }])
	    .directive('swChildOrderItem', swchildorderitem_1.SWChildOrderItem.Factory())
	    .directive('swOrderItem', sworderitem_1.SWOrderItem.Factory())
	    .directive('swoishippinglabelstamp', swoishippinglabelstamp_1.SWOiShippingLabelStamp.Factory())
	    .directive('swOrderItemDetailStamp', sworderitemdetailstamp_1.SWOrderItemDetailStamp.Factory())
	    .directive('swOrderItems', sworderitems_1.SWOrderItems.Factory())
	    .directive('swresizedimage', swresizedimage_1.SWResizedImage.Factory())
	    .constant('orderItemPartialsPath', 'orderitem/components/');
	exports.orderitemmodule = orderitemmodule;


/***/ },
/* 176 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWChildOrderItem = (function () {
	    function SWChildOrderItem($log, $http, $compile, $templateCache, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: "A",
	            scope: {
	                orderItem: "=",
	                orderId: "@",
	                childOrderItems: "=",
	                attributes: "="
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(orderItemPartialsPath) + "childorderitem.html",
	            link: function (scope, element, attr) {
	                var columnsConfig = [
	                    {
	                        "isDeletable": false,
	                        "isExportable": true,
	                        "propertyIdentifier": "_orderitem.orderItemID",
	                        "ormtype": "id",
	                        "isVisible": true,
	                        "isSearchable": true,
	                        "title": "Order Item ID"
	                    },
	                    {
	                        "title": "Order Item Type",
	                        "propertyIdentifier": "_orderitem.orderItemType",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Order Item Price",
	                        "propertyIdentifier": "_orderitem.price",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Sku Name",
	                        "propertyIdentifier": "_orderitem.sku.skuName",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Sku Price",
	                        "propertyIdentifier": "_orderitem.skuPrice",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Sku ID",
	                        "propertyIdentifier": "_orderitem.sku.skuID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "SKU Code",
	                        "propertyIdentifier": "_orderitem.sku.skuCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product ID",
	                        "propertyIdentifier": "_orderitem.sku.product.productID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product Name",
	                        "propertyIdentifier": "_orderitem.sku.product.productName",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product Description",
	                        "propertyIdentifier": "_orderitem.sku.product.productDescription",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Image File Name",
	                        "propertyIdentifier": "_orderitem.sku.imageFile",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.sku.skuPrice",
	                        "ormtype": "string"
	                    },
	                    {
	                        "title": "Product Type",
	                        "propertyIdentifier": "_orderitem.sku.product.productType",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.sku.baseProductType",
	                        "persistent": false
	                    },
	                    {
	                        "title": "Qty.",
	                        "propertyIdentifier": "_orderitem.quantity",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Fulfillment Method Name",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.fulfillmentMethod.fulfillmentMethodName",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Fulfillment ID",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.orderFulfillmentID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Fulfillment Method Type",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.fulfillmentMethod.fulfillmentMethodType",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.orderFulfillment.pickupLocation.primaryAddress.address",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Street Address",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.streetAddress",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Street Address 2",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.street2Address",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Postal Code",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.postalCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "City",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.city",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "State",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.stateCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Country",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.countryCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Total",
	                        "propertyIdentifier": "_orderitem.itemTotal",
	                        "persistent": false
	                    },
	                    {
	                        "title": "Discount Amount",
	                        "propertyIdentifier": "_orderitem.discountAmount",
	                        "persistent": false
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.extendedPrice",
	                        "persistent": false
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundleGroup.amount"
	                    },
	                    {
	                        "title": "Product Bundle Group",
	                        "propertyIdentifier": "_orderitem.productBundleGroup.productBundleGroupID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundleGroup.amountType"
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundleGroupPrice",
	                        "persistent": false
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundlePrice",
	                        "persistent": false
	                    }
	                ];
	                //add attributes to the column config
	                angular.forEach(scope.attributes, function (attribute) {
	                    var attributeColumn = {
	                        propertyIdentifier: "_orderitem." + attribute.attributeCode,
	                        attributeID: attribute.attributeID,
	                        attributeSetObject: "orderItem"
	                    };
	                    columnsConfig.push(attributeColumn);
	                });
	                var filterGroupsConfig = [
	                    {
	                        "filterGroup": [
	                            {
	                                "propertyIdentifier": "_orderitem.parentOrderItem.orderItemID",
	                                "comparisonOperator": "=",
	                                "value": scope.orderItem.$$getID(),
	                            }
	                        ]
	                    }
	                ];
	                var options = {
	                    columnsConfig: angular.toJson(columnsConfig),
	                    filterGroupsConfig: angular.toJson(filterGroupsConfig),
	                    allRecords: true
	                };
	                //hide the children on click
	                scope.hideChildren = function (orderItem) {
	                    //Set all child order items to clicked = false.
	                    angular.forEach(scope.childOrderItems, function (child) {
	                        console.dir(child);
	                        child.hide = !child.hide;
	                        scope.orderItem.clicked = !scope.orderItem.clicked;
	                    });
	                };
	                /**
	                * Returns a list of child order items.
	                */
	                scope.getChildOrderItems = function (orderItem) {
	                    orderItem.clicked = true;
	                    if (!scope.orderItem.childItemsRetrieved) {
	                        scope.orderItem.childItemsRetrieved = true;
	                        var orderItemsPromise = $hibachi.getEntity('orderItem', options);
	                        orderItemsPromise.then(function (value) {
	                            var collectionConfig = {};
	                            collectionConfig.columns = columnsConfig;
	                            collectionConfig.baseEntityName = 'SlatwallOrderItem';
	                            collectionConfig.baseEntityAlias = '_orderitem';
	                            var childOrderItems = $hibachi.populateCollection(value.records, collectionConfig);
	                            angular.forEach(childOrderItems, function (childOrderItem) {
	                                childOrderItem.hide = false;
	                                childOrderItem.depth = orderItem.depth + 1;
	                                childOrderItem.data.parentOrderItem = orderItem;
	                                childOrderItem.data.parentOrderItemQuantity = scope.orderItem.data.quantity / scope.orderItem.data.parentOrderItemQuantity;
	                                scope.childOrderItems.splice(scope.childOrderItems.indexOf(orderItem) + 1, 0, childOrderItem);
	                                childOrderItem.data.productBundleGroupPercentage = 1;
	                                if (childOrderItem.data.productBundleGroup.data.amountType === 'skuPricePercentageIncrease') {
	                                    childOrderItem.data.productBundleGroupPercentage = 1 + childOrderItem.data.productBundleGroup.data.amount / 100;
	                                }
	                                else if (childOrderItem.data.productBundleGroup.data.amountType === 'skuPricePercentageDecrease') {
	                                    childOrderItem.data.productBundleGroupPercentage = 1 - childOrderItem.data.productBundleGroup.data.amount / 100;
	                                }
	                            });
	                        });
	                    }
	                };
	            }
	        };
	    }
	    SWChildOrderItem.Factory = function () {
	        var directive = function ($log, $http, $compile, $templateCache, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	            return new SWChildOrderItem($log, $http, $compile, $templateCache, $hibachi, orderItemPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$http',
	            '$compile',
	            '$templateCache',
	            '$hibachi',
	            'orderItemPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWChildOrderItem;
	})();
	exports.SWChildOrderItem = SWChildOrderItem;


/***/ },
/* 177 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWOrderItem = (function () {
	    //@ngInject
	    function SWOrderItem($log, $compile, $http, $templateCache, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: "A",
	            scope: {
	                orderItem: "=",
	                orderId: "@",
	                attributes: "=",
	                paginator: "=?"
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(orderItemPartialsPath) + "orderitem.html",
	            link: function (scope, element, attr) {
	                $log.debug('order item init');
	                $log.debug(scope.orderItem);
	                scope.orderItem.clicked = false; //Never been clicked
	                scope.orderItem.details = [];
	                scope.orderItem.events = [];
	                scope.orderItem.queuePosition;
	                scope.orderItem.onWaitlist = false;
	                scope.orderItem.isPending = false;
	                scope.orderItem.isRegistered = false;
	                var foundPosition = false;
	                if (scope.orderItem.data.sku.data.product.data.productType.data.systemCode === 'event') {
	                    var eventRegistrationPromise = scope.orderItem.$$getEventRegistrations();
	                    eventRegistrationPromise.then(function () {
	                        angular.forEach(scope.orderItem.data.eventRegistrations, function (eventRegistration) {
	                            $log.debug(eventRegistration);
	                            var eventRegistrationPromise = eventRegistration.$$getEventRegistrationStatusType();
	                            eventRegistrationPromise.then(function (rec) {
	                                $log.debug(rec);
	                                angular.forEach(rec.records, function (record) {
	                                    $log.debug("Records");
	                                    $log.debug(record.eventRegistrationStatusType);
	                                    angular.forEach(record.eventRegistrationStatusType, function (statusType) {
	                                        if ((angular.isDefined(statusType.systemCode) && statusType.systemCode !== null) && statusType.systemCode === "erstWaitlisted") {
	                                            scope.orderItem.onWaitlist = true;
	                                            $log.debug("Found + " + statusType.systemCode);
	                                            //Because the customer is waitlisted, we need to get the number of customers ahead of them in the queue.
	                                            var position = getPositionInQueueFor(scope.orderItem);
	                                            scope.orderItem.queuePosition = position;
	                                        }
	                                        else if ((angular.isDefined(statusType.systemCode) && statusType.systemCode !== null) && statusType.systemCode === "erstRegistered") {
	                                            scope.orderItem.isRegistered = true;
	                                            $log.debug("Found + " + statusType.systemCode);
	                                        }
	                                        else if ((angular.isDefined(statusType.systemCode) && statusType.systemCode !== null) && statusType.systemCode === "erstPendingApproval") {
	                                            scope.orderItem.isPending = true;
	                                            $log.debug("Found + " + statusType.systemCode);
	                                        }
	                                        else {
	                                            $log.error("Couldn't resolve a status type for: " + statusType.systemCode);
	                                        }
	                                    });
	                                });
	                            });
	                        });
	                    });
	                }
	                /**
	                * Returns the current position in the queue for an orderItem that's on the waiting list.
	                */
	                var getPositionInQueueFor = function (orderItem) {
	                    $log.debug("Retrieving position in Queue: ");
	                    var queueConfig = [
	                        {
	                            "propertyIdentifier": "_eventregistration.waitlistQueuePositionStruct",
	                            "isVisible": true,
	                            "persistent": false,
	                            "title": "Event Registrations"
	                        }];
	                    var queueGroupsConfig = [
	                        {
	                            "filterGroup": [
	                                {
	                                    "propertyIdentifier": "_eventregistration.orderItem.orderItemID",
	                                    "comparisonOperator": "=",
	                                    "value": orderItem.$$getID(),
	                                }
	                            ]
	                        }
	                    ];
	                    var queueOptions = {
	                        columnsConfig: angular.toJson(queueConfig),
	                        filterGroupsConfig: angular.toJson(queueGroupsConfig),
	                        allRecords: true
	                    };
	                    var positionPromise = $hibachi.getEntity('EventRegistration', queueOptions);
	                    $log.debug(positionPromise);
	                    positionPromise.then(function (value) {
	                        angular.forEach(value.records, function (position) {
	                            $log.debug("Position: " + position.waitlistQueuePositionStruct);
	                            if (position.waitlistQueuePositionStruct !== -1) {
	                                scope.orderItem.queuePosition = position.waitlistQueuePositionStruct; //Use the value.
	                                return position.waitlistQueuePositionStruct;
	                            }
	                        });
	                    });
	                };
	                //define how we get child order items
	                var columnsConfig = [
	                    {
	                        "isDeletable": false,
	                        "isExportable": true,
	                        "propertyIdentifier": "_orderitem.orderItemID",
	                        "ormtype": "id",
	                        "isVisible": true,
	                        "isSearchable": true,
	                        "title": "Order Item ID"
	                    },
	                    {
	                        "title": "Order Item Type",
	                        "propertyIdentifier": "_orderitem.orderItemType",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Order Item Price",
	                        "propertyIdentifier": "_orderitem.price",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Sku Name",
	                        "propertyIdentifier": "_orderitem.sku.skuName",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Sku Price",
	                        "propertyIdentifier": "_orderitem.skuPrice",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Sku ID",
	                        "propertyIdentifier": "_orderitem.sku.skuID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "SKU Code",
	                        "propertyIdentifier": "_orderitem.sku.skuCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product Bundle Group",
	                        "propertyIdentifier": "_orderitem.productBundleGroup.productBundleGroupID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product ID",
	                        "propertyIdentifier": "_orderitem.sku.product.productID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product Name",
	                        "propertyIdentifier": "_orderitem.sku.product.productName",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product Type",
	                        "propertyIdentifier": "_orderitem.sku.product.productType",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product Description",
	                        "propertyIdentifier": "_orderitem.sku.product.productDescription",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.sku.baseProductType",
	                        "persistent": false
	                    },
	                    {
	                        "title": "Event Start Date",
	                        "propertyIdentifier": "_orderitem.sku.eventStartDateTime",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Product Description",
	                        "propertyIdentifier": "_orderitem.sku.options",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.skuPrice",
	                        "ormtype": "string"
	                    },
	                    {
	                        "title": "Image File Name",
	                        "propertyIdentifier": "_orderitem.sku.imageFile",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Qty.",
	                        "propertyIdentifier": "_orderitem.quantity",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Fulfillment Method Name",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.fulfillmentMethod.fulfillmentMethodName",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Fulfillment ID",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.orderFulfillmentID",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Fulfillment Method Type",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.fulfillmentMethod.fulfillmentMethodType",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.orderFulfillment.pickupLocation.primaryAddress.address",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Street Address",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.streetAddress",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Street Address 2",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.street2Address",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Postal Code",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.postalCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "City",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.city",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "State",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.stateCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Country",
	                        "propertyIdentifier": "_orderitem.orderFulfillment.shippingAddress.countryCode",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.orderFulfillment.pickupLocation.primaryAddress.address",
	                        "isVisible": true,
	                        "isDeletable": true
	                    },
	                    {
	                        "title": "Total",
	                        "propertyIdentifier": "_orderitem.itemTotal",
	                        "persistent": false
	                    },
	                    {
	                        "title": "Discount Amount",
	                        "propertyIdentifier": "_orderitem.discountAmount",
	                        "persistent": false
	                    },
	                    {
	                        "title": "Tax Amount",
	                        "propertyIdentifier": "_orderitem.taxAmount",
	                        "persistent": false
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.extendedPrice",
	                        "persistent": false
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundleGroup.amount",
	                        "ormtype": "big_decimal"
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundleGroup.amountType",
	                        "ormtype": "string"
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundleGroupPrice",
	                        "persistent": false
	                    },
	                    {
	                        "propertyIdentifier": "_orderitem.productBundlePrice",
	                        "persistent": false
	                    }
	                ];
	                //Add attributes to the column configuration
	                angular.forEach(scope.attributes, function (attribute) {
	                    var attributeColumn = {
	                        propertyIdentifier: "_orderitem." + attribute.attributeCode,
	                        attributeID: attribute.attributeID,
	                        attributeSetObject: "orderItem"
	                    };
	                    columnsConfig.push(attributeColumn);
	                });
	                var filterGroupsConfig = [
	                    {
	                        "filterGroup": [
	                            {
	                                "propertyIdentifier": "_orderitem.parentOrderItem.orderItemID",
	                                "comparisonOperator": "=",
	                                "value": scope.orderItem.$$getID(),
	                            }
	                        ]
	                    }
	                ];
	                var options = {
	                    columnsConfig: angular.toJson(columnsConfig),
	                    filterGroupsConfig: angular.toJson(filterGroupsConfig),
	                    allRecords: true
	                };
	                //Create a list of order items.
	                scope.childOrderItems = [];
	                scope.orderItem.depth = 1;
	                /**
	                * Hide orderItem children on clicking the details link.
	                */
	                scope.hideChildren = function (orderItem) {
	                    //Set all child order items to clicked = false.
	                    angular.forEach(scope.childOrderItems, function (child) {
	                        $log.debug("hideing");
	                        child.hide = !child.hide;
	                        scope.orderItem.clicked = !scope.orderItem.clicked;
	                    });
	                };
	                //Delete orderItem
	                scope.deleteEntity = function () {
	                    $log.debug("Deleting");
	                    $log.debug(scope.orderItem);
	                    var deletePromise = scope.orderItem.$$delete();
	                    deletePromise.then(function () {
	                        delete scope.orderItem;
	                        scope.paginator.getCollection();
	                    });
	                };
	                /**
	                * Gets a list of child order items if they exist.
	                */
	                scope.getChildOrderItems = function () {
	                    if (!scope.orderItem.childItemsRetrieved) {
	                        scope.orderItem.clicked = !scope.orderItem.clicked;
	                        scope.orderItem.hide = !scope.orderItem.hide;
	                        scope.orderItem.childItemsRetrieved = true;
	                        var orderItemsPromise = $hibachi.getEntity('orderItem', options);
	                        orderItemsPromise.then(function (value) {
	                            var collectionConfig = {};
	                            collectionConfig.columns = columnsConfig;
	                            collectionConfig.baseEntityName = 'SlatwallOrderItem';
	                            collectionConfig.baseEntityAlias = '_orderitem';
	                            var childOrderItems = $hibachi.populateCollection(value.records, collectionConfig);
	                            angular.forEach(childOrderItems, function (childOrderItem) {
	                                childOrderItem.depth = scope.orderItem.depth + 1;
	                                scope.childOrderItems.push(childOrderItem);
	                                childOrderItem.data.productBundleGroupPercentage = 1;
	                                if (childOrderItem.data.productBundleGroup.data.amountType === 'skuPricePercentageIncrease') {
	                                    childOrderItem.data.productBundleGroupPercentage = 1 + childOrderItem.data.productBundleGroup.data.amount / 100;
	                                }
	                                else if (childOrderItem.data.productBundleGroup.data.amountType === 'skuPricePercentageDecrease') {
	                                    childOrderItem.data.productBundleGroupPercentage = 1 - childOrderItem.data.productBundleGroup.data.amount / 100;
	                                }
	                            });
	                        });
	                    }
	                    else {
	                        //We already have the items so we just need to show them.
	                        angular.forEach(scope.childOrderItems, function (child) {
	                            child.hide = !child.hide;
	                            scope.orderItem.clicked = !scope.orderItem.clicked;
	                        });
	                    }
	                };
	            }
	        };
	    }
	    SWOrderItem.Factory = function () {
	        var directive = function ($log, $compile, $http, $templateCache, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	            return new SWOrderItem($log, $compile, $http, $templateCache, $hibachi, orderItemPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$compile',
	            '$http',
	            '$templateCache',
	            '$hibachi',
	            'orderItemPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWOrderItem;
	})();
	exports.SWOrderItem = SWOrderItem;


/***/ },
/* 178 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Displays a shipping label in the order items row.
	 * @module slatwalladmin
	 * @class swOrderItemsShippingLabelStamp
	 */
	var SWOiShippingLabelStamp = (function () {
	    function SWOiShippingLabelStamp($log, orderItemPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: 'E',
	            scope: {
	                orderFulfillment: "="
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(orderItemPartialsPath) + "orderfulfillment-shippinglabel.html",
	            link: function (scope, element, attrs) {
	                //Get the template.
	                $log.debug("\n\n<---ORDER FULFILLMENT STAMP--->\n\n");
	                $log.debug(scope.orderFulfillment);
	                $log.debug(scope.orderFulfillment.data.fulfillmentMethodType);
	            }
	        };
	    }
	    SWOiShippingLabelStamp.Factory = function () {
	        var directive = function ($log, orderItemPartialsPath, slatwallPathBuilder) {
	            return new SWOiShippingLabelStamp($log, orderItemPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            'orderItemPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWOiShippingLabelStamp;
	})();
	exports.SWOiShippingLabelStamp = SWOiShippingLabelStamp;


/***/ },
/* 179 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/**
	 * Displays a shipping label in the order items row.
	 * @module slatwalladmin
	 * @class swOrderItemsShippingLabelStamp
	 */
	var SWOrderItemDetailStamp = (function () {
	    function SWOrderItemDetailStamp($log, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: 'A',
	            scope: {
	                systemCode: "=",
	                orderItemId: "=",
	                skuId: "=",
	                orderItem: "="
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(orderItemPartialsPath) + "orderitem-detaillabel.html",
	            link: function (scope, element, attrs) {
	                scope.details = [];
	                scope.orderItem.detailsName = [];
	                var results;
	                $log.debug("Detail stamp");
	                $log.debug(scope.systemCode);
	                $log.debug(scope.orderItemId);
	                $log.debug(scope.skuId);
	                $log.debug(scope.orderItem);
	                /**
	                 * For each type of orderItem, get the appropriate detail information.
	                 *
	                 * Merchandise: Option Group Name and Option
	                 * Event: Event Date, Event Location
	                 * Subscription: Subscription Term, Subscription Benefits
	                 */
	                var getMerchandiseDetails = function (orderItem) {
	                    //Get option and option groups
	                    for (var i = 0; i <= orderItem.data.sku.data.options.length - 1; i++) {
	                        orderItem.details.push(orderItem.data.sku.data.options[i].optionCode);
	                        orderItem.details.push(orderItem.data.sku.data.options[i].optionName);
	                    }
	                };
	                var getSubscriptionDetails = function (orderItem) {
	                    //get Subscription Term and Subscription Benefits
	                    var name = orderItem.data.sku.data.subscriptionTerm.data.subscriptionTermName || "";
	                    orderItem.detailsName.push("Subscription Term:");
	                    orderItem.details.push(name);
	                    //Maybe multiple benefits so show them all.
	                    for (var i = 0; i <= orderItem.data.sku.data.subscriptionBenefits.length - 1; i++) {
	                        var benefitName = orderItem.data.sku.data.subscriptionBenefits[i].subscriptionBenefitName || "";
	                        orderItem.detailsName.push("Subscription Benefit:");
	                        orderItem.details.push(benefitName);
	                    }
	                };
	                var getEventDetails = function (orderItem) {
	                    //get event date, and event location
	                    orderItem.detailsName.push("Event Date: ");
	                    orderItem.details.push(orderItem.data.sku.data.eventStartDateTime);
	                    //Need to iterate this.
	                    for (var i = 0; i <= orderItem.data.sku.data.locations.length - 1; i++) {
	                        orderItem.detailsName.push("Location: ");
	                        orderItem.details.push(orderItem.data.sku.data.locations[i].locationName);
	                    }
	                };
	                if (angular.isDefined(scope.orderItem.details)) {
	                    switch (scope.systemCode) {
	                        case "merchandise":
	                            results = getMerchandiseDetails(scope.orderItem);
	                            break;
	                        case "subscription":
	                            results = getSubscriptionDetails(scope.orderItem);
	                            break;
	                        case "event":
	                            results = getEventDetails(scope.orderItem);
	                            break;
	                    }
	                    scope.orderItem.details.push(results);
	                }
	            }
	        };
	    }
	    SWOrderItemDetailStamp.Factory = function () {
	        var directive = function ($log, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	            return new SWOrderItemDetailStamp($log, $hibachi, orderItemPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$log',
	            '$hibachi',
	            'orderItemPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWOrderItemDetailStamp;
	})();
	exports.SWOrderItemDetailStamp = SWOrderItemDetailStamp;


/***/ },
/* 180 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWOrderItems = (function () {
	    //@ngInject
	    function SWOrderItems($log, $timeout, $location, $hibachi, collectionConfigService, formService, orderItemPartialsPath, slatwallPathBuilder, paginationService) {
	        return {
	            restrict: 'E',
	            scope: {
	                orderId: "@"
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(orderItemPartialsPath) + "orderitems.html",
	            link: function (scope, element, attrs) {
	                var options = {};
	                scope.keywords = "";
	                scope.loadingCollection = false;
	                var searchPromise;
	                scope.searchCollection = function () {
	                    if (searchPromise) {
	                        $timeout.cancel(searchPromise);
	                    }
	                    searchPromise = $timeout(function () {
	                        $log.debug('search with keywords');
	                        $log.debug(scope.keywords);
	                        //Set current page here so that the pagination does not break when getting collection
	                        scope.paginator.setCurrentPage(1);
	                        scope.loadingCollection = true;
	                        scope.getCollection();
	                    }, 500);
	                };
	                $log.debug('Init Order Item');
	                $log.debug(scope.orderId);
	                //Setup the data needed for each order item object.
	                scope.getCollection = function () {
	                    if (scope.pageShow === 'Auto') {
	                        scope.pageShow = 50;
	                    }
	                    var orderItemCollection = collectionConfigService.newCollectionConfig('OrderItem');
	                    orderItemCollection.setDisplayProperties('orderItemID,currencyCode,sku.skuName' +
	                        ',price,skuPrice,sku.skuID,sku.skuCode,productBundleGroup.productBundleGroupID,sku.product.productID' +
	                        ',sku.product.productName,sku.product.productDescription,sku.eventStartDateTime' +
	                        ',quantity,orderFulfillment.fulfillmentMethod.fulfillmentMethodName,orderFulfillment.orderFulfillmentID' +
	                        ',orderFulfillment.shippingAddress.streetAddress' +
	                        ',orderFulfillment.shippingAddress.street2Address,orderFulfillment.shippingAddress.postalCode,orderFulfillment.shippingAddress.city,orderFulfillment.shippingAddress.stateCode' +
	                        ',orderFulfillment.shippingAddress.countryCode' +
	                        ',orderItemType.systemCode,orderFulfillment.fulfillmentMethod.fulfillmentMethodType' +
	                        ',orderFulfillment.pickupLocation.primaryAddress.address.streetAddress,orderFulfillment.pickupLocation.primaryAddress.address.street2Address' +
	                        ',orderFulfillment.pickupLocation.primaryAddress.address.city,orderFulfillment.pickupLocation.primaryAddress.address.stateCode' +
	                        ',orderFulfillment.pickupLocation.primaryAddress.address.postalCode' +
	                        ',itemTotal,discountAmount,taxAmount,extendedPrice,productBundlePrice,sku.baseProductType' +
	                        ',sku.subscriptionBenefits' +
	                        ',sku.product.productType.systemCode,sku.options,sku.locations' +
	                        ',sku.subscriptionTerm.subscriptionTermName' +
	                        ',sku.imageFile' +
	                        '')
	                        .addFilter('order.orderID', scope.orderId)
	                        .addFilter('parentOrderItem', 'null', 'IS')
	                        .setKeywords(scope.keywords)
	                        .setPageShow(scope.paginator.getPageShow());
	                    //add attributes to the column config
	                    angular.forEach(scope.attributes, function (attribute) {
	                        var attributeColumn = {
	                            propertyIdentifier: "_orderitem." + attribute.attributeCode,
	                            attributeID: attribute.attributeID,
	                            attributeSetObject: "orderItem"
	                        };
	                        orderItemCollection.columns.push(attributeColumn);
	                    });
	                    var orderItemsPromise = orderItemCollection.getEntity();
	                    orderItemsPromise.then(function (value) {
	                        scope.collection = value;
	                        var collectionConfig = {};
	                        scope.orderItems = $hibachi.populateCollection(value.pageRecords, orderItemCollection);
	                        for (var orderItem in scope.orderItems) {
	                            $log.debug("OrderItem Product Type");
	                            $log.debug(scope.orderItems);
	                        }
	                        scope.paginator.setPageRecordsInfo(scope.collection);
	                        scope.loadingCollection = false;
	                    }, function (value) {
	                        scope.orderItems = [];
	                    });
	                };
	                var attributesCollection = collectionConfigService.newCollectionConfig('Attribute');
	                attributesCollection.setDisplayProperties('attributeID,attributeCode,attributeName')
	                    .addFilter('displayOnOrderDetailFlag', true)
	                    .addFilter('activeFlag', true)
	                    .setAllRecords(true);
	                var attItemsPromise = attributesCollection.getEntity();
	                attItemsPromise.then(function (value) {
	                    scope.attributes = [];
	                    angular.forEach(value.records, function (attributeItemData) {
	                        //Use that custom attribute name to get the value.
	                        scope.attributes.push(attributeItemData);
	                    });
	                    scope.getCollection();
	                });
	                //Add claim function and cancel function
	                /*scope.appendToCollection = function(){
	                    if(scope.pageShow === 'Auto'){
	                        $log.debug('AppendToCollection');
	                        if(scope.paginator.autoScrollPage < scope.collection.totalPages){
	                            scope.paginator.autoScrollDisabled = true;
	                            scope.paginator.autoScrollPage++;

	                            var appendOptions:any = {};
	                            angular.extend(appendOptions,options);
	                            appendOptions.pageShow = 50;
	                            appendOptions.currentPage = scope.paginator.autoScrollPage;

	                            var collectionListingPromise = $hibachi.getEntity('orderItem', appendOptions);
	                            collectionListingPromise.then(function(value){
	                                scope.collection.pageRecords = scope.collection.pageRecords.concat(value.pageRecords);
	                                scope.autoScrollDisabled = false;
	                            },function(reason){
	                                scope.collection.pageRecords = [];
	                            });
	                        }
	                    }
	                };*/
	                scope.paginator = paginationService.createPagination();
	                scope.paginator.collection = scope.collection;
	                scope.paginator.getCollection = scope.getCollection;
	                //set up custom event as temporary fix to update when new sku is adding via jquery ajax instead of angular scope
	                $(document).on("listingDisplayUpdate", {}, function (event, arg1, arg2) {
	                    scope.orderItems = undefined;
	                    scope.getCollection();
	                });
	            } //<--End link
	        };
	    }
	    SWOrderItems.Factory = function () {
	        var directive = function ($log, $timeout, $location, $hibachi, collectionConfigService, formService, orderItemPartialsPath, slatwallPathBuilder, paginationService) {
	            return new SWOrderItems($log, $timeout, $location, $hibachi, collectionConfigService, formService, orderItemPartialsPath, slatwallPathBuilder, paginationService);
	        };
	        directive.$inject = [
	            '$log',
	            '$timeout',
	            '$location',
	            '$hibachi',
	            'collectionConfigService',
	            'formService',
	            'orderItemPartialsPath',
	            'slatwallPathBuilder',
	            'paginationService'
	        ];
	        return directive;
	    };
	    return SWOrderItems;
	})();
	exports.SWOrderItems = SWOrderItems;


/***/ },
/* 181 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWResizedImage = (function () {
	    function SWResizedImage($http, $log, $q, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	        return {
	            restrict: 'E',
	            scope: {
	                orderItem: "=",
	            },
	            templateUrl: slatwallPathBuilder.buildPartialsPath(orderItemPartialsPath) + "orderitem-image.html",
	            link: function (scope, element, attrs) {
	                var profileName = attrs.profilename;
	                var skuID = scope.orderItem.data.sku.data.skuID;
	                //Get the template.
	                //Call slatwallService to get the path from the image.
	                $hibachi.getResizedImageByProfileName(profileName, skuID)
	                    .then(function (response) {
	                    $log.debug('Get the image');
	                    $log.debug(response.data.resizedImagePaths[0]);
	                    scope.orderItem.imagePath = response.data.resizedImagePaths[0];
	                });
	            }
	        };
	    }
	    SWResizedImage.Factory = function () {
	        var directive = function ($http, $log, $q, $hibachi, orderItemPartialsPath, slatwallPathBuilder) {
	            return new SWResizedImage($http, $log, $q, $hibachi, orderItemPartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$http', '$log', '$q', '$hibachi', 'orderItemPartialsPath',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWResizedImage;
	})();
	exports.SWResizedImage = SWResizedImage;


/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//modules
	var core_module_1 = __webpack_require__(2);
	//services
	//controllers
	var preprocessproduct_create_1 = __webpack_require__(183);
	//filters
	//directives
	var productmodule = angular.module('hibachi.product', [core_module_1.coremodule.name]).config(function () {
	})
	    .constant('productPartialsPath', 'product/components/')
	    .controller('preprocessproduct_create', preprocessproduct_create_1.ProductCreateController);
	exports.productmodule = productmodule;


/***/ },
/* 183 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var ProductCreateController = (function () {
	    //@ngInject
	    function ProductCreateController($scope, $element, $log, $hibachi, collectionConfigService, selectionService, rbkeyService) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$element = $element;
	        this.$log = $log;
	        this.$hibachi = $hibachi;
	        this.collectionConfigService = collectionConfigService;
	        this.selectionService = selectionService;
	        this.rbkeyService = rbkeyService;
	        //on select change get collection
	        this.$scope.preprocessproduct_createCtrl.productTypeChanged = function (selectedOption) {
	            _this.$scope.preprocessproduct_createCtrl.selectedOption = selectedOption;
	            _this.$scope.preprocessproduct_createCtrl.getCollection();
	            _this.selectionService.clearSelection('ListingDisplay');
	        };
	        this.$scope.preprocessproduct_createCtrl.getCollection = function () {
	            var collectionConfig = _this.collectionConfigService.newCollectionConfig('Option');
	            collectionConfig.setDisplayProperties('optionGroup.optionGroupName,optionName', undefined, { isVisible: true });
	            collectionConfig.setDisplayProperties('optionID', undefined, { isVisible: false });
	            //this.collectionConfig.addFilter('optionGroup.optionGroupID',$('input[name="currentOptionGroups"]').val(),'NOT IN')
	            collectionConfig.addFilter('optionGroup.globalFlag', 1, '=');
	            collectionConfig.addFilter('optionGroup.productTypes.productTypeID', _this.$scope.preprocessproduct_createCtrl.selectedOption.value, '=', 'OR');
	            collectionConfig.setOrderBy('optionGroup.sortOrder|ASC,sortOrder|ASC');
	            _this.$scope.preprocessproduct_createCtrl.collectionListingPromise = collectionConfig.getEntity();
	            _this.$scope.preprocessproduct_createCtrl.collectionListingPromise.then(function (data) {
	                _this.$scope.preprocessproduct_createCtrl.collection = data;
	                _this.$scope.preprocessproduct_createCtrl.collection.collectionConfig = collectionConfig;
	            });
	        };
	        var renewalMethodOptions = $("select[name='renewalMethod']")[0];
	        this.$scope.preprocessproduct_createCtrl.renewalMethodOptions = [];
	        angular.forEach(renewalMethodOptions, function (option) {
	            var optionToAdd = {
	                label: option.label,
	                value: option.value
	            };
	            _this.$scope.preprocessproduct_createCtrl.renewalMethodOptions.push(optionToAdd);
	        });
	        this.$scope.preprocessproduct_createCtrl.renewalSkuChoice = this.$scope.preprocessproduct_createCtrl.renewalMethodOptions[1];
	        var productTypeOptions = $("select[name='product.productType.productTypeID']")[0];
	        this.$scope.preprocessproduct_createCtrl.options = [];
	        angular.forEach(productTypeOptions, function (jQueryOption) {
	            var option = {
	                label: jQueryOption.label,
	                value: jQueryOption.value
	            };
	            _this.$scope.preprocessproduct_createCtrl.options.push(option);
	        });
	        this.$scope.preprocessproduct_createCtrl.selectedOption = {};
	        if (angular.isDefined(this.$scope.preprocessproduct_createCtrl.options[0]) && angular.isDefined(this.$scope.preprocessproduct_createCtrl.options[0].value)) {
	            this.$scope.preprocessproduct_createCtrl.selectedOption.value = this.$scope.preprocessproduct_createCtrl.options[0].value;
	        }
	        else {
	            this.$scope.preprocessproduct_createCtrl.selectedOption.value = "";
	        }
	    }
	    return ProductCreateController;
	})();
	exports.ProductCreateController = ProductCreateController;


/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path='../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../typings/tsd.d.ts' />
	//modules
	var core_module_1 = __webpack_require__(2);
	//services
	var productbundleservice_1 = __webpack_require__(185);
	//controllers
	var create_bundle_controller_1 = __webpack_require__(186);
	//directives
	var swproductbundlegrouptype_1 = __webpack_require__(187);
	var swproductbundlegroups_1 = __webpack_require__(188);
	var swproductbundlegroup_1 = __webpack_require__(189);
	var swproductbundlecollectionfilteritemtypeahead_1 = __webpack_require__(190);
	//filters
	var productbundlemodule = angular.module('hibachi.productbundle', [core_module_1.coremodule.name]).config(function () {
	})
	    .constant('productBundlePartialsPath', 'productbundle/components/')
	    .service('productBundleService', productbundleservice_1.ProductBundleService)
	    .controller('create-bundle-controller', create_bundle_controller_1.CreateBundleController)
	    .directive('swProductBundleGroupType', swproductbundlegrouptype_1.SWProductBundleGroupType.Factory())
	    .directive('swProductBundleGroups', swproductbundlegroups_1.SWProductBundleGroups.Factory())
	    .directive('swProductBundleGroup', swproductbundlegroup_1.SWProductBundleGroup.Factory())
	    .directive('swProductBundleCollectionFilterItemTypeahead', swproductbundlecollectionfilteritemtypeahead_1.SWProductBundleCollectionFilterItemTypeahead.Factory());
	exports.productbundlemodule = productbundlemodule;


/***/ },
/* 185 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var ProductBundleService = (function () {
	    function ProductBundleService($log, $hibachi, utilityService) {
	        var _this = this;
	        this.$log = $log;
	        this.$hibachi = $hibachi;
	        this.utilityService = utilityService;
	        this.decorateProductBundleGroup = function (productBundleGroup) {
	            productBundleGroup.data.$$editing = true;
	            var prototype = {
	                $$setMinimumQuantity: function (quantity) {
	                    if (quantity < 0 || quantity === null) {
	                        this.minimumQuantity = 0;
	                    }
	                    if (quantity > this.maximumQuantity) {
	                        this.maximumQuantity = quantity;
	                    }
	                },
	                $$setMaximumQuantity: function (quantity) {
	                    if (quantity < 1 || quantity === null) {
	                        this.maximumQuantity = 1;
	                    }
	                    if (this.maximumQuantity < this.minimumQuantity) {
	                        this.minimumQuantity = this.maximumQuantity;
	                    }
	                },
	                $$setActive: function (value) {
	                    this.active = value;
	                },
	                $$toggleEdit: function () {
	                    if (angular.isUndefined(this.$$editing) || this.$$editing === false) {
	                        this.$$editing = true;
	                    }
	                    else {
	                        this.$$editing = false;
	                    }
	                }
	            };
	            angular.extend(productBundleGroup.data, prototype);
	        };
	        this.formatProductBundleGroupFilters = function (productBundleGroupFilters, filterTerm) {
	            _this.$log.debug('FORMATTING PRODUCT BUNDLE FILTERs');
	            _this.$log.debug(productBundleGroupFilters);
	            _this.$log.debug(filterTerm);
	            if (filterTerm.value === 'sku') {
	                for (var i in productBundleGroupFilters) {
	                    productBundleGroupFilters[i].name = productBundleGroupFilters[i][filterTerm.value + 'Code'];
	                    productBundleGroupFilters[i].type = filterTerm.name;
	                    productBundleGroupFilters[i].entityType = filterTerm.value;
	                    productBundleGroupFilters[i].propertyIdentifier = '_sku.skuID';
	                }
	            }
	            else {
	                for (var i in productBundleGroupFilters) {
	                    productBundleGroupFilters[i].name = productBundleGroupFilters[i][filterTerm.value + 'Name'];
	                    productBundleGroupFilters[i].type = filterTerm.name;
	                    productBundleGroupFilters[i].entityType = filterTerm.value;
	                    if (filterTerm.value === 'brand' || filterTerm.value === 'productType') {
	                        productBundleGroupFilters[i].propertyIdentifier = '_sku.product.' + filterTerm.value + '.' + filterTerm.value + 'ID';
	                    }
	                    else {
	                        productBundleGroupFilters[i].propertyIdentifier = '_sku.' + filterTerm.value + '.' + filterTerm.value + 'ID';
	                    }
	                }
	            }
	            _this.$log.debug(productBundleGroupFilters);
	            return productBundleGroupFilters;
	        };
	        this.$log = $log;
	        this.$hibachi = $hibachi;
	        this.utilityService = utilityService;
	    }
	    ProductBundleService.$inject = [
	        '$log', '$hibachi', 'utilityService'
	    ];
	    return ProductBundleService;
	})();
	exports.ProductBundleService = ProductBundleService;


/***/ },
/* 186 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var CreateBundleController = (function () {
	    //@ngInject
	    function CreateBundleController($scope, $location, $log, $rootScope, $window, $hibachi, dialogService, alertService, productBundleService, formService, productBundlePartialsPath) {
	        $scope.productBundlePartialsPath = productBundlePartialsPath;
	        var getParameterByName = function (name) {
	            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
	            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	        };
	        $scope.$id = "create-bundle-controller";
	        //if this view is part of the dialog section, call the inherited function
	        if (angular.isDefined($scope.scrollToTopOfDialog)) {
	            $scope.scrollToTopOfDialog();
	        }
	        var productID = getParameterByName('productID');
	        var productBundleConstructor = function () {
	            $log.debug($scope);
	            if (angular.isDefined($scope.product)) {
	                for (var form in $scope.product.forms) {
	                    formService.resetForm($scope.product.forms[form]);
	                }
	                if (angular.isDefined($scope.product.data.skus[0])) {
	                    for (var form in $scope.product.data.skus[0].forms) {
	                        formService.resetForm($scope.product.data.skus[0].forms[form]);
	                    }
	                }
	                if (angular.isDefined($scope.product.data.skus[0].data.productBundleGroups.selectedProductBundleGroup)) {
	                    for (var form in $scope.product.data.skus[0].data.productBundleGroups.selectedProductBundleGroup.forms) {
	                        formService.resetForm($scope.product.data.skus[0].data.productBundleGroups.selectedProductBundleGroup.forms[form]);
	                    }
	                }
	            }
	            $scope.product = $hibachi.newProduct();
	            var brand = $hibachi.newBrand();
	            var productType = $hibachi.newProductType();
	            $scope.product.$$setBrand(brand);
	            $scope.product.$$setProductType(productType);
	            $scope.product.$$addSku();
	            $scope.product.data.skus[0].data.productBundleGroups = [];
	        };
	        $scope.productBundleGroup;
	        if (angular.isDefined(productID) && productID !== '') {
	            var productPromise = $hibachi.getProduct({ id: productID });
	            productPromise.promise.then(function () {
	                $log.debug(productPromise.value);
	                productPromise.value.$$getSkus().then(function () {
	                    productPromise.value.data.skus[0].$$getProductBundleGroups().then(function () {
	                        $scope.product = productPromise.value;
	                        angular.forEach($scope.product.data.skus[0].data.productBundleGroups, function (productBundleGroup) {
	                            productBundleGroup.$$getProductBundleGroupType();
	                            productBundleService.decorateProductBundleGroup(productBundleGroup);
	                            productBundleGroup.data.$$editing = false;
	                        });
	                    });
	                });
	            }, productBundleConstructor());
	        }
	        else {
	            productBundleConstructor();
	        }
	    }
	    return CreateBundleController;
	})();
	exports.CreateBundleController = CreateBundleController;


/***/ },
/* 187 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWProductBundleGroupType = (function () {
	    function SWProductBundleGroupType($http, $log, $hibachi, formService, collectionConfigService, productBundlePartialsPath, productBundleService, slatwallPathBuilder) {
	        return {
	            restrict: 'A',
	            templateUrl: slatwallPathBuilder.buildPartialsPath(productBundlePartialsPath) + "productbundlegrouptype.html",
	            scope: {
	                productBundleGroup: "="
	            },
	            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
	                    $log.debug('productBundleGrouptype');
	                    $log.debug($scope.productBundleGroup);
	                    $scope.productBundleGroupTypes = {};
	                    $scope.$$id = "productBundleGroupType";
	                    $scope.productBundleGroupTypes.value = [];
	                    $scope.productBundleGroupTypes.$$adding = false;
	                    $scope.productBundleGroupTypeSaving = false;
	                    $scope.productBundleGroupType = {};
	                    if (angular.isUndefined($scope.productBundleGroup.data.productBundleGroupType)) {
	                        var productBundleGroupType = $hibachi.newType();
	                        var parentType = $hibachi.newType();
	                        parentType.data.typeID = '154dcdd2f3fd4b5ab5498e93470957b8';
	                        productBundleGroupType.$$setParentType(parentType);
	                        $scope.productBundleGroup.$$setProductBundleGroupType(productBundleGroupType);
	                    }
	                    /**
	                     * Sets the state to adding and sets the initial data.
	                     */
	                    $scope.productBundleGroupTypes.setAdding = function () {
	                        $scope.productBundleGroupTypes.$$adding = !$scope.productBundleGroupTypes.$$adding;
	                        if (!$scope.productBundleGroupTypes.$$adding) {
	                            var productBundleGroupType = $hibachi.newType();
	                            var parentType = $hibachi.newType();
	                            parentType.data.typeID = '154dcdd2f3fd4b5ab5498e93470957b8';
	                            productBundleGroupType.$$setParentType(parentType);
	                            $scope.productBundleGroup.data.productBundleGroupType.data.typeName = "";
	                            productBundleGroupType.data.typeName = $scope.productBundleGroup.data.productBundleGroupType.data.typeName;
	                            productBundleGroupType.data.typeDescription = '';
	                            productBundleGroupType.data.typeNameCode = '';
	                            angular.extend($scope.productBundleGroup.data.productBundleGroupType, productBundleGroupType);
	                        }
	                    };
	                    $scope.showAddProductBundleGroupTypeBtn = false;
	                    /**
	                     * Handles looking up the keyword and populating the dropdown as a user types.
	                     */
	                    $scope.productBundleGroupTypes.getTypesByKeyword = function (keyword) {
	                        $log.debug('getTypesByKeyword');
	                        var filterGroupsConfig = '[' +
	                            ' {  ' +
	                            '"filterGroup":[  ' +
	                            ' {  ' +
	                            ' "propertyIdentifier":"_type.parentType.systemCode",' +
	                            ' "comparisonOperator":"=",' +
	                            ' "value":"productBundleGroupType",' +
	                            ' "ormtype":"string",' +
	                            ' "conditionDisplay":"Equals"' +
	                            '},' +
	                            '{' +
	                            '"logicalOperator":"AND",' +
	                            ' "propertyIdentifier":"_type.typeName",' +
	                            ' "comparisonOperator":"like",' +
	                            ' "ormtype":"string",' +
	                            ' "value":"%' + keyword + '%"' +
	                            '  }' +
	                            ' ]' +
	                            ' }' +
	                            ']';
	                        return $hibachi.getEntity('type', { filterGroupsConfig: filterGroupsConfig.trim() })
	                            .then(function (value) {
	                            $log.debug('typesByKeyword');
	                            $log.debug(value);
	                            $scope.productBundleGroupTypes.value = value.pageRecords;
	                            var myLength = keyword.length;
	                            if (myLength > 0) {
	                                $scope.showAddProductBundleGroupTypeBtn = true;
	                            }
	                            else {
	                                $scope.showAddProductBundleGroupTypeBtn = false;
	                            }
	                            return $scope.productBundleGroupTypes.value;
	                        });
	                    };
	                    /**
	                     * Handles user selection of the dropdown.
	                     */
	                    $scope.selectProductBundleGroupType = function (item) {
	                        angular.extend($scope.productBundleGroup.data.productBundleGroupType.data, item);
	                        var parentType = $hibachi.newType();
	                        parentType.data.typeID = '154dcdd2f3fd4b5ab5498e93470957b8';
	                        $scope.productBundleGroup.data.productBundleGroupType.$$setParentType(parentType);
	                        $scope.showAddProductBundleGroupTypeBtn = false;
	                    };
	                    /**
	                     * Closes the add screen
	                     */
	                    $scope.closeAddScreen = function () {
	                        $scope.productBundleGroupTypes.$$adding = false;
	                        $scope.showAddProductBundleGroupTypeBtn = false;
	                    };
	                    /**
	                     * Clears the type name
	                     */
	                    $scope.clearTypeName = function () {
	                        if (angular.isDefined($scope.productBundleGroup.data.productBundleGroupType)) {
	                            $scope.productBundleGroup.data.productBundleGroupType.data.typeName = '';
	                        }
	                    };
	                    /**
	                     * Saves product bundle group type
	                     */
	                    $scope.saveProductBundleGroupType = function () {
	                        $scope.productBundleGroupTypeSaving = true;
	                        //Gets the promise from save                    
	                        var promise = $scope.productBundleGroup.data.productBundleGroupType.$$save();
	                        promise.then(function (response) {
	                            //Calls close function
	                            if (promise.$$state.status) {
	                                $scope.productBundleGroupTypeSaving = false;
	                                $scope.closeAddScreen();
	                            }
	                        }, function () {
	                            $scope.productBundleGroupTypeSaving = false;
	                        });
	                    };
	                    //Sets up clickOutside Directive call back arguments
	                    $scope.clickOutsideArgs = {
	                        callBackActions: [$scope.closeAddScreen]
	                    };
	                    /**
	                     * Works with swclickoutside directive to close dialog
	                     */
	                    $scope.closeThis = function (clickOutsideArgs) {
	                        //Check against the object state
	                        if (!$scope.productBundleGroup.data.productBundleGroupType.$$isPersisted()) {
	                            //Perform all callback actions
	                            for (var callBackAction in clickOutsideArgs.callBackActions) {
	                                clickOutsideArgs.callBackActions[callBackAction]();
	                            }
	                        }
	                    };
	                }]
	        };
	    }
	    SWProductBundleGroupType.Factory = function () {
	        var directive = function ($http, $log, $hibachi, formService, collectionConfigService, productBundlePartialsPath, productBundleService, slatwallPathBuilder) {
	            return new SWProductBundleGroupType($http, $log, $hibachi, formService, collectionConfigService, productBundlePartialsPath, productBundleService, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$log',
	            '$hibachi',
	            'formService',
	            'collectionConfigService',
	            'productBundlePartialsPath',
	            'productBundleService',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWProductBundleGroupType;
	})();
	exports.SWProductBundleGroupType = SWProductBundleGroupType;


/***/ },
/* 188 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWProductBundleGroupsController = (function () {
	    //@ngInject
	    function SWProductBundleGroupsController($scope, $element, $attrs, $log, productBundleService, $hibachi) {
	        var _this = this;
	        this.$scope = $scope;
	        this.$element = $element;
	        this.$attrs = $attrs;
	        this.$log = $log;
	        this.productBundleService = productBundleService;
	        this.$hibachi = $hibachi;
	        this.removeProductBundleGroup = function (index) {
	            if (angular.isDefined(_this.productBundleGroups[index]) && _this.productBundleGroups[index].$$isPersisted()) {
	                _this.productBundleGroups[index].$$delete().then(function (data) {
	                    //no more logic to run     
	                });
	            }
	            _this.productBundleGroups.splice(index, 1);
	        };
	        this.addProductBundleGroup = function () {
	            var productBundleGroup = _this.$hibachi.newProductBundleGroup();
	            console.log("Adding PBG", productBundleGroup);
	            productBundleGroup.$$setProductBundleSku(_this.sku);
	            productBundleGroup = _this.productBundleService.decorateProductBundleGroup(productBundleGroup);
	        };
	        $scope.editing = $scope.editing || true;
	        angular.forEach(this.productBundleGroups, function (obj) {
	            productBundleService.decorateProductBundleGroup(obj);
	            obj.data.$$editing = false;
	        });
	    }
	    return SWProductBundleGroupsController;
	})();
	exports.SWProductBundleGroupsController = SWProductBundleGroupsController;
	var SWProductBundleGroups = (function () {
	    function SWProductBundleGroups($http, $log, $hibachi, metadataService, productBundlePartialsPath, productBundleService, slatwallPathBuilder) {
	        this.restrict = 'EA';
	        this.scope = {
	            sku: "=",
	            productBundleGroups: "="
	        };
	        this.bindToController = {
	            sku: "=",
	            productBundleGroups: "="
	        };
	        this.controller = SWProductBundleGroupsController;
	        this.controllerAs = "swProductBundleGroups";
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(productBundlePartialsPath) + "productbundlegroups.html";
	    }
	    SWProductBundleGroups.Factory = function () {
	        var directive = function ($http, $log, $hibachi, metadataService, productBundlePartialsPath, productBundleService, slatwallPathBuilder) {
	            return new SWProductBundleGroups($http, $log, $hibachi, metadataService, productBundlePartialsPath, productBundleService, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            '$http',
	            '$log',
	            '$hibachi',
	            'metadataService',
	            'productBundlePartialsPath',
	            'productBundleService',
	            'slatwallPathBuilder'
	        ];
	        return directive;
	    };
	    return SWProductBundleGroups;
	})();
	exports.SWProductBundleGroups = SWProductBundleGroups;


/***/ },
/* 189 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var CollectionFilterItem = (function () {
	    function CollectionFilterItem(name, type, displayPropertyIdentifier, propertyIdentifier, displayValue, value, comparisonOperator, logicalOperator) {
	        this.name = name;
	        this.type = type;
	        this.displayPropertyIdentifier = displayPropertyIdentifier;
	        this.propertyIdentifier = propertyIdentifier;
	        this.displayValue = displayValue;
	        this.value = value;
	        this.comparisonOperator = comparisonOperator;
	        this.logicalOperator = logicalOperator;
	    }
	    return CollectionFilterItem;
	})();
	var SWProductBundleGroupController = (function () {
	    // @ngInject
	    function SWProductBundleGroupController($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath) {
	        var _this = this;
	        this.$log = $log;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.productBundleService = productBundleService;
	        this.metadataService = metadataService;
	        this.utilityService = utilityService;
	        this.formService = formService;
	        this.$hibachi = $hibachi;
	        this.productBundlePartialsPath = productBundlePartialsPath;
	        this.init = function () {
	            _this.maxRecords = 10;
	            _this.recordsCount = 0;
	            _this.pageRecordsStart = 0;
	            _this.pageRecordsEnd = 0;
	            _this.recordsPerPage = 10;
	            _this.showAll = false;
	            _this.showAdvanced = false;
	            _this.currentPage = 1;
	            _this.pageShow = 10;
	            _this.searchAllCollectionConfigs = [];
	            if (angular.isUndefined(_this.filterPropertiesList)) {
	                _this.filterPropertiesList = {};
	                var filterPropertiesPromise = _this.$hibachi.getFilterPropertiesByBaseEntityName('_sku');
	                filterPropertiesPromise.then(function (value) {
	                    _this.metadataService.setPropertiesList(value, '_sku');
	                    _this.filterPropertiesList['_sku'] = _this.metadataService.getPropertiesListByBaseEntityAlias('_sku');
	                    _this.metadataService.formatPropertiesList(_this.filterPropertiesList['_sku'], '_sku');
	                });
	            }
	            _this.searchOptions = {
	                options: [
	                    {
	                        name: "All",
	                        value: "All"
	                    },
	                    {
	                        name: "Product Type",
	                        value: "productType"
	                    },
	                    {
	                        name: "Brand",
	                        value: "brand"
	                    },
	                    {
	                        name: "Products",
	                        value: "product"
	                    },
	                    {
	                        name: "Skus",
	                        value: "sku"
	                    }
	                ],
	                selected: {
	                    name: "All",
	                    value: "All"
	                },
	                setSelected: function (searchOption) {
	                    _this.searchOptions.selected = searchOption;
	                }
	            };
	            _this.navigation = {
	                value: 'Basic',
	                setValue: function (value) {
	                    _this.value = value;
	                }
	            };
	            _this.filterTemplatePath = _this.productBundlePartialsPath + "productbundlefilter.html";
	            _this.productBundleGroupFilters = {};
	            _this.productBundleGroupFilters.value = [];
	            if (angular.isUndefined(_this.productBundleGroup.data.skuCollectionConfig) || _this.productBundleGroup.data.skuCollectionConfig === null) {
	                _this.productBundleGroup.data.skuCollectionConfig = _this.collectionConfigService.newCollectionConfig("Sku").getCollectionConfig();
	            }
	            var options = {
	                filterGroupsConfig: _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup,
	                columnsConfig: _this.productBundleGroup.data.skuCollectionConfig.columns,
	            };
	            _this.getCollection();
	        };
	        this.deleteEntity = function (type) {
	            _this.removeProductBundleGroup({ index: _this.index });
	            _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup = [];
	        };
	        this.getCollection = function () {
	            var options = {
	                filterGroupsConfig: angular.toJson(_this.productBundleGroup.data.skuCollectionConfig.filterGroups),
	                columnsConfig: angular.toJson(_this.productBundleGroup.data.skuCollectionConfig.columns),
	                currentPage: 1,
	                pageShow: 10
	            };
	            var collectionPromise = _this.$hibachi.getEntity('Sku', options);
	            collectionPromise.then(function (response) {
	                _this.collection = response;
	            });
	        };
	        this.increaseCurrentCount = function () {
	            if (angular.isDefined(_this.totalPages) && _this.totalPages != _this.currentPage) {
	                _this.currentPage++;
	            }
	            else {
	                _this.currentPage = 1;
	            }
	        };
	        this.resetCurrentCount = function () {
	            _this.currentPage = 1;
	        };
	        this.save = function () {
	            var savePromise = _this.productBundleGroup.$$save();
	            savePromise.then(function (response) {
	                _this.productBundleGroup.data.$$toggleEdit();
	            }).catch(function (data) {
	                //error handling handled by $$save
	            });
	        };
	        this.saveAndAddBundleGroup = function () {
	            var savePromise = _this.productBundleGroup.$$save();
	            savePromise.then(function (response) {
	                _this.productBundleGroup.data.$$toggleEdit();
	                _this.addProductBundleGroup();
	            }).catch(function (data) {
	                //error handling handled by $$save
	            });
	        };
	        this.init();
	    }
	    return SWProductBundleGroupController;
	})();
	var SWProductBundleGroup = (function () {
	    // @ngInject
	    function SWProductBundleGroup($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath, slatwallPathBuilder) {
	        this.$log = $log;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.productBundleService = productBundleService;
	        this.metadataService = metadataService;
	        this.utilityService = utilityService;
	        this.formService = formService;
	        this.$hibachi = $hibachi;
	        this.productBundlePartialsPath = productBundlePartialsPath;
	        this.restrict = "EA";
	        this.scope = {};
	        this.bindToController = {
	            productBundleGroup: "=",
	            productBundleGroups: "=",
	            index: "=",
	            addProductBundleGroup: "&",
	            removeProductBundleGroup: "&",
	            formName: "@"
	        };
	        this.controller = SWProductBundleGroupController;
	        this.controllerAs = "swProductBundleGroup";
	        this.link = function ($scope, element, attrs, ctrl) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(productBundlePartialsPath) + "productbundlegroup.html";
	    }
	    SWProductBundleGroup.Factory = function () {
	        var directive = function ($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath, slatwallPathBuilder) {
	            return new SWProductBundleGroup($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            "$log", "$timeout", "collectionConfigService", "productBundleService", "metadataService", "utilityService", "formService", "$hibachi", "productBundlePartialsPath",
	            "slatwallPathBuilder"
	        ];
	        return directive;
	    };
	    return SWProductBundleGroup;
	})();
	exports.SWProductBundleGroup = SWProductBundleGroup;


/***/ },
/* 190 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var CollectionFilterItem = (function () {
	    function CollectionFilterItem(name, type, displayPropertyIdentifier, propertyIdentifier, displayValue, value, comparisonOperator, logicalOperator) {
	        this.name = name;
	        this.type = type;
	        this.displayPropertyIdentifier = displayPropertyIdentifier;
	        this.propertyIdentifier = propertyIdentifier;
	        this.displayValue = displayValue;
	        this.value = value;
	        this.comparisonOperator = comparisonOperator;
	        this.logicalOperator = logicalOperator;
	    }
	    return CollectionFilterItem;
	})();
	var SWProductBundleCollectionFilterItemTypeaheadController = (function () {
	    // @ngInject
	    function SWProductBundleCollectionFilterItemTypeaheadController($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath) {
	        var _this = this;
	        this.$log = $log;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.productBundleService = productBundleService;
	        this.metadataService = metadataService;
	        this.utilityService = utilityService;
	        this.formService = formService;
	        this.$hibachi = $hibachi;
	        this.productBundlePartialsPath = productBundlePartialsPath;
	        this.init = function () {
	            _this.maxRecords = 10;
	            _this.recordsCount = 0;
	            _this.pageRecordsStart = 0;
	            _this.pageRecordsEnd = 0;
	            _this.recordsPerPage = 10;
	            _this.showAll = false;
	            _this.showAdvanced = false;
	            _this.currentPage = 1;
	            _this.pageShow = 10;
	            _this.searchAllCollectionConfigs = [];
	            if (angular.isUndefined(_this.filterPropertiesList)) {
	                _this.filterPropertiesList = {};
	                var filterPropertiesPromise = _this.$hibachi.getFilterPropertiesByBaseEntityName('_sku');
	                filterPropertiesPromise.then(function (value) {
	                    _this.metadataService.setPropertiesList(value, '_sku');
	                    _this.filterPropertiesList['_sku'] = _this.metadataService.getPropertiesListByBaseEntityAlias('_sku');
	                    _this.metadataService.formatPropertiesList(_this.filterPropertiesList['_sku'], '_sku');
	                });
	            }
	            _this.skuCollectionConfig = {
	                baseEntityName: "Sku",
	                baseEntityAlias: "_sku",
	                collectionConfig: _this.productBundleGroup.data.skuCollectionConfig,
	                collectionObject: 'Sku'
	            };
	            _this.searchOptions = {
	                options: [
	                    {
	                        name: "All",
	                        value: "All"
	                    },
	                    {
	                        name: "Product Type",
	                        value: "productType"
	                    },
	                    {
	                        name: "Brand",
	                        value: "brand"
	                    },
	                    {
	                        name: "Products",
	                        value: "product"
	                    },
	                    {
	                        name: "Skus",
	                        value: "sku"
	                    }
	                ],
	                selected: {
	                    name: "All",
	                    value: "All"
	                },
	                setSelected: function (searchOption) {
	                    _this.searchOptions.selected = searchOption;
	                    _this.getFiltersByTerm(_this.productBundleGroupFilters.keyword, searchOption);
	                }
	            };
	            _this.navigation = {
	                value: 'Basic',
	                setValue: function (value) {
	                    _this.value = value;
	                }
	            };
	            _this.filterTemplatePath = _this.productBundlePartialsPath + "productbundlefilter.html";
	            _this.productBundleGroupFilters = {};
	            _this.productBundleGroupFilters.value = [];
	            if (angular.isUndefined(_this.productBundleGroup.data.skuCollectionConfig)) {
	                _this.productBundleGroup.data.skuCollectionConfig = {};
	                _this.productBundleGroup.data.skuCollectionConfig.filterGroups = [];
	            }
	            if (!angular.isDefined(_this.productBundleGroup.data.skuCollectionConfig.filterGroups[0])) {
	                _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0] = {};
	                _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup = [];
	            }
	            var options = {
	                filterGroupsConfig: _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup,
	                columnsConfig: _this.productBundleGroup.data.skuCollectionConfig.columns,
	            };
	            _this.getCollection();
	        };
	        this.openCloseAndRefresh = function () {
	            _this.showAdvanced = !_this.showAdvanced;
	            if (_this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup.length) {
	                _this.getCollection();
	            }
	        };
	        this.deleteEntity = function (type) {
	            if (angular.isNumber(type)) {
	                _this.removeProductBundleGroupFilter(type);
	            }
	            else {
	                _this.removeProductBundleGroup({ index: _this.index });
	                _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup = [];
	            }
	        };
	        this.getCollection = function () {
	            var options = {
	                filterGroupsConfig: angular.toJson(_this.productBundleGroup.data.skuCollectionConfig.filterGroups),
	                columnsConfig: angular.toJson(_this.productBundleGroup.data.skuCollectionConfig.columns),
	                currentPage: 1,
	                pageShow: 10
	            };
	            var collectionPromise = _this.$hibachi.getEntity('Sku', options);
	            collectionPromise.then(function (response) {
	                _this.collection = response;
	            });
	        };
	        this.increaseCurrentCount = function () {
	            if (angular.isDefined(_this.totalPages) && _this.totalPages != _this.currentPage) {
	                _this.currentPage++;
	            }
	            else {
	                _this.currentPage = 1;
	            }
	        };
	        this.resetCurrentCount = function () {
	            _this.currentPage = 1;
	        };
	        this.getFiltersByTerm = function (keyword, filterTerm) {
	            //save search
	            _this.keyword = keyword;
	            _this.filterTerm = filterTerm;
	            _this.loading = true;
	            _this.showAll = true;
	            var _loadingCount;
	            if (_this.timeoutPromise) {
	                _this.$timeout.cancel(_this.timeoutPromise);
	            }
	            _this.timeoutPromise = _this.$timeout(function () {
	                if (filterTerm.value === 'All') {
	                    _this.showAll = true;
	                    _this.productBundleGroupFilters.value = [];
	                    _loadingCount = _this.searchOptions.options.length - 1;
	                    for (var i = 0; i < _this.searchOptions.options.length; i++) {
	                        if (i > 0) {
	                            var option = _this.searchOptions.options[i];
	                            (function (keyword, option) {
	                                if (_this.searchAllCollectionConfigs.length <= 4) {
	                                    _this.searchAllCollectionConfigs.push(_this.collectionConfigService.newCollectionConfig(_this.searchOptions.options[i].value));
	                                }
	                                _this.searchAllCollectionConfigs[i - 1].setKeywords(keyword);
	                                _this.searchAllCollectionConfigs[i - 1].setCurrentPage(_this.currentPage);
	                                _this.searchAllCollectionConfigs[i - 1].setPageShow(_this.pageShow);
	                                //searchAllCollectionConfig.setAllRecords(true);
	                                _this.searchAllCollectionConfigs[i - 1].getEntity().then(function (value) {
	                                    _this.recordsCount = value.recordsCount;
	                                    _this.pageRecordsStart = value.pageRecordsStart;
	                                    _this.pageRecordsEnd = value.pageRecordsEnd;
	                                    _this.totalPages = value.totalPages;
	                                    var formattedProductBundleGroupFilters = _this.productBundleService.formatProductBundleGroupFilters(value.pageRecords, option, _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup);
	                                    for (var j in formattedProductBundleGroupFilters) {
	                                        if (_this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup.indexOf(formattedProductBundleGroupFilters[j]) == -1) {
	                                            _this.productBundleGroupFilters.value.push(formattedProductBundleGroupFilters[j]);
	                                            _this.$log.debug(formattedProductBundleGroupFilters[j]);
	                                        }
	                                    }
	                                    // Increment Down The Loading Count
	                                    _loadingCount--;
	                                    // If the loadingCount drops to 0, then we can update scope
	                                    if (_loadingCount == 0) {
	                                        //This sorts the array of objects by the objects' "type" property alphabetically
	                                        _this.productBundleGroupFilters.value = _this.utilityService.arraySorter(_this.productBundleGroupFilters.value, ["type", "name"]);
	                                        _this.$log.debug(_this.productBundleGroupFilters.value);
	                                        if (_this.productBundleGroupFilters.value.length == 0) {
	                                            _this.currentPage = 0;
	                                        }
	                                    }
	                                    _this.loading = false;
	                                });
	                            })(keyword, option);
	                        }
	                    }
	                }
	                else {
	                    _this.showAll = false;
	                    if (angular.isUndefined(_this.searchCollectionConfig) || filterTerm.value != _this.searchCollectionConfig.baseEntityName) {
	                        _this.searchCollectionConfig = _this.collectionConfigService.newCollectionConfig(filterTerm.value);
	                    }
	                    _this.searchCollectionConfig.setKeywords(keyword);
	                    _this.searchCollectionConfig.setCurrentPage(_this.currentPage);
	                    _this.searchCollectionConfig.setPageShow(_this.pageShow);
	                    _this.searchCollectionConfig.getEntity().then(function (value) {
	                        _this.recordsCount = value.recordsCount;
	                        _this.pageRecordsStart = value.pageRecordsStart;
	                        _this.pageRecordsEnd = value.pageRecordsEnd;
	                        _this.totalPages = value.totalPages;
	                        _this.productBundleGroupFilters.value = _this.productBundleService.formatProductBundleGroupFilters(value.pageRecords, filterTerm, _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup) || [];
	                        _this.loading = false;
	                    });
	                }
	            }, 500);
	        };
	        this.addFilterToProductBundle = function (filterItem, include, index) {
	            var collectionFilterItem = new CollectionFilterItem(filterItem.name, filterItem.type, filterItem.type, filterItem.propertyIdentifier, filterItem[filterItem.entityType.charAt(0).toLowerCase() + filterItem.entityType.slice(1) + 'ID'], filterItem[filterItem.entityType.charAt(0).toLowerCase() + filterItem.entityType.slice(1) + 'ID']);
	            if (include === false) {
	                collectionFilterItem.comparisonOperator = '!=';
	            }
	            else {
	                collectionFilterItem.comparisonOperator = '=';
	            }
	            if (_this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup.length > 0) {
	                collectionFilterItem.logicalOperator = 'OR';
	            }
	            if (angular.isDefined(_this.searchCollectionConfig)) {
	                _this.searchCollectionConfig.addFilter(_this.searchCollectionConfig.baseEntityName + "ID", collectionFilterItem.value, "!=");
	            }
	            if (_this.showAll) {
	                switch (collectionFilterItem.type) {
	                    case 'Product Type':
	                        _this.searchAllCollectionConfigs[0].addFilter("productTypeID", collectionFilterItem.value, "!=");
	                        break;
	                    case 'Brand':
	                        _this.searchAllCollectionConfigs[1].addFilter("brandID", collectionFilterItem.value, "!=");
	                        break;
	                    case 'Products':
	                        _this.searchAllCollectionConfigs[2].addFilter("productID", collectionFilterItem.value, "!=");
	                        break;
	                    case 'Skus':
	                        _this.searchAllCollectionConfigs[3].addFilter("skuID", collectionFilterItem.value, "!=");
	                        break;
	                }
	            }
	            _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup.push(collectionFilterItem);
	            console.log("now this is bundles", _this.productBundleGroup.forms, _this.formName);
	            _this.productBundleGroup.forms[_this.formName].skuCollectionConfig.$setDirty();
	            //reload the list to correct pagination show all takes too long for this to be graceful
	            if (!_this.showAll) {
	                _this.getFiltersByTerm(_this.keyword, _this.filterTerm);
	            }
	            else {
	                //Removes the filter item from the left hand search result
	                _this.productBundleGroupFilters.value.splice(index, 1);
	            }
	        };
	        this.removeProductBundleGroupFilter = function (index) {
	            //Pushes item back into array
	            _this.productBundleGroupFilters.value.push(_this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup[index]);
	            //Sorts Array
	            _this.productBundleGroupFilters.value = _this.utilityService.arraySorter(_this.productBundleGroupFilters.value, ["type", "name"]);
	            //Removes the filter item from the filtergroup
	            var collectionFilterItem = _this.productBundleGroup.data.skuCollectionConfig.filterGroups[0].filterGroup.splice(index, 1)[0];
	            if (angular.isDefined(_this.searchCollectionConfig)) {
	                _this.searchCollectionConfig.removeFilter(_this.searchCollectionConfig.baseEntityAlias + '.' + _this.searchCollectionConfig.baseEntityName + "ID", collectionFilterItem.value, "!=");
	            }
	            if (_this.showAll) {
	                switch (collectionFilterItem.type) {
	                    case 'Product Type':
	                        _this.searchAllCollectionConfigs[0].removeFilter("_productType.productTypeID", collectionFilterItem.value, "!=");
	                        break;
	                    case 'Brand':
	                        _this.searchAllCollectionConfigs[1].removeFilter("_brand.brandID", collectionFilterItem.value, "!=");
	                        break;
	                    case 'Products':
	                        _this.searchAllCollectionConfigs[2].removeFilter("_product.productID", collectionFilterItem.value, "!=");
	                        break;
	                    case 'Skus':
	                        _this.searchAllCollectionConfigs[3].removeFilter("_sku.skuID", collectionFilterItem.value, "!=");
	                        break;
	                }
	            }
	            if (!_this.showAll) {
	                _this.getFiltersByTerm(_this.keyword, _this.filterTerm);
	            }
	            else {
	                _this.productBundleGroupFilters.value.splice(index, 0, collectionFilterItem);
	            }
	        };
	        this.init();
	    }
	    return SWProductBundleCollectionFilterItemTypeaheadController;
	})();
	exports.SWProductBundleCollectionFilterItemTypeaheadController = SWProductBundleCollectionFilterItemTypeaheadController;
	var SWProductBundleCollectionFilterItemTypeahead = (function () {
	    // @ngInject
	    function SWProductBundleCollectionFilterItemTypeahead($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath, slatwallPathBuilder) {
	        this.$log = $log;
	        this.$timeout = $timeout;
	        this.collectionConfigService = collectionConfigService;
	        this.productBundleService = productBundleService;
	        this.metadataService = metadataService;
	        this.utilityService = utilityService;
	        this.formService = formService;
	        this.$hibachi = $hibachi;
	        this.productBundlePartialsPath = productBundlePartialsPath;
	        this.restrict = "EA";
	        this.scope = {};
	        this.bindToController = {
	            productBundleGroup: "=",
	            index: "=",
	            formName: "@"
	        };
	        this.controller = SWProductBundleCollectionFilterItemTypeaheadController;
	        this.controllerAs = "swProductBundleCollectionFilteritemTypeahead";
	        this.link = function ($scope, element, attrs, ctrl) {
	        };
	        this.templateUrl = slatwallPathBuilder.buildPartialsPath(productBundlePartialsPath) + "productbundlecollectionfilteritemtypeahead.html";
	    }
	    SWProductBundleCollectionFilterItemTypeahead.Factory = function () {
	        var directive = function ($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath, slatwallPathBuilder) {
	            return new SWProductBundleCollectionFilterItemTypeahead($log, $timeout, collectionConfigService, productBundleService, metadataService, utilityService, formService, $hibachi, productBundlePartialsPath, slatwallPathBuilder);
	        };
	        directive.$inject = [
	            "$log", "$timeout", "collectionConfigService", "productBundleService", "metadataService", "utilityService", "formService", "$hibachi", "productBundlePartialsPath",
	            "slatwallPathBuilder"
	        ];
	        return directive;
	    };
	    return SWProductBundleCollectionFilterItemTypeahead;
	})();
	exports.SWProductBundleCollectionFilterItemTypeahead = SWProductBundleCollectionFilterItemTypeahead;


/***/ },
/* 191 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	/*services return promises which can be handled uniquely based on success or failure by the controller*/
	var SlatwallPathBuilder = (function () {
	    //@ngInject
	    function SlatwallPathBuilder() {
	        var _this = this;
	        this.setBaseURL = function (baseURL) {
	            _this.baseURL = baseURL;
	        };
	        this.setBasePartialsPath = function (basePartialsPath) {
	            _this.basePartialsPath = basePartialsPath;
	        };
	        this.buildPartialsPath = function (componentsPath) {
	            if (angular.isDefined(_this.baseURL) && angular.isDefined(_this.basePartialsPath)) {
	                return _this.baseURL + _this.basePartialsPath + componentsPath;
	            }
	            else {
	                throw ('need to define baseURL and basePartialsPath in hibachiPathBuilder. Inject hibachiPathBuilder into module and configure it there');
	            }
	        };
	    }
	    return SlatwallPathBuilder;
	})();
	exports.SlatwallPathBuilder = SlatwallPathBuilder;


/***/ },
/* 192 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCurrencyFormatter = (function () {
	    function SWCurrencyFormatter($filter, $timeout) {
	        var _this = this;
	        this.$filter = $filter;
	        this.$timeout = $timeout;
	        this.restrict = "A";
	        this.require = "ngModel";
	        this.scope = {
	            ngModel: '=',
	            currencyCode: '@?'
	        };
	        this.link = function ($scope, element, attrs, modelCtrl) {
	            modelCtrl.$parsers.push(function (data) {
	                if (isNaN(data)) {
	                    data = 0;
	                }
	                if (_this._timeoutPromise) {
	                    _this.$timeout.cancel(_this._timeoutPromise);
	                }
	                _this._timeoutPromise = _this.$timeout(function () {
	                    var currencyFilter = _this.$filter('swcurrency');
	                    modelCtrl.$setViewValue(currencyFilter(data, $scope.currencyCode, 2, false));
	                    modelCtrl.$render();
	                }, 1500);
	                return modelCtrl.$viewValue;
	            });
	            modelCtrl.$formatters.push(function (data) {
	                if (isNaN(data)) {
	                    data = 0;
	                }
	                var currencyFilter = _this.$filter('swcurrency');
	                modelCtrl.$setViewValue(currencyFilter(data, $scope.currencyCode, 2, false));
	                modelCtrl.$render();
	                return modelCtrl.$viewValue;
	            });
	        };
	    }
	    SWCurrencyFormatter.Factory = function () {
	        var directive = function ($filter, $timeout) {
	            return new SWCurrencyFormatter($filter, $timeout);
	        };
	        directive.$inject = [
	            '$filter',
	            '$timeout'
	        ];
	        return directive;
	    };
	    return SWCurrencyFormatter;
	})();
	exports.SWCurrencyFormatter = SWCurrencyFormatter;


/***/ },
/* 193 */
/***/ function(module, exports) {

	/// <reference path='../../../typings/slatwallTypescript.d.ts' />
	/// <reference path='../../../typings/tsd.d.ts' />
	var SWCurrency = (function () {
	    function SWCurrency() {
	    }
	    //@ngInject
	    SWCurrency.Factory = function ($sce, $log, $hibachi) {
	        var data = null, serviceInvoked = false;
	        function realFilter(value, decimalPlace, returnStringFlag) {
	            if (returnStringFlag === void 0) { returnStringFlag = true; }
	            // REAL FILTER LOGIC, DISREGARDING PROMISES
	            if (!angular.isDefined(data)) {
	                $log.debug("Please provide a valid currencyCode, swcurrency defaults to $");
	                data = "$";
	            }
	            if (angular.isDefined(value)) {
	                if (angular.isDefined(decimalPlace)) {
	                    value = parseFloat(value.toString()).toFixed(decimalPlace);
	                }
	                else {
	                    value = parseFloat(value.toString()).toFixed(2);
	                }
	            }
	            if (returnStringFlag) {
	                return data + value;
	            }
	            else {
	                return value;
	            }
	        }
	        var filterStub;
	        filterStub = function (value, currencyCode, decimalPlace, returnStringFlag) {
	            if (returnStringFlag === void 0) { returnStringFlag = true; }
	            if (data === null && returnStringFlag) {
	                if (!serviceInvoked) {
	                    serviceInvoked = true;
	                    $hibachi.getCurrencies().then(function (currencies) {
	                        var result = currencies.data;
	                        data = result[currencyCode];
	                    });
	                }
	                return "-";
	            }
	            else
	                return realFilter(value, decimalPlace, returnStringFlag);
	        };
	        filterStub.$stateful = true;
	        return filterStub;
	    };
	    return SWCurrency;
	})();
	exports.SWCurrency = SWCurrency;


/***/ }
/******/ ]);