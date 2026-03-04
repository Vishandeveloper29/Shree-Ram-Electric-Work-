// ============================
// CONFIG & STORAGE
// ============================
const LS_MOTORS = "srew_motors";
const LS_PASS = "srew_password";
const LS_SESSION = "srew_session";
const LS_LAST_BCK = "srew_last_backup";
const LS_LAST_SYNC = "srew_last_sync";
const LS_REMINDER = "srew_reminder";
const LS_BCK_HIST = "srew_backup_history";
const CLOUD_KEY = "srew_cloud_motors";

const DEFAULT_PASS_HASH = hashStr("Admin@123");
const DEFAULT_USER = "Shree Ram Electric Works";

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h.toString(36);
}
function getPass() {
  return localStorage.getItem(LS_PASS) || DEFAULT_PASS_HASH;
}
function getMotors() {
  const r = localStorage.getItem(LS_MOTORS);
  return r ? JSON.parse(r) : getSampleData();
}
function saveMotors(arr) {
  localStorage.setItem(LS_MOTORS, JSON.stringify(arr));
  updateSyncBadge("dirty");
}

// ============================
// SAMPLE DATA
// ============================
function getSampleData() {
  const data = [
    {
      id: 1,
      brand: "Crompton",
      manufacturer: "Crompton Greaves Ltd",
      motorType: "AC",
      phase: "Single",
      ratedVoltage: "230V",
      ratedCurrent: "8.5A",
      ratedFrequency: "50Hz",
      ratedRPM: 1440,
      ratedPowerHP: 1.5,
      ratedPowerKW: "1.1186",
      insulationClass: "B",
      efficiency: "82%",
      frameSize: "D90S",
      runningCurrent: "8.2A",
      statorSlots: 36,
      slotLength: "42mm",
      totalCoilTurns: 720,
      turnsPerCoil: 90,
      coilPitch: "1-8",
      windingConnection: "",
      coilWireType: "Copper",
      wireGauge: "22 SWG",
      coilWeight: "1.15",
      pitchTurns: [{ pitch: "1-8", turns: "90" }],
      startingCoilTurns: 480,
      runningCoilTurns: 240,
      startingCoilWeight: "0.42",
      runningCoilWeight: "0.73",
      capacitorValue: "25µF / 4µF",
      lineVoltage: "",
      phaseVoltage: "",
      lineCurrent: "",
      phaseCurrent: "",
      starDeltaConn: "",
      shaftDiameter: "24mm",
      shaftLength: "55mm",
      bearingFront: "6305",
      bearingRear: "6203",
      fanSize: "160mm",
      fanCoverSize: "180mm",
      motorWeight: "11.5",
      bodyMaterial: "Cast Iron",
      oldCoilWeight: "1.0",
      newCoilWeight: "1.15",
      notes: "Motor rewound after burnout.",
      added: Date.now() - 86400000 * 10,
    },
    {
      id: 2,
      brand: "Kirloskar",
      manufacturer: "Kirloskar Electric Co.",
      motorType: "AC",
      phase: "Three",
      ratedVoltage: "415V",
      ratedCurrent: "7.8A",
      ratedFrequency: "50Hz",
      ratedRPM: 1450,
      ratedPowerHP: 3,
      ratedPowerKW: "2.2371",
      insulationClass: "F",
      efficiency: "87%",
      frameSize: "D100L",
      runningCurrent: "7.5A",
      statorSlots: 36,
      slotLength: "55mm",
      totalCoilTurns: 576,
      turnsPerCoil: 72,
      coilPitch: "1-9",
      windingConnection: "Star",
      coilWireType: "Copper",
      wireGauge: "20 SWG",
      coilWeight: "2.8",
      pitchTurns: [{ pitch: "1-9", turns: "72" }],
      startingCoilTurns: 0,
      runningCoilTurns: 0,
      startingCoilWeight: "",
      runningCoilWeight: "",
      capacitorValue: "",
      lineVoltage: "415V",
      phaseVoltage: "240V",
      lineCurrent: "7.8A",
      phaseCurrent: "4.5A",
      starDeltaConn: "Star",
      shaftDiameter: "28mm",
      shaftLength: "60mm",
      bearingFront: "6206",
      bearingRear: "6204",
      fanSize: "200mm",
      fanCoverSize: "220mm",
      motorWeight: "18.5",
      bodyMaterial: "Cast Iron",
      oldCoilWeight: "2.5",
      newCoilWeight: "2.8",
      notes: "Rewound after flood damage.",
      added: Date.now() - 86400000 * 5,
    },
  ];
  localStorage.setItem(LS_MOTORS, JSON.stringify(data));
  return data;
}

// ============================
// CLOUD SYNC (Artifact Storage)
// ============================
async function syncToCloud() {
  showToast("☁️ Syncing to cloud...", "info");
  try {
    const motors = getMotors();
    const payload = JSON.stringify({
      motors,
      syncedAt: new Date().toISOString(),
      count: motors.length,
    });
    const result = await window.storage.set(CLOUD_KEY, payload, false);
    if (!result) throw new Error("Storage failed");
    const now = new Date().toISOString();
    localStorage.setItem(LS_LAST_SYNC, now);
    updateSyncBadge("ok");
    addBackupHistory("☁️ Cloud Sync", motors.length);
    renderBackupPage();
    showToast(`✅ Synced ${motors.length} records to cloud`);
  } catch (e) {
    showToast("❌ Cloud sync failed: " + e.message, "err");
    updateSyncBadge("err");
  }
}

async function syncFromCloud() {
  showToast("⬇️ Pulling from cloud...", "info");
  try {
    const result = await window.storage.get(CLOUD_KEY, false);
    if (!result) {
      showToast("⚠️ No cloud data found", "warn");
      return;
    }
    const data = JSON.parse(result.value);
    if (!data.motors || !Array.isArray(data.motors))
      throw new Error("Invalid cloud data");
    if (
      !confirm(
        `Pull ${data.motors.length} records from cloud? (synced ${new Date(data.syncedAt).toLocaleString()})\n\nThis will REPLACE your current local data.`,
      )
    )
      return;
    // Auto-backup before replace
    dl(
      "srew_before_pull_backup.json",
      "application/json",
      JSON.stringify(getMotors(), null, 2),
    );
    localStorage.setItem(LS_MOTORS, JSON.stringify(data.motors));
    localStorage.setItem(LS_LAST_SYNC, new Date().toISOString());
    updateSyncBadge("ok");
    refreshAll();
    showToast(`✅ Pulled ${data.motors.length} records from cloud`);
  } catch (e) {
    showToast("❌ Pull failed: " + e.message, "err");
  }
}

