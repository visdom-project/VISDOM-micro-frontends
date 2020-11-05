# Deploying the data service in Docker-container

1. Run a container:

	```docker run -d -p 9200:9200 -p 9300:9300 -h elasticsearch --name elasticsearch -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.7.1```

2. Copy the [ES](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) configuration file into the container:

	```docker cp elasticsearch.yml elasticsearch:/usr/share/elasticsearch/config/elasticsearch.yml```

3. Copy the backcup directory into the container:

	```docker cp backup/ elasticsearch:/home/backup```

4. Edit owner of the backup file inside the container:

	```docker exec -it elasticsearch bash```
	
	```chown -R elasticsearch:elasticsearch /home/backup```

5. For the config to take effect, restart the container:

	```docker container restart elasticsearch```

6. Register a snapshot repository:

	```curl -X PUT "localhost:9200/_snapshot/my_backup?pretty" -H 'Content-Type: application/json' -d '{"type": "fs", "settings": {"location": "/home/backup"}}'```

7. Restore the data from the backup:

	```curl -X POST "localhost:9200/_snapshot/my_backup/snapshot_1/_restore?pretty"```

