class ArrayList extends Array {
    constructor() {super(...[]);}
    size() {return this.length;}
    add(x) {this.push(x);}
    get(i) {return this[i];}
    remove(i) {this.splice(i,1);}
}

 // Variable initialization
var turns = 0; 
var avgAngle; 
var trees;
var numberStands;
var turnAngles = new Array( ); 
var otPoints = new ArrayList();
var colorSets; 
var colorSetIndex;
var colorSetNames;
var cName;
var circleCandidates = new ArrayList(); 
var turnList = new ArrayList(); 
var allStandIndices = new Array(); 
var pitPointIndex0 = 0; 
var pitPointIndex1 = 1;
var pd = 1;
var canvasMin;
var seed;

// Class for defining a point.
class Point { 
  constructor( x , y ) { 
    this.x = x; 
    this.y = y; 
  } 
} 

// Class for line
class Line { 
  constructor( p1 , p2 ) { 
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
  constructor( p0 , p1 , p2 , p3 ) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3; 
  } 
}

// Set curated color pallets
function getColorSets() {
  // Gulf Racing
  let grColors = new Array(4);
  grColors[0] = color(196, 216, 226); // Blue
  grColors[1] = color(255, 102, 0); // Orange
  grColors[2] = color(28, 28, 56); // Dark Blue
  grColors[3] = color(255); // White
  
  // Scuderia Ferrari
  let sfColors = new Array(4);
  sfColors[0] = color(239, 26, 45); // Red
  sfColors[1] = color(255, 242, 0); // Yellow
  sfColors[2] = color(255); // White
  sfColors[3] = color(0); // Black
  
  // Red Bull Oracle Racing
  let rborColors = new Array(4);
  rborColors[0] = color(227, 1, 24); // Red
  rborColors[1] = color(253, 217, 0); // Yellow
  rborColors[2] = color(192, 191, 191); // Silver
  rborColors[3] = color(1, 28, 49); // Dark Blue
  
  // Mercedes AMG Petronas
  let mapColors = new Array(4);
  mapColors[0] = color(0); // Black
  mapColors[1] = color(200, 204, 206); // Silver
  mapColors[2] = color(86, 95, 100); // Gray
  mapColors[3] = color(0, 161, 155); // Green
  
  // McLaren
  let mColors = new Array(4);
  mColors[0] = color(0); // Black
  mColors[1] = color(255, 151, 0); // Orange
  mColors[2] = color(255); // White
  mColors[3] = color(0, 96, 219); // Blue
  
  // Marlboro
  let mbColors = new Array(4);
  mbColors[0] = color(239, 26, 45); // Red
  mbColors[1] = color(70); // Drak Gray
  mbColors[2] = color(255); // White
  mbColors[3] = color(0); // Black
  
  // Aston Martin
  let amColors = new Array(4);
  amColors[0] = color(1, 54, 58); // Dark Green
  amColors[1] = color(0, 89, 79); // Light Green
  amColors[2] = color(206, 220, 0); // Yellow
  amColors[3] = color(255); // White
  
  // Martini
  let martColors = new Array(4);
  martColors[0] = color(0, 0, 156); // Dark Blue
  martColors[1] = color(7, 149, 249); // Light Blue
  martColors[2] = color(227, 32, 36); // Red
  martColors[3] = color(255) ; // White
  
  // BMW
  let bmwColors = new Array(4);
  bmwColors[0] = color(1, 124, 237); // Light Blue
  bmwColors[1] = color(81, 45, 171); // Purple
  bmwColors[2] = color(245, 2, 0); // Red
  bmwColors[3] = color(255); // White
  
  // John Player Special
  let jpColors = new Array(4);
  jpColors[0] = color(0); // Black
  jpColors[1] = color(255); // White
  jpColors[2] = color(70); // Drak Gray
  jpColors[3] = color(218, 167, 75); // Gold
  
  // Subaru
  let subColors = new Array(4);
  subColors[0] = color(0, 0, 150); // Blue
  subColors[1] = color(254, 241, 48); // Yellow
  subColors[2] = color(0); // Black
  subColors[3] = color(218, 167, 75); // Gold
  
  // Castrol
  let castColors = new Array(4);
  castColors[0] = color(53, 103, 50); // Green
  castColors[1] = color(205, 32, 39); // Red
  castColors[2] = color(255); // White
  castColors[3] = color(0); // Black
  
  // Falken Tire
  let ftColors = new Array(4);
  ftColors[0] = color(119, 225, 179); // Green
  ftColors[1] = color(2, 113, 255); // Blue
  ftColors[2] = color(0); // Black
  ftColors[3] = color(255); // White
  
  // Rothmans
  let rmColors = new Array(4);
  rmColors[0] = color(255); // White
  rmColors[1] = color(33, 14, 111) // Blue
  rmColors[2] = color(213, 10, 34) // Red
  rmColors[3] = color(218, 167, 75); // Gold
  
  // Pink Pig
  let ppColors = new Array(4);
  ppColors[0] = color(239, 173, 158); // Pink
  ppColors[1] = color(191, 38, 41); // Red
  ppColors[2] = color(255); // White
  ppColors[3] = color(0); // Black
  
  // Ironman
  let imColors = new Array(4);
  imColors[0] = color(183, 2, 3); // Red
  imColors[1] = color(232, 100, 5); // Orange
  imColors[2] = color(255, 213, 1); // Yellow
  imColors[3] = color(255); // White

  // Random colors
  let colorVarRed = Math.floor(random(30, 255));
  let colorVarGreen = Math.floor(random(30, 255));
  let colorVarBlue = Math.floor(random(30, 255));
  let randColor0 = color(colorVarRed, colorVarGreen, colorVarBlue);
  let randColor1 = color(255 - colorVarRed, 255 - colorVarGreen, 255 - colorVarBlue);
  colorMode(HSB, 360, 100, 100);
  let hueDiff = 40;
  let bcHue = hue(randColor0);
  let bcSat = saturation(randColor0);
  let bcBright = brightness(randColor0);
  let bcoHue0 = bcHue - 180;
  let bcoSat0 = bcSat;
  let bcoBright0 = max(60, 100 - bcBright);
  if (bcoHue0 < 0) {
    bcoHue0 = bcHue + 180;
  }
  bcoHue0 = bcoHue0 + hueDiff;
  randColor1 = color(bcoHue0, bcoSat0, bcoBright0);
  colorMode(RGB, 255);
  
  // Determine other two complimentary colors and add them all into a color set
  let randColor2 = color(red(randColor0) + 60, green(randColor0), blue(randColor0) - 60);
  let randColor3 = color(red(randColor0) - 60, green(randColor0), blue(randColor0) + 60);
  colorMode(HSB, 360, 100, 100);
  let fc0Hue = hue(randColor1) - 2 * hueDiff;
  if (fc0Hue < 0) {
    fc0Hue= hue(randColor1) - 2 * hueDiff + 360;
  }
  randColor2 = color(fc0Hue, bcSat, bcBright);
  colorMode(RGB, 255);
  let randColors = new Array(4);
  randColors[0] = randColor0;
  randColors[1] = randColor1;
  randColors[2] = randColor2;
  randColors[3] = randColor3;
  
  // Aggregate all color sets
  colorSets = new Array();
  colorSetNames = new Array();
  colorSets = append(colorSets, grColors);
  colorSetNames = append(colorSetNames, "GR");
  colorSets = append(colorSets, sfColors);
  colorSetNames = append(colorSetNames, "SF");
  colorSets = append(colorSets, rborColors);
  colorSetNames = append(colorSetNames, "RBOR");
  colorSets = append(colorSets, mapColors);
  colorSetNames = append(colorSetNames, "MAP");
  colorSets = append(colorSets, mColors);
  colorSetNames = append(colorSetNames, "Mc");
  colorSets = append(colorSets, mbColors);
  colorSetNames = append(colorSetNames, "Marl");
  colorSets = append(colorSets, amColors);
  colorSetNames = append(colorSetNames, "AMR");
  colorSets = append(colorSets, martColors);
  colorSetNames = append(colorSetNames, "Mart");
  colorSets = append(colorSets, bmwColors);
  colorSetNames = append(colorSetNames, "BMotor");
  colorSets = append(colorSets, jpColors);
  colorSetNames = append(colorSetNames, "JPS");
  colorSets = append(colorSets, subColors);
  colorSetNames = append(colorSetNames, "Sub");
  colorSets = append(colorSets, castColors);
  colorSetNames = append(colorSetNames, "Cast");
  colorSets = append(colorSets, ftColors);
  colorSetNames = append(colorSetNames, "FT");
  colorSets = append(colorSets, rmColors);
  colorSetNames = append(colorSetNames, "Roth");
  colorSets = append(colorSets, ppColors);
  colorSetNames = append(colorSetNames, "Pig");
  colorSets = append(colorSets, imColors);
  colorSetNames = append(colorSetNames, "Ironman");
  colorSets = append(colorSets, randColors);
  colorSetNames = append(colorSetNames, "Random");
}

