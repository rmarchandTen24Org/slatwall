/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

interface testRootScopeService extends ng.IRootScopeService{
    entityName:string,
    $$childTail:any
}

describe('swListingDisplay.spec Test',()=>{
    var $compile:ng.ICompileService;
    var $rootScope:testRootScopeService;
    var $httpBackend:ng.IHttpBackendService;
    var $controller:ng.IControllerService;
    var collectionConfigService;

    beforeEach(inject((_$compile_,_$rootScope_,_$httpBackend_,_$controller_,_collectionConfigService_)=>{
        $compile = _$compile_;
        $rootScope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $controller = _$controller_;
        collectionConfigService = _collectionConfigService_;

    }));

    var workflowCollectionData = {
        "totalPages":1,
        "dirtyReadFlag":true,
        "pageRecordsEnd":8,
        "pageRecordsStart":1,
        "recordsCount":8,
        "collectionObject":"Workflow",
        "collectionConfig":"{\n\t\t\t\t\"baseEntityName\":\"Workflow\",\n\t\t\t\t\"baseEntityAlias\":\"_workflow\",\n\t\t\t\t\"columns\":[{\"isDeletable\":false,\"isSearchable\":true,\"title\":\"Workflow ID\",\"isVisible\":false,\"ormtype\":\"id\",\"propertyIdentifier\":\"_workflow.workflowID\",\"isExportable\":true},{\"isDeletable\":true,\"isSearchable\":true,\"title\":\"Active\",\"isVisible\":true,\"ormtype\":\"yesno\",\"propertyIdentifier\":\"_workflow.activeFlag\",\"isExportable\":true},{\"isDeletable\":true,\"isSearchable\":true,\"title\":\"Workflow Name\",\"isVisible\":true,\"ormtype\":\"string\",\"propertyIdentifier\":\"_workflow.workflowName\",\"isExportable\":true},{\"isDeletable\":true,\"isSearchable\":true,\"title\":\"Object\",\"isVisible\":true,\"ormtype\":\"string\",\"propertyIdentifier\":\"_workflow.workflowObject\",\"isExportable\":true}]\n\t\t\t}",
        "pageRecords":[
            {
                "workflowID":"ff8080815ab91389015ab9362643000f",
                "activeFlag":"Yes ",
                "workflowName":"test",
                "workflowObject":"Order"
            },
            {
                "workflowID":"ff80808159fffb7c015a04bf40f20164",
                "activeFlag":"Yes ",
                "workflowName":"test",
                "workflowObject":"Access"
            },
            {
                "workflowID":"ff80808159cbfcca0159d673fd270b3e",
                "activeFlag":"Yes ",
                "workflowName":"xxx",
                "workflowObject":"Account"
            },
            {
                "workflowID":"ff80808159cbfcca0159d671cacc0b39",
                "activeFlag":"Yes ",
                "workflowName":"abandonedcart",
                "workflowObject":"Account"
            },
            {
                "workflowID":"ff80808159cbfcca0159d65ebe470b2a",
                "activeFlag":"Yes ",
                "workflowName":"test",
                "workflowObject":"Account"
            },
            {
                "workflowID":"4028289a5507d1dc01557e0718b30808",
                "activeFlag":"Yes ",
                "workflowName":"New Form Response",
                "workflowObject":"FormResponse"
            },
            {
                "workflowID":"46d8e458b7dd4aa9876ce62b33e9e43f",
                "activeFlag":"Yes ",
                "workflowName":"Event Trigger - Send Delivery Confirmation When Fulfilled",
                "workflowObject":"OrderDelivery"
            },
            {
                "workflowID":"c74704ef385a4ad1949b554086fcd80b",
                "activeFlag":"Yes ",
                "workflowName":"Event Trigger - Send Order Confirmation When Placed",
                "workflowObject":"Order"
            }
        ],
        "collectionName":"",
        "messages":[

        ],
        "collectionDescription":"",
        "collectionID":"",
        "pageRecordsCount":8,
        "pageRecordsShow":10,
        "currentPage":1,
        "collectionCode":""
    };

    var filterPropertiesData = {
        "data":[
            {
                "generator":"uuid",
                "unsavedvalue":"",
                "fieldtype":"id",
                "displayPropertyIdentifier":"Workflow ID",
                "length":32,
                "ormtype":"string",
                "default":"",
                "name":"workflowID"
            },
            {
                "displayPropertyIdentifier":"Active",
                "ormtype":"boolean",
                "hb_formattype":"yesno",
                "name":"activeFlag"
            },
            {
                "displayPropertyIdentifier":"Workflow Name",
                "ormtype":"string",
                "name":"workflowName"
            },
            {
                "displayPropertyIdentifier":"Object",
                "hb_formfieldtype":"select",
                "ormtype":"string",
                "name":"workflowObject"
            },
            {
                "cfc":"WorkflowTask",
                "fieldtype":"one-to-many",
                "displayPropertyIdentifier":"Tasks",
                "singularname":"workflowTask",
                "cascade":"all-delete-orphan",
                "fkcolumn":"workflowID",
                "type":"array",
                "inverse":true,
                "name":"workflowTasks"
            },
            {
                "cfc":"WorkflowTrigger",
                "fieldtype":"one-to-many",
                "displayPropertyIdentifier":"Triggers",
                "singularname":"workflowTrigger",
                "cascade":"all-delete-orphan",
                "fkcolumn":"workflowID",
                "type":"array",
                "inverse":true,
                "name":"workflowTriggers"
            },
            {
                "displayPropertyIdentifier":"Remote ID",
                "ormtype":"string",
                "hb_populateenabled":false,
                "name":"remoteID"
            },
            {
                "displayPropertyIdentifier":"Created Date Time",
                "ormtype":"timestamp",
                "hb_populateenabled":false,
                "name":"createdDateTime"
            },
            {
                "displayPropertyIdentifier":"Created By AccountID",
                "ormtype":"string",
                "hb_populateenabled":false,
                "name":"createdByAccountID"
            },
            {
                "displayPropertyIdentifier":"Modified Date Time",
                "ormtype":"timestamp",
                "hb_populateenabled":false,
                "name":"modifiedDateTime"
            },
            {
                "displayPropertyIdentifier":"Modified By AccountID",
                "ormtype":"string",
                "hb_populateenabled":false,
                "name":"modifiedByAccountID"
            }
        ],
        "messages":[

        ],
        "entityName":"_workflow"
    };

    it('swListingDisplay.spec Directive Test for workflow listing', ()=>{
        $rootScope.entityName = 'Workflow';

        $httpBackend.when('POST','/index.cfm/?slatAction=api:main.get&entityName=Workflow').respond(workflowCollectionData);

        $httpBackend.when('POST','/index.cfm/?slatAction=api:main.getFilterPropertiesByBaseEntityName&EntityName=_workflow&includeNonPersistent=false').respond(filterPropertiesData);

        var element:any = $compile(`<div><sw-listing-display
            data-collection="'Workflow'"
            data-record-detail-action="Workflow"
            data-show-search="true"
            data-title="Workflow"
            data-multiselect-field-name="test"
            data-multiselect-property-identifier="test"
            data-edit="true"></sw-listing-display></div>`)($rootScope);

        $rootScope.$digest();
        var listingDisplayController = $rootScope.$$childTail.swListingDisplay;
        //assert controller values are good
        //we supplied collection as a string so we should expect the base entityName to be the same
        expect(listingDisplayController.baseEntityName).toEqual('Workflow');
        expect(listingDisplayController.collectionObject).toEqual('Workflow');
        expect(listingDisplayController.showSearch).toEqual(true);


        //assert collectionconfig is correct
        expect(listingDisplayController.collectionConfig).toBeDefined();
        expect(listingDisplayController.collectionConfig.baseEntityName).toEqual('Workflow');


    });



});