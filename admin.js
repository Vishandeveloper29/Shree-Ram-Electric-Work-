// ============================
// CONFIG & STORAGE
// ============================
const LS_MOTORS = "srew_motors";
const LS_PASS = "srew_password";
const LS_SESSION = "srew_session";
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
}

function getSampleData() {
  const data = [
    {
      id: 1,
      brand: "Crompton",
      manufacturer: "Crompton Greaves Ltd",
      modelNumber: "GF2054",
      serialNumber: "CG-2023-001",
      motorType: "AC",
      phase: "Single",
      ratedVoltage: "230V",
      ratedCurrent: "8.5A",
      ratedFrequency: "50Hz",
      ratedRPM: 1440,
      ratedPowerHP: 1.5,
      ratedPowerKW: "1.12",
      dutyType: "S1",
      insulationClass: "B",
      ipRating: "IP55",
      powerFactor: "0.88",
      efficiency: "82%",
      ambientTemp: "40°C",
      serviceFactor: "1.15",
      frameSize: "D90S",
      mountingType: "B3",
      countryOrigin: "India",
      mfgDate: "Jan 2020",
      startingCurrent: "52A",
      runningCurrent: "8.2A",
      lockedRotorCurrent: "58A",
      breakdownTorque: "18 N·m",
      fullLoadTorque: "7.4 N·m",
      windingResR: "12.4Ω",
      windingResY: "12.3Ω",
      windingResB: "12.5Ω",
      meggerTest: ">100 MΩ",
      continuityTest: "Pass",
      statorSlots: 36,
      rotorSlots: 28,
      slotLength: "42mm",
      rotorBore: "68mm",
      coreLength: "75mm",
      stackHeight: "90mm",
      airGap: "0.3mm",
      totalCoilTurns: 720,
      turnsPerCoil: 90,
      coilPitch: "1-8",
      windingType: "Concentric",
      windingConnection: "",
      coilWireType: "Copper",
      wireGauge: "22 SWG",
      wireDiameter: "0.71mm",
      coilWeight: "1.15",
      totalCopperWeight: "1.05",
      insulationPaper: "Nomex 410",
      slotInsulThick: "0.25mm",
      varnishType: "Class B Epoxy",
      bakingTemp: "120°C",
      bakingTime: "5 hrs",
      startingCoilTurns: 480,
      runningCoilTurns: 240,
      startingCoilResistance: "28Ω",
      runningCoilResistance: "12.4Ω",
      startingCoilWeight: "0.42",
      runningCoilWeight: "0.73",
      capacitorType: "Start + Run",
      capacitorValue: "25µF / 4µF",
      capacitorVoltage: "250V / 400V",
      centrifugalSwitch: "Yes",
      lineVoltage: "",
      phaseVoltage: "",
      lineCurrent: "",
      phaseCurrent: "",
      starDeltaConn: "",
      terminalMarkings: "",
      shaftDiameter: "24mm",
      shaftLength: "55mm",
      bearingFront: "6305",
      bearingRear: "6203",
      coolingType: "IC211",
      fanType: "External",
      fanCoverType: "End Cover",
      motorWeight: "11.5",
      bodyMaterial: "Cast Iron",
      lastRewindDate: "2023-06-10",
      rewindingBy: "Shree Ram Electric Works",
      oldCoilWeight: "1.0",
      newCoilWeight: "1.15",
      bearingChanged: "Yes",
      capacitorChanged: "Yes",
      testReport: "Pass",
      notes: "Motor rewound after burnout. Running perfectly.",
      added: Date.now() - 86400000 * 10,
    },
    {
      id: 2,
      brand: "Kirloskar",
      manufacturer: "Kirloskar Electric Co.",
      modelNumber: "KE3-4544",
      serialNumber: "KE-2022-045",
      motorType: "AC",
      phase: "Three",
      ratedVoltage: "415V",
      ratedCurrent: "7.8A",
      ratedFrequency: "50Hz",
      ratedRPM: 1450,
      ratedPowerHP: 3,
      ratedPowerKW: "2.24",
      dutyType: "S1",
      insulationClass: "F",
      ipRating: "IP55",
      powerFactor: "0.86",
      efficiency: "87%",
      ambientTemp: "50°C",
      serviceFactor: "1.0",
      frameSize: "D100L",
      mountingType: "B3",
      countryOrigin: "India",
      mfgDate: "Mar 2022",
      startingCurrent: "47A",
      runningCurrent: "7.5A",
      lockedRotorCurrent: "52A",
      breakdownTorque: "28 N·m",
      fullLoadTorque: "14.8 N·m",
      windingResR: "4.2Ω",
      windingResY: "4.1Ω",
      windingResB: "4.2Ω",
      meggerTest: ">500 MΩ",
      continuityTest: "Pass",
      statorSlots: 36,
      rotorSlots: 28,
      slotLength: "55mm",
      rotorBore: "72mm",
      coreLength: "85mm",
      stackHeight: "100mm",
      airGap: "0.35mm",
      totalCoilTurns: 576,
      turnsPerCoil: 72,
      coilPitch: "1-9",
      windingType: "Lap",
      windingConnection: "Star",
      coilWireType: "Copper",
      wireGauge: "20 SWG",
      wireDiameter: "0.91mm",
      coilWeight: "2.8",
      totalCopperWeight: "2.6",
      insulationPaper: "Leatheroid 0.2mm",
      slotInsulThick: "0.30mm",
      varnishType: "Class F Alkyd",
      bakingTemp: "155°C",
      bakingTime: "8 hrs",
      startingCoilTurns: 0,
      runningCoilTurns: 0,
      startingCoilResistance: "",
      runningCoilResistance: "",
      startingCoilWeight: "",
      runningCoilWeight: "",
      capacitorType: "",
      capacitorValue: "",
      capacitorVoltage: "",
      centrifugalSwitch: "",
      lineVoltage: "415V",
      phaseVoltage: "240V",
      lineCurrent: "7.8A",
      phaseCurrent: "4.5A",
      starDeltaConn: "Star",
      terminalMarkings: "U1,U2,V1,V2,W1,W2",
      shaftDiameter: "28mm",
      shaftLength: "60mm",
      bearingFront: "6206",
      bearingRear: "6204",
      coolingType: "IC411",
      fanType: "External",
      fanCoverType: "End Cover",
      motorWeight: "18.5",
      bodyMaterial: "Cast Iron",
      lastRewindDate: "2024-01-15",
      rewindingBy: "Shree Ram Electric Works",
      oldCoilWeight: "2.5",
      newCoilWeight: "2.8",
      bearingChanged: "Yes",
      capacitorChanged: "No",
      testReport: "Pass",
      notes: "Rewound after flood damage. Star connected.",
      added: Date.now() - 86400000 * 5,
    },
  ];
  saveMotors(data);
  return data;
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
  el.classList.add("active");
  if (id === "dashboard") renderDashboard();
  if (id === "motors") {
    filterMotors();
  }
}

