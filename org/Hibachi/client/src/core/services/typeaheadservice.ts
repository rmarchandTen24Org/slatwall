/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

import * as Prototypes from '../prototypes/Observable';
//import {Observable, Subject} from 'rxjs';

type Action = any;

class TypeaheadService implements Prototypes.Observable.IObservable {
    
    public typeaheadData = {};
    public typeaheadPromises = {};
    public typeaheadStates = {}; 
    public state:any;

    //public typeaheadStore:Observable<any>;
    /**
     * This will contain the stream of actions which I'm defining as an object
     */
    //public actionStream:any;

    /**
     * The reducer handles changes from one state to the next. Every state transition is defined as an action.
     * @param Reducer 
     * @param observerService 
     */
     //public reducer:any;


    //@ngInject
    constructor(
        public $timeout, 
        public observerService
    ){
         this.observers = new Array<Prototypes.Observable.IObserver>();
         
         //Setup the action stream
         /*this.actionStream = new Subject();
         this.state = {};

         //Setup the basic reducer. This only handles adding a selection right now. ...state means any number of properties.
         this.reducer = (state, action:Action) => {  
            switch(action.type) {
                case 'ADD_SELECTION':
                    console.log("ADD_SELECTION CALLED", state, action);
                    this.addSelection(action.payload.id, action.payload.data );
                    return {
                        state: this.state,
                        name: action.payload.name
                    };
                default:
                    return state;
            }
        }

        //Setup the store that will handle all state.
        this.actionStream.startWith(this.state).scan(this.reducer);
        console.log("Action Stream: ", this.actionStream);
        console.log("Store", this.typeaheadStore);*/

    }

    public observers: Array<Prototypes.Observable.IObserver>

    /**
     * Note that message should have a type and a data field
     */
    public notifyObservers = (_message: any) => {
        for (var observer in this.observers){
            this.observers[observer].recieveNotification(_message);
        }
    }

    /**
     * This manages all the observer events without the need for setting ids etc.
     */
    public registerObserver = (_observer: Prototypes.Observable.IObserver) => {
        if (!_observer){
            throw new Error('Observer required for registration');
        }
        this.observers.push(_observer);
    }
    /**
     * Removes the observer. Just pass in this
     */
    public removeObserver = (_observer: Prototypes.Observable.IObserver) => {
         if (!_observer){
            throw new Error('Observer required for removal.');
         }
         for (var observer in this.observers){
            if (this.observers[observer] == (_observer)){
                if (this.observers.indexOf(_observer) > -1){
                    this.observers.splice(this.observers.indexOf(_observer), 1);
                }
            }
         }
    }
    
    public getTypeaheadSelectionUpdateEvent = (key:string) =>{
        return "typeaheadSelectionUpdated" + key; 
    }

    public attachTypeaheadSelectionUpdateEvent = (key:string, callback) =>{
        this.observerService.attach(callback, this.getTypeaheadSelectionUpdateEvent(key));
    }

    public notifyTypeaheadSelectionUpdateEvent = (key:string) =>{
        this.observerService.notify(this.getTypeaheadSelectionUpdateEvent(key)); 
    }

    public setTypeaheadState = (key:string, state:any) =>{
        this.typeaheadStates[key] = state;
    }

    public getTypeaheadState = (key:string) =>{
        return this.typeaheadStates[key];
    }

    public getTypeaheadPrimaryIDPropertyName = (key:string) =>{
        return this.getTypeaheadState(key).primaryIDPropertyName;
    }

    public getIndexOfSelection = (key:string, data:any) =>{
        for(var j = 0; j < this.getData(key).length; j++){
            if( angular.isDefined(data[this.getTypeaheadPrimaryIDPropertyName(key)]) &&
                data[this.getTypeaheadPrimaryIDPropertyName(key)] == this.getData(key)[j][this.getTypeaheadPrimaryIDPropertyName(key)]
            ){
                return j;
            } else if ( this.checkAgainstFallbackProperties(key, this.getData(key)[j], data) ){
                return j;
            }
        }
        return -1; 
    }
    
    public addSelection = (key:string, data:any) => {
        if(angular.isUndefined(this.typeaheadData[key])){
            this.typeaheadData[key] = [];
            this.state['typeaheadData'][key] = [];
        }
        this.typeaheadData[key].push(data); 
        this.state['typeaheadData'][key].push(data);
        this.notifyTypeaheadSelectionUpdateEvent(key); 
    } 

    public removeSelection = (key:string, index:number, data?:any) => {
        if( angular.isUndefined(index) &&
            angular.isDefined(data)
        ){
            index = this.getIndexOfSelection(key, data);
        }
        if( angular.isDefined(index) && 
            angular.isDefined(this.typeaheadData[key]) && 
            index != -1
        ){
            this.updateSelections(key);
            var removedItem = this.typeaheadData[key].splice(index,1)[0];//this will always be an array of 1 element
            this.notifyTypeaheadSelectionUpdateEvent(key); 
            return removedItem; 
        }
    }

    public initializeSelections = (key:string, selectedCollectionConfig) => {
        selectedCollectionConfig.setAllRecords(true);
        this.typeaheadPromises[key] = selectedCollectionConfig.getEntity();
        this.typeaheadPromises[key].then(
            (data)=>{
                for(var j=0; j< data.records.length; j++){
                    this.addSelection(key, data.records[j]); 
                }
            },
            (reason)=>{
                throw("typeaheadservice had trouble intializing selections for " + key + " because " + reason); 
            }
        );
    }

