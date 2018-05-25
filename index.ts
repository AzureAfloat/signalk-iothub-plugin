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
          const ws = new WebSocket('ws://localhost:3000/signalk/v1/stream?subscribe=all');
          // send a delta message repeatedly recieved via websocket
         ws.on('message', function incoming(data) {
            console.log(data);
            data = new device.Message();
            client.sendEvent(data);
            console.log("<--sending delta message");
          });
      });  
      console.log("IoT Hub Plugin started");
    },
    stop: function () {
      console.log('IoT Hub plugin stopped');
    }
  }
}
