/* ------------------------------
   SimData

   - collect Simutation data
   ------------------------------ */

// set of global simuation variables
// update every xxx milliseconds and ready to use
// global Simulatiion data
let gsdHeading    = 0;
let gsdHeadingBug = 0;

let gsdTurnRate = 0;
let gsdSlipSkid = 0;

let gsdTrimValue = 0; // -1.0 to 1.0
let gsdApActive  = true;

let gsdKts = 0;

let gsdAltitude = 0;
let gsdPressure = 29.92;

async function updateSimData() {
    
    cLog("updateSimData");
	
    if (testMode === "pause") return;

    // test mode
    if (testMode === "on") {

	gsdHeading = Math.sin(Date.now() / 800) * 18;
	gsdHeadingBug = (gsdHeadingBug + 0.8) % 360;  // slow drift: 0.03° per frame

	gsdTurnRate = Math.sin(Date.now() / 900) * 4.2;
	gsdSlipSkid = Math.sin(Date.now() / 650) * 1.1;

	gsdTrimValue = Math.sin(Date.now() / 3000) * 0.8; // Slow oscillation for demo
	gsdApActive = Math.sin(Date.now() / 5000) > 0;

	
	const targetKts = Math.random() * 160; // smooth random motion
	currentKts += (targetKts - currentKts) * 0.1;
	gsdKts = currentKts;

	gsdAltitude = (Date.now() / 10) % 15000;
	
  } else {
    try {

	const res = await fetch(gServerIP);
	const d   = await res.json();

	
	gsdHeading = d.heading || 0;
	gsdHeading = radToDeg(gsdHeading);
	
	gsdHeadingBug = d.bug;

	const turnRateRaw = d.turn || 0;
	const slipSkidRaw = d.slip || 0;
	gsdTurnRate = (turnRateRaw * 180 / Math.PI) * 2.5;  // scale for needle
	gsdSlipSkid = slipSkidRaw * 10;                         // scale for ball

	gsdTrimValue = d.eTrim || 0; 
	gsdApActive = d.ap_active || false;

	gsdKts = d.airspeed;

	gsdAltitude = d.altitude;
	sdPressure  = d.baro_setting || 29.92;

	
    } catch (e) {
	console.log("Heading fetch error:", e);
	return;
    }
  }
    
} //updateSimData

