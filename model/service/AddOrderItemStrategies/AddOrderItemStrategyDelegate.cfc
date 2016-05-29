component  displayname="AddOrderItemStrategyDelegate" hint="Returns a new orderItemStrategy depending on type" output="false" accessors="true"   
{
	property any processObject;
	property any order;
	
	public any function AddOrderItemStrategyDelegate(any order, any processObject){
		//figure out the type of orderItem. 
		setOrder(arguments.order);
		setProcessObject(arguments.processObject);
		return getAddOrderItemStrategy();
	}
	
	public any function getAddOrderItemStrategy(){
		switch (getProcessObject().getOrderItemTypeSystemCode()){
			case "oitSale": return new AddSaleOrderItemStrategy(getOrder(), getData()); break;
			case "oitDeposit": return new AddDepositOrderItemStrategy(getOrder(), getData()); break;
			case "oitReturn": return new AddReturnOrderItemStrategy(getOrder(), getData()); break;
			default: arguments.data.addError('OrderItemTypeSystemCode', rbKey('validate.processOrder_addOrderitem.orderItemTypeSystemcode.noValidOrderItemSystemCodeType'));
		}
	}
}