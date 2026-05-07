// ==================== STYLE C: RESPONSIVE CHRONOMETER / TIMER ====================
// Professional "Glass Cockpit" look with active status glows and tactile zones
// Fully responsive - scales to any canvas size with proper touch/click detection

let flightStartTimeTypeC = null;     // Set this when flight starts (Date object)
let stopwatch1TypeC = { running: false, startTime: 0, elapsed: 0 };
let stopwatch2TypeC = { running: false, startTime: 0, elapsed: 0 };
let stopwatch3TypeC = { running: false, startTime: 0, elapsed: 0 };

let hoverZoneTypeC = 0; // 0 = none, 1 = SW1, 2 = SW2, 3 = SW3

// Design constants (reference size)
const DESIGN_WIDTH = 210;  //was 420
const DESIGN_HEIGHT = 170;  // was 340

// Layout reference points (from original design - as percentages/ratios)
const LAYOUT = {
  bezelPadding: 3,           // pixels from edge
  topDividerY: 115 / DESIGN_HEIGHT,     // relative position
  middleDividerY: 185 / DESIGN_HEIGHT,
  clockLabelY: 75 / DESIGN_HEIGHT,
  flightTimeLabelY: 135 / DESIGN_HEIGHT,
  flightTimeValueY: 162 / DESIGN_HEIGHT,
  swBoxStartY: 205 / DESIGN_HEIGHT,
  swBoxHeight: 75 / DESIGN_HEIGHT,
  swBoxWidth: 100 / DESIGN_HEIGHT,      // as ratio of height
  swLeftX: -110 / DESIGN_WIDTH,        // relative to center
  swCenterX: 0 / DESIGN_WIDTH,
  swRightX: 110 / DESIGN_WIDTH
};

