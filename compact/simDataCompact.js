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


function updateSimData() {
    
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

	
	gsdFuelLeft = [26,5,10,0,20,15][(new Date().getSeconds() % 5) * 2];
	gsdFuelRight = [0,26,10,15,20,0][(new Date().getSeconds() % 7) * 1];

	gsdRpm = 2400 + Math.sin(Date.now() / 2000) * 800;

	
	
    } else {
	try {

	    serverCall();
/*	    
	    dei("asiTextReadout").innerHTML += "try..<br>";
	    
	    var xhr = new XMLHttpRequest();

	    dei("asiTextReadout").innerHTML += "1. "+ gServerIP +
		"<br>";

	    xhr.open("GET", gServerIP, true);

	    dei("asiTextReadout").innerHTML += "STATUS: " +
		xhr.status + "<br>";

//	    dei("asiTextReadout").innerHTML += "2. "+
//		xhr.onreadystatechange +
//		"<br>";

	    xhr.onreadystatechange = function() {

	    dei("asiTextReadout").innerHTML += "3. "+ xhr.readyState +
		"<br>";
		
		if (xhr.readyState === 4) {

		    dei("asiTextReadout").innerHTML += "STATUS: " +
			xhr.status + "<br>";

		    dei("asiTextReadout").innerHTML += "RAW: " +
			xhr.responseText + "<br>";

		    if (xhr.status === 200) {
			var d = JSON.parse(xhr.responseText);
			
			gsdKts = d.airspeed;
			dei("asiTextReadout").innerHTML += "==> " + gsdKts + "<br>";
		    } else {
			console.log("XHR error:", xhr.status);
		    }
		}
	    };
	    
	    xhr.send();
	    */
	} catch (e) {
	    console.log("Heading fetch error:", e);
	    return;
	}
	
	
    }
    
} //updateSimData


// Binary coded octal 16 bit to decimal
function decodeTransponder(value) {
    const d1 = (value >> 12) & 0xF;
    const d2 = (value >> 8) & 0xF;
    const d3 = (value >> 4) & 0xF;
    const d4 = value & 0xF;
    return "" + d1 + d2 + d3 + d4;
    //    return `${d1}${d2}${d3}${d4}`;
}


var xhrSim = null;
var xhrBusy = false;

function serverCall() {
    if (xhrBusy) {
        // Old iPads cannot handle overlapping XHR
        return;
    }
    
    xhrBusy = true;
    
    if (!xhrSim) {
        xhrSim = new XMLHttpRequest();
    }
    
    xhrSim.onreadystatechange = function() {
	try {
        if (xhrSim.readyState === 4) {
	    
            dei("asiTextReadout").innerHTML += "3. " + xhrSim.readyState + "<br>";
	    
            if (xhrSim.status === 200) {
                var d = JSON.parse(xhrSim.responseText);
                gsdKts = d.airspeed;
                dei("asiTextReadout").innerHTML += "==> " + gsdKts + "<br>";
            }
	    xhrBusy = false; // allow next request
        }
	} catch (e) {

	}
    };
    
    xhrSim.open("GET", gServerIP, true);
    xhrSim.send();
    
}
