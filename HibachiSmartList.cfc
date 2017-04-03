component accessors="true" persistent="false" output="false" extends="HibachiObject" {
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	property name="baseEntityName" type="string";
	property name="cacheable" type="boolean";
	property name="cacheName" type="string";
	property name="savedStateID" type="string";
<<<<<<< HEAD
	
	property name="entities" type="struct";
	property name="entityJoinOrder" type="array";
	
	property name="selects" type="struct" hint="This struct holds any selects that are to be used in creating the records array";
	property name="selectDistinctFlag" type="boolean";
	
	property name="whereGroups" type="array" hint="this holds all filters and ranges";
	property name="whereConditions" type="array";
	property name="orders" type="array" hint="This struct holds the display order specification based on property";
	
	property name="keywords" type="array" hint="This array holds all of the keywords that were searched for";
	property name="keywordPhrases" type="array";
	property name="keywordProperties" type="struct" hint="This struct holds the properties that searches reference and their relative weight";
	
	property name="attributeKeywordProperties" type="struct" hint="This struct holds the custom attributes that searches reference and their relative weight";
	
=======

	property name="entities" type="struct";
	property name="entityJoinOrder" type="array";

	property name="selects" type="struct" hint="This struct holds any selects that are to be used in creating the records array";
	property name="selectDistinctFlag" type="boolean";

	property name="whereGroups" type="array" hint="this holds all filters and ranges";
	property name="whereConditions" type="array";
	property name="orders" type="array" hint="This struct holds the display order specification based on property";

	property name="keywords" type="array" hint="This array holds all of the keywords that were searched for";
	property name="keywordPhrases" type="array";
	property name="keywordProperties" type="struct" hint="This struct holds the properties that searches reference and their relative weight";
	property name="keywordSearchType" type="struct";

	property name="attributeKeywordProperties" type="struct" hint="This struct holds the custom attributes that searches reference and their relative weight";

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	property name="hqlParams" type="struct";
	property name="pageRecordsStart" type="numeric" hint="This represents the first record to display and it is used in paging.";
	property name="pageRecordsShow" type="numeric" hint="This is the total number of entities to display";
	property name="currentURL" type="string";
	property name="currentPageDeclaration" type="string";
<<<<<<< HEAD
	
	property name="records" type="array";
	property name="pageRecords" type="array";
	
	// Delimiter Settings
=======

	property name="records" type="array";
	property name="pageRecords" type="array";

	property name="dirtyReadFlag" type="boolean";

// Delimiter Settings
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	variables.subEntityDelimiters = ".";
	variables.valueDelimiter = ",";
	variables.orderDirectionDelimiter = "|";
	variables.orderPropertyDelimiter = ",";
	variables.rangeDelimiter = "^";
	variables.dataKeyDelimiter = ":";
<<<<<<< HEAD
	
	public any function setup(required string entityName, struct data={}, numeric pageRecordsStart=1, numeric pageRecordsShow=10, string currentURL="") {
		// Make sure that the containers for smart list saved states are in place
		param name="session.entitySmartList" type="struct" default="#structNew()#";
		param name="session.entitySmartList.savedStates" type="array" default="#arrayNew(1)#";
		
		// Set defaults for the main properties
=======

// ORM Connection Settings
	variables.connection = ormGetSession().connection();

	public any function setup(required string entityName, struct data={}, numeric pageRecordsStart=1, numeric pageRecordsShow=10, string currentURL="") {
// Make sure that the containers for smart list saved states are in place
		param name="session.entitySmartList" type="struct" default="#structNew()#";
		param name="session.entitySmartList.savedStates" type="array" default="#arrayNew(1)#";

// Set defaults for the main properties
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		setEntities({});
		setEntityJoinOrder([]);
		setSelects({});
		setWhereGroups([]);
		setWhereConditions([]);
		setOrders([]);
		setKeywordProperties({});
		setAttributeKeywordProperties({});
		setKeywords([]);
		setKeywordPhrases([]);
<<<<<<< HEAD
=======
		setKeywordSearchType({});
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		setHQLParams({});
		setCurrentURL("");
		setCurrentPageDeclaration(1);
		setCacheable(false);
		setCacheName("");
		setSelectDistinctFlag(0);
<<<<<<< HEAD
		
		// Set currentURL from the arguments
		setCurrentURL(arguments.currentURL);
		
		// Set paging defaults
		setPageRecordsStart(arguments.pageRecordsStart);
		setPageRecordsShow(arguments.pageRecordsShow);
		
		setBaseEntityName( getService("hibachiService").getProperlyCasedFullEntityName( arguments.entityName ) );
		
=======
		setDirtyReadFlag(false);

// Set currentURL from the arguments
		setCurrentURL(arguments.currentURL);

// Set paging defaults
		setPageRecordsStart(arguments.pageRecordsStart);
		setPageRecordsShow(arguments.pageRecordsShow);

		setBaseEntityName( getService("hibachiService").getProperlyCasedFullEntityName( arguments.entityName ) );

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		addEntity(
			entityName=getBaseEntityName(),
			entityAlias="a#lcase(getBaseEntityName())#",
			entityFullName=getService("hibachiService").getProperlyCasedFullClassNameByEntityName( arguments.entityName ),
			entityProperties=getService("hibachiService").getPropertiesStructByEntityName( arguments.entityName ),
			attributeCount=0
<<<<<<< HEAD
		);
		
		if(structKeyExists(arguments, "data")) {
			applyData(data=arguments.data);	
		}
		
		return this;
	}
	
	public void function applyData(required any data) {
		
		if(!isStruct(arguments.data) && isSimpleValue(arguments.data)) {
			arguments.data = convertNVPStringToStruct(arguments.data);
		}
		
		var currentPage = 1;
		
=======
				);

		if(structKeyExists(arguments, "data")) {
			applyData(data=arguments.data);
		}

		return this;
	}

	public void function applyData(required any data) {

		if(!isStruct(arguments.data) && isSimpleValue(arguments.data)) {
			arguments.data = convertNVPStringToStruct(arguments.data);
		}

		var currentPage = 1;

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if(structKeyExists(arguments.data, "savedStateID")) {
			setSavedStateID(arguments.data.savedStateID);
			loadSavedState(arguments.data.savedStateID);
		}
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		for(var i in arguments.data) {
			if(structKeyExists(arguments.data, i) && isSimpleValue(arguments.data[i])) {
				if(left(i,2) == "F#variables.dataKeyDelimiter#") {
					addFilter(propertyIdentifier=right(i, len(i)-2), value=arguments.data[i]);
				} else if(left(i,3) == "FR#variables.dataKeyDelimiter#" && isBoolean(arguments.data[i]) && arguments.data[i]) {
					removeFilter(propertyIdentifier=right(i, len(i)-3));
				} else if(left(i,3) == "FI#variables.dataKeyDelimiter#") {
					addInFilter(propertyIdentifier=right(i, len(i)-3), value=arguments.data[i]);
				} else if(left(i,4) == "FIR#variables.dataKeyDelimiter#" && isBoolean(arguments.data[i]) && arguments.data[i]) {
					removeInFilter(propertyIdentifier=right(i, len(i)-4));
				} else if(left(i,3) == "FK#variables.dataKeyDelimiter#") {
					var likeValueList = "";
					for(var x=1; x<=listLen(arguments.data[i], variables.valueDelimiter); x++) {
						likeValueList = listAppend(likeValueList, "%#listGetAt(arguments.data[i], x, variables.valueDelimiter)#%");
					}
					addLikeFilter(propertyIdentifier=right(i, len(i)-3), value=likeValueList);
				} else if(left(i,4) == "FKR#variables.dataKeyDelimiter#" && isBoolean(arguments.data[i]) && arguments.data[i]) {
					removeLikeFilter(propertyIdentifier=right(i, len(i)-4));
				} else if(left(i,2) == "R#variables.dataKeyDelimiter#") {
					addRange(propertyIdentifier=right(i, len(i)-2), value=arguments.data[i]);
				} else if(i == "OrderBy") {
					for(var ii=1; ii <= listLen(arguments.data[i], variables.orderPropertyDelimiter); ii++ ) {
						variables.orders = [];
						addOrder(orderStatement=listGetAt(arguments.data[i], ii, variables.orderPropertyDelimiter));
					}
				} else if(i == "P#variables.dataKeyDelimiter#Show") {
					if(arguments.data[i] == "ALL") {
<<<<<<< HEAD
						setPageRecordsShow(1000000000);
					} else if ( isNumeric(arguments.data[i]) && arguments.data[i] <= 1000000000 && arguments.data[i] > 0 ) {
						setPageRecordsShow(arguments.data[i]);	
					}
				} else if(i == "P#variables.dataKeyDelimiter#Start" && isNumeric(arguments.data[i]) && arguments.data[i] <= 1000000000 && arguments.data[i] > 0) {
					setPageRecordsStart(arguments.data[i]);
				} else if(i == "P#variables.dataKeyDelimiter#Current" && isNumeric(arguments.data[i]) && arguments.data[i] <= 1000000000 && arguments.data[i] > 0) {
=======
						setPageRecordsShow(100);
					} else if ( isNumeric(arguments.data[i]) && arguments.data[i] <= 100 && arguments.data[i] > 0 ) {
						setPageRecordsShow(arguments.data[i]);
					}
				} else if(i == "P#variables.dataKeyDelimiter#Start" && isNumeric(arguments.data[i]) && arguments.data[i] <= 100 && arguments.data[i] > 0) {
					setPageRecordsStart(arguments.data[i]);
				} else if(i == "P#variables.dataKeyDelimiter#Current" && isNumeric(arguments.data[i]) && arguments.data[i] <= 100 && arguments.data[i] > 0) {
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
					variables.currentPageDeclaration = arguments.data[i];
				}
			}
		}
<<<<<<< HEAD
		// Move data defined as "keyword" to "keywords"
		if(structKeyExists(arguments.data, "keyword")) {
			arguments.data.keywords = arguments.data.keyword;
		}
		
		// Setup the keyword phrases
		if(structKeyExists(arguments.data, "keywords")){
			
			// Parse the list of Keywords in the string
=======
// Move data defined as "keyword" to "keywords"
		if(structKeyExists(arguments.data, "keyword")) {
			arguments.data.keywords = arguments.data.keyword;
		}

// Setup the keyword phrases
		if(structKeyExists(arguments.data, "keywords")){

// Parse the list of Keywords in the string
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			var keywordList = Replace(arguments.data.Keywords," ",",","all");
			keywordList = Replace(KeywordList,"%20",",","all");
			keywordList = Replace(KeywordList,"+",",","all");
			var keywordArray = listToArray(keywordList);
<<<<<<< HEAD
			
			// Setup the array of keywords in the variables scope
			variables.keywords = keywordArray;
			
			// Setup each Phrase if the keywordsArray is > 1, and add to variables
=======

// Setup the array of keywords in the variables scope
			variables.keywords = keywordArray;

// Setup each Phrase if the keywordsArray is > 1, and add to variables
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			if(arrayLen(keywordArray) > 1) {
				for(var ps=1; ps+1<=arrayLen(keywordArray); ps++) {
					for(var i=1; i+ps<= arrayLen(keywordArray); i++) {
						var phrase = "";
						for(var p=i; p<=ps+i; p++){
							phrase = listAppend(phrase, keywordArray[p], " ");
						}
						arrayPrepend(variables.keywordPhrases, phrase);
					}
				}
			}
		}
	}
<<<<<<< HEAD
	//name value pair string to struct. Separates url string by & ampersand
=======
//name value pair string to struct. Separates url string by & ampersand
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	private struct function convertNVPStringToStruct( required string data ) {
		var returnStruct = {};
		var ampArray = listToArray(arguments.data, "&");
		for(var i=1; i<=arrayLen(ampArray); i++) {
			returnStruct[ listFirst(ampArray[i], "=") ] = listLast(ampArray[i], "=");
		}
		return returnStruct;
	}

	private void function confirmWhereGroup(required numeric whereGroup) {
		for(var i=1; i<=arguments.whereGroup; i++) {
			if(arrayLen(variables.whereGroups) < i) {
				arrayAppend(variables.whereGroups, {filters={},likeFilters={},inFilters={},ranges={}});
			}
		}
	}
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	private struct function getPropertiesStructFromEntityMeta(required struct meta) {
		var propertyStruct = {};
		var hasExtendedComponent = true;
		var currentEntityMeta = arguments.meta;
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		do {
			if(structKeyExists(currentEntityMeta, "properties")) {
				for(var i=1; i<=arrayLen(currentEntityMeta.properties); i++) {
					if(!structKeyExists(propertyStruct, currentEntityMeta.properties[i].name)) {
<<<<<<< HEAD
						propertyStruct[currentEntityMeta.properties[i].name] = duplicate(currentEntityMeta.properties[i]);	
					}
				}
			}
			
			hasExtendedComponent = false;
			
			if(structKeyExists(currentEntityMeta, "extends")) {
				currentEntityMeta = currentEntityMeta.extends;
				if(structKeyExists(currentEntityMeta, "persistent") && currentEntityMeta.persistent) {
					hasExtendedComponent = true;	
				}
			}
		} while (hasExtendedComponent);
		
		return propertyStruct;
	}
	
	public string function joinRelatedProperty(required string parentEntityName, required string relatedProperty, string joinType="", boolean fetch=false, boolean isAttribute=false) {
		if(arguments.isAttribute) {
			
			var newEntityMeta = getService("hibachiService").getEntityObject( "AttributeValue" ).getThisMetaData();
			var newEntityName = "#parentEntityName#_#UCASE(arguments.relatedProperty)#";
			var newEntityAlias = "#variables.entities[ arguments.parentEntityName ].entityAlias#_#lcase(arguments.relatedProperty)#";
			
			if(!structKeyExists(variables.entities, newEntityName)) {
				arrayAppend(variables.entityJoinOrder, newEntityName);
				
				confirmWhereGroup(1);
				variables.whereGroups[1].filters["#newEntityAlias#.attribute.attributeCode"] = arguments.relatedProperty;
				
=======
						propertyStruct[currentEntityMeta.properties[i].name] = duplicate(currentEntityMeta.properties[i]);
					}
				}
			}

			hasExtendedComponent = false;

			if(structKeyExists(currentEntityMeta, "extends")) {
				currentEntityMeta = currentEntityMeta.extends;
				if(structKeyExists(currentEntityMeta, "persistent") && currentEntityMeta.persistent) {
					hasExtendedComponent = true;
				}
			}
		} while (hasExtendedComponent);

		return propertyStruct;
	}

	public string function joinRelatedProperty(required string parentEntityName, required string relatedProperty, string joinType="", boolean fetch=false, boolean isAttribute=false) {
		if(arguments.isAttribute) {

			var newEntityMeta = getService("hibachiService").getEntityObject( "AttributeValue" ).getThisMetaData();
			var newEntityName = "#parentEntityName#_#UCASE(arguments.relatedProperty)#";
			var newEntityAlias = "#variables.entities[ arguments.parentEntityName ].entityAlias#_#lcase(arguments.relatedProperty)#";

			if(!structKeyExists(variables.entities, newEntityName)) {
				arrayAppend(variables.entityJoinOrder, newEntityName);

				confirmWhereGroup(1);
				variables.whereGroups[1].filters["#newEntityAlias#.attribute.attributeCode"] = arguments.relatedProperty;

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				addEntity(
					entityName=newEntityName,
					entityAlias=newEntityAlias,
					entityFullName="#getApplicationValue('applicationKey')#.model.entity.AttributeValue",
					entityProperties=getPropertiesStructFromEntityMeta(newEntityMeta),
					parentAlias=variables.entities[ arguments.parentEntityName ].entityAlias,
					parentRelatedProperty="attributeValues",
					joinType=arguments.joinType,
					fetch=arguments.fetch
<<<<<<< HEAD
				);
			}
			
			return newEntityName;
		} else {
			var newEntityMeta = getService("hibachiService").getEntityObject( listLast(variables.entities[ arguments.parentEntityName ].entityProperties[ arguments.relatedProperty ].cfc, ".") ).getThisMetaData();
		
			// Figure out the newEntityName
=======
						);
			}

			return newEntityName;
		} else {
			var newEntityMeta = getService("hibachiService").getEntityObject( listLast(variables.entities[ arguments.parentEntityName ].entityProperties[ arguments.relatedProperty ].cfc, ".") ).getThisMetaData();

// Figure out the newEntityName
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			if(structKeyExists(newEntityMeta, "entityName")) {
				var newEntityName = newEntityMeta.entityName;
			} else {
				var newEntityName = listLast(newEntityMeta.fullName,".");
			}
<<<<<<< HEAD
			
			// Figure out the newEntityAliase
=======

// Figure out the newEntityAliase
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			var aliaseOK = false;
			var aoindex = 1;
			var aolist = "a,b,c,d,e,f,g,h,i,j,k,l";
			var baseAliase = newEntityName;
			do {
				var newEntityAlias = "#listGetAt(aolist,aoindex)##lcase(baseAliase)#";
				if(aoindex > 1) {
					newEntityName = "#lcase(newEntityName)#_#UCASE(listGetAt(aolist,aoindex))#";
				}
				if( (structKeyExists(variables.entities, newEntityName) && variables.entities[newEntityName].entityAlias == newEntityAlias && variables.entities[newEntityName].parentRelatedProperty != relatedProperty) || newEntityAlias == variables.entities[ arguments.parentEntityName ].entityAlias) {
					aoindex++;
				} else {
					aliaseOK = true;
				}
			} while(!aliaseOK);
<<<<<<< HEAD
			
			// Check to see if this is a Self Join, and setup appropriatly.
			if(newEntityAlias == variables.entities[ arguments.parentEntityName ].entityAlias) {
				arguments.fetch = false;
			}
			
			if(!structKeyExists(variables.entities,newEntityName)) {
				arrayAppend(variables.entityJoinOrder, newEntityName);
				
=======

// Check to see if this is a Self Join, and setup appropriatly.
			if(newEntityAlias == variables.entities[ arguments.parentEntityName ].entityAlias) {
				arguments.fetch = false;
			}

			if(!structKeyExists(variables.entities,newEntityName)) {
				arrayAppend(variables.entityJoinOrder, newEntityName);

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				if(variables.entities[ arguments.parentEntityName ].entityProperties[ arguments.relatedProperty ].fieldtype == "many-to-one" && !structKeyExists(arguments, "fetch") && arguments.parentEntityName == getBaseEntityName()) {
					arguments.fetch = true;
				} else if(variables.entities[ arguments.parentEntityName ].entityProperties[ arguments.relatedProperty ].fieldtype == "one-to-one" && !structKeyExists(arguments, "fetch")) {
					arguments.fetch = true;
				} else if(!structKeyExists(arguments, "fetch")) {
					arguments.fetch = false;
				}
<<<<<<< HEAD
				
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				addEntity(
					entityName=newEntityName,
					entityAlias=newEntityAlias,
					entityFullName=newEntityMeta.fullName,
					entityProperties=getPropertiesStructFromEntityMeta(newEntityMeta),
					parentAlias=variables.entities[ arguments.parentEntityName ].entityAlias,
					parentRelatedProperty=variables.entities[ arguments.parentEntityName ].entityProperties[ arguments.relatedProperty ].name,
					joinType=arguments.joinType,
					fetch=arguments.fetch
<<<<<<< HEAD
				);
=======
						);
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			} else {
				if(arguments.joinType != "") {
					variables.entities[newEntityName].joinType = arguments.joinType;
				}
				if(structKeyExists(arguments, "fetch")) {
					variables.entities[newEntityName].fetch = arguments.fetch;
				}
			}
<<<<<<< HEAD
			
			return newEntityName;	
		}
	}
	
	private void function addEntity(required string entityName, required string entityAlias, required string entityFullName, required struct entityProperties, string parentAlias="", string parentRelatedProperty="", string joinType="") {
		variables.entities[arguments.entityName] = duplicate(arguments);
	}
	
	private string function getAliasedProperty(required string propertyIdentifier, boolean fetch) {
		var entityName = getBaseEntityName();
		var entityAlias = variables.entities[getBaseEntityName()].entityAlias;
		
		var propertyExists = getService("hibachiService").getHasPropertyByEntityNameAndPropertyIdentifier(entityName=entityName, propertyIdentifier=arguments.propertyIdentifier);
		var propertyIsAttribute = false;
		
		if(!propertyExists) {
			var propertyIsAttribute = getService("hibachiService").getHasAttributeByEntityNameAndPropertyIdentifier(entityName=entityName, propertyIdentifier=arguments.propertyIdentifier);
			if(!propertyIsAttribute) {
				return "";	
			}
		}
		
=======

			return newEntityName;
		}
	}

	private void function addEntity(required string entityName, required string entityAlias, required string entityFullName, required struct entityProperties, string parentAlias="", string parentRelatedProperty="", string joinType="") {
		variables.entities[arguments.entityName] = duplicate(arguments);
	}

	private string function getAliasedProperty(required string propertyIdentifier, boolean fetch) {
		var entityName = getBaseEntityName();
		var entityAlias = variables.entities[getBaseEntityName()].entityAlias;

		var propertyExists = getService("hibachiService").getHasPropertyByEntityNameAndPropertyIdentifier(entityName=entityName, propertyIdentifier=arguments.propertyIdentifier);
		var propertyIsAttribute = false;

		if(!propertyExists) {
			var propertyIsAttribute = getService("hibachiService").getHasAttributeByEntityNameAndPropertyIdentifier(entityName=entityName, propertyIdentifier=arguments.propertyIdentifier);
			if(!propertyIsAttribute) {
				return "";
			}
		}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		for(var i=1; i<listLen(arguments.propertyIdentifier, variables.subEntityDelimiters); i++) {
			var thisProperty = listGetAt(arguments.propertyIdentifier, i, variables.subEntityDelimiters);
			if(structKeyExists(arguments,"fetch")){
				entityName = joinRelatedProperty(parentEntityName=entityName, relatedProperty=thisProperty,fetch=arguments.fetch,isAttribute=false);
			} else {
				entityName = joinRelatedProperty(parentEntityName=entityName, relatedProperty=thisProperty,isAttribute=false);
			}
		}
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if(propertyIsAttribute) {
			if(structKeyExists(arguments,"fetch")){
				entityName = joinRelatedProperty(parentEntityName=entityName, relatedProperty=listLast(arguments.propertyIdentifier, variables.subEntityDelimiters),fetch=arguments.fetch,isAttribute=true);
			} else {
				entityName = joinRelatedProperty(parentEntityName=entityName, relatedProperty=listLast(arguments.propertyIdentifier, variables.subEntityDelimiters),isAttribute=true);
			}
		}
<<<<<<< HEAD
		
		entityAlias = variables.entities[entityName].entityAlias;
		
		if(propertyIsAttribute) {
			return "#entityAlias#.attributeValue";	
		}
		return "#entityAlias#.#variables.entities[entityName].entityProperties[listLast(propertyIdentifier, variables.subEntityDelimiters)].name#";
	}
	
	public void function addSelect(required string propertyIdentifier, required string alias) {
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier,fetch=false);
		if(len(aliasedProperty)) {
			variables.selects[aliasedProperty] = arguments.alias;	
		} 
	}
	
	public void function addWhereCondition(required string condition, struct conditionParams={}, string conditionOperator="AND") {
		arrayAppend(variables.whereConditions, arguments);
	}
	
