//page object
var LoginPage = function() {
  var emailAddressNameInput = element(by.name('emailAddress'));
  var passwordInput = element(by.name('password'));

  var loginButton = element(by.buttonText('Login'));

  this.get = function() {
    browser.get('http://cf10.localhost');
  };

  this.setEmailAddress = function(emailAddress) {
    emailAddressNameInput.sendKeys(emailAddress);
  };

  this.setPasswordInput = function(password){
    passwordInput.sendKeys(password);
  }

  this.pressLogin = function(){
    loginButton.click();
  }


};

describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    var loginPage = new LoginPage();
    loginPage.get();

    /*loginPage.setEmailAddress('ryan.marchand@ten24web.com');
    loginPage.setPasswordInput('testPassword');

    loginPage.pressLogin();
*/
    browser.pause();

    //expect(angularHomepage.getGreeting()).toEqual('Hello Julie!');
  });
});
