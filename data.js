// ===== FitYear data: exercises, splits, phases, ingredients, meals =====

// Exercises grouped by equipment level, then by movement category.
// Each entry: [name, note]
const EXERCISES = {
  none: { // bodyweight only
    quads:      [["Bodyweight Squat", "Slow 3s descent"], ["Split Squat", "Each leg"], ["Wall Sit", "Hold 30–60s"], ["Jump Squat", "Land soft"]],
    hinge:      [["Glute Bridge", "Squeeze at top"], ["Single-Leg Glute Bridge", "Each leg"], ["Good Morning (bodyweight)", "Hips back"], ["Reverse Lunge", "Each leg"]],
    push:       [["Push-Up", "Knees down if needed"], ["Incline Push-Up", "Hands on table"], ["Pike Push-Up", "Shoulders"], ["Diamond Push-Up", "Triceps focus"]],
    pull:       [["Doorway Row", "Use a towel/door"], ["Superman Hold", "Hold 10–20s"], ["Prone Y-T-W Raise", "Slow and controlled"], ["Reverse Snow Angel", "Squeeze shoulder blades"]],
    shoulders:  [["Pike Push-Up", "Hips high"], ["Arm Circles + Plank Taps", "45s"], ["Wall Handstand Hold", "Only if confident"], ["Lateral Plank Walk", "10 steps each way"]],
    arms:       [["Diamond Push-Up", "Triceps"], ["Bench/Chair Dip", "Elbows back"], ["Chin-Up (bar/door frame)", "Or isometric hold"], ["Close-Grip Push-Up", "Elbows tucked"]],
    core:       [["Plank", "30–60s"], ["Dead Bug", "Slow, lower back flat"], ["Bicycle Crunch", "Controlled"], ["Side Plank", "Each side"], ["Mountain Climber", "45s"], ["Leg Raise", "Slow lower"]],
    cardio:     [["Brisk Walk / Jog", "20–30 min"], ["Jumping Jacks + High Knees", "10 min intervals"], ["Stair Climbs", "10–15 min"], ["Burpee Intervals", "30s on / 30s off × 8"]],
  },
  home: { // dumbbells + resistance bands
    quads:      [["Goblet Squat", "Dumbbell at chest"], ["DB Split Squat", "Each leg"], ["DB Step-Up", "Each leg"], ["DB Lunge", "Each leg"]],
    hinge:      [["DB Romanian Deadlift", "Hips back, flat back"], ["DB Hip Thrust", "Shoulders on sofa/bench"], ["Single-Leg RDL", "Each leg"], ["Band Good Morning", "Slow"]],
    push:       [["DB Floor Press", "Or bench press"], ["Push-Up", "Add weight on back to progress"], ["DB Incline Press", "If bench available"], ["Band Chest Press", "Squeeze at front"]],
    pull:       [["One-Arm DB Row", "Each arm"], ["Band Pull-Apart", "Slow"], ["Bent-Over DB Row", "Flat back"], ["Band Lat Pulldown", "Anchor high"]],
    shoulders:  [["DB Shoulder Press", "Seated or standing"], ["DB Lateral Raise", "Light, controlled"], ["DB Front Raise", "No swinging"], ["Band Face Pull", "High elbows"]],
    arms:       [["DB Bicep Curl", "No swinging"], ["DB Overhead Triceps Extension", "Elbows in"], ["Hammer Curl", "Neutral grip"], ["DB Skull Crusher", "On floor/bench"]],
    core:       [["Plank", "45–75s"], ["DB Russian Twist", "Controlled"], ["Dead Bug", "Slow"], ["Weighted Sit-Up", "DB on chest"], ["Side Plank + Reach", "Each side"], ["Hanging/Lying Leg Raise", "Slow lower"]],
    cardio:     [["Brisk Walk / Jog", "25–35 min"], ["DB Complex (row+squat+press)", "5 rounds"], ["Jump Rope", "10–15 min"], ["Band + Bodyweight Circuit", "20 min"]],
  },
  gym: { // full gym
    quads:      [["Barbell Back Squat", "Depth to parallel"], ["Leg Press", "Full range"], ["Hack Squat", "Controlled descent"], ["Bulgarian Split Squat", "Each leg"], ["Leg Extension", "Squeeze at top"]],
    hinge:      [["Romanian Deadlift", "Hips back, flat back"], ["Conventional Deadlift", "Brace hard"], ["Hip Thrust", "Pause at top"], ["Lying Leg Curl", "Slow negative"], ["Cable Pull-Through", "Glutes"]],
    push:       [["Barbell Bench Press", "Touch chest, control"], ["Incline DB Press", "45° bench"], ["Machine Chest Press", "Full stretch"], ["Cable Fly", "Squeeze"], ["Weighted Dip", "Lean forward"]],
    pull:       [["Lat Pulldown", "Pull to collarbone"], ["Seated Cable Row", "Squeeze shoulder blades"], ["Pull-Up / Assisted Pull-Up", "Full hang"], ["Barbell Row", "Flat back"], ["Chest-Supported Row", "Strict"]],
    shoulders:  [["Overhead Press", "Brace core"], ["DB Lateral Raise", "Light, high reps"], ["Cable Face Pull", "High elbows"], ["Machine Shoulder Press", "Full range"], ["Rear Delt Fly", "Light"]],
    arms:       [["EZ-Bar Curl", "No swinging"], ["Cable Triceps Pushdown", "Elbows pinned"], ["Incline DB Curl", "Full stretch"], ["Overhead Cable Extension", "Slow"], ["Preacher Curl", "Controlled"]],
    core:       [["Cable Crunch", "Round the spine"], ["Hanging Leg Raise", "No swing"], ["Plank", "60s"], ["Ab Wheel Rollout", "As far as controllable"], ["Weighted Side Bend", "Each side"], ["Decline Sit-Up", "Slow"]],
    cardio:     [["Incline Treadmill Walk", "20–30 min"], ["Stationary Bike Intervals", "30s hard / 90s easy × 10"], ["Rowing Machine", "15–20 min steady"], ["Stairmaster", "15 min"]],
  },
  calisthenics: { // bar-based bodyweight skill work
    quads:      [["Assisted Pistol Squat", "Hold a pole/door frame, each leg"], ["Cossack Squat", "Each side"], ["Jump Squat", "Land soft"], ["Bulgarian Split Squat (bodyweight)", "Rear foot on a bench"]],
    hinge:      [["Nordic Curl Negative", "Anchor feet, lower as slow as possible"], ["Single-Leg Glute Bridge", "Each leg"], ["Glute Bridge March", "Alternate legs, hips level"], ["Broad Jump", "Stick the landing"]],
    push:       [["Dip (parallel bars)", "Slight forward lean"], ["Push-Up", "Chest to floor"], ["Pseudo Planche Push-Up", "Hands by hips, lean forward"], ["Decline Push-Up", "Feet elevated"]],
    pull:       [["Pull-Up", "Full hang, chest to bar"], ["Australian Row (low bar)", "Body straight"], ["Chin-Up", "Squeeze at the top"], ["Archer Pull-Up Progression", "Shift side to side"]],
    shoulders:  [["Pike Push-Up", "Hips high"], ["Wall Handstand Hold", "Only if confident"], ["Handstand Push-Up Progression", "Partial range first"], ["Lateral Plank Walk", "10 steps each way"]],
    arms:       [["Close-Grip Chin-Up", "Biceps focus"], ["Diamond Push-Up", "Triceps"], ["Straight-Bar Dip", "Elbows back"], ["Bench Dip", "Slow negative"]],
    core:       [["Hanging Leg Raise", "No swing"], ["L-Sit Progression", "Tucked first, extend later"], ["Hollow Body Hold", "Lower back pressed down"], ["Dragon Flag Negative", "As slow as possible"], ["Plank", "60s"]],
    cardio:     [["Burpee Intervals", "30s on / 30s off × 8"], ["Jump Rope", "10–15 min"], ["Sprint Intervals", "8 × 20s, walk back to recover"], ["Stair Climbs", "10–15 min"]],
  },
  crossfit: { // functional HIIT — kettlebell/dumbbell/barbell helpful, scalable
    quads:      [["Air Squat", "Fast pace, crisp reps"], ["Wall Ball / DB Thruster", "Full depth, drive up"], ["Goblet Squat (KB/DB)", "Upright torso"], ["Box Step-Up or Jump", "Land soft"]],
    hinge:      [["Kettlebell Swing", "Snap the hips, arms relaxed"], ["Deadlift (barbell or KB)", "Brace hard, flat back"], ["Single-Leg RDL", "Each leg"], ["Broad Jump", "Stick the landing"]],
    push:       [["Push Press", "Use leg drive"], ["Burpee", "Chest to floor every rep"], ["Hand-Release Push-Up", "Full reset each rep"], ["DB Floor Press", "Control the descent"]],
    pull:       [["Pull-Up (strict or banded)", "Full hang"], ["Ring/TRX or Table Row", "Body straight"], ["Renegade Row", "Minimal hip sway"], ["Bent-Over Row", "Flat back"]],
    shoulders:  [["Strict Overhead Press", "Brace core"], ["DB Snatch", "Alternate arms"], ["Wall Walk", "Slow and controlled"], ["DB Lateral Raise", "Light, controlled"]],
    arms:       [["Ring or Bench Dip", "Elbows back"], ["Chin-Up", "Or isometric hold"], ["Hammer Curl", "No swinging"], ["Close-Grip Push-Up", "Elbows tucked"]],
    core:       [["Toes-to-Bar / Knee Raise", "No swing"], ["V-Up", "Reach for your toes"], ["Plank", "60s"], ["Butterfly Sit-Up", "Touch behind your head"], ["Russian Twist", "Controlled"]],
    cardio:     [["Row / Bike Intervals", "30s hard / 90s easy × 10"], ["Double-Unders / Jump Rope", "10–15 min"], ["EMOM Burpees", "10 burpees every minute × 10"], ["400m Run Repeats", "4–6 rounds, rest 90s"]],
  },
  yoga: { // yoga & pilates — mat-based strength, control and mobility
    quads:      [["Chair Pose Hold", "Sink hips, weight in heels"], ["Warrior II Pose", "30s each side"], ["Crescent Lunge Pulse", "Small pulses, each leg"], ["Pilates Squat to Heel Raise", "Slow tempo"]],
    hinge:      [["Bridge Pose Hold", "Squeeze glutes at the top"], ["Single-Leg Bridge Lift", "Each leg"], ["Locust Pose Hold", "Lift chest and legs"], ["Pilates Shoulder Bridge", "Roll up one vertebra at a time"]],
    push:       [["Chaturanga Push-Up", "Elbows tucked, knees down if needed"], ["Dolphin Push-Up", "Forearms down, nose to floor"], ["Pilates Push-Up", "Roll down, walk out, push"], ["Down Dog to Plank Flow", "Slow transitions"]],
    pull:       [["Superman Hold", "Hold 10–20s"], ["Pilates Swimming", "Steady flutter, long limbs"], ["Reverse Plank Hold", "Open the chest"], ["Prone Y-T-W Raise", "Slow and controlled"]],
    shoulders:  [["Dolphin Pose Hold", "Hips high, forearms down"], ["Down Dog Hold", "Press the floor away"], ["Side Plank Star Pose", "Each side"], ["Pilates Arm Circle Series", "45s continuous"]],
    arms:       [["Crow Pose Practice", "Play at your edge, cushion below"], ["Chaturanga Hold", "Hover halfway down"], ["Side Plank Pose", "Each side"], ["Mat Triceps Dip", "From reverse tabletop"]],
    core:       [["Boat Pose Hold", "Long spine, chest open"], ["Pilates Hundred", "Pump arms, steady breath"], ["Pilates Teaser Progression", "Roll up with control"], ["Dead Bug", "Slow, lower back flat"], ["Side Plank Pose", "Each side"]],
    cardio:     [["Sun Salutation Rounds", "8–10 continuous rounds"], ["Power Vinyasa Flow", "15–20 min steady"], ["Brisk Walk", "20–30 min"], ["Pilates Standing Series", "10 min continuous"]],
  },
};

