document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    const token = localStorage.getItem("sauvioToken");

    if (!user || !token) {
        sessionStorage.setItem("authMessage", "Please log in before accessing the website.");
        window.location.href = "login.html";
        return;
    }
});
