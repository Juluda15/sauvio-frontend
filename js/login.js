document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".auth-form");

    const authMessage = sessionStorage.getItem("authMessage");
    if (authMessage) {
        showToast(authMessage, "warning");
        sessionStorage.removeItem("authMessage");
    }

    form.onsubmit = async e => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value.trim();
        const password = form.querySelector('input[type="password"]').value.trim();

        if (!email || !password) {
            showToast("Please fill in both fields", "warning");
            return;
        }

        try {
            const res = await fetch("http://localhost:5163/api/account/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("sauvioToken", data.token);
                localStorage.setItem("sauvioUser", JSON.stringify(data.user));
                showToast("Login successful", "success");
                window.location.href = "index.html";
            } else {
                showToast(data.message || "Invalid credentials", "error");
            }
        } catch {
            showToast("Server connection error", "error");
        }
    };
});