async function checkSyncStatus() {
  try {
    const result = await window.storage.get(CLOUD_KEY, false);
    const local = getMotors();
    if (!result) {
      document.getElementById("syncStatusText").textContent =
        "⚠️ No cloud backup";
      document.getElementById("syncStatusText").style.color = "var(--yellow)";
      document.getElementById("cloudRecordCount").textContent = "0";
      showToast("⚠️ No cloud backup found", "warn");
      return;
    }
    const cloud = JSON.parse(result.value);
    const inSync = cloud.count === local.length;
    document.getElementById("cloudRecordCount").textContent = cloud.count;
    document.getElementById("localRecordCount").textContent = local.length;
    document.getElementById("lastSyncTime").textContent = cloud.syncedAt
      ? new Date(cloud.syncedAt).toLocaleString()
      : "—";
    document.getElementById("syncStatusText").textContent = inSync
      ? "✅ In Sync"
      : "⚠️ Out of Sync";
    document.getElementById("syncStatusText").style.color = inSync
      ? "var(--green)"
      : "var(--yellow)";
    showToast(
      inSync
        ? "✅ Local and cloud are in sync"
        : `⚠️ Cloud: ${cloud.count}, Local: ${local.length}`,
      inSync ? "ok" : "warn",
    );
  } catch (e) {
    showToast("❌ Status check failed", "err");
  }
}

function updateSyncBadge(state) {
  const b = document.getElementById("syncStatusBadge");
  if (!b) return;
  if (state === "ok") {
    b.className = "sync-badge sync-ok";
    b.textContent = "☁️ Synced";
  }
  if (state === "dirty") {
    b.className = "sync-badge sync-dirty";
    b.textContent = "✏️ Unsynced";
  }
  if (state === "err") {
    b.className = "sync-badge sync-err";
    b.textContent = "❌ Sync Error";
  }
  if (state === "info") {
    b.className = "sync-badge sync-info";
    b.textContent = "⏳ Syncing...";
  }
}

// ============================
// LOCAL BACKUP
// ============================
function quickBackup() {
  const motors = getMotors();
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16);
  dl(
    `srew_backup_${ts}.json`,
    "application/json",
    JSON.stringify(motors, null, 2),
  );
  localStorage.setItem(LS_LAST_BCK, new Date().toISOString());
  addBackupHistory("💾 Local Download", motors.length);
  renderBackupPage();
  showToast(`💾 Backup downloaded — ${motors.length} records`);
}

function addBackupHistory(type, count) {
  const hist = JSON.parse(localStorage.getItem(LS_BCK_HIST) || "[]");
  hist.unshift({ type, count, time: new Date().toISOString() });
  localStorage.setItem(LS_BCK_HIST, JSON.stringify(hist.slice(0, 20)));
}

function renderBackupPage() {
  const motors = getMotors();
  const lastBck = localStorage.getItem(LS_LAST_BCK);
  const lastSync = localStorage.getItem(LS_LAST_SYNC);
  const reminder = JSON.parse(localStorage.getItem(LS_REMINDER) || "{}");

  const el = (id, val) => {
    const e = document.getElementById(id);
    if (e) e.textContent = val;
  };
  el("lastBackupTime", lastBck ? new Date(lastBck).toLocaleString() : "Never");
  el("backupRecordCount", motors.length + " records");
  el("lastSyncTime", lastSync ? new Date(lastSync).toLocaleString() : "Never");
  el("cloudRecordCount", "—");
  el("localRecordCount", motors.length);

  const rtog = document.getElementById("reminderToggle");
  const rtime = document.getElementById("reminderTime");
  if (rtog) rtog.checked = !!reminder.enabled;
  if (rtime) rtime.value = reminder.time || "09:00";
  updateReminderStatus();

  // Backup history
  const hist = JSON.parse(localStorage.getItem(LS_BCK_HIST) || "[]");
  const hEl = document.getElementById("backupHistory");
  if (hEl) {
    if (!hist.length) {
      hEl.innerHTML =
        '<p style="color:var(--muted);font-size:.88rem">No backup history yet.</p>';
    } else {
      hEl.innerHTML = hist
        .map(
          (h) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:.88rem">${h.type}</span>
          <span style="font-size:.78rem;color:var(--muted)">${h.count} records</span>
          <span style="font-size:.78rem;color:var(--muted)">${new Date(h.time).toLocaleString()}</span>
        </div>`,
        )
        .join("");
    }
  }
}

// ============================
// DAILY BACKUP REMINDER
// ============================
function toggleReminder(enabled) {
  saveReminderSettings();
}
function saveReminderSettings() {
  const enabled = document.getElementById("reminderToggle")?.checked;
  const time = document.getElementById("reminderTime")?.value || "09:00";
  localStorage.setItem(LS_REMINDER, JSON.stringify({ enabled, time }));
  updateReminderStatus();
  showToast(
    enabled ? `⏰ Reminder set for ${time} daily` : "⏰ Reminder disabled",
  );
}
function updateReminderStatus() {
  const r = JSON.parse(localStorage.getItem(LS_REMINDER) || "{}");
  const el = document.getElementById("reminderStatus");
  if (el)
    el.textContent = r.enabled
      ? `⏰ Reminder active at ${r.time} daily`
      : "Reminder is off";
}
function checkBackupReminder() {
  const r = JSON.parse(localStorage.getItem(LS_REMINDER) || "{}");
  if (!r.enabled) return;
  const lastBck = localStorage.getItem(LS_LAST_BCK);
  if (!lastBck) {
    document.getElementById("backupBanner").style.display = "flex";
    return;
  }
  const last = new Date(lastBck);
  const now = new Date();
  const sameDay = last.toDateString() === now.toDateString();
  if (!sameDay) document.getElementById("backupBanner").style.display = "flex";
}
function hideBanner() {
  document.getElementById("backupBanner").style.display = "none";
}

// ============================
// DATA HEALTH CHECK
// ============================
function runHealthCheck() {
  const motors = getMotors();
  const issues = [];
  const warnings = [];
  motors.forEach((m, i) => {
    if (!m.brand) issues.push(`Record #${i + 1}: Missing Brand`);
    if (!m.motorType) issues.push(`Record #${i + 1}: Missing Motor Type`);
    if (!m.phase) issues.push(`Record #${i + 1}: Missing Phase`);
    if (!m.ratedPowerHP)
      warnings.push(`Record #${i + 1} (${m.brand || "?"}): Missing HP`);
    if (!m.wireGauge)
      warnings.push(`Record #${i + 1} (${m.brand || "?"}): Missing Wire Gauge`);
  });
  const el = document.getElementById("healthResult");
  if (!el) return;
  let html = `<div style="margin-bottom:8px;font-size:.88rem"><strong>${motors.length}</strong> total records checked</div>`;
  if (!issues.length && !warnings.length) {
    html += `<div style="color:var(--green);font-weight:700;font-size:.95rem">✅ All records look healthy!</div>`;
  } else {
    if (issues.length)
      html += `<div style="color:var(--red);font-size:.82rem;margin-bottom:6px"><strong>❌ ${issues.length} critical issues:</strong><br>${issues.map((i) => `• ${i}`).join("<br>")}</div>`;
    if (warnings.length)
      html += `<div style="color:var(--yellow);font-size:.82rem"><strong>⚠️ ${warnings.length} warnings:</strong><br>${warnings.map((w) => `• ${w}`).join("<br>")}</div>`;
  }
  el.innerHTML = html;
  showToast(
    `Health check: ${issues.length} issues, ${warnings.length} warnings`,
    issues.length ? "err" : warnings.length ? "warn" : "ok",
  );
}

// ============================
// LOGIN
// ============================
document.getElementById("loginPass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});
document.getElementById("loginUser").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});

