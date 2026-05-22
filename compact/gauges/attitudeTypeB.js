/***
    Attitude Type B

**/

function drawAttitudeNeedleTypeB(pitchDeg, bankDeg) {
    const canvas = document.getElementById("attCanvasTypeB");
    const ctx    = canvas.getContext("2d");
    const w      = canvas.width;
    const h      = canvas.height;

//    const cx     = (w / 2) * 1.10; //10% more
//    const cy     = (h / 2) * 1.10;

    const cx     = (w / 2);
    const cy     = (h / 2);

//    cLog(w,h);
//    console.log(canvas.width, canvas.height);
//console.log(getComputedStyle(canvas).width, getComputedStyle(canvas).height);
//console.log(
//  "HTML:", canvas.getAttribute("width"), canvas.getAttribute("height"),
//  "JS:", canvas.width, canvas.height,
//  "CSS:", getComputedStyle(canvas).width, getComputedStyle(canvas).height
//);

    ctx.clearRect(0, 0, w, h);

    // ============================
    // 1. DRAW SKY / GROUND BACKGROUND
    // ============================
    ctx.save();
    ctx.translate(cx, cy);

//    ctx.scale(1.25, 1.25);   // scale EVERYTHING
//    ctx.translate(-cx, -cy);
 
 //   ctx.scale(1.05, 1.50); // scale 5% bigger
    
    // Roll the entire world
    const bankRad = bankDeg * Math.PI / 180;
    ctx.rotate(bankRad);

    // Pitch moves the horizon up/down
    const pitchPixels = pitchDeg * 3; // 3px per degree (tune to taste)
    ctx.translate(0, pitchPixels);

    
    // Draw sky
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(-w, -h*2, w*2, h*2);

    // Draw ground
    ctx.fillStyle = "#c47a2c";
    ctx.fillRect(-w, 0, w*2, h*2);
    
    /*
const scale = 1.50;   // 5% bigger

// Sky
ctx.fillStyle = "#4aa3ff";
ctx.fillRect(-w * scale, -h * 2 * scale, w * 2 * scale, h * 2 * scale);

// Ground
ctx.fillStyle = "#c47a2c";
ctx.fillRect(-w * scale, 0, w * 2 * scale, h * 2 * scale);
    */
    
    // Draw horizon line
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-w, 0);
    ctx.lineTo(w, 0);
    ctx.stroke();

    // ============================
    // 2. DRAW PITCH LADDER
    // ============================
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    for (let p = -30; p <= 30; p += 5) {
        const y = -(p * 3); // same scale as pitchPixels

        ctx.beginPath();
        if (p % 10 === 0) {
            // long line + number
            ctx.moveTo(-40, y);
            ctx.lineTo(40, y);

            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(Math.abs(p), 50, y + 5);
        } else {
            // short line
            ctx.moveTo(-25, y);
            ctx.lineTo(25, y);
        }
        ctx.stroke();
    }

    ctx.restore();

    // ============================
    // 3. DRAW BANK POINTER + INDEX MARKS
    // ============================
    ctx.save();
    ctx.translate(cx, cy);

    // Bank pointer rotates with bank
    ctx.rotate(bankRad);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    // Pointer (triangle)
    ctx.beginPath();
    ctx.moveTo(0, -cy + 10);
    ctx.lineTo(-10, -cy + 30);
    ctx.lineTo(10, -cy + 30);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

    // Bank index marks (fixed)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    const bankMarks = [ -30, -20, -10, 10, 20, 30 ];
    bankMarks.forEach(deg => {
        const rad = deg * Math.PI / 180;
        const x1 = Math.sin(rad) * (cy - 20);
        const y1 = -Math.cos(rad) * (cy - 20);
        const x2 = Math.sin(rad) * (cy - 35);
        const y2 = -Math.cos(rad) * (cy - 35);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });

    ctx.restore();

    // ============================
    // 4. DRAW FIXED AIRPLANE SYMBOL
    // ============================
    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;

    // Wings
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();

    // Fuselage
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 40);
    ctx.stroke();

    // Dot
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
}


function updateAttitudeTypeB() {
    // These should come from your SimConnect / stub

    const pitch = radToDeg(gsdPitchRad);
    const roll  = radToDeg(gsdRollRad);

//    const pitch = gsdPitchDeg;  // e.g. PLANE_PITCH_DEGREES
//    const bank  = gsdBankDeg;   // e.g. PLANE_BANK_DEGREES

    drawAttitudeNeedleTypeB(pitch, roll);
}

//initial draw
drawAttitudeNeedleTypeB(0,0);
