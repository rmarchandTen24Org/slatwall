component  displayname="ConcreteAddOrderItemStrategy" hint="Encapsulates Add Order Item Logic for This Type Item" output="false" accessors="true" implements="ICreateInventoryStrategy" extends="Slatwall.org.hibachi.hibachiService"  initmethod="ConcreteCreateInventoryStrategy" 
{

	property any entity;
	
	public any function ConcreteCreateInventoryStrategy(any entity){
		setEntity(arguments.entity);
	}
	
	public any function create(){}
	
	public any function getEntity(){
		if (!isNull(variables.entity)){
			return variables.entity;
		}
		return;
	}  
	
	public any function setEntity(any entity){
		variables.entity = arguments.entity;
	}
}