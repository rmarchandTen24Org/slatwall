/* @description This resource is accessed using something like: http://localhost:8500/rest/resource/collection/sku.json?page=1&pageSize=50 - application/x-collection+json 
 * This URL assumes that the admin has created a REST mapping called /resource ether in the application or CF/Lucee Admin. The
 * mapping should map to the /microservice directory. Any method annotated using @authenticated required a Authorization header is
 * passed in to the request with a Basic Authentication value. For example Authorization: Basic MUEzQzc2MUZEQURFQ0RGNkQxNkYzQTU0MjFEODBCMDQ5NDM0MTA1RjpOemt4T0RBMk1EVkVOVEF4T0VaRlJqQTRNVGM1TVRaQk5VTkZOekJFUWpFd1FURkNRekkwTVE9PQ==
 * would authenticate the user that has the access-key:access-key-secret given by the hash: MUEzQzc2MUZEQURFQ0RGNkQxNkYzQTU0MjFEODBCMDQ5NDM0MTA1RjpOemt4T0RBMk1EVkVOVEF4T0VaRlJqQTRNVGM1TVRaQk5VTkZOekJFUWpFd1FURkNRekkwTVE9PQ==
 * The access key and secret can be generated from a non-admin account detail (in the actions dropdown) in the Slatwall Admin. By using
 * a non-admin account, this forces the user to be assigned a permission-group which limits the API user to only the required data / actions.
 */
