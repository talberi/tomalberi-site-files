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

function drawRotatedEllipse(centerPoint, w, h, a) {
	translate(centerPoint.x, centerPoint.y);
	rotate(a);
	ellipse(0, 0, w, h);
	rotate(-a);
	translate(-centerPoint.x, -centerPoint.y);
}

function drawPointOnEllipse(centerPoint, w, h, t, d, quadSelect, a) {
    translate(centerPoint.x, centerPoint.y);
	rotate(a);
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
    circle(x, y, d);
	rotate(-a);
	translate(-centerPoint.x, -centerPoint.y);
}

// Set curated color pallets
function getColorSets() {
  // Speed
  let sColors = new Array(4);
  sColors[0] = color(196, 216, 226); // Blue
  sColors[1] = color(255, 102, 0); // Orange
  sColors[2] = color(28, 28, 56); // Dark Blue
  sColors[3] = color(255); // White
  
  // Aqua muted
  let amColors = new Array(4);
  amColors[0] = color(216, 233, 239); // Light grey
  amColors[1] = color(122, 167, 179); // Turquoise
  amColors[2] = color(41, 94, 117); // Dull blue
  amColors[3] = color(135, 207, 130); // Light green
  
  // Earth
  let eColors = new Array(4);
  eColors[0] = color(243, 234, 215); // Tan
  eColors[1] = color(74, 159, 126); // Green
  eColors[2] = color(239, 168, 0); // Orange
  eColors[3] = color(64, 87, 98); // Dark blue
  
  // Twilight
  let tlColors = new Array(4);
  tlColors[0] = color(34, 28, 85); // Dark blue
  tlColors[1] = color(175, 59, 194); // Purple
  tlColors[2] = color(255, 165, 225); // Pink
  tlColors[3] = color(255, 104, 104); // Light red
  
  // Shadow Break
  let sbColors = new Array(4);
  sbColors[0] = color(0); // Black
  sbColors[1] = color(153, 195, 234); // Light blue
  sbColors[2] = color(255, 254, 225); // Yellow
  sbColors[3] = color(52, 116, 161); // Dull blue
  
  // Fog
  let fColors = new Array(4);
  fColors[0] = color(58, 75, 79); // Gray
  fColors[1] = color(108, 154, 160); // Medium gray
  fColors[2] = color(190, 223, 230); // Teal
  fColors[3] = color(252, 245, 233); // Off white
  
  // Hard Contrast
  let hcColors = new Array(4);
  hcColors[0] = color(0); // Black
  hcColors[1] = color(255); // White
  hcColors[2] = color(180); // Gray
  hcColors[3] = color(255, 0, 0); // Red
  
  // Out West
  let owColors = new Array(4);
  owColors[0] = color(84, 66, 66); // Dark red
  owColors[1] = color(184, 108, 77); // Terra cotta
  owColors[2] = color(93, 117, 122); // Gray
  owColors[3] = color(179, 215, 220); // Turqoise
  
  // Morning Haze
  let mhColors = new Array(4);
  mhColors[0] = color(255, 230, 247); // Pink
  mhColors[1] = color(142, 193, 239); // Light blue
  mhColors[2] = color(234, 194, 207); // Magenta
  mhColors[3] = color(74, 63, 60); // Warm dark gray
  
  // Opulence
  let opColors = new Array(4);
  opColors[0] = color(47, 96, 42); // Dark green
  opColors[1] = color(255, 247, 0); // Gold
  opColors[2] = color(116, 222, 232); // Silver
  opColors[3] = color(0); // Black
  
  // Aggregate all color sets
  colorSets = new Array();
  colorSetNames = new Array();
  colorSets = append(colorSets, sColors);
  colorSetNames = append(colorSetNames, "Speed");
  colorSets = append(colorSets, amColors);
  colorSetNames = append(colorSetNames, "Aqua");
  colorSets = append(colorSets, eColors);
  colorSetNames = append(colorSetNames, "Earth");
  colorSets = append(colorSets, tlColors);
  colorSetNames = append(colorSetNames, "Twilight");
  colorSets = append(colorSets, sbColors);
  colorSetNames = append(colorSetNames, "Shadow Break");
  colorSets = append(colorSets, fColors);
  colorSetNames = append(colorSetNames, "Fog");
  colorSets = append(colorSets, hcColors);
  colorSetNames = append(colorSetNames, "Hard Contrast");
  colorSets = append(colorSets, owColors);
  colorSetNames = append(colorSetNames, "Out West");
  colorSets = append(colorSets, mhColors);
  colorSetNames = append(colorSetNames, "Morning Haze");
  colorSets = append(colorSets, opColors);
  colorSetNames = append(colorSetNames, "Opulence");
}

