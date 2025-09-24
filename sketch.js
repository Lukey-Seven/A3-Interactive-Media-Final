let state = "title";

// --- Intro Scenes ---
let introScenes = [
  { bg: "intro/scene1.png", speaker: "Enzo", text: "Ugh... I hate homework." },
  { bg: "intro/scene1.png", speaker: "Enzo", text: "Who came up with math anyway?" },
  { bg: "intro/scene2.png", speaker: "Enzo", text: "I wish I could be as free as the stars..." },
  { bg: "intro/scene2.png", speaker: "Enzo", text: "I could just imagine myself drawing with those stars, how amazing would that be?" },
  { bg: "intro/scene2.png", speaker: "Enzo", text: "Guess it's time for bed. Sooo booring." }
];
let introImages = [];
let currentScene = 0;

//Typewriter Effect
let typewriterIndex = 0;
let typingSpeed = 2;
let isTyping = true;
let boxY = null;
let memoryIndex = 0;
let memoryTyping = false;

// Transition Vars
let bangAlpha = 0;
let bangTimer = 0;
let transitionAlpha = 0;

// Post-Intro Dialogue
let postIntroDialogues = [
  { speaker: "Enzo", text: "Whoa, what was that?" },
  { speaker: "Enzo", text: "Where am I? This feels... unreal." },
  { speaker: "Enzo", text: "Wait, I'M IN SPACE?!" },
];

let postDialogIndex = 0;
let postDialogTyping = 0;
let postDialogTypingActive = false;

//Wish Narration
let wishNarration = "Enzo... your wish is granted.";
let wishIndex = 0;
let wishTyping = false;

//Fonts and Images
let fontRegular;
let bgImage;
let boySprite;

let sfx = {};

//Stars & Camera
let stars = [];
let numStars = 400;
let camX = 0, camY = 0;
let speed = 8;

// Constellations
let currentConstellation = [];
let constellations = [];

// Sound
let bgMusicIntro, bgMusicSpace;
let sfxType, sfxClick;
let muted = false;

// Fragments
let fragments = [
  { x: 2000, y: 50, img: null, path: "fragments/book.png", memory: "Smells like dust and ink. I can't remember much about this book." },
  { x: 2000, y: 50, img: null, path: "fragments/toy.png", memory: "My toy rocket... I had once dreamed of flying away into the galaxies." },
  { x: 2000, y: 50, img: null, path: "fragments/enzo.png", memory: "Is that me??" },
  { x: 2000, y: 50, img: null, path: "fragments/backpack.png", memory: "The straps always felt too heavy… I don’t remember what I packed inside." },
  { x: 2000, y: 50, img: null, path: "fragments/kendama.png", memory: "I forgot I had one of these. They're really fun." },
  { x: 2000, y: 50, img: null, path: "fragments/map.png", memory: "A map that me and my friends used to hunt the treasure together." },
  { x: 2000, y: 50, img: null, path: "fragments/alien.png", memory: "Wh-who is this?" },
  { x: 2000, y: 50, img: null, path: "fragments/saturn.png", memory: "Saturn’s rings looked like a halo… I thought it was protecting us." },
  { x: 2000, y: 50, img: null, path: "fragments/jupiter.png", memory: "Jupiter looked so huge, it scared me a little." },
  { x: 2000, y: 50, img: null, path: "fragments/uranus.png", memory: "Uranus... Uranus... That's a funny name." },
  { x: 2000, y: 50, img: null, path: "fragments/robot.png", memory: "Sometimes, I dreamed of having a robot friend." },
  { x: 2000, y: 50, img: null, path: "fragments/star.png", memory: "Hope, Dream, and Creativity. Just like the one on my shirt." }
];
let activeMemory = null;

// Narration Text
let narrationText = [""];
let narrationLine = 0;

