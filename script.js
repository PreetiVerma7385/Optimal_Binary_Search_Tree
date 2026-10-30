function calculateOBST() {
    const keysInput = document.getElementById("keys").value.trim();
    const probInput = document.getElementById("probabilities").value.trim();

    const errorMessage = document.getElementById("errorMessage");
    const minCostElement = document.getElementById("minCost");
    const optimalRootElement = document.getElementById("optimalRoot");
    const treeStructureElement = document.getElementById("treeStructure");

    // Clear previous error message
    errorMessage.textContent = "";

    // Validate empty input
    if (keysInput === "" || probInput === "") {
        errorMessage.textContent = "Please enter keys and probabilities.";
        return;
    }

    // Convert input into arrays
    const keys = keysInput.split(",").map(x => x.trim());
    const p = probInput.split(",").map(Number);

    // Validate input
    if (
        keys.length !== p.length ||
        keys.some(x => x === "") ||
        p.some(x => !Number.isFinite(x) || x < 0) ||
        p.every(x => x === 0)
    ) {
        errorMessage.textContent =
            "Please enter valid keys and probabilities. Use equal numbers of keys and probabilities, with at least one positive probability.";
        return;
    }

    // Check for duplicate keys
    if (new Set(keys).size !== keys.length) {
        errorMessage.textContent = "Please enter unique keys.";
        return;
    }

    const n = keys.length;

    // Check that keys are sorted
    const numericKeys = keys.map(Number);
    const allNumeric = keys.every(x => x !== "" && Number.isFinite(Number(x)));

    if (allNumeric) {
        for (let i = 1; i < n; i++) {
            if (numericKeys[i] <= numericKeys[i - 1]) {
                errorMessage.textContent =
                    "Please enter keys in strictly increasing order.";
                return;
            }
        }
    }

    // Create cost and root tables
    const cost = Array.from(
        { length: n },
        () => Array(n).fill(0)
    );

    const root = Array.from(
        { length: n },
        () => Array(n).fill(-1)
    );

    // Base case: one key
    for (let i = 0; i < n; i++) {
        cost[i][i] = p[i];
        root[i][i] = i;
    }

    // Dynamic Programming
    for (let length = 2; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            let sum = 0;

            // Sum of probabilities
            for (let k = i; k <= j; k++) {
                sum += p[k];
            }

            cost[i][j] = Infinity;

            // Try every key as root
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

    // Display minimum cost
    minCostElement.textContent = cost[0][n - 1].toFixed(3);

    // Display optimal root
    optimalRootElement.textContent = keys[root[0][n - 1]];

    // Build and display tree structure
    function buildTree(i, j, prefix = "", position = "Root") {
        if (i > j) {
            return "";
        }

        const r = root[i][j];
        let result = prefix + position + ": " + keys[r] + "\n";

        if (i < r) {
            result += buildTree(i, r - 1, prefix + "    ", "Left");
        }

        if (r < j) {
            result += buildTree(r + 1, j, prefix + "    ", "Right");
        }

        return result;
    }

    treeStructureElement.textContent = buildTree(0, n - 1);
}
