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
    }

}


// Store timers
let legTimers = {
    1: { running: false, start: 0, elapsed: 0 },
    2: { running: false, start: 0, elapsed: 0 },
    3: { running: false, start: 0, elapsed: 0 }
};

function toggleLegTimer(leg) {

    cLog("a click", leg);
    
    const t = legTimers[leg];

    if (!t.running) {
        // Start timer
        t.running = true;
        t.start = performance.now() - t.elapsed;
    } else {
        // Stop timer
        t.running = false;
        t.elapsed = performance.now() - t.start;
    }
}



document.getElementById("leg1Btn").onclick = () => toggleLegTimer(1);
document.getElementById("leg2Btn").onclick = () => toggleLegTimer(2);
document.getElementById("leg3Btn").onclick = () => toggleLegTimer(3);

