// ==================== TRIM INDICATOR ====================
// Matches the dark-bezel, high-contrast aviation style

function drawTrimFaceTypeB(canvas, trimValue = 0, autoPilotEngaged = false) {
  // trimValue: -1.0 (Nose Down) to +1.0 (Nose Up). 0 is Neutral.
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // === Outer Bezel/Housing ===
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  ctx.roundRect(10, 10, w - 20, h - 20, 15);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#444444";
  ctx.stroke();

  // === Scale Background ===
  const trackW = 40;
  const trackH = h - 80;
  const trackX = cx - trackW / 2;
  const trackY = 40;

  ctx.fillStyle = "#050505";
  ctx.fillRect(trackX, trackY, trackW, trackH);

  // === Graduation Marks ===
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  for (let i = -10; i <= 10; i += 2) {
    // Map -10..10 to the track height
    const yPos = cy + (i * -(trackH / 22)); 
    
    ctx.beginPath();
    ctx.moveTo(trackX + trackW, yPos);
    ctx.lineTo(trackX + trackW - 12, yPos);
    ctx.stroke();

    // Labels for major increments
    if (i % 5 === 0 && i !== 0) {
      ctx.fillStyle = "#aaaaaa";
      ctx.fillText(i > 0 ? "UP" : "DN", trackX + trackW + 10, yPos);
    }
  }

  // === Takeoff (Neutral) Band ===
  ctx.fillStyle = "#22ff88"; // Vibrant Green
  ctx.globalAlpha = 0.4;
  ctx.fillRect(trackX, cy - 15, trackW, 30);
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "#22ff88";
  ctx.strokeRect(trackX, cy - 15, trackW, 30);

  // === The Pointer (Trim Tab) ===
  // Constrain trimValue between -1 and 1
  const constrainedTrim = Math.max(-1, Math.min(1, trimValue));
  const pointerY = cy + (constrainedTrim * -(trackH / 2));

  // Glow effect
  ctx.shadowColor = "#00ffcc";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#00ffcc";
  
  // Draw an indicator arrow/tab
  ctx.beginPath();
  ctx.moveTo(trackX - 5, pointerY);
  ctx.lineTo(trackX + trackW + 5, pointerY);
  ctx.lineTo(trackX + trackW + 15, pointerY - 10);
  ctx.lineTo(trackX + trackW + 15, pointerY + 10);
  ctx.closePath();
  ctx.fill();
  
  ctx.shadowBlur = 0;

  // === Digital Readout ===
  const percent = Math.round(constrainedTrim * 100);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px monospace";
  ctx.fillText(percent > 0 ? `+${percent}` : percent, cx, h - 22);
  
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("TRIM %", cx, h - 8);

  // === Autopilot Status ===
  if (autoPilotEngaged) {
    ctx.fillStyle = "#ffcc00";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("AP TRIM", cx, 28);
  }
}

// ==================== UPDATE FUNCTION ====================
async function updateTrimTypeB() {
/*
    if (testMode === "pause") return;
    
  let trimValue = 0; // -1.0 to 1.0
  let apActive = true;

  if (testMode === "on") {
    // Slow oscillation for demo
    trimValue = Math.sin(Date.now() / 3000) * 0.8;
    apActive = Math.sin(Date.now() / 5000) > 0;
  } else {
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
      // Adjust keys based on your specific SimConnect/Data provider mapping
	trimValue = d.eTrim || 0; 
	apActive = d.ap_active || false;

	cLog("trim:",trimValue);
	
    } catch (e) {
      console.log("Trim fetch error:", e);
    }
  }
*/
  const canvas = document.getElementById("trimCanvasTypeB");
//  drawTrimFaceTypeB(canvas, trimValue, apActive);
  drawTrimFaceTypeB(canvas, gsdTrimValue, gsdApActive);

}

// ==================== INIT ====================
const trimCanvasTypeB = document.getElementById("trimCanvasTypeB");
// Trim indicators are usually taller than they are wide
trimCanvasTypeB.width = 160; 
trimCanvasTypeB.height = 360;

//setInterval(updateTrimTypeB, 50); 

window.addEventListener("DOMContentLoaded", () => {
    const trimCanvasTypeB = document.getElementById("trimCanvasTypeB");
    drawTrimFaceTypeB(trimCanvasTypeB, 0, false);
});
