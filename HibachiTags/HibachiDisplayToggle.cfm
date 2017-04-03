<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.hibachiScope" type="any" default="#request.context.fw.getHibachiScope()#" />
	
=======
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.hibachiScope" type="any" default="#request.context.fw.getHibachiScope()#" />

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
	<cfparam name="attributes.selector" type="string" />
	<cfparam name="attributes.showValues" type="string" default="1">
	<cfparam name="attributes.valueAttribute" type="string" default="" />
	<cfparam name="attributes.loadVisable" type="string" default="false" />
<<<<<<< HEAD
	
	<cfset id = createUUID() />
	
	<cfoutput><div id="#id#" class="hibachi-display-toggle#attributes.hibachiScope.getService('hibachiUtilityService').hibachiTernary(attributes.loadVisable, '', ' hide')#" data-hibachi-selector="#attributes.selector#" data-hibachi-show-values="#attributes.showValues#" data-hibachi-value-attribute="#attributes.valueAttribute#"></cfoutput>
=======

	<cfset id = createUUID() />

	<cfoutput><div id="#id#" class="hibachi-display-toggle#iif(attributes.loadVisable, de(''), de(' hide'))#" data-hibachi-selector="#attributes.selector#" data-hibachi-show-values="#attributes.showValues#" data-hibachi-value-attribute="#attributes.valueAttribute#"></cfoutput>
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
<cfelse>
	</div>
</cfif>
