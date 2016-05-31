component  displayname="CreateInventoryStockRecieverStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="CreateInventoryStockRecieverStrategy" 
{

	property any entity;
	
	public any function CreateInventoryStockRecieverStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(){
		
		if(!isNull(getEntity()) && !isNull(getEntity().getStock()) && !isNull(getEntity().getStock().getSku()) && getEntity().getStock().getSku().setting("skuTrackInventoryFlag")) {		
			// Dynamically do a breakupBundledSkus call, if this is an order return, a bundle sku, the setting is enabled to do this dynamically
			if(getEntity().getStockReceiver().getReceiverType() eq 'orderItem' 
				&& ( !isNull(getEntity().getStock().getSku().getBundleFlag()) && getEntity().getStock().getSku().getBundleFlag() )
				&& getEntity().getStock().getSku().setting("skuBundleAutoBreakupInventoryOnReturnFlag")) {

				var processData = {
					locationID=getEntity().getStock().getLocation().getLocationID(),
					quantity=getEntity().getQuantity()
				};
				
				getService("SkuService").processSku(getEntity().getStock().getSku(), processData, 'breakupBundledSkus');
				
			}

			var inventory = getService("InventoryService").newInventory();
			inventory.setQuantityIn(getEntity().getQuantity());
			inventory.setStock(getEntity().getStock());
			inventory.setStockReceiverItem(getEntity());
			getService("InventoryService").save( inventory );
			
		}
	}
	
	
	public any function getEntity(){
		if (!isNull(variables.entity)){
			return variables.entity;
		}
		return;
	} 
	
	public any function setEntity(any entity){
		variables.entity = getEntity();
	}
}