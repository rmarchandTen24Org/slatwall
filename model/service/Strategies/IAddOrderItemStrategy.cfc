interface displayname="IAddOrderItemStrategy" hint="This prototype determines which functionality is common amoung all strategies of this type" output="false"
{
	public boolean function requiresFulfillment();
	public any function setup();
	public any function populateOrderItem();
}