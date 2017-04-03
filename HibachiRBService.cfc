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
component output="false" accessors="true" extends="HibachiService" {

	variables.resourceBundles = {};
	variables.instantiaded = now();
<<<<<<< HEAD
	
	public string function getRBKey(required string key, string locale="en_us", string checkedKeys="", string originalKey) {
		
		// Check to see if a list was passed in as the key
		if(listLen(arguments.key) gt 1) {
			
			// Set up "" as the key value to be passed as 'checkedKeys'
			var keyValue = "";
			
			// If there was a list then try to get the key for each item in order
			for(var l=1; l<=listLen(arguments.key); l++) {
				
				// Get the keyValue from this iteration
				var keyValue = getRBKey(key=listGetAt(arguments.key, l), locale=arguments.locale, checkedKeys=keyValue);
				
=======

	public string function getRBKey(required string key, string locale="en_us", string checkedKeys="", string originalKey) {

		// Check to see if a list was passed in as the key
		if(listLen(arguments.key) gt 1) {

			// Set up "" as the key value to be passed as 'checkedKeys'
			var keyValue = "";

			// If there was a list then try to get the key for each item in order
			for(var l=1; l<=listLen(arguments.key); l++) {

				// Get the keyValue from this iteration
				var keyValue = getRBKey(key=listGetAt(arguments.key, l), locale=arguments.locale, checkedKeys=keyValue);

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				// If the keyValue was found, then we can break out of the loop
				if(right(keyValue, "8") != "_missing") {
					break;
				}
			}
<<<<<<< HEAD
			
			return keyValue;
		}
		
=======

			return keyValue;
		}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		// Check the exact bundle file
		var bundle = getResourceBundle( arguments.locale );
		if(structKeyExists(bundle, arguments.key)) {
			return bundle[ arguments.key ];
		}
		// Because the value was not found, we can add this to the checkedKeys, and setup the original Key
		arguments.checkedKeys = listAppend(arguments.checkedKeys, arguments.key & "_" & arguments.locale & "_missing");
		if(!structKeyExists(arguments, "originalKey")) {
			arguments.originalKey = arguments.key;
		}
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		// Check the broader bundle file
		if(listLen(arguments.locale, "_") == 2) {
			bundle = getResourceBundle( listFirst(arguments.locale, "_") );
			if(structKeyExists(bundle, arguments.key)) {
				return bundle[ arguments.key ];
			}
			// Add this more broad term to the checked keys
			arguments.checkedKeys = listAppend(arguments.checkedKeys, arguments.key & "_" & listFirst(arguments.locale, "_") & "_missing");
		}
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		// Recursivly step the key back with the word 'define' replacing the previous.  Basically Look for just the "xxx.yyy.define.zzz" version of the end key and then "yyy.define.zzz" and then "define.zzz"
		if ( listLen(arguments.key, ".") >= 3 && listGetAt(arguments.key, listLen(arguments.key, ".") - 1, ".") eq "define" ) {
			var newKey = replace(arguments.key, "#listGetAt(arguments.key, listLen(arguments.key, ".") - 2, ".")#.define", "define", "one");
			return getRBKey(newKey, arguments.locale, arguments.checkedKeys, arguments.originalKey);
		} else if( listLen(arguments.key, ".") >= 2 && listGetAt(arguments.key, listLen(arguments.key, ".") - 1, ".") neq "define" ) {
			var newKey = replace(arguments.key, "#listGetAt(arguments.key, listLen(arguments.key, ".") - 1, ".")#.", "define.", "one");
<<<<<<< HEAD
			
			return getRBKey(newKey, arguments.locale, arguments.checkedKeys, arguments.originalKey);
		}
		
		if(listFirst(arguments.locale, "_") neq "en") {
			return getRBKey(arguments.originalKey, "en", arguments.checkedKeys);
		}
		
		return arguments.checkedKeys;
	}
	
=======

			return getRBKey(newKey, arguments.locale, arguments.checkedKeys, arguments.originalKey);
		}

		if(listFirst(arguments.locale, "_") neq "en") {
			return getRBKey(arguments.originalKey, "en", arguments.checkedKeys);
		}

		return arguments.checkedKeys;
	}

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	public struct function getAggregateResourceBundle(required string locale="en_us") {
		var aggBundle = getResourceBundle(arguments.locale);
		if(listLen(arguments.locale, "_") == 2) {
			structAppend(aggBundle, getResourceBundle( listFirst(arguments.locale, "_") ));
		}
		return aggBundle;
	}
<<<<<<< HEAD
	
	public struct function getResourceBundle(required string locale="en_us") {
		if(!structKeyExists(variables.resourceBundles, arguments.locale)) {
			var javaRB = new JavaRB.JavaRB();
			
			var thisRB = {};
			
=======

	public struct function getResourceBundle(required string locale="en_us") {
		if(!structKeyExists(variables.resourceBundles, arguments.locale)) {
			var javaRB = new JavaRB.JavaRB();

			var thisRB = {};

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			// Get the primary resource bundle for
			try {
				thisRB = javaRB.getResourceBundle(expandPath("/#getApplicationValue('applicationKey')#/config/resourceBundles/#arguments.locale#.properties"));
			} catch (any e) {
				// No RB File Found
			}
<<<<<<< HEAD
			
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			// Get whatever resource bundle is in the custom config directory
			try {
				structAppend(thisRB, javaRB.getResourceBundle(expandPath("/#getApplicationValue('applicationKey')#/custom/config/resourceBundles/#arguments.locale#.properties")), true);
			} catch (any e) {
				// No RB File Found
			}
<<<<<<< HEAD
			
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			variables.resourceBundles[ arguments.locale ] = thisRB;
		}
		return variables.resourceBundles[ arguments.locale ];
	}
<<<<<<< HEAD
	
	
=======


>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
}