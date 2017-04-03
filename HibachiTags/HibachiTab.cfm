<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.property" type="string" default="" />
	<cfparam name="attributes.view" type="string" default="" />
	<cfparam name="attributes.text" type="string" default="" />
	<cfparam name="attributes.tabid" type="string" default="" />
	<cfparam name="attributes.tabcontent" type="string" default="" />
	<cfparam name="attributes.params" type="struct" default="#structNew()#" />
	<cfparam name="attributes.count" type="string" default="" />
	
	<cfassociate basetag="cf_HibachiTabGroup" datacollection="tabs">
=======
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.property" type="string" default="" />
	<cfparam name="attributes.view" type="string" default="" />
	<cfparam name="attributes.text" type="string" default="" />
	<cfparam name="attributes.tabid" type="string" default="" />
	<cfparam name="attributes.tabcontent" type="string" default="" />
	<cfparam name="attributes.params" type="struct" default="#structNew()#" />
	<cfparam name="attributes.count" type="string" default="" />

	<cfassociate basetag="cf_HibachiTabGroup" datacollection="tabs">
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
</cfif>