function doLogin() {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value.trim();
  if (u === DEFAULT_USER && hashStr(p) === getPass()) {
    sessionStorage.setItem(LS_SESSION, "1");
    document.getElementById("loginOverlay").style.display = "none";
    document.getElementById("appWrap").style.display = "flex";
    refreshAll();
    setTimeout(checkBackupReminder, 1500);
  } else {
    document.getElementById("loginErr").style.display = "block";
  }
}
function logout() {
  sessionStorage.removeItem(LS_SESSION);
  location.reload();
}

if (sessionStorage.getItem(LS_SESSION) === "1") {
  document.getElementById("loginOverlay").style.display = "none";
  document.getElementById("appWrap").style.display = "flex";
  refreshAll();
  setTimeout(checkBackupReminder, 1500);
}

// ============================
// NAVIGATION
// ============================
function showPage(id, el) {
  document
    .querySelectorAll(".page-content")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
  if (el) el.classList.add("active");
  if (id === "dashboard") renderDashboard();
  if (id === "motors") filterMotors();
  if (id === "backup") renderBackupPage();
}

function refreshAll() {
  renderDashboard();
  filterMotors();
}

// ============================
// DASHBOARD
// ============================
function renderDashboard() {
  const motors = getMotors();
  const total = motors.length;
  const ac = motors.filter((m) => m.motorType === "AC").length;
  const dc = motors.filter((m) => m.motorType === "DC").length;
  const single = motors.filter((m) => m.phase === "Single").length;
  const three = motors.filter((m) => m.phase === "Three").length;
  const rewound = motors.filter((m) => m.newCoilWeight).length;
  const avgHP = total
    ? motors.reduce((s, m) => s + parseFloat(m.ratedPowerHP || 0), 0) / total
    : 0;
  const avgRPM = total
    ? motors.reduce((s, m) => s + parseFloat(m.ratedRPM || 0), 0) / total
    : 0;
  const totalCu = motors.reduce((s, m) => s + parseFloat(m.coilWeight || 0), 0);

  document.getElementById("statsGrid").innerHTML = `
    <div class="stat-card c1"><div class="sc-icon">⚡</div><div class="sc-num">${total}</div><div class="sc-label">Total Motors</div></div>
    <div class="stat-card c2"><div class="sc-icon">🔵</div><div class="sc-num" style="color:var(--teal)">${ac}</div><div class="sc-label">AC Motors</div></div>
    <div class="stat-card c6"><div class="sc-icon">🔴</div><div class="sc-num" style="color:var(--red)">${dc}</div><div class="sc-label">DC Motors</div></div>
    <div class="stat-card c4"><div class="sc-icon">🔌</div><div class="sc-num" style="color:var(--yellow)">${single}</div><div class="sc-label">Single Phase</div></div>
    <div class="stat-card c5"><div class="sc-icon">⚡</div><div class="sc-num" style="color:var(--green)">${three}</div><div class="sc-label">Three Phase</div></div>
    <div class="stat-card c3"><div class="sc-icon">🔩</div><div class="sc-num">${totalCu.toFixed(1)}</div><div class="sc-label">Total Coil Wt (kg)</div></div>
    <div class="stat-card c1"><div class="sc-icon">💪</div><div class="sc-num">${avgHP.toFixed(2)}</div><div class="sc-label">Avg HP</div></div>
    <div class="stat-card c2"><div class="sc-icon">🔄</div><div class="sc-num">${Math.round(avgRPM)}</div><div class="sc-label">Avg RPM</div></div>
    <div class="stat-card c5"><div class="sc-icon">🔧</div><div class="sc-num" style="color:var(--green)">${rewound}</div><div class="sc-label">Rewound</div></div>
  `;

  const typeData = [
    ["AC", ac],
    ["DC", dc],
    ["Single Phase", single],
    ["Three Phase", three],
    ["Rewound", rewound],
  ];
  const maxT = Math.max(...typeData.map((t) => t[1]), 1);
  document.getElementById("typeChart").innerHTML = typeData
    .map(
      ([l, v], i) => `
    <div class="bar-wrap"><div class="bar-lbl">${l}</div>
    <div class="bar-track"><div class="bar-fill${i === 1 ? " teal" : ""}" style="width:${((v / maxT) * 100).toFixed(1)}%"></div></div>
    <div class="bar-val">${v}</div></div>`,
    )
    .join("");

  const bc = {};
  motors.forEach((m) => {
    bc[m.brand] = (bc[m.brand] || 0) + 1;
  });
  const bArr = Object.entries(bc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxB = Math.max(...bArr.map((b) => b[1]), 1);
  document.getElementById("brandChart").innerHTML = bArr
    .map(
      ([b, v]) => `
    <div class="bar-wrap"><div class="bar-lbl" style="width:100px">${b}</div>
    <div class="bar-track"><div class="bar-fill" style="width:${((v / maxB) * 100).toFixed(1)}%"></div></div>
    <div class="bar-val">${v}</div></div>`,
    )
    .join("");

  const recent = [...motors]
    .sort((a, b) => (b.added || 0) - (a.added || 0))
    .slice(0, 8);
  document.getElementById("recentBody").innerHTML = recent
    .map(
      (m) => `
    <tr>
      <td><div class="motor-name-cell"><strong>${m.brand}</strong><small>${m.frameSize || ""}</small></div></td>
      <td>${m.brand}</td>
      <td>${m.ratedPowerHP || "-"} HP</td>
      <td>${m.ratedRPM || "-"}</td>
      <td><span class="badge ${m.phase === "Three" ? "badge-3ph" : "badge-1ph"}">${m.phase || "-"} Phase</span></td>
      <td><span class="badge ${m.motorType === "AC" ? "badge-ac" : "badge-dc"}">${m.motorType || "-"}</span></td>
    </tr>`,
    )
    .join("");
}

// ============================
// MOTORS TABLE + BULK SELECT
// ============================
let mFiltered = [];
let mSort = "brand";
let mSortDir = 1;
let mPage = 1;
const M_PER = 12;
let selectedIds = new Set();

function filterMotors() {
  const motors = getMotors();
  const q = (document.getElementById("motorSearch")?.value || "").toLowerCase();
  const type = document.getElementById("typeFilter")?.value || "";
  const phase = document.getElementById("phaseFilter")?.value || "";
  mFiltered = motors.filter((m) => {
    const txt = [
      m.brand,
      m.manufacturer,
      m.frameSize,
      m.ratedVoltage,
      m.ratedPowerHP,
      m.ratedRPM,
      m.wireGauge,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!q || txt.includes(q)) &&
      (!type || m.motorType === type) &&
      (!phase || m.phase === phase)
    );
  });
  mFiltered.sort((a, b) => {
    let av = a[mSort] || "",
      bv = b[mSort] || "";
    if (!isNaN(av) && !isNaN(bv)) {
      av = parseFloat(av);
      bv = parseFloat(bv);
    } else {
      av = String(av).toLowerCase();
      bv = String(bv).toLowerCase();
    }
    return av < bv ? -mSortDir : av > bv ? mSortDir : 0;
  });
  selectedIds.clear();
  mPage = 1;
  renderMotorsTable();
}