function preload() {
  fontRegular = loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf");
  bgImage = loadImage("background/space2.png");
  boySprite = loadImage("images/boy.png");



  // preload intro backgrounds
  for (let s of introScenes) {
    introImages.push(loadImage(s.bg));
  }

  // preload fragments
  for (let f of fragments) {
    f.img = loadImage(f.path);
  }

  // Background music
  bgMusicIntro = loadSound("sounds/bgMusicIntro.mp3");
  bgMusicSpace = loadSound("sounds/bgMusicSpace.mp3");

  // SFX
  sfxType = loadSound("sounds/type.mp3");
  sfxClick = loadSound("sounds/click.mp3");
  sfx.bang = loadSound("sounds/bang.mp3");


}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(28);
  //textFont(fontRegular);
  textFont("Short Stack");

  camX = bgImage.width / 2 - width / 2;
  camY = bgImage.height / 2 - height / 2;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(0, bgImage.width),
      y: random(0, bgImage.height),
      size: random(1, 3),
      baseAlpha: random(80, 200),
      twinkleSpeed: random(0.01, 0.05),
      offset: random(TWO_PI)
    });
  }

  // assign random position, drift + rotation to fragments
  for (let f of fragments) {
    f.x = random(50, bgImage.width - 50);
    f.y = random(50, bgImage.height - 50);
    f.dx = random(-0.3, 0.3);
    f.dy = random(-0.3, 0.3);
    f.angle = random(TWO_PI);
    f.dAngle = random(-0.02, 0.02);
  }
}

function playSFX(name) {
  if (sfx[name] && !sfx[name].isPlaying()) {
    sfx[name].play();
  }
}

function draw() {
  background(0);

    if (state === "title") {
    drawTitleScreen();

  } else if (state === "intro") {
    drawIntroScene();

  } else if (state === "sleep") {
    drawSleepScene();

  } else if (state === "bang") {
    drawBangScene();

  } else if (state === "postDialog") {
    drawPostDialog();

  } else if (state === "play") {
    handleMovement();
    drawBackground();
    drawStars2D();
    updateFragments();
    drawFragments();
    updateConstellations();
    drawConstellations();
    drawCurrentConstellation();
    drawIntroScene();
    drawControls();
    if (activeMemory) drawMemoryBox();
  }
}

//TITLE SCREEN

function drawTitleScreen() {
  background(0);

  // Title
  textAlign(CENTER, CENTER);
  textSize(128);
  textFont("Risque");
  fill(200, 220, 255);
  text("ASTRAY", width / 2, height / 2 - 60);

  // Subtitle
  textSize(24);
  fill(180);
  text("Click to Begin", width / 2, height / 2 + 40);
}


// INTRO
function drawIntroScene() {
  let scene = introScenes[currentScene];
  if (!scene) {
    state = "play";
    return;
  }
  textFont("Short Stack");
  image(introImages[currentScene], 0, 0, width, height);

  if (boxY === null) boxY = height;
  boxY = lerp(boxY, height - 160, 0.1);

  // text box
  push();
  noStroke();
  fill(0, 200);

  /*
  beginShape();
  vertex(20, boxY);
  vertex(width - 40, boxY);
  vertex(width - 80, height - 20);
  vertex(20, height - 20);
  endShape(CLOSE);
  */
  rect(20, boxY, width - 60, height - boxY - 20, 12);
  pop();

  // portrait
  push();
  translate(150, boxY + 50);
  scale(-1, 1);
  imageMode(CENTER);
  image(boySprite, 0, 0, 300, 400);
  pop();

  // speaker + text
  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text(scene.speaker, 300, boxY + 10);

  textSize(20);
  fill(255);
  let displayedText = scene.text.substring(0, typewriterIndex);
  text(displayedText, 300, height - 120, width - 240, 100);

  if (frameCount % typingSpeed === 0 && isTyping && typewriterIndex < scene.text.length) {
    typewriterIndex++;
    playSFX(sfxType);
  }
  if (typewriterIndex >= scene.text.length && sfxType.isPlaying()) {
    sfxType.stop();
  }

  // continue prompt
  textAlign(RIGHT, BOTTOM);
  textSize(14);
  fill(200);
  text("Click or press any key to continue...", width - 50, height - 30);
}

