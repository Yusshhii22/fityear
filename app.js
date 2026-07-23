// ===== FitYear app: onboarding + Today / Plan / Progress tabs =====

const STORE = {
  profile: "fityear_profile",
  progress: "fityear_progress",
};

const state = {
  profile: load(STORE.profile),
  progress: load(STORE.progress) || { completed: {}, weights: {}, currentWeek: 1 },
  ui: { tab: "today", chartEx: null, planPage: "week", lastTab: null, editingProfile: false },
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
// Profiles created before the trainer/enthusiast split default to enthusiast.
if (state.profile && !state.profile.role) {
  state.profile.role = "bro";
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
  if (!state.profile || state.ui.editingProfile) { renderOnboarding(); return; }
  const tab = state.ui.tab;
  const animate = state.ui.lastTab !== tab;
  state.ui.lastTab = tab;
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
  if (animate) animateView();
}

const $view = () => document.getElementById("view");

// Replay the page-in animation on #view (used when switching tabs/sub-pages).
function animateView() {
  const v = $view();
  if (!v) return;
  v.classList.remove("anim");
  void v.offsetWidth;
  v.classList.add("anim");
}

/* ================= Onboarding wizard ================= */

const WIZ_STEPS = [
  { id: "role", type: "choice", hero: true, title: "Who's using FitYear?", sub: "Both are welcome — this just tunes the coaching language for you.", opts: [
    ["trainer", "🎓", "Professional trainer", "I coach people — show me the programming rationale"],
    ["bro", "💪", "Gym bro / sis", "I'm here for my own fitness journey"]] },
  { id: "welcome", type: "name" },
  { id: "body", type: "body" },
  { id: "goal", type: "choice", title: "What's your main goal?", sub: "Everything — workouts, calories, meals — is built around this.", opts: [
    ["lose", "🔥", "Lose fat", "drop fat while keeping the muscle you have"],
    ["gain", "💪", "Build muscle", "add size and strength with a lean surplus"],
    ["maintain", "⚖️", "Get fit & maintain", "feel, move and perform better at this weight"]] },
  { id: "experience", type: "choice", title: "Training experience?", sub: "Sets the right volume and coaching cues for your level.", opts: [
    ["newbie", "🌱", "Newbie", "never trained"],
    ["beginner", "🙂", "Beginner", "less than 1 year"],
    ["intermediate", "🏃", "Intermediate", "1–3 years"],
    ["advanced", "🏋️", "Advanced", "3–5 years"],
    ["athlete", "🏆", "Athlete", "5+ years"]] },
  { id: "activity", type: "choice", title: "How active are your days?", sub: "Outside workouts — this tunes your calorie target.", opts: [
    ["sedentary", "🪑", "Mostly sitting", "desk job, little walking"],
    ["light", "🚶", "Lightly active", "some walking daily"],
    ["moderate", "🧍", "On my feet a lot", "teaching, retail, errands"],
    ["very", "🔨", "Physically demanding", "manual work or sport"]] },
  { id: "days", type: "choice", row: true, title: "Workout days per week?", sub: "Be honest — a plan you can stick to beats a perfect one you can't.", opts: [
    ["2", "", "2", "solid start"], ["3", "", "3", "sweet spot"], ["4", "", "4", "committed"], ["5", "", "5", "serious"], ["6", "", "6", "all in"]] },
  { id: "equipment", type: "choice", title: "What equipment do you have?", sub: "Every workout is matched to what's actually available to you.", opts: [
    ["none", "🧘", "No equipment", "bodyweight only"],
    ["home", "🏠", "Home setup", "dumbbells / bands"],
    ["gym", "🏢", "Full gym", "machines, barbells, the works"]] },
  { id: "diet", type: "choice", title: "Diet preference?", sub: "Meal plans, protein targets and grocery lists follow this.", opts: [
    ["veg", "🥦", "Vegetarian", ""],
    ["nonveg", "🍗", "Non-vegetarian", ""],
    ["vegan", "🌱", "Vegan", ""]] },
  { id: "summary", type: "summary" },
];

let wiz = null;

function profileFromWizard(d) {
  return {
    role: d.role,
    name: d.name, age: +d.age, height: +d.height, weight: +d.weight, sex: d.sex,
    goal: d.goal, experience: d.experience, activity: d.activity, days: +d.days,
    equipment: d.equipment, diet: d.diet,
    startDate: (state.ui.editingProfile && state.profile?.startDate) || new Date().toISOString().slice(0, 10),
  };
}

function finishOnboarding() {
  const editing = state.ui.editingProfile;
  state.profile = profileFromWizard(wiz.data);
  if (!editing) state.progress = { completed: {}, weights: { 1: state.profile.weight }, currentWeek: 1 };
  save(STORE.profile, state.profile);
  save(STORE.progress, state.progress);
  state.ui.editingProfile = false;
  wiz = null;
  render();
  window.scrollTo(0, 0);
  if (!state.progress.tourDone) setTimeout(startTour, 500);
}

function renderOnboarding() {
  if (!wiz) wiz = { step: 0, data: state.ui.editingProfile ? { ...state.profile } : {} };
  const editing = state.ui.editingProfile;
  const step = WIZ_STEPS[wiz.step];
  const pct = (wiz.step / (WIZ_STEPS.length - 1)) * 100;

  let body = "", footer = "";
  if (step.type === "name") {
    body = `
      <div class="hero">
        <div class="logo">💪</div>
        <h1>${editing ? "Edit your profile" : "FitYear"}</h1>
        <p class="muted">${editing
          ? "Change anything — your plan regenerates instantly and your progress is kept."
          : "A 2-minute setup builds your complete 1-year fitness journey — 52 weeks of workouts, meals and coaching that adapt to you."}</p>
      </div>
      <label class="field"><span>What should we call you?</span>
        <input id="wname" placeholder="Your name" value="${esc(wiz.data.name || "")}" autocomplete="given-name" /></label>`;
    footer = `<button class="btn" id="wnext">${editing ? "Continue →" : "Let's go →"}</button>`;
  } else if (step.type === "body") {
    body = `
      <h1>About you</h1>
      <p class="sub muted">Used only to calculate your calorie and protein targets — everything stays on your device.</p>
      <div class="form-grid">
        <label class="field"><span>Age</span><input id="wage" type="number" min="14" max="80" value="${wiz.data.age ?? ""}" placeholder="e.g. 27" /></label>
        <label class="field"><span>Height (cm)</span><input id="wheight" type="number" min="120" max="230" value="${wiz.data.height ?? ""}" placeholder="e.g. 172" /></label>
        <label class="field"><span>Weight (kg)</span><input id="wweight" type="number" min="30" max="250" step="0.1" value="${wiz.data.weight ?? ""}" placeholder="e.g. 74" /></label>
        <div class="field"><span class="flabel">Sex (for calorie calculation)</span>
          <div class="wchoices row" id="wsex">
            <div class="wchoice ${wiz.data.sex === "male" ? "selected" : ""}" data-val="male"><span class="wtext"><span class="wlabel">Male</span></span></div>
            <div class="wchoice ${wiz.data.sex === "female" ? "selected" : ""}" data-val="female"><span class="wtext"><span class="wlabel">Female</span></span></div>
          </div></div>
      </div>`;
    footer = `<button class="btn" id="wnext">Next →</button>`;
  } else if (step.type === "choice") {
    body = `
      ${step.hero ? `<div class="hero"><div class="logo">💪</div><h1>FitYear</h1></div>` : `<h1>${step.title}</h1>`}
      ${step.hero ? `<h1>${step.title}</h1>` : ""}
      <p class="sub muted">${step.sub}</p>
      <div class="wchoices ${step.row ? "row" : ""}">
        ${step.opts.map(([val, icon, label, sub]) => `
          <div class="wchoice ${String(wiz.data[step.id]) === val ? "selected" : ""}" data-val="${val}">
            ${icon ? `<span class="wicon">${icon}</span>` : ""}
            <span class="wtext"><span class="wlabel">${label}</span>${sub ? `<span class="wsub">${sub}</span>` : ""}</span>
          </div>`).join("")}
      </div>`;
    if (wiz.data[step.id] != null) footer = `<button class="btn" id="wnext">Next →</button>`;
  } else { // summary
    const d = wiz.data;
    const draft = profileFromWizard(d);
    const t = calcTargets(draft);
    const split = [...new Set(SPLITS[draft.days].map((k) => DAY_TEMPLATES[k].label))];
    body = `
      <h1>Your year is ready, ${esc(d.name)} 🎉</h1>
      <p class="sub muted">Here's what we'll build from your answers:</p>
      <div class="stats">
        <div class="stat"><div class="val">${t.calories}</div><div class="lbl">kcal / day</div></div>
        <div class="stat"><div class="val">${t.protein} g</div><div class="lbl">protein / day</div></div>
        <div class="stat"><div class="val">${draft.days}×</div><div class="lbl">workouts / week</div></div>
        <div class="stat"><div class="val">52</div><div class="lbl">weeks planned</div></div>
      </div>
      <div class="card">
        <h3>🏋️ Your weekly split</h3>
        <div class="sumchips mt4">${split.map((s) => `<span class="sumchip">${s}</span>`).join("")}</div>
        <h3 class="mt">💊 Your supplement stack</h3>
        <div class="sumchips mt4">${supplementStack(draft).map((s) => `<span class="sumchip">${s.icon} ${s.name}</span>`).join("")}</div>
        <h3 class="mt">📊 The journey</h3>
        <div class="muted small mt4">Foundation → Build → Strength → Peak, with recovery deload weeks at 13, 26 and 39 — progressed automatically every week.</div>
        ${d.role === "trainer" ? `<div class="tnote mt">🎓 Trainer mode: phase banners include the programming rationale (schemes, RPE, progression logic), and week sheets print clean for handing to clients.</div>` : ""}
      </div>`;
    footer = `<button class="btn gold" id="wfinish">${editing ? "Save & regenerate my plan →" : "Generate my 1-year plan →"}</button>`;
  }

  $app.innerHTML = `
    <div class="wiz">
      <div class="wiz-top">
        <button class="iconbtn" id="wback" title="Back">‹</button>
        <div class="wiz-meter">
          <div class="wiz-step-label">Step ${wiz.step + 1} of ${WIZ_STEPS.length}</div>
          <div class="wizbar"><div style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="wizstep">${body}<div class="navrow">${footer}</div></div>
    </div>`;

  const backBtn = document.getElementById("wback");
  if (wiz.step === 0 && !editing) backBtn.style.visibility = "hidden";
  backBtn.addEventListener("click", () => {
    if (wiz.step === 0) {
      if (editing) { state.ui.editingProfile = false; wiz = null; render(); }
      return;
    }
    wiz.step--;
    renderOnboarding();
  });

  const next = () => { wiz.step++; renderOnboarding(); window.scrollTo(0, 0); };

  if (step.type === "name") {
    const input = document.getElementById("wname");
    const go = () => {
      const v = input.value.trim();
      if (!v) { input.focus(); input.style.outline = "2px solid #ff5470"; return; }
      wiz.data.name = v;
      next();
    };
    document.getElementById("wnext").addEventListener("click", go);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
  } else if (step.type === "body") {
    document.querySelectorAll("#wsex .wchoice").forEach((c) =>
      c.addEventListener("click", () => {
        wiz.data.sex = c.dataset.val;
        document.querySelectorAll("#wsex .wchoice").forEach((x) => x.classList.remove("selected"));
        c.classList.add("selected");
      }));
    document.getElementById("wnext").addEventListener("click", () => {
      const check = (id, min, max) => {
        const el = document.getElementById(id);
        const v = parseFloat(el.value);
        const ok = v >= min && v <= max;
        el.style.outline = ok ? "" : "2px solid #ff5470";
        return ok ? v : null;
      };
      const age = check("wage", 14, 80);
      const height = check("wheight", 120, 230);
      const weight = check("wweight", 30, 250);
      if (age === null || height === null || weight === null || !wiz.data.sex) return;
      Object.assign(wiz.data, { age, height, weight });
      next();
    });
  } else if (step.type === "choice") {
    document.querySelectorAll(".wchoices .wchoice").forEach((c) =>
      c.addEventListener("click", () => {
        wiz.data[step.id] = c.dataset.val;
        document.querySelectorAll(".wchoices .wchoice").forEach((x) => x.classList.remove("selected"));
        c.classList.add("selected");
        setTimeout(next, 240); // brief beat so the selection is seen
      }));
    document.getElementById("wnext")?.addEventListener("click", next);
  } else {
    document.getElementById("wfinish").addEventListener("click", finishOnboarding);
  }
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

// One delegated listener so tutorial/help links work in every tab without rewiring.
document.addEventListener("click", (e) => {
  const b = e.target.closest(".exname");
  if (b) openTutorial(b.dataset.ex);
  if (e.target.closest(".helpbtn")) openHelp();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeTutorial(); closeHelp(); endTour(); }
});

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
        <div class="th-right">
          <div class="th-gam">
            <div class="flame ${st.current > 0 ? "lit" : ""}">🔥 ${st.current}</div>
            <div class="lvl">Lv ${x.level + 1} · ${x.levelName}</div>
            <div class="xpbar"><div style="width:${x.toNext * 100}%"></div></div>
          </div>
          <button class="iconbtn helpbtn" title="How to use FitYear">?</button>
        </div>
      </div>
      <div class="phase-chip">${ph.intensity} — ${ph.focus}
        <div class="small mt4">🎯 ${EXPERIENCE[p.experience].note}</div>
        ${p.role === "trainer" ? `<div class="small mt4">📋 ${ph.pro}</div>` : ""}
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
    ${suppCard(t.week, t.dayIdx, day.isTraining)}
    <footer class="note muted small">${HYDRATION_TIP}</footer>`;

  document.getElementById("doneBtn").addEventListener("click", () => {
    setDayDone(key, !done);
    renderToday();
  });
  wireLiftLogs(renderToday);
  wireSupps();
}

/* ---- Supplements (daily checklist) ---- */

function suppCard(week, dayIdx, isTraining) {
  const stack = supplementStack(state.profile, { trainingDay: isTraining });
  const key = `w${week}d${dayIdx}`;
  const ticks = (state.progress.supps || {})[key] || {};
  return `
    <div class="card" id="suppCard">
      <h3>💊 Supplements — best times today</h3>
      <div class="muted small mt4">All optional, food comes first. The why &amp; how lives in <strong>Plan → 💊 Supplements</strong>.</div>
      <div class="supps mt">
        ${stack.map((s) => {
          // On rest days pre/post-workout slots don't exist — take with a meal instead.
          const slot = SUPP_SLOTS[(!isTraining && (s.slot === "post" || s.slot === "pre")) ? "meal" : s.slot];
          return `
          <label class="supp ${ticks[s.id] ? "done" : ""}">
            <input type="checkbox" data-supp="${s.id}" data-key="${key}" ${ticks[s.id] ? "checked" : ""} />
            <span class="sicon">${s.icon}</span>
            <span class="sbody">
              <span class="sname">${s.name}${s.optional ? `<em class="sopt">optional</em>` : ""}</span>
              <span class="small muted">${s.dose}</span>
            </span>
            <span class="stime">${slot.icon} ${slot.short}</span>
          </label>`;
        }).join("")}
      </div>
    </div>`;
}

function wireSupps() {
  document.querySelectorAll("#suppCard input[data-supp]").forEach((chk) => {
    chk.addEventListener("change", () => {
      state.progress.supps = state.progress.supps || {};
      const day = (state.progress.supps[chk.dataset.key] = state.progress.supps[chk.dataset.key] || {});
      if (chk.checked) day[chk.dataset.supp] = true; else delete day[chk.dataset.supp];
      save(STORE.progress, state.progress);
      chk.closest(".supp").classList.toggle("done", chk.checked);
    });
  });
}

/* ================= Plan tab ================= */

function renderPlan() {
  const p = state.profile;
  const targets = getTargets();
  const week = state.progress.currentWeek;
  const page = state.ui.planPage;
  const weekPlan = buildWeek(p, targets, week);
  const ph = weekPlan.phase;

  const weekOptions = Array.from({ length: 52 }, (_, i) => {
    const w = i + 1;
    return `<option value="${w}" ${w === week ? "selected" : ""}>Week ${w} — ${phaseForWeek(w).name}</option>`;
  }).join("");

  const weeknav = `
    <div class="weeknav">
      <button class="navbtn" id="prevWeek" ${week === 1 ? "disabled" : ""}>‹ Prev</button>
      <select id="weekSelect">${weekOptions}</select>
      <button class="navbtn" id="nextWeek" ${week === 52 ? "disabled" : ""}>Next ›</button>
    </div>`;

  const pages = {
    week: () => `
      <div class="phase-banner">
        <span class="name">Week ${week} · ${ph.name}</span> — ${ph.intensity}
        <div class="small mt4">${ph.focus}</div>
        <div class="small mt4">🎯 ${EXPERIENCE[p.experience].label}: ${EXPERIENCE[p.experience].note}</div>
        ${p.role === "trainer" ? `<div class="small mt4">📋 ${ph.pro}</div>` : ""}
      </div>
      ${weeknav}
      ${weekPlan.days.map((d) => dayCard(d, week, targets, ph)).join("")}
      <button class="btn secondary" id="printBtn">🖨️ Print week sheet</button>`,
    grocery: () => `
      ${weeknav}
      <div class="card" id="groceryCard">${groceryHtml(week, targets)}</div>`,
    supps: () => suppGuide(),
    year: () => `
      <h2 class="section-title">🗺️ Your year at a glance</h2>
      <div class="card">
        ${yearMilestones(p).map((m) => `<div class="milestone"><div class="at">${m.at}</div><div>${m.text}</div></div>`).join("")}
      </div>
      <h2 class="section-title">📊 Training phases</h2>
      <div class="card">
        ${PHASES.map((x) => `<div class="milestone"><div class="at">Wk ${x.from}${x.to !== x.from ? "–" + x.to : ""}</div><div><strong>${x.name}</strong> — ${x.focus}</div></div>`).join("")}
      </div>`,
  };

  $view().innerHTML = `
    <div class="pagehead"><h1>📅 Plan</h1><button class="iconbtn helpbtn" title="How to use FitYear">?</button></div>
    <div class="subnav">
      ${[["week", "🏋️ Week"], ["grocery", "🛒 Grocery"], ["supps", "💊 Supplements"], ["year", "🗺️ Year"]]
        .map(([id, label]) => `<button class="${page === id ? "active" : ""}" data-page="${id}">${label}</button>`).join("")}
    </div>
    <div id="planPage">${pages[page]()}</div>`;

  document.querySelectorAll(".subnav [data-page]").forEach((b) =>
    b.addEventListener("click", () => {
      state.ui.planPage = b.dataset.page;
      renderPlan();
      animateView();
      window.scrollTo(0, 0);
    }));

  if (page === "week" || page === "grocery") {
    const go = (w) => { state.progress.currentWeek = w; save(STORE.progress, state.progress); renderPlan(); window.scrollTo(0, 0); };
    document.getElementById("prevWeek").addEventListener("click", () => go(week - 1));
    document.getElementById("nextWeek").addEventListener("click", () => go(week + 1));
    document.getElementById("weekSelect").addEventListener("change", (e) => go(+e.target.value));
  }

  if (page === "week") {
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
  }

  if (page === "grocery") wireGrocery(week, targets);
}

/* ---- Supplement guide (Plan → Supplements) ---- */

function suppGuide() {
  const p = state.profile;
  const stack = supplementStack(p);
  const dietLabel = { veg: "vegetarian", nonveg: "non-vegetarian", vegan: "vegan" }[p.diet];
  return `
    <div class="card">
      <h2>💊 Your supplement stack</h2>
      <div class="muted small mt4">Personalized for <strong>${goalLabel(p.goal).replace(/^\S+ /, "").toLowerCase()}</strong> on a <strong>${dietLabel}</strong> diet.
      Supplements are the last 5% — they top up good food, training and sleep, never replace them. Tick them off each day on the Today tab.</div>
    </div>
    ${stack.map((s) => {
      const slot = SUPP_SLOTS[s.slot];
      return `
      <div class="card suppg">
        <div class="sg-head">
          <span class="sicon">${s.icon}</span>
          <div>
            <div class="sname">${s.name}${s.optional ? `<em class="sopt">optional</em>` : ""}</div>
            <span class="stime">${slot.icon} ${slot.label}</span>
          </div>
        </div>
        <div class="sg-dose"><strong>How much:</strong> ${s.dose}</div>
        <div class="small muted">${s.why}</div>
        ${s.tip ? `<div class="tnote">💡 ${s.tip}</div>` : ""}
      </div>`;
    }).join("")}
    <footer class="note muted small">General guidance, not medical advice. Check with a doctor first if you take medication, are pregnant, or have a health condition.</footer>`;
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
    <div class="pagehead"><h1>📈 Progress</h1><button class="iconbtn helpbtn" title="How to use FitYear">?</button></div>

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
      state.ui.editingProfile = true;
      wiz = null;
      render();
      window.scrollTo(0, 0);
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

/* ================= First-run tour & help ================= */

const TOUR = [
  { sel: ".th-top", title: "Your daily HQ", text: "Day counter, streak 🔥 and XP level. Show up daily and mark days complete to keep the flame lit." },
  { sel: ".day-focus", title: "Today's session", text: "Your workout (or recovery plan) for today. Tap any exercise name for a 📖 step-by-step tutorial with demo photos." },
  { sel: ".liftlog", title: "Log your top set", text: "Type weight × reps — or tap 🎤 and just say “45 kg, 10 reps”. Logged sets build your strength charts." },
  { sel: "#suppCard", title: "Supplement checklist", text: "What to take and the best time to take it, personalized to your goal and diet. The why & how lives in Plan → 💊 Supplements." },
  { sel: "#doneBtn", title: "Finish the day", text: "Mark the day complete for +25 XP — that's what grows your streak, levels and badges." },
  { sel: '.tab[data-tab="plan"]', title: "The Plan tab", text: "All 52 weeks: workouts, grocery lists, your supplement guide and the year roadmap — each on its own page." },
  { sel: '.tab[data-tab="progress"]', title: "The Progress tab", text: "Weight trend, strength charts and badges. Log your weight once a week — your calories auto-adjust to keep you on track." },
  { sel: ".helpbtn", title: "Stuck later?", text: "This ? button opens the full guide any time — you can replay this tour from there too. Have a great year 💪" },
];

let tourIdx = -1;

function startTour() {
  closeHelp();
  state.ui.tab = "today";
  render();
  window.scrollTo(0, 0);
  tourIdx = 0;
  showTourStep();
}

function endTour() {
  if (tourIdx < 0) return;
  tourIdx = -1;
  document.getElementById("tour")?.remove();
  if (!state.progress.tourDone) {
    state.progress.tourDone = true;
    save(STORE.progress, state.progress);
  }
}

function showTourStep() {
  // Skip steps whose target isn't on screen (e.g. no lift log on rest days).
  while (tourIdx < TOUR.length && !document.querySelector(TOUR[tourIdx].sel)) tourIdx++;
  if (tourIdx < 0 || tourIdx >= TOUR.length) { endTour(); return; }
  const step = TOUR[tourIdx];
  const el = document.querySelector(step.sel);
  const vh = window.innerHeight;
  // Tall targets (e.g. the full workout card) can't be centered — pin their top
  // instead and clamp the spotlight so the dim ring and tip stay on screen.
  const tall = el.getBoundingClientRect().height > vh * 0.5;
  el.scrollIntoView({ block: tall ? "start" : "center" });

  let ov = document.getElementById("tour");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "tour";
    document.body.appendChild(ov);
  }
  const r = el.getBoundingClientRect();
  const pad = 8;
  const spotTop = Math.max(r.top - pad, 6);
  const spotH = Math.min(r.height + pad * 2, vh * 0.55);
  const below = spotTop + spotH < vh * 0.72;
  ov.innerHTML = `
    <div class="tour-spot" style="left:${r.left - pad}px;top:${spotTop}px;width:${r.width + pad * 2}px;height:${spotH}px"></div>
    <div class="tour-tip" style="${below ? `top:${spotTop + spotH + 10}px` : `bottom:${vh - spotTop + 10}px`}">
      <div class="tstep">TIP ${tourIdx + 1} OF ${TOUR.length}</div>
      <h3>${step.title}</h3>
      <p>${step.text}</p>
      <div class="tour-btns">
        <button class="tour-skip" id="tourSkip">Skip tour</button>
        <button class="btn tiny" id="tourNext">${tourIdx === TOUR.length - 1 ? "Done ✓" : "Next →"}</button>
      </div>
    </div>`;
  document.getElementById("tourSkip").addEventListener("click", endTour);
  document.getElementById("tourNext").addEventListener("click", () => { tourIdx++; showTourStep(); });
}

const HELP_SECTIONS = [
  ["☀️", "Today", "Your workout, meals and supplement checklist for the current day. Mark the day complete for +25 XP."],
  ["📖", "Exercise how-tos", "Tap any exercise name anywhere in the app for step-by-step instructions with demo photos and video links."],
  ["🎤", "Voice logging", "Next to each exercise, tap 🎤 and say your top set — “45 kg, 10 reps”. Or just type it in."],
  ["📅", "Plan", "Browse all 52 weeks of workouts and meals, jump between weeks, and print a paper sheet for the gym."],
  ["🛒", "Grocery", "A checkable shopping list covering every meal of the selected week — printable too."],
  ["💊", "Supplements", "Your personalized stack with doses and best timing lives in Plan → Supplements; tick them off daily on Today."],
  ["⚖️", "Weekly check-in", "Log your weight once a week in Progress. The coach compares your trend to the healthy rate and auto-adjusts your calories."],
  ["🏅", "XP, streaks & badges", "Completed days, logged sets and check-ins earn XP. Keep the daily 🔥 streak alive and unlock all 8 badges."],
  ["💾", "Backup & privacy", "Everything stays on your device. Use Backup/Restore in Progress to move your data to a new phone."],
];

function openHelp() {
  closeHelp();
  const modal = document.createElement("div");
  modal.className = "tmodal";
  modal.id = "helpModal";
  modal.innerHTML = `
    <div class="tcard">
      <button class="tclose" aria-label="Close">✕</button>
      <h2>❓ How FitYear works</h2>
      ${HELP_SECTIONS.map(([icon, t, d]) => `
        <div class="helprow"><span class="hicon">${icon}</span><div><strong>${t}</strong><div class="small muted">${d}</div></div></div>`).join("")}
      <button class="btn secondary mt" id="replayTour">▶ Replay the guided tour</button>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".tclose")) closeHelp();
  });
  document.getElementById("replayTour").addEventListener("click", startTour);
}

function closeHelp() { document.getElementById("helpModal")?.remove(); }

/* ---- helpers ---- */
function goalLabel(g) {
  return { lose: "🔥 Losing fat", gain: "💪 Building muscle", maintain: "⚖️ Getting fit" }[g];
}
function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

render();
// Show the guided tour once — for brand-new plans and for existing users after this update.
if (state.profile && !state.ui.editingProfile && !state.progress.tourDone) setTimeout(startTour, 400);
