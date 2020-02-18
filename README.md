# SqlProxy Grafana Datasource

## Features

Connect and Query from any SQL Datasource (oracle, microsoft sql server, postgresql, mysql, snowflake, etc)

## How to install the plugin:

1. Install Grafana
2. Clone this repo to the grafana plugins folder (`git clone https://github.com/grafana/sqlproxy-grafana-datasource /var/lib/grafana/plugins/sqlproxy-grafana-datasource`)

## How to contribute

This plugin is using Typescript.  
All the code goes into the `src` folder, and we let `webpack` watch for changes and update the `dist` folder.

Grafana only reads the `dist` folder, and must be included with any release.

## Developing without docker

1. Install Grafana
2. `git clone https://github.com/scottlepp/grafana-sqlproxy-datasource`
3. `cd grafana-sqlproxy-datasource`
4. `yarn install --pure-lockfile`
5. `yarn watch` or `yarn dev`

## Developing with docker

1. `git clone https://github.com/grafana/grafana-sqlproxy-datasource`
2. `cd grafana-sqlproxy-datasource`
3. `` docker run -d -p 3000:3000 --name grafana -v `pwd`:/var/lib/grafana/plugins/grafana-sqlproxy-datasource/ grafana/grafana ``
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
      - ./dist:/var/lib/grafana/plugins/grafana-sqlproxy-datasource
      - ${GRAFANA_PROVISIONING:-./provisioning}:/etc/grafana/provisioning
      - ${HOME}:${HOME}
    environment:
      - TERM=linux
```
Note the following environment variables that can be used:
1. `GRAFANA_VERSION`: The grafana version you wish to use (default: latest)
2. `GRAFANA_PROVISIONING`: The directory pointing to provisioning files (default: `./provisioning`)
3. Your home directory will be mapped to home in the container

