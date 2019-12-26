var Socket;

var ip = "192.168.0.14";
var port = "81"; 

var receiveBox = document.querySelector("#textReceive");
var connectButton = document.querySelector("#ConnectButton");

var splitString = "$ ";

function init() {
    Socket = new WebSocket(`ws://${ip}:${port}/`);
    Socket.onmessage = (e) => {
        var message = e.data;
        if (message.length > 1) {
            message = message.slice(0, message.indexOf("\0"));
            receiveBox.value += `$ ${message}\n`
        } else {
            if (message == "\n") {
                receiveBox.value += `${splitString}\n`
                splitString = "$ ";
            }
            else splitString += message;
        }
        receiveBox.scrollTop = receiveBox.scrollHeight;
    }
    Socket.onclose = (e) => {
        console.log(e);
        connectionState(Socket.readyState);
    }
    Socket.onopen = (e) => {
        console.log(e);
        connectionState(Socket.readyState);
    }
    Socket.onerror = (e) => {
        console.log(e);
    }

    document.querySelector("#connectionIP").innerText = `Connected to: ${ip}:${port}`;
    connectionState(Socket.readyState);
}
function sendText() {
    var text = document.querySelector("#textSend");
    Socket.send(text.value);
    text.value = "";
}
function connectionState(state) {
    var newState;
    var style = document.querySelector("#connectionState").style;
    switch (state) {
        case 0: newState = "Connecting...";
                style.color = "#f1fa8c";
                connectButton.disabled = true;
        break;
        case 1: newState = "Connection Open.";
                style.color = "#50fa7b";
                connectButton.innerText = "Disconnect";
                connectButton.disabled = false;
        break;
        case 2: newState = "Closing Connection...";
                style.color = "#ffb86c";
                connectButton.disabled = true;
        break;
        case 3: newState = "Connection Closed.";
                style.color = "#fa8686";
                connectButton.innerText = "Reconnect";
                connectButton.disabled = false;
        break;
    }
    document.querySelector("#connectionState").innerText = `${newState}`;
}
function connectionSelector() {
    
    switch (connectButton.innerText) {
        case "Connect":
        case "Reconnect":
            init();
        break;
        
        case "Disconnect": Socket.close();
        break;
    }

}
function changeIpPort(which) {

    if (which) ip = prompt('Type the new IP.');
    else port = prompt('Type the new Port.');

}

