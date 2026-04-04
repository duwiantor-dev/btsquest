import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bts-quest-arena-rpg-v1";
const PLAYERS = ["JEJEN", "OLA", "JUMIO"];
const DAILY_EXP_PER_QUEST = 1080;
const APP_PASSWORD = "12345";

const defaultStores = [
  { pic_code: "JEJEN", team_code: "BGR05-RBP01", store_name: "GAMER ID BOGOR", platform: "TIKTOKSHOP", badge: "MALL", rating: 4.3, violation: 7 },
  { pic_code: "JEJEN", team_code: "BGR05-RCI01", store_name: "GAMER ID CILEUNGSI", platform: "TIKTOKSHOP", badge: "PM", rating: 4.5, violation: 16 },
  { pic_code: "JEJEN", team_code: "BGR05-RCM02", store_name: "LENOVO AUTHORIZED BOGOR", platform: "TIKTOKSHOP", badge: "MALL", rating: 4.5, violation: 0 },
  { pic_code: "JEJEN", team_code: "BGR05-RJD01", store_name: "BOGOR LAPTOP", platform: "TIKTOKSHOP", badge: "PM", rating: 4.4, violation: 0 },
  { pic_code: "JEJEN", team_code: "DPK05-RDD01", store_name: "AGRES ID ELECTRONICS", platform: "TIKTOKSHOP", badge: "MALL", rating: 3.6, violation: 0 },
  { pic_code: "OLA", team_code: "BDG05-RBA01", store_name: "NOTEBOOK MURAH ID", platform: "TIKTOKSHOP", badge: "MALL", rating: 4.5, violation: 0 },
  { pic_code: "OLA", team_code: "SBM05-RSB02", store_name: "AGRES ID SUKABUMI", platform: "TIKTOKSHOP", badge: "MALL", rating: 2.0, violation: 2 },
  { pic_code: "OLA", team_code: "SBY05-RSI03", store_name: "LAPTOP ONE ITC SBY", platform: "TIKTOKSHOP", badge: "MALL", rating: 4.3, violation: 0 },
  { pic_code: "OLA", team_code: "TNG05-RKI04", store_name: "MQG COMPUTER ID", platform: "TIKTOKSHOP", badge: "MALL", rating: 4.2, violation: 0 },
  { pic_code: "OLA", team_code: "KWG05-RKW01", store_name: "AGRES ID KARAWANG", platform: "TIKTOKSHOP", badge: "", rating: 3.8, violation: 0 },
  { pic_code: "JUMIO", team_code: "JKT05-RCG04", store_name: "VIVATECH STORE", platform: "TIKTOKSHOP", badge: "MALL", rating: 4.5, violation: 0 },
  { pic_code: "JUMIO", team_code: "JKT05-RHC09", store_name: "LAPTOP GADGET ID", platform: "TIKTOKSHOP", badge: "MALL", rating: 3.9, violation: 3 },
  { pic_code: "JUMIO", team_code: "JKT05-RMM13", store_name: "GAPTECH.ID", platform: "TIKTOKSHOP", badge: "MALL", rating: 0, violation: 16 },
  { pic_code: "JUMIO", team_code: "JKT05-RMM16", store_name: "NARUTO AMBAS", platform: "TIKTOKSHOP", badge: "PM", rating: 3.6, violation: 2 },
  { pic_code: "JUMIO", team_code: "JKT05-RMM17", store_name: "BASECOMTECH", platform: "TIKTOKSHOP", badge: "MALL", rating: 0, violation: 0 },
  { pic_code: "JEJEN", team_code: "BGR05-RBP01", store_name: "LAPTOP PAJAJARAN", platform: "SHOPEE", badge: "STAR", rating: 4.9, violation: 0 },
  { pic_code: "JEJEN", team_code: "BGR05-RCI01", store_name: "GAMER AUTHORIZED STORE BOGOR", platform: "SHOPEE", badge: "MALL", rating: 4.9, violation: 0 },
  { pic_code: "OLA", team_code: "BDG05-RBA04", store_name: "SIMURAH LAPTOP", platform: "SHOPEE", badge: "STAR+", rating: 5.0, violation: 0 },
  { pic_code: "OLA", team_code: "TNG05-RTC07", store_name: "COLLINS AUTHORIZED STORE TANGERANG", platform: "SHOPEE", badge: "", rating: 4.9, violation: 0 },
  { pic_code: "JUMIO", team_code: "JKT05-RGC03", store_name: "QUEEN.TECH PGC", platform: "SHOPEE", badge: "STAR+", rating: 4.9, violation: 0 },
  { pic_code: "JUMIO", team_code: "JKT05-RHC05", store_name: "KREDIMALL AGRES ID", platform: "SHOPEE", badge: "", rating: 0, violation: 0 },
  ...Array.from({ length: 39 }, (_, i) => ({
    pic_code: PLAYERS[i % 3],
    team_code: `AUTO-${i + 1}`,
    store_name: `TOKO AUTO ${i + 1}`,
    platform: i % 2 === 0 ? "TIKTOKSHOP" : "SHOPEE",
    badge: i % 3 === 0 ? "MALL" : i % 3 === 1 ? "STAR" : "PM",
    rating: 4.2,
    violation: 0,
  })),
];

