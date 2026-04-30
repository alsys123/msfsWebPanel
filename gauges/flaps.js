/* ------------------------------
   Flaps guage
   ------------------------------ */


const flapAngles = [
    90,     // UP
    110,    // 1
    130,    // 2
    150,    // 3
    170     // FULL
];

let currentFlapAngle = 90;   // starts centered


function updateFlapsNeedle() {

   // gsdFlapsIndex = 4; // for testing
    
    const idx = gsdFlapsIndex;  // 0,1,2,3
    
    const target = flapAngles[idx];

    // smoothing factor (lower = slower)
    const smooth = 0.12;

    currentFlapAngle += (target - currentFlapAngle) * smooth;

    document.getElementById("flapsNeedleDivId").style.transform =
        `translate(-50%, -100%) rotate(${currentFlapAngle}deg)`;
}
