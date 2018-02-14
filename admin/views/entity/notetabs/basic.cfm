<cfimport prefix="swa" taglib="../../../../tags" />
<cfimport prefix="hb" taglib="../../../../org/Hibachi/HibachiTags" />

<cfparam name="rc.note" type="any" />
<cfparam name="rc.edit" type="boolean" />

<cfoutput>
	<hb:HibachiPropertyRow>
		<hb:HibachiPropertyList>
			<hb:HibachiPropertyDisplay object="#rc.note#" property="noteName" edit="#rc.edit#" >
			<input type="hidden" name="account.accountID" value="#$.slatwall.getAccount().getAccountID()#">
			<hb:HibachiPropertyDisplay object="#rc.note.getAccount()#" property="fullName" valueLink="?slatAction=admin:entity.detailaccount&accountID=#rc.note.getAccount().getAccountID()#" title="#$.slatwall.rbKey('entity.note.account')#" showOnCreateFlag=false edit="false" displayType="span"/>

			<!--- <cfif !isNull(rc.note.getAccount())>
				<a href="?slatAction=admin:entity.detailaccount&accountID=#rc.note.getAccount().getAccountID()#"><hb:HibachiPropertyDisplay object="#rc.note.getAccount()#" property="fullName" title="Assigned Account"/></a>
			</cfif> --->
		</hb:HibachiPropertyList>

	</hb:HibachiPropertyRow>
</cfoutput>