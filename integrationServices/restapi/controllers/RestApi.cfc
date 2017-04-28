component rest="true" restpath="/accounts" {

   /**
    * Returns all accounts in Slatwall
    * @httpmethod GET
    */
    remote void function getAccounts() {
   		var accountQuery = new Query();
	    accountQuery.setSQL("select * from SwAccount");
	    accountQuery.setDataSource("Slatwall-Feature");
	    var results = accountQuery.execute().getResult();
	    var response = {
	        status: 200,
	        content: serializeJson({"accounts":results}),
	        headers: {location:{}}
	    };
	    // media - should contain all of the locations possible for the api user. 
	    response.headers.location = "/accounts/";
	    restSetResponse(response);
	}
}