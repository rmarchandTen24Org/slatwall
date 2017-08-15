component extends="Slatwall.org.Hibachi.HibachiTransient" output="false" accessors="true"{
	property name="xipayvbresult" type="boolean";
	property name="packets" type="array";

	public integer function getCount(){
		return arrayLen(getPackets());
	}
}