/**
 * Supports push-style iteration over an observable sequence.
 * @examples
 *   var observer = new Observer().create(function(next){}, function(error){}, function(){});
 *   var observable = new Observable.subscribe(observer);
 *	 var observable = new Observable.subscribeOnNext(observer);
 */
interface displayname="IObserver" hint="Represents an observer of a stream"
{
	   /**
	    * Notifies the observer of a new element in the sequence.
	    * @param {Any} value Next element in the sequence.
	    */
	    public void function onNext(any value);
	   
	   /**
	    * Notifies the observer that an exception has occurred.
	    * @param {Any} error The error that has occurred.
	    */
	    public void function onError(any exception);
	   
	   /**
	    * Notifies the observer of the end of the sequence.
	    */
	    public void function onCompleted();
	   
	   /**
	    * Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	    * @param {Function} [onNext] Observer's OnNext action implementation.
	    * @param {Function} [onError] Observer's OnError action implementation.
	    * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	    * @returns {Observer} The observer object implemented using the given actions.
	    */
	    public Observer function createObserver(Function onNext, Function onError, Function onCompleted);
        
}