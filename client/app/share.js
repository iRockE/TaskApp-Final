// Share the current board with a friend
const shareFriend = (e, friendID) => {
    $("#errorMessageWrapper").fadeOut(400, "swing");

    if (!friendID){
        handleError("Friend does not exist");
        return false;
    }

    sendAjax('POST', "/shareFriend", `${$("#clientCSRF").serialize()}&friendID=${friendID}`, function() {
        loadFriendsFromServer();
    });
    e.stopPropagation();
    return false;
};

// Unshare the current board with a friend
const unshareFriend = (e, friendID) => {
    $("#errorMessageWrapper").fadeOut(400, "swing");

    if (!friendID){
        handleError("Friend does not exist");
        return false;
    }

    sendAjax('POST', "/unshareFriend", `${$("#clientCSRF").serialize()}&friendID=${friendID}`, function() {
        loadFriendsFromServer();
    });
    e.stopPropagation();
    return false;
};

// Makes a list of friends through JSX
const FriendListShared = function(props) {
    if (props.friends.length === 0){
        return (
            <div className="friendList">
                <h3 className="emptyFriends">No shares yet. Click on a friend to share this board!</h3>
            </div>
        );
    }

    const friendNodes = props.friends.map(function(friend) {
        return (
            <div key={friend._id} className="friend" onClick={(e) => unshareFriend(e, friend._id)}>
                <h3 className="friendName">{friend.username}</h3>
            </div>
        );
    });

    return (
        <div className="friendList">
            {friendNodes}
        </div>
    );
};

// Makes a list of friends through JSX
const FriendList = function(props) {
    if (props.friends.length === 0){
        return (
            <div className="friendList">
                <h3 className="emptyFriends">No friends to share with</h3>
            </div>
        );
    }

    const friendNodes = props.friends.map(function(friend) {
        return (
            <div key={friend._id} className="friend" onClick={(e) => shareFriend(e, friend._id)}>
                <h3 className="friendName">{friend.username}</h3>
            </div>
        );
    });

    return (
        <div className="friendList">
            {friendNodes}
        </div>
    );
};

// Makes a list of friends through JSX
const FieldCSRF = function(props) {
    return (
        <div>
            <input id="clientCSRF" type="hidden" name="_csrf" value={props.csrf} />
        </div>
    );
};

// Loads the friends from the server so that they may be displayed
const loadFriendsFromServer = () => {
    sendAjax('GET', '/getShared', null, (data) => {
        ReactDOM.render(
            <FriendListShared friends={data.sharedFriends} />, document.querySelector("#sharedFriends")
        );
        ReactDOM.render(
            <FriendList friends={data.unsharedFriends} />, document.querySelector("#unsharedFriends")
        );
    });
};

// Initializes the friends page
const setup = function(csrf) {
    ReactDOM.render(
        <FieldCSRF csrf={csrf} />, document.querySelector("#csrfContainer")
    );

    $("#errorMessageWrapper").click(function() {
        $("#errorMessageWrapper").fadeOut(400, "swing");
    });

    loadFriendsFromServer();
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