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
    gsdAltitude = 1200; // testing

    updateAltimeterHundredTypeC();      // big needle 100
    updateAltimeterThousandTypeC();   // small needle 1,000
    
    updateAltimeterDrum();       // digits
}


function updateAltimeterThousandTypeC() {

    const angle = altToAngle(gsdAltitude);  // from your JSON server

    document.getElementById("altThousandNeedleTypeC").style.transform =
        `translate(-50%, -90%) rotate(${angle}deg)`;
}


function updateAltimeterHundredTypeC() {
    const hundreds = gsdAltitude % 1000;  // 0–999
    const angle = (hundreds / 1000) * 360;

    document.getElementById("altHundredNeedleTypeC").style.transform =
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
