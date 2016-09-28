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
component accessors="true" output="false" displayname="ElasticSearch" extends="Slatwall.integrationServices.BaseIntegration" implements="Slatwall.integrationServices.IntegrationInterface" {
	property name="elasticSearchService" type="any";
	
	public any function init() {
		if(getHibachiScope().hasService('elasticSearchService')){
			setElasticSearchService(getHibachiScope().getService('elasticSearchService'));
			getElasticSearchService().setIntegrationCFC(this);
		}
		return this;
	}
	
	public struct function getSettings() {
		return {
			ServerURL = {fieldType="text"}
		};
	}
	
	public string function getIntegrationTypes() {
		return "search,fw1";
	}
	
	public string function getDisplayName() {
		return "Elastic Search";
	}
	
	public any function testIntegration() {
		return getElasticSearchDetailsResponseBean();
	}
	
	public any function getElasticSearchDetailsResponseBean(){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		return requestBean.getResponseBean();
	}
	
	public any function getElasticSearchClusterHealthResponseBean(){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setAction('/_cluster/health');
		return requestBean.getResponseBean();
	}
	
	public any function getElasticSearchListAllIndicesResponseBean(){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setAction("_cat/indices?v");
		return requestBean.getResponseBean();
	}
	
	public any function createIndex(required string indexName){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('PUT');
		requestBean.setIndex(arguments.indexName);
		return requestBean.getResponseBean();
	}
	
	public any function deleteIndex(required string indexName){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('DELETE');
		requestBean.setIndex(arguments.indexName);
		return requestBean.getResponseBean();
	}
	
	public any function createDocument(required string index, required string type, required string ID, required string body){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('PUT');
		requestBean.populate(arguments);
		return requestBean.getResponseBean();
	}
	
	public any function updateDocument(required string index, required string type, required string ID, required string body){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('POST');
		requestBean.populate(arguments);
		return requestBean.getResponseBean();
	}
	
	public any function deleteDocument(required string index, required string type, required string ID){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('DELETE');
		requestBean.populate(arguments);
		return requestBean.getResponseBean();
	}
	
	public any function getDocument(required string index, required string type, required string ID){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('GET');
		requestBean.populate(arguments);
		return requestBean.getResponseBean();
	}
	
	public any function searchIndex(required string index){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('GET');
		requestBean.populate(arguments);
		requestBean.setAction('/_search');
		return requestBean.getResponseBean();
	}
	
	public any function bulkRequest(required string index, required string type, required string body){
		var requestBean = getElasticSearchService().newElasticSearchRequestBean();
		requestBean.setMethod('POST');
		requestBean.populate(arguments);
		requestBean.setAction('/_bulk');
		return requestBean.getResponseBean();
	}
}
