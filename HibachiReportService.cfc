<<<<<<< HEAD
<cfcomponent output="false" accessors="true" extends="HibachiService">
	
	<!--- ===================== START: Logical Methods =========================== --->
	
=======
<!---
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
--->
<cfcomponent output="false" accessors="true" extends="HibachiService">

	<!--- ===================== START: Logical Methods =========================== --->

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	<cfscript>
		public any function getReportCFC( required string reportName, required struct data={} ) {
			var reportCFC = getBean( arguments.reportName );
			reportCFC.populate( arguments.data );
			return reportCFC;
		}
	</cfscript>
<<<<<<< HEAD
	
	<cffunction name="getBuiltInReportsList">
		<cfset var reportFiles = "" />
		<cfset var reportsList = "" />
		
		<cfdirectory action="list" directory="#getApplicationValue('applicationRootMappingPath')#/model/report" name="reportFiles" />
		
=======

	<cffunction name="getBuiltInReportsList">
		<cfset var reportFiles = "" />
		<cfset var reportsList = "" />

		<cfdirectory action="list" directory="#getApplicationValue('applicationRootMappingPath')#/model/report" name="reportFiles" />

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		<cfloop query="reportFiles">
			<cfif listLast(reportFiles.name, '.') eq 'cfc' and reportFiles.name neq "HibachiReport.cfc">
				<cfset reportsList = listAppend(reportsList, listFirst(reportFiles.name, '.')) />
			</cfif>
		</cfloop>
<<<<<<< HEAD
		
		<cfreturn reportsList />
	</cffunction>
	
	<cffunction name="getCustomReportsList">
		<cfset var reportFiles = "" />
		<cfset var reportsList = "" />
		
		<cfset var builtInReportList = getBuiltInReportsList() />
		
		<cfdirectory action="list" directory="#getApplicationValue('applicationRootMappingPath')#/custom/model/report" name="reportFiles" />
		
=======

		<cfreturn reportsList />
	</cffunction>

	<cffunction name="getCustomReportsList">
		<cfset var reportFiles = "" />
		<cfset var reportsList = "" />

		<cfset var builtInReportList = getBuiltInReportsList() />

		<cfdirectory action="list" directory="#getApplicationValue('applicationRootMappingPath')#/custom/model/report" name="reportFiles" />

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		<cfloop query="reportFiles">
			<cfif listLast(reportFiles.name, '.') eq 'cfc' and reportFiles.name neq "HibachiReport.cfc" and not listFindNoCase(builtInReportList, listFirst(reportFiles.name, '.'))>
				<cfset reportsList = listAppend(reportsList, listFirst(reportFiles.name, '.')) />
			</cfif>
		</cfloop>
<<<<<<< HEAD
		
		<cfreturn reportsList />
	</cffunction>
	
	<!--- =====================  END: Logical Methods ============================ --->
	
	<!--- ===================== START: DAO Passthrough =========================== --->
	
	<!--- ===================== START: DAO Passthrough =========================== --->
	
	<!--- ===================== START: Process Methods =========================== --->
	
	<!--- =====================  END: Process Methods ============================ --->
	
	<!--- ====================== START: Status Methods =========================== --->
	
	<!--- ======================  END: Status Methods ============================ --->
	
	<!--- ====================== START: Save Overrides =========================== --->
	
	<!--- ======================  END: Save Overrides ============================ --->
	
	<!--- ==================== START: Smart List Overrides ======================= --->
	
	<!--- ====================  END: Smart List Overrides ======================== --->
	
	<!--- ====================== START: Get Overrides ============================ --->
	
	<!--- ======================  END: Get Overrides ============================= --->
	
=======

		<cfreturn reportsList />
	</cffunction>

	<!--- =====================  END: Logical Methods ============================ --->

	<!--- ===================== START: DAO Passthrough =========================== --->

	<!--- ===================== START: DAO Passthrough =========================== --->

	<!--- ===================== START: Process Methods =========================== --->

	<!--- =====================  END: Process Methods ============================ --->

	<!--- ====================== START: Status Methods =========================== --->

	<!--- ======================  END: Status Methods ============================ --->

	<!--- ====================== START: Save Overrides =========================== --->

	<!--- ======================  END: Save Overrides ============================ --->

	<!--- ==================== START: Smart List Overrides ======================= --->

	<!--- ====================  END: Smart List Overrides ======================== --->

	<!--- ====================== START: Get Overrides ============================ --->

	<!--- ======================  END: Get Overrides ============================= --->

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
</cfcomponent>