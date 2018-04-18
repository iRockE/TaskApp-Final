// Keeps the height of the different status columns consistent
const normalizeColHeights = () => {
    $("#toDo").height('auto');
    $("#inProgress").height('auto');
    $("#complete").height('auto');
    let height = Math.max($("#toDo").height(), $("#inProgress").height(), $("#complete").height());
    $("#toDo").height(height);
    $("#inProgress").height(height);
    $("#complete").height(height);
}

// Creates a new board item
const handleBoardItem = (e) => {
    e.preventDefault();

    $("#errorMessageWrapper").fadeOut(400, "swing");

    if($("#boardItemName").val() == '' || $("#boardItemDescription").val() == ''){
        handleError("Item name and description required");
        return false;
    }

    sendAjax('POST', $("#boardItemForm").attr("action"), $("#boardItemForm").serialize(), function() {
        loadBoardItemsFromServer();
    });

    return false;
};

// Deletes the given board item
const deleteBoardItem = (e, boardItemID) => {
    $("#errorMessageWrapper").fadeOut(400, "swing");

    if($("#boardItemID").val() == ''){
        handleError("Board Item does not exist");
        return false;
    }

    sendAjax('POST', "/deleteBoardItem", `${$("#clientCSRF").serialize()}&itemID=${boardItemID}`, function() {
        loadBoardItemsFromServer();
    });

    return false;
};

// Handles dragging an item
const handleDragStart = (e, itemID) => {
    e.dataTransfer.setData('text', itemID);
    return false;
};

// Handles dropping an item into a new status
const handleDrop = (e, status) => {
    let itemID = e.dataTransfer.getData('text');
    if (!itemID || !status){
        handleError("Missing item or status");
        return false;
    }

    sendAjax('POST', "/changeStatus", `${$("#clientCSRF").serialize()}&itemID=${itemID}&status=${status}`, function() {
        loadBoardItemsFromServer();
    });

    return false;
};

// Creates form to make a board item through JSX
const BoardItemForm = (props) => {
    return (
        <div>
            <form id="boardItemForm" 
                name="boardItemForm"
                onSubmit={handleBoardItem}
                action="/board"
                method="POST"
                className="boardItemForm"
                >
                <input id="boardItemName" type="text" name="name" placeholder="Name" />   
                <input id="boardItemDescription" type="text" name="description" placeholder="Description" />
                <input id="clientCSRF" type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeBoardSubmit" type="submit" value="Make Item" />
            </form>
            <a className="shareBoard" href="/share">Share</a>
        </div>
    );
};

// Creates sections for all of the items in a board based on their status through JSX
const BoardList = function(props) {
    if (props.toDo.length === 0 && props.inProgress.length === 0 && props.complete.length === 0){
        return (
            <div className="boardItemList">
                <h3 className="emptyBoard">No items yet</h3>
            </div>
        );
    }
    const toDoNodes = props.toDo.map(function(item) {
        return (
            <div key={item._id} className="item" draggable="true" onDragStart={(e) => handleDragStart(e, item._id)}>
                <button className="deleteBoardItem" onClick={(e) => deleteBoardItem(e, item._id)}></button>
                <h3 className="itemName">{item.name}</h3>
                <p className="itemDescription">{item.description}</p>
            </div>
        );
    });
    const inProgressNodes = props.inProgress.map(function(item) {
        return (
            <div key={item._id} className="item" draggable="true" onDragStart={(e) => handleDragStart(e, item._id)}>
                <button className="deleteBoardItem" onClick={(e) => deleteBoardItem(e, item._id)}></button>
                <h3 className="itemName">{item.name}</h3>
                <p className="itemDescription">{item.description}</p>
            </div>
        );
    });
    const completeNodes = props.complete.map(function(item) {
        return (
            <div key={item._id} className="item" draggable="true" onDragStart={(e) => handleDragStart(e, item._id)}>
                <button className="deleteBoardItem" onClick={(e) => deleteBoardItem(e, item._id)}></button>
                <h3 className="itemName">{item.name}</h3>
                <p className="itemDescription">{item.description}</p>
            </div>
        );
    });

    return (
        <div className="itemList">
            <div id="toDo" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'toDo')}>
                <h2>To Do</h2>
                {toDoNodes}
            </div>
            <div id="inProgress" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'inProgress')}>
                <h2>In Progress</h2>
                {inProgressNodes}
            </div>
            <div id="complete" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'complete')}>
                <h2>Complete</h2>
                {completeNodes}
            </div>
        </div>
    );
};

// Loads all items for the current board from the server and displays them.
const loadBoardItemsFromServer = () => {
    sendAjax('GET', '/getBoardItems', null, (data) => {
        const toDoArray = [];
        const inProgressArray = [];
        const completeArray = [];
        for (let i = 0; i < data.boardItems.length; ++i) {
            if (data.boardItems[i].status == "toDo"){
                toDoArray.push(data.boardItems[i]);
            }
            else if (data.boardItems[i].status == "inProgress"){
                inProgressArray.push(data.boardItems[i]);
            }
            else if (data.boardItems[i].status == "complete"){
                completeArray.push(data.boardItems[i]);
            }
        }
        ReactDOM.render(
            <BoardList toDo={toDoArray} inProgress={inProgressArray} 
                complete={completeArray} />, document.querySelector("#boardItems")
        );
        normalizeColHeights();
    });
};

// Initializes the board page
const setup = function(csrf) {
    ReactDOM.render(
        <BoardItemForm csrf={csrf} />, document.querySelector("#makeBoardItem")
    );

    ReactDOM.render(
        <BoardList toDo={[]} inProgress={[]} complete={[]} />, 
            document.querySelector("#boardItems")
    );

    $("#errorMessageWrapper").click(function() {
        $("#errorMessageWrapper").fadeOut(400, "swing");
    });

    loadBoardItemsFromServer();
};

// Gets the CSRF token for the current user so it can be stored on the page
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
})