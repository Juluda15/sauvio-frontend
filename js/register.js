document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".auth-form");

    form.onsubmit = async e => {
        e.preventDefault();

        const name = form[0].value.trim();
        const email = form[1].value.trim();
        const password = form[2].value.trim();

        if (!name || !email || !password) {
            showToast("Please fill in all fields", "warning");
            return;
        }

        try {
            const res = await fetch("http://localhost:5163/api/account/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const text = await res.text();

            res.ok
                ? (showToast(text, "success"), window.location.href = "login.html")
                : showToast(text || "Registration failed", "error");
        } catch {
            showToast("Server connection error", "error");
        }
    };
});
