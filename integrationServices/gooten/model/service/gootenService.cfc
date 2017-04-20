component accessors="true" extends="Slatwall.org.hibachi.HibachiService"{
	property name="integration" type="any";
	property name="recipeID" type="string";
	property name="partnerBillingKey" type="string";
	property name="apiURL" type="string";
	property name="testMode" type="boolean";

	public any function init(){
		setIntegration(getService('integrationService').getIntegrationByIntegrationPackage('gooten'));
		setRecipeID(getIntegration().setting('recipeID'));
		setPartnerBillingKey(getIntegration().setting('partnerBillingKey'));
		setApiURL(getIntegration().setting('apiURL'));
		setTestMode(getIntegration().setting('testMode'));
		return this;
	}

	public any function checkGootenOrder(required any order){
		var gootenItems = getGootenItems(arguments.order.getOrderItems());
		if(arrayLen(gootenItems)){
			var gootenOrder = createGootenOrder(arguments.order, gootenItems);
			sendGootenOrder(gootenOrder);
			//ADD GOOTEN ORDER ID TO DAKINE ORDER REMOTE ENTITY KINE SPOT
		}
	}

	public any function createGootenOrder(required any order, required any gootenItems){
		var gootenShipping = getGootenShipping(arguments.order);
		var gootenBilling = getGootenBilling(gootenShipping);
		var gootenPayment = getGootenPayment();

		var gootenOrder={
			'ShipToAddress'=gootenShipping,
			'BillingAddress'=gootenBilling,
			'Items'=arguments.gootenItems,
			'Payment'=gootenPayment,
			'SourceId'=arguments.order.getOrderID()
		};

		if(getTestMode()){
			gootenOrder['IsInTestMode'] = true;
		}

		return gootenOrder;
	}

	public any function sendGootenOrder(required any gootenOrder){
		var requestBean = new Slatwall.model.transient.data.DataRequestBean();
		requestBean.setURLString(getApiURL()&'orders');
		requestBean.setMethod('POST');
		requestBean.setQueryString('?recipeid=' & urlEncodedFormat(getRecipeID()));
		requestBean.setContentType('application/json');
		requestBean.setBody(serializeJSON(arguments.gootenOrder));
		writeDump(requestBean.getResponseBean());abort;
	}

	public array function getGootenItems(required array orderItems){
		var gootenItems = [];
		for(var orderItem in arguments.orderItems){
			if(orderItem.getSku().getProduct().getProductType().getProductTypeName() == 'Gooten'){
				var gootenSku = {
					'SKU'=orderItem.getSku().getSkuCode(),
					'ShipCarrierMethodId'='1',
					'Quantity'=orderItem.getQuantity()
				};
				arrayAppend(gootenItems,gootenSku);
			}
		}
		return gootenItems;
	}

	public struct function getGootenShipping(required any order){
		for(var orderItem in arguments.order.getOrderItems()){
			if(orderItem.getSku().getProduct().getProductType().getProductTypeName() == 'Gooten'){
				var shippingAddress = orderItem.getOrderFulfillment().getShippingAddress();
			}
		}
		var gootenShipping = {};
		gootenShipping['FirstName']= (!isNull(shippingAddress.getFirstName())) ? shippingAddress.getFirstName() : listFirst(shippingAddress.getName(),' ');
		gootenShipping['LastName']= (!isNull(shippingAddress.getLastName())) ? shippingAddress.getLastName() : listLast(shippingAddress.getName(),' ');
		gootenShipping['Line1'] = shippingAddress.getStreetAddress();

		if(!isNull(shippingAddress.getStreet2Address())){
			gootenShipping['Line2'] = shippingAddress.getStreet2Address();
		}

		gootenShipping['City'] = shippingAddress.getCity();
		if(!isNull(shippingAddress.getStateCode())){
			gootenShipping['State'] = shippingAddress.getStateCode();
		}else if(!isNull(shippingAddress.getLocality())){
			gootenShipping['State'] = shippingAddress.getLocality();
		}

		gootenShipping['PostalCode'] = shippingAddress.getPostalCode();

		if(!isNull(shippingAddress.getCountryCode())){
			gootenShipping['CountryCode'] = shippingAddress.getCountryCode();
		}else{
			gootenShipping['CountryCode'] = 'US';
		}

		gootenShipping['Email'] = arguments.order.getAccount().getPrimaryEmailAddress().getEmailAddress();
		if(!isNull(arguments.order.getAccount().getPrimaryPhoneNumber().getPhoneNumber())){
			gootenShipping['Phone'] = arguments.order.getAccount().getPrimaryPhoneNumber().getPhoneNumber();
		}else{
			gootenShipping['Phone'] = '1-111-111-1111';
		}
		return gootenShipping;
	}

	public struct function getGootenBilling(required any gootenShipping){
		var gootenBilling = {};
		gootenBilling['FirstName'] = gootenShipping['FirstName'];
		gootenBilling['LastName'] = gootenShipping['LastName'];
		gootenBilling['PostalCode'] = gootenShipping['PostalCode'];
		gootenBilling['CountryCode'] = gootenShipping['CountryCode'];
		return gootenBilling;
	}

	public any function getGootenPayment(){
		return {'PartnerBillingKey'=getPartnerBillingKey()};
	}

}