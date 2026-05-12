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


function updateAltimeterTypeB() {
    const angle = altToAngle(gsdAltitude);  // from your JSON server

    document.getElementById("altNeedleTypeB").style.transform =
        `translate(-50%, -90%) rotate(${angle}deg)`;
}


function updateAltimeterHundreds() {
    const hundreds = gsdAltitude % 1000;  // 0–999
    const angle = (hundreds / 1000) * 360;

    document.getElementById("altHundredsNeedle").style.transform =
        `translate(-50%, -90%) rotate(${angle}deg)`;
}


function updateAltimeterDrum() {
    const alt = gsdAltitude;
    const thousands = Math.floor(alt / 1000);
    const hundreds  = Math.floor((alt % 1000) / 100);

    document.getElementById("altDrumThousands").innerText = thousands;
    document.getElementById("altDrumHundreds").innerText  = hundreds;
}

<div id="altGauge" style="position:relative; width:300px; height:300px;">

    <img src="images/altimeter_background.png"
         style="position:absolute; width:100%; height:100%;">

    <div id="altNeedleTypeB"
         style="
            position:absolute;
            width:4px;
            height:45%;
            background:red;
            left:50%;
            top:50%;
            transform-origin:50% 90%;
            transform:translate(-50%, -90%) rotate(0deg);
            z-index:2;
         ">
    </div>

</div>

<div id="altHundredsNeedle" ...></div>

function updateAltimeter() {
    updateAltimeterTypeB();
    // updateAltimeterHundreds();   // optional
    // updateAltimeterDrum();       // optional
}
