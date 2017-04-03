<<<<<<< HEAD
=======
/*
    Hibachi
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
	- You must not alter the default display of the Hibachi name or logo from
	  any part of the application
	- Your custom code must not alter or create any files inside Hibachi,
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
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
component output="false" accessors="true" extends="HibachiTransient" {

	property name="account" type="any";
	property name="session" type="any";
<<<<<<< HEAD
=======

	property name="loggedInFlag" type="boolean";
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	property name="loggedInAsAdminFlag" type="boolean";
	property name="publicPopulateFlag" type="boolean";
	property name="persistSessionFlag" type="boolean";
	property name="sessionFoundNPSIDCookieFlag" type="boolean";
	property name="sessionFoundPSIDCookieFlag" type="boolean";
<<<<<<< HEAD
	property name="sessionFoundExtendedPSIDCookieFlag" type="boolean";
	property name="ormHasErrors" type="boolean" default="false";
	property name="rbLocale";
	property name="url" type="string";
	property name="calledActions" type="array";
	property name="failureActions" type="array";
	property name="successfulActions" type="array";
	property name="auditsToCommitStruct" type="struct";
	property name="modifiedEntities" type="array";
	property name="hibachiAuthenticationService" type="any";
	
=======

	property name="ormHasErrors" type="boolean" default="false";
	property name="rbLocale";
	property name="url" type="string";

	property name="calledActions" type="array";
	property name="failureActions" type="array";
	property name="successfulActions" type="array";

	property name="auditsToCommitStruct" type="struct";
	property name="modifiedEntities" type="array";

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public any function init() {
		setORMHasErrors( false );
		setRBLocale( "en_us" );
		setPublicPopulateFlag( false );
		setPersistSessionFlag( true );
		setSessionFoundNPSIDCookieFlag( false );
		setSessionFoundPSIDCookieFlag( false );
<<<<<<< HEAD
		setSessionFoundExtendedPSIDCookieFlag( false );
		setCalledActions( [] );
		setSuccessfulActions( [] );
		setFailureActions( [] );
		setAuditsToCommitStruct( {} );
		setModifiedEntities( [] );
		
		return super.init();
	}
	
	public any function getHibachiAuthenticationService(){
		if(!structKeyExists(variables,'hibachiAuthenticationService')){
			variables.hibachiAuthenticationService = getService('hibachiAuthenticationService');	
		}
		return variables.hibachiAuthenticationService;
	} 
	
	public void function setHibachiAuthenticationService(required any hibachiAuthenticationService){
		variables.hibachiAuthenticationService = arguments.hibachiAuthenticationService;
	}
	
=======

		setCalledActions( [] );
		setSuccessfulActions( [] );
		setFailureActions( [] );

		setAuditsToCommitStruct( {} );
		setModifiedEntities( [] );


		return super.init();
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	// @hint facade method to check the application scope for a value
	public boolean function hasSessionValue(required any key) {
		param name="session" default="#structNew()#";
		if( structKeyExists(session, getHibachiInstanceApplicationScopeKey()) && structKeyExists(session[ getHibachiInstanceApplicationScopeKey() ], arguments.key)) {
			return true;
		}
<<<<<<< HEAD
		
		return false;
	}
	
=======

		return false;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	// @hint facade method to get values from the application scope
	public any function getSessionValue(required any key) {
		if( structKeyExists(session, getHibachiInstanceApplicationScopeKey()) && structKeyExists(session[ getHibachiInstanceApplicationScopeKey() ], arguments.key)) {
			return session[ getHibachiInstanceApplicationScopeKey() ][ arguments.key ];
		}
<<<<<<< HEAD
		
		throw("You have requested a value for '#arguments.key#' from the core application that is not setup.  This may be because the verifyApplicationSetup() method has not been called yet")
	}
	
	// @hint facade method to set values in the application scope 
=======

		throw("You have requested a value for '#arguments.key#' from the core application that is not setup.  This may be because the verifyApplicationSetup() method has not been called yet")
	}

	// @hint facade method to set values in the application scope
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function setSessionValue(required any key, required any value) {
		var sessionKey = "";
		if(structKeyExists(COOKIE, "JSESSIONID")) {
			sessionKey = COOKIE.JSESSIONID;
		} else if (structKeyExists(COOKIE, "CFTOKEN")) {
			sessionKey = COOKIE.CFTOKEN;
		} else if (structKeyExists(COOKIE, "CFID")) {
			sessionKey = COOKIE.CFID;
		}
		lock name="#sessionKey#_#getHibachiInstanceApplicationScopeKey()#_#arguments.key#" timeout="10" {
			if(!structKeyExists(session, getHibachiInstanceApplicationScopeKey())) {
				session[ getHibachiInstanceApplicationScopeKey() ] = {};
			}
			session[ getHibachiInstanceApplicationScopeKey() ][ arguments.key ] = arguments.value;
		}
	}
<<<<<<< HEAD
	
	public string function renderJSObject() {
		var config = getService('HibachiSessionService').getConfig();
=======

	public string function renderJSObject() {
		var config = {};
		config[ 'baseURL' ] = getApplicationValue('baseURL');
		config[ 'action' ] = getApplicationValue('action');
		config[ 'dateFormat' ] = 'mmm dd, yyyy';
		config[ 'timeFormat' ] = 'hh:mm tt';
		config[ 'rbLocale' ] = '#getRBLocale()#';
		config[ 'debugFlag' ] = getApplicationValue('debugFlag');
		config[ 'instantiationKey' ] = '#getApplicationValue('instantiationKey')#';

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		var returnHTML = '';
		returnHTML &= '<script type="text/javascript" src="#getApplicationValue('baseURL')#/org/Hibachi/HibachiAssets/js/hibachi-scope.js"></script>';
		returnHTML &= '<script type="text/javascript">(function( $ ){$.#lcase(getApplicationValue('applicationKey'))# = new Hibachi(#serializeJSON(config)#);})( jQuery );</script>';
		return returnHTML;
	}
<<<<<<< HEAD
	
	public void function addModifiedEntity( required any entity ) {
		arrayAppend(getModifiedEntities(), arguments.entity);
	}
	
	public void function clearModifiedEntities() {
		setModifiedEntities([]);
	}
	
	public void function clearAuditsToCommitStruct() {
		setAuditsToCommitStruct({});
	}
	
	/** This checks if the user is logged in by checking whether or not the user has manually logged out or has timed out.  
	 *  This method should return as it always has. 
	 */
	public boolean function getLoggedInFlag() {
		return getSession().getLoggedInFlag();
	}
	
	/**
	 * Because we are not removing the account from the session, logged in flag needs to
	 * be checked before checking if they are an admin account.
	 */
	public boolean function getLoggedInAsAdminFlag() {
		if(!isNull(getSession()) &&
			getSession().getLoggedInFlag() && 
		   !isNull(getSession().getAccount()) && 
		   !isNull(getSession().getAccount().getAdminAccountFlag()) &&  
			getSession().getAccount().getAdminAccountFlag()) {
				
			return true;
			
		}
		return false;
	}
	