// Cool-down stretches per movement category — each workout ends with the
// stretches matching what was actually trained. [name, duration]
const COOLDOWNS = {
  quads:     [["Standing quad stretch", "30s each side"], ["Kneeling hip-flexor stretch", "30s each side"], ["Deep squat hold", "45s"]],
  hinge:     [["Standing hamstring stretch", "30s each side"], ["Figure-4 glute stretch", "30s each side"], ["Seated forward fold", "45s"]],
  push:      [["Doorway chest stretch", "30s"], ["Overhead triceps stretch", "20s each arm"], ["Wall pec stretch", "30s each side"]],
  pull:      [["Overhead lat stretch (hold a frame, lean back)", "30s each side"], ["Dead hang or child's pose", "30–45s"], ["Cross-body rear-delt stretch", "20s each arm"]],
  shoulders: [["Cross-body shoulder stretch", "20s each arm"], ["Thread-the-needle", "30s each side"], ["Doorway chest stretch", "30s"]],
  arms:      [["Overhead triceps stretch", "20s each arm"], ["Wall biceps stretch", "20s each arm"], ["Wrist circles + forearm stretch", "30s"]],
  core:      [["Cobra stretch", "30s"], ["Cat-cow", "6 slow rounds"], ["Child's pose", "45s"]],
  cardio:    [["Slow walk to bring heart rate down", "2 min"], ["Standing calf stretch", "30s each side"], ["Deep belly breathing", "5 slow breaths"]],
};