// Create an array list of points defining each turn
function getTurns ( centerPoint , w , h ) { 
  let turnArray = new ArrayList();
  let xRadius = 0;
  let yRadius = 0;
  let centerPx = centerPoint.x;
  let centerPy = centerPoint.y;
  let prevRadius = 0;
  let absMaxRad = 0; 
  
  // Iterate through turns to define points for each turn
  for ( let i = 0 ; i< turns; i++ ) {
    // Determine the angle at which this point will be drawn
    let startAngle = avgAngle * i;
    let actAngle = startAngle + avgAngle;
    turnAngles = append(turnAngles, actAngle);
    // Determine max radius
    // Check all angle scenarios to determine max radius
    let maxRadius = canvasMin / 100;
    if (actAngle == 0) {
      maxRadius = w-centerPx;
    } else if (actAngle > 0 && actAngle < atan((h-centerPy) / (w-centerPx))) {
      maxRadius = (w-centerPx) / cos(actAngle);
    } else if (actAngle == atan((h-centerPy) / (w-centerPx))) {
      maxRadius = sqrt(sq(w-centerPx) + sq(h-centerPy));
    } else if (actAngle > atan((h-centerPy) / (w-centerPx)) && actAngle < HALF_PI) {
      maxRadius = (h-centerPy) / cos(HALF_PI-actAngle);
    } else if (actAngle == HALF_PI) {
      maxRadius = h-centerPy;
    } else if (actAngle > HALF_PI && actAngle < atan(centerPx / (h-centerPy)) + HALF_PI) {
      maxRadius = (h-centerPy) / cos(actAngle-HALF_PI);
    } else if (actAngle == atan(centerPx / (h-centerPy)) + HALF_PI) {
      maxRadius = sqrt(sq(centerPx) + sq(h-centerPy));
    } else if (actAngle > atan(centerPx / (h-centerPy)) + HALF_PI && actAngle < PI) {
      maxRadius = centerPx / cos(PI-actAngle);
    } else if (actAngle == PI) {
      maxRadius = centerPx;
    } else if (actAngle > PI && actAngle < atan(centerPy / centerPx) + PI) {
      maxRadius = centerPx / cos(actAngle-PI);
    } else if (actAngle == atan(centerPy / centerPx) + PI) {
      maxRadius = sqrt(sq(centerPx) + sq(centerPy));
    } else if (actAngle > atan(centerPy/centerPx) + PI && actAngle < PI+ HALF_PI) {
      maxRadius = centerPy / cos(PI+ HALF_PI- actAngle);
    } else if (actAngle == PI+ HALF_PI) {
      maxRadius = centerPy;
    } else if (actAngle > PI+ HALF_PI && actAngle < atan((w-centerPx)/centerPy) + PI + HALF_PI) {
      maxRadius = centerPy / cos(PI + HALF_PI - actAngle);
    } else if (actAngle == atan((w-centerPx) / centerPy) + PI + HALF_PI) {
      maxRadius = sqrt(sq(w-centerPx) + sq(centerPy));
    } else if (actAngle > atan((w-centerPx)/centerPy) + PI + HALF_PI && actAngle < TWO_PI) {
      maxRadius = (w-centerPx) / cos(TWO_PI-actAngle);
    } else if (actAngle == TWO_PI) {
      maxRadius = canvasMin-centerPx;
    } 
    if (i == 0) {
      prevRadius = min(maxRadius - canvasMin / 15 , canvasMin / 1.25); 
    } 
    
    // Record turn points for main track
    let actRadius = random(prevRadius-canvasMin / 4 , min(prevRadius + canvasMin / 2 , maxRadius - canvasMin / 15 ));
    if (actRadius > absMaxRad) {
      absMaxRad = actRadius;
    }
    xRadius = centerPx + actRadius * cos(actAngle);
    yRadius = centerPy + actRadius * sin(actAngle);
    turnArray.add(new Point (xRadius, yRadius));
    
    // Record turn points for outer track
    let otRadius = max(actRadius * 1.4 + canvasMin/200, (actRadius + absMaxRad) / 2);
    let otXRadius = centerPx + otRadius * cos(actAngle);
    let otYRadius = centerPy + otRadius * sin(actAngle);
    otPoints.add(new Point (otXRadius, otYRadius));
  }
  return turnArray;
} 