=======

		entityAlias = variables.entities[entityName].entityAlias;

		if(propertyIsAttribute) {
			return "#entityAlias#.attributeValue";
		}
		return "#entityAlias#.#variables.entities[entityName].entityProperties[listLast(propertyIdentifier, variables.subEntityDelimiters)].name#";
	}

	public void function addSelect(required string propertyIdentifier, required string alias) {
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier,fetch=false);
		if(len(aliasedProperty)) {
			variables.selects[aliasedProperty] = arguments.alias;
		}
	}

	public void function addWhereCondition(required string condition, struct conditionParams={}, string conditionOperator="AND") {
		arrayAppend(variables.whereConditions, arguments);
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function addFilter(required string propertyIdentifier, required string value, numeric whereGroup=1, boolean fetch) {
		confirmWhereGroup(arguments.whereGroup);
		if(structKeyExists(arguments,"fetch")){
			var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier,fetch=arguments.fetch);
		} else {
			var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		}
		if(len(aliasedProperty)) {
<<<<<<< HEAD
			variables.whereGroups[arguments.whereGroup].filters[aliasedProperty] = arguments.value;	
		}
	}
	
=======
			variables.whereGroups[arguments.whereGroup].filters[aliasedProperty] = arguments.value;
		}
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function removeFilter(required string propertyIdentifier, numeric whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		if(structKeyExists(variables.whereGroups[arguments.whereGroup].filters, aliasedProperty)){
			structDelete(variables.whereGroups[arguments.whereGroup].filters, aliasedProperty);
		};
	}
	public any function getFilters(string propertyIdentifier, numeric whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		if( structKeyExists(arguments, "propertyIdentifier") ) {
			var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
			if(structKeyExists(variables.whereGroups[ arguments.whereGroup ].filters, aliasedProperty)){
				return variables.whereGroups[ arguments.whereGroup ].filters[aliasedProperty];
			}
			return "";
		}
<<<<<<< HEAD
		return variables.whereGroups[ arguments.whereGroup ].filters; 
	}
	
