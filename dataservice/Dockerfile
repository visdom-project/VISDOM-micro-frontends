FROM docker.elastic.co/elasticsearch/elasticsearch:7.7.1
COPY ./elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
RUN mkdir /home/backup && chown -R elasticsearch:elasticsearch /home/backup
