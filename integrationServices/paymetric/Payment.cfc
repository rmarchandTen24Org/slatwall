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

component accessors="true" output="false" displayname="Paymetric XiPay" implements="Slatwall.integrationServices.PaymentInterface" extends="Slatwall.integrationServices.BasePayment" {

	//Global variables
	variables.packetOperations = {};

	public any function init(){
		variables.transactionCodes = {
			authorize="1",
			authorizeAndCharge="16",
			chargePreAuthorization="1",
			credit="1",
			void="10",
			inquiry="19"
		};

		return this;
	}

	public string function getPaymentMethodTypes() {
		return "creditCard";
	}

	public any function processCreditCard(required any requestBean){
		var requestData = getRequestData(requestBean);
		transactionResponse = getTransactionResponse(requestData);
		return getResponseBean(rawResponse, requestData, requestBean);
	}

	private struct function getRequestData(required any requestBean){
		var transactionHeader = getTransient('PaymetricITransactionHeader');

		transactionHeader.setAmount(arguments.requestBean.getTransactionAmount());
		transactionHeader.setCurrencyCode(arguments.requestBean.getTransactionCurrency());
		transactionHeader.setCardNumber(arguments.requestBean.getCreditCardNumber());
		transactionHeader.setCardCVV2(arguments.requestBean.getSecurityCode());
		transactionHeader.setCardExpirationDate('#arguments.requestBean.getExpirationMonth()#/#arguments.requestBean.getExpirationYear()#');
		transactionHeader.setCardHolderName(arguments.requestBean.getNameOnCreditCard());
		transactionHeader.setCardHolderAddress1(arguments.requestBean.getBillingStreetAddress());
		transactionHeader.setCardHolderAddress2(arguments.requestBean.getBillingStreet2Address());
		transactionHeader.setCardHolderCity(arguments.requestBean.getbillingCity());
		transactionHeader.setCardHolderDistrict(arguments.requestBean.getbillingLocality())
		transactionHeader.setCardHolderCountry(arguments.requestBean.getbillingCountryCode());
		transactionHeader.setCardHolderState(arguments.requestBean.getbillingStateCode());
		return transactionHeader.getRequestData();
	}

	private any function getTransactionResponse(required any requestData){
		var packetsObject = getTransient('PaymetricIPacketsObject');
		packetsObject.addPacket(arguments.requestData);
		packetsObject.getResponse();
		return packetsObject;
	}

	private any function getResponseBean(required struct rawResponse, required any requestData, required any requestBean){
		var response = new Slatwall.model.transient.payment.CreditCardTransactionResponseBean();

		// Parse The Raw Response Data Into a Struct
		var responseDataArray = listToArray(rawResponse.fileContent,variables.responseDelimiter,true);

		var responseData = {};
		responseData.responseCode = responseDataArray[1];
		responseData.responseSubCode = responseDataArray[2];
		responseData.responseReasonCode = responseDataArray[3];
		responseData.responseReasonText = responseDataArray[4];
		responseData.authorizationCode = responseDataArray[5];
		responseData.avsResponse = responseDataArray[6];
		responseData.transactionID = responseDataArray[7];
		responseData.invoiceNumber = responseDataArray[8];
		responseData.description = responseDataArray[9];
		responseData.amount = responseDataArray[10];
		responseData.method = responseDataArray[11];
		responseData.transactionType = responseDataArray[12];
		responseData.customerID = responseDataArray[13];
		responseData.firstName = responseDataArray[14];
		responseData.lastName = responseDataArray[15];
		responseData.company = responseDataArray[16];
		responseData.address = responseDataArray[17];
		responseData.city = responseDataArray[18];
		responseData.state = responseDataArray[19];
		responseData.zipCode = responseDataArray[20];
		responseData.country = responseDataArray[21];
		responseData.phone = responseDataArray[22];
		responseData.fax = responseDataArray[23];
		responseData.emailAddress = responseDataArray[24];
		responseData.shipToFirstName = responseDataArray[25];
		responseData.shipToLastName = responseDataArray[26];
		responseData.shipToCompany = responseDataArray[27];
		responseData.shipToAddress = responseDataArray[28];
		responseData.shipToCity = responseDataArray[29];
		responseData.shipToState = responseDataArray[30];
		responseData.shipToZipCode = responseDataArray[31];
		responseData.shipToCountry = responseDataArray[32];
		responseData.tax = responseDataArray[33];
		responseData.duty = responseDataArray[34];
		responseData.freight = responseDataArray[35];
		responseData.taxExempt = responseDataArray[36];
		responseData.purchaseOrderNumber = responseDataArray[37];
		responseData.md5Hash = responseDataArray[38];
		responseData.cardCodeResponse = responseDataArray[39];
		responseData.cardholderAuthenticationVerification = responseDataArray[40];
		// Gap in array here is intential per Authroize.net Spec... they send back blank values in array
		responseData.response = responseDataArray[51];
		responseData.accountNumber = responseDataArray[52];
		// Again array is actually 68 index's long, but they only use the first 52

		// Populate the data with the raw response & request
		var data = {
			responseData = arguments.rawResponse,
			requestData = arguments.requestData
		};

		response.setData(data);

		// Add message for what happened
		response.addMessage(messageName=responseData.responseReasonCode, message=responseData.responseReasonText);

		// Set the response Code
		response.setStatusCode( responseData.responseCode );

		// Check to see if it was successful
		if(responseData.responseCode != 1) {
			// Transaction did not go through
			response.addError(responseData.responseReasonCode, responseData.responseReasonText);
		} else {
			if(requestBean.getTransactionType() == "authorize") {
				response.setAmountAuthorized( responseData.amount );
			} else if(requestBean.getTransactionType() == "authorizeAndCharge") {
				response.setAmountAuthorized(  responseData.amount );
				response.setAmountCharged(  responseData.amount  );
			} else if(requestBean.getTransactionType() == "chargePreAuthorization") {
				response.setAmountCharged(  responseData.amount  );
			} else if(requestBean.getTransactionType() == "credit") {
				response.setAmountCredited(  responseData.amount  );
			}
		}

		response.setTransactionID( responseData.transactionID );
		response.setAuthorizationCode( responseData.authorizationCode );

		if( responseData.avsResponse == "B" || responseData.avsResponse == "P" ) {
			response.setAVSCode( "U" );
		} else {
			response.setAVSCode( responseData.avsResponse );
		}

		if( responseData.cardCodeResponse == 'M') {
			response.setSecurityCodeMatch(true);
		} else {
			response.setSecurityCodeMatch(false);
		}

		return response;
	}

}

