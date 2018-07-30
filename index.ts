let deviceAmqp = require('azure-iot-device-amqp');
let deviceHttp = require('azure-iot-device-http');
let deviceMqtt = require('azure-iot-device-mqtt');
let Message = require('azure-iot-device').Message;
let protocol;

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
                require: true,
                mask: true
              },
              deviceProtocol: {
                type: "string",
                title: "Device Protocol",
                require: true
              }
            }
          }
        }
      }
    },

    start: function (options: any) {
      console.log('Starting our plugin');
      let configuredDevices = [...options.devices];

      app.signalk.on("delta", delta => delta.updates.forEach(update => {
        p => {
          protocol = p.deviceProtocol.toLowerCase();
          if (protocol == 'amqp') protocol = deviceAmqp
          if (protocol == 'mqtt') protocol = deviceMqtt
          if (protocol == 'htpp') protocol = deviceHttp
          //if the update is for a device that's been configured 
          if (configuredDevices.some(d => d.deviceName == update.source.deviceName)) {
            let configuredDevice = configuredDevices.find(d => d.deviceName == update.source.deviceName);
            //if the client sdk doesn't already exist then create it
            if (!(update.source.deviceName in configuredDevices)) {
              configuredDevice.client = protocol.clientFromConnectionString(configuredDevices.find(d => d.deviceName == update.source.deviceName).deviceConnectionString);
              configuredDevice.client.open()
            }
            configuredDevice.client.sendEvent(new Message(update))
          }
        }
      }))
    },

    stop: function () {
      console.log('IoT Hub plugin stopped');
    }
  }
}
