/*

  Oil Temperature and Pressure
  
*/

/* ------------------------------
   Fuel Gauge (Left + Right)
   ------------------------------ */
let currentOilAngle  = 0;
let currentPressureAngle = 0;

// more fuel decreases the angle
const oilCalcTable = [
    { deg:  0, angle:   60 },
    { deg: 50, angle:   43 },
    { deg: 100, angle:   16 },
    { deg: 150, angle:  -10 },
    { deg: 200, angle:  -34 },
    { deg: 245, angle:  -58 }
];

function degreeToAngleOil(deg) {
    for (let i = 0; i < oilCalcTable.length - 1; i++) {
        const a = oilCalcTable[i];
        const b = oilCalcTable[i + 1];

        if (deg >= a.deg && deg <= b.deg) {
            const t = (deg - a.deg) / (b.deg - a.deg);
            return a.angle + t * (b.angle - a.angle);
        }
    }

    // clamp
    if (deg < oilCalcTable[0].gal) return oilCalcTable[0].angle;
    return oilCalcTable[oilCalcTable.length - 1].angle;
}

const pressureCalcTable = [
    { deg:  0, angle:   60 },
    { deg: 20, angle:   38 },
    { deg: 40, angle:   14 },
    { deg: 60, angle:  -10 },
    { deg: 80, angle:  -34 },
    { deg: 100, angle:  -58 },
    { deg: 110, angle:  -65 }
];

function degreeToAnglePressure(deg) {
    for (let i = 0; i < pressureCalcTable.length - 1; i++) {
        const a = pressureCalcTable[i];
        const b = pressureCalcTable[i + 1];

        if (deg >= a.deg && deg <= b.deg) {
            const t = (deg - a.deg) / (b.deg - a.deg);
            return a.angle + t * (b.angle - a.angle);
        }
    }

    // clamp
    if (deg < pressureCalcTable[0].gal) return pressureCalcTable[0].angle;
    return pressureCalcTable[pressureCalcTable.length - 1].angle;
}

function updateOilGaugeMeasure(oil, pressure) {
    const targetOil      = degreeToAngleOil(oil);
    const targetPressure = degreeToAnglePressure(pressure) * -1;

    const smooth = 0.12;  // tweak to taste

    currentOilAngle  += (targetOil  - currentOilAngle)  * smooth;
    currentPressureAngle += (targetPressure - currentPressureAngle) * smooth;

    document.getElementById("oilNeedle").style.transform =
        `translate(-50%, -90%) rotate(${currentOilAngle}deg)`;

    document.getElementById("pressureNeedle").style.transform =
        `translate(-50%, -90%) rotate(${currentPressureAngle}deg)`;

    document.getElementById("oilTempValue").textContent =
    Math.round(gsdOilTemp) + "°F";

    document.getElementById("oilPressureValue").textContent =
	Math.round(gsdOilPressure) + " PSI";

}

//updateFuelGauge(fuelLeftGallons, fuelRightGallons);

function updateOilPressureGauge() {

    /* testing
    // Goto these values every %40 seconds and stay there 7 seconds
    gsdOilTemp = ([
	0,100,50,150,200,250,null])[(
	    Math.floor(((Date.now()/1000)%40)/7))]
    	?? gsdOilTemp;  

    gsdOilPressure = ([
	0,20,40,60,80,100,110,null])[(
	    Math.floor(((Date.now()/1000)%60)/8))]
    	?? gsdOilTemp;  

    */
    
//    gsdOilTemp = 250;
//    gsdOilPressure = 0;
    	// Goto these values every %40 seconds and stay there 7 seconds
//	gsdOilTemp = ([0,10,20,25,50,30,35,40,45,null])[(
//	    Math.floor(((Date.now()/1000)%40)/7))]
//	    ?? gsdManifold;  

    updateOilGaugeMeasure(gsdOilTemp, gsdOilPressure);

}


