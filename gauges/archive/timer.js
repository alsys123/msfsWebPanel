// ==================== TIMER / CLOCK GAUGE (Canvas) ====================
// Same visual style as your heading indicator

let flightStartTime = null;     // Set this when flight starts (Date object)
let stopwatch1 = { running: false, startTime: 0, elapsed: 0 };
let stopwatch2 = { running: false, startTime: 0, elapsed: 0 };
let stopwatch3 = { running: false, startTime: 0, elapsed: 0 };

let hoverZone = 0; // 0 = none, 1 = SW1, 2 = SW2, 3 = SW3

function drawTimerFace(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  ctx.clearRect(0, 0, w, h);

  // Background / Bezel
    ctx.beginPath();

//    const radius = Math.min(w, h) / 2 - 2;  // bigger oval
//    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
//    ctx.lineWidth = 20;                     // thicker bezel

  ctx.arc(cx, cy, Math.min(w, h) / 2 - 10, 0, Math.PI * 2);
  ctx.fillStyle = "#0a0a0a";
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#444";
  ctx.stroke();

  const now = new Date();
  const localHours = now.getHours();
  const localMins = now.getMinutes();
  const localSecs = now.getSeconds();

  const zuluHours = now.getUTCHours();
  const zuluMins = now.getUTCMinutes();
  const zuluSecs = now.getUTCSeconds();

  // Flight time
  let flightH = 0, flightM = 0, flightS = 0;
  if (flightStartTime) {
    const elapsed = Math.floor((now - flightStartTime) / 1000);
    flightH = Math.floor(elapsed / 3600);
    flightM = Math.floor((elapsed % 3600) / 60);
    flightS = elapsed % 60;
  }

  // Stopwatches
  function getSWTime(sw) {
    if (sw.running) {
      const elapsed = sw.elapsed + (Date.now() - sw.startTime);
      const h = Math.floor(elapsed / 3600000);
      const m = Math.floor((elapsed % 3600000) / 60000);
      const s = Math.floor((elapsed % 60000) / 1000);
      return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }
    const h = Math.floor(sw.elapsed / 3600000);
    const m = Math.floor((sw.elapsed % 3600000) / 60000);
    const s = Math.floor((sw.elapsed % 60000) / 1000);
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

  // === Layout: 4 sections ===
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // LOCAL TIME
  ctx.fillStyle = "#00ffcc";
  ctx.font = "bold 20px monospace";
  ctx.fillText("LOCAL", cx - 55, 65);
  ctx.font = "bold 20px monospace";
  ctx.fillText(`${localHours.toString().padStart(2,'0')}:${localMins.toString().padStart(2,'0')}`, cx - 95, 95);

  // ZULU TIME
  ctx.fillStyle = "#00ccff";
  ctx.font = "bold 20px monospace";
  ctx.fillText("ZULU", cx + 55, 65);
  ctx.font = "bold 20px monospace";
  ctx.fillText(`${zuluHours.toString().padStart(2,'0')}:${zuluMins.toString().padStart(2,'0')}`, cx + 95, 95);

  // FLIGHT TIME
  ctx.fillStyle = "#ffff66";
  ctx.font = "bold 22px monospace";
  ctx.fillText("- flight -", cx, 130);
  ctx.font = "bold 22px monospace";
  ctx.fillText(
    `${flightH.toString().padStart(2,'0')}:${flightM.toString().padStart(2,'0')}:${flightS.toString().padStart(2,'0')}`,
    cx, 155
  );

  // STOPWATCHES
  ctx.font = "bold 22px monospace";
  
  // SW1
  ctx.fillStyle = "#ff88ff";
  ctx.fillText("LEG 1", cx - 75, 200);
  ctx.fillText(getSWTime(stopwatch1), cx - 75, 220); // was cx-105

  // SW2
  ctx.fillStyle = "#88ff88";
  ctx.fillText("LEG 2", cx, 265);
  ctx.fillText(getSWTime(stopwatch2), cx, 285);

  // SW3
  ctx.fillStyle = "#ffaa66";
  ctx.fillText("LEG 3", cx + 75, 200);
  ctx.fillText(getSWTime(stopwatch3), cx + 75, 220);

  // Small labels at bottom
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#888";
    ctx.fillText("Click sections to control stopwatches", cx, h - 25);

/*
    // === HOVER HIGHLIGHT ===
    if (hoverZone > 0) {
	ctx.save();
	ctx.globalAlpha = 0.25;
	ctx.fillStyle = "#ffffff";

	// Hard-coded highlight boxes around the text
	if (hoverZone === 1) {
	    ctx.fillRect(cx - 75, 200, 80, 70);   // around LEG 1 + time
	}
	if (hoverZone === 2) {
	    ctx.fillRect(cx - 25, 220, 80, 70);    // around LEG 2 + time
	}
	if (hoverZone === 3) {
	    ctx.fillRect(cx + 40, 160, 80, 70);    // around LEG 3 + time
	}
	
	ctx.restore();
    }
*/
    
}

// ==================== CONTROL FUNCTIONS ====================

function startFlightTimer() {
  flightStartTime = new Date();
}

function resetFlightTimer() {
  flightStartTime = null;
}

// Toggle stopwatch (1, 2 or 3)
function toggleStopwatch(num) {
  const sw = num === 1 ? stopwatch1 : num === 2 ? stopwatch2 : stopwatch3;
  
  if (sw.running) {
    // Stop
    sw.elapsed += Date.now() - sw.startTime;
    sw.running = false;
  } else {
    // Start
    sw.startTime = Date.now();
    sw.running = true;
  }
}

function resetStopwatch(num) {
  const sw = num === 1 ? stopwatch1 : num === 2 ? stopwatch2 : stopwatch3;
  sw.elapsed = 0;
  sw.running = false;
  sw.startTime = 0;
}

// ==================== UPDATE / ANIMATION LOOP ====================
function updateTimerClock() {
  const canvas = document.getElementById("timerCanvas"); // ← your canvas ID
  if (canvas) drawTimerFace(canvas);
}

// Start the timer display
function initTimer(canvasElement) {
  // Initial draw
  drawTimerFace(canvasElement);
  
  // Update every 200ms (smooth seconds)
  setInterval(() => {
    drawTimerFace(canvasElement);
  }, 200);
}

// Example usage with your canvas:
const timerCanvas = document.getElementById("timerCanvas");
timerCanvas.width = 420;
timerCanvas.height = 340;
initTimer(timerCanvas);

// Example click handling (add to your HTML canvas)
timerCanvas.addEventListener("click", (e) => {
  const rect = timerCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Rough click zones for the 3 stopwatches
  if (y > 240) {
    if (x < 140) toggleStopwatch(1);
    else if (x > 280) toggleStopwatch(3);
    else toggleStopwatch(2);
  }
});

timerCanvas.addEventListener("mousemove", (e) => {
  const rect = timerCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let zone = 0;

  if (y > 240) {
    if (x < 140) zone = 1;
    else if (x > 280) zone = 3;
    else zone = 2;
  }

  hoverZone = zone;

  // Change cursor
  timerCanvas.style.cursor = zone ? "pointer" : "default";
});

timerCanvas.addEventListener("touchstart", (e) => {
  const rect = timerCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  if (y > 240) {
    if (x < 140) hoverZone = 1;
    else if (x > 280) hoverZone = 3;
    else hoverZone = 2;
  } else {
    hoverZone = 0;
  }
});
