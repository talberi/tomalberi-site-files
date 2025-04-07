// Class for defining a point.
class Point { 
  constructor(x, y) { 
    this.x = x; 
    this.y = y; 
  } 
} 

// Class for line
class Line { 
  constructor(p1, p2) { 
    this.p1 = p1; 
    this.p2 = p2; 
  } 
}

// Class for a quad
class Quad {
  // Upper left = p0
  // Upper right = p1
  // Lower right = p2
  // Lower left = p3
  constructor(p0, p1, p2, p3) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3; 
  } 
}

// Class for ranked quad
class RankedQuad {
	constructor(p0, p1, p2, p3, rank) {
		this.p0 = p0;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.rank = rank;
	}
}

//Variable initialization
var seed;
var canvasMin;
var cHeight;
var numOrbits;
var colorSets; 
var colorSetIndex;
var colorSetNames;
var cName;
var colorOrder;
var rainCond;
var bgType;

// Find out if a point is within a quad.
// Assumes quad is a rectangle
function isPointInQuad(point, quad) {
	let px = point.x;
	let py = point.y;
	let q0x = quad.p0.x;
	let q0y = quad.p0.y;
	let q1x = quad.p1.x;
	let q1y = quad.p1.y;
	let q2x = quad.p2.x;
	let q2y = quad.p2.y;
	let q3x = quad.p3.x;
	let q3y = quad.p3.y;
	let result = false;
	if (px >= q0x && px <= q1x && py >= q0y && py <= q2y) {
		result = true;
	}
	
	return result;
}

// Sets a random tranparency for a color
function setRandomTrans(c, minTrans, maxTrans) {
	let cR = red(c);
	let cG = green(c);
	let cB = blue(c);
	
	return color(cR, cG, cB, random(minTrans, maxTrans));
}

function drawPointOnEllipseWithGraphics(centerPoint, w, h, t, d, quadSelect, graphics) {
	let x = w * Math.cos(t);
	let y = h * Math.sin(t);
	if (quadSelect == 0) {
		x = -w * Math.cos(t);
		y = h * Math.sin(t);
	} else if (quadSelect == 1) {
		x = w * Math.cos(t);
		y = -h * Math.sin(t);
	} else if (quadSelect == 2) {
		x = -w * Math.cos(t);
		y = -h * Math.sin(t);
	}
    graphics.circle(x + centerPoint.x, y + centerPoint.y, d);
}

function getPointOnEllipse(centerPoint, w, h, t, quadSelect) {
	let x = w * Math.cos(t);
	let y = h * Math.sin(t);
	if (quadSelect == 0) {
		x = -w * Math.cos(t);
		y = h * Math.sin(t);
	} else if (quadSelect == 1) {
		x = w * Math.cos(t);
		y = -h * Math.sin(t);
	} else if (quadSelect == 2) {
		x = -w * Math.cos(t);
		y = -h * Math.sin(t);
	}
    return new Point(x + centerPoint.x, y + centerPoint.y);
}

function drawBokehOnLines(c, quads, lines, blurAmount, maxLightDia, transAmount) {
	let randomMin = 800;
	let randomMax = 1000;
	let randomChanceMax = 0.5;
	let blurVar = 8;
	let minDiaCoeff = 0.08;
	let maxDiaCoeff = 0.15;
	let minTransCoeff = 0.7;
	let maxTransCoeff = 1.02;
	let maxTrans = 220;
	let minTrans = 180;
	let iterations = random(randomMin, randomMax);
	let pg = drawingContext;
	for(let i = 0; i < iterations; i++) {
		let px = random(0, canvasMin);
		let py = random(0, cHeight);
		let r = 0;
		
		// Check closeness to each line
	    let maxD = canvasMin / 10;//random(4, 10);
	    let prob = 0;
	    for (let l = 0; l < lines.length; l++) {
			let distFromL = getDistanceFromLine(lines[l], new Point(px,py));
			if (distFromL < maxD) {
				prob = min(prob + (1 - (distFromL / maxD)), 0.7);
			}
		}

		// Draw the circle if the probability is within a certain range
		for (let j = 0; j < quads.length; j++) {
			let q = quads[j];
			if (isPointInQuad(new Point(px, py), q)) {
				r = q.rank;
			}
		}
		let randomCheck = random(0,1);
		if (randomCheck < prob * r) {
			// Draw the circle
			//let blurAmount = blurCoeff * random(0, 1);
			let blurAmount2 = blurAmount * random(blurVar/100, blurVar);
			let blurString = blurAmount2.toString();
			pg.filter = 'blur(' + blurAmount2 + 'px)';
			let transColor = setRandomTrans(c, minTransCoeff * transAmount, maxTransCoeff * transAmount);
			fill(transColor);
			circle(px, py, random(minDiaCoeff, maxDiaCoeff)*maxLightDia);
			pg.filter = 'none';
		}
		/*for (let j = 0; j < quads.length; j++) {
			let q = quads[j];
			if (isPointInQuad(new Point(px, py), q)) {
				r = q.rank;
			}
		}
		if(random(0, randomChanceMax) < r) {
			let pg = drawingContext;
			let blurAmount = blurCoeff * sq((1 - r));
			let blurString = blurAmount.toString();
			pg.filter = 'blur(' + blurAmount + 'px)';
			let transColor = setRandomTrans(c, Math.min(minTransCoeff*(r/0.005), minTrans), Math.min(maxTransCoeff*(r/0.009), maxTrans));
			fill(transColor);
			circle(px, py, random(minDiaCoeff, maxDiaCoeff)*r*maxLightDia);
			pg.filter = 'none';
		}*/
	}
 }

