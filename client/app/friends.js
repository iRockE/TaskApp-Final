// add a new friend
const addFriend = (e) => {
    e.preventDefault();

    $("#errorMessageWrapper").fadeOut(400, "swing");

    if($("#friendName").val() == ''){
        handleError("Friend username required");
        return false;
    }

    sendAjax('POST', $("#friendForm").attr("action"), $("#friendForm").serialize(), function() {
        loadFriendsFromServer();
    });

    return false;
};

// Remove a friend
const removeFriend = (e, friendID) => {
    $("#errorMessageWrapper").fadeOut(400, "swing");

    if (!friendID){
        handleError("Friend does not exist");
        return false;
    }

    sendAjax('POST', "/removeFriend", `${$("#clientCSRF").serialize()}&friendID=${friendID}`, function() {
        loadFriendsFromServer();
    });
    e.stopPropagation();
    return false;
};

// Makes a friend creation form through JSX
const FriendForm = (props) => {
    return (
        <form id="friendForm" 
            name="friendForm"
            onSubmit={addFriend}
            action="/friends"
            method="POST"
            className="friendForm"
            >
            <input id="friendName" type="text" name="name" placeholder="Friend's Username" />    
            <input id="clientCSRF" type="hidden" name="_csrf" value={props.csrf} />
            <input className="addFriendSubmit" type="submit" value="Add Friend" />
        </form>
    );
};

// Makes a list of friends through JSX
const FriendList = function(props) {
    if (props.friends.length === 0){
        return (
            <div className="friendList">
                <h3 className="emptyFriends">No friends yet</h3>
            </div>
        );
    }

    const friendNodes = props.friends.map(function(friend) {
        return (
            <div key={friend._id} className="friend">
                <button className="removeFriend" onClick={(e) => removeFriend(e, friend._id)}></button>
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

// Loads the friends from the server so that they may be displayed
const loadFriendsFromServer = () => {
    sendAjax('GET', '/getFriends', null, (data) => {
        ReactDOM.render(
            <FriendList friends={data.friends} />, document.querySelector("#friends")
        );
    });
};

// Initializes the friends page
const setup = function(csrf) {
    ReactDOM.render(
        <FriendForm csrf={csrf} />, document.querySelector("#addFriend")
    );

    ReactDOM.render(
        <FriendList friends={[]} />, document.querySelector("#friends")
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