// Workout day templates: list of [category, slots] — how many exercises from each category.
const DAY_TEMPLATES = {
  fullA: { label: "Full Body A", slots: [["quads",1],["push",1],["pull",1],["hinge",1],["core",1]] },
  fullB: { label: "Full Body B", slots: [["hinge",1],["shoulders",1],["pull",1],["quads",1],["core",1]] },
  fullC: { label: "Full Body C", slots: [["quads",1],["push",1],["pull",1],["arms",1],["core",1]] },
  upper: { label: "Upper Body",  slots: [["push",2],["pull",2],["shoulders",1],["arms",1]] },
  lower: { label: "Lower Body",  slots: [["quads",2],["hinge",2],["core",2]] },
  push:  { label: "Push (Chest/Shoulders/Triceps)", slots: [["push",2],["shoulders",2],["arms",1],["core",1]] },
  pull:  { label: "Pull (Back/Biceps)",             slots: [["pull",3],["shoulders",1],["arms",1],["core",1]] },
  legs:  { label: "Legs",        slots: [["quads",2],["hinge",2],["core",1],["cardio",1]] },
  cardio:{ label: "Cardio + Core", slots: [["cardio",1],["core",3]] },
};

// Weekly splits by training days per week.
const SPLITS = {
  2: ["fullA", "fullB"],
  3: ["fullA", "fullB", "fullC"],
  4: ["upper", "lower", "upper", "lower"],
  5: ["push", "pull", "legs", "upper", "lower"],
  6: ["push", "pull", "legs", "push", "pull", "legs"],
};

