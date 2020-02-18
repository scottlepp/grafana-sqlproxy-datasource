[![CircleCI](https://circleci.com/gh/grafana/dynatrace-datasource.svg?style=svg)](https://circleci.com/gh/grafana/dynatrace-datasource)

# Dynatrace Grafana Datasource

Datasource for https://www.dynatrace.com/

![](https://raw.githubusercontent.com/grafana/dynatrace-datasource/master/src/img/dashboard_sample1.png?token=ABVZ5UTQXH4TV7GEQZZM3S26IML4Y)

## Features

- V2 metrics api support
  - Support for synthetic tags
  - Support for monitoring VMWare esxi
- Performance improvements (subject to delay pending):
  - The amount of data requested
  - The bandwidth/latency of the internet/data connection
- Support for custom metrics
- Full templating support for metrics
- Full templating support for aliases
- Fully backwards compatible with previous dashboards
- Requires Grafana 6.5 and up. 

## How to install the plugin:

1. Install Grafana
2. Clone this repo to the grafana plugins folder (`git clone https://github.com/grafana/dynatrace-grafana-datasource /var/lib/grafana/plugins/dynatrace-grafana-datasource`)

## How to contribute

This plugin is using Typescript.  
All the code goes into the `src` folder, and we let `webpack` watch for changes and update the `dist` folder.

Grafana only reads the `dist` folder, and must be included with any release.

## Developing without docker

1. Install Grafana
2. `git clone https://github.com/grafana/dynatrace-grafana-datasource`
3. `cd dynatrace-grafana-datasource`
4. `yarn install --pure-lockfile`
5. `yarn watch` or `yarn dev`

## Developing with docker

1. `git clone https://github.com/grafana/dynatrace-grafana-datasource`
2. `cd dynatrace-grafana-datasource`
3. `` docker run -d -p 3000:3000 --name grafana -v `pwd`:/var/lib/grafana/plugins/dynatrace-grafana-datasource/ grafana/grafana ``
4. `yarn install --pure-lockfile`
5. `yarn watch`

## Using docker-compose

```
version: "3"
services:
  grafana:
    image: grafana/grafana:${GRAFANA_VERSION:-latest}
    ports:
      - "3000:3000"
    volumes:
      - ./dist:/var/lib/grafana/plugins/grafana-dynatrace-datasource
      - ${GRAFANA_PROVISIONING:-./provisioning}:/etc/grafana/provisioning
      - ${HOME}:${HOME}
    environment:
      - TERM=linux
```
Note the following environment variables that can be used:
1. `GRAFANA_VERSION`: The grafana version you wish to use (default: latest)
2. `GRAFANA_PROVISIONING`: The directory pointing to provisioning files (default: `./provisioning`)
3. Your home directory will be mapped to home in the container

## Rate Limiting

NOTE: Querying the API can result in failed queries.

```
Failed to load resource: the server responded with a status of 429 (Too Many Requests)
```
