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

component accessors="true" output="false" implements="Slatwall.integrationServices.AuthenticationInterface" extends="Slatwall.integrationServices.BaseAuthentication" {
	property name="fw" type="any";
	property name='Auth0Service' type='any';

	public any function init() {
		setAuth0Service(getService('Auth0Service'));
		return this;
	}

	public boolean function verifySessionLogin(){
		return true;
	}
	
	public string function getAdminLoginHTML() {
		var loginHTML = '';
		var options = {
			'auth'={
				'redirect'=true,
				'redirectUrl'=getAuth0Service().getRedirectURI(),
				'sso'=false,
				'params'={
					'scope'='openid profile email name given_name family_name'
				}
			}
		};
		if(len(getAuth0Service().getSRedirectAction(request))){
			options.auth.params['state'] = getAuth0Service().getSRedirectAction(request);
		}

		loginHTML &= '<div class="s-form-signin s-other-services"><button id="auth0Login" class="btn btn-default btn-lg ">Login With Auth0</button></div>';
		loginHTML &= '<script type="text/javascript" src="http://cdn.auth0.com/js/lock/10.14.0/lock.min.js"></script>';
		loginHTML &= '<script>';
		loginHTML &= 'var clientID = "#getAuth0Service().getClient_ID()#", domain="#getAuth0Service().getAuthDomain()#";';
		loginHTML &= 'var options = ';
		loginHTML = appendStructString(struct=options, string=loginHTML);
		loginHTML &= ';';
		loginHTML &= 'var lock = new Auth0Lock(clientID, domain, options);';
		loginHTML &= 'document.getElementById("auth0Login").addEventListener("click", function(event){lock.show()});';
		loginHTML &= '</script>';
		return loginHTML;
	}
	
	public string function getPublicLoginHTML() {
		return getAdminLoginHTML();
	}
	

	//Loop through struct, adding properties to string
	public string function appendStructString(required any struct, required string string){
		string &= '{';
		for(var key in struct){
			string &= '#key#:';
			if(isStruct(struct[key])){
				string = appendStructString(struct[key], string);
				string &= ',';
			}else{
				string &= '"#struct[key]#",';
			}
		}
		string = REReplace(string, ",$", "");
		string &= '}';
		return string;
	}
	// @hint helper function to return a Setting
	public any function setting(required string settingName, array filterEntities=[], formatValue=false) {
		if(structKeyExists(getIntegration().getSettings(), arguments.settingName)) {
			return getService("settingService").getSettingValue(settingName="integration#getPackageName()##arguments.settingName#", object=this, filterEntities=arguments.filterEntities, formatValue=arguments.formatValue);	
		}
		return super.setting(argumentcollection=arguments);
	}
	
	// @hint helper function to return the integration entity that this belongs to
	public any function getIntegration() {
		return getService("integrationService").getIntegrationByIntegrationPackage(getPackageName());
	}
	
	// @hint helper function to return the packagename of this integration
	public any function getPackageName() {
		return lcase(listGetAt(getClassFullname(), listLen(getClassFullname(), '.') - 1, '.'));
	}
	
}