=======
		return variables.whereGroups[ arguments.whereGroup ].filters;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function addLikeFilter(required string propertyIdentifier, required string value, numeric whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		if(len(aliasedProperty)) {
<<<<<<< HEAD
			variables.whereGroups[arguments.whereGroup].likeFilters[aliasedProperty] = arguments.value;	
=======
			variables.whereGroups[arguments.whereGroup].likeFilters[aliasedProperty] = arguments.value;
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		}
	}
	public void function removeLikeFilter(required string propertyIdentifier, whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		if(structKeyExists(variables.whereGroups[arguments.whereGroup].likeFilters, aliasedProperty)){
			structDelete(variables.whereGroups[arguments.whereGroup].likeFilters, aliasedProperty);
		};
	}
	public any function getLikeFilters(string propertyIdentifier, numeric whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		if( structKeyExists(arguments, "propertyIdentifier") ) {
			var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
			if(structKeyExists(variables.whereGroups[ arguments.whereGroup ].likeFilters, aliasedProperty)){
				return variables.whereGroups[ arguments.whereGroup ].likeFilters[aliasedProperty];
			}
			return "";
		}
<<<<<<< HEAD
		return variables.whereGroups[ arguments.whereGroup ].likeFilters; 
	}
	
=======
		return variables.whereGroups[ arguments.whereGroup ].likeFilters;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function addInFilter(required string propertyIdentifier, required string value, numeric whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		if(len(aliasedProperty)) {
<<<<<<< HEAD
			variables.whereGroups[arguments.whereGroup].inFilters[aliasedProperty] = arguments.value;	
=======
			variables.whereGroups[arguments.whereGroup].inFilters[aliasedProperty] = arguments.value;
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		}
	}
	public void function removeInFilter(required string propertyIdentifier, whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		if(structKeyExists(variables.whereGroups[arguments.whereGroup].inFilters, aliasedProperty)){
			structDelete(variables.whereGroups[arguments.whereGroup].inFilters, aliasedProperty);
		};
	}
	public any function getInFilters(string propertyIdentifier, numeric whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		if( structKeyExists(arguments, "propertyIdentifier") ) {
			var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
			if(structKeyExists(variables.whereGroups[ arguments.whereGroup ].inFilters, aliasedProperty)){
				return variables.whereGroups[ arguments.whereGroup ].inFilters[aliasedProperty];
			}
			return "";
		}
<<<<<<< HEAD
		return variables.whereGroups[ arguments.whereGroup ].inFilters; 
	}
	
