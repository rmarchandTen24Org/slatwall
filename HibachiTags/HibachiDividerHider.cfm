<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
=======
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "end">
	<cfset trimedContent = trim(thistag.generatedContent)>
	<cfset found = true />
	<cfloop condition="found eq true">
		<cfif left(trimedContent, 25) eq '<li class="divider"></li>'>
			<cfif len(trimedContent) gt 25>
				<cfset trimedContent = trim(right(trimedContent, len(trimedContent)-25)) />
			<cfelse>
				<cfset trimedContent = "" />
			</cfif>
		<cfelseif right(trimedContent, 25) eq '<li class="divider"></li>'>
			<cfif len(trimedContent) gt 25>
				<cfset trimedContent = trim(left(trimedContent, len(trimedContent)-25)) />
			<cfelse>
				<cfset trimedContent = "" />
			</cfif>
		<cfelse>
<<<<<<< HEAD
			<cfset found = false />	
=======
			<cfset found = false />
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
		</cfif>
	</cfloop>
	<cfset thisTag.generatedContent = trimedContent />
</cfif>