// Preferred training-day placement (0 = Monday) so sessions are spread out.
const DAY_PLACEMENT = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
};

// Training experience levels. setAdj shifts per-exercise set volume
// (clamped 2–5, never applied on deload weeks); note is level-specific coaching.
const EXPERIENCE = {
  newbie:       { label: "Newbie",       setAdj: -1, note: "Form first: stop 3–4 reps short of failure, and open the 📖 how-to before every new exercise." },
  beginner:     { label: "Beginner",     setAdj: 0,  note: "Stop 2–3 reps short of failure. Add weight only when every rep of every set feels clean." },
  intermediate: { label: "Intermediate", setAdj: 0,  note: "Programmed as written — push the last set of each exercise close to failure." },
  advanced:     { label: "Advanced",     setAdj: 1,  note: "Extra volume included for your level. Take the last set of each exercise near failure." },
  athlete:      { label: "Athlete",      setAdj: 1,  extraEx: 1, note: "Extra volume + a 🏆 bonus exercise each session. On the final set of big lifts add a technique: pause reps, a drop set, or rest-pause." },
};

// Who is using the app. Trainers see the programming rationale (pro notes
// below); everyone else gets the plain-English coaching only.
const ROLES = {
  trainer: { label: "Pro Trainer", icon: "🎓" },
  bro:     { label: "Gym Bro/Sis", icon: "💪" },
};

// 52-week periodization. Each phase: sets/reps scheme + focus note.
// `pro` is the trainer-facing programming rationale for that block.
const PHASES = [
  { from: 1,  to: 4,  name: "Foundation",       sets: 2, reps: "12–15", rest: "60s",  intensity: "Easy–moderate (RPE 6)", focus: "Learn every movement with perfect form. Weights stay light — consistency is the only goal this month.",
    pro: "Anatomical adaptation: 2×12–15 @ RPE 6, slow eccentrics, groove movement patterns before loading." },
  { from: 5,  to: 12, name: "Build I",          sets: 3, reps: "10–12", rest: "75s",  intensity: "Moderate (RPE 7)",      focus: "Add a little weight or 1–2 reps every week. Finish all sets close to — but not at — failure.",
    pro: "Hypertrophy block 1: 3×10–12 @ RPE 7, double progression (reps first, then load)." },
  { from: 13, to: 13, name: "Deload",           sets: 2, reps: "10",    rest: "60s",  intensity: "Light (RPE 5)",         focus: "Recovery week. Half the usual effort, extra sleep, extra walking. You'll come back stronger.",
    pro: "Deload: ~50% volume cut @ RPE 5, keep frequency and patterns, restore readiness." },
  { from: 14, to: 25, name: "Build II",         sets: 3, reps: "8–12",  rest: "90s",  intensity: "Moderate-hard (RPE 7–8)", focus: "New exercise variations this phase. Push the last set of each exercise harder.",
    pro: "Hypertrophy block 2: 3×8–12 @ RPE 7–8, rotated variations for novel stimulus, top-set emphasis." },
  { from: 26, to: 26, name: "Deload + Check-in", sets: 2, reps: "10",   rest: "60s",  intensity: "Light (RPE 5)",         focus: "Halfway point! Recovery week. Re-take measurements and progress photos, compare to week 1.",
    pro: "Deload + mid-macro assessment: measurements, photos, and informal strength re-tests." },
  { from: 27, to: 38, name: "Strength",         sets: 4, reps: "6–8",   rest: "2min", intensity: "Hard (RPE 8)",          focus: "Heavier weight, fewer reps, longer rest. Log your top set each session and try to beat it.",
    pro: "Strength block: 4×6–8 @ RPE 8, full rests, track top sets — the app charts estimated 1RM (Epley)." },
  { from: 39, to: 39, name: "Deload",           sets: 2, reps: "10",    rest: "60s",  intensity: "Light (RPE 5)",         focus: "Recovery week before the final push.",
    pro: "Deload pre-peak: ~50% volume cut @ RPE 5 to dissipate fatigue before the overreach block." },
  { from: 40, to: 51, name: "Peak",             sets: 4, reps: "8–12",  rest: "90s",  intensity: "Hard (RPE 8–9)",        focus: "Highest volume of the year. Everything you've built comes together — chase rep PRs.",
    pro: "Peak volume block: 4×8–12 @ RPE 8–9, highest tonnage of the macrocycle, rep-PR focus." },
  { from: 52, to: 52, name: "Victory Lap",      sets: 3, reps: "10",    rest: "90s",  intensity: "Moderate (RPE 7)",      focus: "One year done. Re-test everything from week 1, take final photos, and plan year two. Be proud.",
    pro: "Transition week: 3×10 @ RPE 7, full re-test battery, then plan the next macrocycle." },
];

