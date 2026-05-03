
Just started on this.  Not really ready because script files would
need to be edited first.

The basic4 and sixPack are mostly working including the connection to msfs.

Also, part of the G1000 might work as well.

The clock still need working.
====
How to use it:
1. Download the repo
2. Start msfs as per usual
3. In the main directory of the repo, in windows run the next command...
4.   dist\mafsWinServer.exe
5.   This will show your ip adress, and that we are connected to msfs
6. Use the ip address, for example 10.0.0.218:8080  on any browser on your subbet(aka your house)
7. You should now see the flight panel
8. Press "Live"  - this will connect you to the sim
9. Data from the simulator will start to show in the panels.
   
====

Here is a url embedded call using google sites.
Just to see what panels and guages looks like:

https://sites.google.com/view/gringalleryreview/msfs-web-panel


====
This does not work on a proxy setup. Too conplicated yet.

Here is the mainline code for the app:

"https://alsys123.github.io/msfsWebPanel/index.html" 


=====
This is all in windows where your msfs is running.

start by running:

python server-v6.py



Once started, any device running a modern browser can bring up the panels.  You can have as many devices as you like.  Works with tablets, window machines, macs, linux and so.  Will work on phones and eventually it might be optimized for the smaller size.


===
get ip on windows:

ipconfig --> IPv4 address ... something link 10.0.0.218

===
To launch a local server:

python -m http.server 8080

=====