// Get pit lane points
function getPitPoints (turnPoints) {
  
  // Initialize array
  let pitPoints = new ArrayList();
  
  // Get total track length (direct point to point)
  let x0 = 0;
  let x1 = 0;
  let y0 = 0;
  let y1 = 0;
  let totalDistance = 0;
  for (let i = 0; i< turnPoints.size( ); i++ ) {
    
    // Check if at last point
    if (i == turnPoints.size( ) - 1) {
      x0 = turnPoints.get(i).x;
      x1 = turnPoints.get(0).x;
      y0 = turnPoints.get(i).y;
      y1 = turnPoints.get(0).y;
    } else {
      x0 = turnPoints.get(i).x;
      x1 = turnPoints.get(i+ 1).x;
      y0 = turnPoints.get(i).y;
      y1 = turnPoints.get(i+ 1).y;
    }
    
    let xDist = abs(x0- x1);
    let yDist = abs(y0- y1);
    totalDistance= totalDistance + sqrt(sq(xDist) + sq(yDist));
  } 
  
  // Determine the two points which have a distance between them that is closes to 10% of track length
  // Based on Suzuka, pit lane distance is about 10% the length of track
  // The target multiplier is less than 0.1 because 10% includes not only the pit lane, but also entry and exit.
  let targetPercent = 0.05;
  let closestTo10 = 100;
  let pitPoint0 = new Point(0,0);
  let pitPoint1 = new Point(0,0);
  for (let i = 0; i < turnPoints.size( ); i++) {
    let index0 = 0;
    let index1 = 1;
    
    // Check if at last point
    if (i == turnPoints.size() - 1) {
      x0 = turnPoints.get(i).x;
      x1 = turnPoints.get(0).x;
      y0 = turnPoints.get(i).y;
      y1 = turnPoints.get(0).y;
      index0 = i;
      index1 = 0;
    } else { 
      x0 = turnPoints.get(i).x;
      x1 = turnPoints.get(i + 1).x;
      y0 = turnPoints.get(i).y;
      y1 = turnPoints.get(i + 1).y;
      index0 = i;
      index1 = i + 1;
    } 
    
    // Get the two points that are closest to the target length
    let xDist = abs(x0 - x1);
    let yDist = abs(y0 - y1);
    let pointDist = sqrt(sq(xDist) + sq(yDist));
    if (abs(pointDist / totalDistance - targetPercent) < closestTo10) {
      closestTo10 = abs(pointDist / totalDistance - targetPercent);
      pitPoint0 = new Point(x0,y0);
      pitPoint1 = new Point(x1, y1);
      pitPointIndex0 = index0;
      pitPointIndex1 = index1;
    }
  }
  
  pitPoints.add(pitPoint0);
  pitPoints.add(pitPoint1);
  
  return pitPoints;
}

// Get the pit points off the track
function getPitPointsOffTrack(pitPoints) {
  let pitPointsOT = new ArrayList();
  
  // Set the point translation distance
  let transDist = min(canvasMin,canvasMin) / 70;
  
  // Get the inverse slope for the line between the two points
  let pp0x = pitPoints.get(0).x;
  let pp0y = pitPoints.get(0).y;
  let pp1x = pitPoints.get(1).x;
  let pp1y = pitPoints.get(1).y;
  let slope = (pp1y- pp0y) / (pp1x- pp0x);
  let inverseSlope = (-1) / slope;
  
  // Use the inverse slope to calculate the angle for pit lane point translation
  let transAngle = atan(inverseSlope);
  
  // Get the x and y coordinates for each off track pit point using the translation angle
  let pp0OTx = cos(transAngle) * transDist + pp0x;
  let pp0OTy = sin(transAngle) * transDist + pp0y;
  let pp1OTx = cos(transAngle) * transDist + pp1x;
  let pp1OTy = sin(transAngle) * transDist + pp1y;
  pitPointsOT.add(new Point(pp0OTx,pp0OTy));
  pitPointsOT.add(new Point(pp1OTx,pp1OTy));
  
  return pitPointsOT; 
} 

function drawTrack (turnList,pitPoints ) {
  
  // Determine indices of the two pit points
  let pitPointIndex0 = 0;
  let pitPointIndex1 = 1;
  let pitPoint0 = pitPoints.get(0);
  let pitPoint1 = pitPoints.get(1);
  for (let i = 0; i < turnList.size(); i++) {
    let turnPoint = turnList.get(i);
    if (turnPoint.x == pitPoint0.x && turnPoint.y == pitPoint0.y) {
      pitPointIndex0 = i;
    } else if (turnPoint.x == pitPoint1.x && turnPoint.y == pitPoint1.y) {
      pitPointIndex1 = i;
    } 
  }
  
  // Draw the track base
  // Begin the first curve
  beginShape( );
  
  // Grab the first two points of the first curve
  // There are two points because one is a control point and the other connects the first curve to the second curve
  if (pitPointIndex0 != turnList.size() - 1) {
    let firstCurvePoint = turnList.get(turnList.size() - 2);
    curveVertex(firstCurvePoint.x,firstCurvePoint.y);
  }
  
  let secondCurvePoint = turnList.get(turnList.size() - 1);
  curveVertex(secondCurvePoint.x,secondCurvePoint.y);
  
  // Plot the remaining points in the first curve
  for (let i = 0; i <= pitPointIndex0; i++) {
    let turnPoint = turnList.get(i);
    curveVertex(turnPoint.x,turnPoint.y);
  } 
  
  if (pitPointIndex0 != turnList.size() - 1) {
    let turnPoint = turnList.get(pitPointIndex0+ 1);
    curveVertex(turnPoint.x,turnPoint.y);
  } else {
    let turnPoint = turnList.get(0);
    curveVertex(turnPoint.x,turnPoint.y);
  } 
  endShape( );
  
  // Begin the second curve
  beginShape( );
  // Get the first control point for the second curve
  if (pitPointIndex1 != 0) {
    let turnPoint = turnList.get(pitPointIndex1 - 1);
    curveVertex(turnPoint.x,turnPoint.y);
  }
  
  // Plot the remaining points of the second curve
  for (let i = pitPointIndex1; i < turnList.size(); i++) {
    let turnPoint = turnList.get(i);
    curveVertex(turnPoint.x,turnPoint.y);
  }
  
  let lastCurvePoint = turnList.get(0);
  curveVertex(lastCurvePoint.x,lastCurvePoint.y);
  endShape();
  
  // Draw the straight line connecting the two pit lane points
  line(pitPoints.get(0).x,pitPoints.get(0).y,pitPoints.get(1).x,pitPoints.get(1).y);
  
  // Plot pit points off track
  let pitPointsOT = getPitPointsOffTrack(pitPoints);
  line(pitPointsOT.get(0).x,pitPointsOT.get(0).y,pitPointsOT.get(1).x,pitPointsOT.get(1).y);
  
  // Draw the curves connecting the track to the off track pit points
  // Plot the entrance curve, which includes the two off track pit points and the two preceeding track points
  let trackPoint0 = new Point(0,0);
  let trackPoint1 = new Point(0,0);
  if (pitPointIndex0 == 0 ) {
    trackPoint0 = turnList.get(turnList.size() - 2);
    trackPoint1 = turnList.get(turnList.size() - 1);
  } else if (pitPointIndex0 == 1) {
    trackPoint0 = turnList.get(turnList.size() - 1);
    trackPoint1 = turnList.get(0);
  } else {
    trackPoint0 = turnList.get(pitPointIndex0 - 2);
    trackPoint1 = turnList.get(pitPointIndex0- 1);
  }
  
  beginShape( );
  curveVertex(trackPoint0.x,trackPoint0.y);
  curveVertex(trackPoint1.x,trackPoint1.y);
  curveVertex(pitPointsOT.get(0).x,pitPointsOT.get(0).y);
  curveVertex(pitPointsOT.get(1).x,pitPointsOT.get(1).y);
  endShape( );
  
  // Plot the exit curve, which includes the two off track pit points and the two successive track points
  let trackPoint2 = new Point(0,0);
  let trackPoint3 = new Point(0,0);
  if (pitPointIndex1 == turnList.size() - 1) {
    trackPoint2 = turnList.get(0);
    trackPoint3 = turnList.get(1);
  } else if (pitPointIndex1 == turnList.size() - 2) {
    trackPoint2 = turnList.get(turnList.size() - 1);
    trackPoint3 = turnList.get(0);
  } else {
    trackPoint2 = turnList.get(pitPointIndex1 + 1);
    trackPoint3 = turnList.get(pitPointIndex1 + 2);
  }
  beginShape( );
  curveVertex(pitPointsOT.get(0).x,pitPointsOT.get(0).y);
  curveVertex(pitPointsOT.get(1).x,pitPointsOT.get(1).y);
  curveVertex(trackPoint2.x,trackPoint2.y);
  curveVertex(trackPoint3.x,trackPoint3.y);
  endShape( );
}

