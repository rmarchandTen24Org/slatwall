component displayname="ChargePreAuthorizationTransaction" implements="Slatwall.integrationServices.stripe.TransactionStrategies.IPaymentTransaction" hint="Represents a payment transaction" initmethod="ChargePreAuthorizationTransaction" output="false" accessors="true" extends="ConcretePaymentTransaction"    
{
	/** FIELDS */
	property any requestBean;
	property any responseBean;
	property struct requestData;
	property struct responseData;
	
	/** CTOR */
	public any function ChargePreAuthorizationTransaction(any requestBean, any responseBean){
		super.concretePaymentTransaction(requestBean, responseBean);
		setRequestBean(arguments.requestBean);
		setResponseBean(arguments.rresponseBean);
		setRequestData({});
		setResponseData({});
	}
	
	public any function processPaymentTransaction(){
		// capture prior authorized charge	
		var chargeID = requestBean.getPreAuthorizationCode();
		
		var chargeRequest = new http();
		chargeRequest.setMethod("post");
		chargeRequest.setCharset("utf-8");
		chargeRequest.setUrl("#setting('apiUrl')#/#setting('apiVersion')#/charges/#chargeID#/capture");
		chargeRequest.addParam(type="header", name="authorization", value="bearer #super.getActiveSecretKey()#");
		// api allows for an optional override of authorized transaction amount (amount can be lesser or equal to authorized charge but not greater)
		chargeRequest.addParam(type="formfield", name="amount", value="#int(requestBean.getTransactionAmount() * 100)#"); // amount as integer (eg. eliminate cents)
		setResponseData(deserializeResponse(chargeRequest.send().getPrefix()));
		
		responseBean.setProviderToken(requestBean.getProviderToken()); // manually persist
		
		// populate response
		if (getResponseData().success)
		{
			responseBean.setAmountCharged(getResponseData().result.amount / 100); // need to convert back to decimal from integer
			responseBean.setAuthorizationCodeInvalidFlag(false);
			
			// add messages to response
			responseBean.addMessage(messageName="stripe.id", message="#getResponseData().result.id#");
			responseBean.addMessage(messageName="stripe.card", message="#getResponseData().result.card.id#");
			responseBean.addMessage(messageName="stripe.last4", message="#getResponseData().result.card.last4#");
			responseBean.addMessage(messageName="stripe.expiration", message="#getResponseData().result.card.exp_month#-#getResponseData().result.card.exp_year#");
			responseBean.addMessage(messageName="stripe.amount", message="#getResponseData().result.amount / 100#");
			if (!isNull(getResponseData().result.customer))
			{
				responseBean.addMessage(messageName="stripe.customer", message="#getResponseData().result.customer#");
			}
		}
		else
		{
			// error occurred
			setResponseBean(super.handleResponseErrors(getResponseBean(), getResponseData()));
		}
		return getResponseBean();
	}
	public any function setActivePublicKey(any key){
		super.setActivePublicKey(key);
	}
	
	public any function setActiveSecretKey(any key){
		super.setActiveSecretKey(key);
	}
}