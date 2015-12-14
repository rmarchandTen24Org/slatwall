<cfoutput>
<cfinclude template="header.cfm" >
<div>
  <div>
    <section>
        <div>           
            <div class="container" >
                <div class="s-ds-header">
                    <h2>Examples:</h2>
                    <h3>These are basic examples of using frontend directives</h3>
                </div>
                
                <p class="directives">
                	<b>Account</b> can be accessed from anywhere within the frontend app
                	by referencing hibachiScope.account|cart.
                	For example: hibachiScope.account.firstName, hibachiScope.account.lastName
                	will reference those values if the user is logged in. <br>
                	<b>{{slatwall.account.firstName}} {{slatwall.account.lastName}}</b><br>
                	
                	<br><br>
                    <b>login/logout</b>     <br>       
                     Accepts a email and password and logs in the user. {{slatwall.userIsLoggedIn()}}
                           <br><swf-login ng-if="!slatwall.userIsLoggedIn()"></swf-login>
                    
                    <br><br>
                      {{hibachiScope.account.firstName}}
                           <br><swf-logout ng-if="slatwall.userIsLoggedIn()"></swf-logout>
                    <br><br>
                     Cart is accessed the same way as Account. hibachiScope.cart.subtotal or hibachiScope.cart.discounttotal
                     or hibachiScope.cart.calculatedtotal yeild totals on the order while hibachiScope.cart.orderitems is
                     an array of objects that contain the items on the order.
                     <br><br>
                     <b>Add promotion to order: {{slatwall.getPromotionCodeList()}}</b>
                     <br><swf-promo></swf-promo>
                    <br>
                    <br><br>
                      <b>swf-directive</b> example for specifying the directive path to use.
                      This directive allows you to use one directive to wrap any partial custom or built in.
                    <br>
                         path is /org/Hibachi/src/frontend/components/
                         partial-name is createaccountpartial
                         
                         *Note you do not need to provide an .html ext on the partial-name attribute.
                         **Note the type attribute for the swf-directive is C for custom. Other types include
                           A for creating an attribute based directive and E for elemental directive.
                    <br>
                    
                    <br><swf-directive path="/org/Hibachi/client/src/frontend/components/" partial-name="createaccountpartial" type="C"></swf-directive>
                </p>
            </div>
        </div>
    </section>
  </div>
  <!--- 
  
  <dd> example custom
                               <br>Test using a custom html for submission.
                               <sw-form data-is-process-form="true"
                                        data-object="Account_Login"
                                        data-on-success="hide:Account_Login,show:Account_Logout"
                                        data-form-class="cssform"
                                        data-error-class="error">
                                   Email: <input name="email" type="email"></input>
                                   Password: <input name="password" type="password"></input>
                                   <input type="submit" action="login" ng-click="swFormController.submit()" value="login"></input>  
                               </sw-form>
                        </dd> 
  --->
</div>
</cfoutput>
<cfinclude template="footer.cfm" >
<style type="text/css">
  .css-form input.ng-invalid.ng-touched {
    border: 1px solid red;
  }

  .css-form input.ng-valid.ng-touched {
    border: 1px solid gray;
  }
  
  .error {
  	color: red;
  	font-size: 11px;
  	padding-top:10px;
  	padding-bottom: 10px;
  }
</style>
<style >
    dl {
        
        border: 1px dotted gray;
        padding:1.5em;
        background-color:white;
        color:#666666;
        margin-left: 20px;
        margin-right: 20px;
        
        }
    dt {
        float: left;
        clear: left;
        width: 100px;
        text-align: right;
        font-weight: bold;
        color: gray;
          }
          dt:after {
            content: ":";
          }
    dd {
        margin: 0 0 0 110px;
        padding: 0 0 0.5em 0;
    }
    dl p {
        text-size: 2em;
    }
    dl h4 {
        border-radius: 10px;
        background-color: #428BCA;
        color: white;
        padding: 20px;
        margin:20px;
    }
    
            
    /*Header*/
    .s-ds-header {
        background: #F58620;
        color: #fff;
        padding: 100px;
        margin:20px;
    }
    /* body */
    .directives {
        padding: 2px;
        padding-left:100px;
    }
    .att_header {
        background: #ffffff;
        color: #000001;
        padding: 10px;
        margin:10px;
    }
    .s-ds-header h1 {
        margin-top:0px;
    }
    .s-ds-header a {
        color: #fff;
        text-decoration: underline;
    }
    .s-ds-header a:hover {
        color: #eee;
    }
    
    /*Sidebar*/
    .s-ds-sidebar h2 {
        font-size: 22px;
        margin-bottom: 3px;
    }
    
    /*Type Object Group*/
    .s-ds-type-group > h2 {
        border-bottom: 2px solid #AAA;
        font-weight: 600;
        text-transform: uppercase;
    }
    .s-ds-obj-listing li {
        margin-bottom: 10px;
    }
    .s-ds-type-item-objs .s-ds-type-item-obj {
        padding: 20px;
        background: #fff;
        border-radius: 4px;
    }
</style>
                            <!--
                            <swf-form process-object="Account_login" action="$login">
                                <label>Email Address: <input type="text" name="inputEmailAddress" ng-model="Account_login.inputEmailAddress"></input></label>
                                <label>Password: <input type="password" name="inputPassword" ng-model="Account_login.inputPassword"></input></label>
                                <input type="submit" name="submitLogin" ng-click="submit()"></input>
                            </swf-form>
                            -->
