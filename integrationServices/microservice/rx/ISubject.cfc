/**
 * Supports push-style iteration over an observable sequence.
 * @examples
 *  var s = new Subject();
 *  s.hasObservers();
 *  s.isDisposed;
 */
interface displayname="ISubject" hint="Represents an object that is both an observer of a stream and an observer" extends="IObserver,IObservable,IDisposable"
{
	  
	   /**
        * Creates a subject.
        */
	    public Subject function Subject();
	   
	   /**
	    * Notifies the observer of the end of the sequence.
	    */
	    public void function onCompleted();
	   
	   /**
         * Creates a subject from the specified observer and observable.
         * @param {Observer} observer The observer used to send messages to the subject.
         * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
         * @returns {Subject} Subject implemented using the given observer and observable.
         */
	    public Subject function createSubject(IObserver observer, IObservable observable);
        
}