document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("sauvioUser"));
    if (!user || !user.id) return;


    const balanceEl = document.querySelector(".card:nth-child(1) .amount");
    const totalIncomeEl = document.querySelector(".card:nth-child(2) .amount");
    const totalExpenseEl = document.querySelector(".card:nth-child(3) .amount");
    const transactionsTable = document.getElementById("index-table");

    try {
        const balanceRes = await fetch(`http://localhost:5163/api/finance/balance/${user.id}`);
        const balanceData = await balanceRes.json();

        balanceEl.textContent = `€${balanceData.balance.toFixed(2)}`;
        totalIncomeEl.textContent = `€${balanceData.totalIncome.toFixed(2)}`;
        totalExpenseEl.textContent = `€${balanceData.totalExpense.toFixed(2)}`;

        const expensesRes = await fetch(`http://localhost:5163/api/finance/expenses/${user.id}`);
        const incomesRes = await fetch(`http://localhost:5163/api/finance/incomes/${user.id}`);

        const expenses = await expensesRes.json();
        const incomes = await incomesRes.json();

        const allTransactions = [...expenses, ...incomes].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );


        transactionsTable.innerHTML = allTransactions.map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleString()}</td>
                <td>${t.description}</td>
                <td>${t.sourceOrCategory}</td>
                <td class="${t.type === 'income' ? 'positive' : 'negative'}">€${t.amount.toFixed(2)}</td>
            </tr>
        `).join("");

    } catch (err) {
        console.error("Error loading dashboard:", err);
    }
});
