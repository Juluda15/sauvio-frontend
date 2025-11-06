document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".auth-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const password = form.querySelector('input[type="password"]').value.trim();

        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5163/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.text(); // since your API returns a message string

            if (response.ok) {
                alert(data);
                // redirect user to login
                window.location.href = "login.html";
            } else {
                alert(data || "Registration failed.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error connecting to the server.");
        }
    });
});