=======
		return variables.whereGroups[ arguments.whereGroup ].inFilters;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function addRange(required string propertyIdentifier, required string value, numeric whereGroup=1) {
		if( (left( arguments.value, 1) == variables.rangeDelimiter || isNumeric(listFirst(arguments.value, variables.rangeDelimiter)) || isDate(listLast(arguments.value, variables.rangeDelimiter)) ) && (right( arguments.value, 1) == variables.rangeDelimiter || isNumeric(listLast(arguments.value, variables.rangeDelimiter)) || isDate(listLast(arguments.value, variables.rangeDelimiter)) ) ) {
			confirmWhereGroup(arguments.whereGroup);
			var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
			if(len(aliasedProperty)) {
				variables.whereGroups[arguments.whereGroup].ranges[aliasedProperty] = arguments.value;
			}
		}
	}
	public void function removeRange(required string propertyIdentifier, whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		if(structKeyExists(variables.whereGroups[arguments.whereGroup].ranges, aliasedProperty)){
			structDelete(variables.whereGroups[arguments.whereGroup].ranges, aliasedProperty);
		};
	}
	public any function getRanges(string propertyIdentifier, numeric whereGroup=1) {
		confirmWhereGroup(arguments.whereGroup);
		if( structKeyExists(arguments, "propertyIdentifier") ) {
			var aliasedProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
			if(structKeyExists(variables.whereGroups[ arguments.whereGroup ].ranges, aliasedProperty)){
				return variables.whereGroups[ arguments.whereGroup ].ranges[aliasedProperty];
			}
			return "";
		}
<<<<<<< HEAD
		return variables.whereGroups[ arguments.whereGroup ].ranges; 
	}
	
=======
		return variables.whereGroups[ arguments.whereGroup ].ranges;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function addOrder(required string orderStatement, numeric position) {
		var propertyIdentifier = listFirst(arguments.orderStatement, variables.orderDirectionDelimiter);
		var orderDirection = "ASC";
		if(listLen(arguments.orderStatement, variables.orderDirectionDelimiter) > 1 && listFindNoCase("D,DESC", listLast(arguments.orderStatement, variables.orderDirectionDelimiter))) {
			orderDirection = "DESC";
		}
		var aliasedProperty = getAliasedProperty(propertyIdentifier=propertyIdentifier);
		if(len(aliasedProperty)) {
			var found = false;
			for(var existingOrder in variables.orders) {
				if(existingOrder.property == aliasedProperty) {
					found = true;
				}
			}
			if(!found) {
<<<<<<< HEAD
				arrayAppend(variables.orders, {property=aliasedProperty, direction=orderDirection});	
=======
				arrayAppend(variables.orders, {property=aliasedProperty, direction=orderDirection});
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			}
		}
	}

