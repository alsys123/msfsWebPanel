// ==================== ATTITUDE INDICATOR (Artificial Horizon) ====================
// Same dark-bezel style as your heading gauge, with vibrant sky/ground colors

function drawAttitudeFace(canvas, pitch = 0, roll = 0) {
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width / 2 - 20;   // inner instrument radius

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === Outer dark bezel ===
  ctx.beginPath();
  ctx.arc(cx, cy, r + 22, 0, Math.PI * 2);
  ctx.fillStyle = "#111111";
  ctx.fill();
  ctx.lineWidth = 18;
  ctx.strokeStyle = "#555555";
  ctx.stroke();

  // Save for roll transformation
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(roll * Math.PI / 180);   // roll rotation
  ctx.translate(-cx, -cy);

  // Pitch offset (positive pitch = nose up = horizon moves down)
  const pitchPx = (pitch / 30) * (r * 0.55);   // scale factor for visibility

  // === Sky (blue gradient) ===
  const skyGrad = ctx.createLinearGradient(cx, cy - r - pitchPx, cx, cy - pitchPx);
  skyGrad.addColorStop(0, "#1e90ff");   // vibrant sky blue
  skyGrad.addColorStop(1, "#87ceeb");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(cx - r - 10, cy - r - pitchPx - 10, (r + 20) * 2, r * 2 + pitchPx + 20);

  // === Ground (earthy brown gradient) ===
  const groundGrad = ctx.createLinearGradient(cx, cy - pitchPx, cx, cy + r - pitchPx);
  groundGrad.addColorStop(0, "#8B5A2B");
  groundGrad.addColorStop(1, "#5C4033");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(cx - r - 10, cy - pitchPx, (r + 20) * 2, r * 2 + 20);

  // === Horizon line (thick white) ===
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - r - 10, cy - pitchPx);
  ctx.lineTo(cx + r + 10, cy - pitchPx);
  ctx.stroke();

  // === Pitch ladder (nice clean lines) ===
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let p = -60; p <= 60; p += 5) {
    if (p === 0) continue;
    const y = cy - pitchPx - (p * (r * 0.55) / 30);

    const length = (Math.abs(p) % 10 === 0) ? 110 : 65;
    const weight = (Math.abs(p) % 10 === 0) ? 4 : 2.5;

    ctx.lineWidth = weight;
    ctx.beginPath();
    ctx.moveTo(cx - length / 2, y);
    ctx.lineTo(cx + length / 2, y);
    ctx.stroke();

    if (Math.abs(p) % 10 === 0) {
      ctx.fillText(Math.abs(p).toString(), cx - length / 2 - 28, y);
      ctx.fillText(Math.abs(p).toString(), cx + length / 2 + 28, y);
    }
  }

  ctx.restore();   // end roll transformation

  // === Fixed aircraft symbol (wings + dot) - always level ===
  ctx.strokeStyle = "#ffdd00";   // bright yellow/gold
  ctx.fillStyle = "#ffdd00";
  ctx.lineWidth = 4;

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();

  // Wings (standard attitude wings)
  ctx.beginPath();
  ctx.moveTo(cx - 72, cy);
  ctx.lineTo(cx - 18, cy);
  ctx.lineTo(cx - 18, cy - 9);
  ctx.lineTo(cx - 55, cy - 9);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 72, cy);
  ctx.lineTo(cx + 18, cy);
  ctx.lineTo(cx + 18, cy - 9);
  ctx.lineTo(cx + 55, cy - 9);
  ctx.stroke();

  // Small fuselage line
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy);
  ctx.lineTo(cx + 12, cy);
  ctx.stroke();

  // === Roll scale at top (fixed) ===
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.font = "bold 16px sans-serif";

  for (let ang = -60; ang <= 60; ang += 15) {
    const rad = (ang - 90) * Math.PI / 180;   // 0° at top
    const x1 = cx + (r + 12) * Math.cos(rad);
    const y1 = cy + (r + 12) * Math.sin(rad);
    const x2 = cx + (r + 28) * Math.cos(rad);
    const y2 = cy + (r + 28) * Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (Math.abs(ang) % 30 === 0 && ang !== 0) {
      ctx.fillText(Math.abs(ang).toString(), 
        cx + (r + 42) * Math.cos(rad), 
        cy + (r + 42) * Math.sin(rad) + 5);
    }
  }

  // Roll pointer (triangle at top)
  ctx.fillStyle = "#ff2222";   // red pointer
  ctx.beginPath();
  ctx.moveTo(cx, cy - r - 8);
  ctx.lineTo(cx - 12, cy - r + 18);
  ctx.lineTo(cx + 12, cy - r + 18);
  ctx.closePath();
  ctx.fill();
}

// ==================== UPDATE FUNCTION ====================
async function updateAttitude() {

    if (testMode === "pause") return;

 //   cLog("update Attitude");
    
  let pitch = 0, roll = 0;

  if (testMode === "on") {
    // Nice demo values
    pitch = Math.sin(Date.now() / 800) * 18;
    roll = Math.sin(Date.now() / 1400) * 35;
  } else {
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
	let pitchRad = d.pitch || 0;
	let rollRad = d.roll || 0;

	pitch = radToDeg(pitchRad);
	roll  = radToDeg(rollRad);
	
//	cLog("Pitch and Roll:",pitch,roll);
	
    } catch (e) {
      console.log("Attitude fetch error:", e);
    }
  }

  const canvas = document.getElementById("attitudeCanvas");
  drawAttitudeFace(canvas, pitch, roll);
}

// ==================== INIT ====================
const attCanvas = document.getElementById("attitudeCanvas");
attCanvas.width = 360;
attCanvas.height = 360;

// Initial draw
drawAttitudeFace(attCanvas, 0, 0);

// Update loop
setInterval(updateAttitude, 50);   // smooth 20 Hz
