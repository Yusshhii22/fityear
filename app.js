// ===== FitYear app: onboarding + dashboard UI =====

const STORE = {
  profile: "fityear_profile",
  progress: "fityear_progress",
};

const state = {
  profile: load(STORE.profile),
  progress: load(STORE.progress) || { completed: {}, weights: {}, currentWeek: 1 },
};

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

const $app = document.getElementById("app");

function render() {
  if (!state.profile) renderOnboarding();
  else renderDashboard();
}

/* ================= Onboarding ================= */

function renderOnboarding() {
  $app.innerHTML = `
    <div class="hero">
      <div class="logo">💪</div>
      <h1>FitYear</h1>
      <p class="muted">Answer a few questions and get your complete 1-year fitness journey —
      weekly workouts, meals and schedules, automatically planned and progressed for 52 weeks.</p>
    </div>
    <div class="card">
      <form id="onboard" class="form-grid">
        <label class="field"><span>Your name</span><input name="name" required placeholder="e.g. Ayush" /></label>
        <label class="field"><span>Age</span><input name="age" type="number" min="14" max="80" required placeholder="e.g. 27" /></label>
        <label class="field"><span>Height (cm)</span><input name="height" type="number" min="120" max="230" required placeholder="e.g. 172" /></label>
        <label class="field"><span>Weight (kg)</span><input name="weight" type="number" min="30" max="250" step="0.1" required placeholder="e.g. 74" /></label>

        <div class="field full"><span style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--muted)">Sex (for calorie calculation)</span>
          <div class="choice-row" data-name="sex">
            <div class="choice" data-val="male">Male</div>
            <div class="choice" data-val="female">Female</div>
          </div></div>

        <div class="field full"><span style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--muted)">Main goal</span>
          <div class="choice-row" data-name="goal">
            <div class="choice" data-val="lose">🔥 Lose fat</div>
            <div class="choice" data-val="gain">💪 Build muscle</div>
            <div class="choice" data-val="maintain">⚖️ Get fit & maintain</div>
          </div></div>

        <div class="field full"><span style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--muted)">Daily activity outside workouts</span>
          <div class="choice-row" data-name="activity">
            <div class="choice" data-val="sedentary">Desk job, little walking</div>
            <div class="choice" data-val="light">Some walking daily</div>
            <div class="choice" data-val="moderate">On my feet a lot</div>
            <div class="choice" data-val="very">Physically demanding</div>
          </div></div>

        <div class="field full"><span style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--muted)">Workout days per week</span>
          <div class="choice-row" data-name="days">
            <div class="choice" data-val="2">2</div>
            <div class="choice" data-val="3">3</div>
            <div class="choice" data-val="4">4</div>
            <div class="choice" data-val="5">5</div>
            <div class="choice" data-val="6">6</div>
          </div></div>

        <div class="field full"><span style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--muted)">Equipment available</span>
          <div class="choice-row" data-name="equipment">
            <div class="choice" data-val="none">🏠 None (bodyweight)</div>
            <div class="choice" data-val="home">🏋️ Dumbbells/bands at home</div>
            <div class="choice" data-val="gym">🏢 Full gym</div>
          </div></div>

        <div class="field full"><span style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--muted)">Diet preference</span>
          <div class="choice-row" data-name="diet">
            <div class="choice" data-val="veg">🥦 Vegetarian</div>
            <div class="choice" data-val="nonveg">🍗 Non-vegetarian</div>
            <div class="choice" data-val="vegan">🌱 Vegan</div>
          </div></div>

        <div class="full"><button type="submit" class="btn">Generate my 1-year plan →</button></div>
      </form>
    </div>`;

  // choice-group behavior
  $app.querySelectorAll(".choice-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      const opt = e.target.closest(".choice");
      if (!opt) return;
      row.querySelectorAll(".choice").forEach((c) => c.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });

  document.getElementById("onboard").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const choices = {};
    let missing = null;
    $app.querySelectorAll(".choice-row").forEach((row) => {
      const sel = row.querySelector(".choice.selected");
      if (!sel && !missing) missing = row;
      if (sel) choices[row.dataset.name] = sel.dataset.val;
    });
    if (missing) { missing.scrollIntoView({ behavior: "smooth", block: "center" }); missing.style.outline = "2px solid var(--accent)"; return; }

    state.profile = {
      name: f.name.value.trim(),
      age: +f.age.value,
      height: +f.height.value,
      weight: +f.weight.value,
      sex: choices.sex,
      goal: choices.goal,
      activity: choices.activity,
      days: +choices.days,
      equipment: choices.equipment,
      diet: choices.diet,
      startDate: new Date().toISOString().slice(0, 10),
    };
    state.progress = { completed: {}, weights: { 1: state.profile.weight }, currentWeek: 1 };
    save(STORE.profile, state.profile);
    save(STORE.progress, state.progress);
    render();
    window.scrollTo(0, 0);
  });
}

