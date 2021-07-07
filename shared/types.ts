import { DataQuery, DataSourceJsonData, DataSourceSettings } from '@grafana/data';

export interface SqlQuery extends DataQuery {
  sql: string;
}

export interface ProxySettings extends DataSourceSettings {
  host: string;
  backend?: boolean;
}

export interface Settings extends DataSourceJsonData {
  host: string;
  backend?: boolean;
}