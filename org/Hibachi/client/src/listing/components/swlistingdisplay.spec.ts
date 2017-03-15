/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

interface testRootScopeService extends ng.IRootScopeService{
    entityName:string
}

describe('swListingDisplay Test',()=>{
    var $compile:ng.ICompileService;
    var $rootScope:testRootScopeService;


    beforeEach(inject((_$compile_,_$rootScope_)=>{
        $compile = _$compile_;
        $rootScope = _$rootScope_.$new();
    }));

    it('Replaces the element with the the listing display content', ()=>{
        $rootScope.entityName = 'Workflow';

        var element:any = $compile(`<div><sw-listing-display
            data-collection="'Workflow'"
            data-record-detail-action="Workflow"
            data-show-search="true"
            data-title="Workflow"
            data-multiselect-field-name="test"
            data-multiselect-property-identifier="test"
            data-edit="true"></sw-listing-display></div>`)($rootScope);

        $rootScope.$digest();

        console.log(element.html());
        expect(element.html()).toContain('swListingDisplay');
    });

});