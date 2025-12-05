document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector(".form-box");
    const tableBody = document.getElementById("income-table");

    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    if (!user || !user.id) return;


    async function loadIncomes() {
        const res = await fetch(`http://localhost:5163/api/finance/incomes/${user.id}`);
        const incomes = await res.json();

        tableBody.innerHTML = incomes.map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleString()}</td>
                <td>${t.description}</td>
                <td>${t.sourceOrCategory}</td>
                <td class="positive">€${t.amount.toFixed(2)}</td>
            </tr>
        `).join("");
    }

    await loadIncomes();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const description = e.target[0].value;
        const amount = parseFloat(e.target[1].value);
        const source = e.target[2].value;

        const dto = {
            userId: user.id,
            amount,
            description,
            sourceOrCategory: source,
            type: "income"
        };

        const response = await fetch("http://localhost:5163/api/finance/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Income added successfully!");
            form.reset();
            loadIncomes();
        } else {
            alert(data.message || "Error adding income");
        }
    });
});
