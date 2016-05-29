component  displayname="CreateInventoryStockAdjustmentDeliveryItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="CreateInventoryStockAdjustmentDeliveryItemStrategy" 
{

	property any entity;
	
	public any function CreateInventoryStockAdjustmentDeliveryItemStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(entity){
		if(arguments.entity.getStock().getSku().setting("skuTrackInventoryFlag")) {
			var inventory = this.newInventory();
			inventory.setQuantityOut(arguments.entity.getQuantity());
			inventory.setStock(arguments.entity.getStock());
			inventory.setStockAdjustmentDeliveryItem(arguments.entity);
			getHibachiDAO().save( inventory );
		}
	}
}