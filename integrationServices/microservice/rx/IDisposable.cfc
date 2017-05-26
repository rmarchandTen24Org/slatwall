interface displayname="iDisposable" hint="Represents an disposable object."
{
	/** Dispose this disposable */
	public void function dispose();
	
    /**
     * Constructor provides a set of static methods for creating Disposables.
     * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     */
    public Disposable function Disposable(Function action);

    /**
     * Creates a disposable object that invokes the specified action when disposed.
     * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     * @return {Disposable} The disposable object that runs the given action upon disposal.
     */
    public Disposable function createDisposable(Function action);

    /**
     * Gets the disposable that does nothing when disposed.
     */
    public Disposable function empty();

    /**
     * Validates whether the given object is a disposable.
     * @param {Object} Object to test whether it has a dispose method
     * @returns {Boolean} true if a disposable object, else false.
     */
    public boolean function isDisposed();
}