function drawRainDropOnGraphics(p, d, g) {
	let rdDia = d;
    let rdPx = p.x;
    let rdPy = p.y;
	let plotD = canvasMin/500;
    let numPoints = 2*PI*rdDia/2;
    g.noStroke();
    let layerDiff0x = rdPx/(rdDia*(rdDia + 1)/2);
    let layerDiff0y = rdPy/(rdDia*(rdDia + 1)/2);
    let layerDiffxMax = (canvasMin - rdPx)/(rdDia*(rdDia + 1)/2);
    let layerDiffyMax = (cHeight - rdPy)/(rdDia*(rdDia + 1)/2);
    let w0 = layerDiff0x;
    let h0 = layerDiff0y;
    let wMax = layerDiffxMax;
    let hMax = layerDiffyMax;
    let pixDensity = pixelDensity();
    for (let d = 0; d <= rdDia; d++) {
	  for (let i = 0; i < 4; i++) {
		  let angle = 0;
		  for (let j = 0; j < Math.floor(numPoints/4) + 2; j++) {
			  if (i == 0) {
				  let p = getPointOnEllipse(new Point(rdPx, rdPy), w0, hMax, angle, i);
				  let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
				  let rVal = pixels[index];
				  let gVal = pixels[index + 1];
				  let bVal = pixels[index + 2];
				  g.fill(rVal, gVal, bVal);
				  drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i + 1, g);
				  angle = angle + (PI/2)/(numPoints/4);
			  } else if (i == 1) {
				  let p = getPointOnEllipse(new Point(rdPx, rdPy), wMax, h0, angle, i);
				  let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
				  let rVal = pixels[index];
				  let gVal = pixels[index + 1];
				  let bVal = pixels[index + 2];
				  g.fill(rVal, gVal, bVal);
				  drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i - 1, g);
				  angle = angle + (PI/2)/(numPoints/4);
			  } else if (i == 2) {
				  let p = getPointOnEllipse(new Point(rdPx, rdPy), w0, h0, angle, i);
				  let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
				  let rVal = pixels[index];
				  let gVal = pixels[index + 1];
				  let bVal = pixels[index + 2];
				  g.fill(rVal, gVal, bVal);
				  drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i + 1, g);
				  angle = angle + (PI/2)/(numPoints/4);
			  } else {
				  let p = getPointOnEllipse(new Point(rdPx, rdPy), wMax, hMax, angle, i);
				  let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
				  let rVal = pixels[index];
				  let gVal = pixels[index + 1];
				  let bVal = pixels[index + 2];
				  g.fill(rVal, gVal, bVal);
				  drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i - 1, g);
				  angle = angle + (PI/2)/(numPoints/4);
			  }
		  }
	  }
	w0 = w0 + layerDiff0x * d;
	h0 = h0 + layerDiff0y * d;
	wMax = wMax + layerDiffxMax * d;
	hMax = hMax + layerDiffyMax * d;
  }
  
  return g;
}

