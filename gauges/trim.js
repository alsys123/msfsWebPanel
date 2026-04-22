function drawTrimWheelFace(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = w / 2 - 15;

  ctx.clearRect(0, 0, w, h);

  // === Bezel ===
  ctx.beginPath();
  ctx.arc(cx, cy, r + 12, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#444";
  ctx.stroke();

  // === Wheel background ===
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();

  // === Tick marks ===
  for (let i = -10; i <= 10; i++) {
    const angle = (i * 9 - 90) * Math.PI / 180; // 9° per tick
    const inner = r - 40;
    const outer = r - 10;

    ctx.beginPath();
    ctx.moveTo(cx + inner * Math.cos(angle), cy + inner * Math.sin(angle));
    ctx.lineTo(cx + outer * Math.cos(angle), cy + outer * Math.sin(angle));
    ctx.lineWidth = (i % 5 === 0) ? 4 : 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    // Labels every 5 ticks
    if (i % 5 === 0) {
      const tx = cx + (inner - 25) * Math.cos(angle);
      const ty = cy + (inner - 25) * Math.sin(angle);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(i, tx, ty);
    }
  }

  // === Center hub ===
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();
}


const trimPointer = document.getElementById("trimPointer");
trimPointer.style.position = "absolute";
trimPointer.style.width = "6px";
trimPointer.style.height = "90px";
trimPointer.style.background = "#ffdd00";
trimPointer.style.left = "147px";   // center for 300px gauge
trimPointer.style.top = "60px";
transformOrigin = "50% 90%";


async function updateTrimWheel() {
  if (testMode === "pause") return;

  let trim = 0;

  if (testMode === "on") {
    trim = Math.sin(Date.now() / 900);  // test animation
  } else {
    try {
      const res = await fetch("http://10.0.0.216:5000/data");
      const d = await res.json();
      trim = d.trim || 0;   // -1 to +1
    } catch (e) {
      console.log("Trim fetch error:", e);
      return;
    }
  }

  // Convert trim (-1..+1) to rotation degrees
  const deg = trim * 90;   // full wheel = 180° sweep

  const pointer = document.getElementById("trimPointer");
  pointer.style.transform = `rotate(${deg}deg)`;
}

const trimCanvas = document.getElementById("trimCanvas");
drawTrimWheelFace(trimCanvas);
