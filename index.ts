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
      let client = deviceAmqp.clientFromConnectionString("HostName=azaf-hub.azure-devices.net;DeviceId=rpz-cockpit;SharedAccessKey=msMd0OGVzYQdIRmaB0eq2/RELVGfFqzfdi582N9rQoA=");
      client.open(err => {
          let deviceName = 'rpz-cockpit';
          console.log(`acting as ${deviceName}`);
          //handle C2D messages
          client.on('message', msg => {
              client.complete(msg, () => console.log('<-- cloud message received'));
          });
         
           var ws = new WebSocket("ws://localhost:3000/signalk/v1/stream?subscribe=all");
           ws.onmessage = function (data:any) {
          // send a D2C message repeatedly
          setInterval(function () {
              let message = new device.Message(JSON.stringify({
                  deviceId: data.deviceName,
                  value: data.value
              }));
              console.log('sending message to cloud -->');
              client.sendEvent(message, (err,res) => {
                  if(err) console.log(err);
              });
          }, 5000);
        };
      });
    console.log("IoT Hub Plugin started");
    },
    
    stop: function () {
      console.log('IoT Hub plugin stopped');

    }
  }
}