<<<<<<< HEAD
	public void function addKeywordProperty(required string propertyIdentifier, required numeric weight) {		
		var entityName = getBaseEntityName();
		var propertyIsAttribute = getService("hibachiService").getHasAttributeByEntityNameAndPropertyIdentifier(entityName=entityName, propertyIdentifier=arguments.propertyIdentifier);
		
		if(propertyIsAttribute) {
			
			var lastEntityName = getService("hibachiService").getLastEntityNameInPropertyIdentifier( getBaseEntityName() , arguments.propertyIdentifier );
			var entitiyID = getService("hibachiService").getPrimaryIDPropertyNameByEntityName( lastEntityName );
			
			var idPropertyIdentifier = replace(arguments.propertyIdentifier, listLast(arguments.propertyIdentifier, '.'), entitiyID);
			var aliasedProperty = getAliasedProperty(propertyIdentifier=idPropertyIdentifier);
			
=======
	public void function addKeywordProperty(required string propertyIdentifier, required numeric weight, string searchType="") {
		var entityName = getBaseEntityName();
		var propertyIsAttribute = getService("hibachiService").getHasAttributeByEntityNameAndPropertyIdentifier(entityName=entityName, propertyIdentifier=arguments.propertyIdentifier);

		if(propertyIsAttribute) {

			var lastEntityName = getService("hibachiService").getLastEntityNameInPropertyIdentifier( getBaseEntityName() , arguments.propertyIdentifier );
			var entitiyID = getService("hibachiService").getPrimaryIDPropertyNameByEntityName( lastEntityName );

			var idPropertyIdentifier = replace(arguments.propertyIdentifier, listLast(arguments.propertyIdentifier, '.'), entitiyID);
			var aliasedProperty = getAliasedProperty(propertyIdentifier=idPropertyIdentifier);

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			variables.attributeKeywordProperties[ aliasedProperty & ":" & listLast(arguments.propertyIdentifier, '.') ] = arguments.weight;
		} else {
			var aliasedProperty = getAliasedProperty(propertyIdentifier=propertyIdentifier);
			if(len(aliasedProperty)) {
				variables.keywordProperties[aliasedProperty] = arguments.weight;
<<<<<<< HEAD
			}
		}
	}
	
	public void function addHQLParam(required string paramName, required any paramValue) {
		variables.hqlParams[ arguments.paramName ] = arguments.paramValue;
	}
	
=======
				variables.keywordSearchType[aliasedProperty] = arguments.searchType;
			}
		}
	}

	public void function addHQLParam(required string paramName, required any paramValue) {
		variables.hqlParams[ arguments.paramName ] = arguments.paramValue;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public struct function getHQLParams() {
		return duplicate(variables.hqlParams);
	}

	public string function getHQLSelect (boolean countOnly=false) {
		var hqlSelect = "";
<<<<<<< HEAD
		
		if(arguments.countOnly) {
			hqlSelect &= "SELECT count(";
			if(getSelectDistinctFlag()) {
					hqlSelect &= "distinct ";
=======

		if(arguments.countOnly) {
			hqlSelect &= "SELECT count(";
			if(getSelectDistinctFlag()) {
				hqlSelect &= "distinct ";
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			}
			hqlSelect &= "#getBaseEntityPrimaryAliase()#)";
		} else {
			if(structCount(variables.selects)) {
				hqlSelect = "SELECT";
				if(getSelectDistinctFlag()) {
					hqlSelect &= " DISTINCT";
				}
				hqlSelect &= " new map(";
				for(var select in variables.selects) {
					hqlSelect &= " #select# as #variables.selects[select]#,";
				}
				hqlSelect = left(hqlSelect, len(hqlSelect)-1) & ")";
			} else {
				hqlSelect &= "SELECT";
				if(getSelectDistinctFlag()) {
<<<<<<< HEAD
					hqlSelect &= " DISTINCT";	
=======
					hqlSelect &= " DISTINCT";
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				}
				hqlSelect &= " #variables.entities[getBaseEntityName()].entityAlias#";
			}
		}
		return hqlSelect;
	}
<<<<<<< HEAD
	
	public string function getHQLFrom(boolean supressFrom=false, boolean allowFetch=true) {
		var hqlFrom = "";
		if(!arguments.supressFrom) {
			hqlFrom &= " FROM";	
		}
		
		hqlFrom &= " #getBaseEntityName()# as #variables.entities[getBaseEntityName()].entityAlias#";
		
=======

	public string function getHQLFrom(boolean supressFrom=false, boolean allowFetch=true) {
		var hqlFrom = "";
		if(!arguments.supressFrom) {
			hqlFrom &= " FROM";
		}

		hqlFrom &= " #getBaseEntityName()# as #variables.entities[getBaseEntityName()].entityAlias#";

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476

		for(var i in variables.entityJoinOrder) {
			if(i != getBaseEntityName()) {
				var joinType = variables.entities[i].joinType;
				if(!len(joinType)) {
					joinType = "left";
				}
<<<<<<< HEAD
				
				var fetch = "";
				
				if(variables.entities[i].fetch && arguments.allowFetch && !structCount(variables.selects)) {
					fetch = "fetch";
				}
				
				hqlFrom &= " #joinType# join #fetch# #variables.entities[i].parentAlias#.#variables.entities[i].parentRelatedProperty# as #variables.entities[i].entityAlias#";	
				
=======

				var fetch = "";

				if(variables.entities[i].fetch && arguments.allowFetch && !structCount(variables.selects)) {
					fetch = "fetch";
				}

				hqlFrom &= " #joinType# join #fetch# #variables.entities[i].parentAlias#.#variables.entities[i].parentRelatedProperty# as #variables.entities[i].entityAlias#";

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			}
		}
		return hqlFrom;
	}
<<<<<<< HEAD
	
	public string function getHQLWhere(boolean suppressWhere=false, searchOrder=false) {
		var hqlWhere = "";
		variables.hqlParams = {};
						
		// Add formatter based on dbtype
 		var formatter = '';
 		if(getHibachiScope().getApplicationValue("databaseType")=="Oracle10g"){
 			formatter = "LOWER";
 		}
 
		// Loop over where groups
=======

	public string function getHQLWhere(boolean suppressWhere=false, searchOrder=false) {
		var hqlWhere = "";
		variables.hqlParams = {};


// Loop over where groups
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		for(var i=1; i<=arrayLen(variables.whereGroups); i++) {
			if( structCount(variables.whereGroups[i].filters) || structCount(variables.whereGroups[i].likeFilters) || structCount(variables.whereGroups[i].inFilters) || structCount(variables.whereGroups[i].ranges) ) {

				if(len(hqlWhere) == 0) {
					if(!arguments.suppressWhere) {
						hqlWhere &= " WHERE";
					}
					hqlWhere &= " (";
				} else {
					hqlWhere &= " OR";
				}
<<<<<<< HEAD
				
				// Open A Where Group
				hqlWhere &= " (";
				
				// Add Where Group Filters
=======

// Open A Where Group
				hqlWhere &= " (";

// Add Where Group Filters
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				for(var filter in variables.whereGroups[i].filters) {
					if(listLen(variables.whereGroups[i].filters[filter], variables.valueDelimiter) gt 1) {
						hqlWhere &= " (";
						for(var ii=1; ii<=listLen(variables.whereGroups[i].filters[filter], variables.valueDelimiter); ii++) {
							if(listGetAt(variables.whereGroups[i].filters[filter], ii, variables.valueDelimiter) eq "NULL") {
<<<<<<< HEAD
								hqlWhere &= " #filter# IS NULL OR";	
							} else if(listGetAt(variables.whereGroups[i].filters[filter], ii, variables.valueDelimiter) eq "NOT NULL"){
								hqlWhere &= " #filter# IS NOT NULL OR";
=======
								hqlWhere &= " #filter# IS NULL OR";
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
							} else {
								var paramID = "F#replace(filter, ".", "", "all")##i##ii#";
								addHQLParam(paramID, listGetAt(variables.whereGroups[i].filters[filter], ii, variables.valueDelimiter));
								hqlWhere &= " #filter# = :#paramID# OR";
							}
						}
						hqlWhere = left(hqlWhere, len(hqlWhere)-2) & ") AND";
					} else {
						if(variables.whereGroups[i].filters[filter] == "NULL") {
							hqlWhere &= " #filter# IS NULL AND";
<<<<<<< HEAD
						} else if(variables.whereGroups[i].filters[filter] == "NOT NULL"){
							hqlWhere &= " #filter# IS NOT NULL AND";
						} else {
							var paramID = "F#replace(filter, ".", "", "all")##i#";
							addHQLParam(paramID, variables.whereGroups[i].filters[filter]);
							hqlWhere &= " #filter# = :#paramID# AND";	
						}
					}
				}
				
				// Add Where Group Like Filters
=======
						} else {
							var paramID = "F#replace(filter, ".", "", "all")##i#";
							addHQLParam(paramID, variables.whereGroups[i].filters[filter]);
							hqlWhere &= " #filter# = :#paramID# AND";
						}
					}
				}

// Add Where Group Like Filters
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				for(var likeFilter in variables.whereGroups[i].likeFilters) {
					if(listLen(variables.whereGroups[i].likeFilters[likeFilter], variables.valueDelimiter) gt 1) {
						hqlWhere &= " (";
						for(var ii=1; ii<=listLen(variables.whereGroups[i].likeFilters[likeFilter], variables.valueDelimiter); ii++) {
							var paramID = "LF#replace(likeFilter, ".", "", "all")##i##ii#";
							addHQLParam(paramID, lcase(listGetAt(variables.whereGroups[i].likeFilters[likeFilter], ii, variables.valueDelimiter)));
<<<<<<< HEAD
							hqlWhere &= " #formatter#(#likeFilter#) LIKE :#paramID# OR";
=======
							hqlWhere &= " LOWER(#likeFilter#) LIKE :#paramID# OR";
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
						}
						hqlWhere = left(hqlWhere, len(hqlWhere)-2) & ") AND";
					} else {
						var paramID = "LF#replace(likeFilter, ".", "", "all")##i#";
						addHQLParam(paramID, lcase(variables.whereGroups[i].likeFilters[likeFilter]));
<<<<<<< HEAD
						hqlWhere &= " #formatter#(#likeFilter#) LIKE :#paramID# AND";
					}
				}
				
				// Add Where Group In Filters
				for(var inFilter in variables.whereGroups[i].inFilters) {
					var paramID = "LF#replace(inFilter, ".", "", "all")##i#";
					var paramValue = variables.whereGroups[i].inFilters[inFilter];
					
					addHQLParam(paramID, listToArray(paramValue));
					
					hqlWhere &= " #inFilter# IN (:#paramID#) AND";
				}
				
				// Add Where Group Ranges
				for(var range in variables.whereGroups[i].ranges) {
					
					if(len(variables.whereGroups[i].ranges[range]) gt 1) {
						
						// Only A Higher
						if(left(variables.whereGroups[i].ranges[range],1) == variables.rangeDelimiter) {
							
							var paramIDupper = "R#replace(range, ".", "", "all")##i#upper";
							addHQLParam(paramIDupper, listLast(variables.whereGroups[i].ranges[range], variables.rangeDelimiter));
							hqlWhere &= " #range# <= :#paramIDupper# AND";
							
						// Only A Lower
						} else if (right(variables.whereGroups[i].ranges[range],1) == variables.rangeDelimiter) {
						
							var paramIDlower = "R#replace(range, ".", "", "all")##i#lower";
							addHQLParam(paramIDlower, listFirst(variables.whereGroups[i].ranges[range], variables.rangeDelimiter));
							hqlWhere &= " #range# >= :#paramIDlower# AND";
						
						// Both
						} else {
						
=======
						hqlWhere &= " LOWER(#likeFilter#) LIKE :#paramID# AND";
					}
				}

// Add Where Group In Filters
				for(var inFilter in variables.whereGroups[i].inFilters) {
					var paramID = "LF#replace(inFilter, ".", "", "all")##i#";
					var paramValue = variables.whereGroups[i].inFilters[inFilter];

					addHQLParam(paramID, listToArray(paramValue));

					hqlWhere &= " #inFilter# IN (:#paramID#) AND";
				}

// Add Where Group Ranges
				for(var range in variables.whereGroups[i].ranges) {

					if(len(variables.whereGroups[i].ranges[range]) gt 1) {

// Only A Higher
						if(left(variables.whereGroups[i].ranges[range],1) == variables.rangeDelimiter) {

							var paramIDupper = "R#replace(range, ".", "", "all")##i#upper";
							addHQLParam(paramIDupper, listLast(variables.whereGroups[i].ranges[range], variables.rangeDelimiter));
							hqlWhere &= " #range# <= :#paramIDupper# AND";

// Only A Lower
						} else if (right(variables.whereGroups[i].ranges[range],1) == variables.rangeDelimiter) {

							var paramIDlower = "R#replace(range, ".", "", "all")##i#lower";
							addHQLParam(paramIDlower, listFirst(variables.whereGroups[i].ranges[range], variables.rangeDelimiter));
							hqlWhere &= " #range# >= :#paramIDlower# AND";

// Both
						} else {

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
							var paramIDupper = "R#replace(range, ".", "", "all")##i#upper";
							var paramIDlower = "R#replace(range, ".", "", "all")##i#lower";
							addHQLParam(paramIDlower, listFirst(variables.whereGroups[i].ranges[range], variables.rangeDelimiter));
							addHQLParam(paramIDupper, listLast(variables.whereGroups[i].ranges[range], variables.rangeDelimiter));
<<<<<<< HEAD
							hqlWhere &= " #range# >= :#paramIDlower# AND #range# <= :#paramIDupper# AND";	
							
						}
						
					}
					
				}
				
				// Close Where Group
=======
							hqlWhere &= " #range# >= :#paramIDlower# AND #range# <= :#paramIDupper# AND";

						}

					}

				}

// Close Where Group
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				hqlWhere = left(hqlWhere, len(hqlWhere)-3)& ")";
				if( i == arrayLen(variables.whereGroups)) {
					hqlWhere &= " )";
				}
			}
		}
<<<<<<< HEAD
		
		// Add Search Filters if keywords exist
=======

// Add Search Filters if keywords exist
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if( arrayLen(variables.Keywords) && (structCount(variables.keywordProperties) || structCount(variables.attributeKeywordProperties)) ) {
			if(len(hqlWhere) == 0) {
				if(!arguments.suppressWhere) {
					hqlWhere &= " WHERE";
				}
			} else {
				hqlWhere &= " AND";
			}
<<<<<<< HEAD
			
			for(var ii=1; ii<=arrayLen(variables.Keywords); ii++) {
				var paramID = "keyword#ii#";
				addHQLParam(paramID, "%#lcase(variables.Keywords[ii])#%");
				hqlWhere &= " (";
				for(var keywordProperty in variables.keywordProperties) {
					
					hqlWhere &= " #formatter#(#keywordProperty#) LIKE :#paramID# OR";
				}
				
				//Loop over all attributes and find any matches
				for(var attributeProperty in variables.attributeKeywordProperties) {
					var idProperty = listLast(listFirst(attributeProperty,':'), '.');
					var fullIDMap = left(idProperty, len(idProperty)-2) & '.' & idProperty;
					hqlWhere &= " EXISTS(SELECT sav.attributeValue FROM #getDao('HibachiDao').getApplicationKey()#AttributeValue as sav WHERE sav.#fullIDMap# = #listFirst(attributeProperty, ":")# AND sav.attribute.attributeCode = '#listLast(attributeProperty,':')#' AND sav.attributeValue LIKE :#paramID# ) OR";
				}
				
=======

			for(var ii=1; ii<=arrayLen(variables.Keywords); ii++) {


				hqlWhere &= " (";
				for(var keywordProperty in variables.keywordProperties) {

					if( structKeyExists(variables.keyWordSearchType, keywordProperty) && variables.keyWordSearchType[keywordProperty] == "left" ) {
						var paramID = "keywordLeft#ii#";

						addHQLParam(paramID, "#lcase(variables.Keywords[ii])#%");
						hqlWhere &= " #keywordProperty# LIKE :#paramID# OR";

					} else {
						var paramID = "keywordMid#ii#";

						addHQLParam(paramID, "%#lcase(variables.Keywords[ii])#%");
						hqlWhere &= " #keywordProperty# LIKE :#paramID# OR";
					}
				}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				hqlWhere = left(hqlWhere, len(hqlWhere)-3 );
				hqlWhere &= " ) AND";
			}
			hqlWhere = left(hqlWhere, len(hqlWhere)-4 );
		}
<<<<<<< HEAD
		
		// Add Where Conditions
=======

// Add Where Conditions
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if( arrayLen(getWhereConditions()) ) {
			for(var i=1; i<=arrayLen(getWhereConditions()); i++) {
				if(len(hqlWhere) == 0) {
					if(!arguments.suppressWhere && i==1) {
						hqlWhere &= " WHERE";
					}
				} else {
					hqlWhere &= " #getWhereConditions()[i].conditionOperator#";
				}
				structAppend(variables.hqlParams,getWhereConditions()[i].conditionParams);
				hqlWhere &= " #getWhereConditions()[i].condition#";
			}
		}
<<<<<<< HEAD
		
		return hqlWhere;
	}
	
	public string function getBaseEntityPrimaryAliase() {
		var idColumnNames = getService("hibachiService").getEntityORMMetaDataObject( getBaseEntityName() ).getIdentifierColumnNames();
		if( arrayLen(idColumnNames) > 1) {
			return getAliasedProperty( getService("hibachiService").getPrimaryIDPropertyNameByEntityName( getBaseEntityName() ) );
		}
		return "#variables.entities[ getBaseEntityName() ].entityAlias#.id";
	}
	
	public string function getHQLOrder(boolean supressOrderBy=false) {
		var hqlOrder = "";
		if(arrayLen(variables.orders)){
			
			if(!arguments.supressOrderBy) {
				hqlOrder &= " ORDER BY";
			}
			
=======

		return hqlWhere;
	}

	public string function getBaseEntityPrimaryAliase() {
		return "#variables.entities[ getBaseEntityName() ].entityAlias#.id";
	}

	public string function getHQLOrder(boolean supressOrderBy=false) {
		var hqlOrder = "";
		if(arrayLen(variables.orders)){

			if(!arguments.supressOrderBy) {
				hqlOrder &= " ORDER BY";
			}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			for(var i=1; i<=arrayLen(variables.orders); i++) {
				hqlOrder &= " #variables.orders[i].property# #variables.orders[i].direction#,";
			}
			hqlOrder = left(hqlOrder, len(hqlOrder)-1);
		} else if (!structCount(variables.selects)) {
<<<<<<< HEAD
			
			var baseEntityObject = getService('hibachiService').getEntityObject( getBaseEntityName() );
			
=======

			var baseEntityObject = getService('hibachiService').getEntityObject( getBaseEntityName() );

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			if(structKeyExists(baseEntityObject.getThisMetaData(), "hb_defaultOrderProperty")) {
				var obProperty = getAliasedProperty( baseEntityObject.getThisMetaData().hb_defaultOrderProperty );
			} else if ( baseEntityObject.hasProperty( "createdDateTime" ) ) {
				var obProperty = getAliasedProperty( "createdDateTime" );
			} else {
<<<<<<< HEAD
				var obProperty = getAliasedProperty( getService("hibachiService").getPrimaryIDPropertyNameByEntityName( getBaseEntityName() ) );
			}
			
			hqlOrder &= " ORDER BY #obProperty# ASC";
		}
		
		return hqlOrder;
	}
	
	public string function getHQL() {			
=======
				var obProperty = getBaseEntityPrimaryAliase();
			}

			hqlOrder &= " ORDER BY #obProperty# ASC";
		}

		return hqlOrder;
	}

	public string function getHQL() {
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		return "#getHQLSelect()##getHQLFrom()##getHQLWhere()##getHQLOrder()#";
	}

	public array function getRecords(boolean refresh=false) {
		if( !structKeyExists(variables, "records") || arguments.refresh == true) {
<<<<<<< HEAD
			variables.records = ormExecuteQuery(getHQL(), getHQLParams(), false, {ignoreCase="true", cacheable=getCacheable(), cachename="records-#getCacheName()#"});
		}
		return variables.records;
	}
	
	// Paging Methods
