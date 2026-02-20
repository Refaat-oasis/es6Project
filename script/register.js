let form = document.getElementById("registerForm");
let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let passwordConfirmation = document.getElementById("passwordConfirmation");

let nameError = document.getElementById("nameError");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let passwordConfirmationError = document.getElementById("passwordConfirmationError");

form.addEventListener("submit", (e) => {
    let success = true;

    nameError.innerText = "";
    emailError.innerText = "";
    passwordError.innerText = "";
    passwordConfirmationError.innerText = "";

    if (name.value.trim() === "") {
        nameError.innerText = "Name is required";
        success = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
        emailError.innerText = "Email is required";
        success = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.innerText = "Invalid email format";
        success = false;
    }

    if (password.value === "") {
        passwordError.innerText = "Password is required";
        success = false;
    } else if (password.value.length < 6) {
        passwordError.innerText = "Password must be at least 6 characters";
        success = false;
    }

    if (passwordConfirmation.value === "") {
        passwordConfirmationError.innerText = "Password confirmation is required";
        success = false;
    } else if (password.value !== passwordConfirmation.value) {
        passwordConfirmationError.innerText = "Passwords do not match";
        success = false;
    }

    if (!success) {
        e.preventDefault();
    } else {
        console.log("Validation successful, submitting form...");
    }
});



