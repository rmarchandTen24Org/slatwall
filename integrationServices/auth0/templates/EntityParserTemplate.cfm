component{
	property name="auth0Account" cfc="RemoteEntity" fieldtype="many-to-one" fkcolumn="auth0AccountID";
	
	public boolean function hasAuth0Entity(){
		return !isNull(getAuth0Account());
	}
}
