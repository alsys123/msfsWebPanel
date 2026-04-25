/* ------------------------------
   Mainline
   ------------------------------ */

// Test mode toggle
let testMode = "pause"; // "off", "on", "pause" .. if off, then we are LIVE
let updateTimer = null;

// for testing only!!!
let currentKts = 0;

//let currentPanel = "basic4";
let currentPanel = "sixPack";

const basicTitle = "MSFS Panels for Flight Sim - ";

//let gServerIP = "http://127.0.0.1:5050/data";
//let gServerIP = "http://127.0.0.1:5050/data?test=1";

//let gServerIpPort = "http://127.0.0.1:5050/data";  // good for MAC OS
let gServerIpPort = "http://10.0.0.218:5050/data";  // on windows ..eg.


//let gServerIP = "http://127.0.0.1:5050/data"; // used in gauges call
let gServerIP = ""; // used in gauges call

//let gServerIP = "http://127.0.0.1:5050/data?test=0";
const gTestOffCall  = "?test=0";
const gTestOnCall   = "?test=1";
const gTestMSFSCall = "?test=2";

let testModeInternal = "off";  // used only for toggling logic
//let testModeInternal = "pause";  // used only for toggling logic


// Start immediately
//setupPanelBasic4();
setupPanelSixPack();
startUpdateLoop("pause");  // start up in pause mode
//const btn = dei("basic4ID");   // whatever your button's ID is
const btn = dei("sixPackId");   // whatever your button's ID is
btn.classList.add("active");
//btn.click();                    // triggers the full panel setup
 
/* ------------------------------
   TOP BAR SELECT
   ------------------------------ */

// Panel selection
document.querySelectorAll(".panel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
	document.querySelectorAll(".panel-btn").forEach(b => b.classList.remove("active"));
	btn.classList.add("active");
	
	//const panel = btn.dataset.panel;
	
	currentPanel = btn.dataset.panel;
	cLog("Selected panel:", currentPanel);

	hideAllGauges();

	if (currentPanel === "basic4") 	  setupPanelBasic4();
	if (currentPanel === "sixPack")   setupPanelSixPack();
	if (currentPanel === "switches")  setupPanelSwitches();

	if (currentPanel === "engine")    setupPanelEngine();
	if (currentPanel === "radio")     setupPanelRadio();
	if (currentPanel === "c172")      setupPanelC172();
	if (currentPanel === "c172")      setupPanelC172();
	if (currentPanel === "g1000")     setupPanelG1000();


    });

});

/*
document.getElementById("testToggle").addEventListener("click", () => {

    // we are toggling the Mode switch
    if (testMode === "off") {
	testMode = "on";
    } else if (testMode === "on") {
    testMode = "pause";
    } else {
	testMode = "off";
    }

//    setupTestButton(testMode);

    startUpdateLoop(testMode);
});
*/

// set label and colours
// off, local, server, live
/*function setupTestButton(testModeState) {
    console.log("Test mode:", testModeState);

    testMode = "pause"; // default

    // backward compatible ... for now
    if (testModeState === "off")
	testMode = "pause";  // in this mode gauges will do nothing
    else if (testModeState === "local")
	testMode = "on";     // gauges run local dummy data
    else if (testModeState === "server") {
	testMode = "off";  // get dummy data from the server
	gServerIP = gServerIP + gTestOffCall;
    }
    else if (testModeState === "live") {
	testMode = "off";   // get actual data from msfs
	gServerIP = gServerIP + gTestOnCall;
    }
    
    
}
*/
function setupTestButton(testModeState) {
    console.log("Test mode:", testModeState);

    // internal state for toggling
    testModeInternal = testModeState;

    testMode = "pause"; // default

    // output state for gauge logic
    if (testModeState === "off") {
        testMode = "pause";
    }
    else if (testModeState === "local") {
        testMode = "on";
    }
    else if (testModeState === "server") {
        testMode = "off";   // server uses off-state gauges
        gServerIP = gServerIpPort + gTestOnCall;
    }
    else if (testModeState === "live") {
        testMode = "off";   // live uses off-state gauges
        gServerIP = gServerIpPort + gTestMSFSCall;
    }
}

function startUpdateLoop(testModeState) {
    setupTestButton(testModeState);
    hideAllGauges();

    // Re-load the currently selected panel
    if (currentPanel === "basic4") setupPanelBasic4();
    if (currentPanel === "sixPack") setupPanelSixPack();
    if (currentPanel === "switches") setupPanelSwitches();

    if (currentPanel === "engine") setupPanelEngine();
    if (currentPanel === "radio") setupPanelRadio();
    if (currentPanel === "c172") setupPanelC172();
    if (currentPanel === "g1000") setupPanelG1000();

    //default
//    setupPanelBasic4();
//    const btn = dei("basic4ID");   // whatever your button's ID is
//    btn.classList.add("active");
//    btn.click();                    // triggers the full panel setup
    
//    document.querySelector('[data-panel="basic4"]').click();
    
    if (updateTimer) clearInterval(updateTimer);


    /// ??? not quite sure we need this loop because each gauge
    // can loop itself.  Some do as noted below
    updateTimer = setInterval(() => {
//	updateTurnRate();
	updateASI();      
//	updateAltimeter();
	updateHeading();
//	updateTimerClock();
	updateHeadingTypeB();
//	updateAttitude();
//	updateVsi();
//	updateTrimWheel();
//	updateG1000();
//	updateAltimeterTypeB(); // has self updater
//	updateG1000RadioStack();
//	updateC172RadioStack();
//	updateTrimTypeB();
//	updateFuel();
//	updateTimerClockStyleB();
	
    }, 200);
}

// NOTE ?? here server test not coded yet ...

document.querySelectorAll(".modeBtn").forEach(btn => {
    btn.addEventListener("click", () => {

        // Set mode directly
        let testModeState = btn.dataset.mode;

	// If clicking the already active mode → switch to OFF
//        if (testModeState === "local"  && testMode === "on")    testModeState = "off";
//        if (testModeState === "server" && testMode === "pause") testModeState = "off";
//        if (testModeState === "live"   && testMode === "off")   testModeState = "off";

	if (testModeState === testModeInternal) {
	    testModeState = "off";
}

//	cLog("are they the same:",testModeState,testMode);

        // Update button visuals -- remove all active first
        document.querySelectorAll(".modeBtn").forEach(b => b.classList.remove("active"));

	if (testModeState === "off")
	    document.querySelector('.modeBtn[data-mode="off"]').classList.add("active");
	else btn.classList.add("active");
	

	// Update system
        setupTestButton(testModeState);
        startUpdateLoop(testModeState);
    });
});
