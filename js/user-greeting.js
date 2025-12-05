document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    if (!user || !user.name) return;

    const greetingEl = document.getElementById("user-greeting");
    if (greetingEl) greetingEl.textContent = `Hello, ${user.name}`;

    const avatarEls = document.querySelectorAll("#user-avatar");
    avatarEls.forEach(el => el.textContent = user.name[0].toUpperCase());
});
