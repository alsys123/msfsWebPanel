#!/usr/bin/env python3

import json
import time
import math
import argparse
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
from urllib.parse import urlparse, parse_qs


import http.server
import socketserver

def start_static_server():
    PORT = 8080
    Handler = http.server.SimpleHTTPRequestHandler

    # Bind to 0.0.0.0 so ALL devices on the LAN can reach it
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Static file server running on http://0.0.0.0:{PORT}")
        httpd.serve_forever()
        
# -----------------------------------
# Try importing SimConnect once
# -----------------------------------
try:
    from SimConnect import SimConnect, AircraftRequests
    simconnect_available = True
except ImportError:
    simconnect_available = False

sm = None
aq = None
#current_mode = "real"
current_mode = "fake"

# -----------------------------
# Shared data dictionary
# -----------------------------
sim_data = {
    "airspeed": 0.0,
    "altitude": 0.0,
    "heading": 0.0
}

lock = threading.Lock()

# -----------------------------
# Fake data generator
# -----------------------------
def fake_sim_data():
    t = time.time()
    return {
        "airspeed": 120 + 10 * math.sin(t),
        "altitude": 5000 + 200 * math.sin(t / 2),
#        "heading": (t * 10) % 360,
        "heading": math.sin(int(time.time()) / 800) * 50

    }

# REMEMBER we use _ between words!
debug_vars = [
    "TURN INDICATOR RATE",
    "TURN COORDINATOR BALL",
    "ROTATION VELOCITY Y",
    "ACCELERATION LATERAL",
    "PLANE BANK DEGREES",
    "PLANE PITCH DEGREES",
    "PLANE HEADING DEGREES TRUE",
    "AIRSPEED INDICATED",
    "VERTICAL SPEED",
    "YAW STRING ANGLE",
    "RUDDER POSITION",
    "AILERON POSITION",
    "RUDDER PEDAL POSITION",
    "G FORCE",
    "PLANE_HEADING_DEGREES_TRUE",
]

# -----------------------------
# Real SimConnect data provider (auto-reconnect)
# -----------------------------
def real_simconnect_data():
    global sm, aq

    if not simconnect_available:
        return {
            "airspeed": 0,
            "altitude": 0,
            "heading": 0,
            "pitch": 0,
            "roll": 0
        }

    try:
        if sm is None:
            sm = SimConnect()
            aq = AircraftRequests(sm, _time=0)

            # Register missing SimVars
  #          aq.find("ROTATION VELOCITY Y")
  #          aq.find("ACCELERATION LATERAL")
    
        # --- DEBUG DUMP ---
#        print("\n--- SIMCONNECT DEBUG DUMP ---")
#        for var in debug_vars:
#            try:
#                val = aq.get(var)
#                print(f"{var}: {val}")
#           except Exception as e:
#              print(f"{var}: ERROR ({e})")
#        print("--- END DEBUG ---\n")
        # -------------------
        
        return {
            "airspeed": aq.get("AIRSPEED_INDICATED") or 0,
            "altitude": aq.get("PLANE_ALTITUDE") or 0,
            "heading": aq.get("PLANE_HEADING_DEGREES_TRUE") or 0,
            "pitch": aq.get("PLANE_PITCH_DEGREES") or 0,
            "roll": aq.get("PLANE_BANK_DEGREES") or 0,
            "bug": aq.get("AUTOPILOT_HEADING_LOCK_DIR") or 0,
            
            "turn": aq.get("TURN_INDICATOR_RATE") or 0,
            "slip": aq.get("TURN_COORDINATOR_BALL") or 0,
            "verticalSpeed": aq.get("VERTICAL_SPEED") or 0,
            "eTrim":  aq.get("ELEVATOR_TRIM_POSITION") or 0,
            "flaps":  aq.get("FLAPS_HANDLE_INDEX") or 0

        }

    except Exception as e:
        print("SimConnect error:", e)
        sm = None
        return {
            "airspeed": 0,
            "altitude": 0,
            "heading": 0,
            "pitch": 0,
            "roll": 0
        }

# -----------------------------
# Data update loop
# -----------------------------
def start_data_loop():
    global current_mode

    while True:
        try:
            if current_mode == "fake":
                new_data = fake_sim_data()
                
            elif current_mode == "real":
                new_data = real_simconnect_data()

            else:
                # OFF mode → freeze values
                new_data = sim_data.copy()

            with lock:
                sim_data.update(new_data)

        except Exception as e:
            print("Sim data error:", e)

        time.sleep(0.1)


# -----------------------------
# Threaded HTTP server
# -----------------------------
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

# -----------------------------
# HTTP handler with CORS
# -----------------------------
class Handler(BaseHTTPRequestHandler):

    def _set_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/data":
            qs = parse_qs(parsed.query)
            global current_mode

#            if "test" in qs:
#                current_mode = "fake"
#                if qs["test"][0] == "1"
#                else "real"

            if "test" in qs:
                if qs["test"][0] == "1":
                    current_mode = "fake"
                elif qs["test"][0] == "2":
                    current_mode = "real"
                else:
                    current_mode = "off"
               
            with lock:
                payload = json.dumps(sim_data).encode()

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(payload)
            return

        self.send_response(404)
        self.end_headers()
    
# -----------------------------
# Start HTTP server
# -----------------------------
def start_http_server():
    
    server = ThreadedHTTPServer(("0.0.0.0", 5050), Handler)
    
    print("HTTP server running on port 5050")
    print("WSL access: http://127.0.0.1:5050/data")
    print("Windows access: e.g. http://10.0.0.218:5050/data")

    server.serve_forever()

# -----------------------------
# Main entry point
# -----------------------------
if __name__ == "__main__":
    # Start data loop
    t = threading.Thread(target=start_data_loop, daemon=True)
    t.start()

    # Start JSON API server
    api_thread = threading.Thread(target=start_http_server, daemon=True)
    api_thread.start()

    # Start static HTML server
    static_thread = threading.Thread(target=start_static_server, daemon=True)
    static_thread.start()

    # Keep main thread alive
    while True:
        time.sleep(1)