// Get the closest distance between a point and a given line
function getDistanceFromLine(line,p) {
	let distance = 0;
  
	// Vector between two line points
	let l12x = line.p1.x - line.p2.x;
	let l12y = line.p1.y - line.p2.y;
  
	// Vector between first line point and the point
	let l1px = p.x - line.p1.x;
	let l1py = p.y - line.p1.y;
  
	// Vector between second line point and the point
	let l2px = p.x - line.p2.x;
	let l2py = p.y - line.p2.y;
  
	// Variable to store the dot products
	let l12_l1p;
	let l12_l2p;
  
	// Calculate the dot product
	l12_l1p = l12x * l1px + l12y * l1py;
	l12_l2p = l12x * l2px + l12y * l2py;
  
	// Claculate minimum distance between the line and the point
	if (l12_l1p > 0) {
		let y = p.y - line.p1.y;
		let x = p.x - line.p1.x;
		distance = sqrt(x * x + y * y);
	} else if (l12_l2p < 0) {
		let y = p.y - line.p2.y;
		let x = p.x - line.p2.x;
		distance = sqrt(x * x + y * y);
	} else {
	
		// Find the perpendicular distance
		let x1 = l12x;
		let y1 = l12y;
		let x2 = l2px;
		let y2 = l2py;
		let mod = sqrt(x1 * x1 + y1 * y1);
		distance= abs(x1 * y2 - y1 * x2) / mod;
	}
  
	return distance;
}

// Set curated color pallets
function getColorSets() {
  // Dawn
  let aColors = new Array(4);
  aColors[0] = color(100, 13, 95); // Dark purple 
  aColors[1] = color(217, 22, 86); // Magenta
  aColors[2] = color(200, 77, 0); // Orange
  aColors[3] = color(255, 178, 0); // Light orange
  
  // Cyber Punk
  let bColors = new Array(4);
  bColors[0] = color(44, 0, 59); // Dark purple
  bColors[1] = color(0, 109, 137); // Dark teal
  bColors[2] = color(0, 171, 180); // Teal
  bColors[3] = color(255, 98, 222); // Magenta
  
  // City
  let cColors = new Array(4);
  cColors[0] = color(10, 22, 27); // Bluish black
  cColors[1] = color(255, 240, 183); // Yellow
  cColors[2] = color(48, 65, 102); // Dark Blue
  cColors[3] = color(255, 72, 0); // Red
  
  // Twilight
  let dColors = new Array(4);
  dColors[0] = color(20, 16, 50); // Dark blue
  dColors[1] = color(175, 59, 194); // Purple
  dColors[2] = color(255, 165, 225); // Pink
  dColors[3] = color(255, 104, 104); // Light red
  
  // Cloudy Night
  let eColors = new Array(4);
  eColors[0] = color(0); // Black
  eColors[1] = color(153, 195, 234); // Light blue
  eColors[2] = color(255, 254, 225); // Yellow
  eColors[3] = color(52, 116, 161); // Dull blue
  
  // Foggy Evening
  let fColors = new Array(4);
  fColors[0] = color(13, 39, 53); // Dark blue
  fColors[1] = color(39, 84, 138); // Medium blue
  fColors[2] = color(221, 168, 83); // Gold
  fColors[3] = color(245, 238, 220); // Off white
  
  // Hard Contrast
  let gColors = new Array(4);
  gColors[0] = color(0); // Black
  gColors[1] = color(255); // White
  gColors[2] = color(120); // Gray
  gColors[3] = color(255, 0, 0); // Red
  
  // Rain Forest
  let hColors = new Array(4);
  hColors[0] = color(20, 61, 96); // Dark blue
  hColors[1] = color(48, 124, 150); // Blue green
  hColors[2] = color(160, 200, 120); // Warm green
  hColors[3] = color(221, 235, 157); // Light green
  
  // Embers
  let mhColors = new Array(4);
  mhColors[0] = color(20, 22, 24); // Dark Gray
  mhColors[1] = color(80, 86, 90); // Gray
  mhColors[2] = color(255, 145, 0); // Orange
  mhColors[3] = color(255, 234, 0); // Peach
  
  // Fireflies
  let radColors = new Array(4);
  radColors[0] = color(47, 96, 42); // Dark green
  radColors[1] = color(255, 247, 0); // Yellow
  radColors[2] = color(0, 137, 121); // Blue green
  radColors[3] = color(0); // Black
  
  // Aggregate all color sets
  colorSets = new Array();
  colorSetNames = new Array();
  colorSets = append(colorSets, aColors);
  colorSetNames = append(colorSetNames, "Dawn");
  colorSets = append(colorSets, bColors);
  colorSetNames = append(colorSetNames, "Cyber Punk");
  colorSets = append(colorSets, cColors);
  colorSetNames = append(colorSetNames, "City");
  colorSets = append(colorSets, dColors);
  colorSetNames = append(colorSetNames, "Twilight");
  colorSets = append(colorSets, eColors);
  colorSetNames = append(colorSetNames, "Cloudy Night");
  colorSets = append(colorSets, fColors);
  colorSetNames = append(colorSetNames, "Foggy Evening");
  colorSets = append(colorSets, gColors);
  colorSetNames = append(colorSetNames, "Hard Contrast");
  colorSets = append(colorSets, hColors);
  colorSetNames = append(colorSetNames, "Rain Forest");
  colorSets = append(colorSets, mhColors);
  colorSetNames = append(colorSetNames, "Embers");
  colorSets = append(colorSets, radColors);
  colorSetNames = append(colorSetNames, "Fireflies");
}