function advanceIntro() {
  if (isTyping && typewriterIndex < introScenes[currentScene].text.length) {
    typewriterIndex = introScenes[currentScene].text.length;
    isTyping = false;
    return;
  }

  if (currentScene === 0 && !bgMusicIntro.isPlaying()) {
    bgMusicIntro.loop();
  }

  currentScene++;
  typewriterIndex = 0;
  isTyping = true;

  if (currentScene >= introScenes.length) {
    bgMusicIntro.stop();
    state = "sleep";
    transitionAlpha = 0;
    wishIndex = 0;
    wishTyping = true;
  }
}

// SLEEP SCENE
function drawSleepScene() {
  // Draw the *last intro image*, not the space background
  image(introImages[introImages.length - 1], 0, 0, width, height);

  // fade to black
  fill(0, transitionAlpha);
  rect(0, 0, width, height);

  if (transitionAlpha < 255) {
    transitionAlpha += 5; // fade speed
  } else {
    // fully black -> show narration text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);

    let displayed = wishNarration.substring(0, wishIndex);
    text(displayed, width / 2, height / 2);

    if (frameCount % typingSpeed === 0 && wishTyping && wishIndex < wishNarration.length) {
      wishIndex++;
    }
    // Wait for user input to trigger bang scene
  }
}



// BANG SCENE
function drawBangScene() {
  // Always draw space background first
  drawBackground();
  drawStars2D();

  // Then draw white flash on top
  if (bangAlpha > 0) {
    fill(255, bangAlpha);
    rect(0, 0, width, height);

    if (bangTimer < 15) {
      bangTimer++;
    } else {
      bangAlpha -= 15;
    }
  } else {
    // When flash is gone, move to post-dialog
    state = "postDialog";
    postDialogIndex = 0;
    postDialogTyping = 0;
    postDialogTypingActive = true;
    bangTimer = 0;
    bgMusicSpace.loop();
  }
}


// POST-DIALOGUE
function drawPostDialog() {
  drawBackground();
  drawStars2D();

  let dlg = postIntroDialogues[postDialogIndex];
  if (!dlg) {
    state = "play";
    return;
  }

  fill(0, 200);
  rect(50, height - 160, width - 100, 120, 12);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  let displayed = dlg.text.substring(0, postDialogTyping);
  text(dlg.speaker + ": " + displayed, 70, height - 140, width - 140, 100);

  if (frameCount % typingSpeed === 0 && postDialogTypingActive && postDialogTyping < dlg.text.length) {
    postDialogTyping++;
  }

  textAlign(RIGHT, BOTTOM);
  textSize(14);
  fill(200);
  text("Click or press any key...", width - 50, height - 30);
}

function advancePostDialog() {
  let dlg = postIntroDialogues[postDialogIndex];
  if (!dlg) return;

  if (postDialogTyping < dlg.text.length) {
    postDialogTyping = dlg.text.length;
    postDialogTypingActive = false;
  } else {
    postDialogIndex++;
    postDialogTyping = 0;
    postDialogTypingActive = true;

    if (postDialogIndex >= postIntroDialogues.length) {
      state = "play";
    }
  }
}

