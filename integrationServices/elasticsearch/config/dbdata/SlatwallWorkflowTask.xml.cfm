<?xml version="1.0" encoding="UTF-8"?>
<Table tableName="SwWorkflowTask">
	<Columns>
		<column name="workflowTaskID" fieldtype="id" />
		<column name="activeFlag" datatype="bit" update="false" />
		<column name="taskName" />
		<column name="taskConditionsConfig" />
		<column name="workflowID" />
	</Columns>
	<Records>
		<Record 
			workflowTaskID="ff80808157f873450157fc391c990022"	
			activeFlag="1"	
			taskName="Index Elastic Resource"
			taskConditionsConfig='{"filterGroups":[{"filterGroup":[]}],"baseEntityAlias":"ElasticSearchResource","baseEntityName":"ElasticSearchResource"}'		
			workflowID="ff80808157f873450157fc133259000c"	
		/>
	</Records>
</Table>

