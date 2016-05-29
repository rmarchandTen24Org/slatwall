component  displayname="AddSaleOrderItemStrategy" hint="Encapsulates Add Order Item Logic for Sale Type Items" output="false" accessors="true" implements="IAddOrderItemStrategy" extends="ConcreteAddOrderItemStrategy"  
{
	
	public any function AddSaleOrderItemStrategy(any order, any processObject){
		super(order, processObject);
		super.setOrderItemType("oitSale");
	}
	
	public any function setup(){
		super.setup();
	}
	
	/** 
	 * This function checks for a sku on an fulfillment. If found, it sets the foundOrderItem property to the found orderItem.
	 */
	public any function isSkuOnFulfillment(){
		return super.isSkuOnFulfillment();
	}
	
	/** Populates the passed in orderItem with data specific to this type.
	*/
	public any function populateNewOrderItem(any orderItem){
		super.populateNewOrderItem(orderItem);
		orderItem.setOrderFulfillment(super.getOrderFulfillment());
		orderItem.setOrderItemType( getService("TypeService").getTypeBySystemCode(super.getOrderItemType()) );
	}
}