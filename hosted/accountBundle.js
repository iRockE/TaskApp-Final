"use strict";// Handles sending password change request
var handlePasswordChange=function handlePasswordChange(e){e.preventDefault();$("#errorMessageWrapper").fadeOut(400,"swing");if($("#oldPass").val()==""||$("#pass").val()==""||$("#pass2").val()==""){handleError("All fields are required");return false}var pRegex=new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})");if(!pRegex.test($("#pass").val())){handleError("Password must be at least 6 characters with one letter and one number");return false}if($("#pass").val()!=$("#pass2").val()){handleError("Passwords do not match");return false}if($("#oldPass").val()==$("#pass").val()){handleError("Old and new passwords cannot be the same");return false}sendAjax("POST",$("#passwordForm").attr("action"),$("#passwordForm").serialize(),redirect);return false};// Creates form to change password through JSX
var AccountWindow=function AccountWindow(props){return React.createElement("div",{id:"accountPage"},React.createElement("div",null,React.createElement("h3",null,"Username"),React.createElement("h4",null,props.username)),React.createElement("div",{id:"accountForms"},React.createElement("h3",null,"Change Password"),React.createElement("form",{id:"passwordForm",name:"passwordForm",onSubmit:handlePasswordChange,action:"/changePassword",method:"POST",className:"passwordForm"},React.createElement("input",{id:"oldPass",type:"password",name:"oldPass",placeholder:"Old Password"}),React.createElement("input",{id:"pass",type:"password",name:"pass",placeholder:"New Password"}),React.createElement("input",{id:"pass2",type:"password",name:"pass2",placeholder:"Retype Password"}),React.createElement("input",{type:"hidden",name:"_csrf",value:props.csrf}),React.createElement("input",{className:"formSubmit",type:"submit",value:"Change Password"}))))};// Renders the account page content
var createContent=function createContent(csrf){sendAjax("GET","/getUsername",null,function(data){ReactDOM.render(React.createElement(AccountWindow,{csrf:csrf,username:data}),document.querySelector("#content"))})};// Initializes the account page
var setup=function setup(csrf){$("#errorMessageWrapper").click(function(){$("#errorMessageWrapper").fadeOut(400,"swing")});createContent(csrf);// default view
};// Gets the CSRF token for the current user so it can be stored on the page
var getToken=function getToken(){sendAjax("GET","/getToken",null,function(result){setup(result.csrfToken)})};$(document).ready(function(){getToken()});// Handles displaying error messages
var handleError=function handleError(message){$("#errorMessageWrapper").fadeOut(400,"swing",function(){$("#errorMessage").text(message);$("#errorMessageWrapper").fadeIn(400,"swing")})};// Redirects the user to the given location
var redirect=function redirect(response){$("#errorMessageWrapper").fadeOut(400,"swing");window.location=response.redirect};// Handles sending json ajax requests
var sendAjax=function sendAjax(type,action,data,success){$.ajax({cache:false,type:type,url:action,data:data,dataType:"json",success:success,error:function error(xhr,status,_error){var messageObj=JSON.parse(xhr.responseText);handleError(messageObj.error)}})};
//# sourceMappingURL=accountBundle.js.map
