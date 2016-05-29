component  displayname="AddDepositOrderItemStrategy" hint="Encapsulates Add Order Item Logic for Deposit Type Items" output="false" accessors="true" implements="IAddOrderItemStrategy" extends="ConcreteAddOrderItemStrategy" initmethod="AddDepositOrderItemStrategy"  
{
	/** This class extends the concrete implmentation of the addOrderItemStrategy.
	*/
	public any function AddDepositOrderItemStrategy(any order, any processObject){
		super(order, processObject);
		super.setOrderItemType("oitDeposit");
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
	public any function setupOrderItem(any orderItem){
		arguments.orderItem.setOrderItemType( getService("TypeService").getTypeBySystemCode(super.getOrderItemType()) );
		super.setupOrderItem(orderItem);
	}
}