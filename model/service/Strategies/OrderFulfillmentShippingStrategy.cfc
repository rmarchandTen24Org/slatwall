component  displayname="OrderFulfillmentShippingStrategy" hint="Encapsulates Add Order Item Fulfillment Logic for this type item" output="false" implements="IAddOrderItemStrategy"
{
	
	public any function OrderFulfillmentShippingStrategy(any orderfulfillment, any processObject){
		variables.orderFulfillment = arguments.orderfulfillment;
		variables.processObject = arguments.processObject;
	}
	
	public any function populateFulfillmentProperty(){				
		// Check for an accountAddress
		if(len(variables.processObject.getShippingAccountAddressID())) {

			// Find the correct account address, and set it in the order fulfillment
			var accountAddress = getAccountService().getAccountAddress( variables.processObject.getShippingAccountAddressID() );
			variables.orderFulfillment.setAccountAddress( accountAddress );

		// Otherwise try to setup a new shipping address
		} else {
			// Check to see if the new shipping address passes full validation.
			fullAddressErrors = getHibachiValidationService().validate( variables.processObject.getShippingAddress(), 'full', false );

			if(!fullAddressErrors.hasErrors()) {
				// First we need to persist the address from the processObject
				getAddressService().saveAddress( variables.processObject.getShippingAddress() );

				// If we are supposed to save the new address, then we can do that here
				if(variables.processObject.getSaveShippingAccountAddressFlag() && !isNull(variables.orderFulfillment.getOrder().getAccount()) ) {

					var newAccountAddress = getAccountService().newAccountAddress();
					newAccountAddress.setAccount( arguments.order.getAccount() );
					newAccountAddress.setAccountAddressName( variables.processObject.getSaveShippingAccountAddressName() );
					newAccountAddress.setAddress( variables.processObject.getShippingAddress() );
					variables.orderFulfillment.setAccountAddress( newAccountAddress );

				// Otherwise just set then new address in the order fulfillment
				} else {
					variables.orderFulfillment.setShippingAddress( variables.processObject.getShippingAddress() );
				}
			}
		}
		return variables.orderFulfillment;
	}
}