function sortMotors(col) {
  if (mSort === col) mSortDir *= -1;
  else {
    mSort = col;
    mSortDir = 1;
  }
  filterMotors();
}

function renderMotorsTable() {
  const slice = mFiltered.slice((mPage - 1) * M_PER, mPage * M_PER);
  const tb = document.getElementById("motorBody");
  if (!slice.length) {
    tb.innerHTML = `<tr><td colspan="12"><div class="empty-state"><div class="es-icon">🔍</div><p>No motors found</p></div></td></tr>`;
  } else {
    tb.innerHTML = slice
      .map(
        (m) => `
      <tr class="${selectedIds.has(m.id) ? "row-selected" : ""}">
        <td><input type="checkbox" class="row-cb" data-id="${m.id}" ${selectedIds.has(m.id) ? "checked" : ""} onchange="toggleRowSelect(${m.id},this.checked)" style="width:16px;height:16px;cursor:pointer" /></td>
        <td><div class="motor-name-cell"><strong>${m.brand}</strong><small>${m.manufacturer || ""}</small></div></td>
        <td>${m.frameSize || "-"}</td>
        <td><strong>${m.ratedPowerHP || "-"}</strong> HP</td>
        <td>${m.ratedRPM || "-"}</td>
        <td>${m.ratedVoltage || "-"}</td>
        <td><span class="badge ${m.motorType === "AC" ? "badge-ac" : "badge-dc"}">${m.motorType || "-"}</span></td>
        <td><span class="badge ${m.phase === "Three" ? "badge-3ph" : "badge-1ph"}">${m.phase || "-"}</span></td>
        <td>${m.wireGauge || "-"}</td>
        <td>${m.totalCoilTurns || "-"}</td>
        <td>${m.coilWeight || "-"} kg</td>
        <td style="white-space:nowrap">
          <button class="btn btn-light btn-sm" onclick="openDetail(${m.id})">👁</button>
          <button class="btn btn-orange btn-sm" onclick="openEditModal(${m.id})" style="margin:0 3px">✏️</button>
          <button class="btn btn-light btn-sm" onclick="duplicateMotor(${m.id})" title="Duplicate">📋</button>
          <button class="btn btn-red btn-sm" onclick="openDeleteConfirm(${m.id})" style="margin-left:3px">🗑️</button>
        </td>
      </tr>`,
      )
      .join("");
  }
  updateBulkUI();

  // Pagination
  const tp = Math.ceil(mFiltered.length / M_PER) || 1;
  let pg = `<span class="pg-info">${mFiltered.length} record${mFiltered.length !== 1 ? "s" : ""}</span>`;
  if (tp > 1) {
    if (mPage > 1)
      pg += `<button class="pg-btn" onclick="goMPage(${mPage - 1})">‹</button>`;
    for (let i = 1; i <= tp; i++) {
      if (i === 1 || i === tp || Math.abs(i - mPage) <= 1)
        pg += `<button class="pg-btn${i === mPage ? " active" : ""}" onclick="goMPage(${i})">${i}</button>`;
      else if (Math.abs(i - mPage) === 2)
        pg += `<span style="padding:0 4px;color:var(--muted)">…</span>`;
    }
    if (mPage < tp)
      pg += `<button class="pg-btn" onclick="goMPage(${mPage + 1})">›</button>`;
  }
  document.getElementById("motorPagination").innerHTML = pg;
}

function goMPage(p) {
  mPage = p;
  renderMotorsTable();
}

function toggleRowSelect(id, checked) {
  checked ? selectedIds.add(id) : selectedIds.delete(id);
  updateBulkUI();
  renderMotorsTable();
}
function toggleSelectAll(checked) {
  mFiltered.forEach((m) =>
    checked ? selectedIds.add(m.id) : selectedIds.delete(m.id),
  );
  updateBulkUI();
  renderMotorsTable();
}
function updateBulkUI() {
  const cnt = selectedIds.size;
  const btn = document.getElementById("bulkDeleteBtn");
  const countEl = document.getElementById("bulkCount");
  const info = document.getElementById("bulkInfo");
  const allCb = document.getElementById("selectAllCb");
  if (btn) btn.style.display = cnt > 0 ? "inline-flex" : "none";
  if (countEl) countEl.textContent = cnt;
  if (info) info.textContent = cnt > 0 ? `${cnt} selected` : "";
  if (allCb)
    allCb.checked =
      mFiltered.length > 0 && mFiltered.every((m) => selectedIds.has(m.id));
}
function bulkDelete() {
  const cnt = selectedIds.size;
  if (!cnt) return;
  showConfirmModal(
    "🗑️ Bulk Delete",
    `Delete ${cnt} selected motor${cnt > 1 ? "s" : ""}? This cannot be undone.`,
    () => {
      // Auto-backup before bulk delete
      const motors = getMotors();
      dl(
        "srew_before_bulkdelete.json",
        "application/json",
        JSON.stringify(motors, null, 2),
      );
      addBackupHistory("🛡️ Auto-backup before bulk delete", motors.length);
      saveMotors(motors.filter((m) => !selectedIds.has(m.id)));
      selectedIds.clear();
      closeConfirm();
      showToast(`🗑️ Deleted ${cnt} records`);
      refreshAll();
    },
  );
}

