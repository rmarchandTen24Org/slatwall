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

component accessors="true" output="false" displayname="FedEx" implements="Slatwall.integrationServices.ShippingInterface" extends="Slatwall.integrationServices.BaseShipping" {

	public any function init() {
		// Insert Custom Logic Here 
		variables.shippingMethods = {
		};
		return this;
	}
	
	public struct function getShippingMethods() {
		return variables.shippingMethods;
	}
	
	public string function getTrackingURL() {
		return "https://www.sefl.com/webconnect/tracing?Type=PN&RefNum1=${trackingNumber}";
	}

	private string function getFreightClass(required any lbs){
		if(lbs < 1){
			return '500';
		}else if(lbs > 1 && lbs < 2){
			return '400';
		}else if(lbs > 2 && lbs < 3){
			return '300';
		}else if(lbs > 3 && lbs < 4){
			return '250';
		}else if(lbs > 4 && lbs < 5){
			return '200';
		}else if(lbs > 5 && lbs < 6){
			return '175';
		}else if(lbs > 6 && lbs < 7){
			return '150';
		}else if(lbs > 7 && lbs < 8){
			return '125';
		}else if(lbs > 8 && lbs < 9){
			return '110';
		}else if(lbs > 9 && lbs < 10.5){
			return '100';
		}else if(lbs > 10.5 && lbs < 12){
			return '92.5';
		}else if(lbs > 12 && lbs < 13.5){
			return '85';
		}else if(lbs > 13.5 && lbs < 15){
			return '77.5';
		}else if(lbs > 15 && lbs < 22.5){
			return '70';
		}else if(lbs > 22.5 && lbs < 30){
			return '65';
		}else if(lbs > 30 && lbs < 35){
			return '60';
		}else if(lbs > 35 && lbs < 50){
			return '55';
		}else{
			throw('error');
		}
	}
	
	public any function getRates(required any requestBean) {

        // Setup Request
		var httpRequest = new http();
		httpRequest.setMethod("POST");
		httpRequest.setPort("443");
		httpRequest.setTimeout(45);
		httpRequest.setUrl("https://www.sefl.com/webconnect/ratequotes");

		httpRequest.setResolveurl(false);
		httpRequest.addParam(type="formfield",name="CustomerAccount",value="#setting('costumerAccount')#");
		httpRequest.addParam(type="formfield",name="Username",value="#setting('username')#");
		httpRequest.addParam(type="formfield",name="Password",value="#setting('password')#");
		httpRequest.addParam(type="formfield",name="CustomerName",value="DEMO");
		httpRequest.addParam(type="formfield",name="CustomerStreet",value="#arguments.requestBean.getShipToStreetAddress()#");
		httpRequest.addParam(type="formfield",name="CustomerCity",value="#arguments.requestBean.getShipToCity()#");
		httpRequest.addParam(type="formfield",name="CustomerState",value="#arguments.requestBean.getShipToStateCode()#");
		httpRequest.addParam(type="formfield",name="CustomerZip",value="#arguments.requestBean.getShipToPostalCode()#");
		httpRequest.addParam(type="formfield",name="DestinationZip",value="");
		httpRequest.addParam(type="formfield",name="DestCountry",value="U");
		httpRequest.addParam(type="formfield",name="OriginCity",value="#setting('originCity')#");
		httpRequest.addParam(type="formfield",name="OriginState",value="#setting('originState')#");
		httpRequest.addParam(type="formfield",name="OriginZip",value="#setting('originZip')#");
		httpRequest.addParam(type="formfield",name="OrigCountry",value="#left(setting('origCountry'),1)#");
		httpRequest.addParam(type="formfield",name="PickupDateDD",value="18");
		httpRequest.addParam(type="formfield",name="PickupDateMM",value="03");
		httpRequest.addParam(type="formfield",name="PickupDateYYYY",value="2016");
		httpRequest.addParam(type="formfield",name="Terms",value="P");
		httpRequest.addParam(type="formfield",name="Weight1",value="#arguments.requestBean.getTotalWeight(unitCode='lb')#");
		httpRequest.addParam(type="formfield",name="Class1",value="#getFreightClass(arguments.requestBean.getTotalWeight(unitCode='lb'))#");
		httpRequest.addParam(type="formfield",name="Option",value="S");
		httpRequest.addParam(type="formfield",name="rateXML",value="Y");
		httpRequest.addParam(type="formfield",name="returnX",value="Y");

		var xmlResponse = XmlParse(REReplace(httpRequest.send().getPrefix().fileContent, "^[^<]*", "", "one"));
		var responseBean = new Slatwall.model.transient.fulfillment.ShippingRatesResponseBean();
		responseBean.setData(xmlResponse);


		if(xmlResponse.root.quoteId.xmltext == 'null') {
			var message = "An unexpected communication error occured, please notify system administrator.";
			if(!isNull(xmlResponse.root.error) && len(xmlResponse.root.error.xmltext) > 0){
				message = xmlResponse.root.error.xmltext;
			}
			responseBean.addMessage(messageName="communicationError", message="#message#");
            //If XML fault then log error
			responseBean.addError("unknown", "#message#");
		}else {

			var quotes = [];
			var currentIndex = 0;

			for( var item in xmlResponse.root.details.XmlChildren){
				if(item.XmlName == 'typeCharge'){
					currentIndex++;
					quotes[currentIndex] = {};
				}
				StructInsert(quotes[currentIndex], item.XmlName, item.XmlText, true );
			}

			for(var i=1; i<=arrayLen(quotes); i++) {
				responseBean.addShippingMethod(
					shippingProviderMethod=quotes.typeCharge,
					totalCharge=quotes.charges
				);
			}

		}
		return responseBean;
	}
	
}

