component extends="HibachiService" persistent="false" accessors="true" output="false" {
	
	public void function createConfigJson(){
		var json = {};
		var config = {};
		config = getService('HibachiSessionService').getConfig();
		config[ 'modelConfig' ] = getModel();
		json['data'] = config;
		json = serializeJson(json);
		var filePath = expandPath('/#getDao("HibachiDao").getApplicationKey()#') & '/custom/config/config.json';
		fileWrite(filePath,json);
    }

	private any function getModel(){
        var model = {};
        var entities = [];
        var processContextsStruct = getService('hibachiService').getEntitiesProcessContexts();
        var entitiesListArray = listToArray(structKeyList(getService('hibachiService').getEntitiesMetaData()));


        model['entities'] = {};
        model['validations'] = {};
        model['defaultValues'] = {};

        for(var entityName in entitiesListArray) {
            var entity = getService('hibachiService').getEntityObject(entityName);

            formatEntity(entity,model);
            //add process objects to the entites array
            if(structKeyExists(processContextsStruct,entityName)){
                var processContexts = processContextsStruct[entityName];
                for(var processContext in processContexts){
                    if(entity.hasProcessObject(processContext)){

                        formatEntity(entity.getProcessObject(processContext),model);
                    }

                }
            }
        }

        ORMClearSession();
        
        return model;
    }
    
    public void function createJson(){
    	createConfigJson();
    	createRBJson();
    }
    
    public void function createRBJson(){
    	var rbpath = expandPath('/Slatwall') & "/config/resourceBundles";
    	var directorylisting = [];
    	if(DirectoryExists(rbpath)){
    		directorylisting = directorylist(rbpath,false,"name","*.properties");
    	}
    	var customrbpath = expandPath('/Slatwall') & "/custom/config/resourceBundles";
    	if(DirectoryExists(customrbpath)){
    		var customDirectoryListing = directorylist(customrbpath,false,"name","*.properties");
    		for(var item in customDirectoryListing){
    			if(!ArrayFind(directoryListing,item)){
    				arrayAppend(directoryListing,item);
    			}
    		}
    	}
    	
    	for(var rb in directoryListing){
    		var locale = listFirst(rb,'.');
    		var resourceBundle = getService('HibachiRBService').getResourceBundle(locale);
	        var data = {};
	        //cache RB for 1 day or until a reload
	        //lcase all the resourceBundle keys so we can have consistent casing for the js
	        for(var key in resourceBundle){
	            data[lcase(key)] = resourceBundle[key];
	        }
	        var json = serializeJson(data);
			var filePath = expandPath('/Slatwall') & '/custom/config/resourceBundles/#locale#.json';	        
	        fileWrite(filePath,json);
    	}
        
    }
    
    private void function formatEntity(required any entity, required any model){

        model.entities[entity.getClassName()] = entity.getPropertiesStruct();
        model.entities[entity.getClassName()]['className'] = entity.getClassName();

        var metaData = getMetaData(entity);
        var isProcessObject = Int(Find('_',entity.getClassName()) gt 0);

        if (structKeyExists(metaData,'hb_parentPropertyName')){
            model.entities[entity.getClassName()]['hb_parentPropertyName'] = metaData.hb_parentPropertyName;
        }
        if(structKeyExists(metaData,'hb_childPropertyName')){
            model.entities[entity.getClassName()]['hb_childPropertyName'] = metaData.hb_childPropertyName;
        }

        model.validations[entity.getClassName()] = getService('hibachiValidationService').getValidationStruct(entity);
        model.defaultValues[entity.getClassName()] = {};


        for(var property in entity.getProperties()){
            //<!--- Make sure that this property is a persistent one --->
            if (!structKeyExists(property, "persistent") && ( !structKeyExists(property,"fieldtype") || listFindNoCase("column,id", property.fieldtype) )){
                if(!isProcessObject){
                    try{
                        var defaultValue = entity.invokeMethod('get#property.name#');
                    }catch(any e){
                        defaultValue = javacast('null','');
                    }
                    if (isNull(local.defaultValue)){
                        model.defaultValues[entity.getClassName()][property.name] = javacast('null','');
                    }else if (structKeyExists(local.property, "ormType") and listFindNoCase('boolean,int,integer,float,big_int,big_decimal', local.property.ormType)){
                        model.defaultValues[entity.getClassName()][property.name] = defaultValue;
                    }else if (structKeyExists(local.property, "ormType") and listFindNoCase('string', local.property.ormType)){
                        if(structKeyExists(local.property, "hb_formFieldType") and local.property.hb_formFieldType eq "json"){
                            model.defaultValues[entity.getClassName()][property.name] = deserializeJson(defaultValue);
                        }else{
                            model.defaultValues[entity.getClassName()][property.name] = defaultValue;
                        }
                    }else if(structKeyExists(local.property, "ormType") and local.property.ormType eq 'timestamp'){
                        model.defaultValues[entity.getClassName()][property.name] = defaultValue;
                    }else{
                        model.defaultValues[entity.getClassName()][property.name] = defaultValue;
                    }
                }else{
                    try{
                        var defaultValue = entity.invokeMethod('get#property.name#');
                    }catch(any e){
                        defaultValue = javacast('null','');
                    }
                    if (!isNull(defaultValue)){
                        if(isObject(defaultValue)){
                            model.defaultValues[entity.getClassName()][property.name] = '';
                        }else{
                            if(isStruct(defaultValue)){
                                model.defaultValues[entity.getClassName()][property.name] = defaultValue;
                            }else{
                                model.defaultValues[entity.getClassName()][property.name] = '#defaultValue#';
                            }
                        }

                    }else{
                        //model.defaultValues[entity.getClassName()][property.name] = '#defaultValue#';
                    }
                }
            }
        }
    }
	
	// ===================== START: Logical Methods ===========================
	
	// =====================  END: Logical Methods ============================
	
	// ===================== START: DAO Passthrough ===========================
	
	// ===================== START: DAO Passthrough ===========================
	
	// ===================== START: Process Methods ===========================
	
	// =====================  END: Process Methods ============================
	
	// ====================== START: Save Overrides ===========================
	
	// ======================  END: Save Overrides ============================
	
	// ==================== START: Smart List Overrides =======================
	
	// ====================  END: Smart List Overrides ========================
	
	// ====================== START: Get Overrides ============================
	
	// ======================  END: Get Overrides =============================
	
}