const templateSeed = [
  { id: "tpl-daily-jejen", title: "Update Harga TikTok", description: "Daily quest khusus Jejen", questType: "daily", assignedMode: "single", assignedTo: "JEJEN", expReward: DAILY_EXP_PER_QUEST, levelReward: 0 },
  { id: "tpl-daily-ola", title: "Update Harga Shopee", description: "Daily quest khusus Ola", questType: "daily", assignedMode: "single", assignedTo: "OLA", expReward: DAILY_EXP_PER_QUEST, levelReward: 0 },
  { id: "tpl-daily-jumio", title: "Update Stok Karantina", description: "Daily quest khusus Jumio", questType: "daily", assignedMode: "single", assignedTo: "JUMIO", expReward: DAILY_EXP_PER_QUEST, levelReward: 0 },
  { id: "tpl-legal-1", title: "Sanggah Pelanggaran", description: "Legal quest default untuk semua PIC", questType: "legal", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
  { id: "tpl-legal-2", title: "Arsipkan postingan yang belum di approve LOA nya", description: "Legal quest default untuk semua PIC", questType: "legal", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
  { id: "tpl-weekly-badge", title: "Cek Badge", description: "Weekly quest aktif hari Selasa, deadline Rabu", questType: "weekly", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
  { id: "tpl-weekly-rating", title: "Cek Rating", description: "Weekly quest aktif hari Selasa, deadline Rabu", questType: "weekly", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
  { id: "tpl-weekly-violation", title: "Cek Violation", description: "Weekly quest aktif hari Selasa, deadline Rabu", questType: "weekly", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
  { id: "tpl-monthly-badge", title: "Cek Badge", description: "Monthly quest aktif saat akhir bulan", questType: "monthly", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
  { id: "tpl-monthly-rating", title: "Cek Rating", description: "Monthly quest aktif saat akhir bulan", questType: "monthly", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
  { id: "tpl-monthly-violation", title: "Cek Violation", description: "Monthly quest aktif saat akhir bulan", questType: "monthly", assignedMode: "all", assignedTo: null, expReward: 0, levelReward: 0 },
];

function formatNumber(num) {
  return Number(num || 0).toLocaleString("id-ID");
}

function makeId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;
}

function startOfTodayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function getWeeklyStatus() {
  const day = new Date().getDay();
  if (day < 2) return "locked"; // before Tuesday
  if (day === 2 || day === 3) return "available"; // Tue Wed
  return "expired"; // Thu onward
}

function getMonthlyStatus() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const startActive = Math.max(1, lastDay - 2); // last 3 days of month
  if (currentDay < startActive) return "locked";
  return "available";
}

function buildInitialQuestInstances() {
  const instances = [];
  templateSeed.forEach((tpl) => {
    if (tpl.assignedMode === "single") {
      instances.push({
        id: makeId("quest"),
        templateId: tpl.id,
        playerCode: tpl.assignedTo,
        title: tpl.title,
        description: tpl.description,
        questType: tpl.questType,
        expReward: tpl.expReward,
        levelReward: tpl.levelReward,
        status: tpl.questType === "daily" ? "available" : "locked",
        proofLink: "",
        submittedAt: null,
        reviewedAt: null,
        adminNote: "",
        createdAt: startOfTodayISO(),
        source: "system",
      });
    } else {
      PLAYERS.forEach((player) => {
        let status = "available";
        if (tpl.questType === "weekly") status = getWeeklyStatus();
        if (tpl.questType === "monthly") status = getMonthlyStatus();
        instances.push({
          id: makeId("quest"),
          templateId: tpl.id,
          playerCode: player,
          title: tpl.title,
          description: tpl.description,
          questType: tpl.questType,
          expReward: tpl.expReward,
          levelReward: tpl.levelReward,
          status,
          proofLink: "",
          submittedAt: null,
          reviewedAt: null,
          adminNote: "",
          createdAt: startOfTodayISO(),
          source: "system",
        });
      });
    }
  });
  return instances;
}

function defaultState() {
  return {
    auth: { role: null, name: "", password: "" },
    stores: defaultStores,
    salesRows: [],
    salesColumns: [],
    salesMapping: { picColumn: "", salesColumn: "", groupColumn: "" },
    questInstances: buildInitialQuestInstances(),
    questTemplates: templateSeed,
  };
}

function usePersistedState() {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...defaultState(), ...parsed });
      }
    } catch {
      setState(defaultState());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function canCountForProgress(status) {
  return status === "submitted" || status === "approved";
}

function getTypeLabel(type) {
  const map = {
    main: "Main Quest",
    daily: "Daily Quest",
    legal: "Legal Quest",
    relationship: "Relationship Quest",
    weekly: "Weekly Quest",
    monthly: "Monthly Quest",
  };
  return map[type] || type;
}

function sortQuestSections(list) {
  const order = { main: 1, daily: 2, legal: 3, relationship: 4, weekly: 5, monthly: 6 };
  return [...list].sort((a, b) => order[a.questType] - order[b.questType]);
}

function App() {
  const [state, setState] = usePersistedState();
  const [tab, setTab] = useState("dashboard");
  const [loginRole, setLoginRole] = useState("JEJEN");
  const [password, setPassword] = useState(APP_PASSWORD);
  const [loginError, setLoginError] = useState("");
  const [newQuest, setNewQuest] = useState({
    title: "",
    description: "",
    questType: "main",
    assignedTo: "ALL",
    expReward: 0,
    levelReward: 1,
  });
  const [selectedQuestId, setSelectedQuestId] = useState("");

  const me = state.auth?.role;
  const isAdmin = me === "ADMIN";

  const perPlayerStats = useMemo(() => {
    return PLAYERS.map((player) => {
      const owned = state.questInstances.filter((q) => q.playerCode === player && q.status !== "locked");
      const total = owned.length;
      const done = owned.filter((q) => canCountForProgress(q.status)).length;
      const progress = total ? Math.round((done / total) * 100) : 0;
      const dailyExp = state.questInstances
        .filter((q) => q.playerCode === player && q.questType === "daily" && canCountForProgress(q.status))
        .reduce((sum, q) => sum + (q.expReward || 0), 0);
      const mainLevel = state.questInstances
        .filter((q) => q.playerCode === player && q.questType === "main" && canCountForProgress(q.status))
        .reduce((sum, q) => sum + (q.levelReward || 0), 0);
      const level = Math.floor(dailyExp / (DAILY_EXP_PER_QUEST * 3 || 1)) + 1 + mainLevel;
      return { player, total, done, progress, dailyExp, level };
    }).sort((a, b) => b.progress - a.progress || b.dailyExp - a.dailyExp);
  }, [state.questInstances]);

  const currentPlayerStats = perPlayerStats.find((p) => p.player === me) || null;

  const visibleQuests = useMemo(() => {
    if (!me) return [];
    const target = isAdmin ? state.questInstances : state.questInstances.filter((q) => q.playerCode === me);
    return sortQuestSections(target);
  }, [state.questInstances, me, isAdmin]);

  const groupedQuests = useMemo(() => {
    const result = { main: [], daily: [], legal: [], relationship: [], weekly: [], monthly: [] };
    visibleQuests.forEach((q) => {
      if (!result[q.questType]) result[q.questType] = [];
      result[q.questType].push(q);
    });
    return result;
  }, [visibleQuests]);

  useEffect(() => {
    if (!visibleQuests.length) {
      setSelectedQuestId("");
      return;
    }
    if (!selectedQuestId || !visibleQuests.some((q) => q.id === selectedQuestId)) {
      setSelectedQuestId(visibleQuests[0].id);
    }
  }, [visibleQuests, selectedQuestId]);

  const selectedQuest = useMemo(() => visibleQuests.find((q) => q.id === selectedQuestId) || visibleQuests[0] || null, [visibleQuests, selectedQuestId]);

  const salesSummary = useMemo(() => {
    const { salesRows, salesMapping } = state;
    if (!salesRows.length || !salesMapping.picColumn || !salesMapping.salesColumn) return [];
    const map = new Map();
    salesRows.forEach((row) => {
      const rawPic = String(row[salesMapping.picColumn] || "").toUpperCase();
      const matched = PLAYERS.find((p) => rawPic.includes(p));
      if (!matched) return;
      const sales = Number(String(row[salesMapping.salesColumn] || 0).replace(/[^0-9.-]/g, "")) || 0;
      const group = salesMapping.groupColumn ? String(row[salesMapping.groupColumn] || "-") : "-";
      if (!map.has(matched)) map.set(matched, { pic: matched, totalSales: 0, rows: 0, groups: new Set() });
      const item = map.get(matched);
      item.totalSales += sales;
      item.rows += 1;
      if (group && group !== "-") item.groups.add(group);
    });
    return Array.from(map.values())
      .map((item) => ({ ...item, groups: Array.from(item.groups).join(", ") || "-" }))
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [state]);

  function login() {
    if (password !== APP_PASSWORD) {
      setLoginError("Password test salah. Pakai 12345");
      return;
    }
    setState((prev) => ({ ...prev, auth: { role: loginRole, name: loginRole, password: "" } }));
    setLoginError("");
    setTab(loginRole === "ADMIN" ? "admin" : "dashboard");
  }

  function logout() {
    setState((prev) => ({ ...prev, auth: { role: null, name: "", password: "" } }));
    setTab("dashboard");
  }

  function updateQuest(id, patch) {
    setState((prev) => ({
      ...prev,
      questInstances: prev.questInstances.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));
  }

  function submitQuest(id, proofLink) {
    updateQuest(id, { status: "submitted", proofLink, submittedAt: new Date().toISOString() });
  }

  function reviewQuest(id, status) {
    updateQuest(id, { status, reviewedAt: new Date().toISOString() });
  }

  function addAdminQuest() {
    if (!newQuest.title.trim()) return;
    const targets = newQuest.assignedTo === "ALL" ? PLAYERS : [newQuest.assignedTo];
    const additions = targets.map((player) => ({
      id: makeId("quest"),
      templateId: makeId("tpl"),
      playerCode: player,
      title: newQuest.title.trim(),
      description: newQuest.description.trim(),
      questType: newQuest.questType,
      expReward: Number(newQuest.expReward) || 0,
      levelReward: Number(newQuest.levelReward) || 0,
      status: newQuest.questType === "weekly" ? getWeeklyStatus() : newQuest.questType === "monthly" ? getMonthlyStatus() : "available",
      proofLink: "",
      submittedAt: null,
      reviewedAt: null,
      adminNote: "",
      createdAt: new Date().toISOString(),
      source: "admin",
    }));
    setState((prev) => ({ ...prev, questInstances: [...additions, ...prev.questInstances] }));
    setNewQuest({ title: "", description: "", questType: "main", assignedTo: "ALL", expReward: 0, levelReward: 1 });
  }

  function deleteQuest(id) {
    setState((prev) => ({ ...prev, questInstances: prev.questInstances.filter((q) => q.id !== id) }));
  }

  function handleStoreCsv(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      const rows = parseCSV(text);
      const stores = rows.map((r) => ({
        pic_code: String(r.BTS || r.PIC || "").toUpperCase(),
        team_code: r.TEAM || "",
        store_name: r["NAMA TOKO"] || r.store_name || "",
        platform: r.PLATFORM || "",
        badge: r.BADGE || "",
        rating: Number(r.RATING || 0) || 0,
        violation: Number(r.VIOLATION || 0) || 0,
        campaign_link: r.CAMPAIGN || "",
        sanggah_link: r.SANGGAH || "",
        approve_merk_link: r["APPROVE MERK"] || "",
        kol_terbuka_link: r["KOL TERBUKA"] || "",
        kol_target_link: r["KOL TARGET"] || "",
      })).filter((r) => r.store_name);
      setState((prev) => ({ ...prev, stores }));
    };
    reader.readAsText(file);
  }

  function handleSalesCsv(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      const rows = parseCSV(text);
      const columns = rows.length ? Object.keys(rows[0]) : [];
      setState((prev) => ({
        ...prev,
        salesRows: rows,
        salesColumns: columns,
        salesMapping: {
          picColumn: columns[0] || "",
          salesColumn: columns[1] || "",
          groupColumn: columns[2] || "",
        },
      }));
    };
    reader.readAsText(file);
  }

  function updateStoreField(index, key, value) {
    setState((prev) => ({
      ...prev,
      stores: prev.stores.map((store, i) => (i === index ? { ...store, [key]: value } : store)),
    }));
  }

  if (!me) {
    return (
      <div style={styles.page}>
        <style>{globalCss}</style>
        <div style={styles.loginWrap}>
          <div style={styles.loginCard}>
            <div style={styles.loginIcon}>🎮</div>
            <h1 style={styles.loginTitle}>Teyvat Quest Board</h1>
            <p style={styles.loginSub}>UI direstyle dengan nuansa fantasy journal ala Genshin.</p>
            <label style={styles.label}>Login sebagai</label>
            <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)} style={styles.input}>
              <option value="ADMIN">ADMIN</option>
              <option value="JEJEN">JEJEN</option>
              <option value="OLA">OLA</option>
              <option value="JUMIO">JUMIO</option>
            </select>
            <label style={styles.label}>Password test</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} type="password" placeholder="12345" />
            {loginError ? <div style={styles.error}>{loginError}</div> : null}
            <button onClick={login} style={styles.mainButton}>Masuk</button>
            <div style={styles.note}>Password test: <strong>12345</strong></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{globalCss}</style>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.logoCard}>
            <div style={styles.logoOrb}>⚔️</div>
            <div>
              <div style={styles.brand}>Teyvat Quest Board</div>
              <div style={styles.muted}>{isAdmin ? "Admin Control" : `${me} - Player`}</div>
            </div>
          </div>

          {!isAdmin && currentPlayerStats && (
            <div style={styles.sidePanel}>
              <div style={styles.panelLabel}>Player Progress</div>
              <div style={styles.levelValue}>LV {currentPlayerStats.level}</div>
              <div style={styles.progressText}>{currentPlayerStats.progress}%</div>
              <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${currentPlayerStats.progress}%` }} /></div>
              <div style={styles.muted}>{currentPlayerStats.done}/{currentPlayerStats.total} quest dengan SS terkirim</div>
              <div style={styles.muted}>Daily EXP: {formatNumber(currentPlayerStats.dailyExp)}</div>
            </div>
          )}

          {isAdmin && (
            <div style={styles.sidePanel}>
              <div style={styles.panelLabel}>Team Overview</div>
              {perPlayerStats.map((row) => (
                <div key={row.player} style={styles.sideRow}>
                  <span>{row.player}</span>
                  <span>{row.progress}%</span>
                </div>
              ))}
            </div>
          )}

          <div style={styles.sidePanel}>
            <div style={styles.panelLabel}>Menu</div>
            {[
              [isAdmin ? "admin" : "dashboard", isAdmin ? "Admin Dashboard" : "Dashboard"],
              ["quests", "Quest Board"],
              ["stores", "Daftar Toko"],
              ["sales", "Achievement Sales"],
              ...(isAdmin ? [["manage", "Manage Quest"]] : []),
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={tab === key ? styles.menuActive : styles.menuBtn}>{label}</button>
            ))}
          </div>

          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </aside>

        <main style={styles.mainArea}>
          {!isAdmin && tab === "dashboard" && currentPlayerStats && (
            <>
              <section style={styles.heroCard}>
                <div>
                  <div style={styles.heroTitle}>Adventurer Commission - {me}</div>
                  <div style={styles.heroSub}>Progress dihitung dari SS yang dikirim PIC. Main Quest tampil paling atas kalau ada.</div>
                </div>
                <div style={styles.heroStats}>
                  <StatBox title="Progress" value={`${currentPlayerStats.progress}%`} sub={`${currentPlayerStats.done}/${currentPlayerStats.total} quest`} />
                  <StatBox title="Daily EXP" value={formatNumber(currentPlayerStats.dailyExp)} sub={`1 quest = ${formatNumber(DAILY_EXP_PER_QUEST)} exp`} />
                  <StatBox title="Level" value={`LV ${currentPlayerStats.level}`} sub="Main Quest memberi bonus level" />
                </div>
              </section>

              <section style={styles.panel}>
                <div style={styles.panelTitle}>Leaderboard PIC</div>
                <div style={styles.cardGrid3}>
                  {perPlayerStats.map((row, idx) => (
                    <div key={row.player} style={styles.playerCard}>
                      <div style={styles.rankPill}>#{idx + 1}</div>
                      <div style={styles.playerName}>{row.player}</div>
                      <div style={styles.muted}>LV {row.level}</div>
                      <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${row.progress}%` }} /></div>
                      <div style={styles.muted}>{row.progress}% • {row.done}/{row.total} quest</div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {isAdmin && tab === "admin" && (
            <>
              <section style={styles.heroCard}>
                <div>
                  <div style={styles.heroTitle}>Admin Dashboard</div>
                  <div style={styles.heroSub}>Monitor progress per personil, review quest submitted, dan tambah mission mendadak.</div>
                </div>
                <div style={styles.heroStats}>
                  <StatBox title="Total Quest" value={String(state.questInstances.length)} sub="Semua instance quest" />
                  <StatBox title="Submitted" value={String(state.questInstances.filter((q) => q.status === "submitted").length)} sub="Menunggu review" />
                  <StatBox title="Approved" value={String(state.questInstances.filter((q) => q.status === "approved").length)} sub="Sudah valid" />
                </div>
              </section>

              <section style={styles.panel}>
                <div style={styles.panelTitle}>Progress Per PIC</div>
                <div style={styles.cardGrid3}>
                  {perPlayerStats.map((row, idx) => (
                    <div key={row.player} style={styles.playerCard}>
                      <div style={styles.rankPill}>#{idx + 1}</div>
                      <div style={styles.playerName}>{row.player}</div>
                      <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${row.progress}%` }} /></div>
                      <div style={styles.muted}>Progress {row.progress}%</div>
                      <div style={styles.muted}>Submitted/Approved {row.done}/{row.total}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={styles.panel}>
                <div style={styles.panelTitle}>Pending Review</div>
                {state.questInstances.filter((q) => q.status === "submitted").length === 0 ? (
                  <div style={styles.empty}>Belum ada quest submitted.</div>
                ) : (
                  state.questInstances.filter((q) => q.status === "submitted").map((quest) => (
                    <QuestCard key={quest.id} quest={quest} adminMode onApprove={() => reviewQuest(quest.id, "approved")} onReject={() => reviewQuest(quest.id, "rejected")} />
                  ))
                )}
              </section>
            </>
          )}

          {tab === "quests" && (
            <QuestArchiveScreen
              groupedQuests={groupedQuests}
              selectedQuest={selectedQuest}
              onSelectQuest={setSelectedQuestId}
              me={me}
              isAdmin={isAdmin}
              onSubmit={submitQuest}
              onApprove={reviewQuest}
              onDelete={deleteQuest}
              playerStats={currentPlayerStats}
            />
          )}

          {tab === "stores" && (
            <section style={styles.panel}>
              <div style={styles.panelTitle}>Daftar Toko</div>
              <div style={styles.panelSub}>Data toko dari master sheet yang kamu kirim. Bisa diedit dan upload CSV untuk replace data.</div>
              {isAdmin && (
                <div style={styles.uploadRow}>
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleStoreCsv(e.target.files[0])} />
                </div>
              )}
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['PIC','TEAM','NAMA TOKO','PLATFORM','BADGE','RATING','VIOLATION'].map((head) => <th key={head} style={styles.th}>{head}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {state.stores
                      .filter((store) => isAdmin || store.pic_code === me)
                      .map((store, index) => (
                        <tr key={`${store.team_code}-${index}`}>
                          <td style={styles.td}>{isAdmin ? <select style={styles.smallInput} value={store.pic_code} onChange={(e) => updateStoreField(index, "pic_code", e.target.value)}>{PLAYERS.map((p) => <option key={p}>{p}</option>)}</select> : store.pic_code}</td>
                          <td style={styles.td}>{isAdmin ? <input style={styles.smallInput} value={store.team_code} onChange={(e) => updateStoreField(index, "team_code", e.target.value)} /> : store.team_code}</td>
                          <td style={styles.td}>{isAdmin ? <input style={styles.smallInput} value={store.store_name} onChange={(e) => updateStoreField(index, "store_name", e.target.value)} /> : store.store_name}</td>
                          <td style={styles.td}>{isAdmin ? <input style={styles.smallInput} value={store.platform} onChange={(e) => updateStoreField(index, "platform", e.target.value)} /> : store.platform}</td>
                          <td style={styles.td}>{isAdmin ? <input style={styles.smallInput} value={store.badge} onChange={(e) => updateStoreField(index, "badge", e.target.value)} /> : store.badge}</td>
                          <td style={styles.td}>{isAdmin ? <input style={styles.smallInput} value={store.rating} onChange={(e) => updateStoreField(index, "rating", e.target.value)} /> : store.rating}</td>
                          <td style={styles.td}>{isAdmin ? <input style={styles.smallInput} value={store.violation} onChange={(e) => updateStoreField(index, "violation", e.target.value)} /> : store.violation}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "sales" && (
            <section style={styles.panel}>
              <div style={styles.panelTitle}>Achievement Sales Dashboard</div>
              <div style={styles.panelSub}>Upload CSV sales untuk leaderboard penjualan per PIC atau grup.</div>
              {isAdmin && (
                <div style={styles.uploadRow}>
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleSalesCsv(e.target.files[0])} />
                </div>
              )}
              {isAdmin && state.salesColumns.length > 0 && (
                <div style={styles.mappingRow}>
                  <select style={styles.input} value={state.salesMapping.picColumn} onChange={(e) => setState((prev) => ({ ...prev, salesMapping: { ...prev.salesMapping, picColumn: e.target.value } }))}>
                    {state.salesColumns.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <select style={styles.input} value={state.salesMapping.salesColumn} onChange={(e) => setState((prev) => ({ ...prev, salesMapping: { ...prev.salesMapping, salesColumn: e.target.value } }))}>
                    {state.salesColumns.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <select style={styles.input} value={state.salesMapping.groupColumn} onChange={(e) => setState((prev) => ({ ...prev, salesMapping: { ...prev.salesMapping, groupColumn: e.target.value } }))}>
                    <option value="">Tidak dipakai</option>
                    {state.salesColumns.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div style={styles.cardGrid3}>
                {PLAYERS.map((player) => {
                  const row = salesSummary.find((s) => s.pic === player);
                  return (
                    <div key={player} style={styles.playerCard}>
                      <div style={styles.playerName}>{player}</div>
                      <div style={styles.metricBig}>{formatNumber(row?.totalSales || 0)}</div>
                      <div style={styles.muted}>Rows: {row?.rows || 0}</div>
                      <div style={styles.muted}>Group: {row?.groups || "-"}</div>
                    </div>
                  );
                })}
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Rank</th>
                      <th style={styles.th}>PIC</th>
                      <th style={styles.th}>Sales</th>
                      <th style={styles.th}>Rows</th>
                      <th style={styles.th}>Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesSummary.length === 0 ? (
                      <tr><td style={styles.td} colSpan="5">Belum ada data sales.</td></tr>
                    ) : salesSummary.map((row, idx) => (
                      <tr key={row.pic}>
                        <td style={styles.td}>#{idx + 1}</td>
                        <td style={styles.td}>{row.pic}</td>
                        <td style={styles.td}>{formatNumber(row.totalSales)}</td>
                        <td style={styles.td}>{row.rows}</td>
                        <td style={styles.td}>{row.groups}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {isAdmin && tab === "manage" && (
            <section style={styles.panel}>
              <div style={styles.panelTitle}>Manage Quest</div>
              <div style={styles.panelSub}>Tambah Main Quest, Relationship Quest, atau quest mendadak lain untuk dites.</div>
              <div style={styles.formGrid}>
                <input style={styles.input} placeholder="Judul quest" value={newQuest.title} onChange={(e) => setNewQuest((p) => ({ ...p, title: e.target.value }))} />
                <select style={styles.input} value={newQuest.questType} onChange={(e) => setNewQuest((p) => ({ ...p, questType: e.target.value }))}>
                  <option value="main">Main Quest</option>
                  <option value="relationship">Relationship Quest</option>
                  <option value="legal">Legal Quest</option>
                  <option value="weekly">Weekly Quest</option>
                  <option value="monthly">Monthly Quest</option>
                </select>
                <select style={styles.input} value={newQuest.assignedTo} onChange={(e) => setNewQuest((p) => ({ ...p, assignedTo: e.target.value }))}>
                  <option value="ALL">ALL</option>
                  {PLAYERS.map((p) => <option key={p}>{p}</option>)}
                </select>
                <input style={styles.input} type="number" placeholder="EXP Reward" value={newQuest.expReward} onChange={(e) => setNewQuest((p) => ({ ...p, expReward: e.target.value }))} />
                <input style={styles.input} type="number" placeholder="Level Reward" value={newQuest.levelReward} onChange={(e) => setNewQuest((p) => ({ ...p, levelReward: e.target.value }))} />
              </div>
              <textarea style={styles.textarea} placeholder="Deskripsi quest" value={newQuest.description} onChange={(e) => setNewQuest((p) => ({ ...p, description: e.target.value }))} />
              <div style={styles.actionsRow}>
                <button onClick={addAdminQuest} style={styles.mainButton}>Tambah Quest</button>
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={styles.panelTitle}>Semua Quest Instance</div>
                {sortQuestSections(state.questInstances).map((quest) => (
                  <QuestCard key={quest.id} quest={quest} adminMode compact onApprove={() => reviewQuest(quest.id, "approved")} onReject={() => reviewQuest(quest.id, "rejected")} onDelete={() => deleteQuest(quest.id)} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function QuestArchiveScreen({ groupedQuests, selectedQuest, onSelectQuest, me, isAdmin, onSubmit, onApprove, onDelete, playerStats }) {
  const sections = [
    ["main", "Main Quests", "Archon-style quest prioritas tinggi"],
    ["daily", "Daily Commissions", "Quest job/class khusus masing-masing PIC"],
    ["legal", "World Quests", "Default quest untuk semua PIC"],
    ["relationship", "Relationship Quests", "Quest tambahan dari admin"],
    ["weekly", "Weekly Requests", "Aktif terbatas di hari tertentu"],
    ["monthly", "Monthly Commissions", "Muncul saat akhir bulan"],
  ].filter(([key]) => groupedQuests[key]?.length);

  return (
    <section style={styles.questScreen}>
      <aside style={styles.questSidebar}>
        <div style={styles.questSidebarHeader}>
          <div style={styles.questSidebarEyebrow}>In Progress</div>
          <div style={styles.questSidebarTitle}>Quest Journal</div>
          <div style={styles.questSidebarSub}>{isAdmin ? "Semua quest team" : `Traveler: ${me}`}</div>
        </div>

        {sections.map(([key, label, sub]) => (
          <div key={key} style={styles.questListSection}>
            <div style={styles.questListLabel}>{label}</div>
            <div style={styles.questListSub}>{sub}</div>
            <div style={styles.questListStack}>
              {groupedQuests[key].map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => onSelectQuest(quest.id)}
                  style={{
                    ...styles.questListItem,
                    ...(selectedQuest?.id === quest.id ? styles.questListItemActive : {}),
                  }}
                >
                  <div style={styles.questListItemTop}>
                    <span>{quest.title}</span>
                    <span style={styles.questDistance}>{quest.playerCode}</span>
                  </div>
                  <div style={styles.questListItemSub}>{quest.description || "Tanpa deskripsi"}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <div style={styles.questDetailShell}>
        <div style={styles.questTopBar}>
          <div style={styles.questTopBarLeft}>
            <span style={styles.controlPill}>L1</span>
            <span style={styles.controlPill}>Quest View</span>
          </div>
          <div style={styles.controlPill}>Completed</div>
        </div>

        {selectedQuest ? (
          <QuestDetailPanel
            quest={selectedQuest}
            me={me}
            adminMode={isAdmin}
            onSubmit={onSubmit}
            onApprove={onApprove}
            onDelete={onDelete}
            playerStats={playerStats}
          />
        ) : (
          <div style={styles.panel}>Belum ada quest.</div>
        )}
      </div>
    </section>
  );
}

function QuestDetailPanel({ quest, me, adminMode, onSubmit, onApprove, onDelete, playerStats }) {
  const badge = statusBadgeStyles[quest.status] || statusBadgeStyles.available;
  const typeStyle = typeBadgeStyles[quest.questType] || typeBadgeStyles.daily;
  const showConflict = quest.status === "locked" || quest.status === "expired";
  const questSubtitleMap = {
    main: "Ikuti objective utama untuk membuka progress berikutnya.",
    daily: "Commission harian untuk progress dan EXP.",
    legal: "Objective wajib yang berlaku untuk tim terkait.",
    relationship: "Request tambahan dari admin / mentor.",
    weekly: "Quest mingguan dengan waktu aktif terbatas.",
    monthly: "Quest bulanan yang muncul menjelang akhir periode.",
  };

  return (
    <div style={styles.questDetailPanel}>
      <div style={styles.questBackdropGlow} />
      <div style={styles.questHeaderWide}>
        <div>
          <div style={styles.questHeaderEyebrow}>One for the Foodies, Two for the Show</div>
          <div style={styles.questHeaderTitle}>{quest.title}</div>
          <div style={styles.questHeaderSub}>{quest.description || questSubtitleMap[quest.questType]}</div>
        </div>
        <div style={styles.questHeaderMeta}>
          <span style={{ ...styles.typeBadge, background: typeStyle.bg, color: typeStyle.color }}>{getTypeLabel(quest.questType)}</span>
          <span style={{ ...styles.typeBadge, background: badge.bg, color: badge.color }}>{quest.status.toUpperCase()}</span>
          <span style={styles.playerChip}>{quest.playerCode}</span>
        </div>
      </div>

      <div style={styles.questObjective}>
        <div style={styles.questObjectiveTitle}>Go to Wangshu Inn and look for Smiley Yanxiao</div>
        <div style={styles.questObjectiveText}>
          Versi app ini sudah dibuat lebih mirip layar quest Genshin: kiri untuk daftar quest, kanan untuk detail quest aktif, dan area objective dibuat lebar penuh supaya tidak terasa sempit lagi.
        </div>
      </div>

      <div style={styles.questRewardBar}>
        <div style={styles.questRewardLabel}>Check Rewards</div>
        <div style={styles.rewardItems}>
          <span style={styles.rewardPill}>✦ {formatNumber(quest.expReward)}</span>
          <span style={styles.rewardPill}>📘 {quest.levelReward > 0 ? `Level +${quest.levelReward}` : "Standard Quest"}</span>
          <span style={styles.rewardPill}>◎ {playerStats ? `LV ${playerStats.level}` : "Team Quest"}</span>
        </div>
      </div>

      <QuestCard
        quest={quest}
        me={me}
        adminMode={adminMode}
        onSubmit={(proof) => onSubmit(quest.id, proof)}
        onApprove={() => onApprove(quest.id, "approved")}
        onReject={() => onApprove(quest.id, "rejected")}
        onDelete={() => onDelete(quest.id)}
        wide
      />

      {showConflict ? (
        <div style={styles.questWarning}>
          <div style={styles.questWarningTitle}>The quest location is currently involved in the quest "A Dish Beyond Mortal Ken". Please complete it first.</div>
          <div style={styles.questWarningText}>
            {quest.playerCode} masih belum bisa menyelesaikan quest ini karena status sekarang <strong>{quest.status}</strong>. Kalau mau, status quest bisa diubah dari admin supaya popup warning ini hilang.
          </div>
        </div>
      ) : null}
    </div>
  );
}

function QuestCard({ quest, me, adminMode, onSubmit, onApprove, onReject, onDelete, compact = false, wide = false }) {
  const [proof, setProof] = useState(quest.proofLink || "");
  const disabled = quest.status === "locked" || quest.status === "expired";
  const badge = statusBadgeStyles[quest.status] || statusBadgeStyles.available;
  const typeStyle = typeBadgeStyles[quest.questType] || typeBadgeStyles.daily;

  return (
    <div style={{ ...styles.questCard, ...(wide ? styles.questCardWide : {}), ...(quest.questType === "main" ? styles.mainQuestGlow : {}) }}>
      <div style={styles.questHeader}>
        <div style={{ flex: 1 }}>
          <div style={styles.questTopLine}>
            <span style={{ ...styles.typeBadge, background: typeStyle.bg, color: typeStyle.color }}>{getTypeLabel(quest.questType)}</span>
            <span style={{ ...styles.typeBadge, background: badge.bg, color: badge.color }}>{quest.status.toUpperCase()}</span>
            <span style={styles.playerChip}>{quest.playerCode}</span>
          </div>
          <div style={styles.questTitle}>{quest.title}</div>
          <div style={styles.questDesc}>{quest.description || "Tanpa deskripsi"}</div>
          <div style={styles.questReward}>EXP {formatNumber(quest.expReward)} {quest.levelReward > 0 ? `• Level +${quest.levelReward}` : ""}</div>
        </div>
        {adminMode && (
          <div style={styles.adminActionCol}>
            {quest.status === "submitted" && <button onClick={onApprove} style={styles.approveBtn}>Approve</button>}
            {quest.status === "submitted" && <button onClick={onReject} style={styles.rejectBtn}>Reject</button>}
            <button onClick={onDelete} style={styles.deleteBtn}>Hapus</button>
          </div>
        )}
      </div>

      {!adminMode && (
        <div style={styles.proofWrap}>
          <input
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            style={styles.input}
            placeholder={disabled ? "Quest belum aktif / sudah expired" : "Masukkan link screenshot"}
            disabled={disabled || quest.status === "submitted" || quest.status === "approved"}
          />
          <button
            onClick={() => onSubmit(proof)}
            style={disabled || !proof || quest.status === "submitted" || quest.status === "approved" ? styles.disabledBtn : styles.mainButtonSmall}
            disabled={disabled || !proof || quest.status === "submitted" || quest.status === "approved"}
          >
            Kirim SS
          </button>
        </div>
      )}

      {quest.proofLink ? (
        <div style={styles.linkRow}>
          <a href={quest.proofLink} target="_blank" rel="noreferrer" style={styles.linkPill}>Buka Bukti</a>
          {quest.submittedAt ? <span style={styles.muted}>Submitted: {new Date(quest.submittedAt).toLocaleString("id-ID")}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

function StatBox({ title, value, sub }) {
  return (
    <div style={styles.statBox}>
      <div style={styles.panelLabel}>{title}</div>
      <div style={styles.metricBig}>{value}</div>
      <div style={styles.muted}>{sub}</div>
    </div>
  );
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = (cols[i] || "").trim();
    });
    return obj;
  });
}

function splitCSVLine(line) {
  const out = [];
  let current = "";
  let insideQuote = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      insideQuote = !insideQuote;
    } else if (ch === "," && !insideQuote) {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

const statusBadgeStyles = {
  locked: { bg: "rgba(171,181,198,.14)", color: "#d5d9e2" },
  available: { bg: "rgba(142,181,145,.18)", color: "#d9f0d4" },
  submitted: { bg: "rgba(128,164,190,.18)", color: "#d5ebf8" },
  approved: { bg: "rgba(152,188,146,.18)", color: "#effce2" },
  rejected: { bg: "rgba(164,113,107,.18)", color: "#ffd9d5" },
  expired: { bg: "rgba(132,127,122,.18)", color: "#e0d9d1" },
};

const typeBadgeStyles = {
  main: { bg: "rgba(214,188,124,.18)", color: "#fff0c4" },
  daily: { bg: "rgba(134,180,197,.18)", color: "#daf3f9" },
  legal: { bg: "rgba(219,185,121,.18)", color: "#ffe5aa" },
  relationship: { bg: "rgba(190,147,177,.18)", color: "#f8deee" },
  weekly: { bg: "rgba(200,149,106,.18)", color: "#ffd9b2" },
  monthly: { bg: "rgba(132,145,193,.18)", color: "#dfe5ff" },
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #73a8d6 0%, #3f6d98 20%, #20314c 52%, #111a29 100%)",
    color: "#f5eedc",
    fontFamily: '"Georgia", "Times New Roman", serif',
    padding: 18,
    position: "relative",
    overflow: "hidden",
  },
  layout: {
    maxWidth: 1880,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "330px minmax(0, 1fr)",
    gap: 20,
    position: "relative",
    zIndex: 1,
  },
  sidebar: {
    background: "linear-gradient(180deg, rgba(22,35,54,.88), rgba(14,24,40,.84))",
    border: "1px solid rgba(255,232,187,.34)",
    borderRadius: 28,
    padding: 18,
    height: "fit-content",
    position: "sticky",
    top: 20,
    boxShadow: "0 24px 60px rgba(7,12,24,.35), inset 0 1px 0 rgba(255,255,255,.12)",
    backdropFilter: "blur(12px)",
  },
  mainArea: { display: "flex", flexDirection: "column", gap: 20 },
  logoCard: { display: "flex", gap: 14, alignItems: "center", marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,227,168,.18)" },
  logoOrb: { width: 58, height: 58, borderRadius: 20, display: "grid", placeItems: "center", background: "radial-gradient(circle at 30% 30%, #fff6d8 0%, #e2bf73 38%, #8a6b33 100%)", fontSize: 26, boxShadow: "0 0 0 2px rgba(255,235,193,.22), 0 10px 24px rgba(25,16,4,.35)" },
  brand: { fontWeight: 700, fontSize: 24, letterSpacing: .3, color: "#fff4d7" },
  muted: { color: "#c9d0dc", fontSize: 13, fontFamily: "Inter, system-ui, sans-serif" },
  sidePanel: { background: "linear-gradient(180deg, rgba(244,235,215,.12), rgba(27,39,59,.38))", borderRadius: 22, padding: 14, marginBottom: 14, border: "1px solid rgba(255,231,186,.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.09)" },
  panelLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.8, color: "#f0d497", marginBottom: 8, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700 },
  levelValue: { fontSize: 38, fontWeight: 700, marginBottom: 4, color: "#fff6df" },
  progressText: { fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#fff2cb" },
  progressTrack: { width: "100%", height: 12, borderRadius: 999, background: "rgba(255,255,255,.09)", overflow: "hidden", border: "1px solid rgba(255,233,201,.16)" },
  progressFill: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#f6e7b2,#e4c471,#96d5df)", boxShadow: "0 0 18px rgba(248,219,137,.28)" },
  sideRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,231,186,.08)", fontFamily: "Inter, system-ui, sans-serif" },
  menuBtn: { width: "100%", textAlign: "left", padding: "13px 14px", marginBottom: 10, borderRadius: 16, border: "1px solid rgba(255,226,171,.16)", background: "linear-gradient(180deg, rgba(21,33,52,.72), rgba(16,25,39,.82))", color: "#f0e6d2", cursor: "pointer", fontWeight: 700, fontFamily: "Inter, system-ui, sans-serif", boxShadow: "inset 0 1px 0 rgba(255,255,255,.05)" },
  menuActive: { width: "100%", textAlign: "left", padding: "13px 14px", marginBottom: 10, borderRadius: 16, border: "1px solid rgba(255,227,167,.42)", background: "linear-gradient(90deg, rgba(241,219,155,.96), rgba(200,230,239,.92))", color: "#273349", cursor: "pointer", fontWeight: 900, fontFamily: "Inter, system-ui, sans-serif", boxShadow: "0 10px 24px rgba(248,214,124,.16)" },
  logoutBtn: { width: "100%", padding: 12, borderRadius: 14, border: "1px solid rgba(255,211,170,.2)", background: "linear-gradient(180deg, rgba(123,58,48,.95), rgba(91,34,31,.95))", color: "#fff1e8", fontWeight: 800, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  heroCard: { background: "linear-gradient(135deg, rgba(29,45,69,.82), rgba(19,31,49,.7))", borderRadius: 30, padding: 18, border: "1px solid rgba(255,232,188,.26)", boxShadow: "0 22px 50px rgba(10,14,22,.3), inset 0 1px 0 rgba(255,255,255,.08)", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" },
  heroTitle: { fontSize: 36, fontWeight: 700, marginBottom: 8, color: "#fff5df" },
  heroSub: { color: "#d7dce6", marginBottom: 16, lineHeight: 1.6, fontFamily: "Inter, system-ui, sans-serif" },
  heroStats: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14 },
  statBox: { background: "linear-gradient(180deg, rgba(255,255,255,.08), rgba(20,32,50,.45))", borderRadius: 22, padding: 16, border: "1px solid rgba(255,232,187,.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.05)" },
  metricBig: { fontSize: 30, fontWeight: 700, color: "#fff4d1" },
  panel: { background: "linear-gradient(180deg, rgba(28,43,67,.82), rgba(18,29,46,.75))", borderRadius: 28, padding: 20, border: "1px solid rgba(255,232,187,.26)", boxShadow: "0 18px 44px rgba(9,13,22,.28), inset 0 1px 0 rgba(255,255,255,.06)", backdropFilter: "blur(10px)" },
  panelTitle: { fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#fff1cf" },
  panelSub: { color: "#d1d7e2", marginBottom: 18, fontFamily: "Inter, system-ui, sans-serif" },
  cardGrid3: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16 },
  playerCard: { position: "relative", background: "linear-gradient(180deg, rgba(245,237,219,.08), rgba(18,29,47,.62))", borderRadius: 24, padding: 18, border: "1px solid rgba(255,229,176,.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.05)" },
  rankPill: { position: "absolute", top: 12, right: 12, padding: "5px 10px", borderRadius: 999, background: "rgba(245,215,136,.18)", color: "#ffe8af", fontWeight: 800, fontSize: 12, fontFamily: "Inter, system-ui, sans-serif", border: "1px solid rgba(255,235,187,.16)" },
  playerName: { fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#fff0c8" },
  questBoard: { display: "flex", flexDirection: "column", gap: 20 },
  questCard: { background: "linear-gradient(180deg, rgba(253,248,237,.08), rgba(21,34,54,.68))", borderRadius: 22, padding: 18, border: "1px solid rgba(255,228,173,.18)", marginBottom: 14, boxShadow: "inset 0 1px 0 rgba(255,255,255,.05)" },
  mainQuestGlow: { boxShadow: "0 0 0 1px rgba(255,228,171,.16), 0 0 32px rgba(255,221,148,.14)", border: "1px solid rgba(255,224,156,.42)", background: "linear-gradient(180deg, rgba(255,245,220,.14), rgba(34,46,66,.72))" },
  questHeader: { display: "flex", gap: 18, justifyContent: "space-between" },
  questTopLine: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 },
  typeBadge: { padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, border: "1px solid rgba(255,255,255,.08)", fontFamily: "Inter, system-ui, sans-serif" },
  playerChip: { padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, background: "rgba(255,250,236,.08)", color: "#f5ebd6", border: "1px solid rgba(255,227,168,.14)", fontFamily: "Inter, system-ui, sans-serif" },
  questTitle: { fontSize: 28, fontWeight: 700, marginBottom: 4, color: "#fff0c9" },
  questDesc: { color: "#d8dee8", lineHeight: 1.55, marginBottom: 8, fontFamily: "Inter, system-ui, sans-serif" },
  questReward: { color: "#f6dfa2", fontWeight: 800, fontFamily: "Inter, system-ui, sans-serif" },
  proofWrap: { display: "grid", gridTemplateColumns: "1fr 140px", gap: 12, marginTop: 16 },
  input: { width: "100%", background: "rgba(13,21,34,.78)", color: "#f8f1df", border: "1px solid rgba(255,231,186,.18)", borderRadius: 14, padding: "12px 14px", outline: "none", boxShadow: "inset 0 1px 0 rgba(255,255,255,.03)", fontFamily: "Inter, system-ui, sans-serif" },
  smallInput: { width: "100%", background: "rgba(13,21,34,.78)", color: "#f8f1df", border: "1px solid rgba(255,231,186,.18)", borderRadius: 10, padding: "8px 10px", outline: "none", fontFamily: "Inter, system-ui, sans-serif" },
  textarea: { width: "100%", minHeight: 88, background: "rgba(13,21,34,.78)", color: "#f8f1df", border: "1px solid rgba(255,231,186,.18)", borderRadius: 14, padding: 14, resize: "vertical", fontFamily: "Inter, system-ui, sans-serif" },
  mainButton: { background: "linear-gradient(90deg,#f0d797,#f7e8c8,#b8dce7)", color: "#253247", border: "1px solid rgba(255,244,214,.65)", borderRadius: 14, padding: "12px 18px", fontWeight: 900, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", boxShadow: "0 10px 24px rgba(248,214,123,.18)" },
  mainButtonSmall: { background: "linear-gradient(90deg,#f0d797,#f7e8c8,#b8dce7)", color: "#253247", border: "1px solid rgba(255,244,214,.65)", borderRadius: 14, padding: "12px 18px", fontWeight: 900, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  disabledBtn: { background: "rgba(88,97,113,.55)", color: "#c0c6d2", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 18px", fontWeight: 800, fontFamily: "Inter, system-ui, sans-serif" },
  approveBtn: { background: "linear-gradient(180deg,#5e8d71,#416656)", border: "1px solid rgba(209,235,205,.18)", color: "#f2fff2", borderRadius: 12, padding: "10px 12px", fontWeight: 800, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  rejectBtn: { background: "linear-gradient(180deg,#905b59,#6f3f3c)", border: "1px solid rgba(255,217,214,.15)", color: "white", borderRadius: 12, padding: "10px 12px", fontWeight: 800, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  deleteBtn: { background: "linear-gradient(180deg,#764545,#562d2d)", border: "1px solid rgba(255,214,214,.15)", color: "white", borderRadius: 12, padding: "10px 12px", fontWeight: 800, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  adminActionCol: { display: "flex", flexDirection: "column", gap: 8, minWidth: 110 },
  linkRow: { display: "flex", gap: 12, alignItems: "center", marginTop: 12, flexWrap: "wrap" },
  linkPill: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: 999, background: "rgba(241,219,155,.14)", color: "#ffefc0", textDecoration: "none", fontWeight: 800, border: "1px solid rgba(255,235,193,.14)", fontFamily: "Inter, system-ui, sans-serif" },
  tableWrap: { overflowX: "auto", borderRadius: 18, border: "1px solid rgba(255,232,187,.14)" },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: "Inter, system-ui, sans-serif" },
  th: { textAlign: "left", padding: 12, borderBottom: "1px solid rgba(255,232,187,.16)", color: "#f1d79c", fontSize: 13, background: "rgba(255,255,255,.03)" },
  td: { padding: 12, borderBottom: "1px solid rgba(255,255,255,.06)", color: "#e9edf5" },
  uploadRow: { marginBottom: 16 },
  mappingRow: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 16 },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 12, marginBottom: 12 },
  actionsRow: { display: "flex", justifyContent: "flex-end", marginTop: 12 },
  empty: { color: "#c7ced8", padding: "10px 0", fontFamily: "Inter, system-ui, sans-serif" },
  loginWrap: { minHeight: "100vh", display: "grid", placeItems: "center", position: "relative", zIndex: 1 },
  loginCard: { width: "100%", maxWidth: 480, background: "linear-gradient(180deg, rgba(32,47,73,.88), rgba(17,28,45,.84))", padding: 28, borderRadius: 30, border: "1px solid rgba(255,232,188,.3)", boxShadow: "0 26px 64px rgba(6,12,24,.35), inset 0 1px 0 rgba(255,255,255,.08)", backdropFilter: "blur(14px)" },
  loginIcon: { width: 76, height: 76, borderRadius: 24, background: "radial-gradient(circle at 30% 30%, #fff6d8 0%, #eccb83 40%, #8d6f3c 100%)", display: "grid", placeItems: "center", fontSize: 32, marginBottom: 18, color: "#243247", boxShadow: "0 12px 30px rgba(25,16,4,.32)" },
  loginTitle: { fontSize: 38, margin: 0, marginBottom: 6, color: "#fff4d6", fontWeight: 700 },
  loginSub: { color: "#d8dee9", marginBottom: 18, fontFamily: "Inter, system-ui, sans-serif" },
  label: { display: "block", marginBottom: 8, color: "#f7e6bd", fontWeight: 700, fontFamily: "Inter, system-ui, sans-serif" },
  error: { marginTop: 10, marginBottom: 10, background: "rgba(140,71,67,.28)", color: "#ffe1da", padding: 10, borderRadius: 12, fontFamily: "Inter, system-ui, sans-serif", border: "1px solid rgba(255,217,214,.12)" },
  note: { marginTop: 14, color: "#cdd3de", fontSize: 13, fontFamily: "Inter, system-ui, sans-serif" },
};

  questScreen: { display: "grid", gridTemplateColumns: "380px minmax(0, 1fr)", gap: 20, minHeight: "calc(100vh - 80px)" },
  questSidebar: { background: "linear-gradient(180deg, rgba(29,41,59,.88), rgba(12,19,31,.92))", borderRadius: 28, padding: 18, border: "1px solid rgba(255,228,173,.2)", boxShadow: "0 18px 48px rgba(8,12,22,.35), inset 0 1px 0 rgba(255,255,255,.05)", overflow: "auto" },
  questSidebarHeader: { paddingBottom: 14, marginBottom: 16, borderBottom: "1px solid rgba(255,228,173,.14)" },
  questSidebarEyebrow: { color: "#f0d79b", fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", fontFamily: "Inter, system-ui, sans-serif", marginBottom: 8 },
  questSidebarTitle: { fontSize: 34, lineHeight: 1.05, color: "#fff2d1", fontWeight: 700 },
  questSidebarSub: { marginTop: 8, color: "#c7d2df", fontFamily: "Inter, system-ui, sans-serif" },
  questListSection: { marginBottom: 18 },
  questListLabel: { color: "#f6e0af", fontSize: 14, fontWeight: 800, marginBottom: 4, fontFamily: "Inter, system-ui, sans-serif" },
  questListSub: { color: "#9fb0c2", fontSize: 12, marginBottom: 10, fontFamily: "Inter, system-ui, sans-serif" },
  questListStack: { display: "flex", flexDirection: "column", gap: 8 },
  questListItem: { width: "100%", textAlign: "left", background: "linear-gradient(180deg, rgba(255,255,255,.04), rgba(11,18,29,.46))", color: "#eff3f9", border: "1px solid rgba(255,228,173,.08)", borderRadius: 16, padding: "12px 14px", cursor: "pointer", boxShadow: "inset 0 1px 0 rgba(255,255,255,.03)" },
  questListItemActive: { background: "linear-gradient(180deg, rgba(255,242,210,.18), rgba(42,58,84,.75))", color: "#fff2d1", border: "1px solid rgba(255,228,173,.26)", boxShadow: "0 0 0 1px rgba(255,228,173,.08), 0 10px 30px rgba(0,0,0,.18)" },
  questListItemTop: { display: "flex", justifyContent: "space-between", gap: 10, fontWeight: 800, fontSize: 14, marginBottom: 6, fontFamily: "Inter, system-ui, sans-serif" },
  questDistance: { color: "#e9d59a", fontSize: 11, letterSpacing: .5 },
  questListItemSub: { color: "#b8c2d2", fontSize: 12, lineHeight: 1.4, fontFamily: "Inter, system-ui, sans-serif" },
  questDetailShell: { minWidth: 0, display: "flex", flexDirection: "column", gap: 14 },
  questTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff2d1", padding: "0 10px" },
  questTopBarLeft: { display: "flex", gap: 10, alignItems: "center" },
  controlPill: { padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,228,173,.14)", fontSize: 12, fontFamily: "Inter, system-ui, sans-serif" },
  questDetailPanel: { position: "relative", minHeight: 760, padding: 30, borderRadius: 30, border: "1px solid rgba(255,228,173,.2)", background: "linear-gradient(180deg, rgba(66,104,150,.52), rgba(25,39,63,.78) 28%, rgba(11,18,31,.96) 100%)", boxShadow: "0 24px 60px rgba(6,10,18,.42), inset 0 1px 0 rgba(255,255,255,.08)", overflow: "hidden" },
  questBackdropGlow: { position: "absolute", inset: 0, background: "radial-gradient(circle at 65% 20%, rgba(255,255,255,.18), transparent 24%), radial-gradient(circle at 70% 70%, rgba(121,171,225,.18), transparent 22%)", pointerEvents: "none" },
  questHeaderWide: { position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start", marginBottom: 22 },
  questHeaderEyebrow: { color: "#e0c88e", fontSize: 16, marginBottom: 10, fontWeight: 700 },
  questHeaderTitle: { fontSize: 46, lineHeight: 1.04, color: "#fff5db", marginBottom: 10 },
  questHeaderSub: { maxWidth: 900, color: "#d5deea", fontSize: 16, lineHeight: 1.7, fontFamily: "Inter, system-ui, sans-serif" },
  questHeaderMeta: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" },
  questObjective: { position: "relative", zIndex: 1, marginBottom: 18, padding: "18px 20px", borderRadius: 22, background: "linear-gradient(180deg, rgba(255,255,255,.07), rgba(14,23,37,.46))", border: "1px solid rgba(255,228,173,.14)" },
  questObjectiveTitle: { color: "#fff1c9", fontSize: 18, marginBottom: 8, fontWeight: 800, fontFamily: "Inter, system-ui, sans-serif" },
  questObjectiveText: { color: "#d4dce8", lineHeight: 1.65, fontFamily: "Inter, system-ui, sans-serif" },
  questRewardBar: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, padding: "12px 4px" },
  questRewardLabel: { color: "#f0d9a0", fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 800, fontFamily: "Inter, system-ui, sans-serif" },
  rewardItems: { display: "flex", gap: 10, flexWrap: "wrap" },
  rewardPill: { display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 999, background: "rgba(255,245,215,.1)", border: "1px solid rgba(255,228,173,.16)", color: "#fff0c8", fontWeight: 800, fontFamily: "Inter, system-ui, sans-serif" },
  questCardWide: { position: "relative", zIndex: 1, marginBottom: 0, padding: 22, borderRadius: 24 },
  questWarning: { position: "relative", zIndex: 1, maxWidth: 620, margin: "28px auto 0", padding: "16px 18px", borderRadius: 18, background: "linear-gradient(180deg, rgba(28,40,61,.96), rgba(17,24,37,.96))", border: "1px solid rgba(255,228,173,.3)", textAlign: "center", boxShadow: "0 18px 44px rgba(0,0,0,.34)" },
  questWarningTitle: { color: "#fff4d5", fontWeight: 800, lineHeight: 1.5, marginBottom: 8, fontFamily: "Inter, system-ui, sans-serif" },
  questWarningText: { color: "#d7deea", lineHeight: 1.6, fontFamily: "Inter, system-ui, sans-serif" },
const globalCss = `
  * { box-sizing: border-box; }
  html, body, #root { min-height: 100%; }
  body {
    margin: 0;
    background:
      radial-gradient(circle at 15% 15%, rgba(255,242,205,.22), transparent 24%),
      radial-gradient(circle at 80% 10%, rgba(180,224,243,.18), transparent 20%),
      linear-gradient(180deg, #8dbfe0 0%, #537ea8 22%, #22324c 58%, #101723 100%);
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(255,255,255,.18), transparent 22%),
      radial-gradient(circle at 50% 72%, rgba(255,229,160,.10), transparent 24%),
      radial-gradient(circle at 50% 24%, rgba(255,255,255,.14), transparent 30%);
    opacity: .95;
  }
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(120deg, transparent 0%, rgba(255,255,255,.05) 45%, transparent 70%),
      linear-gradient(0deg, rgba(255,255,255,.02), rgba(255,255,255,0));
    mix-blend-mode: screen;
  }
  input, select, textarea, button { font: inherit; }
  a { color: inherit; }
  @media (max-width: 1200px) {
    div[style*="grid-template-columns: 330px minmax(0, 1fr)"],
    div[style*="grid-template-columns: 320px 1fr"],
    div[style*="grid-template-columns: 290px 1fr"],
    section[style*="grid-template-columns: 380px minmax(0, 1fr)"] { grid-template-columns: 1fr !important; }
    div[style*="grid-template-columns: repeat(3, minmax(0,1fr))"] { grid-template-columns: 1fr !important; }
    div[style*="grid-template-columns: repeat(5, minmax(0,1fr))"] { grid-template-columns: 1fr !important; }
    div[style*="grid-template-columns: 1fr 140px"] { grid-template-columns: 1fr !important; }
  }
`;

export default App;
