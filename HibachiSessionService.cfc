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
component output="false" accessors="true" extends="HibachiService"  {

	property name="accountService" type="any";
	property name="orderService" type="any";
	property name="hibachiAuditService" type="any";
	property name="hibachiTagService" type="any";
	property name="hibachiUtilityService" type="any";

	// ===================== START: Logical Methods ===========================

	public void function setPropperSession() {

		// Check to see if a session value doesn't exist, then we can check for a cookie... or just set it to blank
		if(!hasSessionValue("sessionID")) {
			setSessionValue('sessionID', '');
		}

		var foundWithNPSID = false;
		var foundWithPSID = false;

		// Check for non-persistent cookie.

		if( len(getSessionValue('sessionID')) ) {
			var sessionEntity = this.getSession( getSessionValue('sessionID'), true);

		} else if(structKeyExists(cookie, "#getApplicationValue('applicationKey')#-NPSID")) {
			var sessionEntity = this.getSessionBySessionCookieNPSID( cookie["#getApplicationValue('applicationKey')#-NPSID"], true);

			if(sessionEntity.getNewFlag()) {
				getHibachiTagService().cfcookie(name="#getApplicationValue('applicationKey')#-NPSID", value='', expires="now");
			} else {

				foundWithNPSID = true;
				setSessionValue('sessionID', sessionEntity.getSessionID());

			}

		// Check for a persistent cookie.
		} else if(structKeyExists(cookie, "#getApplicationValue('applicationKey')#-PSID")) {

			var sessionEntity = this.getSessionBySessionCookiePSID( cookie["#getApplicationValue('applicationKey')#-PSID"], true);

			if(sessionEntity.getNewFlag()) {
				getHibachiTagService().cfcookie(name="#getApplicationValue('applicationKey')#-PSID", value='', expires="now");
			} else {
				foundWithPSID = true;
				setSessionValue('sessionID', sessionEntity.getSessionID());
			}

		// Last option is to just create a new session record
		} else {
			var sessionEntity = this.newSession();
		}

		// Populate the hibachi scope with the session
		getHibachiScope().setSession( sessionEntity );

		// Let the hibachiScope know how we found the proper sessionID
		getHibachiScope().setSessionFoundNPSIDCookieFlag( foundWithNPSID );
		getHibachiScope().setSessionFoundPSIDCookieFlag( foundWithPSID );

		// Variable to store the last request dateTime of a session
		var previousRequestDateTime = getHibachiScope().getSession().getLastRequestDateTime();

		// update the sessionScope with the ID for the next request
		setSessionValue('sessionID', getHibachiScope().getSession().getSessionID());

		// Update the last request datetime, and IP Address
		getHibachiScope().getSession().setLastRequestDateTime( now() );
		getHibachiScope().getSession().setLastRequestIPAddress( CGI.REMOTE_ADDR );

		if(!isNull(getHibachiScope().getSession().getRBLocale())) {
			getHibachiScope().setRBLocale( getHibachiScope().getSession().getRBLocale() );

		}

		// If the session has an account but no authentication, then remove the account

		// Check to see if this session has an accountAuthentication, if it does then we need to verify that the authentication shouldn't be auto logged out

		// If there was an integration, then check the verify method for any custom auto-logout logic

		// If the sessions account is and admin and last request by the session was 15 min or longer ago.

		if((getHibachiScope().getSessionFoundPSIDCookieFlag() && getHibachiScope().getLoggedInFlag())

			|| (!isNull(getHibachiScope().getSession().getAccountAuthentication()) && getHibachiScope().getSession().getAccountAuthentication().getForceLogoutFlag())

			|| (isNull(getHibachiScope().getSession().getAccountAuthentication()) && getHibachiScope().getLoggedInFlag())

			|| (!isNull(getHibachiScope().getSession().getAccountAuthentication()) && getHibachiScope().getSession().getAccount().getAdminAccountFlag() == true && DateDiff('n', previousRequestDateTime, Now()) >= getHibachiScope().setting('globalAdminAutoLogoutMinutes') )

			|| (!isNull(getHibachiScope().getSession().getAccountAuthentication()) && getHibachiScope().getSession().getAccount().getAdminAccountFlag() != true && DateDiff('n', previousRequestDateTime, Now()) >= getHibachiScope().setting('globalPublicAutoLogoutMinutes') )

		) 	{

		logoutAccount();

		}

	}

	public void function persistSession() {

		// Save the session
		getHibachiDAO().save( getHibachiScope().getSession() );

		// Save session ID in the session Scope & cookie scope for next request
		setSessionValue('sessionID', getHibachiScope().getSession().getSessionID());

		//Generate new session cookies for every time the session is persisted (on every login)
		var npCookieValue = getValueForCookie();
			getHibachiScope().getSession().setSessionCookieNPSID(npCookieValue);
			getHibachiTagService().cfcookie(name="#getApplicationValue('applicationKey')#-NPSID", value=getHibachiScope().getSession().getSessionCookieNPSID());
	    var cookieValue = getValueForCookie();
			getHibachiScope().getSession().setSessionCookiePSID(cookieValue);
			getHibachiTagService().cfcookie(name="#getApplicationValue('applicationKey')#-PSID", value=getHibachiScope().getSession().getSessionCookiePSID(), expires="never");

	}

	public string function loginAccount(required any account, required any accountAuthentication) {

		var currentSession = getHibachiScope().getSession();
		currentSession.setAccount( arguments.account );
		currentSession.setAccountAuthentication( arguments.accountAuthentication );

		// Make sure that we persist the session
		persistSession();

		// Make sure that this login is persisted
		getHibachiDAO().flushORMSession();

		var auditLogData = {

			account = arguments.account

		};

		getHibachiAuditService().logAccountActivity( "login", auditLogData );
		getHibachiEventService().announceEvent("onSessionAccountLogin");

	}

	public void function logoutAccount() {
		var currentSession = getHibachiScope().getSession();
		var auditLogData = {};

		if(!isNull(currentSession.getAccount())) {
			auditLogData.account = currentSession.getAccount();
		}

		currentSession.removeAccount();
		currentSession.removeAccountAuthentication();

		// Make sure that this logout is persisted
		getHibachiDAO().flushORMSession();
		getHibachiAuditService().logAccountActivity("logout", auditLogData);
		getHibachiEventService().announceEvent("onSessionAccountLogout");
	}

	// =====================  END: Logical Methods ============================

	// ===================== START: DAO Passthrough ===========================

	// ===================== START: DAO Passthrough ===========================

	// ===================== START: Process Methods ===========================

	public any function processSession_authorizeAccount(required any session, required any processObject) {

		// Take the email address and get all of the user accounts by primary e-mail address
		var accountAuthentications = getAccountService().getInternalAccountAuthenticationsByEmailAddress(emailAddress=arguments.processObject.getEmailAddress());

		if(arrayLen(accountAuthentications)) {

			for(var i=1; i<=arrayLen(accountAuthentications); i++) {
				// If the password matches what it should be, then set the account in the session and

				if(!isNull(accountAuthentications[i].getPassword()) && len(accountAuthentications[i].getPassword()) && accountAuthentications[i].getPassword() == getAccountService().getHashedAndSaltedPassword(password=arguments.processObject.getPassword(), salt=accountAuthentications[i].getAccountAuthenticationID())) {
					loginAccount( accountAuthentications[i].getAccount(), accountAuthentications[i] );
					return arguments.session;
				}

			}

			arguments.processObject.addError('password', rbKey('validate.session_authorizeAccount.password.incorrect'));

		} else {

			arguments.processObject.addError('emailAddress', rbKey('validate.session_authorizeAccount.emailAddress.notfound'));

		}

		return arguments.session;

	}

	// =====================  END: Process Methods ============================

	// ====================== START: Status Methods ===========================

	// ======================  END: Status Methods ============================

	// ====================== START: Save Overrides ===========================

	// ======================  END: Save Overrides ============================

	// ==================== START: Smart List Overrides =======================

	// ====================  END: Smart List Overrides ========================

	// ====================== START: Get Overrides ============================

	// ======================  END: Get Overrides =============================

	// ===================== START: Delete Overrides ==========================

	// =====================  END: Delete Overrides ===========================

	// ================== START: Private Helper Functions =====================

	/**
	* @deprecated getSessionIDEncryptedCookie
	*/
	private any function getSessionIDEncryptedCookie( required any sessionID, required string cookieType ) {
		return getHibachiUtilityService().encryptValue(value=arguments.sessionID, salt="valid-#arguments.cookieType#-#getApplicationKey()#SessionIDCookie");
	}

	/*
	* @deprecated getSessionIDFromEncryptedCookie
	*/
	private any function getSessionIDFromEncryptedCookie( required any cookieData, required string cookieType ) {
		return getHibachiUtilityService().decryptValue(value=arguments.cookieData, salt="valid-#arguments.cookieType#-#getApplicationKey()#SessionIDCookie");
	}

	/**
	 * Generate new cookie value
	 */
	private any function getValueForCookie(){
		var id = getHibachiScope().getSession().getSessionID();
		var hashedID = hash(id, "md5");
		var uuid = replace(createUUID(),'-','','all');
		var final = hashedID & uuid;
		return final;
	}
	// ==================  END:  Private Helper Functions =====================

	// =================== START: Deprecated Functions ========================

	// ===================  END: Deprecated Functions =========================

}
