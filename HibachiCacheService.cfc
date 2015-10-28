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
component accessors="true" output="false" extends="HibachiService" {

	property name="cache" type="struct";
	property name="internalCacheFlag" type="boolean";
	property name="railoFlag" type="boolean";

	public any function init() {
		setCache( {} );
		setInternalCacheFlag( true );
		setRailoFlag( false );

		var hibachiConfig = getApplicationValue('hibachiConfig');
		if(structKeyExists(hibachiConfig, "useCachingEngineFlag") && hibachiConfig.useCachingEngineFlag) {
			setInternalCacheFlag( false );
		}
		if(structKeyExists(server,"railo") || structKeyExists(server,'lucee')) {
			setRailoFlag( true );
		}

		return super.init();
	}

	public any function hasCachedValue( required string key ) {
		// If using the internal cache, then check there
		if( getInternalCacheFlag() && structKeyExists(getCache(), arguments.key) && structKeyExists(getCache()[ arguments.key ], "reset") && !getCache()[ arguments.key ].reset ) {
			return true;

		// If using the external cache, then check there
		} else if ( !getInternalCacheFlag() && getRailoFlag() && cacheKeyExists(arguments.key) ) {
			var fullValue = cacheGet( arguments.key );
			if(!isNull(fullValue) && isStruct(fullValue) && structKeyExists(fullValue, "reset") && !fullValue.reset && structKeyExists(fullValue, "value")) {
				return true;
			}

		} else if ( !getInternalCacheFlag() ) {
			var fullValue = cacheGet( arguments.key );
			if(!isNull(fullValue) && isStruct(fullValue) && structKeyExists(fullValue, "reset") && !fullValue.reset && structKeyExists(fullValue, "value")) {
				return true;
			}

		}

		// By default return false
		return false;
	}

	public any function getCachedValue( required string key ) {
		// If using the internal cache, then check there
		if(getInternalCacheFlag() && structKeyExists(getCache(), key) ) {
			return getCache()[ arguments.key ].value;

		// If using the external cache, then check there
		} else if (!getInternalCacheFlag() && !isNull(cacheGet( arguments.key )) ) {
			return cacheGet( arguments.key ).value;

		}
	}

	public any function setCachedValue( required string key, required any value ) {
		// If using the internal cache, then set value there
		if(getInternalCacheFlag()) {
			getCache()[ arguments.key ] = {
				value = arguments.value,
				reset = false
			};

		// If using the external cache, then set value there
		} else if (!getInternalCacheFlag()) {
			cachePut( arguments.key, {
				value = arguments.value,
				reset = false
			});

		}
	}

	public any function resetCachedKey( required string key ) {
		// If using the internal cache, then reset there
		if(getInternalCacheFlag()) {
			if(!structKeyExists(getCache(), arguments.key)) {
				getCache()[ arguments.key ] = {};
			}
			getCache()[ arguments.key ].reset = true;

		// If using the external cache, then reset there
		} else if (!getInternalCacheFlag()) {
			var tuple = {
				reset = true
			};

			// Done in a try catch in case the value doesn't exist
			try{
				tuple.value = cacheGet( arguments.key ).value;
			} catch(any e){};

			cachePut( arguments.key, tuple );
		}
	}

	public any function resetCachedKeyByPrefix( required string keyPrefix ) {
		// Because there could be lots of keys potentially we do this in a thread
		thread name="hibachiCacheService_resetCachedKeyByPrefix_#createUUID()#" keyPrefix=arguments.keyPrefix {

			if(getInternalCacheFlag()) {

				var allKeysArray = listToArray(structKeyList(getCache()));

				var prefixLen = len(keyPrefix);

				for(var key in allKeysArray) {
					if(left(key, prefixLen) eq keyPrefix) {
						getCache()[ key ].reset = true;
					}
				}
			} else {
				var allKeysArray = cacheGetAllIDs( '#keyPrefix#*' );

				for(var key in allKeysArray) {
					var tuple = cacheGet( key );
					tuple.reset = true;
					cachePut( key, tuple );
				}
			}

		}
	}

	public any function getOrCacheFunctionValue(required string key, required any fallbackObject, required any fallbackFunction, struct fallbackArguments={}) {
		// Check to see if this cache key already exists, and if so just return the cached value
		if(hasCachedValue(arguments.key)) {
			return getCachedValue(arguments.key);
		}

		// If a string was passed in, then we will figure out what type of object it is and instantiate
		if(!isObject(arguments.fallbackObject) && right(arguments.fallbackObject, 7) eq "Service") {
			arguments.fallbackObject = getService( arguments.fallbackObject );
		} else if (!isObject(arguments.fallbackObject) && right(arguments.fallbackObject, 3) eq "DAO") {
			arguments.fallbackObject = getDAO( arguments.fallbackObject );
		} else if (!isObject(arguments.fallbackObject)) {
			arguments.fallbackObject = getBean( arguments.fallbackObject );
		}

		// If not then execute the function
		var results = arguments.fallbackObject.invokeMethod(arguments.fallbackFunction, arguments.fallbackArguments);

		// Cache the result of the function
		setCachedValue(arguments.key, results);

		// Return the results
		return results;
	}
}