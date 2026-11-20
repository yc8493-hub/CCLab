let desktopImg;
let closedDiaryImg;
let openedDiaryImg;

let diary;
let concert;
let particles = [];
let currentScene = "desktop";

async function setup() {
  createCanvas(1000, 600);
  angleMode(DEGREES);

  desktopImg = await loadImage("assets/image3.png");
  closedDiaryImg = await loadImage("assets/image1.png");
  openedDiaryImg = await loadImage("assets/image2.png");

  diary = new Diary(width / 2, height / 2);
  concert = new Concert();
}

function draw() {
  background(255);
  if (!diary || !concert) return; //ChatGPT recommendation: Add this line to prevent errors if diary or concert is not initialized.

  if (currentScene === "desktop") { //GPT suggestion: Use strict equality operator (===) for comparison instead of assignment operator (=) to avoid unintended assignments.
    //+ https://p5js.org/reference/p5/Boolean/
    image(desktopImg, 0, 0, width, height); //background image
    diary.closedDiary();

  } else if (currentScene === "diary") {
    image(desktopImg, 0, 0, width, height);
    diary.openedDiary();
    diary.showPhotos();

  } else if (currentScene === "concert") {
    concert.display();
  }
}

function mousePressed() {
  if (!diary || !concert) return; //ChatGPT recommendation: Add this line to prevent errors if diary or concert is not initialized.

  if (currentScene === "desktop") {
    diary.checkMouse();

  } else if (currentScene === "diary") {
    diary.checkPhoto();

  } else if (currentScene === "concert") {
    concert.checkMouse();
  }
}

class Diary {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.closedImg = closedDiaryImg;
    this.openedImg = openedDiaryImg;

    this.h = 300;
    this.w = this.h * this.closedImg.width / this.closedImg.height;

    // Concert photo
    this.photoX = 680;
    this.photoY = 380;
    this.photoW = 120;
    this.photoH = 140;
  }

  checkMouse() { //mouse click on the diary to open it
    if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
      currentScene = "diary";
    }
  }

  closedDiary() {
    push();
    translate(this.x, this.y);

    imageMode(CENTER);
    image(this.closedImg, 0, 0, this.w, this.h);

    pop();
  }

  openedDiary() {
    push();
    translate(width / 2, height / 2);

    imageMode(CENTER);

    let openH = 900;
    let openW = openH * this.openedImg.width / this.openedImg.height;

    image(this.openedImg, 0, 0, openW, openH);

    pop();
  }

  showPhotos() {
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    noStroke();

    fill(70);
    textSize(16);
    text("Concert / Universe", 350, 170);

    // Photo A: photo collection
    fill(255);
    rect(610, 220, 120, 140);

    fill(0);
    textSize(13);
    text("Photo Collection", 610, 200);
    text("Switchable (planned)", 610, 220);

    // Photo B: enter the concert
    fill(255);
    rect(this.photoX, this.photoY, this.photoW, this.photoH);

    fill(0);
    textSize(13);
    text("Enter the Concert", this.photoX, this.photoY - 8);

    pop();
  }

  checkPhoto() {
    if (mouseX > this.photoX - this.photoW / 2 &&
      mouseX < this.photoX + this.photoW / 2 &&
      mouseY > this.photoY - this.photoH / 2 &&
      mouseY < this.photoY + this.photoH / 2) {

      concert.startConcert();
      currentScene = "concert";
    }
  }
}

class Concert {
  constructor() {
    this.x = width / 2;
    this.y = height * 0.6;

    this.time = 0;
    this.light = 0;
  }

  display() {
    background(0);
    this.time = this.time + 1;

    this.light = map(this.time, 120, 300, 0, 1);
    this.light = max(0, min(this.light, 1));

    // Update and display particles behind the stage
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      p.move(this.time);

      if (this.time > 480) {
        p.checkMouse();
      }
      if (p.y < this.y) {
        p.display();
      }
    }

    this.showLight();
    this.showStage();
    this.showRambo();

