/*

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

*/
component extends="Slatwall.meta.tests.unit.entity.SlatwallEntityTestBase" {

	// @hint put things in here that you want to run befor EACH test
	public void function setUp() {
		super.setup();
		
		variables.entityService = "subscriptionService";
		variables.entity = request.slatwallScope.getService( variables.entityService ).newSubscriptionUsage();
	}
	
	public void function isActiveTest_whereSubscriptionStatusTypeIsNull(){
		//mock data
		var subscriptionUsageData = {
			subscriptionUsageId=""
		};
		var subscriptionUsage = createTestEntity('SubscriptionUsage',subscriptionUsageData);
		assertFalse(subscriptionUsage.isActive());//assert the result
	}
	
	
	public void function hasSubscriptionOrderItemsTest(){
		//mock data
		var subscriptionUsageData = {
			subscriptionUsageID="",
			subscriptionOrderItems=[
				{
					subscriptionOrderItemID=""
				}
			]
		};
		var subscriptionUsage = createTestEntity('subscriptionUsage',subscriptionUsageData);
		assertTrue(subscriptionUsage.hasSubscriptionOrderItems()); 
		}
	
	
	public void function getTotalNumberOfSubscriptionOrderItemsTest(){
		//mock data
		var subscriptionUsageData={
			subscriptionOrderItems=[
				{
					subscriptionOrderItemid=""
				},
				{
					subscriptionOrderItemid=""
				}
			]
		};
		var subscriptionUsage= createTestEntity('subscriptionUsage', subscriptionUsageData);
		var result= subscriptionUsage.getTotalNumberOfSubscriptionOrderItems();
		assertEquals(result,2); //assert the number of subscription order items
	}
	public void function getUseRenewalSkuTest(){
		var subscriptionUsageData={
			renewalSku=[
			{
				skuID=""
				}
			]
		  };
		  var subscriptionUsage=createTestEntity('subscriptionUsage',subscriptionUsageData);
		  var result= subscriptionUsage.getUseRenewalSku();
		  assertFalse(result);
	}
	public void function getInitialOrderTest(){
		var orderItemData ={
			orderItemID="",
			currencyCode="USD"
			} ;
		var orderItem = createPersistedTestEntity('orderItem',orderItemData);
		
		var skuData = {
			skuID="",
			skuCode="#createUUID()#"
		};
		var sku = createPersistedTestEntity('sku',skuData);
		
		var orderData = {
			orderID="",
			sku={
				skuID=sku.getSkuID()
			}
		};
		var order = createPersistedTestEntity('order',orderData);
		order.addOrderItem(orderItem);
		
		
		
		orderItem.setSku(sku);
		
		
		
		var subscriptionUsageData = {
			subscriptionUsageID=""
			
			
		};
		var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
		
		
		var subscriptionOrderItemData = {
			subscriptionOrderItemID="",
			subscriptionOrderItemType={
				//soitInitial
				typeID="444df311d7615e7cf56b836f515aebd4"
			},
			subscriptionUsage={
				subscriptionUsageID=subscriptionUsage.getSubscriptionUsageID()
			}
		};
		var subscriptionOrderItem = createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData);
		
		subscriptionOrderItem.setOrderItem(orderItem);

		var result=subscriptionUsage.getInitialOrder();
		
		assert(!isNull(result));//assert if the function works correctly or not
	}
	
	public void function getInitialOrderItemTest()
	{
	var subscriptionUsageData = {
			subscriptionUsageID=""
			
			};
		var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
	
		var orderItemData ={
			orderItemID="",
			currencyCode="USD"
			} ;
		var orderItem = createPersistedTestEntity('orderItem',orderItemData);
		
		var skuData = {
			skuID="",
			skuCode="#createUUID()#"
		};
		var sku = createPersistedTestEntity('sku',skuData);
		
		var orderData = {
			orderID="",
			sku={
				skuID=sku.getSkuID()
			}
		};
		var order = createPersistedTestEntity('order',orderData);
		order.addOrderItem(orderItem);
		orderItem.setSku(sku);
		
	
		
		
		var subscriptionOrderItemData = {
			subscriptionOrderItemID="",
			subscriptionOrderItemType={
				//soitInitial
				typeID="444df311d7615e7cf56b836f515aebd4"
			},
			subscriptionUsage={
				subscriptionUsageID=subscriptionUsage.getSubscriptionUsageID()
			}
		};
		var subscriptionOrderItem = createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData);
		
		subscriptionOrderItem.setOrderItem(orderItem);

		
		var result=subscriptionUsage.getInitialOrderItem();	
	
	    assert(!isNull(result));
	    assertTrue(result.getCurrencyCode()=='USD');	
	}
	
	public void function getOrderTest()
	{
	var subscriptionUsageData = {
			subscriptionUsageID=""
			
			};
		var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
	
		var orderItemData ={
			orderItemID="",
			currencyCode="USD"
			} ;
		var orderItem = createPersistedTestEntity('orderItem',orderItemData);
		
		var skuData = {
			skuID="",
			skuCode="#createUUID()#"
		};
		var sku = createPersistedTestEntity('sku',skuData);
		
		var orderData = {
			orderID="",
			sku={
				skuID=sku.getSkuID()
			}
		};
		var order = createPersistedTestEntity('order',orderData);
		order.addOrderItem(orderItem);
		orderItem.setSku(sku);
		
		var subscriptionOrderItemData = {
			subscriptionOrderItemID="",
			subscriptionOrderItemType={
				//soitInitial
				typeID="444df311d7615e7cf56b836f515aebd4"
			},
			subscriptionUsage={
				subscriptionUsageID=subscriptionUsage.getSubscriptionUsageID()
			}
		};
		var subscriptionOrderItem = createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData);
		
		subscriptionOrderItem.setOrderItem(orderItem);

		
		var result=subscriptionUsage.getOrder();	
	
	    assert(!isNull(result));		
	}
	
