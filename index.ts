module.exports = function (app: any) {

  return {
    id: 'iothub',
    name: 'Azure IoT Hub',
    description: 'This plugin allows you to send all delta messages to Azure IoT Hub.',
    schema: {
      type: 'object',
      properties: {
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
              deviceName: {
                type: "string",
                title: "Device Name"
              },
              deviceConnectionString: {
                type: "string",
                title: "Device Connection String",
                mask: true
              }
            }
          }
        }
      }
    },
    start: function (options: any) {
      console.log('Starting our plugin');
      let deviceAmqp = require('azure-iot-device-amqp');
      let device = require('azure-iot-device');
      let clients = {};
      app.signalk.on("delta", delta => delta.updates.forEach(updates => {
        if (!clients.hasOwnProperty(updates.source.deviceName)) {
          clients[updates.source.deviceName] = deviceAmqp.clientFromConnectionString(options.devices.filter(d => d.deviceName == updates.source.deviceName)[0].deviceConnectionString);
          clients[updates.source.deviceName].open()
        }
        setTimeout(() => {
          clients[updates.source.deviceName].sendEvent(new device.Message(updates))
        }, 2000)
      }))
    },
    stop: function () {
      console.log('IoT Hub plugin stopped');
    }
  }
}