=======
			if( getDirtyReadFlag() ) {
				var currentTransactionIsolation = variables.connection.getTransactionIsolation();
				variables.connection.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
			}

			variables.records = ormExecuteQuery(getHQL(), getHQLParams(), false, {ignoreCase="true", cacheable=getCacheable(), cachename="records-#getCacheName()#"});

			if( getDirtyReadFlag() ) {
				variables.connection.setTransactionIsolation(currentTransactionIsolation);
			}
		}
		return variables.records;
	}

// Paging Methods
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public array function getPageRecords(boolean refresh=false) {
		if( !structKeyExists(variables, "pageRecords") || arguments.refresh == true) {
			saveState();
			variables.pageRecords = ormExecuteQuery(getHQL(), getHQLParams(), false, {offset=getPageRecordsStart()-1, maxresults=getPageRecordsShow(), ignoreCase="true", cacheable=getCacheable(), cachename="pageRecords-#getCacheName()#"});
		}
		return variables.pageRecords;
	}
<<<<<<< HEAD
	
	public any function getFirstRecord(boolean refresh=false) {
		if( !structKeyExists(variables, "firstRecord") || arguments.refresh == true) {
			saveState();
			variables.firstRecord = ormExecuteQuery(getHQL(), getHQLParams(), true, {maxresults=1, ignoreCase="true", cacheable=getCacheable(), cachename="pageRecords-#getCacheName()#"});
		}
		return variables.firstRecord;
	}
	
	public void function clearRecordsCount() {
		structDelete(variables, "recordsCount");
	}
	
