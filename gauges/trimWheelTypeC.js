
/* ------------------------------
   TrimWheel Type C
   ------------------------------ */

function updateTrimWheelTypeC() {
    // Clamp

    // testing
//    gsdTrimValue = -1;

    const v = (gsdTrimValue / 0.34 ) * -1;

    // if the change the width and height this keeps the needle scaled properly
    const wrapper       = document.getElementById("trimWheelTypeC");
    const wrapperHeight = wrapper.offsetHeight;
    
    const scaleTop      = wrapperHeight * 0.05;     // 40px of 360px .. was 0.11
    const scaleBottom   = wrapperHeight * 0.95;     // 320px of 360px .. was 0.89
        
    const trackHeight = scaleBottom - scaleTop;
    const centerY = (scaleTop + scaleBottom) / 2;

    // Compute needle Y
    const needleY = centerY + v * -(trackHeight / 2);
    
    // Apply to HTML needle
    const needle = document.getElementById("trimWheelNeedleTypeC");
    needle.style.top = `${needleY}px`;
}

function updateTrimApIndicator() {

    const ap = document.getElementById("trimApIndicatorTypeC");

    if (gsdApActive) {
        ap.style.display = "block";
    } else {
        ap.style.display = "none";
    }
}
