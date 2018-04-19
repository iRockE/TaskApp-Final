// Creates a new board
const handleBoard = (e) => {
    e.preventDefault();

    $("#errorMessageWrapper").fadeOut(400, "swing");

    if($("#boardName").val() == ''){
        handleError("Board name required");
        return false;
    }

    sendAjax('POST', $("#boardForm").attr("action"), $("#boardForm").serialize(), function() {
        loadBoardsFromServer();
    });

    return false;
};

// Loads an individual board's page
const loadBoard = (e, boardID) => {
    $("#errorMessageWrapper").fadeOut(400, "swing");
    if($("#boardID").val() == ''){
        handleError("Board does not exist");
        return false;
    }
    sendAjax('POST', "/loadBoard", `${$("#clientCSRF").serialize()}&boardID=${boardID}`, redirect);
    return false;
};

// Deletes a board
const deleteBoard = (e, boardID) => {
    $("#errorMessageWrapper").fadeOut(400, "swing");

    if($("#boardID").val() == ''){
        handleError("Board does not exist");
        return false;
    }

    sendAjax('POST', "/deleteBoard", `${$("#clientCSRF").serialize()}&boardID=${boardID}`, function() {
        loadBoardsFromServer();
    });
    e.stopPropagation();
    return false;
};

// Makes a board creation form through JSX
const BoardForm = (props) => {
    return (
        <form id="boardForm" 
            name="boardForm"
            onSubmit={handleBoard}
            action="/boards"
            method="POST"
            className="boardForm"
            >
            <input id="boardName" type="text" name="name" placeholder="Project Name" />    
            <input id="clientCSRF" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeBoardSubmit" type="submit" value="Make Board" />
        </form>
    );
};

// Makes a list of boards through JSX
const BoardList = function(props) {
    if (props.boards.length === 0){
        return (
            <div className="boardList">
                <h3 className="emptyBoard">No boards yet</h3>
            </div>
        );
    }

    const boardNodes = props.boards.map(function(board) {
        return (
            <div key={board._id} className="board" onClick={(e) => loadBoard(e, board._id)}>
                <button className="deleteBoard" onClick={(e) => deleteBoard(e, board._id)}></button>
                <h3 className="boardName">{board.name}</h3>
            </div>
        );
    });

    return (
        <div className="boardList">
            {boardNodes}
        </div>
    );
};

// Makes a list of shared boards through JSX
const SharedBoardList = function(props) {
    if (props.boards.length === 0){
        return (
            <div className="boardList">
                <h3 className="emptyBoard">No boards yet</h3>
            </div>
        );
    }

    const boardNodes = props.boards.map(function(board) {
        return (
            <div key={board._id} className="board" onClick={(e) => loadBoard(e, board._id)}>
                <button className="deleteBoard" onClick={(e) => deleteBoard(e, board._id)}></button>
                <h3 className="boardName">{board.name}</h3>
            </div>
        );
    });

    return (
        <div className="sharedBoardList">
            <h3>Shared with you:</h3>
            {boardNodes}
        </div>
    );
};

// Loads the boards from the server so that they may be displayed
const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} sharedBoards={data.sharedBoards}/>, 
            document.querySelector("#boards")
        );
        ReactDOM.render(
            <SharedBoardList boards={data.sharedBoards}/>, 
            document.querySelector("#sharedBoards")
        );
    });
};

// Initializes the board page
const setup = function(csrf) {
    ReactDOM.render(
        <BoardForm csrf={csrf} />, document.querySelector("#makeBoard")
    );

    ReactDOM.render(
        <BoardList boards={[]} />, document.querySelector("#boards")
    );
    
    $("#errorMessageWrapper").click(function() {
        $("#errorMessageWrapper").fadeOut(400, "swing");
    });

    loadBoardsFromServer();
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