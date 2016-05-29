component  displayname="CreateInventoryVendorOrderDeliveryItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="CreateInventoryVendorOrderDeliveryItemStrategy" 
{

	property any entity;
	
	public any function CreateInventoryVendorOrderDeliveryItemStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(){
		if(getEntity().getStock().getSku().setting("skuTrackInventoryFlag")) {
			var inventory = this.newInventory();
			inventory.setQuantityOut(getEntity().getQuantity());
			inventory.setStock(getEntity().getStock());
			inventory.setVendorOrderDeliveryItem(getEntity());
			getHibachiDAO().save( inventory );
		}
	}
}