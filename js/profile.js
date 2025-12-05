document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    if (!user || !user.id) {
        alert("User not logged in!");
        window.location.href = "login.html";
        return;
    }

    // Update greeting and avatar
    const greetingEl = document.getElementById("user-greeting");
    greetingEl.textContent = `Hello, ${user.name}`;

    const avatarEls = document.querySelectorAll("#user-avatar, #profile-avatar");
    avatarEls.forEach(el => el.textContent = user.name[0].toUpperCase());

    // Update profile card info
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-email").textContent = user.email;

    // Optionally, format member since date if stored
    const memberSince = user.memberSince ? new Date(user.memberSince).toLocaleDateString() : "-";
    document.getElementById("profile-member").textContent = memberSince;

    // Handle password change
    const passwordForm = document.getElementById("password-form");
    passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById("new-password").value;
        if (!newPassword) return;

        try {
            const res = await fetch("http://localhost:5163/api/account/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    newPassword: newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Password updated successfully!");
                passwordForm.reset();
            } else {
                alert(data.message || "Failed to change password.");
            }
        } catch (err) {
            console.error("Error changing password:", err);
            alert("Error updating password.");
        }
    });
});