/* ================= Dashboard ================= */

function completionStats() {
  const totalDays = 52 * 7; // every day (training + rest) can be checked off
  const done = Object.values(state.progress.completed).filter(Boolean).length;
  const pct = (done / totalDays) * 100;
  return { done, totalDays, pct: pct > 0 && pct < 10 ? +pct.toFixed(1) : Math.round(pct) };
}

function renderDashboard() {
  const p = state.profile;
  const targets = calcTargets(p);
  const week = state.progress.currentWeek;
  const weekPlan = buildWeek(p, targets, week);
  const ph = weekPlan.phase;
  const comp = completionStats();

  const weekOptions = Array.from({ length: 52 }, (_, i) => {
    const w = i + 1;
    return `<option value="${w}" ${w === week ? "selected" : ""}>Week ${w} — ${phaseForWeek(w).name}</option>`;
  }).join("");

  $app.innerHTML = `
    <div class="topbar">
      <div>
        <h1>Hi ${esc(p.name)} 👋</h1>
        <div class="muted">${goalLabel(p.goal)} · ${p.days} workouts/week · started ${p.startDate}</div>
      </div>
      <button class="btn secondary" id="resetBtn">Edit profile</button>
    </div>

    <div class="stats">
      <div class="stat"><div class="val">${targets.calories}</div><div class="lbl">kcal / day target</div></div>
      <div class="stat"><div class="val">${targets.protein} g</div><div class="lbl">protein / day</div></div>
      <div class="stat"><div class="val">${targets.carbs}g C · ${targets.fat}g F</div><div class="lbl">carbs & fat / day</div></div>
      <div class="stat"><div class="val">${comp.pct}%</div><div class="lbl">${comp.done}/${comp.totalDays} days done<div class="progressbar"><div style="width:${comp.pct}%"></div></div></div></div>
    </div>

    <div class="phase-banner">
      <span class="name">Week ${week} · Phase: ${ph.name}</span> — ${ph.intensity}
      <div class="small" style="margin-top:4px">${ph.focus}</div>
    </div>

    <div class="weeknav">
      <button class="navbtn" id="prevWeek" ${week === 1 ? "disabled" : ""}>‹ Prev</button>
      <select id="weekSelect">${weekOptions}</select>
      <button class="navbtn" id="nextWeek" ${week === 52 ? "disabled" : ""}>Next ›</button>
    </div>

    ${weekPlan.days.map((d) => dayCard(d, week)).join("")}

    <h2 class="section-title">⚖️ Weekly weigh-in</h2>
    <div class="card">
      <div class="muted small" style="margin-bottom:8px">Log your weight once a week (same day, morning, empty stomach).</div>
      <div class="weight-row">
        <input id="weightInput" type="number" step="0.1" min="30" max="250" placeholder="kg" value="${state.progress.weights[week] ?? ""}" />
        <button class="btn tiny" id="saveWeight">Save for week ${week}</button>
      </div>
      <div class="chart-wrap">${weightChart()}</div>
    </div>

    <h2 class="section-title">🗺️ Your year at a glance</h2>
    <div class="card">
      ${yearMilestones(p).map((m) => `<div class="milestone"><div class="at">${m.at}</div><div>${m.text}</div></div>`).join("")}
    </div>

    <footer class="note muted small">${HYDRATION_TIP}<br/>This plan is a general guideline, not medical advice — check with a doctor before starting if you have health conditions.</footer>
  `;

  wireDashboard(week);
}

