function calculateOBST() {
    const keysInput = document.getElementById("keys").value;
    const probInput = document.getElementById("probabilities").value;

    const keys = keysInput.split(",").map(x => x.trim());
    const p = probInput.split(",").map(Number);

    if (
        keys.length === 0 ||
        keys.length !== p.length ||
        p.some(x => !Number.isFinite(x) || x < 0) ||
        keys.some(x => x === "")
    ) {
        alert("Please enter valid keys and probabilities.");
        return;
    }

    const n = keys.length;
    const cost = Array.from(
        { length: n },
        () => Array(n).fill(0)
    );
    const root = Array.from(
        { length: n },
        () => Array(n).fill(-1)
    );

    for (let i = 0; i < n; i++) {
        cost[i][i] = p[i];
        root[i][i] = i;
    }

    for (let length = 2; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            let sum = 0;

            for (let k = i; k <= j; k++) {
                sum += p[k];
            }

            cost[i][j] = Infinity;

            for (let r = i; r <= j; r++) {
                const left = r > i ? cost[i][r - 1] : 0;
                const right = r < j ? cost[r + 1][j] : 0;
                const current = left + right + sum;

                if (current < cost[i][j]) {
                    cost[i][j] = current;
                    root[i][j] = r;
                }
            }
        }
    }

    document.getElementById("minCost").textContent =
        cost[0][n - 1].toFixed(3);

    document.getElementById("optimalRoot").textContent =
        keys[root[0][n - 1]];
}