     public updateSelections = (key:string) =>{
        if(angular.isDefined(this.getData(key)) && this.getData(key).length){
            for(var j = 0; j < this.getTypeaheadState(key).results.length; j++){
                for(var i = 0; i < this.getData(key).length; i++){
                    if( this.getData(key)[i][this.getTypeaheadPrimaryIDPropertyName(key)] == this.getTypeaheadState(key).results[j][this.getTypeaheadPrimaryIDPropertyName(key)] ){
                        this.markResultSelected(this.getTypeaheadState(key).results[j],i);
                        break; 
                    }
                    var found = this.checkAgainstFallbackProperties( key,
                                                                     this.getData(key)[i], 
                                                                     this.getTypeaheadState(key).results[j], 
                                                                     i
                                                                   );
                    if(found){
                        break; 
                    }
                }
            }
        }
    }

    private markResultSelected = (result, index) => {
        result.selected = true;
        result.selectedIndex = index; 
    }   

    private checkAgainstFallbackProperties = (key:string, selection:any, result:any, selectionIndex?:number) =>{
        var resultPrimaryID = result[this.getTypeaheadPrimaryIDPropertyName(key)];
        //is there a singular property to compare against
        if(angular.isDefined(this.getTypeaheadState(key).propertyToCompare) && 
            this.getTypeaheadState(key).propertyToCompare.length
        ){
            if( angular.isDefined(selection[this.getTypeaheadState(key).propertyToCompare]) &&
                selection[this.getTypeaheadState(key).propertyToCompare] == resultPrimaryID
            ){
                if(angular.isDefined(selectionIndex)){
                    this.markResultSelected(result, selectionIndex); 
                }
                return true; 
            }

            if( angular.isDefined(selection[this.getTypeaheadState(key).propertyToCompare]) &&
                angular.isDefined(result[this.getTypeaheadState(key).propertyToCompare]) &&
                selection[this.getTypeaheadState(key).propertyToCompare] == result[this.getTypeaheadState(key).propertyToCompare]
            ){
                if(angular.isDefined(selectionIndex)){
                    this.markResultSelected(result, selectionIndex); 
                }
                return true; 
            }
        }
        //check the defined fallback properties to see if theres a match
        if( this.getTypeaheadState(key).fallbackPropertyArray.length > 0 ){
            for(var j=0; j < this.getTypeaheadState(key).fallbackPropertyArray.length; j++){
                var property = this.getTypeaheadState(key).fallbackPropertyArray[j]; 
                if( angular.isDefined(selection[property]) ){
                    if( selection[property] == resultPrimaryID ){
                        if(angular.isDefined(selectionIndex)){
                            this.markResultSelected(result, selectionIndex); 
                        }
                        return true; 
                    }
                    if( angular.isDefined(result[property]) &&
                        selection[property] == result[property]
                    ){
                        if(angular.isDefined(selectionIndex)){
                       	    this.markResultSelected(result, selectionIndex); 
                        }
                        return true; 
                    }
                }
            }
        }
        return false; 
    }

    public updateSelectionList = (key:string)=>{
        var selectionIDArray = [];

        if(angular.isDefined(this.getData(key))){
            for(var j = 0; j < this.getData(key).length; j++){
                var selection = this.getData(key)[j]; 
                var primaryID = selection[this.getTypeaheadPrimaryIDPropertyName(key)];
                if( angular.isDefined(primaryID) ){
                    selectionIDArray.push(primaryID);
                } else if( angular.isDefined(this.getTypeaheadState(key).propertyToCompare) &&
                        angular.isDefined(selection[this.getTypeaheadState(key).propertyToCompare])
                ){
                    selectionIDArray.push(selection[this.getTypeaheadState(key).propertyToCompare]);
                } else if( angular.isDefined(this.getTypeaheadState(key).fallbackPropertyArray)){
                    var fallbackPropertyArray = this.getTypeaheadState(key).fallbackPropertyArray;
                    for(var i=0; i < fallbackPropertyArray.length; i++){
                        var fallbackProperty = fallbackPropertyArray[i]; 
                        if(angular.isDefined(selection[fallbackProperty])){
                            selectionIDArray.push(selection[fallbackProperty]);
                            break; 
                        }
                    }
                } 
            }
        }
        return selectionIDArray.join(",");
    }
    
    getData = (key:string) => {
        if(key in this.typeaheadPromises){
            //wait until it's been intialized
            this.typeaheadPromises[key].then().finally(()=>{
                return this.typeaheadData[key] || [];
            }); 
            delete this.typeaheadPromises[key];
        } else {
            return this.typeaheadData[key] || [];
        }
    }
    
    //strips out dangerous directives that cause infinite compile errors 
    // - this probably belongs in a different service but is used for typeahead only at the moment
    stripTranscludedContent = (transcludedContent) => {
        for(var i=0; i < transcludedContent.length; i++){
            if(angular.isDefined(transcludedContent[i].localName) && 
            transcludedContent[i].localName == 'ng-transclude'
            ){
                transcludedContent = transcludedContent.children();
            }
        }
        
        //prevent collection config from being recompiled
        for(var i=0; i < transcludedContent.length; i++){
            if(angular.isDefined(transcludedContent[i].localName) && 
            transcludedContent[i].localName == 'sw-collection-config'
            ){
                transcludedContent.splice(i,1);
            }
        }
        
        return transcludedContent; 
    }
}

export{
    TypeaheadService
};
