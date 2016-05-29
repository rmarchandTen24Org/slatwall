interface displayname="ICreateInventoryStrategy" hint="This prototype determines which functionality is common amoung all strategies of this type"
{
	/** Creates the new inventory item based on type of the passed in entity */
	public any function create();
}