// ===== Ingredients =====
// Nutrition per 100g (approximate). `piece` = grams per countable unit for display.
// cat: produce | grains | protein | dairy | pantry
const INGREDIENTS = {
  "oats":                { cat: "grains",  kcal: 389, prot: 13.5 },
  "poha":                { cat: "grains",  kcal: 350, prot: 6.6 },
  "besan":               { cat: "grains",  kcal: 387, prot: 22 },
  "granola":             { cat: "grains",  kcal: 450, prot: 10 },
  "whole-wheat bread":   { cat: "grains",  kcal: 250, prot: 12, piece: 30, pieceName: "slice" },
  "roti":                { cat: "grains",  kcal: 300, prot: 10, piece: 40, pieceName: "roti" },
  "rice (cooked)":       { cat: "grains",  kcal: 130, prot: 2.7 },
  "quinoa (cooked)":     { cat: "grains",  kcal: 120, prot: 4.4 },
  "egg":                 { cat: "protein", kcal: 143, prot: 12.5, piece: 50, pieceName: "egg" },
  "chicken breast":      { cat: "protein", kcal: 165, prot: 31 },
  "chicken (curry cut)": { cat: "protein", kcal: 170, prot: 20 },
  "chicken keema":       { cat: "protein", kcal: 170, prot: 20 },
  "chicken sausage":     { cat: "protein", kcal: 200, prot: 14, piece: 50, pieceName: "sausage" },
  "fish fillet":         { cat: "protein", kcal: 100, prot: 21 },
  "tuna (canned)":       { cat: "protein", kcal: 116, prot: 26 },
  "tofu":                { cat: "protein", kcal: 76,  prot: 8 },
  "soya chunks (dry)":   { cat: "protein", kcal: 345, prot: 52 },
  "dal (cooked)":        { cat: "protein", kcal: 120, prot: 7.5 },
  "rajma (cooked)":      { cat: "protein", kcal: 127, prot: 8.7 },
  "chole (cooked)":      { cat: "protein", kcal: 164, prot: 8.9 },
  "edamame":             { cat: "protein", kcal: 122, prot: 11 },
  "paneer":              { cat: "dairy",   kcal: 296, prot: 18 },
  "milk":                { cat: "dairy",   kcal: 62,  prot: 3.2 },
  "almond milk":         { cat: "dairy",   kcal: 17,  prot: 0.6 },
  "curd":                { cat: "dairy",   kcal: 60,  prot: 3.5 },
  "greek yogurt":        { cat: "dairy",   kcal: 73,  prot: 10 },
  "buttermilk":          { cat: "dairy",   kcal: 25,  prot: 1.5 },
  "banana":              { cat: "produce", kcal: 89,  prot: 1.1, piece: 120, pieceName: "banana" },
  "apple":               { cat: "produce", kcal: 52,  prot: 0.3, piece: 180, pieceName: "apple" },
  "berries":             { cat: "produce", kcal: 50,  prot: 0.7 },
  "onion":               { cat: "produce", kcal: 40,  prot: 1.1 },
  "tomato":              { cat: "produce", kcal: 18,  prot: 0.9 },
  "spinach":             { cat: "produce", kcal: 23,  prot: 2.9 },
  "mixed vegetables":    { cat: "produce", kcal: 40,  prot: 2 },
  "salad veg (cucumber/tomato/onion)": { cat: "produce", kcal: 20, prot: 1 },
  "moong sprouts":       { cat: "produce", kcal: 30,  prot: 3 },
  "peanut butter":       { cat: "pantry",  kcal: 590, prot: 25 },
  "peanuts":             { cat: "pantry",  kcal: 567, prot: 26 },
  "almonds":             { cat: "pantry",  kcal: 579, prot: 21 },
  "roasted chana":       { cat: "pantry",  kcal: 369, prot: 17 },
  "hummus":              { cat: "pantry",  kcal: 166, prot: 8 },
  "tahini":              { cat: "pantry",  kcal: 595, prot: 17 },
  "whey protein":        { cat: "pantry",  kcal: 400, prot: 80, piece: 30, pieceName: "scoop" },
  "plant protein":       { cat: "pantry",  kcal: 380, prot: 70, piece: 30, pieceName: "scoop" },
  "oil/ghee":            { cat: "pantry",  kcal: 884, prot: 0 },
  "honey":               { cat: "pantry",  kcal: 304, prot: 0.3 },
};

