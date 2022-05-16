# VISDOM-micro-frontends

<!-- no toc -->
- [Micro-frontends for course data](#micro-frontends-for-course-data)
    - [Available visualizations for course data](#available-visualizations-for-course-data)
    - [Local deployment of visualization services](#local-deployment-of-visualization-services)
    - [Deploying the data service in Docker-container](#deploying-the-data-service-in-docker-container)
- [Micro-frontends for Roadmapper data](#micro-frontends-for-roadmapper-data)
    - [Available visualizations for Roadmapper data](#available-visualizations-for-roadmapper-data)
    - [Deployment instructions](#deployment-instructions)

## Micro-frontends for course data

For visualizing exercise data originating from [A+ LMS](https://apluslms.github.io/) and [GitLab CMS](https://about.gitlab.com/).

### Available visualizations for course data

TODO: add descriptions for the visualizations

- [cumulativeview](./cumulativeview/)
- [ekgview](./ekgview/)
- [progrssview](./progressview/)
- [radarview](./radarview/)
- [rectanglemappingview](./rectanglemappingview/)
- [sprintcalendarview](./sprintcalendarview/)
- [statusview](./statusview/)
- [studentview](./studentview/)

Other service related to the visualizations:

- [controlform](./controlform/)
- [dataservice](./dataservice/)
- [initservice](./initservice/)

### Local deployment of visualization services

For each service (currently: statusview, progressview):

0. Go to service root folder, e.g. ```cd statusview/```
1. install dependencies, e.g. ```yarn install```
2. run the service by ```yarn start --https --port X```

### Deploying the data service in Docker-container

Get the anonymized data dump from the author and follow the instructions in ```dataservice/README.md```.

## Micro-frontends for Roadmapper data

For visualizing [VISDOM Roadmapper](https://github.com/Vincit/VISDOM-Roadmapper) data.

### Available visualizations for Roadmapper data

- [roadmapper-heatmap](./roadmapper-heatmap/): The Roadmapper tool's heatmap visualization.
- [roadmapper-planner](./roadmapper-planner/): The Roadmapper tool's planner visualization.

### Deployment instructions

See the instructions in the readme files of the corresponding folders.
