// ==================== STYLE B: PROFESSIONAL ALTIMETER ====================
// Features: Triple-needle logic, Kollsman Window, and High-Fidelity Graphics

function drawAltimeterStyleB(canvas, altitude = 0, pressureHg = 29.92) {

  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width / 2 - 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Shadow & Bezel
  ctx.beginPath();
  ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();
  
  // Outer metallic ring
  const grad = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + 5);
  grad.addColorStop(0, "#333");
  grad.addColorStop(0.5, "#666");
  grad.addColorStop(1, "#222");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 10;
  ctx.stroke();

  // Face Background
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#050505";
  ctx.fill();

  // 2. Kollsman Window (Pressure Setting)
  const kwX = cx + 60;
  const kwY = cy;
  ctx.fillStyle = "#000";
  ctx.fillRect(kwX - 25, kwY - 15, 50, 30);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  ctx.strokeRect(kwX - 25, kwY - 15, 50, 30);
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(pressureHg.toFixed(2), kwX, kwY + 6);
  ctx.font = "8px sans-serif";
  ctx.fillText("IN HG", kwX, kwY + 22);

  // 3. Low Altitude Crosshatch (Visible below 10,000ft)
  if (altitude < 10000) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 40, 0, Math.PI * 2);
    ctx.clip();
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    for(let i = -100; i < 100; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 100 + i*10, cy - 50);
        ctx.lineTo(cx + i*10, cy + 50);
        ctx.stroke();
    }
    ctx.restore();
  }

  // 4. Tick Marks
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 50; i++) {
    const angle = (i * 7.2 - 90) * Math.PI / 180;
    const isMajor = i % 5 === 0;
    const inner = isMajor ? r - 35 : r - 20;
    
    ctx.lineWidth = isMajor ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + inner * Math.cos(angle), cy + inner * Math.sin(angle));
    ctx.lineTo(cx + (r-5) * Math.cos(angle), cy + (r-5) * Math.sin(angle));
    ctx.stroke();

    if (isMajor) {
      const label = i / 5;
      const tx = cx + (r - 55) * Math.cos(angle);
      const ty = cy + (r - 55) * Math.sin(angle);
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, tx, ty);
    }
  }

  // 5. THE NEEDLES (Order: 10k, 1k, 100)
  const angles = {
    short: ((altitude / 100000) * 360 - 90) * Math.PI / 180, // 100k ft (rarely used but standard)
    medium: ((altitude / 10000) * 360 - 90) * Math.PI / 180, // 10k ft needle
    long: ((altitude / 1000) * 360 - 90) * Math.PI / 180    // 1k ft needle
  };

  // 10,000 ft needle (Thin with inverted triangle)
  drawNeedle(ctx, cx, cy, angles.medium, r - 45, 3, "#fff", true);

  // 1,000 ft needle (Short and fat)
  drawNeedle(ctx, cx, cy, angles.medium, r - 60, 8, "#fff");

  // 100 ft needle (Long and sleek)
  drawNeedle(ctx, cx, cy, angles.long, r - 15, 5, "#fff");

  // Center Hub
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.strokeStyle = "#666";
    ctx.stroke();

}

function drawNeedle(ctx, cx, cy, angle, length, width, color, isPointer = false) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();

  if (isPointer) {
    ctx.beginPath();
    ctx.moveTo(length, 0);
    ctx.lineTo(length - 15, -8);
    ctx.lineTo(length - 15, 8);
    ctx.fill();
  }
  ctx.restore();
}

// ==================== UPDATE LOGIC ====================
async function updateAltimeterTypeB() {

//    cLog("updateAltimeterTypeB");
    
    if (testMode === "pause") return;
    
  let altitude = 0;
  let pressure = 29.92;

  if (testMode === "on") {
    // Smoothly climb to 12,500 for testing
    altitude = (Date.now() / 10) % 15000;
  } else {
    try {
      const res = await fetch("http://10.0.0.218:5000/data");
      const d = await res.json();
      altitude = d.altitude;
      pressure = d.baro_setting || 29.92;
    } catch (e) { console.log(e); }
  }

  const canvas = document.getElementById("altGaugeTypeB");
  drawAltimeterStyleB(canvas, altitude, pressure);
}

// Initialize
const altGaugeTypeB = document.getElementById("altGaugeTypeB");

//drawAltimeterStyleB(altGaugeTypeB, 0, 29.92);

altGaugeTypeB.width = 400;
altGaugeTypeB.height = 400;
setInterval(updateAltimeterTypeB, 50);

window.addEventListener("DOMContentLoaded", () => {
    const altGaugeTypeB = document.getElementById("altGaugeTypeB");
    drawAltimeterStyleB(altGaugeTypeB, 0, 29.92);
});
