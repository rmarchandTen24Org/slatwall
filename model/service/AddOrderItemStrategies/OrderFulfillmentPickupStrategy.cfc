component  displayname="OrderFulfillmentPickupStrategy" hint="Encapsulates Add Order Item Logic for Sale Type Items" output="false" implements="IOrderFulfillmentStrategy" extend="Slatwall.org.hibachi.hibachiService" initmethod="OrderFulfillmentPickupStrategy" 
{
	property any processObject;
	property any orderFulfillment;
	
	public any function OrderFulfillmentPickupStrategy(any orderFulfillment, any processObject){
		setOrderFulfillment(arguments.orderFulfillment);
		setProcessObject(arguments.processObject);
	}
	
	public any function populateFulfillmentProperty(){
		// Check for a pickupLocationID
		if(!isNull(getProcessObject().getPickupLocationID()) && len(getProcessObject().getPickupLocationID())) {
	
			// Find the pickup location
			var pickupLocation = getLocationService().getLocation(getProcessObject().getPickupLocationID());
	
			// if found set in the orderFulfillment
			if(!isNull(pickupLocation)) {
				getOrderFulfillment().setPickupLocation(pickupLocation);
			}
		}
		return getOrderFulfillment();
	}
}