// ============================
// DUPLICATE MOTOR
// ============================
function duplicateMotor(id) {
  const motors = getMotors();
  const orig = motors.find((x) => x.id === id);
  if (!orig) return;
  const copy = {
    ...orig,
    id: Date.now(),
    added: Date.now(),
    brand: orig.brand + " (Copy)",
    notes: (orig.notes || "") + " [Duplicated]",
  };
  saveMotors([...motors, copy]);
  refreshAll();
  showToast(`📋 Duplicated: ${orig.brand}`);
}

// ============================
// ADD / EDIT MOTOR
// ============================
let editingId = null;
let currentPhase = "Single";

function setPhase(p) {
  currentPhase = p;
  document.getElementById("phBtn1").classList.toggle("active", p === "Single");
  document.getElementById("phBtn3").classList.toggle("active", p === "Three");
  document.getElementById("singlePhaseSection").style.display =
    p === "Single" ? "" : "none";
  document.getElementById("threePhaseSection").style.display =
    p === "Three" ? "" : "none";
  document.getElementById("f_phase").value = p;
}
function onPhaseChange() {
  setPhase(document.getElementById("f_phase").value || "Single");
}
function autoKW() {
  const hp = parseFloat(document.getElementById("f_ratedPowerHP").value) || 0;
  document.getElementById("f_ratedPowerKW").value = hp
    ? (hp * 0.7457).toFixed(4)
    : "";
}

// Pitch turns
function addPitchRow(pitch = "", turns = "") {
  const container = document.getElementById("pitchTurnsContainer");
  const row = document.createElement("div");
  row.className = "pitch-row";
  row.style.cssText = "display:flex;align-items:center;gap:10px";
  row.innerHTML = `
    <div class="fg" style="flex:1;gap:4px">
      <label style="font-size:.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Pitch</label>
      <input type="text" class="pitch-input" placeholder="e.g. 1-8" value="${pitch}"
        style="padding:9px 12px;border:2px solid var(--border);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;width:100%;color:var(--text)" />
    </div>
    <div class="fg" style="flex:1;gap:4px">
      <label style="font-size:.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Turns</label>
      <input type="number" class="turns-input" placeholder="e.g. 90" value="${turns}"
        style="padding:9px 12px;border:2px solid var(--border);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;width:100%;color:var(--text)" />
    </div>
    <button type="button" onclick="this.parentElement.remove()"
      style="margin-top:18px;background:var(--light);border:none;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:1rem;color:var(--muted);flex-shrink:0">✕</button>`;
  container.appendChild(row);
}
function getPitchTurns() {
  return [...document.querySelectorAll("#pitchTurnsContainer .pitch-row")]
    .map((row) => ({
      pitch: row.querySelector(".pitch-input").value.trim(),
      turns: row.querySelector(".turns-input").value.trim(),
    }))
    .filter((pt) => pt.pitch || pt.turns);
}
function renderPitchTurns(arr) {
  document.getElementById("pitchTurnsContainer").innerHTML = "";
  (arr || []).forEach((item) => addPitchRow(item.pitch, item.turns));
}

const FIELDS = [
  "brand",
  "manufacturer",
  "motorType",
  "phase",
  "ratedVoltage",
  "ratedCurrent",
  "ratedFrequency",
  "ratedRPM",
  "ratedPowerHP",
  "ratedPowerKW",
  "insulationClass",
  "efficiency",
  "frameSize",
  "runningCurrent",
  "statorSlots",
  "slotLength",
  "totalCoilTurns",
  "turnsPerCoil",
  "coilPitch",
  "windingConnection",
  "coilWireType",
  "wireGauge",
  "coilWeight",
  "startingCoilTurns",
  "runningCoilTurns",
  "startingCoilWeight",
  "runningCoilWeight",
  "capacitorValue",
  "lineVoltage",
  "phaseVoltage",
  "lineCurrent",
  "phaseCurrent",
  "starDeltaConn",
  "shaftDiameter",
  "shaftLength",
  "bearingFront",
  "bearingRear",
  "fanSize",
  "fanCoverSize",
  "motorWeight",
  "bodyMaterial",
  "oldCoilWeight",
  "newCoilWeight",
  "notes",
];

function openAddModal() {
  editingId = null;
  document.getElementById("mModalTitle").textContent =
    "➕ Add New Motor Record";
  FIELDS.forEach((f) => {
    const el = document.getElementById("f_" + f);
    if (el) el.value = "";
  });
  renderPitchTurns([]);
  setPhase("Single");
  document.getElementById("motorModal").style.display = "flex";
}
function openEditModal(id) {
  const m = getMotors().find((x) => x.id === id);
  if (!m) return;
  editingId = id;
  document.getElementById("mModalTitle").textContent = "✏️ Edit Motor Record";
  FIELDS.forEach((f) => {
    const el = document.getElementById("f_" + f);
    if (el) el.value = m[f] || "";
  });
  renderPitchTurns(m.pitchTurns || []);
  setPhase(m.phase === "Three" ? "Three" : "Single");
  document.getElementById("motorModal").style.display = "flex";
}
function closeMotorModal() {
  document.getElementById("motorModal").style.display = "none";
}
function closeMModalOutside(e) {
  if (e.target === document.getElementById("motorModal")) closeMotorModal();
}

function saveMotor() {
  const brand = document.getElementById("f_brand").value.trim();
  const phase = document.getElementById("f_phase").value;
  const type = document.getElementById("f_motorType").value;
  if (!brand || !phase || !type) {
    showToast("Please fill required fields: Brand, Phase, Type", "err");
    return;
  }
  const motors = getMotors();
  const obj = {
    id: editingId || Date.now(),
    added: editingId
      ? motors.find((m) => m.id === editingId)?.added || Date.now()
      : Date.now(),
  };
  FIELDS.forEach((f) => {
    const el = document.getElementById("f_" + f);
    if (el) obj[f] = el.value.trim();
  });
  obj.ratedPowerKW = obj.ratedPowerHP
    ? (parseFloat(obj.ratedPowerHP) * 0.7457).toFixed(4)
    : obj.ratedPowerKW;
  obj.pitchTurns = getPitchTurns();
  let updated;
  if (editingId) {
    updated = motors.map((m) => (m.id === editingId ? obj : m));
    showToast("✅ Motor updated");
  } else {
    updated = [...motors, obj];
    showToast("✅ Motor added");
  }
  saveMotors(updated);
  closeMotorModal();
  refreshAll();
}

