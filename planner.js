// ===== FitYear planner: turns a user profile into a 52-week plan =====

function calcTargets(p, adjust = 0) {
  // Mifflin-St Jeor BMR
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "male" ? 5 : -161);
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 }[p.activity];
  const tdee = bmr * mult;
  let calories;
  if (p.goal === "lose") calories = Math.max(tdee - 500, p.sex === "male" ? 1500 : 1300);
  else if (p.goal === "gain") calories = tdee + 300;
  else calories = tdee;
  // adjust: cumulative calorie correction from weekly check-ins (adaptive coaching)
  calories = Math.round((calories + adjust) / 10) * 10;

  const proteinPerKg = { lose: 2.0, gain: 1.8, maintain: 1.6 }[p.goal];
  const protein = Math.round(p.weight * proteinPerKg);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, fat, carbs, tdee: Math.round(tdee) };
}

function phaseForWeek(week) {
  return PHASES.find((ph) => week >= ph.from && week <= ph.to);
}

function phaseIndex(week) {
  return PHASES.findIndex((ph) => week >= ph.from && week <= ph.to);
}

// Deterministic exercise pick: rotates variations each phase so users can
// progress on the same lifts within a phase, with fresh variety after it.
function pickExercises(category, count, equipment, week, slotOffset) {
  const pool = EXERCISES[equipment][category];
  const rotation = phaseIndex(week); // changes per phase
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(rotation + slotOffset + i) % pool.length]);
  }
  return out;
}

// Set volume for the user's level: deloads stay light, everything else shifts by setAdj.
function effectiveSets(ph, experience) {
  if (ph.name.includes("Deload")) return ph.sets;
  const adj = EXPERIENCE[experience]?.setAdj || 0;
  return Math.max(2, Math.min(5, ph.sets + adj));
}

function buildWorkout(templateKey, week, equipment, experience) {
  const tpl = DAY_TEMPLATES[templateKey];
  const ph = phaseForWeek(week);
  const sets = effectiveSets(ph, experience);
  const exercises = [];
  let slotOffset = 0;
  for (const [category, count] of tpl.slots) {
    for (const [name, note] of pickExercises(category, count, equipment, week, slotOffset)) {
      const isCardio = category === "cardio";
      const isHold = /plank|hold|wall sit|walk|pose/i.test(name) && !isCardio;
      exercises.push({
        name,
        note,
        sets: isCardio ? "—" : `${sets} sets`,
        reps: isCardio ? note : isHold ? "hold" : `${ph.reps} reps`,
        rest: isCardio ? "—" : ph.rest,
      });
    }
    slotOffset += count;
  }

  // Athlete bonus: one extra exercise from the day's primary muscle group,
  // skipped on deload weeks and inserted ahead of any cardio finisher.
  if (!ph.name.includes("Deload") && (EXPERIENCE[experience]?.extraEx || 0) > 0) {
    const [category] = tpl.slots.find(([cat]) => cat !== "cardio") || [];
    if (category) {
      const used = new Set(exercises.map((e) => e.name));
      const candidate = EXERCISES[equipment][category].find(([n]) => !used.has(n));
      if (candidate) {
        const [name, note] = candidate;
        const isHold = /plank|hold|wall sit|walk|pose/i.test(name);
        const bonus = {
          name, note, bonus: true,
          sets: `${sets} sets`,
          reps: isHold ? "hold" : `${ph.reps} reps`,
          rest: ph.rest,
        };
        const cardioIdx = exercises.findIndex((e) => e.sets === "—");
        if (cardioIdx === -1) exercises.push(bonus);
        else exercises.splice(cardioIdx, 0, bonus);
      }
    }
  }

  // Cool-down: one stretch per trained movement category, rotated each phase
  // for variety and de-duplicated (some stretches cover multiple groups).
  const seen = new Set();
  const cooldown = [];
  [...new Set(tpl.slots.map(([cat]) => cat))].forEach((cat, i) => {
    const pool = COOLDOWNS[cat];
    const pick = pool[(phaseIndex(week) + i) % pool.length];
    if (!seen.has(pick[0])) { seen.add(pick[0]); cooldown.push(pick); }
  });

  return { label: tpl.label, exercises, warmup: "5 min warm-up: light cardio + arm/leg swings", cooldown };
}

/* ===== Meals: computed from the ingredient database ===== */

// Human-friendly quantity: countables as pieces, everything else in grams.
function displayQty(ing, grams, roundUp = false) {
  const info = INGREDIENTS[ing];
  if (info.piece) {
    let n = roundUp ? Math.ceil(grams / info.piece) : Math.round((grams / info.piece) * 2) / 2;
    n = Math.max(n, roundUp ? 1 : 0.5);
    return `${n} ${info.pieceName}${n === 1 ? "" : "s"}`;
  }
  const step = roundUp ? 10 : 5;
  const g = Math.max(step, (roundUp ? Math.ceil : Math.round)(grams / step) * step);
  return `${g}g ${ing}`;
}