public void function getInitialSubscriptionOrderItemTest(){
	
var subscriptionUsageData = {
			subscriptionUsageID=""
			
			};
		var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
	
		var orderItemData ={
			orderItemID="",
			currencyCode="USD"
			} ;
		var orderItem = createPersistedTestEntity('orderItem',orderItemData);
		
		var skuData = {
			skuID="",
			skuCode="#createUUID()#"
		};
		var sku = createPersistedTestEntity('sku',skuData);
		
		var orderData = {
			orderID="",
			sku={
				skuID=sku.getSkuID()
			}
		};
		var order = createPersistedTestEntity('order',orderData);
		order.addOrderItem(orderItem);
		orderItem.setSku(sku);
		
		var subscriptionOrderItemData = {
			subscriptionOrderItemID="",
			subscriptionOrderItemType={
				//soitInitial
				typeID="444df311d7615e7cf56b836f515aebd4"
			},
			subscriptionUsage={
				subscriptionUsageID=subscriptionUsage.getSubscriptionUsageID()
			}
		};
		var subscriptionOrderItem = createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData);
		
		subscriptionOrderItem.setOrderItem(orderItem);

		var result=subscriptionUsage.getInitialSubscriptionOrderItem();
		request.debug(result);
		assert(!isNull(result));	
		
	}
	
 //  public function getMostRecentOrderTest(){
//   	var subscriptionUsageData = {
//			subscriptionUsageID=""
//			
//			};
//	var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
//   var subscriptionOrderItemData = {
//			subscriptionOrderItemID=""
//			
//		};
//	var subscriptionOrderItem= createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData);
//	var orderItemData ={
//			orderItemID=""
//			};
//	var smartlist = request.slatwallscope.getProductSmartList();
	//request.debug(smartlist.getRecordsCount());
	
//};
//var orderItem= createPersistedTestEntity('orderItem',orderItemData);
//
//
//		request.debug(orderItem);
//
//}

