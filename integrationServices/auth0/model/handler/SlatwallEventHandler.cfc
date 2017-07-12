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

component extends="Slatwall.org.Hibachi.HibachiEventHandler"{

    public void function afterUpdateEntitiesWithCustomProperties() {
        //based on the auth0 mappings we need to create custom properties
        var customMappings = getService('auth0Service').getCustomMappings();
        var entityParserTemplatePath = expandPath('/Slatwall') & '/integrationServices/auth0/templates/EntityParserTemplate.cfm';
        var entityParserTemplateContent = ReReplace(fileRead(entityParserTemplatePath),'\r','','All');
        for(var mapping in customMappings){ 
            var coreEntityParser = getTransient('HibachiEntityParser');
            coreEntityParser.setFilePath("model/entity/#mapping['slatwallEntity']#.cfc");
            
            var customEntityParser = getTransient('hibachiEntityParser');
            customEntityParser.setFileContent(entityParserTemplateContent);
            getHibachiScope().getService('updateService').mergeEntityParsers(coreEntityParser,customEntityParser);
            fileWrite(expandPath('/Slatwall')&'/model/entity/#mapping['slatwallEntity']#.cfc',coreEntityParser.getFileContent());
        }
        
    }

    public void function afterAccountProcess_createSuccess(required any slatwallScope, required any entity, required any data){
        getService('auth0Service').createAuth0User(arguments.entity, arguments.data);
    }

    public void function onSessionAccountLogout(required any slatwallScope){
        getService('auth0Service').logout(arguments.slatwallScope.getUrl());
    }

    public void function afterAccountDeleteSuccess(any slatwallScope, any entity, any data){
        if(!isNull(arguments.entity.getAuth0Account())){
            getService('auth0Service').deleteAuth0User(arguments.entity);
        }
    }

    public void function afterAccountSave(any slatwallScope, any entity, any data){
        if(isNull(arguments.entity.getAuth0Account())) return;
        var accountAddresses = entity.getAccountAddresses();
        var addresses = arrayMap(accountAddresses, function(accountAddress){
            return accountAddress.getAddress();
        });

        var accountEmailAddresses = entity.getAccountEmailAddresses();
        var emailAddresses = arrayMap(accountEmailAddresses, function(accountEmailAddress){
            var emailAddress = {};
            emailAddress['emailAddress'] = accountEmailAddress.getEmailAddress();
            emailAddress['type'] = accountEmailAddress.getAccountEmailType();
            if(isNull(emailAddress.type)){
                emailAddress.type = "";
            }else{
                emailAddress.type = emailAddress.type.getSimpleRepresentation();
            }
            return emailAddress;
        });

        var accountPhoneNumbers = entity.getAccountPhoneNumbers();
        var phoneNumbers = arrayMap(accountPhoneNumbers, function(accountPhoneNumber){
            var phoneNumber = {};
            phoneNumber['phoneNumber'] = '+'&ReReplace(accountPhoneNumber.getPhoneNumber(),'\D','', 'all');
            phoneNumber['type'] = accountPhoneNumber.getAccountPhoneType();
            if(isNull(phoneNumber.type)){
                phoneNumber.type = "";
            }else{
                phoneNumber.type = phoneNumber.type.getSimpleRepresentation();
            }
            return phoneNumber;
        });
        
        var info = {
            'user_metadata'={
                'account_addresses'=addresses,
                'account_email_addresses'=emailAddresses,
                'account_phone_numbers'=phoneNumbers
            }
        };
        if(structKeyExists(data,'company')){
            info.user_metadata['company'] = data.company;
        }

        if(!isNull(arguments.entity.getPrimaryPhoneNumber())){
            // info['phone_number'] = '+' & ReReplace(arguments.entity.getPrimaryPhoneNumber().getPhoneNumber(),'\D','', 'all');
        }
       
        getService('auth0Service').updateAuth0User(arguments.entity.getAuth0Account().getRemoteID(), info);
        getService('auth0Service').updateAuth0User(arguments.entity.getAuth0Account().getRemoteID(), {"email"=arguments.entity.getPrimaryEmailAddress().getEmailAddress()});
    }

    public void function afterAccountProcess_createPasswordSuccess(any slatwallScope, any entity, any data){
        getService('auth0Service').updateAuth0User(arguments.entity.getAuth0Account().getRemoteID(), {"password"=data.password});
    }

    public void function afterAccountProcess_changePasswordSuccess(any slatwallScope, any entity, any data){
        getService('auth0Service').updateAuth0User(arguments.entity.getAuth0Account().getRemoteID(), {"password"=data.password});   
    }
}