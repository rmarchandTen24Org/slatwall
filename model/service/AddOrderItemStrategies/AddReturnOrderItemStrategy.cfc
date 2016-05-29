component  displayname="AddReturnOrderItemStrategy" hint="Encapsulates Add Order Item Logic for Sale Type Items" output="false" accessors="true" implements="IAddOrderItemStrategy" extends="ConcreteAddOrderItemStrategy" initmethod="AddReturnOrderItemStrategy"    
{

	property boolean requiresFulfillment;
	property any order;
	property any processObject;
	property any returnOrder;
	property string orderItemType;
	
	public any function AddReturnOrderItemStrategy(any order, any processObject){
		setOrder(arguments.order);
		setProcessObject(arguments.processObject);
		setRequiresFulfillment(false); //this type requires a fulfillment
		setOrderItemType("oitReturn");
	}
	
	/** @Override Setup to create orderReturn instead of fulfillment. 
		For return orders, we need to setup the returnOrder instead of the order fulfillment */
	public any function setup(){
		// First see if we can use an existing order return
		var orderReturn = getProcessObject().getOrderReturn();

		// Next if we can't use an existing one, then we need to create a new one
		if(isNull(orderReturn) || orderReturn.getOrder().getOrderID() neq arguments.order.getOrderID()) {

			// Setup a new order return
			var orderReturn = this.newOrderReturn();
			orderReturn.setOrder( arguments.order );
			orderReturn.setCurrencyCode( arguments.order.getCurrencyCode() );
			orderReturn.setReturnLocation( getProcessObject().getReturnLocation() );
			orderReturn.setFulfillmentRefundAmount( getProcessObject().getFulfillmentRefundAmount() );
			orderReturn = this.saveOrderReturn( orderReturn );
			setReturnOrder(orderReturn);
		}
	}
	
	/** Populates the passed in orderItem with data specific to this type.
	*/
	public any function setupOrderItem(any orderItem){
		orderItem.setOrder( getOrder() );
		orderItem.setPublicRemoteID( getProcessObject().getPublicRemoteID() );
		orderItem.setReturnOrder( getReturnOrder() );
		orderItem.setOrderItemType( getService("TypeService").getTypeBySystemCode(getOrderItemType()));
		orderItem = super.setupOrderItem(orderItem);
		return orderItem;
	}	
}