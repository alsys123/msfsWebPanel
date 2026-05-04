
/* ------------------------------
   TrimWheel Type C
   ------------------------------ */

//window.trimMin = Infinity;
//window.trimMax = -Infinity;

function updateTrimWheelTypeC() {
    // Clamp

    // testing
//    gsdTrimValue = -1;
    // Track min/max automatically
    /*
if (gsdTrimValue < window.trimMin) window.trimMin = gsdTrimValue;
if (gsdTrimValue > window.trimMax) window.trimMax = gsdTrimValue;

// Normalize
const norm = (gsdTrimValue - window.trimMin) / (window.trimMax - window.trimMin);

// Convert to -1 → +1
    const v = (norm * 2) - 1;
 */   
//    const v = Math.max(-1, Math.min(1, gsdTrimValue));
    //const v = (gsdTrimValue * 2) - 1;
    const v = (gsdTrimValue / 0.34 ) * -1;

    // if the change the width and height this keeps the needle scaled properly
    const wrapper       = document.getElementById("trimWheelTypeC");
    const wrapperHeight = wrapper.offsetHeight;
    
    const scaleTop      = wrapperHeight * 0.05;     // 40px of 360px .. was 0.11
    const scaleBottom   = wrapperHeight * 0.95;     // 320px of 360px .. was 0.89
    
//    // Your scale geometry (match your layout)
//    const scaleTop = 40;          // same as canvas trackY
//
//    //... might need to change this as canvas def is changed
//    const scaleBottom = 300 - 40; // canvas height - 40  
    
    const trackHeight = scaleBottom - scaleTop;
    const centerY = (scaleTop + scaleBottom) / 2;

    // Compute needle Y
    const needleY = centerY + v * -(trackHeight / 2);
    
    // Apply to HTML needle
    const needle = document.getElementById("trimWheelNeedleTypeC");
    needle.style.top = `${needleY}px`;
}

function updateTrimApIndicator() {

//    cLog("update AP Indicator");
    
    // test only
//    gsdApActive = true;
    
    const ap = document.getElementById("trimApIndicatorTypeC");

    if (gsdApActive) {
        ap.style.display = "block";
    } else {
        ap.style.display = "none";
    }
}
