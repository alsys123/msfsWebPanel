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

let gsdGeneralMagneto    = 0; //0,1,2,3,4 (off,right,left,both,start)
let gsdMasterBattery     = 0;
let gsdMasterAlternator  = 0;

let gsdAvionicsMaster = 0;
let gsdFuelPump       = 0;
let gsdGeneralMagnetoFix = 0;

let gsdFuelLeft  = 0;
let gsdFuelRight = 0;

let gsdPitchRad = 0;
let gsdRollRad  = 0;

let gsdRpm = 0;
let gsdManifold = 0;

//Comms
let gsdCom1Active  = 0;
let gsdCom1Standby = 0;
let gsdCom2Active  = 0;
let gsdCom2Standby = 0;
let gsdNav1Active  = 0;
let gsdNav1Standby = 0;
let gsdNav2Active  = 0;
let gsdNav2Standby = 0;
let gsdAdfActive   = 0;
let gsdXpdrCode    = 0;
let gsdXpdrState   = "";

async function updateSimData() {
    
    cLog("updateSimData");
	
    if (testMode === "pause")
    {
	// reset everything
	gsdHeading  = 0;
	gsdHeadingBug  = 0;
	gsdTurnRate  = 0;
	gsdSlipSkid  = 0;
	gsdTrimValue  = 0;
	gsdApActive  = false;
	gsdKts  = 0;
	gsdAltitude  = 0;
	gsdFlapsIndex  = 0;
	gsdParkingBrake  = 0;
	gsdBeaconLight  = 0;
	gsdFuelLeft  = 0;
	gsdFuelRight = 0;
	gsdPitchRad = 0;
	gsdRollRad  = 0;
	gsdRpm = 0;
	gsdManifold = 0;
	
	gsdOilTemp      = 0;
	gsdOilPressure = 0;

	//Comms
	gsdCom1Active  = 0;
	gsdCom1Standby = 0;
	gsdCom2Active  = 0;
	gsdCom2Standby = 0;
	gsdNav1Active  = 0;
	gsdNav1Standby = 0;
	gsdNav2Active  = 0;
	gsdNav2Standby = 0;
	gsdAdfActive   = 0;
	gsdXpdrCode    = 0;
	gsdXpdrState   = "";
	
	return;
    }

    // test mode
    if (testMode === "on") {

	gsdHeading = Math.sin(Date.now() / 800) * 18;
	gsdHeadingBug = (gsdHeadingBug + 0.8) % 360;  // slow drift: 0.03° per frame

	gsdTurnRate = Math.sin(Date.now() / 900) * 4.2;
	gsdSlipSkid = Math.sin(Date.now() / 650) * 1.1;

	gsdTrimValue = Math.sin(Date.now() / 3000) * 0.33; // Slow oscillation for demo
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

	
	gsdFuelLeft = [26,5,10,0,20,15][(new Date().getSeconds() % 5) * 2];
	gsdFuelRight = [0,26,10,15,20,0][(new Date().getSeconds() % 7) * 1];

	gsdRpm = 2400 + Math.sin(Date.now() / 2000) * 800;

	// Goto these values every %40 seconds and stay there 7 seconds
	gsdManifold = ([15,10,20,25,50,30,35,40,45,null])[(
	    Math.floor(((Date.now()/1000)%40)/7))]
	    ?? gsdManifold;  

	    // Goto these values every %40 seconds and stay there 7 seconds
	gsdOilTemp = ([
	    0,100,50,150,200,250,null])[(
		Math.floor(((Date.now()/1000)%40)/7))]
    	    ?? gsdOilTemp;  
	
	gsdOilPressure = ([
	    0,20,40,60,80,100,110,null])[(
		Math.floor(((Date.now()/1000)%60)/8))]
    	    ?? gsdOilPressure;  

	gsdCom1Active = ([
	    112.2,122.4,113.00,122.8,125.525,117.700,null])[(
		Math.floor(((Date.now()/1000)%60)/5))]
    	    ?? gsdCom1Active;  

	gsdCom1Standby = ([
	    112.2,0,113.00,122.8,125.525,117.700,null])[(
		Math.floor(((Date.now()/1000)%60)/6))]
    	    ?? gsdCom1Standby;  

	gsdXpdrState = ([
	    "ALT","STN","??","OFF",null])[(
		Math.floor(((Date.now()/1000)%60)/5))]
    	    ?? gsdXpdrState;  
	
	
    } else {
    try {

	const res = await fetch(gServerIP);
	const d   = await res.json();

//	cLog("full data packet from server",d);
	
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

	//gsdGeneralMagneto    = d.generalMagneto || 0;
	gsdMasterBattery     = d.masterBattery || 0;
	gsdMasterAlternator  = d.masterAlternator || 0;
	gsdMagnetoLeft       = d.magnetoLeft || 0;
	gsdMagnetoRight      = d.magnetoRight || 0;
	// 0:off, 1:right, 2: left, 3: both
	gsdGeneralMagnetoFix = (gsdMagnetoLeft << 1) | gsdMagnetoRight; 

	gsdAvionicsMaster = d.avionicsMaster || 0;
	gsdFuelPump       = d.fuelPump || 0;

	gsdRpm      = d.rpm || 0;
	gsdManifold = d.manifoldPressure || 0;
	
	gsdOilTemp      = d.oilTemp || 0;
	gsdOilPressure  = d.oilPressure || 0;

	//Comms
	gsdCom1Active   = d.com1Active  || 0;
        gsdCom1Standby  = d.com1Standby || 0;
	gsdCom2Active   = d.com2Active  || 0;
        gsdCom2Standby  = d.com2Standby || 0;
        gsdNav1Active   = d.nav1Active  || 0;
        gsdNav1Standby  = d.nav1Standby || 0;
        gsdNav2Active   = d.nav2Active  || 0;
        gsdNav2Standby  = d.nav2Standby || 0;
        gsdAdfActive    = d.adfActive   || 0;
        gsdXpdrCode     = d.xpdrCode    || 0;
	gsdXpdrState    = d.xpdrState;
	
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
