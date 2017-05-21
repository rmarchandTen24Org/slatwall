component extends="Slatwall.org.Hibachi.HibachiController" output="false" accessors="true" rest="true" restpath="/dispatcher"   {
	
	this.publicMethods="";
	this.publicMethods = listAppend(this.publicMethods, "get");
	this.secureMethods="";
	
	// ======================== Admin Integration Methods
	public void function default() {
		// Do Nothing
	}
	
	/**
	* @hint The service dispatcher allows access to the processMethods in a service.
	* @restpath /service/{serviceName}/{serviceMethod}
	* @httpmethod POST
	* @serviceName.restargsource "Path"
	* @serviceMethod.restargsource "Path"
	* @args.restargsource "Form"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function getServiceResponse(required string serviceName, required string serviceMethod, string args ) {
		//Check that the user is authenticated through one of the authentication processes.
		var pc = getPageContext().getResponse();
		if (!isAuthenticated()){
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
		
		//Check the users locale if one is present.
		if (!isNull(getHttpRequestData().headers["Accept-Language"])){
			setLocale(getHttpRequestData().headers["Accept-Language"]);
		}
		
		//User is trying to call getHashedAndSaltedPassword with password and salt in the args
		//so they will have a json object {salt:"someSalt", password: "somePassword"}
		//check if that service method exists.
		if (isNull(getHibachiScope().getService(serviceName))){
			pc = getPageContext().getResponse();
			pc.sendError(404, "Resource does not exist.");
		}
		
		var service = getHibachiScope().getService(serviceName);
		
		//Try to deserialize the args and pass as the argument collection to the service method.
		if (!isNull(args)){
			var argsCollectionData = deserializeJson(args);
			var argsCollection = {};
			var i = 1;
			for (var data in argsCollectionData){
				//if they are passing an id, then we need to turn that id into an object to pass.
				if (right(data, 2) == "ID"){
					var entityName = data.replace("ID", "");
					try{
						var injectedEntity = getHibachiScope().getService(serviceName).invokeMethod("get#entityName#By#entityName#ID", {1=argsCollectionData[data]});
						argsCollection[i] = injectedEntity;
					}catch(any getIdError){
						var response = {
							"error" = getIdError
						};
						return response;
					}
				}else{
					argsCollection[i] = argsCollectionData[data];
				}
				i++;
			}
			var result = service.invokeMethod("#serviceMethod#", argsCollection);
			var response = {
				"content" = result
			};
			return response;
		}else{
			//call without args.
			var result = service.invokeMethod("#serviceMethod#");
			var response = {
				"content" = result
			};
			return response;
		}
	}
	
	/**
	* @hint Returns an collection listing of data given an {entityName}
	* @restpath /dao/{daoName}/{daoMethod}
	* @httpmethod POST
	* @serviceName.restargsource "Path"
	* @serviceMethod.restargsource "Path"
	* @args.restargsource "Form"
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	* @authenticated Requires Basic Authentication using your access-key and access-key-secret as the username and password.
	*/
	function getDaoResponse(required string daoName, required string daoMethod, string args ) {
		//Check that the user is authenticated through one of the authentication processes.
		if (!isAuthenticated()){
			pc = getPageContext().getResponse();
			pc.addHeader("WWW-Authenticate", "Use basic Authentication against this endpoint where the username is your access-key and password is access-key-secret.");
			pc.sendError(401, "Not Authorized.");
		}
	
		if (isNull(getHibachiScope().getDao(daoName))){
			pc = getPageContext().getResponse();
			pc.sendError(404, "Resource does not exist.");
		}
		
		var dao = getHibachiScope().getDao(daoName);
		
		//Try to deserialize the args and pass as the argument collection to the service method.
		if (!isNull(args)){
			var argsCollectionData = deserializeJson(args);
			var argsCollection = {};
			var i = 1;
			for (var data in argsCollectionData){
				argsCollection[i] = data;
				i++;
			}
			var result = dao.invokeMethod("#daoMethod#", argsCollection);
			var response = {
				"content" = result
			};
			return response;
		}else{
			//call without args.
			var result = service.invokeMethod("#daoMethod#");
			var response = {
				"content" = result
			};
			return response;
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
