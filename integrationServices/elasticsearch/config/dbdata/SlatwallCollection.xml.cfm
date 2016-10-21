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
			collectionID="ff80808156fff8cb015705927a7f0029"	
			collectionName="Entity Search Resources" 
			collectionCode="entitySearchResources" 
			collectionObject="ElasticSearchResources" collectionDescription="holds all entity based Elastic Search indexes"	
			collectionConfig='{"baseEntityAlias":"_elasticsearchresource","baseEntityName":"ElasticSearchResource","columns":[{"isDeletable":false,"isSearchable":true,"title":"Elastic Resource ID ","isVisible":false,"ormtype":"id","propertyIdentifier":"_elasticsearchresource.elasticSearchResourceID","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"elasticSearchResourceID"},{"isDeletable":true,"isSearchable":true,"title":"Index","isVisible":true,"ormtype":"string","propertyIdentifier":"_elasticsearchresource.elasticSearchResourceIndex","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"elasticSearchResourceIndex"},{"isDeletable":true,"isSearchable":true,"title":"Type","isVisible":true,"ormtype":"string","propertyIdentifier":"_elasticsearchresource.elasticSearchResourceType","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"elasticSearchResourceType"},{"isDeletable":true,"isSearchable":true,"title":"Collection Config","isVisible":true,"ormtype":"string","propertyIdentifier":"_elasticsearchresource.collectionConfig","isExportable":true,"sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"collectionConfig"}],"keywordColumns":[],"filterGroups":[{"filterGroup":[{"displayPropertyIdentifier":"Index","propertyIdentifier":"_elasticsearchresource.elasticSearchResourceIndex","comparisonOperator":"=","breadCrumbs":[{"rbKey":"Elastic Search Resource","entityAlias":"_elasticsearchresource","cfc":"_elasticsearchresource","propertyIdentifier":"_elasticsearchresource"}],"value":"entity","displayValue":"entity","ormtype":"string","conditionDisplay":"Equals"}]}],"currentPage":1,"pageShow":10,"defaultColumns":false}'	
		/>
	</Records>
</Table>