=======

	public void function addModifiedEntity( required any entity ) {
		arrayAppend(getModifiedEntities(), arguments.entity);
	}

	public void function clearModifiedEntities() {
		setModifiedEntities([]);
	}

	public void function clearAuditsToCommitStruct() {
		setAuditsToCommitStruct({});
	}

	public boolean function getLoggedInFlag() {
		if(!getSession().getAccount().getNewFlag()) {
			return true;
		}
		return false;
	}

	public boolean function getLoggedInAsAdminFlag() {
		if(getAccount().getAdminAccountFlag()) {
			return true;
		}
		return false;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public string function getURL() {
		if(!structKeyExists(variables, "url")) {
			variables.url = getPageContext().getRequest().GetRequestUrl().toString();
			if( len( CGI.QUERY_STRING ) ) {
				variables.url &= "?#CGI.QUERY_STRING#";
			}
		}
		return variables.url;
	}
<<<<<<< HEAD
	
	// ==================== GENERAL API METHODS ===============================
	
=======

	// ==================== GENERAL API METHODS ===============================

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	// Action Methods ===
	public string function doAction( required string action, struct data={} ) {
		arrayAppend(getCalledActions(), arguments.action);
		return getApplicationValue('application').doAction( arguments.action, arguments.data );
	}
<<<<<<< HEAD
	
	public boolean function hasSuccessfulAction( required string action ) {
		return arrayFindNoCase(getSuccessfulActions(), arguments.action) > 0;
	}
	
	public boolean function hasFailureAction( required string action ) {
		return arrayFindNoCase(getFailureActions(), arguments.action) > 0;
	}
	
=======

	public boolean function hasSuccessfulAction( required string action ) {
		return arrayFindNoCase(getSuccessfulActions(), arguments.action) > 0;
	}

	public boolean function hasFailureAction( required string action ) {
		return arrayFindNoCase(getFailureActions(), arguments.action) > 0;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function addActionResult( required string action, required failure=false ) {
		if(arguments.failure) {
			arrayAppend(getFailureActions(), arguments.action);
		} else {
			arrayAppend(getSuccessfulActions(), arguments.action);
		}
	}
<<<<<<< HEAD
	
	// Simple API Methods ===
	public any function newEntity(required string entityName) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entityName );
		
		return entityService.invokeMethod("new#arguments.entityName#");
	}
	
	public any function getEntity(required string entityName, any entityID="", boolean isReturnNewOnNotFound=false) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entityName );
		
		return entityService.invokeMethod("get#arguments.entityName#", {1=arguments.entityID, 2=arguments.isReturnNewOnNotFound});
	}
	
	public any function saveEntity(required any entity, struct data={}) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entity.getClassName() );
		
		return entityService.invokeMethod("save#arguments.entity.getClassName()#", {1=arguments.entity, 2=arguments.data});
	}
	
	public any function deleteEntity(required any entity) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entity.getClassName() );
		
		return entityService.invokeMethod("delete#arguments.entity.getClassName()#", {1=arguments.entity});
	}
	
	public any function getSmartList(required string entityName, struct data={}) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entityName );
		
		return entityService.invokeMethod("get#arguments.entityName#SmartList", {1=arguments.data});
	}
	
