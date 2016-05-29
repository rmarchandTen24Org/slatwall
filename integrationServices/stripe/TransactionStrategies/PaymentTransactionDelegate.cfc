component displayname="PaymentTransactionDelegate" hint="Returns a specific type of payment transaction" initmethod="PaymentTransactionDelegate" output="false" accessors="true" 
{
	/** CTOR */
	public any function PaymentTransactionDelegate(any type, any request, any response){
		return getPaymentTransactionStrategy(arguments.type, request, response);
	}
	
	public any function getPaymentTransactionStrategy(any type, any requestBean, any responseBean){
		switch (arguments.type){
			case "generateToken": new Slatwall.model.transient.payment.TransactionStrategies.GenerateTokenTransaction(requestBean, responseBean); break;
			case "credit": new Slatwall.model.transient.payment.TransactionStrategies.CreditTransaction(requestBean, responseBean); break;
			case "Authorize": new Slatwall.model.transient.payment.TransactionStrategies.AuthorizeTransaction(requestBean, responseBean); break;
			case "AuthorizeAndCharge": new Slatwall.model.transient.payment.TransactionStrategies.AuthorizeAndChargeTransaction(requestBean, responseBean); break;
			case "ChargePreAuthorize": new Slatwall.model.transient.payment.TransactionStrategies.ChargePreAuthorizeTransaction(requestBean, responseBean); break;
			default: throw('You are trying to make a payment but no payment strategy was found using type #arguments.type#');
		}
	}
}