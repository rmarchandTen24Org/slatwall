component displayname="GenerateTokenTransaction" implements="Slatwall.integrationServices.stripe.TransactionStrategies.IPaymentTransaction" hint="Represents a payment transaction" initmethod="GenerateTokenTransaction" output="false" accessors="true" extends="ConcretePaymentTransaction"   
{
	/** FIELDS */
	property any requestBean;
	property any responseBean;
	property struct requestData;
	property struct responseData;
	
	/** CTOR */
	public any function GenerateTokenTransaction(any requestBean, any responseBean){
		super.concretePaymentTransaction(requestBean, responseBean);
		setRequestBean(arguments.requestBean);
		setResponseBean(arguments.responseBean);
		setRequestData({});
		setResponseData({});
	}
	
	public any function processPaymentTransaction(){
		// create charge token for future authorization or authorization and charge
		// two methods using Stripe can achieve functionality
		// either create a persistent Stripe customer with default card information attached or use a short-lived one-time single use token to represent the card
		
		var createTokenRequest = new http();
		createTokenRequest.setMethod("post");
		createTokenRequest.setCharset("utf-8");
		
		if (setting("generateTokenBehavior") == "deferred")
		{
			// automatically creates a Stripe customer and stores default credit card
			// allows card to be authorized at any time (deferred long term)
			createTokenRequest.setUrl("#setting('apiUrl')#/#setting('apiVersion')#/customers");
			createTokenRequest.addParam(type="header", name="authorization", value="bearer #super.getActiveSecretKey()#");
			createTokenRequest.addParam(type="formfield", name="email", value="#getRequestBean().getAccountPrimaryEmailAddress()#");
			createTokenRequest.addParam(type="formfield", name="description", value="#generateDescription(getRequestBean())#");
		}
		else if (setting("generateTokenBehavior") == "immediate")
		{
			// creates a temporary short-lived "one-time use" token to be used for authorization (immediate near term)
			createTokenRequest.setUrl("#setting('apiUrl')#/#setting('apiVersion')#/tokens");
			createTokenRequest.addParam(type="header", name="authorization", value="bearer #super.getActivePublicKey()#");
		}
		
		// attach card data to request
		createTokenRequest = super.populateRequestParamsWithCardInfo(getRequestBean(), createTokenRequest);
		setResponseData(deserializeResponse(createTokenRequest.send().getPrefix()));
		
		// populate response
		if (getResponseData().success)
		{
			responseBean.setProviderToken(getResponseData().result.id); // will be either tokenId or customerId depending on generateTokenBehavior
			responseBean.addMessage(messageName="stripe.id", message="#getResponseData().result.id#");
			responseBean.addMessage(messageName="stripe.object", message="#getResponseData().result.object#");
			responseBean.addMessage(messageName="stripe.livemode", message="#getResponseData().result.livemode#");
			if (getResponseData().result.object == "customer")
			{
				responseBean.addMessage(messageName="stripe.defaultcard", message="#getResponseData().result.default_source#");
			}
		}
		else
		{
			// error occurred
			setResponseBean(super.handleResponseErrors(getResponseBean(), getResponseData()));
		}
	}
	public any function setActivePublicKey(any key){
		super.setActivePublicKey(key);
	}
	
	public any function setActiveSecretKey(any key){
		super.setActiveSecretKey(key);
	}
}