function dayCard(d, week) {
  const key = `w${week}d${d.dayIdx}`;
  const done = !!state.progress.completed[key];
  const tag = done
    ? `<span class="day-tag tag-done">✓ Done</span>`
    : d.isTraining
      ? `<span class="day-tag tag-train">Workout</span>`
      : `<span class="day-tag tag-rest">Rest</span>`;
  const sub = d.isTraining ? d.workout.label : "Recovery day";

  let body;
  if (d.isTraining) {
    body = `
      <div class="muted small">🔸 ${d.workout.warmup}</div>
      <div class="table-wrap"><table class="exercises">
        <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th></tr>
        ${d.workout.exercises.map((ex) => `
          <tr>
            <td><strong>${ex.name}</strong><div class="ex-note">${ex.note}</div></td>
            <td>${ex.sets}</td><td>${ex.reps}</td><td>${ex.rest}</td>
          </tr>`).join("")}
      </table></div>
      <div class="muted small">🔹 ${d.workout.cooldown}</div>`;
  } else {
    body = `<div style="font-size:14px">${d.restNote}</div>`;
  }

  return `
    <div class="card day-card" id="card-${key}">
      <div class="day-head" data-key="${key}">
        <div><div class="title">${d.dayName}</div><div class="sub">${sub}</div></div>
        ${tag}
      </div>
      <div class="day-body">
        ${body}
        <h3 style="margin-top:14px">🍽️ Meals (${state.profile ? calcTargets(state.profile).calories : ""} kcal target)</h3>
        <div class="meals">
          ${d.meals.map((m) => `<div class="meal"><div class="mtime">${m.time}</div>${m.name}<div class="mmacro">~${m.kcal} kcal · ${m.protein}g protein</div></div>`).join("")}
        </div>
        <div class="done-row">
          <input type="checkbox" id="chk-${key}" data-key="${key}" ${done ? "checked" : ""} />
          <label for="chk-${key}">Mark ${d.dayName} as completed</label>
        </div>
      </div>
    </div>`;
}

function wireDashboard(week) {
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Edit your profile? Your plan will regenerate (progress is kept).")) {
      state.profile = null;
      render();
    }
  });

  const go = (w) => { state.progress.currentWeek = w; save(STORE.progress, state.progress); renderDashboard(); window.scrollTo(0, 0); };
  document.getElementById("prevWeek").addEventListener("click", () => go(week - 1));
  document.getElementById("nextWeek").addEventListener("click", () => go(week + 1));
  document.getElementById("weekSelect").addEventListener("change", (e) => go(+e.target.value));

  document.querySelectorAll(".day-head").forEach((h) => {
    h.addEventListener("click", () => h.closest(".day-card").classList.toggle("open"));
  });

  document.querySelectorAll('input[type="checkbox"][data-key]').forEach((chk) => {
    chk.addEventListener("change", () => {
      state.progress.completed[chk.dataset.key] = chk.checked;
      save(STORE.progress, state.progress);
      const openIds = [...document.querySelectorAll(".day-card.open")].map((c) => c.id);
      const y = window.scrollY;
      renderDashboard();
      openIds.forEach((id) => document.getElementById(id)?.classList.add("open"));
      window.scrollTo(0, y);
    });
  });

  document.getElementById("saveWeight").addEventListener("click", () => {
    const v = parseFloat(document.getElementById("weightInput").value);
    if (!v) return;
    state.progress.weights[week] = v;
    save(STORE.progress, state.progress);
    renderDashboard();
  });
}

/* ---- simple SVG weight chart ---- */
function weightChart() {
  const entries = Object.entries(state.progress.weights)
    .map(([w, kg]) => [Number(w), Number(kg)])
    .sort((a, b) => a[0] - b[0]);
  if (entries.length < 2) return `<div class="muted small">Log weights over multiple weeks to see your trend here.</div>`;

  const W = 800, H = 120, pad = 24;
  const xs = entries.map((e) => e[0]), ys = entries.map((e) => e[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const ymin = Math.min(...ys) - 1, ymax = Math.max(...ys) + 1;
  const X = (w) => pad + ((w - xmin) / Math.max(xmax - xmin, 1)) * (W - 2 * pad);
  const Y = (kg) => H - pad - ((kg - ymin) / (ymax - ymin)) * (H - 2 * pad);
  const path = entries.map(([w, kg], i) => `${i ? "L" : "M"}${X(w).toFixed(1)},${Y(kg).toFixed(1)}`).join(" ");
  const dots = entries.map(([w, kg]) => `<circle cx="${X(w).toFixed(1)}" cy="${Y(kg).toFixed(1)}" r="3.5" fill="var(--accent)"><title>Week ${w}: ${kg} kg</title></circle>`).join("");
  const first = ys[0], last = ys[ys.length - 1];
  const delta = (last - first).toFixed(1);
  return `
    <div class="small muted">Weight trend: ${first} kg → ${last} kg (${delta > 0 ? "+" : ""}${delta} kg)</div>
    <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.5" />
      ${dots}
    </svg>`;
}

/* ---- helpers ---- */
function goalLabel(g) {
  return { lose: "🔥 Losing fat", gain: "💪 Building muscle", maintain: "⚖️ Getting fit" }[g];
}
function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

render();
