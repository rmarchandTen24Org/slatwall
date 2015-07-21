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
component accessors="true" output="false" persistent="false" {

	property name="hibachiInstanceApplicationScopeKey" type="string" persistent="false";

	// Constructor Metod
	public any function init( ) {
		getThisMetaData();
		return this;
	}

	// @help Public method to determine if this is a persistent object (an entity)
	public any function isPersistent() {
		var metaData = getThisMetaData();
		if(structKeyExists(metaData, "persistent") && metaData.persistent) {
			return true;
		}
		return false;
	}

	// @help Public method to determine if this is a processObject.  This is overridden in the HibachiProcess.cfc
	public any function isProcessObject() {
		return false;
	}

	// ========================== START: FRAMEWORK ACCESS ===========================================

	// @hint gets a bean out of whatever the fw1 bean factory is
	public any function getBeanFactory() {
		return application[ getApplicationValue('applicationKey') ].factory;
	}

	// @hint gets a bean out of whatever the fw1 bean factory is
	public any function getBean(required string beanName) {
		return getBeanFactory().getBean( arguments.beanName );
	}

	// @hint returns an application scope cached version of the service
	public any function getService(required string serviceName) {
		if( !hasApplicationValue("service_#arguments.serviceName#") ) {
			setApplicationValue("service_#arguments.serviceName#", getBean(arguments.serviceName) );
		}
		return getApplicationValue("service_#arguments.serviceName#");
	}

	// @hint returns an application scope cached version of the service
	public any function getDAO(required string daoName) {
		if( !hasApplicationValue("dao_#arguments.daoName#") ) {
			setApplicationValue("dao_#arguments.daoName#", getBean(arguments.daoName) );
		}
		return getApplicationValue("dao_#arguments.daoName#");
	}

	// @hint returns a new transient bean
	public any function getTransient(required string transientName) {
		return getBean(arguments.transientName);
	}

	// @hint returns an application specfic virtual filesystem
	public any function getVirtualFileSystemPath() {
		var vfsDirectory = "ram:///" & getHibachiInstanceApplicationScopeKey();
		if(!directoryExists( vfsDirectory )) {
			directoryCreate( vfsDirectory );
		}

		return vfsDirectory;
	}

	// @hint return the correct tempDirectory for the application for uploads, ect
	public string function getHibachiTempDirectory() {
		return getTempDirectory();
	}

	// @hint helper function for returning the hibachiScope from the request scope
	public any function getHibachiScope() {
		return request[ "#getApplicationValue("applicationKey")#Scope" ];
	}

	// @hint helper function to get the applications baseURL
	public string function getBaseURL() {
		return getApplicationValue("baseURL");
	}

	public string function getURLFromPath( required any path ) {
		// Convert path to use /
		arguments.path = replace(arguments.path, '\','/','all');

		// Get the correct URL Root Path
		var urlRootPath = replace(expandPath('/'), '\','/','all');

		// Remove the URLRootPath from the rest of the path
		return replaceNoCase(arguments.path, urlRootPath, '/');
	}

	// ==========================  END: FRAMEWORK ACCESS ============================================
	// =========================== START: UTILITY METHODS ===========================================

	// @hint public method to return a a default value, if the value passed in is null
	public any function nullReplace(any value, required any defaultValue) {
		if(!structKeyExists(arguments, "value")) {
			return arguments.defaultValue;
		}
		return arguments.value;
	}


	// @help Public Method that allows you to get a serialized JSON struct of all the simple values in the variables scope.  This is very useful for compairing objects before and after a populate
	public string function getSimpleValuesSerialized() {
		var data = {};
		for(var key in variables) {
			if( key != "hibachiInstanceApplicationScopeKey" && structKeyExists(variables, key) && isSimpleValue(variables[key]) ) {
				data[key] = variables[key];
			}
		}
		return serializeJSON(data);
	}

	// @help Public Method to invoke any method in the object, If the method is not defined it calls onMissingMethod
	public any function invokeMethod(required string methodName, struct methodArguments={}) {
		if(structKeyExists(this, arguments.methodName)) {
			var theMethod = this[ arguments.methodName ];
			return theMethod(argumentCollection = methodArguments);
		}
		if(structKeyExists(this, "onMissingMethod")) {
			return this.onMissingMethod(missingMethodName=arguments.methodName, missingMethodArguments=arguments.methodArguments);
		}
		throw("You have attempted to call the method #arguments.methodName# which does not exist in #getClassFullName()#");
	}

	// @help Public method to get everything in the variables scope, good for debugging purposes
	public any function getVariables() {
		return variables;
	}

	// @help Public method to get the class name of an object
	public any function getClassName() {
		return listLast(getClassFullname(), ".");
	}

	// @help Public method to get the fully qualified dot notation class name
	public any function getClassFullname() {
		return getThisMetaData().fullname;
	}

	public string function createHibachiUUID() {
		return replace(lcase(createUUID()), '-', '', 'all');
	}

	// ===========================  END:  UTILITY METHODS ===========================================
	// ==================== START: INTERNALLY CACHED META VALUES ====================================

	// @help Public method that caches locally the meta data of this object
	public any function getThisMetaData(){
		if(!structKeyExists(variables, "thisMetaData")) {
			variables.thisMetaData = getMetaData( this );
		}
		return variables.thisMetaData;
	}

	// ====================  END: INTERNALLY CACHED META VALUES =====================================
	// ========================= START: DELIGATION HELPERS ==========================================

	public string function encryptValue(string value) {
		return getService("hibachiUtilityService").encryptValue(argumentcollection=arguments);
	}

	public string function decryptValue(string value) {
		return getService("hibachiUtilityService").decryptValue(argumentcollection=arguments);
	}

	public void function logHibachi(required string message, boolean generalLog=false){
		getService("hibachiUtilityService").logMessage(message=arguments.message, generalLog=arguments.generalLog);
	}

	public void function logHibachiException(required any exception){
		getService("hibachiUtilityService").logException(exception=arguments.exception);
	}

	public string function rbKey(required string key) {
		return getHibachiScope().rbKey(arguments.key);
	}

	public string function buildURL() {
		return getApplicationValue("application").buildURL(argumentcollection=arguments);
	}

	public any function formatValue( required string value, required string formatType, struct formatDetails={} ) {
		return getService("hibachiUtilityService").formatValue(argumentcollection=arguments);
	}

	// =========================  END:  DELIGATION HELPERS ==========================================
	// ========================= START: APPLICATION VAUES ===========================================

	// @hint setups an application scope value that will always be consistent
	private any function getHibachiInstanceApplicationScopeKey() {
		if(!structKeyExists(variables, "hibachiInstanceApplicationScopeKey")) {
			var metaData = getThisMetaData();
			do {
				var filePath = metaData.path;
				metaData = metaData.extends;
			} while( structKeyExists(metaData, "extends") );

			filePath = lcase(getDirectoryFromPath(replace(filePath,"\","/","all")));
			var appKey = hash(filePath);

			variables.hibachiInstanceApplicationScopeKey = appKey;
		}
		return variables.hibachiInstanceApplicationScopeKey;
	}

	// @hint facade method to check the application scope for a value
	public boolean function hasApplicationValue(required any key) {
		if( structKeyExists(application, getHibachiInstanceApplicationScopeKey()) && structKeyExists(application[ getHibachiInstanceApplicationScopeKey() ], arguments.key)) {
			return true;
		}

		return false;
	}

	// @hint facade method to check the application scope for a value
	public void function clearApplicationValue(required any key) {
		if( structKeyExists(application, getHibachiInstanceApplicationScopeKey()) && structKeyExists(application[ getHibachiInstanceApplicationScopeKey() ], arguments.key)) {
			structDelete(application[ getHibachiInstanceApplicationScopeKey() ], arguments.key);
		}
	}

	// @hint facade method to get values from the application scope
	public any function getApplicationValue(required any key) {
		if( structKeyExists(application, getHibachiInstanceApplicationScopeKey()) && structKeyExists(application[ getHibachiInstanceApplicationScopeKey() ], arguments.key)) {
			return application[ getHibachiInstanceApplicationScopeKey() ][ arguments.key ];
		}

		throw("You have requested a value for '#arguments.key#' from the core hibachi application that is not setup.  This may be because the verifyApplicationSetup() method has not been called yet")
	}

	// @hint facade method to set values in the application scope
	public void function setApplicationValue(required any key, required any value) {
		lock name="application_#getHibachiInstanceApplicationScopeKey()#_#arguments.key#" timeout="10" {
			if(!structKeyExists(application, getHibachiInstanceApplicationScopeKey())) {
				application[ getHibachiInstanceApplicationScopeKey() ] = {};
				application[ getHibachiInstanceApplicationScopeKey() ].initialized = false;
			}
			application[ getHibachiInstanceApplicationScopeKey() ][ arguments.key ] = arguments.value;
			if(isSimpleValue(arguments.value) && hasApplicationValue("applicationKey") && !findNoCase("password", arguments.key) && !findNoCase("username", arguments.key) && len(arguments.value) < 100) {
				writeLog(file="#getApplicationValue('applicationKey')#", text="General Log - Application Value '#arguments.key#' set as: #arguments.value#");
			}
		}
	}

	// @hint facade method to check the application scope for a value
	public boolean function hasSessionValue(required any key) {
		getHibachiScope().hasSessionValue(arguments.key);
	}

	// @hint facade method to get values from the application scope
	public any function getSessionValue(required any key) {
		getHibachiScope().getSessionValue(arguments.key);
	}

	// @hint facade method to set values in the application scope
	public void function setSessionValue(required any key, required any value) {
		getHibachiScope().setSessionValue(arguments.key,arguments.value);
	}

	// ========================= START: APPLICATION VAUES ===========================================
}
