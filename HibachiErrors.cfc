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
component output="false" accessors="true" extends="HibachiObject" {

	// @hint stores any validation errors for the entity
	property name="errors" type="struct";

	// @hint Constructor for error bean. Initializes the error bean.
	public function init() {
		variables.errors = structNew();

		return this;
	}

	// @hint Adds a new error to the error structure.
	public void function addError(required string errorName, required any errorMessage) {
		if(!structKeyExists(variables.errors, arguments.errorName)) {
			variables.errors[arguments.errorName] = [];
		}
		if(isSimpleValue(arguments.errorMessage)) {
			arrayAppend(variables.errors[arguments.errorName], arguments.errorMessage);
		} else if (isArray(arguments.errorMessage)) {
			for(var message in arguments.errorMessage) {
				arrayAppend(variables.errors[arguments.errorName], message);
			}
		} else if (isStruct(arguments.errorMessage)) {
			for(var key in arguments.errorMessage) {
				for(var message in arguments.errorMessage[key]) {
					arrayAppend(variables.errors[arguments.errorName], message);
				}
			}
		}
	}

	public void function addErrors(required struct errors) {
		for(var key in arguments.errors) {
			if(!structKeyExists(variables.errors, key)) {
				variables.errors[key] = [];
			}
			for(var message in arguments.errors[key]) {
				arrayAppend(variables.errors[key], message);
			}
		}
	}

	// @hint Returns an array of error messages from the error structure.
	public array function getError(required string errorName) {
		if(hasError(errorName=arguments.errorName)){
			return variables.errors[arguments.name];
		}

		throw("The Error #arguments.errorName# doesn't Exist");
	}

	// @hint Returns true if the error exists within the error structure.
	public string function hasError(required string errorName) {
		return structKeyExists(variables.errors, arguments.errorName) ;
	}

	// @hint Returns true if there is at least one error.
	public boolean function hasErrors() {
		return !structIsEmpty(variables.errors) ;
	}

	// @hint helper method that returns all error messages as <p> html tags
	public string function getAllErrorsHTML() {
		var returnString = "";

		for(var errorName in getErrors()) {
			for(var i=1; i<=arrayLen(getErrors()[errorName]); i++) {
				returnString &= "<p class='error'>" & getErrors()[errorName][i] & "</p>";
			}
		}

		return returnString;
	}
}