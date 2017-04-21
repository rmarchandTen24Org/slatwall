component extends="Slatwall.org.hibachi.HibachiDAO"{

	public array function getUnsyncedGootenOrders(){
		var orders = ormExecuteQuery("SELECT DISTINCT i.order FROM SlatwallOrderItem i WHERE i.sku.product.productType.productTypeName = ? AND i.order.remoteID IS NULL", ['Gooten'], false);
		return orders;
	}

	public array function getOpenGootenOrders(){
		var orders = ormExecuteQuery("SELECT o FROM SlatwallOrder o WHERE o.orderStatusType.systemCode IN :systemCodeList AND o.remoteID IS NOT NULL", {systemCodeList=['ostNew','ostProcessing','ostOnHold']});
		return orders;
	}

	public any function getGootenStock(required string skuCode){
		var stock = ormExecuteQuery("SELECT s FROM SlatwallStock s WHERE s.sku.skuCode = :skuCode AND s.location.locationName = :locationName", {skuCode=arguments.skuCode, locationName='Gooten'},true);
		return stock;
	}

}