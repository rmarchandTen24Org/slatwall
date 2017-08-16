component extends="Slatwall.org.Hibachi.HibachiTransient" output="false" accessors="true"{
	property name="AccountingDocNumber" type="string";
	property name="ActionCode" type="string" validateParams="{maxLength=64}" hint="Set by processor";
	property name="Amount" type="string" validateParams="{maxLength=25}";
	property name="AuthorizationCode" type="string" hint="Set by processor";
	property name="AuthorizationDate" type="string" hint="Set by processor";
	property name="AuthorizationReferenceCode" type="string" hint="Set by processor";
	property name="AuthorizationTime" type="string" hint="Set by processor";
	property name="AVSAddress" type="string" hint="Set by processor";
	property name="AVSCode" type="string" hint="Set by processor";
	property name="AVSZipCode" type="string" hint="Set by processor";
	property name="BankTransactionID" type="string";
	property name="BatchID" type="string";
	property name="BillingDate" type="string";
	property name="BillingPlanItem" type="string";
	property name="CaptureDate" type="string";
	property name="CaptureReferenceCode" type="string" hint="Set by processor";
	property name="CardCVV2" type="string";
	property name="CardDataSource" type="string";
	property name="CardExpirationDate" type="string" hint="Format MM/YY or MM/YYYY";
	property name="CardFollowOnNumber" type="string";
	property name="CardHolderAddress1" type="string";
	property name="CardHolderAddress2" type="string";
	property name="CardHolderCity" type="string";
	property name="CardHolderCountry" type="string";
	property name="CardHolderDistrict" type="string";
	property name="CardHolderName" type="string";
	property name="CardHolderName1" type="string";
	property name="CardHolderName2" type="string";
	property name="CardHolderState" type="string";
	property name="CardHolderZip" type="string";
	property name="CardNumber" type="string";
	property name="CardPresent" type="integer";
	property name="CardType" type="string";
	property name="CardValidFrom" type="string";
	property name="ChargeAmount" type="string";
	property name="CompanyCode" type="string";
	property name="Client" type="string" hint="Set by SAP";
	property name="CreationDate" type="string" hint="Set by database";
	property name="CurrencyKey" type="string";
	property name="CustomerNumber" type="string";
	property name="CustTXN" type="string";
	property name="FiscalYear" type="string";
	property name="GLAccount" type="string";
	property name="InfoItems" type="array";
	property name="LocationID" type="string";
	property name="MerchantID" type="string";
	property name="MerchantTransactionID" type="string";
	property name="MerchantTXN" type="string";
	property name="Message" type="string";
	property name="ModifiedStatus" type="integer";
	property name="OrderDate" type="string";
	property name="OrderID" type="string";
	property name="Origin" type="string";
	property name="PacketOperation" type="integer";
	property name="Preauthorized" type="string";
	property name="ReferenceCode" type="string";
	property name="ReferenceLineItem" type="string";
	property name="ResponseCode" type="string";
	property name="SalesDocNumber" type="string";
	property name="SettlementAmount" type="string";
	property name="SettlementDate" type="string" hint="Set by processor";
	property name="SettlementReferenceCode" type="string" hint="Set by processor";
	property name="StatusCode" type="string" hint="Set by XiPay";
	property name="StatusTXN" type="string" hint="Set by XiPay";
	property name="TaxLevel1" type="string";
	property name="TaxLevel2" type="string";
	property name="TerminalID" type="string";
	property name="TransactionID" type="string" hint="Set by XiPay";
	property name="TransactionType" type="string";
	property name="XIID" type="string";
	property name="TestStructProp" type="struct";

	public any function init(){
		variables.bodyExcludedProperties = '';
		variables.propertySingularNames = {
			'InfoItems'='InfoItem'
		};
	}

	public any function getRequestData(){

		var xmlData = XmlNew(true);
		xmlData['ITransactionHeader'] = XmlElemNew(xmlData, "ITransactionHeader");
		for(var property in getMetaData().properties){
			if(!listFindNoCase(variables.bodyExcludedProperties, property.name)){
				var getter = this['get#property.name#'];
				if(!isNull(getter()) && !(isStruct(getter()) && structIsEmpty(getter()))){
					xmlData['ITransactionHeader'] = buildXMLNode(xmlData, xmlData['ITransactionHeader'], property.name, getter());
				}
			}
		}
		writeDump(xmlData);
		writeDump(ToString(xmlData));abort;
		return xmlData;
	}
	
	private any function buildXMLNode(required any xmlDoc, required any xmlNode, required string propertyName, required any property){
		if(!structKeyExists(arguments.xmlNode, 'XmlChildren')){
			arguments.xmlNode['XmlChildren'] = [];
		}
		var newElem = XmlElemNew(arguments.xmlDoc, arguments.propertyName);
		if(isSimpleValue(arguments.property)){
			newElem.XmlText = arguments.property;
		}else if(isStruct(property)){
			for(var key in property){
				newElem = buildXMLNode(xmlDoc, newElem, key, property[key]);
			}
		}else if(isArray(property)){

			for(i=1; i<=ArrayLen(property); i++){
				newElem = buildXMLNode(xmlDoc, newElem, variables.propertySingularNames[propertyName], property[i]);
			}
		}
		arrayAppend(xmlNode.XmlChildren, newElem);

		return xmlNode;
	}

	public void function populateFromXML(required xmlDoc){
		
	}

}