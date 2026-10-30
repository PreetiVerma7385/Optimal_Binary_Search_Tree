function calculateOBST() {
const keys = document.getElementById("keys").value
.split(",").map(x => x.trim());

const probabilities = document.getElementById("probabilities").value
    .split(",").map(Number);

const n = keys.length;

if (n === 0 || keys.some(k => k === "") ||
    probabilities.length !== n ||
    probabilities.some(p => !Number.isFinite(p) || p < 0) ||
    new Set(keys).size !== n) {
    alert("Please enter unique keys and valid probabilities.");
    return;
}

// Check whether keys are in ascending order.
const sorted = [...keys].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
);

if (keys.some((key, i) => key !== sorted[i])) {
    alert("Please enter keys in ascending order.");
    return;
}

const total = probabilities.reduce((sum, p) => sum + p, 0);

if (total <= 0) {
    alert("The sum of probabilities must be greater than zero.");
    return;
}

// Normalize probabilities.
const p = probabilities.map(x => x / total);

const cost = Array.from({ length: n }, () => Array(n).fill(0));
const root = Array.from({ length: n }, () => Array(n).fill(-1));
const prefix = [0];

for (let i = 0; i < n; i++) {
    prefix.push(prefix[i] + p[i]);
    cost[i][i] = p[i];
    root[i][i] = i;
}

// Dynamic Programming.
for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
        const j = i + length - 1;
        const sum = prefix[j + 1] - prefix[i];

        let best = Infinity;

        for (let r = i; r <= j; r++) {
            const left = r > i ? cost[i][r - 1] : 0;
            const right = r < j ? cost[r + 1][j] : 0;
            const current = left + right + sum;

            if (current < best) {
                best = current;
                root[i][j] = r;
            }
        }

        cost[i][j] = best;
    }
}

document.getElementById("cost").textContent =
    "Minimum Expected Search Cost: " + cost[0][n - 1].toFixed(3);

document.getElementById("root").textContent =
    "Optimal Root: " + keys[root[0][n - 1]];

document.getElementById("tree").innerHTML =
    "<h3>Optimal Tree</h3>" +
    buildTree(0, n - 1, root, keys);

displayTable(cost, n);

}

function buildTree(i, j, root, keys) {
if (i > j) return "";

const r = root[i][j];

return `
    <div style="margin:10px; padding:10px; border:1px solid #176b87;
                border-radius:8px; display:inline-block;">
        <b>${escapeHTML(keys[r])}</b>
        <div style="display:flex; justify-content:center; gap:20px;">
            <div>
                <small>Left</small>
                ${buildTree(i, r - 1, root, keys)}
            </div>
            <div>
                <small>Right</small>
                ${buildTree(r + 1, j, root, keys)}
            </div>
        </div>
    </div>
`;

}

function escapeHTML(value) {
return String(value).replace(/[&<>"']/g, c => ({
"&": "&",
"<": "<",
">": ">",
'"': """,
"'": "'"
})[c]);
}

function displayTable(cost, n) {
let html = "<table border='1' cellpadding='8'><tr><th>i / j</th>";

for (let j = 0; j < n; j++) {
    html += "<th>" + (j + 1) + "</th>";
}

html += "</tr>";

for (let i = 0; i < n; i++) {
    html += "<tr><th>" + (i + 1) + "</th>";

    for (let j = 0; j < n; j++) {
        html += "<td>" +
            (i <= j ? cost[i][j].toFixed(3) : "-") +
            "</td>";
    }

    html += "</tr>";
}

html += "</table>";
document.getElementById("tree").innerHTML +=
    "<h3>Dynamic Programming Cost Table</h3>" + html;

}

// Run the example automatically when the page loads.
calculateOBST();
