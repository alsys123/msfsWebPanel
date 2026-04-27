# ============================================================
# SimConnect Stub for macOS / Development Without MSFS
# Provides realistic C172-style fake data for all SimVars
# ============================================================

import time
import math
import random

class SimConnect:
    def __init__(self):
        pass

class AircraftRequests:
    def __init__(self, sm, _time=0):
        self.start = time.time()

    # --------------------------------------------------------
    # Fake C172 flight model
    # --------------------------------------------------------
    def _t(self):
        return time.time() - self.start

    def get(self, var):

        t = self._t()

        # -----------------------------
        # Basic flight parameters
        # -----------------------------
        if var in ["AIRSPEED_INDICATED", "AIRSPEED INDICATED"]:
            return 110 + 8 * math.sin(t * 0.7)

        if var in ["PLANE_ALTITUDE", "PLANE ALTITUDE"]:
            return 4500 + 150 * math.sin(t * 0.25)

        if var in ["PLANE_HEADING_DEGREES_TRUE", "PLANE HEADING DEGREES TRUE"]:
            return (t * 12) % 360

        if var in ["AUTOPILOT_HEADING_LOCK_DIR"]:
            return (t * 5) % 360

        # -----------------------------
        # Attitude (pitch/roll)
        # -----------------------------
        if var in ["PLANE_PITCH_DEGREES", "PLANE PITCH DEGREES"]:
            return 2.0 * math.sin(t * 0.4)

        if var in ["PLANE_BANK_DEGREES", "PLANE BANK DEGREES"]:
            return 15 * math.sin(t * 0.6)

        # -----------------------------
        # Turn/slip
        # -----------------------------
        if var in ["TURN_INDICATOR_RATE", "TURN INDICATOR RATE"]:
            return 2.5 * math.sin(t * 0.8)

        if var in ["TURN_COORDINATOR_BALL", "TURN COORDINATOR BALL"]:
            return 0.2 * math.sin(t * 1.2)

        # -----------------------------
        # Vertical speed
        # -----------------------------
        if var in ["VERTICAL_SPEED", "VERTICAL SPEED"]:
            return 300 * math.sin(t * 0.3)

        # -----------------------------
        # Trim
        # -----------------------------
        if var in ["ELEVATOR_TRIM_POSITION", "ELEVATOR TRIM POSITION"]:
            return 0.1 * math.sin(t * 0.5)

        # -----------------------------
        # Rudder / Aileron positions
        # -----------------------------
        if var in ["RUDDER POSITION"]:
            return 0.05 * math.sin(t * 0.9)

        if var in ["AILERON POSITION"]:
            return 0.05 * math.sin(t * 0.7)

        if var in ["RUDDER PEDAL POSITION"]:
            return 0.1 * math.sin(t * 0.6)

        # -----------------------------
        # G Force
        # -----------------------------
        if var in ["G FORCE"]:
            return 1.0 + 0.05 * math.sin(t * 1.5)

        # -----------------------------
        # Yaw string (slip indicator)
        # -----------------------------
        if var in ["YAW STRING ANGLE"]:
            return 2.0 * math.sin(t * 1.1)

        # -----------------------------
        # Default fallback
        # -----------------------------
        return 0
