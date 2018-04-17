// Handles sending password change request
const handlePasswordChange = (e) => {
    e.preventDefault();

    $("#errorMessageWrapper").fadeOut(400, "swing");

    if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    let pRegex = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})");
    if (!pRegex.test($("#pass").val())) {
        handleError("Password must be at least 6 characters with one letter and one number");
        return false;
    }

    if ($("#pass").val() != $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    if ($("#oldPass").val() == $("#pass").val()) {
        handleError("Old and new passwords cannot be the same");
        return false;
    }

    sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

    return false;
};

// Creates form to change password through JSX
const AccountWindow = (props) => {
    return (
        <div id="accountForms">
            <h3>Change Password</h3>
            <form id="passwordForm" 
                name="passwordForm"
                onSubmit={handlePasswordChange}
                action="/changePassword"
                method="POST"
                className="passwordForm"
                >
                <input id="oldPass" type="password" name="oldPass" placeholder="Old Password" />
                <input id="pass" type="password" name="pass" placeholder="New Password" />
                <input id="pass2" type="password" name="pass2" placeholder="Retype Password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Change Password" />
            </form>
        </div>
    );
};

// Renders the account page content
const createAccountWindow = (csrf) => {
    ReactDOM.render(
        <AccountWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// Initializes the account page
const setup = (csrf) => {
    $("#errorMessageWrapper").click(function() {
        $("#errorMessageWrapper").fadeOut(400, "swing");
    });

    createAccountWindow(csrf); // default view
};

// Gets the CSRF token for the current user so it can be stored on the page
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});