let dancer;

function setup() {
  // no adjustments in the setup function needed...
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // ...except to adjust the dancer's name on the next line:
  dancer = new SheepDancer(width / 2, height / 2);
}

function draw() {
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

class SheepDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.time = 0;
    this.bodySwing = 0;
    this.armSwing = 0;
    this.legSwing = 0;
    this.earSwing = 0;
    this.bounce = 0;
  }
  update() {

    this.time += 1;
    this.bodySwing = sin(this.time * 3) * 12;
    this.armSwing = sin(this.time * 5) * 12;
    this.legSwing = sin(this.time * 6) * 10;
    this.earSwing = sin(this.time * 7) * 10;
    this.bounce = sin(this.time * 4) * 54;
    // update properties here to achieve
    // your dancer's desired moves and behaviour
  }
  display() {
    push();
    translate(this.x, this.y + this.bounce);
    rotate(this.bodySwing);

    //arms
    stroke(105, 85, 90);
    strokeWeight(2.5);
    fill(255, 248, 249);

    line(-42, 12, -61, 15 + this.armSwing);
    circle(-61, 15 + this.armSwing, 8);

    line(42, 12, 61, 15 - this.armSwing);
    circle(61, 15 - this.armSwing, 8);
    //legs
    line(-20, 37, -24 + this.legSwing, 65);
    circle(-24 + this.legSwing, 65, 9);

    line(20, 37, 24 - this.legSwing, 65);
    circle(24 - this.legSwing, 65, 9);

    //ears
    stroke(105, 85, 90);
    strokeWeight(2);
    fill(255, 225, 232);

    push();
    translate(-42, -15);
    rotate(-15 + this.earSwing);
    triangle(0, 0, -22, -10, -10, 15);
    pop();

    push();
    translate(42, -15);
    rotate(15 - this.earSwing);
    triangle(0, 0, 22, -10, 10, 15);
    pop();

    //body
    fill(255, 250, 251);
    stroke(105, 85, 90);
    strokeWeight(2);

    ellipse(0, 0, 93, 94);
    circle(-34, -24, 32);
    circle(-17, -41, 34);
    circle(12, -42, 34);
    circle(35, -25, 32);
    circle(43, 1, 30);
    circle(31, 29, 32);
    circle(0, 39, 31);
    circle(-30, 29, 32);
    circle(-43, 1, 30);

    noStroke();
    fill(255, 250, 251);
    ellipse(0, 0, 90, 86);

    //horns
    noFill();
    stroke(240, 194, 93);
    strokeWeight(3);

    arc(-14, -20, 18, 18, 40, 320);
    arc(14, -20, 18, 18, 220, 500);

    //eyes
    noStroke();
    fill(75, 55, 65);
    ellipse(-19, 2, 13, 19);
    ellipse(19, 2, 13, 19);

    fill(255);
    circle(-16, -3, 5);
    circle(22, -3, 5);

    //blush
    fill(255, 201, 211, 150);
    ellipse(-34, 17, 17, 9);
    ellipse(34, 17, 17, 9);

    //cute hair
    noFill();
    stroke(240, 194, 93);
    strokeWeight(2.5);
    arc(0, -27, 18, 16, 180, 360);
    arc(8, -21, 10, 14, 0, 220);

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    //this.drawReferenceShapes()

    pop();
  }

  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}
