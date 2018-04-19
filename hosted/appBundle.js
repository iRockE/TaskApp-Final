"use strict";// Creates a new board
var handleBoard=function handleBoard(e){e.preventDefault();$("#errorMessageWrapper").fadeOut(400,"swing");if($("#boardName").val()==""){handleError("Board name required");return false}sendAjax("POST",$("#boardForm").attr("action"),$("#boardForm").serialize(),function(){loadBoardsFromServer()});return false};// Loads an individual board's page
var loadBoard=function loadBoard(e,boardID){$("#errorMessageWrapper").fadeOut(400,"swing");if($("#boardID").val()==""){handleError("Board does not exist");return false}sendAjax("POST","/loadBoard",$("#clientCSRF").serialize()+"&boardID="+boardID,redirect);return false};// Deletes a board
var deleteBoard=function deleteBoard(e,boardID){$("#errorMessageWrapper").fadeOut(400,"swing");if($("#boardID").val()==""){handleError("Board does not exist");return false}sendAjax("POST","/deleteBoard",$("#clientCSRF").serialize()+"&boardID="+boardID,function(){loadBoardsFromServer()});e.stopPropagation();return false};// Makes a board creation form through JSX
var BoardForm=function BoardForm(props){return React.createElement("form",{id:"boardForm",name:"boardForm",onSubmit:handleBoard,action:"/boards",method:"POST",className:"boardForm"},React.createElement("input",{id:"boardName",type:"text",name:"name",placeholder:"Project Name"}),React.createElement("input",{id:"clientCSRF",type:"hidden",name:"_csrf",value:props.csrf}),React.createElement("input",{className:"makeBoardSubmit",type:"submit",value:"Make Board"}))};// Makes a list of boards through JSX
var BoardList=function BoardList(props){if(props.boards.length===0){return React.createElement("div",{className:"boardList"},React.createElement("h3",{className:"emptyBoard"},"No boards yet"))}var boardNodes=props.boards.map(function(board){return React.createElement("div",{key:board._id,className:"board",onClick:function onClick(e){return loadBoard(e,board._id)}},React.createElement("button",{className:"deleteBoard",onClick:function onClick(e){return deleteBoard(e,board._id)}}),React.createElement("h3",{className:"boardName"},board.name))});return React.createElement("div",{className:"boardList"},boardNodes)};// Makes a list of shared boards through JSX
var SharedBoardList=function SharedBoardList(props){if(props.boards.length===0){return React.createElement("div",{className:"boardList"},React.createElement("h3",{className:"emptyBoard"},"No boards yet"))}var boardNodes=props.boards.map(function(board){return React.createElement("div",{key:board._id,className:"board",onClick:function onClick(e){return loadBoard(e,board._id)}},React.createElement("button",{className:"deleteBoard",onClick:function onClick(e){return deleteBoard(e,board._id)}}),React.createElement("h3",{className:"boardName"},board.name))});return React.createElement("div",{className:"sharedBoardList"},React.createElement("h3",null,"Shared with you:"),boardNodes)};// Loads the boards from the server so that they may be displayed
var loadBoardsFromServer=function loadBoardsFromServer(){sendAjax("GET","/getBoards",null,function(data){ReactDOM.render(React.createElement(BoardList,{boards:data.boards,sharedBoards:data.sharedBoards}),document.querySelector("#boards"));ReactDOM.render(React.createElement(SharedBoardList,{boards:data.sharedBoards}),document.querySelector("#sharedBoards"))})};// Initializes the board page
var setup=function setup(csrf){ReactDOM.render(React.createElement(BoardForm,{csrf:csrf}),document.querySelector("#makeBoard"));ReactDOM.render(React.createElement(BoardList,{boards:[]}),document.querySelector("#boards"));$("#errorMessageWrapper").click(function(){$("#errorMessageWrapper").fadeOut(400,"swing")});loadBoardsFromServer()};// Gets the CSRF token for the current user so it can be stored on the page
var getToken=function getToken(){sendAjax("GET","/getToken",null,function(result){setup(result.csrfToken)})};$(document).ready(function(){getToken()});// Handles displaying error messages
var handleError=function handleError(message){$("#errorMessageWrapper").fadeOut(400,"swing",function(){$("#errorMessage").text(message);$("#errorMessageWrapper").fadeIn(400,"swing")})};// Redirects the user to the given location
var redirect=function redirect(response){$("#errorMessageWrapper").fadeOut(400,"swing");window.location=response.redirect};// Handles sending json ajax requests
var sendAjax=function sendAjax(type,action,data,success){$.ajax({cache:false,type:type,url:action,data:data,dataType:"json",success:success,error:function error(xhr,status,_error){var messageObj=JSON.parse(xhr.responseText);handleError(messageObj.error)}})};
//# sourceMappingURL=appBundle.js.map
