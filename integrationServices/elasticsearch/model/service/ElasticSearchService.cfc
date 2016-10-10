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
	

	// ===================== START: Logical Methods ===========================

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
	
	public array function getPageRecords(required any collectionEntity){
		var requestBean = newElasticSearchRequestBean();
		requestBean.setAction('_search');
		requestBean.setIndex('collection');
		requestBean.setType(arguments.collectionEntity.getCollectionID());
		requestBean.addParam(type="formfield",name="size",value=arguments.collectionEntity.getPageRecordsShow());
		requestBean.addParam(type="formfield",name="from",value=arguments.collectionEntity.getPageRecordsStart());
		requestBean.addParam(type="formfield",name="_source",value="true");
		
		var collectionConfig = arguments.collectionEntity.getcollectionConfigStruct();
		//column begin
		var fields = "";
		
		if(!isNull(collectionConfig.columns) && arrayLen(collectionConfig.columns)){
			var columnsCount = arraylen(collectionConfig.columns);
			for(var i=1;i < columnsCount; i++){
				var column = collectionConfig.columns[i];
				var alias = arguments.collectionEntity.getColumnAlias(column);
				if(i == columnsCount){
					fields &= alias;
				}else{
					fields &= alias & ',';
				}
			}
		}
		if(len(fields)){
			requestBean.addParam(type="formfield",name="fields",value=fields);
		}
		//column end
		
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
			requestBean.addParam(type="formfield",name="sort",value=sort);
		}
		//order end
		
		var queryJson = {
			query={
				match_all={}
			}
		};
		requestBean.setBody(serializeJson(queryJson));
		
				
		var responseBean = requestBean.getResponseBean();
		var pageRecords = [];
		for(var hit in responseBean.getData().hits.hits){
			arrayAppend(pageRecords,hit['_source']);
		}
		return pageRecords;
		
	}
	
	public void function indexCollection(required any collectionEntity){
		var collectionRecords = arguments.collectionEntity.getRecords();
		var collectionExampleEntity = collectionEntity.getCollectionEntityObject();
		var collectionPrimaryIDName = collectionExampleEntity.getPrimaryIDPropertyName();
		var requestBody = "";
		var linebreak = Chr(13) & Chr(10);
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
		for(var record in collectionRecords){
			requestBody &='{"index":{"_id":"#record[collectionPrimaryIDName]#"}}' & linebreak;
			requestBody &=serializeJson(record) & linebreak;
		}
		requestBody &= linebreak;
		var requestBean = newElasticSearchRequestBean();
		requestBean.setAction('_bulk');
		requestBean.setIndex('collection');
		requestBean.setType('#arguments.collectionEntity.getCollectionID()#');
		requestBean.setMethod('POST');
		
		requestBean.setBody(requestBody);
		var responseBean = requestBean.getResponseBean();
		if(structKeyExists(responseBean.getData(),'errors') && responseBean.getData().errors == 'YES'){
			logHibachi('collectionIndexFailed: collection/#arguments.collectionEntity.getCollectionID()#/_bulk',true);
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
