/*
  Time Style D
  */

function updateTimerDisplayTypeD() {
      const now = new Date();

    document.getElementById("localTime").textContent  =
	now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    document.getElementById("zuluTime").textContent   =
	now.getUTCHours().toString().padStart(2, "0") + ":" +
        now.getUTCMinutes().toString().padStart(2, "0");

//    document.getElementById("flightTime").textContent = gsdFlightTime;

    // leg timers
    for (let leg = 1; leg <= 3; leg++) {
        const t = legTimers[leg];
        let ms = t.running ? performance.now() - t.start : t.elapsed;

        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        document.getElementById(`leg${leg}Display`).textContent =
            `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

	if (t.running) setLegRunning(leg);
	else if (t.elapsed > 0) setLegPaused(leg);
	else setLegDefault(leg);
	
    }
    
}


// Store timers
let legTimers = {
    1: { running: false, start: 0, elapsed: 0 },
    2: { running: false, start: 0, elapsed: 0 },
    3: { running: false, start: 0, elapsed: 0 }
};

function toggleLegTimer(leg) {

    const t = legTimers[leg];

    if (!t.running) {
        // Start timer
        t.running = true;
        t.start = performance.now() - t.elapsed;
	setLegRunning(leg);
    } else {
        // Stop timer
        t.running = false;
        t.elapsed = performance.now() - t.start;
        setLegPaused(leg);
    }
}


let lastTapTime = { 1:0, 2:0, 3:0 };

function handleLegTap(leg) {
    const now = Date.now();
    const delta = now - lastTapTime[leg];

    if (delta < 300) {
        // DOUBLE TAP → reset timer
        resetLegTimer(leg);
    } else {
        // SINGLE TAP → start/stop
        toggleLegTimer(leg);
    }

    lastTapTime[leg] = now;
}

function resetLegTimer(leg) {
    const t = legTimers[leg];
    t.running = false;
    t.start = 0;
    t.elapsed = 0;
    setLegDefault(leg);
}

//document.getElementById("leg1Btn").onclick = () => toggleLegTimer(1);
//document.getElementById("leg2Btn").onclick = () => toggleLegTimer(2);
//document.getElementById("leg3Btn").onclick = () => toggleLegTimer(3);

document.getElementById("leg1Btn").onclick = () => handleLegTap(1);
document.getElementById("leg2Btn").onclick = () => handleLegTap(2);
document.getElementById("leg3Btn").onclick = () => handleLegTap(3);


function setLegRunning(leg) {
    const el = document.getElementById(`leg${leg}Display`);
//    el.style.opacity = "1.0";
//    el.style.filter = "brightness(1.4)";
//    el.style.filter = "brightness(1.9) drop-shadow(0 0 6px rgba(255,255,255,0.6))";

    // Choose glow color per leg
    let glow = "rgba(255,255,255,0.9)";
    if (leg === 1) glow = "rgba(255,0,170,0.9)";   // pink
    if (leg === 2) glow = "rgba(0,255,0,0.9)";     // green
    if (leg === 3) glow = "rgba(255,170,0,0.9)";   // amber

    el.style.opacity = "1.0";
    el.style.filter =
        `brightness(1.8) drop-shadow(0 0 10px ${glow}) drop-shadow(0 0 20px ${glow})`;

}

function setLegPaused(leg) {
    const el = document.getElementById(`leg${leg}Display`);
    el.style.opacity = "0.7";
    el.style.filter = "none";
}

function setLegDefault(leg) {
    const el = document.getElementById(`leg${leg}Display`);
    el.style.opacity = "1.0";
    el.style.filter = "none";
}
