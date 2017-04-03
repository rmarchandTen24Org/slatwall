<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfparam name="attributes.fluidDisplay" type="boolean" default="true" />
<cfparam name="attributes.divAttributes" type="string" default="" />

=======
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfparam name="attributes.fluidDisplay" type="boolean" default="true" />
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476

<cfif thisTag.executionMode is "start">
	<cfoutput>
		<cfif attributes.fluidDisplay>
<<<<<<< HEAD
			<div class="row" #attributes.divAttributes#>
		<cfelse>
			<div class="row" #attributes.divAttributes#>
=======
			<div class="row">
		<cfelse>
			<div class="row">
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		</cfif>
	</cfoutput>
<cfelse>
	<cfoutput>
		</div>
	</cfoutput>
</cfif>