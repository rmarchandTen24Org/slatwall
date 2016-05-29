component  displayname="AddOrderItemStrategyDelegate" hint="Returns a new orderItemStrategy depending on type" output="false"
{
	public any function AddOrderItemStrategyDelegate(any order, any data){
		//figure out the type of orderItem. 
		variables.order = arguments.order;
		variables.data = arguments.data;
		return getAddOrderItemStrategy(data);
	}
	
	public any function getAddOrderItemStrategy(){
		switch (getData().getOrderItemTypeSystemCode())
			case "oitSale": return new AddSaleOrderItemStrategy(getOrder(), getData());
			case "oitDeposit": return new AddDepositOrderItemStrategy(getOrder(), getData());
			case "oitReturn": return new AddReturnOrderItemStrategy(getOrder(), getData());
			default:
				arguments.data.addError('OrderItemTypeSystemCode', rbKey('validate.processOrder_addOrderitem.orderItemTypeSystemcode.noValidOrderItemSystemCodeType'));
	}
}