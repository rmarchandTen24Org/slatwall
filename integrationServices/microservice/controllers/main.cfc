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
component extends="Slatwall.org.Hibachi.HibachiController"  output="false" accessors="true" rest="true" restpath="/account"   {

	property name="accountService" type="any";
	property name="integrationService" type="any";

	this.publicMethods="";
	this.publicMethods = listAppend(this.publicMethods, "getAccounts");
	
	this.secureMethods="";
	
	// ======================== Admin Integration Methods
	public void function default() {
		// Do Nothing
	}
	
	/**
	* @hint Returns all Slatwall Accounts
	* @httpmethod GET
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	*/
	function getAccounts() {
		var accountQuery = new Query();
	    accountQuery.setSQL("select * from SwAccount");
	    accountQuery.setDataSource("Slatwall-Feature");
	    var results = accountQuery.execute();
	    if (!isNull(results)){
		    var response = {
		        'status' =  200,
		        'content' = results.getResult(),
		        'headers' = {}
		    };
	    }
	    // media - should contain all of the locations possible for the api user. 
	    response.headers['location'] = "/accounts/";
	    //Add links.
	    response.headers['link'] = [];
	    response.headers['link'] = addLink(response.headers['link'], "here","/account/");
	    response.headers['link'] = addLink(response.headers['link'], "account","/account/{id}");
	    //pc = getPageContext().getResponse();
		//pc.addHeader("link", "rel:here href:/account/");
		//pc.addHeader("link", "rel:accounts href:/account/{id}");
	    //Create the struct response.
	    response = {"accounts": response};
	    return response;
	}
	
	/**
	* @hint Returns an account given an {id}
	* @restpath {id}
	* @httpmethod GET
	* @returnType struct
	* @access remote
	* @produces application/json,application/xml
	*/
	function getAccount(required string id restargsource="Path") {
		var accountQuery = new Query();
	    accountQuery.setSQL("select * from SwAccount WHERE accountID = '#arguments.id#'");
	    accountQuery.setDataSource("Slatwall-Feature");
	    var results = accountQuery.execute();
	    
	    var response = {
	        status =  200,
	        content = results.getResult(),
	        headers = {}
	    };
	    
	    // media - should contain all of the locations possible for the api user. 
	    response.headers['location']  = "/accounts/#arguments.id#/";
	    
	    //Add links.
	    response.headers['link'] = [];
	    response.headers['link'] = addLink(response.headers['link'], "here", "/account/#arguments.id#");
	    response.headers['link'] = addLink(response.headers['link'], "accounts", "/account/");
	    
	    return response;
	}
	
	/** PRIVATE helper function */
	private array function addLink(array links, string rel, string href){
		var link = {"rel": rel, "href": href};
		arrayAppend(links, link);
		return links;
	}
	
}