function setup ( ) {
  seed = int(random() * 999999);
  randomSeed(seed);
  canvasMin = windowWidth;
  cHeight = canvasMin*21/34;
  if (cHeight > windowHeight) {
	  canvasMin = windowHeight * 34/21;
	  cHeight = windowHeight;
  }
  var canvas = createCanvas(canvasMin, cHeight);
  numOrbits = Math.floor(random(1, 5.999999)); // Make minimum number of orbits a parameter between 0 and 4?
  getColorSets();
  colorSetIndex = Math.floor(random(0, colorSets.length));
  cName = colorSetNames[colorSetIndex];
  frameRate(10);
  noLoop();
}

function draw ( ) {
  randomSeed(seed);
  let quadConfig = Math.floor(random(0, 3.999999));
  
  // Choose color set
  selectedCS = colorSets[colorSetIndex];
  
  // Set colors
  let selectedColors = new Array();
  for (let i = 0; i < 4; i++) {
    let index = Math.floor(random(0, 3.9));
    while (selectedColors.includes(index)) {
      index = Math.floor(random(0, 3.9));
    }
    selectedColors = append(selectedColors, index);
  }
  let baseColor = selectedCS[selectedColors[0]];
  let pColor = selectedCS[selectedColors[1]];
  let orbitColor = selectedCS[selectedColors[2]];
  let satColor = selectedCS[selectedColors[3]];
  background(baseColor);
  
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
  
  // Pic the center point
  let margin = 0.3
  let cp = new Point(0, 0)
  let bestRank = 0;
  for (let i = 0; i < 100; i++) {
	  let cpx = random(canvasMin*margin, canvasMin*(1 - margin));
	  let cpy = random(cHeight*margin, cHeight*(1 - margin));
	  for (let j = 0; j < allQuads.length; j++) {
		  let q = allQuads[j];
		  if (isPointInQuad(new Point(cpx, cpy), q)) {
			  let r = q.rank;
			  if (r >= bestRank) {
				  bestRank = r;
				  cp = new Point(cpx, cpy);
			  }
		  }
	  }
  }
  
  // Set the central mass diameter
  let pDia = random(canvasMin*0.05, canvasMin*0.09);
  
  // Draw ellipses
  let minRatio = 0.2
  let maxdx = canvasMin*0.15;
  let maxdy = cHeight*0.15;
  let eMargin = canvasMin*0.2;
  for (let i = 0; i < numOrbits; i++) { // Number of ellipses
	  let stop = false;
	  let p = new Point(0, 0);
	  let dx = 0;
	  while(!stop) {
		let px = random(canvasMin*margin, canvasMin*(1 - margin));
		let py = random(cHeight*margin, cHeight*(1 - margin));
		dx = sqrt(sq(cp.x - px) + sq(cp.y - py));
		if (abs(cp.x - px) < maxdx && abs(cp.y - py) < maxdy) {
			p = new Point(px, py);
			stop = true;
		}
	  }
	  let angle = Math.atan((cp.y - p.y)/(cp.x - p.x));
	  eMargin = canvasMin*random(0.08, 0.2);
	  let w = 2*(eMargin + dx);
	  let h = max(w * ((-1/(canvasMin/6))*dx + 1), pDia*1.5);
	  let sw = (canvasMin*h/w)/180;
      noFill();
	  stroke(orbitColor);
	  strokeWeight(sw);
	  drawRotatedEllipse(p, w, h, angle);
	  noStroke();
	  fill(color(150));
	  let t = random(0, 2/PI);
	  let qa = Math.floor(random(0, 2.999999));
	  fill(satColor);
	  drawPointOnEllipse(p, w/2, h/2, t, sw*6, qa, angle);
  }
  
  // Draw the central mass
  fill(pColor);
  noStroke();
  circle(cp.x, cp.y, pDia);
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
  }
  
  canvasMin = resize;
  
  if (r) {
	  // Reset global variable arrays and other values
	  cHeight = canvasMin*21/34;
	  resizeCanvas(canvasMin, canvasMin*21/34);
  }
}

function windowResized() {
  // Reset global variable arrays and other values
  canvasMin = windowWidth;
  cHeight = canvasMin*21/34;
  if (cHeight > windowHeight) {
	  canvasMin = windowHeight * 34/21;
	  cHeight = windowHeight;
  }
  resizeCanvas(canvasMin, canvasMin*21/34);
}
