/* eslint-disable no-undef */
//TODO: change this
const elasticsearchHost = "https://elasticsearch.tlt-cityiot.rd.tuni.fi";
const mqttHost = "ws://130.230.52.141:8899";

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
