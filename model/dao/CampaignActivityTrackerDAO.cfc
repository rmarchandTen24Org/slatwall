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



</cfcomponent>