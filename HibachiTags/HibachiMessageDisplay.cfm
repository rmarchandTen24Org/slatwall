<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
=======
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfparam name="request.context.messages" default="#arrayNew(1)#" >

<cfif thisTag.executionMode is "start">
	<cfloop array="#request.context.messages#" index="message">
		<cfoutput>
			<div class="alert alert-#message.messageType# fade in">
				<a class="close" data-dismiss="alert"><i class="fa fa-times"></i></a>
				#message.message#
			</div>
		</cfoutput>
	</cfloop>
</cfif>
