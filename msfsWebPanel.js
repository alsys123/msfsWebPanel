/* ------------------------------
   Mainline
   ------------------------------ */

// Test mode toggle
let testMode = "pause"; // "off", "on", "pause" .. if off, then we are LIVE
let updateTimer = null;

// for testing only!!!
let currentKts = 0;

let currentPanel = "basic4";


// Start immediately
startUpdateLoop("pause");  // start up in pause mode
setupPanelBasic4();

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

	if (currentPanel === "basic4") {
	    setupPanelBasic4();
	}
	if (currentPanel === "sixPack") {
	    setupPanelSixPack();
	}
	
    });

});


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

// set label and colours
function setupTestButton(testMode) {

    if (testMode === "pause" || testMode === "on") {
	dei("testToggle").textContent = `Test Mode: ${testMode.toUpperCase()}`;
    }
    if (testMode === "off") {
	dei("testToggle").textContent = "Live!";
    }

    // remove old classes
    dei("testToggle").classList.remove("off", "on", "pause");

  // add new class
	dei("testToggle").classList.add(testMode);
    
    console.log("Test mode:", testMode);
    
}

function startUpdateLoop(testMode) {
    setupTestButton(testMode);
    hideAllGauges();

    // Re-load the currently selected panel
    if (currentPanel === "basic4") setupPanelBasic4();
    if (currentPanel === "sixPack") setupPanelSixPack();
    
    //default
//    setupPanelBasic4();
//    const btn = dei("basic4ID");   // whatever your button's ID is
//    btn.classList.add("active");
//    btn.click();                    // triggers the full panel setup
    
//    document.querySelector('[data-panel="basic4"]').click();
    
    if (updateTimer) clearInterval(updateTimer);
    
    updateTimer = setInterval(() => {
	updateTurnRate();
	updateASI();      
	updateAltimeter();
	updateHeading();
	updateTimerClock();
	updateHeadingTypeB();
	updateAttitude();
	updateVsi();
    }, 200);
}
