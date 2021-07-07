# SqlProxy Grafana Datasource

![Diagram](https://github.com/scottlepp/grafana-sqlproxy-datasource/blob/master/SQLProxyPlugin.png)

## Features

Connect and Query from any SQL Datasource (oracle, microsoft sql server, postgresql, mysql, snowflake, etc)

## How to install the plugin:

1. Install Grafana
2. Clone this repo to the grafana plugins folder (`git clone https://github.com/grafana/sqlproxy-grafana-datasource /var/lib/grafana/plugins/sqlproxy-grafana-datasource`)
3. Build the plugin
```
yarn build-all
```
4. (Re)start Grafana

## SQL Proxy 

This datasource is dependent upon the SQL Proxy container. https://github.com/scottlepp/sql-proxy

For a quick local setup you can use Docker to run the container.  Once Docker is installed run the following to start the container:

```
docker run -p 8081:8081 scottlepper/sql-proxy
```

The proxy will now be running on port 8081.

Follow the instructions here to connect to the SQL Proxy:  https://github.com/scottlepp/sql-proxy#using-the-proxy

## Using the SqlProxy plugin

In the Grafana Datasource setup, set the URL to the proxy: http://localhost:8081

From the dashboard, add a panel and select SQL Proxy from the Query dropdown.  You will see a SQL Editor.

Enter your SQL and click away to run the SQL command and get results into the panel.

## Time macros

To reference the dashboard time frame, you can supply macros (variables) within your sql:

* $__timeFrom - the start time in milliseconds
* $__timeTo - the end time in milliseconds
* $__timeFrom(format) - the start time converted to a date string with the supplied format
* $__timeTo(format) - the end time converted to a date string with the supplied format

"format" example: 
* SELECT NAME FROM FOO where "TIME" > '$__timeFrom(yyyy-MM-dd hh:mm:ss)' and "TIME" < '$__timeTo(yyyy-MM-dd)'

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

