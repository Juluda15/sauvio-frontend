document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".auth-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value.trim();
        const password = form.querySelector('input[type="password"]').value.trim();

        if (!email || !password) {
            alert("Please fill in both fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5163/api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                console.log("User:", data);
                // Example: store user info or token
                localStorage.setItem("sauvioUser", JSON.stringify(data));

                // redirect to dashboard
                window.location.href = "dashboard.html";
            } else {
                alert(data || "Invalid credentials or unconfirmed account.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error connecting to the server.");
        }
    });
});
