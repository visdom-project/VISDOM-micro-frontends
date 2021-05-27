/* eslint-disable no-undef */
// TODO: solve this - undefined ?
// const elasticsearchHost = __ELASTICSEARCH_HOST__;
// const mqttHost = __MQTT_HOST__;
const elasticsearchHost = "https://elasticsearch.tlt-cityiot.rd.tuni.fi";
const mqttHost = "ws://127.0.0.1:9001";

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
