component rest="true" restpath="/accounts" {
    /**
    * Returns an account given an accountID
    */
    remote void function getAccount() httpmethod="get" produces="application/JSON" {
	    if (!isNull(url.accountID)){
		    var accountQuery = new Query();
		    accountQuery.setSQL("select * from SwAccount where accountID = '#url.accountID#'");
		    accountQuery.setDataSource("Slatwall-Feature");
		    var results = accountQuery.execute();
		    var response = {
		        status: 200,
		        content: serializeJson({"accounts":results}, true),
		        headers: {}
		    };
		    
	    }else{
	    	var accountQuery = new Query();
		    accountQuery.setSQL("select * from SwAccount");
		    accountQuery.setDataSource("Slatwall-Feature");
		    var results = accountQuery.execute();
		    var response = {
		        status: 200,
		        content: serializeJson({"accounts":results}, true),
		        headers: {}
		    };
	    }
	    // media - should contain all of the locations possible for the api user. 
	    response.headers.location = "/accounts/#url.accountID#/";
	    restSetResponse(response);
	}
}