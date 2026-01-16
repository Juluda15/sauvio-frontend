document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    const token = localStorage.getItem("sauvioToken");

    if (!user || !token) window.location.href = "login.html";

    const tableBody = document.getElementById("income-table");
    const form = document.querySelector(".form-box");

    async function loadIncomes() {
        try {
            const res = await fetch(`http://localhost:5163/api/finance/incomes/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const incomes = await res.json();

            tableBody.innerHTML = incomes.map(t => `
                <tr data-id="${t.id}">
                    <td>${new Date(t.date).toLocaleString()}</td>
                    <td><input value="${t.description}" readonly></td>
                    <td><input value="${t.sourceOrCategory}" readonly></td>
                    <td><input type="number" value="${t.amount}" readonly></td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="update-btn" style="display:none;">Update</button>
                        <button class="delete-btn">Delete</button>
                    </td>
                </tr>
            `).join("");

            attachListeners();
        } catch {
            showToast("Failed to load incomes", "error");
        }
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
                    type: "income",
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
                    ? (showToast("Income updated", "success"), loadIncomes())
                    : showToast("Failed to update income", "error");
            };

            row.querySelector(".delete-btn").onclick = async () => {
                if (!confirm("Delete this income?")) return;
                const res = await fetch(`http://localhost:5163/api/finance/transaction/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });

                res.ok
                    ? (showToast("Income deleted", "success"), loadIncomes())
                    : showToast("Failed to delete income", "error");
            };
        });
    }

    form.onsubmit = async e => {
        e.preventDefault();
        const dto = {
            userId: user.id,
            type: "income",
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
            ? (showToast("Income added", "success"), form.reset(), loadIncomes())
            : showToast("Error adding income", "error");
    };

    await loadIncomes();
});
