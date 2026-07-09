// ===== FitYear app: onboarding + Today / Plan / Progress tabs =====

const STORE = {
  profile: "fityear_profile",
  progress: "fityear_progress",
};

const state = {
  profile: load(STORE.profile),
  progress: load(STORE.progress) || { completed: {}, weights: {}, currentWeek: 1 },
  ui: { tab: "today", chartEx: null },
};

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// Profiles created before the experience level existed default to beginner.
if (state.profile && !state.profile.experience) {
  state.profile.experience = "beginner";
  save(STORE.profile, state.profile);
}

const $app = document.getElementById("app");

function getTargets() {
  return calcTargets(state.profile, state.progress.calorieDelta || 0);
}

/* ================= Gamification ================= */

const LEVELS = ["Rookie", "Starter", "Regular", "Committed", "Disciplined", "Athlete", "Machine", "Beast", "Legend", "Icon"];
const XP_PER_LEVEL = 300;

function xpStats() {
  const done = Object.values(state.progress.completed).filter(Boolean).length;
  const lifts = Object.values(state.progress.lifts || {}).reduce((s, arr) => s + arr.length, 0);
  const weighIns = Object.keys(state.progress.weights || {}).length;
  const xp = done * 25 + lifts * 5 + weighIns * 15;
  const level = Math.min(Math.floor(xp / XP_PER_LEVEL), LEVELS.length - 1);
  return { done, lifts, weighIns, xp, level, levelName: LEVELS[level], toNext: Math.min(1, (xp % XP_PER_LEVEL) / XP_PER_LEVEL) };
}

function streaks() {
  const checked = (w, d) => !!state.progress.completed[`w${w}d${d}`];
  let current = 0, max = 0, run = 0, lastIdx = -1;
  for (let i = 0; i < 364; i++) {
    const w = Math.floor(i / 7) + 1, d = i % 7;
    if (checked(w, d)) { run++; max = Math.max(max, run); lastIdx = i; }
    else run = 0;
  }
  for (let i = lastIdx; i >= 0; i--) {
    if (checked(Math.floor(i / 7) + 1, i % 7)) current++;
    else break;
  }
  return { current, max };
}

const BADGES = [
  { icon: "🎯", name: "First Step", desc: "Complete your first day", test: (s) => s.done >= 1 },
  { icon: "📅", name: "Week Warrior", desc: "Complete 7 days", test: (s) => s.done >= 7 },
  { icon: "🔥", name: "On Fire", desc: "Hit a 7-day streak", test: (s) => s.maxStreak >= 7 },
  { icon: "⚡", name: "Unstoppable", desc: "Hit a 30-day streak", test: (s) => s.maxStreak >= 30 },
  { icon: "🏋️", name: "Iron Logger", desc: "Log 10 top sets", test: (s) => s.lifts >= 10 },
  { icon: "⚖️", name: "Data Driven", desc: "Do 4 weekly check-ins", test: (s) => s.weighIns >= 4 },
  { icon: "💪", name: "Half Century", desc: "Complete 50 days", test: (s) => s.done >= 50 },
  { icon: "🏆", name: "Century Club", desc: "Complete 100 days", test: (s) => s.done >= 100 },
];

function badgeState() {
  const x = xpStats();
  const s = { ...x, maxStreak: streaks().max };
  return BADGES.map((b) => ({ ...b, unlocked: b.test(s) }));
}

// Small celebratory emoji burst when a day is completed.
function confetti() {
  const bits = ["🎉", "💪", "🔥", "⭐", "✨"];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement("span");
    el.className = "confetti";
    el.textContent = bits[i % bits.length];
    el.style.left = 42 + Math.random() * 16 + "%";
    el.style.setProperty("--dx", (Math.random() * 2 - 1) * 160 + "px");
    el.style.setProperty("--delay", Math.random() * 0.15 + "s");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}

/* ================= Today helpers ================= */

function todayInfo() {
  const start = new Date(state.profile.startDate + "T00:00:00");
  const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
  const finished = days > 363;
  const dayNum = Math.min(days, 363);
  return { dayNum: dayNum + 1, week: Math.floor(dayNum / 7) + 1, dayIdx: dayNum % 7, finished };
}

/* ================= Render root ================= */

function render() {
  if (!state.profile) { renderOnboarding(); return; }
  const tab = state.ui.tab;
  $app.innerHTML = `
    <div id="view"></div>
    <nav class="tabbar">
      ${[["today", "☀️", "Today"], ["plan", "📅", "Plan"], ["progress", "📈", "Progress"]].map(([id, icon, label]) => `
        <button class="tab ${tab === id ? "active" : ""}" data-tab="${id}"><span class="ticon">${icon}</span>${label}</button>`).join("")}
    </nav>`;
  $app.querySelectorAll(".tab").forEach((b) =>
    b.addEventListener("click", () => { state.ui.tab = b.dataset.tab; render(); window.scrollTo(0, 0); }));
  if (tab === "today") renderToday();
  else if (tab === "plan") renderPlan();
  else renderProgress();
}