=======

	// Simple API Methods ===
	public any function newEntity(required string entityName) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entityName );

		return entityService.invokeMethod("new#arguments.entityName#");
	}

	public any function getEntity(required string entityName, any entityID="", boolean isReturnNewOnNotFound=false) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entityName );

		return entityService.invokeMethod("get#arguments.entityName#", {1=arguments.entityID, 2=arguments.isReturnNewOnNotFound});
	}

	public any function saveEntity(required any entity, struct data={}) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entity.getClassName() );

		return entityService.invokeMethod("save#arguments.entity.getClassName()#", {1=arguments.entity, 2=arguments.data});
	}

	public any function deleteEntity(required any entity) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entity.getClassName() );

		return entityService.invokeMethod("delete#arguments.entity.getClassName()#", {1=arguments.entity});
	}

	public any function getSmartList(required string entityName, struct data={}) {
		var entityService = getService( "hibachiService" ).getServiceByEntityName( arguments.entityName );

		return entityService.invokeMethod("get#arguments.entityName#SmartList", {1=arguments.data});
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function flushORMSession(){
		if(!getORMHasErrors()) {
			getDAO( "hibachiDAO" ).flushORMSession();
		}
	}
<<<<<<< HEAD
	
	// ==================== SESSION / ACCOUNT SETUP ===========================
	
	public any function getSession() {
		if(!structKeyExists(variables, "session")) {
			getService("hibachiSessionService").setProperSession();
		}
		return variables.session;
	}
	
	public any function getAccount() {
		return getSession().getAccount();
	}
	
	// ==================== REQUEST CACHING METHODS ===========================
	
=======

	// ==================== SESSION / ACCOUNT SETUP ===========================

	public any function getSession() {
		if(!structKeyExists(variables, "session")) {
			getService("hibachiSessionService").setPropperSession();
		}
		return variables.session;
	}

	public any function getAccount() {
		return getSession().getAccount();
	}

	// ==================== REQUEST CACHING METHODS ===========================

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public boolean function hasValue(required string key) {
		return structKeyExists(variables, arguments.key);
	}

	public any function getValue(required string key) {
		if(hasValue( arguments.key )) {
<<<<<<< HEAD
			return variables[ arguments.key ]; 
		}
		
		throw("You have requested '#arguments.key#' as a value in the #getApplicationValue('applicationKey')# scope, however that value has not been set in the request.  In the futuer you should check for it's existance with hasValue().");
	}
	
	public void function setValue(required string key, required any value) {
		variables[ arguments.key ] = arguments.value;
	}
	
	
	// ==================== RENDERING HELPERS ================================
	
	public void function showMessageKey(required any messageKey) {
		var messageType = listLast(messageKey, "_");
		var message = rbKey(arguments.messageKey);
		
=======
			return variables[ arguments.key ];
		}

		throw("You have requested '#arguments.key#' as a value in the #getApplicationValue('applicationKey')# scope, however that value has not been set in the request.  In the futuer you should check for it's existance with hasValue().");
	}

	public void function setValue(required string key, required any value) {
		variables[ arguments.key ] = arguments.value;
	}


	// ==================== RENDERING HELPERS ================================

	public void function showMessageKey(required any messageKey) {
		var messageType = listLast(messageKey, "_");
		var message = rbKey(arguments.messageKey);

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		if(right(message, 8) == "_missing") {
			if(left(listLast(arguments.messageKey, "."), 4) == "save") {
				var entityName = listFirst(right(listLast(arguments.messageKey, "."), len(listLast(arguments.messageKey, "."))-4), "_");
				message = rbKey("admin.define.save_#messageType#");
				message = replace(message, "${itemEntityName}", rbKey("entity.#entityName#") );
			} else if (left(listLast(arguments.messageKey, "."), 6) == "delete") {
				var entityName = listFirst(right(listLast(arguments.messageKey, "."), len(listLast(arguments.messageKey, "."))-6), "_");
				message = rbKey("admin.define.delete_#messageType#");
				message = replace(message, "${itemEntityName}", rbKey("entity.#entityName#") );
			} else if (left(listLast(arguments.messageKey, "."), 7) == "process") {
				var entityName = listFirst(right(listLast(arguments.messageKey, "."), len(listLast(arguments.messageKey, "."))-7), "_");
				message = rbKey("admin.define.process_#messageType#");
				message = replace(message, "${itemEntityName}", rbKey("entity.#entityName#") );
			}
		}
		showMessage(message=message, messageType=messageType);
	}
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public void function showMessage(string message="", string messageType="info") {
		param name="request.context['messages']" default="#arrayNew(1)#";
		arguments.message=getService('HibachiUtilityService').replaceStringTemplate(arguments.message,request.context);
		var messageStruct = {};
		messageStruct['message'] = arguments.message;
		messageStruct['messageType'] = arguments.messageType;
		arrayAppend(request.context['messages'], messageStruct);
	}