function getTwoStandPoints (trackCenter, trackPoints, offset, lengthCorrection, inside ) {
  let standPoints = new ArrayList();
  let direction = 1 ;
  if (inside) {
    direction = -1;
  }
  for (let i = 0; i < trackPoints.size() - 1; i++) {
    
    // Get the inverse slope for the line between the two points
    let pp0x = trackPoints.get(i).x;
    let pp0y = trackPoints.get(i).y;
    let pp1x = trackPoints.get(i + 1).x;
    let pp1y = trackPoints.get(i+ 1).y;
    let slope = (pp1y - pp0y) / (pp1x - pp0x);
    let inverseSlope = (- 1) / slope;
    
    // Use the inverse slope to calculate the angle for pit lane point translation
    let transAngle = atan(inverseSlope);
    
    // Get the x and y coordinates for each off track point using the translation angle
    let pp0SxH = cos(transAngle) * offset + pp0x;
    let pp0SyH = sin(transAngle) * offset + pp0y;
    let pp1SxH = cos(transAngle) * offset + pp1x;
    let pp1SyH = sin(transAngle) * offset + pp1y;
    let pp0SxL = cos(transAngle) * offset * -1 + pp0x;
    let pp0SyL = sin(transAngle) * offset * -1 + pp0y;
    let pp1SxL = cos(transAngle) * offset * -1 + pp1x;
    let pp1SyL = sin(transAngle) * offset * -1 + pp1y;
    
    // Check the points to make sure they are translated in the correct direction
    // Inside points should be closer to the track center
    let pp0SDistL = sqrt(sq(pp0SxL - trackCenter.x) + sq(pp0SyL - trackCenter.y));
    let pp0SDistH = sqrt(sq(pp0SxH - trackCenter.x) + sq(pp0SyH - trackCenter.y));
    let pp1SDistL = sqrt(sq(pp1SxL - trackCenter.x) + sq(pp1SyL - trackCenter.y));
    let pp1SDistH = sqrt(sq(pp1SxH - trackCenter.x) + sq(pp1SyH - trackCenter.y));
    let newPP0 = new Point(pp0SxH,pp0SyH);
    let newPP1 = new Point(pp1SxH,pp1SyH);
    let newPP0x = newPP0.x;
    let newPP0y = newPP0.y;
    let newPP1x = newPP1.x;
    let newPP1y = newPP1.y;
    if (direction == -1) {
      if (pp0SDistL < pp0SDistH) {
        newPP0 = new Point(pp0SxL,pp0SyL);
      }
      if (pp1SDistL < pp1SDistH) {
        newPP1 = new Point(pp1SxL,pp1SyL);
      }
    } else {
      if (pp0SDistL > pp0SDistH) {
        newPP0 = new Point(pp0SxL,pp0SyL);
      } else {
        newPP0 = new Point(pp0SxH,pp0SyH);
      } 
      if (pp1SDistL > pp1SDistH) {
        newPP1 = new Point(pp1SxL,pp1SyL);
      } else {
        newPP1 = new Point(pp1SxH,pp1SyH);
      }
    }
    
    let xRatio = abs(newPP1.x - newPP0.x) / sqrt(sq(newPP1.x - newPP0.x) + sq(newPP1.y - newPP0.y));
    let yRatio = abs(newPP1.y - newPP0.y) / sqrt(sq(newPP1.x - newPP0.x) + sq(newPP1.y - newPP0.y));
    if (i == 0) {
      if (newPP0.x < newPP1.x) {
        newPP0x = newPP0.x + lengthCorrection * xRatio;
        newPP1x = newPP1.x - lengthCorrection * xRatio;
      } else {
        newPP0x = newPP0.x - lengthCorrection * xRatio;
        newPP1x = newPP1.x + lengthCorrection * xRatio;
      }
      if (newPP0.y > newPP1.y) {
        newPP0y = newPP0.y - lengthCorrection * yRatio;
        newPP1y = newPP1.y + lengthCorrection * yRatio;
      } else {
        newPP0y = newPP0.y + lengthCorrection * yRatio;
        newPP1y = newPP1.y - lengthCorrection * yRatio;
      }
      standPoints.add(new Point(newPP0x,newPP0y));
      standPoints.add(new Point (newPP1x,newPP1y));
      for (let tp = 0; tp < turnList.size(); tp++) {
        if (turnList.get(tp).x == pp0x && turnList.get(tp).y == pp0y) {
          allStandIndices = append(allStandIndices, tp);
          if (tp == turnList.size() - 1) {
            allStandIndices = append(allStandIndices, 0);
          } else {
            allStandIndices = append(allStandIndices, tp + 1)
            ;
          }
        }
      }
    }
  } 
  
  return standPoints;
}

