module.exports = function (app: any) {

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
        },
        devices: {
          title: "Devices",
          type: "array",
          items: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                title: "Active",
                default: true
              },
              deviceId: {
                type: "string",
                title: "Device ID"
              },
              deviceConnectionString: {
                type: "string",
                title: "Device Connection String"
              }
            }
          }
        }
      }
    },
    start: function (options: any) {
      let deviceAmqp = require('azure-iot-device-amqp');
      let device = require('azure-iot-device');
      let clients = {};
      app.signalk.on("delta", delta => delta.updates.forEach(updates => {
        console.log(JSON.stringify(options.devices, null, 2))
        if (!clients.hasOwnProperty(updates.source.src)) {
          clients[updates.source.src] = deviceAmqp.clientFromConnectionString(options.devices.filter(d => d.deviceId == updates.source.src)[0].deviceConnectionString);
          clients[updates.source.src].open()
        }
        setTimeout(() => {
          clients[updates.source.src].sendEvent(new device.Message(updates))
        }, 2000)
      }))
    },
    stop: function () {
      console.log('IoT Hub plugin stopped');
    }
  }
}
