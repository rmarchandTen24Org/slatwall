<!---
	
    Slatwall - An Open Source eCommerce Platform
    Copyright (C) ten24, LLC
	
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
	
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
	
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Linking this program statically or dynamically with other modules is
    making a combined work based on this program.  Thus, the terms and
    conditions of the GNU General Public License cover the whole
    combination.
	
    As a special exception, the copyright holders of this program give you
    permission to combine this program with independent modules and your 
    custom code, regardless of the license terms of these independent
    modules, and to copy and distribute the resulting program under terms 
    of your choice, provided that you follow these specific guidelines: 

	- You also meet the terms and conditions of the license of each 
	  independent module 
	- You must not alter the default display of the Slatwall name or logo from  
	  any part of the application 
	- Your custom code must not alter or create any files inside Slatwall, 
	  except in the following directories:
		/integrationServices/

	You may copy and distribute the modified version of this program that meets 
	the above guidelines as a combined work under the terms of GPL for this program, 
	provided that you include the source code of that other code when and as the 
	GNU GPL requires distribution of source code.
    
    If you modify this program, you may extend this exception to your version 
    of the program, but you are not obligated to do so.
	
Notes: 
																						
	The core of the checkout revolves around a value called the 'orderRequirementsList'	
	There are 3 major elements that all need to be in place for an order to be placed:	
																						
	account																				
	fulfillment																			
	payment																				
																						
	With that in mind you will want to display different UI elements & forms based on 	
	if one ore more of those items are in the orderRequirementsList.  In the eample		
	below we go in that order listed above, but you could very easily do it in a		
	different order if you like.														
																						
	
--->

<cfinclude template="_slatwall-header.cfm" />

<!--- This import allows for the custom tags required by this page to work --->
<cfimport prefix="sw" taglib="../tags" />

<!---[DEVELOPER NOTES]															
																				
	If you would like to customize any of the public tags used by this			
	template, the recommended method is to uncomment the below import,			
	copy the tag you'd like to customize into the directory defined by			
	this import, and then reference with swc:tagname instead of sw:tagname.		
	Technically you can define the prefix as whatever you would like and use	
	whatever directory you would like but we recommend using this for			
	the sake of convention.														
																				
	<cfimport prefix="swc" taglib="/Slatwall/custom/public/tags" />				
																				
--->

<!--- IMPORTANT: Get the orderRequirementsList to drive your UI Below --->
<cfset orderRequirementsList = $.slatwall.cart().getOrderRequirementsList() />

<!---[DEVELOPER NOTES]															
																				
	IMPORTANT: The orderRequirementsList just makes sure that there is an		
	account attached to the order, however it does not ensure that the user be	
	logged in because we allow by default for "guest checkout".  By leaving in	
	the conditionals below it will require that the user is logged in, or that	
	they are currently submitting the form as a guest checkout person			
																				
--->

<!--- Because we are going to potentially be dynamically adding 'account' back into the orderRequirementsList, we need to make sure that it isn't already part of the list, and that the session account ID's doesn't match the cart account ID --->
<cfif not listFindNoCase(orderRequirementsList, "account") and $.slatwall.cart().getAccount().getAccountID() neq $.slatwall.account().getAccountID()>

	<!--- Add account to the orderRequirements list --->
	<cfset orderRequirementsList = listPrepend(orderRequirementsList, "account") />

	<!--- OPTIONAL: This should be left in if you would like to allow for guest checkout --->
	<cfif $.slatwall.cart().getAccount().getGuestAccountFlag()>
		
		<!--- OPTIONAL: This condition can be left in if you would like to make it so that a guest checkout is only valid if the page submitted with a slatAction.  This prevents guest checkouts from still being valid if the user navigates away, and then back --->
		<cfif arrayLen($.slatwall.getCalledActions())>
			<cfset orderRequirementsList = listDeleteAt(orderRequirementsList, listFindNoCase(orderRequirementsList, "account")) />
		</cfif>
		<!--- IMPORTANT: If you delete the above contitional so that a guest can move about the site without loosing their checkout data, then you will want to uncomment below --->
		<!--- <cfset orderRequirementsList = listDeleteAt(orderRequirementsList, listFindNoCase(orderRequirementsList, "account")) /> ---> 
		
	</cfif>
</cfif>

<!--- IMPORTANT: This is here so that the checkout layout is never cached by the browser --->
<cfheader name="cache-control" value="no-cache, no-store, must-revalidate" /> 
<cfheader name="cache-control" value="post-check=0, pre-check=0" /> 
<cfheader name="last-modified" value="#now()#" />
<cfheader name="pragma"  value="no-cache" />

<!--- We are paraming this variable so that we can use it later to see if a specific step was clicked on.  Using the url.step is just a templating thing and it has nothing to do really with the core of Slatwall.  This could be changed to anything --->
<cfparam name="url.step" default="" />

<cfset paymentFormAction="?s=1">

<!--- If using HTTP, override the form to send over http if the setting Force Credit Card Over SSL is true --->
<cfif $.slatwall.setting('globalForceCreditCardOverSSL') EQ true AND (findNoCase("off", CGI.HTTPS) OR NOT CGI.SERVER_PORT_SECURE)>
	<cfset paymentFormAction = replace($.slatwall.getURL(), 'http://', 'https://') />	 
</cfif>

