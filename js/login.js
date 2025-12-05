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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            let data;

            try {
                data = await response.json();
            } catch {
                data = await response.text();
            }

            if (response.ok) {
                alert("Login successful!");
                console.log("User:", data);

                localStorage.setItem("sauvioUser", JSON.stringify(data));

                window.location.href = "index.html";
            } else {
                alert(data.error || data || "Invalid credentials or unconfirmed account.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error connecting to the server.");
        }
    });
});
