"use strict";// Keeps the height of the different status columns consistent
var normalizeColHeights=function normalizeColHeights(){$("#toDo").height("auto");$("#inProgress").height("auto");$("#complete").height("auto");var height=Math.max($("#toDo").height(),$("#inProgress").height(),$("#complete").height());$("#toDo").height(height);$("#inProgress").height(height);$("#complete").height(height)};// Creates a new board item
var handleBoardItem=function handleBoardItem(e){e.preventDefault();$("#errorMessageWrapper").fadeOut(400,"swing");if($("#boardItemName").val()==""||$("#boardItemDescription").val()==""){handleError("Item name and description required");return false}sendAjax("POST",$("#boardItemForm").attr("action"),$("#boardItemForm").serialize(),function(){loadBoardItemsFromServer()});return false};// Deletes the given board item
var deleteBoardItem=function deleteBoardItem(e,boardItemID){$("#errorMessageWrapper").fadeOut(400,"swing");if($("#boardItemID").val()==""){handleError("Board Item does not exist");return false}sendAjax("POST","/deleteBoardItem",$("#clientCSRF").serialize()+"&itemID="+boardItemID,function(){loadBoardItemsFromServer()});return false};// Handles dragging an item
var handleDragStart=function handleDragStart(e,itemID){e.dataTransfer.setData("text",itemID);return false};// Handles dropping an item into a new status
var handleDrop=function handleDrop(e,status){var itemID=e.dataTransfer.getData("text");if(!itemID||!status){handleError("Missing item or status");return false}sendAjax("POST","/changeStatus",$("#clientCSRF").serialize()+"&itemID="+itemID+"&status="+status,function(){loadBoardItemsFromServer()});return false};// Creates form to make a board item through JSX
var BoardItemForm=function BoardItemForm(props){return React.createElement("form",{id:"boardItemForm",name:"boardItemForm",onSubmit:handleBoardItem,action:"/board",method:"POST",className:"boardItemForm"},React.createElement("input",{id:"boardItemName",type:"text",name:"name",placeholder:"Name"}),React.createElement("input",{id:"boardItemDescription",type:"text",name:"description",placeholder:"Description"}),React.createElement("input",{id:"clientCSRF",type:"hidden",name:"_csrf",value:props.csrf}),React.createElement("input",{className:"makeBoardItemSubmit",type:"submit",value:"Make Item"}))};// Create a share button if this board can be shared
var ShareButton=function ShareButton(props){if(props.shareable){return React.createElement("a",{className:"shareBoard",href:"/share"},"Share")}else{return React.createElement("div",null)}};// Creates sections for all of the items in a board based on their status through JSX
var BoardList=function BoardList(props){if(props.toDo.length===0&&props.inProgress.length===0&&props.complete.length===0){return React.createElement("div",{className:"boardItemList"},React.createElement("h3",{className:"emptyBoard"},"No items yet"))}var toDoNodes=props.toDo.map(function(item){return React.createElement("div",{key:item._id,className:"item",draggable:"true",onDragStart:function onDragStart(e){return handleDragStart(e,item._id)}},React.createElement("button",{className:"deleteBoardItem",onClick:function onClick(e){return deleteBoardItem(e,item._id)}}),React.createElement("h3",{className:"itemName"},item.name),React.createElement("p",{className:"itemDescription"},item.description))});var inProgressNodes=props.inProgress.map(function(item){return React.createElement("div",{key:item._id,className:"item",draggable:"true",onDragStart:function onDragStart(e){return handleDragStart(e,item._id)}},React.createElement("button",{className:"deleteBoardItem",onClick:function onClick(e){return deleteBoardItem(e,item._id)}}),React.createElement("h3",{className:"itemName"},item.name),React.createElement("p",{className:"itemDescription"},item.description))});var completeNodes=props.complete.map(function(item){return React.createElement("div",{key:item._id,className:"item",draggable:"true",onDragStart:function onDragStart(e){return handleDragStart(e,item._id)}},React.createElement("button",{className:"deleteBoardItem",onClick:function onClick(e){return deleteBoardItem(e,item._id)}}),React.createElement("h3",{className:"itemName"},item.name),React.createElement("p",{className:"itemDescription"},item.description))});return React.createElement("div",{className:"boardItemList"},React.createElement("div",{id:"toDo",onDragOver:function onDragOver(e){return e.preventDefault()},onDrop:function onDrop(e){return handleDrop(e,"toDo")}},React.createElement("h2",null,"To Do"),toDoNodes),React.createElement("div",{id:"inProgress",onDragOver:function onDragOver(e){return e.preventDefault()},onDrop:function onDrop(e){return handleDrop(e,"inProgress")}},React.createElement("h2",null,"In Progress"),inProgressNodes),React.createElement("div",{id:"complete",onDragOver:function onDragOver(e){return e.preventDefault()},onDrop:function onDrop(e){return handleDrop(e,"complete")}},React.createElement("h2",null,"Complete"),completeNodes))};// Loads all items for the current board from the server and displays them.
var loadBoardItemsFromServer=function loadBoardItemsFromServer(){sendAjax("GET","/getBoardItems",null,function(data){var toDoArray=[];var inProgressArray=[];var completeArray=[];for(var i=0;i<data.boardItems.length;++i){if(data.boardItems[i].status=="toDo"){toDoArray.push(data.boardItems[i])}else if(data.boardItems[i].status=="inProgress"){inProgressArray.push(data.boardItems[i])}else if(data.boardItems[i].status=="complete"){completeArray.push(data.boardItems[i])}}ReactDOM.render(React.createElement(ShareButton,{shareable:data.shareable}),document.querySelector("#shareButton"));ReactDOM.render(React.createElement(BoardList,{toDo:toDoArray,inProgress:inProgressArray,complete:completeArray}),document.querySelector("#boardItems"));normalizeColHeights()})};// Initializes the board page
var setup=function setup(csrf){ReactDOM.render(React.createElement(BoardItemForm,{csrf:csrf}),document.querySelector("#makeBoardItem"));ReactDOM.render(React.createElement(BoardList,{toDo:[],inProgress:[],complete:[]}),document.querySelector("#boardItems"));$("#errorMessageWrapper").click(function(){$("#errorMessageWrapper").fadeOut(400,"swing")});loadBoardItemsFromServer()};// Gets the CSRF token for the current user so it can be stored on the page
var getToken=function getToken(){sendAjax("GET","/getToken",null,function(result){setup(result.csrfToken)})};$(document).ready(function(){getToken()});// Handles displaying error messages
var handleError=function handleError(message){$("#errorMessageWrapper").fadeOut(400,"swing",function(){$("#errorMessage").text(message);$("#errorMessageWrapper").fadeIn(400,"swing")})};// Redirects the user to the given location
var redirect=function redirect(response){$("#errorMessageWrapper").fadeOut(400,"swing");window.location=response.redirect};// Handles sending json ajax requests
var sendAjax=function sendAjax(type,action,data,success){$.ajax({cache:false,type:type,url:action,data:data,dataType:"json",success:success,error:function error(xhr,status,_error){var messageObj=JSON.parse(xhr.responseText);handleError(messageObj.error)}})};
//# sourceMappingURL=boardBundle.js.map
