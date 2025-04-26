class Point { 
	constructor(x, y) { 
		this.x = x; 
		this.y = y; 
	} 
} 

class Line { 
	constructor(p1, p2) { 
		this.p1 = p1; 
		this.p2 = p2; 
	} 
}

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
var colorSets; 
var colorSetIndex;
var colorSetNames;
var cName;
var colorOrder;
var colorOrderProb;
var bgTypeLimit;
var rainCond;
var bgType;
var motion;

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

function drawBokehOnLines(c, quads, lines, blurAmount, maxLightDia, transAmount, incMotion) {
	let randomMin = 1200;
	let randomMax = 1400;
	let blurVar = 8;
	let minDiaCoeff = 0.08;
	let maxDiaCoeff = 0.15;
	let minTransCoeff = 0.3;
	let maxTransCoeff = 1;
	let maxMotionDist = 0.05 * canvasMin;
	let motionInc = maxMotionDist/6;
	let iterations = random(randomMin, randomMax);
	let pg = drawingContext;
	for(let i = 0; i < iterations; i++) {
		let px = random(0, canvasMin);
		let py = random(0, cHeight);
		let r = 0;
	    let maxD = canvasMin / 10;
	    let prob = 0;
	    for (let l = 0; l < lines.length; l++) {
			let distFromL = getDistanceFromLine(lines[l], new Point(px,py));
			if (distFromL < maxD) {
				prob = min(prob + (1 - (distFromL / maxD)), 0.7);
			}
		}
		for (let j = 0; j < quads.length; j++) {
			let q = quads[j];
			if (isPointInQuad(new Point(px, py), q)) {
				r = q.rank;
			}
		}
		let randomCheck = random(0, 1);
		if (randomCheck < prob * r) {
			let blurAmount2 = blurAmount * random(blurVar / 100, blurVar);
			let transColor = setRandomTrans(c, minTransCoeff * transAmount, maxTransCoeff * transAmount);
			fill(transColor);
			if (!motion || random(0,1) < 0.5) {
				pg.filter = 'blur(' + blurAmount2 + 'px)';
				circle(px, py, random(minDiaCoeff, maxDiaCoeff) * maxLightDia);
			} else if (incMotion) {
				blurAmount2 = blurAmount * blurVar;
				pg.filter = 'blur(' + blurAmount2 + 'px)';
				let motionDist = random(maxMotionDist / 5, maxMotionDist);
				let eDim = 0;
				let eAngle = random(0, PI / 2);
				let eQuad = Math.floor(random(0, 4.999999));
				let eCP = new Point(px, py);
				let cDim = random(minDiaCoeff, maxDiaCoeff);
				for (k = 0; k < motionDist/motionInc; k++) {
					let ePoint = getPointOnEllipse(eCP, eDim, eDim, eAngle, eQuad);
					circle(ePoint.x, ePoint.y, cDim * maxLightDia);
					eDim = eDim + motionInc; 
				}
			}
			pg.filter = 'none';
		}
	}
 }

