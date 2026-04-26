// ==================== G1000 INTEGRATED PFD ====================
// A high-fidelity glass cockpit recreation including AI, ASI, ALT, and Heading

function drawG1000(canvas, data) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // Destructure data for clarity
  const { pitch, roll, heading, altitude, airspeed, verticalSpeed } = data;

  ctx.clearRect(0, 0, w, h);
  ctx.save();

  // === 1. ARTIFICIAL HORIZON (Background) ===
  ctx.translate(cx, cy);
  ctx.rotate(-roll * Math.PI / 180);
  const pitchOffset = pitch * 10; // 10 pixels per degree

  // Sky
  ctx.fillStyle = "#0072bc"; // Garmin Sky Blue
  ctx.fillRect(-w * 2, -h * 2 + pitchOffset, w * 4, h * 2);
  // Ground
  ctx.fillStyle = "#734d26"; // Garmin Ground Brown
  ctx.fillRect(-w * 2, pitchOffset, w * 4, h * 2);
  
  // Horizon Line
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w, pitchOffset);
  ctx.lineTo(w, pitchOffset);
  ctx.stroke();

  // Pitch Ladder
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px sans-serif";
  ctx.fillStyle = "white";
  for (let i = -20; i <= 20; i += 5) {
    if (i === 0) continue;
    const y = pitchOffset - (i * 10);
    const lineW = i % 10 === 0 ? 60 : 30;
    ctx.beginPath();
    ctx.moveTo(-lineW/2, y); ctx.lineTo(lineW/2, y);
    ctx.stroke();
    if (i % 10 === 0) {
      ctx.fillText(Math.abs(i), -lineW/2 - 15, y);
      ctx.fillText(Math.abs(i), lineW/2 + 15, y);
    }
  }
  ctx.restore();

  // === 2. STATIC OVERLAYS (Bezels & Tapes) ===

  // Airspeed Tape (Left)
  drawTape(ctx, 0, 50, 80, h - 100, airspeed, "ASI", "#ffffff");
  
  // Altitude Tape (Right)
  drawTape(ctx, w - 80, 50, 80, h - 100, altitude, "ALT", "#ffffff", 100);

  // === 3. THE "ROLL" SCALE (Top Arc) ===
  ctx.save();
  ctx.translate(cx, cy - 40);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 140, Math.PI + 0.5, Math.PI * 2 - 0.5);
  ctx.stroke();
  // Roll Triangle
  ctx.rotate(-roll * Math.PI / 180);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(0, -140); ctx.lineTo(-10, -125); ctx.lineTo(10, -125);
  ctx.fill();
  ctx.restore();

  // === 4. HEADING COMPASS (Bottom) ===
  drawCompassRose(ctx, cx, h - 80, heading);

  // === 5. AIRCRAFT SYMBOL (Center) ===
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = 4;
  ctx.shadowBlur = 5; ctx.shadowColor = "black";
  // Left Wing
  ctx.beginPath(); ctx.moveTo(cx - 80, cy); ctx.lineTo(cx - 30, cy); ctx.lineTo(cx - 30, cy + 15); ctx.stroke();
  // Right Wing
  ctx.beginPath(); ctx.moveTo(cx + 80, cy); ctx.lineTo(cx + 30, cy); ctx.lineTo(cx + 30, cy + 15); ctx.stroke();
  // Center Box
  ctx.strokeRect(cx - 4, cy - 4, 8, 8);
  ctx.shadowBlur = 0;
}

