<cfcomponent extends="HibachiDAO">

	<cffunction name="insertLink" returntype="void" access="public">
		<cfargument name="urls" required="true" />
		<cfargument name="campaignActivityID" required="true" />

		<cfquery name="deleteall">
            DELETE FROM CmpaignActivityLink
            WHERE campaignActivityID = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.campaignActivityID#">
		</cfquery>

		<cfif arguments.urls NEQ ''>
			<cfloop index = "u" list = "#arguments.urls#" >
				<cfquery name="test" result="r">
		            INSERT INTO CampaignActivityLink (
							campaignActivityLinkID,
							url,
							campaignActivityID,
		                    createdDateTime,
		                    modifiedDateTime
						)
		            VALUES (
						REPLACE(newid(),'-',''),
						<cfqueryparam cfsqltype="cf_sql_varchar" value="#u#">,
						<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.campaignActivityID#">,
		                getDate(),
		                getDate()
					);
				</cfquery>
			</cfloop>
		</cfif>
	</cffunction>


</cfcomponent>