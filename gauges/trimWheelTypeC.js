
/* ------------------------------
   TrimWheel Type C
   ------------------------------ */



function updateTrimWheelTypeC() {
    // Clamp

    // testing
//    gsdTrimValue = -1;
	
    const v = Math.max(-1, Math.min(1, gsdTrimValue));

    // if the change the width and height this keeps the needle scaled properly
    const wrapper       = document.getElementById("trimWheelTypeC");
    const wrapperHeight = wrapper.offsetHeight;
    
    const scaleTop      = wrapperHeight * 0.11;     // 40px of 360px
    const scaleBottom   = wrapperHeight * 0.89;     // 320px of 360px
    
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
