<cfscript>
	arrayAppend(variables.framework.routes, { "$POST/auth0/submit$" = "/auth0:authentication.submit/" });
	arrayAppend(variables.framework.routes, { "$POST/auth0/login$" = "/auth0:authentication.login/" });
</cfscript>