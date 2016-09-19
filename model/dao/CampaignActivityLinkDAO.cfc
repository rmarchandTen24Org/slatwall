<cfcomponent extends="HibachiDAO">

	<cffunction name="insertLink" returntype="void" access="public">
		<cfargument name="urls" required="true" />
		<cfargument name="campaignActivityID" required="true" />
		<!---<cfdump var="#arguments#" abort="true" />--->
		<cfquery name="deleteall">
            DELETE FROM SwCampaignActivityLink
            WHERE campaignActivityID = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.campaignActivityID#">
		</cfquery>

		<cfif arguments.urls NEQ ''>
			<cfloop index = "u" list = "#arguments.urls#" >
				<cfquery name="test" result="r">
		            INSERT INTO SwCampaignActivityLink (
							campaignActivityLinkID,
							url,
							campaignActivityID,
		                    createdDateTime,
		                    modifiedDateTime
						)
		            VALUES (
						<cfqueryparam cfsqltype="cf_sql_varchar" value="#lcase(replace(createUUID(),"-","","all"))#">,
						<cfqueryparam cfsqltype="cf_sql_varchar" value="#u#">,
						<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.campaignActivityID#">,
		                #now()#,
		                #now()#
					);
				</cfquery>


			</cfloop>
		</cfif>
	</cffunction>


</cfcomponent>