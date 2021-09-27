
    var mqtt;
    var reconnectTimeout = 2000;
    var host="broker.emqx.io";
    var port=8083;

    function onConnect(){
      console.log("Connected");
      mqtt.subscribe("esp8266/ledAction_bradley");
      message = new Paho.MQTT.Message("Hello World desde WEB PAHO");
      message.destinationName = "esp8266/ledAction_bradley";
      mqtt.send(message);
    }

    function onFailure(message){
      console.log('Connection Attemp to Host: ' + host + ' Failed.');
      setTimeout(MQTTconnect, reconnectTimeout);
    }

    function onMessageArrived(msg){
      // out_msg="Message received: " + msg.payloadString + "<br>";
      // out_msg=out_msg + "Message received Topic: " + msg.destinationName + "<br>";
      // console.log(out_msg);
      actionReceived("estado", msg.payloadString)
    }

    function onMessageSend(msg){
      message = new Paho.MQTT.Message(msg);
      message.destinationName = "esp8266/ledAction_bradley";
      // send_msg="Sending Message: " + msg;
      // send_msg=send_msg + " to Topic: " + msg.destinationName + "<br>";
      mqtt.send(message);
      // console.log(send_msg);
    }

    function MQTTconnect(){
      // console.log("Connecting to: " + host + ":" + port);
      mqtt = new Paho.MQTT.Client(host, port, "clientjs");
      // document.write("Connecting to: " + host);
      var options = {
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailure,
      };
      mqtt.onMessageArrived = onMessageArrived;
      mqtt.connect(options);
    }

//    function changeColor(newColor, Action) {
//       var elem = document.getElementById('buttonOn');
//       elem.style.color = newColor;
//    }
    function actionReceived(id, Action){
       var elem = document.getElementById(id);
       elem.innerHTML = "Led 1 is " + Action;
    }
