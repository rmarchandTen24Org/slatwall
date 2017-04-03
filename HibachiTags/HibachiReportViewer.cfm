<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.report" type="any" />
	
	<cfoutput>
		<script type="text/javascript" src="#request.slatwallScope.getBaseURL()#/org/Hibachi/HibachiAssets/js/highcharts.js"></script>
		
		<div id="hibachi-report" data-reportname="#attributes.report.getClassName()#">
			<!--- Chart --->
			<div id="hibachi-report-chart-wrapper" class="well" style="padding:10px;">
				<div id="hibachi-report-chart" style="height:300px;"></div>
			</div>
			
=======
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<cfif thisTag.executionMode is "start">
	<cfparam name="attributes.report" type="any" />

	<cfoutput>
		<script type="text/javascript" src="#request.context.fw.getHibachiScope().getBaseURL()#/org/Hibachi/HibachiAssets/js/highcharts.js"></script>

		<div id="hibachi-report" data-reportname="#attributes.report.getClassName()#">
			<!--- Chart --->
			<div class="well" style="padding:10px;">
				<div id="hibachi-report-chart" style="height:300px;"></div>
			</div>
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!--- Configure --->
			<div id="hibachi-report-configure-bar" class="well" style="padding:10px;">
				#attributes.report.getReportConfigureBar()#
			</div>
<<<<<<< HEAD
			
=======
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!--- Table --->
			<div id="hibachi-report-table">
				#attributes.report.getReportDataTable()#
			</div>
<<<<<<< HEAD
			
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<script type="text/javascript">
				jQuery(document).ready(function(){
					//jQuery('##hibachi-report-chart').highcharts(#serializeJSON(attributes.report.getChartData())#);
					addLoadingDiv( 'hibachi-report' );
					updateReport();
				});
			</script>
		</div>
	</cfoutput>
</cfif>

