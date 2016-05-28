component  displayname="OrderFulfillmentEmailStrategy" hint="Encapsulates Order Fulfillment Strategy" output="false" implements="IOrderFulfillmentStrategy"
{
	
	public any function OrderFulfillmentEmailStrategy(any orderFulfillment, any processObject){
		variables.orderFulfillment = arguments.orderFulfillment;
		variables.processObject = arguments.processObject;
	}
	
	
	public any function populateFulfillmentProperty(){
		// Check for an email address
		if(!isNull(variables.processObject.getEmailAddress()) && len(variables.processObject.getEmailAddress())) {
			variables.orderFulfillment.setEmailAddress( variables.processObject.getEmailAddress() );
		}
		return variables.orderFulfillment;
	}
}