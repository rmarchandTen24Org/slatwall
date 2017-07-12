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
component extends="Slatwall.model.transient.data.DataRequestBean" persistent="false" accessors="true" output="false" {
	property name="instanceID" type="string";
	property name="version" type="any";
	property name="resources" type="any";
	property name="httpRequest" type="any";
	property name="body" type="string" default="";
	property name="accept" type="string";
	


	// ===================== START: Logical Methods ===========================

	public any function init() {
		// Set defaults
		return super.init();
	}
	
	public any function getHttpRequest(){
		if(!structKeyExists(variables,'httpRequest')){
			var httpRequest = new http();
			httpRequest.setMethod(getMethod());
	
			httpRequest.setTimeout( 120 );
			httpRequest.setResolveurl(false);
			var urlString = getUrlString();
			if(!isNull(getQueryString())){
				urlString &= getQueryString();
			}
			httpRequest.setUrl(urlString);
			if(len(getAuthToken())){
				httpRequest.addParam(type="header",name='Authorization',value='Bearer '&getAuthToken());
			}
			if(len(getContentType())){
				httpRequest.addParam(type="header",name='Content-Type',value=getContentType());
			}
			if(len(getAccept())){
				httpRequest.addParam(type="header",name='Accept',value=getAccept());
			}
			if(len(getBody())){
				httpRequest.addParam(type="header",name='Content-Length',value=len(getBody));
			}
			
			if(len(getIfUnmodifiedSince())){
				httpRequest.addParam(type="header",name="If-Unmodified-Since",value=getIfUnmodifiedSince());
			}
			
			if(len(getBody())){
				httpRequest.addParam(type="body",value=getBody());
			}
			
			variables.httpRequest = httpRequest;
		}
		return variables.httpRequest;
	}
}
