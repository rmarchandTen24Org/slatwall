/*

    Slatwall - An Open Source eCommerce Platform
    Copyright (C) ten24, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    Linking this program statically or dynamically with other modules is
    making a combined work based on this program.  Thus, the terms and
    conditions of the GNU General Public License cover the whole
    combination.

    As a special exception, the copyright holders of this program give you
    permission to combine this program with independent modules and your
    custom code, regardless of the license terms of these independent
    modules, and to copy and distribute the resulting program under terms
    of your choice, provided that you follow these specific guidelines:

	- You also meet the terms and conditions of the license of each
	  independent module
	- You must not alter the default display of the Slatwall name or logo from
	  any part of the application
	- Your custom code must not alter or create any files inside Slatwall,
	  except in the following directories:
		/integrationServices/

	You may copy and distribute the modified version of this program that meets
	the above guidelines as a combined work under the terms of GPL for this program,
	provided that you include the source code of that other code when and as the
	GNU GPL requires distribution of source code.

    If you modify this program, you may extend this exception to your version
    of the program, but you are not obligated to do so.

Notes:

*/
component extends="Slatwall.model.service.HibachiService" persistent="false" accessors="true" output="false" {
	property name="integrationCFC" type="any";
	property name="settingService" type="any";
	property name="integrationService" type="any";


	// ===================== START: Logical Methods ===========================
	
	public void function init(any integrationService=getService('integrationService'), any settingService=getService('settingService')){
		setIntegrationService(arguments.integrationService);
		setSettingService(arguments.settingService);
		var integration = getIntegrationService().getIntegrationByIntegrationPackage('elasticsearch');
		var integrationCFC = getService('integrationService').getIntegrationCFC(integration);
		setIntegrationCFC(integrationCFC);
	}

	public any function newElasticSearchRequestBean(){
		var requestBean = new Slatwall.integrationServices.elasticsearch.model.transient.ElasticSearchRequestBean();
		requestBean.setURLString(setting('ServerURL'));
		return requestBean;
	}

	public any function setting(required string settingName, array filterEntities=[], formatValue=false) {
		return getIntegrationCFC().setting(argumentCollection=arguments);
	}

	public any function getResponseByHttpRequest(required any httpRequest){
		var response = arguments.httpRequest.send().getPrefix();
		var data = deserializejson(response.Filecontent);

		if(!findNoCase(200,response.statusCode)){
			getService('hibachiUtilityService').logMessage(message=data['error'] & " - " & data['error_description'],messageType="SalesForce Integration",messageCode=response.statusCode,logType="Error",generalLog=true);
		}

		var responseBean = new Slatwall.model.transient.data.DataResponseBean();
		responseBean.setData(data);
		responseBean.setStatusCode(response.statusCode);

		return responseBean;
	}

	public boolean function indexWithTypeExists(required index, required type){
		var requestBean = newElasticSearchRequestBean();
		requestBean.setAction('_search/exists');
		requestBean.setType(arguments.type);
		requestBean.setIndex(arguments.index);

		var responseBean = requestBean.getResponseBean();
		return responseBean.getData().exists;
	}
	
	
	
	public any function getRecordsRequestBean(required collectionEntity, numeric size, numeric from){
		var requestBean = newElasticSearchRequestBean();
		
		var body = {};
		requestBean.setMethod('POST');
		requestBean.setAction('_search');
		if(arguments.collectionEntity.getNewFlag()){
			requestBean.setIndex('entity');
			requestBean.setType(arguments.collectionEntity.getCollectionObject());
		}else{
			requestBean.setIndex('collection');
			requestBean.setType(arguments.collectionEntity.getCollectionID());
		}
		
		if(structKeyExists(arguments,'size')){
			body['size']=arguments.size;
		}
		if(structKeyExists(arguments,'from')){
			body['from']=arguments.from;
		}
		
		body['_source']=true;

		var collectionConfig = arguments.collectionEntity.getcollectionConfigStruct();
		//column begin
		var fields = "";

		if(!isNull(collectionConfig.columns) && arrayLen(collectionConfig.columns)){
			var columnsCount = arraylen(collectionConfig.columns);

			var searchableFields = [];

			for(var i=1;i < columnsCount; i++){
				var column = collectionConfig.columns[i];
				if(
					isNumeric(arguments.collectionEntity.getKeywords())
					|| (
						!isNumeric(arguments.collectionEntity.getKeywords())
						&& "big_decimal,int,integer,float,double" DOES NOT CONTAIN column.ormtype
					)
				){
					var alias = arguments.collectionEntity.getColumnAlias(column);
					if(i == columnsCount){
						fields &= alias;
					}else{
						fields &= alias & ',';
					}
					if(structKeyExists(column,'isSearchable') && column.isSearchable){
						arrayAppend(searchableFields,alias);
					}
				}
			}

			//keywords

			/*if(len(arguments.collectionEntity.getKeywords())){
				body['query']['query_string'] = {};
				body['query']['query_string']['query']=arguments.collectionEntity.getKeywords();
				body['query']['query_string']['fields']=searchableFields;
			}else{
				body['query']['match_all']={};
			}*/
			

		}
		if(len(fields)){
			body['fields']=fields;
		}
		//column end
		
		//filter begin
		
		if(structKeyExists(collectionConfig,'filterGroups')){
			//assumes event scoring for filters
			body['query']['constant_score'] ={};
			body['query']['constant_score']['filter'] = getFilterGroupsPacket(collectionConfig.filterGroups);
		}
		
		//filter end

		//order begin
		var sort = "";

		if(!isNull(collectionConfig.orderBy) && len(collectionConfig.orderBy)){
			var orderByCount = arraylen(collectionConfig.orderBy);
			for(var i = 1; i <= orderByCount; i++){
				var ordering = arguments.orderBy[i];
				var direction = '';
				if(!isnull(ordering.direction)){
					direction = ordering.direction;
				}

				sort &= '#ordering.propertyIdentifier#:#direction# ';

				//check whether a comma is needed
				if(i != orderByCount){
					sort &= ',';
				}
			}
		}

		if(len(sort)){
			body['sort']=sort;
		}
		//order end
		
		var jsonBody = serializeJson(body);
		requestBean.setBody(jsonBody);
		
		return requestBean;
	}
	/*
	{
	   "bool" : {
	      "must" :     [],
	      "should" :   [],
	      "must_not" : [],
	      "filter":    []
	   }
	}
	*/
	public string function getBoolFilter(required string logicalOperator){
		
		switch(arguments.logicalOperator){
			case "or":
				return "should";
			break;
			case "and":
				return "must";
			break;
		}
		return 'must';
	}
	
	public any function getElasticFilter(required struct filter){
		var elasticFilter ={};
		var filtertype = "";
		var filterContents = {};
		var propertyIdentifier = listRest(ReReplace(replace(filter.propertyIdentifier,'_',''),'_','.'),'.');
		
		switch(arguments.filter.comparisonOperator){
			case "=":
			case "!=":
			case "<>":
				filtertype ="term";
				filterContents[propertyIdentifier] = filter.value;
			break;
			case ">":
				filterContents[propertyIdentifier] = {};
				filterContents[propertyIdentifier]['gt'] = filter.value;
				filtertype ="range";
			break;
			case "<":
				filterContents[propertyIdentifier] = {};
				filterContents[propertyIdentifier]['lt'] = filter.value;
				filtertype ="range";
			break;
			case "<=":
				filterContents[propertyIdentifier] = {};
				filterContents[propertyIdentifier]['lte'] = filter.value;
				filtertype ="range";
			break;
			case ">=":
				filterContents[propertyIdentifier] = {};
				filterContents[propertyIdentifier]['gte'] = filter.value;
				filtertype ="range";
			break;
			
			case "like":
			case "not like":
				filtertype ='wildcard';
				filterContents[propertyIdentifier] = rereplace(filter.value,'%','*','ALL');
			break;
			case "in":
			case "not in":
				filtertype ="terms";
				filterContents[propertyIdentifier] = listToArray(filter.value);
			break;
			case "between":
			case "not between":
				filtertype ="range";
				if(arguments.filter.ormtype eq 'timestamp'){
					if(listLen(arguments.filter.value,'-') > 1){
						//convert unix timestamp
						var fromDate = DateAdd("s", listFirst(arguments.filter.value,'-')/1000, "January 1 1970 00:00:00");
						var fromValue = dateFormat(fromDate,"yyyy-mm-dd") & " " & timeFormat(fromDate, "HH:MM:SS");
						var toDate = DateAdd("s", listLast(arguments.filter.value,'-')/1000, "January 1 1970 00:00:00");
						var toValue = dateFormat(toDate,"yyyy-mm-dd") & " " & timeFormat(toDate, "HH:MM:SS");
						filterContents[propertyIdentifier] = {};
						filterContents[propertyIdentifier]['lte'] = toValue;
						filterContents[propertyIdentifier]['gte'] = fromValue;
					}else{
						//if list length is 1 then we treat it as a date range From Now() - Days to Now()
						var fromValue = DateAdd("d",-arguments.filter.value,Now());
						var toValue = Now();
	
						filterContents[propertyIdentifier] = {};
						filterContents[propertyIdentifier]['lte'] = toValue;
						filterContents[propertyIdentifier]['gte'] = fromValue;
					}
				}else if(listFind('integer,float,big_decimal',arguments.filter.ormtype)){
					
					var fromValue = listFirst(arguments.filter.value,'-');
					var toValue = listLast(arguments.filter.value,'-');
					filterContents[propertyIdentifier] = {};
					filterContents[propertyIdentifier]['lte'] = toValue;
					filterContents[propertyIdentifier]['gte'] = fromValue;
				}
			break;
			//reserved for is null/is not null where value is null in json
			case "is":
			case "is not":
				filtertype ="exists";
				filterContents['field'] = propertyIdentifier;
			break;
		}
		elasticFilter[filterType] = filterContents;
		
		
		return elasticFilter;
	}
	
	public any function getFilterGroupPacket(required array filterGroup){
		var filterGroupPacket = {};
		var filterGroupPacket['bool'] ={};
		var filterGroupPacket['bool']['must'] = [];
		
		for(var filter in arguments.filterGroup){
			//loop over and figure out the type that the filter belongs to
			//currently assumes only filteres and not filter groups
			if(
				structKeyExists(filter,'comparisonOperator')
				&& len(filter.comparisonOperator)
			){
				var filter = getElasticFilter(filter);
				arrayAppend(filterGroupPacket['bool']['must'],filter);
			}
		}
		return filterGroupPacket;
	}
	
	//Phase one assumes that we don't use more than one filter group
	public any function getFilterGroupsPacket(required array filterGroups){
		var filterGroupsPacket = {};
		filterGroupsPacket['bool'] = {};
		//assumes only must filters without negation
		filterGroupsPacket['bool']['must'] = [];
		for(var filterGroup in arguments.filterGroups){
			var filterGroupPacket = getFilterGroupPacket(filterGroup.filterGroup);
			arrayAppend(filterGroupsPacket['bool']['must'],filterGroupPacket);
		}
		
		return filterGroupsPacket;
	}
	
	public numeric function getRecordsCount(required any collectionEntity){
		var requestBean = getRecordsRequestBean(argumentCollection=arguments);
		requestBean.setAction('_count');
		var responseBean = requestBean.getResponseBean();
		return responseBean.getData()['count'];
	}
	
	public array function getRecords(required any collectionEntity, numeric size, numeric from){
		
		var requestBean = getRecordsRequestBean(argumentCollection=arguments);
		var responseBean = requestBean.getResponseBean();
		
		var records = [];
		for(var hit in responseBean.getData().hits.hits){
			arrayAppend(records,hit['_source']);
		}
		if(structKeyExists(responseBean.getData().hits,'total')){
			arguments.collectionEntity.setRecordsCount(responseBean.getData().hits.total);
		}
		
		return records;
	}

	public array function getPageRecords(required any collectionEntity){
		return getRecords(collectionEntity=arguments.collectionEntity,size=arguments.collectionEntity.getPageRecordsShow(),from=arguments.collectionEntity.getPageRecordsStart());
	}
	
	public any function processElasticSearchResource_Index(required any elasticSearchResource, any processObject){
		arguments.elasticSearchResource = this.saveElasticSearchResource(arguments.elasticSearchResource);
		return arguments.elasticSearchResource;
	}
	
	public any function saveElasticSearchResource(required any elasticSearchResource, struct data={}){
		arguments.elasticSearchResource = super.save(arguments.elasticSearchResource, arguments.data);
		
		if(!arguments.elasticSearchResource.hasErrors()){
			var collectionEntity = getCollectionList(arguments.elasticSearchResource.getElasticSearchResourceType());
			if(!isNull(elasticSearchResource.getCollectionConfig())){
				collectionEntity.setCollectionConfig(elasticSearchResource.getCollectionConfig());
				var elasticSearchResourceCollectionConfigStruct = deserializeJson(elasticSearchResource.getCollectionConfig());	
				collectionEntity.setCollectionConfigStruct(elasticSearchResourceCollectionConfigStruct);
			}
			
			indexCollection(collectionEntity);
		}
		return arguments.elasticSearchResource;
	}
	
	public void function createIndex(required string index, string type="", struct properties){
		var requestBean = newElasticSearchRequestBean();
		requestBean.setIndex(arguments.index);
		requestBean.setMethod('POST');
		
		var requestBody = getMappings(argumentCollection=arguments);
		requestBean.setBody(serializeJson(requestBody));
		
		var responseBean = requestBean.getResponseBean();
		if(structKeyExists(responseBean.getData(),'errors') && responseBean.getData().errors == 'YES'){
			logHibachi('createIndexFailed: #arguments.index#/#arguments.type#',true);
		}
	}

	public void function deleteIndex(required index){
		var requestBean = newElasticSearchRequestBean();
		requestBean.setIndex(arguments.index);
		requestBean.setMethod('DELETE');
		var responseBean = requestBean.getResponseBean();
		if(structKeyExists(responseBean.getData(),'errors') && responseBean.getData().errors == 'YES'){
			logHibachi('deleteIndexFailed: #arguments.index#',true);
		}
	}

	public void function updateMapping(required index, required type, required struct properties){
		/*
		PUT my_index
		{
		  "mappings": {
		    "user": {
		      "properties": {
		        "name": {
		          "properties": {
		            "first": {
		              "type": "string"
		            }
		          }
		        },
		        "user_id": {
		          "type": "string",
		          "index": "not_analyzed"
		        }
		      }
		    }
		  }
		}
		*/

		var requestBean = newElasticSearchRequestBean();
		requestBean.setIndex(arguments.index);
		requestBean.setAction('_mapping');
		requestBean.setType(arguments.type);
		requestBean.setMethod('PUT');

		var requestBody['properties'] = arguments.properties;
		requestBean.setBody(serializeJson(requestBody));
		

		var responseBean = requestBean.getResponseBean();
		if(structKeyExists(responseBean.getData(),'errors') && responseBean.getData().errors == 'YES'){
			logHibachi('updateMappingFailed: #arguments.index#/#arguments.type#',true);
		}
	}
	
	public struct function getMappings(required string type, required struct properties){
		var mappings = {};
		mappings['mappings']={};
		mappings['mappings'][arguments.type] = {};
		if(!isNull(arguments.properties)){
			mappings['mappings'][arguments.type]['properties'] = arguments.properties;	
		}
		return mappings;
	}


	public string function getElasticDataType(required string ormtype){
		var datatype = 'string';
		switch(lcase(arguments.ormtype)){
			case "integer":
			case "int":
				datatype="integer";
				break;
			case "big_decimal":
			case "float":
			case "double":
				datatype="double";
				break;
			case "timestamp":
			case "date":
				datatype='date';
				break;
			case "boolean":
			case "yes_no":
			case "true_false":
				datatype="boolean";
				break;
			case "string":
			case "text":
				datatype="string";
				break;
			case "character":
			case "char":
				datatype="byte";
				break;
			case "short":
				datatype="short";
				break;
			case "long":
				datatype="long";
				break;
			case "binary":
			case "serializable":
			case "blob":
			case "clob":
				datatype="binary";
				break;
		}
		return datatype;
	}
	
	public struct function getPropertyMappingsByCollection(required any collectionEntity){
		var properties = {};
		for(var column in arguments.collectionEntity.getcollectionConfigStruct().columns){
			var alias = arguments.collectionEntity.getColumnAlias(column);
			properties[alias] = {};
			properties[alias]['type'] = getElasticDataType(column.ormtype);
			properties[alias]['index'] = 'not_analyzed';
		}
		return properties;
	}
	
	public boolean function indexExists(required string index){
		var requestBean = newElasticSearchRequestBean();
		requestBean.setIndex(arguments.index);
		requestBean.setMethod('HEAD');

		var responseBean = requestBean.getResponseBean();
		
		return !responseBean.getStatusCode() CONTAINS 404;
	}
	
	

	public void function indexCollection(required any collectionEntity){
		//if we don't have a collection then take the opportunity to create the index and mappings
		var indexName = "entity";
		var typeName = arguments.collectionEntity.getCollectionObject();
		var lockName = "elasticSearchIndex";
		if(!arguments.collectionEntity.getNewFlag()){
			indexName = "collection";			
			typeName = arguments.collectionEntity.getCollectionID();
			lockName &= arguments.collectionEntity.getCollectionID();
		}else{
			lockName &= arguments.collectionEntity.getCollectionObject();
		}
		
		if(!indexExists(indexName)){
			var properties = getPropertyMappingsByCollection(arguments.collectionEntity);
			createIndex(indexName,typeName,properties);
		}
		
		//pump data into collection
		lock name="#lockName#" timeout="200" {
			var collectionRecords = arguments.collectionEntity.getRecords(formatRecords=false);
			var collectionExampleEntity = collectionEntity.getCollectionEntityObject();
			var collectionPrimaryIDName = collectionExampleEntity.getPrimaryIDPropertyName();


			//var linebreak = '\n';
			/*bulk api body example
				{"index":{"_id":"1"}}
				{"name": "John Doe" }
				{"index":{"_id":"2"}}
				{"name": "Jane Doe" }
				{"index":{"_id":"3"}}
				{"name": "Bob Doe" }
				{"index":{"_id":"4"}}
				{"name": "Bobby Doe" }

				NOTE: always end body with a carriage return as elastic search reads this on a line by line basis
			*/
			var linebreak = Chr(13) & Chr(10);
			var collectionRecordsCount = arraylen(collectionRecords);
			var requestBody = "";

			for(var i=1; i <= collectionRecordsCount;i++){
				var record = collectionRecords[i];
				requestBody &='{"index":{"_id":"#record[collectionPrimaryIDName]#"}}' & linebreak;
				requestBody &=serializeJson(record) & linebreak;

				if(i % 1000 == 0 || i == collectionRecordsCount){
					if(getService('hibachiUtilityService').isInThread())
					{
					  //do something...
					  	requestBody &= linebreak;
						var requestBean = newElasticSearchRequestBean();
						requestBean.setAction('_bulk');
						requestBean.setIndex(indexName);
						requestBean.setType('#typeName#');
						requestBean.setMethod('POST');

						requestBean.setBody(requestBody);
						var responseBean = requestBean.getResponseBean();
						if(structKeyExists(responseBean.getData(),'errors') && responseBean.getData().errors == 'YES'){
							logHibachi('collectionIndexFailed: #indexName#/#typeName#/_bulk',true);
						}
					}else{
						var threadName = "indexCollection-#createHibachiUUID()#";
						thread name="#threadName#" action="run" 
							   requestBody="#requestBody#" 
							   lineBreak="#lineBreak#"
							   indexName="#indexName#"
							   typeName="#typeName#"
						{
							attributes.requestBody &= attributes.linebreak;
							var requestBean = newElasticSearchRequestBean();
							requestBean.setAction('_bulk');
							requestBean.setIndex(attributes.indexName);
							requestBean.setType('#attributes.typeName#');
							requestBean.setMethod('POST');
	
							requestBean.setBody(attributes.requestBody);
							var responseBean = requestBean.getResponseBean();
							if(structKeyExists(responseBean.getData(),'errors') && responseBean.getData().errors == 'YES'){
								logHibachi('collectionIndexFailed: #attribtues.indexName#/#attributes.typeName#/_bulk',true);
							}
						}
					}
					
					requestBody = "";
				}
			}
			if(!getService('hibachiUtilityService').isInThread()){
				thread action="join";	
			}
			

		}
	}

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
