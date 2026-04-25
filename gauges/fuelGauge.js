// ==================== FUEL GAUGE ====================
// Same dark-bezel, vibrant aviation style as your other gauges

function drawFuelFace(canvas, fuelGallons = 0, maxGallons = 56) {
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

  const normalized = Math.max(Math.min(fuelGallons, maxGallons), 0) / maxGallons;

  // === Fuel arc (green → yellow → red) ===
  const startAngle = Math.PI * 0.75;   // 135°
  const endAngle   = Math.PI * 2.25;   // 405°

  ctx.lineWidth = 28;

  // Green (safe)
  ctx.strokeStyle = "#22ff44";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 28, startAngle, startAngle + (endAngle - startAngle) * 0.7);
  ctx.stroke();

  // Yellow (caution)
  ctx.strokeStyle = "#ffdd22";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 28, startAngle + (endAngle - startAngle) * 0.7,
                       startAngle + (endAngle - startAngle) * 0.88);
  ctx.stroke();

  // Red (low fuel)
  ctx.strokeStyle = "#ff2222";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 28, startAngle + (endAngle - startAngle) * 0.88, endAngle);
  ctx.stroke();

  // === Tick marks ===
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 3.5;
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 10; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / 10);
    const x1 = cx + (r - 15) * Math.cos(angle);
    const y1 = cy + (r - 15) * Math.sin(angle);
    const x2 = cx + (r - 52) * Math.cos(angle);
    const y2 = cy + (r - 52) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (i % 2 === 0) {
      const label = Math.round(maxGallons * (i / 10));
      const lx = cx + (r - 78) * Math.cos(angle);
      const ly = cy + (r - 78) * Math.sin(angle);
      ctx.fillText(label.toString(), lx, ly);
    }
  }

  // === Needle ===
  const needleAngle = startAngle + (endAngle - startAngle) * normalized;

  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.shadowColor = "#ffff00";
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + (r - 38) * Math.cos(needleAngle),
    cy + (r - 38) * Math.sin(needleAngle)
  );
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Needle hub
  ctx.fillStyle = "#222222";
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffff00";
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();

  // === Digital fuel readout ===
  const gallons = Math.round(fuelGallons);
  ctx.fillStyle = (gallons < maxGallons * 0.2) ? "#ff4444" : "#00ffcc";
  ctx.font = "bold 52px monospace";
  ctx.textAlign = "center";
  ctx.fillText(gallons.toString().padStart(2, "0"), cx, cy + 92);

  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("GALLONS", cx, cy + 128);

  // Low fuel warning text
  if (gallons < maxGallons * 0.15) {
    ctx.fillStyle = "#ff2222";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("LOW FUEL", cx, cy - 105);
  }
}

// ==================== UPDATE FUNCTION ====================
async function updateFuel() {

    if (testMode === "pause") return;
    
    let fuel = 0;
  const maxGallons = 56;   // ← Change for your aircraft (e.g. 92 for Cessna 182, 26 for 172, etc.)

  if (testMode === "on") {
    // Nice demo: slowly decreasing then refilling
    fuel = maxGallons * (0.6 + Math.sin(Date.now() / 3000) * 0.35);
  } else {
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
      fuel = d.fuel || d.fuel_gallons || d.fuel_total || 0;
    } catch (e) {
      console.log("Fuel fetch error:", e);
    }
  }

  const canvas = document.getElementById("fuelCanvas");
  drawFuelFace(canvas, fuel, maxGallons);
}

// ==================== INIT ====================
const fuelCanvas = document.getElementById("fuelCanvas");
fuelCanvas.width = 360;
fuelCanvas.height = 360;

drawFuelFace(fuelCanvas, 0);
setInterval(updateFuel, 150);   // updates every 150ms

window.addEventListener("DOMContentLoaded", () => {
    const fuelCanvas = document.getElementById("fuelCanvas");
    drawFuelFace(fuelCanvas, 0, 30);
});
