/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let babyX, babyY;
let babyBase = 150;
let minBabySize = 45;
let avoidX = 0;
let avoidY = 0;
let avoidRange = 200 //dist between Mouse and baby< avoidRange--> baby avoid
let avoidSpeed = 2;
let angle = 0;
let panic = false;
let panicStart = 0;
let a, amp;
let adultX, adultY;

function setup() {
    createCanvas(800, 500);
    angleMode(DEGREES);
    rectMode(CENTER);

    babyX = width / 2;
    babyY = height / 2;
    background(220);
}

function draw() {
    background(0, 10);

    // #00 bubble background
    let gridSize = 50;
    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
            let xAdj = x + gridSize / 2;

            let n = noise(x * 0.02, frameCount * 0.01);
            let yOffset = map(n, 0, 1, -20, 20);
            let yAdj = y + gridSize / 2 + yOffset;

            // bubbleR = random(0,100)
            // bubbleG = random (0, 100)
            stroke(100, 100, 100, 15);
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
    drawNest(105, 95, 34);

    // #1 Baby 
    baseX = map(noise(frameCount * 0.003), 0, 1, 100, width - 100);
    baseY = map(noise(frameCount * 0.003 + 100), 0, 1, 100, height - 100);
    //freely move on canvas

    babyX = baseX + avoidX
    babyY = baseY + avoidY

    // distance between mouse and baby
    let mouseDist = dist(mouseX, mouseY, babyX, babyY);

    // mouse avoidance
    if (mouseDist < avoidRange && mouseDist > 0) {

        let dx = babyX - mouseX; // direction awat from mouse
        let dy = babyY - mouseY;

        avoidX += (dx / mouseDist) * avoidSpeed;
        avoidY += (dy / mouseDist) * avoidSpeed;

    } else {
        avoidX *= 0.95;
        avoidY *= 0.95;
    }

    // make sure baby stay in the middle of canvas
    babyX = constrain(baseX + avoidX, 50, width - 50);
    babyY = constrain(baseY + avoidY, 50, height - 50);

    let babyDia;
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

    if (babyBase > minBabySize) {
        // stage 1: orbits Baby
        angle += 1;
        adultX = babyX + cos(angle) * orbitRadius;
        adultY = babyY + sin(angle) * orbitRadius;
    } else {
        // stage 2: moves independently
        adultX = map(noise(frameCount * 0.003 + 200), 0, 1, 50, width - 50);
        adultY = map(noise(frameCount * 0.003 + 300), 0, 1, 50, height - 50);
    }

    // #3 adult panic
    if (panic == true) {
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
    push();
    translate(babyX, babyY);

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

    // #5 adult setting
    push();
    translate(adultX, adultY);
    rotate(frameCount * 3);
    drawAdult();
    pop();
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
    strokeWeight(2);
    fill(babyR, babyG, babyB, 95);

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
    fill(r, g, b, 120);
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
    fill(tantacleR, tantacleG, 255, 150);

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

