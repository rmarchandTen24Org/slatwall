interface  hint="Represents a payment transaction"
{
	/** Handles making the api call specific to the transaction type. */
	public any function processPaymentTransaction();
	public any function setActivePublicKey(any key);
	public any function setActiveSecretKey(any key);
}