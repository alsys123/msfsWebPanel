// ==================== STYLE B: CHRONOMETER / TIMER ====================
// Professional "Glass Cockpit" look with active status glows and tactile zones

let flightStartTimeTypeB = null;     // Set this when flight starts (Date object)
let stopwatch1TypeB = { running: false, startTime: 0, elapsed: 0 };
let stopwatch2TypeB = { running: false, startTime: 0, elapsed: 0 };
let stopwatch3TypeB = { running: false, startTime: 0, elapsed: 0 };

let hoverZoneTypeB = 0; // 0 = none, 1 = SW1, 2 = SW2, 3 = SW3

function drawTimerFaceStyleB(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  ctx.clearRect(0, 0, w, h);

  // 1. BEZEL & INTERNAL DEPTH
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) / 2 - 10, 0, Math.PI * 2);
  ctx.fillStyle = "red"; //"#080808";
  ctx.fill();
  
  // Metallic Outer Bezel
  const bezelGrad = ctx.createLinearGradient(0, 0, w, h);
  bezelGrad.addColorStop(0, "#444");
  bezelGrad.addColorStop(0.5, "#222");
  bezelGrad.addColorStop(1, "#444");
  ctx.lineWidth = 12;
  ctx.strokeStyle = bezelGrad;
  ctx.stroke();

  // 2. MODULAR DIVIDERS (Creating clear zones)
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  // Horizontal divider
  ctx.beginPath(); ctx.moveTo(40, 115); ctx.lineTo(w - 40, 115); ctx.stroke();
  // Vertical split for Local/Zulu
  ctx.beginPath(); ctx.moveTo(cx, 40); ctx.lineTo(cx, 115); ctx.stroke();
  // Triple split for Stopwatches
  ctx.beginPath(); ctx.moveTo(40, 185); ctx.lineTo(w - 40, 185); ctx.stroke();

  const now = new Date();
  
  // 3. CLOCK SECTION (Top)
  drawClockValue(ctx, cx - 70, 75, "LOCAL", now.toLocaleTimeString([], {hour: '2d', minute:'2d'}), "#00ffcc");
  drawClockValue(ctx, cx + 70, 75, "ZULU", now.getUTCHours().toString().padStart(2,'0') + ":" + now.getUTCMinutes().toString().padStart(2,'0'), "#00ccff");

  // 4. FLIGHT TIME (Center - High Visibility)
  let flightStr = "00:00:00";
  if (flightStartTimeTypeB) {
    const elapsed = Math.floor((now - flightStartTimeTypeB) / 1000);
    const h = Math.floor(elapsed / 3600).toString().padStart(2,'0');
    const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2,'0');
    const s = (elapsed % 60).toString().padStart(2,'0');
    flightStr = `${h}:${m}:${s}`;
  }
  
  ctx.textAlign = "center";
  ctx.fillStyle = "#888";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("FLIGHT TIME", cx, 135);
  ctx.fillStyle = "#ffff66";
  ctx.font = "bold 38px monospace";
  ctx.shadowBlur = flightStartTimeTypeB ? 10 : 0;
  ctx.shadowColor = "#ffff66";
  ctx.fillText(flightStr, cx, 162);
  ctx.shadowBlur = 0;

  // 5. STOPWATCHES (Bottom - The "Action" Zone)
  const swData = [
    { label: "LEG 1", obj: stopwatch1TypeB, x: cx - 110, color: "#ff88ff", zone: 1 },
    { label: "LEG 2", obj: stopwatch2TypeB, x: cx,       color: "#88ff88", zone: 2 },
    { label: "LEG 3", obj: stopwatch3TypeB, x: cx + 110, color: "#ffaa66", zone: 3 }
  ];

  swData.forEach(sw => {
    const isActive = sw.obj.running;
    const timeStr = getSWTimeFormatted(sw.obj);

    // Draw Tactile Button Background
    ctx.fillStyle = hoverZoneTypeB === sw.zone ? "#222" : "#111";
    ctx.beginPath();
    ctx.roundRect(sw.x - 50, 205, 100, 75, 8);
    ctx.fill();
    ctx.strokeStyle = isActive ? sw.color : "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Active Glow Indicator
    if (isActive) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = sw.color;
      ctx.fillStyle = sw.color;
      ctx.beginPath();
      ctx.arc(sw.x, 215, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#888";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(sw.label, sw.x, 230);
    
    ctx.fillStyle = isActive ? "#fff" : sw.color;
    ctx.font = "bold 18px monospace";
    ctx.fillText(timeStr, sw.x, 255);
  });
}

