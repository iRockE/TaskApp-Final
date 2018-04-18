"use strict";// add a new friend
var addFriend=function addFriend(e){e.preventDefault();$("#errorMessageWrapper").fadeOut(400,"swing");if($("#friendName").val()==""){handleError("Friend username required");return false}sendAjax("POST",$("#friendForm").attr("action"),$("#friendForm").serialize(),function(){loadFriendsFromServer()});return false};// Remove a friend
var removeFriend=function removeFriend(e,friendID){$("#errorMessageWrapper").fadeOut(400,"swing");if(!friendID){handleError("Friend does not exist");return false}sendAjax("POST","/removeFriend",$("#clientCSRF").serialize()+"&friendID="+friendID,function(){loadFriendsFromServer()});e.stopPropagation();return false};// Makes a friend creation form through JSX
var FriendForm=function FriendForm(props){return React.createElement("form",{id:"friendForm",name:"friendForm",onSubmit:addFriend,action:"/friends",method:"POST",className:"friendForm"},React.createElement("input",{id:"friendName",type:"text",name:"name",placeholder:"Friend's Username"}),React.createElement("input",{id:"clientCSRF",type:"hidden",name:"_csrf",value:props.csrf}),React.createElement("input",{className:"addFriendSubmit",type:"submit",value:"Add Friend"}))};// Makes a list of friends through JSX
var FriendList=function FriendList(props){if(props.friends.length===0){return React.createElement("div",{className:"friendList"},React.createElement("h3",{className:"emptyFriends"},"No friends yet"))}var friendNodes=props.friends.map(function(friend){return React.createElement("div",{key:friend._id,className:"friend"},React.createElement("button",{className:"removeFriend",onClick:function onClick(e){return removeFriend(e,friend._id)}}),React.createElement("h3",{className:"friendName"},friend.username))});return React.createElement("div",{className:"friendList"},friendNodes)};// Loads the friends from the server so that they may be displayed
var loadFriendsFromServer=function loadFriendsFromServer(){sendAjax("GET","/getFriends",null,function(data){ReactDOM.render(React.createElement(FriendList,{friends:data.friends}),document.querySelector("#friends"))})};// Initializes the friends page
var setup=function setup(csrf){ReactDOM.render(React.createElement(FriendForm,{csrf:csrf}),document.querySelector("#addFriend"));ReactDOM.render(React.createElement(FriendList,{friends:[]}),document.querySelector("#friends"));$("#errorMessageWrapper").click(function(){$("#errorMessageWrapper").fadeOut(400,"swing")});loadFriendsFromServer()};// Gets the CSRF token for the current user so it can be stored on the page
var getToken=function getToken(){sendAjax("GET","/getToken",null,function(result){setup(result.csrfToken)})};$(document).ready(function(){getToken()});// Handles displaying error messages
var handleError=function handleError(message){$("#errorMessageWrapper").fadeOut(400,"swing",function(){$("#errorMessage").text(message);$("#errorMessageWrapper").fadeIn(400,"swing")})};// Redirects the user to the given location
var redirect=function redirect(response){$("#errorMessageWrapper").fadeOut(400,"swing");window.location=response.redirect};// Handles sending json ajax requests
var sendAjax=function sendAjax(type,action,data,success){$.ajax({cache:false,type:type,url:action,data:data,dataType:"json",success:success,error:function error(xhr,status,_error){var messageObj=JSON.parse(xhr.responseText);handleError(messageObj.error)}})};
//# sourceMappingURL=friendsBundle.js.map