// ===== Meals =====
// Each meal: { n: name, items: [[ingredient, grams], ...] }
// Macros are computed from ingredients; portions scale with the user's calorie target.
const M = {
  oatsPB:      { n: "Oats + banana + peanut butter", items: [["oats", 50], ["milk", 200], ["banana", 120], ["peanut butter", 15]] },
  oatsVegan:   { n: "Oats in almond milk + banana + peanut butter", items: [["oats", 60], ["almond milk", 250], ["banana", 120], ["peanut butter", 15]] },
  yogurtBowl:  { n: "Greek yogurt granola bowl", items: [["greek yogurt", 200], ["granola", 50], ["berries", 50], ["honey", 10]] },
  chanaButtermilk: { n: "Roasted chana + buttermilk", items: [["roasted chana", 40], ["buttermilk", 200]] },
  appleAlmonds:    { n: "Apple + almonds", items: [["apple", 180], ["almonds", 20]] },
  wheyBanana:      { n: "Whey protein shake + banana", items: [["whey protein", 30], ["banana", 120]] },
  plantBanana:     { n: "Plant protein shake + banana", items: [["plant protein", 30], ["banana", 120]] },
  sproutChaat:     { n: "Sprout chaat with peanuts", items: [["moong sprouts", 150], ["onion", 30], ["tomato", 50], ["peanuts", 20]] },
  pbToast:         { n: "Peanut butter toast", items: [["whole-wheat bread", 60], ["peanut butter", 20]] },
  tofuRice:    { n: "Tofu & veg stir-fry + rice", items: [["tofu", 150], ["mixed vegetables", 150], ["rice (cooked)", 180], ["oil/ghee", 10]] },
  dalKhichdi:  { n: "Dal khichdi + salad", items: [["dal (cooked)", 150], ["rice (cooked)", 150], ["salad veg (cucumber/tomato/onion)", 100], ["oil/ghee", 5]] },
};

