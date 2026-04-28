/* ------------------------------
   C172 Altimeter gauge
   ------------------------------ */


function drawAltimeterFace(canvas) {
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r  = canvas.width / 2 - 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bezel
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#333";
  ctx.stroke();

  const MIN = 0;
  const MAX = 10000;  // 10k ft per revolution

  function valueToAngle(v) {
    const t = (v - MIN) / (MAX - MIN);
    return (270 + t * 360) * Math.PI/180;  // 0 ft at top
  }

  // Ticks + numbers
  for (let alt = 0; alt <= MAX; alt += 100) {
    const angle = valueToAngle(alt);

    const isMajor = alt % 1000 === 0;
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
      ctx.fillText(alt / 1000, tx, ty);
    }
  }
}


async function updateAltimeter() {
    let altFeet;
    
    if (testMode === "pause") return;
    
  if (testMode === "on") {
    // test mode: random altitude
    altFeet = Math.random() * 10000;
  } else {
    // live mode: fetch from backend
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
      altFeet = d.altitude;
    } catch (e) {
      console.log("Altimeter fetch error:", e);
      return;
    }
  }

  // draw needle
  const MIN = 0;
  const MAX = 10000;

  const t = (altFeet - MIN) / (MAX - MIN);
  const angle = 270 + t * 360;  // 0 ft at top

  document.getElementById("altNeedle").style.transform =
    `rotate(${angle}deg)`;
}

drawAltimeterFace(document.getElementById("altGauge"));
