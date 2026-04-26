// ==================== VERTICAL SPEED INDICATOR (VSI) ====================
// Same dark-bezel, vibrant aviation style

function drawVsiFace(canvas, vsi = 0) {
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width / 2 - 22;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === Outer dark bezel ===
  ctx.beginPath();
  ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
  ctx.fillStyle = "#111111";
  ctx.fill();
  ctx.lineWidth = 18;
  ctx.strokeStyle = "#555555";
  ctx.stroke();

  // === Inner background ===
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#0a0a0a";
  ctx.fill();

  const maxVsi = 2000; // fpm ±
  const normalized = Math.max(Math.min(vsi, maxVsi), -maxVsi) / maxVsi;

  // === Scale arc (left climb, right descent) ===
  const startAngle = Math.PI * 0.65;   // ~117°
  const endAngle   = Math.PI * 2.35;   // ~423°

  ctx.lineWidth = 24;

  // Climb side (green-cyan)
  ctx.strokeStyle = "#22ffcc";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 32, startAngle, Math.PI * 1.5);
  ctx.stroke();

  // Descent side (orange-red)
  ctx.strokeStyle = "#ff8844";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 32, Math.PI * 1.5, endAngle);
  ctx.stroke();

  // === Tick marks & labels ===
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 3.5;
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = -10; i <= 10; i++) {
    if (i === 0) continue;
    const norm = i / 10;
    const angle = startAngle + (endAngle - startAngle) * (norm * 0.5 + 0.5);

    const x1 = cx + (r - 18) * Math.cos(angle);
    const y1 = cy + (r - 18) * Math.sin(angle);
    const x2 = cx + (r - 55) * Math.cos(angle);
    const y2 = cy + (r - 55) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (Math.abs(i) % 2 === 0) {
      const label = Math.abs(i * 200); // 200, 400 ... 2000
      const lx = cx + (r - 78) * Math.cos(angle);
      const ly = cy + (r - 78) * Math.sin(angle) + (i > 0 ? -8 : 8);
      ctx.fillText(label.toString(), lx, ly);
    }
  }

  // Zero line (thick)
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 75, cy);
  ctx.lineTo(cx + 75, cy);
  ctx.stroke();

  // === Needle ===
  const needleAngle = (normalized * 110) * Math.PI / 180; // ±110° swing

  ctx.strokeStyle = "#ffff00";   // bright yellow needle
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.shadowColor = "#ffff00";
  ctx.shadowBlur = 18;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + (r - 38) * Math.sin(needleAngle),
    cy - (r - 38) * Math.cos(needleAngle)
  );
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Needle hub
  ctx.fillStyle = "#222222";
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffff00";
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();

  // === Digital readout (big, colored) ===
  const absVsi = Math.abs(Math.round(vsi));
  ctx.font = "bold 48px monospace";
  ctx.textAlign = "center";

  if (vsi > 50) {
    ctx.fillStyle = "#22ffcc";   // climb = cyan
    ctx.fillText("▲ " + absVsi, cx, cy + 105);
  } else if (vsi < -50) {
    ctx.fillStyle = "#ff8844";   // descent = orange
    ctx.fillText("▼ " + absVsi, cx, cy + 105);
  } else {
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("0", cx, cy + 105);
  }

  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("FT/MIN", cx, cy + 138);

  // Small "UP" / "DOWN" labels
  ctx.font = "bold 15px sans-serif";
  ctx.fillStyle = "#22ffcc";
  ctx.fillText("UP", cx - 92, cy - 88);
  ctx.fillStyle = "#ff8844";
  ctx.fillText("DOWN", cx + 92, cy - 88);
}

// ==================== UPDATE FUNCTION ====================
async function updateVsi() {

    if (testMode === "pause") return;

    let vsi = 0;

  if (testMode === "on") {
    // Nice realistic demo: gentle climbs & descents
    vsi = Math.sin(Date.now() / 1400) * 950 + Math.sin(Date.now() / 3200) * 650;
  } else {
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
      vsi = d.verticalSpeed || 0;
    } catch (e) {
      console.log("VSI fetch error:", e);
    }
  }

//    cLog("vsi",vsi);
    
  const canvas = document.getElementById("vsiCanvas");
  drawVsiFace(canvas, vsi);
}

// ==================== INIT ====================
const vsiCanvas = document.getElementById("vsiCanvas");
vsiCanvas.width = 360;
vsiCanvas.height = 360;

drawVsiFace(vsiCanvas, 0);
setInterval(updateVsi, 80);   // smooth updates
