//This resource is accessed using something like: http://localhost:8500/rest/resource/collection/controller/slataction.json
component extends="Slatwall.org.Hibachi.HibachiController" output="false" accessors="true" rest="true" restpath="/controller"   {
	
	this.publicMethods="";
	this.publicMethods = listAppend(this.publicMethods, "doAction");
	this.secureMethods="";
	
	// ======================== Admin Integration Methods
	public void function default() {
		// Do Nothing
	}
	
   /**
	* @hint Returns an collection listing of data given an {entityName}
	* @restpath /{controllerName}/{action}
	* @httpmethod GET
	* @controllerName.restargsource "Path"
	* @action.restargsource "Path"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @hint Returns an controller definition for the action.
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function doAction(required string controllerName, required string action) {
		//Check that the user is authenticated through one of the authentication processes.
		if (!isAuthenticated()){
			pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
		var response = {
	        'detail' = {}
	    };
	    return response;
		//Get the list
		/*try{
			var queryData = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("get#arguments.entityName#CollectionList");
		    
		    //Extra Fields
		    if (isDefined("arguments.fields")){
		    	queryData.setDisplayProperties(fields);
		    }
		    
		    
		    //Page
		    if (isDefined("arguments.page")){
		    	queryData.setPageRecordsStart(arguments.page);
		    }else{
		    	arguments.page = 1;
		    	queryData.setPageRecordsStart(arguments.page);
		    }
		    
		    if (isDefined("arguments.pageSize")){
		    	queryData.setPageRecordsShow(arguments.pageSize);
		    }
		    
		    //All records
		    if (!isNull(arguments.pageSize) && lcase(arguments.pageSize) == "all"){
		    	var collection_ = queryData.getRecords();
		    }else{
		    	var collection_ = queryData.getPageRecords();
		    }
		    
		    var response = {
		        "list": collection_,
		        'headers' : {}
		    };
		    
		    //Query Meta
		    // media - should contain all of the locations possible for the api user. 
		    response['headers']['location']  = "/collection/#arguments.entityName#";
		    pc = getPageContext().getResponse();
		    
			//Add basic links.
			response['links'] = [];
			
			//Set the previous page
			if (queryData.getPageRecordsStart() > 1){
				response['links'] = addLink(response['links'], "previous_page", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#queryData.getPageRecordsStart() - 1#");
			}
			//Current page
			response['links'] = addLink(response['links'], "self", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#arguments.page#&pageSize=#!isNull(arguments.pageSize)?arguments.pageSize:10#");
			
			//Set the next page
			if (queryData.getPageRecordsStart() < queryData.getTotalPages()){
				response['links'] = addLink(response['links'], "next_page", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#queryData.getPageRecordsStart() + 1#");
			}
			
			pc.addHeader("X-Collection-Meta", "total-pages:#queryData.getTotalPages()#,records-total:#queryData.getRecordsCount()#,current-page:#queryData.getPageRecordsStart()#,records-per-page:#queryData.getPageRecordsShow()#"); 
			pc.addHeader("Location", "/collection/#arguments.entityName#");
			pc.addHeader("link", "<link rel='self', href='#CGI.SERVER_NAME##CGI.PATH_INFO#', title='You are here' />");
			pc.addHeader("link", "<link rel='singular', href='#CGI.SERVER_NAME##CGI.PATH_INFO#{id}', title='Returns a specific entity given an entity name and entityID' />");
			pc.addHeader("link", "<link rel='plural', href='#CGI.SERVER_NAME##CGI.PATH_INFO#', title='Returns a collection of entity given an entity name' />");
			
			//Other pagination options
			response['links'] = addLink(response['links'], "show_25", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#queryData.getPageRecordsStart()#&pageSize=25");
			response['links'] = addLink(response['links'], "show_50", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#queryData.getPageRecordsStart()#&pageSize=50");
		    response['links'] = addLink(response['links'], "show_100", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#queryData.getPageRecordsStart()#&pageSize=100");
		    response['links'] = addLink(response['links'], "last", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#queryData.getRecordsCount()#");
		    response['links'] = addLink(response['links'], "show_all", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#queryData.getPageRecordsStart()#&pageSize=all");
		    
		    //Filters and sorting
		    response['links'] = addLink(response['links'], "additional_fields", "#CGI.SERVER_NAME##CGI.PATH_INFO#?fields={fieldName1},{fieldName2},{fieldName3}");
		    response['links'] = addLink(response['links'], "order_by", "#CGI.SERVER_NAME##CGI.PATH_INFO#?orderby={fieldName}|{ASC|DESC}");
		    response['links'] = addLink(response['links'], "field_filter", "#CGI.SERVER_NAME##CGI.PATH_INFO#/filter/?f:{fieldName}:{EQ|NEQ|LT|GT|LTE|GTE|LIKE}={filterValue}");
		    response['links'] = addLink(response['links'], "range_filter", "#CGI.SERVER_NAME#/rest/resource/collection/#entityName#/filter/?r:{fieldName}={LOW_VALUE^HIGH_VALUE}");
		    
		    
		    //Add related entity links. This uses meta to attach links to the data in the list instead of just the id. Using ?expand={fieldName} will
		    //cause that data to be added to the response in addition to including the link.
		    response['links'] = addLink(response['links'], "#arguments.entityName#_meta", "#CGI.SERVER_NAME#/rest/resource/collection/#entityName#/meta{.json|.xml}");
		    response['links'] = addLink(response['links'], "#arguments.entityName#_validation", "#CGI.SERVER_NAME#/rest/resource/collection/#entityName#/validation{.json|.xml}");
	    
	    }catch(any restError){
	    	response['error'] = restError;
	    }*/
	    //return response;
	}
	
   
}
