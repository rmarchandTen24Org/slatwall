component  displayname="AddOrderItemStrategyDelegate" hint="Returns a new orderItemStrategy depending on type" output="false" accessors="true" initmethod="AddOrderItemStrategyDelegate" persistent="false"     
{
	property any processObject;
	property any order;
	
	/** CTOR */
	public any function AddOrderItemStrategyDelegate(any order, any processObject){
		//figure out the type of orderItem. 
		setOrder(arguments.order);
		setProcessObject(arguments.processObject);
		return getAddOrderItemStrategy();
	}
	
	public any function getAddOrderItemStrategy(){
		switch (getProcessObject().getOrderItemTypeSystemCode()){
			case "oitSale": return new Slatwall.model.service.AddOrderItemStrategies.AddSaleOrderItemStrategy(getOrder(), getProcessObject()); break;
			case "oitDeposit": return new Slatwall.model.service.AddOrderItemStrategies.AddDepositOrderItemStrategy(getOrder(), getProcessObject()); break;
			case "oitReturn": return new Slatwall.model.service.AddOrderItemStrategies.AddReturnOrderItemStrategy(getOrder(), getProcessObject()); break;
				default: arguments.data.addError('OrderItemTypeSystemCode', rbKey('validate.processOrder_addOrderitem.orderItemTypeSystemcode.noValidOrderItemSystemCodeType'));
		}
	}
}