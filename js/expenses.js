document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector(".form-box");
    const tableBody = document.getElementById("expense-table");

    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    if (!user || !user.id) return;


    async function loadExpenses() {
        const res = await fetch(`http://localhost:5163/api/finance/expenses/${user.id}`);
        const expenses = await res.json();

        tableBody.innerHTML = expenses.map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleString()}</td>
                <td>${t.description}</td>
                <td>${t.sourceOrCategory}</td>
                <td class="negative">€${t.amount.toFixed(2)}</td>
            </tr>
        `).join("");
    }

    await loadExpenses();

   
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const description = e.target[0].value;
        const amount = parseFloat(e.target[1].value);
        const category = e.target[2].value;

        const dto = {
            userId: user.id,
            amount,
            description,
            sourceOrCategory: category,
            type: "expense"
        };

        const response = await fetch("http://localhost:5163/api/finance/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Expense added successfully!");
            form.reset();
            loadExpenses(); 
        } else {
            alert(data.message || "Error adding expense");
        }
    });
});