// INPUT
function mousePressed() {
    if (state === "title") {
    // Move into intro, play bg music
    state = "intro";
    if (!bgMusicIntro.isPlaying()) {
      bgMusicIntro.loop();
    }
    playSFX("click");
    return;
  }

  if (state === "intro") {
    advanceIntro();
  } else if (state === "sleep") {
    if (wishIndex >= wishNarration.length) {
      // finished narration -> trigger flash
      state = "bang";
      bangAlpha = 255;
      bangTimer = 0;
      playSFX("bang");
    } else {
      // skip narration typing
      wishIndex = wishNarration.length;
      wishTyping = false;
    }
  } else if (state === "bang") {
    // allow user to skip flash instantly
    bangAlpha = 0;
    bangTimer = 0;
    state = "postDialog";
    bgMusicSpace.loop();
    postDialogIndex = 0;
    postDialogTyping = 0;
    postDialogTypingActive = true;
  } else if (state === "postDialog") {
    advancePostDialog();
  } else if (state === "play") {
    if (mouseButton === LEFT) {
      for (let f of fragments) {
        let fx = f.x - camX;
        let fy = f.y - camY;
        if (dist(mouseX, mouseY, fx, fy) < 40) {
          activeMemory = f.memory;
          memoryIndex = 0;
          memoryTyping = true;
          return;
        }
      }
      for (let s of stars) {
        let sx = s.x - camX;
        let sy = s.y - camY;
        if (dist(mouseX, mouseY, sx, sy) < 10) {
          currentConstellation.push({ x: s.x, y: s.y });
          break;
        }
      }
    }
  }
  playSFX(sfxClick);
}

function keyPressed() {
  if (state === "intro") {
    advanceIntro();
  } else if (state === "sleep") {
    if (wishIndex >= wishNarration.length) {
      state = "bang";
      bangAlpha = 255;
      bangTimer = 0;
    } else {
      wishIndex = wishNarration.length;
      wishTyping = false;
    }
  } else if (state === "bang") {
    bangAlpha = 0;
    bangTimer = 0;
    state = "postDialog";
    bgMusicSpace.loop();
    postDialogIndex = 0;
    postDialogTyping = 0;
    postDialogTypingActive = true;
  } else if (state === "postDialog") {
    advancePostDialog();
  } else if (state === "play") {
    if (key === "Escape") activeMemory = null;
    if (key === "r" || key === "R") {
      if (currentConstellation.length > 0) {
        currentConstellation.pop();
      } else if (constellations.length > 0) {
        constellations.pop();
      }
    }
  }

  if (key === "m" || key === "M") {
    muted = !muted;
    if (muted) {
      stopAllMusic();
    } else {
      if (state === "intro") playMusic(bgMusicIntro);
      if (state === "play") playMusic(bgMusicSpace);
    }
  }
  playSFX(sfxClick);
}

function drawBackground() {
  // Draw the space background image, centered according to camera position
  if (bgImage) {
    image(bgImage, -camX, -camY, bgImage.width, bgImage.height);
  } else {
    // Fallback: fill with black if image not loaded
    fill(0);
    rect(0, 0, width, height);
  }
}

function drawStars2D() {
  for (let s of stars) {
    let sx = s.x - camX;
    let sy = s.y - camY;
    let alpha = s.baseAlpha + 55 * sin(frameCount * s.twinkleSpeed + s.offset);
    fill(255, alpha);
    noStroke();
    ellipse(sx, sy, s.size, s.size);
  }
}

function handleMovement() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // left / A
    camX -= speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // right / D
    camX += speed;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // up / W
    camY -= speed;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // down / S
    camY += speed;
  }

  // clamp camera so it doesn't move outside bgImage
  camX = constrain(camX, 0, bgImage.width - width);
  camY = constrain(camY, 0, bgImage.height - height);
}

function drawCurrentConstellation() {
  if (currentConstellation.length > 0) {
    // Draw connecting lines
    stroke(255, 230, 100, 220);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let pt of currentConstellation) {
      vertex(pt.x - camX, pt.y - camY);
    }
    endShape();

    // Draw points separately
    for (let i = 0; i < currentConstellation.length; i++) {
      let pt = currentConstellation[i];
      let sx = pt.x - camX;
      let sy = pt.y - camY;
      noStroke();
      if (i === currentConstellation.length - 1) {
        fill(255, 255, 150, 240); // active star brighter
        ellipse(sx, sy, 12, 12);
      } else {
        fill(255, 230, 100, 200);
        ellipse(sx, sy, 8, 8);
      }
    }
  }
}