/** HELPER: Draw Scrolling Tapes (ASI/ALT) **/
function drawTape(ctx, x, y, w, h, value, label, color, step = 10) {
  ctx.fillStyle = "rgba(20, 20, 20, 0.85)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#888888";
  ctx.strokeRect(x, y, w, h);

  ctx.save();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const midY = y + h / 2;
  const spacing = 40; // pixels per step
  
  ctx.fillStyle = "white";
  ctx.textAlign = x === 0 ? "right" : "left";
  ctx.font = "bold 18px monospace";

  let startVal = Math.floor(value / step) * step - (step * 3);
  for (let i = 0; i < 8; i++) {
    const curVal = startVal + (i * step);
    const yOffset = midY + (value - curVal) * (spacing / step);
    
    ctx.beginPath();
    ctx.moveTo(x === 0 ? x + w : x, yOffset);
    ctx.lineTo(x === 0 ? x + w - 15 : x + 15, yOffset);
    ctx.stroke();
    
    if (curVal >= 0) {
      ctx.fillText(curVal, x === 0 ? x + w - 20 : x + 20, yOffset + 5);
    }
  }
  ctx.restore();

  // Readout Box
  ctx.fillStyle = "black";
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 2;
  const boxH = 34;
  ctx.fillRect(x, midY - boxH/2, w, boxH);
  ctx.strokeRect(x, midY - boxH/2, w, boxH);
  ctx.fillStyle = "#00ff00";
  ctx.font = "bold 22px monospace";
  ctx.textAlign = "center";
  ctx.fillText(Math.round(value), x + w/2, midY + 8);
}

/** HELPER: Horizontal Heading Strip **/
function drawCompassRose(ctx, cx, cy, hdg) {
  const w = 300;
  const h = 60;
  ctx.fillStyle = "rgba(10, 10, 10, 0.9)";
  ctx.fillRect(cx - w/2, cy, w, h);
  
  ctx.save();
  ctx.rect(cx - w/2, cy, w, h);
  ctx.clip();

  const spacing = 5; // 5 pixels per degree
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.font = "bold 16px sans-serif";

  for (let i = hdg - 30; i <= hdg + 30; i++) {
    const angle = (i + 360) % 360;
    const x = cx + (i - hdg) * spacing;
    
    if (angle % 10 === 0) {
      ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, cy + 15); ctx.stroke();
      let label = angle === 0 ? "N" : angle === 90 ? "E" : angle === 180 ? "S" : angle === 270 ? "W" : angle/10;
      ctx.fillText(label, x, cy + 35);
    } else if (angle % 5 === 0) {
      ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, cy + 8); ctx.stroke();
    }
  }
  ctx.restore();

  // Heading Pointer
  ctx.fillStyle = "#00ff00";
  ctx.beginPath();
  ctx.moveTo(cx, cy); ctx.lineTo(cx - 8, cy - 10); ctx.lineTo(cx + 8, cy - 10);
  ctx.fill();
}

// ==================== UPDATE LOGIC ====================
async function updateG1000() {

//    cLog("G1000 update");
    
    if (testMode === "pause") return;

    let flightData = { pitch: 0, roll: 0, heading: 0,
		       altitude: 0, airspeed: 0 };

  if (testMode === "on") {
    flightData = {
      pitch: Math.sin(Date.now() / 2000) * 10,
      roll: Math.cos(Date.now() / 3000) * 25,
      heading: (Date.now() / 100) % 360,
      altitude: 5000 + Math.sin(Date.now() / 5000) * 200,
      airspeed: 120 + Math.sin(Date.now() / 4000) * 20
    };
  } else  {
      try {
	  const res = await fetch(gServerIP);
	  const d = await res.json();
	  let pitchRad = d.pitch || 0;
	  let rollRad  = d.roll || 0;
	  let hdg      = d.heading || 0;
	  let altitude = d.altitude;
	  let kts      = d.airspeed
	  
	  hdg = radToDeg(hdg);
	  
	  pitch = radToDeg(pitchRad);
	  roll  = radToDeg(rollRad);
	  
//	  cLog("G1000 .. heading",hdg);
	  
	  flightData = { pitch: pitch, roll: roll,
			 heading: hdg,
			 altitude: altitude, airspeed: kts };
	  
      } catch (e) {
	  console.log("Attitude fetch error:", e);
      }
  }
    
    const canvas = document.getElementById("g1000Canvas");
    drawG1000(canvas, flightData);
}

const gCanvas = document.getElementById("g1000Canvas");
gCanvas.width = 600;
gCanvas.height = 450;
setInterval(updateG1000, 30);

// init the panel
const flightDataInit = {
      pitch: 0,
      roll: 0,
      heading: 0,
      altitude: 0,
      airspeed: 0
    };
drawG1000(gCanvas, flightDataInit);
