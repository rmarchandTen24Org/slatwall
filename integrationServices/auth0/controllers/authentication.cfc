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
component extends="Slatwall.org.Hibachi.HibachiController" output="false" accessors="true"  {

	property name="Auth0Service" type="any";
	property name="fw" type="any";

	public void function init(required any fw){
		setAuth0Service(getService('Auth0Service'));
		setFW(arguments.fw);
	};

	//this.secureMethods="default,updateviews";
	this.secureMethods='';
	
	/** Called by auth0 lock widget. Receives a code, uses that code to get an auth0 access token, uses access token to log in to or create a Slatwall account. */
	public void function submit(required any rc) {
		var authResponse = getAuth0Service().submit(rc);

		if(structKeyExists(authResponse, 'access_token')){
			getAuth0Service().processToken(authResponse.access_token,true);
			if(structKeyExists(rc, 'state')){
				getFW().redirectExact('/?slatAction=#rc.state#');	
			}
			getFW().redirectExact('/');
		}else{
			writeDump(authResponse);abort;
		}
	}

	/** Takes auth0 access token, returns slatwall JWT to be included in header for subsequent requests*/
	public string function login(required any rc) {
		param name="rc.ajaxResponse.content" default="#structNew()#";
		rc['ajaxRequest'] = true;

		var token = getAuth0Service().processToken(rc.access_token,false);
		if(left(token,5) == "Error"){
			addErrors(rc,right(token,len(token)-7));
		}else{
			rc.apiResponse.content['Auth-Token']=token;
		}
	}

	/** Takes account info and auth0 access token. Creates a Slatwall account and links it to the auth0 account attached to the token. */
	public void function createAccount(required any rc){
		param name="rc.ajaxResponse.content" default="#structNew()#";
		rc['ajaxRequest'] = true;

		if(!structKeyExists(rc, 'access_token')){
			addErrors(rc, "Auth0 Access Token is required.");
			return;
		}

		var auth0Profile = getAuth0Service().getAuth0UserProfile(rc.access_token);

		if(isSimpleValue(auth0Profile)){
			addErrors(rc, auth0Profile);
			return;
		}

		var slatwallAccount = getAuth0Service().getSlatwallAccount(auth0Profile);

		if(!isNull(slatwallAccount)){
			addErrors(rc, "Account already exists in Slatwall.");
		}

		slatwallAccount = getService('AccountService').processAccount( getHibachiScope().getAccount(), arguments.rc, 'create');
		slatwallAccount.setAuth0Account(getAuth0Service().createAuth0AccountEntity(auth0Profile.sub));

		getService('AccountService').saveAccount(slatwallAccount);

        getHibachiScope().addActionResult( "auth0:authentication.createAccount", slatwallAccount.hasErrors() );
        if(slatwallAccount.hasErrors()){
            addErrors(rc, getHibachiScope().getAccount().getProcessObject("create").getErrors());
        }else{
        	getHibachiScope().flushOrmSession();
        }
	}

	public any function addErrors( required struct data , errors){
        
        if (!structKeyExists(arguments.data, "ajaxResponse")){
            arguments.data["ajaxResponse"] = {};
        }
        
        if (!structKeyExists(arguments.data.ajaxResponse, "errors")){
            arguments.data.ajaxResponse["errors"] = {};
        }
        arguments.data.ajaxResponse["errors"] = errors;
    } 
	
}
