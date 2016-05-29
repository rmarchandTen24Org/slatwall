component  displayname="OrderFulfillmentEmailStrategy" hint="Encapsulates Order Fulfillment Strategy" output="false" implements="IOrderFulfillmentStrategy" extend="Slatwall.org.hibachi.hibachiService" initmethod="OrderFulfillmentEmailStrategy" 
{
	property any processObject;
	property any orderFulfillment;
	
	public any function OrderFulfillmentEmailStrategy(any orderFulfillment, any processObject){
		setOrderFulfillment(arguments.orderFulfillment);
		setProcessObject(arguments.processObject);
	}
	
	public any function populateFulfillmentProperty(){
		// Check for an email address
		if(!isNull(getProcessObject().getEmailAddress()) && len(getProcessObject().getEmailAddress())) {
			getOrderFulfillment().setEmailAddress( getProcessObject().getEmailAddress() );
		}
		return getOrderFulfillment();
	}
}