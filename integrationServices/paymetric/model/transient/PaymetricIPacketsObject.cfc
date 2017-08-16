component extends="Slatwall.org.Hibachi.HibachiTransient" output="false" accessors="true"{
	property name="xipayvbresult" type="boolean";
	property name="packets" type="array";

	public integer function getCount(){
		return arrayLen(getPackets());
	}

	public void function addPacket(required any transactionHeader){
		ArrayAppend(this.packets,transactionHeader);
	}

	public any function getResponse(){
		//Do soap op and then
		setXiPayVbResult(response.xipayvbresult);
		setPackets([]);
		for(var packet in response.packets){
			
		}
	}
}