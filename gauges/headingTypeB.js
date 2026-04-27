// ==================== FIXED & IMPROVED HEADING GAUGE ====================

let testHeadingBug = 10;
let headingBug = 0;

function drawHeadingTypeBFace(canvas, bugHeading = 0) {
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r  = canvas.width / 2 - 15;   // slightly smaller to leave room for bezel

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === Bezel (fixed outer ring) ===
  ctx.beginPath();
  ctx.arc(cx, cy, r + 12, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#444";
  ctx.stroke();

  // === Compass rose (rotated by heading via CSS later) ===
  for (let deg = 0; deg < 360; deg += 5) {
    const angle = (deg - 90) * Math.PI / 180;   // 0° = North at top (standard)

    const isMajor = (deg % 30 === 0);
    const inner = isMajor ? r - 52 : r - 32;
    const outer = r - 8;

    // Red marks at N, S, E, W (thicker + bright red)
    let tickColor = "#fff";
    let tickWidth = isMajor ? 4 : 2;
    if (deg % 90 === 0) {
      tickColor = "#ff2222";
      tickWidth = 7;
    }

    const x1 = cx + inner * Math.cos(angle);
    const y1 = cy + inner * Math.sin(angle);
    const x2 = cx + outer * Math.cos(angle);
    const y2 = cy + outer * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = tickWidth;
    ctx.strokeStyle = tickColor;
    ctx.stroke();

    // Labels (every 30°)
    if (isMajor) {
      const cardinalDeg = deg % 360;
      let labelText;
      if (cardinalDeg === 0) labelText = "N";
      else if (cardinalDeg === 90) labelText = "E";
      else if (cardinalDeg === 180) labelText = "S";
      else if (cardinalDeg === 270) labelText = "W";
      else labelText = String(Math.floor(deg / 10)).padStart(2, "0");

      const tx = cx + (r - 82) * Math.cos(angle);
      const ty = cy + (r - 82) * Math.sin(angle);

      ctx.fillStyle = "#fff";
      ctx.font = (cardinalDeg % 90 === 0) ? "bold 26px sans-serif" : "22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, tx, ty);
    }
  }

  // === Heading bug (yellow triangle on the rose) ===
  const bugDeg = bugHeading % 360;
  const bugAngle = (bugDeg - 90) * Math.PI / 180;
  const halfWidth = 9 * Math.PI / 180;        // ~9° wide
  const outerR = r - 6;                       // base sits near outer edge
  const innerR = r - 32;                      // tip points inward

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

function drawHeadingAirplane(canvas) {
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
/*
function drawHeadingAirplane(canvas) {
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // Nose
    ctx.beginPath();
    ctx.moveTo(cx, cy - 45);
    ctx.lineTo(cx, cy + 10);
    ctx.stroke();

    // Wings
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy - 5);
    ctx.lineTo(cx + 35, cy - 5);
    ctx.stroke();

    // Tail fins
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy + 10);
    ctx.lineTo(cx, cy + 25);
    ctx.lineTo(cx + 15, cy + 10);
    ctx.stroke();
}
*/

// ==================== UPDATE FUNCTION (unchanged except optional redraw support) ====================


async function updateHeadingTypeB() {
    let hdg = 0;
//    let headingBug;

    if (testMode === "pause") return;

  if (testMode === "on") {
      //      hdg = 110;                 // your test value
      hdg = Math.sin(Date.now() / 800) * 18;

      // slow drift: 0.03° per frame
      testHeadingBug = (testHeadingBug + 0.8) % 360;
      headingBug = testHeadingBug;     
//      cLog("test heading bug:", headingBug);
      
  } else {
    try {
	const res = await fetch(gServerIP);

//	cLog("heading res=",res);
	     
      const d = await res.json();
	hdg = d.heading || 0;
	hdg = radToDeg(hdg);
	
	headingBug = d.bug;

//	cLog("Heading set to:", hdg);
//	cLog("Heading bug to:", headingBug);

    } catch (e) {
      console.log("Heading fetch error:", e);
      return;
    }
  }

  // Rotate the entire card (standard heading-indicator technique)
  const canvas = document.getElementById("hdgGaugeTypeB");
  canvas.style.transform = `rotate(${-hdg}deg)`;

  // If you ever change the bug dynamically, just redraw (very cheap):
  drawHeadingTypeBFace(canvas, headingBug);
}

// ==================== INITIAL DRAW ====================

const canvas = document.getElementById("hdgGaugeTypeB");
drawHeadingTypeBFace(canvas, 0);   // initial draw with your chosen bug heading

// Call this whenever you want to move the heading bug later:
// drawHeadingFace(canvas, newBugValue);

drawHeadingAirplane(document.getElementById("hdgGaugeTypeB_airplane"));
