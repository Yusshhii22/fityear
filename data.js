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

// 52-week periodization. Each phase: sets/reps scheme + focus note.
const PHASES = [
  { from: 1,  to: 4,  name: "Foundation",       sets: 2, reps: "12–15", rest: "60s",  intensity: "Easy–moderate (RPE 6)", focus: "Learn every movement with perfect form. Weights stay light — consistency is the only goal this month." },
  { from: 5,  to: 12, name: "Build I",          sets: 3, reps: "10–12", rest: "75s",  intensity: "Moderate (RPE 7)",      focus: "Add a little weight or 1–2 reps every week. Finish all sets close to — but not at — failure." },
  { from: 13, to: 13, name: "Deload",           sets: 2, reps: "10",    rest: "60s",  intensity: "Light (RPE 5)",         focus: "Recovery week. Half the usual effort, extra sleep, extra walking. You'll come back stronger." },
  { from: 14, to: 25, name: "Build II",         sets: 3, reps: "8–12",  rest: "90s",  intensity: "Moderate-hard (RPE 7–8)", focus: "New exercise variations this phase. Push the last set of each exercise harder." },
  { from: 26, to: 26, name: "Deload + Check-in", sets: 2, reps: "10",   rest: "60s",  intensity: "Light (RPE 5)",         focus: "Halfway point! Recovery week. Re-take measurements and progress photos, compare to week 1." },
  { from: 27, to: 38, name: "Strength",         sets: 4, reps: "6–8",   rest: "2min", intensity: "Hard (RPE 8)",          focus: "Heavier weight, fewer reps, longer rest. Log your top set each session and try to beat it." },
  { from: 39, to: 39, name: "Deload",           sets: 2, reps: "10",    rest: "60s",  intensity: "Light (RPE 5)",         focus: "Recovery week before the final push." },
  { from: 40, to: 51, name: "Peak",             sets: 4, reps: "8–12",  rest: "90s",  intensity: "Hard (RPE 8–9)",        focus: "Highest volume of the year. Everything you've built comes together — chase rep PRs." },
  { from: 52, to: 52, name: "Victory Lap",      sets: 3, reps: "10",    rest: "90s",  intensity: "Moderate (RPE 7)",      focus: "One year done. Re-test everything from week 1, take final photos, and plan year two. Be proud." },
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

const GROCERY_CATS = { produce: "🥬 Produce", grains: "🌾 Grains & Bread", protein: "🍗 Protein & Legumes", dairy: "🥛 Dairy", pantry: "🫙 Pantry" };

const HYDRATION_TIP = "Drink 3–4 L water through the day. Have protein within ~2 hours after training.";

const REST_DAY_ACTIVITIES = [
  "Rest day — 20–30 min easy walk + 10 min light stretching.",
  "Active recovery — 30 min walk, focus on 7–8 hours of sleep tonight.",
  "Rest day — gentle 15 min full-body stretch or yoga.",
  "Rest day — walk after meals (10 min each) and stay hydrated.",
];

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
