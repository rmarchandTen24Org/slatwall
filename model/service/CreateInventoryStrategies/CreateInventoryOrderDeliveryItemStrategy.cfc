component  displayname="CreateInventoryOrderDeliveryItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="CreateInventoryOrderDeliveryItemStrategy" 
{

	property any entity;
	
	public any function CreateInventoryOrderDeliveryItemStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(entity){
		if(getEntity().getStock().getSku().setting("skuTrackInventoryFlag")) {

			// Dynamically do a makeupBundledSkus call, if this is a bundle sku, the setting is enabled to do this dynamically, and we have QOH < whats needed
			if(!isNull(getEntity().getStock().getSku().getBundleFlag())
				&& ( !isNull(getEntity().getStock().getSku().getBundleFlag()) && getEntity().getStock().getSku().getBundleFlag() )
				&& getEntity().getStock().getSku().setting("skuBundleAutoMakeupInventoryOnSaleFlag") 
				&& getEntity().getStock().getQuantity("QOH") - getEntity().getQuantity() < 0) {
					
				var processData = {
					locationID=getEntity().getStock().getLocation().getLocationID(),
					quantity=getEntity().getStock().getQuantity("QOH") - getEntity().getQuantity()
				};
				
				getSkuService().processSku(getEntity().getStock().getSku(), processData, 'makeupBundledSkus');
			}
			
			var inventory = this.newInventory();
			inventory.setQuantityOut( getEntity().getQuantity() );
			inventory.setStock( getEntity().getStock() );
			inventory.setOrderDeliveryItem( getEntity() );
			getHibachiDAO().save( inventory );	
			
		}
	}
}