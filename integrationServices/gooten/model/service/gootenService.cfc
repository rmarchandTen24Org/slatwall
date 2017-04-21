component accessors="true" extends="Slatwall.org.hibachi.HibachiService"{
	property name="integration" type="any";
	property name="recipeID" type="string";
	property name="partnerBillingKey" type="string";
	property name="stagingRecipeID" type="string";
	property name="stagingPartnerBillingKey" type="string";
	property name="apiURL" type="string";
	property name="stagingAPIUrl" type="string";
	property name="stagingMode" type="boolean";
	property name="testMode" type="boolean";
	property name="gootenDAO" type="any";

	public any function init(){
		setGootenDAO(getDAO('gootenDAO'));
		setIntegration(getService('integrationService').getIntegrationByIntegrationPackage('gooten'));
		setRecipeID(getIntegration().setting('recipeID'));
		setPartnerBillingKey(getIntegration().setting('partnerBillingKey'));
		setStagingRecipeID(getIntegration().setting('stagingRecipeID'));
		setStagingPartnerBillingKey(getIntegration().setting('stagingPartnerBillingKey'));
		setApiURL(getIntegration().setting('apiURL'));
		setStagingAPIURL(getIntegration().setting('stagingApiURL'));
		setTestMode(getIntegration().setting('testMode'));
		setStagingMode(getIntegration().setting('stagingMode'));
		return this;
	}

	public any function checkGootenOrder(required any order){
		var gootenItems = getGootenItems(arguments.order.getOrderItems());
		if(arrayLen(gootenItems)){
			var gootenOrder = createGootenOrder(arguments.order, gootenItems);
			var gootenID = sendGootenOrder(gootenOrder);
			if(len(gootenID)){
				arguments.order.setRemoteID(gootenID);
			}
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

	public string function sendGootenOrder(required any gootenOrder){
		var requestBean = new Slatwall.model.transient.data.DataRequestBean();
		var apiUrl = getStagingMode() ? getStagingAPIURL() : getAPIUrl();
		requestBean.setURLString(apiUrl&'orders');
		requestBean.setMethod('POST');
		requestBean.setQueryString(getRecipeIDQueryString());
		requestBean.setContentType('application/json');
		requestBean.setBody(serializeJSON(arguments.gootenOrder));

		var responseBean = requestBean.getResponseBean();
		var responseData = responseBean.getData();

		//Will retry as part of scheduled task
		if(structKeyExists(responseData, 'HadError') && responseData['HadError']){
			logHibachi('Error syncing order #orderNumber# to Gooten.');
			return '';
		}
		try{
			return responseData['id'];
		}catch(any e){
			logHibachi('Error syncing order #orderNumber# to Gooten.');
		}
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

	public any function pullGootenOrder(required any order){
		var requestBean = new Slatwall.model.transient.data.DataRequestBean();

		var apiUrl = getAPIUrl();

		requestBean.setURLString(apiUrl&'orders');
		requestBean.setMethod('GET');
		requestBean.setQueryString(getRecipeIDQueryString(false) & '&id='&order.getRemoteID());

		var responseData = requestBean.getResponseBean().getData();

		return responseData;
	}

	public any function syncGootenOrderStatus(required any order, required any gootenOrder){
		for(var gootenItem in gootenOrder.items){
			if(structKeyExists(gootenItem, 'Meta') && structKeyExists(gootenItem.meta,'PreconfigSku')){
				var skuCode = gootenItem.meta.preconfigSku;
			}else{
				var skuCode = gootenItem.Sku;
			}
			if(gootenItem.Status == 'Test'){ //Needs to be 'Delivered'
				for(var item in order.getOrderItems()){
					if(item.getSku().getSkuCode() == skuCode){
						var orderItem = item;
					}
				}
				if(!arrayLen(orderItem.getOrderDeliveryItems())){
					var stock = getGootenDAO().getGootenStock(skuCode);
					var orderDelivery = this.newOrderDelivery();

					orderDelivery.setOrder(order);
					orderDelivery.setLocation(stock.getLocation());
					orderDelivery.setFulfillmentMethod(orderItem.getOrderFulfillment().getFulfillmentMethod());

					var orderDeliveryItem = this.newOrderDeliveryItem();
					orderDeliveryItem.setOrderItem(orderItem);
					orderDeliveryItem.setOrderDelivery(orderDelivery);
					orderDeliveryItem.setQuantity(gootenItem.quantity);
					orderDeliveryItem.setStock(stock);

					this.saveOrderDelivery(orderDelivery);
					this.saveOrderDeliveryItem(orderDeliveryItem);
					getHibachiScope().flushOrmSession();
				}
			}
		}
	}

	public any function getGootenPayment(){
		var partnerBillingKey = getStagingMode() ? getStagingPartnerBillingKey() : getPartnerBillingKey();
		return {'PartnerBillingKey'=partnerBillingKey};
	}

	private string function getRecipeIDQueryString(boolean staging=true){
		if(!getStagingMode() || arguments.staging == false){
			arguments.staging = false;
		}
		var recipeID = arguments.staging ? getStagingRecipeID() : getRecipeID();
		return '?recipeid=' & urlEncodedFormat(recipeID);
	}

}