
/* ------------------------------
   C172 Speed gauge
   ------------------------------ */



function drawASI_Face(canvas) {
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r  = canvas.width / 2 - 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // -------------------------
  // BEZEL
  // -------------------------
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#333";
  ctx.stroke();

  // -------------------------
  // SCALE SETTINGS
  // -------------------------
  const MIN = 0;
  const MAX = 160;

  // 0 knots at the top (270°)
  const ANGLE_MIN = 270 * Math.PI/180;          // 0 kt
  const ANGLE_MAX = (270 + 270) * Math.PI/180;  // 160 kt

  function valueToAngle(v) {
    const t = (v - MIN) / (MAX - MIN);
    return ANGLE_MIN + t * (ANGLE_MAX - ANGLE_MIN);
  }

  // -------------------------
  // COLORED ARCS (C172 STYLE)
  // -------------------------

  // White arc (0–50)
  ctx.beginPath();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.arc(cx, cy, r - 20, valueToAngle(0), valueToAngle(50));
  ctx.stroke();

  // Green arc (50–110)
  ctx.beginPath();
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 10;
  ctx.arc(cx, cy, r - 20, valueToAngle(50), valueToAngle(110));
  ctx.stroke();

  // Yellow arc (110–160)
  ctx.beginPath();
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = 10;
  ctx.arc(cx, cy, r - 20, valueToAngle(110), valueToAngle(160));
  ctx.stroke();

  // Red line (Vne)
  ctx.beginPath();
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 6;
  const a = valueToAngle(160);
  ctx.arc(cx, cy, r - 20, a - 0.03, a + 0.03);
  ctx.stroke();

  // -------------------------
  // TICKS + NUMBERS
  // -------------------------
  for (let v = MIN; v <= MAX; v += 10) {
    const angle = valueToAngle(v);

    const isMajor = v % 20 === 0;
    const inner = isMajor ? r - 50 : r - 35;
    const outer = r - 10;

    const x1 = cx + inner * Math.cos(angle);
    const y1 = cy + inner * Math.sin(angle);
    const x2 = cx + outer * Math.cos(angle);
    const y2 = cy + outer * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = isMajor ? 4 : 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    if (isMajor) {
      const tx = cx + (r - 80) * Math.cos(angle);
      const ty = cy + (r - 80) * Math.sin(angle);
      ctx.fillStyle = "#fff";
      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(v, tx, ty);
    }
  }
}


async function updateASI() {
  let kts;

    if (testMode === "pause") return;
    
  if (testMode === "on") {
    // smooth random motion
    const target = Math.random() * 160;
    currentKts += (target - currentKts) * 0.1;
    kts = currentKts;

  } else {
    // live mode
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
      kts = d.airspeed;
    } catch (e) {
      console.log("ASI fetch error:", e);
      return;
    }
  }

  // draw needle
  const MIN = 0;
  const MAX = 160;

  const ANGLE_MIN = 0;     // 0 kt at top
  const ANGLE_MAX = 265;   // 160 kt at bottom-right

  const angle =
    ANGLE_MIN + (kts - MIN) / (MAX - MIN) * (ANGLE_MAX - ANGLE_MIN);

  dei("asiNeedle").style.transform = `rotate(${angle}deg)`;
}

drawASI_Face(document.getElementById("asiGauge"));
