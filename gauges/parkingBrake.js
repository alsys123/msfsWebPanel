
//PARKING_BRAKE_POSITION


function updateBrakeLight() {
    const overlay = document.getElementById("brakeLightOverlay");
    const text = document.getElementById("brakeLightText");

    if (gsdParkingBrake) {
        overlay.style.display = "block";   // red panel
        text.style.display = "block";      // show ON
        text.textContent = "ON";
    } else {
        overlay.style.display = "none";    // normal panel
        text.style.display = "block";      // show OFF
        text.textContent = "OFF";
    }
}
