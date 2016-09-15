<cfcomponent extends="HibachiDAO">

	<cffunction name="insertAccount" returntype="void" access="public">
		<cfargument name="accountIDs" required="true" />
		<cfargument name="campaignActivityID" required="true" />
		<cfif arguments.accountIDs NEQ ''>
			<cfquery name="test" result="r">
                INSERT INTO
                    CampaignActivityAccount (
                        campaignActivityAccountID,
                        campaignActivityID,
                        accountID,
                        createdDateTime,
                        modifiedDateTime
                    )
                SELECT
                    REPLACE(newid(),'-','') as campaignActivityAccountID,
                    <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.campaignActivityID#" /> AS campaignActivityID,
	                accountID,
	                getDate() as createdDateTime,
	                getDate() as modifiedDateTime
	            FROM
	                Account
	            WHERE
                    Account.accountID in (#listQualify(arguments.accountIDs,"'")#)
			</cfquery>
		</cfif>
	</cffunction>

</cfcomponent>