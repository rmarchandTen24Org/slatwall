component extends="Slatwall.org.Hibachi.HibachiController" {

	this.publicMethods = '';
	this.publicMethods = listAppend(this.publicMethods, 'default');

	public any function default(required any rc){
		var ITransactionHeader = getTransient('PaymetricITransactionHeader');
		ITransactionHeader.setAmount('45.45');
		ITransactionHeader.setCardCVV2('494');
		ITransactionHeader.setCardNumber('4944303022918472');

		var infoItems = [
			{'key'='Test mode!', 'value'='Duh'},
			{'key'='We''re an array!', 'value'='Yuh'},
			{'key'='Add us properly, bro!', 'value'='Nuh'}
		];

		ITransactionHeader.setInfoItems(infoItems);
		ITransactionHeader.setTestStructProp({'whoIs'='Afraid of the big bad wolf'});

		ITransactionHeader.getRequestData();
	}

}