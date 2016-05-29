component  displayname="ConcreteAddOrderItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="ConcreteCreateInventoryStrategy" 
{

	property any entity;
	
	public any function ConcreteCreateInventoryStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(entity){
		setEntity(arguments.entity);
	}
	
	
	public any function getEntity(){
		return variables.entity;
	} 
	
	public any function setEntity(any entity){
		variables.entity = arguments.entity;
	}
}