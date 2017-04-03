<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.divClass" type="string" default="col-md-12" />
	<cfparam name="request.context.edit" type="boolean" default="false" />
	<cfparam name="attributes.edit" type="boolean" default="#request.context.edit#" />

	<cfoutput>
		<div class="<cfif len(attributes.divClass)>#attributes.divClass#<cfelse>col-md-12</cfif>">
			<cfif attributes.edit>
				<div class="s-property form-horizontal">
			<cfelse>
				<div class="s-property-info form-horizontal">
			</cfif>
	</cfoutput>
<cfelse>
	<cfoutput>
			<cfif attributes.edit>
				</div>
			<cfelse>
				</div>
			</cfif>
		</div>
	</cfoutput>
</cfif>
=======
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.divClass" type="string" default="col-md-12" />
	<cfparam name="request.context.edit" type="boolean" default="false" />
	<cfparam name="attributes.edit" type="boolean" default="#request.context.edit#" />

	<cfoutput>
		<div class="#attributes.divClass#">
			<cfif attributes.edit>
				<div class="form-horizontal">
			<cfelse>
				<div class="form-horizontal  s-property-info">
			</cfif>
	</cfoutput>
<cfelse>
	<cfoutput>
			<cfif attributes.edit>
				</div>
			<cfelse>
				</div>
			</cfif>
		</div>
	</cfoutput>
</cfif>
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
