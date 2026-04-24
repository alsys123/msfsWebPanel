#!/usr/bin/env python3

import json
import time
import math
import argparse
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn

sm = None
aq = None

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
        "heading": (t * 10) % 360
    }

# -----------------------------
# Real SimConnect data provider (auto-reconnect)
# -----------------------------
def real_simconnect_data():
    global sm, aq

    try:
        # If not connected yet, connect
        if sm is None:
            from SimConnect import SimConnect, AircraftRequests
            sm = SimConnect()
            aq = AircraftRequests(sm, _time=0)

        return {
            "airspeed": aq.get("AIRSPEED_INDICATED") or 0,
            "altitude": aq.get("PLANE_ALTITUDE") or 0,
            "heading":  aq.get("PLANE_HEADING_DEGREES_TRUE") or 0,
            "pitch":    aq.get("PLANE_PITCH_DEGREES") or 0,
            "roll":     aq.get("PLANE_BANK_DEGREES") or 0
        }

    except Exception as e:
        print("SimConnect error:", e)
        sm = None   # force reconnect next loop
        return {
            "airspeed": 0,
            "altitude": 0,
            "heading": 0,
            "pitch": 0,
            "roll":  0
        }

# -----------------------------
# Data update loop
# -----------------------------
def start_data_loop(use_fake=False):
    print(f"Starting data loop (fake={use_fake})")
    get_data = fake_sim_data if use_fake else real_simconnect_data

    while True:
        try:
            new_data = get_data()
            with lock:
                sim_data.update(new_data)
        except Exception as e:
            print("Sim data error:", e)

        time.sleep(0.1)  # 10 updates/sec

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
        if self.path == "/data":
            with lock:
                payload = json.dumps(sim_data).encode()

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(payload)
        else:
            self.send_response(404)
            self.end_headers()

# -----------------------------
# Start HTTP server
# -----------------------------
def start_http_server():
    server = ThreadedHTTPServer(("0.0.0.0", 5000), Handler)
    print("HTTP server running on port 5000")
    print("WSL access: http://127.0.0.1:5000/data")
    print("Windows access: e.g. http://10.0.0.218:5000/data")
    server.serve_forever()

# -----------------------------
# Main entry point
# -----------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true",
                        help="Run in fake data mode (no MSFS required)")
    args = parser.parse_args()

    # Start data loop in background thread
    t = threading.Thread(target=start_data_loop, args=(args.test,), daemon=True)
    t.start()

    # Start HTTP server
    start_http_server()

    
