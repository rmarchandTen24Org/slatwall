/*

    Slatwall - An e-commerce plugin for Mura CMS
    Copyright (C) 2011 ten24, LLC

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
    
    Linking this library statically or dynamically with other modules is
    making a combined work based on this library.  Thus, the terms and
    conditions of the GNU General Public License cover the whole
    combination.
 
    As a special exception, the copyright holders of this library give you
    permission to link this library with independent modules to produce an
    executable, regardless of the license terms of these independent
    modules, and to copy and distribute the resulting executable under
    terms of your choice, provided that you also meet, for each linked
    independent module, the terms and conditions of the license of that
    module.  An independent module is a module which is not derived from
    or based on this library.  If you modify this library, you may extend
    this exception to your version of the library, but you are not
    obligated to do so.  If you do not wish to do so, delete this
    exception statement from your version.

Notes:

*/
component displayname="Stock" entityname="SlatwallStock" table="SlatwallStock" persistent=true accessors=true output=false extends="BaseEntity" {
	
	// Persistent Properties
	property name="stockID" ormtype="string" length="32" fieldtype="id" generator="uuid" unsavedvalue="" default="";
	property name="qoh" ormtype="integer" hint="Quantity On Hand, This gets decrimented when an item is Shipped, and incrimented when an item is received or transfered in";
	property name="qc" ormtype="integer" hint="Quantity Committed, This gets incrimented when an order is placed, and decremented when an order ships.  It is used to calculated availability";
	property name="qexp" ormtype="integer" hint="Quantity Expected, This is the quantity expected on either a PO or from an order that is being returned.";
	
	// Remote properties
	property name="remoteID" ormtype="string";
	
	// Audit properties
	property name="createdDateTime" ormtype="timestamp";
	property name="createdByAccount" cfc="Account" fieldtype="many-to-one" fkcolumn="createdByAccountID";
	property name="modifiedDateTime" ormtype="timestamp";
	property name="modifiedByAccount" cfc="Account" fieldtype="many-to-one" fkcolumn="modifiedByAccountID";
	
	// Related Object Properties (many-to-one)
	property name="location" fieldtype="many-to-one" fkcolumn="locationID" cfc="Location";
	property name="sku" fieldtype="many-to-one" fkcolumn="skuID" cfc="Sku";
	
	// Related Object Properties (one-to-many). Including this property to allow HQL to do  stock -> vendorOrderItem lookups
	property name="vendorOrderItems" singularname="vendorOrderItem" cfc="VendorOrderItem" fieldtype="one-to-many" fkcolumn="stockID" inverse="true";
	
	// Calculated Quantity Properties
	property name="qoh" hint="Quantity On Hand" formula="SELECT isNull(sum(inventory.quantityIn),0) - isNull(sum(inventory.quantityOut),0) FROM SlatwallInventory inventory WHERE inventory.stockID = stockID";
	
	// Non-Persistent Quantity Properties
	property name="qoso" type="numeric" persistent="false" hint="Quantity On Stock Hold";
	property name="qndoo" type="numeric" persistent="false" hint="Quantity Not Delivered On Order";
	property name="qndorvo" type="numeric" persistent="false" hint="Quantity Not Delivered On Return Vendor Order";
	property name="qndorvo" type="numeric" persistent="false" hint="Quantity Not Delivered On Stock Adjustment";
	property name="qnroro" type="numeric" persistent="false" hint="Quantity Not Received On Return Order";
	property name="qnrovo" type="numeric" persistent="false" hint="Quantity Not Received On Vendor Order";
	property name="qnrosa" type="numeric" persistent="false" hint="Quantity Not Received On Stock Adjustment";
	property name="qc" type="numeric" persistent="false" hint="Quantity Commited";
	property name="qe" type="numeric" persistent="false" hint="Quantity Expected";
	property name="qnc" type="numeric" persistent="false" hint="Quantity Not Commited";
	property name="qiats" type="numeric" persistent="false" hint="Quantity Immediately Available To Sell";
	property name="qfats" type="numeric" persistent="false" hint="Quantity Future Available To Sell";
	property name="qr" type="numeric" persistent="false" hint="Quantity Received";
	property name="qs" type="numeric" persistent="false" hint="Quantity Sold";
	property name="qhb" type="numeric" persistent="false" hint="Quantity Held Back";
	property name="qmin" type="numeric" persistent="false" hint="Quantity Minimum";
	property name="qmax" type="numeric" persistent="false" hint="Quantity Maximum";
}