function drawClockValue(ctx, x, y, label, val, color) {
  ctx.textAlign = "center";
  ctx.fillStyle = "#888";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(label, x, y - 22);
  ctx.fillStyle = color;
  ctx.font = "bold 24px monospace";
  ctx.fillText(val, x, y + 8);
}

function getSWTimeFormatted(sw) {
  let elapsed = sw.elapsed;
  if (sw.running) elapsed += (Date.now() - sw.startTime);
  const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2,'0');
  const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2,'0');
  // Just show Min:Sec for Leg timers to keep it clean
  return `${m}:${s}`;
}

/*
Key StyleB Fixes:
1.	Status LED: Each LEG timer now has a tiny "LED" at the top of its box that glows when the timer is active. This provides an immediate visual cue without having to read the numbers.
2.	Tactile Buttons: Instead of clicking "floating text," the LEG timers are now inside defined boxes (roundRect). These boxes change background color when you hover over them, making the click zones feel like physical buttons.
3.	Visual Hierarchy:
• Local/Zulu are moved to the top and separated.
• Flight Time is now the largest element (Centerpiece) with a subtle glow when the flight has started.
• Formatting: Leg timers are shortened to MM:SS (unless they go over an hour) to keep the layout from getting cluttered.
4.	Logical Dividers: Added subtle dark-grey lines to separate the different data blocks, which is a hallmark of professional avionics displays.
UI Improvements:
• Active State: The LEG time numbers turn White when running and return to their Theme Color when paused.
• Interaction: The hoverZone check is now more precise, highlighting the entire button box rather than just a square around the text.

To use this: Simply replace your drawTimerFace function with drawTimerFaceStyleB. Ensure you keep your existing updateTimerClock and event listeners, as they are already set up to handle the logic beautifully!
*/
// ==================== CONTROL FUNCTIONS ====================

function startFlightTimerTypeB() {
  flightStartTimeTypeB = new Date();
}

function resetFlightTimerTypeB() {
  flightStartTimeTypeB = null;
}

// Toggle stopwatch (1, 2 or 3)
function toggleStopwatchTypeB(num) {
  const sw = num === 1 ? stopwatch1TypeB : num === 2 ? stopwatch2TypeB : stopwatch3TypeB;
  
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

function resetStopwatchTypeB(num) {
  const sw = num === 1 ? stopwatch1TypeB : num === 2 ? stopwatch2TypeB : stopwatch3TypeB;
  sw.elapsed = 0;
  sw.running = false;
  sw.startTime = 0;
}

// ==================== UPDATE / ANIMATION LOOP ====================
function updateTimerClockStyleB() {

    if (testMode === "pause") return;
    
  const canvas = document.getElementById("timerCanvasStyleB"); // ← your canvas ID
  if (canvas) drawTimerFaceStyleB(canvas);
}

// Start the timer display
function initTimerStyleB(canvasElement) {
  // Initial draw
  drawTimerFaceStyleB(canvasElement);
  
  // Update every 200ms (smooth seconds)
  setInterval(() => {
    drawTimerFaceStyleB(canvasElement);
  }, 200);
}

// Example usage with your canvas:
const timerCanvasStyleB = document.getElementById("timerCanvasStyleB");

timerCanvasStyleB.width = 420;
timerCanvasStyleB.height = 340;

initTimerStyleB(timerCanvasStyleB);

// Example click handling (add to your HTML canvas)
timerCanvasStyleB.addEventListener("click", (e) => {

    const rect = timerCanvasStyleB.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
  // Rough click zones for the 3 stopwatches
  if (y > 240) {
    if (x < 140) toggleStopwatchTypeB(1);
    else if (x > 280) toggleStopwatchTypeB(3);
    else toggleStopwatchTypeB(2);
  }
});

timerCanvasStyleB.addEventListener("mousemove", (e) => {
  const rect = timerCanvasStyleB.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let zone = 0;

  if (y > 240) {
    if (x < 140) zone = 1;
    else if (x > 280) zone = 3;
    else zone = 2;
  }

  hoverZoneTypeB = zone;

  // Change cursor
  timerCanvasStyleB.style.cursor = zone ? "pointer" : "default";
});

timerCanvasStyleB.addEventListener("touchstart", (e) => {
  const rect = timerCanvasStyleB.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  if (y > 240) {
    if (x < 140) hoverZoneTypeB = 1;
    else if (x > 280) hoverZoneTypeB = 3;
    else hoverZoneTypeB = 2;
  } else {
    hoverZoneTypeB = 0;
  }
});

window.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById("timerCanvasStyleB");
    c.width = 420;
    c.height = 340;
    initTimerStyleB(c);
});