=======

	public void function clearRecordsCount() {
		structDelete(variables, "recordsCount");
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public numeric function getRecordsCount() {
		if(!structKeyExists(variables, "recordsCount")) {
			if(getCacheable() && structKeyExists(application.entitySmartList, getCacheName()) && structKeyExists(application.entitySmartList[getCacheName()], "recordsCount")) {
				variables.recordsCount = application.entitySmartList[ getCacheName() ].recordsCount;
			} else {
				if(!structKeyExists(variables,"records")) {
					var HQL = "#getHQLSelect(countOnly=true)##getHQLFrom(allowFetch=false)##getHQLWhere()#";
<<<<<<< HEAD
					var recordCount = ormExecuteQuery(HQL, getHQLParams(), true, {ignoreCase="true"});
=======

					if( getDirtyReadFlag() ) {
						var currentTransactionIsolation = variables.connection.getTransactionIsolation();
						variables.connection.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
					}

					var recordCount = ormExecuteQuery(HQL, getHQLParams(), true, {ignoreCase="true"});

					if( getDirtyReadFlag() ) {
						variables.connection.setTransactionIsolation(currentTransactionIsolation);
					}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
					variables.recordsCount = recordCount;
					if(getCacheable()) {
						application.entitySmartList[ getCacheName() ] = {};
						application.entitySmartList[ getCacheName() ].recordsCount = variables.recordsCount;
					}
				} else {
<<<<<<< HEAD
					variables.recordsCount = arrayLen(getRecords());	
=======
					variables.recordsCount = arrayLen(getRecords());
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				}
			}
		}
		return variables.recordsCount;
	}
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public numeric function getPageRecordsStart() {
		if(variables.currentPageDeclaration > 1) {
			variables.pageRecordsStart = ((variables.currentPageDeclaration-1)*getPageRecordsShow()) + 1;
		}

		return variables.pageRecordsStart;
	}
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public numeric function getPageRecordsEnd() {
		var pageRecordEnd = getPageRecordsStart() + getPageRecordsShow() - 1;
		if(pageRecordEnd > getRecordsCount()) {
			pageRecordEnd = getRecordsCount();
		}
		return pageRecordEnd;
	}
<<<<<<< HEAD
	
	public numeric function getCurrentPage() {
		return ceiling(getPageRecordsStart() / getPageRecordsShow());
	}
	
	public any function getTotalPages() {
		return ceiling(getRecordsCount() / getPageRecordsShow());
	}
	
	public string function buildURL(required string queryAddition, boolean appendValues=true, boolean toggleKeys=true, string currentURL=variables.currentURL) {
		// Generate full URL if one wasn't passed in
		if(!len(arguments.currentURL)) {
			if(len(cgi.query_string)) {
				arguments.currentURL &= "?" & CGI.QUERY_STRING;	
=======

	public numeric function getCurrentPage() {
		return ceiling(getPageRecordsStart() / getPageRecordsShow());
	}

	public any function getTotalPages() {
		return ceiling(getRecordsCount() / getPageRecordsShow());
	}

	public string function buildURL(required string queryAddition, boolean appendValues=true, boolean toggleKeys=true, string currentURL=variables.currentURL) {
// Generate full URL if one wasn't passed in
		if(!len(arguments.currentURL)) {
			if(len(cgi.query_string)) {
				arguments.currentURL &= "?" & CGI.QUERY_STRING;
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			}
		}

		var modifiedURL = "?";
<<<<<<< HEAD
		
		// Turn the old query string into a struct
		var oldQueryKeys = {};
		
=======

// Turn the old query string into a struct
		var oldQueryKeys = {};

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if(findNoCase("?", arguments.currentURL)) {
			var oldQueryString = right(arguments.currentURL, len(arguments.currentURL) - findNoCase("?", arguments.currentURL));
			for(var i=1; i<=listLen(oldQueryString, "&"); i++) {
				var keyValuePair = listGetAt(oldQueryString, i, "&");
				oldQueryKeys[listFirst(keyValuePair,"=")] = listLast(keyValuePair,"=");
			}
		}
<<<<<<< HEAD
		
		// Turn the added query string to a struct
=======

// Turn the added query string to a struct
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		var newQueryKeys = {};
		for(var i=1; i<=listLen(arguments.queryAddition, "&"); i++) {
			var keyValuePair = listGetAt(arguments.queryAddition, i, "&");
			newQueryKeys[listFirst(keyValuePair,"=")] = listLast(keyValuePair,"=");
		}
<<<<<<< HEAD
		
		
		// Get all keys and values from the old query string added
=======


// Get all keys and values from the old query string added
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		for(var key in oldQueryKeys) {
			if(key != "P#variables.dataKeyDelimiter#Current" && key != "P#variables.dataKeyDelimiter#Start" && key != "P#variables.dataKeyDelimiter#Show") {
				if(!structKeyExists(newQueryKeys, key)) {
					modifiedURL &= "#key#=#oldQueryKeys[key]#&";
				} else {
					if(arguments.toggleKeys && structKeyExists(oldQueryKeys, key) && structKeyExists(newQueryKeys, key) && oldQueryKeys[key] == newQueryKeys[key]) {
						structDelete(newQueryKeys, key);
					} else if(arguments.appendValues) {
						for(var i=1; i<=listLen(newQueryKeys[key], variables.valueDelimiter); i++) {
							var thisVal = listGetAt(newQueryKeys[key], i, variables.valueDelimiter);
							var findCount = listFindNoCase(oldQueryKeys[key], thisVal, variables.valueDelimiter);
							if(findCount) {
								newQueryKeys[key] = listDeleteAt(newQueryKeys[key], i, variables.valueDelimiter);
								if(arguments.toggleKeys) {
									oldQueryKeys[key] = listDeleteAt(oldQueryKeys[key], findCount);
								}
							}
						}
						if(len(oldQueryKeys[key]) && len(newQueryKeys[key])) {
							if(left(key, 1) eq "r") {
<<<<<<< HEAD
								modifiedURL &= "#key#=#newQueryKeys[key]#&";	
=======
								modifiedURL &= "#key#=#newQueryKeys[key]#&";
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
							} else {
								modifiedURL &= "#key#=#oldQueryKeys[key]##variables.valueDelimiter##newQueryKeys[key]#&";
							}
						} else if(len(oldQueryKeys[key])) {
							modifiedURL &= "#key#=#oldQueryKeys[key]#&";
						}
						structDelete(newQueryKeys, key);
					}
				}
			}
		}
<<<<<<< HEAD
		
		// Get all keys and values from the additional query string added 
=======

// Get all keys and values from the additional query string added
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		for(var key in newQueryKeys) {
			if(key != "P#variables.dataKeyDelimiter#Current" && key != "P#variables.dataKeyDelimiter#Start" && key != "P#variables.dataKeyDelimiter#Show") {
				modifiedURL &= "#key#=#newQueryKeys[key]#&";
			}
		}
<<<<<<< HEAD
		
		if(!structKeyExists(newQueryKeys, "P#variables.dataKeyDelimiter#Show") || newQueryKeys["P#variables.dataKeyDelimiter#Show"] == getPageRecordsShow()) {
			// Add the correct page start
=======

		if(!structKeyExists(newQueryKeys, "P#variables.dataKeyDelimiter#Show") || newQueryKeys["P#variables.dataKeyDelimiter#Show"] == getPageRecordsShow()) {
// Add the correct page start
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			if( structKeyExists(newQueryKeys, "P#variables.dataKeyDelimiter#Start") ) {
				modifiedURL &= "P#variables.dataKeyDelimiter#Start=#newQueryKeys[ 'P#variables.dataKeyDelimiter#Start' ]#&";
			} else if( structKeyExists(newQueryKeys, "P#variables.dataKeyDelimiter#Current") ) {
				modifiedURL &= "P#variables.dataKeyDelimiter#Current=#newQueryKeys[ 'P#variables.dataKeyDelimiter#Current' ]#&";
			}
		}
<<<<<<< HEAD
		
		// Add the correct page show
=======

// Add the correct page show
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if( structKeyExists(newQueryKeys, "P#variables.dataKeyDelimiter#Show") ) {
			modifiedURL &= "P#variables.dataKeyDelimiter#Show=#newQueryKeys[ 'P#variables.dataKeyDelimiter#Show' ]#&";
		} else if( structKeyExists(oldQueryKeys, "P#variables.dataKeyDelimiter#Show") ) {
			modifiedURL &= "P#variables.dataKeyDelimiter#Show=#oldQueryKeys[ 'P#variables.dataKeyDelimiter#Show' ]#&";
		}
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if(right(modifiedURL, 1) eq "&") {
			modifiedURL = left(modifiedURL, len(modifiedURL)-1);
		} else if (right(modifiedURL, 1) eq "?") {
			modifiedURL = "?c=1";
		}
<<<<<<< HEAD
		
		// Always return lower case
		return lcase(modifiedURL);
	}
	
=======

// Always return lower case
		return lcase(modifiedURL);
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public boolean function isFilterApplied(required string filter, required string value){
		var exists = false;
		if(structKeyExists(url,"F#variables.dataKeyDelimiter##arguments.filter#") && listFindNoCase(url["F#variables.dataKeyDelimiter##arguments.filter#"],arguments.value,variables.valueDelimiter)){
			exists = true;
		}
		return exists;
	}
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public boolean function isLikeFilterApplied(required string filter, required string value){
		var exists = false;
		if(structKeyExists(url,"FK#variables.dataKeyDelimiter##arguments.filter#") && listFindNoCase(url["FK#variables.dataKeyDelimiter##arguments.filter#"],arguments.value,variables.valueDelimiter)){
			exists = true;
		}
		return exists;
	}
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public boolean function isRangeApplied(required string range, required string value){
		var exists = false;
		if(structKeyExists(url,"R#variables.dataKeyDelimiter##arguments.range#") and url["R#variables.dataKeyDelimiter##arguments.range#"] eq arguments.value){
			exists = true;
		}
		return exists;
	}
<<<<<<< HEAD
	
	public array function getFilterOptions(
		required string valuePropertyIdentifier, 
		required string namePropertyIdentifier,
		string parentPropertyIdentifier
	) {
		var nameProperty = getAliasedProperty(propertyIdentifier=arguments.namePropertyIdentifier);
		var valueProperty = getAliasedProperty(propertyIdentifier=arguments.valuePropertyIdentifier);
		
		if(structKeyExists(arguments,'parentPropertyIdentifier')){
			 var parentProperty = getAliasedProperty(propertyIdentifier=arguments.parentPropertyIdentifier);
		}
		
		var originalWhereGroup = duplicate(variables.whereGroups);
		
=======

	public array function getFilterOptions(required string valuePropertyIdentifier, required string namePropertyIdentifier) {
		var nameProperty = getAliasedProperty(propertyIdentifier=arguments.namePropertyIdentifier);
		var valueProperty = getAliasedProperty(propertyIdentifier=arguments.valuePropertyIdentifier);

		var originalWhereGroup = duplicate(variables.whereGroups);

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		for(var i=1; i<=arrayLen(variables.whereGroups); i++) {
			for(var key in variables.whereGroups[i].filters) {
				if(key == valueProperty) {
					structDelete(variables.whereGroups[i].filters, key);
				}
			}
		}
<<<<<<< HEAD
			
		var hql = "SELECT NEW MAP(
			#nameProperty# as name,
			#valueProperty# as value,
			count(#nameProperty#) as count
			";
		
		if(structKeyExists(arguments,'parentPropertyIdentifier')){
			hql &= ", #parentProperty# as parentValue";
		}
		hql &=")";
		
		hql &="#getHQLFrom(allowFetch=false)#
		#getHQLWhere()# #getHibachiScope().getService('hibachiUtilityService').hibachiTernary(len(getHQLWhere()), 'AND', 'WHERE')#
=======

		if( getDirtyReadFlag() ) {
			var currentTransactionIsolation = variables.connection.getTransactionIsolation();
			variables.connection.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
		}

		var results = ormExecuteQuery("SELECT NEW MAP(
			#nameProperty# as name,
			#valueProperty# as value,
			count(#nameProperty#) as count
			)
		#getHQLFrom(allowFetch=false)#
		#getHQLWhere()# #IIF(len(getHQLWhere()), DE('AND'), DE('WHERE'))#
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				#nameProperty# IS NOT NULL
			AND
				#valueProperty# IS NOT NULL
		GROUP BY
			#nameProperty#,
<<<<<<< HEAD
			#valueProperty#";
			
		if(structKeyExists(arguments,'parentPropertyIdentifier')){
			hql &= ", #parentProperty#";
		}
			
		hql &= "
		ORDER BY
			#nameProperty# ASC";
		var results = ormExecuteQuery(hql, getHQLParams());
		
		variables.whereGroups = originalWhereGroup;
		
		return results;
	}
	
	public struct function getRangeMinMax(required string propertyIdentifier) {
		var rangeProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);
		
		var originalWhereGroup = duplicate(variables.whereGroups);
		
=======
			#valueProperty#
		ORDER BY
			#nameProperty# ASC", getHQLParams());

		if( getDirtyReadFlag() ) {
			variables.connection.setTransactionIsolation(currentTransactionIsolation);
		}

		variables.whereGroups = originalWhereGroup;

		return results;
	}

	public struct function getRangeMinMax(required string propertyIdentifier) {
		var rangeProperty = getAliasedProperty(propertyIdentifier=arguments.propertyIdentifier);

		var originalWhereGroup = duplicate(variables.whereGroups);

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		for(var i=1; i<=arrayLen(variables.whereGroups); i++) {
			for(var key in variables.whereGroups[i].ranges) {
				if(key == rangeProperty) {
					structDelete(variables.whereGroups[i].ranges, key);
				}
			}
		}
<<<<<<< HEAD
		
=======

		if( getDirtyReadFlag() ) {
			var currentTransactionIsolation = variables.connection.getTransactionIsolation();
			variables.connection.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
		}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		var results = ormExecuteQuery("SELECT NEW MAP(
			min(#rangeProperty#) as min,
			max(#rangeProperty#) as max
			)
		#getHQLFrom(allowFetch=false)#
		#getHQLWhere()#", getHQLParams(), true);
<<<<<<< HEAD
			
		variables.whereGroups = originalWhereGroup;
		
		return results;
	}
	
	
	// =============== Saved State Logic ===========================
	
	public void function loadSavedState(required string savedStateID) {
		var savedStates = [];
		if(getHibachiScope().hasSessionValue('smartListSavedState')) {
			savedStates = getHibachiScope().getSessionValue('smartListSavedState');	
=======

		if( getDirtyReadFlag() ) {
			variables.connection.setTransactionIsolation(currentTransactionIsolation);
		}

		variables.whereGroups = originalWhereGroup;

		return results;
	}


// =============== Saved State Logic ===========================

	public void function loadSavedState(required string savedStateID) {
		var savedStates = [];
		if(getHibachiScope().hasSessionValue('smartListSavedState')) {
			savedStates = getHibachiScope().getSessionValue('smartListSavedState');
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		}
		for(var s=1; s<=arrayLen(savedStates); s++) {
			if(savedStates[s].savedStateID eq arguments.savedStateID) {
				for(var key in savedStates[s]) {
					variables[key] = duplicate(savedStates[s][key]);
<<<<<<< HEAD
				}	
			}
		}
	}
	
	private void function saveState() {
		// Make sure that the saved states structure and array exists
		if(!getHibachiScope().hasSessionValue('smartListSavedState')) {
			getHibachiScope().setSessionValue('smartListSavedState', []);
		}
		
=======
				}
			}
		}
	}

	private void function saveState() {
// Make sure that the saved states structure and array exists
		if(!getHibachiScope().hasSessionValue('smartListSavedState')) {
				getHibachiScope().setSessionValue('smartListSavedState', []);
		}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		var sessionKey = "";
		if(structKeyExists(COOKIE, "JSESSIONID")) {
			sessionKey = COOKIE.JSESSIONID;
		} else if (structKeyExists(COOKIE, "CFTOKEN")) {
			sessionKey = COOKIE.CFTOKEN;
		} else if (structKeyExists(COOKIE, "CFID")) {
			sessionKey = COOKIE.CFID;
		}
<<<<<<< HEAD
		
		// Lock the session so that we can manipulate based on saved state
		lock name="#sessionKey#_#getHibachiInstanceApplicationScopeKey()#_smartListSavedStateUpdateLogic" timeout="10" {
		
			// Get the saved state struct
			var states = getHibachiScope().getSessionValue('smartListSavedState');
			
			// Setup the state
			var state = getStateStruct();
			state.savedStateID = getSavedStateID();
			
			// If the savedState already existed, then delete it
=======

// Lock the session so that we can manipulate based on saved state
		lock name="#sessionKey#_#getHibachiInstanceApplicationScopeKey()#_smartListSavedStateUpdateLogic" timeout="10" {

// Get the saved state struct
			var states = getHibachiScope().getSessionValue('smartListSavedState');

// Setup the state
			var state = getStateStruct();
			state.savedStateID = getSavedStateID();

// If the savedState already existed, then delete it
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			for(var e=1; e<=arrayLen(states); e++) {
				if(states[e].savedStateID eq state.savedStateID) {
					arrayDeleteAt(states, e);
				}
			}
<<<<<<< HEAD
			
			// Add the state to the states array
			arrayPrepend(states, state);
				
			for(var s=arrayLen(states); s>30; s--) {
				arrayDeleteAt(states, s);
			}
			
			getHibachiScope().setSessionValue('smartListSavedState', states);
		}
	}
	
=======

// Add the state to the states array
			arrayPrepend(states, state);

			for(var s=arrayLen(states); s>30; s--) {
				arrayDeleteAt(states, s);
			}

				getHibachiScope().setSessionValue('smartListSavedState', states);
		}
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public string function getSavedStateID() {
		if(!structKeyExists(variables, "savedStateID")) {
			variables.savedStateID = createUUID();
		}
<<<<<<< HEAD
		
		return variables.savedStateID;
	}
	
	public struct function getStateStruct() {
		var stateStruct = {};
		
=======

		return variables.savedStateID;
	}

	public struct function getStateStruct() {
		var stateStruct = {};

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		stateStruct.baseEntityName = duplicate(variables.baseEntityName);
		stateStruct.entities = duplicate(variables.entities);
		stateStruct.whereGroups = duplicate(variables.whereGroups);
		stateStruct.whereConditions = duplicate(variables.whereConditions);
		stateStruct.orders = duplicate(variables.orders);
		stateStruct.keywords = duplicate(variables.keywords);
		stateStruct.keywordProperties = duplicate(variables.keywordProperties);
<<<<<<< HEAD
		stateStruct.attributeKeywordProperties = duplicate(variables.attributeKeywordProperties);
		stateStruct.pageRecordsShow = duplicate(variables.pageRecordsShow);
		stateStruct.entityJoinOrder = duplicate(variables.entityJoinOrder);
		stateStruct.selectDistinctFlag = duplicate(variables.selectDistinctFlag);
		
		return stateStruct;
	}
	
	public any function getCacheName() {
		// Take the stateStruct, serialize it, and turn that list it into a an array
		var valueArray = listToArray(serializeJSON(getStateStruct()));
		
		// Sort the array so that the values always end up the same
		arraySort(valueArray,"text");
		
		// Turn the array back into a list, lcase, and hash for the name
		return hash(lcase(arrayToList(valueArray,",")));
	}
}
=======
		stateStruct.keywordSearchType = duplicate(variables.keywordSearchType);
		stateStruct.pageRecordsShow = duplicate(variables.pageRecordsShow);
		stateStruct.entityJoinOrder = duplicate(variables.entityJoinOrder);
		stateStruct.selectDistinctFlag = duplicate(variables.selectDistinctFlag);
		stateStruct.dirtyReadFlag = duplicate(variables.dirtyReadFlag);

		return stateStruct;
	}

	public any function getCacheName() {
// Take the stateStruct, serialize it, and turn that list it into a an array
		var valueArray = listToArray(serializeJSON(getStateStruct()));

// Sort the array so that the values always end up the same
		arraySort(valueArray,"text");

// Turn the array back into a list, lcase, and hash for the name
		return hash(lcase(arrayToList(valueArray,",")));
	}
}
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
