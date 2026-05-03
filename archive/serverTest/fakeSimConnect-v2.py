# ============================================================
# SimConnect Stub for macOS / Development Without MSFS
# Full C172 Fake Data Model — Using Real Underscore SimVar Names
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

    def _t(self):
        return time.time() - self.start

    def get(self, var):
        t = self._t()

        # ============================================================
        # PRIMARY FLIGHT DATA
        # ============================================================

        if var == "AIRSPEED_INDICATED":
            return 110 + 8 * math.sin(t * 0.7)

        if var == "PLANE_ALTITUDE":
            return 4500 + 150 * math.sin(t * 0.25)

        if var == "PLANE_HEADING_DEGREES_TRUE":
            return (t * 12) % 360

        if var == "AUTOPILOT_HEADING_LOCK_DIR":
            return (t * 5) % 360

        if var == "VERTICAL_SPEED":
            return 300 * math.sin(t * 0.3)

        if var == "PLANE_PITCH_DEGREES":
            return 2.0 * math.sin(t * 0.4)

        if var == "PLANE_BANK_DEGREES":
            return 15 * math.sin(t * 0.6)

        if var == "TURN_INDICATOR_RATE":
            return 2.5 * math.sin(t * 0.8)

        if var == "TURN_COORDINATOR_BALL":
            return 0.2 * math.sin(t * 1.2)

        if var == "YAW_STRING_ANGLE":
            return 2.0 * math.sin(t * 1.1)

        # ============================================================
        # ENGINE DATA (C172)
        # ============================================================

        if var == "GENERAL_ENG_RPM_1":
            return 2300 + 50 * math.sin(t * 0.5)

        if var == "ENG_MANIFOLD_PRESSURE_1":
            return 22 + 1.0 * math.sin(t * 0.3)

        if var == "ENG_OIL_TEMPERATURE_1":
            return 180 + 5 * math.sin(t * 0.2)

        if var == "ENG_OIL_PRESSURE_1":
            return 60 + 3 * math.sin(t * 0.4)

        if var == "ENG_EXHAUST_GAS_TEMPERATURE_1":
            return 1350 + 20 * math.sin(t * 0.5)

        if var == "ENG_CYLINDER_HEAD_TEMPERATURE_1":
            return 350 + 10 * math.sin(t * 0.3)

        if var == "FUEL_FLOW_1":
            return 8.5 + 0.3 * math.sin(t * 0.4)

        if var == "MIXTURE_LEVER_POSITION_1":
            return 0.85 + 0.02 * math.sin(t * 0.2)

        if var == "THROTTLE_LEVER_POSITION_1":
            return 0.75 + 0.05 * math.sin(t * 0.1)

        # ============================================================
        # FUEL SYSTEM
        # ============================================================

        if var == "FUEL_TANK_LEFT_LEVEL":
            return 0.65 + 0.01 * math.sin(t * 0.1)

        if var == "FUEL_TANK_RIGHT_LEVEL":
            return 0.62 + 0.01 * math.sin(t * 0.1 + 1)

        if var == "FUEL_TOTAL_QUANTITY":
            return 38.0 - (t * 0.01)

        # ============================================================
        # FLAPS
        # ============================================================

        if var == "FLAPS_HANDLE_INDEX":
            return int((t // 5) % 4)

        if var == "FLAPS_HANDLE_PERCENT":
            return ((t % 20) / 20) * 100

        # ============================================================
        # ELECTRICAL SYSTEM
        # ============================================================

        if var == "ELECTRICAL_MASTER_BATTERY":
            return 1

        if var == "ELECTRICAL_MASTER_ALTERNATOR":
            return 1

        if var == "ELECTRICAL_MAIN_BUS_VOLTAGE":
            return 27.8 + 0.1 * math.sin(t * 0.2)

        if var == "ELECTRICAL_BATTERY_LOAD":
            return 5 + 0.5 * math.sin(t * 0.3)

        # ============================================================
        # LIGHTS / SWITCHES
        # ============================================================

        if var == "LIGHT_NAV":
            return 1

        if var == "LIGHT_BEACON":
            return 1

        if var == "LIGHT_LANDING":
            return int((t % 10) > 5)

        if var == "LIGHT_TAXI":
            return 0

        if var == "LIGHT_STROBE":
            return 1

        if var == "PITOT_HEAT":
            return int((t % 20) > 10)

        # ============================================================
        # RADIOS
        # ============================================================

        if var == "COM_ACTIVE_FREQUENCY_1":
            return 118.30

        if var == "COM_STANDBY_FREQUENCY_1":
            return 121.80

        if var == "NAV_ACTIVE_FREQUENCY_1":
            return 110.50

        if var == "NAV_STANDBY_FREQUENCY_1":
            return 113.20

        if var == "ADF_ACTIVE_FREQUENCY_1":
            return 350.0

        # ============================================================
        # TRANSPONDER
        # ============================================================

        if var == "TRANSPONDER_CODE_1":
            return 1200

        if var == "TRANSPONDER_STATE_1":
            return 3  # ALT mode

        # ============================================================
        # DEFAULT FALLBACK
        # ============================================================

        return 0
