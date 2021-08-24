/* eslint-disable no-undef */
const elasticsearchHost = __MQTT_HOST__;
const mqttHost = __CONFIGURATION_HOST__;

export const ElasticSearchConfiguration = {
  host: elasticsearchHost,
  createUrl: function (url) {
    return elasticsearchHost + "/" + url;
  },
};

export const MQTTConfiguration = {
  host: mqttHost,
  createUrl: function (url) {
    return mqttHost + "/" + url;
  },
};
