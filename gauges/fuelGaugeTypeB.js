/*

  Fuel gauge type B
  
*/

/* ------------------------------
   Fuel Gauge (Left + Right)
   ------------------------------ */
let currentLeftFuelAngle  = 0;
let currentRightFuelAngle = 0;

// more fuel decreases the angle
const fuelCalcTable = [
    { gal:  0, angle:   60 },
    { gal:  5, angle:   43 },
    { gal: 10, angle:   18 },
    { gal: 15, angle:  -10 },
    { gal: 20, angle:  -34 },
    { gal: 26, angle:  -58 }
];

function gallonsToAngle(gal) {
    for (let i = 0; i < fuelCalcTable.length - 1; i++) {
        const a = fuelCalcTable[i];
        const b = fuelCalcTable[i + 1];

        if (gal >= a.gal && gal <= b.gal) {
            const t = (gal - a.gal) / (b.gal - a.gal);
            return a.angle + t * (b.angle - a.angle);
        }
    }

    // clamp
    if (gal < fuelCalcTable[0].gal) return fuelCalcTable[0].angle;
    return fuelCalcTable[fuelCalcTable.length - 1].angle;
}

function updateFuelGaugeMeaure(leftGallons, rightGallons) {
    const targetLeft  = gallonsToAngle(leftGallons);
    const targetRight = gallonsToAngle(rightGallons) * -1;

    const smooth = 0.12;  // tweak to taste

    currentLeftFuelAngle  += (targetLeft  - currentLeftFuelAngle)  * smooth;
    currentRightFuelAngle += (targetRight - currentRightFuelAngle) * smooth;

    document.getElementById("fuelNeedleLeft").style.transform =
        `translate(-50%, -90%) rotate(${currentLeftFuelAngle}deg)`;

    document.getElementById("fuelNeedleRight").style.transform =
        `translate(-50%, -90%) rotate(${currentRightFuelAngle}deg)`;
}

//updateFuelGauge(fuelLeftGallons, fuelRightGallons);

function updateFuelGauge() {
    
    updateFuelGaugeMeaure(gsdFuelLeft, gsdFuelRight);

}

/*
let testLeftGallons  = 26;   // starting value
let testRightGallons = 26;   // starting value

setInterval(() => {
    testLeftGallons  = Math.max(0, testLeftGallons  - 5);
    testRightGallons = Math.max(0, testRightGallons - 10);

    updateFuelGaugeMeaure(testLeftGallons, testRightGallons);

}, 2000);
*/

//const fuelSteps = [0, 5, 10, 15, 20, 26];
//
//function pickRandomFuel() {
//    return fuelSteps[Math.floor(Math.random() * fuelSteps.length)];
//}