// Compute a meal's macros and portioned ingredients at a given scale factor.
function computeMeal(def, factor = 1) {
  let kcal = 0, protein = 0;
  const items = def.items.map(([ing, base]) => {
    const info = INGREDIENTS[ing];
    const grams = base * factor;
    kcal += (grams * info.kcal) / 100;
    protein += (grams * info.prot) / 100;
    return { ing, grams, display: displayQty(ing, grams) };
  });
  return { name: def.n, kcal: Math.round(kcal / 10) * 10, protein: Math.round(protein), items };
}

function mealDefsForDay(diet, week, dayIdx) {
  const db = MEALS[diet];
  const pick = (arr, salt) => arr[(week * 7 + dayIdx + salt) % arr.length];
  return [
    { time: "Breakfast", def: pick(db.breakfast, 0) },
    { time: "Lunch", def: pick(db.lunch, 2) },
    { time: "Snack", def: pick(db.snack, 4) },
    { time: "Dinner", def: pick(db.dinner, 1) },
  ];
}

// Scale factor so the day's meals hit the calorie target (portions stay sane).
function dayScaleFactor(defs, targetKcal) {
  const base = defs.reduce((s, m) => s + computeMeal(m.def).kcal, 0);
  return Math.min(1.7, Math.max(0.6, targetKcal / base));
}

function buildMealsForDay(diet, targets, week, dayIdx) {
  const defs = mealDefsForDay(diet, week, dayIdx);
  const factor = dayScaleFactor(defs, targets.calories);
  return defs.map((m) => ({ time: m.time, ...computeMeal(m.def, factor) }));
}

// Aggregate a full week's scaled ingredients into a grocery list by category.
function groceryForWeek(profile, targets, week) {
  const totals = {}; // ing -> grams
  for (let d = 0; d < 7; d++) {
    const defs = mealDefsForDay(profile.diet, week, d);
    const factor = dayScaleFactor(defs, targets.calories);
    for (const { def } of defs) {
      for (const [ing, base] of def.items) {
        totals[ing] = (totals[ing] || 0) + base * factor;
      }
    }
  }
  const groups = {};
  for (const [ing, grams] of Object.entries(totals)) {
    const cat = INGREDIENTS[ing].cat;
    (groups[cat] = groups[cat] || []).push({ ing, grams, display: displayQty(ing, grams, true) });
  }
  for (const cat of Object.keys(groups)) groups[cat].sort((a, b) => b.grams - a.grams);
  return groups;
}

// Build one week of the plan: 7 day objects.
function buildWeek(profile, targets, week) {
  const split = SPLITS[profile.days];
  const placement = DAY_PLACEMENT[profile.days];
  const ph = phaseForWeek(week);
  const days = [];
  for (let d = 0; d < 7; d++) {
    const trainIdx = placement.indexOf(d);
    const isTraining = trainIdx !== -1;
    days.push({
      dayName: DAY_NAMES[d],
      dayIdx: d,
      isTraining,
      workout: isTraining ? buildWorkout(split[trainIdx], week, profile.equipment, profile.experience) : null,
      restNote: isTraining ? null : REST_DAY_ACTIVITIES[(week + d) % REST_DAY_ACTIVITIES.length],
      meals: buildMealsForDay(profile.diet, targets, week, d),
    });
  }
  return { week, phase: ph, days };
}

// Personalized supplement stack for a profile, ordered by time of day.
function supplementStack(profile, { trainingDay = true } = {}) {
  const order = ["morning", "pre", "post", "meal", "anytime"];
  return SUPPLEMENTS
    .filter((s) =>
      (!s.goals || s.goals.includes(profile.goal)) &&
      (!s.diets || s.diets.includes(profile.diet)) &&
      (trainingDay || !s.trainOnly))
    .sort((a, b) => order.indexOf(a.slot) - order.indexOf(b.slot));
}

// Rough progress milestones for the year overview.
function yearMilestones(profile) {
  const goalText = {
    lose: "fat loss of roughly 0.4–0.5 kg/week when consistent",
    gain: "lean muscle gain of roughly 1–2 kg per quarter",
    maintain: "steady strength and fitness gains at the same body weight",
  }[profile.goal];
  return [
    { at: "Weeks 1–4", text: "Habit building. Expect better sleep and energy before the mirror changes." },
    { at: "Weeks 5–12", text: `First visible changes — ${goalText}.` },
    { at: "Week 26", text: "Halfway check-in: re-take photos and measurements. This is where most people see undeniable change." },
    { at: "Weeks 27–39", text: "Strength phase — expect your main lifts to jump noticeably." },
    { at: "Week 52", text: "Full transformation checkpoint: compare to day 1 and set year-two goals." },
  ];
}
