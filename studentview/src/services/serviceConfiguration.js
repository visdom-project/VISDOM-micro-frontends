/* eslint-disable no-undef */
/*
  TODO: This is hopefully a very temporary resolution to packaging issues.
  Please fix these packages ASAP.
*/
window.Buffer = window.Buffer || require("buffer/").Buffer;
window.process = window.process || require("process");

const elasticsearchHost = __ELASTICSEARCH_HOST__;
const mqttHost = __MQTT_HOST__;

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
