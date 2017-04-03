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
component output="false" accessors="true" extends="HibachiTransient" {

	property name="account" type="any";
	property name="session" type="any";

	property name="loggedInFlag" type="boolean";
	property name="loggedInAsAdminFlag" type="boolean";
	property name="publicPopulateFlag" type="boolean";
	property name="persistSessionFlag" type="boolean";
	property name="sessionFoundNPSIDCookieFlag" type="boolean";
	property name="sessionFoundPSIDCookieFlag" type="boolean";

	property name="ormHasErrors" type="boolean" default="false";
	property name="rbLocale";
	property name="url" type="string";

	property name="calledActions" type="array";
	property name="failureActions" type="array";
	property name="successfulActions" type="array";

	property name="auditsToCommitStruct" type="struct";
	property name="modifiedEntities" type="array";

	public any function init() {
		setORMHasErrors( false );
		setRBLocale( "en_us" );
		setPublicPopulateFlag( false );
		setPersistSessionFlag( true );
		setSessionFoundNPSIDCookieFlag( false );
		setSessionFoundPSIDCookieFlag( false );

		setCalledActions( [] );
		setSuccessfulActions( [] );
		setFailureActions( [] );

		setAuditsToCommitStruct( {} );
		setModifiedEntities( [] );


		return super.init();
	}

	// @hint facade method to check the application scope for a value
	public boolean function hasSessionValue(required any key) {
		param name="session" default="#structNew()#";
		if( structKeyExists(session, getHibachiInstanceApplicationScopeKey()) && structKeyExists(session[ getHibachiInstanceApplicationScopeKey() ], arguments.key)) {
			return true;
		}

		return false;
	}

	// @hint facade method to get values from the application scope
	public any function getSessionValue(required any key) {
		if( structKeyExists(session, getHibachiInstanceApplicationScopeKey()) && structKeyExists(session[ getHibachiInstanceApplicationScopeKey() ], arguments.key)) {
			return session[ getHibachiInstanceApplicationScopeKey() ][ arguments.key ];
		}

		throw("You have requested a value for '#arguments.key#' from the core application that is not setup.  This may be because the verifyApplicationSetup() method has not been called yet")
	}

	// @hint facade method to set values in the application scope
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

	public string function renderJSObject() {
		var config = {};
		config[ 'baseURL' ] = getApplicationValue('baseURL');
		config[ 'action' ] = getApplicationValue('action');
		config[ 'dateFormat' ] = 'mmm dd, yyyy';
		config[ 'timeFormat' ] = 'hh:mm tt';
		config[ 'rbLocale' ] = '#getRBLocale()#';
		config[ 'debugFlag' ] = getApplicationValue('debugFlag');
		config[ 'instantiationKey' ] = '#getApplicationValue('instantiationKey')#';

		var returnHTML = '';
		returnHTML &= '<script type="text/javascript" src="#getApplicationValue('baseURL')#/org/Hibachi/HibachiAssets/js/hibachi-scope.js"></script>';
		returnHTML &= '<script type="text/javascript">(function( $ ){$.#lcase(getApplicationValue('applicationKey'))# = new Hibachi(#serializeJSON(config)#);})( jQuery );</script>';
		return returnHTML;
	}

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

	public string function getURL() {
		if(!structKeyExists(variables, "url")) {
			variables.url = getPageContext().getRequest().GetRequestUrl().toString();
			if( len( CGI.QUERY_STRING ) ) {
				variables.url &= "?#CGI.QUERY_STRING#";
			}
		}
		return variables.url;
	}

	// ==================== GENERAL API METHODS ===============================

	// Action Methods ===
	public string function doAction( required string action, struct data={} ) {
		arrayAppend(getCalledActions(), arguments.action);
		return getApplicationValue('application').doAction( arguments.action, arguments.data );
	}

	public boolean function hasSuccessfulAction( required string action ) {
		return arrayFindNoCase(getSuccessfulActions(), arguments.action) > 0;
	}

	public boolean function hasFailureAction( required string action ) {
		return arrayFindNoCase(getFailureActions(), arguments.action) > 0;
	}

	public void function addActionResult( required string action, required failure=false ) {
		if(arguments.failure) {
			arrayAppend(getFailureActions(), arguments.action);
		} else {
			arrayAppend(getSuccessfulActions(), arguments.action);
		}
	}

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

	public void function flushORMSession(){
		if(!getORMHasErrors()) {
			getDAO( "hibachiDAO" ).flushORMSession();
		}
	}

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

	public boolean function hasValue(required string key) {
		return structKeyExists(variables, arguments.key);
	}

	public any function getValue(required string key) {
		if(hasValue( arguments.key )) {
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

	public void function showMessage(string message="", string messageType="info") {
		param name="request.context['messages']" default="#arrayNew(1)#";
		arguments.message=getService('HibachiUtilityService').replaceStringTemplate(arguments.message,request.context);
		var messageStruct = {};
		messageStruct['message'] = arguments.message;
		messageStruct['messageType'] = arguments.messageType;
		arrayAppend(request.context['messages'], messageStruct);
	}

	// ========================== HELPER DELIGATION METHODS ===============================

	// @hint helper function to return the RB Key from RB Factory in any component
	public string function rbKey(required string key, struct replaceStringData) {
		var keyValue = getService("hibachiRBService").getRBKey(arguments.key, getRBLocale());
		if(structKeyExists(arguments, "replaceStringData") && findNoCase("${", keyValue)) {
			keyValue = getService("hibachiUtilityService").replaceStringTemplate(keyValue, arguments.replaceStringData);
		}
		return keyValue;
	}

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
	}
}
