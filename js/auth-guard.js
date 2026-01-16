document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    const token = localStorage.getItem("sauvioToken");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    const isAdminPage = window.location.pathname.includes("admin");
    const isUserDashboard = window.location.pathname.endsWith("index.html");

    if (user.isAdmin && isUserDashboard) {
        window.location.href = "admin-dashboard.html";
    }

    if (!user.isAdmin && isAdminPage) {
        window.location.href = "index.html";
    }
});
