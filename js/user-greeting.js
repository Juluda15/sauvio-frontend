document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    const token = localStorage.getItem("sauvioToken");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    
    const greetingEl = document.getElementById("user-greeting");
    if (greetingEl) greetingEl.textContent = `Hello, ${user.name}`;


    const avatarEls = document.querySelectorAll("#user-avatar, #profile-avatar");
    avatarEls.forEach(el => el.textContent = user.name.charAt(0).toUpperCase());

    const sidebarLinks = document.getElementById("sidebar-links");
    if (sidebarLinks) {
        let html = `
            <li><a href="index.html">🏠 Dashboard</a></li>
            <li><a href="expenses.html">💸 Expenses</a></li>
            <li><a href="incomes.html">💰 Incomes</a></li>
        `;

        if (user.isAdmin) {
            html += `<li><a href="admins-users.html">👥 Users</a></li>`;
        }

        html += `<li><a href="profile.html">👤 Profile</a></li>`;
        sidebarLinks.innerHTML = html;


        sidebarLinks.querySelectorAll("a").forEach(a => {
            if (a.href === window.location.href) a.classList.add("active");
            else a.classList.remove("active");
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
