/* ------------------------------
   Panel Defintions
   ------------------------------ */


function setupPanelSixPack() {
    const gaugePositions = {
	panelTitle:         { x: 40,  y: 60, size: 600 },
//	asi:            { x: 40,   y: 150, size: 200 },
	asiTypeBDivId:      { x: 40,   y: 100, size: 280 },
	attitudeDivId:      { x: 320,  y: 100, size: 280 },
//	altGaugeTypeB: { x: 620,  y: 150, size: 200 },
	altGaugeTypeBDivId: { x: 600,  y: 100, size: 280 },

	//	alt:            { x: 620,  y: 150, size: 200 },
	turnRateDivId:      { x: 40,   y: 380, size: 280 },
	hdgTypeB:           { x: 320,  y: 380, size: 280 },
	vsiCanvasDivId:     { x: 600,  y: 380, size: 280 },


    };
    positionGaugesAndSetTitle(gaugePositions, "Six Pack Panel");
}

function setupPanelC172() {
    const gaugePositions = {
//	switchesCanvasId: { x: 40,   y: 120, size: 600 },
//	asi:            { x: 40,   y: 250, size: 200 },
	panelTitle: { x: 20,  y: 50, size: 600 },

	asiTypeBDivId:        { x: 200,  y: 100, size: 200 },
	attitudeDivId:        { x: 400,  y: 100, size: 200 },
	altGaugeTypeBDivId:   { x: 600,  y: 100, size: 200 },

	turnRateDivId:        { x: 200,  y: 300, size: 200 },
	hdgTypeB:             { x: 400,  y: 300, size: 200 },
	vsiCanvasDivId:       { x: 600,  y: 300, size: 200 },

//	fuelCanvas: { x: 50,  y: 130, size: 100 },
//	fuelCanvasDivId: { x: 50,  y: 400, size: 100 },
	
	flapsGaugeDivId: { x: 700,  y: 500, size: 150 },
//	trimCanvasTypeB: { x: 850,  y: 500, width: 75, height: 150 },
	trimWheelTypeCDivId: { x: 850,  y: 500, width: 75, height: 150 },

    };
        positionGaugesAndSetTitle(gaugePositions, "C172");

}



function setupPanelSwitches() {
    const gaugePositions = {
	panelTitle: { x: 40,  y: 70, size: 400 },
//	switchesCanvasId: { x: 40,   y: 120, size: 600 },
	switchesCanvasId: { x: 40,   y: 120, width: 860, height: 520 },

// 	timerCanvas:      { x: 600,  y: 230, size: 350 }
    };
    
    positionGaugesAndSetTitle(gaugePositions, "Switches - display only");

    
}

function setupPanelEngine() {
    const gaugePositions = {
	panelTitle: { x: 20,  y: 50, size: 600 },
//	switchesCanvasId: { x: 40,   y: 120, size: 600 },
// 	timerCanvas:      { x: 40,  y: 120, size: 250 },
	trimCanvasId:      { x: 40, y: 400, size: 300 },
//	fuelCanvas:       { x: 300,  y: 130, size: 100 },
	timerCanvasStyleB: { x: 500,  y: 330, width: 420, height: 340 }, //420, 340

	fuelCanvasDivId: { x: 50,  y: 100, size: 100 },  // not sizing!!! here??

    };
    positionGaugesAndSetTitle(gaugePositions, "Engine - Work in Progress!!!");

}

function setupPanelRadio() {
    const gaugePositions = {
//	switchesCanvasId: { x: 40,   y: 120, size: 600 },
// 	timerCanvas:      { x: 600,  y: 230, size: 350 },
//	radioStackCanvasDivId: { x: 40,  y: 300, size: 300 }
//	radioStackCanvasDivId: { x: 40,  y: 150, width: 500, height: 50 },
	panelTitle: { x: 20,  y: 50, size: 200 },
	c172Stack: { x: 80,  y: 150, width: 260, height: 500 },
	trimWheelTypeCDivId: { x: 650,  y: 200, width: 90, height: 300 },
	brakeLightDivId: { x: 500,  y: 300, width: 300, height: 200 }
    };

    positionGaugesAndSetTitle(gaugePositions, "Radio - Work in Progress");
    
}


function setupPanelG1000() {
    const gaugePositions = {
	panelTitle: { x: 20,  y: 50, size: 400 },
//	switchesCanvasId: { x: 40,   y: 120, size: 600 },
// 	timerCanvas:           { x: 750, y: 150, size: 200 },
	radioStackCanvasDivId: { x: 40,  y: 100, width: 800, height: 60 },
	g1000CanvasDivId:      { x: 40,  y: 150, width: 800, height: 500 },

    };

    positionGaugesAndSetTitle(gaugePositions, "G1000 - Work in Progress");
    
} //setupPanelG1000


function positionGaugesAndSetTitle(gaugePositions, Title) {

    for (const id in gaugePositions) {
	const pos = gaugePositions[id];
    
  if ("width" in pos && "height" in pos) {
        setGaugeWH(id, pos.x, pos.y, pos.width, pos.height);
    } else {
        setGauge(id, pos.x, pos.y, pos.size); // Use square-size version
    }

    dei("panelTitle").textContent = basicTitle + Title;

    } // for loop

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

// set gauge with width and height
function setGaugeWH(id, x, y, width = 300, height = 300) {
    const el = dei(id);

    if (!el) {
        console.warn("Gauge element not found:", id);
        return;
    }

    el.style.position = "absolute";
    el.style.width = width + "px";
    el.style.height = height + "px";
    el.style.visibility = "visible";
    
    el.style.left = x + "px";
    el.style.top = y + "px";
}

function hideAllGauges() {
    // make sure to hide the entire container - use the divId
    const gauges =
	  ["alt", "hdg", "timerCanvas", "hdgTypeB",
	   "attitudeDivId",
	   "turnRateDivId", "vsiCanvasDivId","switchesCanvasId",
	   "trimCanvasId","g1000CanvasDivId",
	   "radioStackCanvasDivId",
	   "c172Stack", "trimCanvasTypeB",
//	   "fuelCanvas",
	   "fuelCanvasDivId",
	   "timerCanvasStyleB",
	   "asiTypeBDivId","flapsGaugeDivId","trimWheelTypeCDivId",
	   "brakeLightDivId", "altGaugeTypeBDivId"
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
