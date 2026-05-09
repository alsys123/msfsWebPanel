/* ------------------------------
   Mainline
   ------------------------------ */

// Test mode toggle
let testMode = "pause"; // "off", "on", "pause" .. if off, then we are LIVE
let updateTimer = null;

// for testing only!!!
let currentKts = 0;

//let currentPanel = "engine"; // testing
let currentPanel = "sixPack"; // starting default

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


// testing only
//setupPanelEngine();
//const btn = dei("engine");   // whatever your button's ID is

// Start immediately -- default
setupPanelSixPack();
//const btn = dei("sixPackId");   // whatever your button's ID is

//testMode = "pause";
startUpdateLoop("pause");  // start up in pause mode
//startUpdateLoop("off");  // start up in pause mode
//btn.classList.add("active");
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
	cLog("Selected panel/button:", currentPanel);

	hideAllGauges();

//	if (currentPanel === "basic4") 	  setupPanelBasic4();
	if (currentPanel === "sixPack")   setupPanelSixPack();
	if (currentPanel === "switches")  setupPanelSwitches();

	if (currentPanel === "engine")    setupPanelEngine();
	if (currentPanel === "radio")     setupPanelRadio();
	if (currentPanel === "c172")      setupPanelC172();
	if (currentPanel === "g1000")     setupPanelG1000();


    });

});

function setupTestButton(testModeState) {

    cLog("Test mode:", testModeState);

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
    if (currentPanel === "sixPack") setupPanelSixPack();

    // need when we first start the system
    if (testModeState === "pause") {
//	updateSimData();
	return;  // !!!! this is new!!
    }

    //    if (currentPanel === "switches") setupPanelSwitches();
//
//    if (currentPanel === "engine") setupPanelEngine();
//    if (currentPanel === "radio") setupPanelRadio();
//    if (currentPanel === "c172") setupPanelC172();
//    if (currentPanel === "g1000") setupPanelG1000();

    //default
//    setupPanelBasic4();
//    const btn = dei("basic4ID");   // whatever your button's ID is
//    btn.classList.add("active");
//    btn.click();                    // triggers the full panel setup
    
//    document.querySelector('[data-panel="basic4"]').click();
    
    if (updateTimer) clearInterval(updateTimer);


    updateTimer = setInterval(() => {

	updateSimData();  // THE MAIN DATA LOOP. !!! IMPORTANT !!!
	updatingAllGaugues();

//--	updateTurnRate();

//	updateASI();   

//--	updateAltimeterTypeB();

//	updateHeading();  take this out.

//	updateTimerClock();
//--	updateHeadingTypeB();
//	updateAttitude();
//	updateVsi();
//--	updateG1000();
//	updateG1000RadioStack();
//	updateC172RadioStack();
//--	updateTrimTypeB();
//	updateTimerClockStyleB();
//--	updateFlapsNeedle();
//--	updateTrimWheelTypeC();
//--	updateTrimApIndicator();

	//	updateBrakeLight();

//--	updateSwitches();
//--	updateFuelGauge();
//--	updateRPMGauge();
//--	updateManifoldGauge();
//--	updateOilPressureGauge();
//--	updateC172RadioStack();
//--	updateTimerDisplayTypeD()
	
    }, 200);
}

// NOTE ?? here server test not coded yet ...
function updatingAllGaugues() {
	updateASITypeB()
}

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
	if (testModeState === "off") {
	    stopUpdateLoop();     // ← stop everything
	    updateSimData(); // this will set values back to zero
	    updatingAllGaugues();
	    
	} else {
	    startUpdateLoop(testModeState);   // ← normal behavior
	}
	
	//       startUpdateLoop(testModeState);
    });
});

// ** Hide and show buttons

const buttonIds = [
//  "sixPackId"
//    "switches",
//    "engine",
//    "radio",
//    "c172",
//    "g1000",
    "panelModeBlock",
];

const hideBtn = document.getElementById("hideButtonId");


function applyButtonVisibility(hidden) {
  buttonIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (hidden) el.classList.add("hiddenButtons");
    else el.classList.remove("hiddenButtons");
  });

  hideBtn.textContent = hidden ? "Show" : "Hide";
}

function toggleButtons(e) {
  e.preventDefault();

  const hidden = localStorage.getItem("buttonsHidden") === "true";
  const newState = !hidden;

  localStorage.setItem("buttonsHidden", newState);
  applyButtonVisibility(newState);
}

hideBtn.addEventListener("click", toggleButtons);
hideBtn.addEventListener("touchstart", toggleButtons);

// Restore on startup
window.addEventListener("load", () => {
  
});


const defaultIP = "192.168.1.100";
const defaultPort = "5050";

window.addEventListener("load", () => {
    const savedIP = localStorage.getItem("msfs_ip") || defaultIP;
    const savedPort = localStorage.getItem("msfs_port") || defaultPort;
    
    ipInput.value = savedIP;
    portInput.value = savedPort;
    
    gServerIpPort = `http://${savedIP}:${savedPort}/data`;
    
    // button visibility
    const hidden = localStorage.getItem("buttonsHidden") === "true";
    applyButtonVisibility(hidden);

});

function stopUpdateLoop() {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
        console.log("Update loop stopped");
    }
}
