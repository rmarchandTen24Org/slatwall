<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	
	<!--- This param is used to create unique ID's for browser tests --->
	<cfparam name="request.propertyTableCount" default="0" />
	<cfset request.propertyTableCount++ />
	
=======
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">

	<!--- This param is used to create unique ID's for browser tests --->
	<cfparam name="request.propertyTableCount" default="0" />
	<cfset request.propertyTableCount++ />

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	<cfoutput>
		<div class="table-responsive">
			<table class="table table-condensed" id="hibachiPropertyTable#request.propertyTableCount#">
				<tbody>
	</cfoutput>
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
<cfelse>
	<cfoutput>
				</tbody>
			</table>
		</div>
	</cfoutput>
</cfif>