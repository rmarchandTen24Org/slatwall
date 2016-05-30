component displayname="ConcretePaymentTransaction" implements="Slatwall.integrationServices.stripe.TransactionStrategies.IPaymentTransaction" hint="Represents a payment transaction" initmethod="ConcretePaymentTransaction" output="false" accessors="true" extends="Slatwall.integrationServices.BasePayment" 
{
	/** FIELDS */
	property any requestBean;
	property any responseBean;
	property string activePublicKey;
	property string activeSecretKey;
	
	/** CTOR */
	public any function ConcretePaymentTransaction(any requestBean, any responseBean){
		setRequestBean(arguments.requestBean);
		setResponseBean(arguments.responseBean);
	}
	/** HANDLES MAKING THE API CALL */
	public any function processPaymentTransaction(){}
	
	/** ACCESSORS */
	public any function setActivePublicKey(any key){
		variables.activePublicKey = arguments.key;
	}
	public any function setActiveSecretKey(any key){
		variables.activeSecretKey = arguments.key;
	}
	public any function getActivePublicKey(any key){
		return variables.activePublicKey;
	}
	public any function getActiveSecretKey(any key){
		return variables.activeSecretKey;
	}
	/** Deserializes and returns an api response */
	private struct function deserializeResponse(required any httpResponse)
	{
		
		var response = {
			statusCode = arguments.httpResponse.responseheader.status_code,
			success = arguments.httpResponse.responseheader.status_code eq 200
		};
		
		// filecontent may be of type java.io.ByteArrayOutputStream
		if(isSimpleValue(arguments.httpResponse.filecontent)) {
			response.rawResponse = arguments.httpResponse.filecontent;
		}
		else {
			response.rawResponse = arguments.httpResponse.filecontent.toString("UTF-8");
		}
		
		if (response.success)
		{
			response.result = deserializeJSON(response.rawResponse);
		}
		else
		{
			// appending because "error" key is only child struct of the raw response)
			structAppend(response, deserializeJSON(response.rawResponse));
		}
		
		return response;
	}
	/** Populates an http request with data */
	private any function populateRequestParamsWithCardInfo(required any requestBean, required any httpRequest)
	{
		if(!isNull(requestBean.getCreditCardNumber())) {
          httpRequest.addParam(type="formfield", name="card[number]", value="#requestBean.getCreditCardNumber()#");
        }
        if(!isNull(requestBean.getSecurityCode())) {
          httpRequest.addParam(type="formfield", name="card[cvc]", value="#requestBean.getSecurityCode()#");
        }
        if(!isNull(requestBean.getExpirationMonth())) {
          httpRequest.addParam(type="formfield", name="card[exp_month]", value="#requestBean.getExpirationMonth()#");
        }
        if(!isNull(requestBean.getExpirationYear())) {
          httpRequest.addParam(type="formfield", name="card[exp_year]", value="#requestBean.getExpirationYear()#");
        }
        if(!isNull(requestBean.getNameOnCreditCard())) {
          httpRequest.addParam(type="formfield", name="card[name]", value="#requestBean.getNameOnCreditCard()#");
        }
        if(!isNull(requestBean.getBillingStreetAddress())) {
          httpRequest.addParam(type="formfield", name="card[address_line1]", value="#requestBean.getBillingStreetAddress()#");
        }   
        if(!isNull(requestBean.getBillingStreet2Address())) {
            httpRequest.addParam(type="formfield", name="card[address_line2]", value="#requestBean.getBillingStreet2Address()#");
        }
        if(!isNull(requestBean.getBillingCity())) {
          httpRequest.addParam(type="formfield", name="card[address_city]", value="#requestBean.getBillingCity()#");
        }
        if(!isNull(requestBean.getBillingStateCode())) {
          httpRequest.addParam(type="formfield", name="card[address_state]", value="#requestBean.getBillingStateCode()#");
        }
        if(!isNull(requestBean.getBillingPostalCode())) {
          httpRequest.addParam(type="formfield", name="card[address_zip]", value="#requestBean.getBillingPostalCode()#");
        }
        if(!isNull(requestBean.getBillingCountryCode())) {
          httpRequest.addParam(type="formfield", name="card[address_country]", value="#requestBean.getBillingCountryCode()#");
        }
        return httpRequest;
	}
	
	/** Generates the description common to all types */
	private string function generateDescription(required any requestBean)
	{
		return "Created by Slatwall. AccountID: #requestBean.getAccountID()#, OrderID: #requestBean.getOrderID()#, OrderPaymentID: #requestBean.getOrderPaymentID()#, TransactionID: #requestBean.getTransactionID()#, Account Name: #requestBean.getAccountFirstName()# #requestBean.getAccountLastName()#, Primary Phone: #requestBean.getAccountPrimaryPhoneNumber()#, Primary Email #requestBean.getAccountPrimaryEmailAddress()#, Billing Name: #requestBean.getBillingName()#";
	}
	
	/** Handles returning the errors for all types */
	private any function handleResponseErrors(required any responseBean, required any responseData)
	{
		// display error and store error details
		responseBean.addError(errorName="stripe.error", errorMessage="#responseData.error.message#");
		responseBean.addMessage(messageName="stripe.error.message", message="#responseData.error.message#");
		if (!isNull(responseData.error.type))
		{
			responseBean.addMessage(messageName="stripe.error.type", message="#responseData.error.type#");
		}
		if (!isNull(responseData.error.code))
		{
			responseBean.addMessage(messageName="stripe.error.code", message="#responseData.error.code#");
		}
		if(!isNull(responseData.error.param))
		{
			responseBean.addMessage(messageName="stripe.error.param", message="#responseData.error.param#");
		}
		return responseBean;
	}	
}