const $view = () => document.getElementById("view");

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

        <div class="field full"><span class="flabel">Sex (for calorie calculation)</span>
          <div class="choice-row" data-name="sex">
            <div class="choice" data-val="male">Male</div>
            <div class="choice" data-val="female">Female</div>
          </div></div>

        <div class="field full"><span class="flabel">Main goal</span>
          <div class="choice-row" data-name="goal">
            <div class="choice" data-val="lose">🔥 Lose fat</div>
            <div class="choice" data-val="gain">💪 Build muscle</div>
            <div class="choice" data-val="maintain">⚖️ Get fit & maintain</div>
          </div></div>

        <div class="field full"><span class="flabel">Training experience</span>
          <div class="choice-row" data-name="experience">
            <div class="choice" data-val="newbie">🌱 Newbie<br /><span class="small muted">never trained</span></div>
            <div class="choice" data-val="beginner">🙂 Beginner<br /><span class="small muted">&lt; 1 year</span></div>
            <div class="choice" data-val="intermediate">💪 Intermediate<br /><span class="small muted">1–3 years</span></div>
            <div class="choice" data-val="advanced">🔥 Advanced<br /><span class="small muted">3–5 years</span></div>
            <div class="choice" data-val="athlete">🏆 Athlete<br /><span class="small muted">5+ years</span></div>
          </div></div>

        <div class="field full"><span class="flabel">Daily activity outside workouts</span>
          <div class="choice-row" data-name="activity">
            <div class="choice" data-val="sedentary">Desk job, little walking</div>
            <div class="choice" data-val="light">Some walking daily</div>
            <div class="choice" data-val="moderate">On my feet a lot</div>
            <div class="choice" data-val="very">Physically demanding</div>
          </div></div>

        <div class="field full"><span class="flabel">Workout days per week</span>
          <div class="choice-row" data-name="days">
            <div class="choice" data-val="2">2</div>
            <div class="choice" data-val="3">3</div>
            <div class="choice" data-val="4">4</div>
            <div class="choice" data-val="5">5</div>
            <div class="choice" data-val="6">6</div>
          </div></div>

        <div class="field full"><span class="flabel">Equipment available</span>
          <div class="choice-row" data-name="equipment">
            <div class="choice" data-val="none">🏠 None (bodyweight)</div>
            <div class="choice" data-val="home">🏋️ Dumbbells/bands at home</div>
            <div class="choice" data-val="gym">🏢 Full gym</div>
          </div></div>

        <div class="field full"><span class="flabel">Diet preference</span>
          <div class="choice-row" data-name="diet">
            <div class="choice" data-val="veg">🥦 Vegetarian</div>
            <div class="choice" data-val="nonveg">🍗 Non-vegetarian</div>
            <div class="choice" data-val="vegan">🌱 Vegan</div>
          </div></div>

        <div class="full"><button type="submit" class="btn">Generate my 1-year plan →</button></div>
      </form>
    </div>`;

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

    const existing = state.profile;
    state.profile = {
      name: f.name.value.trim(),
      age: +f.age.value,
      height: +f.height.value,
      weight: +f.weight.value,
      sex: choices.sex,
      goal: choices.goal,
      experience: choices.experience,
      activity: choices.activity,
      days: +choices.days,
      equipment: choices.equipment,
      diet: choices.diet,
      startDate: existing?.startDate || new Date().toISOString().slice(0, 10),
    };
    if (!existing) state.progress = { completed: {}, weights: { 1: state.profile.weight }, currentWeek: 1 };
    save(STORE.profile, state.profile);
    save(STORE.progress, state.progress);
    render();
    window.scrollTo(0, 0);
  });
}

/* ================= Voice logging (Web Speech API) ================= */

const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const VOICE_OK = !!SpeechRec;

const WORD_NUMS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
};

function wordsToDigits(text) {
  return text
    .replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-]+(one|two|three|four|five|six|seven|eight|nine)\b/g,
      (_, t, u) => WORD_NUMS[t] + WORD_NUMS[u])
    .replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\b/g,
      (w) => WORD_NUMS[w]);
}

// "3 sets of 10 at 45 kg" / "45 kilos for ten" / "12 reps" → { kg, reps }
function parseLift(raw) {
  let t = ` ${wordsToDigits(raw.toLowerCase())} `.replace(/[×*]|\bx\b/g, " x ");
  t = t.replace(/(\d+)\s*sets?\s*(?:of)?/g, " "); // we log the top set; set count is noise
  let kg = null, reps = null;

  const kgM = t.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kgs|kilos?|kilograms?)/);
  if (kgM) { kg = parseFloat(kgM[1].replace(",", ".")); t = t.replace(kgM[0], " "); }

  const repM = t.match(/(\d+)\s*(?:reps?|repetitions?|times)/) || t.match(/(?:for|x)\s+(\d+)/);
  if (repM) { reps = parseInt(repM[1], 10); t = t.replace(repM[0], " "); }

  if (kg === null) {
    const atM = t.match(/(?:at|with)\s+(\d+(?:[.,]\d+)?)/);
    if (atM) { kg = parseFloat(atM[1].replace(",", ".")); t = t.replace(atM[0], " "); }
  }
  if (/body\s*weight/.test(t)) kg = kg ?? 0;

  // whatever numbers remain, in the order people naturally speak: weight first, reps second
  const left = (t.match(/\d+(?:\.\d+)?/g) || []).map(Number);
  if (reps === null && kg !== null && left.length === 1) reps = Math.round(left[0]);
  else if (reps === null && kg === null && left.length === 2) { kg = left[0]; reps = Math.round(left[1]); }
  else if (reps === null && kg === null && left.length === 1) { kg = 0; reps = Math.round(left[0]); }

  if (reps === null || reps < 1 || reps > 100) return null;
  kg = kg ?? 0;
  if (kg < 0 || kg > 500) return null;
  return { kg, reps };
}

function voiceFeedback(box, msg) {
  const fb = box.querySelector(".voice-feedback");
  fb.textContent = msg;
  fb.classList.add("show");
}

function applyVoiceTranscript(box, week, rerender, transcript) {
  const parsed = parseLift(transcript);
  if (!parsed) {
    voiceFeedback(box, `Heard “${transcript}” — couldn't find the reps. Try “45 kg, 10 reps”.`);
    return false;
  }
  box.querySelector(".kg").value = parsed.kg || "";
  box.querySelector(".reps").value = parsed.reps;
  const ex = box.dataset.ex;
  logSet(box, week, rerender);
  toast(`🎤 Logged ${parsed.kg > 0 ? `${parsed.kg} kg × ` : ""}${parsed.reps} reps — ${ex}`);
  return true;
}

