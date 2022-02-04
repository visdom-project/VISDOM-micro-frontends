/* eslint-disable no-undef */
//TODO: change this
const elasticsearchHost = __ADAPTER_HOST__;
const mqttHost = __MQTT_HOST__;
const configurationHost = __CONFIGURATION_HOST__;

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

export const configConfiguration = {
  host: configurationHost,
  createUrl: function (url) {
    return configurationHost + "/" + url;
  },
};