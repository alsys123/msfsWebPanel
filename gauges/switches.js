// ==================== C172-STYLE ELECTRICAL SWITCH PANEL ====================
// Consistent dark aviation style with your other gauges

const switches = [
  // Row 1 - Magnetos & Master
  { id: "magOff",    label: "MAG OFF",   x: 60,  y: 80,  w: 110, h: 68, state: true,  type: "mag",   colorOn: "#ff2222" },
  { id: "magR",      label: "R",         x: 190, y: 80,  w: 68,  h: 68, state: false, type: "mag",   colorOn: "#ffdd00" },
  { id: "magL",      label: "L",         x: 278, y: 80,  w: 68,  h: 68, state: false, type: "mag",   colorOn: "#ffdd00" },
  { id: "magBoth",   label: "BOTH",      x: 366, y: 80,  w: 110, h: 68, state: false, type: "mag",   colorOn: "#ffdd00" },
  
  { id: "master",    label: "MASTER",    x: 520, y: 80,  w: 130, h: 68, state: true,  type: "toggle", colorOn: "#00ff88" },
  { id: "alt",       label: "ALT",       x: 670, y: 80,  w: 130, h: 68, state: true,  type: "toggle", colorOn: "#00ff88" },

  // Row 2 - Lights
  { id: "beacon",    label: "BEACON",    x: 60,  y: 190, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ff8800" },
  { id: "nav",       label: "NAV",       x: 210, y: 190, w: 130, h: 62, state: false, type: "toggle", colorOn: "#00ccff" },
  { id: "strobe",    label: "STROBE",    x: 360, y: 190, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ff8800" },
  { id: "landing",   label: "LANDING",   x: 520, y: 190, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ffff00" },
  { id: "taxi",      label: "TAXI",      x: 670, y: 190, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ffff00" },

  // Row 3 - Other electrics
  { id: "avionics",  label: "AVIONICS",  x: 60,  y: 290, w: 130, h: 62, state: false, type: "toggle", colorOn: "#00ffcc" },
  { id: "pitot",     label: "PITOT HEAT",x: 210, y: 290, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ff6666" },
  { id: "fuelPump",  label: "FUEL PUMP", x: 360, y: 290, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ffaa00" },
  { id: "panel",     label: "PANEL",     x: 520, y: 290, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ffee88" },
  { id: "parkingBrake",     label: "PARKING BRAKE",     x: 670, y: 290, w: 130, h: 62, state: false, type: "toggle", colorOn: "#ffee88" },

  // Bottom row - smaller toggles
//  { id: "com1", label: "COM1", x: 60,  y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ccff" },
 // { id: "com2", label: "COM2", x: 120, y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ccff" },
  //{ id: "nav1", label: "NAV1", x: 200, y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ccff" },
 // { id: "nav2", label: "NAV2", x: 260, y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ccff" },
 // { id: "dme1", label: "DME1", x: 340, y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ccff" },
 // { id: "dme2", label: "DME2", x: 400, y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ccff" },

 // { id: "gps",       label: "GPS",       x: 480, y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ffcc" },
 // { id: "adf",       label: "ADF",       x: 560, y: 400, w: 60,  h: 52, state: false, type: "toggle", colorOn: "#00ccff" },
  { id: "transponder",label:"XPDR",     x: 640, y: 400, w: 60,  h: 52, state: true,  type: "toggle", colorOn: "#ffdd00" },
];

function drawSwitches(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background panel
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(20, 30, w - 40, h - 60);

  // Panel border / bezel
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 18;
  ctx.strokeRect(28, 38, w - 56, h - 76);

  ctx.fillStyle = "#eeeeee";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CESSNA 172 ELECTRICAL", w/2, 68);

  ctx.font = "bold 17px monospace";

  switches.forEach(sw => {
    const isOn = sw.state;

    // Switch body
    ctx.fillStyle = isOn ? "#333333" : "#222222";
    ctx.fillRect(sw.x, sw.y, sw.w, sw.h);

    ctx.strokeStyle = isOn ? sw.colorOn : "#666666";
    ctx.lineWidth = 6;
    ctx.strokeRect(sw.x + 6, sw.y + 6, sw.w - 12, sw.h - 12);

    // Toggle "lever" / highlight
    ctx.fillStyle = isOn ? sw.colorOn : "#555555";
    const leverY = isOn ? sw.y + 12 : sw.y + sw.h - 28;
    ctx.fillRect(sw.x + 12, leverY, sw.w - 24, 18);

    // Label
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(sw.label, sw.x + sw.w/2, sw.y + sw.h + 24);
  });

    /*
  // Status indicators
  ctx.font = "bold 15px monospace";
  ctx.fillStyle = "#00ff88";
  ctx.fillText("BAT", 740, 170);
  ctx.fillText("ALT", 740, 195);
  */
}

// ==================== INTERACTION ====================
function toggleSwitch(x, y) {
  const canvas = document.getElementById("switchesCanvas");
  const rect = canvas.getBoundingClientRect();
  const clickX = x - rect.left;
  const clickY = y - rect.top;

  switches.forEach(sw => {
    if (clickX > sw.x && clickX < sw.x + sw.w &&
        clickY > sw.y && clickY < sw.y + sw.h) {
      
/*
	sw.state = !sw.state;

      // Magneto logic (radio buttons style)
      if (sw.type === "mag") {
        switches.forEach(s => { if (s.type === "mag") s.state = false; });
        sw.state = true;
      }
*/
	// if it is a toggle type switch
	if (sw.type === "toggle" ) toggleASwitch(sw.id);

	if (sw.type === "mag" ) setMagneto(sw.id);
	

      // Optional: send to your backend
      // fetch("http://10.0.0.216:5000/switch", { method: "POST", body: JSON.stringify({id: sw.id, state: sw.state}) });

      drawSwitches(canvas);
    }

  });
} //toggleSwitch

// ==================== INIT ====================
const panelCanvas = document.getElementById("switchesCanvas");
panelCanvas.width = 860;
panelCanvas.height = 520;

drawSwitches(panelCanvas);

// Click handling
panelCanvas.addEventListener("click", (e) => {
  toggleSwitch(e.clientX, e.clientY);
});

/*
// Keyboard support (optional)
document.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") {
    // Toggle master as example
    const master = switches.find(s => s.id === "master");
    if (master) master.state = !master.state;
    drawSwitches(panelCanvas);
  }
});
*/

function updateSwitches() {


    // lights
    updateASwitch("nav",    gsdNavLight);
    updateASwitch("beacon", gsdBeaconLight);
    updateASwitch("landing",gsdLandingLight);
    updateASwitch("taxi",   gsdTaxiLight);
    updateASwitch("strobe", gsdStrobeLight);

    updateASwitch("magOff",  gsdGeneralMagnetoFix === 0);
    updateASwitch("magR",    gsdGeneralMagnetoFix === 1);
    updateASwitch("magL",    gsdGeneralMagnetoFix === 2);
    updateASwitch("magBoth", gsdGeneralMagnetoFix === 3);
        
    updateASwitch("master",  gsdMasterBattery);
    updateASwitch("alt",     gsdMasterAlternator);

//  others
    updateASwitch("avionics",     gsdAvionicsMaster);
    updateASwitch("pitot",        gsdPitotHeat);
    updateASwitch("fuelPump",     gsdFuelPump);
    updateASwitch("panel",        gsdPanelLight);
    updateASwitch("parkingBrake", gsdParkingBrake);    


    drawSwitches(panelCanvas);
}


function updateASwitch(id, value) {
    const sw = switches.find(s => s.id === id);
    if (sw) sw.state = value;
}

// !!! this comes from a CLICK !!! 
// toggle the state - on/off in the gui and toggle the corresponding global simvar
//..??? future send the value to the sim
function toggleASwitch(id) {
    
    const sw = switches.find(s => s.id === id);
    if (!sw) return;

    sw.state = !sw.state;

    const globals = {
        parkingBrake:  () => gsdParkingBrake  = !gsdParkingBrake,
        masterBattery: () => gsdMasterBattery = !gsdMasterBattery

    };

    if (globals[id]) globals[id]();

    // !!!!! FUTURE ...  send the new state to the server
}

function setMagneto(id) {
    // 1. Set the global SimVar based on the ID
    switch (id) {
        case "magOff":
            gsdGeneralMagneto = 0;
            break;
        case "magR":
            gsdGeneralMagneto = 1;
            break;
        case "magL":
            gsdGeneralMagneto = 2;
            break;
        case "magBoth":
            gsdGeneralMagneto = 3;
            break;
        default:
            return; // unknown ID
    }

    // 2. Update all UI switches so only one is active
    updateASwitch("magOff",  id === "magOff");
    updateASwitch("magR",    id === "magR");
    updateASwitch("magL",    id === "magL");
    updateASwitch("magBoth", id === "magBoth");
}
