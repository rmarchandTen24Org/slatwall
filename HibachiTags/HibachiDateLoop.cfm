<<<<<<< HEAD
<cfimport prefix="swa" taglib="../../../tags" />
=======
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
<cfimport prefix="hb" taglib="../../../org/Hibachi/HibachiTags" />
<!--- Kill extra output. --->
<cfsilent>

	<!---
	Check to see which tag execution mode we are in.
	We have acitons that can / should only be done in
	one or the other.
	--->
<<<<<<< HEAD
	
	<cfswitch expression="#THISTAG.ExecutionMode#">
		<cfcase value="Start">
		
=======

	<cfswitch expression="#THISTAG.ExecutionMode#">
		<cfcase value="Start">

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			In the start mode, we are going to need to
			param the tag attributes.
			--->
			<!---
			This is the name of the caller-scoped variable
			into which we want to store the iteration value.
			--->
			<cfparam name="ATTRIBUTES.Index" type="string"/>

			<!---
			This is the value at which we will start the
			date looping.
			--->
			<cfparam name="ATTRIBUTES.From" />
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			This is the value at which we will end the
			date looping (value is inclusive in loop).
			--->
			<cfparam name="ATTRIBUTES.To" />
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			This is the amount by which we will incrememnt
			the loop for each iteration. How this actually
			translates will be dependent on the DatePart.
			--->
			<cfparam name="ATTRIBUTES.Step" type="numeric" default="1"/>
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			This is how the step increment value is applied
			to the iteration. By default, we will add a day
			for each increment. This value can be anything
			used in DateAdd():
<<<<<<< HEAD
			 
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			yyyy: Year
			q: Quarter
			m: Month
			y: Day of year
			d: Day
			w: Weekday
			ww: Week
			h: Hour
			n: Minute
			s: Second
			l: Millisecond
			--->
			<cfparam name="ATTRIBUTES.DatePart" type="string" default="d"/>
<<<<<<< HEAD
		
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			Now that we have paramed all of our attributes,
			we have to validate the data.
			--->
			<cfif (NOT Fix(ATTRIBUTES.Step))>
<<<<<<< HEAD
			
=======

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				<!---
				The step value must be a non-zero number to
				prevent infinite looping.
				--->
<<<<<<< HEAD
				<cfthrow type="DateLoop.InvalidAttributeValue" message="Step must be a non-zero number." 
				         detail="The Step value you provide [#UCase( ATTRIBUTES.Step )#] must be non-zero number to prevent infinite looping."/>
			</cfif>
		
=======
				<cfthrow type="DateLoop.InvalidAttributeValue" message="Step must be a non-zero number."
				         detail="The Step value you provide [#UCase( ATTRIBUTES.Step )#] must be non-zero number to prevent infinite looping."/>
			</cfif>

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			ASSERT: If we have made it this far than we have
			all the required attributes and valid data.
			--->
			<!--- Initialize the loop sequence. --->
			<cfset THISTAG.Day = ATTRIBUTES.From/>
<<<<<<< HEAD
		
			<!--- Store the current value into the caller. --->
			<cfset "CALLER.#ATTRIBUTES.Index#" = ParseDateTime(DateFormat(THISTAG.Day, "mm/dd/yyyy") & " " & TimeFormat(THISTAG.Day, "HH:mm:ss"))/>
		
=======

			<!--- Store the current value into the caller. --->
			<cfset "CALLER.#ATTRIBUTES.Index#" = ParseDateTime(DateFormat(THISTAG.Day, "mm/dd/yyyy") & " " & TimeFormat(THISTAG.Day, "HH:mm:ss"))/>

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			Before we even start looping, let's check to see
			if we haven't already met our final condition.
			--->
<<<<<<< HEAD
			<cfif (((ATTRIBUTES.Step GT 0) AND (THISTAG.Day GT ATTRIBUTES.To)) OR ((ATTRIBUTES.Step LT 0) 
			      AND (THISTAG.Day LT ATTRIBUTES.To)))>
				<!--- Incrementing. --->
				<!--- Decrementing. --->
			
=======
			<cfif (((ATTRIBUTES.Step GT 0) AND (THISTAG.Day GT ATTRIBUTES.To)) OR ((ATTRIBUTES.Step LT 0)
			      AND (THISTAG.Day LT ATTRIBUTES.To)))>
				<!--- Incrementing. --->
				<!--- Decrementing. --->

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				<!---
				We have already met the final condition.
				Exit out before the loop even starts.
				--->
				<cfexit method="EXITTAG"/>
			</cfif>
		</cfcase>
<<<<<<< HEAD
	
		<cfcase value="End">
		
=======

		<cfcase value="End">

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			Increment the index value using the specified
			increment and date part.
			--->
			<cfset THISTAG.Day = DateAdd(ATTRIBUTES.DatePart, ATTRIBUTES.Step, THISTAG.Day)/>
<<<<<<< HEAD
		
			<!--- Store the current value into the caller. --->
			<cfset "CALLER.#ATTRIBUTES.Index#" = THISTAG.Day/>
		
=======

			<!--- Store the current value into the caller. --->
			<cfset "CALLER.#ATTRIBUTES.Index#" = THISTAG.Day/>

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
			<!---
			Check to see if we should continue to loop this
			value. When checking this, it depends on how the
			From and To values relate to each other.
			--->
<<<<<<< HEAD
			<cfif (((ATTRIBUTES.Step GT 0) AND (THISTAG.Day LTE ATTRIBUTES.To)) OR ((ATTRIBUTES.Step LT 0) 
			      AND (THISTAG.Day GTE ATTRIBUTES.To)))>
				<!--- Incrementing. --->
				<!--- Decrementing. --->
			
=======
			<cfif (((ATTRIBUTES.Step GT 0) AND (THISTAG.Day LTE ATTRIBUTES.To)) OR ((ATTRIBUTES.Step LT 0)
			      AND (THISTAG.Day GTE ATTRIBUTES.To)))>
				<!--- Incrementing. --->
				<!--- Decrementing. --->

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				<!---
				We are not done looping. Exit out using the
				LOOP type so that the EndTag will execute
				at least one more time.
				--->
				<cfexit method="LOOP"/>
<<<<<<< HEAD
			
			<cfelse>
			
=======

			<cfelse>

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
				<!---
				We are done looping. Exit out of the
				tag fully.
				--->
				<cfexit method="EXITTAG"/>
			</cfif>
		</cfcase>
<<<<<<< HEAD
	
	</cfswitch>
	
=======

	</cfswitch>

>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
</cfsilent>