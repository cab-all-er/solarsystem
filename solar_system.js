const width = 125;
const height = 125;
const scaleFactor = 0.55;
const MIN_BRIGHTNESS = 0.2;
const BRIGHTNESS_DISTANCE_FACTOR = 10;

setDocDimensions(width, height);

let finalShapes = [];

function createCircle(center, radius, numSegments) {
  const points = [];
  const angleStep = 2 * Math.PI / numSegments;
  
  for (let i = 0; i <= numSegments; i++) {
    const angle = angleStep * i;
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    points.push([x, y]);
  }
  
  return points;
}

function calculateBrightness(x, y, lightX, lightY, radius) {
  const dx = x - lightX, dy = y - lightY;
  const distanceToLight = Math.sqrt(dx * dx + dy * dy);
  return Math.max(MIN_BRIGHTNESS, 1 - distanceToLight / (radius * BRIGHTNESS_DISTANCE_FACTOR));
}

function createShadedCircle(center, radius, lightSource, numSegments) {
  const points = [];
  const [lightX, lightY] = lightSource;
  const [centerX, centerY] = center;

  for (let i = 0; i <= numSegments; i++) {
    const angle = (2 * Math.PI * i) / numSegments;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const brightness = calculateBrightness(x, y, lightX, lightY, radius);
    points.push([x, y, brightness]);
  }

  return points;
}

function drawShadedCircle(circle) {
  for (let i = 0; i < circle.length - 1; i++) {
    const [x1, y1, b1] = circle[i];
    const [x2, y2, b2] = circle[i + 1];
    finalShapes.push([[x1, y1], [x2, y2]]);
  }
}

function addStarfield(numStars) {
  for (let i = 0; i < numStars; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;

    finalShapes.push([[x, y], [x + 0.5, y + 0.5], [x - 0.5, y + 0.5], [x, y]]);
  }
}

const sunRadius = 12 * scaleFactor;
const sunCenter = [width / 2, height / 2];
finalShapes.push(createCircle(sunCenter, sunRadius, 40));

const numPlanets = 5;
const orbitSpacing = 20 * scaleFactor;
const numSegments = 50;

for (let i = 1; i <= numPlanets; i++) {
  const orbitRadius = sunRadius + i * orbitSpacing;
  finalShapes.push(createCircle(sunCenter, orbitRadius, numSegments));

  const angle = Math.random() * 2 * Math.PI;
  const planetX = sunCenter[0] + orbitRadius * Math.cos(angle);
  const planetY = sunCenter[1] + orbitRadius * Math.sin(angle);

  const planetRadius = (Math.random() * 4 + 2) * scaleFactor;
  const shadedPlanet = createShadedCircle([planetX, planetY], planetRadius, sunCenter, 20);
  drawShadedCircle(shadedPlanet);
}

const asteroidBeltRadius = sunRadius + numPlanets * orbitSpacing + 12 * scaleFactor;
const numAsteroids = 100;

for (let i = 0; i < numAsteroids; i++) {
  const angle = Math.random() * 2 * Math.PI;
  const distance = asteroidBeltRadius + Math.random() * 5 - 2.5;
  
  const maxDistance = width / 2 - 10;
  const distanceClamped = Math.min(distance, maxDistance);

  const x = width / 2 + distanceClamped * Math.cos(angle);
  const y = height / 2 + distanceClamped * Math.sin(angle);

  const asteroid = [
    [x, y],
    [x + Math.random() * scaleFactor, y + Math.random() * scaleFactor],
    [x - Math.random() * scaleFactor, y + Math.random() * scaleFactor],
    [x, y]
  ];
  finalShapes.push(asteroid);
}

addStarfield(50);

bt.rotate(finalShapes, Math.random() * 360);
drawLines(finalShapes);
