// ==================== ENGINE SPEED (RPM / TACHOMETER) GAUGE ====================
// Same dark-bezel, vibrant style as your previous gauges

function drawRpmFace(canvas, rpm = 0, maxRpm = 2700) {
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width / 2 - 22;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === Outer bezel ===
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

  const normalized = Math.min(Math.max(rpm, 0), maxRpm) / maxRpm;

  // === Colored arc (green → yellow → red) ===
  const startAngle = Math.PI * 0.75;   // 135° (left)
  const endAngle   = Math.PI * 2.25;   // 405° (full sweep)

  // Green arc (0-75%)
  ctx.beginPath();
  ctx.arc(cx, cy, r - 25, startAngle, startAngle + (endAngle - startAngle) * 0.75);
  ctx.lineWidth = 28;
  ctx.strokeStyle = "#22ff44";
  ctx.stroke();

  // Yellow arc (75-90%)
  ctx.beginPath();
  ctx.arc(cx, cy, r - 25, startAngle + (endAngle - startAngle) * 0.75, startAngle + (endAngle - startAngle) * 0.9);
  ctx.strokeStyle = "#ffdd22";
  ctx.stroke();

  // Red arc (90-100%)
  ctx.beginPath();
  ctx.arc(cx, cy, r - 25, startAngle + (endAngle - startAngle) * 0.9, endAngle);
  ctx.strokeStyle = "#ff2222";
  ctx.stroke();

  // === Tick marks ===
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 10; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / 10);
    const x1 = cx + (r - 12) * Math.cos(angle);
    const y1 = cy + (r - 12) * Math.sin(angle);
    const x2 = cx + (r - 48) * Math.cos(angle);
    const y2 = cy + (r - 48) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Major labels every 2 steps
    if (i % 2 === 0) {
      const label = Math.round((maxRpm / 1000) * (i / 2)) / 1; // e.g. 0.0, 1.0, 2.0...
      const lx = cx + (r - 72) * Math.cos(angle);
      const ly = cy + (r - 72) * Math.sin(angle);
      ctx.fillText(label.toFixed(1), lx, ly);
    }
  }

  // === Needle ===
  const needleAngle = startAngle + (endAngle - startAngle) * normalized;
  const needleLength = r - 38;

  ctx.strokeStyle = "#ff2222";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + needleLength * Math.cos(needleAngle),
    cy + needleLength * Math.sin(needleAngle)
  );
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Needle hub
  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff2222";
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();

  // === Digital RPM readout ===
  ctx.fillStyle = "#00ffcc";
  ctx.font = "bold 42px monospace";
  ctx.textAlign = "center";
  ctx.fillText(Math.round(rpm).toString().padStart(4, "0"), cx, cy + 92);

  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("RPM", cx, cy + 122);

  // === Redline marker ===
  if (maxRpm > 2000) {
    const redlineAngle = startAngle + (endAngle - startAngle) * 0.92;
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(
      cx + (r - 55) * Math.cos(redlineAngle),
      cy + (r - 55) * Math.sin(redlineAngle)
    );
    ctx.lineTo(
      cx + (r - 12) * Math.cos(redlineAngle),
      cy + (r - 12) * Math.sin(redlineAngle)
    );
    ctx.stroke();
  }
}

// ==================== UPDATE FUNCTION ====================
async function updateRpm() {
  let rpm = 0;
  const maxRpm = 2700;   // ← change for your aircraft (e.g. 3800 for some props, or 100 for % N1)

  if (testMode === "on") {
    rpm = 1650 + Math.sin(Date.now() / 600) * 800;   // nice varying demo
    rpm = Math.max(600, Math.min(maxRpm, rpm));
  } else {
    try {
      const res = await fetch("http://10.0.0.216:5000/data");
      const d = await res.json();
      rpm = d.rpm || d.engine_rpm || 0;
    } catch (e) {
      console.log("RPM fetch error:", e);
    }
  }

  const canvas = document.getElementById("rpmCanvas");
  drawRpmFace(canvas, rpm, maxRpm);
}

// ==================== INIT ====================
const rpmCanvas = document.getElementById("rpmCanvas");
rpmCanvas.width = 360;
rpmCanvas.height = 360;

drawRpmFace(rpmCanvas, 0);           // initial draw
setInterval(updateRpm, 80);          // smooth updates
