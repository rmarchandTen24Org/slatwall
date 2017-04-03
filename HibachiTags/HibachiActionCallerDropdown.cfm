<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfparam name="attributes.title" type="string" default="">
<cfparam name="attributes.id" type="string" default="">
<cfparam name="attributes.icon" type="string" default="plus">
<cfparam name="attributes.type" type="string" default="button" />
<cfparam name="attributes.dropdownClass" type="string" default="" />
<cfparam name="attributes.dropdownId" type="string" default="" />
<cfparam name="attributes.buttonClass" type="string" default="btn-primary" />
<cfparam name="attributes.cols" type="string" default="1" />

<cfif thisTag.executionMode is "end">
	<cfif len(trim(thisTag.generatedContent)) gt 5>
		<cfif attributes.type eq "button">
			<cfoutput>
                <div class="btn-group">
                	<button class="btn #attributes.buttonClass# dropdown-toggle btn-primary" data-toggle="dropdown"><i class="fa fa-#attributes.icon#"></i> #attributes.title# <span class="caret"></span></button>
					<ul class="dropdown-menu #attributes.dropdownClass#" id="#attributes.dropdownId#">
						#thisTag.generatedContent#
						<cfset thisTag.generatedContent = "" />
                	</ul>
                </div>
			</cfoutput>
		<cfelseif attributes.type eq "nav">
			<cfoutput>
                <li class="dropdown">
					<a href="##" data-toggle="dropdown" class="dropdown-toggle" ><i class="fa fa-#attributes.icon#"></i> #attributes.title# </a>
					<ul class="dropdown-menu #attributes.dropdownClass#" id="#attributes.dropdownId#">
						#thisTag.generatedContent#
						<cfset thisTag.generatedContent = "" />
					</ul>
               	</li>
			</cfoutput>
		<cfelseif attributes.type eq "sidenav">
			<cfoutput>
                <li>
					<a href="##"><i class="fa fa-#attributes.icon#"></i> #attributes.title# <span class="fa arrow"></span></a>
                    <ul id="#attributes.dropdownId#">
						#thisTag.generatedContent#
						<cfset thisTag.generatedContent = "" />
                	</ul>
                </li>
			</cfoutput>
		<cfelseif attributes.type eq "parentnav">
			<cfoutput>
                <li class="dropdown" id="#attributes.id#">
                    <a href="##" class="dropdown-toggle" data-toggle="dropdown"><i class="#attributes.icon#"></i>#attributes.title#</a>
                    <ul class="dropdown-menu #attributes.dropdownClass#">
            			<li>
            				<div class="yamm-content">
								<div class="row">
									#thisTag.generatedContent#
									<cfset thisTag.generatedContent = "" />
								</div>
                			</div>
                		</li>
                	</ul>
                </li>
			</cfoutput>
		<cfelseif attributes.type eq "list">
			<cfoutput>
                <li>
					<a href="#attributes.hibachiScope.buildURL(action=attributes.action)#" ><i class="glyphicon glyphicon-#attributes.icon#"></i> #attributes.title# </a>
            	</li>
			</cfoutput>
		<cfelseif attributes.type EQ "subnav">
			<cfoutput>
                <ul class="col-md-#(12 / attributes.cols)# list-unstyled">
					<li>
						<h4>#attributes.title#</h4>
					</li>
					#thisTag.generatedContent#
                </ul>
				<cfset thisTag.generatedContent = "" />
			</cfoutput>
		</cfif>
	</cfif>
</cfif>