/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let babyX, babyY;
let returnBx, returnBy;
let babyBase = 150;
let minBabySize = 45;
let babyAngle = 0;
let angle = 0;
let panic = false;
let panicStart = 0;
let bubble = false;
let bubbleStart = 0;
let a, amp;
let adultX, adultY;
let returnX, returnY;

let babyDia = 150;
let avoidX = 0;
let avoidY = 0

function setup() {
  createCanvas(800, 500);
  angleMode(DEGREES);
  rectMode(CENTER);

  babyX = 200;
  babyY = 350;
  background(220);
}

function draw() {
  let lifeFrame = frameCount % 3300;

  if (lifeFrame == 0) {
    babyBase = 150;
    babyDia = 150;
    babyAngle = 0;
    angle = 0;
    panic = false;
    bubble = false;
    avoidX = 0;
    avoidY = 0;
  }
  background(0, 10);

  // #00 bubble background
  let gridSize = 50;
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      let xAdj = x + gridSize / 2;

      let n = noise(x * 0.02, frameCount * 0.01);
      let yOffset = map(n, 0, 1, -20, 20);
      let yAdj = y + gridSize / 2 + yOffset;

      stroke(100, 100, 100, 18);
      rectMode(CENTER);

      let randomScale = random(0.3, 0.9);
      noFill();
      rect(xAdj, yAdj, gridSize * randomScale, gridSize * randomScale);
    }
  }
  // # stars  
  drawStar(150, 65, 6, 0.08, 0, 255, 255, 255);
  drawStar(250, 140, 5, 0.06, 40, 255, 255, 255);
  drawStar(430, 85, 6, 0.07, 90, 255, 255, 255);
  drawStar(610, 120, 5, 0.05, 130, 255, 255, 255);
  drawStar(735, 190, 6, 0.09, 170, 255, 255, 255);
  drawStar(320, 250, 8, 0.04, 30, 255, 100, 180);   // pink
  drawStar(520, 300, 8, 0.05, 80, 100, 220, 255);   // cyan-blue
  drawStar(690, 75, 7, 0.06, 120, 255, 210, 80);    // yellow
  drawStar(760, 280, 9, 0.045, 160, 180, 120, 255); // purple

  // # nest
  drawNest(200, 350, 34);

  //# 1 baby movement 
  let nestX = 200;
  let nestY = 350;

  if (lifeFrame < 2880) {

    // natural drifting
    let moveX = (noise(lifeFrame * 0.003) - noise(0)) * 300;
    let moveY = (noise(lifeFrame * 0.003 + 100) - noise(100)) * 200;

    // move toward upper-right
    let directionX = map(lifeFrame, 0, 600, 0, 280, true);
    let directionY = map(lifeFrame, 0, 600, 0, -100, true);

    babyX = nestX + directionX + moveX;
    babyY = nestY + directionY + moveY;

    let mouseDist = dist(mouseX, mouseY, babyX, babyY);

    if (mouseDist < babyDia / 2) { // escape change when babyDia change
      let dx = babyX - mouseX;
      let dy = babyY - mouseY;

      let pushValue = 0.06;
      avoidX += dx * pushValue;
      avoidY += dy * pushValue;
    } else {
      let returnValue = 0.02;
      avoidX = lerp(avoidX, 0, returnValue);
      avoidY = lerp(avoidY, 0, returnValue);
    }

    babyX = constrain(babyX, 80, width - 80) + avoidX;
    babyY = constrain(babyY, 80, height - 80) + avoidY;

    returnBx = babyX;
    returnBy = babyY;

  } else if (lifeFrame < 3180) {

    // Baby returns to Nest
    babyX = map(lifeFrame, 2880, 3180, returnBx, nestX);
    babyY = map(lifeFrame, 2880, 3180, returnBy, nestY);

  } else {
    babyX = nestX;
    babyY = nestY;
  }

  let babyProgress;

  // Stage 1:growing
  if (babyBase > minBabySize) {
    babyBase = max(minBabySize, babyBase - 0.05);

    let breathing = sin(frameCount * 2) * 8;
    babyDia = babyBase + breathing;
  } else {
    // Stage 2: mature
    babyDia = minBabySize;
  }

  babyProgress = map(babyBase, 150, minBabySize, 0, 1);

  // #2 adult movement
  let orbitRadius = 145;

  if (lifeFrame < 2100) {
    // stage 1: orbits Baby
    angle += 1;
    adultX = babyX + cos(angle) * orbitRadius;
    adultY = babyY + sin(angle) * orbitRadius;
  } else if (lifeFrame < 2400) {
    // stage 2: moves independently
    adultX = map(noise(lifeFrame * 0.003 + 200), 0, 1, 50, width - 50);
    adultY = map(noise(lifeFrame * 0.003 + 300), 0, 1, 50, height - 50);

    returnX = adultX
    returnY = adultY
  } else if (lifeFrame < 2700) {
    adultX = map(lifeFrame, 2400, 2700, returnX, 200);
    adultY = map(lifeFrame, 2400, 2700, returnY, 350);
  } else if (lifeFrame < 2820) {
    adultX = 200;
    adultY = 350;
  }
  // #3 adult panic
  if (panic == true && lifeFrame < 2400) {
    let noiseX = map(noise(frameCount * 0.05), 0, 1, -250, 250);
    let noiseY = map(noise(frameCount * 0.05 + 100), 0, 1, -180, 180);

    let shakeX = sin(frameCount * a) * amp;
    let shakeY = cos(frameCount * a * 1.3) * amp;

    adultX = babyX + noiseX + shakeX;
    adultY = babyY + noiseY + shakeY;

    adultX = constrain(adultX, 20, width - 20);
    adultY = constrain(adultY, 20, height - 20);

    if (frameCount - panicStart > 180) {
      panic = false;
    }
  }

  // #4 baby setting
  if (lifeFrame < 3300) {
    push();
    translate(babyX, babyY);

    let rotateSpeed = 0;

    if (babyProgress > 0.5) { //when baby gradually mature--> start rotate like adult
      rotateSpeed = map(babyProgress, 0.5, 1, 0, 3);
    }

    babyAngle += rotateSpeed;
    rotate(babyAngle);

    // only growing Baby has glow
    if (babyBase > minBabySize) {
      noStroke();
      fill(190, 160, 255, 18);
      circle(0, 0, babyDia + 18);

      fill(140, 210, 255, 10);
      circle(0, 0, babyDia + 8);
    }

    drawBaby(babyDia, babyProgress);
    pop();

    if (bubble == true) {
      let bubbleTime = frameCount - bubbleStart;
      if (bubbleTime < 40) {
        for (let rad = 30; rad < 100; rad += 30) {
          for (let angle = 0; angle < 360; angle += 36) {
            let x = babyX + cos(angle) * (rad + bubbleTime * 3);
            let y = babyY + sin(angle) * (rad + bubbleTime * 3);

            let bubbleSize = map(rad, 30, 90, 12, 4);

            noStroke();
            fill(205, 150, 255, 100);
            circle(x, y, bubbleSize);
          }
        }
      } else {
        bubble = false
      }
    }
  }

  // #5 adult setting
  if (lifeFrame < 2820) {
    push();
    translate(adultX, adultY);
    rotate(frameCount * 3);
    drawAdult();
    pop();
  }

}