// Get many stand points (more than 2)
function getManyStandPoints(trackCenter,trackPoints,pointIndices,offset,inside ) {
  let standPoints = new ArrayList();
  for (let i = 0 ; i < trackPoints.size(); i++) {
    let tp = trackPoints.get(i);
    let angle = turnAngles[pointIndices[i]];
    let direction = 1;
    if (inside) {
      direction= -1;
    }
    let radius = sqrt(sq(tp.x- trackCenter.x) + sq(tp.y - trackCenter.y)) + (direction * offset);
    let xRadius = trackCenter.x + radius * cos(angle);
    let yRadius = trackCenter.y + radius * sin(angle);
    standPoints.add(new Point(xRadius,yRadius));
    if (i != 0 && i != trackPoints.size() - 1) {
      allStandIndices = append(allStandIndices, pointIndices[i]);
    }
  }
  
  return standPoints;
}

function drawInteriorTrack(trackCenter,turnPoints) {
  beginShape( );
  let innerTrackPoints = new ArrayList();
  let prevRad = 0;
  for (let i = 0; i < turnPoints.size(); i++) {
    let actAngle = turnAngles[i];
    let maxRadius = sqrt(sq(turnPoints.get(i).x - trackCenter.x) + sq(turnPoints.get(i).y - trackCenter.y));
    if (i == 0) {
      prevRad = max(maxRadius - canvasMin / 6, min(canvasMin / 6, maxRadius - canvasMin / 6));
    }
    let actRadius = abs(min(random(prevRad, prevRad + canvasMin / 6 ), maxRadius - canvasMin / 6));
    prevRad = actRadius;
    let xRadius = trackCenter.x + actRadius * cos(actAngle);
    let yRadius = trackCenter.y + actRadius * sin(actAngle);
    innerTrackPoints.add(new Point(xRadius,yRadius));
  }
  endShape( );
  
  return innerTrackPoints;
}

function drawRandomInteriorRoads(trackPoints,interiorTrackPoints,centerPoint,minRoadWidth) {
  let trackConnectors = new ArrayList();
  let internalRoadPoints = new ArrayList();
  curveTightness(0);
  let index0 = -1;
  let index1 = -1;
  let connections = Math.floor(random(3,5));
  let indices = new Array();
  for (let i = 0; i < connections; i++) {
    let count0 = 0;
    while ((index0 == -1 || indices.includes(index0) || allStandIndices.includes(index0)) && count0 < 100) {
      index0 = Math.floor(random(0,trackPoints.size() - 0.1));
      count0++;
    }
    indices = append(indices, index0);
    let p0 = trackPoints.get(0);
    if (index0 != 0 ) {
      p0 = trackPoints.get(index0 - 1);
    }
    let p01 = trackPoints.get(index0);
    trackConnectors.add(p01);
    let midPoint = new Point(random(centerPoint.x - 100, centerPoint.x + 100) , random(centerPoint.y - 100, centerPoint.y + 100));
    let dist1 = canvasMin;
    let midTP = 0;
    for (let j = 0; j < interiorTrackPoints.size(); j++) {
      let intTrackPoint = interiorTrackPoints.get(j);
      let newDist = sqrt(sq(intTrackPoint.x - p01.x) + sq(intTrackPoint.y - p01.y));
      if (newDist < dist1) {
        dist1 = newDist;
        midPoint = intTrackPoint;
        midTP = j;
      } 
    }
    let numMids = 5;
    let nextIndex = midTP;
    let midPoints = new ArrayList();
    midPoints.add(midPoint);
    if (internalRoadPoints.size() < 5) {
      internalRoadPoints.add(midPoint);
    }
    for (let m = 0; m < numMids + 1; m++) {
      nextIndex++;
      if (nextIndex == interiorTrackPoints.size()) {
        nextIndex = 0;
      }
      midPoints.add(interiorTrackPoints.get(nextIndex));
      if (internalRoadPoints.size() < 5 && m == 0) {
        internalRoadPoints.add(interiorTrackPoints.get(nextIndex));
        if (internalRoadPoints.size() == 2) {
          internalRoadPoints.add(centerPoint);
        }
      }
    }
    
    // Find track point closest to latest interior point.
    let lastIntPoint = midPoints.get(midPoints.size() - 1);
    dist1 = canvasMin;
    for (let tp = 0; tp < trackPoints.size(); tp++) {
      let trackPoint = trackPoints.get(tp);
      let newDist = sqrt(sq(trackPoint.x - lastIntPoint.x) + sq(trackPoint.y - lastIntPoint.y));
      if (newDist < dist1) {
        dist1 = newDist;
        index1 = tp;
      }
    }
    let index11 = index1 + 1;
    if (index11 == trackPoints.size()) {
      index11 = 0;
    }
    strokeWeight(minRoadWidth);
    beginShape();
    curveVertex(p0.x,p0.y);
    curveVertex(p01.x,p01.y);
    for (let m = 0; m < 2; m++) {
      curveVertex(midPoints.get(m).x,midPoints.get(m).y);
    }
    endShape( );
  }
  
  // Draw the road within the inner track
  beginShape();
  for (let i = 0; i < internalRoadPoints.size(); i++) {
    curveVertex(internalRoadPoints.get(i).x,internalRoadPoints.get(i).y);
  }
  endShape();
  curveTightness(0);
  
  return trackConnectors;

}

// Draw roads leaving the exterior track
function drawExitRoads(trackPoints) {
  let roads = new ArrayList();
  for (let i = 0; i < trackPoints.size(); i++) {
    let turnAngle = turnAngles[i];
    let x = 0;
    let y = 0;
    let variance = 50;
    let p = trackPoints.get(i);
    let px = p.x;
    let py = p.y;
    if (turnAngle >= 0 && turnAngle < PI/ 4) {
      x = canvasMin;
      y = random(py - variance,py + variance);
    } else if (turnAngle >= PI * 0.25 && turnAngle < PI * 0.75) {
      x = random(px - variance,px + variance);
      y = canvasMin;
    } else if (turnAngle >= PI * 0.75 && turnAngle < PI * 1.25) {
      x = 0;
      y = random(py - variance,py + variance);
    } else if (turnAngle >= PI * 1.25 && turnAngle < PI * 1.75) {
      x = random(px - variance,px + variance);
      y = 0;
    } else {
      x = canvasMin;
      y = random(py - variance,py + variance);
    } if (x != 0 || y != 0) {
      circleCandidates.add(new Point (px,py));
      beginShape( );
      vertex(px,py);
      vertex(x,y);
      endShape( );
      roads.add(new Line(new Point(px,py), new Point(x,y)));
    }
  }
  
  return roads;
}

