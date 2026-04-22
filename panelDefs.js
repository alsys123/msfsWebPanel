/* ------------------------------
   Panel Defintions
   ------------------------------ */

function setupPanelBasic4() {
    const gaugePositions = {
	asi:         { x: 40,   y: 150, size: 200 },
	alt:         { x: 620,  y: 150, size: 200 },
	hdg:         { x: 40,   y: 450, size: 200 },
	timerCanvas: { x: 260,  y: 230, size: 350 }
    };
    
    for (const id in gaugePositions) {
	const pos = gaugePositions[id];
	setGauge(id, pos.x, pos.y, pos.size);
    }

    dei("panelTitle").textContent = "Basic 4 Panel";

}
function setupPanelSixPack() {
    const gaugePositions = {
	asi:            { x: 40,   y: 150, size: 200 },
	attitudeDivId:  { x: 340,  y: 150, size: 200 },
	alt:            { x: 620,  y: 150, size: 200 },
	turnRateDivId:   { x: 40,   y: 450, size: 200 },
	hdgTypeB:        { x: 340,  y: 450, size: 200 },
	vsiCanvasDivId: { x: 620,   y: 450, size: 200 }
    };
    
    for (const id in gaugePositions) {

	const pos = gaugePositions[id];

//	cLog("Position: ", id, pos.x, pos.y, pos.size);

	setGauge(id, pos.x, pos.y, pos.size);
    }

    dei("panelTitle").textContent = "Six Pack Panel";
}


// ******* UTILS *****
function setGauge(id, x, y, size = 300) {
    const el = dei(id);

    if (!el) {
        console.warn("Gauge element not found:", id);
        return;
    }

    el.style.position = "absolute";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.visibility = "visible";
    
    el.style.left = x + "px";
    el.style.top = y + "px";
}

function hideAllGauges() {
    // make sure to hide the entire container - ie the div
    const gauges =
	  ["asi", "alt", "hdg", "timerCanvas", "hdgTypeB",
	   "attitudeDivId",
	   "turnRateDivId", "vsiCanvasDivId"
	  ];

  gauges.forEach(id => {
    const el = dei(id);
    if (el) {
      el.style.visibility = "hidden";
      el.style.position = "absolute";  // keep layout consistent
      el.style.width = "300px";
      el.style.height = "300px";
    }
  });
}