// ============================
// DETAIL VIEW
// ============================
function openDetail(id) {
  const m = getMotors().find((x) => x.id === id);
  if (!m) return;
  document.getElementById("detailTitle").textContent =
    `${m.brand} — ${m.frameSize || "Motor Detail"}`;
  document.getElementById("detailEditBtn").onclick = () => {
    closeDetail();
    openEditModal(id);
  };
  document.getElementById("detailDuplicateBtn").onclick = () => {
    closeDetail();
    duplicateMotor(id);
  };
  document.getElementById("detailPrintBtn").onclick = () => printMotorCard(id);

  const sec = (title, icon, items) => {
    const filled = items.filter(([l, v]) => v);
    if (!filled.length) return "";
    return `<div class="detail-section">
      <div class="detail-section-title"><span>${icon}</span>${title}</div>
      <div class="detail-grid">${filled.map(([l, v]) => `<div class="detail-item"><div class="di-label">${l}</div><div class="di-val">${v}</div></div>`).join("")}</div>
    </div>`;
  };

  let pitchHtml = "";
  if (m.pitchTurns && m.pitchTurns.length) {
    pitchHtml = `<div class="detail-section">
      <div class="detail-section-title"><span>🔢</span>Turns per Pitch</div>
      <div class="detail-grid">${m.pitchTurns.map((pt) => `<div class="detail-item"><div class="di-label">Pitch ${pt.pitch}</div><div class="di-val">${pt.turns} turns</div></div>`).join("")}</div>
    </div>`;
  }

  document.getElementById("detailBody").innerHTML = `
    ${sec("Nameplate Details", "🏷️", [
      ["Brand", m.brand],
      ["Manufacturer", m.manufacturer],
      ["Motor Type", m.motorType],
      ["Phase", m.phase ? m.phase + " Phase" : ""],
      ["Rated Voltage", m.ratedVoltage],
      ["Rated Current", m.ratedCurrent],
      ["Frequency", m.ratedFrequency],
      ["Rated RPM", m.ratedRPM],
      [
        "Rated Power",
        m.ratedPowerHP
          ? m.ratedPowerHP + " HP / " + m.ratedPowerKW + " kW"
          : "",
      ],
      ["Insulation Class", m.insulationClass],
      ["Efficiency", m.efficiency],
      ["Frame Size", m.frameSize],
    ])}
    ${sec("Electrical", "⚡", [["Running Current", m.runningCurrent]])}
    ${sec("Winding / Coil Details", "🔩", [
      ["Stator Slots", m.statorSlots],
      ["Slot Length", m.slotLength],
      ["Total Coil Turns", m.totalCoilTurns],
      ["Turns Per Coil", m.turnsPerCoil],
      ["Coil Pitch", m.coilPitch],
      ["Winding Connection", m.windingConnection],
      ["Wire Type", m.coilWireType],
      ["Wire Gauge (SWG)", m.wireGauge],
      ["Coil Weight", m.coilWeight ? m.coilWeight + " kg" : ""],
    ])}
    ${pitchHtml}
    ${
      m.phase === "Single"
        ? sec("Single Phase — Starting & Running Coil", "🔌", [
            ["Starting Coil Turns", m.startingCoilTurns],
            ["Running Coil Turns", m.runningCoilTurns],
            [
              "Starting Coil Weight",
              m.startingCoilWeight ? m.startingCoilWeight + " kg" : "",
            ],
            [
              "Running Coil Weight",
              m.runningCoilWeight ? m.runningCoilWeight + " kg" : "",
            ],
            ["Capacitor Value", m.capacitorValue],
          ])
        : ""
    }
    ${
      m.phase === "Three"
        ? sec("Three Phase Electrical", "⚡", [
            ["Line Voltage", m.lineVoltage],
            ["Phase Voltage", m.phaseVoltage],
            ["Line Current", m.lineCurrent],
            ["Phase Current", m.phaseCurrent],
            ["Star/Delta Connection", m.starDeltaConn],
          ])
        : ""
    }
    ${sec("Mechanical Details", "⚙️", [
      ["Shaft Diameter", m.shaftDiameter],
      ["Shaft Length", m.shaftLength],
      ["Bearing (Front)", m.bearingFront],
      ["Bearing (Rear)", m.bearingRear],
      ["Fan Size", m.fanSize],
      ["Fan Cover Size", m.fanCoverSize],
      ["Motor Weight", m.motorWeight ? m.motorWeight + " kg" : ""],
      ["Body Material", m.bodyMaterial],
    ])}
    ${sec("Repair History", "🔧", [
      ["Old Coil Weight", m.oldCoilWeight ? m.oldCoilWeight + " kg" : ""],
      ["New Coil Weight", m.newCoilWeight ? m.newCoilWeight + " kg" : ""],
    ])}
    ${m.notes ? `<div class="detail-section"><div class="detail-section-title"><span>📝</span>Notes</div><div style="background:#f8fafd;border-radius:10px;padding:14px;color:var(--text);font-size:.9rem;border:1px solid var(--border)">${m.notes}</div></div>` : ""}
  `;
  document.getElementById("detailModal").style.display = "flex";
}
function closeDetail() {
  document.getElementById("detailModal").style.display = "none";
}
function closeDetailOutside(e) {
  if (e.target === document.getElementById("detailModal")) closeDetail();
}

