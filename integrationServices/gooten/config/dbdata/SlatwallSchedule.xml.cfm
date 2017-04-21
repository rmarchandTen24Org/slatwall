<?xml version="1.0" encoding="UTF-8"?>
<Table tableName="SwSchedule">
	<Columns>
		<column name="scheduleID" fieldtype="id" />
		<column name="scheduleName"  />
		<column name="recuringType" />
		<column name="frequencyInterval" />
		<column name="frequencyStartTime" datatype="timestamp" />
		<column name="frequencyEndTime" datatype="timestamp" />
	</Columns>
	<Records>
		<Record 
			scheduleID="ff80808156fff8cb015705fa0c24004a" 
			scheduleName="pull data" 
			recuringType="daily" 
			frequencyInterval="60"	
			frequencyStartTime="1899-12-30 12:00:00" 
			frequencyEndTime="1899-12-30 11:59:00"	
		/>
		<Record 
			scheduleID="ff80808156fff8cb015705fa0c24004b" 
			scheduleName="push data" 
			recuringType="daily" 
			frequencyInterval="60"	
			frequencyStartTime="1899-12-30 12:00:00" 
			frequencyEndTime="1899-12-30 11:59:00"	
		/>
	</Records>
</Table>

