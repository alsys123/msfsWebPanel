import subprocess
import time
import os

# Change this to your project folder
PROJECT_DIR = r"C:\Users\alsys\Work\grinMsfs2020Panel\msfsWebPanel"

os.chdir(PROJECT_DIR)

# Start the HTML server
html_server = subprocess.Popen(
    ["python", "-m", "http.server", "8080"],
    creationflags=subprocess.CREATE_NEW_CONSOLE
)

# Small delay so logs don't overlap
time.sleep(1)

# Start the MSFS backend server
backend_server = subprocess.Popen(
    ["python", "server-v5.py"],
    creationflags=subprocess.CREATE_NEW_CONSOLE
)

print("Both servers started.")
print("HTML:   http://10.0.0.218:8080/index.html")
print("Backend: http://10.0.0.218:5000/data")
print("Close this window to stop both servers.")

# Keep launcher alive so child processes stay open
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Stopping servers...")
    html_server.terminate()
    backend_server.terminate()
    