<<<<<<< HEAD
	
	// ========================== HELPER DELIGATION METHODS ===============================
	
	public string function hibachiHTMLEditFormat(required string html){
		return getService('hibachiUtilityService').hibachiHTMLEditFormat(arguments.html);
	}
	
=======

	// ========================== HELPER DELIGATION METHODS ===============================

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	// @hint helper function to return the RB Key from RB Factory in any component
	public string function rbKey(required string key, struct replaceStringData) {
		var keyValue = getService("hibachiRBService").getRBKey(arguments.key, getRBLocale());
		if(structKeyExists(arguments, "replaceStringData") && findNoCase("${", keyValue)) {
			keyValue = getService("hibachiUtilityService").replaceStringTemplate(keyValue, arguments.replaceStringData);
		}
		return keyValue;
	}
<<<<<<< HEAD
	
	public string function getRBKey(required string key, struct replaceStringData) {
		return rbKey(argumentcollection=arguments);
	}
	
	public boolean function authenticateAction( required string action ) {
		return getHibachiAuthenticationService().authenticateActionByAccount( action=arguments.action, account=getAccount() );
	}

	public boolean function authenticateEntity( required string crudType, required string entityName ) {
		return getHibachiAuthenticationService().authenticateEntityCrudByAccount( crudType=arguments.crudType, entityName=arguments.entityName, account=getAccount() );
	}
	
	public boolean function authenticateEntityProperty( required string crudType, required string entityName, required string propertyName ) {
		return getHibachiAuthenticationService().authenticateEntityPropertyCrudByAccount( crudType=arguments.crudType, entityName=arguments.entityName, propertyName=arguments.propertyName, account=getAccount() );
	}
	
	public boolean function authenticateCollection(required string crudType, required any collection){
		return getHibachiAuthenticationService().authenticateCollectionCrudByAccount( crudType=arguments.crudType, collection=arguments.collection, account=getAccount() );
	}
	
	public boolean function authenticateCollectionPropertyIdentifier(required string crudType, required any collection, required string propertyIdentifier){
		return getHibachiAuthenticationService().authenticateCollectionPropertyIdentifierCrudByAccount( crudType=arguments.crudType, collection=arguments.collection, propertyIdentifier=arguments.propertyIdentifier, account=getAccount() );
=======

	public string function getRBKey(required string key, struct replaceStringData) {
		return rbKey(argumentcollection=arguments);
	}

	public boolean function authenticateAction( required string action ) {
		return getService("hibachiAuthenticationService").authenticateActionByAccount( action=arguments.action, account=getAccount() );
	}

	public boolean function authenticateEntity( required string crudType, required string entityName ) {
		return getService("hibachiAuthenticationService").authenticateEntityCrudByAccount( crudType=arguments.crudType, entityName=arguments.entityName, account=getAccount() );
	}

	public boolean function authenticateEntityProperty( required string crudType, required string entityName, required string propertyName ) {
		return getService("hibachiAuthenticationService").authenticateEntityPropertyCrudByAccount( crudType=arguments.crudType, entityName=arguments.entityName, propertyName=arguments.propertyName, account=getAccount() );
	}

	public boolean function authenticateCollection(required string crudType, required any collection){
		return getService("hibachiAuthenticationService").authenticateCollectionCrudByAccount( crudType=arguments.crudType, collection=arguments.collection, account=getAccount() );
	}

	public boolean function authenticateCollectionPropertyIdentifier(required string crudType, required any collection, required string propertyIdentifier){
		return getService("hibachiAuthenticationService").authenticateCollectionPropertyIdentifierCrudByAccount( crudType=arguments.crudType, collection=arguments.collection, propertyIdentifier=arguments.propertyIdentifier, account=getAccount() );
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	}
}