function startVoiceLog(box, week, rerender) {
  const btn = box.querySelector(".micbtn");
  const rec = new SpeechRec();
  rec.lang = "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 4;
  btn.classList.add("listening");
  btn.textContent = "🎙️";
  voiceFeedback(box, "Listening… say e.g. “45 kg, 10 reps”");
  let handled = false;
  rec.onresult = (e) => {
    handled = true;
    const alts = [...e.results[0]].map((a) => a.transcript);
    for (const alt of alts) if (applyVoiceTranscript(box, week, rerender, alt)) return;
  };
  rec.onerror = (e) => {
    handled = true;
    voiceFeedback(box, e.error === "not-allowed"
      ? "Microphone blocked. Voice needs mic permission and an https:// or localhost address — it can't run from a file:// page."
      : e.error === "no-speech" ? "Didn't hear anything — tap 🎤 and try again."
      : `Voice error: ${e.error}. You can still type the set.`);
  };
  rec.onend = () => {
    btn.classList.remove("listening");
    btn.textContent = "🎤";
    if (!handled) voiceFeedback(box, "Didn't catch that — tap 🎤 and try again.");
  };
  try { rec.start(); } catch { /* mic already active */ }
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ================= Exercise tutorials ================= */

function tutSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

let tutFlipTimer = null;

function openTutorial(name) {
  const t = TUTORIALS[name];
  if (!t) return;
  closeTutorial();
  const s = tutSlug(name);
  const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " exercise proper form")}`;
  const modal = document.createElement("div");
  modal.className = "tmodal";
  modal.id = "tmodal";
  modal.innerHTML = `
    <div class="tcard">
      <button class="tclose" aria-label="Close">✕</button>
      <h2>${esc(name)}</h2>
      ${t.img ? `
        <div class="tflip">
          <img id="tflipImg" src="media/${s}-0.jpg" alt="${esc(name)} demonstration" />
          <div class="tflip-label muted small">Demo animates between start & end position</div>
        </div>` : ""}
      ${t.note ? `<div class="tnote">💡 ${t.note}</div>` : ""}
      <ol class="tsteps">${t.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
      <a class="btn secondary" target="_blank" rel="noopener" href="${yt}">▶ Watch video tutorials</a>
    </div>`;
  document.body.appendChild(modal);
  if (t.img > 1) {
    const img = modal.querySelector("#tflipImg");
    new Image().src = `media/${s}-1.jpg`; // preload the second frame
    let frame = 0;
    tutFlipTimer = setInterval(() => {
      frame = (frame + 1) % t.img;
      img.src = `media/${s}-${frame}.jpg`;
    }, 900);
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".tclose")) closeTutorial();
  });
}

function closeTutorial() {
  clearInterval(tutFlipTimer);
  tutFlipTimer = null;
  document.getElementById("tmodal")?.remove();
}

// One delegated listener so tutorial links work in every tab without rewiring.
document.addEventListener("click", (e) => {
  const b = e.target.closest(".exname");
  if (b) openTutorial(b.dataset.ex);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeTutorial(); });

/* ================= Shared blocks ================= */

// Last logged top set for an exercise + what to attempt next.
function liftHint(exName, phase) {
  const logs = (state.progress.lifts || {})[exName];
  if (!logs || !logs.length) return `<span class="muted">No sets logged yet.</span>`;
  const last = logs[logs.length - 1];
  const topReps = parseInt(String(phase.reps).split("–").pop(), 10) || 12;
  const suggestion = last.kg > 0 && last.reps >= topReps
    ? `try <strong>${(last.kg + 2.5).toFixed(1).replace(/\.0$/, "")} kg</strong> next`
    : `try <strong>+1 rep</strong> next`;
  return `Last: <strong>${last.kg > 0 ? last.kg + " kg × " : ""}${last.reps} reps</strong> (wk ${last.week}) — ${suggestion}`;
}

function workoutTable(workout, week, phase) {
  return `
    <div class="muted small">🔸 ${workout.warmup}</div>
    <div class="table-wrap"><table class="exercises">
      <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th></tr>
      ${workout.exercises.map((ex) => `
        <tr>
          <td><button class="exname" data-ex="${esc(ex.name)}" title="How to do this exercise"><strong>${ex.name}</strong><span class="howto">📖 how-to</span>${ex.bonus ? `<span class="bonus-tag">🏆 bonus</span>` : ""}</button><div class="ex-note">${ex.note}</div>
            ${ex.sets !== "—" ? `
            <div class="liftlog" data-ex="${esc(ex.name)}">
              <div class="lift-hint small">${liftHint(ex.name, phase)}</div>
              <div class="lift-inputs">
                <input type="number" class="kg" step="0.5" min="0" placeholder="kg" />
                <span>×</span>
                <input type="number" class="reps" min="1" placeholder="reps" />
                <button class="btn tiny logbtn" data-week="${week}">Log set</button>
                ${VOICE_OK ? `<button class="btn tiny micbtn" title="Log this set by voice — say e.g. '45 kg, 10 reps'">🎤</button>` : ""}
              </div>
              <div class="voice-feedback small"></div>
            </div>` : ""}
          </td>
          <td>${ex.sets}</td><td>${ex.reps}</td><td>${ex.rest}</td>
        </tr>`).join("")}
    </table></div>
    <div class="muted small">🔹 ${workout.cooldown}</div>`;
}

function mealsBlock(meals, kcalTarget) {
  return `
    <h3 class="mt">🍽️ Meals — ${kcalTarget} kcal target</h3>
    <div class="meals">
      ${meals.map((m) => `
        <div class="meal">
          <div class="mtime">${m.time} · ~${m.kcal} kcal · ${m.protein}g protein</div>
          <div class="mname">${m.name}</div>
          <div class="mitems">${m.items.map((it) => it.display).join(" · ")}</div>
        </div>`).join("")}
    </div>`;
}

function logSet(box, week, rerender) {
  const kg = parseFloat(box.querySelector(".kg").value) || 0;
  const reps = parseInt(box.querySelector(".reps").value, 10);
  if (!reps) { box.querySelector(".reps").focus(); return; }
  state.progress.lifts = state.progress.lifts || {};
  const ex = box.dataset.ex;
  (state.progress.lifts[ex] = state.progress.lifts[ex] || []).push({ week, kg, reps });
  save(STORE.progress, state.progress);
  rerender();
}

function wireLiftLogs(rerender) {
  document.querySelectorAll(".liftlog").forEach((box) => {
    const week = +box.querySelector(".logbtn").dataset.week;
    box.querySelector(".logbtn").addEventListener("click", () => logSet(box, week, rerender));
    box.querySelector(".micbtn")?.addEventListener("click", () => startVoiceLog(box, week, rerender));
  });
}

function setDayDone(key, done) {
  state.progress.completed[key] = done;
  save(STORE.progress, state.progress);
  if (done) confetti();
}

/* ================= Today tab ================= */

function renderToday() {
  const p = state.profile;
  const t = todayInfo();
  const targets = getTargets();
  const weekPlan = buildWeek(p, targets, t.week);
  const day = weekPlan.days[t.dayIdx];
  const ph = weekPlan.phase;
  const key = `w${t.week}d${t.dayIdx}`;
  const done = !!state.progress.completed[key];
  const x = xpStats();
  const st = streaks();

  $view().innerHTML = `
    <div class="today-hero">
      <div class="th-top">
        <div>
          <div class="th-day">Day ${t.dayNum} <span class="of">/ 365</span></div>
          <div class="muted">Hi ${esc(p.name)} · Week ${t.week} · ${ph.name} · ${EXPERIENCE[p.experience].label}</div>
        </div>
        <div class="th-gam">
          <div class="flame ${st.current > 0 ? "lit" : ""}">🔥 ${st.current}</div>
          <div class="lvl">Lv ${x.level + 1} · ${x.levelName}</div>
          <div class="xpbar"><div style="width:${x.toNext * 100}%"></div></div>
        </div>
      </div>
      <div class="phase-chip">${ph.intensity} — ${ph.focus}
        <div class="small mt4">🎯 ${EXPERIENCE[p.experience].note}</div>
      </div>
    </div>

    <div class="card day-focus">
      <div class="df-head">
        <h2>${day.isTraining ? `🏋️ ${day.workout.label}` : "🌿 Rest & Recovery"}</h2>
        ${done ? `<span class="day-tag tag-done">✓ Done</span>` : ""}
      </div>
      ${day.isTraining ? workoutTable(day.workout, t.week, ph) : `<div class="restnote">${day.restNote}</div>`}
      <button class="btn ${done ? "ghost" : "gold"}" id="doneBtn">${done ? "Undo — not done yet" : `Mark Day ${t.dayNum} complete (+25 XP)`}</button>
    </div>

    <div class="card">${mealsBlock(day.meals, targets.calories)}</div>
    <footer class="note muted small">${HYDRATION_TIP}</footer>`;

  document.getElementById("doneBtn").addEventListener("click", () => {
    setDayDone(key, !done);
    renderToday();
  });
  wireLiftLogs(renderToday);
}

/* ================= Plan tab ================= */

function renderPlan() {
  const p = state.profile;
  const targets = getTargets();
  const week = state.progress.currentWeek;
  const weekPlan = buildWeek(p, targets, week);
  const ph = weekPlan.phase;

  const weekOptions = Array.from({ length: 52 }, (_, i) => {
    const w = i + 1;
    return `<option value="${w}" ${w === week ? "selected" : ""}>Week ${w} — ${phaseForWeek(w).name}</option>`;
  }).join("");

  $view().innerHTML = `
    <div class="pagehead"><h1>📅 Plan</h1><button class="btn secondary" id="printBtn">🖨️ Print week</button></div>

    <div class="phase-banner">
      <span class="name">Week ${week} · ${ph.name}</span> — ${ph.intensity}
      <div class="small mt4">${ph.focus}</div>
      <div class="small mt4">🎯 ${EXPERIENCE[p.experience].label}: ${EXPERIENCE[p.experience].note}</div>
    </div>

    <div class="weeknav">
      <button class="navbtn" id="prevWeek" ${week === 1 ? "disabled" : ""}>‹ Prev</button>
      <select id="weekSelect">${weekOptions}</select>
      <button class="navbtn" id="nextWeek" ${week === 52 ? "disabled" : ""}>Next ›</button>
    </div>

    ${weekPlan.days.map((d) => dayCard(d, week, targets, ph)).join("")}

    <h2 class="section-title">🛒 Grocery list — week ${week}</h2>
    <div class="card" id="groceryCard">${groceryHtml(week, targets)}</div>

    <h2 class="section-title">🗺️ Your year at a glance</h2>
    <div class="card">
      ${yearMilestones(p).map((m) => `<div class="milestone"><div class="at">${m.at}</div><div>${m.text}</div></div>`).join("")}
    </div>`;

  const go = (w) => { state.progress.currentWeek = w; save(STORE.progress, state.progress); renderPlan(); window.scrollTo(0, 0); };
  document.getElementById("prevWeek").addEventListener("click", () => go(week - 1));
  document.getElementById("nextWeek").addEventListener("click", () => go(week + 1));
  document.getElementById("weekSelect").addEventListener("change", (e) => go(+e.target.value));
  document.getElementById("printBtn").addEventListener("click", () => printWeek(week));

  const rerenderInPlace = () => {
    const openIds = [...document.querySelectorAll(".day-card.open")].map((c) => c.id);
    const y = window.scrollY;
    renderPlan();
    openIds.forEach((id) => document.getElementById(id)?.classList.add("open"));
    window.scrollTo(0, y);
  };

  document.querySelectorAll(".day-head").forEach((h) =>
    h.addEventListener("click", () => h.closest(".day-card").classList.toggle("open")));

  document.querySelectorAll('input[type="checkbox"][data-key]').forEach((chk) => {
    chk.addEventListener("change", () => {
      setDayDone(chk.dataset.key, chk.checked);
      rerenderInPlace();
    });
  });

  wireLiftLogs(rerenderInPlace);
  wireGrocery(week, targets);
}

function dayCard(d, week, targets, phase) {
  const key = `w${week}d${d.dayIdx}`;
  const done = !!state.progress.completed[key];
  const tag = done
    ? `<span class="day-tag tag-done">✓ Done</span>`
    : d.isTraining
      ? `<span class="day-tag tag-train">Workout</span>`
      : `<span class="day-tag tag-rest">Rest</span>`;

  return `
    <div class="card day-card" id="card-${key}">
      <div class="day-head" data-key="${key}">
        <div><div class="title">${d.dayName}</div><div class="sub">${d.isTraining ? d.workout.label : "Recovery day"}</div></div>
        ${tag}
      </div>
      <div class="day-body">
        ${d.isTraining ? workoutTable(d.workout, week, phase) : `<div class="restnote">${d.restNote}</div>`}
        ${mealsBlock(d.meals, targets.calories)}
        <div class="done-row">
          <input type="checkbox" id="chk-${key}" data-key="${key}" ${done ? "checked" : ""} />
          <label for="chk-${key}">Mark ${d.dayName} as completed</label>
        </div>
      </div>
    </div>`;
}

/* ---- Grocery list ---- */

function groceryHtml(week, targets) {
  const groups = groceryForWeek(state.profile, targets, week);
  const ticks = (state.progress.grocery || {})[`w${week}`] || {};
  return `
    <div class="muted small">Everything you need to cook this week's meals. Quantities are rounded up.</div>
    ${Object.entries(GROCERY_CATS).filter(([cat]) => groups[cat]).map(([cat, label]) => `
      <h3 class="gcat">${label}</h3>
      <div class="glist">
        ${groups[cat].map((it) => `
          <label class="gitem ${ticks[it.ing] ? "got" : ""}">
            <input type="checkbox" data-ing="${esc(it.ing)}" ${ticks[it.ing] ? "checked" : ""} />
            <span>${it.display}</span>
          </label>`).join("")}
      </div>`).join("")}
    <button class="btn secondary mt" id="printGroceryBtn">🖨️ Print grocery list</button>`;
}

function wireGrocery(week, targets) {
  document.querySelectorAll("#groceryCard input[data-ing]").forEach((chk) => {
    chk.addEventListener("change", () => {
      state.progress.grocery = state.progress.grocery || {};
      const wk = (state.progress.grocery[`w${week}`] = state.progress.grocery[`w${week}`] || {});
      if (chk.checked) wk[chk.dataset.ing] = true; else delete wk[chk.dataset.ing];
      save(STORE.progress, state.progress);
      chk.closest(".gitem").classList.toggle("got", chk.checked);
    });
  });
  document.getElementById("printGroceryBtn").addEventListener("click", () => printGrocery(week, targets));
}

/* ================= Progress tab ================= */

function renderProgress() {
  const p = state.profile;
  const targets = getTargets();
  const x = xpStats();
  const st = streaks();
  const totalDays = 52 * 7;
  const pct = x.done / totalDays * 100;
  const pctLabel = pct > 0 && pct < 10 ? pct.toFixed(1) : Math.round(pct);
  const badges = badgeState();
  const liftExercises = Object.keys(state.progress.lifts || {}).filter((k) => state.progress.lifts[k].length >= 2);
  if (!state.ui.chartEx || !liftExercises.includes(state.ui.chartEx)) state.ui.chartEx = liftExercises[0] || null;

  $view().innerHTML = `
    <div class="pagehead"><h1>📈 Progress</h1></div>

    <div class="levelcard card">
      <div class="lc-row">
        <div class="lc-level">Lv ${x.level + 1}</div>
        <div>
          <div class="lc-name">${x.levelName}</div>
          <div class="muted small">${x.xp} XP · ${XP_PER_LEVEL - (x.xp % XP_PER_LEVEL)} XP to next level</div>
        </div>
        <div class="flame lit big">🔥 ${st.current}</div>
      </div>
      <div class="xpbar big"><div style="width:${x.toNext * 100}%"></div></div>
    </div>

    <div class="stats">
      <div class="stat"><div class="val">${targets.calories}${state.progress.calorieDelta ? `<span class="adj">${state.progress.calorieDelta > 0 ? "+" : ""}${state.progress.calorieDelta}</span>` : ""}</div><div class="lbl">kcal/day · ${targets.carbs}g C · ${targets.fat}g F</div></div>
      <div class="stat"><div class="val">${targets.protein} g</div><div class="lbl">protein / day</div></div>
      <div class="stat"><div class="val">${st.max}</div><div class="lbl">best streak</div></div>
      <div class="stat"><div class="val">${pctLabel}%</div><div class="lbl">${x.done}/${totalDays} days done<div class="progressbar"><div style="width:${pct}%"></div></div></div></div>
    </div>

    <h2 class="section-title">🏅 Badges</h2>
    <div class="badges">
      ${badges.map((b) => `
        <div class="badge ${b.unlocked ? "unlocked" : ""}" title="${b.desc}">
          <div class="bicon">${b.icon}</div>
          <div class="bname">${b.name}</div>
          <div class="bdesc">${b.desc}</div>
        </div>`).join("")}
    </div>

    <h2 class="section-title">⚖️ Weekly check-in</h2>
    <div class="card">
      <div class="muted small">Log your weight once a week (same day, morning, empty stomach). Your calorie target auto-adjusts based on your trend.</div>
      <div class="weight-row mt">
        <input id="weightInput" type="number" step="0.1" min="30" max="250" placeholder="kg" value="${state.progress.weights[state.progress.currentWeek] ?? ""}" />
        <button class="btn tiny" id="saveWeight">Save for week ${state.progress.currentWeek}</button>
      </div>
      <div class="chart-wrap">${weightChart()}</div>
      ${coachNotes()}
    </div>

    <h2 class="section-title">🏋️ Strength progression</h2>
    <div class="card">
      ${liftExercises.length
        ? `<div class="chips">${liftExercises.map((ex) => `<button class="chip ${ex === state.ui.chartEx ? "active" : ""}" data-ex="${esc(ex)}">${ex}</button>`).join("")}</div>
           ${liftChart(state.ui.chartEx)}`
        : `<div class="muted">Log top sets on at least two workouts for an exercise (from Today or Plan) and its progression chart appears here.</div>`}
    </div>

    <h2 class="section-title">⚙️ Data & profile</h2>
    <div class="card">
      <div class="topbar-actions">
        <button class="btn secondary" id="exportBtn">⬇️ Backup</button>
        <button class="btn secondary" id="importBtn">⬆️ Restore</button>
        <button class="btn secondary" id="resetBtn">Edit profile</button>
        <input type="file" id="importFile" accept=".json,application/json" hidden />
      </div>
      <div class="muted small mt">Backups contain your profile, completed days, weigh-ins and logged lifts — use them to move to a new phone.</div>
    </div>
    <footer class="note muted small">This plan is a general guideline, not medical advice — check with a doctor before starting if you have health conditions.</footer>`;

  document.querySelectorAll(".chip[data-ex]").forEach((c) =>
    c.addEventListener("click", () => { state.ui.chartEx = c.dataset.ex; renderProgress(); }));

  document.getElementById("saveWeight").addEventListener("click", () => {
    const v = parseFloat(document.getElementById("weightInput").value);
    if (!v) return;
    state.progress.weights[state.progress.currentWeek] = v;
    save(STORE.progress, state.progress);
    runAdaptation();
    renderProgress();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Edit your profile? Your plan will regenerate (progress is kept).")) {
      state.profile = null;
      render();
    }
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const data = {
      app: "FitYear", version: 2, exportedAt: new Date().toISOString(),
      profile: state.profile, progress: state.progress,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fityear-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.app !== "FitYear" || !data.profile?.name || !data.progress) throw new Error("This file is not a FitYear backup.");
        const when = (data.exportedAt || "").slice(0, 10) || "unknown date";
        if (!confirm(`Restore backup for "${data.profile.name}" (saved ${when})? This replaces your current data.`)) return;
        state.profile = data.profile;
        state.progress = data.progress;
        save(STORE.profile, state.profile);
        save(STORE.progress, state.progress);
        render();
      } catch (err) {
        alert("Could not restore backup: " + err.message);
      }
    };
    reader.readAsText(file);
  });
}

/* ---- Coaching ---- */

// Weekly check-in coach: compares actual weight trend against the goal's
// healthy rate and nudges the calorie target (max ±300 kcal total).
function runAdaptation() {
  const entries = Object.entries(state.progress.weights)
    .map(([w, kg]) => [Number(w), Number(kg)]).sort((a, b) => a[0] - b[0]);
  if (entries.length < 2) return;
  const [pw, pkg] = entries[entries.length - 2];
  const [lw, lkg] = entries[entries.length - 1];
  if (lw <= pw || state.progress.lastAdjustWeek === lw) return;
  const rate = (lkg - pkg) / (lw - pw); // kg per week
  const fmt = (r) => `${r > 0 ? "+" : ""}${r.toFixed(2)} kg/week`;

  let delta = 0, reason = "";
  if (state.profile.goal === "lose") {
    if (rate > -0.15) { delta = -100; reason = `Weight loss has stalled (${fmt(rate)}). Trimming 100 kcal/day.`; }
    else if (rate < -0.8) { delta = +100; reason = `Losing faster than the healthy rate (${fmt(rate)}). Adding 100 kcal/day to protect muscle.`; }
    else reason = `On track (${fmt(rate)}). No changes needed — keep going!`;
  } else if (state.profile.goal === "gain") {
    if (rate < 0.05) { delta = +100; reason = `Gaining too slowly (${fmt(rate)}). Adding 100 kcal/day.`; }
    else if (rate > 0.5) { delta = -100; reason = `Gaining faster than lean rate (${fmt(rate)}). Trimming 100 kcal/day to limit fat gain.`; }
    else reason = `On track (${fmt(rate)}). No changes needed — keep going!`;
  } else {
    if (rate > 0.25) { delta = -100; reason = `Weight drifting up (${fmt(rate)}). Trimming 100 kcal/day.`; }
    else if (rate < -0.25) { delta = +100; reason = `Weight drifting down (${fmt(rate)}). Adding 100 kcal/day.`; }
    else reason = `Holding steady (${fmt(rate)}). No changes needed.`;
  }

  const prev = state.progress.calorieDelta || 0;
  const next = Math.max(-300, Math.min(300, prev + delta));
  if (next !== prev) state.progress.calorieDelta = next;
  else if (delta !== 0) reason += " (adjustment cap reached — consider revisiting your profile)";
  state.progress.lastAdjustWeek = lw;
  state.progress.coachLog = state.progress.coachLog || [];
  state.progress.coachLog.push({ week: lw, text: reason, adjusted: next !== prev });
  save(STORE.progress, state.progress);
}

function coachNotes() {
  const log = (state.progress.coachLog || []).slice(-3).reverse();
  if (!log.length) return "";
  return `
    <h3 class="mt">🧠 Coach notes</h3>
    ${log.map((n) => `<div class="coach-note ${n.adjusted ? "adjusted" : ""}"><strong>Week ${n.week}:</strong> ${n.text}</div>`).join("")}`;
}

/* ---- Charts (inline SVG) ---- */

function svgLine(points, { stroke = "var(--accent)", height = 130 } = {}) {
  const W = 800, H = height, pad = 26;
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  const yspan = Math.max(ymax - ymin, 1);
  const X = (v) => pad + ((v - xmin) / Math.max(xmax - xmin, 1)) * (W - 2 * pad);
  const Y = (v) => H - pad - ((v - ymin) / yspan) * (H - 2 * pad);
  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ");
  const dots = points.map(([x, y, label]) => `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="4" fill="${stroke}"><title>${label}</title></circle>`).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${path}" fill="none" stroke="${stroke}" stroke-width="2.5" />${dots}</svg>`;
}

