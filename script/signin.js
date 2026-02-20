const form = document.getElementById("signinForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let success = true;

    // Reset errors
    emailError.innerText = "";
    passwordError.innerText = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === "") {
        emailError.innerText = "Email is required";
        success = false;
    }

    if (password === "") {
        passwordError.innerText = "Password is required";
        success = false;
    }

    if (!success) return;

    try {
        const response = await fetch('./../data/users.json');
        const users = await response.json();

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            console.log("Login successful!");
            window.location.href = "home.html";
        } else {
            emailError.innerText = "Invalid email or password";
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        emailError.innerText = "An error occurred during login. Please try again.";
    }
});
