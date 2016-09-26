/*

    Slatwall - An Open Source eCommerce Platform
    Copyright (C) ten24, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    Linking this program statically or dynamically with other modules is
    making a combined work based on this program.  Thus, the terms and
    conditions of the GNU General Public License cover the whole
    combination.

    As a special exception, the copyright holders of this program give you
    permission to combine this program with independent modules and your
    custom code, regardless of the license terms of these independent
    modules, and to copy and distribute the resulting program under terms
    of your choice, provided that you follow these specific guidelines:

	- You also meet the terms and conditions of the license of each
	  independent module
	- You must not alter the default display of the Slatwall name or logo from
	  any part of the application
	- Your custom code must not alter or create any files inside Slatwall,
	  except in the following directories:
		/integrationServices/

	You may copy and distribute the modified version of this program that meets
	the above guidelines as a combined work under the terms of GPL for this program,
	provided that you include the source code of that other code when and as the
	GNU GPL requires distribution of source code.

    If you modify this program, you may extend this exception to your version
    of the program, but you are not obligated to do so.

Notes:

*/
component extends="HibachiService" persistent="false" accessors="true" output="false" {

	property name="campaignActivityLinkDAO" type="any";
	property name="campaignActivityAccountDAO" type="any";
	property name="campaignActivityTrackerDAO" type="any";

// ===================== START: Logical Methods ===========================
private any function newBroadcastStruct(required any broadcastid){
	return  {
		id = broadcastid,
		opens = 0,
		clicks = 0,
		bounces = 0,
		unsubscribes = 0
	};
}

// =====================  END: Logical Methods ============================

// ===================== START: DAO Passthrough ===========================

// ===================== START: DAO Passthrough ===========================

// ===================== START: Process Methods ===========================

	public any function processCampaignActivityTracker_getBroadcast(required any campaignActivityTracker, required any processObject) {
			getService("HibachiTagService").cfsetting(requesttimeout="600000");

		var fakedate = CreateDateTime(2015,6,10,17,45,38);


		var broadcasts = getService("send24Service").getLatestBroadcasts(fakedate);


		if(!arraylen(broadcasts)) return campaignActivityTracker;

		currentBroadcast = newBroadcastStruct(0);

		var currentBroadcastExists = false;
		var currentCampaignActivityID = 0;

		for(var broadcast in broadcasts){

			if(broadcast.broadcastID == '' || REFind('\${mailSubscriberID}:\${guid}', broadcast.LINK) > 0  || getCampaignActivityTrackerDAO().trackerRecordExists(broadcast) == true) {
				continue;
			}

			if(broadcast.broadcastID != currentBroadcast.id){
				if(currentCampaignID != 0){
					//update campaign Activity
					var tempCampaignActivity = getCampaignActivity(currentCampaignID);

					tempCampaignActivity.setTotalEmailOpen( val(tempCampaignActivity.getTotalEmailOpen) + currentBroadcast.opens);
					tempCampaignActivity.setTotalEmailClick( val(tempCampaignActivity.getTotalEmailClick()) + currentBroadcast.clicks);
					tempCampaignActivity.setTotalEmailBounce( val(tempCampaignActivity.getTotalEmailBounce()) + currentBroadcast.bounces);
					tempCampaignActivity.setTotalEmailUnsubscribe( val(tempCampaignActivity.getTotalEmailUnsubscribe()) + currentBroadcast.unsubscribes);
				}


				currentBroadcast = newBroadcastStruct(broadcast.broadcastID);
				var _temp = getCampaignActivityTrackerDAO().getCampaignActivityIDByBroadcastID(broadcast.broadcastID);
				if (_temp.recordCount == 1){
					currentCampaignID = _temp.campaingActivityID;
				}else{
					currentCampaignID = 0;
				}
			}

			if(broadcast.RESPONSETYPE == "GlobalUnsubscribe"){
				broadcast.RESPONSETYPE = "Unsubscribe";
			}


			if(currentCampaignID != 0){
				getMarketingEmailTrackerDAO().insertNotMarketingEmail(broadcast);

				//Sum to current broadcast
				switch(broadcast.RESPONSETYPE){
					case 'Open':
						currentBroadcast.opens += 1;
						break;
					case 'Click':
						currentBroadcast.clicks += 1;
						break;
					case 'Bounce':
						currentBroadcast.bounces += 1;
						break;
					case 'Unsubscribe':
						currentBroadcast.unsubscribes += 1;
						break;
				}
			}

		}
		arguments.rc.apiResponse.content.success = true;
		arguments.rc.apiResponse.content['data'] = 'Total : '&arraylen(broadcasts);


		return campaignActivityTracker;
	}

// =====================  END: Process Methods ============================

// ====================== START: Save Overrides ===========================

// ======================  END: Save Overrides ============================

// ==================== START: Smart List Overrides =======================

// ====================  END: Smart List Overrides ========================

// ====================== START: Get Overrides ============================

// ======================  END: Get Overrides =============================

}