// ============================
// REFRESH ALL
// ============================
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
  const rewound = motors.filter((m) => m.lastRewindDate).length;
  const totalCu = motors.reduce(
    (s, m) => s + parseFloat(m.totalCopperWeight || 0),
    0,
  );
  const avgHP = total
    ? motors.reduce((s, m) => s + parseFloat(m.ratedPowerHP || 0), 0) / total
    : 0;
  const avgRPM = total
    ? motors.reduce((s, m) => s + parseFloat(m.ratedRPM || 0), 0) / total
    : 0;

  document.getElementById("statsGrid").innerHTML = `
    <div class="stat-card c1"><div class="sc-icon">⚡</div><div class="sc-num">${total}</div><div class="sc-label">Total Motors</div></div>
    <div class="stat-card c2"><div class="sc-icon">🔵</div><div class="sc-num" style="color:var(--teal)">${ac}</div><div class="sc-label">AC Motors</div></div>
    <div class="stat-card c6"><div class="sc-icon">🔴</div><div class="sc-num" style="color:var(--red)">${dc}</div><div class="sc-label">DC Motors</div></div>
    <div class="stat-card c4"><div class="sc-icon">🔌</div><div class="sc-num" style="color:var(--yellow)">${single}</div><div class="sc-label">Single Phase</div></div>
    <div class="stat-card c5"><div class="sc-icon">⚡</div><div class="sc-num" style="color:var(--green)">${three}</div><div class="sc-label">Three Phase</div></div>
    <div class="stat-card c3"><div class="sc-icon">🔩</div><div class="sc-num">${totalCu.toFixed(2)}</div><div class="sc-label">Total Cu (kg)</div></div>
    <div class="stat-card c1"><div class="sc-icon">💪</div><div class="sc-num">${avgHP.toFixed(2)}</div><div class="sc-label">Avg HP</div></div>
    <div class="stat-card c2"><div class="sc-icon">🔄</div><div class="sc-num">${Math.round(avgRPM)}</div><div class="sc-label">Avg RPM</div></div>
    <div class="stat-card c5"><div class="sc-icon">🔧</div><div class="sc-num" style="color:var(--green)">${rewound}</div><div class="sc-label">Rewound</div></div>
  `;

  // Type chart
  const typeData = [
    ["AC Motors", ac],
    ["DC Motors", dc],
    ["Single Phase", single],
    ["Three Phase", three],
    ["Rewound", rewound],
  ];
  const maxT = Math.max(...typeData.map((t) => t[1]), 1);
  document.getElementById("typeChart").innerHTML = typeData
    .map(
      ([l, v], i) => `
    <div class="bar-wrap"><div class="bar-lbl">${l}</div>
    <div class="bar-track"><div class="bar-fill${i > 1 ? "" : [" teal", ""][i % 2]}" style="width:${((v / maxT) * 100).toFixed(1)}%"></div></div>
    <div class="bar-val">${v}</div></div>`,
    )
    .join("");

  // Brand chart
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

  // Recent
  const recent = [...motors]
    .sort((a, b) => (b.added || 0) - (a.added || 0))
    .slice(0, 8);
  document.getElementById("recentBody").innerHTML = recent
    .map(
      (m) => `
    <tr>
      <td><div class="motor-name-cell"><strong>${m.brand}</strong><small>${m.modelNumber || ""}</small></div></td>
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
// MOTORS TABLE
// ============================
let mFiltered = [];
let mSort = "brand";
let mSortDir = 1;
let mPage = 1;
const M_PER = 12;

function filterMotors() {
  const motors = getMotors();
  const q = (document.getElementById("motorSearch")?.value || "").toLowerCase();
  const type = document.getElementById("typeFilter")?.value || "";
  const phase = document.getElementById("phaseFilter")?.value || "";
  mFiltered = motors.filter((m) => {
    const txt = [
      m.brand,
      m.manufacturer,
      m.modelNumber,
      m.serialNumber,
      m.ratedVoltage,
      m.ratedPowerHP,
      m.ratedRPM,
      m.wireGauge,
      m.frameSize,
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
    tb.innerHTML = `<tr><td colspan="11"><div class="empty-state"><div class="es-icon">🔍</div><p>No motors found</p></div></td></tr>`;
  } else {
    tb.innerHTML = slice
      .map(
        (m) => `
      <tr>
        <td><div class="motor-name-cell"><strong>${m.brand}</strong><small>${m.serialNumber || ""}</small></div></td>
        <td>${m.modelNumber || "-"}</td>
        <td><strong>${m.ratedPowerHP || "-"}</strong> HP</td>
        <td>${m.ratedRPM || "-"}</td>
        <td>${m.ratedVoltage || "-"}</td>
        <td><span class="badge ${m.motorType === "AC" ? "badge-ac" : "badge-dc"}">${m.motorType || "-"}</span></td>
        <td><span class="badge ${m.phase === "Three" ? "badge-3ph" : "badge-1ph"}">${m.phase || "-"}</span></td>
        <td>${m.wireGauge || "-"}</td>
        <td>${m.totalCoilTurns || "-"}</td>
        <td>${m.coilWeight || "-"} kg</td>
        <td style="white-space:nowrap">
          <button class="btn btn-light btn-sm" onclick="openDetail(${m.id})">👁 View</button>
          <button class="btn btn-orange btn-sm" onclick="openEditModal(${m.id})" style="margin:0 4px">✏️</button>
          <button class="btn btn-red btn-sm" onclick="openDeleteConfirm(${m.id})">🗑️</button>
        </td>
      </tr>`,
      )
      .join("");
  }
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

const FIELDS = [
  "brand",
  "manufacturer",
  "modelNumber",
  "serialNumber",
  "motorType",
  "phase",
  "ratedVoltage",
  "ratedCurrent",
  "ratedFrequency",
  "ratedRPM",
  "ratedPowerHP",
  "ratedPowerKW",
  "dutyType",
  "insulationClass",
  "ipRating",
  "powerFactor",
  "efficiency",
  "ambientTemp",
  "serviceFactor",
  "frameSize",
  "mountingType",
  "countryOrigin",
  "mfgDate",
  "startingCurrent",
  "runningCurrent",
  "lockedRotorCurrent",
  "breakdownTorque",
  "fullLoadTorque",
  "windingResR",
  "windingResY",
  "windingResB",
  "meggerTest",
  "continuityTest",
  "statorSlots",
  "rotorSlots",
  "slotLength",
  "rotorBore",
  "coreLength",
  "stackHeight",
  "airGap",
  "totalCoilTurns",
  "turnsPerCoil",
  "coilPitch",
  "windingType",
  "windingConnection",
  "coilWireType",
  "wireGauge",
  "wireDiameter",
  "coilWeight",
  "totalCopperWeight",
  "insulationPaper",
  "slotInsulThick",
  "varnishType",
  "bakingTemp",
  "bakingTime",
  "startingCoilTurns",
  "runningCoilTurns",
  "startingCoilResistance",
  "runningCoilResistance",
  "startingCoilWeight",
  "runningCoilWeight",
  "capacitorType",
  "capacitorValue",
  "capacitorVoltage",
  "centrifugalSwitch",
  "lineVoltage",
  "phaseVoltage",
  "lineCurrent",
  "phaseCurrent",
  "starDeltaConn",
  "terminalMarkings",
  "shaftDiameter",
  "shaftLength",
  "bearingFront",
  "bearingRear",
  "coolingType",
  "fanType",
  "fanCoverType",
  "motorWeight",
  "bodyMaterial",
  "lastRewindDate",
  "rewindingBy",
  "oldCoilWeight",
  "newCoilWeight",
  "bearingChanged",
  "capacitorChanged",
  "testReport",
  "notes",
];

function openAddModal() {
  editingId = null;
  document.getElementById("mModalTitle").textContent =
    "➕ Add New Motor Record";
  FIELDS.forEach((f) => {
    const el = document.getElementById("f_" + f);
    if (el) {
      el.tagName === "SELECT" ? (el.value = "") : (el.value = "");
    }
  });
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
  const model = document.getElementById("f_modelNumber").value.trim();
  const phase = document.getElementById("f_phase").value;
  const type = document.getElementById("f_motorType").value;
  if (!brand || !model || !phase || !type) {
    showToast("Please fill required fields: Brand, Model, Phase, Type", "err");
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
  let updated;
  if (editingId) {
    updated = motors.map((m) => (m.id === editingId ? obj : m));
    showToast("✅ Motor updated successfully");
  } else {
    updated = [...motors, obj];
    showToast("✅ Motor added successfully");
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
    `${m.brand} — ${m.modelNumber || "Motor Detail"}`;
  document.getElementById("detailEditBtn").onclick = () => {
    closeDetail();
    openEditModal(id);
  };

  const sec = (title, icon, items) => `
    <div class="detail-section">
      <div class="detail-section-title"><span>${icon}</span>${title}</div>
      <div class="detail-grid">${items
        .filter(([l, v]) => v)
        .map(
          ([l, v]) => `
        <div class="detail-item"><div class="di-label">${l}</div><div class="di-val">${v}</div></div>`,
        )
        .join("")}
      </div>
    </div>`;

  document.getElementById("detailBody").innerHTML = `
    ${sec("Nameplate Details", "🏷️", [
      ["Brand", m.brand],
      ["Manufacturer", m.manufacturer],
      ["Model Number", m.modelNumber],
      ["Serial Number", m.serialNumber],
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
      ["Duty Type", m.dutyType],
      ["Insulation Class", m.insulationClass],
      ["IP Rating", m.ipRating],
      ["Power Factor", m.powerFactor],
      ["Efficiency", m.efficiency],
      ["Ambient Temp", m.ambientTemp],
      ["Service Factor", m.serviceFactor],
      ["Frame Size", m.frameSize],
      ["Mounting Type", m.mountingType],
      ["Country of Origin", m.countryOrigin],
      ["Mfg. Date", m.mfgDate],
    ])}
    ${sec("Electrical Specifications", "⚡", [
      ["Starting Current", m.startingCurrent],
      ["Running Current", m.runningCurrent],
      ["Locked Rotor Current", m.lockedRotorCurrent],
      ["Breakdown Torque", m.breakdownTorque],
      ["Full Load Torque", m.fullLoadTorque],
      ["Winding Res (R)", m.windingResR],
      ["Winding Res (Y)", m.windingResY],
      ["Winding Res (B)", m.windingResB],
      ["Megger Test", m.meggerTest],
      ["Continuity Test", m.continuityTest],
    ])}
    ${sec("Winding / Coil Details", "🔩", [
      ["Stator Slots", m.statorSlots],
      ["Rotor Slots", m.rotorSlots],
      ["Slot Length", m.slotLength],
      ["Rotor Bore Dia", m.rotorBore],
      ["Core Length", m.coreLength],
      ["Stack Height", m.stackHeight],
      ["Air Gap", m.airGap],
      ["Total Coil Turns", m.totalCoilTurns],
      ["Turns Per Coil", m.turnsPerCoil],
      ["Coil Pitch", m.coilPitch],
      ["Winding Type", m.windingType],
      ["Winding Connection", m.windingConnection],
      ["Wire Type", m.coilWireType],
      ["Wire Gauge (SWG)", m.wireGauge],
      ["Wire Diameter", m.wireDiameter],
      ["Coil Weight", m.coilWeight ? m.coilWeight + " kg" : ""],
      [
        "Total Copper Weight",
        m.totalCopperWeight ? m.totalCopperWeight + " kg" : "",
      ],
      ["Insulation Paper", m.insulationPaper],
      ["Slot Insulation", m.slotInsulThick],
      ["Varnish Type", m.varnishType],
      ["Baking Temp", m.bakingTemp],
      ["Baking Time", m.bakingTime],
    ])}
    ${
      m.phase === "Single"
        ? sec("Single Phase — Starting & Running Coil", "🔌", [
            ["Starting Coil Turns", m.startingCoilTurns],
            ["Running Coil Turns", m.runningCoilTurns],
            ["Starting Coil Resistance", m.startingCoilResistance],
            ["Running Coil Resistance", m.runningCoilResistance],
            [
              "Starting Coil Weight",
              m.startingCoilWeight ? m.startingCoilWeight + " kg" : "",
            ],
            [
              "Running Coil Weight",
              m.runningCoilWeight ? m.runningCoilWeight + " kg" : "",
            ],
            ["Capacitor Type", m.capacitorType],
            ["Capacitor Value", m.capacitorValue],
            ["Capacitor Voltage", m.capacitorVoltage],
            ["Centrifugal Switch", m.centrifugalSwitch],
          ])
        : ""
    }
    ${
      m.phase === "Three"
        ? sec("Three Phase Electrical Details", "⚡", [
            ["Line Voltage", m.lineVoltage],
            ["Phase Voltage", m.phaseVoltage],
            ["Line Current", m.lineCurrent],
            ["Phase Current", m.phaseCurrent],
            ["Star/Delta Connection", m.starDeltaConn],
            ["Terminal Markings", m.terminalMarkings],
          ])
        : ""
    }
    ${sec("Mechanical Details", "⚙️", [
      ["Shaft Diameter", m.shaftDiameter],
      ["Shaft Length", m.shaftLength],
      ["Bearing (Front)", m.bearingFront],
      ["Bearing (Rear)", m.bearingRear],
      ["Cooling Type", m.coolingType],
      ["Fan Type", m.fanType],
      ["Fan Cover", m.fanCoverType],
      ["Motor Weight", m.motorWeight ? m.motorWeight + " kg" : ""],
      ["Body Material", m.bodyMaterial],
    ])}
    ${sec("Repair & Service History", "🔧", [
      ["Last Rewind Date", m.lastRewindDate],
      ["Rewinding By", m.rewindingBy],
      ["Old Coil Weight", m.oldCoilWeight ? m.oldCoilWeight + " kg" : ""],
      ["New Coil Weight", m.newCoilWeight ? m.newCoilWeight + " kg" : ""],
      ["Bearing Changed", m.bearingChanged],
      ["Capacitor Changed", m.capacitorChanged],
      ["Test Report", m.testReport],
    ])}
    ${m.notes ? `<div class="detail-section"><div class="detail-section-title"><span>📝</span>Notes / Observations</div><div style="background:#f8fafd;border-radius:10px;padding:14px;color:var(--text);font-size:.9rem;border:1px solid var(--border)">${m.notes}</div></div>` : ""}
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
// DELETE
// ============================
let deleteId = null;
function openDeleteConfirm(id) {
  deleteId = id;
  const m = getMotors().find((x) => x.id === id);
  document.getElementById("confirmMsg").textContent =
    `"${m?.brand} ${m?.modelNumber}" will be permanently deleted.`;
  document.getElementById("confirmModal").style.display = "flex";
}
function closeConfirm() {
  document.getElementById("confirmModal").style.display = "none";
  deleteId = null;
}
function confirmDelete() {
  if (!deleteId) return;
  saveMotors(getMotors().filter((m) => m.id !== deleteId));
  closeConfirm();
  showToast("🗑️ Motor deleted");
  refreshAll();
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
    showToast("New password must be at least 6 characters", "err");
    return;
  }
  if (nw !== cn) {
    showToast("Passwords do not match", "err");
    return;
  }
  localStorage.setItem(LS_PASS, hashStr(nw));
  document.getElementById("curPass").value = "";
  document.getElementById("newPass").value = "";
  document.getElementById("conPass").value = "";
  showToast("✅ Password changed successfully");
}
function clearAllData() {
  if (
    confirm("Are you sure? This will delete ALL motor records permanently!")
  ) {
    localStorage.removeItem(LS_MOTORS);
    refreshAll();
    showToast("All data cleared", "warn");
  }
}

