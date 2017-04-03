<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
=======
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "end">
	<cfset attributes.generatedContent = thistag.generatedContent />
	<cfset thistag.generatedContent = "" />
	<cfassociate basetag="cf_HibachiListingDisplay" datacollection="buttonGroup">
</cfif>