component extends="Slatwall.org.Hibachi.HibachiController" output="false" accessors="true" rest="true" restpath="/collection"   {
	
	this.publicMethods="";
	this.publicMethods = listAppend(this.publicMethods, "list");
	this.publicMethods = listAppend(this.publicMethods, "detail");
	this.publicMethods = listAppend(this.publicMethods, "filter");
	this.publicMethods = listAppend(this.publicMethods, "meta");
	this.publicMethods = listAppend(this.publicMethods, "findBy");
	this.publicMethods = listAppend(this.publicMethods, "validations");
	this.secureMethods="";
	
	// ======================== Admin Integration Methods
	public void function default() {
		// Do Nothing
	}
	
	/**
	* @hint Returns an collection of entities given an {entityName}
	* @restpath {entityName}
	* @httpmethod GET
	* @entityName.restargsource "Path"
	* @page.restargsource "Query"
	* @pagesize.restargsource "Query"
	* @fields.restargsource "Query"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function list(required string entityName, string page, string pageSize, string fields ) {
		
		authenticate();
	
		//Get the list
		try{
			var queryData = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("get#arguments.entityName#CollectionList");
		    
		    //Extra Fields
		    if (isDefined("arguments.fields")){
		    	queryData.setDisplayProperties(fields);
		    }
		    
		    //Pagesize
		    if (isDefined("arguments.pageSize")){
		    	queryData.setPageRecordsShow(arguments.pageSize);
		    }else{
		    	arguments.pageSize = 10;
		    }
		    
		    //Page
		    if (isDefined("arguments.page")){
		    	queryData.setPageRecordsStart(arguments.page);	
		    	queryData.setCurrentPageDeclaration(arguments.page);
		    }else{
		    	arguments.page = 1;
		    	queryData.setPageRecordsStart(arguments.page);
		    }
		    
		    var collection_ = queryData.getPageRecords();
		    
		    var lastPage = int(queryData.getRecordsCount() / arguments.pageSize);
		    
		    //Make sure we have not passed the last page.
		    if (arguments.page > lastPage){
		    	pc = getPageContext().getResponse();
		    	pc.sendError(404, "Not Found");
		    }
		    var response = {
		        "list": collection_,
		        "recordCount": arrayLen(collection_),
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
		    response['links'] = addLink(response['links'], "last", "#CGI.SERVER_NAME##CGI.PATH_INFO#?page=#lastPage#");
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
	    }
	    return response;
	}
	
   /**
	* @hint Returns entity meta data given an {entityName}
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
		authenticate();
	
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
	* @hint Returns entity validation rules given an {entityName}
	* @restpath {entityName}/validations
	* @httpmethod GET
	* @entityName.restargsource "Path"
	* @entityID.restargsource "Path"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function validations(required string entityName) {
		
		authenticate();
	
		var response = {
	        "validation" = {}
	    };
	    try{
		    var validation = getHibachiScope().getService("HibachiValidationService").getCoreValidation("#arguments.entityName#");
		    response.validation = validation;
		    
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
		
		authenticate();
		
	    var response = {
	        'detail' = {}
	    };
	    
		try{
			
			var queryData = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("get#arguments.entityName#CollectionList");
		    queryData.addFilter("#arguments.entityName#ID", arguments.entityID,"=");
		    
		    response.detail = queryData.getRecords();
		    
		    //Example using the collection wrapper.
		    /*queryData.addDisplayProperty("primaryEmailAddress.accountEmailAddressID");
		    queryData.addDisplayProperty("primaryEmailAddress.emailAddress");
		    
		    response['detail'] = queryData.getRecords();
		    
		    //Test the collection proxy. The proxy turns the collection row into a traversable object.
	    	var account = new CollectionProxy(queryData.getRecords()[1]);
	    	var response['Name'] = account.getFirstName() & " " & account.getLastName();
	    	var response['Email'] = account.getPrimaryEmailAddress().getEmailAddress();
	    	var response['AccountEmailAddressID'] = account.getPrimaryEmailAddress().getAccountEmailAddressID();
	    	var response['Email2'] = account.getPrimaryEmailAddress().getEmailAddress();
	    	var response['Name2'] = account.getFirstName() & " " & account.getLastName();*/
	    
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
		
		authenticate();
		
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
	* @hint Returns an location that contains the created entity. Expects a form variable called entity with a string of json data.
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
	function create( required string entityName, required string entity ) {
		
		authenticate();
	
		var response = {
	        'status' : 201,
	        "location": "",
	        'errors' : ""
	    };
	    
		var restData = {};
		
		if (!isNull(entity)){
			restData = deserializeJson(entity);
		}
		
		var entityObj = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("new#arguments.entityName#");
		
		if (isNull(entityObj)){
			response.errors = listAppend(response.errors, "Entity not recognized!");
		}
		
	    try{
	    	
    		//save it and return the location.
    		var savedEntity = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("save#arguments.entityName#", {1=entityObj, 2=restData});
    		
    		//success!
    		pc = getPageContext().getResponse();
    		var id = entityObj.invokeMethod('get#arguments.entityName#ID');
			pc.addHeader("location", "/collection/#arguments.entityName#/#id#");
			response.location = "/collection/#arguments.entityName#/#id#";
			pc.setStatus(201);
	    	
	    }catch(any e){
	    	//If there is no process, then populate manually
	    	response.errors = listAppend(response.errors, "The server could not complete this request.");
	    }
	    
	    return response;
	}
	
   /**
	* @hint Returns an URI of the created entity. Expects a form variable called entity with a string of json data. Creates or REPLACES the existing resource.
	* @restpath {entityName}
	* @httpmethod PUT
	* @entityName.restargsource "Path"
	* @entity.restargsource "Form"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @example POST https://your-slatwall-instance/rest/resources/collection/account/
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function update( required string entityName, required string entity ) {
		
		authenticate();
	
		var response = {
	        'status' : 201,
	        "location": "",
	        'errors' : ""
	    };
	    
		var restData = {};
		
		if (!isNull(entity)){
			restData = deserializeJson(entity);
		}
		
		//The PUT method requests that the enclosed entity be stored under the supplied Request-URI . 
		//If the Request-URI refers to an already existing resource, the enclosed entity 
		//SHOULD be considered as a modified version of the one residing on the origin. 
		
	    try{
			//If there is no ID provided, we are creating with this put.
			if (isNull(restData['#arguments.entityName#ID'])){
				var entityObj = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("new#arguments.entityName#");
			}
			
			//If there is an ID, we are updating
			if (!isNull(restData['#arguments.entityName#ID'])){
				var entityObj = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("get#arguments.entityName#By#arguments.entityName#ID", {1=restData['#entityName#ID']});
			}
		
    		//save it and return the location.
    		var savedEntity = getHibachiScope().getService("#arguments.entityName#Service").invokeMethod("save#arguments.entityName#", {1=entityObj, 2=restData});
    		
    		//success!
    		pc = getPageContext().getResponse();
    		var id = entityObj.invokeMethod('get#arguments.entityName#ID');
			pc.addHeader("location", "/collection/#arguments.entityName#/#id#");
			response.location = "/collection/#arguments.entityName#/#id#";
			pc.setStatus(201);
	    	
	    }catch(any e){
	    	//If there is no process, then populate manually
	    	response.errors = listAppend(response.errors, "The server could not complete this request.");
	    }
	    
	    return response;
	}
	
	/*--------------------------------------------------------------------------*/
	/** PRIVATE helper function */
	private array function addLink(array links, string rel, string href){
		var link = {"rel": rel, "href": href};
		arrayAppend(links, link);
		return links;
	}
	
	/** Given a page context, authenticates a user. */
	public void function authenticate( ){
		if (!isAuthenticated()){
			var pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
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
