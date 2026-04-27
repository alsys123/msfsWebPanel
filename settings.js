// === ELEMENTS ===
const settingsBtn = document.getElementById("settingsBtn");
const settingsWindow = document.getElementById("settingsWindow");
const settingsClose = document.getElementById("settingsClose");
const saveSettings = document.getElementById("saveSettings");
const helpBtn = document.getElementById("helpBtn");
const helpSection = document.getElementById("helpSection");

const ipInput = document.getElementById("ipInput");
const portInput = document.getElementById("portInput");

// === OPEN SETTINGS ===
settingsBtn.onclick = () => {
  settingsWindow.classList.remove("hidden");
};

// === CLOSE SETTINGS ===
settingsClose.onclick = () => {
  settingsWindow.classList.add("hidden");
};

// === HELP / ABOUT TOGGLE ===
helpBtn.onclick = () => {
    helpSection.classList.toggle("hidden");
    updateHelpText();
};

// === SAVE SETTINGS ===
saveSettings.onclick = () => {
  const ip = ipInput.value.trim();
  const port = portInput.value.trim();

  localStorage.setItem("msfs_ip", ip);
  localStorage.setItem("msfs_port", port);

    //  alert("Settings saved!");
    helpSection.innerHTML += `<p>Saved new settings: ${ip}:${port}</p>`;
    helpSection.innerHTML += `
  <p><small>Updated at ${new Date().toLocaleTimeString()}</small></p>
`;

};

// === RESTORE ON STARTUP ===
window.addEventListener("load", () => {
  const savedIP = localStorage.getItem("msfs_ip");
  const savedPort = localStorage.getItem("msfs_port");

  if (savedIP) ipInput.value = savedIP;
  if (savedPort) portInput.value = savedPort;
});

// === DRAGGING ===
const header = document.getElementById("settingsHeader");
let offsetX = 0, offsetY = 0, dragging = false;

header.addEventListener("mousedown", (e) => {
  dragging = true;
  offsetX = e.clientX - settingsWindow.offsetLeft;
  offsetY = e.clientY - settingsWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  settingsWindow.style.left = (e.clientX - offsetX) + "px";
  settingsWindow.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => dragging = false);

// === TOUCH DRAG (iPad, iPhone, Android) ===
header.addEventListener("touchstart", (e) => {
  drag = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - settingsWindow.offsetLeft;
  offsetY = touch.clientY - settingsWindow.offsetTop;
});

document.addEventListener("touchmove", (e) => {
  if (!drag) return;
  const touch = e.touches[0];
  settingsWindow.style.left = (touch.clientX - offsetX) + "px";
  settingsWindow.style.top = (touch.clientY - offsetY) + "px";
});

document.addEventListener("touchend", () => drag = false);


function updateHelpText() {
  const version = "0.0.6";
  const ip = localStorage.getItem("msfs_ip") || "Not set";
  const port = localStorage.getItem("msfs_port") || "Not set";

  helpSection.innerHTML = `
    <h3>About This Panel</h3>
    <p>MSFS Instrument Panel</p>
    <p>Current IP: ${ip}</p>
    <p>Current Port: ${port}</p>
    <p>Version: ${version}</p>
  `;
}
