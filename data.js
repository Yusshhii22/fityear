// ===== FitYear data: exercises, splits, meals =====

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

// ===== Meals =====
// Each meal: [name, approx kcal, protein g]. Portions scale with the user's calorie target.
const MEALS = {
  veg: {
    breakfast: [
      ["Paneer bhurji + 2 whole-wheat toast", 420, 24], ["Oats cooked in milk + banana + peanut butter", 450, 18],
      ["Besan chilla (2) + curd", 380, 20], ["Greek yogurt + granola + berries", 400, 22],
      ["Poha with peanuts + glass of milk", 420, 14], ["Moong dal chilla (2) + mint chutney", 360, 22],
    ],
    lunch: [
      ["Rajma + rice + salad + curd", 550, 22], ["Dal tadka + 2 roti + sabzi + salad", 520, 20],
      ["Chole + rice + cucumber raita", 560, 21], ["Paneer curry + 2 roti + salad", 580, 28],
      ["Veg pulao + dal + curd", 540, 18], ["Soya chunk curry + rice + salad", 530, 30],
    ],
    snack: [
      ["Roasted chana + buttermilk", 220, 12], ["Apple + handful of almonds", 230, 6],
      ["Sprout chaat", 200, 12], ["Protein shake (whey/plant) + banana", 280, 26],
      ["Peanut butter on whole-wheat toast", 250, 10], ["Paneer tikka (grilled, 100g)", 240, 18],
    ],
    dinner: [
      ["Palak paneer + 2 roti", 480, 24], ["Dal khichdi + curd + salad", 450, 18],
      ["Veg curry + 2 roti + salad", 440, 16], ["Paneer bhurji + 2 roti", 470, 26],
      ["Mixed dal + jeera rice + sabzi", 460, 19], ["Tofu stir-fry + rice", 450, 24],
    ],
  },
  nonveg: {
    breakfast: [
      ["3-egg omelette + 2 whole-wheat toast", 420, 26], ["Oats + milk + banana + peanut butter", 450, 18],
      ["4 boiled eggs + fruit", 340, 24], ["Egg bhurji (3 eggs) + 2 roti", 460, 26],
      ["Greek yogurt + granola + berries", 400, 22], ["Chicken sausage (2) + scrambled eggs (2)", 430, 30],
    ],
    lunch: [
      ["Grilled chicken (150g) + rice + salad", 580, 40], ["Chicken curry + 2 roti + salad", 560, 35],
      ["Egg curry (2 eggs) + rice + salad", 520, 22], ["Fish curry + rice + salad", 540, 32],
      ["Chicken biryani (controlled portion) + raita", 620, 30], ["Dal + 2 roti + grilled chicken (100g)", 550, 34],
    ],
    snack: [
      ["Protein shake + banana", 280, 26], ["2 boiled eggs + fruit", 220, 13],
      ["Roasted chana + buttermilk", 220, 12], ["Chicken tikka (100g, grilled)", 210, 24],
      ["Apple + handful of almonds", 230, 6], ["Tuna on whole-wheat toast", 260, 22],
    ],
    dinner: [
      ["Grilled fish (150g) + veggies + small rice", 480, 34], ["Chicken breast (150g) + sautéed veg + roti", 500, 40],
      ["Egg bhurji (3 eggs) + 2 roti", 470, 26], ["Chicken soup + grilled chicken salad", 420, 35],
      ["Tandoori chicken (2 pieces) + dal + salad", 520, 38], ["Keema (lean, 100g) + 2 roti", 510, 30],
    ],
  },
  vegan: {
    breakfast: [
      ["Oats in almond milk + banana + peanut butter", 430, 14], ["Tofu scramble + 2 whole-wheat toast", 400, 24],
      ["Besan chilla (2) + mint chutney", 350, 18], ["Smoothie: plant protein + oats + berries + nut butter", 420, 28],
      ["Poha with peanuts", 380, 10], ["Moong dal chilla (2) + chutney", 360, 22],
    ],
    lunch: [
      ["Rajma + rice + salad", 530, 20], ["Chole + rice + onion salad", 550, 20],
      ["Tofu curry + 2 roti + salad", 540, 26], ["Dal tadka + 2 roti + sabzi", 500, 19],
      ["Soya chunk curry + rice", 530, 30], ["Buddha bowl: quinoa + chickpeas + veg + tahini", 560, 22],
    ],
    snack: [
      ["Roasted chana + lemon water", 210, 12], ["Plant protein shake + banana", 270, 24],
      ["Sprout chaat", 200, 12], ["Apple + handful of almonds", 230, 6],
      ["Peanut butter on whole-wheat toast", 250, 10], ["Edamame (1 cup)", 190, 17],
    ],
    dinner: [
      ["Tofu stir-fry + rice", 450, 24], ["Dal khichdi + salad", 430, 16],
      ["Chana masala + 2 roti", 460, 18], ["Veg + tofu curry + 2 roti", 470, 22],
      ["Mixed dal + jeera rice + sabzi", 450, 19], ["Lentil soup + whole-wheat toast + hummus", 440, 20],
    ],
  },
};

const HYDRATION_TIP = "Drink 3–4 L water through the day. Have protein within ~2 hours after training.";

const REST_DAY_ACTIVITIES = [
  "Rest day — 20–30 min easy walk + 10 min light stretching.",
  "Active recovery — 30 min walk, focus on 7–8 hours of sleep tonight.",
  "Rest day — gentle 15 min full-body stretch or yoga.",
  "Rest day — walk after meals (10 min each) and stay hydrated.",
];

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
