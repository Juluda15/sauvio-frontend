document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    const token = localStorage.getItem("sauvioToken");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

  
    const greetingEl = document.getElementById("user-greeting");
    const avatarEl = document.getElementById("user-avatar");

    if (greetingEl) greetingEl.textContent = `Hello, ${user.name}`;
    if (avatarEl) avatarEl.textContent = user.name[0].toUpperCase();

    
    const usersLinkEl = document.getElementById("users-link");
    if (user.isAdmin && usersLinkEl) usersLinkEl.style.display = "block";

  
    const isDashboardPage = !!document.getElementById("user-dashboard");
    const isAdminUsersPage = !!document.getElementById("users-container") && !isDashboardPage;

    if (isDashboardPage) {
        await loadUserDashboard(user.id);
        showDashboard();
    } else if (isAdminUsersPage) {
        if (!user.isAdmin) {
            window.location.href = "index.html"; 
            return;
        }
        await loadUsers();
    }


    const linkDashboard = document.getElementById("link-dashboard");
    const linkUsers = document.getElementById("link-users");

    if (linkDashboard) {
        linkDashboard.addEventListener("click", (e) => {
            e.preventDefault();
            showDashboard();
        });
    }

    if (linkUsers) {
        linkUsers.addEventListener("click", async (e) => {
            e.preventDefault();
            await showUsers();
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

function showDashboard() {
    const userDashboard = document.getElementById("user-dashboard");
    const adminDashboard = document.getElementById("admin-dashboard");

    if (userDashboard) userDashboard.style.display = "block";
    if (adminDashboard) adminDashboard.style.display = "none";

    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    if (pageTitle) pageTitle.textContent = "Dashboard Overview";
    if (pageSubtitle) pageSubtitle.textContent = "Monitor your financial performance in real-time";

    setActiveLink("link-dashboard");
}

async function showUsers() {
    const userDashboard = document.getElementById("user-dashboard");
    const adminDashboard = document.getElementById("admin-dashboard");

    if (userDashboard) userDashboard.style.display = "none";
    if (adminDashboard) adminDashboard.style.display = "block";

    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    if (pageTitle) pageTitle.textContent = "Users Overview";
    if (pageSubtitle) pageSubtitle.textContent = "Manage all users and monitor their balances";

    setActiveLink("link-users");
    await loadUsers();
}

function setActiveLink(activeId) {
    document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
    const link = document.getElementById(activeId);
    if (link) link.classList.add("active");
}

async function loadUserDashboard(userId) {
    const token = localStorage.getItem("sauvioToken");
    const balanceEl = document.getElementById("total-balance");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpenseEl = document.getElementById("total-expense");
    const transactionsTable = document.getElementById("recent-transactions");

    if (!balanceEl || !totalIncomeEl || !totalExpenseEl || !transactionsTable) return;

    try {
        const balanceRes = await fetch(`http://localhost:5163/api/finance/balance/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const balanceData = await balanceRes.json();

        balanceEl.textContent = `€${balanceData.balance.toFixed(2)}`;
        totalIncomeEl.textContent = `€${balanceData.income.toFixed(2)}`;
        totalExpenseEl.textContent = `€${balanceData.expense.toFixed(2)}`;

        const [expensesRes, incomesRes] = await Promise.all([
            fetch(`http://localhost:5163/api/finance/expenses/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:5163/api/finance/incomes/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const expenses = await expensesRes.json();
        const incomes = await incomesRes.json();

        const allTransactions = [...expenses, ...incomes].sort((a,b) => new Date(b.date) - new Date(a.date));

        transactionsTable.innerHTML = allTransactions.map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleString()}</td>
                <td>${t.description}</td>
                <td>${t.sourceOrCategory}</td>
                <td class="${t.type === "income" ? "positive" : "negative"}">€${t.amount.toFixed(2)}</td>
            </tr>
        `).join("");
    } catch (err) {
        console.error("Dashboard error:", err);
        showToast("Failed to load dashboard data.", "error");
    }
}

async function loadUsers() {
    const token = localStorage.getItem("sauvioToken");
    const container = document.getElementById("users-container");
    if (!container) return;

    try {
        const res = await fetch("http://localhost:5163/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const users = await res.json();

        container.innerHTML = users.map(u => `
            <div class="user-card" id="user-${u.id}">
                <h3>${u.name}</h3>
                <p>${u.email}</p>
                <p>Balance: €${u.balance.toFixed(2)}</p>
                <button onclick="toggleUserDetails(${u.id})">View</button>
                <div class="user-details" id="details-${u.id}" style="display:none;"></div>
            </div>
        `).join("");
    } catch (err) {
        showToast("Failed to load users", "error");
        console.error(err);
    }
}

async function toggleUserDetails(userId) {
    const details = document.getElementById(`details-${userId}`);
    if (!details) return;

    if (details.style.display === "block") {
        details.style.display = "none";
        return;
    }

    details.style.display = "block";
    details.innerHTML = "Loading...";

    const token = localStorage.getItem("sauvioToken");

    try {
        const [balanceRes, incomesRes, expensesRes, userRes] = await Promise.all([
            fetch(`http://localhost:5163/api/admin/balance/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:5163/api/admin/incomes/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:5163/api/admin/expenses/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:5163/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const balance = await balanceRes.json();
        let incomes = await incomesRes.json();
        let expenses = await expensesRes.json();
        const user = await userRes.json();

        incomes = incomes.slice(-3);
        expenses = expenses.slice(-3);

        const promoteBtn = user.isAdmin ? '' : `<button onclick="promoteUser(${userId})">Promote to Admin</button>`;

        details.innerHTML = `
            <span><strong>Admin:</strong> ${user.isAdmin ? 'Yes ✅' : 'No ❌'}</span><br>
            <span><strong>Total Balance:</strong> €${balance.balance.toFixed(2)}</span><br>
            <span><strong>Total Income:</strong> €${balance.income.toFixed(2)}</span><br>
            <span><strong>Total Expense:</strong> €${balance.expense.toFixed(2)}</span><br>
            <span><strong>Recent Incomes:</strong> ${incomes.map(i => `€${i.amount} (${i.description})`).join(', ')}</span><br>
            <span><strong>Recent Expenses:</strong> ${expenses.map(e => `€${e.amount} (${e.description})`).join(', ')}</span><br>
            ${promoteBtn}
        `;
    } catch (err) {
        details.innerHTML = "Failed to load details";
        console.error(err);
        showToast("Failed to load user details", "error");
    }
}

async function promoteUser(userId) {
    const token = localStorage.getItem("sauvioToken");

    try {
        const res = await fetch(`http://localhost:5163/api/admin/promote/${userId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            const err = await res.json();
            showToast(err.message, "error");
            return;
        }

        showToast("User promoted to Admin successfully!", "success");
        toggleUserDetails(userId);
    } catch (err) {
        console.error(err);
        showToast("Failed to promote user", "error");
    }
}
