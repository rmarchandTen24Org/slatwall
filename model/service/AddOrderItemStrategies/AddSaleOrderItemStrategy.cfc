component  displayname="AddSaleOrderItemStrategy" hint="Encapsulates Add Order Item Logic for Sale Type Items" output="false" accessors="true" implements="IAddOrderItemStrategy" extends="ConcreteAddOrderItemStrategy" initmethod="AddSaleOrderItemStrategy"   
{
	/** CTOR */
	public any function AddSaleOrderItemStrategy(any order, any processObject){
		super.ConcreteAddOrderItemStrategy(order, processObject);
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
	
	/** Populates the passed in orderItem with data specific to this type. Note: Fulfillment does not get setup in the 
	 * base class because not all of them share a fulfillment;
	*/
	public any function setupOrderItem(any orderItem){
		orderItem.setOrderFulfillment(super.getOrderFulfillment());
		orderItem.setOrderItemType( getService("TypeService").getTypeBySystemCode(super.getOrderItemType()) );
		orderItem = super.setupOrderItem(orderItem);
		return orderItem;
	}
}