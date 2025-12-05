async function loadDashboard() {
    const res = await fetch("http://localhost:5157/api/finance/balance/1");
    const data = await res.json();

    document.getElementById("balance").textContent = `€${data.balance.toFixed(2)}`;
}

loadDashboard();
