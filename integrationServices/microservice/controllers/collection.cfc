component extends="Slatwall.org.Hibachi.HibachiController" output="false" accessors="true" rest="true" restpath="/collection"   {
	import "Slatwall.model.entity.CollectionConfig";
	
	this.publicMethods="";
	this.publicMethods = listAppend(this.publicMethods, "list");
	this.publicMethods = listAppend(this.publicMethods, "detail");
	this.publicMethods = listAppend(this.publicMethods, "filter");
	this.publicMethods = listAppend(this.publicMethods, "meta");
	this.publicMethods = listAppend(this.publicMethods, "search");
	this.secureMethods="";
	
	// ======================== Admin Integration Methods
	public void function default() {
		// Do Nothing
	}
	
	/**
	* @hint Returns an collection listing of data given an {entityName}
	* @restpath {entityName}
	* @httpmethod GET
	* @entityName.restargsource "Path"
	* @page.restargsource "Query"
	* @pagesize.restargsource "Query"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function list(required string entityName, string page, string pageSize ) {
		//Check that the user is authenticated through one of the authentication processes.
		if (!isAuthenticated()){
			pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
		//Get the list
		try{
			var queryData = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("get#arguments.entityName#CollectionList");
		    
		    //Page
		    if (isDefined("arguments.page")){
		    	queryData.setPageRecordsStart(arguments.page);
		    }else{
		    	arguments.page = 1;
		    	queryData.setPageRecordsStart(arguments.page);
		    }
		    
		    //Pagesize
		    if (isDefined("arguments.pageSize")){
		    	queryData.setPageRecordsShow(arguments.pageSize);
		    }else{
		    	arguments.pageSize = 15;
		    	queryData.setPageRecordsShow(arguments.pageSize);
		    }
		    
		    //All records
		    if (lcase(arguments.pageSize) == "all"){
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
			response['links'] = addLink(response['links'], "self", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#arguments.page#&pageSize=#arguments.pageSize#");
			
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
		    response['links'] = addLink(response['links'], "field_filter", "#CGI.SERVER_NAME##CGI.PATH_INFO#filter/?f:{fieldName}:{EQ|NEQ|LT|GT|LTE|GTE|LIKE}={filterValue}");
		    response['links'] = addLink(response['links'], "range_filter", "#CGI.SERVER_NAME##CGI.PATH_INFO#filter/?r:{fieldName}={LOW_VALUE^HIGH_VALUE}");
		    
		    
		    //Add related entity links. This uses meta to attach links to the data in the list instead of just the id. Using ?expand={fieldName} will
		    //cause that data to be added to the response in addition to including the link.
		    response['links'] = addLink(response['links'], "#arguments.entityName#_meta", "#CGI.SERVER_NAME##CGI.PATH_INFO#meta/");
	    }catch(any restError){
	    	response['error'] = restError;
	    }
	    return response;
	}
	
   /**
	* @hint Returns entity meta of data given an {entityName}
	* @restpath {entityName}/meta
	* @httpmethod GET
	* @entityName.restargsource "Path"
	* @entityID.restargsource "Path"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function meta(required string entityName) {
		//Check that the user is authenticated through one of the authentication processes.
		if (!isAuthenticated()){
			pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
		var response = {
	    	"fieldNames" = "",
	        "meta" = {}
	    };
	    try{
		    var entityMeta = getHibachiScope().getService("#arguments.entityName#Service").getEntityMetaData("#arguments.entityName#");
		    
		    response = {
		    	"fieldNames" = "",
		        "meta" = entityMeta.properties
		    };
		    
		    var properties = entityMeta.properties;
		    var fieldList = "";
		    for (var field in properties){
		    	fieldList = listAppend(fieldList, field['name']);
		    }
		    response.fieldNames = fieldList;
	    }catch(any restError){
	    	response['error'] = restError; 
	    }
	    return response;
	}
	
   /**
	* @hint Returns an collection of data given an {entityName} and/or {entityID}
	* @restpath /{entityName}/{entityID}
	* @httpmethod GET
	* @returnType struct
	* @access remote
	* @entityName.restargsource "Path"
	* @entityID.restargsource "Path"
	* @produces application/json,application/xml
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function findBy(required string entityName, required string entityID) {
		//Check that the user is authenticated through one of the authentication processes.
		if (!isAuthenticated()){
			pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
		
	    var response = {
	        'detail' = {}
	    };
	    
		try{
			
			var queryData = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("get#arguments.entityName#CollectionList");
		    queryData.addFilter("#arguments.entityName#ID", arguments.entityID,"=");
		    queryData.addDisplayProperty("primaryEmailAddress.accountEmailAddressID");
		    queryData.addDisplayProperty("primaryEmailAddress.emailAddress");
		    
		    response['detail'] = queryData.getRecords();
		    
		    //Test the collection proxy. The proxy turns the collection row into a traversable object.
	    	var account = new CollectionProxy(queryData.getRecords()[1]);
	    	var response['Name'] = account.getFirstName() & " " & account.getLastName();
	    	var response['Email'] = account.getPrimaryEmailAddress().getEmailAddress();
	    	var response['AccountEmailAddressID'] = account.getPrimaryEmailAddress().getAccountEmailAddressID();
	    	var response['Email2'] = account.getPrimaryEmailAddress().getEmailAddress();
	    	var response['Name2'] = account.getFirstName() & " " & account.getLastName();
	    }catch(any restError){
	    	response['error'] = restError;
	    }
	    
	    
	    return response;
	}
	
	/**
	* @hint Returns an collection of data given an {entityName}
	* @restpath {entityName}/filter
	* @httpmethod GET
	* @entityName.restargsource "Path"
	* @page.restargsource "Query"
	* @pagesize.restargsource "Query"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @example 'https://your-slatwall-instance/rest/resources/collection/account/filter?f:firstName:eq=Tom returns all account where firstname is Tom.'
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function filter(required string entityName, string page, string pageSize ) {
		//Check that the user is authenticated through one of the authentication processes.
		if (!isAuthenticated()){
			pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
		
		var queryData = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("get#arguments.entityName#CollectionList");
	    
	    //This is needed to pull all of the filters and ranges from the url.
	    queryData.applyData();
	    
	    //Page
	    if (isDefined("arguments.page")){
	    	queryData.setPageRecordsStart(arguments.page);
	    }else{
	    	arguments.page = 1;
	    }
	    
	    //Pagesize
	    if (isDefined("arguments.pageSize")){
	    	queryData.setPageRecordsShow(arguments.pageSize);
	    }else{
	    	arguments.pageSize = 10;
	    }
	    
	    //All records
	    if (lcase(arguments.pageSize) == "all"){
	    	var collection_ = queryData.getRecords();
	    }else{
	    	var collection_ = queryData.getPageRecords();
	    }
	    
	    var response = {
	        'status' : 200,
	        'content' : {},
	        "filtered_list": collection_,
	        'headers' : {}
	    };
	    
	    //Query Meta
	    response['content']['resultsTotal'] = queryData.getRecordsCount();
	    response['content']['pagesTotal'] 	= queryData.getTotalPages();
	    response['content']['currentPage'] 	= queryData.getPageRecordsStart();
	    response['content']['recordsPerPage'] = queryData.getPageRecordsShow();
	     
	    // Media - Should contain all of the links/locations possible for the api user. 
	    response['headers']['location']  = "/collection/#arguments.entityName#";
	    pc = getPageContext().getResponse();
		
		pc.addHeader("location", "/collection/#arguments.entityName#");
		pc.addHeader("link", "rel='self' href='/collection/#arguments.entityName#'");
		pc.addHeader("link", "rel='get#arguments.entityName#By#arguments.entityName#ID' href='/collection/#arguments.entityName#/{id}'");
		pc.addHeader("link", "rel='collections' href='/collection/#arguments.entityName#/{id}'");
		
		//Add basic links.
		response['links'] = [];
		
		//Set the next page
		if (queryData.getPageRecordsStart() < queryData.getTotalPages()){
			response['links'] = addLink(response['links'], "next_page", "/collection/#arguments.entityName#/?page=#queryData.getPageRecordsStart() + 1#");
		}
		
		response['links'] = addLink(response['links'], "self", "/collection/#arguments.entityName#/?page=#arguments.page#&pageSize=#arguments.pageSize#");
		
		
		//Set the previous page
		if (queryData.getPageRecordsStart() > 1){
			response['links'] = addLink(response['links'], "previous_page", "/collection/#arguments.entityName#/?page=#queryData.getPageRecordsStart() - 1#");
		}
		
		response['links'] = addLink(response['links'], "show_25", "/collection/#arguments.entityName#/?page=#queryData.getPageRecordsStart()#&pageSize=25");
		response['links'] = addLink(response['links'], "show_50", "/collection/#arguments.entityName#/?page=#queryData.getPageRecordsStart()#&pageSize=50");
	    response['links'] = addLink(response['links'], "show_100", "/collection/#arguments.entityName#/?page=#queryData.getPageRecordsStart()#&pageSize=100");
	    response['links'] = addLink(response['links'], "show_all", "/collection/#arguments.entityName#/?page=#queryData.getPageRecordsStart()#&pageSize=all");
	    response['links'] = addLink(response['links'], "last", "/collection/#arguments.entityName#/?page=#queryData.getRecordsCount()#&pageSize=15");
	    
	    
	    //Add filter links.
	    
	    //Add collection links (other related entities)
	    
	    //Show Authorization links.
	    
	    return response;
	}
	
	/**
	* @hint Returns an location that contains the created entity. Expects a form variable called entity with json a string of json data.
	* @restpath {entityName}
	* @httpmethod POST
	* @entityName.restargsource "Path"
	* @entity.restargsource "Form"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @example POST https://your-slatwall-instance/rest/resources/collection/account/
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function createEntity( required string entityName, required string entity ) {
		//Check that the user is authenticated through one of the authentication processes.
		if (!isAuthenticated()){
			var pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
		
		var response = {
	        'status' : 201,
	        "location": "",
	        'errors' : ""
	    };
	    
		var restData = {};
		
		if (!isNull(entity)){
			restData = deserializeJson(entity);
			restData['createAuthenticationFlag'] = true;
		}
		
		var entityObj = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("new#arguments.entityName#");
		
		if (isNull(entityObj)){
			response.errors = listAppend(response.errors, "Entity not recognized!");
		}
		/**
		* Which rest resources map to processes? What is actually being created in the database?
		* Action: CreateAccount => Entity: Account (create)
		* Action: Login			=> Entity: Session (create/update)
		* Action: AddOrderItem  => Entity: OrderItem (create) => Order (update)
		* Action: PlaceOrder	=> Entity: OrderFulfillment (create)
		*/
	    try{
	    	//try to use a process for this creation if a process exists.
	    	var process = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("process#arguments.entityName#", {1=entityObj, 2=restData, 3="create"});
	    	//check errors
	    	if (entityObj.hasErrors()){
	    		for (var errorName in entityObj.getErrors()){
	    			var errorByErrorName = errorName;
	    		}
	    		//now its just 'create';
	    		var en = entityObj.getErrors()[errorByErrorName][1];
	    		var erroringObj = entityObj.getProcessObjects()[en];//should
	    		
	    		for (var errorObjError in erroringObj.getErrors()){
	    			response.errors = listAppend(response.errors, "#errorObjError#:'#erroringObj.getErrors()[errorObjError][1]#'");
	    		}
	    		
	    		response.status = "500";
	    	}else{
	    		//save it and return the location.
	    		var savedEntity = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("save#arguments.entityName#", {1=entityObj});
	    		
	    		//success!
	    		pc = getPageContext().getResponse();
	    		var id = entityObj.invokeMethod('get#arguments.entityName#ID');
				pc.addHeader("location", "/collection/#arguments.entityName#/#id#");
				response.location = "/collection/#arguments.entityName#/#id#";
				pc.setStatus(201);
	    	}
	    }catch(any e){
	    	//If there is no process, then populate manually
	    	response.errors = listAppend(response.errors, "The server could not complete this request.");
	    }
	    
	    return response;
	}
	
	/** PRIVATE helper function */
	private array function addLink(array links, string rel, string href){
		var link = {"rel": rel, "href": href};
		arrayAppend(links, link);
		return links;
	}
	
   /** 
	* Returns true if the API user is authenticated against this API
	*/
	private boolean function isAuthenticated(){
		var headers = getHttpRequestData().headers;
		var auth = headers["Authorization"];
		
		if (isNull(auth)){
			return false;
		}
		
		var authToken = "";
		
		
		authTokenEncoded = listLast(auth, " "); //removes the basic 
		authTokenString = toString(toBinary( authTokenEncoded ));
		var accessKey = authTokenString.split(":")[1]; //Public Key
		var accessKeySecret = authTokenString.split(":")[2]; //Secret Key
		
		if (isNull(accessKey) || isNull(accessKeySecret)){
			return false;
		}
		
		var account = getHibachiScope().getService("AccountService").getAccountByAccessKeyAndSecret(accessKey, accessKeySecret);
		
		//Lookup that the secret key is valid.
		if (isNull(account)){
			return false;
		}
		
		//Authorized
		return true;
	}
	
}
