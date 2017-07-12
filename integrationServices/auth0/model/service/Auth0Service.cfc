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
component extends="Slatwall.model.service.HibachiService" persistent="false" accessors="true" output="false" {

	property name="fw" type="any";
	property name="integration" type="any";
	property name="integrationService" type="any";
	property name="settingService" type="any";
	property name="resources" type="any";
	property name="client_name" type="string";
	property name="client_id" type="string";
	property name="client_secret" type="string";
	property name="userDBConnection" type="string";
	property name="requestBeanPath" default="Slatwall.integrationServices.auth0.model.transient.Auth0RequestBean";
	property name="auth0IntegrationID" type="string";
	property name="managementToken" type="any";
	property name="customMappings" type="any";

	public any function init(){
		variables.mappingFilePath = expandPath('/Slatwall')&'/integrationServices/auth0/config/mappings/';
		variables.customMappingFilePath = expandPath('/Slatwall')&'/custom/integrationServices/auth0/config/mappings/';
		variables.mappingFileName = 'auth0Mappings.json';

		setIntegrationService(getService('integrationService'));
		setIntegration(getIntegrationService().getIntegrationByIntegrationPackage('auth0'));
		setClient_name(getIntegration().setting('client_name'));
		setClient_id(getIntegration().setting('client_id'));
		setClient_secret(getIntegration().setting('client_secret'));
		setUserDBConnection(getIntegration().setting('userDBConnection'));
		return this;
	}

	public any function getCustomMappings(){
		if(!structKeyExists(variables,'customMappings')){
			//insert custom properties based on existing mappings
			if(!directoryExists(variables.customMappingFilePath)){
				directoryCreate(variables.customMappingFilePath);
			}
			if(!fileExists(variables.customMappingFilePath&variables.mappingFileName)){
				fileCopy(variables.mappingFilePath&variables.mappingFileName,variables.customMappingFilePath&variables.mappingFileName);
			}
			variables.customMappings = deserializeJson(fileRead(variables.customMappingFilePath&variables.mappingFileName));
		}
		return variables.customMappings;
	}

	public any function submit(required any rc){

		var requestBean = newRequestBean('POST', 'https://#getAuthDomain()#/oauth/token', false);

		var body = {
			client_id=getClient_id(),
			client_secret=getClient_secret(),
			grant_type='authorization_code',
			redirect_uri=getRedirectUri(),
			code: rc.code
		};
		
		var bodyStr = structToUrlEncoded(body);

		requestBean.setContentType('application/x-www-form-urlencoded');
		requestBean.setAccept('application/json');
		requestBean.setBody(bodyStr);

		var responseBean = requestBean.getResponseBean();
		var data = responseBean.getData();
		return data;
	}

	//return string JWT
	public string function processToken(required string accessToken, boolean login=false){
		var userProfile = getAuth0UserProfile(arguments.accessToken);
		if(isSimpleValue(userProfile)){
			return "Error: "&userProfile;
		}
		var slatwallAccount = getSlatwallAccount(userProfile);
		if(isNull(slatwallAccount)){
			slatwallAccount = createAccountFromAuth0Account(userProfile);
		}else{
			if(!slatwallAccount.hasAuth0Entity()){
				slatwallAccount.setAuth0Account(createAuth0AccountEntity(userProfile.sub));
			}
		}
		if(arguments.login==true){
			var accountAuthentication = getAccountAuthentication(slatwallAccount);
			accountAuthentication.setIntegrationAccessToken(accessToken);
			this.saveAccountAuthentication(accountAuthentication);
		}

		getHibachiDao().flushORMSession();

		if(arguments.login==true){
			getService('hibachiEventService').announceEvent('Auth0_BeforeAccountLogin');
			getService("hibachiSessionService").loginAccount(account=slatwallAccount, accountAuthentication=accountAuthentication);
			getService('hibachiEventService').announceEvent('Auth0_AccountLogin');
			addAuthenticationToSession(accessToken);
		}
		return getService('HibachiJWTService').createToken();
	}

	public void function logout(required any urlString){
		//fix this
		location(url='#getAuthURL()#v2/logout?client_id=#getClient_id()#&returnTo=#listFirst(arguments.urlString,'?')#');
	}

	public void function addAuthenticationToSession(accessToken){
		session['auth0'] = {
			accessToken=accessToken
		};
	}

	public any function getAccountAuthentication(required any account){
		var accountAuth = ormExecuteQuery("SELECT aa FROM SlatwallAccountAuthentication aa WHERE aa.integration.integrationID = ? AND aa.account.accountID = ?", [getAuth0IntegrationID(), account.getAccountID()], true);
		if(isNull(accountAuth)){
			accountAuth = this.newAccountAuthentication();
			accountAuth.setAccount(account);
			accountAuth.setIntegrationAccountID(account.getAuth0Account().getRemoteID());
			accountAuth.setIntegration(getIntegration());
		}
		return accountAuth;
	}

	public any function createAccountFromAuth0Account(required any userProfile){

		var slatwallAccount = this.newAccount();
		var primaryEmail = this.newAccountEmailAddress();

		getService('hibachiEventService').announceEvent('Auth0_BeforeCreateAccount');

		primaryEmail.setEmailAddress(userProfile.email);

		slatwallAccount.setPrimaryEmailAddress(primaryEmail);
		slatwallAccount.setAuth0Account(createAuth0AccountEntity(userProfile.sub));
		slatwallAccount.setFirstName('Unknown');
		slatwallAccount.setLastName('Unknown');
		if(structKeyExists(userProfile, 'name')){
			slatwallAccount.setFirstName(listFirst(userProfile.name, ' '));
			slatwallAccount.setLastName(listLast(userProfile.name, ' '));
		}
		if(structKeyExists(userProfile, 'given_name')){
			slatwallAccount.setFirstName(userProfile.given_name);
		}else if(structKeyExists(userProfile, 'nickname')){
			slatwallAccount.setFirstName(userProfile.nickname);
		}
		if(structKeyExists(userProfile, 'family_name')){
			slatwallAccount.setLastName(userProfile.family_name);
		}

		slatwallAccount = this.saveAccount(slatwallAccount);
		if(slatwallAccount.hasErrors()){
			getService('hibachiEventService').announceEvent('Auth0_CreateAccountFailure', {errors=slatwallAccount.getErrors()});
		}else{
			getHibachiDao().flushORMSession();
			getService('hibachiEventService').announceEvent('Auth0_CreateAccountSuccess', slatwallAccount);
			return slatwallAccount;
		}
		
	}

	public any function createAuth0AccountEntity(auth0ID){
		var remoteEntity = this.newRemoteEntity();
		remoteEntity.setRemoteID(auth0ID);
		remoteEntity.setIntegration(getIntegration());
		this.saveRemoteEntity(remoteEntity);
		return remoteEntity;
	}

	public any function getAuth0UserProfile(required string accessToken){
		var profileRequest = newRequestBean('GET', '#getAuthDomain()#/userinfo', false);
		profileRequest.setAuthToken(arguments.accessToken);
		return profileRequest.getResponseBean().getData();
	}

	public any function getSlatwallAccount(required any auth0Profile){
		var auth0ID = arguments.auth0Profile.sub;
		var profile = ORMExecuteQuery("SELECT a FROM SlatwallAccount AS a WHERE a.auth0Account.remoteID = :auth0ID", {auth0ID=auth0ID}, true);
		if(!isNull(profile)){
			return profile;
		}else{
			//Find profile by primary email address
			var email = arguments.auth0Profile.email;
			profile = ORMExecuteQuery("SELECT a FROM SlatwallAccount AS a INNER JOIN FETCH a.primaryEmailAddress AS e WHERE e.emailAddress = :email", {email=email},true);
			//If profile exists and has no auth0Entity (since we've already checked for matching accountID) return it, else return undefined
			if(!isNull(profile) && !profile.hasAuth0Entity()){
				return profile;
			}
			return;
		}
	}

	public any function getSRedirectAction(required any request){
		if(structKeyExists(request, 'context') && structKeyExists(request.context, 'sRedirectURL')){
			var queryString = listLast(request.context.sRedirectURL, '?');
			if(left(queryString,10) == 'slatAction'){
				replace(queryString,'&reload=true','');
				replace(queryString,'&update=true','');
				return right(queryString, len(queryString)-11);
			}
		}
		return '';
	}

	public any function getManagementToken(){
		if(!structKeyExists(variables, 'managementToken') || isNull(variables.managementToken) || !structKeyExists(variables.managementToken, 'token') || variables.managementToken.expires < now()){
	        var domain = getAuthURL();
	        var audience = domain & 'api/v2/';

	        var data = serializeJSON({
	            'grant_type'='client_credentials',
	            'client_id'=getClient_ID(),
	            'client_secret'=getClient_secret(),
	            'audience'=audience
	        });

	        var requestBean = newRequestBean('POST', domain & 'oauth/token', false);
	        requestBean.setBody(data);

	        var management = requestBean.getResponseBean().getData();
	        if(structKeyExists(management, 'access_token')){
		        variables.managementToken = {
		        	token=management.access_token,
		        	expires=dateAdd('s',management.expires_in,now())
		        };
		    }else{
		    	try{
		    		logHibachi('Auth0 - Unable to get access token - Status Code #management.statusCode#, #management.message#',true);
		    		}catch(any e){
		    			writeDump(management);
		    			writeDump(requestBean);
		    			writeDump(e);
		    			abort;
		    		}
		    }
		}
		return variables.managementToken;
	}

	public void function createAuth0User(required any entity, required any data){
	 	var domain = getAuthURL();
        var audience = domain & 'api/v2';

        var user = {
            'given_name'=data.firstName,
            'family_name'=data.lastName,
            'name'='#data.firstName# #data.lastName#',
            'email'=data.emailaddress,
            'password'=data.password,
            'connection'=getUserDBConnection()
        };

        if(structKeyExists(data, 'company')){
			user['user_metadata'] = {
            	'company'=data.company
        	};
        }

        var requestBean = newRequestBean('POST', domain & 'api/v2/users', true);
        requestBean.setBody(serializeJson(user));
        var responseBean = requestBean.getResponseBean();

        if(left(responseBean.getStatusCode(),3) == '201'){
            entity.setAuth0Account(createAuth0AccountEntity(responseBean.getData().user_id));
            this.saveAccount(entity);
        }else{
            logHibachi('Error creating user in Auth0 - status code #responseBean.getData().statusCode#, #responseBean.getData().message#',true);
        }
	}

	public void function updateAuth0User(required string auth0ID, required any data){
		var requestBean = newRequestBean('PATCH', '#getAuthURL()#api/v2/users/#urlEncodedFormat(arguments.auth0ID)#', true);
		data['connection'] = getUserDBConnection();
		data['client_id'] = getClient_id();
		requestBean.setBody(serializeJSON(data));
		var responseBean = requestBean.getResponseBean();
		if(isNull(responseBean.statusCode) || left(responseBean.statusCode,3) != 200){
			logHibachi('Error updating Auth0 user profile for user #arguments.auth0ID#');
		}
	}

	public void function deleteAuth0User(required any account){
		var requestBean = newRequestBean('DELETE', '#getAuthURL()#api/v2/users/#urlEncodedFormat(account.getAuth0Account().getRemoteID())#', true);
		requestBean.getResponseBean();
	}

	/** Helper methods */
	public string function getAuthDomain(){
		return '#getClient_name()#.auth0.com/';
	}

	public string function getAuthURL(){
		return 'https://#getAuthDomain()#';
	}

	public string function structToUrlEncoded(required struct body){
		var bodyStr = '';
		for(var key in body){
			if(len(bodyStr)){
				bodyStr &= '&';
			}
			bodyStr &= lcase(key)&'='&urlEncodedFormat(body[key]);
		}
		return bodyStr;
	}

	public string function getRedirectUri(){

		return '#((CGI['HTTPS'] eq 'off') || (!len(CGI['HTTPS']))) ? 'http' : 'https'#://#getHibachiScope().getCurrentDomain()##(CGI.SERVER_PORT eq 80) ? '' : ':'&CGI.SERVER_PORT#/?slatAction=auth0:authentication.submit';
	}

	public any function newRequestBean(string method, string urlString, boolean mgmtToken){
		var requestBean = createObject('component',"#getRequestBeanPath()#");
		if(!isNull(arguments.method)){
			requestBean.setMethod(arguments.method);
		}
		if(!isNull(arguments.urlString)){
			requestBean.setURLString(arguments.urlString);
		}
		if(!isNull(arguments.mgmtToken) && arguments.mgmtToken){
			requestBean.setAuthToken(getManagementToken().token);
		}

		requestBean.setContentType("application/json");
		return requestBean;
	}

	public string function getAuth0IntegrationID(){
		if(!structKeyExists(variables, "auth0IntegrationID")){
			var integrationID = ORMExecuteQuery("SELECT integrationID FROM SlatwallIntegration WHERE integrationPackage = :auth0",{auth0='auth0'},true);
			variables.auth0IntegrationID = integrationID;
		}
		return variables.auth0IntegrationID;
	}

}
