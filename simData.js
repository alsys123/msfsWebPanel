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
let gsdApActive  = false;

let gsdKts = 0;

let gsdAltitude = 0;
let gsdPressure = 29.92;

let gsdFlapsIndex = 0;
let testFlapIndex = 0;        // 0..3
let lastFlapChange = 0;       // timestamp

//let gsdBrakeLeft    = 0;
//let gsdBrakeRight   = 0;
let gsdParkingBrake = 0;

// lights
let gsdNavLight     = 0;
let gsdBeaconLight  = 0;
let gsdLandingLight = 0;
let gsdTaxiLight    = 0;
let gsdStrobeLight  = 0;
let gsdPanelLight   = 0;
let gsdPitotHeat    = 0;


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

	// --- Flap test simulation ---
	// Change flap detent every 4 seconds
	const now = Date.now();
	if (now - lastFlapChange > 4000) {
	    testFlapIndex = (testFlapIndex + 1) % 4;   // cycle 0→1→2→3→0
	    lastFlapChange = now;
	}
	// Output simulated flap index
	gsdFlapsIndex = testFlapIndex;

	// mod 10 the 59 seconds - 3 seconds on, therefore 7 seconds off
	gsdParkingBrake = (new Date().getSeconds() % 10 < 3) ? 1 : 0; // every 6 seconds
	gsdBeaconLight = (new Date().getSeconds() % 10 < 5) ? 1 : 0; // every 6 seconds
	
	
  } else {
    try {

	const res = await fetch(gServerIP);
	const d   = await res.json();

	cLog("d data packet from server",d);
	
	gsdHeading = d.headingMag || 0;
	gsdHeading = radToDeg(gsdHeading);
	
	gsdHeadingBug = d.apHeadingBug;

	const turnRateRaw = d.turnRate || 0;
	const slipSkidRaw = d.slipSkid || 0;
	gsdTurnRate = (turnRateRaw * 180 / Math.PI) * 2.5;  // scale for needle
	gsdSlipSkid = slipSkidRaw * 10;                     // scale for ball

	gsdTrimValue = d.elevatorTrim || 0; 
	gsdApActive = d.apMaster || false;

	gsdKts = d.airspeed;

	gsdAltitude = d.altitude;
	sdPressure  = d.baro_setting || 29.92;

	gsdFlapsIndex = d.flapsIndex || 0;

	gsdParkingBrake = d.brakeLeft || d.brakeRight || d.parkingBrake || 0;

	//lights
	gsdNavLight     = d.navLight || 0;
	gsdBeaconLight  = d.beaconLight || 0;
	gsdLandingLight = d.landingLight || 0;
	gsdTaxiLight    = d.taxiLight || 0;
	gsdStrobeLight  = d.strobeLight || 0;
	gsdPanelLight   = d.panelLight || 0;
	gsdPitotHeat    = d.pitotHeat || 0;
	
    } catch (e) {
	console.log("Heading fetch error:", e);
	return;
    }
  }
    
} //updateSimData
/*
//  Connect to msfs using fsiupc

// NOTE:  Cannot do this using http ... ws is not http
// for this to work you need an http connection

// Connect to FSUIPC WebSocket server (default port 2048)
const ws = new WebSocket('ws://10.0.0.218:2048');

ws.onopen = () => {
  console.log('Connected to FSUIPC');

  // Request some vars - FSUIPC uses offset-based reads
  const request = {
    command: 'vars.read',
    name: 'myRequest',
    vars: [
      { name: 'indicated_airspeed', unit: 'knots' },
      { name: 'autopilot_master',   unit: 'bool' },
      { name: 'light_beacon',       unit: 'bool' },
      { name: 'light_nav',          unit: 'bool' },
      { name: 'light_strobe',       unit: 'bool' },
      { name: 'light_landing',      unit: 'bool' },
    ]
  };

  ws.send(JSON.stringify(request));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  // e.g. { light_beacon: true, light_nav: true, indicated_airspeed: 142.3 }
};

ws.onerror = (e) => console.error('FSUIPC error', e);
ws.onclose = () => console.log('Disconnected');
*/
