module.exports = function (app) {
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

    start: function (options) {
      console.log('IoT Hub plugin started');
    },
    
    stop: function () {
      console.log('IoT Hub plugin stopped');

    }
  }

}