function setup ( ) {
  seed = int(random() * 999999);
  canvasMin = Math.floor(innerWidth);
  cHeight = Math.floor(canvasMin*21/34);
  if (cHeight > innerHeight) {
	  canvasMin = Math.floor(innerHeight * 34/21);
	  cHeight = Math.floor(innerHeight);
  }
  createCanvas(canvasMin, cHeight);
  getColorSets();
  colorSetIndex = Math.floor(random(0, colorSets.length));
  cName = colorSetNames[colorSetIndex];
  colorOrder = random(0, 1);
  rainCond = Math.floor(random(0, 2.999999)); // TODO: set names for rain conditions AND make their probabilities different. Should the background be darker in higher conditions?+-
  bgType = random(0, 1);
  shapeType = 0;//Math.floor(random(0, 4.999999));
  frameRate(10);
  noLoop();
}

function draw ( ) {
  randomSeed(seed);
  getColorSets();
  colorSetIndex = Math.floor(random(0, colorSets.length));
  cName = colorSetNames[colorSetIndex];
  let quadConfig = Math.floor(random(0, 3.999999));
  
  // Choose color set
  // TODO: Monochrome option?
  selectedCS = colorSets[colorSetIndex];
  if (colorOrder < 0.95) {
	  selectedCS.sort((a, b) => lightness(a) - lightness(b)); //Normall
  } else {
	  selectedCS.sort((a, b) => lightness(b) - lightness(a)); //Inverted
  }
  let baseColor = selectedCS[0];
  let color1 = selectedCS[1];
  let color2 = selectedCS[2];
  let color3 = selectedCS[3];
  background(baseColor);
  
  if (bgType > 0.75) {
	  let gradC2 = selectedCS[1];
	  let startYGrad = random(0.1*cHeight, 0.3*cHeight);
	  let endYGrad = startYGrad + random(0.5, 0.6)*cHeight;
	  for (let y = 0; y < cHeight; y++) {
		if (y <= startYGrad) {
			stroke(gradC2);
		} else if (y >= endYGrad) {
			stroke(baseColor);
		} else {
			const lineColor = lerpColor(gradC2, baseColor, (y - startYGrad)/(endYGrad - startYGrad));
			stroke(lineColor);
		}
		line(0, y, canvasMin, y);
	  }
  }
  
  // Establish the ranked quads
  let rankConst = 1;
  
  //Initalize the quads
  let q21 = new RankedQuad(0, 0, 0, 0, 0);
  let q13 = new RankedQuad(0, 0, 0, 0, 0);
  let q8 = new RankedQuad(0, 0, 0, 0, 0);
  let q5 = new RankedQuad(0, 0, 0, 0, 0);
  let q3 = new RankedQuad(0, 0, 0, 0, 0);
  let q2 = new RankedQuad(0, 0, 0, 0, 0);
  let q1A = new RankedQuad(0, 0, 0, 0, 0);
  let q1B = new RankedQuad(0, 0, 0, 0, 0);
  
  // Quad 21
  if (quadConfig == 0 || quadConfig == 1) { // Left
	  let p0 = new Point(0, 0);
	  let p1 = new Point(cHeight, 0);
	  let p2 = new Point(cHeight, cHeight);
	  let p3 = new Point(0, cHeight);
	  q21 = new RankedQuad(p0, p1, p2, p3, rankConst/21);
  } else { // Right
	  let p0 = new Point(canvasMin*13/34, 0);
	  let p1 = new Point(canvasMin, 0);
	  let p2 = new Point(canvasMin, cHeight);
	  let p3 = new Point(canvasMin*13/34, cHeight);
	  q21 = new RankedQuad(p0, p1, p2, p3, rankConst/21);
  }
  
  // Quad 13
  if (quadConfig == 0) { // Upper right
	  let p0 = new Point(cHeight, 0);
	  let p1 = new Point(canvasMin, 0);
	  let p2 = new Point(canvasMin, cHeight*13/21);
	  let p3 = new Point(cHeight, cHeight*13/21);
	  q13 = new RankedQuad(p0, p1, p2, p3, rankConst/13);
  } else if (quadConfig == 1) { // Lower right
	  let p0 = new Point(cHeight, cHeight*8/21);
	  let p1 = new Point(canvasMin, cHeight*8/21);
	  let p2 = new Point(canvasMin, cHeight);
	  let p3 = new Point(cHeight, cHeight);
	  q13 = new RankedQuad(p0, p1, p2, p3, rankConst/13);
  } else if (quadConfig == 2) { // Upper left
	  let p0 = new Point(0, 0);
	  let p1 = new Point(canvasMin*13/34, 0);
	  let p2 = new Point(canvasMin*13/34, cHeight*13/21);
	  let p3 = new Point(0, cHeight*13/21);
	  q13 = new RankedQuad(p0, p1, p2, p3, rankConst/13);
  } else { // Lower left
	  let p0 = new Point(0, cHeight*8/21);
	  let p1 = new Point(canvasMin*13/34, cHeight*8/21);
	  let p2 = new Point(canvasMin*13/34, cHeight);
	  let p3 = new Point(0, cHeight);
	  q13 = new RankedQuad(p0, p1, p2, p3, rankConst/13);
  }
  
  // Quad 8
  if (quadConfig == 0) { // Lower right
	  let p0 = new Point(canvasMin*26/34, cHeight*13/21);
	  let p1 = new Point(canvasMin, cHeight*13/21);
	  let p2 = new Point(canvasMin, cHeight);
	  let p3 = new Point(canvasMin*26/34, cHeight);
	  q8 = new RankedQuad(p0, p1, p2, p3, rankConst/8);
  } else if (quadConfig == 1) { // Upper right
	  let p0 = new Point(canvasMin*26/34, 0);
	  let p1 = new Point(canvasMin, 0);
	  let p2 = new Point(canvasMin, cHeight*8/21);
	  let p3 = new Point(canvasMin*26/34, cHeight*8/21);
	  q8 = new RankedQuad(p0, p1, p2, p3, rankConst/8);
  } else if (quadConfig == 2) { // Lower left
	  let p0 = new Point(0, cHeight*13/21);
	  let p1 = new Point(canvasMin*8/34, cHeight*13/21);
	  let p2 = new Point(canvasMin*8/34, cHeight);
	  let p3 = new Point(0, cHeight);
	  q8 = new RankedQuad(p0, p1, p2, p3, rankConst/8);
  } else { // Upper left
	  let p0 = new Point(0, 0);
	  let p1 = new Point(canvasMin*8/34, 0);
	  let p2 = new Point(canvasMin*8/34, cHeight*8/21);
	  let p3 = new Point(0, cHeight*8/21);
	  q8 = new RankedQuad(p0, p1, p2, p3, rankConst/8);
  }
  
  // Quad 5
  if (quadConfig == 0) { // Lower right
	  let p0 = new Point(cHeight, cHeight*16/21);
	  let p1 = new Point(canvasMin*26/34, cHeight*16/21);
	  let p2 = new Point(canvasMin*26/34, cHeight);
	  let p3 = new Point(cHeight, cHeight);
	  q5 = new RankedQuad(p0, p1, p2, p3, rankConst/5);
  } else if (quadConfig == 1) { // Upper right
	  let p0 = new Point(cHeight, 0);
	  let p1 = new Point(canvasMin*26/34, 0);
	  let p2 = new Point(canvasMin*26/34, cHeight*5/21);
	  let p3 = new Point(cHeight, cHeight*5/21);
	  q5 = new RankedQuad(p0, p1, p2, p3, rankConst/5);
  } else if (quadConfig == 2) { // Lower left
	  let p0 = new Point(canvasMin*8/34, cHeight*16/21);
	  let p1 = new Point(canvasMin*13/34, cHeight*16/21);
	  let p2 = new Point(canvasMin*13/34, cHeight);
	  let p3 = new Point(canvasMin*8/34, cHeight);
	  q5 = new RankedQuad(p0, p1, p2, p3, rankConst/5);
  } else { // Upper left
	  let p0 = new Point(canvasMin*8/34, 0);
	  let p1 = new Point(canvasMin*13/34, 0);
	  let p2 = new Point(canvasMin*13/34, cHeight*5/21);
	  let p3 = new Point(canvasMin*8/34, cHeight*5/21);
	  q5 = new RankedQuad(p0, p1, p2, p3, rankConst/5);
  }
  
  // Quad 3
  if (quadConfig == 0) { // Lower right
	  let p0 = new Point(cHeight, cHeight*13/21);
	  let p1 = new Point(canvasMin*24/34, cHeight*13/21);
	  let p2 = new Point(canvasMin*24/34, cHeight*16/21);
	  let p3 = new Point(cHeight, cHeight*16/21);
	  q3 = new RankedQuad(p0, p1, p2, p3, rankConst/3);
  } else if (quadConfig == 1) { // Upper right
	  let p0 = new Point(cHeight, cHeight*5/21);
	  let p1 = new Point(canvasMin*24/34, cHeight*5/21);
	  let p2 = new Point(canvasMin*24/34, cHeight*8/21);
	  let p3 = new Point(cHeight, cHeight*8/21);
	  q3 = new RankedQuad(p0, p1, p2, p3, rankConst/3);
  } else if (quadConfig == 2) { // Lower left
	  let p0 = new Point(canvasMin*10/34, cHeight*13/21);
	  let p1 = new Point(canvasMin*13/34, cHeight*13/21);
	  let p2 = new Point(canvasMin*13/34, cHeight*16/21);
	  let p3 = new Point(canvasMin*10/34, cHeight*16/21);
	  q3 = new RankedQuad(p0, p1, p2, p3, rankConst/3);
  } else { // Upper left
	  let p0 = new Point(canvasMin*10/34, cHeight*5/21);
	  let p1 = new Point(canvasMin*13/34, cHeight*5/21);
	  let p2 = new Point(canvasMin*13/34, cHeight*8/21);
	  let p3 = new Point(canvasMin*10/34, cHeight*8/21);
	  q3 = new RankedQuad(p0, p1, p2, p3, rankConst/3);
  }
  
  // Quad 2
  if (quadConfig == 0) { // Lower right
	  let p0 = new Point(canvasMin*24/34, cHeight*13/21);
	  let p1 = new Point(canvasMin*26/34, cHeight*13/21);
	  let p2 = new Point(canvasMin*26/34, cHeight*15/21);
	  let p3 = new Point(canvasMin*24/34, cHeight*15/21);
	  q2 = new RankedQuad(p0, p1, p2, p3, rankConst/2);
  } else if (quadConfig == 1) { // Upper right
	  let p0 = new Point(canvasMin*24/34, cHeight*6/21);
	  let p1 = new Point(canvasMin*26/34, cHeight*6/21);
	  let p2 = new Point(canvasMin*26/34, cHeight*8/21);
	  let p3 = new Point(canvasMin*24/34, cHeight*8/21);
	  q2 = new RankedQuad(p0, p1, p2, p3, rankConst/2);
  } else if (quadConfig == 2) { // Lower left
	  let p0 = new Point(canvasMin*8/34, cHeight*13/21);
	  let p1 = new Point(canvasMin*10/34, cHeight*13/21);
	  let p2 = new Point(canvasMin*10/34, cHeight*15/21);
	  let p3 = new Point(canvasMin*8/34, cHeight*15/21);
	  q2 = new RankedQuad(p0, p1, p2, p3, rankConst/2);
  } else { // Upper left
	  let p0 = new Point(canvasMin*8/34, cHeight*6/21);
	  let p1 = new Point(canvasMin*10/34, cHeight*6/21);
	  let p2 = new Point(canvasMin*10/34, cHeight*8/21);
	  let p3 = new Point(canvasMin*8/34, cHeight*8/21);
	  q2 = new RankedQuad(p0, p1, p2, p3, rankConst/2);
  }
  
  // Quad 1A
  if (quadConfig == 0) { // Lower right
	  let p0 = new Point(canvasMin*25/34, cHeight*15/21);
	  let p1 = new Point(canvasMin*26/34, cHeight*15/21);
	  let p2 = new Point(canvasMin*26/34, cHeight*16/21);
	  let p3 = new Point(canvasMin*25/34, cHeight*16/21);
	  q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
  } else if (quadConfig == 1) { // Upper right
	  let p0 = new Point(canvasMin*25/34, cHeight*5/21);
	  let p1 = new Point(canvasMin*26/34, cHeight*5/21);
	  let p2 = new Point(canvasMin*26/34, cHeight*6/21);
	  let p3 = new Point(canvasMin*25/34, cHeight*6/21);
	  q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
  } else if (quadConfig == 2) { // Lower left
	  let p0 = new Point(canvasMin*8/34, cHeight*15/21);
	  let p1 = new Point(canvasMin*9/34, cHeight*15/21);
	  let p2 = new Point(canvasMin*9/34, cHeight*16/21);
	  let p3 = new Point(canvasMin*8/34, cHeight*16/21);
	  q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
  } else { // Upper left
	  let p0 = new Point(canvasMin*8/34, cHeight*5/21);
	  let p1 = new Point(canvasMin*9/34, cHeight*5/21);
	  let p2 = new Point(canvasMin*9/34, cHeight*6/21);
	  let p3 = new Point(canvasMin*8/34, cHeight*6/21);
	  q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
  }
  
  // Quad 1B
  if (quadConfig == 0) { // Lower right
	  let p0 = new Point(canvasMin*24/34, cHeight*15/21);
	  let p1 = new Point(canvasMin*25/34, cHeight*15/21);
	  let p2 = new Point(canvasMin*25/34, cHeight*16/21);
	  let p3 = new Point(canvasMin*24/34, cHeight*16/21);
	  q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
  } else if (quadConfig == 1) { // Upper right
	  let p0 = new Point(canvasMin*24/34, cHeight*5/21);
	  let p1 = new Point(canvasMin*25/34, cHeight*5/21);
	  let p2 = new Point(canvasMin*25/34, cHeight*6/21);
	  let p3 = new Point(canvasMin*24/34, cHeight*6/21);
	  q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
  } else if (quadConfig == 2) { // Lower left
	  let p0 = new Point(canvasMin*9/34, cHeight*15/21);
	  let p1 = new Point(canvasMin*10/34, cHeight*15/21);
	  let p2 = new Point(canvasMin*10/34, cHeight*16/21);
	  let p3 = new Point(canvasMin*9/34, cHeight*16/21);
	  q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
  } else { // Upper left
	  let p0 = new Point(canvasMin*9/34, cHeight*5/21);
	  let p1 = new Point(canvasMin*10/34, cHeight*5/21);
	  let p2 = new Point(canvasMin*10/34, cHeight*6/21);
	  let p3 = new Point(canvasMin*9/34, cHeight*6/21);
	  q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
  }
  
  // Collect all the quads.
  let allQuads = new Array(8);
  allQuads[0] = q21;
  allQuads[1] = q13;
  allQuads[2] = q8;
  allQuads[3] = q5;
  allQuads[4] = q3;
  allQuads[5] = q2;
  allQuads[6] = q1A;
  allQuads[7] = q1B;
  
  noStroke();
  let numLines = Math.floor(random(3,4.999999));
  let lines = new Array(numLines);
  for (let l = 0; l < numLines; l++) {
	  let lineLength = 0;
	  while (lineLength < canvasMin/5) {
		let x0 = random(0, canvasMin);
		let y0 = random(0, cHeight);
		let x1 = random(0, canvasMin);
		let y1 = random(0, cHeight);
		lineLength = sqrt(sq(x1 - x0) + sq(y1 - y0));
		let p0 = new Point(x0, y0);
		let p1 = new Point(x1, y1);
		lines[l] = new Line(p0, p1);
	  }
  }
  for (let i = 1; i < selectedCS.length; i++) {
	  let blurAmount = canvasMin * random(0.005, 0.012) * (3.025 - i);
	  let transAmount = 240 - (3 - i) * 50;
	  let selectedColor = selectedCS[i];
	  let maxLightDia = canvasMin * (4 - i) * (0.74 ** i);
	  drawBokehOnLines(selectedColor, allQuads, lines, blurAmount, maxLightDia, transAmount);
  }
  
  // Get the pixels from the canvas
  loadPixels();
  
  // Create the layer for the rain drops
  let drops = createGraphics(canvasMin, cHeight);
  
  // Draw drop clusters
  //TODO: base the number of clusters off "rain condition" trait
 
  let numClusters = 0;
  if (rainCond == 1) {
	  numClusters = random(1, 2);
  } else if (rainCond == 2) {
	  numClusters = random(3, 4);
  }
  let clusterLines = new Array();
  for (let l = 0; l < numClusters; l++) {
	  let cx = random(0, canvasMin);
	  let cy1 = random(0, cHeight);
	  let cy2 = random(0, cHeight);
	  let p0 = new Point(cx, cy1);
	  let p1 = new Point(cx, cy2);
	  clusterLines = append(clusterLines,(new Line(p0,p1)));
  }
  
  //TODO: experiment with a slight blur for the drops.
  
  let numSmallDrops = random(1000, 2000);
  if (rainCond == 2) {
	  numSmallDrops = random(4000, 6000);
  }
  for (let i = 0; i < numSmallDrops; i++) {
	  
	  // Set a random point
	  let xPixP = random(0, 1) * canvasMin;
	  let yPixP = random(0, 1) * canvasMin;
	  let xPix = Math.round(xPixP);
	  let yPix = Math.round(yPixP);
	  
	  // Check closeness to each line
	  let maxD = canvasMin / random(4, 10);
	  let prob = 0;
	  for (let l = 0; l < clusterLines.length; l++) {
		  let distFromL = getDistanceFromLine(clusterLines[l], new Point(xPixP,yPixP));
		  if (distFromL < maxD) {
			  prob = min(prob + (1 - (distFromL / maxD)), 0.7);
		  }
	  }

	  // Draw the drop if the probability is within a certain range
	  let randomCheck = random(0,1);
	  if (randomCheck < prob) {
	
		  // Draw the drop
		  let dropSize = random(0.001, 0.003) * canvasMin;
		  drops = drawRainDropOnGraphics(new Point(xPix, yPix), dropSize, drops);
	  }
  }
  
  // Draw large drops
  // TODO: base number of drops on "rain condition" trait
  
  let numDrops = random(25, 75);
  if (rainCond == 1) {
	  numDrops = random(100, 150);
  } else if (rainCond == 2) {
	  numDrops = random(200, 250);
  }
  for (let nd = 0; nd < numDrops; nd++) {
	  let dropPoint = new Point(random(0, canvasMin), random(0, cHeight));
	  drops = drawRainDropOnGraphics(dropPoint, random(0.002, 0.007)*canvasMin, drops);
  }
  drops.filter(BLUR,canvasMin/4000);
  image(drops, 0, 0);
  
  
  
  //fxpreview();
}

