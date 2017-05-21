component  displayname="CollectionProxy" hint="This proxy allows for object like traversal of collection data including chained traversal." accessors="true" 
{
	property name="collectionResult" type="struct";
	property name="collectionAccessObject" type="any";
	   
	public CollectionProxy function init(required struct collectionResult){
		//If a single result is passed in, use that. otherwise set the whole array of results.
		if (isStruct(arguments.collectionResult)){
			this.collectionResult = arguments.collectionResult;	
		}
		return this;
	}
	
	public void function setCollectionResult(array collectionResult){
		this.collectionResult = arguments.collectionResult;
	}
	
	public struct function getCollectionResult(){
		return this.collectionResult;
	}
	
	/** A missing method to handle all access to the collectionResult. Examples (collectionResult.getName() or collectionResult.getSku().getSkuID()) */
	public any function onMissingMethod( required string missingMethodName, required struct missingMethodArguments ) {
		var lCaseMissingMethodName = lCase( missingMethodName );
		
		if ( lCaseMissingMethodName.startsWith( 'get' ) ) {
			return onMissingGetMethod( missingMethodName.replace("get", ""), missingMethodArguments );
		} 

		throw('You have called a method #arguments.missingMethodName#() which does not exists in this collection.');
	}
	
	private any function onMissingGetMethod(required string missingMethodName, struct missingMethodArguments){
		//Invariant - The missingMethodName first char must be lowercase.
		missingMethodName = missingMethodName.substring(0, 1).toLowerCase() & missingMethodName.substring(1);
		
		//Invariant - we will use the collection access object if it exists because we are chaining calls.
		if (!isNull(getCollectionAccessObject()) && structKeyExists(getCollectionAccessObject(), missingMethodName)){
			if (isSimpleValue(getCollectionAccessObject()[missingMethodName])){
				return getCollectionAccessObject()[missingMethodName];
			}else{
				//This is what gives us the power. By returning a new collection proxy for the accessed inner object, we also get missing method for deeper and deeper chained calls.
				return new CollectionProxy(getCollectionAccessObject());	
			}
		}
		
		//If not, then try to get it from the collection result itself (top level) - otherwise, try to find it and setup the inner access object.
		if (structKeyExists(getCollectionResult(), missingMethodName)){
			return getCollectionResult()[missingMethodName];
		}else{
			//Try to build the collection access object.
			setCollectionAccessObject(findByKeyStartsWith(missingMethodName)); //find all keys that start with primaryEmailAddress_ for example.
			return this; //return this so it will try again now that we set the properties to the access object they will be found by the first condition.	
		}
	}
	
	private struct function findByKeyStartsWith(string keyName){
		var keyList = structKeyList(getCollectionResult());
		//Setup the access object
		
		for (var key in keyList){
			if (key.startsWith(keyName & "_")){
				//We found one so setup the access object
				var accessObjectProperty = key.split("_")[2]; //after the split lives the objects property name
				//Setup the accessObject as needed.
				if (isNull(getCollectionAccessObject())){
					setupAccessObject(keyName);
				}
				//Properties are in the form (accessObject_propertyName: propertyValue) => (accessObject = { propertyName: propertyValue })
				getCollectionAccessObject()[accessObjectProperty] = getCollectionResult()[key]; //sets the property to the value in the access object.
			}
		}
		if (!isNull(getCollectionAccessObject())){
			return getCollectionAccessObject();
		}
		return {};
	}
	
	/** This is a helper for chaining calls to the object. */
	private any function setupAccessObject(keyName){
		if (isNull(getCollectionAccessObject())){
			setCollectionAccessObject({});
		}
		if (!structKeyExists(getCollectionAccessObject(), keyName)){
			getCollectionAccessObject()[keyName] = {};
		}
	}
}