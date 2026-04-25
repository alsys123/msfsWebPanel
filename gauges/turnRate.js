// ==================== TURN RATE INDICATOR (Turn Coordinator) ====================
// Same dark-bezel, vibrant aviation style as your other gauges

function drawTurnRateFace(canvas, turnRate = 0, slipSkid = 0) {
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

  // === Turn rate scale arc ===
  const startAngle = Math.PI * 0.8;   // ~144°
  const endAngle   = Math.PI * 2.2;   // ~396°

  ctx.lineWidth = 22;
  
  // Left standard rate mark area
  ctx.strokeStyle = "#44ccff";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 28, startAngle, startAngle + (endAngle - startAngle) * 0.25);
  ctx.stroke();

  // Right standard rate mark area
  ctx.beginPath();
  ctx.arc(cx, cy, r - 28, endAngle - (endAngle - startAngle) * 0.25, endAngle);
  ctx.stroke();

  // Tick marks
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 17px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = -6; i <= 6; i++) {
    if (i === 0) continue;
    const normalized = i / 6;
    const angle = startAngle + (endAngle - startAngle) * (normalized + 0.5) * 0.5; // centered

    const x1 = cx + (r - 18) * Math.cos(angle);
    const y1 = cy + (r - 18) * Math.sin(angle);
    const x2 = cx + (r - 52) * Math.cos(angle);
    const y2 = cy + (r - 52) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (Math.abs(i) === 3 || Math.abs(i) === 6) {
      const lx = cx + (r - 78) * Math.cos(angle);
      const ly = cy + (r - 78) * Math.sin(angle);
      ctx.fillText(Math.abs(i).toString(), lx, ly);
    }
  }

  // === TURN RATE NEEDLE ===
  const maxRate = 6; // degrees per second
  const clampedRate = Math.max(Math.min(turnRate, maxRate), -maxRate);
  const needleAngle = (clampedRate / maxRate) * 75 * Math.PI / 180; // ±75° swing

  ctx.strokeStyle = "#ffdd00";   // bright yellow needle
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.shadowColor = "#ffff00";
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(cx, cy + 12);
  ctx.lineTo(
    cx + (r - 45) * Math.sin(needleAngle),
    cy - (r - 45) * Math.cos(needleAngle)
  );
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Needle hub
  ctx.fillStyle = "#222222";
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffdd00";
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();

  // === AIRCRAFT SYMBOL (banks with turn rate) ===
  const bankAngle = Math.max(Math.min(turnRate * 8, 35), -35); // visual bank

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(bankAngle * Math.PI / 180);

  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  // Wings
  ctx.beginPath();
  ctx.moveTo(-68, 0);
  ctx.lineTo(68, 0);
  ctx.stroke();

  // Fuselage
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(0, 28);
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(-12, 18);
  ctx.lineTo(12, 18);
  ctx.stroke();

  ctx.restore();

  // === SLIP/SKID BALL ===
  const ballX = Math.max(Math.min(slipSkid * 38, 58), -58); // ±58px range

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx + ballX, cy + 98, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ball highlight
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.arc(cx + ballX - 5, cy + 94, 6, 0, Math.PI * 2);
  ctx.fill();

  // Slip/Skid labels
  ctx.font = "bold 15px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("L", cx - 88, cy + 98);
  ctx.fillText("R", cx + 88, cy + 98);

  // === Digital readout (optional) ===
  ctx.fillStyle = "#00ffcc";
  ctx.font = "bold 22px monospace";
  ctx.textAlign = "center";
  ctx.fillText(turnRate.toFixed(1) + "°/s", cx, cy - 92);
}

// ==================== UPDATE FUNCTION ====================
async function updateTurnRate() {
  let turnRate = 0;
  let slipSkid = 0;

    if (testMode === "pause") return;

  if (testMode === "on") {
    // Nice lively demo
    turnRate = Math.sin(Date.now() / 900) * 4.2;
    slipSkid = Math.sin(Date.now() / 650) * 1.1;
  } else {
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
      turnRate = d.turn_rate || d.turnrate || 0;
      slipSkid = d.slip || d.skid || 0;
    } catch (e) {
      console.log("Turn rate fetch error:", e);
    }
  }

  const canvas = document.getElementById("turnRateCanvas");
  drawTurnRateFace(canvas, turnRate, slipSkid);
}

// ==================== INIT ====================
const turnCanvas = document.getElementById("turnRateCanvas");
turnCanvas.width = 360;
turnCanvas.height = 360;

drawTurnRateFace(turnCanvas, 0, 0);
setInterval(updateTurnRate, 60);   // smooth updates