<cfoutput>
	<cfsilent>
		<div class="container">
			
			<!--- START CEHECKOUT EXAMPLE 1 --->
			<div class="row">
				<div class="span12">
					<h3>Checkout Example (4 Step)</h3>
					
					<!--- Display any errors associated with actually placing the order, and running those transactions --->
					<sw:ErrorDisplay object="#$.slatwall.cart()#" errorName="runPlaceOrderTransaction" displayType="p" />
				</div>
			</div>
			
			<!--- Verify that there are items in the cart --->
			<cfif arrayLen($.slatwall.cart().getOrderItems())>
				<div class="row">
					
					<!--- START: CHECKOUT DETAIL --->
					<div class="span8">
						
						
	<!--- ============== ACCOUNT ========================================= --->
						<cfif listFindNoCase(orderRequirementsList, "account") or url.step eq 'account'>
							
							<!--- START: ACCOUNT --->
							<h5>Step 1 - Account Details</h5>
							
							<div class="row">
								
								<!--- LOGIN --->
								<div class="span4">
									
									<h5>Login with Existing Account</h5>
									
									<!--- Sets up the account login processObject --->
									<cfset accountLoginObj = $.slatwall.getAccount().getProcessObject('login') />
									
									<!--- Start: Login Form --->
									<form action="?s=1" method="post">
										
										<!--- This hidden input is what tells slatwall to try and login the account --->
										<input type="hidden" name="slatAction" value="public:account.login" />
										
										<!--- Email Address --->
										<div class="control-group">
					    					<label class="control-label" for="emailAddress">Email Address</label>
					    					<div class="controls">
					    						
												<sw:FormField type="text" valueObject="#accountLoginObj#" valueObjectProperty="emailAddress" class="span4" />
												<sw:ErrorDisplay object="#accountLoginObj#" errorName="emailAddress" />
												
					    					</div>
					  					</div>
										
										<!--- Password --->
										<div class="control-group">
					    					<label class="control-label" for="password">Password</label>
					    					<div class="controls">
					    						
												<sw:FormField type="password" valueObject="#accountLoginObj#" valueObjectProperty="password" class="span4" />
												<sw:ErrorDisplay object="#accountLoginObj#" errorName="password" />
												
					    					</div>
					  					</div>
										
										<!--- Login Button --->
										<div class="control-group">
					    					<div class="controls">
					      						<button type="submit" class="btn btn-primary">Login & Continue</button>
					    					</div>
					  					</div>
										
									</form>
									<!--- End: Login Form --->
										
									<hr />
									
									<h5>Forgot Password</h5>
									
									<!--- Sets up the account login processObject --->
									<cfset forgotPasswordObj = $.slatwall.getAccount().getProcessObject('forgotPassword') />
									
									<!--- Start: Forgot Password Form --->
									<form action="?s=1" method="post">
										
										<!--- This hidden input is what tells slatwall to try and login the account --->
										<input type="hidden" name="slatAction" value="public:account.forgotPassword" />
										
										<!--- Email Address --->
										<div class="control-group">
					    					<label class="control-label" for="emailAddress">Email Address</label>
					    					<div class="controls">
					    						
												<sw:FormField type="text" valueObject="#accountLoginObj#" valueObjectProperty="emailAddress" class="span4" />
												<sw:ErrorDisplay object="#forgotPasswordObj#" errorName="emailAddress" />
												
					    					</div>
					  					</div>
										
										<!--- Reset Email Button --->
										<div class="control-group">
					    					<div class="controls">
					      						<button type="submit" class="btn">Send Me Reset Email</button>
					    					</div>
					  					</div>
										
									</form>
									<!--- End: Forgot Password Form --->
									
								</div>
								
								<!--- CREATE ACCOUNT --->
								<div class="span4">
									<h5>Create New Account</h5>
									
									<!--- Sets up the create account processObject --->
									<cfset createAccountObj = $.slatwall.account().getProcessObject('create') />
									
									<!--- Create Account Form --->
									<form action="?s=1" method="post">
										<!--- This hidden input is what tells slatwall to 'create' an account, it is then chained by the 'login' method so that happens directly after --->
										<input type="hidden" name="slatAction" value="public:account.create,public:account.login" />
										
										<!--- Name --->
										<div class="row">
											
											<!--- First Name --->
											<div class="span2">
												<div class="control-group">
							    					<label class="control-label" for="firstName">First Name</label>
							    					<div class="controls">
							    						
														<sw:FormField type="text" valueObject="#createAccountObj#" valueObjectProperty="firstName" class="span2" />
														<sw:ErrorDisplay object="#createAccountObj#" errorName="firstName" />
														
							    					</div>
							  					</div>
											</div>
											
											<!--- Last Name --->
											<div class="span2">
												<div class="control-group">
							    					<label class="control-label" for="lastName">Last Name</label>
							    					<div class="controls">
							    						
														<sw:FormField type="text" valueObject="#createAccountObj#" valueObjectProperty="lastName" class="span2" />
														<sw:ErrorDisplay object="#createAccountObj#" errorName="lastName" />
														
							    					</div>
							  					</div>
											</div>
											
										</div>
										
										<!--- Phone Number --->
										<div class="control-group">
					    					<label class="control-label" for="phoneNumber">Phone Number</label>
					    					<div class="controls">
					    						
												<sw:FormField type="text" valueObject="#createAccountObj#" valueObjectProperty="phoneNumber" class="span4" />
												<sw:ErrorDisplay object="#createAccountObj#" errorName="phoneNumber" />
												
					    					</div>
					  					</div>
										
										<!--- Email Address --->
										<div class="control-group">
					    					<label class="control-label" for="emailAddress">Email Address</label>
					    					<div class="controls">
					    						
												<sw:FormField type="text" valueObject="#createAccountObj#" valueObjectProperty="emailAddress" class="span4" />
												<sw:ErrorDisplay object="#createAccountObj#" errorName="emailAddress" />
												
					    					</div>
					  					</div>
										
										<!--- Email Address Confirm --->
										<div class="control-group">
					    					<label class="control-label" for="emailAddressConfirm">Confirm Email Address</label>
					    					<div class="controls">
					    						
												<sw:FormField type="text" valueObject="#createAccountObj#" valueObjectProperty="emailAddressConfirm" class="span4" />
												<sw:ErrorDisplay object="#createAccountObj#" errorName="emailAddressConfirm" />
												
					    					</div>
					  					</div>
										
										<!--- Guest Checkout --->
										<div class="control-group">
					    					<label class="control-label" for="createAuthenticationFlag">Save Account ( No for Guest Checkout )</label>
					    					<div class="controls">
					    						
												<sw:FormField type="yesno" valueObject="#createAccountObj#" valueObjectProperty="createAuthenticationFlag" />
												<sw:ErrorDisplay object="#createAccountObj#" errorName="createAuthenticationFlag" />
												
					    					</div>
					  					</div>
										
										<!--- SCRIPT IMPORTANT: This jQuery is just here for example purposes to show/hide the password fields if guestCheckout it set to true / false --->
										<script type="text/javascript">
											(function($){
												$(document).ready(function(){
													$('body').on('change', 'input[name="createAuthenticationFlag"]', function(e){
														if( $(this).val() == 0 ) {
															$('##password-details').hide();
															$(this).closest('form').find('input[name="slatAction"]').val('public:cart.guestaccount');
														} else {
															$('##password-details').show();
															$(this).closest('form').find('input[name="slatAction"]').val('public:account.create,public:account.login');
														}
													});
													$('input[name="createAuthenticationFlag"]:checked').change();
												});
											})( jQuery )
										</script>
										
										<!--- Password --->
										<div id="password-details" >
											<div class="control-group">
						    					<label class="control-label" for="password">Password</label>
						    					<div class="controls">
						    						
													<sw:FormField type="password" valueObject="#createAccountObj#" valueObjectProperty="password" class="span4" />
													<sw:ErrorDisplay object="#createAccountObj#" errorName="password" />
													
						    					</div>
						  					</div>
											
											<!--- Password Confirm --->
											<div class="control-group">
						    					<label class="control-label" for="passwordConfirm">Confirm Password</label>
						    					<div class="controls">
						    						
													<sw:FormField type="password" valueObject="#createAccountObj#" valueObjectProperty="passwordConfirm" class="span4" />
													<sw:ErrorDisplay object="#createAccountObj#" errorName="password" />
													
						    					</div>
						  					</div>
										</div>
										
										<!--- Create Button --->
										<div class="control-group pull-right">
					    					<div class="controls">
					      						<button type="submit" class="btn btn-primary">Create Account & Continue</button>
					    					</div>
					  					</div>
										
									</form>
									<!--- End: Create Account Form --->
									
								</div>
								
							</div>
							<!--- END: ACCOUNT --->
						
	<!--- ============= FULFILLMENT ============================================== --->
						<cfelseif listFindNoCase(orderRequirementsList, "fulfillment") or url.step eq 'fulfillment'>
							
							<!--- START: FULFILLMENT --->
							<h5>Step 2 - Fulfillment Details</h5>
							
							<form action="?s=1" method="post">
												
								<!--- Hidden slatAction to trigger a cart update with the new fulfillment information --->
								<input type="hidden" name="slatAction" value="public:cart.update" />
							
								<!--- Setup a fulfillment index, so that when the form is submitted all of the data is is compartmentalized --->
								<cfset orderFulfillmentIndex = 0 />
								
								<!--- We loop over the orderFulfillments and check if they are processable --->
								<cfloop array="#$.slatwall.cart().getOrderFulfillments()#" index="orderFulfillment">
									
									<!--- We need to check if this order fulfillment is one that needs to be updated, by checking if it is already processable or by checking if it has errors --->
									<cfif not orderFulfillment.isProcessable( context="placeOrder" ) or orderFulfillment.hasErrors() or url.step eq 'fulfillment'>
										
										<!--- Increment the orderFulfillment index so that we can update multiple order fulfillments at once --->
										<cfset orderFulfillmentIndex++ />
										
										<input type="hidden" name="orderFulfillments[#orderFulfillmentIndex#].orderFulfillmentID" value="#orderFulfillment.getOrderFulfillmentID()#" />
										
										<div class="row">
											
											<!---[DEVELOPER NOTES]																		
																																		
												Based on the fulfillmentMethodType we will display different form elements for the		
												end user to fill out.  The 'auto' fulifllment method type and 'download' fulfillment	
												method type, have no values that need to get input and that is why you don't see		
												them in the conditionals below.															
																																		
											--->
											
											<!--- EMAIL --->
											<cfif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "email">
												
												<div class="span8">
													<!--- Email Address --->
													<div class="control-group">
								    					<label class="control-label" for="emailAddress">Email Address</label>
								    					<div class="controls">
								    						
															<sw:FormField type="text" name="orderFulfillments[#orderFulfillmentIndex#].emailAddress" valueObject="#orderFulfillment#" valueObjectProperty="emailAddress" class="span4" />
															<sw:ErrorDisplay object="#orderFulfillment#" errorName="emailAddress" />
															
								    					</div>
								  					</div>
												</div>
												
											<!--- PICKUP --->
											<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "pickup">
												
												<div class="span8">
													<!--- Pickup Location --->
													<div class="control-group">
								    					<label class="control-label" for="pickupLocation">Pickup Location</label>
								    					<div class="controls">
								    						
															<sw:FormField type="select" name="orderFulfillments[#orderFulfillmentIndex#].pickupLocation.locationID" valueObject="#orderFulfillment#" valueObjectProperty="pickupLocation" valueOptions="#orderFulfillment.getPickupLocationOptions()#" class="span4" />
															<sw:ErrorDisplay object="#orderFulfillment#" errorName="pickupLocation" />
															
								    					</div>
								  					</div>
												</div>
											
											<!--- SHIPPING --->
											<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "shipping">
												
												<div class="span4">
													<h5>Shipping Address</h5>
													
													<!--- Get the options that the person can choose from --->
													<cfset accountAddressOptions = orderFulfillment.getAccountAddressOptions() />
													
													<!--- Add a 'New' Attribute so that we can drive the new form below --->
													<cfset arrayAppend(accountAddressOptions, {name='New', value=''}) />
													
													<!--- As long as there are no errors for the orderFulfillment, we can setup the default accountAddress value to be selected --->
													<cfset accountAddressID = "" />
													
													<cfif !isNull(orderFulfillment.getAccountAddress())>
														<cfset accountAddressID = orderFulfillment.getAccountAddress().getAccountAddressID() />
													<cfelseif orderFulfillment.getShippingAddress().getNewFlag() && not orderFulfillment.getShippingAddress().hasErrors()>
														<cfset accountAddressID = $.slatwall.cart().getAccount().getPrimaryAddress().getAccountAddressID() />
													</cfif>							
	
													<!--- If there are existing account addresses, then we can allow the user to select one of those --->
													<cfif arrayLen(accountAddressOptions) gt 1>
														
														<!--- Account Address --->
														<div class="control-group">
									    					<label class="control-label" for="accountAddress">Select Address</label>
									    					<div class="controls">
									    						
																<sw:FormField type="select" name="orderFulfillments[#orderFulfillmentIndex#].accountAddress.accountAddressID" valueObject="#orderFulfillment#" valueObjectProperty="accountAddress" valueOptions="#accountAddressOptions#" value="#accountAddressID#" class="span4" />
																<sw:ErrorDisplay object="#orderFulfillment#" errorName="accountAddress" />
																
									    					</div>
									  					</div>
														
														<hr />
													</cfif>
													
													<!--- New Shipping Address --->
													<div id="new-shipping-address#orderFulfillmentIndex#"<cfif len(accountAddressID)> class="hide"</cfif>>
														<cfif isNull(orderFulfillment.getAccountAddress())>
															<sw:AddressForm id="newShippingAddress" address="#orderFulfillment.getAddress()#" fieldNamePrefix="orderFulfillments[#orderFulfillmentIndex#].shippingAddress." fieldClass="span4" />
														<cfelse>
															<sw:AddressForm id="newShippingAddress" address="#orderFulfillment.getNewPropertyEntity( 'shippingAddress' )#" fieldNamePrefix="orderFulfillments[#orderFulfillmentIndex#].shippingAddress." fieldClass="span4" />
														</cfif>
														
														<!--- As long as the account is not a guest account, and this is truely new address we are adding, then we can offer to save as an account address for use on later purchases --->
														<cfif not $.slatwall.getCart().getAccount().getGuestAccountFlag()>
															
															<!--- Save As Account Address --->
															<div class="control-group">
										    					<label class="control-label" for="saveAccountAddressFlag">Save In Address Book</label>
										    					<div class="controls">
										    						
																	<sw:FormField type="yesno" name="orderFulfillments[#orderFulfillmentIndex#].saveAccountAddressFlag" valueObject="#orderFulfillment#" valueObjectProperty="saveAccountAddressFlag" />
																	
										    					</div>
										  					</div>
															
															<!--- Save Account Address Name --->
															<div id="save-account-address-name#orderFulfillmentIndex#"<cfif not orderFulfillment.getSaveAccountAddressFlag()> class="hide"</cfif>>
																<div class="control-group">
											    					<label class="control-label" for="saveAccountAddressName">Address Nickname (optional)</label>
											    					<div class="controls">
											    						
																		<sw:FormField type="text" name="orderFulfillments[#orderFulfillmentIndex#].saveAccountAddressName" valueObject="#orderFulfillment#" valueObjectProperty="saveAccountAddressName" class="span4" />
																		
											    					</div>
											  					</div>
															</div>
															
														</cfif>
														
													</div>
													
													<!--- SCRIPT IMPORTANT: This jQuery is just here for example purposes to show/hide the new address field if there are account addresses --->
													<script type="text/javascript">
														(function($){
															$(document).ready(function(){
																$('body').on('change', 'select[name="orderFulfillments[#orderFulfillmentIndex#].accountAddress.accountAddressID"]', function(e){
																	if( $(this).val() === '' ) {
																		$('##new-shipping-address#orderFulfillmentIndex#').show();
																	} else {
																		$('##new-shipping-address#orderFulfillmentIndex#').hide();
																	}
																});
																$('body').on('change', 'input[name="orderFulfillments[#orderFulfillmentIndex#].saveAccountAddressFlag"]', function(e){
																	if( $(this).val() ) {
																		$('##save-account-address-name#orderFulfillmentIndex#').show();
																	} else {
																		$('##save-account-address-name#orderFulfillmentIndex#').hide();
																	}
																});
																$('select[name="orderFulfillments[#orderFulfillmentIndex#].accountAddress.accountAddressID"]').change();
															});
														})( jQuery )
													</script>
													
														
												</div>
												
												
												<!--- START: Shipping Method Selection --->
												<div class="span4">
													<h5>Shipping Method</h5>
													
													<!--- If there are multiple shipping methods to select from, then display that --->
													<cfif arrayLen(orderFulfillment.getShippingMethodOptions()) gt 1>
														
														<!--- Start: Shipping Method Example 1 --->
														<div class="control-group">
									    					<label class="control-label" for="shippingMethod">Shipping Method Example</label>
									    					<div class="controls">
									    						
																<!--- OPTIONAL: You can use this formField display to show options as a select box
																<sw:FormField type="select" name="orderFulfillments[#orderFulfillmentIndex#].shippingMethod.shippingMethodID" valueObject="#orderFulfillment#" valueObjectProperty="shippingMethod" valueOptions="#orderFulfillment.getShippingMethodOptions()#" class="span4" />
																--->
																<cfset shippingMethodID = "" />
																<cfif not isNull(orderFulfillment.getShippingMethod())>
																	<cfset shippingMethodID = orderFulfillment.getShippingMethod().getShippingMethodID() />	
																</cfif>
																
																<sw:FormField type="radiogroup" name="orderFulfillments[#orderFulfillmentIndex#].shippingMethod.shippingMethodID" value="#shippingMethodID#" valueOptions="#orderFulfillment.getShippingMethodOptions()#" />
																<sw:ErrorDisplay object="#orderFulfillment#" errorName="shippingMethod" />
																
									    					</div>
									  					</div>
														<!--- End: Shipping Method Example 1 --->
															
													<!--- If there is only 1 shipping method option that comes back, then we can just tell the customer how there order will be shipped --->
													<cfelseif arrayLen(orderFulfillment.getShippingMethodOptions()) and len(orderFulfillment.getShippingMethodOptions()[1]['value'])>
													
														<!--- We should still pass the shipping method as a hidden value --->
														<input type="hidden" name="orderFulfillments[#orderFulfillmentIndex#].shippingMethod.shippingMethodID" value="#orderFulfillment.getShippingMethodOptions()[1]['value']#" />
														
														<p>This order will be shipped via: #orderFulfillment.getFulfillmentShippingMethodOptions()[1].getShippingMethodRate().getShippingMethod().getShippingMethodName()# ( #orderFulfillment.getFulfillmentShippingMethodOptions()[1].getFormattedValue('totalCharge')# )</p>
														
													<!--- Show message to customer telling them that they need to fill in an address before we can provide a shipping method quote --->
													<cfelse>
														
														<!--- If the user has not yet defined their shipping address, then we can display a note for them --->
														<cfif orderFulfillment.getAddress().getNewFlag()>
															<p>Please update your shipping address first so that we can provide you with the correct shipping rates.</p>
															
														<!--- If they have already provided an address, and there are still no shipping method options, then the address they entered is not one that can be shipped to --->
														<cfelse>
															
															<p>Unfortunately the shipping address that you have provided is not one that we ship to.  Please update your shipping address and try again, or contact customer service for more information.</p>
															
														</cfif>
														
													</cfif>
												</div>
												<!--- END: Shipping Method Selection --->
												
											</cfif>
											
											<!--- Action Buttons --->
											<div class="span8">
												<div class="control-group pull-right">
													<div class="controls">
														<!--- Continue, just submits the form --->
														<button type="submit" class="btn btn-primary">Save & Continue</button>
													</div>
												</div>
											</div>
											
										</div>
										
									</cfif>
									
								</cfloop>
								
							</form>
							<!--- END: FULFILLMENT --->
								
	<!--- ============= PAYMENT ============================================== --->
						<cfelseif listFindNoCase(orderRequirementsList, "payment") or url.step eq 'payment'>
						
							<!--- get the eligable payment methods for this order --->
							<cfset eligiblePaymentMethods = $.slatwall.cart().getEligiblePaymentMethodDetails() />
							
							<!--- START: PAYMENT --->
							<h5>Step 3 - Payment Details</h5>
							
							<br />
							
							<!--- Get the applied payments smart list, and filter by only payments that are active --->
							<cfset appliedPaymentsSmartList = $.slatwall.cart().getOrderPaymentsSmartList() />
							<cfset appliedPaymentsSmartList.addFilter('orderPaymentStatusType.systemCode', 'opstActive') />
							
							<!--- Display existing order payments, we are using the smart list here so that any non-persisted order payments don't show up --->
							<cfif appliedPaymentsSmartList.getRecordsCount()>
								<h5>Payments Applied</h5>
								
								<!--- Applied Payments Table --->
								<table class="table">
									<tr>
										<th>Payment Details</th>
										<th>Amount</th>
										<th>&nbsp;</th>
									</tr>
									
									<cfloop array="#appliedPaymentsSmartList.getRecords()#" index="orderPayment">
										<tr>
											<td>#orderPayment.getSimpleRepresentation()#</td>
											<td>#orderPayment.getAmount()#</td>
											<td><a href="?slatAction=public:cart.removeOrderPayment&orderPaymentID=#orderPayment.getOrderPaymentID()#">Remove</a></td>
										</tr>
									</cfloop>
								</table>
							</cfif>
							
							<!--- Display any errors associated with adding order payment --->
							<sw:ErrorDisplay object="#$.slatwall.cart()#" errorName="addOrderPayment" />
							
							<!--- Payment Method Nav Tabs --->
							<ul class="nav nav-tabs" id="myTab">
								
								<!--- This first variables here is only used to define the 'active' tab for bootstrap css to take over --->
								<cfset first = true />
								
								<!--- If the user has "AccountPaymentMethods" then we can first display a tab that allows them to select from existing payment methods ---> 
								<cfif arrayLen($.slatwall.account().getAccountPaymentMethods())>
									<li class="active"><a href="##account-payment-methods" data-toggle="tab">Use Saved Payment Info</a></li>
									<cfset first = false />
								</cfif>
								
								<!--- Loop over all of the eligible payment methods --->
								<cfloop array="#eligiblePaymentMethods#" index="paymentDetails">
									<li class="#iif(first, de('active'), de(''))#"><a href="##tab#paymentDetails.paymentMethod.getPaymentMethodID()#" data-toggle="tab">Pay with #paymentDetails.paymentMethod.getPaymentMethodName()#</a></li>
									<cfset first = false />
								</cfloop>
							</ul>
							
							<!--- Setup the addOrderPayment entity so that it can be used for each of these --->
							<cfset addOrderPaymentObj = $.slatwall.cart().getProcessObject("addOrderPayment") />
							
							<!--- Payment Tab Content --->
							<div class="tab-content">
								
								<!--- This first variables here is only used to define the 'active' tab for bootstrap css to take over --->
								<cfset first = true />
								
								<!--- If the user has "AccountPaymentMethods" then we can first display a tab that allows them to select from existing payment methods ---> 
								<cfif arrayLen($.slatwall.account().getAccountPaymentMethods())>
									<div class="tab-pane active" id="account-payment-methods">
										<form action="?s=1" method="post">
											
											<!--- Hidden value to setup the slatAction --->
											<input id="slatActionApplyAccountPaymentMethod" type="hidden" name="slatAction" value="public:cart.addOrderPayment" />
											
											<cfset apmFirst = true />
											
											<!--- Loop over all of the account payment methods and display them as a radio button to select --->
											<cfloop array="#$.slatwall.account().getAccountPaymentMethods()#" index="accountPaymentMethod">
												
												<input type="radio" name="accountPaymentMethodID" value="#accountPaymentMethod.getAccountPaymentMethodID()#" <cfif apmFirst>checked="checked" <cfset ampFirst = false /></cfif>/>
												
												<!--- CASH --->
												<cfif accountPaymentMethod.getPaymentMethod().getPaymentMethodType() eq "cash">
													#accountPaymentMethod.getSimpleRepresentation()#
													<hr />
												<!--- CHECK --->
												<cfelseif accountPaymentMethod.getPaymentMethod().getPaymentMethodType() eq "check">
													#accountPaymentMethod.getSimpleRepresentation()#
													<hr />
												<!--- CREDIT CARD --->
												<cfelseif accountPaymentMethod.getPaymentMethod().getPaymentMethodType() eq "creditCard">
													#accountPaymentMethod.getSimpleRepresentation()#
													<hr />
												<!--- GIFT CARD --->
												<cfelseif accountPaymentMethod.getPaymentMethod().getPaymentMethodType() eq "giftCard">
													#accountPaymentMethod.getSimpleRepresentation()#
													<hr />
												<!--- TERM PAYMENT --->
												<cfelseif accountPaymentMethod.getPaymentMethod().getPaymentMethodType() eq "termPayment">
													#accountPaymentMethod.getSimpleRepresentation()#
													<hr />
												</cfif>
												
												<cfset apmFirst = false />
											</cfloop>
											
											<!--- This button will just add the order payment, but not actually process the order --->
											<button type="submit" class="btn" onClick="$('##slatActionApplyAccountPaymentMethod').val('public:cart.addOrderPayment');">Apply Payment Method & Review</button>
											
											<!--- Clicking this button will not only add the payment, but it will also attempt to place the order. --->
											<button type="submit" class="btn btn-primary" onClick="$('##slatActionApplyAccountPaymentMethod').val('public:cart.placeOrder');">Apply Payment Method & Place Order</button>
										</form>
									</div>
									<cfset first = false />
								</cfif>
								
								<!--- Loop over all of the eligible payment methods --->
								<cfloop array="#eligiblePaymentMethods#" index="paymentDetails">
									
									<div class="tab-pane#iif(first, de(' active'), de(''))#" id="tab#paymentDetails.paymentMethod.getPaymentMethodID()#">
										
										<!--- EXTERNAL --->
										<cfif paymentDetails.paymentMethod.getPaymentMethodType() eq "external">
											#paymentDetails.paymentMethod.getExternalPaymentHTML()#
											
										<!--- CASH, CHECK, CREDIT CARD, GIFT CARD, TERM PAYMENT --->
										<cfelse>
											<form action="#paymentFormAction#" method="post">
												
												<!--- Hidden value to setup the slatAction --->
												<input id="slatActionAddOrderPayment" type="hidden" name="slatAction" value="public:cart.addOrderPayment" />
												
												<!--- Hidden value to identify the type of payment method this is --->
												<input type="hidden" name="newOrderPayment.orderPaymentID" value="#addOrderPaymentObj.getNewOrderPayment().getOrderPaymentID()#" />
												<input type="hidden" name="newOrderPayment.paymentMethod.paymentMethodID" value="#paymentDetails.paymentMethod.getPaymentMethodID()#" />
												
												<sw:ErrorDisplay object="#$.slatwall.cart()#" errorName="addOrderPayment" />
												
												<!--- CASH --->
												<cfif paymentDetails.paymentMethod.getPaymentMethodType() eq "cash">
													
												<!--- CHECK --->
												<cfelseif paymentDetails.paymentMethod.getPaymentMethodType() eq "check">
													
												<!--- CREDIT CARD --->
												<cfelseif paymentDetails.paymentMethod.getPaymentMethodType() eq "creditCard">
													<div class="row">
														<div class="span4">
															<h5>Billing Address</h5>
															
															<sw:AddressForm id="newBillingAddress" address="#addOrderPaymentObj.getNewOrderPayment().getBillingAddress()#" fieldNamePrefix="newOrderPayment.billingAddress." fieldClass="span4" />
														</div>
														<div class="span4">
															<h5>Credit Card Info</h5>
															
															<!--- Credit Card Number --->
															<div class="control-group">
										    					<label class="control-label" for="creditCardNumber">Credit Card Number</label>
										    					<div class="controls">
										    						
																	<sw:FormField type="text" name="newOrderPayment.creditCardNumber" valueObject="#addOrderPaymentObj.getNewOrderPayment()#" valueObjectProperty="creditCardNumber" class="span4" />
																	<sw:ErrorDisplay object="#addOrderPaymentObj.getNewOrderPayment()#" errorName="creditCardNumber" />
																	
										    					</div>
										  					</div>
															
															<!--- Name on Credit Card --->
															<div class="control-group">
										    					<label class="control-label" for="nameOnCreditCard">Name on Card</label>
										    					<div class="controls">
										    						
																	<sw:FormField type="text" name="newOrderPayment.nameOnCreditCard" valueObject="#addOrderPaymentObj.getNewOrderPayment()#" valueObjectProperty="nameOnCreditCard" class="span4" />
																	<sw:ErrorDisplay object="#addOrderPaymentObj.getNewOrderPayment()#" errorName="nameOnCreditCard" />
																	
										    					</div>
										  					</div>
															
															<!--- Security & Expiration Row --->
															<div class="row">
																
																<div class="span2">
																	
																	<!--- Security Code --->
																	<div class="control-group">
												    					<label class="control-label" for="securityCode">Security Code</label>
												    					<div class="controls">
												    						
																			<sw:FormField type="text" name="newOrderPayment.securityCode" valueObject="#addOrderPaymentObj.getNewOrderPayment()#" valueObjectProperty="securityCode" class="span2" />
																			<sw:ErrorDisplay object="#addOrderPaymentObj.getNewOrderPayment()#" errorName="securityCode" />
																			
												    					</div>
												  					</div>
																	
																</div>
																
																
																<div class="span2">
																	
																	<!--- Expiration --->	
																	<div class="control-group">
												    					<label class="control-label pull-right" for="expirationMonth">Expiration ( MM / YYYY )</label>
												    					<div class="controls pull-right">
												    						
																			<sw:FormField type="select" name="newOrderPayment.expirationMonth" valueObject="#addOrderPaymentObj.getNewOrderPayment()#" valueObjectProperty="expirationMonth" valueOptions="#addOrderPaymentObj.getNewOrderPayment().getExpirationMonthOptions()#" class="span1" />
																			<sw:FormField type="select" name="newOrderPayment.expirationYear" valueObject="#addOrderPaymentObj.getNewOrderPayment()#" valueObjectProperty="expirationYear" valueOptions="#addOrderPaymentObj.getNewOrderPayment().getExpirationYearOptions()#" class="span1" />
																			<sw:ErrorDisplay object="#addOrderPaymentObj.getNewOrderPayment()#" errorName="expirationMonth" />
																			<sw:ErrorDisplay object="#addOrderPaymentObj.getNewOrderPayment()#" errorName="expirationYear" />
																			
												    					</div>
												  					</div>
																	
																</div>
															</div>
															
															<!--- SPLIT PAYMENTS (OPTIONAL) - Just delete this section if you don't want to allow for split payments --->
															<cfset splitPaymentID = "sp" & lcase(createUUID()) />
															<div class="control-group">
										    					<label class="control-label" for="newOrderPayment.amount">Amount</label>
										    					<div class="controls">
										    						
										    						#$.slatwall.formatValue(paymentDetails.maximumAmount, 'currency')#
										    						<a href="##" id='#splitPaymentID#'>Split Payment</a>
										    						
										    					</div>
										  					</div>
															<script type="text/javascript">
																(function($){
																	$(document).ready(function(e){
																		
																		// Bind to split button
																		$('body').on('click', '###splitPaymentID#', function(e){
																			e.preventDefault();
																			$(this).closest('div').html('<input type="text" name="newOrderPayment.amount" value="#paymentDetails.maximumAmount#" class="span4" />');
																		});
																		
																	});
																})( jQuery );
															</script>
															<!--- END: SPLIT PAYMENT --->
														</div>
													</div>
													
												<!--- GIFT CARD --->
												<cfelseif paymentDetails.paymentMethod.getPaymentMethodType() eq "giftCard">
													
												<!--- TERM PAYMENT --->
												<cfelseif paymentDetails.paymentMethod.getPaymentMethodType() eq "termPayment">
														
												</cfif>
												
												<div class="control-group pull-right">
													<div class="controls">
														<!--- This button will just add the order payment, but not actually process the order --->
														<button type="submit" class="btn" name="slatAction" onClick="$('##slatActionAddOrderPayment').val('public:cart.addOrderPayment');">Add Payment & Review</button>
														
														<!--- Clicking this button will not only add the payment, but it will also attempt to place the order. --->
														<button type="submit" class="btn btn-primary" name="slatAction" onClick="$('##slatActionAddOrderPayment').val('public:cart.placeOrder');">Add Payment & Place Order</button>
													</div>
												</div>
											</form>
										</cfif>
									</div>
									
									<cfset first = false />
								</cfloop>
							</div>
							
							<!--- END: PAYMENT --->
								
	<!--- ============= CONFIRMATION ============================================== --->
	<!--- ============= ORDER REVIEW ============================================== --->
						<cfelseif not len(orderRequirementsList) or url.step eq 'review'>
							
							<h4>Step 4 - Order Review</h4>
	
							<form action="?s=1" method="post">
								<input type="hidden" name="slatAction" value="public:cart.placeOrder" />
								
								<!--- Account Details --->
								<cfif not listFindNoCase(orderRequirementsList, "account") and not $.slatwall.cart().getAccount().isNew()>						
									<div class="row-fluid">
										<div class="span12">
											<h5>Account Details <cfif $.slatwall.cart().getAccount().getGuestAccountFlag()><a href="?step=account">edit</a></cfif></h5>
											
											<p>
												<!--- Name --->
												<strong>#$.slatwall.cart().getAccount().getFullName()#</strong><br />
												
												<!--- Email Address --->
												<cfif len($.slatwall.cart().getAccount().getEmailAddress())>#$.slatwall.cart().getAccount().getEmailAddress()#<br /></cfif>
												
												<!--- Phone Number --->
												<cfif len($.slatwall.cart().getAccount().getPhoneNumber())>#$.slatwall.cart().getAccount().getPhoneNumber()#<br /></cfif>
												
												<!--- Logout Link --->
												<cfif not $.slatwall.cart().getAccount().getGuestAccountFlag()>
													<br />
													<a href="?slatAction=public:account.logout">That isn't me ( Logout )</a>
												</cfif>
											</p>
											<hr>
										</div>
									</div>
								</cfif>
		
								<!--- Fulfillment Details --->
								<cfif not listFindNoCase(orderRequirementsList, "account") and not $.slatwall.cart().getAccount().isNew()>
									<div class="row-fluid">
										<div class="span12">						
											<h5>Fulfillment Details <a href="?step=fulfillment">edit</a></h5>
											<cfloop array="#$.slatwall.cart().getOrderFulfillments()#" index="orderFulfillment">
												<div class="row-fluid">
													<div class="span6">										
														<!--- Fulfillment Method --->
														<h6>Shipping Via:</h6>
														#orderFulfillment.getFulfillmentMethod().getFulfillmentMethodName()#<br />
														#arrayLen(orderFulfillment.getOrderFulfillmentItems())# Item(s)
													</div>
													<div class="span6">
														<h6>Shipping To:</h6>
														<!--- EMAIL --->
														<cfif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "email">
															Email Address: #htmlEditFormat( orderFulfillment.getEmailAddress() )#<br />
															
														<!--- PICKUP --->
														<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "pickup">
															Pickup Location: #htmlEditFormat( orderFulfillment.getPickupLocation().getLocationName() )#
															
														<!--- SHIPPING --->
														<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "shipping">
															<cfif not isNull(orderFulfillment.getAddress().getName())>
																#htmlEditFormat( orderFulfillment.getAddress().getName() )#<br />
															</cfif>
															<cfif not isNull(orderFulfillment.getAddress().getCompany())>
																#htmlEditFormat( orderFulfillment.getAddress().getCompany() )#<br />
															</cfif>
															<cfif not isNull(orderFulfillment.getAddress().getStreetAddress())>
																#htmlEditFormat( orderFulfillment.getAddress().getStreetAddress() )#<br />
															</cfif>
															<cfif not isNull(orderFulfillment.getAddress().getStreet2Address())>
																#htmlEditFormat( orderFulfillment.getAddress().getStreet2Address() )#<br />
															</cfif>
															<cfif not isNull(orderFulfillment.getAddress().getLocality())>
																#htmlEditFormat( orderFulfillment.getAddress().getLocality() )#<br />
															</cfif>
															<cfif not isNull(orderFulfillment.getAddress().getCity()) and not isNull(orderFulfillment.getAddress().getStateCode()) and not isNull(orderFulfillment.getAddress().getPostalCode())>
																#htmlEditFormat( orderFulfillment.getAddress().getCity() )#, #htmlEditFormat( orderFulfillment.getAddress().getStateCode() )# #htmlEditFormat( orderFulfillment.getAddress().getPostalCode() )#<br />
															<cfelse>
																<cfif not isNull(orderFulfillment.getAddress().getCity())>
																	#htmlEditFormat( orderFulfillment.getAddress().getCity() )#<br />
																</cfif>
																<cfif not isNull(orderFulfillment.getAddress().getStateCode())>
																	#htmlEditFormat( orderFulfillment.getAddress().getStateCode() )#<br />
																</cfif>
																<cfif not isNull(orderFulfillment.getAddress().getPostalCode())>
																	#htmlEditFormat( orderFulfillment.getAddress().getPostalCode() )#<br />
																</cfif>
															</cfif>
															<cfif not isNull(orderFulfillment.getAddress().getCountryCode())>
																#htmlEditFormat( orderFulfillment.getAddress().getCountryCode() )#<br />
															</cfif>
														</cfif>
													</div>
												</div>
											</cfloop>
											<hr>
										</div>
									</div>
								</cfif>
		
								<!--- Payment Details --->
								<div class="row-fluid">
									<div class="span12">
										<h5>Payment Details <a href="?step=payment">edit</a></h5>
										
										<!--- Get the applied payments smart list, and filter by only payments that are active --->
										<cfset appliedPaymentsSmartList = $.slatwall.cart().getOrderPaymentsSmartList() />
										<cfset appliedPaymentsSmartList.addFilter('orderPaymentStatusType.systemCode', 'opstActive') />
										
										<cfset orderPaymentReviewIndex = 0 />
										
										<!--- List the payment methods applied to this order --->
										<cfloop array="#appliedPaymentsSmartList.getRecords()#" index="orderPayment">
											
											<cfset orderPaymentReviewIndex++ />
											
											<div class="row-fluid">
												
												<!--- Display payment method details and payment amount --->
												<div class="span6">
													<h6>Method:</h6>
													
													<input type="hidden" name="orderPayments[#orderPaymentReviewIndex#].orderPaymentID" value="#orderPayment.getOrderPaymentID()#" />
														
													<cfif orderPayment.getPaymentMethodType() EQ "creditcard">
														
														Name on Card: #htmlEditFormat( orderPayment.getNameOnCreditCard() )#<br />
														Card: #orderPayment.getCreditCardType()# ***#orderPayment.getCreditCardLastFour()#<br />
														Expiration: #htmlEditFormat( orderPayment.getExpirationMonth() )# / #htmlEditFormat( orderPayment.getExpirationYear() )#<br />
														Payment Amount: #orderPayment.getFormattedValue('amount')#<br />
														
														<cfif isNull(orderPayment.getProviderToken()) && !isNull(orderPayment.getSecurityCode())>
															<input type="hidden" name="orderPayments[#orderPaymentReviewIndex#].securityCode" value="#orderPayment.getSecurityCode()#" />
														<cfelseif isNull(orderPayment.getProviderToken())>
															<div class="control-group">
										    					<label class="control-label" for="securityCode">Re-Enter Security Code</label>
										    					<div class="controls">
										    						<input type="text" name="orderPayments[#orderPaymentReviewIndex#].securityCode" value="" class="required" />		
										    					</div>
										  					</div>
														</cfif>
														
													<cfelse>
														
														#orderPayment.getSimpleRepresentation()#<br />
														Payment Amount: #orderPayment.getFormattedValue('amount')#
														
													</cfif>
												</div>
												<!--- Display Payment Billing Address, if there one --->
												<cfif not isNull(orderPayment.getBillingAddress())>
													<div class="span6">
														<h6>Billing Address:</h6>
														#htmlEditFormat( orderPayment.getBillingAddress().getName() )#<br />
														<cfif isNull(orderPayment.getBillingAddress().getCompany()) && len(orderPayment.getBillingAddress().getCompany())>
															#htmlEditFormat( orderPayment.getBillingAddress().getCompany() )#<br />
														</cfif>
														<cfif !isNull(orderPayment.getBillingAddress().getPhoneNumber()) && len(orderPayment.getBillingAddress().getCompany())>
															#htmlEditFormat( orderPayment.getBillingAddress().getPhoneNumber() )#<br />
														</cfif>
														#htmlEditFormat( orderPayment.getBillingAddress().getStreetAddress() )#<br />
														<cfif not isNull(orderPayment.getBillingAddress().getStreet2Address()) && len(orderPayment.getBillingAddress().getStreet2Address())>#htmlEditFormat( orderPayment.getBillingAddress().getStreet2Address() )#<br /></cfif>
														#htmlEditFormat( orderPayment.getBillingAddress().getCity() )#, #htmlEditFormat( orderPayment.getBillingAddress().getStateCode() )# #htmlEditFormat( orderPayment.getBillingAddress().getPostalCode() )#<br />
														#htmlEditFormat( orderPayment.getBillingAddress().getCountryCode() )#
													</div>
												</cfif>
											</div>
										</cfloop>
									</div>
								</div>
							
								<div class="control-group pull-right">
									<div class="controls">
										
										<!--- Clicking this button will not only add the payment, but it will also attempt to place the order. --->
										<button type="submit" class="btn btn-primary">Place Order</button>
									</div>
								</div>
							</form>
						</cfif>
							
					</div>
					<!--- END: CHECKOUT DETAIL --->
					
					
					<!--- START: ORDER SUMMARY --->
					<div class="span4">
						
						<h5>Order Summary</h5>
						<hr />
						
						<!--- Account Details --->
						<cfif not listFindNoCase(orderRequirementsList, "account") and not $.slatwall.cart().getAccount().isNew()>
							<h5>Account Details <cfif $.slatwall.cart().getAccount().getGuestAccountFlag()><a href="?step=account">edit</a></cfif></h5>
							
							<p>
								<!--- Name --->
								<strong>#htmlEditFormat( $.slatwall.cart().getAccount().getFullName() )#</strong><br />
								
								<!--- Email Address --->
								<cfif len($.slatwall.cart().getAccount().getEmailAddress())>#$.slatwall.cart().getAccount().getEmailAddress()#<br /></cfif>
								
								<!--- Phone Number --->
								<cfif len($.slatwall.cart().getAccount().getPhoneNumber())>#$.slatwall.cart().getAccount().getPhoneNumber()#<br /></cfif>
								
								<!--- Logout Link --->
								<cfif not $.slatwall.cart().getAccount().getGuestAccountFlag()>
									<br />
									<a href="?slatAction=public:account.logout">That isn't me ( Logout )</a>
								</cfif>
							</p>
							
							<hr />
						</cfif>
						
						<!--- Fulfillment Details --->
						<cfif not listFindNoCase(orderRequirementsList, "account") and not listFindNoCase(orderRequirementsList, "fulfillment")>
							<h5>Fulfillment Details <a href="?step=fulfillment">edit</a></h5>
							<cfloop array="#$.slatwall.cart().getOrderFulfillments()#" index="orderFulfillment">
								<p>
									<!--- Fulfillment Method --->
									<strong>#orderFulfillment.getFulfillmentMethod().getFulfillmentMethodName()# - #arrayLen(orderFulfillment.getOrderFulfillmentItems())# Item(s)</strong><br />
									
									<!--- EMAIL --->
									<cfif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "email">
										Email Address: #orderFulfillment.getEmailAddress()#<br />
										
									<!--- PICKUP --->
									<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "pickup">
										Pickup Location: #orderFulfillment.getPickupLocation().getLocationName()#
										
									<!--- SHIPPING --->
									<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "shipping">
										<sw:AddressDisplay address="#orderFulfillment.getAddress()#" />
										<cfif not isNull(orderFulfillment.getShippingMethod())>
											<strong>Shipping Method:</strong> #orderFulfillment.getShippingMethod().getShippingMethodName()#<br />
										</cfif>
										
									</cfif>
								</p>
								
								<hr />
							</cfloop>
						</cfif>
						
						<!--- Order Totals --->
						<h5>Order Totals</h5>
						<table class="table table-condensed">
							<!--- The Subtotal is all of the orderItems before any discounts are applied --->
							<tr>
								<td>Subtotal</td>
								<td>#$.slatwall.cart().getFormattedValue('subtotal')#</td>
							</tr>
							<!--- This displays a delivery cost, some times it might make sense to do a conditional here and check if the amount is > 0, then display otherwise show something like TBD --->
							<tr>
								<td>Delivery</td>
								<td>#$.slatwall.cart().getFormattedValue('fulfillmentTotal')#</td>
							</tr>
							<!--- Displays the total tax that was calculated for this order --->
							<tr>
								<td>Tax</td>
								<td>#$.slatwall.cart().getFormattedValue('taxTotal')#</td>
							</tr>
							<!--- If there were discounts they would be displayed here --->
							<cfif $.slatwall.cart().getDiscountTotal() gt 0>
								<tr>
									<td>Discounts</td>
									<td>#$.slatwall.cart().getFormattedValue('discountTotal')#</td>
								</tr>
							</cfif>
							<!--- The total is the finished amount that the customer can expect to pay --->
							<tr>
								<td><strong>Total</strong></td>
								<td><strong>#$.slatwall.cart().getFormattedValue('total')#</strong></td>
							</tr>
						</table>
					</div>
					<!--- END: ORDER SUMMARY --->
						
				</div>
				
	<!--- ======================= ORDER PLACED & CONFIRMATION ============================= --->
			<cfelseif not isNull($.slatwall.getSession().getLastPlacedOrderID())>
				
				<!--- setup the order that just got placed in a local variable to be used by the following display --->
				<cfset order = $.slatwall.getService('orderService').getOrder( $.slatwall.getSession().getLastPlacedOrderID() ) />
				
				<!--- Overview & Status --->
				<h4>Your Order Has Been Placed!</h4>
				
				<!--- START: SAVE GUEST ACCOUNT --->
					
				<!---[DEVELOPER NOTES]																		
																											
					The below code allows for users to checkout as a guest, and then later once their		
					order has been placed they can create just the password so that the my-account section	
					just works.  Some website opt to never give the option to create a password up front	
					and to only create the password once the order is placed.  It is totally fine to		
					remove this functionality all together from the confirmation page						
																											
				--->
				
				<!--- If the createPassword form has been submitted sucessfully display message --->
				<cfif $.slatwall.hasSuccessfulAction( "public:cart.guestAccountCreatePassword" )>
					<div class="alert alert-success">
						Account saved successfully.
					</div>
					
				<!--- If the form has not been submitted and the account on the order is a guest account, then display the form to create a password --->
				<cfelseif order.getAccount().getGuestAccountFlag()>
					<div class="well">
						<h5>Your order was placed as a guest account.
						Enter a password now so that you can access your order history at a later time from my account.</h5>
						
						<!--- Setup the createPassword object to be used by form for errors --->
						<cfset createPasswordObj = order.getAccount().getProcessObject("createPassword") />
						
						<form action="?s=1" method="post">
							<input type="hidden" name="slatAction" value="public:cart.guestAccountCreatePassword" />
							<input type="hidden" name="orderID" value="#order.getOrderID()#" />
							<input type="hidden" name="accountID" value="#order.getAccount().getAccountID()#" />
							
							<!--- Password --->
							<div class="control-group">
								<label class="control-label" for="rating">Password</label>
								<div class="controls">
									<sw:FormField type="password" valueObject="#createPasswordObj#" valueObjectProperty="password" class="span4" />
									<sw:ErrorDisplay object="#createPasswordObj#" errorName="password" />
								</div>
							</div>
							
							<!--- Password Confirm --->
							<div class="control-group">
								<label class="control-label" for="rating">Confirm Password</label>
								<div class="controls">
									<sw:FormField type="password" valueObject="#createPasswordObj#" valueObjectProperty="passwordConfirm" class="span4" />
									<sw:ErrorDisplay object="#createPasswordObj#" errorName="passwordConfirm" />
								</div>
							</div>
							
							<!--- Save Account Password --->
							<div class="control-group pull-left">
								<div class="controls">
										<button type="submit" class="btn btn-primary">Save Account Password</button>
								</div>
							</div>
							
						</form>
						
						<br />
					</div>
	
				</cfif>
				<!--- END: SAVE GUEST ACCOUNT --->
					
				<div class="row">
					
					<div class="span4">
						<table class="table table-bordered table-condensed">
							<tr>
								<td>Order Status</td>
								<td>#order.getOrderStatusType().getTypeName()#</td>
							</tr>
							<tr>
								<td>Order ##</td>
								<td>#order.getOrderNumber()#</td>
							</tr>
							<tr>
								<td>Order Placed</td>
								<td>#order.getFormattedValue('orderOpenDateTime')#</td>
							</tr>
						</table>
					</div>
					<div class="span4 offset3 pull-right">
						<table class="table table-bordered table-condensed">
							<tr>
								<td>Subtotal</td>
								<td>#order.getFormattedValue('subTotalAfterItemDiscounts')#</td>
							</tr>
							<tr>
								<td>Delivery Charges</td>
								<td>#order.getFormattedValue('fulfillmentChargeAfterDiscountTotal')#</td>
							</tr>
							<tr>
								<td>Taxes</td>
								<td>#order.getFormattedValue('taxTotal')#</td>
							</tr>
							<tr>
								<td><strong>Total</strong></td>
								<td><strong>#order.getFormattedValue('total')#</strong></td>
							</tr>
							<cfif order.getDiscountTotal() gt 0>
								<tr>
									<td colspan="2" class="text-error">You saved #order.getFormattedValue('discountTotal')# on this order.</td>
								</tr>
							</cfif>
						</table>
					</div>
				</div>
				
				<!--- Start: Order Details --->
				<hr />
				<h5>Order Details</h5>
				<cfloop array="#order.getOrderFulfillments()#" index="orderFulfillment">
					
					<!--- Start: Fulfillment Table --->
					<table class="table table-bordered table-condensed">
						<tr>
							<!--- Fulfillment Details --->
							<td class="well span3" rowspan="#arrayLen(orderFulfillment.getOrderFulfillmentItems()) + 1#">
								
								<!--- Fulfillment Name --->
								<strong>#orderFulfillment.getFulfillmentMethod().getFulfillmentMethodName()#</strong><br />
								
								<!--- Fulfillment Details: Email --->
								<cfif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "email">
									<strong>Email Address:</strong> #orderFulfillment.getEmailAddress()#<br />
									
								<!--- Fulfillment Details: Pickup --->
								<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "pickup" and not isNull(orderFulfillment.getPickupLocation())>
									<strong>Pickup Location:</strong> #orderFulfillment.getPickupLocation().getLocationName()#<br />
									<sw:AddressDisplay address="#orderFulfillment.getPickupLocation().getPrimaryAddress().getAddress()#" />
									
								<!--- Fulfillment Details: Shipping --->
								<cfelseif orderFulfillment.getFulfillmentMethod().getFulfillmentMethodType() eq "shipping">
									<sw:AddressDisplay address="#orderFulfillment.getAddress()#" />
									<cfif not isNull(orderFulfillment.getShippingMethod())>
										<strong>Shipping Method:</strong> #orderFulfillment.getShippingMethod().getShippingMethodName()#<br />
									</cfif>
									
								</cfif>
								
								<br />
								<!--- Delivery Fee --->
								<strong>Delivery Fee:</strong> #orderFulfillment.getFormattedValue('chargeAfterDiscount')#
							</td>
							
							<!--- Additional Header Rows --->
							<th>Sku Code</th>
							<th>Product Title</th>
							<th>Qty.</th>
							<th>Price</th>
							<th>Status</th>
						</tr>
						
						<!--- Loop over the actual items in this orderFulfillment --->
						<cfloop array="#orderFulfillment.getOrderFulfillmentItems()#" index="orderItem">
							
							<tr>
								<!--- Sku Code --->
								<td>#orderItem.getSku().getSkuCode()#</td>
								
								<!--- Product Title --->
								<td>#orderItem.getSku().getProduct().getTitle()#</td>
								
								<!--- Quantity --->
								<td>#htmlEditFormat( orderItem.getQuantity())#</td>
								
								<!--- Price --->
								<td>
									<cfif orderItem.getExtendedPrice() gt orderItem.getExtendedPriceAfterDiscount()>
										<span style="text-decoration:line-through;">#orderItem.getFormattedValue('extendedPrice')#</span> <span class="text-error">#orderItem.getFormattedValue('extendedPriceAfterDiscount')#</span><br />
									<cfelse>
										#orderItem.getFormattedValue('extendedPriceAfterDiscount')#	
									</cfif>
								</td>
								
								<!--- Status --->
								<td>#orderItem.getOrderItemStatusType().getTypeName()#</td>
							</tr>
						</cfloop>
						
					</table>
					<!--- End: Fulfillment Table --->
						
				</cfloop>
				<!--- End: Order Details --->
				
				<!--- Start: Order Payments --->
				<hr />
				<h5>Order Payments</h5>
				<table class="table table-bordered table-condensed table-striped">
					<tr>
						<th>Billing</td>
						<th>Payment Details</td>
						<th>Amount</td>
					</tr>
					<cfloop array="#order.getOrderPayments()#" index="orderPayment">
						<cfif orderPayment.getOrderPaymentStatusType().getSystemCode() EQ "opstActive">
							<tr>
								<td class="well span3">
									<sw:AddressDisplay address="#orderPayment.getBillingAddress()#" />
								</td>
								<td>#orderPayment.getSimpleRepresentation()#</td>
								<td>#orderPayment.getFormattedValue('amount')#</td>
							</tr>
						</cfif>
					</cfloop>
				</table>
				<!--- End: Order Payments --->
				
	<!--- ======================= NO ITEMS IN CART ============================= --->
			<cfelse> 
				<div class="row">
					<div class="span12">
						<p>There are no items in your cart.</p>
					</div>
				</div>
				
			</cfif>
			
			<!--- END CHECKOUT EXAMPLE 1 --->
			
		</div>
	</cfsilent>
	<!--- initial data--->
	<span ng-init="slatwall.currentAccountPage = 'Login'"></span>
	
	
	<!---new template start--->
	<div class="container">
        <h1 class="my-4">Checkout</h4>

        <div class="row">
            <!-- Checkout body -->
            <div class="col-12 col-md-8">

                <div class="card">
                    <div class="card-header">
                        <!-- Checkout tabbed nav -->
                        <ul class="nav nav-pills nav-fill" id="pills-tab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="pills-account-tab" data-toggle="pill" href="##pills-account" role="tab" aria-controls="account" aria-selected="true">Account</a>
                            </li>
                            <!---disabled commented out but is used to when logic wants a button to be unclickable--->
                            <li class="nav-item">
                                <a class="nav-link <!---disabled--->" id="pills-shipping-tab" data-toggle="pill" href="##pills-shipping" role="tab" aria-controls="shipping" aria-selected="true">Shipping</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link <!---disabled--->" id="pills-payment-tab" data-toggle="pill" href="##pills-payment" role="tab" aria-controls="payment" aria-selected="true">Payment</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link <!---disabled--->" id="pills-review-tab" data-toggle="pill" href="##pills-review" role="tab" aria-controls="review" aria-selected="true">Order Review</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                        	<div class="tab-pane fade active show" id="pills-account" role="tabpanel" aria-labelledby="account">
                                
                                
                                <!---ACCOUNT BEGIN--->
                                
                                
                                <div id="accountCollapse">
                                    <!-- Account Login -->
                                    <div class="collapse show" id="login" ng-show="slatwall.currentAccountPage == 'Login'">
                                		<form  ng-model="Account_Login" 
											ng-submit="swfForm.submitForm()" 
											swf-form 
											data-method="Login"
										>
                                			<h5>Account Login</h5>

                                            <!-- Invalid account error -->

                                			<div class="row">
                                                <div class="col-6 offset-md-3">
                                    				<div class="form-group">
                                    					<label for="emailAddress_Login" class="form-label">Email Address</label>
                                    					<input id="emailAddress_Login" name="emailAddress" placeholder="Email Address" 
                                    						class="form-control success" 
                                    						ng-model="Account_Login.emailAddress" swvalidationdatatype="email" swvalidationrequired="true"
                                    					>
                                    					<sw:SwfErrorDisplay propertyIdentifier="emailAddress"/>
                                    				</div>
                                                    <div class="form-group">
                                    					<label for="password_Login" class="form-label">Password</label>
                                    					<input id="password_Login" type="password" name="password" placeholder="Password" class="form-control success"
                                    						ng-model="Account_Login.password" swvalidationrequired="true"
                                    					>
                                    					<sw:SwfErrorDisplay propertyIdentifier="password"/>
                                    				</div>

                                                    <!-- Create Account toggle  -->
                                                    <a class="btn btn-link float-left" ng-click="slatwall.currentAccountPage = 'CreateAccount'"  role="button" aria-expanded="false" aria-controls="forgotPassword">Create Account</a>

                                                    <!-- Reset Password toggle -->
                                                    <a class="btn btn-link float-right" ng-click="slatwall.currentAccountPage = 'ForgotPassword'"  role="button" aria-expanded="false" aria-controls="forgotPassword">Reset Password</a>

                                                    <!-- Login Button -->
                                                    <button ng-click="swfForm.submitForm()" ng-class="{disabled:slatwall.getRequestByAction('Login').loading}" class="btn btn-primary btn-block">{{(slatwall.getRequestByAction('Login').loading ? '' : 'Login & Continue')}}<i ng-show="slatwall.getRequestByAction('Login').loading" class='fa fa-refresh fa-spin fa-fw'></i></button>

                                                    <!-- Continue as Guest -->
                                                    <button type="button" class="btn btn-link btn-block">Continue as Guest <i class="fa fa-angle-double-right"></i></a>
                                                </div>
                                			</div>
                                        </form>
                                    </div>

                                    <!-- Reset Password -->
                                    <div class="collapse" id="forgotPassword" ng-show="slatwall.currentAccountPage == 'ForgotPassword'">
                                		<form 
                                			ng-model="Account_ForgotPassword" 
											ng-submit="swfForm.submitForm()" 
											swf-form 
											data-method="ForgotPassword"
                                		>
                                			<h5>Reset Password</h5>
                                            <!-- Reset Password Success Message -->
                                            
                                            <div ng-show="slatwall.requests[swfForm.method].successfulActions.length" class="alert alert-success">An email with instructions to reset your password has been sent to your inbox.</div>

                                			<div class="row">
                                                <div class="col-6 offset-md-3">
                                                    <p>Enter your email to receive a password reset email or login.</p>
                                    				<div class="form-group">
                                    					<label for="emailAddress_ForgotPassword" class="form-label">Email Address</label>
                                    					<input id="emailAddress_ForgotPassword" name="emailAddress" type="text" placeholder="Email Address" class="form-control"
                                    						ng-model="Account_ForgotPassword.emailAddress" swvalidationdatatype="email" swvalidationrequired="true"
                                    					>
                                                        <sw:SwfErrorDisplay propertyIdentifier="emailAddress"/>
                                    				</div>
                                                    <button ng-click="swfForm.submitForm()" ng-class="{disabled:slatwall.getRequestByAction('ForgotPassword').loading}" class="btn btn-primary btn-block">{{(slatwall.getRequestByAction('ForgotPassword').loading ? '' : 'Reset Password')}}<i ng-show="slatwall.getRequestByAction('Login').loading" class='fa fa-refresh fa-spin fa-fw'></i></button>
                                                </div>
                                			</div>
                                        </form>
                                    </div>

                                    <!-- Create Account -->
                                    <div class="collapse" id="createAccount" ng-show="slatwall.currentAccountPage == 'CreateAccount'">
                                			<h5>Create Account</h5>

                                            <div ng-show="slatwall.requests[swfForm.method].errors.length" class="alert alert-danger">Error creating account. See errors below.</div>

                                            <form 
                                            	ng-model="Account_CreateAccount" 
												ng-submit="swfForm.submitForm()" 
												swf-form 
												data-method="CreateAccount"
                                            >
                                            	<div class="row">
                                            		<div class="form-group col-md-6">
                                            			<label for="firstname_CreateAccount" class="form-label">First Name</label>
                                            			<input id="firstname_CreateAccount" type="text" name="firstName" placeholder="First Name" class="form-control"
                                            				ng-model="Account_CreateAccount.firstName" swvalidationrequired="true"
                                            			>
                                                        <sw:SwfErrorDisplay propertyIdentifier="firstName"/>
                                                    </div>
                                            		<div class="form-group col-md-6">
                                            			<label for="lastname_CreateAccount" class="form-label">Last Name</label>
                                            			<input id="lastname_CreateAccount" type="text" name="lastName" placeholder="Last Name" class="form-control" 
                                            				ng-model="Account_CreateAccount.lastName" swvalidationrequired="true"
                                            			>
                                                        <sw:SwfErrorDisplay propertyIdentifier="lastName"/>
                                                    </div>
                                            		<div class="form-group col-md-6">
                                            			<label for="email_CreateAccount" class="form-label">Email Address</label>
                                            			<input id="email_CreateAccount" type="text" name="emailAddress" placeholder="Email Address" class="form-control"
                                            				ng-model="Account_CreateAccount.emailAddress" swvalidationdatatype="email" swvalidationrequired="true"
                                            			>
                                                        <sw:SwfErrorDisplay propertyIdentifier="emailAddress"/>
                                                    </div>
                                            		<div class="form-group col-md-6">
                                            			<label for="emailAddressConfirm_CreateAccount" class="form-label">Confirm Email Address</label>
                                            			<input id="emailAddressConfirm_CreateAccount" type="text" name="emailAddressConfirm" placeholder="Confirm Email Address" class="form-control" 
                                            				ng-model="Account_CreateAccount.emailAddressConfirm" swvalidationrequired="true"
                                            			>
                                                        <sw:SwfErrorDisplay propertyIdentifier="emailAddresConfirm"/>
                                                    </div>
                                            		<div class="form-group col-md-6">
                                            			<label for="password_CreateAccount" class="form-label">Password</label>
                                            			<input id="password_CreateAccount" type="password" name="password" placeholder="Password" class="form-control"
                                            				ng-model="Account_CreateAccount.password" swvalidationrequired="true"
                                            			>
                                                        <sw:SwfErrorDisplay propertyIdentifier="password"/>
                                                    </div>
                                            		<div class="form-group col-md-6">
                                            			<label for="confirmPassword_CreateAccount" class="form-label">Confirm Password</label>
                                            			<input id="confirmPassword_CreateAccount" type="password" name="confirmPassword" placeholder="Confirm Password" class="form-control" 
                                            				ng-model="Account_CreateAccount.passwordConfirm" swvalidationrequired="true"
                                            			>
                                                        <sw:SwfErrorDisplay propertyIdentifier="passwordConfirm"/>
                                                    </div>

                                                    <div class="form-group col-md-6">
                                            			<label for="phoneNumber_CreateAccount" class="form-label">Phone Number</label>
                                            			<input id="phoneNumber_CreateAccount" type="text" name="phoneNumber" placeholder="Phone Number" class="form-control"
                                            				ng-model="Account_CreateAccount.phoneNumber"
                                            			>
                                            			<sw:SwfErrorDisplay propertyIdentifier="phoneNumber"/>
                                            		</div>

                                                    <div class="col-6 offset-md-3">
                                                        <button type="submit" class="btn btn-primary btn-block">Create Account & Continue</button>
                                                        <button type="submit" class="btn btn-primary btn-block disabled">
                                                            <i class="fa fa-refresh fa-spin fa-fw"></i>
                                                        </button>
                                                    </div>
                                            	</div>
                                            </form>
                            			</div>
                                    </div>
                                </div>

                                <!---ACCOUNT END--->

                			<!--- SHIPPING BEGIN--->
                			<div class="tab-pane fade" id="pills-shipping" role="tabpanel" aria-labelledby="pill-shipping-tab">

                                <!-- Select Shipping Method -->
                                <h5>Select Shipping Method</h5>

                                <!-- Alert message if no shipping methods available -->
                                <div class="alert alert-danger" ng-show="slatwall.cart.orderFulfillments[0].shippingMethodOptions.length === 0">There are no shipping methods available.</div>


                                <!-- Store & Pickup Shipping Methods -->
                                <div class="card-deck">
                                    <label class="card border-secondary bg-light mb-3" style="max-width: 18rem;">
                                        <div class="card-body">
                                            <i class="fa fa-truck fa-3x d-block text-center"></i>
                                            <h5 class="card-title text-center mt-3">Shipping</h5>
                                        </div>
                                    </label>
									<!---TODO: implement pickup--->
                                    <!---<label class="card bg-light mb-3" style="max-width: 18rem;">
                                        <div class="card-body">
                                            <i class="fa fa-building fa-3x d-block text-center"></i>
                                            <h5 class="card-title text-center mt-3">Store Pickup</h5>
                                        </div>
                                    </label>--->
                                </div>

                                <!-- Create Shipping Address form - opens by default if none exist -->
                                <!--- NOTE: if we have an account then we should save accountaddresses otherwise only addresses--->
                                <form 
                                	ng-model="::slatwall.selectedAccountAddress" 
									swf-form 
									data-method="addNewAccountAddress,addShippingAddressUsingAccountAddress"
									ng-show="slatwall.selectedAccountAddress"
                                >
                                	<input id="shipping_addressAccountID" type="text" name="accountAddressID"  class="form-control"
            							ng-model="slatwall.selectedAccountAddress.accountAddressID" 
            						>
	                                <h5>Create/Edit Shipping Address</h5>
									<!---TODO:drive by success and failure actions being populated--->
	                                <div class="alert alert-success">Shipping Address saved.</div>
	                                <div class="alert alert-danger">Error saving shipping address. See below for errors.</div>
	                                <div class="row">
	                					<div class="form-group col-md-6">
	                						<label for="shipping_firstname" class="form-label">First Name</label>
	                						<input id="shipping_firstname" type="text" name="firstName" placeholder="First Name" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.firstName" swvalidationrequired="true"
	                						>
	                                        <sw:SwfErrorDisplay propertyIdentifier="firstName"/>
	                					</div>
	                					<div class="form-group col-md-6">
	                						<label for="shipping_lastname" class="form-label">Last Name</label>
	                						<input id="lshipping_astname" type="text" name="lastName" placeholder="Last Name" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.lastName" swvalidationrequired="true"
	                						>
	                                        <sw:SwfErrorDisplay propertyIdentifier="lastName"/>
	                                    </div>
	                					<div class="form-group col-md-6">
	                						<label for="shipping_street" class="form-label">Street</label>
	                						<input id="shipping_street" type="text" name="streetAddress" placeholder="Street Address" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.streetAddress" swvalidationrequired="true"
	                						>
	                                        <sw:SwfErrorDisplay propertyIdentifier="streetAddress"/>
	                                    </div>
	                                    <div class="form-group col-md-6">
	                						<label for="shipping_street2" class="form-label">Street Address 2</label>
	                						<input id="shipping_street2" type="text" name="street2Address" placeholder="Street Address" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.street2Address" 
	                						>
	                						<sw:SwfErrorDisplay propertyIdentifier="street2Address"/>
	                                    </div>
	                					<div class="form-group col-md-3">
	                						<label for="shipping_city" class="form-label">City</label>
	                						<input id="shipping_city" type="text" name="city" placeholder="City" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.city" swvalidationrequired="true"
	                						>
	                                        <sw:SwfErrorDisplay propertyIdentifier="city"/>
	                                    </div>
	                					<div class="form-group col-md-3">
	                						<label for="shipping_zip" class="form-label">Zip Code</label>
	                						<input id="shipping_zip" type="text" name="postalCode" placeholder="Zip code" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.postalCode" swvalidationrequired="true"
	                						>
	                                        <sw:SwfErrorDisplay propertyIdentifier="postalCode"/>
	                                    </div>
	                					<div class="form-group col-md-3">
	                						<label for="shipping_state" class="form-label">State</label>
	                						<select id="shipping_state" type="text" name="stateCode" placeholder="State" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.stateCode" swvalidationrequired="true"
	                						>
	                							<option value="">State list...</option>
	                                            <option ng-repeat="state in slatwall.states.stateCodeOptions track by state.value" ng-value="state.value" ng-bind="state.name"
	                                            	ng-selected="state.value==slatwall.selectedAccountAddress.address.stateCode"
	                                            ></option>
	                                        </select>
	                                        <sw:SwfErrorDisplay propertyIdentifier="stateCode"/>
	                                    </div>
	                					<div class="form-group col-md-3">
	                						<label for="shipping_country" class="form-label">Country</label>
	                						<select id="shipping_country" type="text" name="countryCode" placeholder="Country" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.countryCode" swvalidationrequired="true"
	                						>
	                                            <option value="">Country list...</option>
	                                            <option ng-repeat="country in slatwall.countries.countryCodeOptions track by country.value" ng-value="country.value" ng-bind="country.name"
	                                            	ng-selected="country.value==slatwall.selectedAccountAddress.address.countryCode"
	                                            ></option>
	                                        </select>
	                                        <sw:SwfErrorDisplay propertyIdentifier="countryCode"/>
	                                    </div>
	                					<div class="form-group col-md-6">
	                						<label for="shipping_phone-number" class="form-label">Phone Number</label>
	                						<input id="shipping_phone-number" type="tel" name="phoneNumber" placeholder="Phone number" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.phoneNumber" swvalidationrequired="true"
	                						>
	                                        <sw:SwfErrorDisplay propertyIdentifier="phoneNumber"/>
	                					</div>
	                                    <div class="form-group col-md-6">
	                						<label for="shipping_email" class="form-label">Email Address</label>
	                						<input id="shipping_email" name="emailAddress" placeholder="Email Address" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.emailAddress" swvalidationrequired="true" swvalidationdatatype="email"
	                						>
	                                        <sw:SwfErrorDisplay propertyIdentifier="emailAddress"/>
	                                    </div>
	                                    <div class="form-group col-md-6">
	                						<label for="shipping_company" class="form-label">Company</label>
	                						<input id="shipping_company" type="text" name="company" placeholder="Company" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.address.company"
	                						>
	                						<sw:SwfErrorDisplay propertyIdentifier="company"/>
	                					</div>
	                                    <div class="form-group col-md-6">
	                						<label for="shipping_addressNickname" class="form-label">Address Nickname</label>
	                						<input id="shipping_addressNickname" type="text" name="accountAddressName" placeholder="Address Nickname" class="form-control"
	                							ng-model="slatwall.selectedAccountAddress.accountAddressName"
	                						>
	                						<sw:SwfErrorDisplay propertyIdentifier="accountAddressName"/>
	                					</div>
	                				</div>
	                			
		                			<!---TODO:implement options--->
	                                <!---<div class="row">
	                                    <div class="form-group col-md-6">
	                                        <div class="form-group custom-control custom-checkbox">
	                                            <input type="checkbox" class="custom-control-input" id="address_save">
	                                            <label class="custom-control-label" for="address_save">Save to address book?</label>
	                                        </div>
	                                        <div class="form-group custom-control custom-checkbox">
	                                            <input type="checkbox" class="custom-control-input" id="address_default">
	                                            <label class="custom-control-label" for="address_default">Set as default address?</label>
	                                        </div>
	                                        <div class="form-group custom-control custom-checkbox">
	                                            <input type="checkbox" class="custom-control-input" id="address_billing_shipping">
	                                            <label class="custom-control-label" for="address_billing_shipping">Billing same as Shipping?</label>
	                                        </div>
	                                    </div>
	                                </div>--->

	                                <div class="form-group">
	                                    <!-- Save Address button -->
	                                    <button ng-click="swfForm.submitForm()" 
	                                    	ng-class="{disabled:slatwall.getRequestByAction('addNewAccountAddress,addShippingAddressUsingAccountAddress').loading}" 
	                                    	class="btn btn-primary btn-block"
	                                    >{{(slatwall.getRequestByAction('addNewAccountAddress,addShippingAddressUsingAccountAddress').loading ? '' : 'Save Shipping Address')}}
	                                    	<i ng-show="slatwall.getRequestByAction('addNewAccountAddress,addShippingAddressUsingAccountAddress').loading" class='fa fa-refresh fa-spin fa-fw'></i>
	                                    </button>
	                                    <!-- Close button to close create/edit shipping address & display  -->
	                                    <button ng-show="slatwall.selectedAccountAddress.accountAddressID.trim().length" 
	                                    	class="btn btn-danger btn-sm mt-2"
	                                    	ng-click="slatwall.deleteAccountAddress(slatwall.selectedAccountAddress.accountAddressID)"
	                                    	ng-disabled="slatwall.getRequestByAction('deleteAccountAddress').loading"
	                                    >
	                                    	{{slatwall.getRequestByAction('deleteAccountAddress').loading ? '':'Delete Address'}}
                                            <i ng-show="slatwall.getRequestByAction('deleteAccountAddress').loading" class="fa fa-refresh fa-spin fa-fw my-1 float-right"></i>
	                                    </button>
	
	                                    <!-- Close button for create/edit address - only should show if other addresses exists show address listing on close -->
	                                    <button type="button" name="closeAddress" class="btn btn-link">Close</button>
	                                </div>
	                                <!-- Create Shipping Address Button - only show when other addresses exist -->
	                                
	                            </form>
	                            <button type="button" ng-click="slatwall.selectedAccountAddress=slatwall.accountAddressService.newAccountAddress()" class="btn btn-secondary btn-sm float-right">
                                    <i class="fa fa-plus-circle"></i> Add Shipping Address
                                </button>
                                

                                
								
                                <!-- Select Existing Shipping address -->
                                <h5>Select Shipping Address</h5>

                                <!-- Shipping Dropdown Select -->
                                <select class="form-control my-3" name="shippingAddress" required 
                                	ng-model="slatwall.cart.orderFulfillments[0].accountAddress.accountAddressID"
                                	ng-change="slatwall.selectShippingAccountAddress(slatwall.cart.orderFulfillments[0].accountAddress.accountAddressID)"
                                	ng-disabled="slatwall.getRequestByAction('addShippingAddressUsingAccountAddress').loading"
                                >
                                	<option  value="">Select Account Address</option>
                                    <option ng-repeat="accountAddress in slatwall.account.accountAddresses track by accountAddress.accountAddressID" 
                                    	ng-selected="accountAddress.accountAddressID == slatwall.cart.orderFulfillments[0].accountAddress.accountAddressID"
                                    	ng-value="accountAddress.accountAddressID" 
                                    	ng-bind="accountAddress.getSimpleRepresentation()"
                                    >
                                    </option>
                                </select>

                                <div class="card-deck mb-3" ng-repeat="accountAddress in slatwall.account.accountAddresses track by accountAddress.accountAddressID">
                                    <!-- Shipping Address block selector -->
                                    <address class="card border-secondary" >
                                        <div class="card-header">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="address" 
                                                	ng-value="accountAddress.accountAddressID" ng-checked="accountAddress.accountAddressID == slatwall.cart.orderFulfillments[0].accountAddress.accountAddressID"
                                                	ng-model="slatwall.cart.orderFulfillments[0].accountAddress.accountAddressID" ng-click="slatwall.selectShippingAccountAddress(accountAddress.accountAddressID)" 
                                                >
                                                <label class="form-check-label" for="address1">Selected</label>
                                                <!-- Select Address Loader -->
                                                <i ng-show="slatwall.getRequestByAction('addShippingAddressUsingAccountAddress').loading" class="fa fa-refresh fa-spin fa-fw my-1 float-right"></i>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <strong ng-bind="accountAddress.address.name"></strong><br>
                                            {{accountAddress.address.streetAddress}}<br>
                                            {{accountAddress.address.street2Address}}<br ng-if="accountAddress.address.street2Address">
                                            {{accountAddress.address.city}}, {{accountAddress.address.stateCode}} {{accountAddress.address.postalCode}}<br>
                                            {{accountAddress.address.phoneNumber}}
                                            <hr>
                                            <a href="##" ng-click="slatwall.selectedAccountAddress=accountAddress;" class="card-link float-left">Edit</a>
                                            <a href="##" ng-disabled="slatwall.getRequestByAction('removeAccountAddress').loading" 
                                            	ng-click="slatwall.deleteAccountAddress(accountAddress.accountAddressID)" class="card-link float-right"
                                            >
                                            	{{slatwall.getRequestByAction('deleteAccountAddress').loading ? '':'Delete'}}
                                            	<i ng-show="slatwall.getRequestByAction('deleteAccountAddress').loading" class="fa fa-refresh fa-spin fa-fw my-1 float-right"></i>
                                            </a>
                                        </div>
                                    </address>

                                    <!-- Address block -->
                                    
                                </div>

                                <!-- Shipping Delievery Options -->
                                <h5>Select Delivery Method</h5>

                                <div class="card-deck mb-3">
                                    <div class="card border-secondary" 
                                    	ng-repeat="shippingMethodOption in slatwall.cart.orderFulfillments[0].shippingMethodOptions | orderBy:shippingMethod.sortOrder"
                                	>
                                        <div class="card-header">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="shipping" 
                                                	ng-value="shippingMethodOption.value" ng-checked="shippingMethodOption.value == slatwall.cart.orderFulfillments[0].shippingMethod.shippingMethodID"
                                                	ng-model="slatwall.cart.orderFulfillments[0].shippingMethod.shippingMethodID" 
                                                	ng-click="slatwall.selectShippingMethod(shippingMethodOption,0)" 
                                                >
                                                <label class="form-check-label" for="shipping1">
                                                    Selected
                                                </label>
                                                <!-- Select Address Loader -->
                                                <i class="fa fa-refresh fa-spin fa-fw my-1 float-right" ng-show="slatwall.getRequestByAction('addShippingMethodUsingShippingMethodID').loading"></i>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            {{shippingMethodOption.name}}<br>
                                        </div>
                                    </div>
                                </div>


                                <!-- Shipping Notes -->
                                <h6 class="pt-3">Shipping Notes/Instructions</h6>
                                <textarea name="shippingNotes" rows="5" cols="80" class="form-control mb-3"></textarea>

                                <!-- Select Shipping Submit Button -->
                                <button type="submit" class="btn btn-primary w-25">Save &amp; Continue</button>

                                <button type="submit" class="btn btn-primary w-25 disabled">
                                    <i class="fa fa-refresh fa-spin fa-fw"></i>
                                </button>

                			</div>
                			
                			
                            <!--- SHIPPING END--->


                            <!-- Payment Tab 3 -->
                            <div class="tab-pane fade" id="pills-payment" role="tabpanel" aria-labelledby="pill-payment-tab">

                                <!-- Create Billing Address form - opens by default if none exist -->
                                <h5>Create/Edit Billing Address</h5>

                                <div class="alert alert-success">Billing Address saved.</div>
                                <div class="alert alert-danger">Error saving billing address. See below for errors.</div>

                                <div class="row">
                					<div class="form-group col-md-6">
                						<label for="billing_firstname" class="form-label">First Name</label>
                						<input id="billing_firstname" type="text" name="billing_first-name" placeholder="First Name" class="form-control">
                                        <div class="px-2 mt-1 bg-danger text-white"><small>First Name Required</small></div>
                					</div>
                					<div class="form-group col-md-6">
                						<label for="billing_lastname" class="form-label">Last Name</label>
                						<input id="billing_lastname" type="text" name="billing_last-name" placeholder="Last Name" class="form-control">
                                        <div class="px-2 mt-1 bg-danger text-white"><small>First Name Required</small></div>
                                    </div>
                					<div class="form-group col-md-6">
                						<label for="billing_street" class="form-label">Street</label>
                						<input id="billing_street" type="text" name="billing_address" placeholder="Street Address" class="form-control">
                                        <div class="px-2 mt-1 bg-danger text-white"><small>Street Required</small></div>
                                    </div>
                                    <div class="form-group col-md-6">
                						<label for="billing_street2" class="form-label">Street Address 2</label>
                						<input id="billing_street2" type="text" name="billing_street2" placeholder="Street Address" class="form-control">
                                    </div>
                					<div class="form-group col-md-3">
                						<label for="billing_city" class="form-label">City</label>
                						<input id="billing_city" type="text" name="billing_city" placeholder="City" class="form-control">
                                        <div class="px-2 mt-1 bg-danger text-white"><small>City Required</small></div>
                                    </div>
                					<div class="form-group col-md-3">
                						<label for="billing_zip" class="form-label">Zip Code</label>
                						<input id="billing_zip" type="text" name="billing_zip" placeholder="Zip code" class="form-control">
                                        <div class="px-2 mt-1 bg-danger text-white"><small>Zip Code Required</small></div>
                                    </div>
                					<div class="form-group col-md-3">
                						<label for="billing_state" class="form-label">State</label>
                						<select id="billing_state" type="text" name="billing_state" placeholder="State" class="form-control">
                                            <option value="">State list...</option>
                                        </select>
                                        <div class="px-2 mt-1 bg-danger text-white"><small>State Required</small></div>
                                    </div>
                					<div class="form-group col-md-3">
                						<label for="billing_country" class="form-label">Country</label>
                						<select id="billing_country" type="text" name="billing_country" placeholder="Country" class="form-control">
                                            <option value="">Country list...</option>
                                        </select>
                                        <div class="px-2 mt-1 bg-danger text-white"><small>Country Required</small></div>
                                    </div>
                					<div class="form-group col-md-6">
                						<label for="billing_phone-number" class="form-label">Phone Number</label>
                						<input id="billing_phone-number" type="tel" name="billing_phone-number" placeholder="Phone number" class="form-control">
                                        <div class="px-2 mt-1 bg-danger text-white"><small>Phone Number Required</small></div>
                					</div>
                                    <div class="form-group col-md-6">
                						<label for="billing_email" class="form-label">Email Address</label>
                						<input id="billingemail" type="email" name="billing_email" placeholder="Email Address" class="form-control">
                                        <div class="px-2 mt-1 bg-danger text-white"><small>Email Address Required</small></div>
                                    </div>
                                    <div class="form-group col-md-6">
                						<label for="billing_company" class="form-label">Company</label>
                						<input id="billing_company" type="text" name="billing_company" placeholder="Company" class="form-control">
                					</div>
                                    <div class="form-group col-md-6">
                						<label for="billing_addressNickname" class="form-label">Address Nickname</label>
                						<input id="billing_addressNickname" type="text" name="billing_addressNickname" placeholder="Address Nickname" class="form-control">
                					</div>
                				</div>

                                <div class="form-group">
                                    <!-- Save Address button -->
                                    <button type="submit" class="btn btn-primary w-25">Save Billing Address</button>

                                    <button type="submit" class="btn btn-primary w-25 disabled">
                                        <i class="fa fa-refresh fa-spin fa-fw"></i>
                                    </button>

                                    <!-- Close button for create/edit billing address - only should show if other addresses exists show address listing on close -->
                                    <button type="button" name="closeAddress" class="btn btn-link">Close</button>
                                </div>

                                <!-- Create Shipping Address Button - only show when other addresses exist -->
                                <button type="button" name="createShippingAddress" class="btn btn-secondary btn-sm float-right">
                                    <i class="fa fa-plus-circle"></i> Add Billing Address
                                </button>

                                <!-- Select Existing Billing address -->
                                <h5>Select Billing Address</h5>

                                <!-- Billing Dropdown Select -->
                                <select class="form-control my-3" name="billingAddress" required>
                                    <option value="">Tony Montana - 1 Main Street - Montanaville, MN</option>
                                </select>

                                <div class="card-deck mb-3">
                                    <!-- Shipping Address block selector -->
                                    <address class="card border-secondary">
                                        <div class="card-header">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="billingAddress" id="billingAddress1" value="billingAddress1" checked>
                                                <label class="form-check-label" for="billingAddress1">Selected</label>
                                                <!-- Select Address Loader -->
                                                <i class="fa fa-refresh fa-spin fa-fw my-1 float-right"></i>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <strong>Tony Montna</strong><br>
                                            1 Main Street<br>
                                            Apt 333<br>
                                            Montanaville, MN 01701<br>
                                            508-555-5555
                                            <hr>
                                            <a href="##" class="card-link float-left">Edit</a>
                                            <a href="##" class="card-link float-right">Delete</a>
                                        </div>
                                    </address>

                                    <!-- Address block -->
                                    <address class="card">
                                        <div class="card-header">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="billingAddress" id="billingAddress2" value="billingAddress2">
                                                <label class="form-check-label" for="billingAddress2">Select</label>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <strong>Tony Montna</strong><br>
                                            1 Main Street<br>
                                            Apt 333<br>
                                            Montanaville, MN 01701<br>
                                            508-555-5555
                                            <hr>
                                            <a href="##" class="card-link float-left">Edit</a>
                                            <a href="##" class="card-link float-right">Delete</a>
                                        </div>
                                    </address>
                                </div>

                                <!-- Select Payment Method -->
                                <h5 class="pb-2">Select Payment Method</h5>

                                <!-- Credit Card Info -->
                                <div id="accordion" role="tablist" aria-multiselectable="true" class="mb-3">
                                	<div class="card mb-3">
                                        <a data-toggle="collapse" data-parent="##accordion" href="##collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    		<div id="headingOne" role="tab" class="card-header">Credit Card</div>
                                        </a>
                                		<div id="collapseOne" role="tabpanel" aria-labelledby="headingOne" class="collapse">
                                			<div class="card-body">
                                                <!-- Add Payment Success/Fail -->
                                                <div class="alert alert-success">Credit Card Payment added.</div>
                                                <div class="alert alert-danger">Error adding credit card payment. See below for errors.</div>

                                				<form action="##">
                                					<div class="row">
                                						<div class="form-group col-md-6">
                                							<label for="card-name" class="form-label">Name on Card</label>
                                							<input type="text" name="card-name" placeholder="Name on card" id="card-name" class="form-control" required>
                                                            <div class="px-2 mt-1 bg-danger text-white"><small>Name Required</small></div>
                                						</div>
                                						<div class="form-group col-md-6">
                                							<label for="card-number" class="form-label">Card Number</label>
                                							<input type="text" name="card-number" placeholder="Card Number" id="card-number" class="form-control" required>
                                                            <div class="px-2 mt-1 bg-danger text-white"><small>Card Number Required</small></div>
                                						</div>
                                						<div class="form-group col-md-4">
                                							<label for="expiry-date" class="form-label">Expiration Date</label>
                                							<input type="text" name="expiry-date" placeholder="MM/YY" id="expiry-date" class="form-control" required>
                                                            <div class="px-2 mt-1 bg-danger text-white"><small>Expiration Date Required</small></div>
                                						</div>
                                						<div class="form-group col-md-4">
                                							<label for="cvv" class="form-label">CVC/CVV</label>
                                							<input type="text" name="cvv" placeholder="123" id="cvv" class="form-control" required>
                                                            <div class="px-2 mt-1 bg-danger text-white"><small>CVV Required</small></div>
                                						</div>
                                						<div class="form-group col-md-4">
                                							<label for="zip" class="form-label">Zip Code</label>
                                							<input type="text" name="zip" placeholder="12345" id="zip" class="form-control" required>
                                                            <div class="px-2 mt-1 bg-danger text-white"><small>Zip Code Required</small></div>
                                						</div>
                                					</div>

                                                    <div class="form-group custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" id="payment_save">
                                                        <label class="custom-control-label" for="payment_save">Set as default payment?</label>
                                                    </div>

                                                    <!-- Credit Card Payment Submit & Close buttons -->
                                                    <button type="submit" name="submit" class="btn btn-primary w-25">Add Payment</button>
                                                    <button type="button" name="addPayment" class="btn btn-primary w-25 disabled"><i class="fa fa-refresh fa-spin fa-fw"></i></button>
                                                    <button type="button" name="close" class="btn btn-link">Cancel</button>
                                				</form>
                                			</div>
                                		</div>
                                	</div>

                                    <!-- Purchase Order -->
                                	<div class="card mb-3">
                                        <a data-toggle="collapse" data-parent="##accordion" href="##collapseTwo" aria-expanded="false" aria-controls="collapseTwo" class="collapsed">
                                    		<div id="headingTwo" role="tab" class="card-header">Purchase Order</div>
                                        </a>
                                		<div id="collapseTwo" role="tabpanel" aria-labelledby="headingTwo" class="collapse">
                                			<div class="card-body">
                                                <!-- Add Payment Success/Fail -->
                                                <div class="alert alert-success">Credit Card Payment added.</div>
                                                <div class="alert alert-danger">Error adding credit card payment. See below for errors.</div>

                                                <form action="##">
                                                    <div class="row">
                                                    <div class="form-group col-md-7">
                                                        <label for="card-name" class="form-label">Purchase Order Number</label>
                                                        <input type="text" name="purchase-order" placeholder="Purchase Order Number" id="purchase-order" class="form-control" required>
                                                        <div class="px-2 mt-1 bg-danger text-white"><small>Purchase Order Number Required</small></div>
                                                    </div>
                                                </div>

                                                <!-- Purchase Order Submit & Close buttons -->
                                                <button type="submit" name="submit" class="btn btn-primary w-25">Apply</button>
                                                <button type="button" name="addPayment" class="btn btn-primary w-25 disabled"><i class="fa fa-refresh fa-spin fa-fw"></i></button>
                                                <button type="button" name="close" class="btn btn-link">Cancel</button>
                                                </form>
                                		</div></div>
                                	</div>

                                    <!-- Gift Card -->
                                    <div class="card">
                                        <a data-toggle="collapse" data-parent="##accordion" href="##collapseThree" aria-expanded="false" aria-controls="collapseThree" class="collapsed">
                                            <div id="headingThree" role="tab" class="card-header">Gift Card</div>
                                        </a>
                                        <div id="collapseThree" role="tabpanel" aria-labelledby="headingThree" class="collapse">
                                            <div class="card-body">
                                                <!-- Add Payment Success/Fail -->
                                                <div class="alert alert-success">Gift Card Payment added.</div>
                                                <div class="alert alert-danger">Error adding gift card payment. See below for errors.</div>

                                                <form action="##">
                                                    <div class="row">
                                                    <div class="form-group col-md-7">
                                                        <label for="card-name" class="form-label">Gift Card Number</label>
                                                        <input type="text" name="gift-card" placeholder="Gift Card Number" id="gift-card" class="form-control" required>
                                                        <div class="px-2 mt-1 bg-danger text-white"><small>Gift Card Number Required</small></div>
                                                    </div>
                                                </div>

                                                <!-- Gift Card Submit & Close buttons -->
                                                <button type="submit" name="submit" class="btn btn-primary w-25">Apply</button>
                                                <button type="button" name="addPayment" class="btn btn-primary w-25 disabled"><i class="fa fa-refresh fa-spin fa-fw"></i></button>
                                                <button type="button" name="close" class="btn btn-link">Cancel</button>
                                                </form>
                                        </div></div>
                                    </div>

                                </div>

                                <!-- Place Orders & Review Order buttons -->
                                <!-- Add disabled class until all criteria is met -->
                                <button type="button" name="review" class="btn btn-secondary w-25 disabled">Review Order</button>
                                <button type="button" name="review" class="btn btn-secondary w-25 disabled"><i class="fa fa-refresh fa-spin fa-fw"></i></button>

                                <button type="submit" name="submit" class="btn btn-primary w-25 disabled">Place Order</button>
                                <button type="submit" class="btn btn-primary w-25 disabled"><i class="fa fa-refresh fa-spin fa-fw"></i></button>

                            </div>
                            <!-- //Payment-tab 3  -->

                            <!-- Order Review tab 4 -->
                            <div class="tab-pane fade" id="pills-review" role="tabpanel" aria-labelledby="pill-review-tab">
                                <h5>Review Order</h5>

                                <!-- Place Order alert fail -->
                                <div class="alert alert-danger">Order could not be placed.</div>

                                <!-- Shipping  -->
                                <h6>Shipping</h6>

                                <div class="card-deck mb-3">
                                    <!-- Shipping Address -->
                                    <address class="card">
                                        <div class="card-header">
                                            <span class="float-left"><i class="fa fa-check-circle"></i> Shipping Address</span>
                                            <a href="##" class="float-right">Edit</a>
                                        </div>
                                        <div class="card-body">
                                            <strong>Tony Montana</strong><br>
                                            1 Main Street<br>
                                            Apt 333<br>
                                            Montanaville, MN 01701<br>
                                            508-555-5555
                                        </div>
                                    </address>

                                    <!-- Shipping Method  -->
                                    <div class="card">
                                        <div class="card-header">
                                            <span class="float-left"><i class="fa fa-check-circle"></i> Shipping Method</span>
                                            <a href="##" class="float-right">Edit</a>
                                        </div>
                                        <div class="card-body">
                                        <strong>Shipping Method Name</strong><br>
                                            Shipping Method Provider<br>
                                            Shipping Rate
                                        </div>
                                    </div>
                                </div>

                                <!-- Store Pickup  -->
                                <h6>Store Pickup</h6>

                                <div class="card-deck mb-3">
                                    <!-- Pickup Date -->
                                    <address class="card">
                                        <div class="card-header">
                                            <span class="float-left"><i class="fa fa-check-circle"></i> Store Pickup Date</span>
                                            <a href="##" class="float-right">Edit</a>
                                        </div>
                                        <div class="card-body">
                                            <i class="fa fa-calendar"></i> <strong>January 25, 2018</strong>
                                        </div>
                                    </address>

                                    <!-- Store Pickup Location  -->
                                    <div class="card">
                                        <div class="card-header">
                                            <span class="float-left"><i class="fa fa-check-circle"></i> Store Pickup Location</span>
                                            <a href="##" class="float-right">Edit</a>
                                        </div>
                                        <div class="card-body">
                                            <i class="fa fa-map-marker"></i> <strong>Pickup Location Address</strong>
                                        </div>
                                    </div>
                                </div>

                                <!-- Billing -->
                                <h6>Billing</h6>

                                <div class="card-deck mb-3">
                                    <!-- Billing Address -->
                                    <address class="card">
                                        <div class="card-header">
                                            <span class="float-left"><i class="fa fa-check-circle"></i> Billing Address</span>
                                            <a href="##" class="float-right">Edit</a>
                                        </div>
                                        <div class="card-body">
                                            <strong>Tony Montna</strong><br>
                                            1 Main Street<br>
                                            Apt 333<br>
                                            Montanaville, MN 01701<br>
                                            508-555-5555
                                        </div>
                                    </address>

                                    <!-- Payment Method -->
                                    <div class="card">
                                        <div class="card-header">
                                            <span class="float-left"><i class="fa fa-check-circle"></i> Payment Method</span>
                                            <a href="##" class="float-right">Edit</a>
                                        </div>
                                        <div class="card-body">
                                            <h6>Credit Card</h6>

                                            <i class="fa fa-cc-visa fa-2x"></i>
                                            <i class="fa fa-cc-mastercard fa-2x"></i>
                                            <i class="fa fa-cc-discover fa-2x"></i>
                                            <i class="fa fa-cc-amex fa-2x"></i>

                                            ****1234

                                            <small class="d-block">Amount: $100</small>

                                            <h6 class="mt-3">Gift Card</h6>

                                            <small class="d-block">##12345678</small>
                                            <small class="d-block">Amount: $200</small>

                                            <h6 class="mt-3">Purchase Order</h6>
                                            <small class="d-block">##12345678</small>
                                        </div>
                                    </div>
                                </div>

                                <!-- Place Order Button  -->
                                <button type="submit" name="submit" class="btn btn-primary w-25">Place Order</button>
                                <button type="submit" class="btn btn-primary w-25 disabled"><i class="fa fa-refresh fa-spin fa-fw"></i></button>

                            </div>
                            <!-- //Review-tab 4  -->

                        </div>
                    </div>
                </div>
                <!-- //close main card body -->
            </div>

            <!-- Checkout sidebar Order Summary -->
            <div class="col-12 col-md-4">

                <!-- Order Summary -->
                <div class="card mb-5">
                    <div class="card-header">
                        <h5 class="mb-0">Order Summary</h5>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <span>Order Subtotal</span>
                                <span class="float-right" ng-bind="slatwall.cart.subtotal|currency"></span>
                                <i class="fa fa-refresh fa-spin fa-fw float-right my-1 mr-1"></i>
                            </li>
                            <li class="list-group-item">
                                <span>Item Discount Total</span>
                                <span class="text-danger float-right">- {{slatwall.cart.discountTotal|currency}}</span>
                                <i class="fa fa-refresh fa-spin fa-fw float-right my-1 mr-1"></i>
                            </li>
                            <li class="list-group-item">
                                <span>Order Discount Total</span>
                                <span class="text-danger float-right">- {{slatwall.cart.discountTotal|currency}}</span>
                                <i class="fa fa-refresh fa-spin fa-fw float-right my-1 mr-1"></i>
                            </li>
                            <li class="list-group-item">
                                <span>Shipping Discount Total</span>
                                <span class="text-danger float-right">- {{slatwall.cart.orderFulfillments[0].discountTotal || 0|currency}}</span>
                                <i class="fa fa-refresh fa-spin fa-fw float-right my-1 mr-1"></i>
                            </li>
                            <li class="list-group-item">
                                <span>Shipping and handling</span>
                                <span class="float-right" ng-bind="slatwall.cart.fulfillmentTotal|currency"></span>
                                <i class="fa fa-refresh fa-spin fa-fw float-right my-1 mr-1"></i>
                            </li>
                            <li class="list-group-item">
                                <span>Tax</span>
                                <span class="float-right" ng-bind="slatwall.cart.taxTotal|currency"></span>
                                <i class="fa fa-refresh fa-spin fa-fw float-right my-1 mr-1"></i>
                            </li>
                            <li class="list-group-item">
                                <span>Total</span>
                                <strong class="float-right" ng-bind="slatwall.cart.total|currency"></strong>
                                <i class="fa fa-refresh fa-spin fa-fw float-right my-1 mr-1"></i>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Order Items Summary -->
                <div class="card mb-5">
                    <div class="card-header">
                        <h5 class="mb-0">Order Items</h5>
                    </div>
                    <div class="card-body">
                        <div class="row" ng-repeat="orderItem in slatwall.cart.orderItems track by orderItem.orderItemID">
                            <div class="col-3">
                                <img class="img-fluid" src="http://placehold.it/50x50" alt="preview">
                            </div>
                            <div class="col-9 pl-0">
                                <small class="text-secondary" ng-bind="orderItem.sku.product.productType.productTypeName">Product Type</small>
                                <h6><a href="##" ng-bind="orderItem.sku.product.productName">Product Name</a></h6>

                                <div class="row">
                                    <div class="col-4">
                                        <input type="number" class="form-control form-control-sm" min="1" required
                                        	ng-model="orderItem.quantity"
                                        	ng-disabled="slatwall.getRequestByAction('updateOrderItemQuantity').loading" 
                                			ng-change="slatwall.updateOrderItemQuantity(orderItem.orderItemID,orderItem.quantity)"
                                        />
                                        <i ng-show="slatwall.getRequestByAction('updateOrderItemQuantity').loading" class="fa fa-refresh fa-spin fa-fw"></i>
                                    </div>
                                    <div class="col-8 pl-0">
                                        <small >{{orderItem.extendedPriceAfterDiscount|currency}} <span class="text-muted"><s ng-bind="orderItem.extendedPrice|currency"></s></span></small>
                                        <strong ng-bind="orderItem.extendedPrice|currency"></strong>
                                    </div>
                                </div>

                                <small><strong>SKU Code:</strong> {{orderItem.sku.skuCode}}</small>
                                <p class="mb-3"><small><strong>SKU Defintion Label: </strong>{{orderItem.sku.skuDefinition}}</small></p>

                                <button type="button" class="btn btn-danger btn-sm rounded" 
                                	ng-disabled="slatwall.getRequestByAction('updateOrderItemQuantity').loading" 
                                	ng-click="slatwall.updateOrderItemQuantity(orderItem.orderItemID,0)">
                                	<span ng-show="!slatwall.getRequestByAction('updateOrderItemQuantity').loading">&times;</span>
                                	<i ng-show="slatwall.getRequestByAction('updateOrderItemQuantity').loading" class="fa fa-refresh fa-spin fa-fw"></i>
                                		
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Promotion -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Promotion Code</h5>
                    </div>
                    <div class="card-body">
                        <!-- Promo success/fail alerts -->
                        <div class="alert alert-success">Promotion added.</div>
                        <div class="alert alert-danger">Invalid Promotion.</div>

                        <form  class="mb-1"
                        	ng-model="Order_addPromotion" 
							ng-submit="swfForm.submitForm()" 
							swf-form 
							data-method="addPromotionCode"
                        >
                            <div class="row">
                                <div class="col-sm-8 col-7">
                                    <input type="text" class="form-control form-control-sm" placeholder="Enter Promo Code..." name="promotionCode"
                                    	ng-model="Order_addPromotion.promotionCode" swvalidationrequired="true"
                                    />
                                    <sw:SwfErrorDisplay propertyIdentifier="promotionCode"/>
                                </div>
                                <div class="col-sm-4 col-5">
                                    <!-- Apply promo button -->
                                    <button type="submit" class="btn btn-secondary btn-sm btn-block" ng-disabled="slatwall.getRequestByAction('addPromotionCode').loading">
                                    	{{slatwall.getRequestByAction('updateOrderItemQuantity').loading ? '' : 'Apply'}}
                                    	<i ng-show="slatwall.getRequestByAction('updateOrderItemQuantity').loading" class="fa fa-refresh fa-spin fa-fw"></i>
                                    	</button>
                                    <!-- Apply promo loader -->
                                </div>
                            </div>
                        </form>

                        <span class="badge badge-pill badge-primary">10% Special Promo</span>
                        <button type="button btn-sm" class="btn btn-link btn-sm disabled">Remove</button>

                        <!-- Remove Promo loader -->
                        <i class="fa fa-refresh fa-spin fa-fw my-1"></i>
                    </div>
                </div>

            </div>
        </div>

        <!-- Cart Empty Message -->
        <div class="alert alert-danger my-2" ng-show="slatwall.cart.orderItems.length === 0">There are no items in your cart.</div>
    </div>
</cfoutput>
<cfinclude template="_slatwall-footer.cfm" />