function drawTimerFaceStyleC(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // Calculate scale factor from canvas size
  const scaleX = w / DESIGN_WIDTH;
  const scaleY = h / DESIGN_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  ctx.clearRect(0, 0, w, h);

  // 1. BEZEL & INTERNAL DEPTH
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) / 2 - 10 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#080808";
  ctx.fill();
  
  // Metallic Outer Bezel
  const bezelGrad = ctx.createLinearGradient(0, 0, w, h);
  bezelGrad.addColorStop(0, "#444");
  bezelGrad.addColorStop(0.5, "#222");
  bezelGrad.addColorStop(1, "#444");
  ctx.lineWidth = 12 * scale;
  ctx.strokeStyle = bezelGrad;
  ctx.stroke();

  // 2. MODULAR DIVIDERS (Creating clear zones)
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2 * scale;
  const padding = 40 * scale;
  const topDividerY = h * LAYOUT.topDividerY;
  const middleDividerY = h * LAYOUT.middleDividerY;
  const swBoxStartY = h * LAYOUT.swBoxStartY;

  // Horizontal divider
  ctx.beginPath(); ctx.moveTo(padding, topDividerY); ctx.lineTo(w - padding, topDividerY); ctx.stroke();
  // Vertical split for Local/Zulu
  ctx.beginPath(); ctx.moveTo(cx, padding); ctx.lineTo(cx, topDividerY); ctx.stroke();
  // Triple split for Stopwatches
  ctx.beginPath(); ctx.moveTo(padding, middleDividerY); ctx.lineTo(w - padding, middleDividerY); ctx.stroke();

  const now = new Date();
  
  // 3. CLOCK SECTION (Top)
  const clockLabelY = topDividerY * 0.6;
  const clockValueY = topDividerY * 0.85;
  const clockLeftX = cx - (70 * scale);
  const clockRightX = cx + (70 * scale);

  drawClockValueC(
    ctx,
    clockLeftX,
    clockLabelY,
    clockValueY,
    "LOCAL",
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    "#00ffcc",
    scale
  );

  drawClockValueC(
    ctx,
    clockRightX,
    clockLabelY,
    clockValueY,
    "ZULU",
    now.getUTCHours().toString().padStart(2, "0") + ":" +
        now.getUTCMinutes().toString().padStart(2, "0"),
    "#00ccff",
    scale
  );
    
  // 4. FLIGHT TIME (Center - High Visibility)
  let flightStr = "00:00:00";
  if (flightStartTimeTypeC) {
    const elapsed = Math.floor((now - flightStartTimeTypeC) / 1000);
    const h_val = Math.floor(elapsed / 3600).toString().padStart(2,'0');
    const m_val = Math.floor((elapsed % 3600) / 60).toString().padStart(2,'0');
    const s_val = (elapsed % 60).toString().padStart(2,'0');
    flightStr = `${h_val}:${m_val}:${s_val}`;
  }
  
  const flightTimeLabelY = h * LAYOUT.flightTimeLabelY;
  const flightTimeValueY = h * LAYOUT.flightTimeValueY;

  ctx.textAlign = "center";
  ctx.fillStyle = "#888";
  ctx.font = `bold ${12 * scale}px sans-serif`;
  ctx.fillText("FLIGHT TIME", cx, flightTimeLabelY);
  ctx.fillStyle = "#ffff66";
  ctx.font = `bold ${24 * scale}px monospace`;
  ctx.shadowBlur = flightStartTimeTypeC ? 10 : 0;
  ctx.shadowColor = "#ffff66";
  ctx.fillText(flightStr, cx, flightTimeValueY);
  ctx.shadowBlur = 0;

  // 5. STOPWATCHES (Bottom - The "Action" Zone)
  const swBoxH = h * LAYOUT.swBoxHeight;
  const swBoxW = swBoxH * (LAYOUT.swBoxWidth * DESIGN_HEIGHT / 340); // maintain aspect ratio

  const swData = [
    { label: "LEG 1", obj: stopwatch1TypeC, relX: LAYOUT.swLeftX, color: "#ff88ff", zone: 1 },
    { label: "LEG 2", obj: stopwatch2TypeC, relX: LAYOUT.swCenterX, color: "#88ff88", zone: 2 },
    { label: "LEG 3", obj: stopwatch3TypeC, relX: LAYOUT.swRightX, color: "#ffaa66", zone: 3 }
  ];

  swData.forEach(sw => {
    const swX = cx + (sw.relX * w);
    const isActive = sw.obj.running;
    const timeStr = getSWTimeFormattedC(sw.obj);

    // Draw Tactile Button Background
    ctx.fillStyle = hoverZoneTypeC === sw.zone ? "#222" : "#111";
    ctx.beginPath();
    ctx.roundRect(swX - swBoxW / 2, swBoxStartY, swBoxW, swBoxH, 8 * scale);
    ctx.fill();
    ctx.strokeStyle = isActive ? sw.color : "#333";
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Active Glow Indicator
    if (isActive) {
      ctx.shadowBlur = 8 * scale;
      ctx.shadowColor = sw.color;
      ctx.fillStyle = sw.color;
      ctx.beginPath();
      ctx.arc(swX, swBoxStartY + 10 * scale, 4 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Labels and time
    ctx.textAlign = "center";
    ctx.fillStyle = "#888";
    ctx.font = `bold ${11 * scale}px sans-serif`;
    const labelY = swBoxStartY + 25 * scale;
    ctx.fillText(sw.label, swX, labelY);
    
    ctx.fillStyle = isActive ? "#fff" : sw.color;
    ctx.font = `bold ${18 * scale}px monospace`;
    const timeY = swBoxStartY + 50 * scale;
    ctx.fillText(timeStr, swX, timeY);
  });
}

function drawClockValueC(ctx, x, labelY, valueY, label, val, color, scale) {
  ctx.textAlign = "center";
  ctx.fillStyle = "#888";
  ctx.font = `bold ${11 * scale}px sans-serif`;
  ctx.fillText(label, x, labelY);
  ctx.fillStyle = color;
  ctx.font = `bold ${18 * scale}px monospace`;
  ctx.fillText(val, x, valueY);
}

function getSWTimeFormattedC(sw) {
  let elapsed = sw.elapsed;
  if (sw.running) elapsed += (Date.now() - sw.startTime);
  const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2,'0');
  const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// ==================== CONTROL FUNCTIONS ====================

function startFlightTimerTypeC() {
  flightStartTimeTypeC = new Date();
}

function resetFlightTimerTypeC() {
  flightStartTimeTypeC = null;
}

// Toggle stopwatch (1, 2 or 3)
function toggleStopwatchTypeC(num) {
  const sw = num === 1 ? stopwatch1TypeC : num === 2 ? stopwatch2TypeC : stopwatch3TypeC;
  
  if (sw.running) {
    sw.elapsed += Date.now() - sw.startTime;
    sw.running = false;
  } else {
    sw.startTime = Date.now();
    sw.running = true;
  }
}

function resetStopwatchTypeC(num) {
  const sw = num === 1 ? stopwatch1TypeC : num === 2 ? stopwatch2TypeC : stopwatch3TypeC;
  sw.elapsed = 0;
  sw.running = false;
  sw.startTime = 0;
}

// ==================== RESPONSIVE HIT DETECTION ====================
// Calculate which stopwatch zone was touched/clicked based on current canvas size

function getStopwatchZoneC(x, y, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  
  // Calculate scale factor
  const scaleX = w / DESIGN_WIDTH;
  const scaleY = h / DESIGN_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  const swBoxStartY = h * LAYOUT.swBoxStartY;
  const swBoxH = h * LAYOUT.swBoxHeight;
  const swBoxW = swBoxH * (LAYOUT.swBoxWidth * DESIGN_HEIGHT / 340);

  // Check if click is in the stopwatch area vertically
  if (y < swBoxStartY || y > swBoxStartY + swBoxH) return 0;

  // Check horizontal zones
  const tolerance = swBoxW / 2;
  const sw1X = cx + (LAYOUT.swLeftX * w);
  const sw2X = cx + (LAYOUT.swCenterX * w);
  const sw3X = cx + (LAYOUT.swRightX * w);

  if (Math.abs(x - sw1X) < tolerance) return 1;
  if (Math.abs(x - sw2X) < tolerance) return 2;
  if (Math.abs(x - sw3X) < tolerance) return 3;

  return 0;
}

// ==================== UPDATE / ANIMATION LOOP ====================

function updateTimerClockStyleC() {
  if (testMode === "pause") return;
  
  const canvas = document.getElementById("timerCanvasStyleC");
  if (canvas) drawTimerFaceStyleC(canvas);
}

// Start the timer display with auto-resize capability
function initTimerStyleC(canvasElement) {
  // Initial draw
  drawTimerFaceStyleC(canvasElement);
  
  // Update every 200ms (smooth seconds)
  setInterval(() => {
    drawTimerFaceStyleC(canvasElement);
  }, 200);

  // Handle window resize (redraw immediately)
  window.addEventListener("resize", () => {
    drawTimerFaceStyleC(canvasElement);
  });
}

// ==================== EVENT LISTENERS ====================

const timerCanvasStyleC = document.getElementById("timerCanvasStyleC");

if (timerCanvasStyleC) {
  // Click handler
  timerCanvasStyleC.addEventListener("click", (e) => {
    const rect = timerCanvasStyleC.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const zone = getStopwatchZoneC(x, y, timerCanvasStyleC);
    if (zone) toggleStopwatchTypeC(zone);
  });

  // Mouse move for hover effects
  timerCanvasStyleC.addEventListener("mousemove", (e) => {
    const rect = timerCanvasStyleC.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    hoverZoneTypeC = getStopwatchZoneC(x, y, timerCanvasStyleC);
    timerCanvasStyleC.style.cursor = hoverZoneTypeC ? "pointer" : "default";
  });

  // Touch start handler
  timerCanvasStyleC.addEventListener("touchstart", (e) => {
    const rect = timerCanvasStyleC.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const zone = getStopwatchZoneC(x, y, timerCanvasStyleC);
    if (zone) toggleStopwatchTypeC(zone);
    hoverZoneTypeC = zone;
  });

  // Touch move for visual feedback
  timerCanvasStyleC.addEventListener("touchmove", (e) => {
    const rect = timerCanvasStyleC.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    hoverZoneTypeC = getStopwatchZoneC(x, y, timerCanvasStyleC);
  });

  // Touch end - clear hover
  timerCanvasStyleC.addEventListener("touchend", () => {
    hoverZoneTypeC = 0;
  });

  // Mouse leave - clear hover
  timerCanvasStyleC.addEventListener("mouseleave", () => {
    hoverZoneTypeC = 0;
    timerCanvasStyleC.style.cursor = "default";
  });
}

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  const c = document.getElementById("timerCanvasStyleC");
  if (c) {
    // Set initial size (responsive)
    c.width = 420;
    c.height = 340;
    initTimerStyleC(c);
  }
});

/*
  ========== USAGE NOTES ==========
  
  1. Add a canvas to your HTML:
     <canvas id="timerCanvasStyleC" style="width: 100%; height: auto; border: 1px solid #ccc;"></canvas>
  
  2. Make it responsive by resizing the canvas:
     CSS: canvas { max-width: 100%; }
     Or in JavaScript: canvasElement.width = window.innerWidth;
  
  3. The touch and click zones automatically scale with the canvas size thanks to:
     - LAYOUT constants (as percentages/ratios of design size)
     - getStopwatchZoneC() calculates hit detection based on current canvas dimensions
     - All drawing uses scaled coordinates
  
  4. API:
     - startFlightTimerTypeC()
     - resetFlightTimerTypeC()
     - toggleStopwatchTypeC(1|2|3)
     - resetStopwatchTypeC(1|2|3)
     - updateTimerClockStyleC() (call from your update loop if needed)
  
  5. Key improvements over StyleB:
     - Fully responsive - scales to any canvas size
     - Touch/click zones remain accurate regardless of zoom
     - No hardcoded pixel values in hit detection
     - Automatic window resize handling
     - Better proportional scaling
*/
