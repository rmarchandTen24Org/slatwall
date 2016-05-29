component  displayname="CreateInventoryVendorOrderDeliveryItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="CreateInventoryVendorOrderDeliveryItemStrategy" 
{

	property any entity;
	
	public any function CreateInventoryVendorOrderDeliveryItemStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(entity){
		if(arguments.entity.getStock().getSku().setting("skuTrackInventoryFlag")) {
			var inventory = this.newInventory();
			inventory.setQuantityOut(arguments.entity.getQuantity());
			inventory.setStock(arguments.entity.getStock());
			inventory.setVendorOrderDeliveryItem(arguments.entity);
			getHibachiDAO().save( inventory );
		}
	}
}