// ============================
// EXPORT
// ============================
function exportCSV() {
  const motors = getMotors();
  const headers = FIELDS;
  const rows = motors.map((m) =>
    headers
      .map((f) => `"${(m[f] || "").toString().replace(/"/g, '""')}"`)
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
  showToast("💾 JSON backup downloaded");
}
function printReport() {
  const motors = getMotors();
  const w = window.open("", "_blank");
  w.document.write(
    `<html><head><title>Shree Ram Electric Works – Motor Report</title><style>body{font-family:sans-serif;padding:20px;font-size:12px}h1{font-size:18px;margin-bottom:4px}h2{font-size:14px;color:#f4890a;margin:20px 0 8px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}th{background:#0d1b2a;color:#fff}tr:nth-child(even){background:#f5f5f5}.meta{color:#666;font-size:11px;margin-bottom:20px}</style></head><body><h1>⚡ Shree Ram Electric Works</h1><div class="meta">Motor Data Report · Generated: ${new Date().toLocaleString()} · Total Records: ${motors.length}</div><table><thead><tr><th>#</th><th>Brand</th><th>Model</th><th>HP</th><th>kW</th><th>RPM</th><th>Voltage</th><th>Current</th><th>Phase</th><th>Type</th><th>Gauge</th><th>Turns</th><th>Coil Wt</th><th>Last Rewind</th></tr></thead><tbody>${motors.map((m, i) => `<tr><td>${i + 1}</td><td>${m.brand || ""}</td><td>${m.modelNumber || ""}</td><td>${m.ratedPowerHP || ""}</td><td>${m.ratedPowerKW || ""}</td><td>${m.ratedRPM || ""}</td><td>${m.ratedVoltage || ""}</td><td>${m.ratedCurrent || ""}</td><td>${m.phase || ""}</td><td>${m.motorType || ""}</td><td>${m.wireGauge || ""}</td><td>${m.totalCoilTurns || ""}</td><td>${m.coilWeight || ""}</td><td>${m.lastRewindDate || ""}</td></tr>`).join("")}</tbody></table></body></html>`,
  );
  w.document.close();
  w.print();
}
function copyTable() {
  const motors = getMotors();
  const hdrs = [
    "Brand",
    "Model",
    "HP",
    "kW",
    "RPM",
    "Voltage",
    "Current",
    "Phase",
    "Type",
    "Wire Gauge",
    "Coil Turns",
    "Coil Weight",
  ];
  const rows = motors.map((m) =>
    [
      m.brand,
      m.modelNumber,
      m.ratedPowerHP,
      m.ratedPowerKW,
      m.ratedRPM,
      m.ratedVoltage,
      m.ratedCurrent,
      m.phase,
      m.motorType,
      m.wireGauge,
      m.totalCoilTurns,
      m.coilWeight,
    ].join("\t"),
  );
  navigator.clipboard
    .writeText([hdrs.join("\t"), ...rows].join("\n"))
    .then(() => showToast("📋 Table copied to clipboard"));
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
            <button class="btn btn-orange" onclick='importMerge(${JSON.stringify(data).replace(/'/g, "&#39;")})'>Merge</button>
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
    "toast" + (type === "err" ? " err" : type === "warn" ? " warn" : "");
  t.innerHTML =
    (type === "err" ? "❌ " : type === "warn" ? "⚠️ " : "✅ ") + msg;
  document.getElementById("toastWrap").appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(40px)";
    t.style.transition = ".3s";
    setTimeout(() => t.remove(), 300);
  }, 3500);
}
