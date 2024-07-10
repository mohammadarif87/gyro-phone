# gyro-phone
A web app to control a object using your phone's device gyro/orientation. Connects via websocket and utilises gyro.js library from https://github.com/tomgco/gyro.js

# How to run
Ensure you have node installed and http-server (can be installed by running `npm install -g http-server`

Update the websocket address to point to your ip address in `app.js`. Also update the websocket address in phone.html. You might also want to update the console.log in `server.js` to match your ip address

In one Terminal window, run `node server.js` to start the websocket server
In a new Terminal, run `http-server <folder-name>` to start a local web server

In a browser on your computer, navigate to the ip address outputted from http-server to load up index.html. You should see a red circle on screen

On your phone (connected to the same network as your computer), in a browser like FireFox navigate to the same ip address /phone.html i.e. http://192.168.0.9:8081/phone.html

Untested with Safari on phone. Chrome does not seem to work - FireFox seems best

Both index.html and phone.html should now be connected to the same websocket server. Move your phone and observe the circle moving around in your browser
