const elasticsearchHost = __ELASTICSEARCH_HOST__;

const ElasticSearchConfiguration = {
  host: elasticsearchHost,
  createUrl: function (url) {
    return elasticsearchHost + "/" + url;
  },
};

export default ElasticSearchConfiguration;