// #6 draw baby
function drawBaby(babyDia, babyProgress) {
  // pattern change from circle to petal
  let petalW = map(babyProgress, 0, 1, babyDia / 2, 24);
  let petalH = map(babyProgress, 0, 1, babyDia / 2, 15);
  let petalDist = map(babyProgress, 0, 1, babyDia / 4, 9);
  let centerDia = map(babyProgress, 0, 1, babyDia / 2, 18);

  // color change ：purple to ice blue (base on the growing stage of baby)
  //useGPT to get the rgb range of color + get suggestion to divide color change into 2 stage using if,else
  let babyR, babyG, babyB;

  if (babyProgress < 0.5) {
    babyR = map(babyProgress, 0, 0.5, 205, 100);
    babyG = map(babyProgress, 0, 0.5, 150, 170);
    babyB = map(babyProgress, 0, 0.5, 255, 255);
  } else {
    babyR = map(babyProgress, 0.5, 1, 100, 100);
    babyG = map(babyProgress, 0.5, 1, 170, 230);
    babyB = map(babyProgress, 0.5, 1, 255, 220);
  }

  // gentle color breathing
  let babyWave = sin(frameCount * 0.5) * 15;

  stroke(babyR + babyWave, babyG + babyWave, babyB, 190);
  strokeWeight(1.2);
  fill(babyR, babyG, babyB, 60);

  // center circle
  circle(0, 0, centerDia);

  // six petals
  for (let i = 0; i < 6; i++) {
    push();
    rotate(i * 60);
    ellipse(petalDist, 0, petalW, petalH);
    // bubble tentacle function (base on petals)
    drawTentacle(petalDist + petalW / 2, babyProgress);

    pop();
  }
}

