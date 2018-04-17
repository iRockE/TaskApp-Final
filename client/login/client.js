// Handles sending request to log user in
const handleLogin = (e) => {
    e.preventDefault();

    $("#errorMessageWrapper").fadeOut(400, "swing");

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("Username or password is empty");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// Handles sending request to create new user
const handleSignup = (e) => {
    e.preventDefault();

    $("#errorMessageWrapper").fadeOut(400, "swing");

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
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

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

// Create login form through JSX
const LoginWindow = (props) => {
    return (
        <form id="loginForm" 
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
            >
            <input id="user" type="text" name="username" placeholder="Username" />
            <input id="pass" type="password" name="pass" placeholder="Password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign In" />

        </form>
    );
};

// Create sign up form through JSX
const SignupWindow = (props) => {
    return (
        <form id="signupForm" 
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
            >
            <input id="user" type="text" name="username" placeholder="Username" />
            <input id="pass" type="password" name="pass" placeholder="Password" />
            <input id="pass2" type="password" name="pass2" placeholder="Retype Password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    );
};

// Renders login form
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// Renders sign up form
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// Intializes the login page.
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    $("#errorMessageWrapper").click(function() {
        $("#errorMessageWrapper").fadeOut(400, "swing");
    });

    createLoginWindow(csrf); // default view
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