<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
=======
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.property" type="string" default="" />
	<cfparam name="attributes.view" type="string" default="" />
	<cfparam name="attributes.text" type="string" default="" />
	<cfparam name="attributes.tabid" type="string" default="" />
	<cfparam name="attributes.tabcontent" type="string" default="" />
	<cfparam name="attributes.params" type="struct" default="#structNew()#" />
	<cfparam name="attributes.count" type="string" default="" />
	<cfparam name="attributes.open" type="boolean" default="false" />
	<cfparam name="attributes.showOnCreateFlag" type="boolean" default="false" />
<<<<<<< HEAD
	
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	<cfassociate basetag="cf_HibachiEntityDetailGroup" datacollection="tabs">
</cfif>