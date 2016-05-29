component  displayname="OrderFulfillmentShippingStrategy" hint="Encapsulates Add Order Item Fulfillment Logic for this type item" output="false" accessors="true" implements="IOrderFulfillmentStrategy"
{
	property any processObject;
	property any orderFulfillment;
	
	public any function OrderFulfillmentShippingStrategy(any orderfulfillment, any processObject){
		setOrderFulfillment(arguments.orderfulfillment);
		setProcessObject(arguments.processObject);
	}
	
	public any function populateFulfillmentProperty(){				
		// Check for an accountAddress
		if(len(getProcessObject().getShippingAccountAddressID())) {

			// Find the correct account address, and set it in the order fulfillment
			var accountAddress = getAccountService().getAccountAddress( getProcessObject().getShippingAccountAddressID() );
			getOrderFulfillment().setAccountAddress( accountAddress );

		// Otherwise try to setup a new shipping address
		} else {
			// Check to see if the new shipping address passes full validation.
			fullAddressErrors = getHibachiValidationService().validate( getProcessObject().getShippingAddress(), 'full', false );

			if(!fullAddressErrors.hasErrors()) {
				// First we need to persist the address from the processObject
				getAddressService().saveAddress( getProcessObject().getShippingAddress() );

				// If we are supposed to save the new address, then we can do that here
				if(getProcessObject().getSaveShippingAccountAddressFlag() && !isNull(getOrderFulfillment().getOrder().getAccount()) ) {

					var newAccountAddress = getAccountService().newAccountAddress();
					newAccountAddress.setAccount( getOrderFulfillment().getOrder().getAccount() );
					newAccountAddress.setAccountAddressName( getProcessObject().getSaveShippingAccountAddressName() );
					newAccountAddress.setAddress( getProcessObject().getShippingAddress() );
					variables.orderFulfillment.setAccountAddress( newAccountAddress );

				// Otherwise just set then new address in the order fulfillment
				} else {
					getOrderFulfillment().setShippingAddress( getProcessObject().getShippingAddress() );
				}
			}
		}
		return getOrderFulfillment();
	}
}