// ============================
// PRINT INDIVIDUAL MOTOR CARD
// ============================
function printMotorCard(id) {
  const m = getMotors().find((x) => x.id === id);
  if (!m) return;
  const w = window.open("", "_blank");
  const row = (label, val) =>
    val
      ? `<tr><td style="color:#666;font-size:11px;padding:5px 8px;border-bottom:1px solid #eee;width:40%">${label}</td><td style="font-size:12px;padding:5px 8px;border-bottom:1px solid #eee;font-weight:600">${val}</td></tr>`
      : "";
  const ptRows =
    m.pitchTurns && m.pitchTurns.length
      ? m.pitchTurns
          .map((pt) => row(`Pitch ${pt.pitch}`, pt.turns + " turns"))
          .join("")
      : "";
  w.document.write(`<html><head><title>Motor Card — ${m.brand}</title>
  <style>
    body{font-family:sans-serif;padding:24px;max-width:700px;margin:0 auto;font-size:13px}
    .header{background:#0d1b2a;color:#fff;padding:18px 22px;border-radius:10px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center}
    .header h1{font-size:20px;margin:0}.header p{font-size:11px;opacity:.7;margin:4px 0 0}
    .badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;margin-left:8px}
    .ac{background:#e0f0ff;color:#1565c0}.dc{background:#fff3e0;color:#e65100}
    .ph1{background:#f3e5f5;color:#6a1b9a}.ph3{background:#e8f5e9;color:#2e7d32}
    .section{margin-bottom:16px}.section h3{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#f4890a;border-bottom:2px solid #f4890a;padding-bottom:5px;margin-bottom:8px}
    table{width:100%;border-collapse:collapse}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .footer{margin-top:24px;text-align:center;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:12px}
    @media print{body{padding:10px}}
  </style></head><body>
  <div class="header">
    <div><h1>⚡ ${m.brand} <span class="badge ${m.motorType === "AC" ? "ac" : "dc"}">${m.motorType}</span><span class="badge ${m.phase === "Three" ? "ph3" : "ph1"}">${m.phase} Phase</span></h1>
    <p>Shree Ram Electric Works · Motor Data Card · Printed: ${new Date().toLocaleString()}</p></div>
    <div style="text-align:right"><div style="font-size:28px;font-weight:700;color:#f4890a">${m.ratedPowerHP || "—"} HP</div><div style="font-size:11px;opacity:.7">${m.ratedRPM || "—"} RPM</div></div>
  </div>
  <div class="two-col">
    <div>
      <div class="section"><h3>🏷️ Nameplate</h3><table>
        ${row("Brand", m.brand)}${row("Manufacturer", m.manufacturer)}${row("Frame Size", m.frameSize)}
        ${row("Voltage", m.ratedVoltage)}${row("Current", m.ratedCurrent)}${row("Frequency", m.ratedFrequency)}
        ${row("HP / kW", m.ratedPowerHP ? m.ratedPowerHP + " HP / " + m.ratedPowerKW + " kW" : "")}
        ${row("RPM", m.ratedRPM)}${row("Insulation", m.insulationClass)}${row("Efficiency", m.efficiency)}
      </table></div>
      <div class="section"><h3>⚡ Electrical</h3><table>
        ${row("Running Current", m.runningCurrent)}
        ${m.phase === "Three" ? row("Line Voltage", m.lineVoltage) + row("Phase Voltage", m.phaseVoltage) + row("Line Current", m.lineCurrent) + row("Phase Current", m.phaseCurrent) + row("Star/Delta", m.starDeltaConn) : ""}
        ${m.phase === "Single" ? row("Starting Coil Turns", m.startingCoilTurns) + row("Running Coil Turns", m.runningCoilTurns) + row("Start Coil Wt", m.startingCoilWeight ? m.startingCoilWeight + " kg" : "") + row("Run Coil Wt", m.runningCoilWeight ? m.runningCoilWeight + " kg" : "") + row("Capacitor", m.capacitorValue) : ""}
      </table></div>
    </div>
    <div>
      <div class="section"><h3>🔩 Winding / Coil</h3><table>
        ${row("Stator Slots", m.statorSlots)}${row("Slot Length", m.slotLength)}
        ${row("Total Coil Turns", m.totalCoilTurns)}${row("Turns Per Coil", m.turnsPerCoil)}
        ${row("Coil Pitch", m.coilPitch)}${row("Connection", m.windingConnection)}
        ${row("Wire Type", m.coilWireType)}${row("Wire Gauge", m.wireGauge)}${row("Coil Weight", m.coilWeight ? m.coilWeight + " kg" : "")}
        ${ptRows}
      </table></div>
      <div class="section"><h3>⚙️ Mechanical</h3><table>
        ${row("Shaft Dia", m.shaftDiameter)}${row("Shaft Length", m.shaftLength)}
        ${row("Bearing Front", m.bearingFront)}${row("Bearing Rear", m.bearingRear)}
        ${row("Fan Size", m.fanSize)}${row("Fan Cover", m.fanCoverSize)}
        ${row("Motor Weight", m.motorWeight ? m.motorWeight + " kg" : "")}${row("Body Material", m.bodyMaterial)}
      </table></div>
      <div class="section"><h3>🔧 Repair History</h3><table>
        ${row("Old Coil Wt", m.oldCoilWeight ? m.oldCoilWeight + " kg" : "")}${row("New Coil Wt", m.newCoilWeight ? m.newCoilWeight + " kg" : "")}
      </table></div>
    </div>
  </div>
  ${m.notes ? `<div class="section"><h3>📝 Notes</h3><p style="background:#f8fafd;padding:10px;border-radius:6px;font-size:11px">${m.notes}</p></div>` : ""}
  <div class="footer">Shree Ram Electric Works · Motor Data Management System · ${new Date().getFullYear()}</div>
  </body></html>`);
  w.document.close();
  w.print();
}

// ============================
// DELETE (single + confirm modal)
// ============================
let deleteId = null;
let confirmCallback = null;

function showConfirmModal(
  title,
  msg,
  onOk,
  icon = "🗑️",
  btnLabel = "Delete",
  btnClass = "btn-red",
) {
  document.getElementById("confirmIcon").textContent = icon;
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMsg").textContent = msg;
  const btn = document.getElementById("confirmOkBtn");
  btn.className = "btn " + btnClass;
  btn.textContent = btnLabel;
  confirmCallback = onOk;
  document.getElementById("confirmModal").style.display = "flex";
}
function openDeleteConfirm(id) {
  const m = getMotors().find((x) => x.id === id);
  deleteId = id;
  showConfirmModal(
    "Delete Motor?",
    `"${m?.brand} ${m?.frameSize || ""}" will be permanently deleted.`,
    () => {
      saveMotors(getMotors().filter((m) => m.id !== deleteId));
      closeConfirm();
      showToast("🗑️ Motor deleted");
      refreshAll();
    },
  );
}
function closeConfirm() {
  document.getElementById("confirmModal").style.display = "none";
  deleteId = null;
  confirmCallback = null;
}
function confirmDelete() {
  if (confirmCallback) confirmCallback();
}