keyTyped = function() {
  let resize = 1000;
  let r = false;
  if (key == 's' || key == 'S') {
	  const now = new Date();
	  const year = now.getFullYear();
	  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	  const day = String(now.getDate()).padStart(2, '0');
	  const hours = String(now.getHours()).padStart(2, '0');
	  const minutes = String(now.getMinutes()).padStart(2, '0');
	  const seconds = String(now.getSeconds()).padStart(2, '0');
	  const customFormattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	  saveCanvas('Simple Orbits - ' + customFormattedDateTime, 'png')
  } else if(key == '2' ) {
      resize = 2000;
	  r = true;
  } else if(key == '3' ) {
      resize = 3000;
	  r = true;
  } else if(key == '4' ) {
      resize = 4000;
	  r = true;
  } else if(key == '5' ) {
      resize = 5000;
	  r = true;
  } else if(key == '1' ) {
      resize = 1000;
	  r = true;
  } else if(key == '0') {
	  resize = Math.floor(innerWidth);
	  r = true;
  }
  
  canvasMin = resize;
  
  if (r) {
	  // Reset global variable arrays and other values
	  cHeight = Math.floor(canvasMin*21/34);
	  if (key == '0' && cHeight > innerHeight) {
		  cHeight = Math.floor(innerHeight);
		  canvasMin = Math.floor(34/21 * cHeight);
	  }
	  resizeCanvas(canvasMin, cHeight);
  }
}

function windowResized() {
  // Reset global variable arrays and other values
  canvasMin = Math.floor(innerWidth);
  cHeight = Math.floor(canvasMin*21/34);
  if (cHeight > innerHeight) {
	  canvasMin = Math.floor(innerHeight * 34/21);
	  cHeight = Math.floor(innerHeight);
  }
  resizeCanvas(canvasMin, canvasMin*21/34);
}