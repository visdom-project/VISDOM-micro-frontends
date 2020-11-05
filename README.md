# VISDOM-micro-frontends

For visualizing exercise data originating from [A+ LMS](https://apluslms.github.io/) and [GitLab CMS](https://about.gitlab.com/).

## Local deployment of visualization services

For each service (currently: statusview, progressview):

0. Go to service root folder, e.g. ```cd statusview/```
1. install dependencies, e.g. ```yarn install```
2. run the service by ```yarn start --https --port X```

## Deploying the data service in Docker-container

Get the anonymized data dump from the author and follow the instructions in ```dataservice/README.md```.
