// ==================== C172 VERTICAL RADIO STACK ====================
// A vertical stack layout typical of the C172 center console

function drawC172Stack(canvas, data) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  
  // Background - Dark grey textured plastic look
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, w, h);
  
  // Vertical Trim lines (The "Rack" edges)
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, w-4, h-4);

  let currentY = 10;

  // --- AUDIO PANEL (GMA 1347 Style) ---
  drawSubPanel(ctx, 5, currentY, w - 10, 80, "AUDIO PANEL");
  drawAudioButtons(ctx, 15, currentY + 30);
  currentY += 90;

  // --- NAV/COM 1 (GIA 63 Style) ---
  drawRadioUnit(ctx, 5, currentY, w - 10, 120, "NAV1 / COM1", data.com1, data.nav1);
  currentY += 130;

  // --- NAV/COM 2 ---
  drawRadioUnit(ctx, 5, currentY, w - 10, 120, "NAV2 / COM2", data.com2, data.nav2);
  currentY += 130;

  // --- XPDR (Transponder) ---
  drawTransponder(ctx, 5, currentY, w - 10, 80, data.xpdr);
}

function drawSubPanel(ctx, x, y, w, h, title) {
  ctx.fillStyle = "#222222";
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 5);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "#888888";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, x + w/2, y + 15);
}

function drawRadioUnit(ctx, x, y, w, h, title, com, nav) {
  drawSubPanel(ctx, x, y, w, h, title);
  
  // Freq Display Areas
  ctx.fillStyle = "#000000";
  ctx.fillRect(x + 10, y + 25, w - 20, 40); // COM Display
  ctx.fillRect(x + 10, y + 70, w - 20, 40); // NAV Display

  // Text Logic
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "left";
  
  // COM Numbers
  ctx.fillStyle = "#ffffff"; // Active
  ctx.fillText(com.act.toFixed(3), x + 15, y + 52);
  ctx.fillStyle = "#00ffcc"; // Standby
  ctx.fillText(com.stby.toFixed(3), x + 95, y + 52);
  
  // NAV Numbers
  ctx.fillStyle = "#ffffff";
  ctx.fillText(nav.act.toFixed(2), x + 15, y + 97);
  ctx.fillStyle = "#00ffcc";
  ctx.fillText(nav.stby.toFixed(2), x + 95, y + 97);

  // Indicators
  ctx.font = "9px sans-serif";
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText("COM", x + 15, y + 35);
  ctx.fillText("NAV", x + 15, y + 80);
}

function drawAudioButtons(ctx, x, y) {
  const btns = ["COM1", "COM2", "NAV1", "NAV2", "MKR", "AUX"];
  btns.forEach((label, i) => {
    const bx = x + (i * 38);
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.roundRect(bx, y, 32, 20, 3);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, bx + 16, y + 13);
  });
}

function drawTransponder(ctx, x, y, w, h, xpdr) {
  drawSubPanel(ctx, x, y, w, h, "TRANSPONDER");
  ctx.fillStyle = "#000000";
  ctx.fillRect(x + 50, y + 25, w - 100, 40);
  
  ctx.fillStyle = "#00ff00";
  ctx.font = "bold 24px monospace";
  ctx.textAlign = "center";
  ctx.fillText(xpdr.code, x + w/2, y + 53);
  
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(xpdr.mode, x + w/2 + 60, y + 53);
}

// ==================== STATE & INIT ====================
const c172Data = {
  com1: { act: 118.700, stby: 121.500 },
  nav1: { act: 113.90, stby: 110.30 },
  com2: { act: 125.450, stby: 122.800 },
  nav2: { act: 115.70, stby: 117.10 },
  xpdr: { code: "1200", mode: "ALT" }
};

const stackCanvas = document.getElementById("c172Stack");
stackCanvas.width = 260; // Narrower for a stack
stackCanvas.height = 500;

function updateC172() {
  drawC172Stack(stackCanvas, c172Data);
}
setInterval(updateC172, 100);