function drawRainDropOnGraphics(p, d, g) {
	let rdDia = d;
    let rdPx = p.x;
    let rdPy = p.y;
	let plotD = canvasMin / 500;
    let numPoints = 2 * PI * rdDia / 2;
    g.noStroke();
    let layerDiff0x = rdPx / (rdDia * (rdDia + 1) / 2);
    let layerDiff0y = rdPy / (rdDia * (rdDia + 1) / 2);
    let layerDiffxMax = (canvasMin - rdPx) / (rdDia * (rdDia + 1) /2 );
    let layerDiffyMax = (cHeight - rdPy) / (rdDia * (rdDia + 1) /2 );
    let w0 = layerDiff0x;
    let h0 = layerDiff0y;
    let wMax = layerDiffxMax;
    let hMax = layerDiffyMax;
    let pixDensity = pixelDensity();
    for (let d = 0; d <= rdDia; d++) {
		for (let i = 0; i < 4; i++) {
			let angle = 0;
			for (let j = 0; j < Math.floor(numPoints / 4) + 2; j++) {
				if (i == 0) {
					let p = getPointOnEllipse(new Point(rdPx, rdPy), w0, hMax, angle, i);
					let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
					let rVal = pixels[index];
					let gVal = pixels[index + 1];
					let bVal = pixels[index + 2];
					g.fill(rVal, gVal, bVal);
					drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i + 1, g);
					angle = angle + (PI / 2) / (numPoints / 4);
				} else if (i == 1) {
					let p = getPointOnEllipse(new Point(rdPx, rdPy), wMax, h0, angle, i);
					let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
					let rVal = pixels[index];
					let gVal = pixels[index + 1];
					let bVal = pixels[index + 2];
					g.fill(rVal, gVal, bVal);
					drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i - 1, g);
					angle = angle + (PI / 2) / (numPoints / 4);
				} else if (i == 2) {
					let p = getPointOnEllipse(new Point(rdPx, rdPy), w0, h0, angle, i);
					let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
					let rVal = pixels[index];
					let gVal = pixels[index + 1];
					let bVal = pixels[index + 2];
					g.fill(rVal, gVal, bVal);
					drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i + 1, g);
					angle = angle + (PI / 2) / (numPoints / 4);
				} else {
					let p = getPointOnEllipse(new Point(rdPx, rdPy), wMax, hMax, angle, i);
					let index = 4 * ((Math.floor(p.y) * pixDensity * canvasMin * pixDensity) + (Math.floor(p.x) * pixDensity));
					let rVal = pixels[index];
					let gVal = pixels[index + 1];
					let bVal = pixels[index + 2];
					g.fill(rVal, gVal, bVal);
					drawPointOnEllipseWithGraphics(new Point(rdPx, rdPy), d, d, angle, plotD, i - 1, g);
					angle = angle + (PI / 2) / (numPoints / 4);
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

function getDistanceFromLine(line,p) {
	let distance = 0;
	let l12x = line.p1.x - line.p2.x;
	let l12y = line.p1.y - line.p2.y;
	let l1px = p.x - line.p1.x;
	let l1py = p.y - line.p1.y;
	let l2px = p.x - line.p2.x;
	let l2py = p.y - line.p2.y;
	let l12_l1p;
	let l12_l2p;
	l12_l1p = l12x * l1px + l12y * l1py;
	l12_l2p = l12x * l2px + l12y * l2py;
	if (l12_l1p > 0) {
		let y = p.y - line.p1.y;
		let x = p.x - line.p1.x;
		distance = sqrt(x * x + y * y);
	} else if (l12_l2p < 0) {
		let y = p.y - line.p2.y;
		let x = p.x - line.p2.x;
		distance = sqrt(x * x + y * y);
	} else {
		let x1 = l12x;
		let y1 = l12y;
		let x2 = l2px;
		let y2 = l2py;
		let mod = sqrt(x1 * x1 + y1 * y1);
		distance= abs(x1 * y2 - y1 * x2) / mod;
	}
	return distance;
}

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
	let iColors = new Array(4);
	iColors[0] = color(20, 22, 24); // Dark Gray
	iColors[1] = color(80, 86, 90); // Gray
	iColors[2] = color(255, 145, 0); // Orange
	iColors[3] = color(255, 234, 0); // Peach
  
	// Fireflies
	let jColors = new Array(4);
	jColors[0] = color(47, 96, 42); // Dark green
	jColors[1] = color(255, 247, 0); // Yellow
	jColors[2] = color(0, 174, 154); // Blue green
	jColors[3] = color(0); // Black
  
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
	colorSets = append(colorSets, iColors);
	colorSetNames = append(colorSetNames, "Embers");
	colorSets = append(colorSets, jColors);
	colorSetNames = append(colorSetNames, "Fireflies");
}

function setup () {
	seed = int(random() * 999999); // int($fx.rand() * 999999);
	canvasMin = Math.floor(innerWidth);
	cHeight = Math.floor(canvasMin*21/34);
	if (cHeight > innerHeight) {
		canvasMin = Math.floor(innerHeight * 34/21);
		cHeight = Math.floor(innerHeight);
	}
	createCanvas(canvasMin, cHeight);
	frameRate(10);
	noLoop();
}

function draw () {
	randomSeed(seed);
	getColorSets();
	colorSetIndex = Math.floor(random(0, colorSets.length));
	cName = colorSetNames[colorSetIndex];
	colorOrder = random(0, 1);
	let cOrderName = "Normal";
	colorOrderProb = 0.95;
	if (colorOrder < colorOrderProb) {
		cOrderName = "Inverted";
	}
	rainCond = Math.floor(random(0, 3.999999));
	rainCondName = "Drizzle";
	if (rainCond == 1 || rainCond == 2) {
		rainCondName = "Rain";
	} else if (rainCond == 3) {
		rainCondName = "Deluge";
	}
	bgType = random(0, 1);
	bgTypeLimit = 0.9;
	let bgTypeName = "Normal";
	if (bgType > bgTypeLimit) {
		bgTypeName = "Gradient";
	}
	motion = false;
	if (random(0,1) > 0.8) {
		motion = true;
	}
	colorSetIndex = Math.floor(random(0, colorSets.length));
	cName = colorSetNames[colorSetIndex];
	let quadConfig = Math.floor(random(0, 3.999999));
	selectedCS = colorSets[colorSetIndex];
	if (colorOrder < colorOrderProb) {
		selectedCS.sort((a, b) => lightness(a) - lightness(b)); //Normall
	} else {
		selectedCS.sort((a, b) => lightness(b) - lightness(a)); //Inverted
	}
	let baseColor = selectedCS[0];
	let color1 = selectedCS[1];
	let color2 = selectedCS[2];
	let color3 = selectedCS[3];
	background(baseColor);
	let minGradDist = 0.15 * cHeight;
	let maxGradDist = 0.25 * cHeight;
	strokeWeight(2);
	if (bgType > bgTypeLimit) { // TODO: try gradient that goes through all four colors
		let gradStart = Math.floor(random(minGradDist, maxGradDist));
		let gradE1 = gradStart + Math.floor(random(minGradDist, maxGradDist));
		let gradE2 = gradE1 + Math.floor(random(minGradDist, maxGradDist));
		let gradE3 = gradE2 + Math.floor(random(minGradDist, maxGradDist));
		for (y = 0; y < gradStart; y++) {
			stroke(selectedCS[3]);
			line(0, y, canvasMin, y);
		}
		for (let y = gradStart; y < gradE1; y++) {
			const lineColor = lerpColor(selectedCS[3], selectedCS[2], (y - gradStart) / (gradE1 - gradStart));
			stroke(lineColor);
			line(0, y, canvasMin, y);
		}
		for (let y = gradE1; y < gradE2; y++) {
			const lineColor = lerpColor(selectedCS[2], selectedCS[1], (y - gradE1) / (gradE2 - gradE1));
			stroke(lineColor);
			line(0, y, canvasMin, y);
		}
		for (let y = gradE2; y < gradE3; y++) {
			const lineColor = lerpColor(selectedCS[1], selectedCS[0], (y - gradE2) / (gradE3 - gradE2));
			stroke(lineColor);
			line(0, y, canvasMin, y);
		}
		for (y = gradE3; y <= cHeight; y++) {
			stroke(selectedCS[0]);
			line(0, y, canvasMin, y);
		}
	}
	let rankConst = 1;
	let q21 = new RankedQuad(0, 0, 0, 0, 0);
	let q13 = new RankedQuad(0, 0, 0, 0, 0);
	let q8 = new RankedQuad(0, 0, 0, 0, 0);
	let q5 = new RankedQuad(0, 0, 0, 0, 0);
	let q3 = new RankedQuad(0, 0, 0, 0, 0);
	let q2 = new RankedQuad(0, 0, 0, 0, 0);
	let q1A = new RankedQuad(0, 0, 0, 0, 0);
	let q1B = new RankedQuad(0, 0, 0, 0, 0);
	if (quadConfig == 0 || quadConfig == 1) {
		let p0 = new Point(0, 0);
		let p1 = new Point(cHeight, 0);
		let p2 = new Point(cHeight, cHeight);
		let p3 = new Point(0, cHeight);
		q21 = new RankedQuad(p0, p1, p2, p3, rankConst / 21);
	} else {
		let p0 = new Point(canvasMin * 13 / 34, 0);
		let p1 = new Point(canvasMin, 0);
		let p2 = new Point(canvasMin, cHeight);
		let p3 = new Point(canvasMin * 13 / 34, cHeight);
		q21 = new RankedQuad(p0, p1, p2, p3, rankConst / 21);
	}
	if (quadConfig == 0) {
		let p0 = new Point(cHeight, 0);
		let p1 = new Point(canvasMin, 0);
		let p2 = new Point(canvasMin, cHeight * 13 / 21);
		let p3 = new Point(cHeight, cHeight * 13 / 21);
		q13 = new RankedQuad(p0, p1, p2, p3, rankConst / 13);
	} else if (quadConfig == 1) {
		let p0 = new Point(cHeight, cHeight * 8 / 21);
		let p1 = new Point(canvasMin, cHeight * 8 / 21);
		let p2 = new Point(canvasMin, cHeight);
		let p3 = new Point(cHeight, cHeight);
		q13 = new RankedQuad(p0, p1, p2, p3, rankConst / 13);
	} else if (quadConfig == 2) {
		let p0 = new Point(0, 0);
		let p1 = new Point(canvasMin * 13 / 34, 0);
		let p2 = new Point(canvasMin * 13 / 34, cHeight * 13 / 21);
		let p3 = new Point(0, cHeight * 13 / 21);
		q13 = new RankedQuad(p0, p1, p2, p3, rankConst / 13);
	} else {
		let p0 = new Point(0, cHeight * 8 / 21);
		let p1 = new Point(canvasMin * 13 / 34, cHeight * 8 / 21);
		let p2 = new Point(canvasMin * 13 / 34, cHeight);
		let p3 = new Point(0, cHeight);
		q13 = new RankedQuad(p0, p1, p2, p3, rankConst / 13);
	}
	if (quadConfig == 0) {
		let p0 = new Point(canvasMin * 26 / 34, cHeight * 13 / 21);
		let p1 = new Point(canvasMin, cHeight * 13 / 21);
		let p2 = new Point(canvasMin, cHeight);
		let p3 = new Point(canvasMin * 26 / 34, cHeight);
		q8 = new RankedQuad(p0, p1, p2, p3, rankConst / 8);
	} else if (quadConfig == 1) {
		let p0 = new Point(canvasMin * 26 / 34, 0);
		let p1 = new Point(canvasMin, 0);
		let p2 = new Point(canvasMin, cHeight * 8 / 21);
		let p3 = new Point(canvasMin * 26 / 34, cHeight * 8 / 21);
		q8 = new RankedQuad(p0, p1, p2, p3, rankConst / 8);
	} else if (quadConfig == 2) {
		let p0 = new Point(0, cHeight * 13 / 21);
		let p1 = new Point(canvasMin * 8 / 34, cHeight * 13 / 21);
		let p2 = new Point(canvasMin * 8 / 34, cHeight);
		let p3 = new Point(0, cHeight);
		q8 = new RankedQuad(p0, p1, p2, p3, rankConst / 8);
	} else {
		let p0 = new Point(0, 0);
		let p1 = new Point(canvasMin * 8 / 34, 0);
		let p2 = new Point(canvasMin * 8 / 34, cHeight * 8 / 21);
		let p3 = new Point(0, cHeight * 8 / 21);
		q8 = new RankedQuad(p0, p1, p2, p3, rankConst / 8);
	}
	if (quadConfig == 0) {
		let p0 = new Point(cHeight, cHeight * 16 / 21);
		let p1 = new Point(canvasMin * 26 / 34, cHeight * 16 / 21);
		let p2 = new Point(canvasMin * 26 / 34, cHeight);
		let p3 = new Point(cHeight, cHeight);
		q5 = new RankedQuad(p0, p1, p2, p3, rankConst / 5);
	} else if (quadConfig == 1) {
		let p0 = new Point(cHeight, 0);
		let p1 = new Point(canvasMin * 26 / 34, 0);
		let p2 = new Point(canvasMin * 26 / 34, cHeight * 5 / 21);
		let p3 = new Point(cHeight, cHeight * 5 / 21);
		q5 = new RankedQuad(p0, p1, p2, p3, rankConst / 5);
	} else if (quadConfig == 2) {
		let p0 = new Point(canvasMin * 8 / 34, cHeight * 16 / 21);
		let p1 = new Point(canvasMin * 13 / 34, cHeight * 16 / 21);
		let p2 = new Point(canvasMin * 13 / 34, cHeight);
		let p3 = new Point(canvasMin * 8 / 34, cHeight);
		q5 = new RankedQuad(p0, p1, p2, p3, rankConst / 5);
	} else { // Upper left
		let p0 = new Point(canvasMin * 8 / 34, 0);
		let p1 = new Point(canvasMin * 13 / 34, 0);
		let p2 = new Point(canvasMin * 13 / 34, cHeight * 5 / 21);
		let p3 = new Point(canvasMin * 8 / 34, cHeight * 5 / 21);
		q5 = new RankedQuad(p0, p1, p2, p3, rankConst / 5);
	}
	if (quadConfig == 0) {
		let p0 = new Point(cHeight, cHeight * 13 / 21);
		let p1 = new Point(canvasMin * 24 / 34, cHeight * 13 / 21);
		let p2 = new Point(canvasMin * 24 / 34, cHeight * 16 / 21);
		let p3 = new Point(cHeight, cHeight * 16 / 21);
		q3 = new RankedQuad(p0, p1, p2, p3, rankConst / 3);
	} else if (quadConfig == 1) {
		let p0 = new Point(cHeight, cHeight * 5 / 21);
		let p1 = new Point(canvasMin * 24 / 34, cHeight * 5 / 21);
		let p2 = new Point(canvasMin * 24 / 34, cHeight * 8 / 21);
		let p3 = new Point(cHeight, cHeight * 8 / 21);
		q3 = new RankedQuad(p0, p1, p2, p3, rankConst / 3);
	} else if (quadConfig == 2) {
		let p0 = new Point(canvasMin * 10 / 34, cHeight * 13 / 21);
		let p1 = new Point(canvasMin * 13 / 34, cHeight * 13 / 21);
		let p2 = new Point(canvasMin * 13 / 34, cHeight * 16 / 21);
		let p3 = new Point(canvasMin * 10 / 34, cHeight * 16 / 21);
		q3 = new RankedQuad(p0, p1, p2, p3, rankConst / 3);
	} else {
		let p0 = new Point(canvasMin * 10 / 34, cHeight * 5 / 21);
		let p1 = new Point(canvasMin * 13 / 34, cHeight * 5 / 21);
		let p2 = new Point(canvasMin * 13 / 34, cHeight * 8 / 21);
		let p3 = new Point(canvasMin * 10 / 34, cHeight * 8 / 21);
		q3 = new RankedQuad(p0, p1, p2, p3, rankConst / 3);
	}
	if (quadConfig == 0) {
		let p0 = new Point(canvasMin * 24 / 34, cHeight * 13 / 21);
		let p1 = new Point(canvasMin * 26 / 34, cHeight * 13 / 21);
		let p2 = new Point(canvasMin * 26 / 34, cHeight * 15 / 21);
		let p3 = new Point(canvasMin * 24 / 34, cHeight * 15 / 21);
		q2 = new RankedQuad(p0, p1, p2, p3, rankConst / 2);
	} else if (quadConfig == 1) {
		let p0 = new Point(canvasMin * 24 / 34, cHeight * 6 / 21);
		let p1 = new Point(canvasMin * 26 / 34, cHeight * 6 / 21);
		let p2 = new Point(canvasMin * 26 / 34, cHeight * 8 / 21);
		let p3 = new Point(canvasMin * 24 / 34, cHeight * 8 / 21);
		q2 = new RankedQuad(p0, p1, p2, p3, rankConst / 2);
	} else if (quadConfig == 2) {
		let p0 = new Point(canvasMin * 8 / 34, cHeight * 13 / 21);
		let p1 = new Point(canvasMin * 10 / 34, cHeight * 13 / 21);
		let p2 = new Point(canvasMin * 10 / 34, cHeight * 15 / 21);
		let p3 = new Point(canvasMin * 8 / 34, cHeight * 15 / 21);
		q2 = new RankedQuad(p0, p1, p2, p3, rankConst / 2);
	} else {
		let p0 = new Point(canvasMin * 8 / 34, cHeight * 6 / 21);
		let p1 = new Point(canvasMin * 10 / 34, cHeight * 6 / 21);
		let p2 = new Point(canvasMin * 10 / 34, cHeight * 8 / 21);
		let p3 = new Point(canvasMin * 8 / 34, cHeight * 8 / 21);
		q2 = new RankedQuad(p0, p1, p2, p3, rankConst / 2);
	}
	if (quadConfig == 0) {
		let p0 = new Point(canvasMin * 25 / 34, cHeight * 15 / 21);
		let p1 = new Point(canvasMin * 26 / 34, cHeight * 15 / 21);
		let p2 = new Point(canvasMin * 26 / 34, cHeight * 16 / 21);
		let p3 = new Point(canvasMin * 25 / 34, cHeight * 16 / 21);
		q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
	} else if (quadConfig == 1) {
		let p0 = new Point(canvasMin * 25 / 34, cHeight * 5 / 21);
		let p1 = new Point(canvasMin * 26 / 34, cHeight * 5 / 21);
		let p2 = new Point(canvasMin * 26 / 34, cHeight * 6 / 21);
		let p3 = new Point(canvasMin * 25 / 34, cHeight * 6 / 21);
		q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
	} else if (quadConfig == 2) {
		let p0 = new Point(canvasMin * 8 / 34, cHeight * 15 / 21);
		let p1 = new Point(canvasMin * 9 / 34, cHeight * 15 / 21);
		let p2 = new Point(canvasMin * 9 / 34, cHeight * 16 / 21);
		let p3 = new Point(canvasMin * 8 / 34, cHeight * 16 / 21);
		q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
	} else {
		let p0 = new Point(canvasMin * 8 / 34, cHeight * 5 / 21);
		let p1 = new Point(canvasMin * 9 / 34, cHeight * 5 / 21);
		let p2 = new Point(canvasMin * 9 / 34, cHeight * 6 / 21);
		let p3 = new Point(canvasMin * 8 / 34, cHeight * 6 / 21);
		q1A = new RankedQuad(p0, p1, p2, p3, rankConst);
	}
	if (quadConfig == 0) {
		let p0 = new Point(canvasMin * 24 / 34, cHeight * 15 / 21);
		let p1 = new Point(canvasMin * 25 / 34, cHeight * 15 / 21);
		let p2 = new Point(canvasMin * 25 / 34, cHeight * 16 / 21);
		let p3 = new Point(canvasMin * 24 / 34, cHeight * 16 / 21);
		q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
	} else if (quadConfig == 1) {
		let p0 = new Point(canvasMin * 24 / 34, cHeight * 5 / 21);
		let p1 = new Point(canvasMin * 25 / 34, cHeight * 5 / 21);
		let p2 = new Point(canvasMin * 25 / 34, cHeight * 6 / 21);
		let p3 = new Point(canvasMin * 24 / 34, cHeight * 6 / 21);
		q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
	} else if (quadConfig == 2) {
		let p0 = new Point(canvasMin * 9 / 34, cHeight * 15 / 21);
		let p1 = new Point(canvasMin * 10 / 34, cHeight * 15 / 21);
		let p2 = new Point(canvasMin * 10 / 34, cHeight * 16 / 21);
		let p3 = new Point(canvasMin * 9 / 34, cHeight * 16 / 21);
		q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
	} else {
		let p0 = new Point(canvasMin * 9/34, cHeight * 5 / 21);
		let p1 = new Point(canvasMin * 10 / 34, cHeight * 5 / 21);
		let p2 = new Point(canvasMin * 10 / 34, cHeight * 6 / 21);
		let p3 = new Point(canvasMin * 9 / 34, cHeight * 6 / 21);
		q1B = new RankedQuad(p0, p1, p2, p3, rankConst);
	}
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
	let numLines = Math.floor(random(3, 4.999999));
	let lines = new Array(numLines);
	for (let l = 0; l < numLines; l++) {
		let lineLength = 0;
		while (lineLength < canvasMin / 5) {
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
		let blurAmount = canvasMin * random(0.01, 0.012) * (3.03 - i);
		let transAmount = 240 - (3 - i) * 50;
		let selectedColor = selectedCS[i];
		let maxLightDia = canvasMin * (4 - i) * (0.74 ** i);
		let includeMotion = false;
		if (i == 3) {
			includeMotion = true;
		}
		drawBokehOnLines(selectedColor, allQuads, lines, blurAmount, maxLightDia, transAmount, includeMotion);
	}
  
	loadPixels();
	let drops = createGraphics(canvasMin, cHeight);
	let numClusters = 0;
	if (rainCond == 1 || rainCond == 2) {
		numClusters = random(1, 2);
	} else if (rainCond == 3) {
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
	let numSmallDrops = random(4000, 5000);
	if (rainCond == 3) {
		numSmallDrops = random(6000, 8000);
	}
	if (clusterLines.length > 0) {
		for (let i = 0; i < numSmallDrops; i++) {
			let xPixP = random(0, 1) * canvasMin;
			let yPixP = random(0, 1) * canvasMin;
			let xPix = Math.round(xPixP);
			let yPix = Math.round(yPixP);
			let maxD = canvasMin / random(4, 10);
			let prob = 0;
			for (let l = 0; l < clusterLines.length; l++) {
				let distFromL = getDistanceFromLine(clusterLines[l], new Point(xPixP,yPixP));
				if (distFromL < maxD) {
					prob = min(prob + (1 - (distFromL / maxD)), 0.7);
				}
			}
			let randomCheck = random(0,1);
			if (randomCheck < prob) {
				let dropSize = random(0.001, 0.003) * canvasMin;
				drops = drawRainDropOnGraphics(new Point(xPix, yPix), dropSize, drops);
			}
		}
	}
	let numDrops = random(60, 100);
	if (rainCond == 1 || rainCond == 2) {
		numDrops = random(140, 200);
	} else if (rainCond == 3) {
		numDrops = random(240, 300);
	}
	for (let nd = 0; nd < numDrops; nd++) {
		let dropPoint = new Point(random(0, canvasMin), random(0, cHeight));
		drops = drawRainDropOnGraphics(dropPoint, random(0.003, 0.007) * canvasMin, drops);
	}
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
		saveCanvas('Bokeh Rain - ' + customFormattedDateTime, 'png')
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
		cHeight = Math.floor(canvasMin*21/34);
		if (key == '0' && cHeight > innerHeight) {
			cHeight = Math.floor(innerHeight);
			canvasMin = Math.floor(34/21 * cHeight);
		}
		resizeCanvas(canvasMin, cHeight);
	}
}

function windowResized() {
	canvasMin = Math.floor(innerWidth);
	cHeight = Math.floor(canvasMin * 21 / 34);
	if (cHeight > innerHeight) {
		canvasMin = Math.floor(innerHeight * 34 / 21);
		cHeight = Math.floor(innerHeight);
	}
	resizeCanvas(canvasMin, canvasMin * 21 / 34);
}