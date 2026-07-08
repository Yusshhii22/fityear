// ===== FitYear planner: turns a user profile into a 52-week plan =====

function calcTargets(p) {
  // Mifflin-St Jeor BMR
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "male" ? 5 : -161);
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 }[p.activity];
  const tdee = bmr * mult;
  let calories;
  if (p.goal === "lose") calories = Math.max(tdee - 500, p.sex === "male" ? 1500 : 1300);
  else if (p.goal === "gain") calories = tdee + 300;
  else calories = tdee;
  calories = Math.round(calories / 10) * 10;

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

function buildWorkout(templateKey, week, equipment) {
  const tpl = DAY_TEMPLATES[templateKey];
  const ph = phaseForWeek(week);
  const exercises = [];
  let slotOffset = 0;
  for (const [category, count] of tpl.slots) {
    for (const [name, note] of pickExercises(category, count, equipment, week, slotOffset)) {
      const isCardio = category === "cardio";
      const isHold = /plank|hold|wall sit|walk/i.test(name) && !isCardio;
      exercises.push({
        name,
        note,
        sets: isCardio ? "—" : `${ph.sets} sets`,
        reps: isCardio ? note : isHold ? "hold" : `${ph.reps} reps`,
        rest: isCardio ? "—" : ph.rest,
      });
    }
    slotOffset += count;
  }
  return { label: tpl.label, exercises, warmup: "5 min warm-up: light cardio + arm/leg swings", cooldown: "5 min cool-down: stretch what you trained" };
}

function buildMealsForDay(diet, targets, week, dayIdx) {
  const db = MEALS[diet];
  const pick = (arr, salt) => arr[(week * 7 + dayIdx + salt) % arr.length];
  const meals = [
    { time: "Breakfast", ...mealObj(pick(db.breakfast, 0)) },
    { time: "Lunch", ...mealObj(pick(db.lunch, 2)) },
    { time: "Snack", ...mealObj(pick(db.snack, 4)) },
    { time: "Dinner", ...mealObj(pick(db.dinner, 1)) },
  ];
  const baseKcal = meals.reduce((s, m) => s + m.kcal, 0);
  const scale = targets.calories / baseKcal;
  for (const m of meals) {
    m.kcal = Math.round(m.kcal * scale / 10) * 10;
    m.protein = Math.round(m.protein * scale);
  }
  return meals;
}

function mealObj([name, kcal, protein]) {
  return { name, kcal, protein };
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
      workout: isTraining ? buildWorkout(split[trainIdx], week, profile.equipment) : null,
      restNote: isTraining ? null : REST_DAY_ACTIVITIES[(week + d) % REST_DAY_ACTIVITIES.length],
      meals: buildMealsForDay(profile.diet, targets, week, d),
    });
  }
  return { week, phase: ph, days };
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
