/* ------------------------------
   Utils
   ------------------------------ */

function dei(Element) {
    const Id = document.getElementById(Element);
    return Id;
} //dei


function cLog(...text) {
    console.log(...text);
}

// convert from radial to degrees
function radToDeg(r) {
  return (r * 180 / Math.PI) % 360;
}
