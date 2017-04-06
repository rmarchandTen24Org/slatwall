/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

//import pagination = require('../services/paginationservice');
//var PaginationService = pagination.PaginationService;
//'use strict';

class SWPaginationBarController{
    public paginator;

    //@ngInject
    constructor(
        public $scope,
        public paginationService
    ){
        if(angular.isUndefined(this.paginator)){
            this.paginator = paginationService.createPagination();
        }
    }
}

 class SWPaginationBar implements ng.IComponentOptions{
    public bindings:any;
    public bindToController:boolean;
    public controller:any;
    public controllerAs:string="swPaginationBar";
    public templateUrl:string;

    //@ngInject
    constructor(){
        this.controllerAs="swPaginationBar";
        this.bindings={
            paginator:"=?"
        };
        this.templateUrl = (hibachiPathBuilder,partialsPath)=>{return hibachiPathBuilder.buildPartialsPath(partialsPath)+'paginationbar.html'} ;
        this.controller=SWPaginationBarController;

    }
}

const SWPaginationBarConfig = new SWPaginationBar();


export {
    SWPaginationBarConfig,
    SWPaginationBarController
};
