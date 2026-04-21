// ==================== ADF INDICATOR ====================
// Same dark-bezel, vibrant aviation style as your other gauges

function drawAdfFace(canvas, relativeBearing = 0, frequency = 0, signalValid = true) {
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

  // === Fixed Compass Rose ===
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let deg = 0; deg < 360; deg += 10) {
    const angle = (deg - 90) * Math.PI / 180;
    const inner = r - 38;
    const outer = r - 12;

    ctx.beginPath();
    ctx.moveTo(cx + inner * Math.cos(angle), cy + inner * Math.sin(angle));
    ctx.lineTo(cx + outer * Math.cos(angle), cy + outer * Math.sin(angle));
    ctx.stroke();

    if (deg % 30 === 0) {
      const tx = cx + (r - 62) * Math.cos(angle);
      const ty = cy + (r - 62) * Math.sin(angle);
      let label = deg === 0 ? "N" : deg === 90 ? "E" : deg === 180 ? "S" : deg === 270 ? "W" : String(deg);
      ctx.fillText(label, tx, ty);
    }
  }

  // === ADF Needle (rotates to station) ===
  const needleAngle = (relativeBearing - 90) * Math.PI / 180;

  ctx.strokeStyle = "#ffdd00";           // bright yellow ADF needle
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.shadowColor = "#ffff00";
  ctx.shadowBlur = 15;

  // Long needle pointing TO the station
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + (r - 28) * Math.cos(needleAngle),
    cy + (r - 28) * Math.sin(needleAngle)
  );
  ctx.stroke();

  // Short tail (opposite direction)
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx - (r - 65) * Math.cos(needleAngle),
    cy - (r - 65) * Math.sin(needleAngle)
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

  // === Digital Bearing Display ===
  const bearing = Math.round(((relativeBearing % 360) + 360) % 360);
  ctx.fillStyle = signalValid ? "#00ffcc" : "#888888";
  ctx.font = "bold 46px monospace";
  ctx.textAlign = "center";
  ctx.fillText(bearing.toString().padStart(3, "0"), cx, cy + 98);

  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText("° REL", cx, cy + 128);

  // ADF Frequency
  ctx.fillStyle = "#00ccff";
  ctx.font = "bold 22px monospace";
  ctx.fillText((frequency / 1000).toFixed(1) + " kHz", cx, cy - 105);

  // Signal status
  if (!signalValid) {
    ctx.fillStyle = "#ff2222";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("ADF", cx - 85, cy - 72);
    ctx.fillText("NO SIGNAL", cx + 85, cy - 72);
  } else {
    ctx.fillStyle = "#22ff88";
    ctx.font = "bold 19px sans-serif";
    ctx.fillText("ADF", cx, cy - 138);
  }

  // Fixed aircraft symbol at center (wings)
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 42, cy);
  ctx.lineTo(cx + 42, cy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - 14);
  ctx.lineTo(cx, cy + 18);
  ctx.stroke();
}

// ==================== UPDATE FUNCTION ====================
async function updateAdf() {
  let relativeBearing = 0;
  let frequency = 375;          // example in kHz
  let signalValid = true;

  if (testMode === "on") {
    // Nice sweeping demo
    relativeBearing = (Date.now() / 35) % 360;
    frequency = 375 + Math.sin(Date.now() / 2000) * 120;
    signalValid = Math.random() > 0.06;
  } else {
    try {
      const res = await fetch("http://10.0.0.216:5000/data");
      const d = await res.json();
      relativeBearing = d.adf_bearing || d.adf_relative || 0;
      frequency = d.adf_freq || 375;
      signalValid = d.adf_valid !== false;
    } catch (e) {
      console.log("ADF fetch error:", e);
    }
  }

  const canvas = document.getElementById("adfCanvas");
  drawAdfFace(canvas, relativeBearing, frequency, signalValid);
}

// ==================== INIT ====================
const adfCanvas = document.getElementById("adfCanvas");
adfCanvas.width = 360;
adfCanvas.height = 360;

drawAdfFace(adfCanvas, 42, 385, true);
setInterval(updateAdf, 70);   // smooth updates
