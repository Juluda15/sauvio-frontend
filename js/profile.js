document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    const token = localStorage.getItem("sauvioToken");

 
    if (!user || !token) {
        sessionStorage.setItem("authMessage", "Please log in before accessing the website.");
        window.location.href = "login.html";
        return;
    }

 
    const sidebarLinks = document.getElementById("sidebar-links");
    if (sidebarLinks) {
        let html = `
            <li><a href="index.html">🏠 Dashboard</a></li>
            <li><a href="expenses.html">💸 Expenses</a></li>
            <li><a href="incomes.html">💰 Incomes</a></li>
        `;

        if (user.isAdmin) {
            html += `<li><a href="index.html?admin=users">👥 Users</a></li>`;
        }

        html += `<li><a href="profile.html" class="active">👤 Profile</a></li>`;
        sidebarLinks.innerHTML = html;

  
        const links = sidebarLinks.querySelectorAll("a");
        links.forEach(link => {
            if (link.href === window.location.href) link.classList.add("active");
            else link.classList.remove("active");
        });
    }

  
    const greetingEl = document.getElementById("user-greeting");
    if (greetingEl) greetingEl.textContent = `Hello, ${user.name}`;

  
    const avatarEls = document.querySelectorAll("#user-avatar, #profile-avatar");
    avatarEls.forEach(el => {
        if (el && user.name) el.textContent = user.name.charAt(0).toUpperCase();
    });

    const nameEl = document.getElementById("profile-name");
    const emailEl = document.getElementById("profile-email");
    const memberEl = document.getElementById("profile-member");

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (memberEl) memberEl.textContent = user.memberSince
        ? new Date(user.memberSince).toLocaleDateString()
        : "-";

    const passwordForm = document.getElementById("password-form");
    if (passwordForm) {
        passwordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById("new-password").value.trim();
            if (!newPassword) {
                showToast("Password cannot be empty.", "error");
                return;
            }

            try {
                const res = await fetch("http://localhost:5163/api/account/change-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        newPassword
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    showToast("Password updated successfully!", "success");
                    passwordForm.reset();
                } else {
                    showToast(data.message || "Failed to change password.", "error");
                }
            } catch (err) {
                console.error("Error changing password:", err);
                showToast("Error updating password.", "error");
            }
        });
    }


    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("sauvioUser");
            localStorage.removeItem("sauvioToken");
            window.location.href = "login.html";
        });
    }
});
