function drawHeadingFace(canvas) {
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

  // Draw compass rose
  for (let deg = 0; deg < 360; deg += 5) {
    const angle = (deg - 90) * Math.PI/180; // 0° at top

    const isMajor = deg % 30 === 0;
    const inner = isMajor ? r - 50 : r - 30;
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

    // Numbers every 30°
    if (isMajor) {
      const tx = cx + (r - 80) * Math.cos(angle);
      const ty = cy + (r - 80) * Math.sin(angle);


	// label display
//	let label = deg / 30;
	let label = deg;

	if (label === 0) label = "N";
	else if (label === 30) label = "E";
	else if (label === 60) label = "S";
	else if (label === 90) label = "W";
	
	if (label > 90) label = label/10;
	    
      ctx.fillStyle = "#fff";
      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, tx, ty);
    }
  }
}


async function updateHeading() {
  let hdg;
    if (testMode === "pause") return;
    
  if (testMode === "on") {
//      hdg = Math.random() * 360;
      hdg = 60;
      
  } else {
    try {
      const res = await fetch(gServerIP);
      const d = await res.json();
//	hdg = d.heading;

	hdg = radToDeg(d.heading);

//	cLog("Heading set to:", hdg);
    } catch (e) {
      console.log("Heading fetch error:", e);
      return;
    }
  }

  // Rotate the entire card
  document.getElementById("hdgGauge").style.transform =
    `rotate(${-hdg}deg)`;  // negative = card rotates opposite aircraft
}

drawHeadingFace(document.getElementById("hdgGauge"));

