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
<cfcomponent output="false" accessors="true" extends="HibachiService">

	<cffunction name="cfcookie">
		<cfargument name="name" type="string" required="true" />
		<cfargument name="value" type="any" required="true" />
		<cfargument name="expires" type="string" />
		<cfargument name="secure" type="boolean" default="false" />

		<cfif structKeyExists(arguments, "expires")>
			<cfcookie name="#arguments.name#" value="#arguments.value#" expires="#arguments.expires#" secure="#arguments.secure#" httponly="true">
		<cfelse>
			<cfcookie name="#arguments.name#" value="#arguments.value#" secure="#arguments.secure#" httponly="true">
		</cfif>
	</cffunction>

	<cffunction name="cfhtmlhead">
		<cfargument name="text" type="string" required="true" />
		<cfhtmlhead text="#arguments.text#">
	</cffunction>

	<cffunction name="cfinvoke" output="false">
		<cfargument name="component" type="any" required="true" hint="CFC name or instance." />
		<cfargument name="method" type="string" required="true" hint="Method name to be invoked." />
		<cfargument name="theArgumentCollection" type="struct" default="#structNew()#" hint="Argument collection to pass to method invocation." />

		<cfset var returnVariable = 0 />

		<cfinvoke
			component="#arguments.component#"
			method="#arguments.method#"
			argumentcollection="#arguments.theArgumentCollection#"
			returnvariable="returnVariable"
		/>

		<cfif not isNull( returnVariable )>
			<cfreturn returnVariable />
		</cfif>

	</cffunction>

	<cffunction name="cfmail" output="false">
		<cfargument name="from" type="string" required="true" />
		<cfargument name="to" type="string" required="true" />
		<cfargument name="subject" default="" />
		<cfargument name="body" default="" />
		<cfargument name="type" default="html" />

		<cftry>
			<cfmail attributeCollection="#arguments#">
				#arguments.body#
			</cfmail>
			<cfcatch type="any">
				<cfset logHibachiException(cfcatch) />
			</cfcatch>
		</cftry>

	</cffunction>

	<!--- The script version of http doesn't suppose tab delimiter, it throws error.
		Use this method only when you want to return a query. --->
	<cffunction name="cfhttp" output="false">
		<cfargument name="method" default="" />
		<cfargument name="url" default="" />
		<cfargument name="delimiter" default="" />
		<cfargument name="textqualifier" default="" />

		<cfhttp method="#arguments.method#" url="#arguments.url#" name="result" firstrowasheaders="true" textqualifier="#arguments.textqualifier#" delimiter="#arguments.delimiter#">

		<cfreturn result />
	</cffunction>

	<cffunction name="cfsetting" output="false">
		<cfargument name="enablecfoutputonly" type="boolean" default="false" />
		<cfargument name="requesttimeout" type="numeric" default="30" />
		<cfargument name="showdebugoutput" type="boolean" default="false" />

		<cfsetting attributecollection="#arguments#" />
	</cffunction>

	<cffunction name="cffile" output="false">
		<cfargument name="action" type="string" />

		<cfset var result = "" />
		<cfset var attributes = duplicate(arguments) />
		<cfset structDelete(attributes, "action") />

		<cffile attributecollection="#attributes#" action="#arguments.action#" result="result" >

		<cfreturn result />
	</cffunction>

	<cffunction name="cfdirectory" output="false">
		<cfargument name="action" type="string" />

		<cfset var result = "" />
		<cfset var attributes = duplicate(arguments) />
		<cfset structDelete(attributes, "action") />

		<cfdirectory attributecollection="#attributes#" action="#arguments.action#" name="result" >

		<cfreturn result />
	</cffunction>

	<cffunction name="cfcontent" output="false">
		<cfargument name="type" type="string" />
		<cfargument name="file" type="string" />
		<cfargument name="deletefile" type="boolean" default="false" />

		<cfcontent attributecollection="#arguments#"  />
	</cffunction>

	<cffunction name="cfheader" output="false">
		<cfargument name="name" type="string" />
		<cfargument name="value" type="string" />

		<cfheader attributecollection="#arguments#"  />
	</cffunction>

	<cffunction name="cfmodule">
		<cfargument name="name" type="string" />
		<cfargument name="template" type="string" />
		<cfargument name="attributeCollection" type="struct" required="true" />

		<cfset var returnContent = "" />
		<cfif structKeyExists(arguments, "name")>
			<cfsavecontent variable="returnContent">
				<cfmodule name="#arguments.name#" attributecollection="#arguments.attributeCollection#" />
			</cfsavecontent>
		<cfelseif structKeyExists(arguments, "template")>
			<cfsavecontent variable="returnContent">
				<cfmodule template="#arguments.template#" attributecollection="#arguments.attributeCollection#" />
			</cfsavecontent>
		</cfif>

		<cfreturn returnContent />
	</cffunction>
</cfcomponent>