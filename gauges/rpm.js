
/*
   RPM gauge
 */

/*
const rpmCalcTable = [
    { rpm:    0, angle:   0 },
    { rpm:  500, angle:  25 },
    { rpm: 1000, angle:  70 },
    { rpm: 1500, angle: 120 },
    { rpm: 2000, angle: 180 },
    { rpm: 2500, angle: 240 },
    { rpm: 3000, angle: 300 }
];
*/

const rpmCalcTable = [
    { rpm:    0, angle:  - 125 },
    { rpm:  500, angle:  - 90  },
    { rpm: 1000, angle:  - 54  },
    { rpm: 1500, angle:  - 18  },
    { rpm: 2000, angle:    18  },
    { rpm: 2500, angle:    54  },
    { rpm: 3000, angle:    90  },
    { rpm: 3500, angle:    125 }
];

function rpmToAngle(rpm) {
    for (let i = 0; i < rpmCalcTable.length - 1; i++) {
        const a = rpmCalcTable[i];
        const b = rpmCalcTable[i + 1];

        if (rpm >= a.rpm && rpm <= b.rpm) {
            const t = (rpm - a.rpm) / (b.rpm - a.rpm);
            return a.angle + t * (b.angle - a.angle);
        }
    }

    if (rpm < rpmCalcTable[0].rpm) return rpmCalcTable[0].angle;
    return rpmCalcTable[rpmCalcTable.length - 1].angle;
}

let currentRpmAngle = 0;

function smoothRPM(targetAngle) {
    currentRpmAngle += (targetAngle - currentRpmAngle) * 0.15;
    return currentRpmAngle;
}

async function updateRPMGauge() {

//    gsdRpm = 3000 ; //testing only
    
    const angle = rpmToAngle(gsdRpm);
    const smoothAngle = smoothRPM(angle);

    document.getElementById("rpmNeedle").style.transform =
        `translate(-50%, -90%) rotate(${smoothAngle}deg)`;
}
