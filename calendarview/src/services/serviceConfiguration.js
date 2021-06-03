const elasticsearchHost = __ELASTICSEARCH_HOST__;

console.log("el url" ,elasticsearchHost)

export const ElasticSearchConfiguration = {
  host: elasticsearchHost,
  createUrl: function (url) {
    return elasticsearchHost + "/" + url;
  },
};