function updateFragments() {
  for (let f of fragments) {
    f.x += f.dx;
    f.y += f.dy;
    f.angle += f.dAngle;

    // bounce off edges of bgImage
    if (f.x < 50 || f.x > bgImage.width - 50) f.dx *= -1;
    if (f.y < 50 || f.y > bgImage.height - 50) f.dy *= -1;
  }
}

/*
function drawFragments() {
  for (let f of fragments) {
    push();
    translate(f.x - camX, f.y - camY);
    rotate(f.angle);
    imageMode(CENTER);
    image(f.img, 0, 0, 80, 80); // size can be adjusted
    pop();
  }
}
*/

// FRAGMENTS
function updateFragments() {
  for (let f of fragments) {
    f.x += f.dx;
    f.y += f.dy;
    f.angle += f.dAngle;

    // keep them within bg bounds
    if (f.x < 50 || f.x > bgImage.width - 50) f.dx *= -1;
    if (f.y < 50 || f.y > bgImage.height - 50) f.dy *= -1;
  }
}

function drawFragments() {
  for (let f of fragments) {
    let fx = f.x - camX;
    let fy = f.y - camY;
    if (fx < -60 || fx > width + 60 || fy < -60 || fy > height + 60) continue;

    push();
    translate(fx, fy);
    rotate(f.angle);
    imageMode(CENTER);

    // scale relative to original size, but not huge
    let maxSize = 80; // maximum width/height
    let scale = max(f.img.width, f.img.height) > maxSize
      ? maxSize / max(f.img.width, f.img.height)
      : 1;

    let w = f.img.width * scale;
    let h = f.img.height * scale;

    image(f.img, 0, 0, w, h);
    pop();
  }
}


function drawMemoryBox() {
  fill(0, 200);
  rect(50, height - 200, width - 100, 150, 12);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);

  let displayed = activeMemory.substring(0, memoryIndex);
  text(displayed, 70, height - 180, width - 140, 130);

  if (frameCount % typingSpeed === 0 && memoryTyping && memoryIndex < activeMemory.length) {
    memoryIndex++;
  }

  textAlign(RIGHT, BOTTOM);
  textSize(14);
  fill(200);
  text("[ESC] to close", width - 70, height - 60);
}

// CONSTELLATIONS
function updateConstellations() {
  for (let c of constellations) {
    for (let pt of c.points) {
      pt.x += c.dx;
      pt.y += c.dy;
    }
  }
}

function drawConstellations() {
  for (let constellation of constellations) {
    // Lines
    stroke(150, 200, 255, 220); // soft blue glow
    strokeWeight(2);
    noFill();
    beginShape();
    for (let pt of constellation.points) {
      let sx = pt.x - camX;
      let sy = pt.y - camY;
      vertex(sx, sy);
    }
    endShape();

    // Stars
    noStroke();
    for (let pt of constellation.points) {
      let sx = pt.x - camX;
      let sy = pt.y - camY;
      fill(200, 220, 255, 240); // brighter blue-white
      ellipse(sx, sy, 8, 8);

      // Optional subtle glow
      fill(150, 200, 255, 80);
      ellipse(sx, sy, 18, 18);
    }
  }
}


// CONTROLS
function drawControls() {
  textAlign(LEFT, TOP);
  textSize(14);
  fill(180);
  text(
    "Controls:\n" +
    "WASD - Drift through space\n" +
    "Left Click - Click on stars (dots) to draw / interact fragments\n" +
    "Double Click - Finish constellation\n" +
    "R - Remove last star/constellation\n" +
    "ESC - Close memory",
    20, 20
  );
}

// CONSTELLATION FINISH
function doubleClicked() {
  if (state === "play") {
    if (currentConstellation.length >= 2) {
      const newConstellation = {
        points: currentConstellation.map(p => ({ x: p.x, y: p.y })),
        dx: random(-0.3, 0.3),
        dy: random(-0.3, 0.3)
      };
      constellations.push(newConstellation);
      currentConstellation = [];
    }
  }
}