// ============================
// SETTINGS
// ============================
function changePassword() {
  const cur = document.getElementById("curPass").value;
  const nw = document.getElementById("newPass").value;
  const cn = document.getElementById("conPass").value;
  if (hashStr(cur) !== getPass()) {
    showToast("Current password is incorrect", "err");
    return;
  }
  if (nw.length < 6) {
    showToast("Min 6 characters", "err");
    return;
  }
  if (nw !== cn) {
    showToast("Passwords do not match", "err");
    return;
  }
  localStorage.setItem(LS_PASS, hashStr(nw));
  ["curPass", "newPass", "conPass"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  showToast("✅ Password changed");
}
function clearAllData() {
  showConfirmModal(
    "⚠️ Clear All Data?",
    "A backup will be downloaded first, then ALL records will be deleted.",
    () => {
      quickBackup();
      setTimeout(() => {
        localStorage.removeItem(LS_MOTORS);
        closeConfirm();
        refreshAll();
        showToast("All data cleared", "warn");
      }, 600);
    },
    "⚠️",
    "Clear All",
    "btn-red",
  );
}

// ============================
// EXPORT
// ============================
function exportCSV() {
  const motors = getMotors();
  const headers = [...FIELDS, "pitchTurns"];
  const rows = motors.map((m) =>
    headers
      .map((f) => {
        const val =
          f === "pitchTurns"
            ? (m.pitchTurns || [])
                .map((pt) => `${pt.pitch}:${pt.turns}`)
                .join(" | ")
            : (m[f] || "").toString();
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(","),
  );
  dl(
    "srew_motors_export.csv",
    "text/csv",
    [headers.join(","), ...rows].join("\n"),
  );
  showToast("📊 CSV exported");
}
function exportJSON() {
  dl(
    "srew_motors_backup.json",
    "application/json",
    JSON.stringify(getMotors(), null, 2),
  );
  addBackupHistory("📦 Manual JSON Export", getMotors().length);
  showToast("💾 JSON downloaded");
}
function printReport() {
  const motors = getMotors();
  const w = window.open("", "_blank");
  w.document
    .write(`<html><head><title>Shree Ram Electric Works – Motor Report</title>
    <style>body{font-family:sans-serif;padding:20px;font-size:12px}h1{font-size:18px;margin-bottom:4px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
    th{background:#0d1b2a;color:#fff}tr:nth-child(even){background:#f5f5f5}.meta{color:#666;font-size:11px;margin-bottom:20px}</style>
    </head><body>
    <h1>⚡ Shree Ram Electric Works</h1>
    <div class="meta">Motor Report · ${new Date().toLocaleString()} · ${motors.length} records</div>
    <table><thead><tr><th>#</th><th>Brand</th><th>HP</th><th>kW</th><th>RPM</th><th>Voltage</th><th>Phase</th><th>Type</th><th>Gauge</th><th>Turns</th><th>Coil Wt</th><th>Frame</th></tr></thead>
    <tbody>${motors.map((m, i) => `<tr><td>${i + 1}</td><td>${m.brand || ""}</td><td>${m.ratedPowerHP || ""}</td><td>${m.ratedPowerKW || ""}</td><td>${m.ratedRPM || ""}</td><td>${m.ratedVoltage || ""}</td><td>${m.phase || ""}</td><td>${m.motorType || ""}</td><td>${m.wireGauge || ""}</td><td>${m.totalCoilTurns || ""}</td><td>${m.coilWeight || ""}</td><td>${m.frameSize || ""}</td></tr>`).join("")}
    </tbody></table></body></html>`);
  w.document.close();
  w.print();
}
function copyTable() {
  const motors = getMotors();
  const hdrs = [
    "Brand",
    "HP",
    "kW",
    "RPM",
    "Voltage",
    "Phase",
    "Type",
    "Wire Gauge",
    "Coil Turns",
    "Coil Weight",
    "Frame",
  ];
  const rows = motors.map((m) =>
    [
      m.brand,
      m.ratedPowerHP,
      m.ratedPowerKW,
      m.ratedRPM,
      m.ratedVoltage,
      m.phase,
      m.motorType,
      m.wireGauge,
      m.totalCoilTurns,
      m.coilWeight,
      m.frameSize,
    ].join("\t"),
  );
  navigator.clipboard
    .writeText([hdrs.join("\t"), ...rows].join("\n"))
    .then(() => showToast("📋 Copied to clipboard"));
}
function dl(name, type, content) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
}

// ============================
// IMPORT
// ============================
function dzOver(e) {
  e.preventDefault();
  document.getElementById("dropZone").classList.add("drag-over");
}
function dzLeave() {
  document.getElementById("dropZone").classList.remove("drag-over");
}
function dzDrop(e) {
  e.preventDefault();
  dzLeave();
  const f = e.dataTransfer.files[0];
  if (f) readJSON(f);
}
function handleImport(inp) {
  if (inp.files[0]) readJSON(inp.files[0]);
}
function readJSON(file) {
  const r = new FileReader();
  r.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error();
      document.getElementById("importPreview").innerHTML = `
        <div style="background:var(--light);border-radius:12px;padding:16px;margin-top:12px;border:1px solid var(--border)">
          <strong>Preview:</strong> ${data.length} motor records found
          <div style="margin-top:14px;display:flex;gap:10px">
            <button class="btn btn-orange" onclick='importMerge(${JSON.stringify(data).replace(/'/g, "&#39;")})'>Merge with existing</button>
            <button class="btn btn-red" onclick='importReplace(${JSON.stringify(data).replace(/'/g, "&#39;")})'>Replace All</button>
          </div>
        </div>`;
    } catch {
      showToast("❌ Invalid JSON file", "err");
    }
  };
  r.readAsText(file);
}
function importMerge(data) {
  const ex = getMotors();
  const merged = [...ex, ...data.filter((d) => !ex.find((e) => e.id === d.id))];
  saveMotors(merged);
  refreshAll();
  showToast(`✅ Merged ${data.length} records`);
}
function importReplace(data) {
  dl(
    "srew_before_import.json",
    "application/json",
    JSON.stringify(getMotors(), null, 2),
  );
  saveMotors(data);
  refreshAll();
  showToast(`✅ Replaced with ${data.length} records`);
}

// ============================
// TOAST
// ============================
function showToast(msg, type = "ok") {
  const t = document.createElement("div");
  t.className =
    "toast" +
    (type === "err"
      ? " err"
      : type === "warn"
        ? " warn"
        : type === "info"
          ? " info"
          : "");
  const icon =
    type === "err"
      ? "❌ "
      : type === "warn"
        ? "⚠️ "
        : type === "info"
          ? "ℹ️ "
          : "✅ ";
  t.innerHTML = icon + msg;
  document.getElementById("toastWrap").appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(40px)";
    t.style.transition = ".3s";
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// Init sync status from last known state
const _ls = localStorage.getItem(LS_LAST_SYNC);
if (_ls) updateSyncBadge("ok");
else updateSyncBadge("dirty");