public void function getSubscriptionOrderItemNameTest() {
var subscriptionUsageData = {
			subscriptionUsageID="",
			subscriptionOrderItems=[
				{
					subscriptionOrderItemID=""
				}
			],
			intialProduct={
				productName="uh"
			}
			};
	var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
		var result=subscriptionUsage.getSubscriptionOrderItemName();
		request.debug(result);
		assertEquals(result,"uh");
}
public void function getCurrentStatusTest(){
	var subscriptionUsageData = {
		subscriptionUsageID=""
	};
	var subscriptionUsage= createPersistedTestEntity('subscriptionUsage',subscriptionUsageData);
	var result=subscriptionUsage.getCurrentStatus();
	request.debug(result);
}
public void function getMostRecentSubscriptionOrderItemTest(){
	var subscriptionUsageData = {
		subscriptionUsageID="",
		subscriptionOrderItems=[
		   {
				subscriptionOrderItemID=" ", 
				remoteID="Sunny"
			},
			{
				subscriptionOrderItemID=" ", 
				remoteID="Sunny1"
			}
		]
	};
	var subscriptionUsage=createPersistedTestEntity('subscriptionUsage',subscriptionUsageData);
	var result= subscriptionUsage.getMostRecentSubscriptionOrderItem();
	assertTrue(result.getRemoteID() == 'Sunny', "Wrong Subscription Order Item dude");
   }
   
   public void function getMostRecentOrderItemTest(){
   		var orderItemData = {
			orderItemID=""
		};
		var orderItem = createPersistedTestEntity('orderItem',orderItemData);
   	
   		var subscriptionOrderItemData={
			subscriptionOrderItemID="",
			orderItem={
				orderItemID=orderItem.getOrderItemID()
			}
		};
		var subscriptionOrderItem = createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData);
   	
   		var orderItem2Data = {
			orderItemID=""
		};
		var orderItem2 = createPersistedTestEntity('orderItem',orderItem2Data);
		
		var subscriptionOrderItem2Data={
			subscriptionOrderItemID="",
			orderItem={
				orderItemID=orderItem2.getOrderItemID()
			}
			
		};
		var subscriptionOrderItem2 = createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItem2Data);
   		
		var subscriptionUsageData = {
			subscriptionUsageID="",
			subscriptionOrderItems=[
			   	{
			   		subscriptionOrderItemID=subscriptionOrderItem.getSubscriptionOrderItemID()
			   	},
			   	{
			   		subscriptionOrderItemID=subscriptionOrderItem2.getSubscriptionOrderItemID()
			   	}
			]
		};
		var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
		request.debug(subscriptionUsage.getSubscriptionOrderItems()[1].getSubscriptionOrderItemID());
		 
		var result= subscriptionUsage.getMostRecentOrderItem();
		assertTrue(result.getorderItemID()==orderItem.getOrderItemID());
 	}
 	
/*public void function getMostRecentOrderTest(){
 		var subscriptionUsageData= {
 			subscriptionUsageID="",
 			subscriptionOrderItem=[
 			{
 			subscriptionOrderItemID="",
 			 orderItem ={
			 orderItemID="",
			 order={
				orderID="",
				currencyCode="USD"
			       }
			            } 
 				
 			},
 			{
 			subscriptionOrderItemID="",
 			 orderItem ={
			 orderItemID="",
			 
			 order={
				orderID="",
				currencyCode="EUR"
			       }
			            } 
 			}
 			
 		  ]
 		};
 	var subscriptionUsage=createPersistedTestEntity('subscriptionUsage',subscriptionUsageData);
	var answer= subscriptionUsage.getMostRecentOrder();
	assert(isNull(answer));
	//assertTrue(answer == 'USD');
 	}*/


	public void function getMostRecentOrderTest(){
		var orderItemData={
			orderItemID=""
		};
		var orderItem=createPersistedTestEntity('orderItem',orderItemData);
		
		var orderItemData2={
			orderItemID=""
			
		};
		var orderItem2=createPersistedTestEntity('orderItem',orderItemData2);
		
		var orderData={
			orderID="",
			orderItems=[
				{
					orderItemID=orderItem.getOrderItemID()
				},
				{
					orderItemID=orderItem2.getOrderItemID()
				}
			]
		};
		var order=createPersistedTestEntity('order',orderData);
		request.debug(arraylen(order.getOrderItems()));
		
		
		
		var subscriptionOrderItemData={
			subscriptionOrderItemID="",
			orderItem={
				orderItemID= orderItem.getOrderItemID()
			}
		};
		var subscriptionOrderItem=createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData);
		
		
		
		
		var subscriptionOrderItemData2={
			subscriptionOrderItemID="",
			orderItem={
				orderItemID= orderItem2.getOrderItemID()
			}
		};
		var subscriptionOrderItem2=createPersistedTestEntity('subscriptionOrderItem',subscriptionOrderItemData2);
		
		var subscriptionUsageData = {
			subscriptionUsageID="",
			subscriptionOrderItems=[
			   	{
			   		subscriptionOrderItemID=subscriptionOrderItem.getSubscriptionOrderItemID()
			   	},
			   	{
			   		subscriptionOrderItemID=subscriptionOrderItem2.getSubscriptionOrderItemID()
			   	}
			]
		};
		var subscriptionUsage=createPersistedTestEntity('subscriptionUsage', subscriptionUsageData);
		var result= subscriptionUsage.getMostRecentOrder();
		assertTrue(result.getorderID()==order.getOrderID());
	}
}
 