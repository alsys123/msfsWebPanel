Cockpit panels for Microsoft Flight Simulator 2020.

This is a complete application for connecting to msfs 2020 (might work with 2024 - waiting for feedback).
You first run a server on you msfs machine.  Secondly, using a browser on any machine, in your home, including tablets, phone, windows or mac, bring the panels to life.  See live data from your simulator.  Test to see what the gauges look like.  Useful for home cockpits.

The gauges are organzied into panels.  There is the common 6-pack; C172 panel; basic G1000; Switches for magnetos, lights and brake indicators; Engine and Radio panels.

Last updated: May 6, 2026.  Currently under active development.

====
How to use it:
1. Download the repo
2. Start msfs as per usual
3. In the main directory of the repo, in windows run -- dist\msfsWinServer.exe
5.   This will show that we are connected to msfs
6. Use the msfs ip address, for example 10.0.0.218:8080  on any browser on your subnet(aka your house)
7. You should now see the flight panel
8. In app, press the setting - top right corner - enter the ip where msfs is running (in the example above it was 10.0.0.218) (port 5050 is correct). press Save.
9. Press "Live"  - this will connect you to the simulator.
10. Data from the simulator will start to show in the panels.
   
====

Here is a url, just to see what panels and guages looks like.  Local Test is all you can do using this external site.

https://sites.google.com/view/gringalleryreview/msfs-web-panel


====

Here is the mainline code for the app:

"https://alsys123.github.io/msfsWebPanel/index.html" 

For older devices, this is "compact" version:

https://alsys123.github.io/msfsWebPanel/compact/index.html

===

get ip on windows:

ipconfig --> IPv4 address ... something like 10.0.0.218