// Get the centroid of a bunch of points
function getCentroid(points) {
  let x = 0;
  let y = 0;
  let a = 0;
  let signedArea = 0;
  let j = 0;
  for (j = 0; j < points.size() - 1; j++) {
    let p0 = points.get(j);
    let p1 = points.get(j + 1);
    let x0 = p0.x;
    let y0 = p0.y;
    let x1 = p1.x;
    let y1 = p1.y;
    a= x0 * y1- x1 * y0;
    signedArea += a;
    x += (x0 + x1) * a;
    y += (y0+ y1) * a;
  }
  let p0 = points.get(j);
  let p1 = points.get(0);
  let x0 = p0.x;
  let y0 = p0.y;
  let x1 = p1.x;
  let y1 = p1.y;
  a= x0 * y1 - x1 * y0;
  signedArea += a;
  x += (x0 + x1) * a;
  y += (y0 + y1) * a;
  signedArea *= 0.5;
  x /= (6 * signedArea);
  y /= (6 * signedArea);
  
  return new Point (x, y);
}

function drawInnerShape(points,adjust) {
  let centroid = getCentroid(points);
  
  // plot the first line
  let newPoints = new ArrayList();
  for (let i = 0; i < points.size(); i++) {
    let p = points.get(i);
    let xRatio = (p.x - centroid.x) / sqrt(sq(p.x - centroid.x) + sq(p.y - centroid.y));
    let yRatio = (p.y - centroid.y) / sqrt(sq(p.x - centroid.x) + sq(p.y - centroid.y));
    newPoints.add(new Point(p.x- adjust * xRatio, p.y - adjust * yRatio));
  }
  beginShape( );
  for (let i = 0; i < newPoints.size(); i++) {
    curveVertex(newPoints.get(i).x,newPoints.get(i).y);
  }
  for (let i = 0; i < 3; i++) {
    curveVertex(newPoints.get(i).x,newPoints.get(i).y);
  }
  endShape( );
  
  return centroid;
}