function weightChart() {
  const entries = Object.entries(state.progress.weights)
    .map(([w, kg]) => [Number(w), Number(kg)]).sort((a, b) => a[0] - b[0]);
  if (entries.length < 2) return `<div class="muted small mt">Log weights over multiple weeks to see your trend here.</div>`;
  const first = entries[0][1], last = entries[entries.length - 1][1];
  const delta = (last - first).toFixed(1);
  const pts = entries.map(([w, kg]) => [w, kg, `Week ${w}: ${kg} kg`]);
  return `
    <div class="small muted mt">Weight: ${first} kg → ${last} kg (${delta > 0 ? "+" : ""}${delta} kg)</div>
    ${svgLine(pts)}`;
}

// Estimated one-rep max (Epley). For bodyweight movements we chart reps instead.
function liftChart(exName) {
  const logs = (state.progress.lifts || {})[exName] || [];
  if (logs.length < 2) return "";
  const weighted = logs.some((l) => l.kg > 0);
  const pts = logs.map((l, i) => {
    const val = weighted ? Math.round(l.kg * (1 + l.reps / 30) * 10) / 10 : l.reps;
    return [i + 1, val, `Wk ${l.week}: ${l.kg > 0 ? `${l.kg} kg × ${l.reps}` : `${l.reps} reps`}${weighted ? ` (est. 1RM ${val} kg)` : ""}`];
  });
  const first = pts[0][1], last = pts[pts.length - 1][1];
  const gain = Math.round((last - first) * 10) / 10;
  const unit = weighted ? "kg est. 1RM" : "reps";
  return `
    <div class="small muted mt">${esc(exName)}: ${first} → ${last} ${unit} (${gain >= 0 ? "+" : ""}${gain}) over ${logs.length} sessions</div>
    ${svgLine(pts, { stroke: "var(--gold)" })}`;
}

