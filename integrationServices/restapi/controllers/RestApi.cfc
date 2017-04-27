component rest="true" restpath="/accounts" {
   /**
    * Returns all accounts in Slatwall
    * @httpmethod GET
    * @restpath /
    * @produces application/JSON
    * @returnType void
    */
    remote function getAccount() {
   		var accountQuery = new Query();
	    accountQuery.setSQL("select * from SwAccount");
	    accountQuery.setDataSource("Slatwall-Feature");
	    var results = accountQuery.execute();
	    var response = {
	        status: 200,
	        content: serializeJson({"accounts":results}, true),
	        headers: {location:{}}
	    };
	    // media - should contain all of the locations possible for the api user. 
	    response.headers.location['accounts'] = "/accounts/";
	    response.headers.location['account'] = "/accounts/id/{accountID}/";
	    restSetResponse(response);
	}
	
	
   /**
    * Returns an account given an accountID
    * @httpmethod POST
    * @restpath /id/
    * @access remote
    * @returnType void
    */
    function getAccountByAccountID() {
	    var accountQuery = new Query();
	    accountQuery.setSQL("select * from SwAccount where accountID = '#url.accountID#'");
	    accountQuery.setDataSource("Slatwall-Feature");
	    var results = accountQuery.execute();
	    var response = {
	        status: 201,
	        content: serializeJson({"accounts":results}, true),
	        headers: {location:{}}
	    };
	    // media - should contain all of the locations possible for the api user. 
	    response.headers.location['accounts'] = "/accounts/";
	    response.headers.location['account'] = "/accounts/id/{accountID}/";
	    restSetResponse(response);
	}
}