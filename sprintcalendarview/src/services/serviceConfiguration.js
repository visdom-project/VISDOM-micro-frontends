/* eslint-disable no-undef */

const elasticsearchHost = __ELASTICSEARCH_HOST__;
const mqttHost = __MQTT_HOST__;

console.log("es url", elasticsearchHost);
console.log("mqtt url", mqttHost);

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