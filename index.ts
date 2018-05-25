module.exports = function (app:any) {
 
  return {
    id: 'iothub',
    name: 'Azure IoT Hub',
    description: 'This plugin allows you to send all delta messages to Azure IoT Hub.',
    schema: {
      type: 'object',
      required: ['IoTHubDeviceConnectionString'],
      properties: {
        IoTHubDeviceConnectionString: {
          type: 'string',
          title: 'The Signal K Server device\'s device connection string',
          description: 'You need to register your Signal K device in your Azure IoT Hub before it can communicate. Use the Azure Portal (http://portal.azure.com) or the Azure CLI to retrieve this device\'s connection string.'
        }
      }
    },
    start: function (options:any) {
      let deviceAmqp = require('azure-iot-device-amqp');
      let device = require('azure-iot-device');
      const WebSocket = require('ws');
      let client = deviceAmqp.clientFromConnectionString("Your connection string goes here");
      client.open(err => {
          // send a delta message repeatedly recieved via websocket
          setInterval(function () { 
            const ws = new WebSocket('ws://localhost:3000/signalk/v1/stream?subscribe=all');
            ws.on('message', function incoming(data) {
            console.log(data);
            data = new device.Message();
             client.sendEvent(data);
            console.log("<--sending delta message");
          });
        }, 3000);
      });  
      console.log("IoT Hub Plugin started");
    },
    stop: function () {
      console.log('IoT Hub plugin stopped');
    }
  }
}
