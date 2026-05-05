
/* ------------------------------
   Speed gauge TypeB
   ------------------------------ */



const asiCalcTable = [
    { kts:   0, angle:   0 },
    { kts:  40, angle:  20 },
    { kts:  60, angle:  60 },
    { kts: 100, angle: 135 },
    { kts: 140, angle: 221 },
    { kts: 200, angle: 340 }
];

//let currentAngleSpeedTypeB = 0;   // what the needle is actually showing

function ktsToAngle(kts) {
    for (let i = 0; i < asiCalcTable.length - 1; i++) {
        const a = asiCalcTable[i];
        const b = asiCalcTable[i + 1];

        if (kts >= a.kts && kts <= b.kts) {
            const t = (kts - a.kts) / (b.kts - a.kts);
            return a.angle + t * (b.angle - a.angle);
        }
    }

    // clamp outside range
    if (kts < asiCalcTable[0].kts) return asiCalcTable[0].angle;
    return asiCalcTable[asiCalcTable.length - 1].angle;
}

//let lastChange = 0;  // for testing

    
/*
    // for testing
    const now = Date.now();
    if (now - lastChange > 3000) {
	if      (gsdKts === 0)   gsdKts = 40;
	else if (gsdKts === 40)  gsdKts = 60;
	else if (gsdKts === 60)  gsdKts = 100;
	else if (gsdKts === 100) gsdKts = 160;
	else if (gsdKts === 160) gsdKts = 200;
	else                     gsdKts = 0;

	lastChange = now;
    }
*/
// this one works but not smooth
async function updateASITypeB() {
    
//    gsdKts = 180;
    
    const angle = ktsToAngle(gsdKts);
    
    document.getElementById("asiNeedleTypeB").style.transform =
	`translate(-50%, -90%) rotate(${angle}deg)`;
        
}


