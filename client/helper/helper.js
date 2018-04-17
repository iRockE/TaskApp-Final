// Handles displaying error messages
const handleError = (message) => {
    $("#errorMessageWrapper").fadeOut(400, "swing", () => {
        $("#errorMessage").text(message);
        $("#errorMessageWrapper").fadeIn(400, "swing");
    });
};

// Redirects the user to the given location
const redirect = (response) => {
    $("#errorMessageWrapper").fadeOut(400, "swing");
    window.location = response.redirect;
}

// Handles sending json ajax requests
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};