// Function to draw random trees in areas where the background color exists and 
// when a point exists within a certain probability distribution of a line or 
// set of lines
// bg: background color
// treeColor: the color of trees to be drawn on the canvas
function drawTrees(bg,treeColor) {
  
  fill(treeColor);
  noStroke( );
  
  // Generate an array of lines that will be used to determine where to plot the tree distributions
  let numClusters = 0;
  if (trees > 0) {
    numClusters = Math.floor(random(3,8));
  }
  let lines = new ArrayList();
  for (let l = 0; l < numClusters; l++) {
    let p0x = random(0, 1) * canvasMin;
	let p0y = random(0, 1) * canvasMin;
	let p1x = random(0, 1) * canvasMin;
	let p1y = random(0, 1) * canvasMin;
	let p0 = new Point(p0x, p0y);
    let p1 = new Point(p1x, p1y);
    lines.add(new Line(p0,p1));
  }
  
  // Iterate through all pixels, per treeSpacing value
  loadPixels();
  for (let i = 0; i < 10000; i += 1) {
  
	// Set a random point
	let xPixP = random(0, 1) * canvasMin;
	let yPixP = random(0, 1) * canvasMin;
	let xPix = Math.round(xPixP);
	let yPix = Math.round(yPixP);
	
	// Check if the pixels around the point are only the background color
	let clear = true;
	let d = pixelDensity();
	let clearance = Math.floor(canvasMin/200);
	for (let j = -clearance; j < clearance; j++) {
		for (let k = -clearance; k < clearance; k++) {
			let index = 4 * d * ((yPix + j) * d * canvasMin + xPix + k);
			let cR1 = pixels[index];
			let cG1 = pixels[index + 1];
			let cB1 = pixels[index + 2];
			let cA1 = pixels[index + 3];
			let cR2 = red(bg);
			let cG2 = green(bg);
			let cB2 = blue(bg);
			let cA2 = alpha(bg);
			if (cR1 != cR2 || cG1 != cG2 || cB1 != cB2) {
				clear = false;
			}
		}
	}
  
	// Check closeness to each line
	let maxDist = canvasMin / random(4, 40);
	let prob = 0;
	for (let l = 0; l < lines.size(); l++) {
		let distFromL = getDistanceFromLine(lines.get(l), new Point(xPixP,yPixP));
		if (distFromL < maxDist) {
			prob = min(prob + (1 - (distFromL / maxDist)), 0.7);
		}
	}
  
	// Draw the tree if the probability is within a certain range and the pixels
	// around the point are only colored with the background color
	let randomCheck = random(0,1);
	if (clear && randomCheck < prob) {
	
		// Draw the trunk
		let trunkSize = canvasMin/200;
		circle(xPix,yPix,trunkSize);
	
		// Draw the bunches of leaves
		for (let i = 0; i < Math.floor(random(4,7)); i++) {
			circle(xPix + random(-trunkSize/2,trunkSize/2),yPix + random(-trunkSize/2,trunkSize/2), random(trunkSize,trunkSize*2));
		}
	}
  }
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

function setup ( ) {
  seed = int(random() * 999999);
  /*randomSeed(seed);

  // Set features
  trees = Math.floor(random(0,1.99999999));
  turns = Math.floor(random(10, 23));
  numberStands = Math.floor(random((0.7 * turns), (0.9 * turns)));
  getColorSets();
  colorSetIndex = Math.floor(random(0, colorSets.length));
  cName = colorSetNames[colorSetIndex];
  $fx.features({
	'Color Set': cName,
	'Number of Turns': turns,
	'Number of Grandstands': numberStands,
  })*/
  canvasMin = Math.floor(min(windowWidth, windowHeight));
  var canvas = createCanvas(canvasMin, canvasMin);
  //var canvasParent = canvas.parent('raceTracksCanvas');
  //canvasMin = min(canvas.width, canvas.height);
  frameRate(30);
  noLoop();
}

function draw ( ) {
  pixelDensity(pd);
  randomSeed(seed);

  // Set features
  trees = Math.floor(random(0,1.99999999));
  turns = Math.floor(random(10, 23));
  numberStands = Math.floor(random((0.7 * turns), (0.9 * turns)));
  getColorSets();
  colorSetIndex = Math.floor(random(0, colorSets.length));
  cName = colorSetNames[colorSetIndex];
  
  // Set some initial values
  //pixelDensity(pd);
  background(color(24 , 24 , 24));
  
  // Set some standard parameters
  let trackWidth = min(canvasMin, canvasMin) / 150;
  let minRoadWidth = trackWidth / 3;
  let maxRoadWidth = trackWidth / 2;
  
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
  let baseColorOpp = selectedCS[selectedColors[1]];
  let featureColor0 = selectedCS[selectedColors[2]];
  let featureColor1 = selectedCS[selectedColors[3]];
  background(baseColor);
  
  // Determine center point
  let centerPx = random(0.4, 0.6) * canvasMin;
  let centerPy = random(0.4, 0.6) * canvasMin;
  
  // Determine average angle for position of each turn around a central point
  let avgAngleDeg = 360 / turns;
  avgAngle = radians(avgAngleDeg);
  
  // Set center point of the track, get the points of the turns, and plot the track
  let centerPoint = new Point(centerPx, centerPy);
  
  // Get race track turn points
  turnList = getTurns(centerPoint, canvasMin, canvasMin);
  
  // Get points to define pit lane
  let pitPoints = getPitPoints(turnList);
  
  let exitRoads = new ArrayList();
  strokeWeight(minRoadWidth);
  stroke(featureColor0);
  exitRoads = drawExitRoads(otPoints);
  
  // Draw exterior track
  strokeWeight(maxRoadWidth);
  stroke(featureColor0);
  curveTightness(0.4);
  fill(baseColor);
  strokeWeight(maxRoadWidth);
  stroke(featureColor0);
  beginShape();
  for (let i = 0; i < otPoints.size(); i++) {
    curveVertex(otPoints.get(i).x, otPoints.get(i).y);
  }
  for (let i = 0; i < 3; i++) {
    curveVertex(otPoints.get(i).x, otPoints.get(i).y);
  }
  endShape();
  curveTightness(0);
  noFill();
  
  // Draw shapes between track and exterior track
  fill(featureColor0);
  let numShapes = Math.floor(random(turns / 3, turns / 2));
  let shapeIndices = new Array();
  for (let i = 0; i < numShapes; i++) {
    let shapeIndex = Math.floor(random(0, turns));
    while (shapeIndices.includes(shapeIndex)) {
      shapeIndex = Math.floor(random(0, turns));
    }
    let nextShapeIndex = shapeIndex + 1;
    if (shapeIndex == turnList.size() - 1) {
      nextShapeIndex = 0;
    }
    strokeWeight(minRoadWidth);
    stroke(featureColor0);
    let tp0 = turnList.get(shapeIndex);
    let tp1 = turnList.get(nextShapeIndex);
    let ot0 = otPoints.get(shapeIndex);
    let ot1 = otPoints.get(nextShapeIndex);
    let shapePoints = new ArrayList();
    shapePoints.add(tp0);
    shapePoints.add(ot0);
    shapePoints.add(ot1);
    shapePoints.add(tp1);
    let centroid = drawInnerShape(shapePoints, canvasMin / 15);
    
    // Draw roads from centroid to outter track points
    beginShape();
    vertex(centroid.x, centroid.y);
    vertex(ot0.x, ot0.y);
    endShape();
    beginShape();
    vertex(centroid.x, centroid.y);
    vertex(ot1.x, ot1.y);
    endShape();
  }
  noFill();
  
  // Draw main track fill to block off parking lots that span inside the track
  fill(baseColor);
  noStroke();
  beginShape();
  curveTightness(0);
  for (let i = 0; i < turnList.size(); i++) {
    curveVertex(turnList.get(i).x, turnList.get(i).y);
  }
  for (let i = 0; i < 3; i++) {
    curveVertex(turnList.get(i).x, turnList.get(i).y);
  }
  endShape();
  
  // Get inner track points
  let innerTrackPoints = drawInteriorTrack(centerPoint, turnList);
  
  // Draw an interior parking lot
  let greatestIPDist = 0;
  let iPLPoint0 = new Point(0, 0);
  let iPLPoint1 = new Point(0, 0);
  let iPLPoint2 = new Point(0, 0);
  let iPLPoint3 = new Point(0, 0);
  for (let op = 0; op < turnList.size(); op++) {
    let op0 = turnList.get(op);
    let op1 = turnList.get(0);
    if (op < turnList.size() - 1) {
      op1 = turnList.get(op + 1);
    }
    let ip0 = innerTrackPoints.get(op);
    let ip1 = innerTrackPoints.get(0);
    if (op < turnList.size() - 1) {
      ip1 = innerTrackPoints.get(op + 1);
    }
    
    // Pick the set of points that have the greatest distance between them
    let dist1 = Math.floor(sqrt(sq(op0.x - ip0.x) + sq(op0.y - ip0.y)) + sqrt(sq(op1.x - ip1.x) + sq(op1.y - ip1.y)));
    if (dist1 > greatestIPDist) {
      greatestIPDist = dist1;
      iPLPoint0 = op0;
      iPLPoint1 = ip0;
      iPLPoint2 = ip1;
      iPLPoint3= op1;
    }
  }
  fill(featureColor0);
  stroke(baseColor);
  strokeWeight(0);
  curveTightness(0);
  beginShape();
  curveVertex(iPLPoint0.x, iPLPoint0.y);
  curveVertex(iPLPoint1.x, iPLPoint1.y);
  curveVertex(iPLPoint2.x, iPLPoint2.y);
  curveVertex(iPLPoint3.x, iPLPoint3.y);
  curveVertex(iPLPoint0.x, iPLPoint0.y);
  curveVertex(iPLPoint1.x, iPLPoint1.y);
  endShape();
  noFill();
  
  // Draw inner track base to block off parking lot
  strokeWeight(maxRoadWidth + min(canvasMin, canvasMin) / 300);
  noFill();
  stroke(baseColor);
  curveTightness(0);
  fill(baseColor);
  beginShape();
  for (let i = 0; i < innerTrackPoints.size(); i++) {
    curveVertex(innerTrackPoints.get(i).x, innerTrackPoints.get(i).y);
  }
  for (let i = 0; i < 3; i++) {
    curveVertex(innerTrackPoints.get(i).x, innerTrackPoints.get(i).y);
  }
  endShape();
  
  // Draw shapes between track and inner track
  noFill();
  let numShapes2 = Math.floor(random(4, 9));
  let shapeIndices2 = new Array();
  for (let i = 0; i < numShapes2; i++) {
    let shapeIndex2 = Math.floor(random(0, turns));
    while (shapeIndices2.includes(shapeIndex2)) {
      shapeIndex2 = Math.floor(random(0, turns));
    }
    let nextShapeIndex2 = shapeIndex2 + 1;
    if (shapeIndex2 == turnList.size() - 1) {
      nextShapeIndex2 = 0;
    }
    strokeWeight(minRoadWidth);
    stroke(featureColor0);
    let tp0 = turnList.get(shapeIndex2);
    let tp1 = turnList.get(nextShapeIndex2);
    let it0 = innerTrackPoints.get(shapeIndex2);
    let it1 = innerTrackPoints.get(nextShapeIndex2);
    let shapePoints = new ArrayList();
    shapePoints.add(tp0);
    shapePoints.add(it0);
    shapePoints.add(it1);
    shapePoints.add(tp1);
    drawInnerShape(shapePoints, canvasMin / 15);
  }
  
  // Draw the inner track itself
  strokeWeight(maxRoadWidth);
  noFill();
  stroke(featureColor0);
  beginShape();
  for (let i = 0; i < innerTrackPoints.size(); i++) {
    curveVertex(innerTrackPoints.get(i).x , innerTrackPoints.get(i).y);
  }
  for (let i = 0; i < 3; i++) {
    curveVertex(innerTrackPoints.get(i).x, innerTrackPoints.get(i).y);
  }
  endShape();
  noFill();
  
  // Draw the random interior roads
  let connectingPoints = drawRandomInteriorRoads(turnList, innerTrackPoints, centerPoint, minRoadWidth);
  
  // Draw roads connecting main track to exterior
  let otConnector = new Point(0, 0);
  let connectedToPL = false;
  for (let i = 0; i < connectingPoints.size(); i++) {
    let closestDist = max(canvasMin, canvasMin) * 10;
    let cp = connectingPoints.get(i);
    let cpx = cp.x;
    let cpy = cp.y;
    for (let j = 0; j < otPoints.size(); j++) {
      let op = otPoints.get(j);
      let dist1 = sqrt(sq(cpx - op.x) + sq(cpy - op.y));
      if (dist1 < closestDist) {
        otConnector = op;
        closestDist = dist1;
      }
    }
    if (random(0 , 10) < 10) {
      strokeWeight(minRoadWidth);
      beginShape();
      vertex(cpx, cpy);
      vertex(otConnector.x, otConnector.y);
      endShape();
      if (! connectedToPL) {
        circleCandidates.add(otConnector);
      }
    }
  }
  
  // Draw the main stands
  strokeWeight(min(canvasMin, canvasMin) * 0.04);
  curveTightness(0);
  stroke(featureColor1);
  let offset = min(canvasMin, canvasMin) * 0.03;
  //let numberStands = Math.floor(random((0.7 * turns), (0.9 * turns)));
  let minMult = 0.02;
  let maxMult = 0.05;
  for (let i = 0; i < numberStands; i++) {
    
    // Vary the stroke weight for each stand
    let sw = random(minMult, maxMult) * canvasMin;
    strokeWeight(sw);
    let offsetAdj = offset - (min(canvasMin, canvasMin) * maxMult - sw) / 2;
    
    // Get points for stand
    let pointList = new ArrayList();
    let pointIndices = new Array();
    let startPoint = Math.floor(random(0 , turns));
    let standLength = 4;
    for (let j = startPoint; j <= startPoint + standLength - 1; j++) {
      let index = j;
      if (j > turnList.size() - 1) {
        index = j - turnList.size();
      }
      pointIndices = append(pointIndices, index);
      pointList.add(turnList.get(index));
    }
    let inside = false;
    if (random(0, 100) < 50) {
      inside = true;
    }
    let standPoints = getManyStandPoints(centerPoint, pointList, pointIndices, offsetAdj, inside);
    
    // Plot the stand
    if (random(0 , 100) < 10) {
      strokeCap(ROUND);
    } else {
      strokeCap(PROJECT);
    }
    beginShape();
    for (let j = 0; j < standPoints.size(); j++) {
      curveVertex(standPoints.get(j).x, standPoints.get(j).y);
    }
    endShape();
  }
  
  // Draw stands at the pit lane
  strokeCap(SQUARE);
  minMult = 0.05;
  let standLC = canvasMin / 100;
  let offset2 = offset * 0.9;
  
  //Adjust for distance between track and pit lane
  let sw = random(minMult, maxMult) * canvasMin;
  strokeWeight(sw);
  let offsetAdj = offset2 - (canvasMin * maxMult - sw);
  let pitStandPointsInside = getTwoStandPoints(centerPoint, pitPoints, offsetAdj, standLC, true);
  beginShape();
  for (let i = 0; i < pitStandPointsInside.size(); i++) {
    vertex(pitStandPointsInside.get(i).x, pitStandPointsInside.get(i).y);
  }
  endShape();
  sw = random(minMult, maxMult) * canvasMin;
  strokeWeight(sw);
  offsetAdj = offset2 - (canvasMin * maxMult - sw) / 2;
  let pitStandPointsOutside = getTwoStandPoints(centerPoint, pitPoints, offsetAdj, standLC, false);
  beginShape();
  for (let i = 0; i < pitStandPointsOutside.size(); i++) {
    vertex(pitStandPointsOutside.get(i).x, pitStandPointsOutside.get(i).y);
  }
  endShape();
  
  // Draw the track base to show parallel tracks
  let baseWidth = trackWidth + offset * 0.7;
  strokeWeight(baseWidth);
  stroke(featureColor0);
  strokeCap(ROUND);
  curveTightness(0);
  drawTrack(turnList, pitPoints);
  strokeWeight(baseWidth - 2 * minRoadWidth);
  stroke(baseColor);
  strokeCap(ROUND);
  curveTightness(0);
  drawTrack(turnList, pitPoints);
  stroke(featureColor0);
  
  //Draw the track
  strokeWeight(trackWidth);
  stroke(baseColorOpp);
  curveTightness(0);
  drawTrack(turnList, pitPoints);
  
  // Draw traffic circles
  stroke(featureColor0);
  strokeWeight(maxRoadWidth);
  fill(baseColor);
  for (let i = 0; i < circleCandidates.size(); i++) {
    if (random(0, 100) < 35) {
      circle(circleCandidates.get(i).x, circleCandidates.get(i).y, canvasMin/random(40, 100));
    }
  }
  noFill( );
  
  // Draw the trees
  drawTrees(baseColor, color(red( featureColor1), green( featureColor1), blue(featureColor1), 128));

}

/*keyTyped = function() {
  let resize = 1000;
  let r = false;
  if (key == 's' || key == 'S') {
	  saveCanvas('Race Tracks - ' + $fx.hash, 'png')
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
      resize = windowHeight;
	  r = true;
  }
  
  canvasMin = resize;
  
  if (r) {
	  // Reset global variable arrays and other values
	  turnAngles = new Array( ); 
	  otPoints = new ArrayList();
	  circleCandidates = new ArrayList(); 
	  turnList = new ArrayList(); 
	  allStandIndices = new Array(); 
	  pd = 1;
	  resizeCanvas(canvasMin, canvasMin);
  }
}*/

function windowResized() {
  // Reset global variable arrays and other values
  updatePixels();
  turnAngles = new Array( ); 
  otPoints = new ArrayList();
  circleCandidates = new ArrayList(); 
  turnList = new ArrayList(); 
  allStandIndices = new Array(); 
  pd = 1;
  canvasMin = Math.floor(min(windowWidth, windowHeight));
  resizeCanvas(canvasMin, canvasMin);
}