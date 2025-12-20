/* tables.js — FIXED async execution */

function initTables() {

  const TABLES = {
    raags: {
      tableId: "raags-table",
      headerRow: "raags-header-row",
      body: "raags-body",
      toggles: "raags-column-toggles",
      storageKey: "raags_visible_cols"
    },
    thaats: {
      tableId: "thaats-table",
      headerRow: "thaats-header-row",
      body: "thaats-body",
      toggles: "thaats-column-toggles",
      storageKey: "thaats_visible_cols"
    }
  };

  function renderTable(cfg, rows) {
    const headerRow = document.getElementById(cfg.headerRow);
    const tbody = document.getElementById(cfg.body);

    headerRow.innerHTML = "";
    tbody.innerHTML = "";

    if (!rows || rows.length === 0) {
      tbody.innerHTML =
        `<tr><td colspan="100%" class="loading">No data</td></tr>`;
      return;
    }

    const columns = Object.keys(rows[0]);

    const visible = Utils.loadState(
      cfg.storageKey,
      Object.fromEntries(columns.map(c => [c, true]))
    );

    /* Column toggles */
    const toggleBox = document.getElementById(cfg.toggles);
    toggleBox.innerHTML = "";

    columns.forEach(col => {
      const label = document.createElement("label");
      label.innerHTML =
        `<input type="checkbox" ${visible[col] ? "checked" : ""}> ${col}`;

      label.querySelector("input").addEventListener("change", e => {
        visible[col] = e.target.checked;
        Utils.saveState(cfg.storageKey, visible);
        renderTable(cfg, rows);
      });

      toggleBox.appendChild(label);
    });

    /* Headers */
    let sortCol = null;
    let sortAsc = true;

    columns.forEach(col => {
      const th = document.createElement("th");
      if (!visible[col]) th.classList.add("hidden-column");

      const btn = document.createElement("button");
      btn.textContent = col;

      btn.onclick = () => {
        if (sortCol === col) sortAsc = !sortAsc;
        else {
          sortCol = col;
          sortAsc = true;
        }

        rows.sort((a, b) => {
          const va = Array.isArray(a[col])
            ? SvaraMap.svaraArrayToString(a[col])
            : a[col];
          const vb = Array.isArray(b[col])
            ? SvaraMap.svaraArrayToString(b[col])
            : b[col];
          return Utils.sortValues(va, vb, sortAsc);
        });

        renderTable(cfg, rows);
      };

      th.appendChild(btn);
      headerRow.appendChild(th);
    });

    /* Rows */
    rows.forEach(r => {
      const tr = document.createElement("tr");

      columns.forEach(col => {
        const td = document.createElement("td");
        if (!visible[col]) td.classList.add("hidden-column");

        if (Array.isArray(r[col])) {
          td.textContent = SvaraMap.svaraArrayToString(r[col]);
          td.classList.add("svara");
        } else {
          td.textContent = r[col] ?? "";
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  /* Load data safely */
  DB.fetchRaags()
    .then(data => renderTable(TABLES.raags, data))
    .catch(err => {
      console.error("Raags load error:", err);
      document.getElementById("raags-body").innerHTML =
        `<tr><td colspan="100%" class="loading">Error loading raags</td></tr>`;
    });

  DB.fetchThaats()
    .then(data => renderTable(TABLES.thaats, data))
    .catch(err => {
      console.error("Thaats load error:", err);
      document.getElementById("thaats-body").innerHTML =
        `<tr><td colspan="100%" class="loading">Error loading thaats</td></tr>`;
    });
}

/* Run after DOM is fully ready */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTables);
} else {
  initTables();
}