<cfcomponent extends="HibachiDAO">

	<cffunction name="insertActivityAccount" access="public">
		<cfargument name="accounts" required="true" />
		<cfargument name="campaignActivityID" required="true" />
		<cfargument name="chunckSize" default="500" />

		<cfif arguments.chunckSize GT arraylen(arguments.accounts)>
			<cfset arguments.chunckSize = arraylen(arguments.accounts) />
		</cfif>

		<cftransaction>
			<cftry>
				<cfloop from="1" to="#arraylen(arguments.accounts)#" step="#arguments.chunckSize#" index="chunckIndex">
					<cfquery name="local.insertQuery" result="r">
					    INSERT INTO SwCampaignActivityAccount (
					        campaignActivityAccountID,
                            campaignActivityID,
                            accountID,
                            createdDateTime,
                            modifiedDateTime
                        ) VALUES
						<cfloop from="#chunckIndex#" to="#min(arraylen(arguments.accounts),chunckIndex+arguments.chunckSize-1)#" index="currentRow">
						<cfif chunckIndex NEQ currentRow>, </cfif>
                        (
							<cfqueryparam cfsqltype="cf_sql_varchar" value="#createSlatwallUUID()#" />,
							<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.campaignActivityID#" />,
							<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.accounts[currentRow]['accountID']#" />,
							#now()#,
							#now()#
                        )
					</cfloop>
					</cfquery>
				</cfloop>

				<cfcatch type="any">
					<cftransaction action="rollback" />
					<cfrethrow />
				</cfcatch>
			</cftry>
		</cftransaction>

	</cffunction>

</cfcomponent>