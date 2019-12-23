var Socket;
var ip = "192.168.0.14"; //prompt("Digite o IP.");
var port = "81"; //prompt("Digite a PORTA.");
var receiveBox = document.querySelector("#textReceive");
var splitString = "$ ";

init(ip);

function init(ip) {
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
        case 0: newState = "Connecting...";        style.color = "#f1fa8c"; break;
        case 1: newState = "Connection Open.";     style.color = "#50fa7b"; break;
        case 2: newState = "Closing Connection.."; style.color = "#ffb86c"; break;
        case 3: newState = "Connection Closed.";   style.color = "#fa8686"; break;
    }
    document.querySelector("#connectionState").innerText = `${newState}`;
}

