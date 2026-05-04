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
#debug_vars = [
#    "TURN INDICATOR RATE",
#    "TURN COORDINATOR BALL",
#    "ROTATION VELOCITY Y",
#    "ACCELERATION LATERAL",
#    "PLANE BANK DEGREES",
#    "PLANE PITCH DEGREES",
#    "PLANE HEADING DEGREES TRUE",
#    "AIRSPEED INDICATED",
#    "VERTICAL SPEED",
#    "YAW STRING ANGLE",
#    "RUDDER POSITION",
#    "AILERON POSITION",
#    "RUDDER PEDAL POSITION",
#    "G FORCE",
#    "PLANE_HEADING_DEGREES_TRUE",
#]

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

            #            print(aq.get("GENERAL ENG MAGNETO POSITION:1"))
            #            print(aq.get("MAGNETO SWITCH POS:1"))
            #            print(aq.get("RECIP ENG MAGNETO LEFT:1"))
            #            print(aq.get("RECIP ENG MAGNETO RIGHT:1"))
            #            print(aq.get("L:Eng1_Magneto"))
            #            print(aq.get("L:Eng1_Magneto_Key"))
            #print(dir(aq.EngineData))
            #print(aq.EngineData.dic)
            # this is all for dumping the variables
            
            #data = aq.EngineData.list() if callable(aq.EngineData.list) else aq.EngineData.list
            #data = aq.AvionicsData.list() if callable(aq.AvionicsData.list) else aq.AvionicsData.list
            #data = aq.LightsData.list() if callable(aq.LightsData.list) else aq.LightsData.list
            #for key, value in data.items():
            #    print(f"{key:<40} → {value}")
            # --- end of dump

            
        return {
            # =========================
            # PRIMARY FLIGHT INSTRUMENTS
            # =========================
            "airspeed": aq.get("AIRSPEED_INDICATED") or 0,
            "trueAirspeed": aq.get("AIRSPEED_TRUE") or 0,
            "altitude": aq.get("PLANE_ALTITUDE") or 0,
            "pressureAltitude": aq.get("PRESSURE_ALTITUDE") or 0,
            "verticalSpeed": aq.get("VERTICAL_SPEED") or 0,
            "pitch": aq.get("PLANE_PITCH_DEGREES") or 0,
            "roll": aq.get("PLANE_BANK_DEGREES") or 0,
            "headingTrue": aq.get("PLANE_HEADING_DEGREES_TRUE") or 0,
            "headingMag": aq.get("PLANE_HEADING_DEGREES_MAGNETIC") or 0,
            "turnRate": aq.get("TURN_INDICATOR_RATE") or 0,
            "slipSkid": aq.get("TURN_COORDINATOR_BALL") or 0,
            "yawString": aq.get("YAW_STRING_ANGLE") or 0,
            "gForce": aq.get("G_FORCE") or 0,
            
            # =========================
            # ENGINE SYSTEM
            # =========================
            "rpm": aq.get("GENERAL_ENG_RPM_1") or 0,
            "manifoldPressure": aq.get("ENG_MANIFOLD_PRESSURE_1") or 0,
            "oilTemp": aq.get("ENG_OIL_TEMPERATURE_1") or 0,
            "oilPressure": aq.get("ENG_OIL_PRESSURE_1") or 0,
            "egt": aq.get("ENG_EXHAUST_GAS_TEMPERATURE_1") or 0,
            "cht": aq.get("ENG_CYLINDER_HEAD_TEMPERATURE_1") or 0,
            "fuelFlow": aq.get("FUEL_FLOW_1") or 0,
            "fuelPressure": aq.get("ENG_FUEL_PRESSURE_1") or 0,
            "combustion": aq.get("GENERAL_ENG_COMBUSTION_1") or 0,
            "starter": aq.get("GENERAL_ENG_STARTER_1") or 0,
            "mixture": aq.get("MIXTURE_LEVER_POSITION_1") or 0,
            "throttle": aq.get("THROTTLE_LEVER_POSITION_1") or 0,
            "propLever": aq.get("PROP_LEVER_POSITION_1") or 0,
            
            # =========================
            # FUEL SYSTEM
            # =========================
            "fuelLeft": aq.get("FUEL_TANK_LEFT_LEVEL") or 0,
            "fuelRight": aq.get("FUEL_TANK_RIGHT_LEVEL") or 0,
            "fuelTotal": aq.get("FUEL_TOTAL_QUANTITY") or 0,
            "fuelSelector": aq.get("FUEL_SELECTOR_POSITION") or 0,
            #"fuelPump": aq.get("ELECTRICAL_FUEL_PUMP_ON") or 0,
            "fuelPump": aq.get("GENERAL_ENG_FUEL_PUMP_SWITCH:1") or 0,
            
            # =========================
            # FLAPS & CONTROL SURFACES
            # =========================
            "flapsIndex": aq.get("FLAPS_HANDLE_INDEX") or 0,
            "flapsPercent": aq.get("FLAPS_HANDLE_PERCENT") or 0,
            "elevatorTrim": aq.get("ELEVATOR_TRIM_POSITION") or 0,
            "rudder": aq.get("RUDDER_POSITION") or 0,
            "aileron": aq.get("AILERON_POSITION") or 0,
            "rudderPedal": aq.get("RUDDER_PEDAL_POSITION") or 0,
            
            # =========================
            # ELECTRICAL SYSTEM
            # =========================
            "masterBattery": aq.get("ELECTRICAL_MASTER_BATTERY") or 0,

            #"masterAlternator": aq.get("ELECTRICAL_MASTER_ALTERNATOR") or 0,
            "masterAlternator": aq.get("GENERAL_ENG_MASTER_ALTERNATOR:1") or 0,
            
            "mainBusVoltage": aq.get("ELECTRICAL_MAIN_BUS_VOLTAGE") or 0,
            "batteryLoad": aq.get("ELECTRICAL_BATTERY_LOAD") or 0,
            "standbyBattery": aq.get("ELECTRICAL_STANDBY_BATTERY") or 0,
            "avionicsMaster": aq.get("AVIONICS_MASTER_SWITCH") or 0,
            "generalMagneto": aq.get("GENERAL_ENG_MAGNETO_POSITION:1") or 0,
            "magnetoSwitch": aq.get("MAGNETO_SWITCH_POS:1") or 0,
            "magnetoLeft":  aq.get("RECIP_ENG_LEFT_MAGNETO:1") or 0,
            "magnetoRight": aq.get("RECIP_ENG_RIGHT_MAGNETO:1") or 0,

            # =========================
            # LIGHTS & SWITCHES
            # =========================
            "navLight": aq.get("LIGHT_NAV") or 0,
            "beaconLight": aq.get("LIGHT_BEACON") or 0,
            "landingLight": aq.get("LIGHT_LANDING") or 0,
            "taxiLight": aq.get("LIGHT_TAXI") or 0,
            "strobeLight": aq.get("LIGHT_STROBE") or 0,
            "panelLight": aq.get("LIGHT_PANEL") or 0,
            "pitotHeat": aq.get("PITOT_HEAT") or 0,
            
            # =========================
            # RADIOS
            # =========================
            "com1Active": aq.get("COM_ACTIVE_FREQUENCY_1") or 0,
            "com1Standby": aq.get("COM_STANDBY_FREQUENCY_1") or 0,
            "nav1Active": aq.get("NAV_ACTIVE_FREQUENCY_1") or 0,
            "nav1Standby": aq.get("NAV_STANDBY_FREQUENCY_1") or 0,
            "adfActive": aq.get("ADF_ACTIVE_FREQUENCY_1") or 0,
            "xpdrCode": aq.get("TRANSPONDER_CODE_1") or 0,
            "xpdrState": aq.get("TRANSPONDER_STATE_1") or 0,
            # available on/off state
            "com1Available": aq.get("COM_AVAILABLE:1") or 0,
            "com2Available": aq.get("COM_AVAILABLE:2") or 0,
            "comAvailable": aq.get("COM_RECIEVE_ALL") or 0,

            "nav1Available": aq.get("NAV_AVAILABLE_1") or 0,
            "nav2Available": aq.get("NAV_AVAILABLE_2") or 0,
            "gpsAvailable": aq.get("GPS_AVAILABLE") or 0,
            "adfAvailable": aq.get("ADF_AVAILABLE") or 0,
            "dme1Available": aq.get("DME_AVAILABLE_1") or 0,
            "dme2Available": aq.get("DME_AVAILABLE_2") or 0,
            "transponderAvailable": aq.get("TRANSPONDER_AVAILABLE") or 0,

            # =========================
            # AUTOPILOT
            # =========================
            "apMaster": aq.get("AUTOPILOT_MASTER") or 0,
            "apHeadingMode": aq.get("AUTOPILOT_HEADING_LOCK") or 0,
            "apHeadingBug": aq.get("AUTOPILOT_HEADING_LOCK_DIR") or 0,
            "apAltitudeHold": aq.get("AUTOPILOT_ALTITUDE_LOCK") or 0,
            "apAltitudeSet": aq.get("AUTOPILOT_ALTITUDE_LOCK_VAR") or 0,
            "apVerticalSpeed": aq.get("AUTOPILOT_VERTICAL_HOLD_VAR") or 0,
            "apNav": aq.get("AUTOPILOT_NAV1_LOCK") or 0,
            "apApproach": aq.get("AUTOPILOT_APPROACH_HOLD") or 0,
            
            # =========================
            # GPS
            # =========================
            "gpsLat": aq.get("GPS_POSITION_LAT") or 0,
            "gpsLon": aq.get("GPS_POSITION_LON") or 0,
            "gpsTrack": aq.get("GPS_GROUND_TRUE_TRACK") or 0,
            "gpsSpeed": aq.get("GPS_GROUND_SPEED") or 0,
            "gpsWpDistance": aq.get("GPS_WP_DISTANCE") or 0,
            "gpsWpBearing": aq.get("GPS_WP_BEARING") or 0,
            
            # =========================
            # ENVIRONMENT
            # =========================
            "oat": aq.get("AMBIENT_TEMPERATURE") or 0,
            "pressure": aq.get("AMBIENT_PRESSURE") or 0,
            "windDir": aq.get("AMBIENT_WIND_DIRECTION") or 0,
            "windSpeed": aq.get("AMBIENT_WIND_SPEED") or 0,
            "turbulence": aq.get("AMBIENT_TURBULENCE") or 0,
            
            # =========================
            # MISC SYSTEMS
            # =========================
            "brakeLeft": aq.get("BRAKE_LEFT_POSITION") or 0,
            "brakeRight": aq.get("BRAKE_RIGHT_POSITION") or 0,
            "parkingBrake": aq.get("PARKING_BRAKE_POSITION") or 0,
            "stallWarning": aq.get("STALL_WARNING") or 0,
            "overspeedWarning": aq.get("OVERSPEED_WARNING") or 0,
            "onGround": aq.get("SIM_ON_GROUND") or 0
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

    def log_message(self, format, *args):
        return
    
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
    print("Windows access: FOR EXAMPLE http://10.0.0.218:5050/data")

    server.serve_forever()

# -----------------------------
# Main entry point
# -----------------------------
if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(
        description="Server for msfs 2020 web-based server"
    )
    
    parser.add_argument(
        "-v", "--version",
        action="version",
        version="fsWebPanel 1.0.0"
    )
    
    args = parser.parse_args()

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
