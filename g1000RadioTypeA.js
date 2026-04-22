// ==================== G1000 COM/NAV STACK ====================
// Top-bar implementation for COM, NAV, and XPDR

function drawG1000Stack(canvas, radioData) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = 60; // Standard thin bar height
  
  ctx.clearRect(0, 0, w, h);

  // Background Bar
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#222222");
  gradient.addColorStop(1, "#050505");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, w, h);

  // Helper for drawing radio blocks
  const drawRadio = (x, label, active, stby, isActiveSide) => {
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText(label, x, 20);

    // Active Frequency (Cyan/Green if active)
    ctx.font = "bold 22px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(active.toFixed(3), x, 45);

    // The "Flip-Flop" Arrow
    ctx.fillStyle = "#00ffcc";
    ctx.font = "16px sans-serif";
    ctx.fillText("↔", x + 85, 42);

    // Standby Frequency (Cyan/Green for tuning)
    ctx.fillStyle = "#00ffcc";
    ctx.fillText(stby.toFixed(3), x + 110, 45);
    
    // Selection Box around Standby (The "Tuning" focus)
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 105, 25, 85, 25);
  };

  // 1. NAV1 (Left)
  drawRadio(10, "NAV1", radioData.nav1_act, radioData.nav1_stby);

  // 2. COM1 (Center-Left)
  drawRadio(220, "COM1", radioData.com1_act, radioData.com1_stby);

  // 3. XPDR (Transponder - Center-Right)
  const xpdrX = 440;
  ctx.fillStyle = "#aaaaaa";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("XPDR", xpdrX, 20);
  
  ctx.fillStyle = "#00ff00"; // Green for active squawk
  ctx.font = "bold 22px monospace";
  ctx.fillText(radioData.xpdr_code, xpdrX, 45);
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(radioData.xpdr_mode, xpdrX + 55, 45);

  // 4. CLOCK (Far Right)
  const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
  ctx.textAlign = "right";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px monospace";
  ctx.fillText(time, w - 15, 35);
  ctx.font = "bold 10px sans-serif";
  ctx.fillText("LCL", w - 15, 50);
}

// ==================== RADIO LOGIC & STATE ====================
let radioState = {
  com1_act: 121.500,
  com1_stby: 118.700,
  nav1_act: 110.30,
  nav1_stby: 113.90,
  xpdr_code: "1200",
  xpdr_mode: "ALT"
};

// Simulate Frequency Swapping (The "Flip-Flop")
function swapCom1() {
  const temp = radioState.com1_act;
  radioState.com1_act = radioState.com1_stby;
  radioState.com1_stby = temp;
}

// ==================== UPDATE LOOP ====================
async function updateStack() {
  // In a real app, you'd fetch this from SimConnect
  // Example: const res = await fetch("http://10.0.0.216:5000/radios");
  
  const canvas = document.getElementById("radioStackCanvas");
  drawG1000Stack(canvas, radioState);
}

const radioCanvas = document.getElementById("radioStackCanvas");
radioCanvas.width = 800; // Wide for the top of the PFD
radioCanvas.height = 60;
setInterval(updateStack, 100);
