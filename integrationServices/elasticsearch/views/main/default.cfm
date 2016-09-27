<cfimport prefix="swa" taglib="../../../../tags" />
<cfimport prefix="hb" taglib="../../../../org/Hibachi/HibachiTags" />

<cfparam name="rc.integration" type="any" default="#getHibachiScope().getService('integrationService').getIntegrationByIntegrationPackage('elasticsearch')#"/>
<cfparam name="rc.edit" type="boolean" />
<cfset rc.edit = false/>

<!--- get info about elastic search --->

<cfoutput>
	<div class="row s-pannel-control">
		<div class="col-md-12 s-toggle-panels">
			<a href="##" class="j-openall j-tool-tip-item" data-toggle="tooltip" data-placement="bottom" title="Expand All"><i class="fa fa-expand"></i></a>
			<a href="##" class="j-closeall j-tool-tip-item" data-toggle="tooltip" data-placement="bottom" title="Collapse All"><i class="fa fa-compress"></i></a>
		</div>
	</div>
	
	<div class="panel-group s-pannel-group" id="accordion">
		<div class="j-panel panel panel-default">
			<a data-toggle="collapse" href="##tabBasic">
				<div class="panel-heading">
					<h4 class="panel-title">
						<span>#getHibachiScope().rbKey('define.Basic')#</span>
						<i class="fa fa-caret-left s-accordion-toggle-icon"></i>
					</h4>
				</div>
			</a>
			<div id="tabBasic" class="panel-collapse ">
				<content class="s-body-box">
					<cfoutput>
						<cfset elasticSearchDetails = rc.integration.getIntegrationCFC().getElasticSearchDetailsResponseBean().getData()/>
						<div <cfif !isNull(tab) && structKeyExists(tab, "tabid") && activeTab eq tab.tabid> class="tab-pane active" <cfelse> class="tab-pane" </cfif> id="tabBasic">
							<hb:HibachiFieldDisplay title="Cluster Name" value="#elasticSearchDetails['cluster_name']#" />
							<hb:HibachiFieldDisplay title="Name" value="#elasticSearchDetails['name']#" />
							<hb:HibachiFieldDisplay title="Tag Line" value="#elasticSearchDetails['tagline']#" />
							<hb:HibachiFieldDisplay title="Build Hash" value="#elasticSearchDetails['version']['build_hash']#" />
							<hb:HibachiFieldDisplay title="Build Time Stamp" value="#elasticSearchDetails['version']['build_timestamp']#" />
							<hb:HibachiFieldDisplay title="Lucene Version" value="#elasticSearchDetails['version']['lucene_version']#" />
							<hb:HibachiFieldDisplay title="Version ##" value="#elasticSearchDetails['version']['number']#" />
							
						</div>
					</cfoutput>
				</content><!--- s-body-box --->
	
		</div><!--- panel panel-default --->
	</div>
</cfoutput>