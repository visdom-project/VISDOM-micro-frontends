// eslint-disable-next-line no-undef
const elasticsearchHost = __ELASTICSEARCH_HOST__;
// eslint-disable-next-line no-undef
const mqttHost = __MQTT_HOST__;

export const ElasticSearchConfiguration = {
    host: elasticsearchHost,
    createUrl: url => elasticsearchHost + "/" + url,
};

export const MQTTConfiguration = {
    host: mqttHost,
    createUrl: url => mqttHost + "/" + url,
};