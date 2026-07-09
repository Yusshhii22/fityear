// ===== FitYear exercise tutorials =====
// Step-by-step instructions and demo photos from free-exercise-db
// (github.com/yuhonas/free-exercise-db, public domain / Unlicense).
// img = number of demo photos in media/<slug>-N.jpg (0 or 2).
const TUTORIALS = {
 "Ab Wheel Rollout": {
  "img": 2,
  "steps": [
   "For this exercise you will need to get into a pushup position, but instead of having your hands of the floor, you will be grabbing on to an Olympic barbell (loaded with 5-10 lbs on each side) instead. This will be your starting position.",
   "While keeping a slight arch on your back, lift your hips and roll the barbell towards your feet as you exhale. Tip: As you perform the movement, your glutes should be coming up, you should be keeping the abs tight and should maintain your back posture at all times. Also your arms should be staying perpendicular to the floor throughout the movement. If you don't, you will work out your shoulders and back more than the abs.",
   "After a second contraction at the top, start to roll the barbell back forward to the starting position slowly as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ],
  "note": "Shown with a barbell — identical movement with an ab wheel."
 },
 "Arm Circles + Plank Taps": {
  "img": 2,
  "steps": [
   "Stand up and extend your arms straight out by the sides. The arms should be parallel to the floor and perpendicular (90-degree angle) to your torso. This will be your starting position.",
   "Slowly start to make circles of about 1 foot in diameter with each outstretched arm. Breathe normally as you perform the movement.",
   "Continue the circular motion of the outstretched arms for about ten seconds. Then reverse the movement, going the opposite direction."
  ],
  "note": "Do 30s of arm circles, then 30s of plank shoulder taps, alternating."
 },
 "Band + Bodyweight Circuit": {
  "img": 0,
  "steps": [
   "Pick 4 moves: band row, push-up, band pull-apart, bodyweight squat.",
   "Do 10–12 reps of each back-to-back with no rest — that's one round.",
   "Rest 60–90 seconds, then repeat for 4–5 rounds.",
   "Move briskly but keep every rep controlled."
  ]
 },
 "Band Chest Press": {
  "img": 2,
  "steps": [
   "Adjust the weight to an appropriate amount and be seated, grasping the handles. Your upper arms should be about 45 degrees to the body, with your head and chest up. The elbows should be bent to about 90 degrees. This will be your starting position.",
   "Begin by extending through the elbow, pressing the handles together straight in front of you. Keep your shoulder blades retracted as you execute the movement.",
   "After pausing at full extension, return to th starting position, keeping tension on the cables.",
   "You can also execute this movement with your back off the pad, at an incline or decline, or alternate hands."
  ],
  "note": "Shown on a cable machine — anchor your band behind you at chest height."
 },
 "Band Face Pull": {
  "img": 2,
  "steps": [
   "Facing a high pulley with a rope or dual handles attached, pull the weight directly towards your face, separating your hands as you do so. Keep your upper arms parallel to the ground."
  ],
  "note": "Shown on a cable — anchor your band at face height."
 },
 "Band Good Morning": {
  "img": 2,
  "steps": [
   "Using a 41 inch band, stand on one end, spreading your feet a small amount. Bend at the hips to loop the end of the band behind your neck. This will be your starting position.",
   "Keeping your legs straight, extend through the hips to come to a near vertical position.",
   "Ensure that you do not round your back as you go down back to the starting position."
  ]
 },
 "Band Lat Pulldown": {
  "img": 2,
  "steps": [
   "Sit down on a pull-down machine with a wide bar attached to the top pulley. Make sure that you adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.",
   "Grab the bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.",
   "As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.",
   "As you breathe out, bring the bar down until it touches your upper chest by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the bar; therefore do not try to pull down the bar using the forearms.",
   "After a second at the contracted position squeezing your shoulder blades together, slowly raise the bar back to the starting position when your arms are fully extended and the lats are fully stretched. Inhale during this portion of the movement.",
   "Repeat this motion for the prescribed amount of repetitions."
  ],
  "note": "Shown on a machine — anchor your band overhead (door anchor works)."
 },
 "Band Pull-Apart": {
  "img": 2,
  "steps": [
   "Begin with your arms extended straight out in front of you, holding the band with both hands.",
   "Initiate the movement by performing a reverse fly motion, moving your hands out laterally to your sides.",
   "Keep your elbows extended as you perform the movement, bringing the band to your chest. Ensure that you keep your shoulders back during the exercise.",
   "Pause as you complete the movement, returning to the starting position under control."
  ]
 },
 "Barbell Back Squat": {
  "img": 2,
  "steps": [
   "This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack to just below shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.",
   "Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.",
   "Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section).",
   "Begin to slowly lower the bar by bending the knees and hips as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees. Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.",
   "Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs again and go back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Barbell Bench Press": {
  "img": 2,
  "steps": [
   "Lie back on a flat bench. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.",
   "From the starting position, breathe in and begin coming down slowly until the bar touches your middle chest.",
   "After a brief pause, push the bar back to the starting position as you breathe out. Focus on pushing the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position at the top of the motion, hold for a second and then start coming down slowly again. Tip: Ideally, lowering the weight should take about twice as long as raising it.",
   "Repeat the movement for the prescribed amount of repetitions.",
   "When you are done, place the bar back in the rack."
  ]
 },
 "Barbell Row": {
  "img": 2,
  "steps": [
   "Holding a barbell with a pronated grip (palms facing down), bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The barbell should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.",
   "Now, while keeping the torso stationary, breathe out and lift the barbell to you. Keep the elbows close to the body and only use the forearms to hold the weight. At the top contracted position, squeeze the back muscles and hold for a brief pause.",
   "Then inhale and slowly lower the barbell back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Bench/Chair Dip": {
  "img": 2,
  "steps": [
   "For this exercise you will need to place a bench behind your back and another one in front of you. With the benches perpendicular to your body, hold on to one bench on its edge with the hands close to your body, separated at shoulder width. Your arms should be fully extended.",
   "The legs will be extended forward on top of the other bench. Your legs should be parallel to the floor while your torso is to be perpendicular to the floor. Have your partner place the dumbbell on your lap. Note: This exercise is best performed with a partner as placing the weight on your lap can be challenging and cause injury without assistance. This will be your starting position.",
   "Slowly lower your body as you inhale by bending at the elbows until you lower yourself far enough to where there is an angle slightly smaller than 90 degrees between the upper arm and the forearm. Tip: Keep the elbows as close as possible throughout the movement. Forearms should always be pointing down.",
   "Using your triceps to bring your torso up again, lift yourself back to the starting position while exhaling.",
   "Repeat for the recommended amount of repetitions."
  ],
  "note": "Skip the added weight — bodyweight only is perfect."
 },
 "Bent-Over DB Row": {
  "img": 2,
  "steps": [
   "With a dumbbell in each hand (palms facing your torso), bend your knees slightly and bring your torso forward by bending at the waist; as you bend make sure to keep your back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The weights should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.",
   "While keeping the torso stationary, lift the dumbbells to your side (as you breathe out), keeping the elbows close to the body (do not exert any force with the forearm other than holding the weights). On the top contracted position, squeeze the back muscles and hold for a second.",
   "Slowly lower the weight again to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Bicycle Crunch": {
  "img": 2,
  "steps": [
   "Lie flat on the floor with your lower back pressed to the ground. For this exercise, you will need to put your hands beside your head. Be careful however to not strain with the neck as you perform it. Now lift your shoulders into the crunch position.",
   "Bring knees up to where they are perpendicular to the floor, with your lower legs parallel to the floor. This will be your starting position.",
   "Now simultaneously, slowly go through a cycle pedal motion kicking forward with the right leg and bringing in the knee of the left leg. Bring your right elbow close to your left knee by crunching to the side, as you breathe out.",
   "Go back to the initial position as you breathe in.",
   "Crunch to the opposite side as you cycle your legs and bring closer your left elbow to your right knee and exhale.",
   "Continue alternating in this manner until all of the recommended repetitions for each side have been completed."
  ]
 },
 "Bodyweight Squat": {
  "img": 2,
  "steps": [
   "Stand with your feet shoulder width apart. You can place your hands behind your head. This will be your starting position.",
   "Begin the movement by flexing your knees and hips, sitting back with your hips.",
   "Continue down to full depth if you are able,and quickly reverse the motion until you return to the starting position. As you squat, keep your head and chest up and push your knees out."
  ]
 },
 "Brisk Walk / Jog": {
  "img": 0,
  "steps": [
   "Walk fast enough that holding a conversation takes effort.",
   "Keep your chest up and arms swinging naturally.",
   "Aim for the listed duration without stopping.",
   "Optional: alternate 3 min walking with 1 min easy jogging."
  ]
 },
 "Bulgarian Split Squat": {
  "img": 2,
  "steps": [
   "Start by standing about 2 to 3 feet in front of a flat bench with your back facing the bench. Have a barbell in front of you on the floor. Tip: Your feet should be shoulder width apart from each other.",
   "Bend the knees and use a pronated grip with your hands being wider than shoulder width apart from each other to lift the barbell up until you can rest it on your chest.",
   "Then lift the barbell over your head and rest it on the base of your neck. Move one foot back so that your toe is resting on the flat bench. Your other foot should be stationary in front of you. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. Tip: Make sure your back is straight and chest is out while performing this exercise.",
   "As you inhale, slowly lower your leg until your thigh is parallel to the floor. At this point, your knee should be over your toes. Your chest should be directly above the middle of your thigh.",
   "Leading with the chest and hips and contracting the quadriceps, elevate your leg back to the starting position as you exhale.",
   "Repeat for the recommended amount of repetitions.",
   "Switch legs and repeat the movement."
  ],
  "note": "Shown with a barbell — hold dumbbells or just bodyweight instead."
 },
 "Burpee Intervals": {
  "img": 0,
  "steps": [
   "From standing, squat down and place your hands on the floor.",
   "Kick your feet back to a plank, do one push-up.",
   "Jump your feet back to your hands, stand and jump with arms overhead.",
   "Work 30 seconds, rest 30 seconds — repeat 8 times."
  ]
 },
 "Cable Crunch": {
  "img": 2,
  "steps": [
   "Kneel below a high pulley that contains a rope attachment.",
   "Grasp cable rope attachment and lower the rope until your hands are placed next to your face.",
   "Flex your hips slightly and allow the weight to hyperextend the lower back. This will be your starting position.",
   "With the hips stationary, flex the waist as you contract the abs so that the elbows travel towards the middle of the thighs. Exhale as you perform this portion of the movement and hold the contraction for a second.",
   "Slowly return to the starting position as you inhale. Tip: Make sure that you keep constant tension on the abs throughout the movement. Also, do not choose a weight so heavy that the lower back handles the brunt of the work.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Cable Face Pull": {
  "img": 2,
  "steps": [
   "Facing a high pulley with a rope or dual handles attached, pull the weight directly towards your face, separating your hands as you do so. Keep your upper arms parallel to the ground."
  ]
 },
 "Cable Fly": {
  "img": 2,
  "steps": [
   "To get yourself into the starting position, place the pulleys on a high position (above your head), select the resistance to be used and hold the pulleys in each hand.",
   "Step forward in front of an imaginary straight line between both pulleys while pulling your arms together in front of you. Your torso should have a small forward bend from the waist. This will be your starting position.",
   "With a slight bend on your elbows in order to prevent stress at the biceps tendon, extend your arms to the side (straight out at both sides) in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms and torso should remain stationary; the movement should only occur at the shoulder joint.",
   "Return your arms back to the starting position as you breathe out. Make sure to use the same arc of motion used to lower the weights.",
   "Hold for a second at the starting position and repeat the movement for the prescribed amount of repetitions."
  ]
 },
 "Cable Pull-Through": {
  "img": 2,
  "steps": [
   "Begin standing a few feet in front of a low pulley with a rope or handle attached. Face away from the machine, straddling the cable, with your feet set wide apart.",
   "Begin the movement by reaching through your legs as far as possible, bending at the hips. Keep your knees slightly bent. Keeping your arms straight, extend through the hip to stand straight up. Avoid pulling upward through the shoulders; all of the motion should originate through the hips."
  ]
 },
 "Cable Triceps Pushdown": {
  "img": 2,
  "steps": [
   "Attach a straight or angled bar to a high pulley and grab with an overhand grip (palms facing down) at shoulder width.",
   "Standing upright with the torso straight and a very small inclination forward, bring the upper arms close to your body and perpendicular to the floor. The forearms should be pointing up towards the pulley as they hold the bar. This is your starting position.",
   "Using the triceps, bring the bar down until it touches the front of your thighs and the arms are fully extended perpendicular to the floor. The upper arms should always remain stationary next to your torso and only the forearms should move. Exhale as you perform this movement.",
   "After a second hold at the contracted position, bring the bar slowly up to the starting point. Breathe in as you perform this step.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Chest-Supported Row": {
  "img": 0,
  "steps": [
   "Set an incline bench to about 30–45° and lie chest-down on it holding dumbbells.",
   "Let your arms hang straight, palms facing each other.",
   "Row the weights to your ribs, squeezing your shoulder blades together.",
   "Lower slowly for 2–3 seconds. The bench keeps your lower back safe — don't lift your chest off it."
  ]
 },
 "Chin-Up (bar/door frame)": {
  "img": 2,
  "steps": [
   "Grab the pull-up bar with the palms facing your torso and a grip closer than the shoulder width.",
   "As you have both arms extended in front of you holding the bar at the chosen grip width, keep your torso as straight as possible while creating a curvature on your lower back and sticking your chest out. This is your starting position. Tip: Keeping the torso as straight as possible maximizes biceps stimulation while minimizing back involvement.",
   "As you breathe out, pull your torso up until your head is around the level of the pull-up bar. Concentrate on using the biceps muscles in order to perform the movement. Keep the elbows close to your body. Tip: The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.",
   "After a second of squeezing the biceps in the contracted position, slowly lower your torso back to the starting position; when your arms are fully extended. Breathe in as you perform this portion of the movement.",
   "Repeat this motion for the prescribed amount of repetitions."
  ]
 },
 "Close-Grip Push-Up": {
  "img": 2,
  "steps": [
   "Lie on the floor face down and place your hands closer than shoulder width for a close hand position. Make sure that you are holding your torso up at arms' length.",
   "Lower yourself until your chest almost touches the floor as you inhale.",
   "Using your triceps and some of your pectoral muscles, press your upper body back up to the starting position and squeeze your chest. Breathe out as you perform this step.",
   "After a second pause at the contracted position, repeat the movement for the prescribed amount of repetitions."
  ]
 },
 "Conventional Deadlift": {
  "img": 2,
  "steps": [
   "Stand in front of a loaded barbell.",
   "While keeping the back as straight as possible, bend your knees, bend forward and grasp the bar using a medium (shoulder width) overhand grip. This will be the starting position of the exercise. Tip: If it is difficult to hold on to the bar with this grip, alternate your grip or use wrist straps.",
   "While holding the bar, start the lift by pushing with your legs while simultaneously getting your torso to the upright position as you breathe out. In the upright position, stick your chest out and contract the back by bringing the shoulder blades back. Think of how the soldiers in the military look when they are in standing in attention.",
   "Go back to the starting position by bending at the knees while simultaneously leaning the torso forward at the waist while keeping the back straight. When the weights on the bar touch the floor you are back at the starting position and ready to perform another repetition.",
   "Perform the amount of repetitions prescribed in the program."
  ]
 },
 "DB Bicep Curl": {
  "img": 2,
  "steps": [
   "Stand up straight with a dumbbell in each hand at arm's length. Keep your elbows close to your torso and rotate the palms of your hands until they are facing forward. This will be your starting position.",
   "Now, keeping the upper arms stationary, exhale and curl the weights while contracting your biceps. Continue to raise the weights until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a brief pause as you squeeze your biceps.",
   "Then, inhale and slowly begin to lower the dumbbells back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "DB Complex (row+squat+press)": {
  "img": 0,
  "steps": [
   "Hold a dumbbell in each hand. Do 8 bent-over rows.",
   "Without putting the weights down, do 8 goblet-style squats.",
   "Then 8 overhead presses. That's one round.",
   "Rest 90 seconds, repeat 5 rounds. Choose a weight you could row for 15 reps."
  ]
 },
 "DB Floor Press": {
  "img": 2,
  "steps": [
   "Lay on the floor holding dumbbells in your hands. Your knees can be bent. Begin with the weights fully extended above you.",
   "Lower the weights until your upper arm comes in contact with the floor. You can tuck your elbows to emphasize triceps size and strength, or to focus on your chest angle your arms to the side.",
   "Pause at the bottom, and then bring the weight together at the top by extending through the elbows."
  ]
 },
 "DB Front Raise": {
  "img": 2,
  "steps": [
   "Pick a couple of dumbbells and stand with a straight torso and the dumbbells on front of your thighs at arms length with the palms of the hand facing your thighs. This will be your starting position.",
   "While maintaining the torso stationary (no swinging), lift the left dumbbell to the front with a slight bend on the elbow and the palms of the hands always facing down. Continue to go up until you arm is slightly above parallel to the floor. Exhale as you execute this portion of the movement and pause for a second at the top. Inhale after the second pause.",
   "Now lower the dumbbell back down slowly to the starting position as you simultaneously lift the right dumbbell.",
   "Continue alternating in this fashion until all of the recommended amount of repetitions have been performed for each arm."
  ]
 },
 "DB Hip Thrust": {
  "img": 2,
  "steps": [
   "Begin seated on the ground with a bench directly behind you. Have a loaded barbell over your legs. Using a fat bar or having a pad on the bar can greatly reduce the discomfort caused by this exercise.",
   "Roll the bar so that it is directly above your hips, and lean back against the bench so that your shoulder blades are near the top of it.",
   "Begin the movement by driving through your feet, extending your hips vertically through the bar. Your weight should be supported by your shoulder blades and your feet. Extend as far as possible, then reverse the motion to return to the starting position."
  ],
  "note": "Shown with a barbell — rest a dumbbell on your hips instead."
 },
 "DB Incline Press": {
  "img": 2,
  "steps": [
   "Lie back on an incline bench with a dumbbell in each hand atop your thighs. The palms of your hands will be facing each other.",
   "Then, using your thighs to help push the dumbbells up, lift the dumbbells one at a time so that you can hold them at shoulder width.",
   "Once you have the dumbbells raised to shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position.",
   "Be sure to keep full control of the dumbbells at all times. Then breathe out and push the dumbbells up with your chest.",
   "Lock your arms at the top, hold for a second, and then start slowly lowering the weight. Tip Ideally, lowering the weights should take about twice as long as raising them.",
   "Repeat the movement for the prescribed amount of repetitions.",
   "When you are done, place the dumbbells back on your thighs and then on the floor. This is the safest manner to release the dumbbells."
  ]
 },
 "DB Lateral Raise": {
  "img": 2,
  "steps": [
   "Pick a couple of dumbbells and stand with a straight torso and the dumbbells by your side at arms length with the palms of the hand facing you. This will be your starting position.",
   "While maintaining the torso in a stationary position (no swinging), lift the dumbbells to your side with a slight bend on the elbow and the hands slightly tilted forward as if pouring water in a glass. Continue to go up until you arms are parallel to the floor. Exhale as you execute this movement and pause for a second at the top.",
   "Lower the dumbbells back down slowly to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "DB Lunge": {
  "img": 2,
  "steps": [
   "Stand with your torso upright holding two dumbbells in your hands by your sides. This will be your starting position.",
   "Step forward with your right leg around 2 feet or so from the foot being left stationary behind and lower your upper body down, while keeping the torso upright and maintaining balance. Inhale as you go down. Note: As in the other exercises, do not allow your knee to go forward beyond your toes as you come down, as this will put undue stress on the knee joint. Make sure that you keep your front shin perpendicular to the ground.",
   "Using mainly the heel of your foot, push up and go back to the starting position as you exhale.",
   "Repeat the movement for the recommended amount of repetitions and then perform with the left leg."
  ]
 },
 "DB Overhead Triceps Extension": {
  "img": 2,
  "steps": [
   "To begin, stand up with a dumbbell held by both hands. Your feet should be about shoulder width apart from each other. Slowly use both hands to grab the dumbbell and lift it over your head until both arms are fully extended.",
   "The resistance should be resting in the palms of your hands with your thumbs around it. The palm of the hands should be facing up towards the ceiling. This will be your starting position.",
   "Keeping your upper arms close to your head with elbows in and perpendicular to the floor, lower the resistance in a semicircular motion behind your head until your forearms touch your biceps. Tip: The upper arms should remain stationary and only the forearms should move. Breathe in as you perform this step.",
   "Go back to the starting position by using the triceps to raise the dumbbell. Breathe out as you perform this step.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "DB Romanian Deadlift": {
  "img": 2,
  "steps": [
   "Grasp a couple of dumbbells holding them by your side at arm's length.",
   "Stand with your torso straight and your legs spaced using a shoulder width or narrower stance. The knees should be slightly bent. This is your starting position.",
   "Keeping the knees stationary, lower the dumbbells to over the top of your feet by bending at the waist while keeping your back straight. Keep moving forward as if you were going to pick something from the floor until you feel a stretch on the hamstrings. Exhale as you perform this movement",
   "Start bringing your torso up straight again by extending your hips and waist until you are back at the starting position. Inhale as you perform this movement.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "DB Russian Twist": {
  "img": 2,
  "steps": [
   "Lie down on the floor placing your feet either under something that will not move or by having a partner hold them. Your legs should be bent at the knees.",
   "Elevate your upper body so that it creates an imaginary V-shape with your thighs. Your arms should be fully extended in front of you perpendicular to your torso and with the hands clasped. This is the starting position.",
   "Twist your torso to the right side until your arms are parallel with the floor while breathing out.",
   "Hold the contraction for a second and move back to the starting position while breathing out. Now move to the opposite side performing the same techniques you applied to the right side.",
   "Repeat for the recommended amount of repetitions."
  ],
  "note": "Hold a dumbbell at your chest to add weight."
 },
 "DB Shoulder Press": {
  "img": 2,
  "steps": [
   "While holding a dumbbell in each hand, sit on a military press bench or utility bench that has back support. Place the dumbbells upright on top of your thighs.",
   "Now raise the dumbbells to shoulder height one at a time using your thighs to help propel them up into position.",
   "Make sure to rotate your wrists so that the palms of your hands are facing forward. This is your starting position.",
   "Now, exhale and push the dumbbells upward until they touch at the top.",
   "Then, after a brief pause at the top contracted position, slowly lower the weights back down to the starting position while inhaling.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "DB Skull Crusher": {
  "img": 2,
  "steps": [
   "Using a close grip, lift the EZ bar and hold it with your elbows in as you lie on the bench. Your arms should be perpendicular to the floor. This will be your starting position.",
   "Keeping the upper arms stationary, lower the bar by allowing the elbows to flex. Inhale as you perform this portion of the movement. Pause once the bar is directly above the forehead.",
   "Lift the bar back to the starting position by extending the elbow and exhaling.",
   "Repeat."
  ],
  "note": "Shown with an EZ-bar — same movement holding one dumbbell in each hand."
 },
 "DB Split Squat": {
  "img": 2,
  "steps": [
   "Being in a standing position. Jump into a split leg position, with one leg forward and one leg back, flexing the knees and lowering your hips slightly as you do so.",
   "As you descend, immediately reverse direction, standing back up and jumping, reversing the position of your legs. Repeat 5-10 times on each leg."
  ],
  "note": "Hold a dumbbell in each hand."
 },
 "DB Step-Up": {
  "img": 2,
  "steps": [
   "Stand up straight while holding a dumbbell on each hand (palms facing the side of your legs).",
   "Place the right foot on the elevated platform. Step on the platform by extending the hip and the knee of your right leg. Use the heel mainly to lift the rest of your body up and place the foot of the left leg on the platform as well. Breathe out as you execute the force required to come up.",
   "Step down with the left leg by flexing the hip and knee of the right leg as you inhale. Return to the original standing position by placing the right foot of to next to the left foot on the initial position.",
   "Repeat with the right leg for the recommended amount of repetitions and then perform with the left leg."
  ]
 },
 "Dead Bug": {
  "img": 2,
  "steps": [
   "Begin lying on your back with your hands extended above you toward the ceiling.",
   "Bring your feet, knees, and hips up to 90 degrees.",
   "Exhale hard to bring your ribcage down and flatten your back onto the floor, rotating your pelvis up and squeezing your glutes. Hold this position throughout the movement. This will be your starting position.",
   "Initiate the exercise by extending one leg, straightening the knee and hip to bring the leg just above the ground.",
   "Maintain the position of your lumbar and pelvis as you perform the movement, as your back is going to want to arch.",
   "Stay tight and return the working leg to the starting position.",
   "Repeat on the opposite side, alternating until the set is complete."
  ]
 },
 "Decline Sit-Up": {
  "img": 2,
  "steps": [
   "Secure your legs at the end of the decline bench and lie down.",
   "Now place your hands lightly on either side of your head keeping your elbows in. Tip: Don't lock your fingers behind your head.",
   "While pushing the small of your back down in the bench to better isolate your abdominal muscles, begin to roll your shoulders off it.",
   "Continue to push down as hard as you can with your lower back as you contract your abdominals and exhale. Your shoulders should come up off the bench only about four inches, and your lower back should remain on the bench. At the top of the movement, contract your abdominals hard and keep the contraction for a second. Tip: Focus on slow, controlled movement - don't cheat yourself by using momentum.",
   "After the one second contraction, begin to come down slowly again to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Diamond Push-Up": {
  "img": 2,
  "steps": [
   "Lie on the floor face down and place your hands closer than shoulder width for a close hand position. Make sure that you are holding your torso up at arms' length.",
   "Lower yourself until your chest almost touches the floor as you inhale.",
   "Using your triceps and some of your pectoral muscles, press your upper body back up to the starting position and squeeze your chest. Breathe out as you perform this step.",
   "After a second pause at the contracted position, repeat the movement for the prescribed amount of repetitions."
  ],
  "note": "Bring thumbs and index fingers together into a diamond shape."
 },
 "Doorway Row": {
  "img": 2,
  "steps": [
   "Position a bar in a rack to about waist height. You can also use a smith machine.",
   "Take a wider than shoulder width grip on the bar and position yourself hanging underneath the bar. Your body should be straight with your heels on the ground with your arms fully extended. This will be your starting position.",
   "Begin by flexing the elbow, pulling your chest towards the bar. Retract your shoulder blades as you perform the movement.",
   "Pause at the top of the motion, and return yourself to the start position.",
   "Repeat for the desired number of repetitions."
  ],
  "note": "No bar? Wrap a towel around door handles, lean back and row."
 },
 "EZ-Bar Curl": {
  "img": 2,
  "steps": [
   "Stand up straight while holding an EZ curl bar at the wide outer handle. The palms of your hands should be facing forward and slightly tilted inward due to the shape of the bar. Keep your elbows close to your torso. This will be your starting position.",
   "Now, while keeping your upper arms stationary, exhale and curl the weights forward while contracting the biceps. Focus on only moving your forearms.",
   "Continue to raise the weight until your biceps are fully contracted and the bar is at shoulder level. Hold the top contracted position for a moment and squeeze the biceps.",
   "Then inhale and slowly lower the bar back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Glute Bridge": {
  "img": 2,
  "steps": [
   "Lie flat on the floor on your back with the hands by your side and your knees bent. Your feet should be placed around shoulder width. This will be your starting position.",
   "Pushing mainly with your heels, lift your hips off the floor while keeping your back straight. Breathe out as you perform this part of the motion and hold at the top for a second.",
   "Slowly go back to the starting position as you breathe in."
  ]
 },
 "Goblet Squat": {
  "img": 2,
  "steps": [
   "Stand holding a light kettlebell by the horns close to your chest. This will be your starting position.",
   "Squat down between your legs until your hamstrings are on your calves. Keep your chest and head up and your back straight.",
   "At the bottom position, pause and use your elbows to push your knees out. Return to the starting position, and repeat for 10-20 repetitions."
  ]
 },
 "Good Morning (bodyweight)": {
  "img": 2,
  "steps": [
   "Begin with a bar on a rack at shoulder height. Rack the bar across the rear of your shoulders as you would a power squat, not on top of your shoulders. Keep your back tight, shoulder blades pinched together, and your knees slightly bent. Step back from the rack.",
   "Begin by bending at the hips, moving them back as you bend over to near parallel. Keep your back arched and your cervical spine in proper alignment.",
   "Reverse the motion by extending through the hips with your glutes and hamstrings. Continue until you have returned to the starting position."
  ],
  "note": "Shown with a barbell — do it hands-behind-head with no weight."
 },
 "Hack Squat": {
  "img": 2,
  "steps": [
   "Place the back of your torso against the back pad of the machine and hook your shoulders under the shoulder pads provided.",
   "Position your legs in the platform using a shoulder width medium stance with the toes slightly pointed out. Tip: Keep your head up at all times and also maintain the back on the pad at all times.",
   "Place your arms on the side handles of the machine and disengage the safety bars (which on most designs is done by moving the side handles from a facing front position to a diagonal position).",
   "Now straighten your legs without locking the knees. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances described in the foot positioning section).",
   "Begin to slowly lower the unit by bending the knees as you maintain a straight posture with the head up (back on the pad at all times). Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.",
   "Begin to raise the unit as you exhale by pushing the floor with mainly with the heel of your foot as you straighten the legs again and go back to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Hammer Curl": {
  "img": 2,
  "steps": [
   "Stand up with your torso upright and a dumbbell on each hand being held at arms length. The elbows should be close to the torso.",
   "The palms of the hands should be facing your torso. This will be your starting position.",
   "Now, while holding your upper arm stationary, exhale and curl the weight forward while contracting the biceps. Continue to raise the weight until the biceps are fully contracted and the dumbbell is at shoulder level. Hold the contracted position for a brief moment as you squeeze the biceps. Tip: Focus on keeping the elbow stationary and only moving your forearm.",
   "After the brief pause, inhale and slowly begin the lower the dumbbells back down to the starting position.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Hanging Leg Raise": {
  "img": 2,
  "steps": [
   "Hang from a chin-up bar with both arms extended at arms length in top of you using either a wide grip or a medium grip. The legs should be straight down with the pelvis rolled slightly backwards. This will be your starting position.",
   "Raise your legs until the torso makes a 90-degree angle with the legs. Exhale as you perform this movement and hold the contraction for a second or so.",
   "Go back slowly to the starting position as you breathe in.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Hanging/Lying Leg Raise": {
  "img": 2,
  "steps": [
   "Lie with your back flat on a bench and your legs extended in front of you off the end.",
   "Place your hands either under your glutes with your palms down or by the sides holding on to the bench. This will be your starting position.",
   "As you keep your legs extended, straight as possible with your knees slightly bent but locked raise your legs until they make a 90-degree angle with the floor. Exhale as you perform this portion of the movement and hold the contraction at the top for a second.",
   "Now, as you inhale, slowly lower your legs back down to the starting position."
  ],
  "note": "No bench? Lie on the floor, hands under your hips."
 },
 "Hip Thrust": {
  "img": 2,
  "steps": [
   "Begin seated on the ground with a bench directly behind you. Have a loaded barbell over your legs. Using a fat bar or having a pad on the bar can greatly reduce the discomfort caused by this exercise.",
   "Roll the bar so that it is directly above your hips, and lean back against the bench so that your shoulder blades are near the top of it.",
   "Begin the movement by driving through your feet, extending your hips vertically through the bar. Your weight should be supported by your shoulder blades and your feet. Extend as far as possible, then reverse the motion to return to the starting position."
  ]
 },
 "Incline DB Curl": {
  "img": 2,
  "steps": [
   "Sit back on an incline bench with a dumbbell in each hand held at arms length. Keep your elbows close to your torso and rotate the palms of your hands until they are facing forward. This will be your starting position.",
   "While holding the upper arm stationary, curl the weights forward while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second.",
   "Slowly begin to bring the dumbbells back to starting position as your breathe in.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Incline DB Press": {
  "img": 2,
  "steps": [
   "Lie back on an incline bench with a dumbbell in each hand atop your thighs. The palms of your hands will be facing each other.",
   "Then, using your thighs to help push the dumbbells up, lift the dumbbells one at a time so that you can hold them at shoulder width.",
   "Once you have the dumbbells raised to shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position.",
   "Be sure to keep full control of the dumbbells at all times. Then breathe out and push the dumbbells up with your chest.",
   "Lock your arms at the top, hold for a second, and then start slowly lowering the weight. Tip Ideally, lowering the weights should take about twice as long as raising them.",
   "Repeat the movement for the prescribed amount of repetitions.",
   "When you are done, place the dumbbells back on your thighs and then on the floor. This is the safest manner to release the dumbbells."
  ]
 },
 "Incline Push-Up": {
  "img": 2,
  "steps": [
   "Stand facing bench or sturdy elevated platform. Place hands on edge of bench or platform, slightly wider than shoulder width.",
   "Position forefoot back from bench or platform with arms and body straight. Arms should be perpendicular to body. Keeping body straight, lower chest to edge of box or platform by bending arms.",
   "Push body up until arms are extended. Repeat."
  ]
 },
 "Incline Treadmill Walk": {
  "img": 2,
  "steps": [
   "To begin, step onto the treadmill and select the desired option from the menu. Most treadmills have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout.",
   "Treadmills offer convenience, cardiovascular benefits, and usually have less impact than walking outside. When walking, you should move at a moderate to fast pace, not a leisurely one. Being an activity of lower intensity, walking doesn't burn as many calories as some other activities, but still provides great benefit. A 150 lb person will burn about 175 calories walking 4 miles per hour for 30 minutes, compared to 450 calories running twice as fast. Maintain proper posture as you walk, and only hold onto the handles when necessary, such as when dismounting or checking your heart rate."
  ],
  "note": "Set incline to 8–12% and walk at a pace where talking is hard but possible."
 },
 "Jump Rope": {
  "img": 2,
  "steps": [
   "Hold an end of the rope in each hand. Position the rope behind you on the ground. Raise your arms up and turn the rope over your head bringing it down in front of you. When it reaches the ground, jump over it. Find a good turning pace that can be maintained. Different speeds and techniques can be used to introduce variation.",
   "Rope jumping is exciting, challenges your coordination, and requires a lot of energy. A 150 lb person will burn about 350 calories jumping rope for 30 minutes, compared to over 450 calories running."
  ]
 },
 "Jump Squat": {
  "img": 2,
  "steps": [
   "Cross your arms over your chest.",
   "With your head up and your back straight, position your feet at shoulder width.",
   "Keeping your back straight and chest up, squat down as you inhale until your upper thighs are parallel, or lower, to the floor.",
   "Now pressing mainly with the ball of your feet, jump straight up in the air as high as possible, using the thighs like springs. Exhale during this portion of the movement.",
   "When you touch the floor again, immediately squat down and jump again.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Jumping Jacks + High Knees": {
  "img": 0,
  "steps": [
   "1 minute jumping jacks: land soft, full arm swing overhead.",
   "1 minute high knees: drive knees to hip height, quick ground contact.",
   "Rest 30 seconds. Repeat 5 times.",
   "Stay on the balls of your feet throughout."
  ]
 },
 "Lat Pulldown": {
  "img": 2,
  "steps": [
   "Sit down on a pull-down machine with a wide bar attached to the top pulley. Make sure that you adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.",
   "Grab the bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.",
   "As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.",
   "As you breathe out, bring the bar down until it touches your upper chest by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the bar; therefore do not try to pull down the bar using the forearms.",
   "After a second at the contracted position squeezing your shoulder blades together, slowly raise the bar back to the starting position when your arms are fully extended and the lats are fully stretched. Inhale during this portion of the movement.",
   "Repeat this motion for the prescribed amount of repetitions."
  ]
 },
 "Lateral Plank Walk": {
  "img": 0,
  "steps": [
   "Start in a high plank, hands under shoulders.",
   "Step your right hand and right foot out to the side, then follow with the left.",
   "Take 10 steps one way, then 10 back.",
   "Keep hips level — don't let them sway or pike up."
  ]
 },
 "Leg Extension": {
  "img": 2,
  "steps": [
   "For this exercise you will need to use a leg extension machine. First choose your weight and sit on the machine with your legs under the pad (feet pointed forward) and the hands holding the side bars. This will be your starting position. Tip: You will need to adjust the pad so that it falls on top of your lower leg (just above your feet). Also, make sure that your legs form a 90-degree angle between the lower and upper leg. If the angle is less than 90-degrees then that means the knee is over the toes which in turn creates undue stress at the knee joint. If the machine is designed that way, either look for another machine or just make sure that when you start executing the exercise you stop going down once you hit the 90-degree angle.",
   "Using your quadriceps, extend your legs to the maximum as you exhale. Ensure that the rest of the body remains stationary on the seat. Pause a second on the contracted position.",
   "Slowly lower the weight back to the original position as you inhale, ensuring that you do not go past the 90-degree angle limit.",
   "Repeat for the recommended amount of times."
  ]
 },
 "Leg Press": {
  "img": 2,
  "steps": [
   "Using a leg press machine, sit down on the machine and place your legs on the platform directly in front of you at a medium (shoulder width) foot stance. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances described in the foot positioning section).",
   "Lower the safety bars holding the weighted platform in place and press the platform all the way up until your legs are fully extended in front of you. Tip: Make sure that you do not lock your knees. Your torso and the legs should make a perfect 90-degree angle. This will be your starting position.",
   "As you inhale, slowly lower the platform until your upper and lower legs make a 90-degree angle.",
   "Pushing mainly with the heels of your feet and using the quadriceps go back to the starting position as you exhale.",
   "Repeat for the recommended amount of repetitions and ensure to lock the safety pins properly once you are done. You do not want that platform falling on you fully loaded."
  ]
 },
 "Leg Raise": {
  "img": 2,
  "steps": [
   "Lie with your back flat on a bench and your legs extended in front of you off the end.",
   "Place your hands either under your glutes with your palms down or by the sides holding on to the bench. This will be your starting position.",
   "As you keep your legs extended, straight as possible with your knees slightly bent but locked raise your legs until they make a 90-degree angle with the floor. Exhale as you perform this portion of the movement and hold the contraction at the top for a second.",
   "Now, as you inhale, slowly lower your legs back down to the starting position."
  ],
  "note": "On the floor: hands under hips, lower legs slowly without arching your back."
 },
 "Lying Leg Curl": {
  "img": 2,
  "steps": [
   "Adjust the machine lever to fit your height and lie face down on the leg curl machine with the pad of the lever on the back of your legs (just a few inches under the calves). Tip: Preferably use a leg curl machine that is angled as opposed to flat since an angled position is more favorable for hamstrings recruitment.",
   "Keeping the torso flat on the bench, ensure your legs are fully stretched and grab the side handles of the machine. Position your toes straight (or you can also use any of the other two stances described on the foot positioning section). This will be your starting position.",
   "As you exhale, curl your legs up as far as possible without lifting the upper legs from the pad. Once you hit the fully contracted position, hold it for a second.",
   "As you inhale, bring the legs back to the initial position. Repeat for the recommended amount of repetitions."
  ]
 },
 "Machine Chest Press": {
  "img": 2,
  "steps": [
   "Load an appropriate weight onto the pins and adjust the seat for your height. The handles should be near the bottom or middle of the pectorals at the beginning of the motion.",
   "Your chest and head should be up and your shoulder blades retracted. This will be your starting position.",
   "Press the handles forward by extending through the elbow.",
   "After a brief pause at the top, return the weight just above the start position, keeping tension on the muscles by not returning the weight to the stops until the set is complete."
  ]
 },
 "Machine Shoulder Press": {
  "img": 2,
  "steps": [
   "Sit down on the Shoulder Press Machine and select the weight.",
   "Grab the handles to your sides as you keep the elbows bent and in line with your torso. This will be your starting position.",
   "Now lift the handles as you exhale and you extend the arms fully. At the top of the position make sure that you hold the contraction for a second.",
   "Lower the handles slowly back to the starting position as you inhale.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Mountain Climber": {
  "img": 2,
  "steps": [
   "Begin in a pushup position, with your weight supported by your hands and toes. Flexing the knee and hip, bring one leg until the knee is approximately under the hip. This will be your starting position.",
   "Explosively reverse the positions of your legs, extending the bent leg until the leg is straight and supported by the toe, and bringing the other foot up with the hip and knee flexed. Repeat in an alternating fashion for 20-30 seconds."
  ]
 },
 "One-Arm DB Row": {
  "img": 2,
  "steps": [
   "Choose a flat bench and place a dumbbell on each side of it.",
   "Place the right leg on top of the end of the bench, bend your torso forward from the waist until your upper body is parallel to the floor, and place your right hand on the other end of the bench for support.",
   "Use the left hand to pick up the dumbbell on the floor and hold the weight while keeping your lower back straight. The palm of the hand should be facing your torso. This will be your starting position.",
   "Pull the resistance straight up to the side of your chest, keeping your upper arm close to your side and keeping the torso stationary. Breathe out as you perform this step. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. Also, make sure that the force is performed with the back muscles and not the arms. Finally, the upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the dumbbell; therefore do not try to pull the dumbbell up using the forearms.",
   "Lower the resistance straight down to the starting position. Breathe in as you perform this step.",
   "Repeat the movement for the specified amount of repetitions.",
   "Switch sides and repeat again with the other arm."
  ]
 },
 "Overhead Cable Extension": {
  "img": 2,
  "steps": [
   "Attach a rope to the bottom pulley of the pulley machine.",
   "Grasping the rope with both hands, extend your arms with your hands directly above your head using a neutral grip (palms facing each other). Your elbows should be in close to your head and the arms should be perpendicular to the floor with the knuckles aimed at the ceiling. This will be your starting position.",
   "Slowly lower the rope behind your head as you hold the upper arms stationary. Inhale as you perform this movement and pause when your triceps are fully stretched.",
   "Return to the starting position by flexing your triceps as you breathe out.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Overhead Press": {
  "img": 2,
  "steps": [
   "Start by placing a barbell that is about chest high on a squat rack. Once you have selected the weights, grab the barbell using a pronated (palms facing forward) grip. Make sure to grip the bar wider than shoulder width apart from each other.",
   "Slightly bend the knees and place the barbell on your collar bone. Lift the barbell up keeping it lying on your chest. Take a step back and position your feet shoulder width apart from each other.",
   "Once you pick up the barbell with the correct grip length, lift the bar up over your head by locking your arms. Hold at about shoulder level and slightly in front of your head. This is your starting position.",
   "Lower the bar down to the collarbone slowly as you inhale.",
   "Lift the bar back up to the starting position as you exhale.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Pike Push-Up": {
  "img": 0,
  "steps": [
   "From a push-up position, walk your feet in and lift your hips high — body like an upside-down V.",
   "Bend your elbows to lower the top of your head toward the floor.",
   "Press back up until arms are straight.",
   "The steeper the pike, the more it works your shoulders."
  ]
 },
 "Plank": {
  "img": 2,
  "steps": [
   "Get into a prone position on the floor, supporting your weight on your toes and your forearms. Your arms are bent and directly below the shoulder.",
   "Keep your body straight at all times, and hold this position as long as possible. To increase difficulty, an arm or leg can be raised."
  ]
 },
 "Preacher Curl": {
  "img": 2,
  "steps": [
   "To perform this movement you will need a preacher bench and an E-Z bar. Grab the E-Z curl bar at the close inner handle (either have someone hand you the bar which is preferable or grab the bar from the front bar rest provided by most preacher benches). The palm of your hands should be facing forward and they should be slightly tilted inwards due to the shape of the bar.",
   "With the upper arms positioned against the preacher bench pad and the chest against it, hold the E-Z Curl Bar at shoulder length. This will be your starting position.",
   "As you breathe in, slowly lower the bar until your upper arm is extended and the biceps is fully stretched.",
   "As you exhale, use the biceps to curl the weight up until your biceps is fully contracted and the bar is at shoulder height. Squeeze the biceps hard and hold this position for a second.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Prone Y-T-W Raise": {
  "img": 0,
  "steps": [
   "Lie face-down, arms overhead in a Y, thumbs up.",
   "Lift both arms off the floor, squeeze, lower.",
   "Move arms to a T (straight out) and repeat, then to a W (elbows bent).",
   "10 slow reps in each position = one set. No swinging."
  ]
 },
 "Pull-Up / Assisted Pull-Up": {
  "img": 2,
  "steps": [
   "Grab the pull-up bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than your shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.",
   "As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.",
   "Pull your torso up until the bar touches your upper chest by drawing the shoulders and the upper arms down and back. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.",
   "After a second on the contracted position, start to inhale and slowly lower your torso back to the starting position when your arms are fully extended and the lats are fully stretched.",
   "Repeat this motion for the prescribed amount of repetitions."
  ],
  "note": "Too hard? Loop a band over the bar and under your knee, or use the assisted machine."
 },
 "Push-Up": {
  "img": 2,
  "steps": [
   "Lie on the floor face down and place your hands about 36 inches apart while holding your torso up at arms length.",
   "Next, lower yourself downward until your chest almost touches the floor as you inhale.",
   "Now breathe out and press your upper body back up to the starting position while squeezing your chest.",
   "After a brief pause at the top contracted position, you can begin to lower yourself downward again for as many repetitions as needed."
  ]
 },
 "Rear Delt Fly": {
  "img": 2,
  "steps": [
   "To begin, lie down on an incline bench with the chest and stomach pressing against the incline. Have the dumbbells in each hand with the palms facing each other (neutral grip).",
   "Extend the arms in front of you so that they are perpendicular to the angle of the bench. The legs should be stationary while applying pressure with the ball of your toes. This is the starting position.",
   "Maintaining the slight bend of the elbows, move the weights out and away from each other (to the side) in an arc motion while exhaling. Tip: Try to squeeze your shoulder blades together to get the best results from this exercise.",
   "The arms should be elevated until they are parallel to the floor.",
   "Feel the contraction and slowly lower the weights back down to the starting position while inhaling.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Reverse Lunge": {
  "img": 2,
  "steps": [
   "Stand with your torso upright holding two dumbbells in your hands by your sides. This will be your starting position.",
   "Step backward with your right leg around two feet or so from the left foot and lower your upper body down, while keeping the torso upright and maintaining balance. Inhale as you go down. Tip: As in the other exercises, do not allow your knee to go forward beyond your toes as you come down, as this will put undue stress on the knee joint. Make sure that you keep your front shin perpendicular to the ground. Keep the torso upright during the lunge; flexible hip flexors are important. A long lunge emphasizes the Gluteus Maximus; a short lunge emphasizes Quadriceps.",
   "Push up and go back to the starting position as you exhale. Tip: Use the ball of your feet to push in order to accentuate the quadriceps. To focus on the glutes, press with your heels.",
   "Now repeat with the opposite leg."
  ],
  "note": "Shown with dumbbells — bodyweight only is fine."
 },
 "Reverse Snow Angel": {
  "img": 0,
  "steps": [
   "Lie face-down, arms at your sides, palms down.",
   "Lift your chest slightly and hover both arms off the floor.",
   "Sweep them slowly overhead like a snow angel, then back to your hips.",
   "Keep the movement slow — 4 seconds up, 4 seconds back."
  ]
 },
 "Romanian Deadlift": {
  "img": 2,
  "steps": [
   "Put a barbell in front of you on the ground and grab it using a pronated (palms facing down) grip that a little wider than shoulder width. Tip: Depending on the weight used, you may need wrist wraps to perform the exercise and also a raised platform in order to allow for better range of motion.",
   "Bend the knees slightly and keep the shins vertical, hips back and back straight. This will be your starting position.",
   "Keeping your back and arms completely straight at all times, use your hips to lift the bar as you exhale. Tip: The movement should not be fast but steady and under control.",
   "Once you are standing completely straight up, lower the bar by pushing the hips back, only slightly bending the knees, unlike when squatting. Tip: Take a deep breath at the start of the movement and keep your chest up. Hold your breath as you lower and exhale as you complete the movement.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Rowing Machine": {
  "img": 2,
  "steps": [
   "To begin, seat yourself on the rower. Make sure that your heels are resting comfortably against the base of the foot pedals and that the straps are secured. Select the program that you wish to use, if applicable. Sit up straight and bend forward at the hips.",
   "There are three phases of movement when using a rower. The first phase is when you come forward on the rower. Your knees are bent and against your chest. Your upper body is leaning slightly forward while still maintaining good posture. Next, push against the foot pedals and extend your legs while bringing your hands to your upper abdominal area, squeezing your shoulders back as you do so. To avoid straining your back, use primarily your leg and hip muscles.",
   "The recovery phase simply involves straightening your arms, bending the knees, and bringing your body forward again as you transition back into the first phase."
  ]
 },
 "Seated Cable Row": {
  "img": 2,
  "steps": [
   "For this exercise you will need access to a low pulley row machine with a V-bar. Note: The V-bar will enable you to have a neutral grip where the palms of your hands face each other. To get into the starting position, first sit down on the machine and place your feet on the front platform or crossbar provided making sure that your knees are slightly bent and not locked.",
   "Lean over as you keep the natural alignment of your back and grab the V-bar handles.",
   "With your arms extended pull back until your torso is at a 90-degree angle from your legs. Your back should be slightly arched and your chest should be sticking out. You should be feeling a nice stretch on your lats as you hold the bar in front of you. This is the starting position of the exercise.",
   "Keeping the torso stationary, pull the handles back towards your torso while keeping the arms close to it until you touch the abdominals. Breathe out as you perform that movement. At that point you should be squeezing your back muscles hard. Hold that contraction for a second and slowly go back to the original position while breathing in.",
   "Repeat for the recommended amount of repetitions."
  ]
 },
 "Side Plank": {
  "img": 2,
  "steps": []
 },
 "Side Plank + Reach": {
  "img": 2,
  "steps": [],
  "note": "From the top position, reach your free arm under your torso, then open back up."
 },
 "Single-Leg Glute Bridge": {
  "img": 2,
  "steps": [
   "Lay on the floor with your feet flat and knees bent.",
   "Raise one leg off of the ground, pulling the knee to your chest. This will be your starting position.",
   "Execute the movement by driving through the heel, extending your hip upward and raising your glutes off of the ground.",
   "Extend as far as possible, pause and then return to the starting position."
  ]
 },
 "Single-Leg RDL": {
  "img": 0,
  "steps": [
   "Stand on one leg holding a dumbbell in the opposite hand.",
   "Hinge at the hip: torso tips forward as the free leg extends straight behind you.",
   "Lower until your torso is near-parallel to the floor, back flat.",
   "Drive through your heel to stand. Touch the free toe down between reps if you need balance."
  ]
 },
 "Split Squat": {
  "img": 2,
  "steps": [
   "Being in a standing position. Jump into a split leg position, with one leg forward and one leg back, flexing the knees and lowering your hips slightly as you do so.",
   "As you descend, immediately reverse direction, standing back up and jumping, reversing the position of your legs. Repeat 5-10 times on each leg."
  ]
 },
 "Stair Climbs": {
  "img": 0,
  "steps": [
   "Find a staircase of at least 10–15 steps.",
   "Climb at a steady pace, drive through your whole foot, use the rail only for balance.",
   "Walk down slowly — that's your rest.",
   "Repeat for the listed duration. Take two steps at a time to make it harder."
  ]
 },
 "Stairmaster": {
  "img": 2,
  "steps": [
   "To begin, step onto the stairmaster and select the desired option from the menu. You can choose a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise.",
   "Pump your legs up and down in an established rhythm, driving the pedals down but not all the way to the floor. It is recommended that you maintain your grip on the handles so that you don't fall. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity.",
   "Stairmasters offer convenience, cardiovascular benefits, and usually have less impact than running outside. They are typically much harder than other cardio equipment. A 150 lb person will typically burn over 300 calories in 30 minutes, compared to about 175 calories walking."
  ]
 },
 "Stationary Bike Intervals": {
  "img": 2,
  "steps": [
   "To begin, seat yourself on the bike and adjust the seat to your height.",
   "Select the desired option from the menu. You may have to start pedaling to turn it on. You can use the manual setting, or you can select a program to use. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. The level of resistance can be changed throughout the workout. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity."
  ],
  "note": "30s hard effort, 90s easy spin — repeat 10 times."
 },
 "Superman Hold": {
  "img": 2,
  "steps": [
   "To begin, lie straight and face down on the floor or exercise mat. Your arms should be fully extended in front of you. This is the starting position.",
   "Simultaneously raise your arms, legs, and chest off of the floor and hold this contraction for 2 seconds. Tip: Squeeze your lower back to get the best results from this exercise. Remember to exhale during this movement. Note: When holding the contracted position, you should look like superman when he is flying.",
   "Slowly begin to lower your arms, legs and chest back down to the starting position while inhaling.",
   "Repeat for the recommended amount of repetitions prescribed in your program."
  ],
  "note": "Hold the top position for 10–20s instead of repping."
 },
 "Wall Handstand Hold": {
  "img": 2,
  "steps": [
   "With your back to the wall bend at the waist and place both hands on the floor at shoulder width.",
   "Kick yourself up against the wall with your arms straight. Your body should be upside down with the arms and legs fully extended. Keep your whole body as straight as possible. Tip: If doing this for the first time, have a spotter help you. Also, make sure that you keep facing the wall with your head, rather than looking down.",
   "Slowly lower yourself to the ground as you inhale until your head almost touches the floor. Tip: It is of utmost importance that you come down slow in order to avoid head injury.",
   "Push yourself back up slowly as you exhale until your elbows are nearly locked.",
   "Repeat for the recommended amount of repetitions."
  ],
  "note": "Only hold the handstand against the wall — no pressing needed."
 },
 "Wall Sit": {
  "img": 0,
  "steps": [
   "Stand with your back flat against a wall, feet shoulder-width and about 60 cm out.",
   "Slide down until your thighs are parallel to the floor, knees at 90°.",
   "Press your lower back into the wall and hold. Breathe steadily.",
   "Hold for the listed time. Rest your hands on the wall, not your thighs."
  ]
 },
 "Weighted Dip": {
  "img": 2,
  "steps": [
   "To get into the starting position, hold your body at arm's length with your arms nearly locked above the bars.",
   "Now, inhale and slowly lower yourself downward. Your torso should remain upright and your elbows should stay close to your body. This helps to better focus on tricep involvement. Lower yourself until there is a 90 degree angle formed between the upper arm and forearm.",
   "Then, exhale and push your torso back up using your triceps to bring your body back to the starting position.",
   "Repeat the movement for the prescribed amount of repetitions."
  ]
 },
 "Weighted Side Bend": {
  "img": 2,
  "steps": [
   "Stand up straight while holding a dumbbell on the left hand (palms facing the torso) as you have the right hand holding your waist. Your feet should be placed at shoulder width. This will be your starting position.",
   "While keeping your back straight and your head up, bend only at the waist to the right as far as possible. Breathe in as you bend to the side. Then hold for a second and come back up to the starting position as you exhale. Tip: Keep the rest of the body stationary.",
   "Now repeat the movement but bending to the left instead. Hold for a second and come back to the starting position.",
   "Repeat for the recommended amount of repetitions and then change hands."
  ]
 },
 "Weighted Sit-Up": {
  "img": 2,
  "steps": [
   "Lie down on the floor placing your feet either under something that will not move or by having a partner hold them. Your legs should be bent at the knees.",
   "Place your hands behind your head and lock them together by clasping your fingers. This is the starting position.",
   "Elevate your upper body so that it creates an imaginary V-shape with your thighs. Breathe out when performing this part of the exercise.",
   "Once you feel the contraction for a second, lower your upper body back down to the starting position while inhaling.",
   "Repeat for the recommended amount of repetitions."
  ],
  "note": "Hold a small weight plate or dumbbell against your chest."
 }
};