const MEALS = {
  veg: {
    breakfast: [
      { n: "Paneer bhurji + toast", items: [["paneer", 80], ["whole-wheat bread", 60], ["onion", 30], ["oil/ghee", 5]] },
      M.oatsPB,
      { n: "Besan chilla + curd", items: [["besan", 60], ["onion", 30], ["curd", 100], ["oil/ghee", 5]] },
      M.yogurtBowl,
      { n: "Poha with peanuts + milk", items: [["poha", 60], ["peanuts", 20], ["onion", 30], ["oil/ghee", 5], ["milk", 200]] },
    ],
    lunch: [
      { n: "Rajma chawal + curd + salad", items: [["rajma (cooked)", 200], ["rice (cooked)", 200], ["salad veg (cucumber/tomato/onion)", 100], ["curd", 100]] },
      { n: "Dal + roti + sabzi", items: [["dal (cooked)", 200], ["roti", 80], ["mixed vegetables", 150], ["oil/ghee", 5]] },
      { n: "Paneer curry + roti + salad", items: [["paneer", 100], ["roti", 80], ["tomato", 50], ["onion", 30], ["oil/ghee", 10], ["salad veg (cucumber/tomato/onion)", 100]] },
      { n: "Chole + rice + salad", items: [["chole (cooked)", 200], ["rice (cooked)", 180], ["salad veg (cucumber/tomato/onion)", 100]] },
      { n: "Soya chunk curry + rice", items: [["soya chunks (dry)", 40], ["rice (cooked)", 200], ["mixed vegetables", 100], ["oil/ghee", 10]] },
    ],
    snack: [M.chanaButtermilk, M.appleAlmonds, M.wheyBanana, M.sproutChaat, M.pbToast],
    dinner: [
      { n: "Palak paneer + roti", items: [["spinach", 150], ["paneer", 80], ["roti", 80], ["oil/ghee", 10]] },
      { n: "Dal khichdi + curd", items: [["dal (cooked)", 150], ["rice (cooked)", 150], ["curd", 100]] },
      M.tofuRice,
      { n: "Paneer bhurji + roti", items: [["paneer", 80], ["roti", 80], ["onion", 30], ["oil/ghee", 5]] },
      { n: "Mixed dal + jeera rice + sabzi", items: [["dal (cooked)", 200], ["rice (cooked)", 150], ["mixed vegetables", 100], ["oil/ghee", 5]] },
    ],
  },
  nonveg: {
    breakfast: [
      { n: "Omelette + toast", items: [["egg", 150], ["whole-wheat bread", 60], ["onion", 20], ["oil/ghee", 5]] },
      M.oatsPB,
      { n: "Boiled eggs + apple", items: [["egg", 200], ["apple", 180]] },
      { n: "Egg bhurji + roti", items: [["egg", 150], ["roti", 80], ["onion", 30], ["oil/ghee", 5]] },
      { n: "Chicken sausages & scrambled eggs", items: [["chicken sausage", 100], ["egg", 100], ["whole-wheat bread", 30], ["oil/ghee", 5]] },
    ],
    lunch: [
      { n: "Grilled chicken + rice + salad", items: [["chicken breast", 150], ["rice (cooked)", 200], ["salad veg (cucumber/tomato/onion)", 100], ["oil/ghee", 5]] },
      { n: "Chicken curry + roti", items: [["chicken (curry cut)", 150], ["roti", 80], ["onion", 30], ["tomato", 50], ["oil/ghee", 10]] },
      { n: "Egg curry + rice", items: [["egg", 100], ["rice (cooked)", 200], ["tomato", 100], ["onion", 30], ["oil/ghee", 10]] },
      { n: "Fish curry + rice", items: [["fish fillet", 150], ["rice (cooked)", 200], ["tomato", 50], ["oil/ghee", 10]] },
      { n: "Dal + roti + grilled chicken", items: [["dal (cooked)", 150], ["roti", 40], ["chicken breast", 100], ["oil/ghee", 5]] },
    ],
    snack: [
      M.wheyBanana,
      { n: "Boiled eggs + apple", items: [["egg", 100], ["apple", 90]] },
      M.chanaButtermilk,
      { n: "Chicken tikka (grilled)", items: [["chicken breast", 100], ["curd", 30], ["oil/ghee", 3]] },
      { n: "Tuna toast", items: [["tuna (canned)", 80], ["whole-wheat bread", 60]] },
    ],
    dinner: [
      { n: "Grilled fish + veg + rice", items: [["fish fillet", 150], ["mixed vegetables", 150], ["rice (cooked)", 120], ["oil/ghee", 10]] },
      { n: "Chicken breast + veg + roti", items: [["chicken breast", 150], ["mixed vegetables", 150], ["roti", 40], ["oil/ghee", 5]] },
      { n: "Egg bhurji + roti", items: [["egg", 150], ["roti", 80], ["onion", 30], ["oil/ghee", 5]] },
      { n: "Chicken & veg soup bowl", items: [["chicken breast", 150], ["mixed vegetables", 100], ["salad veg (cucumber/tomato/onion)", 100], ["oil/ghee", 5]] },
      { n: "Tandoori chicken + dal + salad", items: [["chicken (curry cut)", 150], ["dal (cooked)", 150], ["salad veg (cucumber/tomato/onion)", 100]] },
    ],
  },
  vegan: {
    breakfast: [
      M.oatsVegan,
      { n: "Tofu scramble + toast", items: [["tofu", 150], ["whole-wheat bread", 60], ["onion", 30], ["oil/ghee", 5]] },
      { n: "Besan chilla + chutney", items: [["besan", 60], ["onion", 30], ["oil/ghee", 5], ["tomato", 50]] },
      { n: "Protein smoothie (oats + banana)", items: [["plant protein", 30], ["oats", 40], ["banana", 120], ["almond milk", 250], ["peanut butter", 10]] },
      { n: "Poha with peanuts", items: [["poha", 60], ["peanuts", 25], ["onion", 30], ["oil/ghee", 5]] },
    ],
    lunch: [
      { n: "Rajma chawal + salad", items: [["rajma (cooked)", 200], ["rice (cooked)", 200], ["salad veg (cucumber/tomato/onion)", 100]] },
      { n: "Chole + rice + salad", items: [["chole (cooked)", 200], ["rice (cooked)", 180], ["salad veg (cucumber/tomato/onion)", 100]] },
      { n: "Tofu curry + roti + salad", items: [["tofu", 200], ["roti", 80], ["tomato", 50], ["onion", 30], ["oil/ghee", 10]] },
      { n: "Dal + roti + sabzi", items: [["dal (cooked)", 200], ["roti", 80], ["mixed vegetables", 150], ["oil/ghee", 5]] },
      { n: "Buddha bowl (quinoa + chole + tahini)", items: [["quinoa (cooked)", 200], ["chole (cooked)", 150], ["mixed vegetables", 100], ["tahini", 15]] },
    ],
    snack: [
      { n: "Roasted chana + lemon water", items: [["roasted chana", 40]] },
      M.plantBanana,
      M.sproutChaat,
      M.appleAlmonds,
      { n: "Edamame bowl", items: [["edamame", 150]] },
    ],
    dinner: [
      M.tofuRice,
      M.dalKhichdi,
      { n: "Chana masala + roti", items: [["chole (cooked)", 150], ["roti", 80], ["onion", 30], ["tomato", 50], ["oil/ghee", 10]] },
      { n: "Veg + tofu curry + roti", items: [["tofu", 150], ["mixed vegetables", 100], ["roti", 80], ["oil/ghee", 10]] },
      { n: "Lentil soup + toast + hummus", items: [["dal (cooked)", 200], ["whole-wheat bread", 60], ["hummus", 40]] },
    ],
  },
};

