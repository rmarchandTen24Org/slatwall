<?xml version="1.0" encoding="UTF-8"?>
<Table tableName="SwCollection">
	<Columns>
		<column name="collectionID" fieldtype="id" />
		<column name="collectionName"  />
		<column name="collectionCode" />
		<column name="collectionObject" />
		<column name="collectionDescription" />
		<column name="collectionConfig" />
	</Columns>
	<Records>
		<Record 
			collectionID="ff80808156fff8cb015705427a7f0022"	collectionName="Data Integrations" collectionCode="dataIntegrations" collectionObject="Integration" collectionDescription="Used to pull/pull data for data integrations"	
			collectionConfig='{"baseEntityAlias":"_integration","baseEntityName":"Integration","columns":[{"isDeletable":false,"isSearchable":true,"title":"Integration ID","isVisible":false,"ormtype":"id","propertyIdentifier":"_integration.integrationID","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"integrationID"},{"isDeletable":true,"isSearchable":true,"title":"Active","isVisible":true,"ormtype":"boolean","propertyIdentifier":"_integration.activeFlag","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"activeFlag"},{"isDeletable":true,"isSearchable":true,"title":"Installed Flag","isVisible":true,"ormtype":"boolean","propertyIdentifier":"_integration.installedFlag","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"installedFlag"},{"isDeletable":true,"isSearchable":true,"title":"Integration Package","isVisible":true,"ormtype":"string","propertyIdentifier":"_integration.integrationPackage","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"integrationPackage"},{"isDeletable":true,"isSearchable":true,"title":"Integration Name","isVisible":true,"ormtype":"string","propertyIdentifier":"_integration.integrationName","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"integrationName"},{"isDeletable":true,"isSearchable":true,"title":"Integration Type List","isVisible":true,"ormtype":"string","propertyIdentifier":"_integration.integrationTypeList","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"integrationTypeList"}],"filterGroups":[{"filterGroup":[{"displayPropertyIdentifier":"Integration Type List","propertyIdentifier":"_integration.integrationTypeList","comparisonOperator":"like","breadCrumbs":[{"rbKey":"Integration","entityAlias":"_integration","cfc":"_integration","propertyIdentifier":"_integration"}],"value":"data","pattern":"%w%","displayValue":"data","ormtype":"string","conditionDisplay":"Contains"}]}],"currentPage":1,"pageShow":10,"defaultColumns":false}'	
		/>
	</Records>
</Table>