/* ---- Printable sheets (browser print dialog → Save as PDF) ---- */

function printWeek(week) {
  const p = state.profile;
  const targets = getTargets();
  const plan = buildWeek(p, targets, week);
  const ph = plan.phase;
  document.getElementById("printview").innerHTML = `
    <div class="phead">
      <h1>FitYear — Week ${week} of 52 · ${ph.name}</h1>
      <div>${esc(p.name)} · ${goalLabel(p.goal).replace(/^\S+ /, "")} · ${ph.intensity}</div>
      <div>Daily targets: ${targets.calories} kcal · ${targets.protein}g protein · ${targets.carbs}g carbs · ${targets.fat}g fat</div>
      <div class="pfocus">${ph.focus}</div>
    </div>
    ${plan.days.map((d) => `
      <div class="pday">
        <h2>${d.dayName} — ${d.isTraining ? d.workout.label : "Rest / Recovery"}</h2>
        ${d.isTraining ? `
          <table>
            <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th><th style="width:22%">Weight used / notes</th></tr>
            ${d.workout.exercises.map((ex) => `
              <tr><td>${ex.name} <span class="pnote">(${ex.note})</span></td><td>${ex.sets}</td><td>${ex.reps}</td><td>${ex.rest}</td><td></td></tr>`).join("")}
          </table>` : `<div class="pnote">${d.restNote}</div>`}
        <div class="pmeals"><strong>Meals:</strong> ${d.meals.map((m) => `${m.time}: ${m.name} — ${m.items.map((it) => it.display).join(", ")} (~${m.kcal} kcal, ${m.protein}g P)`).join(" &nbsp;·&nbsp; ")}</div>
      </div>`).join("")}
    <div class="pfoot">${HYDRATION_TIP} · Generated by FitYear on ${new Date().toISOString().slice(0, 10)}</div>`;
  window.print();
}

function printGrocery(week, targets) {
  const groups = groceryForWeek(state.profile, targets, week);
  document.getElementById("printview").innerHTML = `
    <div class="phead">
      <h1>FitYear — Grocery list, Week ${week}</h1>
      <div>${esc(state.profile.name)} · covers all meals for 7 days</div>
    </div>
    ${Object.entries(GROCERY_CATS).filter(([cat]) => groups[cat]).map(([cat, label]) => `
      <div class="pday">
        <h2>${label.replace(/^\S+ /, "")}</h2>
        <table>${groups[cat].map((it) => `<tr><td style="width:24px">☐</td><td>${it.display}</td></tr>`).join("")}</table>
      </div>`).join("")}
    <div class="pfoot">Generated by FitYear on ${new Date().toISOString().slice(0, 10)}</div>`;
  window.print();
}

/* ---- helpers ---- */
function goalLabel(g) {
  return { lose: "🔥 Losing fat", gain: "💪 Building muscle", maintain: "⚖️ Getting fit" }[g];
}
function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

render();
