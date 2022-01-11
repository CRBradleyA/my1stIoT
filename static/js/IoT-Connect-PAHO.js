    // Cambios JS
// ************ Declare and config MQTT
    var mqtt;
    var clientId = "client-" + String(Math.floor(Math.random() * 1000000));
    var reconnectTimeout = 2000;
    var host="broker.emqx.io";
    var port=8083;

    function onConnect(){
      console.log("Connected");
      mqtt.subscribe("esp8266/ledStatus_bradley");
      message = new Paho.MQTT.Message("Connected");
      message.destinationName = "esp8266/ledStatus_bradley";
      mqtt.send(message);
      onMessageSend("cliConnected"); // Send Msg for inicial status
    };

    function onFailure(message){
      console.log('Connection Attemp to Host: ' + host + ' Failed.');
      setTimeout(MQTTconnect, reconnectTimeout);
    };

    function onMessageArrived(msg){
      out_msg="Message received: " + msg.payloadString + " from: " + msg.destinationName + "<br>";
      console.log(out_msg);
      actionReceived("estado", msg.payloadString);
    };

    function actionReceived(id, Action){
      var idElement = id;
      var txtElement = Action;
      if (Action=="Connected"){
        idElement = "conectar"
        txtElement = Action + " to EMQX"
        document.getElementById(idElement).innerHTML = txtElement
      }
      else {
        if (Action=="off"){
          document.getElementById("Led1").setAttribute("stop-color", "#000000");
          document.getElementById("Luz1").setAttribute("stop-color", "#820101");
        }
        else if (Action=="on"){
          document.getElementById("Led1").setAttribute("stop-color", "#ff0000");
          document.getElementById("Luz1").setAttribute("stop-color", "#aa1010");
        }
        else {
          var Obj_Json = JSON.parse(Action);
          txtElement = "Led 1: " + Obj_Json["led1"];
          if (Obj_Json["led1"]=="off"){
            document.getElementById("Led1").setAttribute("stop-color", "#000000");
            document.getElementById("Luz1").setAttribute("stop-color", "#820101");
          }
          else if (Obj_Json["led1"]){
            document.getElementById("Led1").setAttribute("stop-color", "#ff0000");
            document.getElementById("Luz1").setAttribute("stop-color", "#aa1010");
          };

          g2.refresh(Obj_Json["temp1"]);
          g3.refresh(Obj_Json["hum1"]);
        };
        document.getElementById(idElement).innerHTML = txtElement;
      };
//      var elem = document.getElementById(idElement);
//	  console.log("Action Led1: " + Action["led1"]);
          console.log(idElement);
          console.log(Action);
  //    elem.innerHTML = txtElement;
    };

    function onMessageSend(msg){
      message = new Paho.MQTT.Message(msg);
      message.destinationName = "esp8266/ledAction_bradley";
      send_msg="Sending Message: " + msg;
      send_msg=send_msg + " to Topic: " + message.destinationName + "<br>";
      mqtt.send(message);
      console.log(send_msg);
    };

    function MQTTconnect(){
      // console.log("Connecting to: " + host + ":" + port);
      mqtt = new Paho.MQTT.Client(host, port, clientId);
      // document.write("Connecting to: " + host);
      var options = {
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailure,
      };
      mqtt.onMessageArrived = onMessageArrived;
      mqtt.connect(options);
    };

// ************ Declare and config Gauges
    var g2, g3; 

    window.onload = function(){
      g2 = new JustGage({
        id: "g2",
        <!-- value: getRandomInt(0, 100),--!>
        value: 0,
        min: 0,
        max: 60,
        title: "Temperature",
        label: "°C"
      });

      g3 = new JustGage({
        id: "g3",
        value: 0,
        min: 0,
        max: 100,
        title: "Humedad",
        label: "%H"
      });

	<!-- setInterval(function() { -->
	<!-- g2.refresh(getRandomInt(50, 100)); -->
	<!-- g3.refresh(getRandomInt(0, 50)); -->
	<!-- }, 2500); -->
    };

//    function changeColor(newColor, Action) {
//       var elem = document.getElementById('buttonOn');
//       elem.style.color = newColor;
//    };
