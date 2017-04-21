component extends="Slatwall.org.Hibachi.HibachiEventHandler" {

	public void function afterOrderProcess_placeOrderSuccess(required any entity){
		getService('gootenService').checkGootenOrder(order);
	}

	// public void function afterOrderSave(required any entity){
	// 	getService('gootenService').checkGootenOrder(order);
	// }
}