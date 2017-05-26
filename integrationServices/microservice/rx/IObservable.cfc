interface displayname="IObservable" hint="Represents an observable stream." 
{
       /**
        *  Subscribes an o to the observable sequence.
        *  @param {Object}   [IObserver] The object that contains the implemented onNext, onError, onCompleted.
        *  @param {Function} [OnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        public IDisposable function subscribe(IObserver observer, Function onNext, Function onError, Function onCompleted);
        
        /**
        * Subscribes to the next value in the sequence with an optional "this" argument.
        * @param {Function} onNext The function to invoke on each element in the observable sequence.
        * @param {Any} [scope] Object to use as this when executing callback.
        * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        public IDisposable function subscribeOnNext(Function onNext, any scope);
        
        /**
        * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
        * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        public IDisposable function subscribeOnError(Function onError, any scope);
        
        /**
        * Subscribes to the next value in the sequence with an optional "this" argument.
        * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        public IDisposable function subscribeOnCompleted(Function onCompleted, any thisArg);

        /**
        *  Subscribes an o to the observable sequence.
        *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        public IDisposable function forEach(IObserver observer, Function onNext, Function onError, Function onCompleted);
        
        /**
        * Determines whether the given object is an Observable
        * @param {Any} An object to determine whether it is an Observable
        * @returns {Boolean} true if an Observable, else false.
        */
        public boolean function isObservable(any o);
}