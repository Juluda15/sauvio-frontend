document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    const token = localStorage.getItem("sauvioToken");

    if (!user || !token) window.location.href = "login.html";

    const tableBody = document.getElementById("expense-table");
    const form = document.querySelector(".form-box");

    if (user.isAdmin) {
        const sidebar = document.querySelector(".sidebar .nav");
        const li = document.createElement("li");
        li.innerHTML = `<a href="admin-users.html">👥 Users</a>`;
        sidebar.appendChild(li);
    }

    async function loadExpenses() {
        const res = await fetch(`http://localhost:5163/api/finance/expenses/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const expenses = await res.json();

        tableBody.innerHTML = expenses.map(t => `
            <tr data-id="${t.id}">
                <td>${new Date(t.date).toLocaleString()}</td>
                <td><input class="desc-input" value="${t.description}" readonly></td>
                <td><input class="source-input" value="${t.sourceOrCategory}" readonly></td>
                <td><input class="amount-input" type="number" value="${t.amount}" readonly></td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="update-btn" style="display:none;">Update</button>
                    <button class="delete-btn">Delete</button>
                </td>
            </tr>
        `).join("");

        attachListeners();
    }

    function attachListeners() {
        tableBody.querySelectorAll("tr").forEach(row => {
            const id = row.dataset.id;

            row.querySelector(".edit-btn").onclick = () => {
                row.querySelectorAll("input").forEach(i => i.removeAttribute("readonly"));
                row.querySelector(".edit-btn").style.display = "none";
                row.querySelector(".update-btn").style.display = "inline-block";
            };

            row.querySelector(".update-btn").onclick = async () => {
                const inputs = row.querySelectorAll("input");
                const dto = {
                    id: +id,
                    userId: user.id,
                    type: "expense",
                    description: inputs[0].value,
                    sourceOrCategory: inputs[1].value,
                    amount: +inputs[2].value
                };

                const res = await fetch(`http://localhost:5163/api/finance/transaction/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(dto)
                });

                res.ok
                    ? (showToast("Expense updated", "success"), loadExpenses())
                    : showToast("Failed to update expense", "error");
            };

            row.querySelector(".delete-btn").onclick = async () => {
                if (!confirm("Are you sure?")) return;
                const res = await fetch(`http://localhost:5163/api/finance/transaction/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });

                res.ok
                    ? (showToast("Expense deleted", "success"), loadExpenses())
                    : showToast("Failed to delete expense", "error");
            };
        });
    }

    form.onsubmit = async e => {
        e.preventDefault();
        const dto = {
            userId: user.id,
            type: "expense",
            description: form[0].value,
            amount: +form[1].value,
            sourceOrCategory: form[2].value
        };

        const res = await fetch("http://localhost:5163/api/finance/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(dto)
        });

        res.ok
            ? (showToast("Expense added", "success"), form.reset(), loadExpenses())
            : showToast("Error adding expense", "error");
    };

    await loadExpenses();
});