function drawAdult() {

  let colorWave = sin(frameCount * 0.2);
  let r = 100;
  let g = map(colorWave, -1, 1, 220, 240);
  let b = map(colorWave, -1, 1, 210, 230);

  // fixed stroke
  stroke(160, 255, 240, 150);
  strokeWeight(1.2);

  // center
  fill(r, g, b, 210);
  circle(0, 0, 18);

  // petals
  fill(r, g, b, 95);
  for (let i = 0; i < 6; i++) {
    push();
    rotate(i * 60);
    ellipse(9, 0, 24, 15);
    pop();
  }
}

// #8 trigger adult panic
function mousePressed() {
  let distB = dist(mouseX, mouseY, babyX, babyY);

  if (distB < babyBase * 0.75) {
    panic = true;
    panicStart = frameCount;
    bubble = true;
    bubbleStart = frameCount;

    a = random(15, 25);
    amp = random(30, 80);
  }
}

//#9 baby tentacle
function drawTentacle(startX, babyProgress) { //tentacle become shorter as baby grow
  let tentacleLength = map(babyProgress, 0, 1, 40, 0);

  noStroke();
  let tantacleR = map(babyProgress, 0, 1, 205, 100);
  let tantacleG = map(babyProgress, 0, 1, 150, 220);
  fill(tantacleR, tantacleG, 255, 100);

  // one tentacle--five dots
  for (let i = 0; i < 5; i++) {
    let x = startX + i * tentacleLength / 5; //dot position
    let y = sin(frameCount * 3 + i * 20) * 4; //wave

    let dotSize = map(i, 0, 4, 8, 2); //size changing with for()
    circle(x, y, dotSize * (1 - babyProgress)); //disappear
  }
}

function drawStar(x, y, size, speed, offset, r, g, b) {
  let twinkle = map(sin(frameCount * speed + offset), -1, 1, 80, 255);

  push();
  translate(x, y);
  noStroke();

  fill(r, g, b, twinkle);
  beginShape();
  vertex(0, -size);
  vertex(size * 0.18, -size * 0.18);
  vertex(size, 0);
  vertex(size * 0.18, size * 0.18);
  vertex(0, size);
  vertex(-size * 0.18, size * 0.18);
  vertex(-size, 0);
  vertex(-size * 0.18, -size * 0.18);
  endShape(CLOSE);

  pop();
}

function drawNest(x, y) {
  push();
  translate(x, y);
  noStroke();

  // outer layer
  fill(245, 240, 180, 110);
  beginShape();
  vertex(0, -62);
  vertex(10, -20);

  vertex(42, -38);
  vertex(18, -8);

  vertex(58, 0);
  vertex(20, 7);

  vertex(40, 42);
  vertex(9, 17);

  vertex(0, 58);
  vertex(-10, 16);

  vertex(-44, 40);
  vertex(-18, 6);

  vertex(-60, 0);
  vertex(-17, -7);

  vertex(-38, -42);
  vertex(-8, -18);
  endShape(CLOSE);

  // inner layer
  fill(255, 250, 210, 140);
  beginShape();
  vertex(0, -42);
  vertex(7, -13);

  vertex(29, -26);
  vertex(12, -5);

  vertex(40, 0);
  vertex(13, 5);

  vertex(28, 28);
  vertex(6, 11);

  vertex(0, 40);
  vertex(-7, 11);

  vertex(-30, 27);
  vertex(-12, 4);

  vertex(-41, 0);
  vertex(-11, -5);

  vertex(-27, -28);
  vertex(-6, -12);
  endShape(CLOSE);

  // center core
  fill(235, 245, 200, 120);
  circle(0, 0, 16);

  pop();
}

