component displayname="CreditTransaction" implements="Slatwall.integrationServices.stripe.TransactionStrategies.IPaymentTransaction" hint="Represents a payment transaction" initmethod="CreditTransaction" output="false" accessors="true" 
{
	/** FIELDS */
	property any requestBean;
	property any responseBean;
	property struct requestData;
	property struct responseData;
	
	/** CTOR */
	public any function CreditTransaction(any requestBean, any responseBean){
		setRequestBean(arguments.requestBean);
		setResponseBean(arguments.responseBean);
		setRequestData({});
		setResponseData({});
	}
	/** HANDLES MAKING THE API CALL */
	public any function processPaymentTransaction(){
		// get id of charge to refund and the amount to be refunded
		var chargeID = requestBean.getOriginalAuthorizationCode();
		var amountCredited = int(requestBean.getTransactionAmount() * 100);
					
		// refund charge
		var refundRequest = new http();
		refundRequest.setMethod("post");
		refundRequest.setCharset("utf-8");
		refundRequest.setUrl("#setting('apiUrl')#/#setting('apiVersion')#/charges/#chargeID#/refund");
		refundRequest.addParam(type="header", name="authorization", value="bearer #super.getActiveSecretKey()#");
		refundRequest.addParam(type="formfield", name="amount", value="#amountCredited#"); // amount as integer (eg. eliminate cents)
		
		setResponseData(deserializeResponse(refundRequest.send().getPrefix()));
		
		// populate response
		if (getResponseData().success)
		{
			getResponseBean().setProviderToken(requestBean.getProviderToken()); // manually persist
			getResponseBean().setAuthorizationCode(getResponseData().result.id);
			
			var amount = 0;
			for ( var refund in getResponseData().result.refunds.data ) {
				amount += refund.amount;
			}
			
			getResponseBean().setAmountCredited(amount / 100); // need to convert back to decimal from integer

			// add messages to response
			getResponseBean().addMessage(messageName="stripe.id", message="#getResponseData().result.id#");
			getResponseBean().addMessage(messageName="stripe.captured", message="#getResponseData().result.captured#");
			if (isDefined("getResponseData().result.card")){
				getResponseBean().addMessage(messageName="stripe.card", message="#getResponseData().result.card.id#");
				getResponseBean().addMessage(messageName="stripe.last4", message="#getResponseData().result.card.last4#");
				getResponseBean().addMessage(messageName="stripe.expiration", message="#getResponseData().result.card.exp_month#-#getResponseData().result.card.exp_year#");
			}
			if (isDefined("getResponseData().result.source") && getResponseData().result.source.object == "card"){
				getResponseBean().addMessage(messageName="stripe.card", message="#getResponseData().result.source.id#");
				getResponseBean().addMessage(messageName="stripe.last4", message="#getResponseData().result.source.last4#");
				getResponseBean().addMessage(messageName="stripe.expiration", message="#getResponseData().result.source.exp_month#-#getResponseData().result.source.exp_year#");
			}
			getResponseBean().addMessage(messageName="stripe.amountrefunded", message="#amount/100#"); // need to convert back to decimal from integer
			if (!isNull(getResponseData().result.customer))
			{
				getResponseBean().addMessage(messageName="stripe.customer", message="#getResponseData().result.customer#");
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