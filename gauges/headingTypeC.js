
// ==================== FIXED & IMPROVED HEADING GAUGE ====================


function drawHeadingBugTypeCFace(bugHeading = 0) {

    const canvas = document.getElementById("hdgGaugeBugTypeC");
    
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r  = canvas.width / 2 - 15;   // slightly smaller to leave room for bezel

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === Heading bug (yellow triangle on the rose) ===
  const bugDeg = bugHeading % 360;
  const bugAngle = (bugDeg - 90) * Math.PI / 180;
  const halfWidth = 9 * Math.PI / 180;        // ~9° wide
  const outerR = r + 8;                       // base sits near outer edge ..was -6
  const innerR = r - 10;                      // tip points inward         ..was -32

  // Left base point
  const lx = cx + outerR * Math.cos(bugAngle - halfWidth);
  const ly = cy + outerR * Math.sin(bugAngle - halfWidth);
  // Right base point
  const rx = cx + outerR * Math.cos(bugAngle + halfWidth);
  const ry = cy + outerR * Math.sin(bugAngle + halfWidth);
  // Tip (closer to center)
  const tx = cx + innerR * Math.cos(bugAngle);
  const ty = cy + innerR * Math.sin(bugAngle);

  ctx.fillStyle = "#ffdd00";   // bright yellow bug
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(lx, ly);
  ctx.lineTo(tx, ty);
  ctx.lineTo(rx, ry);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Optional: small inner line for extra visibility
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(cx + (r - 45) * Math.cos(bugAngle), cy + (r - 45) * Math.sin(bugAngle));
  ctx.stroke();
}

function drawHeadingAirplaneTypeC() {

    const canvas = document.getElementById("hdgGaugeTypeC_airplane");

    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(cx, cy - 40);   // nose
    ctx.lineTo(cx, cy + 20);   // tail
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 25, cy);   // left wing
    ctx.lineTo(cx + 25, cy);   // right wing
    ctx.stroke();
}


async function updateHeadingTypeC() {

    dei("headingDialTypeC").style.transform = `rotate(${-gsdHeading}deg)`;
    drawHeadingBugTypeCFace(gsdHeadingBug);

}


//initial draw
drawHeadingAirplaneTypeC();
drawHeadingBugTypeCFace(0);


