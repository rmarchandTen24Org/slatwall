<cfcomponent extends="HibachiDAO">

	<cffunction name="broadcastExists" access="public" returntype="boolean" >
		<cfargument name="broadcastID" required="true"/>
		<cfquery name="local.test">
				SELECT
					*
				FROM
					SwCampaignActivity
				WHERE
					send24BroadcastID = <cfqueryparam value="#trim(arguments.broadcastID)#" />
		</cfquery>
		<cfreturn test.RecordCount GT 0/>
	</cffunction>


	<cffunction name="getCampaignActivityIDByBroadcastID" access="public" returntype="any" >
		<cfargument name="broadcastID" required="true"/>
		<cfset var campaignActivity = "">
		<cfquery name="campaignActivity">
				SELECT
					CampaignActivityID
				FROM
					SwCampaignActivity
				WHERE
					send24BroadcastID = <cfqueryparam value="#trim(arguments.broadcastID)#" />
		</cfquery>
		<cfreturn campaignActivity/>
	</cffunction>


	<cffunction name="trackerRecordExists" access="public" returntype="boolean" >
		<cfargument name="broadcast" required="true"/>
		<cfquery name="local.test">
			SELECT
				*
            FROM
                SwCampaignActivityTracker
            LEFT JOIN
                SwCampaignActivityLink ON SwCampaignActivityTracker.campaignActivityLinkID = SwCampaignActivityLink.campaignActivityLinkID
            LEFT JOIN
                SwCampaignActivityAccount ON SwCampaignActivityTracker.campaignActivityAccountID = SwCampaignActivityAccount.campaignActivityAccountID
            LEFT JOIN
                SwAccount ON SwCampaignActivityAccount.accountID = SwAccount.accountID
            LEFT JOIN
                SwAccountEmailAddress ON SwAccount.accountID = SwAccountEmailAddress.accountID
            WHERE
                SwCampaignActivityTracker.broadcastID = <cfqueryparam value="#trim(arguments.broadcast.BROADCASTID)#" />
            AND
                SwCampaignActivityTracker.broadcastType = <cfqueryparam value="#trim(arguments.broadcast.RESPONSETYPE)#" />
            AND
                SwCampaignActivityLink.url = <cfqueryparam value="#trim(arguments.broadcast.LINK)#" />
            AND
                LOWER(SwAccountEmailAddress.emailAddress) = <cfqueryparam value="#lcase(trim(arguments.broadcast.EMAILADDRESS))#" />
		</cfquery>
		<cfreturn test.RecordCount GT 0/>
	</cffunction>




    <cffunction name="insertCampaignActivityTracker" returntype="void" access="public">
		<cfargument name="broadcast"  required="true"/>

		<cfquery name="local.test" result="local.result">
				INSERT INTO
					swCampaignActivityTracker (
						campaignActivityTrackerID,
						broadcastID,
						broadcastType,
						broadcastDatetime,
						url,
						campaignActivityAccountID,
						campaignActivityLinkID,
						createdDateTime,
						modifiedDateTime
					)
					SELECT
						<cfqueryparam cfsqltype="cf_sql_varchar" value="#createSlatwallUUID()#" /> campaignActivityTrackerID,
						<cfqueryparam value="#trim(arguments.broadcast.BROADCASTID)#" />  broadcastID,
						<cfqueryparam value="#trim(arguments.broadcast.RESPONSETYPE)#" />  broadcastType,
						<cfqueryparam value="#trim(arguments.broadcast.RESPONSEDATE)#" />  broadcastDatetime,
						<cfqueryparam value="#trim(arguments.broadcast.LINK)#" />  url,
                        SwCampaignActivityAccount.campaignActivityAccountID campaignActivityAccountID,
                        SwCampaignActivityLink.campaignActivityLinkID campaignActivityLinkID,
						#now()# createdDateTime,
						#now()# modifiedDateTime

					FROM
						SwCampaignActivityAccount
			            INNER JOIN SwCampaignActivity ON SwCampaignActivityAccount.campaignActivityID = SwCampaignActivity.campaignActivityID
						LEFT JOIN SwCampaignActivityLink on SwCampaignActivity.campaignActivityID = SwCampaignActivityLink.campaignActivityID

			            INNER JOIN SwAccount ON SwCampaignActivityAccount.accountID  = SwAccount.accountID
                        INNER JOIN SwAccountEmailAddress ON SwAccount.primaryEmailAddressID  = SwAccountEmailAddress.accountEmailAddressID
				    WHERE
                        SwCampaignActivity.send24BroadcastID = <cfqueryparam value="#trim(arguments.broadcast.BROADCASTID)#" />
					AND
						LOWER(SwAccountEmailAddress.emailAddress) = <cfqueryparam value="#lcase(trim(arguments.broadcast.EMAILADDRESS))#" />

		</cfquery>
</cffunction>



</cfcomponent>