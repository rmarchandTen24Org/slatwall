component displayname="AuthorizeAndChargeTransaction" implements="Slatwall.model.transient.payment.TransactionStrategies.IPaymentTransaction.cfc" hint="Represents a payment transaction" initmethod="AuthorizeAndChargeTransaction" output="false" accessors="true" extends="ConcretePaymentTransaction"    
{
	/** FIELDS */
	property any requestBean;
	property any responseBean;
	property struct requestData;
	property struct responseData;
	
	/** CTOR */
	public any function AuthorizeAndChargeTransaction(any requestBean, any responseBean){
		super.concretePaymentTransaction(requestBean, responseBean);
		setRequestBean(arguments.requestBean);
		setResponseBean(arguments.rresponseBean);
		setRequestData({});
		setResponseData({});
	}
	
	public any function processPaymentTransaction(){
		// authorize only or authorize and charge
		
		var authorizeChargeRequest = new http();
		authorizeChargeRequest.setMethod("post");
		authorizeChargeRequest.setCharset("utf-8");
		authorizeChargeRequest.setUrl("#setting('apiUrl')#/#setting('apiVersion')#/charges");
		
		
		if(!isNull(getRequestBean().getProviderToken())) {
			
			var generateTokenMethodUsed = "";
			
			// need to determine which method the provider token was generated with using either Stripe customer or single-use card token
			// inspect the token id format 
			if(refindNoCase("^cus_\S+", getRequestBean().getProviderToken()))
			{
				// deferred must populate customer field (default attached card will be used automatically during Stripe processing)
				generateTokenMethodUsed = "deferred";
				authorizeChargeRequest.addParam(type="formfield", name="customer", value="#getRequestBean().getProviderToken()#");
			}
			else if (refindNoCase("^tok_\S+", getRequestBean().getProviderToken()))
			{
				// immediate must populate card field
				generateTokenMethodUsed = "immediate";
				authorizeChargeRequest.addParam(type="formfield", name="card", value="#getRequestBean().getProviderToken()#");
			}
			else
			{
				getResponseBean().addError(errorName="stripe.error", errorMessage="Using invalid token");
			}	
		}
		else if (!isNull(getRequestBean().getCreditCardNumber()))
		{
			// attach card data to request
			super.populateRequestParamsWithCardInfo(getRequestBean(), authorizeChargeRequest);
		}
		
		authorizeChargeRequest.addParam(type="header", name="authorization", value="bearer #super.getActiveSecretKey()#");
		authorizeChargeRequest.addParam(type="formfield", name="description", value="#super.generateDescription(getRequestBean())#");
		authorizeChargeRequest.addParam(type="formfield", name="currency", value="#getRequestBean().getTransactionCurrency()#");
		authorizeChargeRequest.addParam(type="formfield", name="amount", value="#int(getRequestBean().getTransactionAmount() * 100)#"); // amount as integer (eg. eliminate cents)
		
		// authorize and charge
		authorizeChargeRequest.addParam(type="formfield", name="capture", value="true");
	
		setResponseData(deserializeResponse(authorizeChargeRequest.send().getPrefix()));
		
		// populate response
		if (getResponseData().success) {
			getResponseBean().setProviderToken(getRequestBean().getProviderToken()); // manually persist
			getResponseBean().setAuthorizationCode(getResponseData().result.id);
			getResponseBean().setAmountAuthorized(getResponseData().result.amount / 100); // need to convert back to decimal from integer
			
			// additional capture information
			getResponseBean().setAmountCharged(getResponseData().result.amount / 100); // need to convert back to decimal from integer
			getResponseBean().setAuthorizationCodeInvalidFlag(false);
			
			// add messages to response
			getResponseBean().addMessage(messageName="stripe.id", message="#getResponseData().result.id#");
			getResponseBean().addMessage(messageName="stripe.captured", message="#getResponseData().result.captured#");
			getResponseBean().addMessage(messageName="stripe.card", message="#getResponseData().result.source.id#");
			getResponseBean().addMessage(messageName="stripe.last4", message="#getResponseData().result.source.last4#");
			getResponseBean().addMessage(messageName="stripe.expiration", message="#getResponseData().result.source.exp_month#-#getResponseData().result.source.exp_year#");
			getResponseBean().addMessage(messageName="stripe.amount", message="#getResponseData().result.amount/100#");
			if (!isNull(getResponseData().result.customer))
			{
				getResponseBean().addMessage(messageName="stripe.customer", message="#getResponseData().result.customer#");
			}
		} else {
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