// ===== Supplements =====
// Evidence-based options only. goals/diets filter who sees an item (absent = everyone);
// trainOnly items are skipped on rest days; optional items are nice-to-have extras.
const SUPP_SLOTS = {
  morning: { icon: "🌅", short: "Morning",      label: "Morning, with breakfast" },
  pre:     { icon: "⚡", short: "Pre-workout",  label: "30–45 min before training" },
  post:    { icon: "💪", short: "Post-workout", label: "Within ~2 h after training" },
  meal:    { icon: "🍽️", short: "With meals",   label: "With lunch or dinner" },
  anytime: { icon: "⏰", short: "Anytime",      label: "Any time — daily consistency beats timing" },
};

const SUPPLEMENTS = [
  { id: "whey", icon: "🥤", name: "Whey protein", diets: ["veg", "nonveg"],
    dose: "1 scoop (25–30 g) in water or milk", slot: "post",
    why: "The cheapest, easiest way to hit your daily protein target — the single biggest nutrition lever for building and keeping muscle. It's just filtered milk protein, not a steroid.",
    tip: "Only needed on days food alone won't reach your protein target." },
  { id: "plantprotein", icon: "🥤", name: "Plant protein", diets: ["vegan"],
    dose: "1 scoop (30 g) in water or almond milk", slot: "post",
    why: "Hitting protein targets on a vegan diet is the hardest part — a pea/rice blend closes the gap without hundreds of extra calories.",
    tip: "Pick a blend (pea + rice) for a complete amino acid profile." },
  { id: "creatine", icon: "💥", name: "Creatine monohydrate",
    dose: "3–5 g daily — every day, including rest days", slot: "anytime",
    why: "The most-researched supplement in sports science: a small but real boost to strength, power and muscle growth over months. It works by saturation, so daily consistency matters more than timing.",
    tip: "Plain monohydrate is all you need — skip the fancy blends. Drink plenty of water." },
  { id: "vitd", icon: "☀️", name: "Vitamin D3",
    dose: "1000–2000 IU", slot: "morning",
    why: "Most people who work indoors run low, and low vitamin D drags down energy, bone health, mood and recovery. Take it with a meal that contains some fat for absorption." },
  { id: "fishoil", icon: "🐟", name: "Omega-3 fish oil", diets: ["nonveg"],
    dose: "1–2 capsules (~1 g EPA+DHA)", slot: "meal",
    why: "Supports heart, joint and brain health, and may reduce post-training soreness.",
    tip: "Already eat fatty fish twice a week? You can skip this one." },
  { id: "algae", icon: "🌊", name: "Algae omega-3 (EPA/DHA)", diets: ["veg", "vegan"],
    dose: "1–2 capsules (~500 mg EPA+DHA)", slot: "meal",
    why: "The plant-based source of the same EPA/DHA found in fish oil — flaxseed alone converts poorly, so algae oil is the reliable vegetarian option." },
  { id: "b12", icon: "🧬", name: "Vitamin B12", diets: ["vegan"],
    dose: "500–1000 mcg, 3–4× per week", slot: "morning",
    why: "B12 comes almost entirely from animal foods — on a fully vegan diet supplementing isn't optional, it's essential for nerves and energy." },
  { id: "caffeine", icon: "☕", name: "Caffeine (coffee or pre-workout)", trainOnly: true, optional: true,
    dose: "1 strong coffee or 100–200 mg", slot: "pre",
    why: "The most reliable legal performance booster — sharper focus and a rep or two more in the tank.",
    tip: "Skip it within 8 hours of bedtime — sleep beats any supplement." },
  { id: "multi", icon: "💊", name: "Multivitamin", goals: ["lose"], optional: true,
    dose: "1 tablet", slot: "morning",
    why: "Cheap insurance while eating in a calorie deficit, where micronutrients can slip through the cracks." },
];

const GROCERY_CATS = { produce: "🥬 Produce", grains: "🌾 Grains & Bread", protein: "🍗 Protein & Legumes", dairy: "🥛 Dairy", pantry: "🫙 Pantry" };

const HYDRATION_TIP = "Drink 3–4 L water through the day. Have protein within ~2 hours after training.";

const REST_DAY_ACTIVITIES = [
  "Rest day — 20–30 min easy walk + 10 min light stretching.",
  "Active recovery — 30 min walk, focus on 7–8 hours of sleep tonight.",
  "Rest day — gentle 15 min full-body stretch or yoga.",
  "Rest day — walk after meals (10 min each) and stay hydrated.",
];

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
