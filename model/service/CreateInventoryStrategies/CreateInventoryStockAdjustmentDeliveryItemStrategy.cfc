component  displayname="CreateInventoryStockAdjustmentDeliveryItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="CreateInventoryStockAdjustmentDeliveryItemStrategy" 
{

	property any entity;
	
	public any function CreateInventoryStockAdjustmentDeliveryItemStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(){
		if(getEntity().getStock().getSku().setting("skuTrackInventoryFlag")) {
			var inventory = this.newInventory();
			inventory.setQuantityOut(getEntity().getQuantity());
			inventory.setStock(getEntity().getStock());
			inventory.setStockAdjustmentDeliveryItem(getEntity());
			getHibachiDAO().save( inventory );
		}
	}
}