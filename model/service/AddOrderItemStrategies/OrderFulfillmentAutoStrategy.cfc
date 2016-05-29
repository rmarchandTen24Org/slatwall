component  displayname="OrderFulfillmentAutoStrategy" hint="Encapsulates Order Fulfillment Strategy" output="false" implements="IOrderFulfillmentStrategy" extends="Slatwall.org.hibachi.hibachiService" initmethod="OrderFulfillmentAutoStrategy" 
{
	property any processObject;
	property any orderFulfillment;
	
	public any function OrderFulfillmentAutoStrategy(any orderFulfillment, any processObject){
		setOrderFulfillment(arguments.orderFulfillment);
		setProcessObject(arguments.processObject);
	}
	
	public any function populateFulfillmentProperty(){
		return getOrderFulfillment();
	}
}