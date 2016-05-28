component  displayname="OrderFulfillmentPickupStrategy" hint="Encapsulates Add Order Item Logic for Sale Type Items" output="false" implements="IAddOrderItemStrategy"
{
	public any function OrderFulfillmentPickupStrategy(any orderFulfillment, any processObject){
		variables.orderFulfillment = arguments.orderFulfillment;
		variables.processObject = arguments.processObject;
	}
	
	public any function populateOrderFulfillmentProperty(){
		// Check for a pickupLocationID
		if(!isNull(variables.processObject.getPickupLocationID()) && len(variables.processObject.getPickupLocationID())) {
	
			// Find the pickup location
			var pickupLocation = getLocationService().getLocation(variables.processObject.getPickupLocationID());
	
			// if found set in the orderFulfillment
			if(!isNull(pickupLocation)) {
				variables.orderFulfillment.setPickupLocation(pickupLocation);
			}
		}
		return variables.orderFulfillment;
	}
}