const altCalcTable = [
    { alt:     0, angle:   0 },
    { alt:  1000, angle:  36 },
    { alt:  2000, angle:  72 },
    { alt:  3000, angle: 108 },
    { alt:  4000, angle: 144 },
    { alt:  5000, angle: 180 },
    { alt:  6000, angle: 216 },
    { alt:  7000, angle: 252 },
    { alt:  8000, angle: 288 },
    { alt:  9000, angle: 324 },
    { alt: 10000, angle: 360 }
];

function altToAngle(alt) {
    for (let i = 0; i < altCalcTable.length - 1; i++) {
        const a = altCalcTable[i];
        const b = altCalcTable[i + 1];

        if (alt >= a.alt && alt <= b.alt) {
            const t = (alt - a.alt) / (b.alt - a.alt);
            return a.angle + t * (b.angle - a.angle);
        }
    }

    // clamp
    if (alt < altCalcTable[0].alt) return altCalcTable[0].angle;
    return altCalcTable[altCalcTable.length - 1].angle;
}

function updateAltimeterFullTypeC() {
//    gsdAltitude = 15100; // testing

    updateAltimeterHundredTypeC();      // big needle 100
    updateAltimeterThousandTypeC();   // small needle 1,000
    updateAltimeterTenThousandTypeC();   // optional short needle
    updateAltimeterDrum();       // digits

    updateAltimeterKollsman();
}


function updateAltimeterHundredTypeC() {
    const hundreds = gsdAltitude % 1000;  // 0–999
    const angle = (hundreds / 1000) * 360;

    document.getElementById("altHundredNeedleTypeC").style.transform =
        `translate(-50%, -90%) rotate(${angle}deg)`;
}
/*
function updateAltimeterThousandTypeC() {

    const angle = altToAngle(gsdAltitude);  // from your JSON server

    document.getElementById("altThousandNeedleTypeC").style.transform =
        `translate(-50%, -90%) rotate(${angle}deg)`;
	}
*/

function updateAltimeterThousandTypeC() {
    const thousands = gsdAltitude % 10000;  // 0–9999
    const angle = (thousands / 10000) * 360;

    document.getElementById("altThousandNeedleTypeC").style.transform =
        "translate(-50%, -90%) rotate(" + angle + "deg)";
}

function updateAltimeterTenThousandTypeC() {
    const tenk = gsdAltitude / 10000;  
    const angle = (tenk / 10) * 360;

    document.getElementById("altTenThousandNeedleTypeC").style.transform =
        `translate(-50%, -90%) rotate(${angle}deg)`;
}



function updateAltimeterDrum() {
    const alt = gsdAltitude;
    const thousands = Math.floor(alt / 1000);
    const hundreds  = Math.floor((alt % 1000) / 100);

    document.getElementById("altDrumThousandsTypeC").innerText = thousands;
    document.getElementById("altDrumHundredsTypeC").innerText  = hundreds;
}

/*
function updateAltimeter() {
    updateAltimeterTypeC();
    // updateAltimeterHundreds();   // optional
    // updateAltimeterDrum();       // optional
}
*/
function updateAltimeterHundreds() {
    var hundreds = gsdAltitude % 1000;   // 0–999
    var angle = (hundreds / 1000) * 360;

    document.getElementById("altHundredsNeedleTypeC").style.transform =
        "translate(-50%, -90%) rotate(" + angle + "deg)";
}

function updateAltimeterDrum() {
    var alt = gsdAltitude;

    var thousands = Math.floor(alt / 1000);
    var hundreds  = Math.floor((alt % 1000) / 100);

    document.getElementById("altDrumThousandsTypeC").innerText = thousands;
    document.getElementById("altDrumHundredsTypeC").innerText  = hundreds;
}


// *** pressure display gauges ***

function updateAltimeterKollsman() {
    var inhg = gsdPressure;
    var hpa  = Math.round(inhg * 33.8639);

    // Build 3 rows around the current inHg
    var inhgLow  = "<i>" + (inhg - 0.01).toFixed(2) + "</i>";
    var inhgMid  = "<b>" + inhg.toFixed(2) + "</b>";
    var inhgHigh = "<i>" + (inhg + 0.01).toFixed(2) + "</i>";

    document.getElementById("altKollsmanInHgDrum").innerHTML =
        inhgLow + "<br>" + inhgMid + "<br>" + inhgHigh;

    // Center the middle row
    document.getElementById("altKollsmanInHgDrum").style.transform =
        "translateY(-2px)";

    // Build 3 rows around the current hPa
    var hpaLow  = "<i>" + (hpa - 1) + "</i>";
    var hpaMid  = "<b>" + hpa + "</b>"; 
    var hpaHigh = "<i>" + (hpa + 1) + "</i>";

    document.getElementById("altKollsmanHpaDrum").innerHTML =
        hpaLow + "<br>" + hpaMid + "<br>" + hpaHigh;

    document.getElementById("altKollsmanHpaDrum").style.transform =
        "translateY(-2px)";
}

