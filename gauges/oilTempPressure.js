/*

  Oil Temperature and Pressure
  
*/

/* ------------------------------
   Fuel Gauge (Left + Right)
   ------------------------------ */
let currentOilAngle  = 0;
let currentPressureAngle = 0;

// more fuel decreases the angle
// !!! change to degrees
const oilCalcTable = [
    { deg:  0, angle:   60 },
    { deg: 50, angle:   43 },
    { deg: 100, angle:   18 },
    { deg: 150, angle:  -10 },
    { deg: 200, angle:  -34 },
    { deg: 245, angle:  -58 }
];

function degreeToAngle(deg) {
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
    return oilCalcTable[oillCalcTable.length - 1].angle;
}

function updateOilGaugeMeasure(oil, pressure) {
    const targetOil      = degreeToAngle(oil);
    const targetPressure = degreeToAngle(pressure) * -1;

    const smooth = 0.12;  // tweak to taste

    currentOilAngle  += (targetOil  - currentOilAngle)  * smooth;
    currentPressureAngle += (targetPressure - currentPressureAngle) * smooth;

    document.getElementById("oilNeedle").style.transform =
        `translate(-50%, -90%) rotate(${currentOilAngle}deg)`;

    document.getElementById("pressureNeedle").style.transform =
        `translate(-50%, -90%) rotate(${currentPressureAngle}deg)`;
}

//updateFuelGauge(fuelLeftGallons, fuelRightGallons);

function updateOilPressureGauge() {

    // Goto these values every %40 seconds and stay there 7 seconds
//    gsdOilTemp = ([
//	0,100,50,150,200,250,null])[(
//	    Math.floor(((Date.now()/1000)%40)/7))]
//    	?? gsdOilTemp;  
    
    
//    gsdOilTemp = 100;
//    gsdOilPressure = 0;
    
    updateOilGaugeMeasure(gsdOilTemp, gsdOilPressure);

}


