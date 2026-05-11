/* ------------------------------
   Mainline
   ------------------------------ */


// Test mode toggle
var testMode = "pause"; // "off", "on", "pause"
var updateTimer = null;

// for testing only!!!
var currentKts = 0;

var currentPanel = "sixPack"; // starting default

var basicTitle = "MSFS Panels for Flight Sim - ";

var gServerIpPort = "http://10.0.0.218:5050/data";  // on windows ..eg.
var gServerIP = ""; // used in gauges call

var gTestOffCall  = "?test=0";
var gTestOnCall   = "?test=1";
var gTestMSFSCall = "?test=2";

var testModeInternal = "off";  // used only for toggling logic

// Start immediately -- default
setupPanelSixPack();
startUpdateLoop("pause");  // start up in pause mode

/* ------------------------------
   TOP BAR SELECT
   ------------------------------ */

// Panel selection
var panelBtns = document.querySelectorAll(".panel-btn");

panelBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
	
        document.querySelectorAll(".panel-btn").forEach(function(b) {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        currentPanel = btn.dataset.panel;
        cLog("Selected panel/button:", currentPanel);

        hideAllGauges();

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

    testModeInternal = testModeState;
    testMode = "pause"; // default

    if (testModeState === "off") {
        testMode = "pause";
    }
    else if (testModeState === "local") {
        testMode = "on";
    }
    else if (testModeState === "server") {
        testMode = "off";
        gServerIP = gServerIpPort + gTestOnCall;
    }
    else if (testModeState === "live") {
        testMode = "off";
        gServerIP = gServerIpPort + gTestMSFSCall;
    }
}

function startUpdateLoop(testModeState) {
    setupTestButton(testModeState);
    hideAllGauges();

    if (currentPanel === "sixPack") setupPanelSixPack();

    if (testModeState === "pause") {
        return;
    }

//    updateSimData();  // A single test call
//    return;           // then exit

    if (updateTimer) clearInterval(updateTimer);

    updateTimer = setInterval(function() {

        updateSimData();  // THE MAIN DATA LOOP

        updatingAllGaugues();

    }, 200);
}

// NOTE ?? here server test not coded yet ...
function updatingAllGaugues() {
    updateASITypeB();
}

var modeBtns = document.querySelectorAll(".modeBtn");

modeBtns.forEach(function(btn) {
    
    btn.addEventListener("click", function() {

        var testModeState = btn.dataset.mode;

        if (testModeState === testModeInternal) {
            testModeState = "off";
        }

        document.querySelectorAll(".modeBtn").forEach(function(b) {
            b.classList.remove("active");
        });

        if (testModeState === "off")
            document.querySelector('.modeBtn[data-mode="off"]').classList.add("active");
        else
            btn.classList.add("active");

        setupTestButton(testModeState);

        if (testModeState === "off") {
            stopUpdateLoop();
            updateSimData();
            updatingAllGaugues();
        } else {
            startUpdateLoop(testModeState);
        }
    });
});

// ** Hide and show buttons

var buttonIds = [
    "panelModeBlock",
];

var hideBtn = document.getElementById("hideButtonId");

function applyButtonVisibility(hidden) {
    buttonIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;

        if (hidden) el.classList.add("hiddenButtons");
        else el.classList.remove("hiddenButtons");
    });

    hideBtn.textContent = hidden ? "Show" : "Hide";
}

function toggleButtons(e) {
    e.preventDefault();

    var hidden = localStorage.getItem("buttonsHidden") === "true";
    var newState = !hidden;

    localStorage.setItem("buttonsHidden", newState);
    applyButtonVisibility(newState);


}

hideBtn.addEventListener("click", toggleButtons);
hideBtn.addEventListener("touchstart", toggleButtons);

// Restore on startup
window.addEventListener("load", function() {
});

var defaultIP = "192.168.1.100";
var defaultPort = "5050";

window.addEventListener("load", function() {
    var savedIP = localStorage.getItem("msfs_ip") || defaultIP;
    var savedPort = localStorage.getItem("msfs_port") || defaultPort;

    ipInput.value = savedIP;
    portInput.value = savedPort;

    gServerIpPort = "http://" + savedIP + ":" + savedPort + "/data";

    var hidden = localStorage.getItem("buttonsHidden") === "true";
    applyButtonVisibility(hidden);
});

function stopUpdateLoop() {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
        console.log("Update loop stopped");
    }
}