    // Display particles in front of the stage
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      if (p.y >= this.y) {
        p.display();
      }
    }
    // Mouse star
    if (this.time > 480) {
      this.showStar();
    }
    this.showExit();

  }

  startConcert() {
    // Start the concert
    this.time = 0;
    this.light = 0;

    particles = [];

    // Create particles
    for (let i = 0; i < 1500; i++) {
      particles.push(new Particle(this.x, this.y));
    }
  }

  showStage() {
    push();
    translate(this.x, this.y);

    noStroke();
    // Outer glow
    fill(230, 210, 255, 10 * this.light);
    ellipse(0, 0, 150, 50);
    // Inner glow
    fill(230, 210, 255, 25 * this.light);
    ellipse(0, 0, 120, 35);
    // Stage
    fill(80, 75, 90, 255 * this.light);
    ellipse(0, 0, 90, 22);

    pop();
  }

  showLight() {
    push();
    translate(this.x, this.y);

    noStroke();
    for (let i = 0; i < 15; i++) {
      fill(230, 220, 255, 6 * this.light);
      triangle(0, -400, -60 + i * 3, 0, 60 - i * 3, 0);
    }

    pop();
  }

  showRambo() {
    push();
    translate(this.x, this.y);
    scale(0.4);

    noStroke();
    fill(20, 255 * this.light);

    circle(0, -75, 24);
    // Body
    beginShape();
    vertex(-12, -60);
    vertex(12, -60);
    vertex(23, 0);
    vertex(-23, 0);
    endShape(CLOSE);

    pop();
  }

  showStar() {
    push();
    translate(mouseX, mouseY);

    noStroke();
    // Outer glow
    fill(255, 255, 255, 15);
    circle(0, 0, 25);
    // Inner glow
    fill(255, 255, 255, 60);
    circle(0, 0, 12);
    // Star
    fill(255);
    circle(0, 0, 5);

    pop();
  }

  showExit() {
    push();

    noStroke();
    fill(255, 180);
    textSize(14);
    textAlign(RIGHT, CENTER);
    text("Back to Diary", width - 30, 30);

    pop();
  }

  checkMouse() {
    if (mouseX > width - 150 && mouseX < width &&
      mouseY > 0 && mouseY < 60) {
      currentScene = "diary";
    }
  }
}

class Particle {
  constructor(x, y) {
    this.centerX = x;
    this.centerY = y;

    this.angle = random(0, 360);
    this.radius = random(60, 480);
    this.speed = random(0.1, 0.5);

    // Position
    this.x = x;
    this.y = y;

    // Appearance
    this.dia = random(0.8, 2.5);

    // Fade in from far to near
    this.start = map(sin(this.angle), -1, 1, 180, 420);
    this.start = this.start + random(0, 60);
    this.fade = 0;

    // Color change
    this.white = 0;
  }

  move(time) {

    // Fade in
    this.fade = map(time, this.start, this.start + 100, 0, 1);
    this.fade = max(0, min(this.fade, 1));

    // Start orbiting slowly
    let turn = map(time, 360, 660, 0, 1);
    turn = max(0, min(turn, 1));

    if (this.fade === 1) {
      this.angle += this.speed * turn;
    }

    this.x = this.centerX + cos(this.angle) * this.radius;
    this.y = this.centerY + sin(this.angle) * this.radius * 0.4;
  }

  checkMouse() {
    let dst = dist(this.x, this.y, mouseX, mouseY);
    if (dst < 65) {
      this.white = lerp(this.white, 1, 0.08);
    } else {
      this.white = lerp(this.white, 0, 0.03);
    }
  }

  display() {
    if (this.fade === 0) return;

    push();
    translate(this.x, this.y);
    // Size changes with distance
    let s = map(sin(this.angle), -1, 1, 0.3, 1.6);

    // Brightness changes with distance
    let alpha = map(sin(this.angle), -1, 1, 40, 255);
    alpha = alpha * this.fade;

    let d = this.dia * s;
    // Change from pink to white
    let g = map(this.white, 0, 1, 180, 255);
    let b = map(this.white, 0, 1, 210, 255);

    noStroke();
    rectMode(CENTER);
    rotate(this.angle);

    // Outer glow
    fill(255, g, b, alpha * 0.06);
    rect(0, 0, d * 2, d * 6, 2);
    // Inner glow
    fill(255, g, b, alpha * 0.2);
    rect(0, 0, d, d * 4, 1);
    // Particle
    fill(255, g, b, alpha);
    rect(0, 0, d * 0.5, d * 3, 1);

    pop();
  }
}
