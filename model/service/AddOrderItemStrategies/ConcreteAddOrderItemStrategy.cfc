component  displayname="ConcreteAddOrderItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="IAddOrderItemStrategy" initmethod="ConcreteAddOrderItemStrategy" 
{
	property boolean skuExistsOnFulfillment;
	property any foundOrderItem;
	property boolean requiresFulfillment;
	property any order;
	property any processObject;
	property any orderFulfillment;
	property any orderItemType;
	
	public any function ConcreteAddOrderItemStrategy(any order, any processObject){
		setOrder(arguments.order);
		setProcessObject(arguments.processObject);
		setRequiresFulfillment(true); //this type requires a fulfillment
		setSkuExistsOnFulfillment(false);
	}
	
	public any function setup(){
		
		// First check if we can use an existing order fulfillment
		var orderFulfillment = getProcessObject().getOrderFulfillment();
		
		// Next if orderFulfillment is still null, then we can check the order to see if there is already an orderFulfillment
		if(isNull(orderFulfillment) && ( isNull(getProcessObject().getOrderFulfillmentID()) || getProcessObject().getOrderFulfillmentID() != 'new' ) && arrayLen(getOrder().getOrderFulfillments())) {
			for(var f=1; f<=arrayLen(getOrder().getOrderFulfillments()); f++) {
				if(listFindNoCase(getProcessObject().getSku().setting('skuEligibleFulfillmentMethods'), getOrder().getOrderFulfillments()[f].getFulfillmentMethod().getFulfillmentMethodID()) ) {
					var orderFulfillment = getOrder().getOrderFulfillments()[f];
					break;
				}
			}
		}
		
		// Last if we can't use an existing one, then we need to create a new one
		if(isNull(orderFulfillment) || orderFulfillment.getOrder().getOrderID() != getOrder().getOrderID()) {

			// get the correct fulfillment method for this new order fulfillment
			var fulfillmentMethod = getProcessObject().getFulfillmentMethod();

			// If the fulfillmentMethod is still null because the above didn't execute, then we can pull it in from the first ID in the sku settings
			if(isNull(fulfillmentMethod) && listLen(getProcessObject().getSku().setting('skuEligibleFulfillmentMethods'))) {
				var fulfillmentMethod = getFulfillmentService().getFulfillmentMethod( listFirst(getProcessObject().getSku().setting('skuEligibleFulfillmentMethods')) );
			}

			if(!isNull(fulfillmentMethod)) {
				
				// Setup a new order fulfillment
				var orderFulfillment = this.newOrderFulfillment();
				
				orderFulfillment.setFulfillmentMethod( fulfillmentMethod );
				orderFulfillment.setCurrencyCode( getOrder().getCurrencyCode() );
				orderFulfillment.setOrder( getOrder() );

				// Setup Fulfillment Method Object
				var fulfillmentStrategy = orderFulfillment.getAddOrderItemFulfillmentStrategy(getProcessObject());
				
				//Setup Fulfillment Method Specific Values - such as email, shipping address, or pickup location.
				orderFulfillment = fulfillmentStrategy.populateFulfillmentProperty();
				
				//Save the fulfillment
				orderFulfillment = this.saveOrderFulfillment( orderFulfillment );
                
                //Set the local orderFulfillment
                setOrderFulfillment(orderFulfillment);
                
                //check the fulfillment and display errors if needed.
                if (orderFulfillment.hasErrors()){
                    getOrder().addError('addOrderItem', orderFulfillment.getErrors());
                }

			} else {

				getProcessObject().addError('fulfillmentMethodID', rbKey('validate.processOrder_addOrderitem.orderFulfillmentID.noValidFulfillmentMethod'));

			}

		}

		// Check for the sku in the orderFulfillment already, so long that the order doens't have any errors
		if(!getOrder().hasErrors()) {
			setSkuExistsOnFulfillment(isSkuOnFulfillment());
			if (getSkuExistsOnFulfillment()){
				var oi = getFoundOrderItem();
				oi.setQuantity(oi.getQuantity() + getProcessObject().getQuantity());
				oi.validate(context='save');
				if(oi.hasErrors()) {
					getOrder().addError('addOrderItem', oi.getErrors());
				}
			}
		}
	}
	
	/** 
	 * This function checks for a sku on an fulfillment. If found, it sets the foundOrderItem property to the found orderItem.
	 */
	public any function isSkuOnFulfillment(){
		for(var orderItem in orderFulfillment.getOrderFulfillmentItems()){
			// If the sku, price, attributes & stock all match then just increase the quantity
			if(getProcessObject().matchesOrderItem( orderItem )){
				setFoundOrderItem(orderItem);
				return true;
			}
		}
		return false;
	}
	
	/** Populates the passed in orderItem with data specific to this type.
	*/
	public any function setupOrderItem(any orderItem){
		//if you require a fulfillment, it should be set on the extending class in this same method.
		orderItem.setOrder( getOrder() );
		orderItem.setPublicRemoteID( getProcessObject().getPublicRemoteID() );
		
		// Setup child items for a bundle
		if( getProcessObject().getSku().getBaseProductType() == 'productBundle' ) {
			if(arraylen(getProcessObject().getChildOrderItems())){
				for(var childOrderItemData in getProcessObject().getChildOrderItems()) {
					var childOrderItem = this.newOrderItem();
					getService("OrderService").populateChildOrderItems(orderItem, childOrderItem, childOrderItemData, getOrder(), getOrderFulfillment());
				}
			}
		}
	
		// Setup the Sku / Quantity / Price details
		orderItem.setSku( getProcessObject().getSku() );
		orderItem.setCurrencyCode( getOrder().getCurrencyCode() );
		orderItem.setQuantity( getProcessObject().getQuantity() );
		orderItem.setSkuPrice( getProcessObject().getSku().getPriceByCurrencyCode( getOrder().getCurrencyCode() ) );
		
			// If the sku is allowed to have a user defined price OR the current account has permissions to edit price
			if(((!isNull(orderItem.getSku().getUserDefinedPriceFlag()) && orderItem.getSku().getUserDefinedPriceFlag())||
					(getHibachiScope().getLoggedInAsAdminFlag() && getHibachiAuthenticationService().authenticateEntityPropertyCrudByAccount(crudType='update', entityName='orderItem', propertyName='price', account=getHibachiScope().getAccount()))
				) && isNumeric(getProcessObject().getPrice()) ) {
				orderItem.setPrice( getProcessObject().getPrice() );
			} else {
				orderItem.setPrice( getProcessObject().getSku().getPriceByCurrencyCode( getOrder().getCurrencyCode() ) );
			}

			// If a stock was passed in assign it to this new item
			if( !isNull(getProcessObject().getStock()) ) {
				orderItem.setStock( getProcessObject().getStock() );
			}

			// If attributeValues were passed in set them
			if( !isNull(getProcessObject().getAttributeValuesByCodeStruct()) ) {
				for(var attributeCode in getProcessObject().getAttributeValuesByCodeStruct() ) {
					orderItem.setAttributeValue( attributeCode, getProcessObject().getAttributeValuesByCodeStruct()[attributeCode] );
				}
			}

			// Save the new order items
			orderItem = this.saveOrderItem( orderItem );

			if(orderItem.hasErrors()) {
				getOrder().addError('addOrderItem', orderItem.getErrors());
			}
		
		
		return orderItem;
	}
	
	public boolean function getRequiresFulfillment(){
		return variables.requiresFulfillment;
	}
}