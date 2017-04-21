<?xml version="1.0" encoding="UTF-8"?>
<Table tableName="SwWorkflowTask">
	<Columns>
		<column name="workflowTaskID" fieldtype="id" />
		<column name="activeFlag" update="false" datatype="bit" />
		<column name="taskName" update="false" />
		<column name="taskConditionsConfig" update="false" />
		<column name="workflowID" update="false" />
	</Columns>
	<Records>
		<Record workflowTaskID="ff80808156fff8cb0157058ddc66002a" activeFlag="1" taskName="Pull Data" taskConditionsConfig='{"filterGroups":[{"filterGroup":[]}],"baseEntityAlias":"Integration","baseEntityName":"Integration"}'	
			workflowID="ff80808156fff8cb0157058d02a10026"
		/>
		<Record workflowTaskID="ff80808156fff8cb0157058ddc66002b" activeFlag="1" taskName="Push Data" taskConditionsConfig='{"filterGroups":[{"filterGroup":[]}],"baseEntityAlias":"Integration","baseEntityName":"Integration"}'	
			workflowID="ff80808156fff8cb0157058d02a10027"
		/>
	</Records>
</Table>

