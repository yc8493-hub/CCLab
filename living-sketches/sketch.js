// original images
let scannedImages = [];

// cropped parts of images
let Rambo;
let Sun;
let greenLine;

// current indices for animation
let currentRamboIndex = 0;
let currentSunIndex = 0;
let currentGreenLineIndex = 0;

let ramboX = 600;
let ramboY = 340;


async function setup() {
  createCanvas(1000, 1000);

  // load all images first
  const imagePromises = [];
  for (let i = 0; i < 3; i++) {
    imagePromises.push(loadImage("assets/image" + i + ".jpg"));
  }
  scannedImages = await Promise.all(imagePromises);

  eraseBackground(scannedImages, 60); //ask ChatGPT to learn how to use this function

  Rambo = crop(scannedImages, 180, 50, 550, 400); //x1, y1 764, 420
  Sun = crop(scannedImages, 1719, 85, 505, 400);  //2224, 362
  greenLine = crop(scannedImages, 1500, 1250, 870, 400); //2350, 1450
}


function draw() {
  background(255);

  //image(scannedImages[1], 0, 0);
  //console.log(mouseX, mouseY); //ask Professor to learn how to capture the image position

  currentGreenLineIndex = floor(map(sin(frameCount / 20), -1, 1, 0, greenLine.length));
  image(
    greenLine[currentGreenLineIndex],
    500,
    500,
    greenLine[0].width * 0.6,
    greenLine[0].height * 0.3
  );

  //Rambo animation
  image(
    Rambo[currentRamboIndex],
    550,
    340,
    Rambo[0].width * 0.5,
    Rambo[0].height * 0.5
  );

  currentSunIndex = floor(frameCount / 25) % Sun.length;

  let sunSize = 0.35 + sin(frameCount * 0.01) * 0.05;

  image(
    Sun[currentSunIndex],
    350,
    280,
    Sun[0].width * sunSize,
    Sun[0].height * sunSize
  );

}
//mousepressed function to change the Rambo animation frame
function mousePressed() {
  currentRamboIndex = (currentRamboIndex + 1) % Rambo.length;
}

// IMAGE PROCESSING FUNCTIONS
// You shouldn't need to modify these helper functions:
function crop(images, x, y, width, height) {
  const croppedImages = [];

  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    croppedImages.push(images[imageIndex].get(x, y, width, height));
  }

  return croppedImages;
}

function eraseBackground(images, threshold = 10) {
  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    const currentImage = images[imageIndex];
    currentImage.loadPixels();

    for (let pixelIndex = 0; pixelIndex < currentImage.pixels.length; pixelIndex += 4) {
      let distanceFromWhite = 255 - currentImage.pixels[pixelIndex];
      distanceFromWhite += 255 - currentImage.pixels[pixelIndex + 1];
      distanceFromWhite += 255 - currentImage.pixels[pixelIndex + 2];

      if (distanceFromWhite < threshold) {
        currentImage.pixels[pixelIndex + 3] = 0;
      }
    }

    currentImage.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned :D
}
