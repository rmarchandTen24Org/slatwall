component extends="Slatwall.model.service.HibachiService" accessors="true" output="false" {

	property any integration;

	public any function init(){
		variables.integration = getService("integrationService").getIntegrationByIntegrationPackage("send24");
	}

	private string function getSend24Auth(){
		return 'Basic '&ToBase64(integration.setting('basicAuthUser') & ":" & integration.setting('basicAuthPassword'));
	}

	private string function buildSend24URL(required string endpoint){

		var url ='http://' & integration.setting('companyName');

		// remove starting slash if it exists to prevent double slashs
		endpoint = REReplace(endpoint, "^\/", "");
		if(integration.setting('testingFlag')){
			url = url & '.send24dev.com/index.cfm/api/' & endpoint & '?apiKey=' & integration.setting('apikeyDev') &  '&throw=1';
		}else{
			url = url & '.send24web.com/index.cfm/api/'& endpoint & '?apiKey=' & integration.setting('apikeyProd');
		}
		return url;
	}

	public any function send24Request(required string method, required string endpoint, any data){
		var httpService = new http();
		httpService.setMethod(arguments.method);
		httpService.setCharset("utf-8");
		httpService.setUrl(buildSend24URL(arguments.endpoint));
		if(structKeyExists(arguments,'data')){
			httpService.addParam(type="header",name="content-type",value="application/json");
			httpService.addParam(type="body",value=serializeJSON(data));
		}
		if(len(integration.setting('basicAuthUser')) && len(integration.setting('basicAuthPassword'))){
			httpService.addParam(type="header",name="Authorization",value=getSend24Auth());
		}
		return httpService.send().GetPrefix();
	}


	public any function createEmail(required struct emailConfig){

		var result = send24Request('post','email', emailConfig);
		if(!result.statuscode contains "201") {
			throw("Bad status code creating Email");
		}
		return result.Filecontent;
	}

	public any function updateEmail(required string emailID, required struct emailConfig){

		var result = send24Request('put','email/'&emailID, emailConfig);
		if(!result.statuscode contains "200") {
			throw("Bad status code updating Email");
		}
		return result.Filecontent;
	}

	public any function createMailingList(required string name, required string description){

		var result =  send24Request('post','mailinglist', {
			'name' = arguments.name,
			'description' = arguments.description
		});
		if(!result.statuscode contains "201") {
			throw("Bad status code creating mailinglist");
		}
		return result.Filecontent;
	}

	public boolean function addSubscribers(required string mailingListID, required any subscribers, required string columnNames, required string administratorID){
		var body ={};
		body['subscribersList'] = arguments.subscribers;
		body['columnNames'] = arguments.columnNames;
		body['mailingListIDs'] = arguments.mailingListID;
		body['importAction'] = "subscribe";
		body['administratorID'] = arguments.administratorID;
		body['async'] = false;

		var result = send24Request('post','subscriberList', body);
		if(!result.statuscode contains "200") {
			throw("Bad status code importing subscriberList");
		}
		return true;
	}

	public any function sendEmail(required string emailID, required string mailingListID){

		var result = send24Request('post','broadcast', {
			'emailID' = arguments.emailID,
			'mailingListID' = arguments.mailingListID
		});

		if(!result.statuscode contains "201") {
			throw("Bad status code sending Email");
		}
		return result.Filecontent;
	}

	public any function sendTestEmail(required string emailID, required string testEmailAddress){

		var result = send24Request('post','broadcast', {
			'emailID' = arguments.emailID,
			'testBroadcastFlag' = true,
			'testBroadcastEmailAddresses' = arguments.testEmailAddress
		});

		if(!result.statuscode contains "201") {
			throw(result.Filecontent);
		}
		return result.Filecontent;
	}

	public any function getLatestBroadcasts(any fromDatetime){
		try{
			arguments.fromDatetime = dateTimeFormat(DateAdd('d', -1, arguments.fromDatetime), 'yyyyMMddHHnnss');
		}catch(any e){
			throw(e);
		}

		var result = send24Request('get','broadcasts/#fromDatetime#');

		if(!result.statuscode contains "200"){
			throw("Bad status code getting Broadcasts");
		}

		if(isJSON(result.Filecontent)){
			return deserializeJSON(result.Filecontent);
		}else{
			return [];
		}
	}

	public any function getTempates(){
		var result = send24Request('get','emailTemplate');

		if(!result.statuscode contains "200"){
			throw("Bad status code getting Templates");
		}

		if(isJSON(result.Filecontent)){
			return deserializeJSON(result.Filecontent);
		}else{
			return [];
		}
	}
}